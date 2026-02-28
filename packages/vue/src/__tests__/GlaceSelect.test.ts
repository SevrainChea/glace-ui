import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceSelect from '../components/GlaceSelect.vue'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]

const mountSelect = (props = {}) =>
  mount(GlaceSelect, {
    props: { options, ...props },
    global: { stubs: { teleport: true } },
  })

describe('GlaceSelect', () => {
  it('renders placeholder when no value', () => {
    const wrapper = mountSelect({ placeholder: 'Pick a fruit' })
    expect(wrapper.find('.glace-select__placeholder').text()).toBe('Pick a fruit')
  })

  it('renders selected option label when value is set', () => {
    const wrapper = mountSelect({ modelValue: 'banana' })
    expect(wrapper.find('.glace-select__value').text()).toBe('Banana')
  })

  it('dropdown is hidden by default', () => {
    const wrapper = mountSelect()
    expect(wrapper.find('.glace-select__dropdown').exists()).toBe(false)
  })

  it('opens dropdown on trigger click', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    expect(wrapper.find('.glace-select__dropdown').exists()).toBe(true)
  })

  it('applies open class when dropdown is open', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    expect(wrapper.classes()).toContain('glace-select--open')
  })

  it('closes dropdown on second trigger click', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    await wrapper.find('.glace-select__trigger').trigger('click')
    expect(wrapper.find('.glace-select__dropdown').exists()).toBe(false)
  })

  it('renders all options when open', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    expect(wrapper.findAll('.glace-select__option')).toHaveLength(3)
  })

  it('emits update:modelValue on option click', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    await wrapper.findAll('.glace-select__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
  })

  it('closes dropdown after selecting an option', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    await wrapper.findAll('.glace-select__option')[0].trigger('click')
    expect(wrapper.find('.glace-select__dropdown').exists()).toBe(false)
  })

  it('does not emit when clicking a disabled option', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    await wrapper.findAll('.glace-select__option')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('marks the currently selected option', async () => {
    const wrapper = mountSelect({ modelValue: 'banana' })
    await wrapper.find('.glace-select__trigger').trigger('click')
    const opts = wrapper.findAll('.glace-select__option')
    expect(opts[1].classes()).toContain('glace-select__option--selected')
    expect(opts[0].classes()).not.toContain('glace-select__option--selected')
  })

  it('marks disabled options', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    expect(wrapper.findAll('.glace-select__option')[2].classes()).toContain(
      'glace-select__option--disabled',
    )
  })

  it('does not open when disabled', async () => {
    const wrapper = mountSelect({ disabled: true })
    await wrapper.find('.glace-select__trigger').trigger('click')
    expect(wrapper.find('.glace-select__dropdown').exists()).toBe(false)
  })

  it('applies disabled class', () => {
    const wrapper = mountSelect({ disabled: true })
    expect(wrapper.classes()).toContain('glace-select--disabled')
  })

  it('applies error class and renders error text', () => {
    const wrapper = mountSelect({ error: 'Required field' })
    expect(wrapper.classes()).toContain('glace-select--error')
    expect(wrapper.find('.glace-select__error-text').text()).toBe('Required field')
  })

  it('opens on ArrowDown key when closed', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.glace-select__dropdown').exists()).toBe(true)
  })

  it('closes on Escape key', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    await wrapper.find('.glace-select__trigger').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.glace-select__dropdown').exists()).toBe(false)
  })

  it('moves active option forward with ArrowDown', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    // On open with no selection, active = first enabled option (Apple, index 0)
    await wrapper.find('.glace-select__trigger').trigger('keydown', { key: 'ArrowDown' })
    // After ArrowDown, active moves to Banana (index 1)
    const opts = wrapper.findAll('.glace-select__option')
    expect(opts[1].classes()).toContain('glace-select__option--active')
  })

  it('selects active option on Enter and closes', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.glace-select__trigger').trigger('click')
    // On open with no selection, active = Apple (index 0)
    await wrapper.find('.glace-select__trigger').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple'])
    expect(wrapper.find('.glace-select__dropdown').exists()).toBe(false)
  })

  it('skips disabled options during keyboard navigation', async () => {
    const wrapper = mountSelect({ modelValue: 'banana' })
    await wrapper.find('.glace-select__trigger').trigger('click')
    // Active starts at Banana (index 1). Arrow Down skips Cherry (disabled) and wraps to Apple (index 0)
    await wrapper.find('.glace-select__trigger').trigger('keydown', { key: 'ArrowDown' })
    const opts = wrapper.findAll('.glace-select__option')
    expect(opts[0].classes()).toContain('glace-select__option--active')
  })

  it('renders custom #trigger slot', () => {
    const wrapper = mount(GlaceSelect, {
      props: { options, modelValue: 'apple' },
      global: { stubs: { teleport: true } },
      slots: { trigger: '<span class="custom-trigger">Custom</span>' },
    })
    expect(wrapper.find('.custom-trigger').exists()).toBe(true)
  })

  it('renders custom #option slot', async () => {
    const wrapper = mount(GlaceSelect, {
      props: { options },
      global: { stubs: { teleport: true } },
      slots: { option: '<span class="custom-option">Custom</span>' },
    })
    await wrapper.find('.glace-select__trigger').trigger('click')
    expect(wrapper.find('.custom-option').exists()).toBe(true)
  })
})
