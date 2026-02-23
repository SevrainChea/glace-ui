<script setup lang="ts">
/**
 * A glassmorphism avatar with image, fallback, and status indicator.
 *
 * @example
 * ```vue
 * <GlaceAvatar src="/avatar.jpg" alt="Jane" size="lg" status="online">
 *   <template #fallback>JD</template>
 * </GlaceAvatar>
 * ```
 */

import { ref, computed, watch } from 'vue'
import type { GlaceAvatarProps } from './types'

const props = withDefaults(defineProps<GlaceAvatarProps>(), {
  src: undefined,
  alt: '',
  size: 'md',
  status: undefined,
})

const showFallback = ref(!props.src)

function onImageError() {
  showFallback.value = true
}

watch(
  () => props.src,
  (newSrc) => {
    showFallback.value = !newSrc
  },
)

const classes = computed(() => [
  'glace-avatar',
  `glace-avatar--${props.size}`,
])
</script>

<template>
  <div :class="classes">
    <img
      v-if="src && !showFallback"
      :src="src"
      :alt="alt"
      class="glace-avatar__image"
      @error="onImageError"
    />
    <span v-else class="glace-avatar__fallback">
      <slot name="fallback">{{ alt?.charAt(0)?.toUpperCase() }}</slot>
    </span>
    <span
      v-if="status"
      :class="['glace-avatar__status', `glace-avatar__status--${status}`]"
      :aria-label="status"
    />
  </div>
</template>
