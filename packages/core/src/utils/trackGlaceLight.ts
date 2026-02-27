export interface TrackGlaceLightOptions {
  /** Container element to listen for mousemove (defaults to document) */
  container?: HTMLElement
  /** Intensity multiplier (default 1) — higher values spread the light further */
  intensity?: number
}

/**
 * Tracks mouse position and updates --glace-light-x and --glace-light-y
 * CSS custom properties on the target element.
 *
 * @param element - The element to apply light tracking to
 * @param options - Configuration options
 * @returns Cleanup function that removes the event listener
 */
export function trackGlaceLight(
  element: HTMLElement,
  options: TrackGlaceLightOptions = {},
): () => void {
  const { intensity = 1 } = options
  const target = options.container ?? document

  let rafId: number | null = null

  function onMouseMove(event: Event) {
    const e = event as MouseEvent
    if (rafId !== null) return

    rafId = requestAnimationFrame(() => {
      rafId = null
      const rect = element.getBoundingClientRect()

      const rawX = ((e.clientX - rect.left) / rect.width) * 100 * intensity
      const rawY = ((e.clientY - rect.top) / rect.height) * 100 * intensity

      const x = Math.round(Math.max(0, Math.min(100, rawX)))
      const y = Math.round(Math.max(0, Math.min(100, rawY)))

      element.style.setProperty('--glace-light-x', `${x}%`)
      element.style.setProperty('--glace-light-y', `${y}%`)
    })
  }

  target.addEventListener('mousemove', onMouseMove, { passive: true })

  return () => {
    target.removeEventListener('mousemove', onMouseMove)
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
}
