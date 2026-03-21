import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceSwitch from '../components/GlaceSwitch.vue'

describe('GlaceSwitch', () => {
  it('renders track and hidden checkbox', () => {
    const wrapper = mount(GlaceSwitch)
    expect(wrapper.find('input.glace-switch__input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.find('.glace-switch__track').exists()).toBe(true)
  })

  it('reflects modelValue on the checkbox', () => {
    const wrapper = mount(GlaceSwitch, { props: { modelValue: true } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('emits update:modelValue with toggled boolean on change', async () => {
    const wrapper = mount(GlaceSwitch, { props: { modelValue: false } })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits false when toggled from true', async () => {
    const wrapper = mount(GlaceSwitch, { props: { modelValue: true } })
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('applies glace-switch--checked when modelValue is true', () => {
    const wrapper = mount(GlaceSwitch, { props: { modelValue: true } })
    expect(wrapper.find('.glace-switch--checked').exists()).toBe(true)
  })

  it('does not apply glace-switch--checked when modelValue is false', () => {
    const wrapper = mount(GlaceSwitch, { props: { modelValue: false } })
    expect(wrapper.find('.glace-switch--checked').exists()).toBe(false)
  })

  it('applies glace-switch--disabled and sets disabled on input', () => {
    const wrapper = mount(GlaceSwitch, { props: { disabled: true } })
    expect(wrapper.find('.glace-switch--disabled').exists()).toBe(true)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies size modifier class', () => {
    const wrapper = mount(GlaceSwitch, { props: { size: 'lg' } })
    expect(wrapper.find('.glace-switch--lg').exists()).toBe(true)
  })

  it('defaults to md size', () => {
    const wrapper = mount(GlaceSwitch)
    expect(wrapper.find('.glace-switch--md').exists()).toBe(true)
  })

  it('renders label text when label prop is provided', () => {
    const wrapper = mount(GlaceSwitch, { props: { label: 'Dark mode' } })
    expect(wrapper.find('.glace-switch__label').text()).toBe('Dark mode')
  })

  it('activates pill mode when both icon slots are provided', () => {
    const wrapper = mount(GlaceSwitch, {
      slots: {
        'checked-icon': '<span>☀️</span>',
        'unchecked-icon': '<span>🌙</span>',
      },
    })
    expect(wrapper.find('.glace-switch--pill').exists()).toBe(true)
  })

  it('does not activate pill mode when only checked-icon slot is provided', () => {
    const wrapper = mount(GlaceSwitch, {
      slots: { 'checked-icon': '<span>✓</span>' },
    })
    expect(wrapper.find('.glace-switch--pill').exists()).toBe(false)
  })

  it('does not activate pill mode when only unchecked-icon slot is provided', () => {
    const wrapper = mount(GlaceSwitch, {
      slots: { 'unchecked-icon': '<span>✗</span>' },
    })
    expect(wrapper.find('.glace-switch--pill').exists()).toBe(false)
  })
})
