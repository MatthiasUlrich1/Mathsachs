import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ExploreBoard } from './ExploreBoard'

const html = (boardId: string, params?: Record<string, number>) =>
  renderToStaticMarkup(createElement(ExploreBoard, { boardId, params }))

describe('ExploreBoard', () => {
  it('unbekannte Board-ID rendert nichts und stuerzt nicht ab', () => {
    expect(html('gibt-es-nicht')).toBe('')
    expect(html('')).toBe('')
  })

  it('winkelarten: Bild mit Beschriftung, Live-Caption, Regler und Schalter mit Label', () => {
    const m = html('winkelarten', { winkel: 135 })
    expect(m).toContain('role="img"')
    expect(m).toContain('aria-label="Der Winkel ist 135° groß, das ist ein stumpfer Winkel')
    expect(m).toContain('aria-live="polite"')
    expect(m).toContain('viewBox="0 0 400 260"')
    expect(m).toContain('type="range"')
    expect(m).toContain('min="0"')
    expect(m).toContain('max="360"')
    expect(m).toContain('step="5"')
    expect(m).toContain('value="135"')
    expect(m).toContain('type="checkbox"')
    expect(m).toContain('Gradzahl anzeigen')
    expect(m).toMatch(/<label[^>]*for="[^"]+"[^>]*>Winkel: <strong>135°<\/strong>/)
  })

  it('mittelsenkrechte: zwei Schalter, Radius mit Komma', () => {
    const m = html('mittelsenkrechte')
    expect(m).toContain('Mittelsenkrechte zeigen')
    expect(m).toContain('Strecke AB')
    expect(m).toContain('Radius r: <strong>2 cm</strong>')
    expect((m.match(/type="checkbox"/g) ?? []).length).toBe(2)
    expect(html('mittelsenkrechte', { radius: 3.5 })).toContain('3,5 cm')
  })

  it('bruchErweitern: Zaehler-Regler ist durch den Nenner begrenzt', () => {
    const m = html('bruchErweitern', { nenner: 4, zaehler: 9, faktor: 3 })
    expect(m).toContain('4/4 = 12/12')
    expect(m).toMatch(/id="[^"]*-zaehler" type="range" min="1" max="4"/)
  })
})
