# GlaceButton

An interactive button with liquid glass styling, supporting loading states and multiple visual variants.

## Import

```ts
import { GlaceButton } from '@glace-ui/vue'
```

## Basic Usage

```vue
<template>
  <GlaceButton variant="solid" @click="handleClick"> Click Me </GlaceButton>
  <GlaceButton variant="ghost" loading>Processing...</GlaceButton>
</template>
```

## Props

| Prop           | Type                                          | Default    | Description                                   |
| -------------- | --------------------------------------------- | ---------- | --------------------------------------------- |
| `variant`      | `'solid' \| 'subtle' \| 'outline' \| 'ghost'` | `'subtle'` | Visual style of the button                    |
| `color`        | `string`                                      | —          | Accent color (applied as CSS custom property) |
| `size`         | `'sm' \| 'md' \| 'lg'`                        | `'md'`     | Size of the button                            |
| `loading`      | `boolean`                                     | `false`    | Shows a spinner and disables interaction      |
| `disabled`     | `boolean`                                     | `false`    | Disables the button                           |
| `as`           | `string`                                      | `'button'` | HTML element to render as (e.g. `'a'`)        |
| `hover-effect` | `boolean`                                     | `true`     | Enable/disable the specular hover effect      |

## Slots

| Slot      | Description          |
| --------- | -------------------- |
| `default` | Button label content |

## CSS Classes

| Class                    | Description                               |
| ------------------------ | ----------------------------------------- |
| `.glace-button`          | Base button class                         |
| `.glace-button--solid`   | Solid variant with accent styling         |
| `.glace-button--subtle`  | Subtle variant (default)                  |
| `.glace-button--outline` | Outline variant with border only          |
| `.glace-button--ghost`   | Ghost variant with transparent background |
| `.glace-button--sm`      | Small size                                |
| `.glace-button--md`      | Medium size                               |
| `.glace-button--lg`      | Large size                                |
| `.glace-button__spinner` | Loading spinner element                   |
