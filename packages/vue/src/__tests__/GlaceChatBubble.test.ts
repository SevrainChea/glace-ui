import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceChatBubble from '../components/GlaceChatBubble.vue'

describe('GlaceChatBubble', () => {
  it('renders with default received variant', () => {
    const wrapper = mount(GlaceChatBubble, { slots: { default: 'Hello' } })
    expect(wrapper.classes()).toContain('glace-chat-bubble--received')
  })

  it('applies sent variant', () => {
    const wrapper = mount(GlaceChatBubble, { props: { variant: 'sent' }, slots: { default: 'Hello' } })
    expect(wrapper.classes()).toContain('glace-chat-bubble--sent')
  })

  it('renders message content', () => {
    const wrapper = mount(GlaceChatBubble, { slots: { default: 'Hello world' } })
    expect(wrapper.find('.glace-chat-bubble__content').text()).toBe('Hello world')
  })

  it('renders timestamp when provided', () => {
    const wrapper = mount(GlaceChatBubble, { props: { timestamp: '12:30 PM' }, slots: { default: 'Hi' } })
    expect(wrapper.find('.glace-chat-bubble__timestamp').text()).toBe('12:30 PM')
  })

  it('hides timestamp when not provided', () => {
    const wrapper = mount(GlaceChatBubble, { slots: { default: 'Hi' } })
    expect(wrapper.find('.glace-chat-bubble__timestamp').exists()).toBe(false)
  })

  it('renders avatar slot', () => {
    const wrapper = mount(GlaceChatBubble, {
      slots: { default: 'Hi', avatar: '<img src="avatar.jpg" />' },
    })
    expect(wrapper.find('.glace-chat-bubble__avatar img').exists()).toBe(true)
  })
})
