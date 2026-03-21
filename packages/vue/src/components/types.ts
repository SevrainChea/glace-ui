/** Canonical appearance variants shared across components */
export type GlaceVariant = 'solid' | 'outline' | 'ghost' | 'subtle'

/** Canonical size scale shared across components */
export type GlaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

/** Blur intensity for container components */
export type GlaceBlurIntensity = 'subtle' | 'medium' | 'strong'

/** Props for GlaceCard */
export interface GlaceCardProps {
  /** Blur intensity level */
  blurIntensity?: GlaceBlurIntensity
  /** Shadow elevation */
  elevation?: 'flat' | 'raised' | 'floating'
  /** Border radius size */
  radius?: 'sm' | 'md' | 'lg' | 'full'
  /** HTML element tag to render as */
  as?: string
}

/** Props for GlaceBadge */
export interface GlaceBadgeProps {
  /** Visual variant */
  variant?: GlaceVariant
  /** Badge size */
  size?: Extract<GlaceSize, 'xs' | 'sm' | 'md' | 'lg'>
  /** Accent color (applied as CSS custom property) */
  color?: string
  /** Show remove button */
  removable?: boolean
}

/** Props for GlaceButton */
export interface GlaceButtonProps {
  /** Visual variant */
  variant?: GlaceVariant
  /** Accent color (applied as CSS custom property) */
  color?: string
  /** Button size */
  size?: Extract<GlaceSize, 'sm' | 'md' | 'lg'>
  /** Show loading spinner */
  loading?: boolean
  /** Disable the button */
  disabled?: boolean
  /** HTML element tag to render as */
  as?: string
  /** Disable the specular hover effect (default: true) */
  hoverEffect?: boolean
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
  /** Blur intensity level */
  blurIntensity?: GlaceBlurIntensity
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
  /** Blur intensity level */
  blurIntensity?: GlaceBlurIntensity
  /** Modal size */
  size?: Extract<GlaceSize, 'sm' | 'md' | 'lg' | 'full'>
  /** Close when clicking overlay */
  closeOnOverlay?: boolean
}

/** Props for GlaceChatBubble */
export interface GlaceChatBubbleProps {
  /** Message direction */
  direction?: 'sent' | 'received'
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
  size?: Extract<GlaceSize, 'sm' | 'md' | 'lg' | 'xl'>
  /** Online status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away'
}

/** A single option in GlaceSelect */
export interface GlaceSelectOption {
  /** Display label */
  label: string
  /** Emitted value */
  value: string | number
  /** Prevent selection */
  disabled?: boolean
}

/** Props for GlaceSelect */
export interface GlaceSelectProps {
  /** Bound value (v-model) */
  modelValue?: string | number | null
  /** Options array */
  options?: GlaceSelectOption[]
  /** Placeholder text when no value selected */
  placeholder?: string
  /** Disable the select */
  disabled?: boolean
  /** Error message (shows error state when set) */
  error?: string
}

/** Props for GlaceSwitch */
export interface GlaceSwitchProps {
  /** Bound value (v-model) */
  modelValue?: boolean
  /** Switch size */
  size?: Extract<GlaceSize, 'sm' | 'md' | 'lg'>
  /** Text label displayed beside the switch */
  label?: string
  /** Disable the switch */
  disabled?: boolean
}
