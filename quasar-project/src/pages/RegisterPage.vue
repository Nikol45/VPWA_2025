<template>
    <q-page-container>
        <q-page class="c-3">
            <Register v-model="showRegister" @submit="handleRegistration" :close-on-submit="true"/>
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
            async handleRegistration() {
                if (this.$route.name !== 'home') {
                    await this.$router.replace({ name: 'home' })
                }
            },
        },
    })
</script>