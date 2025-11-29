import { defineStore } from 'pinia'
import { notificationService } from 'src/services'
import type { Notification } from 'src/contracts'

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        items: [] as Notification[]
    }),

    getters: {
        unreadCount: (state) => state.items.filter(n => !n.isRead).length
    },

    actions: {
        async fetchNotifications() {
            try {
                const data = await notificationService.list()
                this.items = data
            } catch (err) {
                console.error('Failed to load notifications', err)
            }
        },

        addNotification(notification: Notification) {

            this.items.unshift(notification)
        }
    }
})
