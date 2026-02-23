import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceModal from '../components/GlaceModal.vue'

describe('GlaceModal', () => {
  it('does not render when modelValue is false', () => {
    const wrapper = mount(GlaceModal, {
      props: { modelValue: false },
      global: { stubs: { teleport: true } },
    })
    expect(wrapper.find('.glace-modal__overlay').exists()).toBe(false)
  })

  it('renders when modelValue is true', () => {
    const wrapper = mount(GlaceModal, {
      props: { modelValue: true },
      global: { stubs: { teleport: true } },
      slots: { default: 'Modal content' },
    })
    expect(wrapper.find('.glace-modal__overlay').exists()).toBe(true)
    expect(wrapper.find('.glace-modal__body').text()).toBe('Modal content')
  })

  it('applies size class', () => {
    const wrapper = mount(GlaceModal, {
      props: { modelValue: true, size: 'lg' },
      global: { stubs: { teleport: true } },
    })
    expect(wrapper.find('.glace-modal__content--lg').exists()).toBe(true)
  })

  it('has aria-modal attribute', () => {
    const wrapper = mount(GlaceModal, {
      props: { modelValue: true },
      global: { stubs: { teleport: true } },
    })
    expect(wrapper.find('[role="dialog"]').attributes('aria-modal')).toBe('true')
  })

  it('emits close on overlay click', async () => {
    const wrapper = mount(GlaceModal, {
      props: { modelValue: true, closeOnOverlay: true },
      global: { stubs: { teleport: true } },
    })
    await wrapper.find('.glace-modal__overlay').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('emits close on Escape key', async () => {
    const wrapper = mount(GlaceModal, {
      props: { modelValue: true },
      global: { stubs: { teleport: true } },
    })
    await wrapper.find('.glace-modal__overlay').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('renders header and footer slots', () => {
    const wrapper = mount(GlaceModal, {
      props: { modelValue: true },
      global: { stubs: { teleport: true } },
      slots: { default: 'Body', header: 'Title', footer: 'Actions' },
    })
    expect(wrapper.find('.glace-modal__header').text()).toContain('Title')
    expect(wrapper.find('.glace-modal__footer').text()).toBe('Actions')
  })
})
