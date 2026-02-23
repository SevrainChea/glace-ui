# GlaceAvatar

A circular avatar component with glassmorphism styling, supporting images, fallback initials, and online status indicators.

## Import

```ts
import { GlaceAvatar } from '@glace-ui/vue'
```

## Basic Usage

```vue
<template>
  <GlaceAvatar src="/photo.jpg" alt="Jane Doe" size="lg" status="online" />

  <GlaceAvatar size="md" status="busy">
    <template #fallback>JD</template>
  </GlaceAvatar>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `undefined` | Image URL for the avatar |
| `alt` | `string` | `''` | Alt text for the avatar image |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the avatar |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | `undefined` | Status indicator dot |

## Slots

| Slot | Description |
|------|-------------|
| `fallback` | Content shown when no `src` is provided (e.g. initials) |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.glace-avatar` | Base avatar class |
| `.glace-avatar--sm` | Small size |
| `.glace-avatar--md` | Medium size |
| `.glace-avatar--lg` | Large size |
| `.glace-avatar--xl` | Extra-large size |
| `.glace-avatar__image` | The `<img>` element |
| `.glace-avatar__fallback` | Fallback content container |
| `.glace-avatar__status` | Status indicator dot |
| `.glace-avatar__status--online` | Green online indicator |
| `.glace-avatar__status--offline` | Gray offline indicator |
| `.glace-avatar__status--busy` | Red busy indicator |
| `.glace-avatar__status--away` | Yellow away indicator |
