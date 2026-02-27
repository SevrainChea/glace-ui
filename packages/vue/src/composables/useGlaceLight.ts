import { onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import { trackGlaceLight } from '@glace-ui/core'
import type { TrackGlaceLightOptions } from '@glace-ui/core'

/**
 * Vue composable that wraps trackGlaceLight with lifecycle management.
 * Updates --glace-light-x and --glace-light-y on the element
 * based on mouse position, creating a reactive specular highlight.
 *
 * @param elementRef - Template ref to the target element
 * @param options - trackGlaceLight options
 */
export function useGlaceLight(
  elementRef: Ref<HTMLElement | null>,
  options?: TrackGlaceLightOptions,
): void {
  let cleanup: (() => void) | null = null

  function start() {
    stop()
    if (elementRef.value) {
      cleanup = trackGlaceLight(elementRef.value, options)
    }
  }

  function stop() {
    if (cleanup) {
      cleanup()
      cleanup = null
    }
  }

  onMounted(() => start())
  onUnmounted(() => stop())

  watch(elementRef, () => start())
}
