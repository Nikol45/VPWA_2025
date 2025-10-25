<template>
  <q-dialog v-model="localShow">
    <q-card class="my_card q-pa-md shadow-2 c-2 relative-position">
      <q-btn
        v-if="cancel"
        flat
        round
        dense
        icon="close"
        color="primary"
        class="close-btn absolute-top-right q-mt-sm q-mr-sm"
        @click="localShow = false"
      />
      <q-card-section class="text-center">
        <div class="text-c-5 text-h5 text-weight-bold">{{ title }}</div>
      </q-card-section>
      <q-card-section>
        <q-form ref="qForm" @submit.prevent="submitForm">
          <div v-for="field in fields" :key="field.model">
            <q-input standout class="c-2 always-primary q-mb-sm text-c-3" v-model="form[field.model]" :label="field.label" :type="field.type || 'text'" :rules="field.rules"></q-input>
          </div>
          <q-btn style="border-radius: 8px;" type="submit" rounded size="md" label="Submit" no-caps class="full-width c-5 text-c-1 q-mt-md"></q-btn>
        </q-form>
      </q-card-section>
      <q-card-section class="text-center q-pt-none">
        <div class="text-grey-8">{{ note }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
//import type { QForm } from 'quasar'

interface Field {
  label: string
  model: string
  type?: "text" | "password" | "email"
  rules?: ((val: string) => boolean | string)[]
  initial?: string
}

export default defineComponent({
  name: 'BaseForm',

  props: {
    cancel: {
      type: Boolean,
      default: true,
      required: true
    },

    title: {
      type: String,
      default: '',
      required: true,
    },

    modelValue: {
      type: Boolean,
      required: true,
    },

    fields: {
      type: Array as () => Field[],
      default: () => [],
      required: true,
    },

    note: {
      type: String,
      default: '',
    },

    closeOnSubmit: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      localShow: this.modelValue,
      form: {} as Record<string, string>,
      submitting: false,
    };
  },

  watch: {
    modelValue(val : boolean) {
      this.localShow = val
      if (val) this.initForm()
    },
    localShow(val : boolean) {
      this.$emit('update:modelValue', val)
    },
    fields: {
      handler() {
        this.initForm()
      },
      deep: true
    }
  },

  created() {
    this.initForm()
  },

  methods: {
    initForm() {
      const obj : Record<string, string> = {}
      this.fields.forEach((f: Field) => {
        obj[f.model] = f.initial !== undefined ? f.initial : ''
      })
      this.form = obj
    },

    submitForm() {
      this.$emit('submit', this.form)
      if (this.closeOnSubmit) {
        this.localShow = false
      }
    }
  }
});
</script>

<style scoped>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.always-primary :deep(.q-field__native),
.always-primary :deep(.q-field__label),
.always-primary :deep(.q-field__control),
.always-primary :deep(.q-field__marginal),
.always-primary :deep(.q-field__control:hover),
.always-primary :deep(.q-field__control:focus-within),
.always-primary :deep(.q-field__control-container) {
  color: var(--c-3) !important;
  background-color: var(--c-1) !important;
}

:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-text-fill-color: var(--c-3) !important;
  background-color: var(--c-1) !important;
}

:deep(.q-field--standout .q-field__control:before),
:deep(.q-field--standout .q-field__control:after) {
  background: none !important;
  opacity: 0 !important;
}
</style>
