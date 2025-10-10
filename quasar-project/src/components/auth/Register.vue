<template>
    <BaseForm v-model="localShow" title="Register" :fields="fields" :close-on-submit="closeOnSubmit" @submit="onSubmit" />
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
                    { label: 'Nickname', model: 'nickname', type: 'text', rules: [(val: string) => !!val || 'Nickname is required'] },
                    { label: 'First name', model: 'firstname', type: 'text', rules: [(val: string) => !!val || 'First name is required'] },
                    { label: 'Last name', model: 'lastname', type: 'text', rules: [(val: string) => !!val || 'Last name is required'] },
                    { label: 'Email', model: 'email', type: 'email', rules: [(val: string) => !!val || 'Email is required'] },
                    { label: 'Password', model: 'password', type: 'password', rules: [(val: string) => !!val || 'Password is required'] },
                    { label: 'Reconfirm passowrd', model: 'password', type: 'password', rules: [(val: string) => !!val || 'Reconfirmation is required'] },
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