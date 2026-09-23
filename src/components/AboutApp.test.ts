import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { AboutApp } from './AboutApp'

describe('AboutApp user guide', () => {
  it('lists all TOC anchors and excludes developer tooling', () => {
    const html = renderToStaticMarkup(createElement(AboutApp))
    expect(html).toContain('id="guide-start"')
    expect(html).toContain('id="guide-homescreen"')
    expect(html).toContain('href="#guide-klausur"')
    expect(html).toContain('Challenge')
    expect(html).toContain('Übungsklausuren')
    expect(html).toContain('WLAN-Zugang')
    expect(html).not.toContain('Fehlerhafte Aufgaben')
    expect(html).not.toContain('Aufgaben-Prüfung')
    expect(html).not.toContain('freigabe')
  })
})
