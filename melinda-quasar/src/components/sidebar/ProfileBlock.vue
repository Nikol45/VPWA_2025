<template>
    <div v-if="user" class="c-5 text-c-1">
        <q-toolbar class="q-px-md justify-between" style="min-height:72px">
            <div class="row items-center">
                <div class="relative-position cursor-pointer">
                    <q-avatar size="45px" class="q-mr-md">
                        <img :src="resolvedAvatar"/>
                    </q-avatar>
                    <q-icon name="circle" bordered size="11px" :color="statusColor" class="thick-outline absolute-bottom-right"/>

                    <!-- Menu pre zmenu statusu (zobrazí sa len ak som to ja) -->
                    <q-menu v-if="!user.role && isMe" anchor="bottom right" self="top left">
                        <q-list style="min-width: 100px">
                            <q-item clickable v-close-popup @click="changeStatus('online')">
                                <q-item-section avatar><q-icon color="positive" name="circle" size="xs" /></q-item-section>
                                <q-item-section>Online</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup @click="changeStatus('dnd')">
                                <q-item-section avatar><q-icon color="negative" name="remove_circle" size="xs" /></q-item-section>
                                <q-item-section>Do Not Disturb</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup @click="changeStatus('offline')">
                                <q-item-section avatar><q-icon color="grey" name="circle" size="xs" /></q-item-section>
                                <q-item-section>Offline</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </div>

                <div class="set-width">
                    <p class="text-h6 q-ma-none ellipsis">{{user.name}}</p>
                    <p class="text-caption q-ma-none ellipsis">{{user.nickname}}</p>
                </div>
            </div>

            <div class="row items-center q-gutter-sm no-wrap">
                <q-chip v-if="user.role" dense size="md" class="q-ml-xs q-pa-sm text-c-1 c-3">Admin</q-chip>
                <template v-if="!user.role">
                    <template v-for="(btn, index) in filteredButtons" :key="index">
                        <q-btn v-if="btn.action === 'notify'" flat round dense :icon="btn.icon" color="c-1" ref="notifBtn">
                            <q-badge v-if="mappedNotifications.length > 0" color="red" floating rounded>{{ mappedNotifications.length }}</q-badge>
                            <q-menu anchor="bottom right" self="top right" transition-show="jump-down" transition-hide="jump-up" class="shadow-3 c-2 text-c-5 rad-15 q-py-sm">
                                <div class="q-pa-sm notif">
                                    <div v-if="mappedNotifications.length === 0" class="text-center q-pa-md text-c-3">
                                        Žiadne nové notifikácie
                                    </div>
                                    <q-list v-else>
                                        <q-item
                                            v-for="n in mappedNotifications"
                                            :key="n.id"
                                            clickable
                                            v-ripple
                                            class="rad-15"
                                            @click="onNotificationClick(n)"
                                        >
                                            <q-item-section avatar>
                                                <q-avatar size="36px" :icon="!n.avatar ? 'notifications' : undefined">
                                                    <img v-if="n.avatar" :src="resolveNotificationAvatar(n.avatar)" />
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label class="text-weight-bold">{{ n.title }}</q-item-label>
                                                <q-item-label caption class="text-c-5" style="white-space: pre-wrap;">
                                                    <span v-html="n.text"></span>
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                            </q-menu>
                        </q-btn>

                        <q-btn v-else flat round dense :icon="btn.icon" color="c-1" @click="handleAction(btn.action)"/>
                    </template>
                </template>
            </div>
        </q-toolbar>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useNotificationsStore } from 'src/stores/notifications'
import { useAuthStore } from 'src/stores/auth'
import type { Notification } from 'src/contracts'

interface NotificationItem {
    id: number
    title: string
    text: string
    avatar: string | null
    type: string
    channelId: number | null
}

export default defineComponent ({
    name: 'ProfileBlock',

    props: {
        user: {
            type: Object,
            required: false,
            default: () => ({
                nickname: 'guest',
                name: 'Anonymous user',
                avatarUrl: '/avatars/default.png',
                status: 'online'
            })
        },
        buttons: {
            type: Array as () => { icon: string, action?: string }[],
            default: () => [ { icon: 'notifications_none', action: 'notify' }, { icon: 'settings', action: 'settings' } ]
        },
        isPrivate: { type: Boolean, required: false, default: false },
        isAdmin: { type: Boolean, required: false, default: false },
    },

    setup() {
        const notificationsStore = useNotificationsStore()
        const authStore = useAuthStore()
        return { notificationsStore, authStore }
    },

    async mounted() {
        await this.notificationsStore.fetchNotifications()
    },

    methods: {
        handleAction(action?: string) {
            if (action) this.$emit('action', action)
        },

        async changeStatus(status: 'online' | 'dnd' | 'offline') {
            await this.authStore.updateStatus(status)
        },

        onNotificationClick(n: NotificationItem) {
            if (n.type === 'mention' && n.channelId) {
                void this.$router.push({ name: 'channel', params: { id: n.channelId } })
            }
        },

        resolveNotificationAvatar(path: string | null): string {
            if (!path) return ''
            const url = path
            if (url.startsWith('http') || url.startsWith('data:')) {
                return url
            }
            return `${import.meta.env.VITE_API_URL}${url}`
        }
    },

    emits: ['action'],

    computed: {
        isMe(): boolean {
            return this.authStore.user?.id === this.user.id
        },

        mappedNotifications(): NotificationItem[] {
            const templates: Record<string, { title: string, text: string }> = {
                'mention': { title: 'Spomenutie v kanáli', text: 'Používateľ {{sender}} vás spomenul v kanáli {{channel}}.' },
                'invite': { title: 'Pozvánka do kanála', text: 'Používateľ {{sender}} vás pozval do kanála {{channel}}.' },
                'vote_kick_start': { title: 'Hlasovanie o odstránení', text: 'Používateľ {{sender}} spustil hlasovanie o vašom odstránení z kanála {{channel}} (1/3).' },
                'vote_kick_new': { title: 'Nový hlas v hlasovaní', text: 'Používateľ {{sender}} pridal hlas k hlasovaniu o vašom odstránení z kanála {{channel}} (2/3).' },
                'vote_kick_final': { title: 'Finálne hlasovanie', text: 'Používateľ {{sender}} dokončil hlasovanie o vašom odstránení z kanála {{channel}} (3/3). Tým ste boli z kanála vylúčený.' },
                'removed_admin': { title: 'Odstránený administrátorom', text: 'Administrátor {{sender}} vás odstránil z kanála {{channel}}.' },
                'removed_vote': { title: 'Odstránený na základe hlasovania', text: 'Vaše členstvo v kanáli {{channel}} bolo ukončené výsledkom hlasovania členov.' },
                'channel_deleted_inactive': { title: 'Kanál zrušený pre neaktivitu', text: 'Kanál {{channel}} bol automaticky zrušený z dôvodu dlhodobej neaktivity.' },
                'channel_deleted_admin': { title: 'Kanál vymazaný administrátorom', text: 'Administrátor {{sender}} vymazal kanál {{channel}}.' },
                'added_to_channel': { title: 'Pridaný do kanála', text: 'Používateľ {{sender}} vás pridal do kanála {{channel}}.' },
                'ban_revoked': { title: 'Zrušený zákaz vstupu', text: 'Administrátor {{sender}} vám obnovil prístup do kanála {{channel}}.' }
            }

            const wrap = (v: string) => `<strong>${v}</strong>`

            return this.notificationsStore.items.map((n: Notification) => {
                const template = templates[n.type]

                const senderName =
                    n.sender?.nickname?.trim() ||
                    (n.senderId ? 'Niekto' : 'Systém')

                const channelName =
                    n.channel?.name?.trim() ||
                    (n.channelId ? 'neznámy kanál' : 'odstránený kanál')

                if (!template) {
                    return {
                        id: n.id,
                        title: 'Nové oznámenie',
                        text: 'Máte nové oznámenie.',
                        avatar: n.sender?.avatarUrl ?? null,
                        type: n.type,
                        channelId: n.channelId
                    }
                }

                const finalText = template.text
                    .replace('{{sender}}', wrap(senderName))
                    .replace('{{channel}}', wrap(channelName))

                return {
                    id: n.id,
                    title: template.title,
                    text: finalText,
                    avatar: n.sender?.avatarUrl ?? null,
                    type: n.type,
                    channelId: n.channelId
                }
            })
        },

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
                if (btn.action === 'remove') return this.isAdmin || !this.isPrivate
                return true
            })
        },

        resolvedAvatar(): string {
            const path = this.user.avatarUrl || '/avatars/users/default.png'
            if (path.startsWith('http') || path.startsWith('data:')) return path
            return `${import.meta.env.VITE_API_URL}${path}`
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
.set-width { width: 130px; }
.notif { min-width: 260px; max-width: 350px; max-height: 240px; overflow-y: auto; }
.notif::-webkit-scrollbar { display: none; }
</style>
