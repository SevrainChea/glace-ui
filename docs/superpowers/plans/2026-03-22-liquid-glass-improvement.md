# Liquid Glass Effect Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the liquid glass refraction and specular lighting by upgrading to a dual-stage SVG displacement filter and converting the specular highlight to always-on ambient + hover-boost.

**Architecture:** Three files change in dependency order — tokens first (new CSS custom properties), then CSS (references new tokens + updated specular logic), then the SVG filter utility (dual-stage displacement pipeline). No Vue component changes; all components inherit through `.glace-glass`.

**Tech Stack:** TypeScript, CSS custom properties, SVG filters (feDisplacementMap, feGaussianBlur), Vitest, pnpm monorepo

---

## File Map

| File                                           | Change                                                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `packages/core/src/tokens/light.ts`            | Add 3 new tokens to interface + all presets; bump `--glace-edge-light` default                                    |
| `packages/core/src/css/glace-liquid-glass.css` | Always-on specular with `min()` clamp; new `--glace-edge-light-left` in `::after`; stronger saturation/brightness |
| `packages/core/src/utils/filters.ts`           | Dual-stage SVG filter: rim distortion → edge lens in series; update filter attributes                             |
| `packages/core/src/__tests__/tokens.test.ts`   | Assert three new tokens at default values                                                                         |

---

## Task 1: Add new tokens to `light.ts`

**Files:**

- Modify: `packages/core/src/tokens/light.ts`
- Test: `packages/core/src/__tests__/tokens.test.ts`

- [ ] **Step 1: Write failing tests for the three new tokens and update the bumped token assertion**

Open `packages/core/src/__tests__/tokens.test.ts`. Find the existing assertion for `--glace-edge-light` (currently `'rgba(255, 255, 255, 0.48)'`) and update it to the new value:

```ts
// update existing:
expect(glaceLightTokens['--glace-edge-light']).toBe('rgba(255, 255, 255, 0.72)')
```

Then add three new assertions for the new tokens:

```ts
expect(glaceLightTokens['--glace-specular-ambient']).toBe('0.18')
expect(glaceLightTokens['--glace-specular-hover-boost']).toBe('0.14')
expect(glaceLightTokens['--glace-edge-light-left']).toBe('rgba(255, 255, 255, 0.18)')
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm --filter @glace-ui/core exec vitest run src/__tests__/tokens.test.ts
```

Expected: TypeScript error or test failure — the new property keys don't exist yet.

- [ ] **Step 3: Update `GlaceLightTokens` interface**

In `packages/core/src/tokens/light.ts`, add three new required keys to the `GlaceLightTokens` interface (type `string`):

```ts
'--glace-specular-ambient': string
'--glace-specular-hover-boost': string
'--glace-edge-light-left': string
```

- [ ] **Step 4: Update `glaceLightTokens` (default preset)**

Add to the `glaceLightTokens` object:

```ts
'--glace-specular-ambient': '0.18',
'--glace-specular-hover-boost': '0.14',
'--glace-edge-light-left': 'rgba(255, 255, 255, 0.18)',
```

Also bump the existing `--glace-edge-light` entry from `'rgba(255, 255, 255, 0.48)'` to `'rgba(255, 255, 255, 0.72)'`.

- [ ] **Step 5: Update `glaceLightTokensLight` (light partial)**

Add:

```ts
'--glace-specular-ambient': '0.22',
'--glace-specular-hover-boost': '0.14',
'--glace-edge-light-left': 'rgba(255, 255, 255, 0.22)',
```

Remove the existing `'--glace-edge-light': 'rgba(255, 255, 255, 0.55)'` entry — light now inherits `0.72` from the default.

- [ ] **Step 6: Update `glaceLightTokensDark` (dark partial)**

Add:

```ts
'--glace-specular-ambient': '0.12',
'--glace-specular-hover-boost': '0.14',
'--glace-edge-light-left': 'rgba(255, 255, 255, 0.12)',
```

The existing `'--glace-edge-light': 'rgba(255, 255, 255, 0.28)'` entry stays unchanged.

- [ ] **Step 7: Run tests to confirm they pass**

```bash
pnpm --filter @glace-ui/core exec vitest run src/__tests__/tokens.test.ts
```

Expected: all tests pass including the three new assertions.

- [ ] **Step 8: Run typecheck**

```bash
pnpm --filter @glace-ui/core typecheck
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add packages/core/src/tokens/light.ts packages/core/src/__tests__/tokens.test.ts
git commit -m "feat(core): add specular-ambient, specular-hover-boost, edge-light-left tokens"
```

---

## Task 2: Update CSS in `glace-liquid-glass.css`

**Files:**

- Modify: `packages/core/src/css/glace-liquid-glass.css`

No unit tests for CSS — validate visually in the playground (Task 4).

- [ ] **Step 1: Replace the `::before` specular opacity rules**

In `packages/core/src/css/glace-liquid-glass.css`, find and replace these two rules:

```css
/* REMOVE: */
.glace-glass::before {
  ...
  opacity: 0;
  ...
}

.glace-glass.is-lit::before {
  opacity: var(--glace-hover-enabled, 1);
}
```

The `::before` rule already has other properties (`content`, `position`, `inset`, etc.) — only change the `opacity` line. Set it to:

```css
opacity: var(--glace-specular-ambient);
```

Replace the `.glace-glass.is-lit::before` rule body with:

```css
.glace-glass.is-lit::before {
  opacity: min(
    1,
    calc(
      var(--glace-specular-ambient) + var(--glace-specular-hover-boost) *
        var(--glace-hover-enabled, 1)
    )
  );
}
```

- [ ] **Step 2: Update the `::after` box-shadow**

In the `.glace-glass::after` rule, find the `box-shadow` declaration:

```css
/* current: */
box-shadow:
  inset 0 1px 0 var(--glace-edge-light),
  inset 0 -1px 0 var(--glace-edge-shadow);
```

Replace with:

```css
box-shadow:
  inset 0 1px 0 var(--glace-edge-light),
  inset 1px 0 0 var(--glace-edge-light-left),
  inset 0 -1px 0 var(--glace-edge-shadow);
```

- [ ] **Step 3: Upgrade the `@supports` backdrop-filter value**

Find the `@supports (backdrop-filter: url(#test))` block. The current value is:

```css
--glace-backdrop-filter: url(#glace-refraction) blur(var(--glace-backdrop-blur)) saturate(1.3)
  brightness(1.05);
```

Change to:

```css
--glace-backdrop-filter: url(#glace-refraction) blur(var(--glace-backdrop-blur)) saturate(1.4)
  brightness(1.08);
```

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/css/glace-liquid-glass.css
git commit -m "feat(core): always-on ambient specular, stronger edge highlight and filter chain"
```

---

## Task 3: Upgrade SVG filter in `filters.ts`

**Files:**

- Modify: `packages/core/src/utils/filters.ts`

- [ ] **Step 1: Update filter element attributes**

In `packages/core/src/utils/filters.ts`, find the block that sets attributes on `filter`. Change:

```ts
filter.setAttribute('filterUnits', 'objectBoundingBox')
filter.setAttribute('primitiveUnits', 'objectBoundingBox') // change this line
filter.setAttribute('x', '-5%') // change
filter.setAttribute('y', '-5%') // change
filter.setAttribute('width', '110%') // change
filter.setAttribute('height', '110%') // change
```

To:

```ts
filter.setAttribute('filterUnits', 'objectBoundingBox')
filter.setAttribute('primitiveUnits', 'userSpaceOnUse')
filter.setAttribute('x', '-8%')
filter.setAttribute('y', '-8%')
filter.setAttribute('width', '116%')
filter.setAttribute('height', '116%')
```

- [ ] **Step 2: Update `feImage` dimensions**

Find the `feImage` attribute block. Change `width="1" height="1"` to `width="100%" height="100%"` (unit-fractions worked under `objectBoundingBox` but would collapse to 1px under `userSpaceOnUse`):

```ts
feImage.setAttribute('width', '100%')
feImage.setAttribute('height', '100%')
```

Leave `x="0"`, `y="0"`, `href`, `result`, and `preserveAspectRatio` unchanged.

- [ ] **Step 3: Add `result="rimDisplaced"` to the existing `feDisplacementMap`**

Find the existing `feDisp` element setup. The current code has no `result` attribute. Add:

```ts
feDisp.setAttribute('result', 'rimDisplaced')
```

Also update `scale` from `'0.10'` to `'0.18'`:

```ts
feDisp.setAttribute('scale', '0.18')
```

- [ ] **Step 4: Create and append the Stage 2 elements**

After `filter.appendChild(feImage)` and `filter.appendChild(feDisp)` (Stage 1), add the Stage 2 primitives:

```ts
// Stage 2: edge-lens displacement via blurred alpha halo
const feBlur = d.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')
feBlur.setAttribute('in', 'SourceAlpha')
feBlur.setAttribute('stdDeviation', '20')
feBlur.setAttribute('result', 'alphaHalo')

const feDisp2 = d.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
feDisp2.setAttribute('in', 'rimDisplaced')
feDisp2.setAttribute('in2', 'alphaHalo')
feDisp2.setAttribute('scale', '0.06')
feDisp2.setAttribute('xChannelSelector', 'A')
feDisp2.setAttribute('yChannelSelector', 'A')

filter.appendChild(feBlur)
filter.appendChild(feDisp2)
```

The full primitive order inside `filter` must be:

1. `feImage` (dispMap)
2. `feDisp` (rimDisplaced) — Stage 1
3. `feBlur` (alphaHalo) — Stage 2 input
4. `feDisp2` — Stage 2 output (final)

- [ ] **Step 5: Run typecheck**

```bash
pnpm --filter @glace-ui/core typecheck
```

Expected: no errors (the changes are all attribute strings, no type-sensitive work).

- [ ] **Step 6: Build core**

```bash
pnpm --filter @glace-ui/core build
```

Expected: clean build, no errors.

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/utils/filters.ts
git commit -m "feat(core): dual-stage SVG refraction — rim distortion + edge lens"
```

---

## Task 4: Visual verification in playground

**Files:**

- No changes — read-only verification

- [ ] **Step 1: Start the playground**

```bash
pnpm --filter @glace-ui/playground dev
```

Open in browser. Select backgrounds in order: Forest (photo), Light gradient, Dark gradient.

- [ ] **Step 2: Verify ambient specular (always-on)**

Without hovering over anything, confirm every `.glace-glass` component shows a faint radial gleam at top-left. Opacity should be subtle but visible.

- [ ] **Step 3: Verify hover boost**

Hover over a GlaceCard. The radial gleam should brighten noticeably. Move away — it should return to ambient level (not disappear).

- [ ] **Step 4: Verify GlaceSwitch pill mode**

Find the GlaceSwitch with pill mode (both checked/unchecked icon slots). Confirm the ambient gleam is visible at rest. There should be NO hover boost (pill mode sets `--glace-hover-enabled: 0`). This is the intentional behavioral change — previously it had zero specular at rest.

- [ ] **Step 5: Verify edge highlight**

On a GlaceCard, confirm the top-left corner area shows a slightly brighter edge than top-right (left-edge `--glace-edge-light-left` token). The top highlight should be stronger than before (`0.72` vs old `0.48`).

- [ ] **Step 6: Verify refraction (Chrome only)**

In Chrome, on the forest (photo) background, look at the edges of GlaceCard. The background image should show visible distortion — a soft bending at the component perimeter (edge lens) on top of the rim distortion ring. In Safari/Firefox, only the plain blur fallback renders — confirm no artifacts.

- [ ] **Step 7: Run full test suite**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 8: Final commit if any tweaks were made**

If visual inspection prompted any token value adjustments, commit them now with:

```bash
git commit -m "fix(core): tune liquid glass token values after visual review"
```
