<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="l-4 text-white q-pr-md">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goHome" />
        <div class="text-h5">Profile settings</div>
        <q-space />
        <q-btn flat round dense icon="notifications_none" />
      </q-toolbar>
    </q-header>

    <!-- ProfileSettings.vue -->
    <q-page-container class = "text-white">
      <router-view />
    </q-page-container>

    <q-footer class="l-5 text-white q-pa-md">
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
        </q-input>
        <q-btn
          round
          unelevated
          size="sm"
          class="l-4 text-white q-pa-sm q-ml-sm"
          icon="send"
          @click="sendMessage"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'SettingsLayout',
  setup () {
    const router = useRouter()
    const msg = ref('')

    function goHome () { void router.push({ name: 'home' }) }
    function sendMessage () { if (!msg.value.trim()) return; msg.value = '' }

    return { msg, goHome, sendMessage }
  }
})
</script>
