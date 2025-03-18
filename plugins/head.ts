import { defineNuxtPlugin, useHead, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const { app, public: publicConfig } = useRuntimeConfig()
  const baseURL = app.baseURL.replace(/\/+$/, '')
  const siteName = publicConfig.siteName || ''

  useHead({
    title: '',
    titleTemplate: (chunk?: string) => (chunk ? `${chunk} - ${siteName}` : null),
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', content: 'ie=edge' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: `${baseURL}/favicon.ico`,
      },
    ],
  })
})
