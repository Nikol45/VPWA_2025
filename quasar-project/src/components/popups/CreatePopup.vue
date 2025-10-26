<template>
  <q-dialog v-model="localShow">
    <q-card class="my_card c-2 q-pa-md">
      <q-card-section class="text-center">
        <div class="text-c-5 text-h5 text-weight-bold">Create Your Channel</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="upload-circle text-c-1 rad-50 q-mx-auto q-mb-lg" @click="pickFile">
          <img v-if="previewUrl" :src="previewUrl" alt="preview" class="preview-img" />
          <template v-else>
            <q-icon name="photo_camera" size="md" />
            <div class="text-c-1 text-subtitle2 text-weight-bold">UPLOAD</div>
          </template>
          <input ref="file" type="file" accept="image/*" class="hidden" @change="onFile" />
          <div class="plus-badge c-3 text-c-1"  v-if="!previewUrl">
            <q-icon name="add" size="sm"/>
          </div>
        </div>

        <q-input standout class="c-2 always-primary q-mb-md text-c-3"
          v-model="form.name" label="Server Name" @keyup.enter="submit" />

        <div class="row items-center q-mb-sm">
          <div class="col-auto text-c-3">Privacy</div>
        </div>

        <q-btn-toggle
          v-model="form.privacy"
          toggle-color="primary"
          toggle-text-color="c-1"
          text-color="c-3"
          :options="[
              { label: 'Private', value: 'private', icon: 'lock' },
              { label: 'Public', value: 'public', icon: 'public' }
            ]"
          rounded spread padding="sm"
        />

      </q-card-section>

      <q-card-actions align="between" class="q-mt-lg">
        <q-btn flat no-caps class="text-c-3" label="Back" @click="$emit('back')" />
        <q-btn no-caps class="c-5 text-c-1 rad-15"
               label="Create" @click="submit"
               :disable="!form.name || !form.privacy || !form.image"
                />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreatePopup',
  props: { modelValue: { type: Boolean, required: true } },
  emits: ['update:modelValue','submit','back'],
  data(){
    return {
      localShow: this.modelValue,
      form: {
        name: '',
        privacy: null as 'private' | 'public' | null,
        image: null as File | null
      },
      previewUrl: null as string | null
    }
  },
  watch:{
    modelValue(v:boolean){ this.localShow=v },
    localShow(v:boolean){
      this.$emit('update:modelValue', v)
      if (!v) this.resetForm()
    }
  },
  methods:{
    pickFile(){ (this.$refs.file as HTMLInputElement)?.click() },

    onFile(e: Event){
      const file = (e.target as HTMLInputElement).files?.[0] || null

      if (!file) {
        this.form.image = null
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
        this.form.image = null
        this.previewUrl = null
        return
      }

      this.form.image = file
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl)
      this.previewUrl = file ? URL.createObjectURL(file) : null
    },

    resetForm(){
      this.form.name = ''
      this.form.privacy = null
      this.form.image = null
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl)
      this.previewUrl = null
      const el = this.$refs.file as HTMLInputElement | undefined
      if (el) el.value = ''
    },

    submit(){
      if (!this.form.name || !this.form.privacy || !this.form.image) {
        return
      }
      this.$emit('submit', { ...this.form })
      this.localShow = false
    }
  },
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

.my-toggle .q-btn--active {
  background-color: var(--c-3) !important;
  color: var(--c-1) !important;
}

</style>
