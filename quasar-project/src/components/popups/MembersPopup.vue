<template>
  <q-dialog v-model="localShow">
    <q-card class="c-4 text-c-1">
      <q-card-section class="row items-center justify-between q-pb-sm">
        <p class="text-h6 text-c-1 q-ma-none">Channel members</p>
        <q-btn flat round dense icon="close" color="c-1" @click="closePopup"/>
      </q-card-section>

      <q-card-section class="member-area q-pt-none q-mt-sm">
        <q-scroll-area class="fit">
            <div v-for="member in members" :key="member.id" class="member-item c-5 q-mb-md row justify-between items-center">
              <profile-block class="member-item fit" :user="member" :buttons="[ { icon: 'remove_circle_outline', action: 'remove' } ]"/>
            </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue'
  import type { Member } from 'src/types/common.ts'
  import ProfileBlock from 'src/components/sidebar/ProfileBlock.vue'

  export default defineComponent({
    name: 'MembersPopup',
    components: { ProfileBlock },

    props: {
      modelValue: {
        type: Boolean,
        required: true
      },

      members: {
        type: Array as PropType<Member[]>,
        required: true
      }
    },

    emits: ['update:modelValue'],

    data() {
      return {
        localShow: this.modelValue
      }
    },

    watch: {
      modelValue(val: boolean) {
        this.localShow = val
      },

      localShow(val: boolean) {
        this.$emit('update:modelValue', val)
      }
    },

    methods: {
      closePopup() {
        this.localShow = false
      }
    }
  })
</script>

<style scoped>
    .member-item {
      border-radius: 15px;
    }

    .q-card {
      width: 500px;
      max-width: 90vw;
    }

    .member-area {
      height: 400px;
    }
</style>
