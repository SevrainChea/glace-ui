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

  it('sets CSS custom properties on mousemove within element', async () => {
    const cleanup = trackGlaceLight(element)

    const event = new MouseEvent('mousemove', { clientX: 200, clientY: 150 })
    element.dispatchEvent(event)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(element.style.getPropertyValue('--glace-light-x')).toBe('50%')
    expect(element.style.getPropertyValue('--glace-light-y')).toBe('50%')

    cleanup()
  })

  it('clamps values between 0% and 100%', async () => {
    const cleanup = trackGlaceLight(element)

    const event = new MouseEvent('mousemove', { clientX: 0, clientY: 0 })
    element.dispatchEvent(event)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(element.style.getPropertyValue('--glace-light-x')).toBe('0%')
    expect(element.style.getPropertyValue('--glace-light-y')).toBe('0%')

    cleanup()
  })

  it('removes listeners on cleanup — mousemove no longer updates properties', async () => {
    const cleanup = trackGlaceLight(element)
    cleanup()

    const event = new MouseEvent('mousemove', { clientX: 200, clientY: 150 })
    element.dispatchEvent(event)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(element.style.getPropertyValue('--glace-light-x')).toBe('')
  })

  it('adds is-lit class on mouseenter', () => {
    const cleanup = trackGlaceLight(element)

    element.dispatchEvent(new MouseEvent('mouseenter'))

    expect(element.classList.contains('is-lit')).toBe(true)

    cleanup()
  })

  it('removes is-lit class on mouseleave', () => {
    const cleanup = trackGlaceLight(element)

    element.dispatchEvent(new MouseEvent('mouseenter'))
    element.dispatchEvent(new MouseEvent('mouseleave'))

    expect(element.classList.contains('is-lit')).toBe(false)

    cleanup()
  })

  it('removes is-lit on cleanup — enter events no longer add it', () => {
    const cleanup = trackGlaceLight(element)

    element.dispatchEvent(new MouseEvent('mouseenter'))
    cleanup()

    // After cleanup, enter/leave events should have no effect
    element.dispatchEvent(new MouseEvent('mouseenter'))
    expect(element.classList.contains('is-lit')).toBe(false)
  })
})
