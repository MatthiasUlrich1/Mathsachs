import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AngleProtractor } from './AngleProtractor'
import { drawStartDegrees } from '../lib/protractorGeometry'

// The repo's component tests render to static markup (no DOM environment, no
// testing-library). Pointer maths lives in protractorGeometry (see
// protractorGeometry.test.ts); the handlers use onPointerDown/Move/Up only.
const blank = { kind: 'angleProtractor', degrees: null, touched: false } as const

describe('AngleProtractor', () => {
  it('renders an img svg with the protractor group, rotation handle and answer field (measure)', () => {
    const html = renderToStaticMarkup(
      createElement(AngleProtractor, { mode: 'measure', angle: 47, value: blank, onChange: () => {} }),
    )
    expect(html).toContain('role="img"')
    expect(html).toContain('data-testid="protractor"')
    expect(html).toContain('data-testid="rotate-handle"')
    expect(html).toContain('viewBox="0 0 360 320"')
    expect(html).toContain('inputMode="decimal"')
    expect(html).toContain('transform="translate(240 200) rotate(')
    expect(html).not.toContain('47°')
  })

  it('draw mode: instrument fixed on the vertex, leg starts away from the target', () => {
    const html = renderToStaticMarkup(
      createElement(AngleProtractor, {
        mode: 'draw',
        angle: 47,
        value: { kind: 'angleProtractor', degrees: drawStartDegrees(47), touched: false },
        onChange: () => {},
      }),
    )
    expect(html).toContain('data-testid="leg-handle"')
    expect(html).toContain('transform="translate(180 160) rotate(')
    expect(html).not.toContain('data-testid="rotate-handle"')
    expect(html).not.toContain('inputMode')
    expect(html).not.toContain('data-degrees="47"')
    expect(html).toContain(`data-degrees="${drawStartDegrees(47)}"`)
  })

  it('rotates the instrument with the first leg in draw mode', () => {
    const html = renderToStaticMarkup(
      createElement(AngleProtractor, {
        mode: 'draw',
        angle: 47,
        startAngle: 30,
        value: blank,
        onChange: () => {},
      }),
    )
    expect(html).toContain('rotate(-30)')
  })

  it('shows the solution leg and hides handles when disabled', () => {
    const html = renderToStaticMarkup(
      createElement(AngleProtractor, {
        mode: 'draw',
        angle: 47,
        value: blank,
        onChange: () => {},
        disabled: true,
      }),
    )
    expect(html).toContain('angle-protractor__leg--solution')
  })
})
