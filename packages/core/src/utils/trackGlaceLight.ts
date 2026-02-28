export interface TrackGlaceLightOptions {
  /** Intensity multiplier for coordinate scaling (default 1). Must be a positive number — values ≤ 0 will pin the specular to the top-left corner. */
  intensity?: number
  /**
   * Smooth follow factor 0–1. 1 = immediate snap, 0.15 = fluid water-like follow (default).
   * Set to 1 in tests to avoid waiting for animation convergence.
   */
  lerpFactor?: number
}

/**
 * Tracks mouse position within an element and updates --glace-light-x / --glace-light-y
 * CSS custom properties. Toggles the `is-lit` class on mouseenter/mouseleave so CSS
 * can fade the specular in/out via transition. Uses lerp to smoothly animate the
 * specular position for a fluid water-drop feel.
 *
 * @param element - The element to apply light tracking to
 * @param options - Configuration options
 * @returns Cleanup function that removes all event listeners
 */
export function trackGlaceLight(
  element: HTMLElement,
  options: TrackGlaceLightOptions = {},
): () => void {
  const { intensity = 1, lerpFactor = 0.15 } = options

  let targetX = 50
  let targetY = 50
  let currentX = 50
  let currentY = 50
  let rafId: number | null = null

  function animate() {
    rafId = null

    currentX += (targetX - currentX) * lerpFactor
    currentY += (targetY - currentY) * lerpFactor

    const x = Math.round(currentX)
    const y = Math.round(currentY)

    element.style.setProperty('--glace-light-x', `${x}%`)
    element.style.setProperty('--glace-light-y', `${y}%`)

    if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
      rafId = requestAnimationFrame(animate)
    }
  }

  function onMouseMove(event: MouseEvent) {
    const rect = element.getBoundingClientRect()
    const rawX = ((event.clientX - rect.left) / rect.width) * 100 * intensity
    const rawY = ((event.clientY - rect.top) / rect.height) * 100 * intensity

    targetX = Math.max(0, Math.min(100, rawX))
    targetY = Math.max(0, Math.min(100, rawY))

    if (rafId === null) {
      rafId = requestAnimationFrame(animate)
    }
  }

  function onMouseEnter(event: MouseEvent) {
    const rect = element.getBoundingClientRect()
    const rawX = ((event.clientX - rect.left) / rect.width) * 100 * intensity
    const rawY = ((event.clientY - rect.top) / rect.height) * 100 * intensity

    // Snap current position to entry point so the highlight appears at the cursor
    currentX = targetX = Math.max(0, Math.min(100, rawX))
    currentY = targetY = Math.max(0, Math.min(100, rawY))

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
