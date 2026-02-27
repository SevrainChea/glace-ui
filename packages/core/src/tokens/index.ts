export { glaceColorTokens, glaceColorTokensLight, glaceColorTokensDark } from './colors'
export type { GlaceColorTokens } from './colors'
export { glaceBlurTokens } from './blur'
export type { GlaceBlurTokens } from './blur'
export { glaceBorderTokens } from './borders'
export type { GlaceBorderTokens } from './borders'
export { glaceLightTokens, glaceLightTokensLight, glaceLightTokensDark } from './light'
export type { GlaceLightTokens } from './light'

import { glaceColorTokens, glaceColorTokensLight, glaceColorTokensDark } from './colors'
import type { GlaceColorTokens } from './colors'
import { glaceBlurTokens } from './blur'
import type { GlaceBlurTokens } from './blur'
import { glaceBorderTokens } from './borders'
import type { GlaceBorderTokens } from './borders'
import { glaceLightTokens, glaceLightTokensLight, glaceLightTokensDark } from './light'
import type { GlaceLightTokens } from './light'

/** Complete set of glace design tokens */
export type GlaceTokens = GlaceColorTokens & GlaceBlurTokens & GlaceBorderTokens & GlaceLightTokens

/** Default glace tokens (dark-friendly) */
export const glaceTokens: GlaceTokens = {
  ...glaceColorTokens,
  ...glaceBlurTokens,
  ...glaceBorderTokens,
  ...glaceLightTokens,
}

/** Light theme preset */
export const glaceTokensLight: GlaceTokens = {
  ...glaceColorTokensLight,
  ...glaceBlurTokens,
  ...glaceBorderTokens,
  ...glaceLightTokens,
  ...glaceLightTokensLight,
}

/** Dark theme preset */
export const glaceTokensDark: GlaceTokens = {
  ...glaceColorTokensDark,
  ...glaceBlurTokens,
  ...glaceBorderTokens,
  ...glaceLightTokens,
  ...glaceLightTokensDark,
}

/**
 * Injects glace design tokens as CSS custom properties on the given element.
 * Defaults to `document.documentElement` if no element is provided.
 *
 * @param tokens - Token overrides to merge with defaults
 * @param element - Target element (defaults to `:root`)
 */
export function injectGlaceTokens(
  tokens: Partial<GlaceTokens> = {},
  element?: HTMLElement,
): void {
  const target = element ?? document.documentElement
  const merged = { ...glaceTokens, ...tokens }

  for (const [prop, value] of Object.entries(merged)) {
    target.style.setProperty(prop, value)
  }
}
