<template>
    <div v-if="user" class="c-5 text-c-1">
        <q-toolbar class="q-px-md justify-between" style="min-height:72px">
            <div class="row items-center no-wrap">
                <div class="relative-position">
                    <q-avatar size="45px" class="q-mr-md">
                        <img :src="user.avatarUrl"/>
                    </q-avatar>
                    <q-icon name="circle" bordered size="11px" :color="statusColor" class="thick-outline absolute-bottom-right"/>
                </div>

                <div class="column col-grow set-width">
                    <p class="text-h6 q-ma-none ellipsis">{{user.nickname}}</p>
                    <p class="text-caption q-ma-none ellipsis">{{user.name}}</p>
                </div>
            </div>

            <div class="row items-center q-gutter-sm no-wrap">
                <q-chip v-if="user.role" dense size="md" class="q-ml-xs q-pa-sm text-c-1 c-3">Admin</q-chip>
                <template v-else>
                    <q-btn v-for="(btn, index) in filteredButtons" :key="index" flat round dense :icon="btn.icon" :color="'c-1'" @click="handleAction(btn.action)"/>
                </template>
            </div>
        </q-toolbar>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent ({
        name: 'ProfileBlock',

        props: {
            user: {
                type: Object,
                required: false,
                default: () => ({
                    nickname: 'Guest',
                    name: 'Anonymous user',
                    avatarUrl: '/avatars/default.png',
                    status: 'online'
                })
            },

            buttons: {
                type: Array as () => {
                    icon: string
                    action?: string
                }[],

                default: () => [
                    { icon: 'notifications_none', action: 'notify' },
                    { icon: 'settings', action: 'settings' }
                ]
            },

            isPrivate: {
                type: Boolean,
                required: false,
                default: false
            },

            isAdmin: {
                type: Boolean,
                required: false,
                default: false
            },
        },

        emits: ['action'],

        methods: {
            handleAction(action?: string) {
                if (action) this.$emit('action', action)
            }
        },

        computed: {
            statusColor(): string {
                switch (this.user.status) {
                    case 'online': return 'positive'
                    case 'dnd': return 'negative'
                    case 'offline': return 'grey'
                    default: return 'grey'
                }
            },

            filteredButtons() {
                return this.buttons.filter(btn => {
                    if (btn.action === 'remove') {
                        return this.isAdmin || !this.isPrivate
                    }
                    return true
                })
            }
        }
    })
</script>

<style scoped>
    .q-chip {
        font-size: 11px;
        border-radius: 15px;
    }

    .thick-outline {
        margin-right: 16%;
        border-width: 8px;
        border-radius: 50%;
        border-style: solid;
        border-color: var(--c-5);
        box-sizing: border-box;
    }

    .set-width {
        min-width: 0;
    }
</style>