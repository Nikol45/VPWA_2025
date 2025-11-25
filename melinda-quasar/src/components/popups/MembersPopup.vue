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
              <profile-block class="member-item fit" :user="member" :is-admin="isAdmin" :is-private="isPrivate" :buttons="getButtonsForMember(member)" @action="(a) => handleMemberAction(a, member)"/>
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
  import { useAuthStore } from 'src/stores/auth'
  import { channelService } from 'src/services'
  import { useChannelsStore } from 'src/stores/channels'
  import type { AxiosError } from 'axios'

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
      },

      isPrivate: {
          type: Boolean,
          default: false
      },

      isAdmin: {
          type: Boolean,
          default: false
      },
    },

    emits: ['update:modelValue'],

    setup() {
        const authStore = useAuthStore()
        const channelsStore = useChannelsStore()
        return { authStore, channelsStore }
    },

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
      },
      getButtonsForMember(member: Member) {
          const myId = this.authStore.user?.id
          if (member.id === myId) return []

    
          if (this.isPrivate) {
              return this.isAdmin ? [{ icon: 'remove_circle_outline', action: 'remove' }] : []
          }

          if (member.role === 'admin') return []
          
          return [{ icon: 'remove_circle_outline', action: 'remove' }]
      },

      async handleMemberAction(action: string, member: Member) {
          if (action !== 'remove') return

          const channelId = this.findActiveChannelId()
          if (!channelId) return

          if (this.isAdmin) {
              try {
                  if (this.isPrivate) {
                      await channelService.revoke(channelId, member.nickname)
                      this.$q.notify({ type: 'positive', message: `Removed ${member.nickname}` })
                  } else {
                      await channelService.ban(channelId, member.nickname)
                      this.$q.notify({ type: 'positive', message: `Banned ${member.nickname}` })
                  }
              } catch {
                  this.$q.notify({ type: 'negative', message: 'Failed to remove user' })
              }
          } else {
              try {
                  await channelService.kick(channelId, member.nickname)
                  this.$q.notify({ type: 'positive', message: `Voted to kick ${member.nickname}` })
              } catch (err) {
                  const e = err as AxiosError<{ error: string }>
                  const msg = e.response?.data?.error || 'Failed to vote'
                  this.$q.notify({ type: 'warning', message: msg })
              }
          }
      },

      findActiveChannelId(): number | null {
          const idStr = this.$route.params.id as string
          return idStr ? Number(idStr) : null
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
