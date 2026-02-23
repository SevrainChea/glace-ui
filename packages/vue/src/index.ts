// Components
export { default as GlaceCard } from './components/GlaceCard.vue'
export { default as GlaceBadge } from './components/GlaceBadge.vue'
export { default as GlaceButton } from './components/GlaceButton.vue'
export { default as GlaceInput } from './components/GlaceInput.vue'
export { default as GlaceNavbar } from './components/GlaceNavbar.vue'
export { default as GlaceModal } from './components/GlaceModal.vue'
export { default as GlaceChatBubble } from './components/GlaceChatBubble.vue'
export { default as GlaceAvatar } from './components/GlaceAvatar.vue'

// Component prop types
export type {
  GlaceCardProps,
  GlaceBadgeProps,
  GlaceButtonProps,
  GlaceInputProps,
  GlaceNavbarProps,
  GlaceModalProps,
  GlaceChatBubbleProps,
  GlaceAvatarProps,
} from './components/types'

// Composables
export { useGlaceTheme } from './composables'
export type { GlaceThemeOptions, GlaceThemeReturn } from './composables'
export { useGlaceOverlay } from './composables'
export type { GlaceOverlayReturn } from './composables'

// Plugin
export { GlacePlugin } from './plugin'
export type { GlacePluginOptions } from './plugin'
