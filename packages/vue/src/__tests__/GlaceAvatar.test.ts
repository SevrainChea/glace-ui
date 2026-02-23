import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceAvatar from '../components/GlaceAvatar.vue'

describe('GlaceAvatar', () => {
  it('renders with default size class', () => {
    const wrapper = mount(GlaceAvatar)
    expect(wrapper.classes()).toContain('glace-avatar')
    expect(wrapper.classes()).toContain('glace-avatar--md')
  })

  it('applies size class', () => {
    const wrapper = mount(GlaceAvatar, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('glace-avatar--lg')
  })

  it('renders image when src is provided', () => {
    const wrapper = mount(GlaceAvatar, { props: { src: '/photo.jpg', alt: 'User' } })
    const img = wrapper.find('.glace-avatar__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/photo.jpg')
    expect(img.attributes('alt')).toBe('User')
  })

  it('shows fallback when no src', () => {
    const wrapper = mount(GlaceAvatar, { props: { alt: 'John' } })
    expect(wrapper.find('.glace-avatar__fallback').text()).toBe('J')
  })

  it('shows fallback slot content', () => {
    const wrapper = mount(GlaceAvatar, { slots: { fallback: 'JD' } })
    expect(wrapper.find('.glace-avatar__fallback').text()).toBe('JD')
  })

  it('shows status indicator', () => {
    const wrapper = mount(GlaceAvatar, { props: { status: 'online' } })
    expect(wrapper.find('.glace-avatar__status--online').exists()).toBe(true)
  })

  it('hides status when not provided', () => {
    const wrapper = mount(GlaceAvatar)
    expect(wrapper.find('.glace-avatar__status').exists()).toBe(false)
  })

  it('falls back on image error', async () => {
    const wrapper = mount(GlaceAvatar, { props: { src: '/broken.jpg', alt: 'Jane' } })
    await wrapper.find('.glace-avatar__image').trigger('error')
    expect(wrapper.find('.glace-avatar__fallback').exists()).toBe(true)
  })
})
