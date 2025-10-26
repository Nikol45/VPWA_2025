<template>
  <q-page class="c-1 q-px-sm column">
    <q-scroll-area ref="scrollArea"
                   style="height: calc(100vh - 108px);"
                   class="no-scrollbar q-px-md q-pb-md q-gutter-md"
    >
      <q-infinite-scroll reverse @load="onInfiniteLoad" >
        <div v-for="m in messages" :key="m.id" class="row">
          <message-bubble :message="m" :user="usersById[m.userId]" :is-mine="m.userId === meId" :class="{ mention: isMention(m.text) }"/>
        </div>

        <div v-if="typingBarText"
             class="typing-bar text-caption c-1"
             @click="openTypingPreview">
          {{ typingBarText }}
        </div>

        <template #loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots size="24px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-scroll-area>

    <typing-popup
      v-model="showTyping"
      :name="typingAuthorName"
      :typing-text="activeTypingText"
      @back="onTypingBack"
    />

    <typing-select-popup
      v-model="showTypingSelect"
      :options="typingSelectOptions"
      @select="onTypingSelect"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, watch, nextTick } from 'vue'
import { type QScrollArea, useQuasar } from 'quasar'
import MessageBubble from 'src/components/MessageBubble.vue'
import TypingPopup from 'src/components/popups/TypingPopup.vue'
import TypingSelectPopup from 'src/components/popups/TypingSelectPopup.vue'

interface Message {
  id: string
  channelId: string
  userId: string
  text: string
  time: string
}

interface User {
  id: string
  name: string
  avatar: string
  status: string
}

interface TypingOption {
  id: string
  label: string
  avatar?: string
}

export default defineComponent({
  name: 'ChannelChat',
  components: { MessageBubble, TypingPopup, TypingSelectPopup },

  setup() {
    const $q = useQuasar()

    if ('Notification' in window && Notification.permission === 'denied') {
      void Notification.requestPermission()
    }

    const showSystemNotification = () => {
      if (!('Notification' in window)) {
        console.warn('Browser does not support system notifications.')
        return
      }

      if (Notification.permission === 'granted') {
        new Notification('Nikol', {
          body: 'Ste niekto na fakulte?',
          icon: '/avatars/users/nikol.png',
          badge: '/avatars/users/nikol.png',
        })
      }
    }

    watch(
      () => $q.appVisible,
      (val) => {
        if (val === false) {
          showSystemNotification()
        }
      }
    )

    return { showSystemNotification }
  },

  data() {
    return {
      meId: 'u-me',

      usersById: {
        'u-nikol': { id: 'u-nikol', name: 'Nikol',  avatar: '/avatars/users/nikol.png', status: 'online' },
        'u-simca': { id: 'u-simca', name: 'Simča',  avatar: '/avatars/users/simca.png', status: 'dnd' },
        'u-me':    { id: 'u-me',    name: 'Firefly',     avatar: '/avatars/users/firefly.jpg', status: 'online' }
      } as Record<string, User>,

      messages: [
        { id: 'm-13', channelId: 'ch-1', userId: 'u-nikol', text: 'BFFR', time: 'štvrtok 22:03' },
        { id: 'm-12', channelId: 'ch-1', userId: 'u-simca', text: 'Ta pome spinkať 💤', time: 'štvrtok 22:04' },
        { id: 'm-11', channelId: 'ch-1', userId: 'u-simca', text: 'Good nighty 🌃', time: 'štvrtok 22:04' },
        { id: 'm-10', channelId: 'ch-1', userId: 'u-me', text: 'bruuu noc prajem ženy 💫💎', time: 'štvrtok 22:05' },
        { id: 'm-09', channelId: 'ch-1', userId: 'u-simca', text: 'Môže byť? @Firefly', time: 'piatok 09:31' },
        { id: 'm-08', channelId: 'ch-1', userId: 'u-simca', text: 'poslala obrázok 🖼️', time: 'piatok 09:31' },
        { id: 'm-07', channelId: 'ch-1', userId: 'u-simca', text: 'Nie je to too much?', time: 'piatok 09:32' },
        { id: 'm-06', channelId: 'ch-1', userId: 'u-nikol', text: 'moze byyyt 😍', time: 'piatok 09:33' },
        { id: 'm-05', channelId: 'ch-1', userId: 'u-simca', text: "It's out 😌", time: 'piatok 09:35' },
        { id: 'm-04', channelId: 'ch-1', userId: 'u-nikol', text: 'aaa vyzerá to perfektne 🔥', time: 'piatok 09:36' },
        { id: 'm-03', channelId: 'ch-1', userId: 'u-simca', text: 'yayy konečne hotovo 😮‍💨', time: 'piatok 09:36' },
        { id: 'm-02', channelId: 'ch-1', userId: 'u-nikol', text: 'daj potom aj na story nech vidia 😎', time: 'piatok 09:37' },
        { id: 'm-01', channelId: 'ch-1', userId: 'u-simca', text: 'maybeee 😏', time: 'piatok 09:38' },

        { id: 'm1', channelId: 'ch-1', userId: 'u-nikol', text: 'ngl hento sa mi paci farebne', time: 'piatok 14:53' },
        { id: 'm2', channelId: 'ch-1', userId: 'u-me',    text: 'tomu ver',                      time: '10:59' },
        { id: 'm3', channelId: 'ch-1', userId: 'u-nikol', text: 'idem si spravit nechty nejake pekne jesenne muhehehe', time: '10:59' },
        { id: 'm4', channelId: 'ch-1', userId: 'u-simca', text: 'uuu potom pošli 💅💅',          time: '11:01' },
        { id: 'm5', channelId: 'ch-1', userId: 'u-me',    text: '💅',                            time: '11:02' },
        { id: 'm6', channelId: 'ch-1', userId: 'u-nikol', text: '💅',                            time: '11:05' },
        { id: 'm7', channelId: 'ch-1', userId: 'u-me',    text: '💅',                            time: '11:07' }
      ] as Message[],

      typingUserIds: [] as string[],

      showTyping: false,

      typingAuthorId: 'u-nikol',

      typingByUser: {
        'u-nikol':
          'Ináč rn som si všimla, že ani dis nemá dobre spravené tie guličky statusu, ten outline neni vy',

        'u-simca':
          'podľa mňa by sme to mali'
      } as Record<string, string>,

      showTypingSelect: false,
      typingSelectOptions: [] as TypingOption[],

      loadTimer: null as number | null
    }
  },

  computed: {
    typingBarText(): string | null {
      if (this.typingUserIds.length === 0) return null
      const names = this.typingUserIds.map(id => this.usersById[id]?.name).filter(Boolean) as string[]
      if (names.length === 0) return null
      const verb = names.length > 1 ? 'píšu…' : 'píše…'
      return `${names.join(', ')} ${verb}`
    },
    typingAuthorName(): string {
      return this.usersById[this.typingAuthorId]?.name ?? 'User'
    },
    activeTypingText(): string {
      return this.typingByUser[this.typingAuthorId] ?? ''
    }
  },

  mounted() {
    this.startTyping('u-nikol')
    this.startTyping('u-simca')
    void nextTick(() => this.scrollToBottom())
  },

  methods: {
    onTypingBack(){
      this.showTyping = false
      this.showTypingSelect = true
    },

    openTypingPreview() {
      const ids = this.typingUserIds.filter(id => this.usersById[id])
      const first = ids[0] ?? null

      if (ids.length <= 1) {
        if (first) this.typingAuthorId = first
        this.showTyping = !!first
        return
      }

      this.typingSelectOptions = ids.map(id => {
        const u = this.usersById[id]
        return { id, label: u?.name ?? id, ...(u?.avatar ? { avatar: u.avatar } : {}) }
      })
      void nextTick(() => { this.showTypingSelect = true })
    },

    onTypingSelect(id: string) {
      this.typingAuthorId = id
      this.showTyping = true
      this.showTypingSelect = false
    },

    scrollToBottom() {
      const scroll = this.$refs.scrollArea as QScrollArea | undefined
      scroll?.setScrollPercentage('vertical', 10)
    },

    onInfiniteLoad(index: number, done: (stop?: boolean) => void) {
      if (this.loadTimer) {
        clearTimeout(this.loadTimer)
        this.loadTimer = null
      }
      this.loadTimer = window.setTimeout(() => {
        this.loadOlderBatch(5)
        done()
        this.loadTimer = null
      }, 2000)
    },

    loadOlderBatch(count: number) {
      const now = Date.now()
      const older = Array.from({ length: count }, (_, i) => ({
        id: `older-${now - i}`,
        channelId: 'ch-1',
        userId: 'u-simca',
        text: `staršia správa #${i + 1}`,
        time: 'štvrtok 16:20'
      }))
      this.messages.unshift(...older)
    },

    startTyping(userId: string) {
      this.typingUserIds = [...new Set([...this.typingUserIds, userId])]
    },

    stopTyping(userId: string) {
      this.typingUserIds = this.typingUserIds.filter(id => id !== userId)
    },

    isMention(text: string): boolean {
      const me = this.usersById[this.meId]
      if (!me) return false
      const normalized = me.name.trim().toLowerCase()
      const regex = new RegExp(`@${normalized}\\b`, 'i')
      return regex.test(text)
    }
  }
})
</script>

<style scoped>
.typing-bar {
  position: sticky;
  bottom: 0;
  color: rgb(0, 0, 0, 0.7);
  width: 100%;
  cursor: pointer;
  text-align: left;
}
</style>
