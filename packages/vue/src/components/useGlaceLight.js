/* global document, requestAnimationFrame, cancelAnimationFrame */
import { onMounted, onUnmounted, watch } from 'vue'

/**
 * Tracks mouse position and updates --glace-light-x/--glace-light-y
 * CSS custom properties on the target element.
 * @param {import('vue').Ref<HTMLElement | null>} elementRef
 */
export function useGlaceLight(elementRef) {
  let cleanup = null

  function track(element) {
    let rafId = null

    function onMouseMove(event) {
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        rafId = null
        const rect = element.getBoundingClientRect()
        const rawX = ((event.clientX - rect.left) / rect.width) * 100
        const rawY = ((event.clientY - rect.top) / rect.height) * 100
        const x = Math.round(Math.max(0, Math.min(100, rawX)))
        const y = Math.round(Math.max(0, Math.min(100, rawY)))
        element.style.setProperty('--glace-light-x', `${x}%`)
        element.style.setProperty('--glace-light-y', `${y}%`)
      })
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }
  }

  function start() {
    stop()
    if (elementRef.value) {
      cleanup = track(elementRef.value)
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
