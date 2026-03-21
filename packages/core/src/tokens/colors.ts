/** Base glace color tokens shared across all themes */
export interface GlaceColorTokens {
  '--glace-bg': string
  '--glace-bg-hover': string
  '--glace-border': string
  '--glace-text-primary': string
  '--glace-text-secondary': string
  '--glace-shadow': string
  '--glace-switch-active-bg': string
  '--glace-switch-active-border': string
  '--glace-switch-glow': string
}

/** Default glace color tokens (dark theme) */
export const glaceColorTokens: GlaceColorTokens = {
  '--glace-bg': 'rgba(255, 255, 255, 0.08)',
  '--glace-bg-hover': 'rgba(255, 255, 255, 0.14)',
  '--glace-border': 'rgba(255, 255, 255, 0.15)',
  '--glace-text-primary': 'rgba(255, 255, 255, 0.95)',
  '--glace-text-secondary': 'rgba(255, 255, 255, 0.7)',
  '--glace-shadow': '0 8px 32px rgba(0, 0, 0, 0.12)',
  '--glace-switch-active-bg': 'rgba(120, 180, 255, 0.22)',
  '--glace-switch-active-border': 'rgba(120, 180, 255, 0.38)',
  '--glace-switch-glow': 'rgba(120, 180, 255, 0.18)',
}

/** Light theme color overrides */
export const glaceColorTokensLight: GlaceColorTokens = {
  '--glace-bg': 'rgba(255, 255, 255, 0.55)',
  '--glace-bg-hover': 'rgba(255, 255, 255, 0.7)',
  '--glace-border': 'rgba(255, 255, 255, 0.4)',
  '--glace-text-primary': 'rgba(0, 0, 0, 0.87)',
  '--glace-text-secondary': 'rgba(0, 0, 0, 0.6)',
  '--glace-shadow': '0 8px 32px rgba(0, 0, 0, 0.08)',
  '--glace-switch-active-bg': 'rgba(80, 140, 255, 0.30)',
  '--glace-switch-active-border': 'rgba(80, 140, 255, 0.55)',
  '--glace-switch-glow': 'rgba(80, 140, 255, 0.25)',
}

/** Dark theme color overrides */
export const glaceColorTokensDark: GlaceColorTokens = {
  '--glace-bg': 'rgba(0, 0, 0, 0.25)',
  '--glace-bg-hover': 'rgba(0, 0, 0, 0.35)',
  '--glace-border': 'rgba(255, 255, 255, 0.12)',
  '--glace-text-primary': 'rgba(255, 255, 255, 0.95)',
  '--glace-text-secondary': 'rgba(255, 255, 255, 0.7)',
  '--glace-shadow': '0 8px 32px rgba(0, 0, 0, 0.24)',
  '--glace-switch-active-bg': 'rgba(120, 180, 255, 0.22)',
  '--glace-switch-active-border': 'rgba(120, 180, 255, 0.38)',
  '--glace-switch-glow': 'rgba(120, 180, 255, 0.18)',
}
