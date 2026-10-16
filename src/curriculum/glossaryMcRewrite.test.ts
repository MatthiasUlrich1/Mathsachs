import { describe, expect, it } from 'vitest'
import {
  concreteGlossaryStem,
  expandGlossaryAnswer,
  isConcreteGlossaryStem,
  isMechanicalGlossaryOption,
  isVagueGlossaryStem,
  isWeakGlossaryOption,
  rewriteVagueGlossaryPrompt,
} from './glossaryMcRewrite'
import { rewritePhysikPrompt } from './physikBank'
import { rewriteDefinitionStylePrompt } from './biologieBank'

describe('glossaryMcRewrite Timer-caliber', () => {
  it('never emits Was trifft / Was versteht man (except Quelle) / Darunter wraps', () => {
    const stems = [
      rewriteVagueGlossaryPrompt('Was trifft auf „Pixel“ zu?'),
      rewriteVagueGlossaryPrompt('Was trifft im Thema Diffusion auf „Temperatur“ zu?'),
      rewriteVagueGlossaryPrompt('Welche Aussage zu „Quelle“ ist fachlich richtig?'),
      rewriteVagueGlossaryPrompt('Was ist fachlich richtig?'),
      rewriteVagueGlossaryPrompt('Was versteht man im Thema Atmungsvergleich unter einer Kieme?', {
        meaning: 'Atemorgan für Wasser',
      }),
      rewriteVagueGlossaryPrompt('Was bewirkt oder beschreibt Absorption im Thema Licht?', {
        meaning: 'Licht wird aufgenommen',
      }),
      concreteGlossaryStem('Transparent', 'Lichtdurchlässige Körper', 'Lässt Licht klar durch'),
      concreteGlossaryStem('Timer/Sensor', 'Lichtverschmutzung', 'Schaltet bei Bedarf'),
      concreteGlossaryStem('Kieme', 'Atmungsvergleich', 'Atemorgan für Wasser'),
    ]
    for (const s of stems) {
      expect(s).toBeTruthy()
      expect(s!).not.toMatch(/Was trifft/i)
      expect(s!).not.toMatch(/fachlich richtig/i)
      expect(s!).not.toMatch(/Was bewirkt oder beschreibt/i)
      expect(isVagueGlossaryStem(s!)).toBe(false)
      expect(isConcreteGlossaryStem(s!)).toBe(true)
    }
    const kieme = concreteGlossaryStem('Kieme', 'Atmungsvergleich', 'Atemorgan für Wasser')
    expect(kieme).toMatch(/^Wozu dient die Kieme/i)
    expect(kieme).not.toMatch(/Was versteht man/i)
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

  it('expands fragments into full parallel options without Darunter wraps', () => {
    const ans = expandGlossaryAnswer('Lässt Licht klar durch', {
      term: 'Transparent',
      style: 'property',
    })
    expect(ans).toMatch(/^Er lässt/i)
    expect(ans.split(/\s+/).length).toBeGreaterThanOrEqual(4)
    expect(ans).not.toMatch(/Darunter versteht man/i)

    const def = expandGlossaryAnswer('Zeitliche Ordnung', {
      term: 'Chronologie',
      style: 'definition',
    })
    expect(def).toMatch(
      /^(Es handelt sich um|Das ist|Sie bildet|Sie fasst|Chronologie entspricht|Chronologie meint)\b/i,
    )
    expect(def).not.toMatch(/Darunter versteht man/i)
    expect(def).not.toMatch(/^Sie bezeichnet\b/i)
    expect(def).not.toMatch(/^Sie kennzeichnet\b/i)
    expect(def).not.toMatch(/^Sie steht für\b/i)
    expect(def).not.toMatch(/^Gemeint ist\b/i)
    expect(isMechanicalGlossaryOption('Sie kennzeichnet die zeitliche Ordnung.')).toBe(true)
    expect(isMechanicalGlossaryOption('Es steht für den Bereich ohne Licht.')).toBe(true)

    // Bank full sentences stay; short Gemeint wraps are rebuilt
    const bankFull =
      'Sie entzieht dem Wasser Sauerstoff und dient der Atmung.'
    expect(expandGlossaryAnswer(bankFull, { term: 'Kieme', style: 'purpose' })).toBe(bankFull)
    expect(isWeakGlossaryOption('Gemeint ist: Äußere Schutzschicht.')).toBe(true)
    const rebuilt = expandGlossaryAnswer('Gemeint ist: Äußere Schutzschicht.', {
      term: 'Schuppe',
      style: 'definition',
    })
    expect(rebuilt).not.toMatch(/^Gemeint ist\b/i)
    expect(rebuilt.split(/\s+/).length).toBeGreaterThanOrEqual(4)

    const kieme = expandGlossaryAnswer('Darunter versteht man den atemorgan für Wasser.', {
      term: 'Kieme',
      style: 'purpose',
    })
    expect(isWeakGlossaryOption('Darunter versteht man den atemorgan für Wasser.')).toBe(true)
    expect(kieme).not.toMatch(/Darunter versteht man/i)
    expect(kieme).toMatch(/Atemorgan/i)
    expect(kieme).not.toMatch(/atemorgan/)
  })

  it('rebuilds mechanical Sie ist/bezeichnet wrappers into natural options', () => {
    expect(isMechanicalGlossaryOption('Sie bezeichnet die Geradliniges Modell der Lichtausbreitung.')).toBe(
      true,
    )
    expect(isMechanicalGlossaryOption('Sie ist das Körper der Selbst Licht Aussendet.')).toBe(true)
    expect(
      isMechanicalGlossaryOption(
        'Sie ist das Atemorgan, mit dem Sauerstoff aus dem Wasser aufgenommen wird.',
      ),
    ).toBe(false)

    const licht = expandGlossaryAnswer('Sie ist das Körper der Selbst Licht Aussendet.', {
      term: 'Lichtquelle',
      style: 'definition',
    })
    expect(licht).not.toMatch(/^Sie bezeichnet\b/i)
    expect(licht).not.toMatch(/\bSelbst\b/)
    expect(licht).not.toMatch(/\bAussendet\b/)
    expect(licht.toLowerCase()).toMatch(/körper/)
    expect(licht.toLowerCase()).toMatch(/aussendet/)

    const modell = expandGlossaryAnswer('Geradliniges Modell der Lichtausbreitung', {
      term: 'Lichtstrahl',
      style: 'definition',
    })
    expect(modell).not.toMatch(/^Sie bezeichnet\b/i)
    expect(modell).not.toMatch(/^Es bezeichnet\b/i)
    expect(modell).toMatch(/[Mm]odell/)
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
    expect(
      rewriteDefinitionStylePrompt('Was versteht man im Thema Atmungsvergleich unter einer Kieme?', {
        term: 'Kieme',
        meaning: 'Atemorgan für Wasser',
      }),
    ).toMatch(/^Wozu dient die Kieme/i)
  })
})
