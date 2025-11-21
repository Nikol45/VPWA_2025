<template>
  <q-page class="c-3">
    <Login v-model="showLogin" @submit="handleLogin" :close-on-submit="true"/>
  </q-page>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Login from 'src/components/auth/Login.vue'

  export default defineComponent({
    name: 'AuthPage',
    components: { Login },
    
    data() {
      return {
        showLogin: true
      }
    },

    methods: {
      async handleLogin(formData : Record<string, string>) {
        console.log("Received login data:", formData)
        const res = await fetch('http://localhost:3333/test-user')
        const data = await res.json()

        console.log("User from server:", data)

        await this.$router.replace({ name: 'home' })
      }
    }
  })
</script>
