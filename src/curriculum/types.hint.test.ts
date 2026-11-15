import { describe, expect, it } from 'vitest'
import { isFormulaLikeHint, stripStrategySpoilers } from './types'

describe('isFormulaLikeHint', () => {
  it('flags sum and equality spoilers (Fachwissen, not sticky hint)', () => {
    expect(isFormulaLikeHint('Nebenwinkel ergänzen sich zu 180°.')).toBe(true)
    expect(isFormulaLikeHint('Die Innenwinkel im Dreieck ergeben zusammen 180°.')).toBe(true)
    expect(isFormulaLikeHint('Die Innenwinkel im Viereck ergeben zusammen 360°.')).toBe(true)
    expect(isFormulaLikeHint('Scheitelwinkel und Stufenwinkel sind gleich groß.')).toBe(true)
    expect(isFormulaLikeHint('Die beiden Basiswinkel sind gleich groß.')).toBe(true)
  })

  it('does not flag short strategy/format tips as formulas', () => {
    expect(isFormulaLikeHint('Tippe den Nebenwinkel:')).toBe(false)
    expect(isFormulaLikeHint('Ordne die Schritte einer Mittelsenkrechten.')).toBe(false)
    expect(isFormulaLikeHint('Achte auf die Vorzeichen.')).toBe(false)
  })
})

describe('stripStrategySpoilers', () => {
  it('removes pure meta strategy sentences', () => {
    expect(
      stripStrategySpoilers(
        '12 + 34 = 46. Achte beim Addieren auf den Übertrag an jeder Stelle.',
      ),
    ).toBe('12 + 34 = 46.')
    expect(stripStrategySpoilers('Achte auf die Vorzeichen.')).toBe('')
  })

  it('keeps calculation sentences that include the result', () => {
    expect(
      stripStrategySpoilers(
        'Schau auf die Ziffer nach der Rundungsstelle: 1234 ≈ 1200.',
      ),
    ).toContain('≈')
  })

  it('keeps pure calculation explanations', () => {
    expect(stripStrategySpoilers('3 · 4 = 12.')).toBe('3 · 4 = 12.')
  })
})
