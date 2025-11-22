<template>
  <q-page class="c-1 q-px-sm column">
    <q-scroll-area
      ref="scrollArea"
      style="height: calc(100vh - 108px);"
      class="no-scrollbar q-px-md q-pb-md q-gutter-md"
    >
      <q-infinite-scroll reverse @load="onInfiniteLoad">
        <div v-for="m in messages" :key="m.id" class="row">
          <message-bubble
            :message="m"
            :user="usersById[m.userId]"
            :is-mine="m.userId === meId"
            :class="{ mention: isMention(m) }"
          />
        </div>

        <div
          v-if="typingBarText"
          class="typing-bar text-caption c-1"
          @click="openTypingPreview"
        >
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
import { defineComponent, nextTick } from 'vue'
import type { QScrollArea } from 'quasar'
import MessageBubble from 'src/components/MessageBubble.vue'
import TypingPopup from 'src/components/popups/TypingPopup.vue'
import TypingSelectPopup from 'src/components/popups/TypingSelectPopup.vue'

import { useAuthStore } from 'src/stores/auth'
import { messageService, typingService } from 'src/services'
import type { Message as ApiMessage, TypingState, User as ApiUser } from 'src/contracts'

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
    const authStore = useAuthStore()
    return { authStore }
  },

  data() {
    return {
      messages: [] as Message[],
      usersById: {} as Record<string, User>,

      typingStates: [] as TypingState[],
      typingAuthorId: null as number | null,
      showTyping: false,
      showTypingSelect: false,
      typingSelectOptions: [] as TypingOption[],

      hasMore: true,
      loadingMore: false,
      initialLoaded: false,

      typingPollTimer: null as number | null,
    }
  },

  computed: {
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
      if (this.typingStates.length === 0) return null

      const names = this.typingStates
        .map((s) => this.usersById[String(s.userId)]?.name ?? s.nickname)
        .filter(Boolean)

      if (names.length === 0) return null

      const verb = names.length > 1 ? 'píšu…' : 'píše…'
      return `${names.join(', ')} ${verb}`
    },

    typingAuthorName(): string {
      let id = this.typingAuthorId

      if (id == null) {
        const first = this.typingStates[0]
        if (first) id = first.userId
      }

      if (id == null) return 'User'

      const user = this.usersById[String(id)]
      if (user) return user.name

      const state = this.typingStates.find((s) => s.userId === id)
      return state?.nickname ?? 'User'
    },

    activeTypingText(): string {
      let id = this.typingAuthorId

      if (id == null) {
        const first = this.typingStates[0]
        if (first) id = first.userId
      }

      if (id == null) return ''

      const state = this.typingStates.find((s) => s.userId === id)
      return state?.text ?? ''
    },
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        void this.onChannelChanged()
      },
    },
  },

  beforeUnmount() {
    this.stopTypingPolling()
  },

  methods: {
    async onChannelChanged() {
      this.messages = []
      this.typingStates = []
      this.hasMore = true
      this.initialLoaded = false

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

        this.initialLoaded = true
        await nextTick()
        this.scrollToBottom()
      } finally {
        this.loadingMore = false
      }
    },

    async onInfiniteLoad(index: number, done: (stop?: boolean) => void) {
      if (this.loadingMore || !this.hasMore) {
        done(true)
        return
      }

      const channelId = this.currentChannelId
      if (!channelId) {
        done(true)
        return
      }

      const oldest = this.messages[0]
      if (!oldest) {
        done(true)
        return
      }

      this.loadingMore = true
      const limit = 20

      try {
        const fetched = await messageService.list(channelId, {
          before: this.findCreatedAtForMessage(oldest.id) ?? null,
          limit,
        })

        if (fetched.length === 0) {
          this.hasMore = false
          done(true)
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

        done()
      } catch {
        done(true)
      } finally {
        this.loadingMore = false
      }
    },

    findCreatedAtForMessage(messageId: string): string | null {
      const msg = this.messages.find((m) => m.id === messageId)
      if (!msg) return null
      return null
    },

    ensureUser(user: ApiUser) {
      const key = String(user.id)
      if (this.usersById[key]) return

      this.usersById[key] = {
        id: key,
        name: user.nickname,
        avatar: user.avatarUrl || '/avatars/users/default.png',
        status: user.status,
      }
    },

    scrollToBottom() {
      const scroll = this.$refs.scrollArea as QScrollArea | undefined
      scroll?.setScrollPercentage('vertical', 1)
    },

    isMention(message: Message): boolean {
      const me = this.authStore.user
      if (!me) return false
      return message.mentions.includes(me.id)
    },

    onTypingBack() {
      this.showTyping = false
      this.showTypingSelect = true
    },

    openTypingPreview() {
      if (this.typingStates.length === 0) return

      const ids = this.typingStates.map((s) => s.userId)

      if (ids.length <= 1) {
        const first = ids[0]
        if (first != null) {
          this.typingAuthorId = first
          this.showTyping = true
        }
        return
      }

      this.typingSelectOptions = this.typingStates.map((s) => {
        const u = this.usersById[String(s.userId)]
        return {
          id: String(s.userId),
          label: u?.name ?? s.nickname,
          ...(u?.avatar ? { avatar: u.avatar } : {}),
        }
      })

      this.showTypingSelect = true
    },

    onTypingSelect(id: string) {
      const numId = Number(id)
      if (!Number.isFinite(numId)) return
      this.typingAuthorId = numId
      this.showTyping = true
      this.showTypingSelect = false
    },

    startTypingPolling() {
      this.stopTypingPolling()

      const channelId = this.currentChannelId
      if (!channelId) return

      void this.fetchTypingStates()

      this.typingPollTimer = window.setInterval(() => {
        void this.fetchTypingStates()
      }, 3000)
    },

    stopTypingPolling() {
      if (this.typingPollTimer !== null) {
        clearInterval(this.typingPollTimer)
        this.typingPollTimer = null
      }
    },

    async fetchTypingStates() {
      const channelId = this.currentChannelId
      if (!channelId) return

      const states = await typingService.listTyping(channelId)
      this.typingStates = states

      for (const s of states) {
        const key = String(s.userId)
        if (!this.usersById[key]) {
          this.usersById[key] = {
            id: key,
            name: s.nickname,
            avatar: '/avatars/users/default.png',
            status: 'online',
          }
        }
      }

      if (this.typingStates.length === 0) {
        this.showTyping = false
        this.showTypingSelect = false
        this.typingAuthorId = null
      }
    },
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
