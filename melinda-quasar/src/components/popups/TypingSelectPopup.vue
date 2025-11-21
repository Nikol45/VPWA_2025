<template>
  <q-dialog v-model="localShow">
    <q-card class="my_card c-2 q-pa-md" style="max-width: 26rem;">
      <q-card-section class="text-center q-pt-sm q-pb-none">
        <div class="text-c-5 text-h5 text-weight-bold">Vyber koho chceš vidieť</div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-scroll-area style="height: 50vh;">
          <q-list class="c-2">
            <q-item
              v-for="o in options"
              :key="o.id"
              class="c-1 rad-15 q-mb-sm"
              clickable
              v-ripple
              @click="onSelect(o.id)"
            >
              <q-item-section avatar v-if="o.avatar">
                <q-avatar size="32px">
                  <img :src="o.avatar" alt="" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <div class="text-c-3 text-subtitle1">{{ o.label }}</div>
                <div class="text-caption text-c-3 q-mt-xs">{{ o.subtitle || 'píše…' }}</div>
              </q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat no-caps class="text-c-3" label="Zavrieť" @click="localShow = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface TypingOption {
  id: string
  label: string
  avatar?: string
  subtitle?: string
}

export default defineComponent({
  name: 'TypingSelectPopup',
  props: {
    modelValue: { type: Boolean, required: true },
    options: { type: Array as PropType<TypingOption[]>, required: true }
  },
  emits: ['update:modelValue', 'select'],
  data() {
    return { localShow: this.modelValue }
  },
  watch: {
    modelValue(v: boolean) { this.localShow = v },
    localShow(v: boolean) { this.$emit('update:modelValue', v) }
  },
  methods: {
    onSelect(id: string) {
      this.$emit('select', id)
      this.localShow = false
    }
  }
})
</script>
