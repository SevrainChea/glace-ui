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

import { computed } from 'vue'
import type { GlaceButtonProps } from './types'

const props = withDefaults(defineProps<GlaceButtonProps>(), {
  variant: 'secondary',
  size: 'md',
  loading: false,
  disabled: false,
  as: 'button',
})

const classes = computed(() => [
  'glace-button',
  `glace-button--${props.variant}`,
  `glace-button--${props.size}`,
])
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="glace-button__spinner" aria-hidden="true" />
    <slot v-else />
  </component>
</template>
