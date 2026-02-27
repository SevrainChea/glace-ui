<script setup lang="ts">
/**
 * A glassmorphism navigation bar with scroll-aware blur.
 *
 * @example
 * ```vue
 * <GlaceNavbar sticky blur-on-scroll>
 *   <template #logo><Logo /></template>
 *   <NavLinks />
 *   <template #actions><UserMenu /></template>
 * </GlaceNavbar>
 * ```
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGlaceLight } from './useGlaceLight.js'
import type { GlaceNavbarProps } from './types'

const props = withDefaults(defineProps<GlaceNavbarProps>(), {
  sticky: false,
  blurOnScroll: false,
  transparent: false,
})

const rootRef = ref<HTMLElement | null>(null)
const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  if (props.blurOnScroll) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  }
})

onUnmounted(() => {
  if (props.blurOnScroll) {
    window.removeEventListener('scroll', handleScroll)
  }
})

const classes = computed(() => [
  'glace-navbar',
  !(props.transparent && !isScrolled.value) && 'glace-glass',
  props.sticky && 'glace-navbar--sticky',
  props.transparent && !isScrolled.value && 'glace-navbar--transparent',
  props.blurOnScroll && isScrolled.value && 'glace-navbar--scrolled',
])

useGlaceLight(rootRef)

defineExpose({ rootRef })
</script>

<template>
  <nav ref="rootRef" :class="classes" role="navigation">
    <div class="glace-navbar__logo">
      <slot name="logo" />
    </div>
    <div class="glace-navbar__content">
      <slot />
    </div>
    <div class="glace-navbar__actions">
      <slot name="actions" />
    </div>
  </nav>
</template>
