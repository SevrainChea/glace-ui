import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceNavbar from '../components/GlaceNavbar.vue'

describe('GlaceNavbar', () => {
  it('renders nav element with role', () => {
    const wrapper = mount(GlaceNavbar)
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('role')).toBe('navigation')
  })

  it('applies default classes', () => {
    const wrapper = mount(GlaceNavbar)
    expect(wrapper.classes()).toContain('glace-navbar')
  })

  it('applies sticky modifier', () => {
    const wrapper = mount(GlaceNavbar, { props: { sticky: true } })
    expect(wrapper.classes()).toContain('glace-navbar--sticky')
  })

  it('applies transparent modifier', () => {
    const wrapper = mount(GlaceNavbar, { props: { transparent: true } })
    expect(wrapper.classes()).toContain('glace-navbar--transparent')
  })

  it('renders logo slot', () => {
    const wrapper = mount(GlaceNavbar, { slots: { logo: '<span>Logo</span>' } })
    expect(wrapper.find('.glace-navbar__logo').text()).toBe('Logo')
  })

  it('renders default slot', () => {
    const wrapper = mount(GlaceNavbar, { slots: { default: '<span>Links</span>' } })
    expect(wrapper.find('.glace-navbar__content').text()).toBe('Links')
  })

  it('renders actions slot', () => {
    const wrapper = mount(GlaceNavbar, { slots: { actions: '<button>Menu</button>' } })
    expect(wrapper.find('.glace-navbar__actions').text()).toBe('Menu')
  })
})
