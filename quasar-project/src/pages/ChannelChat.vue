<template>
  <q-page class="l-1 q-pa-sm">
    <div class="col">
      <div class="column q-pa-md q-gutter-md">
        <div class="row justify-center">
          <q-btn dense outline rounded no-caps color="grey-5" class="bg-white text-grey-8 q-px-md" label="Load older messages" @click="loadOlder"/>
        </div>

        <div v-for="m in messages" :key="m.id" class="row">
          <message-bubble :message="m" :user="usersById[m.userId]" :is-mine="m.userId === meId"/>
        </div>
      </div>
    </div>

    <div v-if="typingText" class="typing-indicator text-caption op-60">
      {{ typingText }}
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
        { id: 'm1', channelId: 'ch-1', userId: 'u-nikol', text: 'ngl hento sa mi paci farebne', time: 'piatok 14:53' },
        { id: 'm2', channelId: 'ch-1', userId: 'u-me',    text: 'tomu ver',                      time: '10:59' },
        { id: 'm3', channelId: 'ch-1', userId: 'u-nikol', text: 'idem si spravit nechty nejake pekne jesenne muhehehe', time: '10:59' },
        { id: 'm4', channelId: 'ch-1', userId: 'u-simca', text: 'uuu potom pošli 💅💅',          time: '11:01' },
        { id: 'm5', channelId: 'ch-1', userId: 'u-me',    text: '💅',                            time: '11:02' },
        { id: 'm6', channelId: 'ch-1', userId: 'u-nikol', text: '💅',                            time: '11:05' },
        { id: 'm7', channelId: 'ch-1', userId: 'u-me',    text: '💅',                            time: '11:07' }
      ] as Message[],

      typingUserIds: [] as string[]
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
  },

  methods: {
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

.typing-indicator {
    position: fixed;
    bottom: 90px;
    padding: 6px 12px;
    color: #000;
    background: transparent;
    pointer-events: none;
    text-align: left;
}

</style>