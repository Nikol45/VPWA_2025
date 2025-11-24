import { defineStore } from 'pinia'
import type { Message } from 'src/contracts'
import { useChannelsStore } from 'src/stores/channels'

export const useMessageWsStore = defineStore('message-ws', {
  state: () => ({
    messagesByChannel: {} as Record<number, Message[]>
  }),

  actions: {
    handleNewMessage(msg: Message) {
      const id = msg.channelId
      const channels = useChannelsStore()
      if (!this.messagesByChannel[id]) {
        this.messagesByChannel[id] = []
      }
      this.messagesByChannel[id].push(msg)
      channels.UPDATE_LAST_MESSAGE_AT(msg.channelId, msg.createdAt)
    },

    getMessages(channelId: number): Message[] {
      return this.messagesByChannel[channelId] || []
    },

    clearChannel(channelId: number) {
      this.messagesByChannel[channelId] = []
    }
  }
})
