<template>
    <BaseForm v-model="localShow" title="Login" :fields="fields" note="Don't have an account?" :close-on-submit="closeOnSubmit" @submit="onSubmit" />
</template>

<script lang="ts">
    import BaseForm from './BaseForm.vue';

    interface Field {
        label: string
        model: string
        type?: "text" | "password" | "email"
        rules?: ((val: string) => boolean | string)[]
        initial?: string
    }

    export default {
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
                    { label: 'Email', model: 'email', type: 'email', rules: [(val: string) => !!val || 'Email is required'] },
                    { label: 'Password', model: 'password', type: 'password', rules: [(val: string) => !!val || 'Password is required'] },
                ] as Field[],
            };
        },

        watch: {
            modelValue(val : boolean) {
                this.localShow = val
            },
            localShow(val : boolean) {
                this.$emit('update:modelValue', val)
            }
        },

        methods: {
            onSubmit(formData : Record<string, string>) {
                this.$emit('submit', formData)
            }
        }
    }
</script>