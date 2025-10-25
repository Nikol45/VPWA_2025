<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="l-4 text-l-1">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goHome" />
        <div class="row items-center">
          <p class="text-h5 text-weight-bolder text-l-1 q-mb-none">Channel settings</p>
        </div>
        <q-space/>
        <q-btn flat round dense icon="notifications_none" class="q-mr-sm" />
      </q-toolbar>
    </q-header>
    <q-drawer v-if="!isCompact || $route.name === 'home'" v-model="leftOpen" side="left" behavior="desktop" :width="isCompact ? $q.screen.width : 300" :overlay="isCompact" class="l-4 text-l-1 sidebar relative-position">
      <div class="column fit">
        <profile-block :user="user"></profile-block>
        <search-filter v-model:filter="filter" v-model="search" class="responsive-padding"></search-filter>
        <q-scroll-area class="col">
          <q-list class="q-py-sm responsive-padding">
            <channel-block v-for="c in filtered" :key="c.id" :channel="c" @click="goToChannel"></channel-block>
          </q-list>
        </q-scroll-area>

        <q-btn v-if="$route.name !== 'home'" round class="l-3 text-l-1 op-95 floating-add" icon="add" size="22px" @click="createChannel"/>
      </div>
    </q-drawer>
    <q-page-container class="l-1">
      <router-view/>
    </q-page-container>
    <q-footer class="l-3 text-l-1 q-pa-md">
      <CommandLine class="q-px-lg"></CommandLine>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
    import CommandLine from 'src/components/CommandLine.vue';
    import { defineComponent } from 'vue'
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
    name: 'ChannelSettingsLayout',
    components: { CommandLine, ProfileBlock, SearchFilter, ChannelBlock },

    data() {
        return {
            leftOpen: true,
            search: '',
            filter: 'all' as Visibility,

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

    methods: {
      goHome() {
        void this.$router.push({ name: 'home' })
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

      createChannel() {
      },
    },

    computed: {

        isCompact(): boolean { return this.$q.screen.lt.sm },

        filtered(): Channel[] {
            const s = this.search.trim().toLowerCase()
            return this.channels.filter(c => this.filter === 'all' ||(this.filter === 'public' && !c.private) || (this.filter === 'private' && c.private)).filter(c => (s ? c.name.toLowerCase().includes(s) : true))
        },
    },

    watch: {
        '$route.name'() { this.updateLeftOpen() },
        isCompact() { this.updateLeftOpen() }
    },

    mounted() { this.updateLeftOpen() }
  })

</script>

<style scoped>
    .search-input :deep(.q-field__control) {
        background-color: var(--l-3);
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
