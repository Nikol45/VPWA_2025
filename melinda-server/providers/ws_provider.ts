import type { ApplicationService } from '@adonisjs/core/types'
import { Server, Socket } from 'socket.io'
import httpServer from '@adonisjs/core/services/server'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import Message from '#models/message'
import CleanupService from '#services/cleanup_service'
import Notification from '#models/notification'
import Channel from '#models/channel'
import { DateTime } from 'luxon'

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

    private async createNotifications(
        channel: Channel,
        sender: User,
        mentionedUserIds: number[]
    ) {
        const members = await channel.related('members').query()
        const mentionedIds = new Set<number>(mentionedUserIds || [])

        for (const member of members) {
            if (member.id === sender.id) continue
            if (member.notificationSetting === 'mute_all') continue
            if (member.status === 'dnd') continue

            if (!mentionedIds.has(member.id)) continue

            const notif = await Notification.create({
                userId: member.id,
                channelId: channel.id,
                senderId: sender.id,
                type: 'mention',
                isRead: false,
            })

            await notif.load('sender')
            await notif.load('channel')

            this.io?.to(`user:${member.id}`).emit('notification:new', notif.serialize())
        }
    }

    async ready() {
        const nodeServer = httpServer.getNodeServer()
        if (!nodeServer) return

        this.io = new Server(nodeServer, {
            path: '/socket.io/',
            cors: {
                origin: ['http://localhost:9000', 'http://127.0.0.1:9000'],
                methods: ['GET', 'POST'],
                credentials: true,
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

        this.io.on('connection', async (socket: Socket) => {
            const user = socket.data.user as User

            socket.join(`user:${user.id}`)
            const userChannels = await user.related('channels').query()
            userChannels.forEach((channel) => {
                socket.join(`channel:${channel.id}`)
            })

            socket.on('channel:join', ({ channelId }) => {
                socket.join(`channel:${channelId}`)
            })

            socket.on('channel:leave', ({ channelId }) => {
                socket.leave(`channel:${channelId}`)
            })

            socket.on('message:create', async (payload) => {
                try {

                    if (
                        !payload ||
                        typeof payload.channelId !== 'number' ||
                        typeof payload.text !== 'string' ||
                        !payload.text.trim()
                    ) {
                        console.error('Invalid payload for message:create', payload)
                        return
                    }

                    const channel = await Channel.find(payload.channelId)
                    if (!channel) {
                        console.error('Channel not found for message:create', payload.channelId)
                        return
                    }


                    const isMember = await channel
                        .related('members')
                        .query()
                        .where('users.id', user.id)
                        .first()

                    if (!isMember) {
                        console.error('User is not a member of this channel', {
                            userId: user.id,
                            channelId: channel.id,
                        })
                        return
                    }


                    const banned = await channel
                        .related('blacklist')
                        .query()
                        .where('users.id', user.id)
                        .first()

                    if (banned) {
                        console.error('User is banned from this channel', {
                            userId: user.id,
                            channelId: channel.id,
                        })
                        return
                    }


                    const nicknamesRaw = this.extractMentions(payload.text)
                    let mentionIds: number[] = []

                    if (nicknamesRaw.length > 0) {
                        const users = await User.query().whereIn('nickname', nicknamesRaw)
                        mentionIds = users.map((u) => u.id)
                    }


                    const message = await Message.create({
                        text: payload.text,
                        channelId: channel.id,
                        userId: user.id,
                        mentions: mentionIds,
                    })

                    channel.lastMessageAt = DateTime.now()
                    await channel.save()

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
                            status: user.status || 'online',
                        },
                        author: {
                            id: user.id,
                            nickname: user.nickname,
                            avatarUrl: user.avatarUrl || 'https://cdn.quasar.dev/img/boy-avatar.png',
                        },
                    }

                    this.io?.to(`channel:${channel.id}`).emit('message:new', broadcastMessage)

                    try {
                        if (mentionIds.length > 0) {
                            await this.createNotifications(channel, user, mentionIds)
                        }
                    } catch (error) {
                        console.error('WS notification failed (ignored to keep chat alive):', error)
                    }
                } catch (error) {
                    console.error('Error saving message:', error)
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
