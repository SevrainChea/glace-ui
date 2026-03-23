# GlaceSelect

A liquid glass dropdown select with keyboard navigation, teleported dropdown, and accessibility support.

## Import

```ts
import { GlaceSelect } from '@glace-ui/vue'
```

## Basic Usage

```vue
<script setup>
import { ref } from 'vue'

const value = ref(null)
const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]
</script>

<template>
  <GlaceSelect v-model="value" :options="options" placeholder="Pick a fruit" />
</template>
```

## Props

| Prop          | Type                       | Default              | Description                           |
| ------------- | -------------------------- | -------------------- | ------------------------------------- |
| `model-value` | `string \| number \| null` | `null`               | Bound value (v-model)                 |
| `options`     | `GlaceSelectOption[]`      | `[]`                 | Array of selectable options           |
| `placeholder` | `string`                   | `'Select an option'` | Placeholder when no value is selected |
| `disabled`    | `boolean`                  | `false`              | Disables the select                   |
| `error`       | `string`                   | `undefined`          | Error message (shows error state)     |

### GlaceSelectOption

| Property   | Type               | Required | Description       |
| ---------- | ------------------ | -------- | ----------------- |
| `label`    | `string`           | Yes      | Display text      |
| `value`    | `string \| number` | Yes      | Emitted value     |
| `disabled` | `boolean`          | No       | Prevent selection |

## Slots

| Slot      | Scoped Props                                                        | Description             |
| --------- | ------------------------------------------------------------------- | ----------------------- |
| `trigger` | `{ selected: GlaceSelectOption \| null, placeholder: string }`      | Custom trigger content  |
| `option`  | `{ option: GlaceSelectOption, selected: boolean, active: boolean }` | Custom option rendering |

## Events

| Event                | Payload                    | Description          |
| -------------------- | -------------------------- | -------------------- |
| `update:model-value` | `string \| number \| null` | Emitted on selection |

## Keyboard Navigation

| Key                             | Action                                 |
| ------------------------------- | -------------------------------------- |
| `Enter` / `Space` / `ArrowDown` | Open dropdown (when closed)            |
| `ArrowDown`                     | Move to next enabled option            |
| `ArrowUp`                       | Move to previous enabled option        |
| `Enter` / `Space`               | Select active option (when open)       |
| `Escape`                        | Close dropdown                         |
| `Tab`                           | Close dropdown without restoring focus |

## CSS Classes

| Class                             | Description                   |
| --------------------------------- | ----------------------------- |
| `.glace-select`                   | Base wrapper class            |
| `.glace-select--open`             | Applied when dropdown is open |
| `.glace-select--error`            | Error state styling           |
| `.glace-select--disabled`         | Disabled state styling        |
| `.glace-select__trigger`          | Clickable trigger element     |
| `.glace-select__value`            | Selected value text           |
| `.glace-select__placeholder`      | Placeholder text              |
| `.glace-select__chevron`          | Dropdown arrow indicator      |
| `.glace-select__error-text`       | Error message text            |
| `.glace-select__dropdown`         | Teleported dropdown panel     |
| `.glace-select__option`           | Individual option item        |
| `.glace-select__option--selected` | Currently selected option     |
| `.glace-select__option--active`   | Keyboard-focused option       |
| `.glace-select__option--disabled` | Disabled option               |
