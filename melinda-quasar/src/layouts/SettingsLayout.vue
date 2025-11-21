<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="c-4 text-c-1">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goHome" />
        <div class="row items-center">
          <p class="text-h5 text-weight-bolder text-c-1 q-mb-none">Profile settings</p>
        </div>
        <q-space/>
        <q-btn flat round dense icon="notifications_none" class="q-mr-sm" />
      </q-toolbar>
    </q-header>
    <q-page-container class="c-1">
      <router-view />
    </q-page-container>
    <q-footer class="c-3 text-c-1 q-pa-md">
      <CommandLine class="q-px-lg"></CommandLine>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
  import CommandLine from 'src/components/CommandLine.vue';
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'SettingsLayout',
    components: { CommandLine },

    methods: {
      goHome() {
        void this.$router.push({ name: 'home' })
      }
    }

  })

</script>
