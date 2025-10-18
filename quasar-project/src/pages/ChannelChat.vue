<template>
  <q-page class="l-1 q-pa-sm">
    <div class="col">
      <div class="column q-pa-md q-gutter-md">
        <div class="row justify-center">
          <q-btn dense outline rounded no-caps color="grey-5" class="bg-white text-grey-8" label="Load older messages" />
        </div>

        <div v-for="m in messages" :key="m.id" class="row">
          <div v-if="m.from!=='me'" class="row items-end q-gutter-sm">
            <q-avatar size="28px">
              <img :src="m.avatar ?? ''" alt="" />
            </q-avatar>
            <div>
              <div class="bubble their">
                <div>{{ m.text }}</div>
              </div>
              <div class="text-caption op-60 q-mt-xs">{{ m.time }}</div>
            </div>
          </div>

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
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, inject, ref } from 'vue'

type Msg = {
  id: string
  from: 'me' | 'other'
  text: string
  time: string
  avatar?: string
}

export default defineComponent({
  name: 'ChannelChat',
  setup () {
    const setTyping = inject<(t: string | null) => void>('setTyping')!

    const messages = ref<Msg[]>([
      { id: 'm1', from: 'other', text: 'ngl hento sa mi paci farebne', time: 'piatok 14:53', avatar: 'https://placekitten.com/41/41' },
      { id: 'm2', from: 'me',    text: 'tomu ver', time: '10:59' },
      { id: 'm3', from: 'other', text: 'idem si spravit nechty nejake pekne jesenne muhehehe', time: '10:59', avatar: 'https://placekitten.com/41/41' },
      { id: 'm4', from: 'other', text: 'uuu potom pošli 💅💅', time: '11:01', avatar: 'https://placekitten.com/45/45' },
      { id: 'm5', from: 'me', text: '💅', time: '11:02' },
      { id: 'm6', from: 'other', text: '💅', time: '11:05', avatar: 'https://placekitten.com/45/45' },
      { id: 'm7', from: 'me', text: '💅', time: '11:07' }
    ])

    onMounted(() => { setTyping('Nikol 🐱 píše…') })
    onUnmounted(() => { setTyping(null) })

    return { messages }
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
</style>
