<template>
    <q-item clickable :class="[ channel.invited ? 'invited-highlight' : 'c-4, text-c-1']" @click="$emit('click', channel)">
        <q-item-section avatar>
            <q-avatar size="36px">
                <img :src="channel.avatar" :alt="channel.name" />
            </q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label class="text-body1">{{ channel.name }}</q-item-label>
            <q-item-label class="text-caption text-weight-thin">{{ channel.members }} members</q-item-label>
        </q-item-section>

        <q-item-section side>
            <q-chip dense class="text-c-1 q-pa-sm text-caption" :class="channel.private ? 'c-3' : 'c-5'">
                {{ channel.private ? 'Private' : 'Public' }}
            </q-chip>
        </q-item-section>
    </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Channel {
  id: string
  name: string
  members: number
  private: boolean
  avatar: string
  invited: boolean
}

export default defineComponent ({
    name: 'ChannelBlock',

    props: {
        channel: {
            type: Object as PropType<Channel>,
            required: true
        }
    },

    emits: ['click']
})

</script>

<style>
    @keyframes pulse-highlight {
        0%   { background-color: var(--c-4); }
        50%  { background-color: var(--c-2); color: var(--c-5)}
        100% { background-color: var(--c-4); }
    }

    .invited-highlight {
        animation: pulse-highlight 2s infinite;
    }
</style>
