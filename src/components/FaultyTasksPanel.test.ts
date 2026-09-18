import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { FaultyTasksPanel } from './FaultyTasksPanel'

describe('FaultyTasksPanel', () => {
  it('renders the developer list shell while loading', () => {
    const html = renderToStaticMarkup(
      createElement(FaultyTasksPanel, { onShowTask: vi.fn() }),
    )
    expect(html).toContain('Fehlerhafte Aufgaben')
    expect(html).toContain('Lädt')
    expect(html).toContain('Erledigte Meldungen')
  })
})
