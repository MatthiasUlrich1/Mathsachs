import { describe, expect, it } from 'vitest'
import { isFormulaLikeHint } from './types'

describe('isFormulaLikeHint', () => {
  it('hides sum and equality spoilers under the task', () => {
    expect(isFormulaLikeHint('Nebenwinkel ergänzen sich zu 180°.')).toBe(true)
    expect(isFormulaLikeHint('Die Innenwinkel im Dreieck ergeben zusammen 180°.')).toBe(true)
    expect(isFormulaLikeHint('Die Innenwinkel im Viereck ergeben zusammen 360°.')).toBe(true)
    expect(isFormulaLikeHint('Scheitelwinkel und Stufenwinkel sind gleich groß.')).toBe(true)
    expect(isFormulaLikeHint('Die beiden Basiswinkel sind gleich groß.')).toBe(true)
  })

  it('keeps strategy / format hints visible', () => {
    expect(isFormulaLikeHint('Tippe den Nebenwinkel:')).toBe(false)
    expect(isFormulaLikeHint('Ordne die Schritte einer Mittelsenkrechten.')).toBe(false)
    expect(isFormulaLikeHint('Achte auf die Vorzeichen.')).toBe(false)
  })
})
