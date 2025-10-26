<template>
    <div class="row items-center full-width q-gutter-sm">
        <q-input ref="cmdInput" dense standout="c-4" class="c-4 col q-ma-xxs" placeholder="Type a message or /command" v-model="msg" input-class="text-white" @keyup.enter="sendMessage">
            <template v-if="activeChannel" #prepend>
                <q-btn flat round dense icon="emoji_emotions"/>
            </template>
        </q-input>
        <q-menu ref="cmdMenu" :target="cmdTarget" :no-focus="true" v-model="showMenu" v-show="filteredSuggestions.length && showMenu" anchor="bottom left" self="top left">
            <q-list class="sugegstion c-2 text-c-3">
                <q-item class="c-2 text-c-3" v-for="item in filteredSuggestions" :key="item" clickable @click="selectSuggestion(item)">
                    <q-item-section class="c-2 text-c-3">{{ item }}</q-item-section>
                </q-item>
            </q-list>
        </q-menu>
        <q-btn flat class="c-5 full-height" size="md" @click="sendMessage">
            <q-icon name="send" color="white" class="q-ma-xs icon-sm"></q-icon>
        </q-btn>
    </div>
</template>

<script lang="ts">
    import { defineComponent, nextTick, type PropType} from 'vue'
    import type { QInput, QMenu } from 'quasar'

    interface Member {
        id: number
        nickname: string
    }

    interface Channel {
        id: string
        name: string
        private: boolean
        avatar: string
        invited: boolean
    }

    export default defineComponent({
        name: 'CommandLine',

        props: {
            activeChannel: {
                type: Object as PropType<Channel | null>,
                required: false,
                default: null
            },

            membersByChannel: {
                type: Object as PropType<Record<string, Member[]>>,
                required: false,
                default: () => ({})
            }
        },

        data() {
            return {
                showMenu: false,
                msg:'',
                commands: ['/list', '/join', '/invite', '/kick', '/cancel', '/revoke', '/quit']
            }
        },

        methods: {
            selectSuggestion(suggestion: string) {
                this.msg = suggestion + ' '
                this.showMenu = false
            },

            sendMessage() {
                const text = this.msg.trim()
                if (!text) return

                if (text.startsWith('/')) {
                    const [command, ...args] = text.substring(1).split(' ')
                    this.$emit('command', { command, args })
                }
                
                else if (text.startsWith('@')) {
                    const [mention] = text.substring(1).split(' ')
                    this.$emit('mention', { mention })
                }
                
                else {
                    this.$emit('message', text)
                }

                this.msg = ''
                this.showMenu = false
            }
        },

        computed: {
            filteredSuggestions(): string[] {
                const text = this.msg

                if (text.startsWith('/')) {
                    const input = text.slice(1).toLowerCase()
                    return this.commands.filter(cmd => cmd.startsWith('/' + input))
                }

                if (text.startsWith('@') && this.activeChannel && this.membersByChannel) {
                    const members = this.membersByChannel[this.activeChannel.id] || []
                    const input = text.slice(1).toLowerCase()
                    return members.map(m => '@' + m.nickname).filter(nick => nick.toLowerCase().startsWith('@'+input))
                }

                return []
            },

            cmdTarget (): Element | undefined {
                const input = this.$refs.cmdInput as QInput | undefined
                const el = input?.$el as HTMLElement | undefined
                return el?.querySelector('.q-field__control') || el
            }
        },

        watch: {
            msg (val: string) {
                this.showMenu = (val.startsWith('/') || val.startsWith('@')) && this.filteredSuggestions.length > 0
                void nextTick(() => {
                    const menu = this.$refs.cmdMenu as QMenu | undefined
                    menu?.updatePosition?.()
                })
            },

            filteredSuggestions () {
                void nextTick(() => {
                    const menu = this.$refs.cmdMenu as QMenu | undefined
                    menu?.updatePosition?.()
                })
            }
        },

        emits: ['command', 'message', 'mention'],
    })
</script>

<style scoped>
    .icon-sm {
      width: 0;
    }

    .suggestion {
        max-height: 400px;
    }
</style>
