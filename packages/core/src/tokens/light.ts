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
  '--glace-specular-ambient': string
  '--glace-specular-hover-boost': string
  '--glace-edge-light-left': string
}

/** Default liquid glass light tokens */
export const glaceLightTokens: GlaceLightTokens = {
  '--glace-light-x': '30%',
  '--glace-light-y': '20%',
  '--glace-specular-intensity': '0.22',
  '--glace-specular-size': '80px',
  '--glace-hover-enabled': '1',
  '--glace-tint': 'rgba(255, 255, 255, 0.06)',
  '--glace-edge-light': 'rgba(255, 255, 255, 0.72)',
  '--glace-edge-shadow': 'rgba(0, 0, 0, 0.15)',
  '--glace-specular-ambient': '0.18',
  '--glace-specular-hover-boost': '0.14',
  '--glace-edge-light-left': 'rgba(255, 255, 255, 0.18)',
}

/** Light theme overrides for liquid glass */
export const glaceLightTokensLight: Partial<GlaceLightTokens> = {
  '--glace-specular-intensity': '0.28',
  '--glace-tint': 'rgba(255, 255, 255, 0.10)',
  '--glace-edge-shadow': 'rgba(0, 0, 0, 0.06)',
  '--glace-specular-ambient': '0.22',
  '--glace-specular-hover-boost': '0.14',
  '--glace-edge-light-left': 'rgba(255, 255, 255, 0.22)',
}

/** Dark theme overrides for liquid glass */
export const glaceLightTokensDark: Partial<GlaceLightTokens> = {
  '--glace-specular-intensity': '0.15',
  '--glace-tint': 'rgba(255, 255, 255, 0.04)',
  '--glace-edge-light': 'rgba(255, 255, 255, 0.28)',
  '--glace-edge-shadow': 'rgba(0, 0, 0, 0.25)',
  '--glace-specular-ambient': '0.12',
  '--glace-specular-hover-boost': '0.14',
  '--glace-edge-light-left': 'rgba(255, 255, 255, 0.12)',
}
