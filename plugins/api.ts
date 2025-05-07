import { $fetch, type FetchOptions } from 'ofetch'

import { createDemoAPI } from '~/apis/demo'
import { createHttpClient } from '~/utils'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const envName = runtimeConfig.public.envName || ''
  const isLocal = envName === 'local'
  const isGenerating = process.env.NUXT_COMMAND === 'generate'
  const isServer = import.meta.server

  const fetchOptions: FetchOptions = {
    baseURL:
      isLocal || isGenerating
        ? '/api'
        : isServer
          ? runtimeConfig.apiBaseUrl
          : runtimeConfig.public.apiBaseUrl,
  }

  const apiCustomInstance = createHttpClient($fetch.create(fetchOptions))
  const demoApis = createDemoAPI(apiCustomInstance)

  const apiMap = {
    demoAPI: demoApis,
  }

  for (const [key, value] of Object.entries(apiMap)) {
    nuxtApp.provide(key, value)
  }
})
