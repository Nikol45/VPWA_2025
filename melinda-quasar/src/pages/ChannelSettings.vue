<template>
  <q-page class="q-pa-xl c-3">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-6">
        <q-card class="c-5 q-pa-md q-mb-lg">
          <div class="row items-center q-gutter-md">
            <q-avatar v-if="activeChannel" size="64px">
              <img :src="activeChannelIcon" />
            </q-avatar>
            <div class="col">
              <p
                v-if="activeChannel"
                class="ellipsis text-h6 q-mb-none text-c-1"
              >
                {{ activeChannel.name }}
              </p>
            </div>
          </div>
        </q-card>

        <form-field
          v-if="activeChannel && isAdmin"
          v-model="channelName"
          title="Name"
        />

        <div class="q-mt-md">
          <p
            v-if="isAdmin"
            class="text-h6 text-weight-bold q-mb-xs text-c-1"
          >
            Visibility
          </p>
          <div class="row justify-between">
            <q-select
              v-if="activeChannel && isAdmin"
              v-model="visibilityModel"
              :options="visibilityOptions"
              dense
              standout="c-2"
              class="c-2 col always-primary q-mr-sm"
              rounded
              popup-content-class="c-2 text-c-3"
              content-style="border-radius: 15px;"
            />
            <q-btn
              v-if="isAdmin"
              flat
              no-caps
              size="13px"
              class="col q-ml-sm c-5 q-pa-sm text-weight-bold text-c-1"
              @click="changeIcon"
            >
              Change icon
            </q-btn>
          </div>
        </div>

        <div class="row justify-between q-mt-lg">
          <q-btn
            v-if="!isAdmin"
            flat
            no-caps
            size="13px"
            class="col negative q-pa-sm text-weight-bold text-c-1"
            @click="confirmLeave = true"
          >
            Leave channel
          </q-btn>
          <q-btn
            v-if="isAdmin"
            flat
            no-caps
            size="13px"
            class="col negative q-pa-sm text-weight-bold text-c-1"
            @click="confirmClose = true"
          >
            Close channel
          </q-btn>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="row items-center justify-between q-mb-md">
          <p class="text-h6 text-weight-bold q-mb-xs text-c-1">Members</p>
          <div>
            <q-btn
              v-if="!isPrivate || isAdmin"
              flat
              no-caps
              icon="add"
              size="13px"
              class="col c-5 q-pa-sm q-mr-xs text-weight-bold text-c-1"
              @click="inviteMember"
            >
              Invite
            </q-btn>
            <q-btn
              v-if="activeChannelMembers.length > 3"
              flat
              no-caps
              size="13px"
              class="col c-5 q-pa-sm text-weight-bold q-ml-xs text-c-1"
              @click="showMembers"
            >
              Show all
            </q-btn>
          </div>
        </div>

        <div
          v-for="member in activeChannelMembers.slice(0, 3)"
          :key="member.id"
          class="member-item c-5 q-pa-sm q-mb-md row justify-between items-center"
        >
          <profile-block
            class="fit"
            :is-admin="isAdmin"
            :is-private="isPrivate"
            :user="member"
            :buttons="getButtonsForMember(member)"
            @action="(a) => handleMemberAction(a, member)"
          />
        </div>

        <p
          v-if="activeChannel && remainingMembersCount > 0"
          class="text-caption text-c-1 text-weight-bold"
        >
          And {{ remainingMembersCount }} others...
        </p>
      </div>
    </div>

    <confirm-popup
      v-model="confirmLeave"
      message="Are you sure you want to leave this channel?"
      confirm-label="Leave"
      @confirm="leaveChannel"
    />
    <confirm-popup
      v-model="confirmClose"
      message="Are you sure you want to close this channel?"
      confirm-label="Close channel"
      @confirm="closeChannel"
    />

    <members-popup
      v-model="showMembersPopup"
      :is-admin="isAdmin"
      :is-private="isPrivate"
      :members="activeChannelMembers"
    />

    <invite-popup
      v-model="showInvitePopup"
      :invite-code="inviteCode"
      @invite="onInviteNickname"
      @copy="onCopyInviteCode"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Member } from 'src/types/common.ts'
import MembersPopup from 'src/components/popups/MembersPopup.vue'
import FormField from 'src/components/FormField.vue'
import ConfirmPopup from 'src/components/popups/ConfirmPopup.vue'
import ProfileBlock from 'src/components/sidebar/ProfileBlock.vue'
import InvitePopup from 'src/components/popups/InvitePopup.vue'

import { useChannelsStore } from 'src/stores/channels'
import { channelService } from 'src/services'
import type { Channel, ChannelMember } from 'src/contracts'
import type { AxiosError } from 'axios'
import { useAuthStore } from 'src/stores/auth'


type VisibilityLabel = 'Public' | 'Private'

export default defineComponent({
  name: 'ChannelSettings',
  components: {
    FormField,
    ConfirmPopup,
    ProfileBlock,
    MembersPopup,
    InvitePopup,
  },

  props: {
    currentUser: {
      type: Object as PropType<Member>,
      default: () => ({
        id: 0,
        nickname: 'Guest',
        name: 'Anonymous user',
        avatarUrl: '/avatars/users/default.png',
        status: 'online',
        role: '',
      }),
    },
  },

  data() {
    return {
      confirmLeave: false,
      confirmClose: false,
      showMembersPopup: false,
      showInvitePopup: false,
      inviteCode: '',

      visibilityOptions: ['Public', 'Private'] as VisibilityLabel[],
      visibilityModel: 'Public' as VisibilityLabel,
      channelName: '',

      members: [] as Member[],
    }
  },

  setup() {
    const authStore = useAuthStore()
    const channelsStore = useChannelsStore()
    return { authStore, channelsStore }
  },

  computed: {
    activeChannel(): Channel | null {
      const idParam = this.$route.params.id as string | undefined
      if (!idParam) return null
      const id = Number(idParam)
      if (!Number.isFinite(id)) return null
      return this.channelsStore.items.find((c) => c.id === id) ?? null
    },

    activeChannelIcon(): string {
      if (!this.activeChannel) return '/avatars/channels/default.png'
      
      const path = this.activeChannel.iconUrl || '/avatars/channels/default.png'

      if (!path.startsWith('http') && !path.startsWith('data:')) {
         return `${import.meta.env.VITE_API_URL}${path}`
      }
      
      return path
    },

    activeChannelMembers(): Member[] {
      return this.members
    },

    isAdmin(): boolean {
      return !!this.activeChannel?.isAdmin
    },

    isPrivate(): boolean {
      return this.visibilityModel === 'Private'
    },

    remainingMembersCount(): number {
      if (!this.activeChannel) return 0
      return Math.max(this.activeChannel.nMembers - 3, 0)
    },
  },

  watch: {
    activeChannel: {
      immediate: true,
      handler(channel: Channel | null) {
        if (!channel) {
          this.channelName = ''
          this.visibilityModel = 'Public'
          this.inviteCode = ''
          this.members = []
          return
        }

        this.channelName = channel.name
        this.visibilityModel = channel.visibility === 'private' ? 'Private' : 'Public'
        this.inviteCode = channel.inviteCode || ''
        void this.fetchMembers(channel.id)
      },
    },

    'activeChannel.nMembers': {
      handler() {
        if (this.activeChannel) {
          void this.fetchMembers(this.activeChannel.id)
        }
      }
    }
  },

  methods: {
    async fetchMembers(channelId: number) {
      const apiMembers = await channelService.listMembers(channelId)
      this.members = apiMembers.map((m) => this.mapChannelMember(m))
    },

    mapChannelMember(api: ChannelMember): Member {
      return {
        id: api.id,
        nickname: api.nickname,
        name: `${api.firstName} ${api.lastName}`,
        avatarUrl: api.avatarUrl || '/avatars/users/default.png',
        status: api.status,
        role: api.isAdmin ? 'admin' : '',
      }
    },

    changeIcon() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.click()

      input.onchange = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
          this.$q.notify({
            type: 'warning',
            message: 'Please select a valid image file (JPEG, PNG, etc.)',
            position: 'bottom-right',
            color: 'negative',
            timeout: 2500,
          })
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          const previewUrl = e.target?.result as string
          if (this.activeChannel) {
            this.channelsStore.UPSERT_CHANNEL({
              ...this.activeChannel,
              iconUrl: previewUrl,
            } as Channel)
          }
        }
        reader.readAsDataURL(file)
      }
    },

    showMembers() {
      this.showMembersPopup = true
    },

    async leaveChannel() {
      const channel = this.activeChannel
      if (!channel) return

      if (this.isAdmin) {
        await this.channelsStore.deleteChannel(channel.id)
      } else {
        await this.channelsStore.leaveChannel(channel.id)
      }

      this.confirmLeave = false
      void this.$router.push({ name: 'home' })
    },

    async closeChannel() {
      const channel = this.activeChannel
      if (!channel) return
      if (!this.isAdmin) return

      await this.channelsStore.deleteChannel(channel.id)

      this.confirmClose = false
      void this.$router.push({ name: 'home' })
    },

    inviteMember() {
      const channel = this.activeChannel
      if (!channel) return
      this.inviteCode = channel.inviteCode || ''
      this.showInvitePopup = true
    },

    async onInviteNickname(nickname: string) {
      const channel = this.activeChannel
      if (!channel) return

      try {
        const result = await channelService.invite(channel.id, { nickname }) 
        
        if (result.invited) {
            this.$q.notify({
              type: 'positive',
              message: `Invite sent to @${nickname}`,
              position: 'bottom-right',
              timeout: 2000,
            })
        } else {
            this.$q.notify({
              type: 'warning',
              message: `@${nickname} is already a member or invited`,
              position: 'bottom-right',
              timeout: 2000,
            })
        }
      } catch (err) {
        const e = err as AxiosError<{ error: string }>
        const msg = e.response?.data?.error || `Failed to invite @${nickname}`

        this.$q.notify({
          type: 'negative',
          message: msg, 
          position: 'bottom-right',
          timeout: 2500,
      })
      }
    },

    async onCopyInviteCode() {
      if (!this.inviteCode) return

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(this.inviteCode)
          this.$q.notify({
            type: 'positive',
            message: 'Invite code copied to clipboard',
            position: 'bottom-right',
            timeout: 1500,
          })
        }
      } catch {
        this.$q.notify({
          type: 'warning',
          message: 'Unable to copy invite code',
          position: 'bottom-right',
          timeout: 1500,
        })
      }
    },

    getButtonsForMember(member: Member) {
          if (member.id === this.authStore.user?.id) return [] 

          if (this.isPrivate) {
              return this.isAdmin ? [{ icon: 'remove_circle_outline', action: 'remove' }] : []
          }

          if (this.isPrivate) {
              return this.isAdmin ? [{ icon: 'remove_circle_outline', action: 'remove' }] : []
          }

          if (member.role === 'admin') return []
          
          return [{ icon: 'remove_circle_outline', action: 'remove' }]
    },

    async handleMemberAction(action: string, member: Member) {
          if (action !== 'remove') return
          const channelId = this.activeChannel?.id
          if (!channelId) return

          const id = Number(channelId)

          if (this.isAdmin) {
              try {
                  if (this.isPrivate) {
                      await channelService.revoke(id, member.nickname)
                  } else {
                      await channelService.ban(id, member.nickname)
                  }
                  this.$q.notify({ type: 'positive', message: `Removed ${member.nickname}` })
                  void this.fetchMembers(id) 
              } catch {
                  this.$q.notify({ type: 'negative', message: 'Failed to remove user' })
              }
          } else {
              try {
                  const res = await channelService.kick(id, member.nickname)
                  this.$q.notify({ type: 'info', message: res.message })
              } catch (err) {
                const e = err as AxiosError<{ error: string }>
                  const msg = e.response?.data?.error || 'Failed to vote'
                  this.$q.notify({ type: 'warning', message: msg })
              }
          }
    },
  },
})
</script>

<style scoped>
.always-primary :deep(.q-field__native),
.always-primary :deep(.q-field__label),
.always-primary :deep(.q-field__control),
.always-primary :deep(.q-field__marginal) {
  color: var(--c-3) !important;
  background-color: var(--c-1) !important;
}

:deep(.q-field--standout .q-field__control:before),
:deep(.q-field--standout .q-field__control:after) {
  background: none !important;
  opacity: 0 !important;
}

.member-item {
  border-radius: 15px;
  width: 100%;
}
</style>
