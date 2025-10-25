<template>
  <q-page class="q-px-xl q-pt-xl q-pb-sm c-3 text-c-1">
    <div class="row q-col-gutter-xl">

      <div class="coc-12 col-md-4">
        <q-card class="c-5 q-pa-md">
          <div class="row items-center q-gutter-md">
            <div class="relative-position">
              <q-avatar size="64px">
                <img :src="user.avatar"/>
              </q-avatar>
              <q-icon name="circle" bordered size="17px" :color="statusColor" class="thick-outline absolute-bottom-right q-mb-xs"/>
            </div>
            <div class="text-container">
              <p class="ellipsis text-h6 q-mb-none text-c-1">{{ user.nickname }}</p>
              <p class="ellipsis text-caption text-weight-light q-mb-none text-c-1">{{ user.name }}</p>
            </div>
          </div>
        </q-card>

        <div class="q-mt-lg">
          <form-field v-model="user.nickname" title="Nickname"/>
          <form-field v-model="user.firstName" title="First name"/>
          <form-field v-model="user.lastName" title="Last name"/>
          <form-field v-model="user.email" title="E-mail"/>
        </div>

        <div class="row q-gutter-lg q-mt-md">
          <q-btn flat no-caps size="13px" class="col c-5 q-pa-sm text-weight-bold text-c-1" @click="changePfp">Change icon</q-btn>
          <q-btn flat no-caps size="13px" class="col c-5 q-pa-sm text-weight-bold text-c-1" @click="showChangePassword = true">Change password</q-btn>
        </div>

        <div class="q-mt-md">
          <q-btn size="13px" label="Log out" no-caps color="negative" unelevated class="text-weight-bold text-c-1 q-py-sm q-px-lg" @click="confirm = true"/>
        </div>
      </div>

      <div class="coc-12 col-md-8">
        <div class="q-mb-lg">
          <p class="text-h5 text-weight-bold text-c-1">App appearance</p>
          <p class="text-h6 text-weight-bold text-c-1 q-mt-lg">Choose app theme:</p>

          <div class="theme-row row q-col-gutter-md q-mt-md c-3 justify-between">
            <q-card flat v-for="theme in themes" :key="theme.id" :class="['coc-5', selectedTheme === theme.id ? 'picked' : '']" class="c-5 cursor-pointer q-pa-md flex flex-center column" @click="selectTheme(theme.id)">
              <q-avatar size="60px">
                <img :src="theme.preview"/>
              </q-avatar>
              <p class="q-mt-sm text-subtitle2 text-c-1 q-ma-none">{{ theme.name }}</p>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-6">
            <p class="text-h6 text-c-1 text-weight-bold">Status</p>
            <q-option-group v-model="status" :options="statusOptions" color="c-1" type="radio"/>
          </div>

          <div class="col-6">
            <p class="text-h6 text-c-1 text-weight-bold">Notifications</p>
            <q-option-group v-model="notifications" :options="notificationOptions" color="c-1" type="radio"/>
          </div>
        </div>
      </div>
    </div>
    <base-form v-model="showChangePassword" :cancel=true title="Change password" :fields="passwordFields" @submit="handlePasswordChange"/>
    <q-dialog v-model="confirm" persistent>
      <q-card class="c-2 text-c-3 text-weight-bold q-pa-md">
        <q-card-section class="row items-center">
          <span class="logout-warning">Are you sure you want to log out?</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="Cancel" no-caps class="c-5 text-c-1 q-mr-lg" v-close-popup/>
          <q-btn flat label="Log out" no-caps class="text-c-1 negative" @click="goAuth"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FormField from 'src/components/FormField.vue'
import BaseForm from 'src/components/auth/BaseForm.vue'

export default defineComponent({
  name: 'ProfileSettings',
  components: { FormField, BaseForm },

  data() {
    return {
      confirm: false,
      showChangePassword: false,

      user: {
        nickname: 'FireFly x3',
        firstName: 'Svetlana',
        lastName: 'Pivarčiová',
        name: 'Svetlana Pivarčiová',
        email: 'firefly96@gmail.com',
        avatar: '/avatars/users/firefly.jpg'
      },

      passwordFields: [
        { label: 'Old password', model: 'oldPassword', type: 'password' as const, rules: [(val: string) => !!val || 'Old password is required'] },
        { label: 'New password', model: 'newPassword', type: 'password' as const, rules: [(val: string) => !!val || 'New password is required'] },
        { label: 'Retype new password', model: 'rePassword', type: 'password' as const, rules: [(val: string) => !!val || 'Retyped password is required'] },
      ],

      selectedTheme: 'lilac',
      status: 'online',
      notifications: 'all',

      themes: [
        { id: 'L', name: 'Lilac dream', preview: '/themes/gradient_lilac.png' },
        { id: 'B', name: 'Midnight blue', preview: '/themes/gradient_blue.png' }
      ],

      statusOptions: [
        { label: 'Online', value: 'online' },
        { label: 'Do not disturb', value: 'dnd' },
        { label: 'Offline', value: 'offline' }
      ],

      notificationOptions: [
        { label: 'Show all', value: 'all' },
        { label: 'Show mentions only', value: 'mentions' },
        { label: 'Mute all', value: 'mute' }
      ]
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
          const reader = new FileReader()
          reader.onload = e => {
            const previewUrl = e.target?.result as string
            this.user.avatar = previewUrl
          }
          reader.readAsDataURL(file)
        }
      }
    },

    handlePasswordChange() {
      
    },

    goAuth() {
      void this.$router.push('/')
    }
  },

  computed: {
    statusColor(): string {
      switch (this.status) {
        case 'online': return 'positive'
        case 'dnd': return 'negative'
        case 'offline': return 'grey'
        default: return 'grey'
      }
    }
  },

  watch: {
    'user.firstName': function () {
      this.user.name = `${this.user.firstName} ${this.user.lastName}`.trim()
    },

    'user.lastName': function () {
      this.user.name = `${this.user.firstName} ${this.user.lastName}`.trim()
    }
  },

  created() {
    const saved = localStorage.getItem('theme')
    if (saved) {
      this.selectedTheme = saved
      document.documentElement.setAttribute('theme', saved)
    }
  }

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

  .logout-warning {
    font-size: 20px;
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
</style>
