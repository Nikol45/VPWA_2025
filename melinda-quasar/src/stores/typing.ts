import { defineStore } from 'pinia'

interface TypingWsPayload {
    channelId: number
    userId: number
    nickname: string
    text: string
}

interface TypingUser {
    userId: number
    nickname: string
    text: string
    lastUpdated: number
}

export const useTypingWsStore = defineStore('typing-ws', {
    state: () => ({
        statesByChannel: {} as Record<number, TypingUser[]>
    }),

    actions: {
        handleTypingState(payload: TypingWsPayload) {
            const channelId = payload.channelId || null
            if (!channelId) return


            if (!this.statesByChannel[channelId]) {
                this.statesByChannel[channelId] = []
            }

            const channelUsers = this.statesByChannel[channelId]
            const existingUser = channelUsers.find((s) => s.userId === payload.userId)

            if (!payload.text || payload.text.trim() === '') {
                if (existingUser) {
                    this.statesByChannel[channelId] = channelUsers.filter((s) => s.userId !== payload.userId)
                }
                return
            }

            if (existingUser) {
                existingUser.text = payload.text
                existingUser.lastUpdated = Date.now()
            } else {
                channelUsers.push({
                    userId: payload.userId,
                    nickname: payload.nickname,
                    text: payload.text,
                    lastUpdated: Date.now()
                })
            }
        },

        clearChannel(channelId: number) {
            this.statesByChannel[channelId] = []
        },

        pruneStaleUsers() {
            const now = Date.now()
            const threshold = 15000

            for (const key in this.statesByChannel) {
                const channelId = Number(key)
                const users = this.statesByChannel[channelId]

                if (users) {
                    this.statesByChannel[channelId] = users.filter((user) => {
                        return (now - user.lastUpdated) < threshold
                    })
                }
            }
        }
    }
})
