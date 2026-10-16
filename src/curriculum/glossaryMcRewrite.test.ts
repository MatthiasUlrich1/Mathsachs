import { describe, expect, it } from 'vitest'
import {
  concreteGlossaryStem,
  expandGlossaryAnswer,
  isConcreteGlossaryStem,
  isVagueGlossaryStem,
  rewriteVagueGlossaryPrompt,
} from './glossaryMcRewrite'
import { rewritePhysikPrompt } from './physikBank'
import { rewriteDefinitionStylePrompt } from './biologieBank'

describe('glossaryMcRewrite Timer-caliber', () => {
  it('never emits Was trifft as final stem', () => {
    const stems = [
      rewriteVagueGlossaryPrompt('Was trifft auf „Pixel“ zu?'),
      rewriteVagueGlossaryPrompt('Was trifft im Thema Diffusion auf „Temperatur“ zu?'),
      rewriteVagueGlossaryPrompt('Welche Aussage zu „Quelle“ ist fachlich richtig?'),
      rewriteVagueGlossaryPrompt('Was ist fachlich richtig?'),
      concreteGlossaryStem('Transparent', 'Lichtdurchlässige Körper', 'Lässt Licht klar durch'),
      concreteGlossaryStem('Timer/Sensor', 'Lichtverschmutzung', 'Schaltet bei Bedarf'),
    ]
    for (const s of stems) {
      expect(s).toBeTruthy()
      expect(s!).not.toMatch(/Was trifft/i)
      expect(s!).not.toMatch(/fachlich richtig/i)
      expect(isVagueGlossaryStem(s!)).toBe(false)
      expect(isConcreteGlossaryStem(s!)).toBe(true)
    }
  })

  it('builds Transparent / Quelle / Timer-style stems', () => {
    expect(
      concreteGlossaryStem('Transparent', 'Lichtdurchlässige Körper', 'Lässt Licht klar durch'),
    ).toBe('Welche Eigenschaft hat ein transparenter Körper?')
    expect(concreteGlossaryStem('Quelle', 'Quellen', 'Überrest oder Tradition')).toBe(
      'Was versteht man in der Geschichtswissenschaft unter einer Quelle?',
    )
    expect(
      concreteGlossaryStem(
        'Timer/Sensor',
        'Lichtverschmutzung',
        'Schaltet Beleuchtung nur bei Bedarf ein',
      ),
    ).toMatch(/^Wozu dienen Timer oder Sensor/)
  })

  it('expands fragments into full parallel options', () => {
    const ans = expandGlossaryAnswer('Lässt Licht klar durch', {
      term: 'Transparent',
      style: 'property',
    })
    expect(ans).toMatch(/^Er lässt/i)
    expect(ans.split(/\s+/).length).toBeGreaterThanOrEqual(4)

    const def = expandGlossaryAnswer('Zeitliche Ordnung', {
      term: 'Chronologie',
      style: 'definition',
    })
    expect(def).toMatch(/^Darunter versteht man/i)
  })

  it('physik/bio sanitizer entry points rewrite vague stems', () => {
    expect(
      rewritePhysikPrompt(
        'Was trifft im Thema Lichtdurchlässige Körper auf „Transparent“ zu?',
        'Lässt Licht klar durch',
      ),
    ).toBe('Welche Eigenschaft hat ein transparenter Körper?')
    expect(
      rewriteDefinitionStylePrompt('Was trifft auf „Quelle“ zu?', {
        term: 'Quelle',
        meaning: 'Überrest oder Tradition zur Vergangenheit',
      }),
    ).toBe('Was versteht man in der Geschichtswissenschaft unter einer Quelle?')
  })
})
