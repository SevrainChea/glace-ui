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

Upgrade from single-stage to two-stage displacement:

**Stage 1 — Rim distortion (existing, strengthened):**
- Canvas-generated 256×256 bell-curve displacement map (peak at r≈0.85)
- `feImage` → `feDisplacementMap` using R/G channels
- Scale bumped from `0.10` → `0.18`

**Stage 2 — Edge lens (new):**
- `feGaussianBlur` on `SourceAlpha` with `stdDeviation="0.35"` (objectBoundingBox units)
- Second `feDisplacementMap` using the blurred alpha on both X and Y channels at `scale="0.06"`
- Creates soft background bending around the component perimeter

**Compositing:**
- Both displacement outputs merged via `feBlend mode="screen"`
- Filter region expanded to `-8% / 116%` to prevent edge clipping

### 2. CSS Changes (`packages/core/src/css/glace-liquid-glass.css`)

**Always-on specular (`::before`):**

```css
/* Remove opacity: 0 default and .is-lit rule. Replace with: */
.glace-glass::before {
  opacity: var(--glace-specular-ambient);
}
.glace-glass.is-lit::before {
  opacity: calc(var(--glace-specular-ambient) + var(--glace-specular-hover-boost) * var(--glace-hover-enabled, 1));
}
```

The ambient gleam is always visible. `--glace-hover-enabled: 0` (e.g. pill switch mode) suppresses the hover boost but retains the ambient gleam.

**Stronger edge highlight (`::after` box-shadow):**

```css
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.72),   /* top highlight — up from 0.48 */
  inset 1px 0 0 rgba(255, 255, 255, 0.18),   /* new: left edge gleam */
  inset 0 -1px 0 var(--glace-edge-shadow);
```

**Filter chain (`@supports` block):**

```css
--glace-backdrop-filter: url(#glace-refraction) blur(var(--glace-backdrop-blur)) saturate(1.4) brightness(1.08);
```
Up from `saturate(1.3) brightness(1.05)`.

### 3. Token Changes (`packages/core/src/tokens/light.ts`)

Two new tokens added to `GlaceLightTokens` interface and all three presets:

| Token | Default | Light | Dark |
|---|---|---|---|
| `--glace-specular-ambient` | `0.18` | `0.22` | `0.12` |
| `--glace-specular-hover-boost` | `0.14` | `0.14` | `0.14` |

The `--glace-specular-intensity` token (used as radial gradient opacity) is unchanged — it controls the gradient stop, while `--glace-specular-ambient` controls the layer opacity.

---

## Files Changed

| File | Change |
|---|---|
| `packages/core/src/utils/filters.ts` | Dual-stage SVG filter (rim + edge-lens), expanded filter region |
| `packages/core/src/css/glace-liquid-glass.css` | Always-on specular, stronger edge highlight, saturation/brightness boost |
| `packages/core/src/tokens/light.ts` | `--glace-specular-ambient` and `--glace-specular-hover-boost` tokens |

No other files require changes. All 9 component CSS files inherit the improvements automatically through `.glace-glass`.

---

## Testing

- Visual regression: playground with forest/light/light-gradient backgrounds (refraction most visible on photo backgrounds)
- Verify `--glace-hover-enabled: 0` (GlaceSwitch pill mode) still suppresses hover boost but retains ambient gleam
- Verify nested glass components (`.glace-card .glace-button`) are unaffected — they have `backdrop-filter: none` so the filter chain change is irrelevant for them
- Chrome only for refraction (SVG in backdrop-filter); Safari/Firefox fall back to plain blur gracefully
