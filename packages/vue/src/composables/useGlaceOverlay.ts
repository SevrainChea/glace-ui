import { ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export interface GlaceOverlayReturn {
  /** Whether the overlay is open */
  isOpen: Ref<boolean>
  /** Open the overlay */
  open: () => void
  /** Close the overlay */
  close: () => void
  /** Toggle the overlay */
  toggle: () => void
}

/**
 * Manages overlay open/close state with automatic body scroll lock.
 *
 * @returns Overlay state and controls
 */
export function useGlaceOverlay(): GlaceOverlayReturn {
  const isOpen = ref(false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  watch(isOpen, (open) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  })

  onUnmounted(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
  })

  return { isOpen, open, close, toggle }
}
