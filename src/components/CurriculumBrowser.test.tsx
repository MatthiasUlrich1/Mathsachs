import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CurriculumBrowser } from './CurriculumBrowser'
import type { Grade, Topic } from '../curriculum/types'

const topic = (id: string, title: string, extra: Partial<Topic> = {}): Topic =>
  ({ id, title, pointsPerTask: 1, ...extra }) as Topic

const grade = {
  id: 'g',
  title: 'Klasse 5',
  packId: 'p',
  areas: [
    {
      id: 'a1',
      title: 'Zahlen',
      topics: [
        topic('t1', 'Brüche'),
        topic('t1__neu', 'Brüche Neu', { released: false, neu: true }),
        topic('t3', 'Platzhalter', { outlineOnly: true }),
      ],
    },
    { id: 'a2', title: 'Geheimbereich', topics: [topic('t2__neu', 'Nur Neu', { released: false, neu: true })] },
  ],
} as unknown as Grade

const render = (curriculumDevPreview: boolean) =>
  renderToStaticMarkup(
    createElement(CurriculumBrowser, {
      grade,
      curriculumDevPreview,
      onPractice: () => {},
      onWorksheet: () => {},
    }),
  )

describe('CurriculumBrowser Sichtbarkeit gesperrter Themen', () => {
  it('students do not see locked topics, their counter or empty areas', () => {
    const html = render(false)
    expect(html).toContain('Brüche')
    expect(html).not.toContain('Brüche Neu')
    expect(html).not.toContain('Nur Neu')
    expect(html).not.toContain('Geheimbereich')
    expect(html).not.toContain('gesperrt')
    expect(html).toContain('2 Themen')
    // genuine outline placeholder stays visible as unavailable
    expect(html).toContain('Noch keine Aufgaben enthalten')
  })

  it('pruefer/entwickler preview still sees locked topics with a badge', () => {
    const html = render(true)
    expect(html).toContain('Brüche Neu')
    expect(html).toContain('Geheimbereich')
    expect(html).toContain('gesperrt')
    expect(html).toContain('3 Themen')
  })
})
