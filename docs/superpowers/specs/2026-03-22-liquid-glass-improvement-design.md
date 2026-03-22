# Liquid Glass Effect Improvement

**Date:** 2026-03-22
**Status:** Approved
**Scope:** `@glace-ui/core` only — no Vue component changes

---

## Problem

The current liquid glass effect is visually underpowered in two areas:

1. **Refraction / distortion** — the SVG displacement filter creates a single rim-distortion ring but lacks the soft "liquid boundary" bending that makes glass feel alive. Scale is too subtle (`0.10`).
2. **Lighting / specular** — the specular highlight only appears on hover (opacity 0 at rest), leaving components looking flat when not interacted with. Edge highlight strength is moderate.

## Goals

- Make refraction more convincing by combining rim distortion with edge-lens displacement
- Make components feel lit at rest via an always-on ambient specular gleam
- Increase saturation/brightness in the filter chain to make refracted color more vivid
- Strengthen top/left edge highlight to match "lit from top-left" physical glass quality

## Non-Goals

- No changes to component opacity / background color (`--glace-bg`)
- No restructuring of component CSS files or z-index layers
- No new CSS files or Vue components

---

## Design

### 1. Dual-Stage SVG Filter (`packages/core/src/utils/filters.ts`)

Two displacement passes chained **in series** — the output of Stage 1 feeds Stage 2:

**Stage 1 — Rim distortion (existing, strengthened):**
- Canvas-generated 256×256 bell-curve displacement map (peak at r≈0.85)
- `feImage` → `feDisplacementMap` using R/G channels; bump scale `0.10` → `0.18` and **add `result="rimDisplaced"`** (the existing element at `filters.ts:93` has no `result` attribute — it must be added for Stage 2 to reference it)

**Stage 2 — Edge lens (new):**
- `feGaussianBlur(in="SourceAlpha", stdDeviation="20", result="alphaHalo")` — blurs the original element's alpha channel with a fixed 20px radius
- The current filter element has `primitiveUnits="objectBoundingBox"` — this **must be changed to `userSpaceOnUse"`** so stdDeviation is in pixels rather than a percentage of the bounding box (prevents over-blurring on small components like GlaceSwitch)
- Second `feDisplacementMap(in="rimDisplaced", in2="alphaHalo", xChannelSelector="A", yChannelSelector="A", scale="0.06")`
- Adds soft background bending around the component perimeter on top of the rim distortion

**Full primitive pipeline (in order):**
```
1. feImage(href=dataUrl, x="0", y="0", width="100%", height="100%", result="dispMap")
2. feDisplacementMap(in="SourceGraphic", in2="dispMap", xChannelSelector="R", yChannelSelector="G", scale="0.18", result="rimDisplaced")
3. feGaussianBlur(in="SourceAlpha", stdDeviation="20", result="alphaHalo")
4. feDisplacementMap(in="rimDisplaced", in2="alphaHalo", xChannelSelector="A", yChannelSelector="A", scale="0.06")
```

Note: `feImage` must use `width="100%" height="100%"` (not `width="1" height="1"`) — the existing code uses unit-fractions that worked under `objectBoundingBox` but would collapse to 1×1px under `userSpaceOnUse`. Percentages resolve correctly in both modes.

**Filter region:**
- Expand to `x="-8%" y="-8%" width="116%" height="116%"` to prevent edge clipping at higher displacement scale.
- `filterUnits="objectBoundingBox"`, `primitiveUnits="userSpaceOnUse"` (override from current `objectBoundingBox`).

### 2. CSS Changes (`packages/core/src/css/glace-liquid-glass.css`)

**Always-on specular (`::before`):**

Remove `opacity: 0` default and the `.is-lit` rule. Replace with:

```css
.glace-glass::before {
  opacity: var(--glace-specular-ambient);
}
.glace-glass.is-lit::before {
  opacity: min(1, calc(var(--glace-specular-ambient) + var(--glace-specular-hover-boost) * var(--glace-hover-enabled, 1)));
}
```

- Ambient gleam always visible at `--glace-specular-ambient`
- On hover, brightens by `--glace-specular-hover-boost`; `min(1, ...)` prevents overflow past full opacity
- `--glace-hover-enabled: 0` (pill switch mode) suppresses the hover boost but **retains the ambient gleam** — this is a deliberate behavioral change from the current implementation where `opacity: var(--glace-hover-enabled, 1)` caused full suppression at rest

**Stronger edge highlight (`::after` box-shadow):**

```css
box-shadow:
  inset 0 1px 0 var(--glace-edge-light),
  inset 1px 0 0 var(--glace-edge-light-left),
  inset 0 -1px 0 var(--glace-edge-shadow);
```

The existing `--glace-edge-light` token is kept and its default bumped (see tokens section). A new `--glace-edge-light-left` token handles the left-edge gleam — no hardcoded values.

**Filter chain (`@supports` block):**

```css
--glace-backdrop-filter: url(#glace-refraction) blur(var(--glace-backdrop-blur)) saturate(1.4) brightness(1.08);
```
Up from `saturate(1.3) brightness(1.05)`.

### 3. Token Changes (`packages/core/src/tokens/light.ts`)

**New tokens** added to `GlaceLightTokens` interface as **required keys of type `string`**, following the existing pattern (all token values are strings, e.g. `'0.18'` not `0.18`). All three presets must include them (`glaceLightTokens` as required; `glaceLightTokensLight` and `glaceLightTokensDark` as `Partial<GlaceLightTokens>` overrides):

| Token | Default | Light | Dark |
|---|---|---|---|
| `--glace-specular-ambient` | `0.18` | `0.22` | `0.12` |
| `--glace-specular-hover-boost` | `0.14` | `0.14` | `0.14` |
| `--glace-edge-light-left` | `rgba(255, 255, 255, 0.18)` | `rgba(255, 255, 255, 0.22)` | `rgba(255, 255, 255, 0.12)` |

**Updated token defaults** (existing tokens, values bumped):

| Token | Old default | New default | Light | Dark |
|---|---|---|---|---|
| `--glace-edge-light` | `rgba(255, 255, 255, 0.48)` | `rgba(255, 255, 255, 0.72)` | Remove the `0.55` entry from `glaceLightTokensLight` — Light inherits `0.72` from default | `rgba(255, 255, 255, 0.28)` |

The `--glace-specular-intensity` token (controls the radial gradient stop opacity) is unchanged.

---

## Files Changed

| File | Change |
|---|---|
| `packages/core/src/utils/filters.ts` | Dual-stage SVG filter: rim distortion → edge lens in series; expanded filter region |
| `packages/core/src/css/glace-liquid-glass.css` | Always-on specular with `min()` clamp, `--glace-edge-light-left` token reference, saturation/brightness boost |
| `packages/core/src/tokens/light.ts` | Three new tokens + updated `--glace-edge-light` default across all three presets |

No other files require changes. All 9 component CSS files inherit the improvements automatically through `.glace-glass`.

---

## Testing

- **Visual regression:** playground with forest/light/light-gradient backgrounds (refraction most visible on photo backgrounds)
- **Small component check:** verify edge-lens displacement on GlaceSwitch, GlaceBadge, GlaceAvatar — the `stdDeviation="20"` (bare number, no unit) in userSpaceOnUse is fixed pixels and should not over-blur on narrow elements
- **Behavioral change — `--glace-hover-enabled: 0`:** GlaceSwitch pill mode previously showed zero specular at rest; it will now show the ambient gleam (`--glace-specular-ambient`). Confirm this is intentional and visually acceptable.
- **Nested glass:** `.glace-card .glace-button` has `backdrop-filter: none` — filter chain change is irrelevant for nested components; no visual regression expected
- **Token unit test:** extend `tokens.test.ts` to assert the three new tokens (`--glace-specular-ambient`, `--glace-specular-hover-boost`, `--glace-edge-light-left`) at their default values in `glaceLightTokens` using string form, e.g. `expect(glaceLightTokens['--glace-specular-ambient']).toBe('0.18')`
- **Fallback:** Safari/Firefox have no `backdrop-filter: url(...)` support — confirm plain `blur()` fallback still renders cleanly with no displacement artifacts
