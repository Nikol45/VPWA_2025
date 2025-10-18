<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="l-4 text-white q-pr-md">
      <!-- Default / Channel header -->
      <q-toolbar v-if="activeChannel">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goHome" />
        <q-avatar size="28px" class="q-mr-sm">
          <img :src="activeChannel!.avatar" :alt="activeChannel!.name" />
        </q-avatar>
        <div class="row items-center">
          <div class="text-subtitle1">{{ activeChannel!.name }}</div>
        </div>
        <q-space />
        <q-btn flat round dense icon="info" />
      </q-toolbar>

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
        <!-- user info -->
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
            <q-btn flat round dense icon="settings" />
          </q-toolbar>
        </div>

        <!-- Drawer header content -->
        <div class="q-pa-md">
          <!-- Search input -->
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

          <!-- Tabs for filtering channels -->
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

        <!-- Scrollable channel list -->
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

        <!-- Floating create channel button -->
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

    <!-- Main page container -->
    <q-page-container class="l-1">
      <router-view />
    </q-page-container>

    <!-- Footer with message input -->
    <q-footer class="l-5 text-white q-pa-md">
      <div v-if="typingText" class="text-caption text-grey-5 q-mb-xs">{{ typingText }}</div>
      <div class="row items-center no-wrap full-width">
        <q-input
          dense
          standout
          class="col message-input text-white"
          placeholder=" "
          v-model="msg"
          input-class="text-white"
          @keyup.enter="sendMessage"
        >
          <template v-if="activeChannel" #prepend>
            <q-btn flat round dense icon="emoji_emotions" aria-label="Emoji" />
          </template>
        </q-input>
        <q-btn round unelevated size="sm" class="l-4 text-white q-pa-sm q-ml-sm" icon="send" @click="sendMessage" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed, ref, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

    const leftOpen = ref(true)
    const search = ref('')
    const filter = ref<Visibility>('all')
    const msg = ref('')

    // typing indicator provided to pages
    const typingText = ref<string | null>(null)
    provide('setTyping', (text: string | null) => { typingText.value = text })

    // User info
    const user = ref<User>({
      name: 'FireFly x3',
      avatarUrl: '/avatars/pfp1.jpg'
    })

    // Channel data
    const channels = ref<Channel[]>([
      { id: '1', name: 'FIIT STU', members: 1216, private: false, avatar: 'https://placekitten.com/40/40' },
      { id: '2', name: 'Ženy na FIIT', members: 3, private: true,  avatar: 'https://placekitten.com/41/41' },
      { id: '3', name: 'Študenti Fiit 3. r.', members: 621, private: false, avatar: 'https://placekitten.com/42/42' },
      { id: '4', name: 'Share & Care', members: 27, private: true, avatar: 'https://placekitten.com/43/43' },
      { id: '5', name: 'FIIT STU', members: 1216, private: false, avatar: 'https://placekitten.com/40/40' },
      { id: '6', name: 'Ženy na FIIT', members: 3, private: true,  avatar: 'https://placekitten.com/41/41' },
      { id: '7', name: 'Študenti Fiit 3. r.', members: 621, private: false, avatar: 'https://placekitten.com/42/42' },
      { id: '8', name: 'FIIT STU', members: 1216, private: false, avatar: 'https://placekitten.com/40/40' },
      { id: '9', name: 'Ženy na FIIT', members: 3, private: true,  avatar: 'https://placekitten.com/41/41' },
      { id: '10', name: 'Študenti Fiit 3. r.', members: 621, private: false, avatar: 'https://placekitten.com/42/42' },
      { id: '11', name: 'Share & Care', members: 27, private: true, avatar: 'https://placekitten.com/43/43' }
    ])

    // Filtered list based on search and filter type
    const filtered = computed<Channel[]>(() => {
      const s = search.value.toLowerCase()
      return channels.value
        .filter(c =>
          filter.value === 'all' ||
          (filter.value === 'public' && !c.private) ||
          (filter.value === 'private' && c.private)
        )
        .filter(c => c.name.toLowerCase().includes(s))
    })

    const activeChannel = computed<Channel | null>(() => {
      const id = route.params.id as string | undefined
      if (!id) return null
      return channels.value.find(c => c.id === id) ?? null
    })

    function goToChannel (c: Channel) {
      void router.push({ name: 'channel', params: { id: c.id } })
    }

    function sendMessage () {
      if (!msg.value.trim()) return
      msg.value = ''
    }

    function createChannel () {
      // placeholder for dialog
    }

    function goHome () {
      void router.push({ name: 'home' })
    }

    return {
      router,
      route,
      leftOpen, search, filter, channels, filtered, msg, user,
      goToChannel, createChannel, sendMessage, goHome,
      activeChannel, typingText
    }
  }
})
</script>

<style scoped>
/* Hover efekt kanálov na sidebare */
.channel-item:hover { background: rgba(255,255,255,0.06); }

/* Input štýly podľa témy */
.message-input :deep(.q-field__control) { background-color: var(--l-4); }
.search-input  :deep(.q-field__control) { background-color: var(--l-3); }

.outline-l5 { border: 1px solid var(--l-3) !important; }

/* floating add button inside drawer */
.floating-add {
  position: absolute;
  right: 40px;
  bottom: 30px;
}
</style>
