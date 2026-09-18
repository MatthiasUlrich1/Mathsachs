import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DragDropSlots } from './DragDropSlots'

describe('DragDropSlots', () => {
  const items = [
    { label: 'V =', value: 1 },
    { label: 'l', value: 2 },
    { label: '× b', value: 3 },
    { label: '× h', value: 4 },
    { label: '× m', value: 5 },
  ]

  it('renders pool chips and empty slots', () => {
    const html = renderToStaticMarkup(
      createElement(DragDropSlots, {
        items,
        slots: [null, null, null, null],
        onChange: vi.fn(),
        instruction: 'Ziehe die richtigen Blöcke in die Formel:',
      }),
    )
    expect(html).toContain('V =')
    expect(html).toContain('× m')
    expect(html).toContain('drag-drop-slots__slot')
    expect(html).toContain('Ziehe die richtigen Blöcke in die Formel:')
  })

  it('keeps unused blocks in the pool when slots are partly filled', () => {
    const html = renderToStaticMarkup(
      createElement(DragDropSlots, {
        items,
        slots: [0, 1, null, null],
        onChange: vi.fn(),
      }),
    )
    expect(html).toContain('× b')
    expect(html).toContain('× h')
    expect(html).toContain('× m')
    // Filled slots render chip labels too
    expect(html).toContain('V =')
    expect(html).toContain('l')
  })
})
