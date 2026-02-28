/** Liquid glass light and specular tokens */
export interface GlaceLightTokens {
  '--glace-light-x': string
  '--glace-light-y': string
  '--glace-specular-intensity': string
  '--glace-specular-size': string
  /** Set to '0' to globally disable the hover specular effect */
  '--glace-hover-enabled': string
  '--glace-tint': string
  '--glace-edge-light': string
  '--glace-edge-shadow': string
}

/** Default liquid glass light tokens */
export const glaceLightTokens: GlaceLightTokens = {
  '--glace-light-x': '30%',
  '--glace-light-y': '20%',
  '--glace-specular-intensity': '0.22',
  '--glace-specular-size': '38%',
  '--glace-hover-enabled': '1',
  '--glace-tint': 'rgba(255, 255, 255, 0.08)',
  '--glace-edge-light': 'rgba(255, 255, 255, 0.25)',
  '--glace-edge-shadow': 'rgba(0, 0, 0, 0.15)',
}

/** Light theme overrides for liquid glass */
export const glaceLightTokensLight: Partial<GlaceLightTokens> = {
  '--glace-specular-intensity': '0.28',
  '--glace-tint': 'rgba(255, 255, 255, 0.12)',
  '--glace-edge-light': 'rgba(255, 255, 255, 0.35)',
  '--glace-edge-shadow': 'rgba(0, 0, 0, 0.08)',
}

/** Dark theme overrides for liquid glass */
export const glaceLightTokensDark: Partial<GlaceLightTokens> = {
  '--glace-specular-intensity': '0.16',
  '--glace-tint': 'rgba(255, 255, 255, 0.05)',
  '--glace-edge-light': 'rgba(255, 255, 255, 0.18)',
  '--glace-edge-shadow': 'rgba(0, 0, 0, 0.25)',
}
