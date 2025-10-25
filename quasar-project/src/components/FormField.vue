<template>
  <div class="q-mb-md">
    <p v-if="title" class="text-h6 text-weight-bold q-mb-xs text-c-1">
      {{ title }}
    </p>

    <div class="row items-center q-gutter-sm">
      <q-input v-model="model" dense standout="c-2" class="c-2 col always-primary q-mr-sm"/>
      <q-btn flat no-caps class="c-5 text-weight-bold q-px-md q-py-sm text-c-1" size="13px" @click="$emit('save')">Save</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FormField',

  props: {
    modelValue: {
      type: String,
      required: true
    },

    title: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue', 'save'],

  computed: {
    model: {
      get(): string {
        return this.modelValue
      },

      set(val: string) {
        this.$emit('update:modelValue', val)
      }
    }
  }
})
</script>

<style scoped>
.always-primary :deep(.q-field__native),
.always-primary :deep(.q-field__label),
.always-primary :deep(.q-field__control),
.always-primary :deep(.q-field__marginal) {
  color: var(--q-primary) !important;
}

</style>
