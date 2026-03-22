/**
 * Generates and injects an SVG displacement filter for glass refraction.
 *
 * A 256×256 displacement map is produced via canvas: R/G channels encode outward
 * normals with a bell-curve strength peaking at the rim of the element, creating
 * the "water droplet lens" distortion characteristic of liquid glass.
 *
 * The filter is referenced as `url(#glace-refraction)` in backdrop-filter.
 * Chrome supports SVG filters in backdrop-filter; Safari/Firefox fall back to
 * the plain blur() value already present on each component.
 *
 * Idempotent — calling multiple times is safe.
 *
 * @param doc - Document to inject into (defaults to `window.document`)
 */
export function injectGlaceFilters(doc?: Document): void {
  const d = doc ?? (typeof document !== 'undefined' ? document : null)
  if (!d) return
  if (d.getElementById('glace-filters')) return

  // Build displacement map via canvas
  const SIZE = 256
  const canvas = d.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const imgData = ctx.createImageData(SIZE, SIZE)
  const cx = SIZE / 2
  const cy = SIZE / 2

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = (x - cx) / cx // –1 to +1
      const dy = (y - cy) / cy
      const r = Math.sqrt(dx * dx + dy * dy)

      // Bell curve: peak at r≈0.85, zero at center and beyond edge
      const t = Math.max(0, 1 - Math.abs(r - 0.85) / 0.35)
      const strength = t * t * 60

      const len = r < 0.001 ? 1 : r
      const nx = dx / len
      const ny = dy / len

      const i = (y * SIZE + x) * 4
      imgData.data[i + 0] = Math.round(128 + nx * strength) // R → horizontal
      imgData.data[i + 1] = Math.round(128 + ny * strength) // G → vertical
      imgData.data[i + 2] = 128
      imgData.data[i + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  const dataUrl = canvas.toDataURL('image/png')

  // Inject SVG filter
  const wrap = d.createElement('div')
  wrap.id = 'glace-filters'
  wrap.setAttribute(
    'style',
    'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;',
  )

  const svg = d.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.setAttribute('aria-hidden', 'true')
  svg.style.position = 'absolute'

  const defs = d.createElementNS('http://www.w3.org/2000/svg', 'defs')

  const filter = d.createElementNS('http://www.w3.org/2000/svg', 'filter')
  filter.setAttribute('id', 'glace-refraction')
  filter.setAttribute('filterUnits', 'objectBoundingBox')
  filter.setAttribute('primitiveUnits', 'objectBoundingBox')
  filter.setAttribute('color-interpolation-filters', 'sRGB')
  filter.setAttribute('x', '-5%')
  filter.setAttribute('y', '-5%')
  filter.setAttribute('width', '110%')
  filter.setAttribute('height', '110%')

  const feImage = d.createElementNS('http://www.w3.org/2000/svg', 'feImage')
  feImage.setAttribute('href', dataUrl)
  feImage.setAttribute('result', 'dispMap')
  feImage.setAttribute('x', '0')
  feImage.setAttribute('y', '0')
  feImage.setAttribute('width', '1')
  feImage.setAttribute('height', '1')
  feImage.setAttribute('preserveAspectRatio', 'xMidYMid slice')

  const feDisp = d.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
  feDisp.setAttribute('in', 'SourceGraphic')
  feDisp.setAttribute('in2', 'dispMap')
  feDisp.setAttribute('scale', '0.10')
  feDisp.setAttribute('xChannelSelector', 'R')
  feDisp.setAttribute('yChannelSelector', 'G')

  filter.appendChild(feImage)
  filter.appendChild(feDisp)
  defs.appendChild(filter)
  svg.appendChild(defs)
  wrap.appendChild(svg)

  d.body.appendChild(wrap)
}
