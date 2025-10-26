<template>
    <q-page class="q-pa-xl c-3">
        <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
                <q-card class="c-5 q-pa-md q-mb-lg">
                    <div class="row items-center q-gutter-md">
                        <q-avatar v-if="activeChannel" size="64px">
                            <img :src="activeChannel.avatar"/>
                        </q-avatar>
                        <div class="col">
                            <p v-if="activeChannel" class="ellipsis text-h6 q-mb-none text-c-1">{{ activeChannel.name }}</p>
                        </div>
                    </div>
                </q-card>
                <form-field v-if="activeChannel && isAdmin" v-model="activeChannel.name" title="Name"/>
                <div class="q-mt-md">
                    <p v-if="isAdmin" class="text-h6 text-weight-bold q-mb-xs text-c-1">Visibility</p>
                    <div class="row justify-between">
                        <q-select v-if="activeChannel && isAdmin" v-model="activeChannel.private" :options="visibilityOptions" dense standout="c-2" class="c-2 col always-primary  q-mr-sm" rounded popup-content-class="c-2 text-c-3" content-style="border-radius: 15px;"/>
                        <q-btn v-if="isAdmin" flat no-caps size="13px" class="col q-ml-sm c-5 q-pa-sm text-weight-bold text-c-1" @click="changeIcon">Change icon</q-btn> 
                    </div>
                </div>

                <div class="row justify-between q-mt-lg">
                    <q-btn flat no-caps size="13px" class="col negative q-pa-sm q-mr-sm text-weight-bold text-c-1" @click="confirmLeave = true">Leave channel</q-btn> 
                    <q-btn v-if="isAdmin" flat no-caps size="13px" class="col negative q-pa-sm q-ml-sm text-weight-bold text-c-1" @click="confirmClose = true">Close channel</q-btn> 
                </div>
            </div>

            <div class=" col-12 col-md-6">
                <div class="row items-center justify-between q-mb-md">
                    <p class="text-h6 text-weight-bold q-mb-xs text-c-1">Members</p>
                    <div>
                        <q-btn v-if="!isPrivate || isAdmin" flat no-caps icon="add" size="13px" class="col c-5 q-pa-sm q-mr-xs text-weight-bold text-c-1" @click="inviteMember">Invite</q-btn> 
                        <q-btn v-if="activeChannelMembers.length > 3" flat no-caps size="13px" class="col c-5 q-pa-sm text-weight-bold q-ml-xs text-c-1" @click="showMembers">Show all</q-btn> 
                    </div>
                </div>

                <div v-for="member in activeChannelMembers.slice(0, 3)" :key="member.id" class="member-item c-5 q-pa-sm q-mb-md row justify-between items-center">
                    <profile-block class="fit" :is-admin="isAdmin" :is-private="isPrivate" :user="member" :buttons="[ { icon: 'remove_circle_outline', action: 'remove' }]"></profile-block>
                </div>
                <p v-if="activeChannel && activeChannelMembers.length > 3" class="text-caption text-c-1 text-weight-bold">And {{ activeChannel.members - 3 }} others...</p>
            </div>
        </div>
        <confirm-popup v-model="confirmLeave" message="Are you sure you want to leave this channel?" confirm-label="Leave" @confirm="leaveChannel"></confirm-popup>
        <confirm-popup v-model="confirmClose" message="Are you sure you want to close this channel?" confirm-label="Close channel" @confirm="closeChannel"></confirm-popup>
    <members-popup :is-admin="isAdmin" :is-private="isPrivate" v-model="showMembersPopup" :members="activeChannelMembers"></members-popup>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Member } from 'src/types/common.ts'
import MembersPopup from 'src/components/popups/MembersPopup.vue'
import FormField from 'src/components/FormField.vue'
import ConfirmPopup from 'src/components/popups/ConfirmPopup.vue'
import ProfileBlock from 'src/components/sidebar/ProfileBlock.vue'

interface Channel {
    id: string
    name: string
    members: number
    private: string
    avatar: string
    invited: boolean
}

export default defineComponent({
    name: 'ChannelSettings',
    components: { FormField, ConfirmPopup, ProfileBlock, MembersPopup },

    props: {
        currentUser: {
            type: Object as PropType<Member>,
            default: () => ({
                nickname: 'Guest',
                name: 'Anonymous user',
                avatarUrl: '/avatars/default.png',
                status: 'online'
            })
        }
    },

    data() {
        return {
            confirmLeave: false,
            confirmClose: false,
            showMembersPopup: false,

            channels: [
                { id: '1',  name: 'FIIT STU',            members: 1216, private: 'Public', avatar: '/avatars/channels/FIIT.png',       invited: true},
                { id: '2',  name: 'Ženy na FIIT',        members: 3,    private: 'Private',  avatar: '/avatars/channels/zeny.png',       invited: false},
                { id: '3',  name: 'Študenti Fiit 3. r.', members: 621,  private: 'Public', avatar: '/avatars/channels/tretiacky.png',  invited: false},
                { id: '4',  name: 'Share & Care',        members: 27,   private: 'Private',  avatar: '/avatars/channels/cerveny.png',    invited: false},
                { id: '5',  name: 'FIIT STU',            members: 1216, private: 'Public', avatar: '/avatars/channels/FIIT.png',       invited: false},
                { id: '6',  name: 'Ženy na FIIT',        members: 3,    private: 'Private',  avatar: '/avatars/channels/zeny.png',       invited: false},
                { id: '7',  name: 'Študenti Fiit 3. r.', members: 621,  private: 'Public', avatar: '/avatars/channels/tretiacky.png',  invited: false},
                { id: '8',  name: 'FIIT STU',            members: 1216, private: 'Public', avatar: '/avatars/channels/FIIT.png',       invited: false},
                { id: '9',  name: 'Ženy na FIIT',        members: 3,    private: 'Private',  avatar: '/avatars/channels/zeny.png',       invited: false},
                { id: '10', name: 'Študenti Fiit 3. r.', members: 621,  private: 'Public', avatar: '/avatars/channels/tretiacky.png',  invited: false},
                { id: '11', name: 'Share & Care',        members: 27,   private: 'Private',  avatar: '/avatars/channels/cerveny.png',    invited: false}
            ] as Channel[],

            visibilityOptions: ['Public', 'Private'],

            membersByChannel: {
                '1': [
                { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
                { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' },
                { id: 4, nickname: 'Peťo', name: 'Peter Ďurčo', avatarUrl: '/avatars/users/peto.png', status: 'dnd' },
                { id: 5, nickname: 'Betka', name: 'Betka Zat', avatarUrl: '/avatars/users/betka.png', status: 'dnd' }
                ],
                '2': [
                { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'away' },
                { id: 3, nickname: 'Simi', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' },
                { id: 4, nickname: 'Peto', name: 'Peter Ďurčo', avatarUrl: '/avatars/users/peto.png', status: 'dnd' },
                { id: 5, nickname: 'Betty', name: 'Betka Zat', avatarUrl: '/avatars/users/betka.png', status: 'online' },
                { id: 6, nickname: 'Luki', name: 'Lukáš Novák', avatarUrl: '/avatars/users/default.png', status: 'offline' },
                { id: 7, nickname: 'Maro', name: 'Marek Kováč', avatarUrl: '/avatars/users/default.png', status: 'away' },
                { id: 8, nickname: 'Janča', name: 'Jana Hrivnáková', avatarUrl: '/avatars/users/default.png', status: 'dnd' },
                { id: 9, nickname: 'Tomino', name: 'Tomáš Blažek', avatarUrl: '/avatars/users/default.png', status: 'online' }
                ],
                '3': [
                { id: 1, nickname: 'Ady', name: 'Adrián Holub', avatarUrl: '/avatars/users/default.png', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Zuzi', name: 'Zuzana Kmeťová', avatarUrl: '/avatars/users/default.png', status: 'away' },
                { id: 3, nickname: 'Romo', name: 'Roman Šulc', avatarUrl: '/avatars/users/default.png', status: 'offline' },
                { id: 4, nickname: 'Katka', name: 'Katarína Benková', avatarUrl: '/avatars/users/default.png', status: 'dnd' },
                { id: 5, nickname: 'Dodo', name: 'Dominik Ondruš', avatarUrl: '/avatars/users/default.png', status: 'online' },
                { id: 6, nickname: 'Miška', name: 'Michaela Králová', avatarUrl: '/avatars/users/default.png', status: 'away' },
                { id: 7, nickname: 'Juro', name: 'Juraj Oravec', avatarUrl: '/avatars/users/default.png', status: 'offline' },
                { id: 8, nickname: 'Viki', name: 'Viktor Lipnický', avatarUrl: '/avatars/users/default.png', status: 'online' },
                { id: 9, nickname: 'Patres', name: 'Patrik Borovský', avatarUrl: '/avatars/users/default.png', status: 'dnd' },
                { id: 10, nickname: 'Leny', name: 'Lenka Hrušková', avatarUrl: '/avatars/users/default.png', status: 'away' },
                { id: 11, nickname: 'Stano', name: 'Stanislav Hrubý', avatarUrl: '/avatars/users/default.png', status: 'online' },
                { id: 12, nickname: 'Evka', name: 'Eva Mihálová', avatarUrl: '/avatars/users/default.png', status: 'offline' },
                { id: 13, nickname: 'Borka', name: 'Barbora Čechová', avatarUrl: '/avatars/users/default.png', status: 'online' },
                { id: 14, nickname: 'Maťo', name: 'Martin Švec', avatarUrl: '/avatars/users/default.png', status: 'away' }
                ],
                '4': [
                { id: 1, nickname: 'Táňa', name: 'Tatiana Gregorová', avatarUrl: '/avatars/users/default.png', role: 'admin', status: 'away' },
                { id: 2, nickname: 'Boro', name: 'Boris Kajan', avatarUrl: '/avatars/users/default.png', status: 'online' },
                { id: 3, nickname: 'Iva', name: 'Ivona Pavlíková', avatarUrl: '/avatars/users/default.png', status: 'offline' },
                { id: 4, nickname: 'Rišo', name: 'Richard Valach', avatarUrl: '/avatars/users/default.png', status: 'dnd' },
                { id: 5, nickname: 'Feri', name: 'František Šimko', avatarUrl: '/avatars/users/default.png', status: 'online' },
                { id: 6, nickname: 'Naty', name: 'Natália Žideková', avatarUrl: '/avatars/users/default.png', status: 'away' },
                { id: 7, nickname: 'Pali', name: 'Pavol Čierny', avatarUrl: '/avatars/users/default.png', status: 'offline' },
                { id: 8, nickname: 'Sáruš', name: 'Sára Lednická', avatarUrl: '/avatars/users/default.png', status: 'online' }
                ],
                '5': [
                { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
                { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
                ],
                '6': [
                { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
                { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
                ],
                '7': [
                { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
                { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
                ],
                '8': [
                { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
                { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
                ],
                '9': [
                { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
                { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
                ],
                '10': [
                { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
                { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
                ],
                '11': [
                { id: 1, nickname: 'FireFly x3', name: 'Svetlana Pivarčiová', avatarUrl: '/avatars/users/firefly.jpg', role: 'admin', status: 'online' },
                { id: 2, nickname: 'Nikol', name: 'Nikol Maljarová', avatarUrl: '/avatars/users/nikol.png', status: 'online' },
                { id: 3, nickname: 'Simča', name: 'Simona Ričovská', avatarUrl: '/avatars/users/simca.png', status: 'offline' }
                ]
            } as Record<string, Member[]>,
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
                if (this.activeChannel)
                    this.activeChannel.avatar = previewUrl
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
    },

    computed: {
        activeChannel(): Channel | null {
            const id = this.$route.params.id as string | undefined
            if (!id) return null
            return this.channels.find(c => c.id === id) ?? null
        },
        
        activeChannelMembers(): Member[] {
            const id = this.$route.params.id as string | undefined
            return id ? (this.membersByChannel[id] || []) : []
        },

        isAdmin(): boolean {
            if (!this.activeChannel || !this.currentUser) return false
            const members = this.membersByChannel[this.activeChannel.id] || []
            const current = members.find(m => m.nickname === this.currentUser.nickname)
            return current?.role === 'admin'
        },

        isPrivate(): boolean {
            return this.activeChannel?.private === 'Private'
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
