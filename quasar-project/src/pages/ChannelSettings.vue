<template>
    <q-page class="q-pa-xl l-3">
        <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
                <q-card class="l-5 q-pa-md q-mb-lg">
                    <div class="row items-center q-gutter-md">
                        <q-avatar size="64px">
                            <img :src="channel.avatar"/>
                        </q-avatar>
                        <div class="col">
                            <p class="ellipsis text-h6 q-mb-none text-l-1">{{ channel.name }}</p>
                        </div>
                    </div>
                </q-card>
                <form-field v-model="channel.name" title="Name"/>
                <div class="q-mt-md">
                    <p class="text-h6 text-weight-bold q-mb-xs text-l-1">Visibility</p>
                    <div class="row justify-between">
                        <q-select v-model="channel.visibility" :options="visibilityOptions" dense standout="l-2" class="l-2 col always-primary  q-mr-sm" rounded popup-content-class="l-2 text-l-3" content-style="border-radius: 15px;"/>
                        <q-btn flat no-caps size="13px" class="col q-ml-sm l-5 q-pa-sm text-weight-bold text-l-1" @click="changeIcon">Change icon</q-btn> 
                    </div>
                </div>

                <div class="row justify-between q-mt-lg">
                    <q-btn flat no-caps size="13px" class="col negative q-pa-sm q-mr-sm text-weight-bold text-l-1" @click="leaveChannel">Leave channel</q-btn> 
                    <q-btn flat no-caps size="13px" class="col negative q-pa-sm q-ml-sm text-weight-bold text-l-1" @click="closeChannel">Close channel</q-btn> 
                </div>
            </div>

            <div class="col-12 col-md-6">
                <div class="row items-center justify-between q-mb-md">
                    <p class="text-h6 text-weight-bold q-mb-xs text-l-1">Members</p>
                    <div>
                        <q-btn flat no-caps icon="add" size="13px" class="col l-5 q-pa-sm text-weight-bold text-l-1" @click="inviteMember">Invite</q-btn> 
                        <q-btn flat no-caps size="13px" class="col l-5 q-pa-sm text-weight-bold text-l-1" @click="showMembers">Show all</q-btn> 
                    </div>
                </div>

                <q-card
                    v-for="member in members"
                    :key="member.id"
                    class="l-5 q-pa-sm q-mb-sm row items-center justify-between"
                >
                    <div class="row items-center q-gutter-sm">
                        <q-avatar size="40px">
                            <img :src="member.avatar" alt="member avatar" />
                        </q-avatar>
                        <div>
                            <div class="text-subtitle1">{{ member.nickname }}</div>
                            <div class="text-caption">{{ member.name }}</div>
                        </div>
                    </div>

                    <div>
                        <q-chip
                            v-if="member.role === 'admin'"
                            color="l-4"
                            text-color="white"
                            dense
                            label="Admin"
                        />
                        <q-btn
                            v-else
                            round
                            dense
                            flat
                            icon="remove_circle_outline"
                            color="l-2"
                            class="q-ml-sm"
                        />
                    </div>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FormField from 'src/components/FormField.vue'

export default defineComponent({
    name: 'ChannelSettings',
    components: { FormField },


    data() {
        return {
            channel: {
                name: 'Ženy na FIIT',
                avatar: '/avatars/channels/zeny.png',
                visibility: 'Public'
            },

            visibilityOptions: ['Public', 'Private'],

            members: [
                {
                    id: 1,
                    nickname: 'FireFly x3',
                    name: 'Svetlana Pivarčiová',
                    avatar: '/avatars/users/firefly.jpg',
                    role: 'admin'
                },
                {
                    id: 2,
                    nickname: 'Nikol 🐱',
                    name: 'Nikol Maljarová',
                    avatar: '/avatars/users/nikol.jpg'
                },
                {
                    id: 3,
                    nickname: 'Simča ✨',
                    name: 'Simona Rišovská',
                    avatar: '/avatars/users/simca.jpg'
                }
            ]
        }
    },

    methods: {
        changeIcon() {
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
                this.channel.avatar = previewUrl
            }
            reader.readAsDataURL(file)
            }
      }
        },

        leaveChannel() {

        },

        closeChannel() {

        },

        inviteMember() {

        },

        showMembers() {

        }
    }
})
</script>

<style scoped>
.always-primary :deep(.q-field__native),
.always-primary :deep(.q-field__label),
.always-primary :deep(.q-field__control),
.always-primary :deep(.q-field__marginal) {
  color: var(--q-primary) !important;
}


</style>
