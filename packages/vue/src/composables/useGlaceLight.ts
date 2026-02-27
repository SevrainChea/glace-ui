import { onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import { trackGlaceLight } from '@glace-ui/core'
import type { TrackGlaceLightOptions } from '@glace-ui/core'

export type UseGlaceLightOptions = TrackGlaceLightOptions

/**
 * Vue composable that tracks mouse position and updates
 * --glace-light-x and --glace-light-y CSS custom properties
 * on the target element, creating a reactive specular highlight.
 *
 * @param elementRef - Template ref to the target element
 * @param options - Configuration options
 */
export function useGlaceLight(
  elementRef: Ref<HTMLElement | null>,
  options?: UseGlaceLightOptions,
): void {
  let cleanup: (() => void) | null = null

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
