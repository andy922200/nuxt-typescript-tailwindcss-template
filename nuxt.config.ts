import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'
import Aura from '@primeuix/themes/aura'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import svgLoader from 'vite-svg-loader'

import { useHttpsConfig } from './app/composables/useHttpsConfig'

const dateStamp = new Date().toISOString().split('T')[0]?.replaceAll('-', '')
const appBuildAssetsDir = '_nuxt'
const isLocalDev = process.env.NUXT_PUBLIC_ENV_NAME === 'local'

if (isLocalDev) {
  // fix for @primevue/nuxt-module 4.3.6 for Nuxt 4 compatibility
  console.log(
    `Please change compatibility from { nuxt: "^3.0.0" } to { nuxt: "^4.0.0" } at node_modules/@primevue/nuxt-module/dist/module.mjs and then pnpm install again.`,
  )
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    /* head 可在 plugins/head 統一添加 */
    buildAssetsDir: `/${appBuildAssetsDir}/`,
    /* 依據 Server 佈署調整 */
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
  },
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/eslint',
    '@pinia/nuxt',
    'unplugin-icons/nuxt',
    '@primevue/nuxt-module',
    '@nuxt/test-utils/module',
  ],
  primevue: {
    autoImport: false,
    components: {
      include: [
        'Button',
        'Divider',
        'Card',
        'Knob',
        'DataTable',
        'Column',
        'Paginator',
        'Skeleton',
        'Checkbox',
      ],
    },
    options: {
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primevue',
            order: 'theme, base, primevue',
          },
        },
      },
    },
  },
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
  typescript: {
    typeCheck: true,
  },
  devServer: {
    https: useHttpsConfig(),
  },
  runtimeConfig: {
    apiBaseUrl: '',
    public: {
      envName: '',
      apiBaseUrl: '',
      siteName: 'Demo Site',
    },
  },
  build: {
    transpile: ['vue-i18n'],
  },
  i18n: {
    restructureDir: 'lang',
    langDir: '',
    baseUrl: process.env.NUXT_APP_BASE_URL || '/',
    defaultLocale: 'zh-tw',
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root',
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
    locales: [
      {
        code: 'zh-tw',
        name: '繁體中文',
        file: 'zh-tw.ts',
      },
      {
        code: 'en-us',
        name: 'English',
        file: 'en-us.ts',
      },
    ],
  },
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [resolve(dirname(fileURLToPath(import.meta.url)), './lang/*.{js,ts')],
      }),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
      svgLoader(),
      Icons({
        autoInstall: true,
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('ofetch')) return 'ofetch'
              if (id.includes('dayjs')) return 'dayjs'
              if (id.includes('lodash-es')) return 'lodash'
              if (id.match(/node_modules\/(vue|@vue|vue-router|pinia)\//)) return 'core'
              return 'vendor'
            }
          },
          chunkFileNames() {
            return `${appBuildAssetsDir}/[name]_${dateStamp}_[hash:7].js`
          },
          entryFileNames() {
            return `${appBuildAssetsDir}/[name]_${dateStamp}_[hash:7].js`
          },
          assetFileNames() {
            return `${appBuildAssetsDir}/[name]_${dateStamp}_[hash:7].[ext]`
          },
        },
      },
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'https://jsonplaceholder.typicode.com/posts',
        changeOrigin: true,
      },
    },
  },
})
