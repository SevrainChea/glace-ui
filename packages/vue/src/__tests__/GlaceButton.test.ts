import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceButton from '../components/GlaceButton.vue'

describe('GlaceButton', () => {
  it('renders with default classes', () => {
    const wrapper = mount(GlaceButton, { slots: { default: 'Click' } })
    expect(wrapper.classes()).toContain('glace-button')
    expect(wrapper.classes()).toContain('glace-button--secondary')
    expect(wrapper.classes()).toContain('glace-button--md')
  })

  it('applies variant class', () => {
    const wrapper = mount(GlaceButton, { props: { variant: 'primary' }, slots: { default: 'Click' } })
    expect(wrapper.classes()).toContain('glace-button--primary')
  })

  it('applies size class', () => {
    const wrapper = mount(GlaceButton, { props: { size: 'lg' }, slots: { default: 'Click' } })
    expect(wrapper.classes()).toContain('glace-button--lg')
  })

  it('disables button when disabled', () => {
    const wrapper = mount(GlaceButton, { props: { disabled: true }, slots: { default: 'Click' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('disables button when loading', () => {
    const wrapper = mount(GlaceButton, { props: { loading: true }, slots: { default: 'Click' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(GlaceButton, { props: { loading: true }, slots: { default: 'Click' } })
    expect(wrapper.find('.glace-button__spinner').exists()).toBe(true)
  })

  it('renders as custom element', () => {
    const wrapper = mount(GlaceButton, { props: { as: 'a' }, slots: { default: 'Link' } })
    expect(wrapper.element.tagName).toBe('A')
  })
})
