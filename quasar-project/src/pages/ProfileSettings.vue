<template>
  <q-page class="q-pa-xl l-3">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-4">
        <div class="q-pb-md">
          <!-- avatar + names -->
          <div class="row items-center q-ma-md q-pa-md l-5">
            <q-avatar size="72px" class="q-mr-md relative-position">
              <img :src="profile.avatarUrl" alt="avatar" />
              <q-badge rounded color="positive" class="absolute-bottom-right status-dot" aria-label="online" />
            </q-avatar>

            <div class="column">
              <div class="text-h6">{{ profile.displayName }}</div>
              <div class="text-caption">{{ profile.fullName }}</div>
            </div>
          </div>

          <!-- edit fields -->
          <div class="q-pa-md">
            <div class="q-mb-md">
              <div class="q-mb-xs">Nickname</div>
              <div class="row no-wrap items-center q-gutter-sm">
                <q-input dense filled v-model="profile.nickname" class="col edit-field" readonly />
                <q-btn dense no-caps class="q-px-lg q-py-sm l-5" label="Edit" />
              </div>
            </div>

            <div class="q-mb-md">
              <div class="q-mb-xs">First name</div>
              <div class="row no-wrap items-center q-gutter-sm">
                <q-input dense filled v-model="profile.firstName" class="col edit-field" readonly />
                <q-btn dense no-caps class="q-px-lg q-py-sm l-5" label="Edit" />
              </div>
            </div>

            <div class="q-mb-md">
              <div class="q-mb-xs">Last name</div>
              <div class="row no-wrap items-center q-gutter-sm">
                <q-input dense filled v-model="profile.lastName" class="col edit-field" readonly />
                <q-btn dense no-caps class="q-px-lg q-py-sm l-5" label="Edit" />
              </div>
            </div>

            <div class="q-mb-md">
              <div class="q-mb-xs">E-mail</div>
              <div class="row no-wrap items-center q-gutter-sm">
                <q-input dense filled v-model="profile.email" class="col edit-field" readonly />
                <q-btn dense no-caps class="q-px-lg q-py-sm l-5" label="Edit" />
              </div>
            </div>

            <div class="row q-gutter-sm q-mt-md">
              <q-btn no-caps class="outline-l5 text-white" label="Change profile picture" />
              <q-btn no-caps class="outline-l5 text-white" label="Change password" />
            </div>

            <q-btn color="negative" class="q-mt-md" no-caps label="Log out" />
          </div>
        </div>
      </div>

      <div class="col-12 col-md-8">
        <div class="q-mb-lg">
          <!-- theme selector -->
          <div class="text-h6 q-mb-sm">App appearance</div>
          <div class="q-mb-sm">Choose app theme:</div>
          <div class="theme-box">
            <div class="row items-center q-col-gutter-xl">
              <div class="col-auto cursor-pointer" @click="theme='lilac'">
                <div :class="['theme-dot lilac', theme==='lilac' ? 'selected_lilac' : '']"></div>
                <div class="text-subtitle2 q-mt-sm">Lilac dream</div>
              </div>
              <div class="col-auto cursor-pointer" @click="theme='midnight'">
                <div :class="['theme-dot midnight', theme==='midnight' ? 'selected_midnight' : '']"></div>
                <div class="text-subtitle2 q-mt-sm">Midnight blue</div>
              </div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- radios: white outline and filled -->
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-sm">Status</div>
            <div class="section-box">
              <q-option-group
                class="radio-white"
                v-model="status"
                type="radio"
                color="white"
                keep-color
                :options="[
                  { label: 'Online', value: 'online' },
                  { label: 'Do not disturb', value: 'dnd' },
                  { label: 'Offline', value: 'offline' }
                ]"
              />
            </div>
          </div>

          <!-- radios: white outline and filled -->
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-sm">Notifications</div>
            <div>
              <q-option-group
                class="radio-white"
                v-model="notifications"
                type="radio"
                color="white"
                keep-color
                :options="[
                  { label: 'Show all', value: 'all' },
                  { label: 'Show mentions only', value: 'mentions' },
                  { label: 'Mute all', value: 'mute' }
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProfileSettings',
  setup () {
    const profile = ref({
      avatarUrl: '/avatars/pfp1.jpg',
      displayName: 'FireFly x3',
      fullName: 'Svetlana Pivarčiová',
      nickname: 'FireFly x3',
      firstName: 'Svetlana',
      lastName: 'Pivarčiová',
      email: 'firefly96@gmail.com'
    })

    const theme = ref<'lilac' | 'midnight'>('lilac')
    const status = ref<'online' | 'dnd' | 'offline'>('online')
    const notifications = ref<'all' | 'mentions' | 'mute'>('all')

    return { profile, theme, status, notifications }
  }
})
</script>

<style scoped>

/* theme tiles */
.theme-box { background: var(--l-4); border-radius: 16px; padding: 20px; }
.theme-dot { width: 54px; height: 54px; border-radius: 50%; }
.theme-dot.lilac { background: radial-gradient(circle at 30% 30%, #cbb6ff, #6f55a3 70%); }
.theme-dot.midnight { background: radial-gradient(circle at 30% 30%, #a8c4d4, #21384d 70%); }
.theme-dot.selected_lilac { box-shadow: 0 0 0 4px rgba(255,255,255,0.18), 0 0 0 8px rgba(120,90,160,0.55); }
.theme-dot.selected_midnight { box-shadow: 0 0 0 4px rgba(255,255,255,0.18), 0 0 0 8px rgba(88, 110, 133, 0.55); }

/* status badge ring */
.status-dot { width: 24px; height: 24px; padding: 0; min-width: 0; border: 5px solid var(--l-5); box-sizing: border-box; }

/* inputs bg = l-1 */
.edit-field :deep(.q-field__control){
  background: var(--l-1);
}

/* radios forced white (outline and filled) */
:deep(.radio-white .q-radio__inner) { border-color: #fff; }
:deep(.radio-white .q-radio--truthy .q-radio__bg) { background: #fff; }
</style>
