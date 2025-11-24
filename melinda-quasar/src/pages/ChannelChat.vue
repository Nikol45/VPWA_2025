<template>
  <q-page class="c-1 q-px-sm column">
    <q-scroll-area ref="scrollArea" style="height: calc(100vh - 108px);" class="no-scrollbar q-px-md q-pb-md q-gutter-md" @scroll="onScroll">
      <div v-if="loadingMore && scrolledToBottomOnce" class="row justify-center q-my-md" style="min-height: 40px">
        <q-spinner-dots size="24px" color="primary" />
      </div>
      <div class="column" :style="{ opacity: scrolledToBottomOnce ? 1 : 0, transition: 'opacity 0.2s' }">
        <div v-for="m in messagesMerged" :key="m.id" class="row">
          <message-bubble
            :message="m"
            :user="usersById[m.userId]"
            :is-mine="m.userId === meId"
            :class="{ mention: isMention(m) }"
          />
        </div>
      </div>
    </q-scroll-area>
    <div
      v-if="typingBarText"
      class="typing-bar text-caption c-1"
      @click="openTypingPreview"
    >
      {{ typingBarText }}
    </div>

    <typing-popup
      v-model="showTyping"
      :name="typingAuthorName"
      :typing-text="activeTypingText"
      @back="onTypingBack"
    />

    <typing-select-popup
      v-model="showTypingSelect"
      :options="typingOptions"
      @select="onTypingSelect"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import type { QScrollArea } from 'quasar'
import MessageBubble from 'src/components/MessageBubble.vue'
import TypingPopup from 'src/components/popups/TypingPopup.vue'
import TypingSelectPopup from 'src/components/popups/TypingSelectPopup.vue'

import { useAuthStore } from 'src/stores/auth'
import { messageService } from 'src/services'
import type { Message as ApiMessage, TypingState, User as ApiUser } from 'src/contracts'
import { useMessageWsStore } from 'src/stores/messages'
import { wsClient } from 'src/ws/client'
import { useTypingWsStore } from 'src/stores/typing'

interface Message {
  id: string
  channelId: string
  userId: string
  text: string
  time: string
  createdAt: string
  mentions: number[]
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
    const messageWs = useMessageWsStore()
    const authStore = useAuthStore()
    const typingWs = useTypingWsStore()
    return { authStore, messageWs, typingWs }
  },

  data() {
    return {
      messages: [] as Message[],
      usersById: {} as Record<string, User>,
      
      typingStates: [] as TypingState[],
      typingAuthorId: null as number | null,
      showTyping: false,
      showTypingSelect: false,

      hasMore: true,
      loadingMore: false,
      
      initialLoaded: false,
      scrolledToBottomOnce: false,

      typingPollTimer: null as number | null,
    }
  },

  computed: {
    messagesMerged() {
      const cid = this.currentChannelId
      if (!cid) return []
      const ws = this.messageWs.getMessages(cid).map((m) => this.mapApiMessage(m))
      const combined = [...this.messages, ...ws]
      return combined.filter((v, i, a) => a.findIndex(v2 => v2.id === v.id) === i)
    },

    meId(): string | null {
      const u = this.authStore.user
      return u ? String(u.id) : null
    },

    currentChannelId(): number | null {
      const idStr = this.$route.params.id as string | undefined
      if (!idStr) return null
      const id = Number(idStr)
      return Number.isFinite(id) ? id : null
    },

    typingBarText(): string | null {
      if (this.activeTyping.length === 0) return null
      const names = this.activeTyping
        .map((s) => this.usersById[String(s.userId)]?.name ?? s.nickname)
        .filter(Boolean)
      if (names.length === 0) return null
      const verb = names.length > 1 ? 'píšu…' : 'píše…'
      return `${names.join(', ')} ${verb}`
    },
    typingAuthorName(): string {
      let id = this.typingAuthorId
      if (id == null) {
        const first = this.activeTyping[0]
        if (first) id = first.userId
      }
      if (id == null) return 'User'
      const user = this.usersById[String(id)]
      if (user) return user.name
      const state = this.activeTyping.find((s) => s.userId === id)
      return state?.nickname ?? 'User'
    },
    activeTypingText(): string {
      let id = this.typingAuthorId
      if (id == null) {
        const first = this.activeTyping[0]
        if (first) id = first.userId
      }
      if (id == null) return ''
      const state = this.activeTyping.find((s) => s.userId === id)
      return state?.text ?? ''
    },
    activeTyping() {
      const id = this.currentChannelId
      if (!id) return []
      return this.typingWs.statesByChannel[id] || []
    },
    typingOptions(): TypingOption[] {
       return this.activeTyping.map((s) => {
        const u = this.usersById[String(s.userId)]
        const base = {
          id: String(s.userId),
          label: u?.name ?? s.nickname,
        }
        if (u?.avatar) {
          return { ...base, avatar: u.avatar }
        }
        return base
      })
    }
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        void this.onChannelChanged()
      },
    },

    messagesMerged: {
      deep: true,
      handler(newVal, oldVal) {
        if (!this.scrolledToBottomOnce) return;

        if (!newVal || newVal.length === 0) return
        if (!oldVal || oldVal.length === 0) return

        const newLast = newVal[newVal.length - 1]
        const oldLast = oldVal[oldVal.length - 1]

        if (newLast.id !== oldLast.id) {
          this.scrollToBottom(true)
        }
      }
    },
  },

  beforeUnmount() {
    this.stopTypingPolling()
  },

  methods: {
    async onChannelChanged() {
      this.messages = []
      this.hasMore = true
      this.scrolledToBottomOnce = false 
      this.messageWs.clearChannel(this.currentChannelId!)

      await this.loadInitialMessages()
      this.startTypingPolling()
    },

    mapApiMessage(m: ApiMessage): Message {
      return {
        id: String(m.id),
        channelId: String(m.channelId),
        userId: String(m.userId),
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString('sk-SK', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        createdAt: m.createdAt,
        mentions: Array.isArray(m.mentions) ? m.mentions : [],
      }
    },

    async loadInitialMessages() {
      const channelId = this.currentChannelId
      if (!channelId) return

      this.loadingMore = true
      this.initialLoaded = false
      this.scrolledToBottomOnce = false
      const limit = 20 

      try {
        const fetched = await messageService.list(channelId, { limit })
        
        if (fetched.length < limit) {
          this.hasMore = false
        }

        const ascApi = [...fetched].reverse()
        this.messages = ascApi.map((m) => this.mapApiMessage(m))

        for (const m of ascApi) {
          if (m.user) this.ensureUser(m.user)
        }

        await nextTick()
        
        this.scrollToBottom(false)

        setTimeout(() => {
           this.scrollToBottom(false)
           
           this.scrolledToBottomOnce = true 
           this.initialLoaded = true
           this.loadingMore = false
        }, 300)

      } catch {
        this.loadingMore = false
      }
    },

    onScroll(info: { verticalPosition: number }) {
      if (!this.scrolledToBottomOnce) return
      if (this.loadingMore) return
      if (!this.hasMore) return

      if (info.verticalPosition < 50) {
        void this.loadOlderMessages()
      }
    },

    async loadOlderMessages() {
      const channelId = this.currentChannelId
      const oldestMessage = this.messages[0]

      if (!channelId || !oldestMessage) return

      this.loadingMore = true

      const limit = 20
      const scrollArea = this.$refs.scrollArea as QScrollArea
      const oldSize = scrollArea ? scrollArea.getScroll().verticalSize : 0

      try {
        await new Promise(r => setTimeout(r, 300))

        const fetched = await messageService.list(channelId, {
          before: oldestMessage.createdAt, 
          limit,
        })

        if (fetched.length === 0) {
          this.hasMore = false
          this.loadingMore = false
          return
        }

        if (fetched.length < limit) {
          this.hasMore = false
        }

        const ascApi = [...fetched].reverse()
        const mapped = ascApi.map((m) => this.mapApiMessage(m))
        
        this.messages = [...mapped, ...this.messages]

        for (const m of ascApi) {
          if (m.user) this.ensureUser(m.user)
        }

        await nextTick()

        if (scrollArea) {
            const newSize = scrollArea.getScroll().verticalSize
            const sizeDiff = newSize - oldSize
            scrollArea.setScrollPosition('vertical', sizeDiff, 0)
        }
        
        setTimeout(() => {
            this.loadingMore = false
        }, 500)

      } catch {
        this.loadingMore = false
      }
    },

    findCreatedAtForMessage(messageId: string): string | null {
      const msg = this.messages.find((m) => m.id === messageId)
      if (!msg) return null
      return msg.createdAt
    },
    ensureUser(user: ApiUser) {
      const key = String(user.id)
      if (this.usersById[key]) return
      this.usersById[key] = { id: key, name: user.nickname, avatar: user.avatarUrl || '/avatars/users/default.png', status: user.status }
    },
    scrollToBottom(animated = true) {
      const scrollArea = this.$refs.scrollArea as QScrollArea
      if (scrollArea) {
        const scrollSize = scrollArea.getScroll().verticalSize
        scrollArea.setScrollPosition('vertical', scrollSize, animated ? 300 : 0)
      }
    },
    isMention(message: Message): boolean {
      const me = this.authStore.user
      if (!me) return false
      return message.mentions.includes(me.id)
    },
    onTyping(text: string) {
      const id = this.currentChannelId
      if (!id) return
      wsClient.sendTyping(id, text.length > 0, text)
    },
    onTypingBack() { this.showTyping = false; this.showTypingSelect = true },
    openTypingPreview() {
      if (this.activeTyping.length === 0) return
      const ids = this.activeTyping.map((s) => s.userId)
      if (ids.length <= 1) {
        const first = ids[0]; if (first != null) { this.typingAuthorId = first; this.showTyping = true }; return
      }
      this.typingOptions = this.activeTyping.map((s) => {
        const u = this.usersById[String(s.userId)]
        return { id: String(s.userId), label: u?.name ?? s.nickname, ...(u?.avatar ? { avatar: u.avatar } : {}) }
      })
      this.showTypingSelect = true
    },
    onTypingSelect(id: string) { const numId = Number(id); if (!Number.isFinite(numId)) return; this.typingAuthorId = numId; this.showTyping = true; this.showTypingSelect = false },
    startTypingPolling() { return },
    stopTypingPolling() { if (this.typingPollTimer !== null) { clearInterval(this.typingPollTimer); this.typingPollTimer = null } }
  },
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