<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="c-3 text-c-1">
      <q-toolbar v-if="activeChannel">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goHome" />
        <q-avatar size="28px" class="q-mr-sm">
          <img :src="activeChannel!.avatar" :alt="activeChannel!.name" />
        </q-avatar>
        <div class="row items-center">
          <div class="text-subtitle1">{{ activeChannel!.name }}</div>
        </div>
        <q-space />

        <q-btn v-if="activeChannel"
          flat round dense icon="group" class="q-mr-xs"
               aria-label="Toggle members" @click="toggleMembers"/>

        <q-btn flat round dense icon="info" :to="{ name: 'channel-settings' }" />
      </q-toolbar>

      <q-toolbar v-else />
    </q-header>

    <q-drawer
      v-if="!isCompact || $route.name === 'home'"
      v-model="leftOpen" side="left"  behavior="desktop"
      :width="isCompact ? $q.screen.width : 300"
      :overlay="isCompact" class="c-4 text-c-1 sidebar relative-position"
    >
      <div class="column fit">
        <profile-block :user="user" @action="handleProfileAction"></profile-block>

        <search-filter v-model:filter="filter" v-model="search" class = "responsive-padding"></search-filter>

        <q-scroll-area class="col">
          <q-list class="q-py-sm responsive-padding">
            <channel-block
              v-for="c in filtered"
              :key="c.id"
              :channel="c"
              @click="goToChannel"
            ></channel-block>
          </q-list>
        </q-scroll-area>

        <q-btn v-if="$route.name !== 'home' || $q.screen.lt.sm"
          class="c-3 text-c-1 op-95 floating-add"
          round icon="add" size="22px" @click="createChannel"
        />
      </div>
    </q-drawer>

    <q-page-container class="c-1">
      <router-view />
    </q-page-container>

    <q-footer class="c-3 text-c-1 q-pa-md">
      <command-line :active-channel="activeChannel" :membersByChannel="membersByChannel" @command="handleCommand" @message="handleMessage" @mention="handleMention"></command-line>
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
import JoinPopup   from 'src/components/popups/JoinPopup.vue'
import SearchPopup from 'src/components/popups/SearchPopup.vue'

import MembersPopup from 'src/components/popups/MembersPopup.vue'
import type { Member } from 'src/types/common.ts'

import 'vue-router'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { QVueGlobals } from 'quasar'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
    $route: RouteLocationNormalizedLoaded
    $q: QVueGlobals
  }
}

type Visibility = 'all' | 'public' | 'private'

interface User {
  nickname: string
  name: string
  avatarUrl: string
  status: string
}

interface Channel {
  id: string
  name: string
  members: number
  private: boolean
  avatar: string
  invited: boolean
}

export default defineComponent({
  name: 'HomeLayout',
  components: { CommandLine, ProfileBlock, SearchFilter, ChannelBlock,
    SelectPopup, CreatePopup, JoinPopup, SearchPopup, MembersPopup
  },

  data() {
    return {
      leftOpen: true,
      search: '',
      filter: 'all' as Visibility,
      msg: '',

      user: {
        nickname: 'FireFly x3',
        name: 'Svetlana Pivarčiová',
        avatarUrl: '/avatars/users/firefly.jpg',
        status: 'online'
      } as User,

      channels: [
        { id: '1',  name: 'FIIT STU',            members: 1216, private: false, avatar: '/avatars/channels/FIIT.png',       invited: true},
        { id: '2',  name: 'Ženy na FIIT',        members: 3,    private: true,  avatar: '/avatars/channels/zeny.png',       invited: false},
        { id: '3',  name: 'Študenti Fiit 3. r.', members: 621,  private: false, avatar: '/avatars/channels/tretiacky.png',  invited: false},
        { id: '4',  name: 'Share & Care',        members: 27,   private: true,  avatar: '/avatars/channels/cerveny.png',    invited: false},
        { id: '5',  name: 'FIIT STU',            members: 1216, private: false, avatar: '/avatars/channels/FIIT.png',       invited: false},
        { id: '6',  name: 'Ženy na FIIT',        members: 3,    private: true,  avatar: '/avatars/channels/zeny.png',       invited: false},
        { id: '7',  name: 'Študenti Fiit 3. r.', members: 621,  private: false, avatar: '/avatars/channels/tretiacky.png',  invited: false},
        { id: '8',  name: 'FIIT STU',            members: 1216, private: false, avatar: '/avatars/channels/FIIT.png',       invited: false},
        { id: '9',  name: 'Ženy na FIIT',        members: 3,    private: true,  avatar: '/avatars/channels/zeny.png',       invited: false},
        { id: '10', name: 'Študenti Fiit 3. r.', members: 621,  private: false, avatar: '/avatars/channels/tretiacky.png',  invited: false},
        { id: '11', name: 'Share & Care',        members: 27,   private: true,  avatar: '/avatars/channels/cerveny.png',    invited: false}
      ] as Channel[],

      showSelect: false,
      showCreate: false,
      showJoin:   false,
      showSearch: false,
      showMembers: false,

      membersByChannel: {
        '1': [
          { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
          { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' },
          { id: 4, nickname: 'Peťo', name: 'Peter Ďurčo', avatarUrl: '/avatars/users/peto.png', status: 'dnd' },
          { id: 5, nickname: 'Betka', name: 'Betka Zat', avatarUrl: '/avatars/users/betka.png', status: 'dnd' }
        ],
        '2': [
          { id: 1, nickname: 'Firefly', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'away' },
          { id: 3, nickname: 'Simi', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' },
          { id: 4, nickname: 'Peto', name: 'Peter Ďurčo', avatarUrl: '/avatars/users/peto.png', status: 'dnd' },
          { id: 5, nickname: 'Betty', name: 'Betka Zat', avatarUrl: '/avatars/users/betka.png', status: 'online' },
          { id: 6, nickname: 'Luki', name: 'Lukáš Novák', avatarUrl: '/avatars/users/default.png', status: 'offline' },
          { id: 7, nickname: 'Maro', name: 'Marek Kováč', avatarUrl: '/avatars/users/default.png', status: 'away' },
          { id: 8, nickname: 'Janča', name: 'Jana Hrivnáková', avatarUrl: '/avatars/users/default.png', status: 'dnd' },
          { id: 9, nickname: 'Tomino', name: 'Tomáš Blažek', avatarUrl: '/avatars/users/default.png', status: 'online' }
        ],
        '3': [
          { id: 1, nickname: 'Ady', name: 'Adrián Holub', avatarUrl: '/avatars/users/default.png', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Zuzi', name: 'Zuzana Kmeťová', avatarUrl: '/avatars/users/default.png', status: 'away' },
          { id: 3, nickname: 'Romo', name: 'Roman Šulc', avatarUrl: '/avatars/users/default.png', status: 'offline' },
          { id: 4, nickname: 'Katka', name: 'Katarína Benková', avatarUrl: '/avatars/users/default.png', status: 'dnd' },
          { id: 5, nickname: 'Dodo', name: 'Dominik Ondruš', avatarUrl: '/avatars/users/default.png', status: 'online' },
          { id: 6, nickname: 'Miška', name: 'Michaela Králová', avatarUrl: '/avatars/users/default.png', status: 'away' },
          { id: 7, nickname: 'Juro', name: 'Juraj Oravec', avatarUrl: '/avatars/users/default.png', status: 'offline' },
          { id: 8, nickname: 'Viki', name: 'Viktor Lipnický', avatarUrl: '/avatars/users/default.png', status: 'online' },
          { id: 9, nickname: 'Patres', name: 'Patrik Borovský', avatarUrl: '/avatars/users/default.png', status: 'dnd' },
          { id: 10, nickname: 'Leny', name: 'Lenka Hrušková', avatarUrl: '/avatars/users/default.png', status: 'away' },
          { id: 11, nickname: 'Stano', name: 'Stanislav Hrubý', avatarUrl: '/avatars/users/default.png', status: 'online' },
          { id: 12, nickname: 'Evka', name: 'Eva Mihálová', avatarUrl: '/avatars/users/default.png', status: 'offline' },
          { id: 13, nickname: 'Borka', name: 'Barbora Čechová', avatarUrl: '/avatars/users/default.png', status: 'online' },
          { id: 14, nickname: 'Maťo', name: 'Martin Švec', avatarUrl: '/avatars/users/default.png', status: 'away' }
        ],
        '4': [
          { id: 1, nickname: 'Táňa', name: 'Tatiana Gregorová', avatarUrl: '/avatars/users/default.png', role: 'admin', status: 'away' },
          { id: 2, nickname: 'Boro', name: 'Boris Kajan', avatarUrl: '/avatars/users/default.png', status: 'online' },
          { id: 3, nickname: 'Iva', name: 'Ivona Pavlíková', avatarUrl: '/avatars/users/default.png', status: 'offline' },
          { id: 4, nickname: 'Rišo', name: 'Richard Valach', avatarUrl: '/avatars/users/default.png', status: 'dnd' },
          { id: 5, nickname: 'Feri', name: 'František Šimko', avatarUrl: '/avatars/users/default.png', status: 'online' },
          { id: 6, nickname: 'Naty', name: 'Natália Žideková', avatarUrl: '/avatars/users/default.png', status: 'away' },
          { id: 7, nickname: 'Pali', name: 'Pavol Čierny', avatarUrl: '/avatars/users/default.png', status: 'offline' },
          { id: 8, nickname: 'Sáruš', name: 'Sára Lednická', avatarUrl: '/avatars/users/default.png', status: 'online' }
        ],
        '5': [
          { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
          { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
        ],
        '6': [
          { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
          { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
        ],
        '7': [
          { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
          { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
        ],
        '8': [
          { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
          { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
        ],
        '9': [
          { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
          { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
        ],
        '10': [
          { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
          { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
        ],
        '11': [
          { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
          { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
          { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
        ]
      } as Record<string, Member[]>,
      searchResults: [] as { id:string; name:string }[]
    }
  },

  computed: {

    isCompact(): boolean { return this.$q.screen.lt.sm },

    filtered(): Channel[] {
      const s = this.search.trim().toLowerCase()
      return this.channels.filter(c => this.filter === 'all' ||(this.filter === 'public' && !c.private) || (this.filter === 'private' && c.private)).filter(c => (s ? c.name.toLowerCase().includes(s) : true))
    },

    activeChannel(): Channel | null {
      const id = this.$route.params.id as string | undefined
      if (!id) return null
      return this.channels.find(c => c.id === id) ?? null
    },

    activeMembers(): Member[] {
      const id = this.$route.params.id as string | undefined
      return id ? (this.membersByChannel[id] || []) : []
    }
  },

  watch: {
    '$route.name'() { this.updateLeftOpen() },
    isCompact() { this.updateLeftOpen() },

    '$route.query.modal': {
      immediate: true,
      handler(v: unknown) {
        const m = typeof v === 'string' ? v : ''
        this.showSelect = m === 'channels'
        this.showCreate = m === 'channels-create'
        this.showJoin   = m === 'channels-join'
        this.showSearch = m === 'channels-search'
      }
    }
  },

  mounted() { this.updateLeftOpen() },

  methods: {
    onDialogModel(v: boolean, modalKey: 'channels'|'channels-create'|'channels-join'|'channels-search') {
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


    openCreate() { this.goModal('channels-create') },
    openJoin()   { this.goModal('channels-join') },
    openSearch() { this.goModal('channels-search') },
    backToSelect() { this.goModal('channels') },

    // submit create
    handleCreate() {
      this.closeModal()
    },

    // submit join
    handleJoin() {
      this.closeModal()
    },

    // search
    handleSearch(query: string) {
      const all = [
        { id: '1', name: 'Study Together' },
        { id: '2', name: 'Frontend Guild' },
        { id: '3', name: 'Anime Soul' }
      ]
      this.searchResults = query
        ? all.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
        : []
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
      if (c.invited) {
        c.invited = false
      }
      if (this.$route.params.id === c.id) return
      void this.$router.push({ name: 'channel', params: { id: c.id } })
    },

    handleMessage() {
    },

    handleMention() {

    },

    goHome() {
      void this.$router.push({ name: 'home' })
    },

    handleProfileAction(action: string) {
      switch (action) {
        case 'settings': 
          void this.$router.push({ name: 'profile-settings' });
          break
        case 'notify':
          ;
          break
      }
    },

    handleCommand({ command, args }: { command: string, args: string[] }) {
      switch (command) {
        case 'list':
          this.toggleMembers()
          break
        default:
          console.log('Unknown command:', command, args)
      }
    },

    toggleMembers(){
      this.showMembers = !this.showMembers
    }
  }
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

:deep(.q-dialog__backdrop) { backdrop-filter: blur(4px); }
</style>
