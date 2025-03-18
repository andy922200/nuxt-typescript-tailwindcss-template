import { $fetch, type FetchOptions } from 'ofetch'

import { createDemoAPI } from '~/apis/demo'
import { createHttpClient } from '~/utils'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const fetchOptions: FetchOptions = {
    baseURL: runtimeConfig.public.apiBaseUrl,
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
