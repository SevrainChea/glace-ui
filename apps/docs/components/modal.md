# GlaceModal

A dialog overlay with glassmorphism styling, supporting multiple sizes and accessible keyboard interactions.

## Import

```ts
import { GlaceModal } from '@glace-ui/vue'
```

## Basic Usage

```vue
<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<template>
  <GlaceButton @click="isOpen = true">Open Modal</GlaceButton>

  <GlaceModal v-model="isOpen" size="md" close-on-overlay>
    <template #header>Modal Title</template>
    Modal body content goes here.
    <template #footer>
      <GlaceButton variant="ghost" @click="isOpen = false">Cancel</GlaceButton>
      <GlaceButton variant="primary">Confirm</GlaceButton>
    </template>
  </GlaceModal>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model-value` | `boolean` | `false` | Controls modal visibility (use with `v-model`) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Width of the modal content |
| `close-on-overlay` | `boolean` | `true` | Closes the modal when the overlay is clicked |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Main body content of the modal |
| `header` | Content rendered in the modal header |
| `footer` | Content rendered in the modal footer |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when the modal open state changes |

## CSS Classes

| Class | Description |
|-------|-------------|
| `.glace-modal__overlay` | Full-screen backdrop overlay |
| `.glace-modal__content` | The modal content container |
| `.glace-modal__content--sm` | Small width modal |
| `.glace-modal__content--md` | Medium width modal |
| `.glace-modal__content--lg` | Large width modal |
| `.glace-modal__content--full` | Full-screen modal |
| `.glace-modal__header` | Modal header section |
| `.glace-modal__body` | Modal body section |
| `.glace-modal__footer` | Modal footer section |
| `.glace-modal__close` | Close button element |
