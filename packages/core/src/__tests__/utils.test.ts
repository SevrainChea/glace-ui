import { describe, it, expect } from 'vitest'
import { getContrastColor, generateGlaceGradient, createGlaceTheme } from '../utils'
import { glaceTokens } from '../tokens'

describe('getContrastColor', () => {
  it('returns black for light backgrounds', () => {
    expect(getContrastColor('rgba(255, 255, 255, 0.9)')).toBe('#000000')
  })

  it('returns white for dark backgrounds', () => {
    expect(getContrastColor('rgba(0, 0, 0, 0.9)')).toBe('#ffffff')
  })

  it('returns white for invalid input', () => {
    expect(getContrastColor('invalid')).toBe('#ffffff')
  })

  it('handles rgb without alpha', () => {
    expect(getContrastColor('rgb(200, 200, 200)')).toBe('#000000')
  })
})

describe('generateGlaceGradient', () => {
  it('returns a gradient string with defaults', () => {
    const result = generateGlaceGradient()
    expect(result).toContain('linear-gradient')
    expect(result).toContain('135deg')
  })

  it('accepts custom angle', () => {
    const result = generateGlaceGradient({ angle: 90 })
    expect(result).toContain('90deg')
  })

  it('accepts custom colors', () => {
    const result = generateGlaceGradient({
      from: 'rgba(0, 0, 0, 0.5)',
      to: 'rgba(0, 0, 0, 0.1)',
    })
    expect(result).toContain('rgba(0, 0, 0, 0.5)')
    expect(result).toContain('rgba(0, 0, 0, 0.1)')
  })
})

describe('createGlaceTheme', () => {
  it('returns default tokens when no overrides provided', () => {
    const theme = createGlaceTheme()
    expect(theme).toEqual(glaceTokens)
  })

  it('merges overrides with defaults', () => {
    const theme = createGlaceTheme({ '--glace-blur': '32px' })
    expect(theme['--glace-blur']).toBe('32px')
    expect(theme['--glace-radius']).toBe(glaceTokens['--glace-radius'])
  })
})
