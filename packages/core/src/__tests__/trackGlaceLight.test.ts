// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { trackGlaceLight } from '../utils/trackGlaceLight'

describe('trackGlaceLight', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      right: 300,
      bottom: 200,
      x: 100,
      y: 100,
      toJSON: () => {},
    })
  })

  afterEach(() => {
    document.body.removeChild(element)
  })

  it('returns a cleanup function', () => {
    const cleanup = trackGlaceLight(element)
    expect(typeof cleanup).toBe('function')
    cleanup()
  })

  it('sets CSS custom properties on mousemove', async () => {
    const cleanup = trackGlaceLight(element)

    const event = new MouseEvent('mousemove', {
      clientX: 200,
      clientY: 150,
    })
    document.dispatchEvent(event)

    // Wait for rAF
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const lightX = element.style.getPropertyValue('--glace-light-x')
    const lightY = element.style.getPropertyValue('--glace-light-y')

    expect(lightX).toBe('50%')
    expect(lightY).toBe('50%')

    cleanup()
  })

  it('clamps values between 0% and 100%', async () => {
    const cleanup = trackGlaceLight(element)

    const event = new MouseEvent('mousemove', {
      clientX: 0,
      clientY: 0,
    })
    document.dispatchEvent(event)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    const lightX = element.style.getPropertyValue('--glace-light-x')
    const lightY = element.style.getPropertyValue('--glace-light-y')

    expect(lightX).toBe('0%')
    expect(lightY).toBe('0%')

    cleanup()
  })

  it('removes listener on cleanup', async () => {
    const cleanup = trackGlaceLight(element)
    cleanup()

    const event = new MouseEvent('mousemove', {
      clientX: 200,
      clientY: 150,
    })
    document.dispatchEvent(event)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    const lightX = element.style.getPropertyValue('--glace-light-x')
    expect(lightX).toBe('')
  })
})
