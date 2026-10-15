import { describe, expect, it } from 'vitest'
import {
  isSloganOrStubClaim,
  isSloganOrStubMeaning,
  sanitizeBioBank,
} from './biologieBank'

describe('isSloganOrStubClaim', () => {
  it('rejects slogan TF like Sicherheit: Wasser und Strom', () => {
    expect(isSloganOrStubClaim('Sicherheit: Wasser und Strom.')).toBe(true)
  })

  it('rejects thin-fill templates', () => {
    expect(isSloganOrStubClaim('[lb1-schriftliches-rechnen] Begriff: Zeichnung zum Sachverhalt.')).toBe(
      true,
    )
    expect(isSloganOrStubClaim('[x] Rechnung: Zahlenaufgabe zu foo.')).toBe(true)
  })

  it('accepts full testable sentences', () => {
    expect(
      isSloganOrStubClaim(
        'Mit nassen Händen steigt die Leitfähigkeit der Haut — Elektrogeräte sind dann besonders gefährlich.',
      ),
    ).toBe(false)
    expect(isSloganOrStubClaim('Im Gleichgewicht gilt am Hebel F₁ · l₁ = F₂ · l₂.')).toBe(false)
  })
})

describe('sanitizeBioBank drops slogan stubs', () => {
  it('filters Sicherheit/Wasser-und-Strom pair and slogan TF', () => {
    const clean = sanitizeBioBank({
      quelle: 't',
      url: 'https://example.com',
      pairs: [
        { term: 'Sicherheit', meaning: 'Wasser und Strom', wissen: 'x' },
        { term: 'Metallleitung', meaning: 'Freie Elektronen im Gitter', wissen: 'y' },
      ],
      trueFalse: [
        {
          statement: 'Sicherheit: Wasser und Strom.',
          correct: true,
          explanation: 'x',
          wissen: 'x',
        },
        {
          statement:
            'Mit nassen Händen steigt die Leitfähigkeit der Haut an Elektrogeräten deutlich.',
          correct: true,
          explanation: 'y',
          wissen: 'y',
        },
      ],
    })
    expect(clean.pairs?.some((p) => /Wasser und Strom/i.test(p.meaning))).toBe(false)
    expect(clean.trueFalse?.some((t) => /Wasser und Strom/i.test(t.statement))).toBe(false)
    expect(clean.trueFalse?.length).toBe(1)
  })

  it('isSloganOrStubMeaning catches meta labels', () => {
    expect(isSloganOrStubMeaning('Sicherheit', 'Wasser und Strom')).toBe(true)
    expect(isSloganOrStubMeaning('Metallleitung', 'Freie Elektronen')).toBe(false)
  })
})
