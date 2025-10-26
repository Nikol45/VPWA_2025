<template>
  <q-dialog v-model="localShow">
    <q-card class="my_card q-pa-md shadow-2 c-2 relative-position">
      <q-btn v-if="cancel" flat round dense icon="close" color="primary" class="close-btn absolute-top-right q-mt-sm q-mr-sm" @click="localShow = false"/>
      <q-card-section class="text-center">
        <h1 class="text-c-5 text-h5 text-weight-bold q-ma-none">{{ title }}</h1>
      </q-card-section>
      <q-card-section class="q-pt-none" v-if="photo">
        <div class="upload-circle text-c-1 rad-50 q-mx-auto q-mb-sm" @click="pickFile">
          <img v-if="previewUrl" :src="previewUrl" class="preview-img"/>
          <template v-else>
            <q-icon name="photo_camera" size="md"/>
            <p class="text-c-1 text-subtitle2 text-weight-bold q-ma-none">Upload</p>
          </template>
          <input ref="file" type="file" accept="image/*" class="hidden" @change="onFile"/>
          <div class="plus-badge c-3 text-c-1" v-if="!previewUrl">
            <q-icon name="add" size="sm"/>
          </div>
        </div>
        <p class="text-c-3 text-weight-bolder text-center q-ma-none">Profile picture</p>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <div v-for="field in fields" :key="field.model">
            <q-input standout class="c-2 always-primary q-mb-sm text-c-3" v-model="form[field.model]" :label="field.label" :type="field.type || 'text'" :rules="field.rules"></q-input>
          </div>
          <q-btn type="submit" size="md" label="Submit" no-caps class="rad-15 full-width c-5 text-c-1 q-mt-md"></q-btn>
        </q-form>
      </q-card-section>
      <q-card-section class="text-center q-pt-none">
        <router-link v-if="note && noteRoute" :to="noteRoute" underlined class="text-c-3">{{ note }}</router-link>
        <span v-else class="text-c-3">{{ note }}</span>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

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

      photo: {
        type: Boolean,
        default: false,
        required: false
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
        default: '' 
      },

      noteRoute: {
        type: String,
        required: false,
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
        selectedFile: null as File | null,
        submitting: false,
        previewUrl: null as string | null
      }
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
        const payload = {
          data: this.form,
          image: this.selectedFile
        }
        this.$emit('submit', payload)
        if (this.closeOnSubmit) {
          this.localShow = false
        }
      },

      pickFile(){ (this.$refs.file as HTMLInputElement)?.click() },

      onFile(e: Event){
        const file = (e.target as HTMLInputElement).files?.[0] || null
        
        if (!file) {
          this.selectedFile = null
          this.previewUrl = null
          return
        }

        if (!file.type.startsWith('image/')) {
          this.$q.notify({
            type: 'warning',
            message: 'Please select a valid image file (JPEG, PNG, etc.)',
            position: 'bottom-right',
            color: 'negative',
            timeout: 2500
          });
        
          (this.$refs.file as HTMLInputElement).value = ''
          this.selectedFile = null
          this.previewUrl = null
          return
        }
        
        this.selectedFile = file
        if (this.previewUrl) URL.revokeObjectURL(this.previewUrl)
        this.previewUrl = file ? URL.createObjectURL(file) : null
      }
    }
  })
</script>

<style scoped>
  .upload-circle {
    width: 100px; height: 100px;
    border: 3px dashed color-mix(in srgb, var(--c-1) 80%, transparent);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    position: relative; cursor: pointer;
  }
  .plus-badge {
    position: absolute; right: -2px; top: -2px;
    width: 30px; height: 30px; border-radius: 50%;
    display:flex; align-items:center; justify-content:center;
  }
  .hidden{ display:none }

  .preview-img{
    width:100%; height:100%;
    object-fit:cover; border-radius:50%;
  }

  .my_card::-webkit-scrollbar {
  display: none;
  }
</style>
