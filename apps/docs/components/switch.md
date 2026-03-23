# GlaceSwitch

A liquid glass toggle switch with two modes: **track mode** (single sliding thumb) and **pill mode** (dual-icon, auto-detected when both icon slots are provided).

## Import

```ts
import { GlaceSwitch } from '@glace-ui/vue'
```

## Basic Usage

```vue
<script setup>
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <!-- Track mode -->
  <GlaceSwitch v-model="enabled" label="Enable notifications" />

  <!-- Pill mode (auto-detected) -->
  <GlaceSwitch v-model="isDark">
    <template #unchecked-icon>🌙</template>
    <template #checked-icon>☀️</template>
  </GlaceSwitch>
</template>
```

## Props

| Prop          | Type                   | Default | Description                        |
| ------------- | ---------------------- | ------- | ---------------------------------- |
| `model-value` | `boolean`              | `false` | Bound value (v-model)              |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size of the switch                 |
| `label`       | `string`               | —       | Text label displayed beside switch |
| `disabled`    | `boolean`              | `false` | Disables the switch                |

## Slots

| Slot             | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| `default`        | Custom label content (overrides `label` prop)                     |
| `checked-icon`   | Icon shown when checked (provide both icon slots for pill mode)   |
| `unchecked-icon` | Icon shown when unchecked (provide both icon slots for pill mode) |

## Events

| Event                | Payload   | Description       |
| -------------------- | --------- | ----------------- |
| `update:model-value` | `boolean` | Emitted on toggle |

## Modes

### Track Mode (default)

A single thumb slides left/right within the track. Optionally shows an icon inside the thumb via the `checked-icon` or `unchecked-icon` slot.

### Pill Mode

Automatically activated when **both** `#checked-icon` and `#unchecked-icon` slots are provided. Both icons are always visible; the active icon gets a highlighted background while the inactive one fades. The specular hover effect is suppressed in this mode.

## CSS Classes

| Class                            | Description                         |
| -------------------------------- | ----------------------------------- |
| `.glace-switch`                  | Base wrapper (renders as `<label>`) |
| `.glace-switch--sm`              | Small size                          |
| `.glace-switch--md`              | Medium size                         |
| `.glace-switch--lg`              | Large size                          |
| `.glace-switch--checked`         | Applied when toggled on             |
| `.glace-switch--disabled`        | Disabled state                      |
| `.glace-switch--pill`            | Pill mode (dual-icon layout)        |
| `.glace-switch__input`           | Hidden native checkbox (accessible) |
| `.glace-switch__track`           | Visual track element                |
| `.glace-switch__thumb`           | Sliding thumb element               |
| `.glace-switch__thumb--active`   | Active icon thumb (pill mode)       |
| `.glace-switch__thumb--inactive` | Inactive icon thumb (pill mode)     |
| `.glace-switch__label`           | Text label beside the switch        |
