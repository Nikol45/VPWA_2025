<template>
    <q-page class="flex flex-center fit l-4">
        <Login v-model="showLogin" @submit="handleLogin" :close-on-submit="true" />
    </q-page>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Login from 'src/components/auth/Login.vue';
    
    export default defineComponent({
        name: 'AuthPage',
        components: { Login },
        data() {
            return {
                showLogin: true,
            }
        },
        methods: {
            handleLogin() {
            },
        },
    })
</script>

<style scoped>
    .my_card {
        width: 25rem;
        border-radius: 8px;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
</style>