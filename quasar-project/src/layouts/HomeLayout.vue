<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="l-3 text-white">
      <q-toolbar v-if="activeChannel">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goHome" />
        <q-avatar size="28px" class="q-mr-sm">
          <img :src="activeChannel!.avatar" :alt="activeChannel!.name" />
        </q-avatar>
        <div class="row items-center">
          <div class="text-subtitle1">{{ activeChannel!.name }}</div>
        </div>
        <q-space/>
        <q-btn flat round dense icon="info" :to="{ name: 'channel-settings' }" />
      </q-toolbar>

      <q-toolbar v-else/>
    </q-header>

    <q-drawer v-model="leftOpen" side="left" :width="300" class="l-4 text-white sidebar relative-position">
      <div class="column fit">
        <profile-block :user=user></profile-block>

        <search-filter v-model:filter="filter" v-model="search"></search-filter>

        <q-scroll-area class="col">
          <q-list class="q-py-sm">
            <channel-block v-for="c in filtered" :key="c.id" :channel="c" @click="goToChannel"></channel-block>
          </q-list>
        </q-scroll-area>

        <q-btn v-if="route.name !== 'home'" round class="l-3 text-white op-95 floating-add" icon="add" size="22px" aria-label="Create channel" @click="createChannel"/>
      </div>
    </q-drawer>

    <q-page-container class="l-1">
      <router-view />
    </q-page-container>

    <q-footer class="l-3 text-white q-pa-md">
      <command-line :active-channel="activeChannel"></command-line>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommandLine from 'src/components/CommandLine.vue'
import ProfileBlock from 'src/components/sidebar/ProfileBlock.vue'
import SearchFilter from 'src/components/sidebar/SearchFilter.vue'
import ChannelBlock from 'src/components/sidebar/ChannelBlock.vue'

type Visibility = 'all' | 'public' | 'private'

interface User {
  nickname: string
  name: string
  avatarUrl: string
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

        router: useRouter(),
        route: useRoute(),

        user: {
        nickname: 'FireFly x3',
        name: 'Svetlana Pivarčiová',
        avatarUrl: '/avatars/users/firefly.jpg'
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

  methods: {
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
    }
  }
})
</script>

<style scoped>
.message-input :deep(.q-field__control) { background-color: var(--l-4); }
.search-input  :deep(.q-field__control) { background-color: var(--l-3); }

.outline-l5 { border: 1px solid var(--l-3) !important; }

.floating-add {
  position: absolute;
  right: 40px;
  bottom: 30px;
}
</style>
