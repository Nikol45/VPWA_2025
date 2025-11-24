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
    presentUsers: {} as Record<number, 'online' | 'offline' | 'dnd'>
  }),

  actions: {
    handlePresenceUpdate(payload: PresenceUpdatePayload) {
      this.presentUsers[payload.userId] = payload.status
    },

    handleUserJoined(payload: UserJoinedPayload) {
      this.presentUsers[payload.user.id] = payload.user.status
    },

    handleUserLeft(payload: UserLeftPayload) {
      this.presentUsers[payload.userId] = 'offline'
    },

    getStatus(userId: number) {
      return this.presentUsers[userId] || 'offline'
    }
  }
})
