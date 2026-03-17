<script setup lang="ts">
/**
 * A liquid glass select with teleported dropdown, keyboard navigation,
 * and dual API (props array + slots).
 *
 * @example
 * ```vue
 * <GlaceSelect v-model="value" :options="[{ label: 'Apple', value: 'apple' }]" />
 * ```
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGlaceLight } from './useGlaceLight.js'
import type { GlaceSelectProps, GlaceSelectOption } from './types'

const props = withDefaults(defineProps<GlaceSelectProps>(), {
  options: () => [],
  placeholder: 'Select an option',
  disabled: false,
  error: undefined,
  modelValue: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(-1)
const dropdownStyle = ref<Record<string, string>>({})

useGlaceLight(triggerRef)

const selectId = `glace-select-${Math.random().toString(36).slice(2, 9)}`
const listboxId = `${selectId}-listbox`
const errorId = computed(() => (props.error ? `${selectId}-error` : undefined))

const selectedOption = computed(
  () => props.options.find((o) => o.value === props.modelValue) ?? null,
)

// Only enabled options, preserving original array indices
const enabledOptions = computed(() =>
  props.options.map((o, i) => ({ ...o, index: i })).filter((o) => !o.disabled),
)

function updatePosition() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  // TODO: handle scroll/resize with dynamic repositioning instead of closing.
  // Also consider flipping upward when near the bottom of the viewport.
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  }
}

function open() {
  if (props.disabled) return
  updatePosition()
  isOpen.value = true
  // Initialise active to selected option, or first enabled option
  const selectedEnabled = enabledOptions.value.find((o) => o.value === props.modelValue)
  activeIndex.value = selectedEnabled?.index ?? enabledOptions.value[0]?.index ?? -1
}

function close(restoreFocus = true) {
  isOpen.value = false
  activeIndex.value = -1
  if (restoreFocus) triggerRef.value?.focus()
}

function toggle() {
  isOpen.value ? close() : open()
}

function select(option: GlaceSelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  close()
}

function handleKeydown(e: KeyboardEvent) {
  if (props.disabled) return

  if (!isOpen.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      open()
    }
    return
  }

  const enabled = enabledOptions.value
  const currentPos = enabled.findIndex((o) => o.index === activeIndex.value)

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      activeIndex.value = enabled[(currentPos + 1) % enabled.length]?.index ?? activeIndex.value
      scrollActiveIntoView()
      break
    case 'ArrowUp':
      e.preventDefault()
      activeIndex.value =
        enabled[(currentPos - 1 + enabled.length) % enabled.length]?.index ?? activeIndex.value
      scrollActiveIntoView()
      break
    case 'Enter':
    case ' ': {
      e.preventDefault()
      const active = props.options[activeIndex.value]
      if (active) select(active)
      break
    }
    case 'Escape':
      close()
      break
    case 'Tab':
      close(false)
      break
  }
}

// TODO: implement dynamic repositioning on scroll/resize instead of closing
function handleScrollOrResize() {
  if (isOpen.value) close(false)
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  const inTrigger = rootRef.value?.contains(target)
  const inDropdown = dropdownRef.value?.contains(target)
  if (!inTrigger && !inDropdown) close(false)
}

function scrollActiveIntoView() {
  const dropdown = dropdownRef.value
  if (!dropdown) return
  const active = dropdown.querySelector('.glace-select__option--active') as HTMLElement | null
  if (active && typeof active.scrollIntoView === 'function') {
    active.scrollIntoView({ block: 'nearest' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true })
  window.addEventListener('resize', handleScrollOrResize, { passive: true })
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollOrResize, { capture: true })
  window.removeEventListener('resize', handleScrollOrResize)
  document.removeEventListener('mousedown', handleClickOutside)
})

const rootClasses = computed(() => [
  'glace-select',
  isOpen.value && 'glace-select--open',
  props.error && 'glace-select--error',
  props.disabled && 'glace-select--disabled',
])

defineExpose({ triggerRef })
</script>

<template>
  <div ref="rootRef" :class="rootClasses">
    <div
      ref="triggerRef"
      class="glace-select__trigger"
      role="combobox"
      tabindex="0"
      :aria-expanded="isOpen"
      :aria-disabled="disabled || undefined"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-describedby="errorId"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <slot name="trigger" :selected="selectedOption" :placeholder="placeholder">
        <span v-if="selectedOption" class="glace-select__value">{{ selectedOption.label }}</span>
        <span v-else class="glace-select__placeholder">{{ placeholder }}</span>
      </slot>
      <span class="glace-select__chevron" aria-hidden="true">›</span>
    </div>
    <p v-if="error" :id="errorId" class="glace-select__error-text" role="alert">{{ error }}</p>

    <Teleport to="body">
      <ul
        v-if="isOpen"
        :id="listboxId"
        ref="dropdownRef"
        class="glace-select__dropdown"
        role="listbox"
        :style="dropdownStyle"
      >
        <li
          v-for="(option, index) in options"
          :key="option.value"
          :class="[
            'glace-select__option',
            option.value === modelValue && 'glace-select__option--selected',
            index === activeIndex && 'glace-select__option--active',
            option.disabled && 'glace-select__option--disabled',
          ]"
          role="option"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled || undefined"
          @click="select(option)"
        >
          <slot
            name="option"
            :option="option"
            :selected="option.value === modelValue"
            :active="index === activeIndex"
          >
            {{ option.label }}
          </slot>
        </li>
      </ul>
    </Teleport>
  </div>
</template>
