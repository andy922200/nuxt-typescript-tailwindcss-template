<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useNuxtApp } from '#app'
import BaseDataTable from '~/components/BaseDataTable/index.vue'
import type { TableConfig } from '~/components/BaseDataTable/type'
import { createTableColumns } from '~/components/BaseDataTable/utils'
import { useThemeCssVars } from '~/composables/useThemeCssVars'
import { useSiteStore } from '~/store/site'
import MaterialSymbolsLightSearch from '~icons/material-symbols-light/search'
import MdiHamburgerMenu from '~icons/mdi/hamburger-menu'

defineOptions({
  name: 'Index',
})

useHead({
  title: 'Test Index Page',
  meta: [
    {
      property: 'og:title',
      content: 'Test Index Page',
    },
  ],
})

const { $dayjs, $demoAPI } = useNuxtApp()
const siteStore = useSiteStore()
const { t, locale, locales, loadLocaleMessages } = useI18n()
const { setCssVars } = useThemeCssVars()
const switchLocalePath = useSwitchLocalePath()

const productTableConfig = ref({
  pageCount: 10,
  totalAmount: 0,
  first: 0,
  data: [],
  sortField: undefined as string | undefined,
  sortOrder: undefined as number | undefined,
})

const products = ref([
  { code: 'A1', name: 'Apple', category: 'Fruit', quantity: 10 },
  { code: 'B2', name: 'Banana', category: 'Fruit', quantity: 20 },
  { code: 'C3', name: 'Carrot', category: 'Vegetable', quantity: 30 },
  { code: 'D4', name: 'Dragon Fruit', category: 'Fruit', quantity: 40 },
  { code: 'E5', name: 'Eggplant', category: 'Vegetable', quantity: 50 },
  { code: 'F6', name: 'Fig', category: 'Fruit', quantity: 60 },
])

const PRODUCT_TABLE_CONFIG: TableConfig = {
  STATIC_COLUMNS: [
    {
      field: 'code',
      header: 'Code',
      translationKey: '',
      sortable: true,
      style: { width: '100px' },
    },
    {
      field: 'name',
      header: 'Name',
      translationKey: '',
      sortable: true,
      style: { width: '200px' },
    },
    {
      field: 'category',
      header: 'Category',
      translationKey: '',
      sortable: true,
      style: { width: '150px' },
    },
    {
      field: 'quantity',
      header: 'Quantity',
      translationKey: '',
      sortable: true,
      style: { width: '120px' },
    },
  ],
}

const productTableColumns = createTableColumns(PRODUCT_TABLE_CONFIG)

const fetchData = async () => {
  const res = await $demoAPI.getADemo({ id: '1' })
  console.log(res)
  console.log('dayjs check', $dayjs().format('YYYY-MM-DDTHH:mm:ss'))

  siteStore.fetchDemo()
}

const changeDarkMode = () => {
  document.documentElement.classList.toggle('dark')
}

setCssVars({
  lightVars: {
    'layout-color': 'F4F4F4',
    'text-color': '333333',
    'btn-color': 'FF9900',
  },
  darkVars: {
    'layout-color': '1A1A1A',
    'text-color': 'CCCCCC',
    'btn-color': 'FF6600',
  },
})

onMounted(() => {
  fetchData()
})

watch(
  () => locale?.value,
  async (newLocale) => {
    await loadLocaleMessages(newLocale)
    const path = switchLocalePath(newLocale)
    if (path) navigateTo(path)
  },
)
</script>

<template>
  <div class="index__wrapper">
    <div class="test">
      <div class="m-2 w-[200px]">
        <select
          id="locale-select"
          v-model="locale"
          class="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="item in locales" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
      </div>

      <button class="bg-pink size-20 hover:cursor-pointer dark:text-white" @click="changeDarkMode">
        Click Here
      </button>
      <div class="h-12 w-50 bg-purple-200 dark:bg-purple-900 dark:text-white">Lorem Ipsum</div>

      <div
        class="bg-[var(--layout-color)] text-[var(--text-color)] dark:bg-[var(--layout-color)] dark:text-[var(--text-color)]"
      >
        支援動態主題色 + dark mode
      </div>

      <p class="hello">
        <span>{{ t('route.helloWorld') }}</span>
        <MdiHamburgerMenu class="text-green-400" />
      </p>

      <Button
        label="Search"
        pt:root="bg-teal-500 hover:bg-teal-700 active:bg-teal-900 cursor-pointer py-2 px-4 rounded-full border-0 flex items-center gap-2"
        pt:label="text-white font-bold text-lg"
        pt:icon="text-white text-xl"
      >
        <template #icon>
          <MaterialSymbolsLightSearch class="text-xl text-white" />
        </template>
      </Button>

      <BaseDataTable
        v-model:first="productTableConfig.first"
        v-model:rows="productTableConfig.pageCount"
        v-model:sort-field="productTableConfig.sortField"
        v-model:sort-order="productTableConfig.sortOrder"
        :data="products"
        :striped-rows="false"
        :column-prop-arr="productTableColumns"
        paginator-position="top"
        class="w-full"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.test {
  .hello {
    color: red;
  }
}
</style>
