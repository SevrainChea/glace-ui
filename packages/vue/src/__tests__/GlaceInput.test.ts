import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceInput from '../components/GlaceInput.vue'

describe('GlaceInput', () => {
  it('renders input element', () => {
    const wrapper = mount(GlaceInput)
    expect(wrapper.find('input.glace-input__field').exists()).toBe(true)
  })

  it('binds v-model value', () => {
    const wrapper = mount(GlaceInput, { props: { modelValue: 'hello' } })
    expect(wrapper.find('input').element.value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(GlaceInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('test')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test'])
  })

  it('applies error state', () => {
    const wrapper = mount(GlaceInput, { props: { error: 'Required' } })
    expect(wrapper.find('.glace-input--error').exists()).toBe(true)
    expect(wrapper.find('.glace-input__error-text').text()).toBe('Required')
  })

  it('sets aria-invalid on error', () => {
    const wrapper = mount(GlaceInput, { props: { error: 'Required' } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('sets aria-describedby linking to error', () => {
    const wrapper = mount(GlaceInput, { props: { error: 'Required' } })
    const errorEl = wrapper.find('.glace-input__error-text')
    const input = wrapper.find('input')
    expect(input.attributes('aria-describedby')).toBe(errorEl.attributes('id'))
  })

  it('applies disabled state', () => {
    const wrapper = mount(GlaceInput, { props: { disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.glace-input--disabled').exists()).toBe(true)
  })

  it('sets placeholder', () => {
    const wrapper = mount(GlaceInput, { props: { placeholder: 'Enter text' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text')
  })
})
