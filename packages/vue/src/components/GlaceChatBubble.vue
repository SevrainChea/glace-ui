<script setup lang="ts">
/**
 * A glassmorphism chat bubble for messaging UIs.
 *
 * @example
 * ```vue
 * <GlaceChatBubble variant="sent" timestamp="12:34 PM">
 *   Hello, world!
 * </GlaceChatBubble>
 * ```
 */

import { computed, ref } from 'vue'
import type { GlaceChatBubbleProps } from './types'

const props = withDefaults(defineProps<GlaceChatBubbleProps>(), {
  variant: 'received',
  timestamp: undefined,
})

const contentRef = ref<HTMLElement | null>(null)

const classes = computed(() => [
  'glace-chat-bubble',
  `glace-chat-bubble--${props.variant}`,
])

defineExpose({ contentRef })
</script>

<template>
  <div :class="classes">
    <div class="glace-chat-bubble__avatar">
      <slot name="avatar" />
    </div>
    <div>
      <div ref="contentRef" :class="['glace-chat-bubble__content', 'glace-glass']">
        <slot />
      </div>
      <div v-if="timestamp" class="glace-chat-bubble__timestamp">
        {{ timestamp }}
      </div>
    </div>
  </div>
</template>
