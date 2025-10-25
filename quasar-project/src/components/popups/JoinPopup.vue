<template>
  <q-dialog v-model="localShow">
    <q-card class="my_card c-2 q-pa-md">
      <q-card-section class="text-center">
        <div class="text-c-5 text-h5 text-weight-bold">Join a Channel</div>
        <div class="text-grey-8 q-mt-xs">Enter an invite below to join channel</div>
      </q-card-section>

      <q-card-section>
        <q-input
          standout
          class="c-2 always-primary q-mb-sm text-c-3"
          v-model="invite"
          label="Invite link or code"
          @keyup.enter="submit"
        />
      </q-card-section>

      <q-card-actions align="between">
        <q-btn flat no-caps class="text-c-3" label="Back" @click="$emit('back')" />
        <q-btn no-caps class="c-5 text-c-1" label="Join"  @click="submit"
               :disable="(invite?.trim().length || 0) < 8"  />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'JoinPopup',
  props: { modelValue: { type: Boolean, required: true } },
  emits: ['update:modelValue', 'submit', 'back'],
  data(){ return { localShow: this.modelValue, invite: '' } },
  watch: {
    modelValue(v:boolean){ this.localShow = v },
    localShow(v:boolean){
      this.$emit('update:modelValue', v)
      if (!v) this.invite = ''
    }
  },

  methods:{
    submit(){
      const v = this.invite?.trim() || ''
      if (v.length < 8) return
      this.$emit('submit', { inviteLink: v })
      this.localShow = false
    }
  }
})
</script>
