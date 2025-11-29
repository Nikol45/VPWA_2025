import { io, type Socket } from 'socket.io-client'
import { useMessageWsStore } from 'src/stores/messages'
import { useTypingWsStore } from 'src/stores/typing'
import { usePresenceWsStore } from 'src/stores/presence'
import { useChannelsStore } from 'src/stores/channels'
import { useNotificationsStore } from 'src/stores/notifications'
import { authManager } from 'src/services'
import { Notify } from 'quasar'
import type { Message, Notification as ApiNotification } from 'src/contracts'

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

    public connect(userId?: number) {

        if (this.socket && this.connected) {
            return
        }

        if (this.socket) {
            this.disconnect()
        }

        const token = authManager.getToken()
        if (!token) {
            console.warn('WS: No token found, skipping connection')
            return
        }

        this.socket = io(import.meta.env.VITE_API_WS_URL, {
            path: '/socket.io/',
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling'],
            auth: {
                token,
                userId,
            },
        })

        this.socket.on('connect', () => {
            this.connected = true
            console.log('WS: Connected')
        })

        this.socket.on('connect_error', (err) => {
            console.error('WS: connect error:', err)
        })

        this.socket.on('disconnect', (reason) => {
            this.connected = false
            console.warn('WS: disconnected:', reason)
        })

        this.registerEvents()
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.connected = false
        }
    }


    public on<T = unknown>(event: string, callback: (...args: T[]) => void) {
        if (!this.socket) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.socket.on(event, callback as any)
    }

    public off(event: string) {
        if (!this.socket) return
        this.socket.off(event)
    }

    private registerEvents() {
        if (!this.socket) return

        const messageStore = useMessageWsStore()
        const typingStore = useTypingWsStore()
        const presenceStore = usePresenceWsStore()
        const channelsStore = useChannelsStore()
        const notificationsStore = useNotificationsStore()


        this.socket.on('message:new', (msg: Message) => {
            messageStore.handleNewMessage(msg)

            // Optional DOM event for any ad-hoc listeners
            window.dispatchEvent(new CustomEvent('chat:message', { detail: msg }))
        })

        // 2. Notifications
        this.socket.on('notification:new', (notification: ApiNotification) => {
            notificationsStore.addNotification(notification)

            // Build a toast message based on notification type & relations
            let toastText = 'New notification'

            if (notification.type === 'mention') {
                const senderName = notification.sender?.nickname ?? 'Someone'
                const channelName = notification.channel?.name ?? 'a channel'
                toastText = `${senderName} mentioned you in ${channelName}`
            }

            Notify.create({
                message: toastText,
                position: 'top-right',
                timeout: 3000,
                color: 'primary',
                icon: 'notifications',
                classes: 'notification-toast',
            })
        })

        // 3. Typing Indicators
        this.socket.on('typing:state', (payload) => {
            typingStore.handleTypingState(payload)
        })

        // 4. Presence
        this.socket.on('channel:user_joined', (payload) => {
            presenceStore.handleUserJoined(payload)
        })

        this.socket.on('channel:user_left', (payload) => {
            presenceStore.handleUserLeft(payload)
        })

        this.socket.on('presence:update', (payload) => {
            presenceStore.handlePresenceUpdate(payload)
        })

        // 5. Channel Management Events
        this.socket.on('channel:kick', (payload: { channelId: number; channelName: string }) => {
            channelsStore.REMOVE_CHANNEL(payload.channelId)
            Notify.create({
                type: 'negative',
                message: `You have been kicked from ${payload.channelName}.`,
                position: 'bottom-right',
            })
        })

        this.socket.on('channel:invite', (payload: { channelId: number; channelName: string }) => {
            void channelsStore.fetchChannels()
            Notify.create({
                type: 'info',
                message: `You have been invited to ${payload.channelName}`,
                position: 'bottom-right',
            })
        })

        this.socket.on('channel:deleted', (payload: DeletedPayload) => {
            channelsStore.REMOVE_CHANNEL(payload.channelId)
            Notify.create({
                type: 'warning',
                message: `Channel "${payload.channelName}" has been closed by the admin.`,
                position: 'bottom-right',
            })
        })

        this.socket.on('channel:update_member_count', (payload: MemberCountPayload) => {
            channelsStore.UPDATE_MEMBER_COUNT(payload.channelId, payload.count)
        })
    }

    // --- Emitters ---

    public joinChannel(channelId: number) {
        if (!this.connected) return
        this.socket?.emit('channel:join', { channelId })
    }

    public leaveChannel(channelId: number) {
        if (!this.connected) return
        this.socket?.emit('channel:leave', { channelId })
    }

    public sendMessage(channelId: number, text: string) {
        if (!this.connected) {
            Notify.create({ type: 'negative', message: 'No connection to server' })
            return
        }
        this.socket?.emit('message:create', { channelId, text })
    }

    public sendTyping(channelId: number, isTyping: boolean, text: string) {
        if (!this.connected) return
        this.socket?.emit('typing:update', { channelId, isTyping, text })
    }
}

export const wsClient = new WsClient()
