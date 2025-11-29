<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="c-4 text-c-1">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goHome" />
        <div class="row items-center">
          <p class="text-h5 text-weight-bolder text-c-1 q-mb-none">Profile settings</p>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="c-1">
      <router-view :current-user="user" />
    </q-page-container>

    <q-footer class="c-3 text-c-1 q-pa-md">
      <CommandLine class="q-px-lg" :current-user="user" />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CommandLine from 'src/components/CommandLine.vue'
import { useAuthStore } from 'src/stores/auth'
import type { User as ApiUser } from 'src/contracts'

interface User {
  id: number
  nickname: string
  name: string
  avatarUrl: string
  status: 'online' | 'offline' | 'dnd'
  role: string
}

export default defineComponent({
  name: 'SettingsLayout',
  components: { CommandLine },

  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },

  computed: {
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
  },

  methods: {
    goHome() {
      void this.$router.push({ name: 'home' })
    },
  },
})
</script>
