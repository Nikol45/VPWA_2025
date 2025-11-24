import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { useMessageWsStore } from 'src/stores/messages'
import { useTypingWsStore } from 'src/stores/typing'
import { usePresenceWsStore } from 'src/stores/presence'
import { authManager } from 'src/services'


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
