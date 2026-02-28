import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceCard from '../components/GlaceCard.vue'

describe('GlaceCard', () => {
  it('renders with default classes', () => {
    const wrapper = mount(GlaceCard, { slots: { default: 'Content' } })
    expect(wrapper.classes()).toContain('glace-card')
    expect(wrapper.find('.glace-card__body').text()).toBe('Content')
  })

  it('applies elevation modifier', () => {
    const wrapper = mount(GlaceCard, {
      props: { elevation: 'floating' },
      slots: { default: 'Content' },
    })
    expect(wrapper.classes()).toContain('glace-card--floating')
  })

  it('applies blur intensity modifier', () => {
    const wrapper = mount(GlaceCard, {
      props: { blurIntensity: 'strong' },
      slots: { default: 'Content' },
    })
    expect(wrapper.classes()).toContain('glace-card--blur-strong')
  })

  it('applies radius modifier', () => {
    const wrapper = mount(GlaceCard, { props: { radius: 'lg' }, slots: { default: 'Content' } })
    expect(wrapper.classes()).toContain('glace-card--radius-lg')
  })

  it('renders header slot', () => {
    const wrapper = mount(GlaceCard, { slots: { default: 'Body', header: 'Header' } })
    expect(wrapper.find('.glace-card__header').text()).toBe('Header')
  })

  it('renders footer slot', () => {
    const wrapper = mount(GlaceCard, { slots: { default: 'Body', footer: 'Footer' } })
    expect(wrapper.find('.glace-card__footer').text()).toBe('Footer')
  })

  it('renders as custom element', () => {
    const wrapper = mount(GlaceCard, { props: { as: 'section' }, slots: { default: 'Content' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })
})
