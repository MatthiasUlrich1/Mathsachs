import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TASK_REQUEST_GRADES } from '../legal/taskRequest'
import { TaskRequest } from './TaskRequest'

describe('TaskRequest form', () => {
  it('asks for Klassenstufe, Themengebiet, Titel and Aufgabenbeispiel', () => {
    const html = renderToStaticMarkup(createElement(TaskRequest))
    expect(html).toContain('Aufgaben ergänzen')
    expect(html).toContain('Klassenstufe')
    expect(html).toContain('Themengebiet')
    expect(html).toContain('Titel des Themas')
    expect(html).toContain('Aufgabenbeispiel')
    expect(html).toContain('Vorgaben senden')
    expect(html).toContain('disabled')
    expect(html).not.toContain('mailto:')
    for (const grade of TASK_REQUEST_GRADES) {
      expect(html).toContain(grade)
    }
  })

  it('does not mention Worker storage of the request', () => {
    const html = renderToStaticMarkup(createElement(TaskRequest))
    expect(html).toContain('keine Personendaten')
    expect(html).not.toContain('Cloudflare speichert die Anfrage')
  })
})
