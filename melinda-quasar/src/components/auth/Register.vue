<template>
    <BaseForm persistent v-model="localShow" :cancel=false title="Register" :fields="fields" :photo=true note="Already have an account? Log in" note-route="/" :close-on-submit="false" :loading="loading" @submit="onSubmit"/>
</template>

<script lang="ts">
    import BaseForm from './BaseForm.vue'
    import { defineComponent } from 'vue'
    import type { RouteLocationRaw } from 'vue-router'
    import { useAuthStore } from 'src/stores/auth'
    import type { RegisterData } from 'src/contracts'
    import ValidationError from 'src/errors/ValidationError'

    interface Field {
        label: string
        model: string
        type?: "text" | "password" | "email"
        rules?: ((val: string) => boolean | string)[]
        initial?: string
    }

    export default defineComponent({
        name: 'RegisterPopup',
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
                    { label: 'Nickname *', model: 'nickname', type: 'text', rules: [(val: string) => !!val || 'Nickname is required'] },
                    { label: 'First name *', model: 'firstName', type: 'text', rules: [(val: string) => !!val || 'First name is required'] },
                    { label: 'Last name *', model: 'lastName', type: 'text', rules: [(val: string) => !!val || 'Last name is required'] },
                    { label: 'Email *', model: 'email', type: 'email', rules: [(val: string) => !!val || 'Email is required'] },
                    { label: 'Password *', model: 'password', type: 'password', rules: [(val: string) => !!val || 'Password is required'] },
                    { label: 'Reconfirm password *', model: 'password_confirmation', type: 'password', rules: [(val: string) => !!val || 'Reconfirmation is required'] },
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
                return { name: 'home' }
            },

            loading (): boolean {
                const auth = useAuthStore()
                return auth.status === 'pending'
            }
        },

        methods: {
            async onSubmit(formData: RegisterData) {
                const auth = useAuthStore()
                try {
                    await auth.register(formData)
                    await this.$router.push(this.redirectTo)
                } catch (err) {
                    if (err instanceof ValidationError) {
                        err.issues.forEach(issue => {
                            this.$q.notify({
                                type: 'negative',
                                message: issue.message
                            })
                        })
                        return
                    }

                    this.$q.notify({
                        type: 'negative',
                        message: 'Registration failed'
                    })
                }
            }
        }
    })
</script>