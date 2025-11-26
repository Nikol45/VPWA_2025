<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';

interface ChatMessage {
  channelId: number
  userId: number
  text: string
  mentions: number[]
  author: {
    nickname: string
    avatarUrl: string
  }
}

const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  document.documentElement.setAttribute('theme', savedTheme)
}

export default defineComponent({
  name: 'App',
  
  setup() {
    const $q = useQuasar()
    const authStore = useAuthStore()

    const handleNewMessage = (event: Event) => {
        if ($q.appVisible) return 

        const customEvent = event as CustomEvent
        const msg = customEvent.detail as ChatMessage
        const user = authStore.user

        if (!user) return
        if (msg.userId === user.id) return

        const settings = user.notificationSetting || 'show_all'

        if (settings === 'mute_all') return

        const isMentioned = msg.mentions && msg.mentions.includes(user.id)
        if (settings === 'mentions_only' && !isMentioned) return

        showSystemNotification(msg)
    }

    const showSystemNotification = (msg: ChatMessage) => {
        if (!('Notification' in window)) return
        if (Notification.permission !== 'granted') return

        const title = msg.author?.nickname || 'New Message'
        const body = msg.text
        const icon = msg.author?.avatarUrl || '/avatars/users/default.png'

        const notif = new Notification(title, {
            body,
            icon,
            tag: `channel:${msg.channelId}`,
            silent: false,
            renotify: true
        } as NotificationOptions & { renotify?: boolean })
        
        notif.onclick = () => {
            window.focus()
            notif.close()
        }
    }

    onMounted(() => {
       if ('Notification' in window && Notification.permission === 'default') {
          void Notification.requestPermission()
       }
       window.addEventListener('chat:message', handleNewMessage)
    })

    onUnmounted(() => {
       window.removeEventListener('chat:message', handleNewMessage)
    })
  }
});
</script>