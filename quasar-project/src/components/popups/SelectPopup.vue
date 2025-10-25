<template>
  <q-dialog v-model="localShow">
    <q-card class="my_card c-2 q-pa-md">
      <q-card-section class="text-center">
        <div class="text-c-5 text-h5 text-weight-bold">Create or join a channel</div>
        <div class="text-grey-8 q-mt-xs">Choose one of the options below.</div>
      </q-card-section>

      <q-card-section>
        <q-list class="c-2">
          <q-item class="c-1 rad-15 q-mb-md" clickable v-ripple @click="$emit('create')">
            <q-item-section><div class="text-c-3 text-subtitle1">Create a channel</div></q-item-section>
            <q-item-section side><q-icon name="chevron_right" /></q-item-section>
          </q-item>

          <q-item class="c-1 rad-15 q-mb-md" clickable v-ripple @click="$emit('join')">
            <q-item-section><div class="text-c-3 text-subtitle1">Join a channel</div></q-item-section>
            <q-item-section side><q-icon name="chevron_right" /></q-item-section>
          </q-item>

          <q-item class="c-1 rad-15" clickable v-ripple @click="$emit('search')">
            <q-item-section><div class="text-c-3 text-subtitle1">Search for a channel</div></q-item-section>
            <q-item-section side><q-icon name="chevron_right" /></q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SelectPopup',
  props: { modelValue: { type: Boolean, required: true } },
  emits: ['update:modelValue', 'create', 'join', 'search'],
  data() { return { localShow: this.modelValue } },
  watch: {
    modelValue(v:boolean){ this.localShow = v },
    localShow(v:boolean){ this.$emit('update:modelValue', v) }
  }
})
</script>
