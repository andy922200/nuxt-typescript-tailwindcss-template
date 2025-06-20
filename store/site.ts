import { cloneDeep } from 'lodash-es'
import { acceptHMRUpdate, defineStore } from 'pinia'

import { useNuxtApp } from '#app'

const siteState = {
  device: 'desktop',
  language: '',
}

export const useSiteStore = defineStore('site', {
  state: () => ({
    site: cloneDeep(siteState),
  }),
  getters: {},
  actions: {
    async fetchDemo() {
      const { $demoAPI } = useNuxtApp()

      try {
        const res = await $demoAPI.postDemo({
          data: { userId: 1, title: 'Test Todo', completed: false },
        })

        console.log('in pinia store', res)
      } catch (err) {
        console.log(err)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSiteStore, import.meta.hot))
}
