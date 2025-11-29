<template>
    <div class="row items-center full-width q-gutter-sm">
      <q-input ref="cmdInput" dense standout="c-4" class="c-4 col q-ma-xxs" type="textarea" autogrow :placeholder="placeholderText"
               v-model="msg" input-class="text-white" @keydown.enter.exact.prevent="sendMessage" :maxlength="maxChars">
            <template v-if="activeChannel" #prepend>
                <q-btn flat round dense class="text-c-1" icon="emoji_emotions" ref="emojiBtn"/>
                <q-menu anchor="top left" self="bottom left" ref="emojiMenu" transition-show="jump-down" transition-hide="jump-up" class="rad-15 c-1" :offset="[0, 4]">
                    <div class="q-pa-sm emoji-grid">
                        <q-btn v-for="emoji in emojis" :key="emoji" flat dense size="md" @click="addEmoji(emoji)">
                            {{ emoji }}
                        </q-btn>
                    </div>
                </q-menu>
            </template>
            <template #append>
                <div class="text-caption text-c-1 q-pr-xs">
                    {{ msg.length }}/{{ maxChars }}
                </div>
            </template>
        </q-input>

        <q-menu ref="cmdMenu" :target="cmdTarget" :no-focus="true" v-model="showMenu" v-show="filteredSuggestions.length && showMenu" anchor="bottom left" self="top left">
            <q-list class="suggestion c-2 text-c-3">
                <q-item class="c-2 text-c-3" v-for="item in filteredSuggestions" :key="item" clickable @click="selectSuggestion(item)">
                    <q-item-section class="c-2 text-c-3">{{ item }}</q-item-section>
                </q-item>
            </q-list>
        </q-menu>

        <q-btn flat class="c-5 full-height" size="md" @click="sendMessage" :disable="!canSend">
            <q-icon name="send" color="white" class="q-ma-xs icon-sm"></q-icon>
        </q-btn>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, type PropType } from 'vue'
import type { QInput, QMenu } from 'quasar'
import type { Member } from 'src/types/common.ts'
import { wsClient } from 'src/ws/client'

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
        },
        currentUser: {
            type: Object as PropType<Member | null>,
            default: null
        }
    },

    data() {
        return {
            showMenu: false,
            msg: '',
            maxChars: 500,
            commands: ['/list', '/join', '/invite', '/kick', '/cancel', '/revoke', '/quit'],
            emojis: [
                '😀','😁','😂','🤣','😊','😍','😎','😏','😢','😭','😡','🤔',
                '🤗','😇','🙃','😴','😜','😬','🥰','🤩','🤓','😈','👀','💅',
                '💫','🔥','✨','💖','💩','👍','👎','🙏','🙌','👏','💪','🤝',
                '😺','😸','😹','😻','😼','😽','🙀','😿','😾','🐱','🐈','🐈‍⬛'
            ]
        }
    },

    computed: {
        availableCommands(): string[] {
            const channel = this.activeChannel
            const user = this.currentUser
            const base = ['/join']

            if (!channel || !user) return base

            if (channel) {
                base.push('/list', '/cancel')
            }

            const members = this.membersByChannel[channel.id] || []
            const current = members.find(m => m.nickname === user.nickname)
            const isAdmin = current?.role === 'admin'
            const isPrivate = channel.private

            if (!isPrivate) {
                base.push('/invite', '/kick')
            }
            if (isPrivate && isAdmin) {
                base.push('/invite', '/revoke', '/kick')
            }
            if (isAdmin) {
                base.push('/quit')
            }
            return base
        },

        filteredSuggestions(): string[] {
            const text = this.msg
            if (text.startsWith('/')) {
                const input = text.slice(1).toLowerCase()
                return this.availableCommands.filter(cmd => cmd.startsWith('/' + input))
            }
            const match = text.match(/(?:^|\s)@([a-zA-Z0-9_]*)$/)
            if (match && this.activeChannel && this.membersByChannel) {
                const members = this.membersByChannel[this.activeChannel.id] || []
                const capture = match[1] || ''
                const input = capture.toLowerCase()
                return members
                    .map(m => '@' + m.nickname)
                    .filter(nick => nick.toLowerCase().startsWith('@' + input))
            }
            return []
        },

        cmdTarget (): Element | undefined {
            const input = this.$refs.cmdInput as QInput | undefined
            const el = input?.$el as HTMLElement | undefined
            return el?.querySelector('.q-field__control') || el
        },
        placeholderText(): string {
            return this.activeChannel ? 'Type a message or /command' : 'Type a /command'
        },
        canSend(): boolean {
            if (!this.msg.trim()) return false
            if (this.activeChannel) return true
            return this.msg.trim().startsWith('/')
        }
    },

    watch: {
        msg(val: string) {
            if (val.length > this.maxChars) {
                this.msg = val.slice(0, this.maxChars)
                return
            }
            this.$emit('typing', val)
            this.showMenu = this.filteredSuggestions.length > 0
            if (this.showMenu) {
                void nextTick(() => {
                    const menu = this.$refs.cmdMenu as QMenu | undefined
                    menu?.updatePosition?.()
                })
            }
        },
        filteredSuggestions () {
            if (this.showMenu) {
                void nextTick(() => {
                    const menu = this.$refs.cmdMenu as QMenu | undefined
                    menu?.updatePosition?.()
                })
            }
        }
    },

    methods: {
        selectSuggestion(suggestion: string) {
            if (suggestion.startsWith('/')) {
                this.msg = suggestion + ' '
            }
            else {
                const text = this.msg
                const match = text.match(/(@[a-zA-Z0-9_]*)$/)
                if (match) {
                    const lastIndex = text.lastIndexOf(match[0])
                    this.msg = text.substring(0, lastIndex) + suggestion + ' '
                } else {
                    this.msg += suggestion + ' '
                }
            }
            this.showMenu = false
            void nextTick(() => {
                const input = this.$refs.cmdInput as QInput
                input?.focus()
            })
        },

        sendMessage() {
            const text = this.msg.trim()
            if (!text) return


            if (text.startsWith('/')) {
                const regex = /[^\s"]+|"([^"]*)"/g
                const parts: string[] = []
                let match
                while ((match = regex.exec(text)) !== null) {
                    parts.push(match[1] ? match[1] : match[0])
                }
                if (parts.length > 0) {
                    const commandName = parts.shift()!.substring(1)
                    this.$emit('command', { command: commandName, args: parts })
                }
            }

            else {
                if (text.startsWith('@')) {
                    const [mention] = text.substring(1).split(' ')
                    this.$emit('mention', { mention })
                }

                if (this.activeChannel) {
                    wsClient.sendMessage(Number(this.activeChannel.id), text)
                } else {
                    this.$q.notify({ type: 'warning', message: 'You cannot send messages from settings.', position: 'top', timeout: 1000 })
                }
            }

            this.msg = ''
            this.showMenu = false
        },

        addEmoji(emoji: string) {
            this.msg += emoji
            const menu = this.$refs.emojiMenu as QMenu
            menu.hide()
        }
    },

    emits: ['command', 'message', 'mention', 'typing'],
})
</script>

<style scoped>
.icon-sm { width: 0; }
.suggestion { max-height: 400px; }
.emoji-grid { width: 260px; max-height: 200px; overflow-y: auto; }
.emoji-grid::-webkit-scrollbar { display: none; }
</style>
