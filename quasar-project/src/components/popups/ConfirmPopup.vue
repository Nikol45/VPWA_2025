<template>
    <q-dialog v-model="localShow" persistent>
      <q-card class="c-2 text-c-3 text-weight-bold q-pa-md">
        <q-card-section class="row items-center">
          <span class="font-popup-size text-center">{{ message }}</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="Cancel" no-caps class="c-5 text-c-1 q-mr-lg" v-close-popup/>
          <q-btn flat :label="confirmLabel" no-caps class="text-c-1 negative" @click="confirmAction"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name:'ConfirmPopup',

        props: {
            modelValue: {
                type: Boolean,
                required: true
            },

            message: {
                type: String,
                default: 'Are you sure?'
            },

            confirmLabel: {
                type: String,
                default: 'Confirm'
            }
        },

        emits: ['update:modelValue', 'confirm'],

        data() {
            return {
                localShow: this.modelValue
            }
        },

        watch: {
            modelValue(val: boolean) {
                this.localShow = val
            },

            localShow(val: boolean) {
                this.$emit('update:modelValue', val)
            }
        },

        methods: {
            confirmAction() {
                this.$emit('confirm')
                this.localShow = false
            }
        }
    })
</script>

<style scoped>
    .font-popup-size {
        font-size: 20px;
    }
</style>


