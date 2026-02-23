<script setup lang="ts">
/**
 * A glassmorphism badge for labels and tags.
 *
 * @example
 * ```vue
 * <GlaceBadge variant="outline" size="sm" removable @remove="onRemove">
 *   New
 * </GlaceBadge>
 * ```
 */

import { computed } from 'vue'
import type { GlaceBadgeProps } from './types'

const props = withDefaults(defineProps<GlaceBadgeProps>(), {
  variant: 'solid',
  size: 'md',
  color: undefined,
  removable: false,
})

const emit = defineEmits<{
  remove: []
}>()

const classes = computed(() => [
  'glace-badge',
  `glace-badge--${props.variant}`,
  `glace-badge--${props.size}`,
])

const style = computed(() =>
  props.color ? { '--glace-bg': props.color } as Record<string, string> : undefined,
)
</script>

<template>
  <span :class="classes" :style="style">
    <slot />
    <button
      v-if="removable"
      class="glace-badge__remove"
      type="button"
      aria-label="Remove"
      @click="emit('remove')"
    >
      &times;
    </button>
  </span>
</template>
