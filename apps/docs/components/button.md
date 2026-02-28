# GlaceButton

An interactive button with liquid glass styling, supporting loading states and multiple visual variants.

## Import

```ts
import { GlaceButton } from '@glace-ui/vue'
```

## Basic Usage

```vue
<template>
  <GlaceButton variant="primary" @click="handleClick">
    Click Me
  </GlaceButton>
  <GlaceButton variant="ghost" loading>Processing...</GlaceButton>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Visual style of the button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the button |
| `loading` | `boolean` | `false` | Shows a spinner and disables interaction |
| `disabled` | `boolean` | `false` | Disables the button |
| `as` | `string` | `'button'` | HTML element to render as (e.g. `'a'`) |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Button label content |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.glace-button` | Base button class |
| `.glace-button--primary` | Primary variant with accent styling |
| `.glace-button--secondary` | Secondary variant with muted styling |
| `.glace-button--ghost` | Ghost variant with transparent background |
| `.glace-button--sm` | Small size |
| `.glace-button--md` | Medium size |
| `.glace-button--lg` | Large size |
| `.glace-button__spinner` | Loading spinner element |
