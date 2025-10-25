<template>
    <div class="q-pa-md">
        <q-input dense standout v-model="search" placeholder="Search channels..." class="no-padding search-input c-3" input-class="text-white">
        <template #prepend>
            <q-icon name="search" class="q-mr-sm" />
        </template>
        </q-input>

        <div class="row no-wrap q-gutter-sm q-mt-sm">
        <q-btn class="col text-c-1" no-caps :flat="filter!=='all'" :unelevated="filter==='all'" dense label="All" @click="$emit('update:filter', 'all')" :class="filter==='all' ? 'c-5' : 'c-3'"/>
        <q-btn class="col text-c-1" no-caps :flat="filter!=='public'" :unelevated="filter==='public'" dense label="Public" @click="$emit('update:filter', 'public')" :class="filter==='public' ? 'c-5' : 'c-3'"/>
        <q-btn class="col text-c-1" no-caps :flat="filter!=='private'" :unelevated="filter==='private'" dense label="Private" @click="$emit('update:filter', 'private')" :class="filter==='private' ? 'c-5' : 'c-3'"/>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import type { PropType } from 'vue'
    import type { Visibility } from 'src/types/common.ts'

    export default defineComponent ({
        name: 'SearchFilter',

        props: {
            modelValue: {
                type: String,
                default: ''
            },

            filter: {
                type: String as PropType<Visibility>,
                required: false,
                default: 'all'

            }
        },

        computed: {
            search: {
                get(): string {
                    return this.modelValue
                },

                set(val:string) {
                    this.$emit('update:modelValue', val)
                }
            },
        }
    })

</script>
