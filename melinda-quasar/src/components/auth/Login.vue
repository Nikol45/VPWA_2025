<template>
    <BaseForm persistent v-model="localShow" :cancel=false title="Login" :fields="fields" note="Don't have an account? Sign up" note-route="/register" :close-on-submit="false" :loading="loading" @submit="onSubmit"/>
</template>

<script lang="ts">
    import BaseForm from './BaseForm.vue'
    import { defineComponent } from 'vue'
    import type { RouteLocationRaw } from 'vue-router'
    import { useAuthStore } from 'src/stores/auth'
    import type { LoginCredentials } from 'src/contracts'

    interface Field {
        label: string
        model: string
        type?: "text" | "password" | "email"
        rules?: ((val: string) => boolean | string)[]
        initial?: string
    }

    export default defineComponent({
        name: 'LoginPopup',
        components: { BaseForm },

        props: {
            modelValue: {
                type: Boolean,
                required: true,
            },

            closeOnSubmit: {
                type: Boolean,
                default: true
            }
        },

        data() {
            return {
                localShow: this.modelValue,
                fields: [
                    { label: 'Nickname *', model: 'nickname', type: 'string', rules: [(val: string) => !!val || 'Nickname is required'] },
                    { label: 'Password *', model: 'password', type: 'password', rules: [(val: string) => !!val || 'Password is required'] },
                ] as Field[],
            }
        },

        watch: {
            modelValue(val : boolean) {
                this.localShow = val
            },

            localShow(val : boolean) {
                this.$emit('update:modelValue', val)
            }
        },

        computed: {
            redirectTo (): RouteLocationRaw {
                return (this.$route.query.redirect as string) || { name: 'home' }
            },
            
            loading (): boolean {
                const auth = useAuthStore()
                return auth.status === 'pending'
            }
        },

        methods: {
            async onSubmit(formData: LoginCredentials) {
                const auth = useAuthStore()
                try {
                    await auth.login(formData)
                    this.localShow = false
                    await this.$router.push(this.redirectTo)
                } catch (err) {
                    console.error(err)
                    this.$q.notify({
                        type: 'negative',
                        message: 'Incorrect nickname or password',
                    })
                }
            }
        }
    })
</script>