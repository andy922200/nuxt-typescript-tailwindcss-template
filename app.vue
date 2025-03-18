<script setup lang="ts">
import { onMounted } from 'vue'

import { useSiteStore } from '@/store/site'

defineOptions({
  name: 'App',
})

const siteStore = useSiteStore()

onMounted(() => {
  // avoid hydrate error between server and client
  siteStore.getLanguageBasedOnBrowser()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
