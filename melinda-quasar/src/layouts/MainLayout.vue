<template>
  <q-layout view="lHh Lpr lFf">
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

        <q-btn
          v-if="activeChannel"
          flat
          round
          dense
          icon="group"
          class="q-mr-xs"
          aria-label="Toggle members"
          @click="toggleMembers"
        />

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

        <search-filter
          v-model:filter="filter"
          v-model="search"
          class="responsive-padding"
        />

        <q-scroll-area class="col">
          <q-list class="q-py-sm responsive-padding">
            <channel-block
              v-for="c in filtered"
              :key="c.id"
              :channel="c"
              @click="goToChannel"
              @accept="acceptInvite"
              @decline="declineInvite"
            />
          </q-list>
        </q-scroll-area>

        <q-btn
          v-if="$route.name !== 'home' || $q.screen.lt.sm"
          class="c-3 text-c-1 op-95 floating-add"
          round
          icon="add"
          size="22px"
          @click="createChannel"
        />
      </div>
    </q-drawer>

    <q-page-container class="c-1">
      <router-view v-if="isSettingsRoute" :current-user="user" />
      <router-view v-else />
    </q-page-container>

    <q-footer class="c-3 text-c-1 q-pa-md">
      <command-line
        v-if="isSettingsRoute"
        :current-user="user"
        @command="handleCommand"
      />
      <command-line
        v-else
        :current-user="user"
        :active-channel="activeChannel"
        :membersByChannel="membersByChannel"
        @command="handleCommand"
        @message="handleMessage"
        @mention="handleMention"
        @input="onTyping"
      />
    </q-footer>
  </q-layout>

  <SelectPopup
    v-model="showSelect"
    @create="openCreate"
    @join="openJoin"
    @search="openSearch"
    @update:modelValue="v => onDialogModel(v, 'channels')"
  />

  <CreatePopup
    v-model="showCreate"
    @back="backToSelect"
    @submit="handleCreate"
    @update:modelValue="v => onDialogModel(v, 'channels-create')"
  />

  <JoinPopup
    v-model="showJoin"
    @back="backToSelect"
    @submit="handleJoin"
    @update:modelValue="v => onDialogModel(v, 'channels-join')"
  />

  <SearchPopup
    v-model="showSearch"
    :results="searchResults"
    @back="backToSelect"
    @search="handleSearch"
    @join="handleJoinFromSearch"
    @update:modelValue="v => onDialogModel(v, 'channels-search')"
  />

  <MembersPopup
    v-model="showMembers"
    :members="activeMembers"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CommandLine from 'src/components/CommandLine.vue'
import ProfileBlock from 'src/components/sidebar/ProfileBlock.vue'
import SearchFilter from 'src/components/sidebar/SearchFilter.vue'
import ChannelBlock from 'src/components/sidebar/ChannelBlock.vue'

import SelectPopup from 'src/components/popups/SelectPopup.vue'
import CreatePopup from 'src/components/popups/CreatePopup.vue'
import JoinPopup from 'src/components/popups/JoinPopup.vue'
import SearchPopup from 'src/components/popups/SearchPopup.vue'

import MembersPopup from 'src/components/popups/MembersPopup.vue'
import type { Member } from 'src/types/common.ts'

import 'vue-router'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { QVueGlobals } from 'quasar'
import { useChannelsStore } from 'src/stores/channels'
import { useAuthStore } from 'src/stores/auth'
import type { User as ApiUser } from 'src/contracts'
import type { ChannelVisibility } from 'src/contracts'
import { channelService } from 'src/services'
import { wsClient } from 'src/ws/client'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
    $route: RouteLocationNormalizedLoaded
    $q: QVueGlobals
  }
}

type Visibility = 'all' | 'public' | 'private'

interface User {
  id: number
  nickname: string
  name: string
  avatarUrl: string
  status: 'online' | 'offline' | 'dnd'
  role: string
}

interface Channel {
  id: string
  name: string
  members: number
  private: boolean
  avatar: string
  invited: boolean
  lastMessageAt?: number | undefined
}

interface CreateChannelPayload {
  name: string
  visibility: ChannelVisibility
  iconUrl?: string
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
    const channelsStore = useChannelsStore()
    const authStore = useAuthStore()

    return {
      channelsStore,
      authStore,
    }
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
      wsJoinedChannel: null
    }
  },

  computed: {
    isCompact(): boolean {
      return this.$q.screen.lt.sm
    },

    user(): User {
      const apiUser = this.authStore.user as ApiUser | null

      if (!apiUser) {
        return {
          id: 0,
          nickname: '',
          name: '',
          avatarUrl: '/avatars/users/default.png',
          status: 'offline',
          role: '',
        }
      }

      return {
        id: apiUser.id,
        nickname: apiUser.nickname,
        name: `${apiUser.firstName} ${apiUser.lastName}`,
        avatarUrl: apiUser.avatarUrl,
        status: apiUser.status,
        role: '',
      }
    },

    channels(): Channel[] {
      return this.channelsStore.sortedChannels.map((c) => ({
        id: String(c.id),
        name: c.name,
        members: c.nMembers,
        private: c.visibility === 'private',
        avatar: c.iconUrl || '/avatars/channels/default.png',
        invited: c.isInvited,
        lastMessageAt: c.lastMessageAt ? new Date(c.lastMessageAt).getTime() : undefined,
      }))
    },

    filtered(): Channel[] {
      const s = this.search.trim().toLowerCase()

      const base = this.channels
        .filter(
          (c) =>
            this.filter === 'all' ||
            (this.filter === 'public' && !c.private) ||
            (this.filter === 'private' && c.private)
        )
        .filter((c) => (s ? c.name.toLowerCase().includes(s) : true))

      const invited = base.filter((c) => c.invited)
      const normal = base.filter((c) => !c.invited)

      normal.sort((a, b) => (b.lastMessageAt ?? 0) - (a.lastMessageAt ?? 0))

      return [...invited, ...normal]
    },

    activeChannel(): Channel | null {
      const id = this.$route.params.id as string | undefined
      if (!id) return null
      return this.channels.find((c) => c.id === id) ?? null
    },

    activeMembers(): Member[] {
      const id = this.$route.params.id as string | undefined
      return id ? this.membersByChannel[id] || [] : []
    },

    isSettingsRoute(): boolean {
      return this.$route.path.startsWith('/home/settings')
    },
  },

  watch: {
    '$route.name'() {
      this.updateLeftOpen()
    },
    isCompact() {
      this.updateLeftOpen()
    },

    '$route.query.modal': {
      immediate: true,
      handler(v: unknown) {
        const m = typeof v === 'string' ? v : ''
        this.showSelect = m === 'channels'
        this.showCreate = m === 'channels-create'
        this.showJoin = m === 'channels-join'
        this.showSearch = m === 'channels-search'
      },
    },

    activeChannel: {
      async handler(newVal) {
        if (newVal && this.showMembers) {
          await this.loadMembers(newVal.id)
        }

        if (this.wsJoinedChannel) {
          wsClient.leaveChannel(Number(this.wsJoinedChannel))
        }

        if (newVal) {
          wsClient.joinChannel(Number(newVal.id))
          this.wsJoinedChannel = newVal.id
        }
      },
    },
  },

  beforeUnmount() {
    if (this.wsJoinedChannel) {
      wsClient.leaveChannel(Number(this.wsJoinedChannel))
    }
  },

  mounted() {
    wsClient.connect()
    this.updateLeftOpen()
    void this.channelsStore.fetchChannels()
  },

  methods: {
    async loadMembers(channelId: string) {
      const id = Number(channelId)
      if (!id) return
      const members = await channelService.listMembers(id)
      this.membersByChannel[channelId] = members as unknown as Member[]
    },

    onDialogModel(
      v: boolean,
      modalKey: 'channels' | 'channels-create' | 'channels-join' | 'channels-search'
    ) {
      if (!v && this.$route.query.modal === modalKey) this.closeModal()
    },

    createChannel() {
      void this.$router.push({ query: { ...this.$route.query, modal: 'channels' } })
    },

    goModal(modal: string) {
      void this.$router.replace({ query: { ...this.$route.query, modal } })
    },

    closeModal() {
      const q = { ...this.$route.query }
      delete q.modal
      void this.$router.replace({ query: q })
      this.showSelect = this.showCreate = this.showJoin = this.showSearch = false
      this.searchResults = []
    },

    openCreate() {
      this.goModal('channels-create')
    },
    openJoin() {
      this.goModal('channels-join')
    },
    openSearch() {
      this.goModal('channels-search')
    },
    backToSelect() {
      this.goModal('channels')
    },

    async handleCreate(payload: CreateChannelPayload) {
      await this.channelsStore.createChannel(payload)
      this.closeModal()
    },

    handleJoin() {
      this.closeModal()
    },

    handleSearch(query: string) {
      if (!query.trim()) {
        this.searchResults = []
        return
      }
      this.searchResults = []
    },

    handleJoinFromSearch() {
      this.closeModal()
    },

    updateLeftOpen() {
      if (this.isCompact) {
        this.leftOpen = this.$route.name === 'home'
      } else {
        this.leftOpen = true
      }
    },

    goToChannel(c: Channel) {
      if (this.$route.params.id === c.id) return
      void this.$router.push({ name: 'channel', params: { id: c.id } })
    },

    async acceptInvite(c: Channel) {
      const joined = await channelService.joinByName({ name: c.name })
      this.channelsStore.UPSERT_CHANNEL(joined)
    },

    declineInvite(c: Channel) {
      const id = Number(c.id)
      this.channelsStore.REMOVE_CHANNEL(id)
    },

    handleMessage() {},

    handleMention() {},

    goBackToChannel() {
      const id = this.$route.params.id
      if (id) {
        void this.$router.push({ name: 'channel', params: { id } })
      } else {
        void this.$router.back()
      }
    },

    goHome() {
      void this.$router.push({ name: 'home' })
    },

    handleProfileAction(action: string) {
      switch (action) {
        case 'settings':
          void this.$router.push({ name: 'profile-settings' })
          break
        case 'notify':
          break
      }
    },

    handleCommand({ command }: { command: string; args: string[] }) {
      if (this.isSettingsRoute) {
        if (!command.startsWith('/')) return

        const name = command.slice(1)
        switch (name) {
          case 'list':
            void this.toggleMembers()
            break
          default:
        }
        return
      }

      switch (command) {
        case 'list':
          if (this.activeChannel) {
            void this.toggleMembers()
          }
          break
      }
    },

    async toggleMembers() {
      const active = this.activeChannel
      if (!active) return

      if (!this.membersByChannel[active.id]) {
        await this.loadMembers(active.id)
      }

      this.showMembers = !this.showMembers
    },

    onTyping(text: string) {
      const c = this.activeChannel
      if (!c) return
      wsClient.sendTyping(Number(c.id), text.length > 0, text)
    }
  },
})
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
