<script setup lang="ts">
/**
 * A glassmorphism button with loading state and variants.
 *
 * @example
 * ```vue
 * <GlaceButton variant="primary" size="lg" :loading="saving" @click="save">
 *   Save Changes
 * </GlaceButton>
 * ```
 */

import { computed, ref } from 'vue'
import { useGlaceLight } from '../composables'
import type { GlaceButtonProps } from './types'

const props = withDefaults(defineProps<GlaceButtonProps>(), {
  variant: 'secondary',
  size: 'md',
  loading: false,
  disabled: false,
  as: 'button',
})

const rootRef = ref<HTMLElement | null>(null)

const classes = computed(() => [
  'glace-button',
  props.variant !== 'ghost' && 'glace-glass',
  `glace-button--${props.variant}`,
  `glace-button--${props.size}`,
])

useGlaceLight(rootRef)

defineExpose({ rootRef })
</script>

<template>
  <component
    ref="rootRef"
    :is="as"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="glace-button__spinner" aria-hidden="true" />
    <span v-else style="position: relative; z-index: 2; display: contents"><slot /></span>
  </component>
</template>
