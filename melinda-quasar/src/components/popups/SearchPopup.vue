<template>
    <q-dialog v-model="localShow">
        <q-card class="my_card c-2 q-pa-md">
            <q-card-section class="text-center">
                <div class="text-c-5 text-h5 text-weight-bold">Search for a Channel</div>
                <div class="text-grey-8 q-mt-xs">Discover public channels</div>
            </q-card-section>

            <q-card-section>
                <q-input
                    standout
                    dense
                    class="c-2 always-primary text-c-3 q-mb-md"
                    v-model="query"
                    placeholder="Search channels"
                    debounce="300"
                    @update:model-value="onQueryChange"
                >
                    <template #prepend><q-icon name="search" /></template>
                </q-input>

                <q-scroll-area class="results-area">
                    <q-list class="c-2">
                        <div
                            v-for="ch in filteredResults"
                            :key="ch.id"
                            class="row items-center q-mb-md no-wrap q-gutter-x-sm"
                        >
                            <div class="col">
                                <div class="rad-15 c-1 text-c-3 q-py-sm q-px-md">
                                    {{ ch.name }}
                                </div>
                            </div>
                            <div class="col-auto">
                                <q-btn
                                    dense
                                    no-caps
                                    label="Join"
                                    class="c-5 text-c-1 rad-15 q-px-md"
                                    @click="onJoin(ch)"
                                />
                            </div>
                        </div>

                        <div
                            v-if="!filteredResults.length && query.trim()"
                            class="text-c-3 text-caption q-mt-sm"
                        >
                            No channels found
                        </div>
                    </q-list>
                </q-scroll-area>
            </q-card-section>

            <q-card-actions align="left">
                <q-btn flat no-caps class="text-c-3" label="Back" @click="onBack" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface ChannelResult {
    id: string
    name: string
}

export default defineComponent({
    name: 'SearchPopup',

    props: {
        modelValue: { type: Boolean, required: true },
        results: {
            type: Array as PropType<ChannelResult[]>,
            default: () => [],
        },
    },

    emits: ['update:modelValue', 'search', 'join', 'back'],

    data() {
        return {
            localShow: this.modelValue,
            query: '',
        }
    },

    computed: {
        filteredResults(): ChannelResult[] {
            const norm = (s: string) =>
                s
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()

            const q = norm(this.query.trim())
            const tokens = q.split(/\s+/).filter(Boolean)

            const base = this.results

            if (!tokens.length) return base

            return base.filter((c) => {
                const n = norm(c.name)
                return tokens.every((t) => n.includes(t))
            })
        },
    },

    watch: {
        modelValue(v: boolean) {
            this.localShow = v
            if (!v) {
                this.query = ''
            }
        },

        localShow(v: boolean) {
            this.$emit('update:modelValue', v)
            if (!v) {
                this.query = ''
            }
        },
    },

    methods: {
        onQueryChange() {
            this.$emit('search', this.query)
        },

        onJoin(ch: ChannelResult) {
            this.$emit('join', ch)
        },

        onBack() {
            this.$emit('back')
            this.localShow = false
        },
    },
})
</script>

<style scoped>
.results-area {
    height: 300px;
}
</style>
