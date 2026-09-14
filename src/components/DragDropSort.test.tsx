import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DragDropSort } from './DragDropSort'

describe('DragDropSort', () => {
  const items = [
    { label: '1,5 m', value: 150 },
    { label: '130 cm', value: 130 },
    { label: '14 dm', value: 140 },
  ]

  it('renders all items', () => {
    const onChange = vi.fn()
    const html = renderToStaticMarkup(
      createElement(DragDropSort, {
        items,
        userOrder: [0, 1, 2],
        onChange,
      })
    )
    expect(html).toContain('1,5 m')
    expect(html).toContain('130 cm')
    expect(html).toContain('14 dm')
  })

  it('displays instruction when provided', () => {
    const onChange = vi.fn()
    const html = renderToStaticMarkup(
      createElement(DragDropSort, {
        items,
        userOrder: [0, 1, 2],
        onChange,
        instruction: 'Sortiere von klein nach groß',
      })
    )
    expect(html).toContain('Sortiere von klein nach groß')
  })

  it('renders items in user order', () => {
    const onChange = vi.fn()
    const html = renderToStaticMarkup(
      createElement(DragDropSort, {
        items,
        userOrder: [2, 0, 1], // 14 dm, 1.5 m, 130 cm
        onChange,
      })
    )
    // Check that 14 dm appears before 1,5 m in the output
    const dm14Idx = html.indexOf('14 dm')
    const m15Idx = html.indexOf('1,5 m')
    const cm130Idx = html.indexOf('130 cm')
    expect(dm14Idx).toBeLessThan(m15Idx)
    expect(m15Idx).toBeLessThan(cm130Idx)
  })
})
