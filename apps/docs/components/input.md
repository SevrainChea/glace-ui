# GlaceInput

A text input field with liquid glass styling, supporting icons, suffixes, and error states.

## Import

```ts
import { GlaceInput } from '@glace-ui/vue'
```

## Basic Usage

```vue
<template>
  <GlaceInput v-model="value" placeholder="Enter text..." />
  <GlaceInput v-model="email" type="email" error="Invalid email address">
    <template #icon>@</template>
  </GlaceInput>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model-value` | `string` | `''` | Bound input value (use with `v-model`) |
| `type` | `string` | `'text'` | HTML input type attribute |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the input |
| `error` | `string` | `undefined` | Error message to display below the input |

## Slots

| Slot | Description |
|------|-------------|
| `icon` | Leading icon content inside the input |
| `suffix` | Trailing content inside the input |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.glace-input` | Base input wrapper class |
| `.glace-input--error` | Error state styling |
| `.glace-input--disabled` | Disabled state styling |
| `.glace-input--has-icon` | Applied when the icon slot is used |
| `.glace-input--has-suffix` | Applied when the suffix slot is used |
| `.glace-input__field` | The actual `<input>` element |
| `.glace-input__icon` | Leading icon container |
| `.glace-input__suffix` | Trailing suffix container |
| `.glace-input__error-text` | Error message text element |
