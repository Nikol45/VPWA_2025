<template>
  <q-item
    clickable
    class="text-c-1"
    :class="{ 'invited-bg': channel.invited }"
    @click="!channel.invited && $emit('click', channel)"
  >
    <q-item-section avatar>
      <q-avatar size="36px">
        <img :src="channel.avatar" :alt="channel.name" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-body1">{{ channel.name }}</q-item-label>
      <q-item-label class="text-caption text-weight-thin">
        {{ channel.members }} members
      </q-item-label>
    </q-item-section>

    <!-- invited -->
    <q-item-section side v-if="channel.invited">
      <div class="row no-wrap items-center q-gutter-xs">
        <q-chip
          dense
          class="text-c-1 q-pa-sm q-px-md c-3"
          clickable
          @click.stop="$emit('accept', channel)"
        >
          <q-icon name="check" class="text-c-1" />
        </q-chip>

        <q-chip
          dense
          class="text-c-1 q-pa-sm q-px-md c-5"
          clickable
          @click.stop="$emit('decline', channel)"
        >
          <q-icon name="close" class="text-c-1" />
        </q-chip>
      </div>
    </q-item-section>

    <!-- normal -->
    <q-item-section side v-else>
      <q-chip
        dense
        class="text-c-1 q-pa-sm text-caption"
        :class="channel.private ? 'c-3' : 'c-5'"
      >
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

export default defineComponent({
  name: 'ChannelBlock',

  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true
    }
  },

  emits: ['click', 'accept', 'decline']
})
</script>

<style>

.invited-bg {
  background-color: rgba(255, 255, 255, 0.05);
}

</style>
