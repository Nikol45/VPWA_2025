<template>
  <q-dialog v-model="localShow">
    <q-card class="c-4 text-c-1">
      <q-card-section class="row items-center justify-between q-pb-sm">
        <p class="text-h6 text-c-1 q-ma-none">Invite member</p>
        <q-btn flat round dense icon="close" @click="closePopup" />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-tabs v-model="tab" dense align="justify" class="text-c-1">
          <q-tab name="nickname" label="By nickname" />
          <q-tab name="code" label="Invite code" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="c-5 q-pa-md">
          <!-- cez nickname -->
          <q-tab-panel name="nickname" class="q-pa-none">
            <div class="q-mb-sm text-c-1">
              Enter user's nickname:
            </div>

            <q-input
              v-model="nickname"
              dense
              standout="c-2"
              class="c-2 always-primary q-mb-md"
              rounded
              placeholder="nickname..."
              @keyup.enter="submitNickname"
            />

            <div class="row justify-end">
              <q-btn
                flat
                no-caps
                size="13px"
                class="c-5 q-pa-sm text-weight-bold text-c-1"
                :disable="!nickname.trim()"
                @click="submitNickname"
              >
                Send invite
              </q-btn>
            </div>
          </q-tab-panel>

          <!-- Pozvanie cez kód -->
          <q-tab-panel name="code" class="q-pa-none">
            <div class="q-mb-sm text-c-1">
              Share this code:
            </div>

            <div class="invite-code-box c-5 row items-center justify-between q-pa-md">
              <div class="text-h6 text-weight-bold tracking text-c-1">
                {{ inviteCode }}
              </div>
              <q-btn flat no-caps size="13px" @click="copyCode"
                     class="c-4 q-pa-sm q-px-md text-weight-bold text-c-1"
              >
                <q-icon name="content_copy" class="q-mr-sm" />
                <span>Copy</span>
              </q-btn>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { copyToClipboard } from 'quasar'

export default defineComponent({
  name: 'InvitePopup',

  props: {
    modelValue: {
      type: Boolean,
      required: true
    },

    inviteCode: {
      type: String,
      required: true
    }
  },

  emits: ['update:modelValue', 'invite', 'copy'],

  data() {
    return {
      localShow: this.modelValue,
      tab: 'nickname' as 'nickname' | 'code',
      nickname: ''
    }
  },

  watch: {
    modelValue(val: boolean) {
      this.localShow = val
      // pri otvorení resetni stav
      if (val) {
        this.tab = 'nickname'
        this.nickname = ''
      }
    },

    localShow(val: boolean) {
      this.$emit('update:modelValue', val)
    }
  },

  methods: {
    closePopup() {
      this.localShow = false
    },

    submitNickname() {
      const nick = this.nickname.trim()
      if (!nick) return

      // posli do parentu
      this.$emit('invite', nick)
      this.nickname = ''
      this.localShow = false
    },

    copyCode() {
      void copyToClipboard(this.inviteCode)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Invite code copied',
            position: 'bottom-right',
            timeout: 1500
          })
          this.$emit('copy')
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Copy failed',
            position: 'bottom-right',
            timeout: 1500
          })
        })
    }
  }
})
</script>

<style scoped>
.q-card {
  width: 460px;
  max-width: 90vw;
  border-radius: 15px;
}

.tracking {
  letter-spacing: 0.12em;
}

</style>
