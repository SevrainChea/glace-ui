export interface TrackGlaceLightOptions {
  /** Intensity multiplier for coordinate scaling (default 1). Must be a positive number — values ≤ 0 will pin the specular to the top-left corner. */
  intensity?: number
}

/**
 * Tracks mouse position within an element and updates --glace-light-x / --glace-light-y
 * CSS custom properties. Toggles the `is-lit` class on mouseenter/mouseleave so CSS
 * can fade the specular in/out via transition.
 *
 * @param element - The element to apply light tracking to
 * @param options - Configuration options
 * @returns Cleanup function that removes all event listeners
 */
export function trackGlaceLight(
  element: HTMLElement,
  options: TrackGlaceLightOptions = {},
): () => void {
  const { intensity = 1 } = options

  let rafId: number | null = null

  function onMouseMove(event: MouseEvent) {
    if (rafId !== null) return

    rafId = requestAnimationFrame(() => {
      rafId = null
      const rect = element.getBoundingClientRect()

      const rawX = ((event.clientX - rect.left) / rect.width) * 100 * intensity
      const rawY = ((event.clientY - rect.top) / rect.height) * 100 * intensity

      const x = Math.round(Math.max(0, Math.min(100, rawX)))
      const y = Math.round(Math.max(0, Math.min(100, rawY)))

      element.style.setProperty('--glace-light-x', `${x}%`)
      element.style.setProperty('--glace-light-y', `${y}%`)
    })
  }

  function onMouseEnter() {
    element.classList.add('is-lit')
  }

  function onMouseLeave() {
    element.classList.remove('is-lit')
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  element.addEventListener('mousemove', onMouseMove, { passive: true })
  element.addEventListener('mouseenter', onMouseEnter, { passive: true })
  element.addEventListener('mouseleave', onMouseLeave, { passive: true })

  return () => {
    element.removeEventListener('mousemove', onMouseMove)
    element.removeEventListener('mouseenter', onMouseEnter)
    element.removeEventListener('mouseleave', onMouseLeave)
    element.classList.remove('is-lit')
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
}
