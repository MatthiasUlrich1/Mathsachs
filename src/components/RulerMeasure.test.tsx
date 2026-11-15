import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { RulerMeasure } from './RulerMeasure'
import { drawStartLength } from '../lib/rulerGeometry'

// Component tests here render to static markup (no DOM environment, no
// testing-library). Pointer maths lives in rulerGeometry (see rulerGeometry.test.ts);
// the handlers use onPointerDown/Move/Up only.
const blank = { kind: 'rulerMeasure', length: null, touched: false } as const

describe('RulerMeasure', () => {
  it('renders an img svg with the ruler group, rotation handle and answer field (measure)', () => {
    const html = renderToStaticMarkup(
      createElement(RulerMeasure, { mode: 'measure', lengthCm: 4.3, value: blank, onChange: () => {} }),
    )
    expect(html).toContain('role="img"')
    expect(html).toContain('data-testid="ruler"')
    expect(html).toContain('data-testid="rotate-handle"')
    expect(html).toContain('viewBox="0 0 640 380"')
    expect(html).toContain('inputMode="decimal"')
    expect(html).toContain('transform="translate(50 335) rotate(')
    expect(html).not.toContain('4,3')
    expect(html).not.toContain('data-length')
  })

  it('draw mode: ruler fixed on the start point, end handle starts away from the target', () => {
    const html = renderToStaticMarkup(
      createElement(RulerMeasure, {
        mode: 'draw',
        lengthCm: 4.3,
        angle: 10,
        value: { kind: 'rulerMeasure', length: drawStartLength(4.3), touched: false },
        onChange: () => {},
      }),
    )
    expect(html).toContain('data-testid="end-handle"')
    expect(html).toContain('transform="translate(60 190) rotate(-10)')
    expect(html).not.toContain('data-testid="rotate-handle"')
    expect(html).not.toContain('inputMode')
    expect(html).not.toContain('data-length="4.3"')
    expect(html).toContain(`data-length="${drawStartLength(4.3)}"`)
  })

  it('shows the solution segment when disabled', () => {
    const html = renderToStaticMarkup(
      createElement(RulerMeasure, {
        mode: 'draw',
        lengthCm: 4.3,
        value: blank,
        onChange: () => {},
        disabled: true,
      }),
    )
    expect(html).toContain('ruler-measure__solution')
  })

  it('shows a typed measure value with a decimal comma', () => {
    const html = renderToStaticMarkup(
      createElement(RulerMeasure, {
        mode: 'measure',
        lengthCm: 4.3,
        value: { kind: 'rulerMeasure', length: 4.3, touched: true },
        onChange: () => {},
      }),
    )
    expect(html).toContain('value="4,3"')
  })
})
