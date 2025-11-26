import type { ApplicationService } from '@adonisjs/core/types'
import { Server, Socket } from 'socket.io'
import httpServer from '@adonisjs/core/services/server'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import Message from '#models/message'
import CleanupService from '#services/cleanup_service'
import Notification from '#models/notification'
import Channel from '#models/channel'

export default class WsProvider {
  public static needsApplication = true
  private io: Server | null = null

  constructor(private app: ApplicationService) {}

  register() {
    this.app.container.singleton('ws', () => {
      if (!this.io) {
        return new Server()
      }
      return this.io
    })
  }

  async boot() {}
  async start() {}

  private extractMentions(text: string): string[] {
    const regex = /@([A-Za-z0-9_]+)/g
    const nicknames = new Set<string>()
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
      nicknames.add(match[1])
    }

    return Array.from(nicknames)
  }

  async ready() {
    const nodeServer = httpServer.getNodeServer()
    if (!nodeServer) return

    this.io = new Server(nodeServer, {
      path: "/socket.io/",
      cors: {
        origin: ["http://localhost:9000", "http://127.0.0.1:9000"],
        methods: ["GET", "POST"],
        credentials: true
      },
    })

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        
        if (!token || typeof token !== 'string' || !token.startsWith('oat_')) {
             return next(new Error('Invalid token format'))
        }

        const [header] = token.split('.')
        const tokenIdRaw = header.replace('oat_', '')
        const tokenId = Buffer.from(tokenIdRaw, 'base64').toString('utf-8')

        const tokenRecord = await db
          .from('auth_access_tokens')
          .where('id', tokenId)
          .first()

        if (!tokenRecord) {
            return next(new Error('Invalid token'))
        }

        const user = await User.find(tokenRecord.tokenable_id)
        
        if (!user) {
            return next(new Error('User not found'))
        }

        socket.data.user = user
        next()

      } catch (error) {
        console.error('WS Auth Error:', error)
        next(new Error('Authentication failed'))
      }
    })

    CleanupService.start()

    this.io.on("connection", async (socket: Socket) => {
      const user = socket.data.user as User

      socket.join(`user:${user.id}`)
      const userChannels = await user.related('channels').query()
      userChannels.forEach(channel => {
          socket.join(`channel:${channel.id}`)
      })


      socket.on('channel:join', ({ channelId }) => {
        const roomName = `channel:${channelId}`
        socket.join(roomName)
      })

      socket.on('channel:leave', ({ channelId }) => {
        const roomName = `channel:${channelId}`
        socket.leave(roomName)
      })

      socket.on('message:create', async (payload) => {
        try {

            const nicknamesRaw = this.extractMentions(payload.text)
            let mentionIds: number[] = []

            if (nicknamesRaw.length > 0) {
                const users = await User.query().whereIn('nickname', nicknamesRaw)
                mentionIds = users.map(u => u.id)
            }

            const message = await Message.create({
                text: payload.text,
                channelId: payload.channelId,
                userId: user.id,
                mentions: mentionIds
            })

            if (mentionIds.length > 0) {
                const channel = await Channel.find(payload.channelId)
                if (channel) {
                    const notifications = mentionIds
                        .filter(id => id !== user.id)
                        .map(targetId => ({
                            userId: targetId,
                            senderType: 'user' as const,
                            senderId: user.id,
                            isRead: false,
                            text: `Mentioned you in ${channel.name}: ${message.text.substring(0, 50)}...`
                        }))
                    
                    if (notifications.length > 0) {
                         await Notification.createMany(notifications)
                    }
                }
            }

            const broadcastMessage = {
                id: message.id,
                text: message.text,
                channelId: message.channelId,
                userId: message.userId,
                createdAt: message.createdAt.toISO(),
                mentions: mentionIds,
                
                user: {
                    id: user.id,
                    nickname: user.nickname,
                    avatarUrl: user.avatarUrl || 'https://cdn.quasar.dev/img/boy-avatar.png',
                    status: user.status || 'online'
                },
                author: {
                    id: user.id,
                    nickname: user.nickname,
                    avatarUrl: user.avatarUrl || 'https://cdn.quasar.dev/img/boy-avatar.png'
                }
            }

            this.io?.to(`channel:${payload.channelId}`).emit('message:new', broadcastMessage)

        } catch (error) {
            console.error("Error saving message:", error)
        }
      })
    })

  }

  async shutdown() {
    if (this.io) {
      await this.io.close()
    }
  }
}