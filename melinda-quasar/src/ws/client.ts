import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { useMessageWsStore } from 'src/stores/messages'
import { useTypingWsStore } from 'src/stores/typing'
import { usePresenceWsStore } from 'src/stores/presence'
import { useChannelsStore } from 'src/stores/channels'
import { authManager } from 'src/services'
import { Notify } from 'quasar'

interface MemberCountPayload {
  channelId: number
  count: number
}

interface DeletedPayload {
  channelId: number
  channelName: string
}

class WsClient {
  private socket: Socket | null = null
  private connected = false

  connect() {
    if (this.socket && this.connected) {
       this.disconnect()
    }
    
    this.socket = io(import.meta.env.VITE_API_WS_URL, {
      path: "/socket.io/",
      reconnectionAttempts: 5,
      auth: { 
        token: authManager.getToken() 
      }
    })


    this.socket.on('connect', () => {
      this.connected = true
    })

     this.socket.on('connect_error', (err) => {
      console.error("WS: connect error:", err)
    })

    this.socket.on('disconnect', (reason) => {
      this.connected = false
      console.warn("WS: disconnected:", reason)
    })

    this.registerEvents()
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect()
        this.socket = null
        this.connected = false
    }
  }

  private registerEvents() {
    if (!this.socket) return

    const messageStore = useMessageWsStore()
    const typingStore = useTypingWsStore()
    const presenceStore = usePresenceWsStore()
    const channelsStore = useChannelsStore()

    this.socket.on('message:new', (msg) => {
      messageStore.handleNewMessage(msg)
    })

    this.socket.on('typing:state', (payload) => {
      typingStore.handleTypingState(payload)
    })

    this.socket.on('channel:user_joined', (payload) => {
      presenceStore.handleUserJoined(payload)
    })

    this.socket.on('channel:user_left', (payload) => {
      presenceStore.handleUserLeft(payload)
    })

    this.socket.on('presence:update', (payload) => {
      presenceStore.handlePresenceUpdate(payload)
    })

    this.socket.on('channel:kick', (payload: { channelId: number, channelName: string }) => {
       channelsStore.REMOVE_CHANNEL(payload.channelId)
       Notify.create({
         type: 'negative',
         message: `You have been kicked from ${payload.channelName}.`,
         position: 'bottom-right'
       })
    })

    this.socket.on('channel:invite', (payload: { channelId: number, channelName: string }) => {
       void channelsStore.fetchChannels()
       Notify.create({
         type: 'info',
         message: `You have been invited to ${payload.channelName}`,
         position: 'bottom-right'
       })
    })

    this.socket.on('channel:deleted', (payload: DeletedPayload) => {
      const channelsStore = useChannelsStore()
       channelsStore.REMOVE_CHANNEL(payload.channelId)
       Notify.create({
         type: 'warning',
         message: `Channel "${payload.channelName}" has been closed by the admin.`,
         position: 'bottom-right'
       })
    })

    this.socket.on('channel:update_member_count', (payload: MemberCountPayload) => {
      const channelsStore = useChannelsStore() 
      channelsStore.UPDATE_MEMBER_COUNT(payload.channelId, payload.count)
    })
  }

  joinChannel(channelId: number) {
    this.socket?.emit('channel:join', { channelId })
  }

  leaveChannel(channelId: number) {
    this.socket?.emit('channel:leave', { channelId })
  }

  sendMessage(channelId: number, text: string) {
    this.socket?.emit('message:create', { channelId, text })
  }

  sendTyping(channelId: number, isTyping: boolean, text: string) {
    this.socket?.emit('typing:update', { channelId, isTyping, text })
  }
}

export const wsClient = new WsClient()
