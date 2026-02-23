# GlaceCard

A glassmorphism card container with frosted-glass effect, configurable blur intensity, elevation, and hover interactions.

## Import

```ts
import { GlaceCard } from '@glace-ui/vue'
```

## Basic Usage

```vue
<template>
  <GlaceCard hoverable>
    <template #header>Card Title</template>
    Card body content goes here.
    <template #footer>Card footer</template>
  </GlaceCard>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blur-intensity` | `'subtle' \| 'medium' \| 'strong'` | `'medium'` | Controls the backdrop blur strength |
| `elevation` | `'flat' \| 'raised' \| 'floating'` | `'raised'` | Shadow depth of the card |
| `hoverable` | `boolean` | `false` | Enables hover lift and glow effect |
| `radius` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Border radius size |
| `as` | `string` | `'div'` | HTML element to render as |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Main body content of the card |
| `header` | Content rendered in the card header area |
| `footer` | Content rendered in the card footer area |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.glace-card` | Base card class |
| `.glace-card--hoverable` | Enables hover interactions |
| `.glace-card--flat` | Flat elevation (no shadow) |
| `.glace-card--raised` | Raised elevation (default shadow) |
| `.glace-card--floating` | Floating elevation (pronounced shadow) |
| `.glace-card--blur-subtle` | Subtle backdrop blur |
| `.glace-card--blur-strong` | Strong backdrop blur |
| `.glace-card--radius-sm` | Small border radius |
| `.glace-card--radius-lg` | Large border radius |
| `.glace-card--radius-full` | Full/pill border radius |
| `.glace-card__header` | Card header section |
| `.glace-card__body` | Card body section |
| `.glace-card__footer` | Card footer section |
