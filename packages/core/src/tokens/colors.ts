/** Base glace color tokens shared across all themes */
export interface GlaceColorTokens {
  '--glace-bg': string
  '--glace-bg-hover': string
  '--glace-border': string
  '--glace-text-primary': string
  '--glace-text-secondary': string
  '--glace-shadow': string
}

/** Default glace color tokens (dark theme) */
export const glaceColorTokens: GlaceColorTokens = {
  '--glace-bg': 'rgba(255, 255, 255, 0.08)',
  '--glace-bg-hover': 'rgba(255, 255, 255, 0.14)',
  '--glace-border': 'rgba(255, 255, 255, 0.15)',
  '--glace-text-primary': 'rgba(255, 255, 255, 0.95)',
  '--glace-text-secondary': 'rgba(255, 255, 255, 0.7)',
  '--glace-shadow': '0 8px 32px rgba(0, 0, 0, 0.12)',
}

/** Light theme color overrides */
export const glaceColorTokensLight: GlaceColorTokens = {
  '--glace-bg': 'rgba(255, 255, 255, 0.55)',
  '--glace-bg-hover': 'rgba(255, 255, 255, 0.7)',
  '--glace-border': 'rgba(255, 255, 255, 0.4)',
  '--glace-text-primary': 'rgba(0, 0, 0, 0.87)',
  '--glace-text-secondary': 'rgba(0, 0, 0, 0.6)',
  '--glace-shadow': '0 8px 32px rgba(0, 0, 0, 0.08)',
}

/** Dark theme color overrides */
export const glaceColorTokensDark: GlaceColorTokens = {
  '--glace-bg': 'rgba(0, 0, 0, 0.25)',
  '--glace-bg-hover': 'rgba(0, 0, 0, 0.35)',
  '--glace-border': 'rgba(255, 255, 255, 0.12)',
  '--glace-text-primary': 'rgba(255, 255, 255, 0.95)',
  '--glace-text-secondary': 'rgba(255, 255, 255, 0.7)',
  '--glace-shadow': '0 8px 32px rgba(0, 0, 0, 0.24)',
}
