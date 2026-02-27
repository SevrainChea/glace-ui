# Liquid Glass UX Design

**Date**: 2026-02-27
**Status**: Approved

## Goal

Transform glace-ui's visual identity from standard glassmorphism to Apple-style Liquid Glass (WWDC 2025). Cross-browser CSS-only implementation with mouse-reactive specular highlights. Replace existing styles in-place (breaking visual change, same component API).

## Decisions

- **Aesthetic**: Apple Liquid Glass — specular highlights, edge light/shadow, depth tinting
- **Fidelity**: CSS-only cross-browser (no SVG feDisplacementMap). Works in all modern browsers.
- **Scope**: Replace existing 8 component styles. No new components or props.
- **Interactivity**: Mouse-reactive specular highlights via JS utility + Vue composable
- **Approach**: CSS pseudo-elements (::before for specular, ::after for edge tint)

## Token System

New tokens added to `@glace-ui/core`:

```
--glace-light-x: 30%              Light source X (updated by JS)
--glace-light-y: 20%              Light source Y (updated by JS)
--glace-specular-intensity: 0.4   Specular brightness (0-1)
--glace-specular-size: 60%        Specular gradient radius
--glace-tint: rgba(255,255,255,0.08)         Depth tint color
--glace-edge-light: rgba(255,255,255,0.25)   Bright edge highlight
--glace-edge-shadow: rgba(0,0,0,0.15)        Dark edge for depth
--glace-surface-roughness: 0.5    Controls blur mapping
```

Existing color tokens updated with slightly more transparent backgrounds to enhance the glass effect.

## CSS Architecture

Shared `glace-liquid-glass.css` defines `.glace-glass` utility:

- `::before` — radial-gradient specular highlight positioned at `--glace-light-x`/`--glace-light-y`
- `::after` — inset box-shadow for edge light + linear-gradient tint for depth
- Both use `pointer-events: none`, `z-index: 1`, `position: absolute`, `inset: 0`
- Component content gets `position: relative`, `z-index: 2`

Each component CSS file applies the pattern. Per-component variations:

- **GlaceButton**: active state scales specular
- **GlaceInput**: focus state brightens specular
- **GlaceModal**: enhanced backdrop blur
- **GlaceBadge**: smaller specular size
- **GlaceNavbar**: full-width specular gradient
- **GlaceChatBubble**: directional edge light based on alignment
- **GlaceAvatar**: circular specular gradient

## Light Tracking

### Core (`@glace-ui/core`)

```ts
function trackGlaceLight(
  element: HTMLElement,
  options?: { container?: HTMLElement; intensity?: number }
): () => void  // cleanup function
```

- Listens to `mousemove` on document (or scoped container)
- Calculates light position relative to element bounding box
- Sets `--glace-light-x` and `--glace-light-y` on element
- Uses `requestAnimationFrame` throttling
- Returns cleanup function

### Vue (`@glace-ui/vue`)

```ts
function useGlaceLight(
  elementRef: Ref<HTMLElement | null>,
  options?: { container?: HTMLElement; intensity?: number }
): void
```

- Wraps `trackGlaceLight` with `onMounted`/`onUnmounted` lifecycle
- Each component calls this internally with a template ref

### Fallback

Without JS, tokens fall back to defaults (30% 20% — top-left light source). Effect looks good statically.

## Testing

- Existing component tests unchanged (they test props/slots/events, not visuals)
- New unit tests for `trackGlaceLight` utility
- Manual visual testing via playground app

## References

- [Apple Liquid Glass overview](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
- [Liquid Glass CSS/SVG techniques (kube.io)](https://kube.io/blog/liquid-glass-css-svg/)
- [LogRocket Liquid Glass CSS tutorial](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/)
