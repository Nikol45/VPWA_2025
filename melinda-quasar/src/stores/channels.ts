import { defineStore } from 'pinia'
import type { Channel, ChannelVisibility } from 'src/contracts'
import { channelService } from 'src/services'

interface ChannelError {
  message: string
}

interface CreateChannelPayload {
  name: string
  visibility: ChannelVisibility
  icon?: File | null
}

export const useChannelsStore = defineStore('channels', {
  state: () => ({
    items: [] as Channel[],
    status: 'success' as 'pending' | 'success' | 'error',
    errors: [] as ChannelError[],
  }),

  getters: {
    sortedChannels(state): Channel[] {
      const sorted = [...state.items]

      sorted.sort((a, b) => {
        if (a.isInvited && !b.isInvited) return -1
        if (!a.isInvited && b.isInvited) return 1

        const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
        const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0

        if (aTime !== bTime) {
            return bTime - aTime
        }

        return a.name.localeCompare(b.name)
      })

      return sorted
    },
  },

  actions: {
    SET_STATUS(status: 'pending' | 'success' | 'error') {
      this.status = status
    },

    SET_ERRORS(errors: ChannelError[]) {
      this.errors = errors
    },

    SET_ITEMS(items: Channel[]) {
      this.items = items
    },

    UPDATE_MEMBER_COUNT(id: number, count: number) {
      const c = this.items.find((ch) => ch.id === id)
      if (c) {
        c.nMembers = count
      }
    },

    UPSERT_CHANNEL(channel: Channel) {
      const index = this.items.findIndex((c) => c.id === channel.id)

      if (index === -1) {
        this.items.push(channel)
      } else {
        this.items.splice(index, 1, channel)
      }
    },

    REMOVE_CHANNEL(id: number) {
      this.items = this.items.filter((c) => c.id !== id)
    },

    UPDATE_LAST_MESSAGE_AT(id: number, timestamp: string) {
      const c = this.items.find((ch) => ch.id === id)
      if (c) c.lastMessageAt = timestamp
    },

    acceptInvite(id: number) {
      const channel = this.items.find((c) => c.id === id)
      if (!channel) return

      channel.isInvited = false
      channel.isMember = true
    },

    async declineInvite(id: number) {
      try {
        await channelService.decline(id)
        
        this.REMOVE_CHANNEL(id)
      } catch (error) {
        console.error('Failed to decline invite:', error)
      }
    },

    async fetchChannels() {
      try {
        this.SET_STATUS('pending')
        this.SET_ERRORS([])

        const channels = await channelService.list()
        this.SET_ITEMS(channels)

        this.SET_STATUS('success')
      } catch (error) {
        this.SET_STATUS('error')
        this.SET_ERRORS([{ message: String(error) }])
      }
    },

    async createChannel(payload: CreateChannelPayload) {
      try {
        this.SET_STATUS('pending')
        this.SET_ERRORS([])
        const channel = await channelService.create(payload)
        
        this.UPSERT_CHANNEL(channel)
        this.SET_STATUS('success')
        return channel
      } catch (error) {
        this.SET_STATUS('error')
        this.SET_ERRORS([{ message: String(error) }])
        throw error
      }
    },

    async leaveChannel(id: number) {
        try {
            await channelService.leave(id)
            this.REMOVE_CHANNEL(id)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    },

    async deleteChannel(id: number) {
      try {
        this.SET_STATUS('pending')
        this.SET_ERRORS([])

        await channelService.destroy(id)
        this.REMOVE_CHANNEL(id)

        this.SET_STATUS('success')
      } catch (error) {
        this.SET_STATUS('error')
        this.SET_ERRORS([{ message: String(error) }])
        throw error
      }
    },

    handleKicked(channelId: number) {
        this.REMOVE_CHANNEL(channelId)
    }
  },
})
