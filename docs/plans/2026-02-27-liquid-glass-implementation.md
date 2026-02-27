# Liquid Glass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform glace-ui from standard glassmorphism to Apple-style Liquid Glass UX with CSS pseudo-element layering and mouse-reactive specular highlights.

**Architecture:** New liquid glass tokens (`light` module) added to `@glace-ui/core`. Shared `glace-liquid-glass.css` provides `::before`/`::after` pseudo-element layers. `trackGlaceLight()` utility handles mouse-reactive light positioning. Vue `useGlaceLight()` composable wraps it for components.

**Tech Stack:** TypeScript, CSS custom properties, Vue 3 composables, Vitest

---

### Task 1: Add liquid glass token module

**Files:**
- Create: `packages/core/src/tokens/light.ts`
- Modify: `packages/core/src/tokens/index.ts`

**Step 1: Write the failing test**

Add to `packages/core/src/__tests__/tokens.test.ts`:

```ts
import {
  glaceLightTokens,
} from '../tokens'
import type { GlaceLightTokens } from '../tokens'

describe('glaceLightTokens', () => {
  it('includes all light tokens', () => {
    expect(glaceLightTokens['--glace-light-x']).toBe('30%')
    expect(glaceLightTokens['--glace-light-y']).toBe('20%')
    expect(glaceLightTokens['--glace-specular-intensity']).toBe('0.4')
    expect(glaceLightTokens['--glace-specular-size']).toBe('60%')
    expect(glaceLightTokens['--glace-tint']).toBe('rgba(255, 255, 255, 0.08)')
    expect(glaceLightTokens['--glace-edge-light']).toBe('rgba(255, 255, 255, 0.25)')
    expect(glaceLightTokens['--glace-edge-shadow']).toBe('rgba(0, 0, 0, 0.15)')
  })

  it('is included in composite glaceTokens', () => {
    expect(glaceTokens['--glace-light-x']).toBeDefined()
    expect(glaceTokens['--glace-specular-intensity']).toBeDefined()
  })

  it('all presets include light tokens', () => {
    const _light: GlaceTokens = glaceTokensLight
    const _dark: GlaceTokens = glaceTokensDark
    expect(_light['--glace-specular-intensity']).toBeDefined()
    expect(_dark['--glace-specular-intensity']).toBeDefined()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @glace-ui/core exec vitest run src/__tests__/tokens.test.ts`
Expected: FAIL — `glaceLightTokens` not exported

**Step 3: Create `light.ts` token module**

Create `packages/core/src/tokens/light.ts`:

```ts
/** Liquid glass light and specular tokens */
export interface GlaceLightTokens {
  '--glace-light-x': string
  '--glace-light-y': string
  '--glace-specular-intensity': string
  '--glace-specular-size': string
  '--glace-tint': string
  '--glace-edge-light': string
  '--glace-edge-shadow': string
}

/** Default liquid glass light tokens */
export const glaceLightTokens: GlaceLightTokens = {
  '--glace-light-x': '30%',
  '--glace-light-y': '20%',
  '--glace-specular-intensity': '0.4',
  '--glace-specular-size': '60%',
  '--glace-tint': 'rgba(255, 255, 255, 0.08)',
  '--glace-edge-light': 'rgba(255, 255, 255, 0.25)',
  '--glace-edge-shadow': 'rgba(0, 0, 0, 0.15)',
}

/** Light theme overrides for liquid glass */
export const glaceLightTokensLight: Partial<GlaceLightTokens> = {
  '--glace-specular-intensity': '0.5',
  '--glace-tint': 'rgba(255, 255, 255, 0.12)',
  '--glace-edge-light': 'rgba(255, 255, 255, 0.35)',
  '--glace-edge-shadow': 'rgba(0, 0, 0, 0.08)',
}

/** Dark theme overrides for liquid glass */
export const glaceLightTokensDark: Partial<GlaceLightTokens> = {
  '--glace-specular-intensity': '0.3',
  '--glace-tint': 'rgba(255, 255, 255, 0.05)',
  '--glace-edge-light': 'rgba(255, 255, 255, 0.18)',
  '--glace-edge-shadow': 'rgba(0, 0, 0, 0.25)',
}
```

**Step 4: Update `packages/core/src/tokens/index.ts`**

Add light token imports/exports and merge into composite types:

```ts
export { glaceLightTokens, glaceLightTokensLight, glaceLightTokensDark } from './light'
export type { GlaceLightTokens } from './light'

import { glaceLightTokens, glaceLightTokensLight, glaceLightTokensDark } from './light'
import type { GlaceLightTokens } from './light'

// Update GlaceTokens to include light tokens:
export type GlaceTokens = GlaceColorTokens & GlaceBlurTokens & GlaceBorderTokens & GlaceLightTokens

// Spread glaceLightTokens into all three presets:
export const glaceTokens: GlaceTokens = {
  ...glaceColorTokens,
  ...glaceBlurTokens,
  ...glaceBorderTokens,
  ...glaceLightTokens,
}

export const glaceTokensLight: GlaceTokens = {
  ...glaceColorTokensLight,
  ...glaceBlurTokens,
  ...glaceBorderTokens,
  ...glaceLightTokens,
  ...glaceLightTokensLight,
}

export const glaceTokensDark: GlaceTokens = {
  ...glaceColorTokensDark,
  ...glaceBlurTokens,
  ...glaceBorderTokens,
  ...glaceLightTokens,
  ...glaceLightTokensDark,
}
```

Also update `packages/core/src/index.ts` to add exports:

```ts
export {
  glaceLightTokens,
  glaceLightTokensLight,
  glaceLightTokensDark,
} from './tokens'

export type {
  GlaceLightTokens,
} from './tokens'
```

**Step 5: Run test to verify it passes**

Run: `pnpm --filter @glace-ui/core exec vitest run src/__tests__/tokens.test.ts`
Expected: PASS — all tests including new ones

**Step 6: Commit**

```bash
git add packages/core/src/tokens/light.ts packages/core/src/tokens/index.ts packages/core/src/index.ts packages/core/src/__tests__/tokens.test.ts
git commit -m "feat(core): add liquid glass light tokens"
```

---

### Task 2: Create shared liquid glass CSS

**Files:**
- Create: `packages/core/src/css/glace-liquid-glass.css`
- Modify: `packages/core/src/css/index.css`
- Modify: `packages/core/scripts/build-css.mjs`

**Step 1: Create `glace-liquid-glass.css`**

Create `packages/core/src/css/glace-liquid-glass.css`:

```css
/* Liquid Glass — shared pseudo-element layers for all glace components.
   ::before = specular highlight, ::after = edge light + depth tint.
   Components must set position: relative on their root element. */

.glace-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse var(--glace-specular-size) var(--glace-specular-size)
      at var(--glace-light-x) var(--glace-light-y),
    rgba(255, 255, 255, var(--glace-specular-intensity)),
    transparent
  );
  pointer-events: none;
  z-index: 1;
  transition: background 0.3s ease;
}

.glace-glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow:
    inset 1px 1px 0 var(--glace-edge-light),
    inset -1px -1px 0 var(--glace-edge-shadow);
  background: linear-gradient(
    135deg,
    var(--glace-tint) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.04) 100%
  );
  pointer-events: none;
  z-index: 1;
}
```

**Step 2: Add to `index.css`**

Prepend the import at the top of `packages/core/src/css/index.css`:

```css
@import './glace-liquid-glass.css';
@import './glace-card.css';
...existing imports...
```

**Step 3: Add to build script**

In `packages/core/scripts/build-css.mjs`, add `'glace-liquid-glass.css'` as the first entry in the `files` array.

**Step 4: Build and verify**

Run: `pnpm --filter @glace-ui/core build`
Expected: `dist/index.css` includes the liquid glass styles at the top.

**Step 5: Commit**

```bash
git add packages/core/src/css/glace-liquid-glass.css packages/core/src/css/index.css packages/core/scripts/build-css.mjs
git commit -m "feat(core): add shared liquid glass CSS layers"
```

---

### Task 3: Update GlaceCard CSS + Vue component for liquid glass

**Files:**
- Modify: `packages/core/src/css/glace-card.css`
- Modify: `packages/vue/src/components/GlaceCard.vue`

**Step 1: Update `glace-card.css`**

Replace the full contents of `packages/core/src/css/glace-card.css`:

```css
/* GlaceCard — Liquid Glass */
.glace-card {
  position: relative;
  background: var(--glace-bg);
  border: var(--glace-border-width) solid var(--glace-border);
  border-radius: var(--glace-radius);
  box-shadow: var(--glace-shadow);
  color: var(--glace-text-primary);
  backdrop-filter: blur(var(--glace-blur));
  -webkit-backdrop-filter: blur(var(--glace-blur));
  overflow: hidden;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.glace-card--hoverable:hover {
  background: var(--glace-bg-hover);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
}

.glace-card--hoverable:hover::before {
  background: radial-gradient(
    ellipse var(--glace-specular-size) var(--glace-specular-size)
      at var(--glace-light-x) var(--glace-light-y),
    rgba(255, 255, 255, calc(var(--glace-specular-intensity) + 0.1)),
    transparent
  );
}

.glace-card--flat {
  box-shadow: none;
}

.glace-card--raised {
  box-shadow: var(--glace-shadow);
}

.glace-card--floating {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}

.glace-card--blur-subtle {
  backdrop-filter: blur(var(--glace-blur-subtle));
  -webkit-backdrop-filter: blur(var(--glace-blur-subtle));
}

.glace-card--blur-strong {
  backdrop-filter: blur(var(--glace-blur-intense));
  -webkit-backdrop-filter: blur(var(--glace-blur-intense));
}

.glace-card--radius-sm {
  border-radius: var(--glace-radius-sm);
}

.glace-card--radius-lg {
  border-radius: var(--glace-radius-lg);
}

.glace-card--radius-full {
  border-radius: var(--glace-radius-full);
}

.glace-card__header {
  position: relative;
  z-index: 2;
  padding: 1.25rem 1.5rem;
  border-bottom: var(--glace-border-width) solid var(--glace-border);
}

.glace-card__body {
  position: relative;
  z-index: 2;
  padding: 1.5rem;
}

.glace-card__footer {
  position: relative;
  z-index: 2;
  padding: 1rem 1.5rem;
  border-top: var(--glace-border-width) solid var(--glace-border);
}

@supports not (backdrop-filter: blur(1px)) {
  .glace-card {
    background: rgba(30, 30, 30, 0.85);
  }
}
```

**Step 2: Update `GlaceCard.vue`**

Add `glace-glass` class and `useGlaceLight` (will be added in Task 7). For now, just add the CSS class. In the computed classes array, add `'glace-glass'` as the second entry after `'glace-card'`. Also add a template ref on the root `<component>` tag:

```vue
<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import type { GlaceCardProps } from './types'

const props = withDefaults(defineProps<GlaceCardProps>(), {
  blurIntensity: 'medium',
  elevation: 'raised',
  hoverable: false,
  radius: 'md',
  as: 'div',
})

const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)

const classes = computed(() => [
  'glace-card',
  'glace-glass',
  props.hoverable && 'glace-card--hoverable',
  props.elevation !== 'raised' && `glace-card--${props.elevation}`,
  props.blurIntensity === 'subtle' && 'glace-card--blur-subtle',
  props.blurIntensity === 'strong' && 'glace-card--blur-strong',
  props.radius !== 'md' && `glace-card--radius-${props.radius}`,
])

defineExpose({ rootRef })
</script>

<template>
  <component ref="rootRef" :is="as" :class="classes">
    <div v-if="slots.header" class="glace-card__header">
      <slot name="header" />
    </div>
    <div class="glace-card__body">
      <slot />
    </div>
    <div v-if="slots.footer" class="glace-card__footer">
      <slot name="footer" />
    </div>
  </component>
</template>
```

**Step 3: Run existing tests**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceCard.test.ts`
Expected: PASS — existing tests still pass (they test props/slots, not visuals). The new `glace-glass` class is just additive.

**Step 4: Commit**

```bash
git add packages/core/src/css/glace-card.css packages/vue/src/components/GlaceCard.vue
git commit -m "feat(card): add liquid glass layers to GlaceCard"
```

---

### Task 4: Update GlaceButton CSS + Vue component

**Files:**
- Modify: `packages/core/src/css/glace-button.css`
- Modify: `packages/vue/src/components/GlaceButton.vue`

**Step 1: Update `glace-button.css`**

Replace full contents of `packages/core/src/css/glace-button.css`:

```css
/* GlaceButton — Liquid Glass */
.glace-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--glace-bg);
  border: var(--glace-border-width) solid var(--glace-border);
  border-radius: var(--glace-radius-sm);
  color: var(--glace-text-primary);
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  backdrop-filter: blur(var(--glace-blur));
  -webkit-backdrop-filter: blur(var(--glace-blur));
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
  user-select: none;
  overflow: hidden;
}

.glace-button:hover:not(:disabled) {
  background: var(--glace-bg-hover);
}

.glace-button:active:not(:disabled) {
  transform: scale(0.98);
}

.glace-button:active:not(:disabled)::before {
  opacity: 0.7;
}

.glace-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.glace-button--primary {
  background: var(--glace-bg-hover);
  box-shadow: var(--glace-shadow);
}

.glace-button--primary:hover:not(:disabled) {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
}

.glace-button--secondary {
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

.glace-button--sm {
  font-size: 0.8125rem;
  padding: 0.375rem 0.75rem;
}

.glace-button--md {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.glace-button--lg {
  font-size: 1rem;
  padding: 0.625rem 1.25rem;
}

.glace-button__spinner {
  position: relative;
  z-index: 2;
  width: 1em;
  height: 1em;
  border: 2px solid var(--glace-border);
  border-top-color: var(--glace-text-primary);
  border-radius: 50%;
  animation: glace-button-spin 0.6s linear infinite;
}

@keyframes glace-button-spin {
  to {
    transform: rotate(360deg);
  }
}

@supports not (backdrop-filter: blur(1px)) {
  .glace-button {
    background: rgba(30, 30, 30, 0.85);
  }
}
```

**Step 2: Update `GlaceButton.vue`**

Add `glace-glass` to classes, `ref` on root, and `z-index: 2` for slot content:

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GlaceButtonProps } from './types'

const props = withDefaults(defineProps<GlaceButtonProps>(), {
  variant: 'secondary',
  size: 'md',
  loading: false,
  disabled: false,
  as: 'button',
})

const rootRef = ref<HTMLElement | null>(null)

const classes = computed(() => [
  'glace-button',
  props.variant !== 'ghost' && 'glace-glass',
  `glace-button--${props.variant}`,
  `glace-button--${props.size}`,
])

defineExpose({ rootRef })
</script>

<template>
  <component
    ref="rootRef"
    :is="as"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="glace-button__spinner" aria-hidden="true" />
    <span v-else style="position: relative; z-index: 2; display: contents"><slot /></span>
  </component>
</template>
```

**Step 3: Run existing tests**

Run: `pnpm --filter @glace-ui/vue exec vitest run src/__tests__/GlaceButton.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add packages/core/src/css/glace-button.css packages/vue/src/components/GlaceButton.vue
git commit -m "feat(button): add liquid glass layers to GlaceButton"
```

---

### Task 5: Update remaining 6 component CSS files

**Files:**
- Modify: `packages/core/src/css/glace-input.css`
- Modify: `packages/core/src/css/glace-modal.css`
- Modify: `packages/core/src/css/glace-badge.css`
- Modify: `packages/core/src/css/glace-navbar.css`
- Modify: `packages/core/src/css/glace-chat-bubble.css`
- Modify: `packages/core/src/css/glace-avatar.css`

For each component CSS file, apply these changes:

**GlaceInput** (`glace-input.css`): The glass surface is `.glace-input__field`, not the wrapper. Add `position: relative; overflow: hidden;` to `.glace-input__field`. Add `position: relative; z-index: 2;` to `.glace-input__icon` and `.glace-input__suffix`. On `.glace-input__field:focus`, add brighter specular via overriding `--glace-specular-intensity: 0.6`.

**GlaceModal** (`glace-modal.css`): The glass surface is `.glace-modal__content`. It already has `position: relative; overflow: hidden;`. Add `position: relative; z-index: 2;` to `.glace-modal__header`, `.glace-modal__body`, `.glace-modal__footer`. Enhance overlay with `backdrop-filter: blur(4px);`.

**GlaceBadge** (`glace-badge.css`): Add `position: relative; overflow: hidden;` to `.glace-badge`. Badge is small so add `--glace-specular-size: 80%` directly on `.glace-badge` to make the highlight cover more area. Add `position: relative; z-index: 2;` to inner content via `.glace-badge > *`.

**GlaceNavbar** (`glace-navbar.css`): Add `position: relative; overflow: hidden;` to `.glace-navbar`. Use a wider specular gradient by adding `--glace-specular-size: 120%` on `.glace-navbar`. Add `position: relative; z-index: 2;` to `.glace-navbar__logo`, `.glace-navbar__content`, `.glace-navbar__actions`. Disable liquid glass on `--transparent` variant.

**GlaceChatBubble** (`glace-chat-bubble.css`): The glass surface is `.glace-chat-bubble__content`. Add `position: relative; overflow: hidden;` to it. For sent bubbles, shift edge-light to right side: `.glace-chat-bubble--sent .glace-chat-bubble__content { --glace-edge-light: rgba(255, 255, 255, 0.15); --glace-edge-shadow: rgba(0, 0, 0, 0.2); }`.

**GlaceAvatar** (`glace-avatar.css`): Already has `position: relative; overflow: hidden;`. Add `position: relative; z-index: 2;` to `.glace-avatar__image` and `.glace-avatar__fallback`. Use circular specular: `--glace-specular-size: 70%` on `.glace-avatar`.

**Step 1: Apply all CSS changes**

Apply the changes described above to each of the 6 CSS files.

**Step 2: Build CSS**

Run: `pnpm --filter @glace-ui/core build`
Expected: Successful build

**Step 3: Commit**

```bash
git add packages/core/src/css/glace-input.css packages/core/src/css/glace-modal.css packages/core/src/css/glace-badge.css packages/core/src/css/glace-navbar.css packages/core/src/css/glace-chat-bubble.css packages/core/src/css/glace-avatar.css
git commit -m "feat(css): add liquid glass layers to all remaining components"
```

---

### Task 6: Update remaining 6 Vue components

**Files:**
- Modify: `packages/vue/src/components/GlaceInput.vue`
- Modify: `packages/vue/src/components/GlaceModal.vue`
- Modify: `packages/vue/src/components/GlaceBadge.vue`
- Modify: `packages/vue/src/components/GlaceNavbar.vue`
- Modify: `packages/vue/src/components/GlaceChatBubble.vue`
- Modify: `packages/vue/src/components/GlaceAvatar.vue`

For each Vue component, add `glace-glass` to the appropriate element's class list and add a `rootRef`:

- **GlaceInput**: Add `glace-glass` to the `.glace-input__field` element (not the wrapper)
- **GlaceModal**: Add `glace-glass` to `.glace-modal__content`
- **GlaceBadge**: Add `glace-glass` to the root `<span>`
- **GlaceNavbar**: Add `glace-glass` to the root `<nav>`. Skip when transparent variant is active.
- **GlaceChatBubble**: Add `glace-glass` to `.glace-chat-bubble__content`
- **GlaceAvatar**: Add `glace-glass` to the root `<div>`

Each component should also import `ref` and create `rootRef` for later use by `useGlaceLight`.

**Step 1: Apply changes to all 6 Vue components**

**Step 2: Run all Vue tests**

Run: `pnpm --filter @glace-ui/vue test`
Expected: PASS — all existing tests still pass

**Step 3: Commit**

```bash
git add packages/vue/src/components/GlaceInput.vue packages/vue/src/components/GlaceModal.vue packages/vue/src/components/GlaceBadge.vue packages/vue/src/components/GlaceNavbar.vue packages/vue/src/components/GlaceChatBubble.vue packages/vue/src/components/GlaceAvatar.vue
git commit -m "feat(vue): add glace-glass class to all Vue components"
```

---

### Task 7: Create `trackGlaceLight` core utility

**Files:**
- Create: `packages/core/src/utils/trackGlaceLight.ts`
- Modify: `packages/core/src/utils/index.ts` (re-export)
- Modify: `packages/core/src/index.ts` (re-export)
- Create: `packages/core/src/__tests__/trackGlaceLight.test.ts`

**Step 1: Write the failing test**

Create `packages/core/src/__tests__/trackGlaceLight.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { trackGlaceLight } from '../utils/trackGlaceLight'

describe('trackGlaceLight', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      right: 300,
      bottom: 200,
      x: 100,
      y: 100,
      toJSON: () => {},
    })
  })

  afterEach(() => {
    document.body.removeChild(element)
  })

  it('returns a cleanup function', () => {
    const cleanup = trackGlaceLight(element)
    expect(typeof cleanup).toBe('function')
    cleanup()
  })

  it('sets CSS custom properties on mousemove', async () => {
    const cleanup = trackGlaceLight(element)

    const event = new MouseEvent('mousemove', {
      clientX: 200,
      clientY: 150,
    })
    document.dispatchEvent(event)

    // Wait for rAF
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const lightX = element.style.getPropertyValue('--glace-light-x')
    const lightY = element.style.getPropertyValue('--glace-light-y')

    expect(lightX).toBe('50%')
    expect(lightY).toBe('50%')

    cleanup()
  })

  it('clamps values between 0% and 100%', async () => {
    const cleanup = trackGlaceLight(element)

    const event = new MouseEvent('mousemove', {
      clientX: 0,
      clientY: 0,
    })
    document.dispatchEvent(event)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    const lightX = element.style.getPropertyValue('--glace-light-x')
    const lightY = element.style.getPropertyValue('--glace-light-y')

    expect(lightX).toBe('0%')
    expect(lightY).toBe('0%')

    cleanup()
  })

  it('removes listener on cleanup', async () => {
    const cleanup = trackGlaceLight(element)
    cleanup()

    const event = new MouseEvent('mousemove', {
      clientX: 200,
      clientY: 150,
    })
    document.dispatchEvent(event)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    const lightX = element.style.getPropertyValue('--glace-light-x')
    expect(lightX).toBe('')

    cleanup()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @glace-ui/core exec vitest run src/__tests__/trackGlaceLight.test.ts`
Expected: FAIL — module not found

**Step 3: Implement `trackGlaceLight`**

Create `packages/core/src/utils/trackGlaceLight.ts`:

```ts
export interface TrackGlaceLightOptions {
  /** Container element to listen for mousemove (defaults to document) */
  container?: HTMLElement
  /** Intensity multiplier (default 1) — higher values spread the light further */
  intensity?: number
}

/**
 * Tracks mouse position and updates `--glace-light-x` and `--glace-light-y`
 * CSS custom properties on the target element, creating a mouse-reactive
 * specular highlight effect.
 *
 * @param element - The element to apply light tracking to
 * @param options - Configuration options
 * @returns Cleanup function that removes the event listener
 */
export function trackGlaceLight(
  element: HTMLElement,
  options: TrackGlaceLightOptions = {},
): () => void {
  const { intensity = 1 } = options
  const target = options.container ?? document

  let rafId: number | null = null

  function onMouseMove(event: Event) {
    const e = event as MouseEvent
    if (rafId !== null) return

    rafId = requestAnimationFrame(() => {
      rafId = null
      const rect = element.getBoundingClientRect()

      const rawX = ((e.clientX - rect.left) / rect.width) * 100 * intensity
      const rawY = ((e.clientY - rect.top) / rect.height) * 100 * intensity

      const x = Math.round(Math.max(0, Math.min(100, rawX)))
      const y = Math.round(Math.max(0, Math.min(100, rawY)))

      element.style.setProperty('--glace-light-x', `${x}%`)
      element.style.setProperty('--glace-light-y', `${y}%`)
    })
  }

  target.addEventListener('mousemove', onMouseMove, { passive: true })

  return () => {
    target.removeEventListener('mousemove', onMouseMove)
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
}
```

**Step 4: Add exports**

In `packages/core/src/utils/index.ts`, add at the end:

```ts
export { trackGlaceLight } from './trackGlaceLight'
export type { TrackGlaceLightOptions } from './trackGlaceLight'
```

In `packages/core/src/index.ts`, add to the utils export block:

```ts
export { trackGlaceLight } from './utils'
export type { TrackGlaceLightOptions } from './utils'
```

**Step 5: Run test to verify it passes**

Run: `pnpm --filter @glace-ui/core exec vitest run src/__tests__/trackGlaceLight.test.ts`
Expected: PASS

**Step 6: Run all core tests**

Run: `pnpm --filter @glace-ui/core test`
Expected: PASS

**Step 7: Commit**

```bash
git add packages/core/src/utils/trackGlaceLight.ts packages/core/src/utils/index.ts packages/core/src/index.ts packages/core/src/__tests__/trackGlaceLight.test.ts
git commit -m "feat(core): add trackGlaceLight mouse-reactive light utility"
```

---

### Task 8: Create `useGlaceLight` Vue composable

**Files:**
- Create: `packages/vue/src/composables/useGlaceLight.ts`
- Modify: `packages/vue/src/composables/index.ts`
- Modify: `packages/vue/src/index.ts`

**Step 1: Create the composable**

Create `packages/vue/src/composables/useGlaceLight.ts`:

```ts
import { onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import { trackGlaceLight } from '@glace-ui/core'
import type { TrackGlaceLightOptions } from '@glace-ui/core'

/**
 * Vue composable that wraps trackGlaceLight with lifecycle management.
 * Updates `--glace-light-x` and `--glace-light-y` on the element
 * based on mouse position, creating a reactive specular highlight.
 *
 * @param elementRef - Template ref to the target element
 * @param options - trackGlaceLight options
 */
export function useGlaceLight(
  elementRef: Ref<HTMLElement | null>,
  options?: TrackGlaceLightOptions,
): void {
  let cleanup: (() => void) | null = null

  function start() {
    stop()
    if (elementRef.value) {
      cleanup = trackGlaceLight(elementRef.value, options)
    }
  }

  function stop() {
    if (cleanup) {
      cleanup()
      cleanup = null
    }
  }

  onMounted(() => start())
  onUnmounted(() => stop())

  watch(elementRef, () => start())
}
```

**Step 2: Export from composables index**

In `packages/vue/src/composables/index.ts`, add:

```ts
export { useGlaceLight } from './useGlaceLight'
```

**Step 3: Export from package index**

In `packages/vue/src/index.ts`, add to the composables section:

```ts
export { useGlaceLight } from './composables'
```

**Step 4: Commit**

```bash
git add packages/vue/src/composables/useGlaceLight.ts packages/vue/src/composables/index.ts packages/vue/src/index.ts
git commit -m "feat(vue): add useGlaceLight composable"
```

---

### Task 9: Wire `useGlaceLight` into all 8 Vue components

**Files:**
- Modify: `packages/vue/src/components/GlaceCard.vue`
- Modify: `packages/vue/src/components/GlaceButton.vue`
- Modify: `packages/vue/src/components/GlaceInput.vue`
- Modify: `packages/vue/src/components/GlaceModal.vue`
- Modify: `packages/vue/src/components/GlaceBadge.vue`
- Modify: `packages/vue/src/components/GlaceNavbar.vue`
- Modify: `packages/vue/src/components/GlaceChatBubble.vue`
- Modify: `packages/vue/src/components/GlaceAvatar.vue`

In each component's `<script setup>`, add:

```ts
import { useGlaceLight } from '../composables'

// After rootRef is defined:
useGlaceLight(rootRef)
```

For components where the glass surface isn't the root element (GlaceInput uses field, GlaceModal uses content, GlaceChatBubble uses content), the ref should target the glass surface element instead:

- **GlaceInput**: `useGlaceLight(fieldRef)` where `fieldRef` is on the `<input>` element
- **GlaceModal**: `useGlaceLight(contentRef)` — already has `contentRef`
- **GlaceChatBubble**: `useGlaceLight(contentRef)` where `contentRef` is on `.glace-chat-bubble__content`

**Step 1: Wire useGlaceLight into all components**

**Step 2: Run all Vue tests**

Run: `pnpm --filter @glace-ui/vue test`
Expected: PASS

**Step 3: Run full build + typecheck**

Run: `pnpm build && pnpm typecheck`
Expected: PASS

**Step 4: Commit**

```bash
git add packages/vue/src/components/*.vue
git commit -m "feat(vue): wire useGlaceLight into all components"
```

---

### Task 10: Update color tokens for enhanced transparency

**Files:**
- Modify: `packages/core/src/tokens/colors.ts`

**Step 1: Update default color tokens**

Make backgrounds slightly more transparent to let the liquid glass effect show through more:

```ts
export const glaceColorTokens: GlaceColorTokens = {
  '--glace-bg': 'rgba(255, 255, 255, 0.08)',        // was 0.12
  '--glace-bg-hover': 'rgba(255, 255, 255, 0.14)',   // was 0.18
  '--glace-border': 'rgba(255, 255, 255, 0.15)',      // was 0.2
  '--glace-text-primary': 'rgba(255, 255, 255, 0.95)',
  '--glace-text-secondary': 'rgba(255, 255, 255, 0.7)',
  '--glace-shadow': '0 8px 32px rgba(0, 0, 0, 0.12)',
}

export const glaceColorTokensLight: GlaceColorTokens = {
  '--glace-bg': 'rgba(255, 255, 255, 0.55)',          // was 0.65
  '--glace-bg-hover': 'rgba(255, 255, 255, 0.7)',     // was 0.8
  '--glace-border': 'rgba(255, 255, 255, 0.4)',        // was 0.5
  '--glace-text-primary': 'rgba(0, 0, 0, 0.87)',
  '--glace-text-secondary': 'rgba(0, 0, 0, 0.6)',
  '--glace-shadow': '0 8px 32px rgba(0, 0, 0, 0.08)',
}

export const glaceColorTokensDark: GlaceColorTokens = {
  '--glace-bg': 'rgba(0, 0, 0, 0.25)',                // was 0.3
  '--glace-bg-hover': 'rgba(0, 0, 0, 0.35)',          // was 0.4
  '--glace-border': 'rgba(255, 255, 255, 0.12)',       // was 0.15
  '--glace-text-primary': 'rgba(255, 255, 255, 0.95)',
  '--glace-text-secondary': 'rgba(255, 255, 255, 0.7)',
  '--glace-shadow': '0 8px 32px rgba(0, 0, 0, 0.24)',
}
```

**Step 2: Run all tests**

Run: `pnpm test`
Expected: PASS — token tests check keys exist, not exact color values (except blur/border)

**Step 3: Commit**

```bash
git add packages/core/src/tokens/colors.ts
git commit -m "feat(core): update color tokens for enhanced liquid glass transparency"
```

---

### Task 11: Full build + typecheck + test verification

**Files:** None (verification only)

**Step 1: Full build**

Run: `pnpm build`
Expected: All packages build successfully

**Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: No errors

**Step 3: Full test suite**

Run: `pnpm test`
Expected: All tests pass

**Step 4: Lint**

Run: `pnpm lint`
Expected: No errors (fix any if found)

**Step 5: Commit any fixes**

If any fixes were needed, commit them:

```bash
git add -A
git commit -m "fix: resolve lint/typecheck issues from liquid glass migration"
```
