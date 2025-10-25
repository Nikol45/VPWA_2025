<template>
  <q-page class="c-1 q-px-sm column">
      <q-scroll-area ref="scrollArea"
                     style="height: calc(100vh - 108px);"
                     class="no-scrollbar q-px-md q-pb-md q-gutter-md">

        <q-infinite-scroll reverse @load="onInfiniteLoad" >
          <div v-for="m in messages" :key="m.id" class="row">
            <message-bubble :message="m" :user="usersById[m.userId]" :is-mine="m.userId === meId"/>
          </div>

          <div v-if="typingText" class="typing-bar text-caption c-1">
            {{ typingText }}
          </div>

          <template #loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots size="24px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-scroll-area>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import type { QScrollArea } from 'quasar'
import MessageBubble from 'src/components/MessageBubble.vue'

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
}

export default defineComponent({
  name: 'ChannelChat',
  components: { MessageBubble },

  data() {
    return {
      meId: 'u-me',

      usersById: {
        'u-nikol': { id: 'u-nikol', name: 'Nikol',  avatar: '/avatars/users/nikol.png' },
        'u-simca': { id: 'u-simca', name: 'Simča',  avatar: '/avatars/users/simca.png' },
        'u-me':    { id: 'u-me',    name: 'Ja',     avatar: '/avatars/users/firefly.jpg' }
      } as Record<string, User>,

      messages: [
        { id: 'm-13', channelId: 'ch-1', userId: 'u-nikol', text: 'BFFR', time: 'štvrtok 22:03' },
        { id: 'm-12', channelId: 'ch-1', userId: 'u-simca', text: 'Ta pome spinkať 💤', time: 'štvrtok 22:04' },
        { id: 'm-11', channelId: 'ch-1', userId: 'u-simca', text: 'Good nighty 🌃', time: 'štvrtok 22:04' },
        { id: 'm-10', channelId: 'ch-1', userId: 'u-me', text: 'bruuu noc prajem ženy 💫💎', time: 'štvrtok 22:05' },
        { id: 'm-09', channelId: 'ch-1', userId: 'u-simca', text: 'Môže byť?', time: 'piatok 09:31' },
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
      loadTimer: null as number | null
    }
  },

  computed: {
    typingText(): string | null {
      if (this.typingUserIds.length === 0) return null
      const names = this.typingUserIds.map(id => this.usersById[id]?.name).filter(Boolean) as string[]
      if (names.length === 0) return null
      const list = names.join(', ')
      const verb = names.length > 1 ? 'píšu…' : 'píše…'
      return `${list} ${verb}`
    }
  },

  mounted() {
    this.startTyping('u-nikol')
    requestAnimationFrame(() => this.scrollToBottom())
  },


  methods: {
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
        done() // done(true) ak už nič viac nemáš
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
      if (!this.typingUserIds.includes(userId)) {
        this.typingUserIds.push(userId)
      }
    },

    stopTyping(userId: string) {
      this.typingUserIds = this.typingUserIds.filter(id => id !== userId)
    },

    loadOlder() {
      this.messages.unshift({
        id: 'm0',
        channelId: 'ch-1',
        userId: 'u-simca',
        text: 'staršia správa',
        time: 'štvrtok 16:20'
      })
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
