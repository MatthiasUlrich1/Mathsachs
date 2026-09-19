import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { TaskReportFixedBanner } from './TaskReportFixedBanner'

describe('TaskReportFixedBanner', () => {
  it('shows fixed status and the individual Entwickler reply', () => {
    const html = renderToStaticMarkup(
      createElement(TaskReportFixedBanner, {
        update: {
          id: 'ABCD1234',
          status: 'fixed',
          contentId: 6453,
          replyMessage: 'Lösung war vertauscht — danke!',
        },
        onDismiss: vi.fn(),
      }),
    )
    expect(html).toContain('Aufgabe wurde korrigiert')
    expect(html).toContain('Nachricht vom Entwickler')
    expect(html).toContain('Lösung war vertauscht — danke!')
    expect(html).toContain('ID 6453')
  })
})
