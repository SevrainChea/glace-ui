import { describe, it, expect } from 'vitest'
import {
  glaceTokens,
  glaceTokensLight,
  glaceTokensDark,
  glaceBlurTokens,
  glaceBorderTokens,
  glaceColorTokens,
} from '../tokens'
import type { GlaceTokens } from '../tokens'

describe('glaceTokens', () => {
  it('includes all color tokens', () => {
    expect(glaceTokens['--glace-bg']).toBeDefined()
    expect(glaceTokens['--glace-bg-hover']).toBeDefined()
    expect(glaceTokens['--glace-border']).toBeDefined()
    expect(glaceTokens['--glace-text-primary']).toBeDefined()
    expect(glaceTokens['--glace-text-secondary']).toBeDefined()
    expect(glaceTokens['--glace-shadow']).toBeDefined()
  })

  it('includes all blur tokens', () => {
    expect(glaceTokens['--glace-blur']).toBe('16px')
    expect(glaceTokens['--glace-blur-intense']).toBe('24px')
    expect(glaceTokens['--glace-blur-subtle']).toBe('8px')
  })

  it('includes all border tokens', () => {
    expect(glaceTokens['--glace-radius']).toBe('16px')
    expect(glaceTokens['--glace-radius-sm']).toBe('8px')
    expect(glaceTokens['--glace-radius-lg']).toBe('24px')
    expect(glaceTokens['--glace-radius-full']).toBe('9999px')
    expect(glaceTokens['--glace-border-width']).toBe('1px')
  })
})

describe('theme presets', () => {
  it('light preset overrides color tokens', () => {
    expect(glaceTokensLight['--glace-bg']).not.toBe(glaceColorTokens['--glace-bg'])
    expect(glaceTokensLight['--glace-blur']).toBe(glaceBlurTokens['--glace-blur'])
  })

  it('dark preset overrides color tokens', () => {
    expect(glaceTokensDark['--glace-bg']).not.toBe(glaceColorTokens['--glace-bg'])
    expect(glaceTokensDark['--glace-radius']).toBe(glaceBorderTokens['--glace-radius'])
  })

  it('all presets satisfy GlaceTokens type', () => {
    const _default: GlaceTokens = glaceTokens
    const _light: GlaceTokens = glaceTokensLight
    const _dark: GlaceTokens = glaceTokensDark
    expect(_default).toBeDefined()
    expect(_light).toBeDefined()
    expect(_dark).toBeDefined()
  })
})
