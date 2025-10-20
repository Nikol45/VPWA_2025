<!-- HomeLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="l-4 text-white q-pr-md">
      <!-- Header pre otvorený kanál -->
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

      <!-- Prázdny header na home -->
      <q-toolbar v-else />
    </q-header>

    <!-- Sidebar (drawer) -->
    <q-drawer
      show-if-above
      v-model="leftOpen"
      side="left"
      :width="300"
      class="l-4 text-white sidebar relative-position"
    >
      <div class="column fit">
        <!-- Info o užívateľovi -->
        <div class="l-5 text-white">
          <q-toolbar class="q-px-md" style="min-height:72px">
            <q-avatar size="45px" class="q-mr-md">
              <img :src="user.avatarUrl" alt="avatar" />
            </q-avatar>

            <div class="column">
              <div class="text-h6">{{ user.name }}</div>
              <div class="text-caption">Svetlana Pivarčiová</div>
            </div>

            <q-space />
            <q-btn flat round dense icon="notifications_none" class="q-mr-sm" />
            <q-btn flat round dense icon="settings" :to="{ name: 'profile-settings' }" />
          </q-toolbar>
        </div>

        <!-- Vyhľadávanie + filtre -->
        <div class="q-pa-md">
          <q-input
            dense
            standout
            v-model="search"
            placeholder="Search channels.."
            class="no-padding search-input"
            input-class="text-white"
          >
            <template #prepend>
              <q-icon name="search" class="q-mr-sm" />
            </template>
          </q-input>

          <div class="row no-wrap q-gutter-sm q-mt-sm">
            <q-btn
              class="col text-white outline-l5"
              no-caps
              :flat="filter!=='all'"
              :unelevated="filter==='all'"
              dense label="All" @click="filter='all'"
              :class="filter==='all' ? 'l-5' : ''"
            />
            <q-btn
              class="col text-white outline-l5"
              no-caps
              :flat="filter!=='public'"
              :unelevated="filter==='public'"
              dense label="Public" @click="filter='public'"
              :class="filter==='public' ? 'l-5' : ''"
            />
            <q-btn
              class="col text-white outline-l5"
              no-caps
              :flat="filter!=='private'"
              :unelevated="filter==='private'"
              dense label="Private" @click="filter='private'"
              :class="filter==='private' ? 'l-5' : ''"
            />
          </div>
        </div>

        <!-- Zoznam kanálov -->
        <q-scroll-area class="col">
          <q-list class="q-py-sm">
            <q-item
              v-for="c in filtered"
              :key="c.id"
              clickable
              class="channel-item"
              @click="goToChannel(c)"
            >
              <q-item-section avatar>
                <q-avatar size="36px">
                  <img :src="c.avatar" :alt="c.name" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-body1">{{ c.name }}</q-item-label>
                <q-item-label class="text-caption text-weight-thin">{{ c.members }} members</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-chip
                  dense
                  class="text-white q-pa-sm text-caption"
                  :class="c.private ? 'l-3' : 'l-5'"
                >
                  {{ c.private ? 'Private' : 'Public' }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <!-- Tlačidlo vytvorenia kanála -->
        <q-btn
          v-if="route.name !== 'home'"
          round
          class="l-3 text-white op-95 floating-add"
          icon="add"
          size="22px"
          aria-label="Create channel"
          @click="createChannel"
        />
      </div>
    </q-drawer>

    <!-- Hlavný obsah -->
    <q-page-container class="l-1">
      <router-view />
    </q-page-container>

    <!-- Footer s inputom na správu -->
    <q-footer class="l-5 text-white q-pa-md">
      <div class="row items-center no-wrap full-width">
        <q-input
          dense
          standout
          class="col message-input text-white"
          placeholder=" "
          v-model="msg"
          :disable="!activeChannel"
          input-class="text-white"
          @keyup.enter="sendMessage"
        >
          <template v-if="activeChannel" #prepend>
            <q-btn flat round dense icon="emoji_emotions" aria-label="Emoji" />
          </template>
        </q-input>
        <q-btn
          round
          unelevated
          size="sm"
          class="l-4 text-white q-pa-sm q-ml-sm"
          icon="send"
          :disable="!activeChannel || !msg.trim()"
          @click="sendMessage"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// -- typy
type Visibility = 'all' | 'public' | 'private'

interface User {
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
  setup () {
    const router = useRouter()
    const route = useRoute()

    // -- UI stave
    const leftOpen = ref(true)
    const search = ref('')
    const filter = ref<Visibility>('all')
    const msg = ref('')

    // -- užívateľ (lokálne, neskôr zo store)
    const user = ref<User>({
      name: 'FireFly x3',
      avatarUrl: '/avatars/users/firefly.jpg'
    })

    // -- kanály (normalizované; bez users/demoUsers)
    const channels = ref<Channel[]>([
      { id: '1',  name: 'FIIT STU',                 members: 1216, private: false, avatar: '/avatars/channels/FIIT.png' },
      { id: '2',  name: 'Ženy na FIIT',             members: 3,    private: true,  avatar: '/avatars/channels/zeny.png' },
      { id: '3',  name: 'Študenti Fiit 3. r.',      members: 621,  private: false, avatar: '/avatars/channels/tretiacky.png' },
      { id: '4',  name: 'Share & Care',             members: 27,   private: true,  avatar: '/avatars/channels/cerveny.png' },
      { id: '5',  name: 'FIIT STU',                 members: 1216, private: false, avatar: '/avatars/channels/FIIT.png' },
      { id: '6',  name: 'Ženy na FIIT',             members: 3,    private: true,  avatar: '/avatars/channels/zeny.png' },
      { id: '7',  name: 'Študenti Fiit 3. r.',      members: 621,  private: false, avatar: '/avatars/channels/tretiacky.png' },
      { id: '8',  name: 'FIIT STU',                 members: 1216, private: false, avatar: '/avatars/channels/FIIT.png' },
      { id: '9',  name: 'Ženy na FIIT',             members: 3,    private: true,  avatar: '/avatars/channels/zeny.png' },
      { id: '10', name: 'Študenti Fiit 3. r.',      members: 621,  private: false, avatar: '/avatars/channels/tretiacky.png' },
      { id: '11', name: 'Share & Care',             members: 27,   private: true,  avatar: '/avatars/channels/cerveny.png' }
    ])

    // -- filtrovanie kanálov
    const filtered = computed<Channel[]>(() => {
      const s = search.value.trim().toLowerCase()
      return channels.value
        .filter(c =>
          filter.value === 'all' ||
          (filter.value === 'public' && !c.private) ||
          (filter.value === 'private' && c.private)
        )
        .filter(c => (s ? c.name.toLowerCase().includes(s) : true))
    })

    // -- aktívny kanál podľa route parametru
    const activeChannel = computed<Channel | null>(() => {
      const id = route.params.id as string | undefined
      if (!id) return null
      return channels.value.find(c => c.id === id) ?? null
    })

    // -- navigácia do kanála
    function goToChannel (c: Channel) {
      if (route.params.id === c.id) return
      void router.push({ name: 'channel', params: { id: c.id } })
    }

    // -- odoslanie správy (len reset; reálna logika bude v store/API)
    function sendMessage () {
      if (!activeChannel.value) return
      if (!msg.value.trim()) return
      msg.value = ''
    }

    // -- vytvorenie kanála (placeholder na dialóg)
    function createChannel () {
      // TODO: otvoriť dialóg na vytvorenie kanála
    }

    // -- návrat na home
    function goHome () {
      void router.push({ name: 'home' })
    }

    return {
      router, route,
      leftOpen, search, filter, channels, filtered, msg, user,
      goToChannel, createChannel, sendMessage, goHome,
      activeChannel
    }
  }
})
</script>

<style scoped>
.message-input :deep(.q-field__control) { background-color: var(--l-4); }
.search-input  :deep(.q-field__control) { background-color: var(--l-3); }

.outline-l5 { border: 1px solid var(--l-3) !important; }

/* plávajúce tlačidlo v drawer-i */
.floating-add {
  position: absolute;
  right: 40px;
  bottom: 30px;
}
</style>
