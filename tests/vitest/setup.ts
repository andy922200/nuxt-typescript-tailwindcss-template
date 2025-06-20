import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import { createI18n } from 'vue-i18n'

// 模擬 i18n 的行為
vi.mock('vue-i18n', () => ({
  createI18n: vi.fn(() => ({
    global: {
      t: (key: string) => key, // 簡單返回 key，避免 i18n 錯誤
    },
  })),
}))

// 建立全域 i18n，確保測試環境不會報錯
const i18n = createI18n({
  legacy: false,
  messages: {
    'en-US': {},
  },
})

// Mock i18n
config.global.mocks.t = (phrase: string) => phrase
config.global.plugins = [i18n]
