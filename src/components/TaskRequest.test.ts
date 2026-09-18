import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TaskRequest } from './TaskRequest'

describe('TaskRequest form', () => {
  it('asks for Lehrplan, Klassenstufe, Themengebiet, Titel and Aufgabenbeispiel', () => {
    const html = renderToStaticMarkup(createElement(TaskRequest))
    expect(html).toContain('Aufgaben ergänzen')
    expect(html).toContain('Lehrplan')
    expect(html).toContain('Klassenstufe')
    expect(html).toContain('Themengebiet')
    expect(html).toContain('Titel des Themas')
    expect(html).toContain('Aufgabenbeispiel')
    expect(html).toContain('Vorgaben senden')
    expect(html).toContain('disabled')
    expect(html).not.toContain('mailto:')
    expect(html).toContain('Lehrplan wählen')
  })

  it('keeps Klassenstufe and Themengebiet disabled until prior steps are chosen', () => {
    const html = renderToStaticMarkup(createElement(TaskRequest))
    expect(html).toMatch(
      /<select[^>]*id="task-request-grade"[^>]*disabled/,
    )
    expect(html).toMatch(
      /<select[^>]*id="task-request-area"[^>]*disabled/,
    )
    expect(html).not.toMatch(/<input[^>]*id="task-request-area"/)
    expect(html).toContain('Zuerst Lehrplan wählen')
    expect(html).toContain('Zuerst Klassenstufe wählen')
  })

  it('hints that examples may be attached and offers „siehe Anhang“', () => {
    const html = renderToStaticMarkup(createElement(TaskRequest))
    expect(html).toContain('Anhang an die E-Mail hängen')
    expect(html).toContain('siehe Anhang')
    expect(html).toContain('siehe Anhang eintragen')
  })

  it('does not mention Worker storage of the request', () => {
    const html = renderToStaticMarkup(createElement(TaskRequest))
    expect(html).toContain('keine Personendaten')
    expect(html).not.toContain('Cloudflare speichert die Anfrage')
  })
})
