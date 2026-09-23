import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { math8GraphicReviews } from '../curriculum/graphicReviewTopics'
import { Worksheet } from './Worksheet'

describe('Worksheet', () => {
  it('embeds SVG visuals for freigegebene K8 grafik topics', () => {
    const topic = math8GraphicReviews.find(
      (t) => t.id === 'k8-lb3-achsenabschnitt__grafik',
    )
    expect(topic).toBeTruthy()
    const html = renderToStaticMarkup(
      createElement(Worksheet, {
        topic: topic!,
        areaTitle: 'LB3',
        gradeTitle: 'Klasse 8',
        onExit: () => undefined,
      }),
    )
    expect(html).toContain('Übungsblatt')
    expect(html).toContain('task-visual')
    expect(html).toMatch(/<svg[\s>]/i)
    expect(html).toContain('sheet__paper-hint')
  })
})
