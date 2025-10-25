<template>
  <q-dialog v-model="localShow">
    <q-card class="my_card c-2 q-pa-md">
      <q-card-section class="text-center">
        <div class="text-c-5 text-h5 text-weight-bold">Search for a Channel</div>
        <div class="text-grey-8 q-mt-xs">Discover through public channels</div>
      </q-card-section>

      <q-card-section>
        <q-input
          standout
          dense
          class="c-2 always-primary text-c-3 q-mb-md"
          v-model="query"
          placeholder="Search channels"
          debounce="300"
          @update:model-value="$emit('search', query)"
        >
          <template #prepend><q-icon name="search" /></template>
        </q-input>

        <q-scroll-area class="results-area">
          <q-list class="c-2">
            <div
              v-for="ch in filteredResults"
              :key="ch.id"
              class="row items-center q-mb-md no-wrap q-gutter-x-sm"
            >
              <div class="col">
                <div class="rad-15 c-1 text-c-3 q-py-sm q-px-md">{{ ch.name }}</div>
              </div>
              <div class="col-auto">
                <q-btn dense no-caps label="Join" @click="$emit('join', ch.id)"
                       class="c-5 text-c-1 rad-15 q-px-md" />
              </div>
            </div>
          </q-list>
        </q-scroll-area>
      </q-card-section>

      <q-card-actions align="left">
        <q-btn flat no-caps class="text-c-3" label="Back" @click="$emit('back')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Channel { id:string; name:string }

export default defineComponent({
  name: 'SearchPopup',
  props: {
    modelValue: { type: Boolean, required: true },
    results: { type: Array as PropType<Channel[]>, default: () => [] }
  },
  emits: ['update:modelValue','search','join','back'],
  data(){
    return {
      localShow: this.modelValue,
      query: '',
      allChannels: [
        { id: '1',  name: 'Study Together' },
        { id: '2',  name: 'Hangout Codex' },
        { id: '3',  name: 'Midjourney' },
        { id: '4',  name: 'Anime Soul Discord' },
        { id: '5',  name: 'Among Us' },
        { id: '6',  name: 'Frontend Guild' },
        { id: '7',  name: 'Vue Nation' },
        { id: '8',  name: 'Open Source Hub' },
        { id: '9',  name: 'Data Wizards' },
        { id: '10', name: 'DevOps Camp' }
      ] as Channel[]
    }
  },
  computed: {
    filteredResults(): Channel[] {
      const norm = (s:string) =>
        s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

      const q = norm(this.query.trim())
      const tokens = q.split(/\s+/).filter(Boolean)

      const base = this.allChannels // vyhľadávaj vždy v plnom zozname

      if (!tokens.length) return base

      return base.filter(c => {
        const n = norm(c.name)
        return tokens.every(t => n.includes(t))
      })
    }
  },
  watch:{
    modelValue(v:boolean){ this.localShow = v },
    localShow(v:boolean){
      this.$emit('update:modelValue', v)
      if (!v) this.query = ''
    }
  }
})
</script>

<style scoped>

.results-area {
  height: 300px
}

</style>
