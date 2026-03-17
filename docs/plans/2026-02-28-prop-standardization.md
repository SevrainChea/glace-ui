# Prop Standardization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Standardize the prop contracts across all 8 Glace components using shared canonical union types.

**Architecture:** Add three exported union types (`GlaceVariant`, `GlaceSize`, `GlaceBlurIntensity`) to `types.ts`, then update each component's interface, Vue SFC, CSS, and tests. Two breaking changes: Button variant values change, ChatBubble `variant` renames to `direction`.

**Tech Stack:** TypeScript, Vue 3 SFCs (`<script setup>`), CSS BEM, Vitest + @vue/test-utils.

---

### Task 1: Add shared canonical types to `types.ts`

**Files:**

- Modify: `packages/vue/src/components/types.ts`

**Step 1: Write the failing typecheck**

Run: `pnpm --filter @glace-ui/vue typecheck`
Expected: PASS (baseline — confirm clean before changes)

**Step 2: Add the canonical types at the top of `types.ts`**

Insert before the `GlaceCardProps` interface:

```ts
/** Canonical appearance variants shared across components */
export type GlaceVariant = 'solid' | 'outline' | 'ghost' | 'subtle'

/** Canonical size scale shared across components */
export type GlaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

/** Blur intensity for container components */
export type GlaceBlurIntensity = 'subtle' | 'medium' | 'strong'
```

**Step 3: Update `GlaceCardProps` to use `GlaceBlurIntensity`**

```ts
export interface GlaceCardProps {
  blurIntensity?: GlaceBlurIntensity
  elevation?: 'flat' | 'raised' | 'floating'
  radius?: 'sm' | 'md' | 'lg' | 'full'
  as?: string
}
```

**Step 4: Update `GlaceBadgeProps` to use canonical types**

```ts
export interface GlaceBadgeProps {
  variant?: GlaceVariant
  size?: Extract<GlaceSize, 'xs' | 'sm' | 'md' | 'lg'>
  color?: string
  removable?: boolean
}
```

**Step 5: Update `GlaceButtonProps` to use canonical types**

```ts
export interface GlaceButtonProps {
  variant?: GlaceVariant
  color?: string
  size?: Extract<GlaceSize, 'sm' | 'md' | 'lg'>
  loading?: boolean
  disabled?: boolean
  as?: string
  hoverEffect?: boolean
}
```

**Step 6: Update `GlaceNavbarProps` to add `blurIntensity`**

```ts
export interface GlaceNavbarProps {
  blurIntensity?: GlaceBlurIntensity
  sticky?: boolean
  blurOnScroll?: boolean
  transparent?: boolean
}
```

**Step 7: Update `GlaceModalProps` to add `blurIntensity` and use `Extract`**

```ts
export interface GlaceModalProps {
  modelValue: boolean
  blurIntensity?: GlaceBlurIntensity
  size?: Extract<GlaceSize, 'sm' | 'md' | 'lg' | 'full'>
  closeOnOverlay?: boolean
}
```

**Step 8: Update `GlaceChatBubbleProps` — rename `variant` to `direction`**

```ts
export interface GlaceChatBubbleProps {
  direction?: 'sent' | 'received'
  timestamp?: string
}
```

**Step 9: Update `GlaceAvatarProps` to use `Extract`**

```ts
export interface GlaceAvatarProps {
  src?: string
  alt?: string
  size?: Extract<GlaceSize, 'sm' | 'md' | 'lg' | 'xl'>
  status?: 'online' | 'offline' | 'busy' | 'away'
}
```

**Step 10: Run typecheck**

Run: `pnpm --filter @glace-ui/vue typecheck`
Expected: errors (components still use old prop names — that's expected, fix in subsequent tasks)

**Step 11: Commit**

```bash
git add packages/vue/src/components/types.ts
git commit -m "feat: add GlaceVariant, GlaceSize, GlaceBlurIntensity canonical types"
```

---

### Task 2: Update GlaceButton CSS and component

**Files:**

- Modify: `packages/core/src/css/glace-button.css`
- Modify: `packages/vue/src/components/GlaceButton.vue`
- Modify: `packages/vue/src/__tests__/GlaceButton.test.ts`

**Step 1: Update tests first (TDD — they should fail after CSS changes)**

In `packages/vue/src/__tests__/GlaceButton.test.ts`, replace the entire file:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceButton from '../components/GlaceButton.vue'

describe('GlaceButton', () => {
  it('renders with default classes', () => {
    const wrapper = mount(GlaceButton, { slots: { default: 'Click' } })
    expect(wrapper.classes()).toContain('glace-button')
    expect(wrapper.classes()).toContain('glace-button--subtle')
    expect(wrapper.classes()).toContain('glace-button--md')
  })

  it('applies solid variant class', () => {
    const wrapper = mount(GlaceButton, { props: { variant: 'solid' }, slots: { default: 'Click' } })
    expect(wrapper.classes()).toContain('glace-button--solid')
  })

  it('applies outline variant class', () => {
    const wrapper = mount(GlaceButton, {
      props: { variant: 'outline' },
      slots: { default: 'Click' },
    })
    expect(wrapper.classes()).toContain('glace-button--outline')
  })

  it('applies ghost variant class and omits glace-glass', () => {
    const wrapper = mount(GlaceButton, { props: { variant: 'ghost' }, slots: { default: 'Click' } })
    expect(wrapper.classes()).toContain('glace-button--ghost')
    expect(wrapper.classes()).not.toContain('glace-glass')
  })

  it('applies subtle variant class', () => {
    const wrapper = mount(GlaceButton, {
      props: { variant: 'subtle' },
      slots: { default: 'Click' },
    })
    expect(wrapper.classes()).toContain('glace-button--subtle')
  })

  it('applies size class', () => {
    const wrapper = mount(GlaceButton, { props: { size: 'lg' }, slots: { default: 'Click' } })
    expect(wrapper.classes()).toContain('glace-button--lg')
  })

  it('disables button when disabled', () => {
    const wrapper = mount(GlaceButton, { props: { disabled: true }, slots: { default: 'Click' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('disables button when loading', () => {
    const wrapper = mount(GlaceButton, { props: { loading: true }, slots: { default: 'Click' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(GlaceButton, { props: { loading: true }, slots: { default: 'Click' } })
    expect(wrapper.find('.glace-button__spinner').exists()).toBe(true)
  })

  it('renders as custom element', () => {
    const wrapper = mount(GlaceButton, { props: { as: 'a' }, slots: { default: 'Link' } })
    expect(wrapper.element.tagName).toBe('A')
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceButton.test.ts`
Expected: FAIL — `glace-button--subtle` not found, `glace-button--secondary` still present

**Step 3: Update `GlaceButton.vue` — change default and ghost check**

````vue
<script setup lang="ts">
/**
 * A liquid glass button with loading state and variants.
 *
 * @example
 * ```vue
 * <GlaceButton variant="solid" size="lg" :loading="saving" @click="save">
 *   Save Changes
 * </GlaceButton>
 * ```
 */

import { computed, ref } from 'vue'
import { useGlaceLight } from './useGlaceLight.js'
import type { GlaceButtonProps } from './types'

const props = withDefaults(defineProps<GlaceButtonProps>(), {
  variant: 'subtle',
  size: 'md',
  loading: false,
  disabled: false,
  as: 'button',
  hoverEffect: true,
})

const rootRef = ref<HTMLElement | null>(null)

const classes = computed(() => [
  'glace-button',
  props.variant !== 'ghost' && 'glace-glass',
  `glace-button--${props.variant}`,
  `glace-button--${props.size}`,
])

if (props.hoverEffect) {
  useGlaceLight(rootRef)
}

defineExpose({ rootRef })
</script>
````

**Step 4: Update `glace-button.css` — rename primary/secondary, add outline/subtle**

Replace the variant sections (lines 39–66) with:

```css
.glace-button--solid {
  background: var(--glace-bg-hover);
  box-shadow: var(--glace-shadow);
}

.glace-button--solid:hover:not(:disabled) {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
}

.glace-button--subtle {
  background: var(--glace-bg);
}

.glace-button--outline {
  background: transparent;
  border-color: var(--glace-border);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.glace-button--outline:hover:not(:disabled) {
  background: var(--glace-bg);
}

.glace-button--ghost {
  background: transparent;
  border-color: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.glace-button--ghost::before,
.glace-button--ghost::after {
  display: none;
}

.glace-button--ghost:hover:not(:disabled) {
  background: var(--glace-bg);
}
```

**Step 5: Run tests to verify they pass**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceButton.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/core/src/css/glace-button.css \
        packages/vue/src/components/GlaceButton.vue \
        packages/vue/src/__tests__/GlaceButton.test.ts
git commit -m "feat!: update GlaceButton variants to solid|outline|ghost|subtle, add color prop"
```

---

### Task 3: Update GlaceChatBubble — rename `variant` to `direction`

**Files:**

- Modify: `packages/vue/src/components/GlaceChatBubble.vue`
- Modify: `packages/vue/src/__tests__/GlaceChatBubble.test.ts`

**Step 1: Update tests first**

Replace `packages/vue/src/__tests__/GlaceChatBubble.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlaceChatBubble from '../components/GlaceChatBubble.vue'

describe('GlaceChatBubble', () => {
  it('renders with default received direction', () => {
    const wrapper = mount(GlaceChatBubble, { slots: { default: 'Hello' } })
    expect(wrapper.classes()).toContain('glace-chat-bubble--received')
  })

  it('applies sent direction class', () => {
    const wrapper = mount(GlaceChatBubble, {
      props: { direction: 'sent' },
      slots: { default: 'Hello' },
    })
    expect(wrapper.classes()).toContain('glace-chat-bubble--sent')
  })

  it('renders message content', () => {
    const wrapper = mount(GlaceChatBubble, { slots: { default: 'Hello world' } })
    expect(wrapper.find('.glace-chat-bubble__content').text()).toBe('Hello world')
  })

  it('renders timestamp when provided', () => {
    const wrapper = mount(GlaceChatBubble, {
      props: { timestamp: '12:30 PM' },
      slots: { default: 'Hi' },
    })
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
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceChatBubble.test.ts`
Expected: FAIL — `direction` prop not found on component

**Step 3: Update `GlaceChatBubble.vue` — rename `variant` to `direction`**

````vue
<script setup lang="ts">
/**
 * A liquid glass chat bubble for messaging UIs.
 *
 * @example
 * ```vue
 * <GlaceChatBubble direction="sent" timestamp="12:34 PM">
 *   Hello, world!
 * </GlaceChatBubble>
 * ```
 */

import { computed, ref } from 'vue'
import { useGlaceLight } from './useGlaceLight.js'
import type { GlaceChatBubbleProps } from './types'

const props = withDefaults(defineProps<GlaceChatBubbleProps>(), {
  direction: 'received',
  timestamp: undefined,
})

const contentRef = ref<HTMLElement | null>(null)

const classes = computed(() => ['glace-chat-bubble', `glace-chat-bubble--${props.direction}`])

useGlaceLight(contentRef)

defineExpose({ contentRef })
</script>
````

Keep the `<template>` block unchanged.

**Step 4: Run tests to verify they pass**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceChatBubble.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/vue/src/components/GlaceChatBubble.vue \
        packages/vue/src/__tests__/GlaceChatBubble.test.ts
git commit -m "feat!: rename GlaceChatBubble variant prop to direction"
```

---

### Task 4: Update GlaceNavbar — add `blurIntensity`

**Files:**

- Modify: `packages/core/src/css/glace-navbar.css`
- Modify: `packages/vue/src/components/GlaceNavbar.vue`
- Modify: `packages/vue/src/__tests__/GlaceNavbar.test.ts`

**Step 1: Read existing Navbar tests**

Run: `cat packages/vue/src/__tests__/GlaceNavbar.test.ts`
(Understand what's already there before modifying)

**Step 2: Add `blurIntensity` tests to `GlaceNavbar.test.ts`**

Append to the existing `describe` block:

```ts
it('applies blur-subtle modifier class', () => {
  const wrapper = mount(GlaceNavbar, { props: { blurIntensity: 'subtle' } })
  expect(wrapper.classes()).toContain('glace-navbar--blur-subtle')
})

it('applies blur-strong modifier class', () => {
  const wrapper = mount(GlaceNavbar, { props: { blurIntensity: 'strong' } })
  expect(wrapper.classes()).toContain('glace-navbar--blur-strong')
})

it('does not apply blur modifier class for medium (default)', () => {
  const wrapper = mount(GlaceNavbar, { props: { blurIntensity: 'medium' } })
  expect(wrapper.classes()).not.toContain('glace-navbar--blur-subtle')
  expect(wrapper.classes()).not.toContain('glace-navbar--blur-strong')
})
```

**Step 3: Run tests to verify they fail**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceNavbar.test.ts`
Expected: FAIL — `glace-navbar--blur-subtle` not applied

**Step 4: Update `GlaceNavbar.vue` — add `blurIntensity` to props and classes**

```vue
const props = withDefaults(defineProps<GlaceNavbarProps>(), {
  blurIntensity: 'medium',
  sticky: false,
  blurOnScroll: false,
  transparent: false,
})
```

Update the `classes` computed:

```ts
const classes = computed(() => [
  'glace-navbar',
  !showTransparent.value && 'glace-glass',
  props.sticky && 'glace-navbar--sticky',
  showTransparent.value && 'glace-navbar--transparent',
  props.blurOnScroll && isScrolled.value && 'glace-navbar--scrolled',
  props.blurIntensity === 'subtle' && 'glace-navbar--blur-subtle',
  props.blurIntensity === 'strong' && 'glace-navbar--blur-strong',
])
```

**Step 5: Add blur modifier classes to `glace-navbar.css`**

Append before the `@supports` block:

```css
.glace-navbar--blur-subtle {
  backdrop-filter: blur(var(--glace-blur-subtle));
  -webkit-backdrop-filter: blur(var(--glace-blur-subtle));
}

.glace-navbar--blur-strong {
  backdrop-filter: blur(var(--glace-blur-intense));
  -webkit-backdrop-filter: blur(var(--glace-blur-intense));
}
```

**Step 6: Run tests to verify they pass**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceNavbar.test.ts`
Expected: PASS

**Step 7: Commit**

```bash
git add packages/core/src/css/glace-navbar.css \
        packages/vue/src/components/GlaceNavbar.vue \
        packages/vue/src/__tests__/GlaceNavbar.test.ts
git commit -m "feat: add blurIntensity prop to GlaceNavbar"
```

---

### Task 5: Update GlaceModal — add `blurIntensity`

**Files:**

- Modify: `packages/core/src/css/glace-modal.css`
- Modify: `packages/vue/src/components/GlaceModal.vue`
- Modify: `packages/vue/src/__tests__/GlaceModal.test.ts`

**Step 1: Read existing Modal tests**

Run: `cat packages/vue/src/__tests__/GlaceModal.test.ts`

**Step 2: Add `blurIntensity` tests to `GlaceModal.test.ts`**

Append to the existing `describe` block:

```ts
it('applies blur-subtle modifier class to content', () => {
  const wrapper = mount(GlaceModal, {
    props: { modelValue: true, blurIntensity: 'subtle' },
    attachTo: document.body,
  })
  expect(wrapper.find('.glace-modal__content').classes()).toContain(
    'glace-modal__content--blur-subtle',
  )
  wrapper.unmount()
})

it('applies blur-strong modifier class to content', () => {
  const wrapper = mount(GlaceModal, {
    props: { modelValue: true, blurIntensity: 'strong' },
    attachTo: document.body,
  })
  expect(wrapper.find('.glace-modal__content').classes()).toContain(
    'glace-modal__content--blur-strong',
  )
  wrapper.unmount()
})
```

**Step 3: Run tests to verify they fail**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceModal.test.ts`
Expected: FAIL — modifier class not applied

**Step 4: Update `GlaceModal.vue` — add `blurIntensity` to props and content class**

Add default:

```ts
const props = withDefaults(defineProps<GlaceModalProps>(), {
  blurIntensity: 'strong',
  size: 'md',
  closeOnOverlay: true,
})
```

Update the content div class binding in `<template>`:

```html
<div
  ref="contentRef"
  :class="[
    'glace-modal__content',
    'glace-glass',
    `glace-modal__content--${size}`,
    blurIntensity === 'subtle' && 'glace-modal__content--blur-subtle',
    blurIntensity === 'medium' && 'glace-modal__content--blur-medium',
  ]"
></div>
```

Note: `strong` is the default and uses the existing `var(--glace-blur-intense)` from base CSS — no modifier class needed for it.

**Step 5: Add blur modifier classes to `glace-modal.css`**

Append before the `@supports` block:

```css
.glace-modal__content--blur-subtle {
  backdrop-filter: blur(var(--glace-blur-subtle));
  -webkit-backdrop-filter: blur(var(--glace-blur-subtle));
}

.glace-modal__content--blur-medium {
  backdrop-filter: blur(var(--glace-blur));
  -webkit-backdrop-filter: blur(var(--glace-blur));
}
```

**Step 6: Run tests to verify they pass**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceModal.test.ts`
Expected: PASS

**Step 7: Commit**

```bash
git add packages/core/src/css/glace-modal.css \
        packages/vue/src/components/GlaceModal.vue \
        packages/vue/src/__tests__/GlaceModal.test.ts
git commit -m "feat: add blurIntensity prop to GlaceModal"
```

---

### Task 6: Run full test suite and typecheck

**Step 1: Run all Vue tests**

Run: `pnpm --filter @glace-ui/vue test`
Expected: all PASS

**Step 2: Run typecheck across monorepo**

Run: `pnpm typecheck`
Expected: PASS — no type errors

**Step 3: Build all packages**

Run: `pnpm build`
Expected: successful build for `@glace-ui/core` and `@glace-ui/vue`

**Step 4: Commit if anything needed fixing**

```bash
git add -p
git commit -m "fix: resolve any remaining type or build issues after prop standardization"
```
