/** Props for GlaceCard */
export interface GlaceCardProps {
  /** Blur intensity level */
  blurIntensity?: 'subtle' | 'medium' | 'strong'
  /** Shadow elevation */
  elevation?: 'flat' | 'raised' | 'floating'
  /** Enable hover effect */
  hoverable?: boolean
  /** Border radius size */
  radius?: 'sm' | 'md' | 'lg' | 'full'
  /** HTML element tag to render as */
  as?: string
}

/** Props for GlaceBadge */
export interface GlaceBadgeProps {
  /** Visual variant */
  variant?: 'solid' | 'outline' | 'subtle'
  /** Badge size */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /** Accent color (applied as CSS custom property) */
  color?: string
  /** Show remove button */
  removable?: boolean
}

/** Props for GlaceButton */
export interface GlaceButtonProps {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Show loading spinner */
  loading?: boolean
  /** Disable the button */
  disabled?: boolean
  /** HTML element tag to render as */
  as?: string
}

/** Props for GlaceInput */
export interface GlaceInputProps {
  /** Bound value (v-model) */
  modelValue?: string
  /** Input type */
  type?: string
  /** Placeholder text */
  placeholder?: string
  /** Disable the input */
  disabled?: boolean
  /** Error message (shows error state when set) */
  error?: string
}

/** Props for GlaceNavbar */
export interface GlaceNavbarProps {
  /** Stick to top on scroll */
  sticky?: boolean
  /** Enable blur on scroll (transparent at top, blurred when scrolled) */
  blurOnScroll?: boolean
  /** Start with transparent background */
  transparent?: boolean
}

/** Props for GlaceModal */
export interface GlaceModalProps {
  /** Visibility state (v-model) */
  modelValue: boolean
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'full'
  /** Close when clicking overlay */
  closeOnOverlay?: boolean
}

/** Props for GlaceChatBubble */
export interface GlaceChatBubbleProps {
  /** Message direction */
  variant?: 'sent' | 'received'
  /** Display timestamp */
  timestamp?: string
}

/** Props for GlaceAvatar */
export interface GlaceAvatarProps {
  /** Image source URL */
  src?: string
  /** Alt text for the image */
  alt?: string
  /** Avatar size */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Online status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away'
}
