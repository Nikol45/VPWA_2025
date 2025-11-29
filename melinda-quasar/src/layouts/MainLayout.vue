<template>
    <q-layout view="lHh Lpr lFf" style="height: 100vh" class="overflow-hidden">
        <q-header :class="isSettingsRoute ? 'c-4 text-c-1' : 'c-4 text-c-1'">
            <q-toolbar v-if="isSettingsRoute">
                <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goBackToChannel" />
                <div class="row items-center">
                    <p class="text-h5 text-weight-bolder text-c-1 q-mb-none">Channel settings</p>
                </div>
                <q-space />
            </q-toolbar>

            <q-toolbar v-else-if="activeChannel">
                <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goHome" />
                <q-avatar size="28px" class="q-mr-sm">
                    <img :src="activeChannel!.avatar" :alt="activeChannel!.name" />
                </q-avatar>
                <div class="row items-center">
                    <div class="text-subtitle1">{{ activeChannel!.name }}</div>
                </div>
                <q-space />
                <q-btn v-if="activeChannel" flat round dense icon="group" class="q-mr-xs" aria-label="Toggle members" @click="toggleMembers" />
                <q-btn flat round dense icon="info" :to="{ name: 'channel-settings' }" />
            </q-toolbar>
            <q-toolbar v-else />
        </q-header>

        <q-drawer
            v-if="!isCompact || $route.name === 'home'"
            v-model="leftOpen"
            side="left"
            behavior="desktop"
            :width="isCompact ? $q.screen.width : 300"
            :overlay="isCompact"
            class="c-4 text-c-1 sidebar relative-position"
        >
            <div class="column fit">
                <profile-block :user="user" @action="handleProfileAction" />
                <search-filter v-model:filter="filter" v-model="search" class="responsive-padding" />
                <q-scroll-area class="col">
                    <q-list class="q-py-sm responsive-padding">
                        <channel-block v-for="c in filtered" :key="c.id" :channel="c" @click="goToChannel" @accept="acceptInvite" @decline="declineInvite" />
                    </q-list>
                </q-scroll-area>
                <q-btn v-if="$route.name !== 'home' || $q.screen.lt.sm" class="c-3 text-c-1 op-95 floating-add" round icon="add" size="22px" @click="createChannel" />
            </div>
        </q-drawer>

        <q-page-container class="c-1">
            <router-view v-if="isSettingsRoute" :current-user="user" />
            <router-view v-else />
        </q-page-container>

        <q-footer class="c-3 text-c-1 q-pa-md">
            <command-line v-if="isSettingsRoute" :current-user="user" @command="handleCommand" />
            <command-line
                v-else
                :current-user="user"
                :active-channel="activeChannel"
                :membersByChannel="membersByChannel"
                @command="handleCommand"
                @message="handleMessage"
                @mention="handleMention"
                @typing="onTyping"
            />
        </q-footer>
    </q-layout>

    <!-- Popups -->
    <SelectPopup v-model="showSelect" @create="openCreate" @join="openJoin" @search="openSearch" @update:modelValue="(v) => onDialogModel(v, 'channels')" />
    <CreatePopup v-model="showCreate" @back="backToSelect" @submit="handleCreate" @update:modelValue="(v) => onDialogModel(v, 'channels-create')" />
    <JoinPopup v-model="showJoin" @back="backToSelect" @submit="handleJoin" @update:modelValue="(v) => onDialogModel(v, 'channels-join')" />
    <SearchPopup v-model="showSearch" :results="searchResults" @back="backToSelect" @search="handleSearch" @join="handleJoinFromSearch" @update:modelValue="(v) => onDialogModel(v, 'channels-search')" />
    <MembersPopup v-model="showMembers" :members="activeMembers" :is-admin="activeChannel?.isAdmin || false" :is-private="activeChannel?.private || false" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CommandLine from 'src/components/CommandLine.vue';
import ProfileBlock from 'src/components/sidebar/ProfileBlock.vue';
import SearchFilter from 'src/components/sidebar/SearchFilter.vue';
import ChannelBlock from 'src/components/sidebar/ChannelBlock.vue';
import SelectPopup from 'src/components/popups/SelectPopup.vue';
import CreatePopup from 'src/components/popups/CreatePopup.vue';
import JoinPopup from 'src/components/popups/JoinPopup.vue';
import SearchPopup from 'src/components/popups/SearchPopup.vue';
import MembersPopup from 'src/components/popups/MembersPopup.vue';
import type { Member } from 'src/types/common.ts';
import 'vue-router';
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router';
import { useQuasar, type QVueGlobals } from 'quasar';
import { useChannelsStore } from 'src/stores/channels';
import { useAuthStore } from 'src/stores/auth';
import type { User as ApiUser, Channel as ApiChannel } from 'src/contracts';
import { channelService } from 'src/services';
import { wsClient } from 'src/ws/client';
import type { AxiosError } from 'axios';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $router: Router;
        $route: RouteLocationNormalizedLoaded;
        $q: QVueGlobals;
    }
}

type Visibility = 'all' | 'public' | 'private';

interface User {
    id: number;
    nickname: string;
    name: string;
    avatarUrl: string;
    status: 'online' | 'offline' | 'dnd';
    role: string;
}

interface SidebarChannel {
    id: string;
    name: string;
    members: number;
    private: boolean;
    avatar: string;
    invited: boolean;
    isMember: boolean;
    lastMessageAt?: number | undefined;
    isAdmin: boolean;
    inviteCode: string;
}

interface IncomingMessage {
    userId: number;
    text: string;
    user?: { nickname: string };
}

export default defineComponent({
    name: 'HomeLayout',
    components: {
        CommandLine,
        ProfileBlock,
        SearchFilter,
        ChannelBlock,
        SelectPopup,
        CreatePopup,
        JoinPopup,
        SearchPopup,
        MembersPopup,
    },

    setup() {
        const $q = useQuasar();
        const channelsStore = useChannelsStore();
        const authStore = useAuthStore();
        return { $q, channelsStore, authStore };
    },

    data() {
        return {
            leftOpen: true,
            search: '',
            filter: 'all' as Visibility,
            showSelect: false,
            showCreate: false,
            showJoin: false,
            showSearch: false,
            showMembers: false,
            membersByChannel: {} as Record<string, Member[]>,
            searchResults: [] as { id: string; name: string }[],
            wsJoinedChannel: null as string | null,
        };
    },

    computed: {
        isCompact(): boolean {
            return this.$q.screen.lt.sm;
        },

        user(): User {
            const apiUser = this.authStore.user as ApiUser | null;
            if (!apiUser) {
                return {
                    id: 0,
                    nickname: '',
                    name: '',
                    avatarUrl: '/avatars/users/default.png',
                    status: 'offline',
                    role: '',
                };
            }
            return {
                id: apiUser.id,
                nickname: apiUser.nickname,
                name: `${apiUser.firstName} ${apiUser.lastName}`,
                avatarUrl: apiUser.avatarUrl,
                status: apiUser.status,
                role: '',
            };
        },

        channels(): SidebarChannel[] {
            return this.channelsStore.sortedChannels.map((c: ApiChannel) => {
                let avatarPath = c.iconUrl || '/avatars/channels/default_channel.jpg';
                if (!avatarPath.startsWith('http') && !avatarPath.startsWith('data:')) {
                    avatarPath = `${import.meta.env.VITE_API_URL}${avatarPath}`;
                }

                return {
                    id: String(c.id),
                    name: c.name,
                    members: c.nMembers,
                    private: c.visibility === 'private',
                    avatar: avatarPath,
                    invited: c.isInvited,
                    isMember: c.isMember,
                    lastMessageAt: c.lastMessageAt ? new Date(c.lastMessageAt).getTime() : undefined,
                    isAdmin: c.isAdmin,
                    inviteCode: c.inviteCode,
                };
            });
        },

        filtered(): SidebarChannel[] {
            const s = this.search.trim().toLowerCase();
            const base = this.channels
                .filter(
                    (c) =>
                        this.filter === 'all' ||
                        (this.filter === 'public' && !c.private) ||
                        (this.filter === 'private' && c.private)
                )
                .filter((c) => (s ? c.name.toLowerCase().includes(s) : true));

            const invited = base.filter((c) => c.invited);
            const normal = base.filter((c) => !c.invited);
            normal.sort((a, b) => (b.lastMessageAt ?? 0) - (a.lastMessageAt ?? 0));
            return [...invited, ...normal];
        },

        activeChannel(): SidebarChannel | null {
            const id = this.$route.params.id as string | undefined;
            if (!id) return null;
            return this.channels.find((c) => c.id === id) ?? null;
        },

        activeMembers(): Member[] {
            const id = this.$route.params.id as string | undefined;
            return id ? this.membersByChannel[id] || [] : [];
        },

        isSettingsRoute(): boolean {
            return this.$route.name === 'profile-settings' || this.$route.name === 'channel-settings';
        },
    },

    watch: {
        '$route.name'() {
            this.updateLeftOpen();
        },

        isCompact() {
            this.updateLeftOpen();
        },

        '$route.query.modal': {
            immediate: true,
            async handler(v: unknown) {
                const m = typeof v === 'string' ? v : '';
                this.showSelect = m === 'channels';
                this.showCreate = m === 'channels-create';
                this.showJoin = m === 'channels-join';
                this.showSearch = m === 'channels-search';

                if (m === 'channels-search') {
                    await this.handleSearch('');
                }
            },
        },

        activeChannel: {
            async handler(newVal) {
                if (newVal) {
                    await this.loadMembers(newVal.id);
                }
                if (this.wsJoinedChannel) {
                    wsClient.leaveChannel(Number(this.wsJoinedChannel));
                }
                if (newVal) {
                    wsClient.joinChannel(Number(newVal.id));
                    this.wsJoinedChannel = newVal.id;
                }
            },
        },

        'activeChannel.members': {
            handler() {
                if (this.showMembers && this.activeChannel) {
                    void this.loadMembers(this.activeChannel.id);
                }
            },
        },

        showMembers(isOpen: boolean) {
            if (isOpen && this.activeChannel) {
                void this.loadMembers(this.activeChannel.id);
            }
        },

        'channelsStore.items': {
            deep: true,
            handler(newChannels: ApiChannel[]) {
                const currentIdStr = this.$route.params.id as string;
                if (!currentIdStr) return;
                const stillExists = newChannels.some((c) => String(c.id) === currentIdStr);
                if (!stillExists && (this.$route.name === 'channel' || this.$route.name === 'channel-settings')) {
                    void this.$router.push({ name: 'home' });
                }
            },
        },
    },

    beforeUnmount() {
        if (this.wsJoinedChannel) {
            wsClient.leaveChannel(Number(this.wsJoinedChannel));
        }
    },

    mounted() {
        if (this.user && this.user.id) {
            wsClient.connect(this.user.id);
        } else {
            wsClient.connect();
        }

        this.updateLeftOpen();
        void this.channelsStore.fetchChannels();

        if ('Notification' in window && Notification.permission === 'default') {
            void Notification.requestPermission();
        }

        wsClient.on('message:new', (data: unknown) => {
            const message = data as IncomingMessage;
            if (message.userId === this.user.id) return;
            this.handleIncomingNotification(message);
        });
    },

    methods: {
        handleIncomingNotification(message: IncomingMessage) {
            if (this.user.status === 'dnd') return;
            if (this.$q.appVisible) return;
            if ('Notification' in window && Notification.permission === 'granted') {
                const sender = message.user?.nickname || 'Someone';
                const text = message.text || 'Sent a message';
                new Notification(`New message from ${sender}`, {
                    body: text,
                    icon: '/icons/favicon-128x128.png',
                    tag: 'melinda-chat-msg',
                });
            }
        },

        async loadMembers(channelId: string) {
            const id = Number(channelId);
            if (!id) return;
            const members = await channelService.listMembers(id);
            this.membersByChannel[channelId] = members.map((m) => ({
                id: m.id,
                nickname: m.nickname,
                name: `${m.firstName} ${m.lastName}`,
                avatarUrl: m.avatarUrl || '/avatars/users/default.png',
                status: m.status,
                role: m.isAdmin ? 'admin' : '',
            }));
        },

        onDialogModel(v: boolean, modalKey: 'channels' | 'channels-create' | 'channels-join' | 'channels-search') {
            if (!v && this.$route.query.modal === modalKey) this.closeModal();
        },

        createChannel() {
            void this.$router.push({ query: { ...this.$route.query, modal: 'channels' } });
        },

        goModal(modal: string) {
            void this.$router.replace({ query: { ...this.$route.query, modal } });
        },

        closeModal() {
            const q = { ...this.$route.query };
            delete q.modal;
            void this.$router.replace({ query: q });
            this.showSelect = this.showCreate = this.showJoin = this.showSearch = false;
            this.searchResults = [];
        },

        openCreate() {
            this.goModal('channels-create');
        },

        openJoin() {
            this.goModal('channels-join');
        },

        openSearch() {
            this.goModal('channels-search');
        },

        backToSelect() {
            this.goModal('channels');
        },

        async handleCreate(payload: { name: string; privacy: 'public' | 'private'; image: File | null }) {
            try {
                const channel = await this.channelsStore.createChannel({
                    name: payload.name,
                    visibility: payload.privacy,
                    icon: payload.image,
                });

                this.$q.notify({
                    type: 'positive',
                    message: `Channel ${channel.name} created!`,
                    position: 'bottom-right',
                });

                this.goToChannel(channel);
            } catch (err) {
                const e = err as AxiosError<{ error: string }>;
                this.$q.notify({
                    type: 'negative',
                    message: e.response?.data?.error || 'Failed to create channel',
                    position: 'bottom-right',
                });
            }
            this.closeModal();
        },

        async handleJoin(payload: { code?: string }) {
            const inviteCode = (payload.code ?? '').trim()

            if (!inviteCode) {
                this.$q.notify({
                    type: 'warning',
                    message: 'Zadaj invite kód kanála, ktorý chceš joinúť.',
                })
                return
            }

            try {
                const channel = await channelService.joinByInviteCode(inviteCode)
                this.channelsStore.UPSERT_CHANNEL(channel)
                this.goToChannel(channel)

                this.$q.notify({
                    type: 'positive',
                    message: `Joined channel ${channel.name}`,
                    position: 'bottom-right',
                })
            } catch (err) {
                const e = err as AxiosError<{ error: string }>
                this.$q.notify({
                    type: 'negative',
                    message: e.response?.data?.error || 'Failed to join',
                    position: 'bottom-right',
                })
            }

            this.closeModal()
        },

        async handleSearch(query: string) {
            const q = query.trim();

            let channels: ApiChannel[];
            try {
                channels = await channelService.searchPublic(q);
            } catch {
                this.searchResults = [];
                return;
            }

            const sorted = [...channels].sort((a, b) => {
                if (b.nMembers !== a.nMembers) {
                    return b.nMembers - a.nMembers;
                }
                return a.name.localeCompare(b.name);
            });

            const top = sorted.slice(0, 5);

            this.searchResults = top.map((c) => ({
                id: String(c.id),
                name: c.name,
            }));
        },

        async handleJoinFromSearch(item: { id: string; name: string }) {
            const name = item.name.trim();
            if (!name) return;

            try {
                const channel = await channelService.joinByName({
                    name,
                    visibility: 'public',
                });
                this.channelsStore.UPSERT_CHANNEL(channel);
                this.goToChannel(channel);

                this.$q.notify({
                    type: 'positive',
                    message: `Joined channel ${channel.name}`,
                    position: 'bottom-right',
                });
            } catch (err) {
                const e = err as AxiosError<{ error: string }>;
                this.$q.notify({
                    type: 'negative',
                    message: e.response?.data?.error || 'Failed to join',
                    position: 'bottom-right',
                });
            }

            this.closeModal();
        },

        updateLeftOpen() {
            if (this.isCompact) {
                this.leftOpen = this.$route.name === 'home';
            } else {
                this.leftOpen = true;
            }
        },

        goToChannel(c: { id: string | number }) {
            if (this.$route.params.id === c.id) return;
            void this.$router.push({ name: 'channel', params: { id: c.id } });
        },

        async acceptInvite(c: SidebarChannel) {
            const joined = await channelService.joinByName({ name: c.name });
            this.channelsStore.UPSERT_CHANNEL(joined);
        },

        async declineInvite(c: SidebarChannel) {
            const id = Number(c.id);
            await this.channelsStore.declineInvite(id);
            this.$q.notify({
                type: 'info',
                message: `Declined invitation to ${c.name}`,
                position: 'bottom-right',
                timeout: 1000,
            });
        },

        handleMessage() {},

        handleMention() {},

        goBackToChannel() {
            const id = this.$route.params.id;
            if (id) {
                void this.$router.push({ name: 'channel', params: { id } });
            } else {
                void this.$router.back();
            }
        },

        goHome() {
            void this.$router.push({ name: 'home' });
        },

        handleProfileAction(action: string) {
            switch (action) {
                case 'settings':
                    void this.$router.push({ name: 'profile-settings' });
                    break;
                case 'notify':
                    break;
            }
        },

        async handleCommand({ command, args }: { command: string; args: string[] }) {
            const cmd = command.toLowerCase();
            const channelId = this.activeChannel ? Number(this.activeChannel.id) : 0;

            if (cmd === 'join') {
                const [channelName, visibilityArg] = args;
                if (!channelName) {
                    this.$q.notify({
                        type: 'warning',
                        message: 'Usage: /join channelName [private]',
                    });
                    return;
                }
                const visibility = visibilityArg === 'private' ? 'private' : 'public';
                try {
                    const channel = await channelService.joinByName({ name: channelName, visibility });
                    this.channelsStore.UPSERT_CHANNEL(channel);
                    this.goToChannel(channel);
                    this.$q.notify({
                        type: 'positive',
                        message: `Joined channel ${channel.name}`,
                    });
                } catch (err) {
                    const e = err as AxiosError<{ error: string }>;
                    this.$q.notify({
                        type: 'negative',
                        message: e.response?.data?.error || 'Failed to join',
                    });
                }
                return;
            }

            if (!this.activeChannel) {
                this.$q.notify({
                    type: 'warning',
                    message: 'You must be in a channel to use this command.',
                });
                return;
            }

            switch (cmd) {
                case 'list':
                    void this.toggleMembers();
                    break;

                case 'invite': {
                    const [nickname] = args;
                    if (!nickname) {
                        this.$q.notify({
                            type: 'warning',
                            message: 'Usage: /invite nickname',
                        });
                        return;
                    }
                    try {
                        const res = await channelService.invite(channelId, { nickname });
                        if (res.invited) {
                            this.$q.notify({
                                type: 'positive',
                                message: `Invited @${nickname}`,
                            });
                        } else {
                            this.$q.notify({
                                type: 'info',
                                message: res.message || 'User already involved',
                            });
                        }
                    } catch (err) {
                        const e = err as AxiosError<{ error: string }>;
                        this.$q.notify({
                            type: 'negative',
                            message: e.response?.data?.error || 'Invite failed',
                        });
                    }
                    break;
                }

                case 'kick': {
                    const [nickname] = args;
                    if (!nickname) {
                        this.$q.notify({
                            type: 'warning',
                            message: 'Usage: /kick nickname',
                        });
                        return;
                    }
                    try {
                        const res = await channelService.kick(channelId, nickname);
                        if (res.banned) {
                            this.$q.notify({
                                type: 'positive',
                                message: res.message,
                            });
                        } else {
                            this.$q.notify({
                                type: 'info',
                                message: res.message,
                            });
                        }
                    } catch (err) {
                        const e = err as AxiosError<{ error: string }>;
                        this.$q.notify({
                            type: 'negative',
                            message: e.response?.data?.error || 'Kick failed',
                        });
                    }
                    break;
                }

                case 'revoke': {
                    const [nickname] = args;
                    if (!nickname) {
                        this.$q.notify({
                            type: 'warning',
                            message: 'Usage: /revoke nickname',
                        });
                        return;
                    }
                    try {
                        await channelService.revoke(channelId, nickname);
                        this.$q.notify({
                            type: 'positive',
                            message: `Revoked @${nickname}`,
                        });
                    } catch (err) {
                        const e = err as AxiosError<{ error: string }>;
                        this.$q.notify({
                            type: 'negative',
                            message: e.response?.data?.error || 'Revoke failed',
                        });
                    }
                    break;
                }

                case 'quit': {
                    if (!this.activeChannel.isAdmin) {
                        this.$q.notify({
                            type: 'negative',
                            message: 'Only admin can use /quit to delete channel',
                        });
                        return;
                    }
                    try {
                        await this.channelsStore.deleteChannel(channelId);
                    } catch (err) {
                        const e = err as AxiosError<{ error: string }>;
                        this.$q.notify({
                            type: 'negative',
                            message: e.response?.data?.error || 'Failed to delete',
                        });
                    }
                    break;
                }

                case 'cancel':
                    await this.channelsStore.leaveChannel(channelId);
                    void this.$router.push({ name: 'home' });
                    break;

                default:
                    this.$q.notify({
                        type: 'warning',
                        message: `Unknown command: /${cmd}`,
                    });
            }
        },

        async toggleMembers() {
            const active = this.activeChannel;
            if (!active) return;
            if (!this.membersByChannel[active.id]) {
                await this.loadMembers(active.id);
            }
            this.showMembers = !this.showMembers;
        },

        onTyping(text: string) {
            const c = this.activeChannel;
            if (!c) return;
            wsClient.sendTyping(Number(c.id), text.length > 0, text);
        },
    },
});
</script>

<style scoped>
.message-input :deep(.q-field__control) {
    background-color: var(--c-4);
}
.search-input :deep(.q-field__control) {
    background-color: var(--c-3);
}

.floating-add {
    position: absolute;
    right: 40px;
    bottom: 30px;
}

@media (min-width: 350px) and (max-width: 590px) {
    .responsive-padding {
        padding-left: 20px;
        padding-right: 20px;
    }
}

:deep(.q-dialog__backdrop) {
    backdrop-filter: blur(4px);
}
</style>
