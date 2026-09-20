import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { NumberLineSlider } from './NumberLineSlider'

describe('NumberLineSlider', () => {
  it('renders without crashing', () => {
    const onChange = vi.fn()
    const html = renderToStaticMarkup(
      createElement(NumberLineSlider, {
        min: 0,
        max: 10,
        step: 1,
        value: 5,
        onChange,
      })
    )
    expect(html).toContain('<svg')
  })

  it('displays label when provided', () => {
    const onChange = vi.fn()
    const html = renderToStaticMarkup(
      createElement(NumberLineSlider, {
        min: 0,
        max: 10,
        step: 1,
        value: 5,
        onChange,
        label: 'Wähle eine Zahl:',
      })
    )
    expect(html).toContain('Wähle eine Zahl:')
  })

  it('formats decimal numbers correctly', () => {
    const onChange = vi.fn()
    const html = renderToStaticMarkup(
      createElement(NumberLineSlider, {
        min: 0,
        max: 1,
        step: 0.1,
        value: 0.5,
        onChange,
        decimals: 1,
      }),
    )
    expect(html).toContain('0,5')
  })

  it('uses sparse labels when labelStep is set', () => {
    const onChange = vi.fn()
    const html = renderToStaticMarkup(
      createElement(NumberLineSlider, {
        min: -20,
        max: 100,
        step: 1,
        value: -20,
        onChange,
        labelStep: 20,
      }),
    )
    expect(html).toMatch(/>0<\/text>/)
    expect(html).toMatch(/>20<\/text>/)
    expect(html).not.toMatch(/>5<\/text>/)
    expect(html).not.toMatch(/>15<\/text>/)
  })
})
