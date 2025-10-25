<template>
  <q-page class="flex flex-center fit c-3">
    <Login v-model="showLogin" @submit="handleLogin" :close-on-submit="true" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Login from 'src/components/auth/Login.vue'

export default defineComponent({
  name: 'AuthPage',
  components: { Login },
  setup () {
    const showLogin = ref(true)
    const router = useRouter()
    const route = useRoute()

    const handleLogin = async () => {
      if (route.name !== 'home') {
        await router.replace({ name: 'home' })
      }
    }

    return { showLogin, handleLogin }
  }
})
</script>
