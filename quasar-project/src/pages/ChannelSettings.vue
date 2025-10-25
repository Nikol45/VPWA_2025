<template>
    <q-page class="q-pa-xl c-3">
        <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
                <q-card class="c-5 q-pa-md q-mb-lg">
                    <div class="row items-center q-gutter-md">
                        <q-avatar size="64px">
                            <img :src="channel.avatar"/>
                        </q-avatar>
                        <div class="col">
                            <p class="ellipsis text-h6 q-mb-none text-c-1">{{ channel.name }}</p>
                        </div>
                    </div>
                </q-card>
                <form-field v-model="channel.name" title="Name"/>
                <div class="q-mt-md">
                    <p class="text-h6 text-weight-bold q-mb-xs text-c-1">Visibility</p>
                    <div class="row justify-between">
                        <q-select v-model="channel.visibility" :options="visibilityOptions" dense standout="c-2" class="c-2 col always-primary  q-mr-sm" rounded popup-content-class="c-2 text-c-3" content-style="border-radius: 15px;"/>
                        <q-btn flat no-caps size="13px" class="col q-ml-sm c-5 q-pa-sm text-weight-bold text-c-1" @click="changeIcon">Change icon</q-btn> 
                    </div>
                </div>

                <div class="row justify-between q-mt-lg">
                    <q-btn flat no-caps size="13px" class="col negative q-pa-sm q-mr-sm text-weight-bold text-c-1" @click="confirmLeave = true">Leave channel</q-btn> 
                    <q-btn flat no-caps size="13px" class="col negative q-pa-sm q-ml-sm text-weight-bold text-c-1" @click="confirmClose = true">Close channel</q-btn> 
                </div>
            </div>

            <div class=" col-12 col-md-6">
                <div class="row items-center justify-between q-mb-md">
                    <p class="text-h6 text-weight-bold q-mb-xs text-c-1">Members</p>
                    <div>
                        <q-btn flat no-caps icon="add" size="13px" class="col c-5 q-pa-sm q-mr-xs text-weight-bold text-c-1" @click="inviteMember">Invite</q-btn> 
                        <q-btn v-if="members.length > 3" flat no-caps size="13px" class="col c-5 q-pa-sm text-weight-bold q-ml-xs text-c-1" @click="showMembers">Show all</q-btn> 
                    </div>
                </div>

                <div v-for="member in members.slice(0, 3)" :key="member.id" class="member-item c-5 q-pa-sm q-mb-md row justify-between items-center">
                    <profile-block class="fit" :user="member" :buttons="[ { icon: 'remove_circle_outline', action: 'remove' }]"></profile-block>
                </div>
                <p class="text-caption text-c-1 text-weight-bold">And {{ channel.members - 3 }} others...</p>
            </div>
        </div>
        <confirm-popup v-model="confirmLeave" message="Are you sure you want to leave this channel?" confirm-label="Leave" @confirm="leaveChannel"></confirm-popup>
        <confirm-popup v-model="confirmClose" message="Are you sure you want to close this channel?" confirm-label="Close channel" @confirm="closeChannel"></confirm-popup>
    <members-popup v-model="showMembersPopup" :members="members"></members-popup>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Member } from 'src/types/common.ts'
import MembersPopup from 'src/components/popups/MembersPopup.vue'
import FormField from 'src/components/FormField.vue'
import ConfirmPopup from 'src/components/popups/ConfirmPopup.vue'
import ProfileBlock from 'src/components/sidebar/ProfileBlock.vue'

export default defineComponent({
    name: 'ChannelSettings',
    components: { FormField, ConfirmPopup, ProfileBlock, MembersPopup },


    data() {
        return {
            confirmLeave: false,
            confirmClose: false,
            showMembersPopup: false,

            channel: {
                name: 'Ženy na FIIT',
                avatar: '/avatars/channels/zeny.png',
                visibility: 'Public',
                members: 5
            },

            visibilityOptions: ['Public', 'Private'],

            members: [
                {
                    id: 1,
                    nickname: 'FireFly x3',
                    name: 'Svetlana Pivarčiová',
                    avatarUrl: '/avatars/users/firefly.jpg',
                    role: 'admin',
                    status: 'online'
                },
                {
                    id: 2,
                    nickname: 'Nikol',
                    name: 'Nikol Maljarová',
                    avatarUrl: '/avatars/users/nikol.png',
                    status: 'online'
                },
                {
                    id: 3,
                    nickname: 'Simča',
                    name: 'Simona Ričovská',
                    avatarUrl: '/avatars/users/simca.png',
                    status: 'offline'
                },
                {
                    id: 4,
                    nickname: 'Peťo',
                    name: 'Peter Ďurčo',
                    avatarUrl: '/avatars/users/peto.png',
                    status: 'dnd'
                },
                {
                    id: 5,
                    nickname: 'Betka',
                    name: 'Betka Zat',
                    avatarUrl: '/avatars/users/betka.png',
                    status: 'dnd'
                }
            ] as Member[]
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

        showMembers() {
            this.showMembersPopup = true
        },

        leaveChannel() {
            void this.$router.push({ name: 'home' })
        },

        closeChannel() {
            void this.$router.push({ name: 'home' })
        },

        inviteMember() {

        }
    }
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
