import { glaceTokens } from '../tokens'
import type { GlaceTokens } from '../tokens'

/**
 * Determines whether to use light or dark text for readability
 * against the given RGBA background color.
 *
 * @param bgRgba - CSS rgba string, e.g. `"rgba(255, 255, 255, 0.12)"`
 * @returns `"#000000"` for light backgrounds, `"#ffffff"` for dark backgrounds
 */
export function getContrastColor(bgRgba: string): string {
  const match = bgRgba.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/,
  )
  if (!match) return '#ffffff'

  const r = Number(match[1])
  const g = Number(match[2])
  const b = Number(match[3])

  // Relative luminance (ITU-R BT.709)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

/** Options for {@link generateGlaceGradient} */
export interface GlaceGradientOptions {
  /** Starting RGBA color (defaults to glace-bg token value) */
  from?: string
  /** Ending RGBA color (defaults to transparent) */
  to?: string
  /** CSS angle in degrees (defaults to 135) */
  angle?: number
}

/**
 * Generates a CSS linear-gradient string suitable for glass surfaces.
 *
 * @param options - Gradient configuration
 * @returns CSS `linear-gradient(...)` value
 */
export function generateGlaceGradient(options: GlaceGradientOptions = {}): string {
  const {
    from = 'rgba(255, 255, 255, 0.15)',
    to = 'rgba(255, 255, 255, 0.05)',
    angle = 135,
  } = options

  return `linear-gradient(${angle}deg, ${from}, ${to})`
}

/**
 * Creates a complete glace theme by merging user overrides with default tokens.
 *
 * @param overrides - Partial token overrides
 * @returns Complete token set with overrides applied
 */
export function createGlaceTheme(overrides: Partial<GlaceTokens> = {}): GlaceTokens {
  return { ...glaceTokens, ...overrides }
}

export { trackGlaceLight } from './trackGlaceLight'
export type { TrackGlaceLightOptions } from './trackGlaceLight'
