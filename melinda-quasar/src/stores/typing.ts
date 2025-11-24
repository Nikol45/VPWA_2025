import { defineStore } from 'pinia'

interface TypingWsPayload {
  channelId: number
  userId: number
  nickname: string
  text: string
}

export const useTypingWsStore = defineStore('typing-ws', {
  state: () => ({
    statesByChannel: {} as Record<number, { userId: number; nickname: string; text: string }[]>
  }),

  actions: {
    handleTypingState(payload: TypingWsPayload) {
      const channelId = payload.channelId || null
      if (!channelId) return

      if (!this.statesByChannel[channelId]) {
        this.statesByChannel[channelId] = []
      }

      const arr = this.statesByChannel[channelId]
      const existing = arr.find((s) => s.userId === payload.userId)

      if (payload.text === '') {
        if (existing) {
          this.statesByChannel[channelId] = arr.filter((s) => s.userId !== payload.userId)
        }
        return
      }

      if (existing) {
        existing.text = payload.text
      } else {
        arr.push({
          userId: payload.userId,
          nickname: payload.nickname,
          text: payload.text
        })
      }
    },

    clearChannel(channelId: number) {
      this.statesByChannel[channelId] = []
    }
  }
})
