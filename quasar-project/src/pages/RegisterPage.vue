<template>
    <q-page-container>
        <q-page class="flex flex-center" color="l-4">
            <Register v-model="showRegister" @submit="handleRegistration" :close-on-submit="true" />
        </q-page>
    </q-page-container>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Register from 'src/components/auth/Register.vue';
    
    export default defineComponent({
        name: 'RegisterPage',
        components: { Register },
        data() {
            return {
                showRegister: true,
            }
        },
        methods: {
            handleRegistration() {
                this.showRegister = false
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