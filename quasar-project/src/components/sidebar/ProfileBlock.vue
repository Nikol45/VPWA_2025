<template>
    <div v-if="user" class="l-5 text-l-1">
        <q-toolbar class="q-px-md" style="min-height:72px">
        <q-avatar size="45px" class="q-mr-md">
            <img :src="user.avatarUrl" alt="avatar" />
        </q-avatar>

        <div class="column">
            <div class="text-h6">{{user.nickname}}</div>
            <div class="text-caption">{{user.name}}</div>
        </div>

        <q-space/>
        <q-btn flat round dense icon="notifications_none" class="q-mr-sm" />
        <q-btn flat round dense icon="settings" :to="{ name: 'profile-settings' }" />
        </q-toolbar>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent ({
        name: 'ProfileBlock',

        props: {
            user: {
                type: Object,
                required: false,
                default: () => ({
                    nickname: 'Guest',
                    name: 'Anonymous User',
                    avatarUrl: '/avatars/default.png'
                })
            }
        }
    })
</script>