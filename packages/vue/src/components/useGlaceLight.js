import { onMounted, onUnmounted, watch } from 'vue'
import { trackGlaceLight } from '@glace-ui/core'

/**
 * Tracks mouse position and updates --glace-light-x/--glace-light-y
 * CSS custom properties on the target element.
 * @param {import('vue').Ref<HTMLElement | null>} elementRef
 * @param {import('@glace-ui/core').TrackGlaceLightOptions} [options]
 */
export function useGlaceLight(elementRef, options) {
  let cleanup = null

  function start() {
    cleanup?.()
    cleanup = null
    if (elementRef.value) {
      cleanup = trackGlaceLight(elementRef.value, options)
    }
  }

  onMounted(() => start())
  onUnmounted(() => {
    cleanup?.()
    cleanup = null
  })
  watch(elementRef, () => start())
}
