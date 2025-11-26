<template>
    <div v-if="!isMine" class="row items-end q-gutter-sm">
        <div class="relative-position">
            <q-avatar size="28px">
                <img :src=avatarSrc />
            </q-avatar>
            <q-icon name="circle" bordered size="8px" :color="statusColor" class="absolute-bottom-right"/>
        </div>

        <div>
            <div class="q-mt-md row items-center no-wrap">
              <div class="text-caption op-60 q-ml-sm">{{ user?.name }}</div>
              <div class="text-caption op-60 q-ml-xs"> - {{ message.time }}</div>
          </div>

          <div class="bubble rad-15 their">
            <div>{{ message.text }}</div>
          </div>
        </div>
    </div>

    <div v-else class="col justify-end">
      <div class="text-caption op-60 q-mr-xs text-right">{{ message.time }}</div>
      <div class="bubble rad-15 mine">
            <div>{{ message.text }}</div>
        </div>
    </div>
</template>
<!-- Ano, vieme, ze existuje quasar komponent chat-message ale nepacil sa nam jeho dizajn, tak sme si vytvorili vlastny :> -->

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

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

export default defineComponent({
    name: 'MessageBubble',

    props: {
        message: {
            type: Object as PropType<Message>,
            required: true
        },

        user: {
            type: Object as PropType<User | undefined>,
            default: undefined
        },

        isMine: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        statusColor(): string {
            if (!this.user) return 'grey'
            switch (this.user.status) {
                case 'online': return 'positive'
                case 'dnd': return 'negative'
                case 'offline': return 'grey'
                default: return 'grey'
            }
        },

        avatarSrc(): string {
            const path = this.user?.avatar || '/avatars/users/default.png'
            
            if (path.startsWith('http') || path.startsWith('data:')) {
                return path
            }
            
            return `${import.meta.env.VITE_API_URL}${path}`
        },
    },
})
</script>

<style scoped>
    .bubble {
        width: fit-content;
        max-width: min(35vw, 560px);
        padding: 8px 12px;
        line-height: 1.3;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        white-space: pre-wrap;
        word-break: break-word;
    }

    .bubble.their { background: #fff; color: var(--c-5); }
    .bubble.mine  { background: var(--c-2); color: var(--c-5); margin-left: auto; }

    .mention .bubble {
      background: var(--c-1);
      box-shadow: 0 0 8px var(--c-3);
      border: 2px var(--c-2);
      border-style: dotted;
    }

</style>
