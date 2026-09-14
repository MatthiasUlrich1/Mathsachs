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
      })
    )
    // Check that German decimal format is used (comma instead of dot)
    expect(html).toContain('0,5')
  })
})
