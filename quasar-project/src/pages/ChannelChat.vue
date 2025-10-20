<!-- ChannelChat.vue -->
<template>
  <q-page class="l-1 q-pa-sm">
    <div class="col">
      <div class="column q-pa-md q-gutter-md">
        <div class="row justify-center">
          <q-btn
            dense outline rounded no-caps
            color="grey-5"
            class="bg-white text-grey-8 q-px-md"
            label="Load older messages"
            @click="loadOlder"
          />
        </div>

        <div v-for="m in messages" :key="m.id" class="row">
          <!-- správa od iných -->
          <div v-if="m.userId !== meId" class="row items-end q-gutter-sm">
            <q-avatar size="28px">
              <img :src="usersById[m.userId]?.avatar || ''" alt="" />
            </q-avatar>
            <div>
              <div class="text-caption op-60 q-ml-sm">{{ usersById[m.userId]?.name }}</div>
              <div class="bubble their">
                <div>{{ m.text }}</div>
              </div>
              <div class="text-caption op-60 q-mt-xs">{{ m.time }}</div>
            </div>
          </div>

          <!-- moja správa -->
          <div v-else class="col row justify-end">
            <div>
              <div class="bubble mine">
                <div>{{ m.text }}</div>
              </div>
              <div class="text-caption op-60 q-mt-xs text-right">{{ m.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- “Nalepené” nad spodok main časti. Úmyselne nad footerom. -->
    <div v-if="typingText" class="typing-indicator text-caption op-60">
      {{ typingText }}
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'

/* -- typy, normalizácia */
type Message = {
  id: string
  channelId: string
  userId: string
  text: string
  time: string
}
type User = {
  id: string
  name: string
  avatar: string
}

export default defineComponent({
  name: 'ChannelChat',
  setup () {
    /* -- moje userId (z auth/store v produkcii) */
    const meId = 'u-me'

    /* -- mapa užívateľov (v produkcii zo store) */
    const usersById = ref<Record<string, User>>({
      'u-nikol': { id: 'u-nikol', name: 'Nikol',  avatar: '/avatars/users/nikol.png' },
      'u-simca': { id: 'u-simca', name: 'Simča',  avatar: '/avatars/users/simca.png' },
      'u-me':    { id: 'u-me',    name: 'Ja',     avatar: '/avatars/users/firefly.jpg' }
    })

    /* -- správy bez duplicitných avatarov/from */
    const messages = ref<Message[]>([
      { id: 'm1', channelId: 'ch-1', userId: 'u-nikol', text: 'ngl hento sa mi paci farebne', time: 'piatok 14:53' },
      { id: 'm2', channelId: 'ch-1', userId: 'u-me',    text: 'tomu ver',                      time: '10:59' },
      { id: 'm3', channelId: 'ch-1', userId: 'u-nikol', text: 'idem si spravit nechty nejake pekne jesenne muhehehe', time: '10:59' },
      { id: 'm4', channelId: 'ch-1', userId: 'u-simca', text: 'uuu potom pošli 💅💅',          time: '11:01' },
      { id: 'm5', channelId: 'ch-1', userId: 'u-me',    text: '💅',                            time: '11:02' },
      { id: 'm6', channelId: 'ch-1', userId: 'u-nikol', text: '💅',                            time: '11:05' },
      { id: 'm7', channelId: 'ch-1', userId: 'u-me',    text: '💅',                            time: '11:07' }
    ])

    /* -- písanie užívateľov */
    const typingUserIds = ref<string[]>([])

    function startTyping (userId: string) {
      if (!typingUserIds.value.includes(userId)) typingUserIds.value.push(userId)
    }
    function stopTyping (userId: string) {
      typingUserIds.value = typingUserIds.value.filter(id => id !== userId)
    }

    /* -- text indikátora písania */
    const typingText = computed<string | null>(() => {
      if (typingUserIds.value.length === 0) return null
      const names = typingUserIds.value
        .map(id => usersById.value[id]?.name)
        .filter(Boolean) as string[]
      if (names.length === 0) return null
      const list = names.join(', ')
      const verb = names.length > 1 ? 'píšu…' : 'píše…'
      return `${list} ${verb}`
    })

    /* -- simulácia: Nikol píše na mount */
    onMounted(() => { startTyping('u-nikol') })

    /* -- načítanie starších (placeholder) */
    function loadOlder () {
      messages.value.unshift({
        id: 'm0',
        channelId: 'ch-1',
        userId: 'u-simca',
        text: 'staršia správa',
        time: 'štvrtok 16:20'
      })
    }

    return {
      // state
      meId,
      usersById,
      messages,
      typingUserIds,
      typingText,
      // actions
      startTyping,
      stopTyping,
      loadOlder
    }
  }
})
</script>

<style scoped>
.bubble {
  max-width: min(70vw, 560px);
  padding: 8px 12px;
  border-radius: 14px;
  line-height: 1.3;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  white-space: pre-wrap;
  word-break: break-word;
}
.bubble.their { background: #fff; color: #1f1f1f; }
.bubble.mine  { background: var(--l-2); color: #fff; margin-left: auto; }

.typing-indicator {
  position: fixed;
  bottom: 72px;   /* výška footeru */
  padding: 6px 12px;
  color: #000;
  background: transparent;
  pointer-events: none;
  text-align: left;
}

</style>