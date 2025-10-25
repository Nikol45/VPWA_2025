<template>
  <q-layout view="lHh lpR lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthLayout',

  created() {
    const saved = localStorage.getItem('theme') || 'L'
    document.documentElement.setAttribute('theme', saved)
    localStorage.setItem('theme', saved)
  }
})
</script>