import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import DemoPage from '../../app/pages/index.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
  createI18n: () => ({}),
}))

describe('DemoPage', () => {
  it('component renders Hello world properly', () => {
    const wrapper = mount(DemoPage)
    expect(wrapper.text()).toContain('Hello world')
  })
})
