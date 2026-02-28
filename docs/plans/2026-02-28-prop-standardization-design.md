# Prop Standardization Design

**Date:** 2026-02-28

## Problem

Props across the 8 components were inconsistent:
- `blurIntensity` existed only on GlaceCard despite all components using `backdrop-filter`
- `variant` meant three different things: visual style (Badge), hierarchy (Button), and direction (ChatBubble)
- `size` used different scales per component with no shared token set

## Decisions

### 1. Shared canonical union types

Three named types exported from `types.ts` that all component interfaces draw from:

```ts
export type GlaceVariant = 'solid' | 'outline' | 'ghost' | 'subtle'
export type GlaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type GlaceBlurIntensity = 'subtle' | 'medium' | 'strong'
```

Component interfaces use `Extract<GlaceSize, ...>` for subsets — no manual duplication of string literals.

### 2. `variant` = appearance only

`variant` maps to visual appearance (`solid | outline | ghost | subtle`) uniformly across all components that support it. It does not encode hierarchy or intent — that is left to `color`.

Button drops `primary | secondary` in favour of this model.

### 3. `color` = intent / accent

A `color` prop (string, CSS custom property value) handles accent colour and communicates intent. Added to Button and Badge.

### 4. `blurIntensity` = container components only

Only Card, Navbar, and Modal expose `blurIntensity`. Content components (Button, Badge, Input, Avatar, ChatBubble) have blur baked into their design tokens and it is not user-controllable.

### 5. `direction` replaces `variant` on GlaceChatBubble

`variant` on ChatBubble encoded message direction, not visual style. Renamed to `direction: 'sent' | 'received'` for clarity.

### 6. Canonical size scale via `Extract`

`GlaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'` is the canonical set. Each component exposes only the subset it supports using `Extract`.

## Component Contracts

### Container components

| Component | blurIntensity | size | variant | color | other |
|---|---|---|---|---|---|
| GlaceCard | `GlaceBlurIntensity` | — | — | — | elevation, radius, as |
| GlaceNavbar | `GlaceBlurIntensity` | — | — | — | sticky, blurOnScroll, transparent |
| GlaceModal | `GlaceBlurIntensity` | `sm\|md\|lg\|full` | — | — | modelValue, closeOnOverlay |

### Content components

| Component | size | variant | color | other |
|---|---|---|---|---|
| GlaceButton | `sm\|md\|lg` | `GlaceVariant` | `string` | loading, disabled, as, hoverEffect |
| GlaceBadge | `xs\|sm\|md\|lg` | `GlaceVariant` | `string` | removable |
| GlaceAvatar | `sm\|md\|lg\|xl` | — | — | src, alt, status |
| GlaceInput | — | — | — | modelValue, type, placeholder, disabled, error |
| GlaceChatBubble | — | — | — | direction, timestamp |

## Breaking Changes

| Component | Change |
|---|---|
| GlaceButton | `variant` values change: `primary\|secondary\|ghost` → `solid\|outline\|ghost\|subtle` |
| GlaceChatBubble | `variant` prop renamed to `direction` |

All other changes are additive (new props: `blurIntensity` on Navbar/Modal, `color` on Button/Badge).
