<script setup lang="ts" generic="T extends Record<string, any>">
import type { ColumnProps } from 'primevue/column'
import { computed, ref } from 'vue'

import DownArrow from '~/assets/images/down-arrow.svg?component'
import LeftArrow from '~/assets/images/left-arrow.svg?component'
import RightArrow from '~/assets/images/right-arrow.svg?component'
import SortIcon from '~/assets/images/sort-icon.svg?component'
import UpArrow from '~/assets/images/up-arrow.svg?component'
import { CardModeTableSortStr } from '~/components/CardModeTable/type'
import SpinnerOverlay from '~/components/SpinnerOverlay.vue'

defineOptions({
  name: 'CardModeTable',
})

const props = withDefaults(
  defineProps<{
    data: T[]
    columnPropArr: ColumnProps[]
    paginator?: boolean
    rows?: number
    first?: number
    sortField?: string | null
    sortOrder?: number | null // null: 未排序, 1: 升序, -1: 降序
    removableSort?: boolean
    disabled?: boolean
  }>(),
  {
    paginator: true,
    rows: 10,
    first: 0,
    sortField: null,
    sortOrder: null,
    removableSort: true,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:first': [value: number]
  'update:sortField': [value: string | null]
  'update:sortOrder': [value: number | null]
}>()

const cardModeTableDom = ref<HTMLElement>()

// 獲取排序圖標
const getSortIcon = (field: string | ((item: any) => string) | undefined, sortable?: boolean) => {
  if (!sortable || typeof field !== 'string') return null

  if (props.sortField !== field) {
    return CardModeTableSortStr.SORT
  }

  if (props.sortOrder === 1) {
    return CardModeTableSortStr.SORT_ASC
  } else if (props.sortOrder === -1) {
    return CardModeTableSortStr.SORT_DESC
  }

  return CardModeTableSortStr.SORT
}

// 獲取排序樣式
const getSortClass = (field: string | ((item: any) => string) | undefined, sortable?: boolean) => {
  const baseClass = 'inline-flex items-center gap-1'

  if (!sortable || typeof field !== 'string') {
    return baseClass
  }

  return `${baseClass} cursor-pointer hover:text-blue-600 transition-colors`
}

const handleSort = (field: string | ((item: any) => string) | undefined, sortable?: boolean) => {
  if (!sortable || typeof field !== 'string') return

  let newSortOrder: number | null = null
  let newSortField: string | null = field

  if (props.sortField === field) {
    // 同一欄位，切換排序狀態
    if (props.sortOrder === null) {
      newSortOrder = 1
    } else if (props.sortOrder === 1) {
      newSortOrder = -1
    } else {
      // 如果支援移除排序，回到未排序；否則切換到升序
      if (props.removableSort) {
        newSortOrder = null
        newSortField = null
      } else {
        newSortOrder = 1
      }
    }
  } else {
    // 不同欄位，從升序開始
    newSortOrder = 1
  }

  emit('update:sortField', newSortField)
  emit('update:sortOrder', newSortOrder)
}

const naturalCompare = (a: string, b: string): number => {
  const ax: [number, string][] = []
  const bx: [number, string][] = []

  a.replace(/(\d+)|(\D+)/g, (_, num, str) => {
    ax.push([num ? Number(num) : Infinity, str || ''])
    return ''
  })

  b.replace(/(\d+)|(\D+)/g, (_, num, str) => {
    bx.push([num ? Number(num) : Infinity, str || ''])
    return ''
  })

  while (ax.length && bx.length) {
    const an = ax.shift()!
    const bn = bx.shift()!
    const nn =
      (Number(an[0]) || 0) - (Number(bn[0]) || 0) || String(an[1]).localeCompare(String(bn[1]))
    if (nn) return nn
  }

  return ax.length - bx.length
}

// 排序後的數據
const sortedData = computed(() => {
  if (!props.sortField || typeof props.sortField !== 'string' || props.sortOrder === null) {
    return props.data
  }

  const sorted = [...props.data].sort((a, b) => {
    const aVal = a[props.sortField ?? 0]
    const bVal = b[props.sortField ?? 0]

    // 處理 null 或 undefined 值
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return props.sortOrder === 1 ? 1 : -1
    if (bVal == null) return props.sortOrder === 1 ? -1 : 1

    // 處理數字類型
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return props.sortOrder === 1 ? aVal - bVal : bVal - aVal
    }

    // 處理字符串類型 - 使用智能比較
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const result = naturalCompare(aVal, bVal)
      return props.sortOrder === 1 ? result : -result
    }

    // 處理日期類型
    if (aVal instanceof Date && bVal instanceof Date) {
      const result = aVal.getTime() - bVal.getTime()
      return props.sortOrder === 1 ? result : -result
    }

    // 處理布林值
    if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
      const result = aVal === bVal ? 0 : aVal ? 1 : -1
      return props.sortOrder === 1 ? result : -result
    }

    // 轉換為字符串進行比較
    const aStr = String(aVal || '')
    const bStr = String(bVal || '')
    const result = aStr.localeCompare(bStr)
    return props.sortOrder === 1 ? result : -result
  })

  return sorted
})

// 分頁數據（基於排序後的數據）
const paginatedData = computed(() => {
  if (!props.paginator) return sortedData.value
  const start = props.first
  const end = start + props.rows
  return sortedData.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(sortedData.value.length / props.rows)
})

const currentPage = computed(() => {
  return Math.floor(props.first / props.rows) + 1
})

const canGoPrevious = computed(() => currentPage.value > 1)
const canGoNext = computed(() => currentPage.value < totalPages.value)

const goToPreviousPage = () => {
  if (canGoPrevious.value) {
    const newFirst = props.first - props.rows
    emit('update:first', Math.max(0, newFirst))
  }
}

const goToNextPage = () => {
  if (canGoNext.value) {
    const newFirst = props.first + props.rows
    emit('update:first', newFirst)
  }
}
</script>

<template>
  <div ref="cardModeTableDom" class="card-mode-table relative">
    <SpinnerOverlay v-if="props.disabled" bg-class="rounded-2xl" />
    <!-- 排序控制區域 -->
    <div class="border-b border-gray-200 bg-gray-50 p-4">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="col in columnPropArr.filter((c) => c.sortable)"
          :key="`sort-${col.field}`"
          class="px-2"
          :class="getSortClass(col.field, col.sortable)"
          @click="handleSort(col.field, col.sortable)"
        >
          <span class="text-sm font-medium">{{ col.header || col.field }}</span>
          <SortIcon
            v-if="getSortIcon(col.field, col.sortable) === CardModeTableSortStr.SORT"
            class="h-4 w-4 text-gray-400"
          />
          <UpArrow
            v-else-if="getSortIcon(col.field, col.sortable) === CardModeTableSortStr.SORT_ASC"
            class="h-4 w-4 text-blue-600"
          />
          <DownArrow
            v-else-if="getSortIcon(col.field, col.sortable) === CardModeTableSortStr.SORT_DESC"
            class="h-4 w-4 text-blue-600"
          />
        </div>
      </div>
    </div>

    <!-- 自訂標頭 -->
    <div v-if="$slots['custom-table-header']" class="mobile-card-table__header px-2 pt-4">
      <template v-if="$slots['custom-table-header']">
        <slot name="custom-table-header" />
      </template>
    </div>

    <!-- 分頁選擇器 -->
    <div
      v-if="paginator && totalPages > 1"
      class="flex items-center justify-center gap-4 border-gray-200 py-2 pt-4"
    >
      <button
        :disabled="!canGoPrevious"
        class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        @click="goToPreviousPage"
      >
        <LeftArrow class="size-5" />
      </button>

      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-700">
          {{ $t('paginator.info', { current: currentPage, total: totalPages }) }}
        </span>
      </div>

      <button
        :disabled="!canGoNext"
        class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        @click="goToNextPage"
      >
        <RightArrow class="size-5" />
      </button>
    </div>

    <!-- 資料呈現 -->
    <div class="flex flex-col gap-4 p-4">
      <div
        v-for="(item, index) in paginatedData"
        :key="`mobile-card-${index}`"
        class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        <div
          v-for="col in columnPropArr"
          :key="`${col.field}-${index}`"
          class="card-mode-table__row flex items-start justify-between gap-4 border-b border-gray-100 py-2 last:border-b-0"
          :class="[`card-mode-table__row--${col.field}`]"
        >
          <div
            class="card-mode-table__label min-w-0 flex-shrink-0 text-sm font-medium text-gray-600"
            :class="[`card-mode-table__label--${col.field}`]"
          >
            <slot :name="`${col.field}-header`" v-bind="{ column: col }">
              {{ col.header || col.field }}
            </slot>
          </div>
          <div
            class="card-mode-table__content min-w-0 flex-1 text-right text-sm break-words text-gray-900"
            :class="[`card-mode-table__content--${col.field}`]"
          >
            <slot :name="col.field" v-bind="{ data: item, field: col.field, index }">
              {{ typeof col.field === 'string' ? item[col.field] : '' }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
