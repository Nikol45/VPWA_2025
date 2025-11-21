<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  document.documentElement.setAttribute('theme', savedTheme)
}

export default defineComponent({
  name: 'App',
});
</script>
