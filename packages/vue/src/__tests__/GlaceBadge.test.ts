import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceBadge from '../components/GlaceBadge.vue'

describe('GlaceBadge', () => {
  it('renders with default classes', () => {
    const wrapper = mount(GlaceBadge, { slots: { default: 'Tag' } })
    expect(wrapper.classes()).toContain('glace-badge')
    expect(wrapper.classes()).toContain('glace-badge--solid')
    expect(wrapper.classes()).toContain('glace-badge--md')
  })

  it('applies variant class', () => {
    const wrapper = mount(GlaceBadge, { props: { variant: 'outline' }, slots: { default: 'Tag' } })
    expect(wrapper.classes()).toContain('glace-badge--outline')
  })

  it('applies size class', () => {
    const wrapper = mount(GlaceBadge, { props: { size: 'lg' }, slots: { default: 'Tag' } })
    expect(wrapper.classes()).toContain('glace-badge--lg')
  })

  it('shows remove button when removable', () => {
    const wrapper = mount(GlaceBadge, { props: { removable: true }, slots: { default: 'Tag' } })
    expect(wrapper.find('.glace-badge__remove').exists()).toBe(true)
  })

  it('emits remove event', async () => {
    const wrapper = mount(GlaceBadge, { props: { removable: true }, slots: { default: 'Tag' } })
    await wrapper.find('.glace-badge__remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('hides remove button by default', () => {
    const wrapper = mount(GlaceBadge, { slots: { default: 'Tag' } })
    expect(wrapper.find('.glace-badge__remove').exists()).toBe(false)
  })

  it('applies custom color style', () => {
    const wrapper = mount(GlaceBadge, { props: { color: 'rgba(100,0,255,0.3)' }, slots: { default: 'Tag' } })
    expect(wrapper.attributes('style')).toContain('--glace-bg')
  })
})
