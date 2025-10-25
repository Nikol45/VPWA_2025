<template>
    <div class="row items-center full-width q-gutter-sm">
        <q-input dense standout="c-4" class="c-4 col q-ma-xxs" placeholder="" v-model="msg" input-class="text-white" @keyup.enter="sendMessage">
            <template v-if="activeChannel" #prepend>
                <q-btn flat round dense icon="emoji_emotions"/>
            </template>
        </q-input>
        <q-btn flat class="c-5 full-height" size="md" @click="sendMessage">
            <q-icon name="send" color="white" class="q-ma-xs icon-sm"></q-icon>
        </q-btn>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import type { PropType } from 'vue'

    interface Channel {
        id: string
        name: string
        members: number
        private: boolean
        avatar: string
    }

    export default defineComponent({
        name: 'CommandLine',

        props: {
            activeChannel: {
            type: Object as PropType<Channel | null>,
            required: false,
            default: null
            }
        },

        data() {
            return {
                msg:''
            }
        },

        methods: {
            sendMessage() {}
        }
    })
</script>

<style scoped>
    .icon-sm {
      width: 0;
    }
</style>
