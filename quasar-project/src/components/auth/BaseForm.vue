<template>
  <q-dialog v-model="localShow">
    <q-card class="my_card q-pa-md shadow-2 l-2">
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">{{ title }}</div>
      </q-card-section>
      <q-card-section>
        <q-form ref="qForm" @submit.prevent="submitForm">
          <div v-for="field in fields" :key="field.model">
            <q-input standout bg-color="accent" v-model="form[field.model]" :label="field.label" :type="field.type || 'text'" :rules="field.rules"></q-input>
          </div>
          <q-btn style="border-radius: 8px;" type="Submit" rounded size="md" label="Submit" no-caps class="full-width l-5 text-purple-1 q-mt-md"></q-btn>
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
</style>
