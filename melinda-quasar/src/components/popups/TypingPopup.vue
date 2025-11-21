<template>
  <q-dialog v-model="isOpen">
    <q-card class="my_card typing-card c-2 q-pa-md">
      <q-card-section class="text-center q-pt-sm q-pb-none">
        <div class="text-c-5 text-h5 text-weight-bold">Typing...</div>
        <div class="q-mt-xs">From user: {{ name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div ref="box" class="content-box c-1 text-c-3 q-pa-md rad-15">
          {{ displayText }}
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat no-caps class="text-c-3" label="Back" @click="$emit('back')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'

export default defineComponent({
  name: 'TypingPopup',
  props: {
    modelValue: { type: Boolean, required: true },
    name:       { type: String,  required: true },
    typingText: { type: String,  required: true }
  },
  emits: ['update:modelValue','back'],
  computed: {
    isOpen: {
      get(): boolean { return this.modelValue },
      set(v: boolean) { this.$emit('update:modelValue', v) }
    },
    displayText(): string {
      const t = this.typingText
      if (!t || t.trim() === '') return ''
      return t.replace(/\s+$/, '') + '..'
    }
  },
  watch: {
    async typingText(v: string) {
      if (!v || v.trim() === '') { this.isOpen = false; return }
      await this.queueScrollAdjust()
    }
  },
  methods: {
    async queueScrollAdjust(): Promise<void> {
      await nextTick()
      const el = this.$refs.box as HTMLDivElement | undefined
      if (el) el.scrollTop = el.scrollHeight
    }
  },
  mounted() {
    void this.queueScrollAdjust()
  }
})
</script>

<style scoped>
.typing-card { width: auto; max-width: 26rem; }
.content-box {
  display: inline-block;
  min-width: 16rem;
  max-width: 22rem;
  max-height: 18rem;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.35;
}
</style>
