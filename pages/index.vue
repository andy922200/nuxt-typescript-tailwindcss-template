<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSiteStore } from '@/store/site'
import { useNuxtApp } from '#app'
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
const { site } = storeToRefs(siteStore)
const { t } = useI18n()

const language = computed({
  get: () => site.value.language,
  set: (lang: string) => {
    siteStore.setLanguage(lang)
  },
})

const fetchData = async () => {
  const res = await $demoAPI.getADemo({ id: '1' })
  console.log(res)
  console.log('dayjs check', $dayjs().format('YYYY-MM-DDTHH:mm:ss'))

  siteStore.fetchDemo()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="index__wrapper">
    <div class="test">
      <div class="m-2 w-[200px]">
        <select
          id="locale-select"
          v-model="language"
          class="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="en-us">en-us</option>
          <option value="zh-tw">zh-tw</option>
        </select>
      </div>

      <p class="hello">
        <span>{{ t('route.helloWorld') }}</span>
        <MdiHamburgerMenu class="text-green-400" />
      </p>
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
