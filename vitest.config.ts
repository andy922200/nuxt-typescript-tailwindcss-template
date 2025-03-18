import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
      },
    },
    setupFiles: './tests/vitest/setup.ts',
    include: ['./tests/vitest/**/*.(spec|test).ts'],
  },
})
