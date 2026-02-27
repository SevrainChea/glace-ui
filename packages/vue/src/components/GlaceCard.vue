<script setup lang="ts">
/**
 * A glassmorphism card container with configurable blur, elevation, and radius.
 *
 * @example
 * ```vue
 * <GlaceCard blur-intensity="strong" elevation="floating" hoverable>
 *   <template #header>Title</template>
 *   Card content here
 *   <template #footer>Footer</template>
 * </GlaceCard>
 * ```
 */

import { computed, ref, useSlots } from 'vue'
import { useGlaceLight } from './useGlaceLight.js'
import type { GlaceCardProps } from './types'

const props = withDefaults(defineProps<GlaceCardProps>(), {
  blurIntensity: 'medium',
  elevation: 'raised',
  hoverable: false,
  radius: 'md',
  as: 'div',
})

const rootRef = ref<HTMLElement | null>(null)

const slots = useSlots()

const classes = computed(() => [
  'glace-card',
  'glace-glass',
  props.hoverable && 'glace-card--hoverable',
  props.elevation !== 'raised' && `glace-card--${props.elevation}`,
  props.blurIntensity === 'subtle' && 'glace-card--blur-subtle',
  props.blurIntensity === 'strong' && 'glace-card--blur-strong',
  props.radius !== 'md' && `glace-card--radius-${props.radius}`,
])

useGlaceLight(rootRef)

defineExpose({ rootRef })
</script>

<template>
  <component :is="as" ref="rootRef" :class="classes">
    <div v-if="slots.header" class="glace-card__header">
      <slot name="header" />
    </div>
    <div class="glace-card__body">
      <slot />
    </div>
    <div v-if="slots.footer" class="glace-card__footer">
      <slot name="footer" />
    </div>
  </component>
</template>
