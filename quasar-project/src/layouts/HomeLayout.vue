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

        <q-btn
          v-if="$route.name !== 'home'"
          round
          class="c-3 text-c-1 op-95 floating-add"
          icon="add"
          size="22px"
          @click="createChannel"
        />
      </div>
    </q-drawer>

    <q-page-container class="c-1">
      <router-view />
    </q-page-container>

    <q-footer class="c-3 text-c-1 q-pa-md">
      <command-line :active-channel="activeChannel"></command-line>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CommandLine from 'src/components/CommandLine.vue'
import ProfileBlock from 'src/components/sidebar/ProfileBlock.vue'
import SearchFilter from 'src/components/sidebar/SearchFilter.vue'
import ChannelBlock from 'src/components/sidebar/ChannelBlock.vue'

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
}

export default defineComponent({
  name: 'HomeLayout',
  components: { CommandLine, ProfileBlock, SearchFilter, ChannelBlock },

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
        { id: '1',  name: 'FIIT STU',            members: 1216, private: false, avatar: '/avatars/channels/FIIT.png' },
        { id: '2',  name: 'Ženy na FIIT',        members: 3,    private: true,  avatar: '/avatars/channels/zeny.png' },
        { id: '3',  name: 'Študenti Fiit 3. r.', members: 621,  private: false, avatar: '/avatars/channels/tretiacky.png' },
        { id: '4',  name: 'Share & Care',        members: 27,   private: true,  avatar: '/avatars/channels/cerveny.png' },
        { id: '5',  name: 'FIIT STU',            members: 1216, private: false, avatar: '/avatars/channels/FIIT.png' },
        { id: '6',  name: 'Ženy na FIIT',        members: 3,    private: true,  avatar: '/avatars/channels/zeny.png' },
        { id: '7',  name: 'Študenti Fiit 3. r.', members: 621,  private: false, avatar: '/avatars/channels/tretiacky.png' },
        { id: '8',  name: 'FIIT STU',            members: 1216, private: false, avatar: '/avatars/channels/FIIT.png' },
        { id: '9',  name: 'Ženy na FIIT',        members: 3,    private: true,  avatar: '/avatars/channels/zeny.png' },
        { id: '10', name: 'Študenti Fiit 3. r.', members: 621,  private: false, avatar: '/avatars/channels/tretiacky.png' },
        { id: '11', name: 'Share & Care',        members: 27,   private: true,  avatar: '/avatars/channels/cerveny.png' }
      ] as Channel[]
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
    }
  },

  watch: {
    '$route.name'() { this.updateLeftOpen() },
    isCompact() { this.updateLeftOpen() }
  },

  mounted() { this.updateLeftOpen() },


  methods: {
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

    sendMessage() {
    },

    createChannel() {
    },

    goHome() {
      void this.$router.push({ name: 'home' })
    },

    handleProfileAction(action: string) {
      switch (action) {
        case 'settings': void this.$router.push({ name: 'profile-settings' }); break
        case 'notify': ; break
      }
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
</style>
