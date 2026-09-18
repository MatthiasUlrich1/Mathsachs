import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ReportFaultyTask } from './ReportFaultyTask'

describe('ReportFaultyTask', () => {
  it('shows the report button with the topic content ID available after open', () => {
    const html = renderToStaticMarkup(
      createElement(ReportFaultyTask, {
        topicId: 'ph-k6-lb2-volumen',
        topicTitle: 'Volumen bestimmen',
        contentId: 6453,
        question: 'Testfrage',
      }),
    )
    expect(html).toContain('Aufgabe als fehlerhaft melden!')
    expect(html).not.toContain('Senden')
  })
})
