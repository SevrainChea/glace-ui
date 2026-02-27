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

import { computed, ref } from 'vue'
import { useGlaceLight } from './useGlaceLight.js'
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

const rootRef = ref<HTMLElement | null>(null)

const classes = computed(() => [
  'glace-badge',
  'glace-glass',
  `glace-badge--${props.variant}`,
  `glace-badge--${props.size}`,
])

const style = computed(() =>
  props.color ? { '--glace-bg': props.color } as Record<string, string> : undefined,
)

useGlaceLight(rootRef)

defineExpose({ rootRef })
</script>

<template>
  <span ref="rootRef" :class="classes" :style="style">
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
