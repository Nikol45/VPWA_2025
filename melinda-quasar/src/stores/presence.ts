import { defineStore } from 'pinia'

interface PresenceUpdatePayload {
    userId: number
    status: 'online' | 'offline' | 'dnd'
}

interface UserJoinedPayload {
    user: {
        id: number
        status: 'online' | 'offline' | 'dnd'
    }
}

interface UserLeftPayload {
    userId: number
}

export const usePresenceWsStore = defineStore('presence-ws', {
    state: () => ({

        statuses: {} as Record<number, 'online' | 'offline' | 'dnd'>
    }),

    actions: {
        handlePresenceUpdate(payload: PresenceUpdatePayload) {
            this.statuses[payload.userId] = payload.status
        },

        handleUserJoined(payload: UserJoinedPayload) {
            this.statuses[payload.user.id] = payload.user.status
        },

        handleUserLeft(payload: UserLeftPayload) {
            this.statuses[payload.userId] = 'offline'
        },

        getStatus(userId: number) {
            return this.statuses[userId] || 'offline'
        }
    }
})
