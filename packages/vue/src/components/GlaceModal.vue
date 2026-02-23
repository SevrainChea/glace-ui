<script setup lang="ts">
/**
 * A glassmorphism modal dialog with focus trap, Escape key, and overlay click.
 *
 * @example
 * ```vue
 * <GlaceModal v-model="showModal" size="md" close-on-overlay>
 *   <template #header>Confirm</template>
 *   Are you sure?
 *   <template #footer><GlaceButton @click="showModal = false">OK</GlaceButton></template>
 * </GlaceModal>
 * ```
 */

import { ref, watch, nextTick, onUnmounted, useSlots } from 'vue'
import type { GlaceModalProps } from './types'

const props = withDefaults(defineProps<GlaceModalProps>(), {
  size: 'md',
  closeOnOverlay: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const slots = useSlots()
const contentRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:modelValue', false)
}

function onOverlayClick(event: MouseEvent) {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    close()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    return
  }

  // Focus trap
  if (event.key === 'Tab' && contentRef.value) {
    const focusable = contentRef.value.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      nextTick(() => {
        const focusable = contentRef.value?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        focusable?.focus()
      })
    } else {
      document.body.style.overflow = ''
    }
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="glace-modal__overlay"
      role="dialog"
      aria-modal="true"
      @click="onOverlayClick"
      @keydown="onKeydown"
    >
      <div ref="contentRef" :class="['glace-modal__content', `glace-modal__content--${size}`]">
        <div v-if="slots.header" class="glace-modal__header">
          <slot name="header" />
          <button class="glace-modal__close" type="button" aria-label="Close" @click="close">
            &times;
          </button>
        </div>
        <div class="glace-modal__body">
          <slot />
        </div>
        <div v-if="slots.footer" class="glace-modal__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
