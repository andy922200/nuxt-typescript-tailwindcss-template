import { cloneDeep } from 'lodash-es'
import { acceptHMRUpdate, defineStore } from 'pinia'

import { appLangs } from '@/plugins/lang'
import { getLanguage } from '@/utils'
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
    getLanguageBasedOnBrowser() {
      let browserLang = this.site.language.toLowerCase() || getLanguage()
      if (!appLangs.includes(browserLang)) {
        browserLang = 'en-us'
      }
      this.setLanguage(browserLang)
    },
    setLanguage(language: string) {
      this.site.language = language
      this.changeI18NLang(language)
    },
    changeI18NLang(language: string) {
      const { vueApp } = useNuxtApp()
      vueApp.config.globalProperties.$i18n.locale = language
    },
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
