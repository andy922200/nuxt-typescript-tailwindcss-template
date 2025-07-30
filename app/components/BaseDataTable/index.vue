<script setup lang="ts" generic="T extends Record<string, any>">
import { merge } from 'lodash-es'
import type { ColumnProps } from 'primevue/column'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import type { Slots } from 'vue'
import { useSlots } from 'vue'

import CardModeTable from '~/components/CardModeTable/index.vue'

defineOptions({
  name: 'BaseDataTable',
})

const props = withDefaults(
  defineProps<{
    rowsPerPageOptions?: number[]
    columnPropArr?: ColumnProps[]
    data?: T[]
    paginator?: boolean
    showGridLines?: boolean
    stripedRows?: boolean
    removableSort?: boolean
    mobileCardMode?: boolean
    isLoading?: boolean
    paginatorPosition?: 'top' | 'bottom' | 'both'
  }>(),
  {
    rowsPerPageOptions: () => [5, 10, 50, 100],
    columnPropArr: () => [],
    data: () => [],
    paginator: true,
    showGridLines: true,
    stripedRows: true,
    removableSort: true,
    mobileCardMode: false,
    isLoading: false,
    paginatorPosition: 'bottom',
  },
)

const firstModel = defineModel<number>('first', {
  required: false,
  default: 0,
})

const rowsModel = defineModel<number>('rows', {
  required: false,
  default: 10,
})

const sortFieldModel = defineModel<string>('sortField', {
  required: false,
  default: '',
})

const sortOrderModel = defineModel<number>('sortOrder', {
  required: false,
  default: 0, // 0: 未排序, 1: 升序, -1: 降序
})

const isMobile = ref(false)
const shouldShowCardMode = computed(() => props.mobileCardMode || isMobile.value)
const slots: Slots = useSlots()
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<template>
  <CardModeTable
    v-if="shouldShowCardMode"
    v-model:first="firstModel"
    v-model:sort-field="sortFieldModel"
    v-model:sort-order="sortOrderModel"
    :data="data"
    :column-prop-arr="columnPropArr"
    :paginator="paginator"
    :rows="rowsModel"
    :disabled="props.isLoading"
  >
    <template v-for="slotName in Object.keys(slots)" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </CardModeTable>

  <DataTable
    v-else
    v-model:rows="rowsModel"
    v-model:first="firstModel"
    v-model:sort-field="sortFieldModel"
    v-model:sort-order="sortOrderModel"
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
    :value="props.data"
    :paginator="props.paginator"
    :show-gridlines="props.showGridLines"
    :striped-rows="props.stripedRows"
    :removable-sort="props.removableSort"
    :rows-per-page-options="props.rowsPerPageOptions"
    :paginator-position="props.paginatorPosition"
  >
    <template v-if="$slots['custom-table-header']" #paginatorstart>
      <slot name="custom-table-header" />
    </template>

    <Column
      v-for="(col, i) in columnPropArr"
      :key="`${col.field}-${i}`"
      v-bind="col"
      :pt="merge(col.pt || {}, { bodyCell: { class: 'break-all' } })"
    >
      <!-- 自定義 header -->
      <template v-if="$slots[`${col.field}-header`]" #header="headerSlot">
        <slot :name="`${col.field}-header`" v-bind="headerSlot" />
      </template>

      <!-- 自定義 body -->
      <template #body="bodySlot">
        <Skeleton v-if="props.isLoading" />
        <slot v-else :name="col.field" v-bind="bodySlot">
          {{ typeof col.field === 'string' ? bodySlot.data[col.field] : '' }}
        </slot>
      </template>
    </Column>
  </DataTable>
</template>
