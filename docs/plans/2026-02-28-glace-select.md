# GlaceSelect Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a GlaceSelect component — a liquid glass custom select with dual API (props + slots), teleported dropdown, keyboard navigation, and error/disabled states consistent with GlaceInput.

**Architecture:** Custom trigger + `<Teleport>`-based dropdown panel positioned via `getBoundingClientRect()`. Active option tracked separately from selected value. Two slot extension points: `#trigger` (replaces selected display) and `#option` (replaces each option row).

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, CSS BEM, Vitest + @vue/test-utils.

---

### Task 1: Add types to `types.ts`

**Files:**

- Modify: `packages/vue/src/components/types.ts`

**Step 1: Run baseline typecheck**

```bash
pnpm --filter @glace-ui/vue typecheck
```

Expected: PASS (confirm clean before changes)

**Step 2: Add `GlaceSelectOption` and `GlaceSelectProps` to `types.ts`**

Append at the end of the file:

```ts
/** A single option in GlaceSelect */
export interface GlaceSelectOption {
  /** Display label */
  label: string
  /** Emitted value */
  value: string | number
  /** Prevent selection */
  disabled?: boolean
}

/** Props for GlaceSelect */
export interface GlaceSelectProps {
  /** Bound value (v-model) */
  modelValue?: string | number | null
  /** Options array */
  options?: GlaceSelectOption[]
  /** Placeholder text when no value selected */
  placeholder?: string
  /** Disable the select */
  disabled?: boolean
  /** Error message (shows error state when set) */
  error?: string
}
```

**Step 3: Run typecheck**

```bash
pnpm --filter @glace-ui/vue typecheck
```

Expected: PASS

**Step 4: Commit**

```bash
git add packages/vue/src/components/types.ts
git commit -m "feat: add GlaceSelectOption and GlaceSelectProps types"
```

---

### Task 2: Create `glace-select.css`

**Files:**

- Create: `packages/core/src/css/glace-select.css`
- Modify: `packages/core/src/css/index.css`

**Step 1: Create `glace-select.css`**

```css
/* GlaceSelect */
.glace-select {
  position: relative;
  width: 100%;
}

.glace-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: var(--glace-bg);
  border: var(--glace-border-width) solid var(--glace-border);
  border-radius: var(--glace-radius-sm);
  color: var(--glace-text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(var(--glace-blur-subtle));
  -webkit-backdrop-filter: blur(var(--glace-blur-subtle));
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.glace-select__trigger:focus {
  outline: none;
  border-color: var(--glace-text-secondary);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  --glace-specular-intensity: 0.6;
}

.glace-select--error .glace-select__trigger {
  border-color: rgba(239, 68, 68, 0.6);
}

.glace-select--error .glace-select__trigger:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

.glace-select--disabled .glace-select__trigger {
  opacity: 0.5;
  cursor: not-allowed;
}

.glace-select__placeholder {
  color: var(--glace-text-secondary);
}

.glace-select__chevron {
  flex-shrink: 0;
  margin-left: 0.5rem;
  color: var(--glace-text-secondary);
  font-style: normal;
  transition: transform 0.2s ease;
}

.glace-select--open .glace-select__chevron {
  transform: rotate(90deg);
}

.glace-select__error-text {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: rgba(239, 68, 68, 0.9);
}

/* Dropdown panel — teleported to <body>, position: fixed via JS */
.glace-select__dropdown {
  position: fixed;
  z-index: 9999;
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  background: var(--glace-bg);
  border: var(--glace-border-width) solid var(--glace-border);
  border-radius: var(--glace-radius-sm);
  box-shadow: var(--glace-shadow);
  backdrop-filter: blur(var(--glace-blur));
  -webkit-backdrop-filter: blur(var(--glace-blur));
  overflow-y: auto;
  max-height: 16rem;
}

.glace-select__option {
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  color: var(--glace-text-primary);
  cursor: pointer;
  transition: background 0.15s ease;
}

.glace-select__option:hover,
.glace-select__option--active {
  background: var(--glace-bg-hover);
}

.glace-select__option--selected {
  font-weight: 500;
}

.glace-select__option--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.glace-select__option--disabled:hover {
  background: transparent;
}

@supports not (backdrop-filter: blur(1px)) {
  .glace-select__trigger,
  .glace-select__dropdown {
    background: rgba(30, 30, 30, 0.85);
  }
}
```

**Step 2: Add import to `packages/core/src/css/index.css`**

Append at the end:

```css
@import './glace-select.css';
```

**Step 3: Commit**

```bash
git add packages/core/src/css/glace-select.css packages/core/src/css/index.css
git commit -m "feat: add GlaceSelect CSS"
```

---

### Task 3: Write failing tests for GlaceSelect

**Files:**

- Create: `packages/vue/src/__tests__/GlaceSelect.test.ts`

**Step 1: Create the test file**

```ts
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
    await wrapper.findAll('.glace-select__option')[2].trigger('click') // Cherry is disabled
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
    expect(opts[0].classes()).toContain('glace-select__option--active') // Apple
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
```

**Step 2: Run tests to confirm they fail**

```bash
pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceSelect.test.ts
```

Expected: FAIL — `GlaceSelect.vue` does not exist yet

**Step 3: Commit the failing tests**

```bash
git add packages/vue/src/__tests__/GlaceSelect.test.ts
git commit -m "test: add failing GlaceSelect tests"
```

---

### Task 4: Create `GlaceSelect.vue`

**Files:**

- Create: `packages/vue/src/components/GlaceSelect.vue`

**Step 1: Create the component**

````vue
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
const isOpen = ref(false)
const activeIndex = ref(-1)
const dropdownStyle = ref<Record<string, string>>({})

useGlaceLight(triggerRef)

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

function close() {
  isOpen.value = false
  activeIndex.value = -1
  triggerRef.value?.focus()
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
      break
    case 'ArrowUp':
      e.preventDefault()
      activeIndex.value =
        enabled[(currentPos - 1 + enabled.length) % enabled.length]?.index ?? activeIndex.value
      break
    case 'Enter':
    case ' ': {
      e.preventDefault()
      const active = props.options[activeIndex.value]
      if (active) select(active)
      break
    }
    case 'Escape':
    case 'Tab':
      close()
      break
  }
}

// TODO: implement dynamic repositioning on scroll/resize instead of closing
function handleScrollOrResize() {
  if (isOpen.value) close()
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  const inTrigger = triggerRef.value?.closest('.glace-select')?.contains(target)
  const inDropdown = dropdownRef.value?.contains(target)
  if (!inTrigger && !inDropdown) close()
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
  <div :class="rootClasses">
    <div
      ref="triggerRef"
      class="glace-select__trigger"
      role="combobox"
      tabindex="0"
      :aria-expanded="isOpen"
      :aria-disabled="disabled || undefined"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <slot name="trigger" :selected="selectedOption" :placeholder="placeholder">
        <span v-if="selectedOption" class="glace-select__value">{{ selectedOption.label }}</span>
        <span v-else class="glace-select__placeholder">{{ placeholder }}</span>
      </slot>
      <span class="glace-select__chevron" aria-hidden="true">›</span>
    </div>
    <p v-if="error" class="glace-select__error-text" role="alert">{{ error }}</p>
  </div>

  <Teleport to="body">
    <ul
      v-if="isOpen"
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
</template>
````

**Step 2: Run tests**

```bash
pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceSelect.test.ts
```

Expected: all PASS

**Step 3: Commit**

```bash
git add packages/vue/src/components/GlaceSelect.vue
git commit -m "feat: add GlaceSelect component"
```

---

### Task 5: Register, export, and verify build

**Files:**

- Modify: `packages/vue/src/plugin.ts`
- Modify: `packages/vue/src/index.ts`

**Step 1: Add GlaceSelect to `plugin.ts`**

Add the import after the existing imports:

```ts
import GlaceSelect from './components/GlaceSelect.vue'
```

Add registration inside `install()`, after `app.component('GlaceAvatar', GlaceAvatar)`:

```ts
app.component('GlaceSelect', GlaceSelect)
```

**Step 2: Add GlaceSelect to `index.ts`**

Add the component export after `GlaceAvatar`:

```ts
export { default as GlaceSelect } from './components/GlaceSelect.vue'
```

Add `GlaceSelectProps` and `GlaceSelectOption` to the types export block:

```ts
export type {
  GlaceCardProps,
  GlaceBadgeProps,
  GlaceButtonProps,
  GlaceInputProps,
  GlaceNavbarProps,
  GlaceModalProps,
  GlaceChatBubbleProps,
  GlaceAvatarProps,
  GlaceSelectProps,
  GlaceSelectOption,
} from './components/types'
```

**Step 3: Run full test suite**

```bash
pnpm --filter @glace-ui/vue test
```

Expected: all 67 + new GlaceSelect tests pass

**Step 4: Run typecheck**

```bash
pnpm typecheck
```

Expected: PASS

**Step 5: Build**

```bash
pnpm build
```

Expected: successful build

**Step 6: Commit**

```bash
git add packages/vue/src/plugin.ts packages/vue/src/index.ts
git commit -m "feat: register and export GlaceSelect"
```

---

### Task 6: Update playground

**Files:**

- Modify: `apps/playground/src/App.vue`

**Step 1: Add a GlaceSelect demo section**

In `apps/playground/src/App.vue`, add `selectValue` to the script setup:

```ts
const selectValue = ref<string | null>(null)
```

Add a new section after the Inputs section (before Chat Bubbles):

```html
<!-- Select Section -->
<section class="section">
  <h2 class="section-title">GlaceSelect</h2>
  <div class="input-grid">
    <GlaceSelect
      v-model="selectValue"
      :options="[
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Cherry', value: 'cherry' },
        { label: 'Durian (unavailable)', value: 'durian', disabled: true },
      ]"
      placeholder="Pick a fruit…"
    />
    <GlaceSelect
      :options="[{ label: 'Only option', value: 'only' }]"
      placeholder="Error state"
      error="This field is required"
    />
    <GlaceSelect
      :options="[{ label: 'Only option', value: 'only' }]"
      placeholder="Disabled select"
      disabled
    />
  </div>
</section>
```

**Step 2: Verify playground builds**

```bash
pnpm --filter @glace-ui/playground build
```

Expected: PASS

**Step 3: Commit**

```bash
git add apps/playground/src/App.vue
git commit -m "chore: add GlaceSelect demo to playground"
```
