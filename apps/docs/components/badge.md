# GlaceBadge

A small label component for status indicators, tags, or counts with liquid glass styling.

## Import

```ts
import { GlaceBadge } from '@glace-ui/vue'
```

## Basic Usage

```vue
<template>
  <GlaceBadge variant="solid">New</GlaceBadge>
  <GlaceBadge variant="outline" removable @remove="onRemove">Tag</GlaceBadge>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'solid' \| 'outline' \| 'subtle'` | `'subtle'` | Visual style of the badge |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Size of the badge |
| `color` | `string` | `undefined` | Custom accent color |
| `removable` | `boolean` | `false` | Shows a remove/close button |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Badge label content |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `remove` | `void` | Emitted when the remove button is clicked |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.glace-badge` | Base badge class |
| `.glace-badge--solid` | Solid filled variant |
| `.glace-badge--outline` | Outline border variant |
| `.glace-badge--subtle` | Subtle background variant |
| `.glace-badge--xs` | Extra-small size |
| `.glace-badge--sm` | Small size |
| `.glace-badge--md` | Medium size |
| `.glace-badge--lg` | Large size |
| `.glace-badge__remove` | Remove button element |
