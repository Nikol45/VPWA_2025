<template>
  <q-page class="q-px-xl q-pt-xl q-pb-sm c-3 text-c-1">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-4">
        <q-card class="c-5 q-pa-md">
          <div class="row items-center q-gutter-md">
            <div class="relative-position">
              <q-avatar size="64px">
                <img :src="user.avatar" />
              </q-avatar>
              <q-icon
                name="circle"
                bordered
                size="17px"
                :color="statusColor"
                class="thick-outline absolute-bottom-right"
              />
            </div>
            <div class="text-container">
              <p class="ellipsis text-h6 q-mb-none text-c-1">{{ user.nickname }}</p>
              <p class="ellipsis text-caption text-weight-light q-mb-none text-c-1">
                {{ user.name }}
              </p>
            </div>
          </div>
        </q-card>

        <div class="q-mt-lg">
          <form-field v-model="user.nickname" title="Nickname" />
          <form-field v-model="user.firstName" title="First name" />
          <form-field v-model="user.lastName" title="Last name" />
          <form-field v-model="user.email" title="E-mail" />
        </div>

        <div class="row q-gutter-lg q-mt-md">
          <q-btn
            flat
            no-caps
            size="13px"
            class="col c-5 q-pa-sm text-weight-bold text-c-1"
            @click="changePfp"
          >
            Change icon
          </q-btn>
          <q-btn
            flat
            no-caps
            size="13px"
            class="col c-5 q-pa-sm text-weight-bold text-c-1"
            @click="showChangePassword = true"
          >
            Change password
          </q-btn>
        </div>

        <div class="q-mt-md">
          <q-btn
            size="13px"
            label="Log out"
            no-caps
            flat
            class="negative text-weight-bold text-c-1 q-py-sm q-px-lg"
            @click="confirmLogout = true"
          />
        </div>
      </div>

      <div class="col-12 col-md-8">
        <div class="q-mb-lg">
          <p class="text-h5 text-weight-bold text-c-1">App appearance</p>
          <p class="text-h6 text-weight-bold text-c-1 q-mt-lg">Choose app theme:</p>

          <div class="theme-row row q-col-gutter-md q-mt-md c-3 justify-between">
            <q-card
              v-for="theme in themes"
              :key="theme.id"
              :class="[
                'theme-item col-6 col-sm-3 q-ma-xs c-5 cursor-pointer q-pa-md flex flex-center column',
                selectedTheme === theme.id ? 'picked' : ''
              ]"
              @click="selectTheme(theme.id)"
            >
              <q-avatar size="60px">
                <img :src="theme.preview" />
              </q-avatar>
              <p class="q-mt-sm text-subtitle2 text-c-1 q-ma-none">{{ theme.name }}</p>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-6">
            <p class="text-h6 text-c-1 text-weight-bold">Status</p>
            <q-option-group
              v-model="status"
              :options="statusOptions"
              color="c-1"
              type="radio"
            />
          </div>

          <div class="col-6">
            <p class="text-h6 text-c-1 text-weight-bold">Notifications</p>
            <q-option-group
              v-model="notifications"
              :options="notificationOptions"
              color="c-1"
              type="radio"
            />
          </div>
        </div>
      </div>
    </div>

    <base-form
      v-model="showChangePassword"
      :cancel="true"
      title="Change password"
      :fields="passwordFields"
      @submit="handlePasswordChange"
    />

    <confirm-popup
      v-model="confirmLogout"
      message="Are you sure you want to log out?"
      confirm-label="Log out"
      @confirm="goAuth"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FormField from 'src/components/FormField.vue'
import BaseForm from 'src/components/auth/BaseForm.vue'
import ConfirmPopup from 'src/components/popups/ConfirmPopup.vue'
import { useAuthStore } from 'src/stores/auth'
import type { User as ApiUser } from 'src/contracts'
import { userService } from 'src/services'

type StatusValue = 'online' | 'dnd' | 'offline'
type NotificationValue = 'show_all' | 'mentions_only' | 'mute_all'

interface LocalUser {
  nickname: string
  firstName: string
  lastName: string
  name: string
  email: string
  avatar: string
}

export default defineComponent({
  name: 'ProfileSettings',
  components: { FormField, BaseForm, ConfirmPopup },

  data() {
    return {
      confirmLogout: false,
      showChangePassword: false,

      user: {
        nickname: '',
        firstName: '',
        lastName: '',
        name: '',
        email: '',
        avatar: '/avatars/users/default.png',
      } as LocalUser,

      passwordFields: [
        {
          label: 'Old password',
          model: 'oldPassword',
          type: 'password' as const,
          rules: [(val: string) => !!val || 'Old password is required'],
        },
        {
          label: 'New password',
          model: 'newPassword',
          type: 'password' as const,
          rules: [(val: string) => !!val || 'New password is required'],
        },
        {
          label: 'Retype new password',
          model: 'password_confirmation',
          type: 'password' as const,
          rules: [(val: string) => !!val || 'Retyped password is required'],
        },
      ],

      selectedTheme: 'L',
      status: 'online' as StatusValue,
      notifications: 'show_all' as NotificationValue,

      themes: [
        { id: 'L', name: 'Lilac dream', preview: '/themes/gradient_lilac.png' },
        { id: 'B', name: 'Midnight blue', preview: '/themes/gradient_blue.png' },
        { id: 'P', name: 'Pink chocolate', preview: '/themes/gradient_choco.png' },
        { id: 'G', name: 'Mystical forest', preview: '/themes/gradient_forest.png' },
      ],

      statusOptions: [
        { label: 'Online', value: 'online' },
        { label: 'Do not disturb', value: 'dnd' },
        { label: 'Offline', value: 'offline' },
      ] as { label: string; value: StatusValue }[],

      notificationOptions: [
        { label: 'Show all', value: 'show_all' },
        { label: 'Show mentions only', value: 'mentions_only' },
        { label: 'Mute all', value: 'mute_all' },
      ] as { label: string; value: NotificationValue }[],
    }
  },

  computed: {
    statusColor(): string {
      switch (this.status) {
        case 'online':
          return 'positive'
        case 'dnd':
          return 'negative'
        case 'offline':
          return 'grey'
        default:
          return 'grey'
      }
    },
  },

  watch: {
    async status(newStatus: StatusValue, oldStatus: StatusValue) {
      if (newStatus === oldStatus) return
      const auth = useAuthStore()
      const updated = await userService.updateStatus(newStatus)
      if (auth.user) {
        auth.user.status = updated.status
      }
    },

    async notifications(newValue: NotificationValue, oldValue: NotificationValue) {
      if (newValue === oldValue) return
      const auth = useAuthStore()
      const updated = await userService.updateNotificationSetting(newValue)
      if (auth.user) {
        auth.user.notificationSetting = updated.notificationSetting
      }
    },

    'user.firstName': function () {
      this.user.name = `${this.user.firstName} ${this.user.lastName}`.trim()
    },

    'user.lastName': function () {
      this.user.name = `${this.user.firstName} ${this.user.lastName}`.trim()
    },
  },

  created() {
    const auth = useAuthStore()
    const apiUser = auth.user as ApiUser | null

    if (apiUser) {
      this.user.nickname = apiUser.nickname
      this.user.firstName = apiUser.firstName
      this.user.lastName = apiUser.lastName
      this.user.name = `${apiUser.firstName} ${apiUser.lastName}`.trim()
      this.user.email = apiUser.email
      this.user.avatar = apiUser.avatarUrl || '/avatars/users/default.png'
      this.status = apiUser.status as StatusValue
      this.notifications = apiUser.notificationSetting as NotificationValue
    }

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      this.selectedTheme = savedTheme
      document.documentElement.setAttribute('theme', savedTheme)
    }
  },

  methods: {
    selectTheme(themeId: string) {
      this.selectedTheme = themeId
      document.documentElement.setAttribute('theme', themeId)
      localStorage.setItem('theme', themeId)
    },

    changePfp() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.click()

      input.onchange = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
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
            this.user.avatar = previewUrl
          }
          reader.readAsDataURL(file)
        }
      }
    },

    handlePasswordChange() {
    },

    async goAuth() {
      const auth = useAuthStore()
      try {
        await auth.logout()
      } catch (err) {
        console.error(err)
      }
      await this.$router.push('/')
    },
  },
})
</script>

<style scoped>
.thick-outline {
  border-width: 11px;
  border-radius: 50%;
  border-style: solid;
  border-color: var(--c-5);
  box-sizing: border-box;
}

.text-container {
  flex: 1;
  min-width: 0;
}

.q-card__actions .q-btn--rectangle {
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
}

.theme-row {
  border-radius: 15px;
}

.q-avatar {
  border-radius: 50% !important;
}

.picked {
  border-color: rgb(201, 237, 253);
  border-width: 10px;
  border-style: solid;
  box-shadow: 0 0 6px currentColor !important;
}

.theme-item {
  max-width: 150px;
}
</style>
