import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MyReportedTasksPanel } from './MyReportedTasksPanel'

describe('MyReportedTasksPanel', () => {
  it('renders the reporter list shell while loading', () => {
    const html = renderToStaticMarkup(createElement(MyReportedTasksPanel))
    expect(html).toContain('Meine Meldungen')
    expect(html).toContain('Lädt')
    expect(html).not.toContain('Als korrigiert melden')
    expect(html).not.toContain('Erledigt')
    expect(html).not.toContain('Löschen')
    expect(html).not.toContain('Fehlerhafte Aufgabe anzeigen')
  })
})
