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

describe('glossaryMcRewrite safe minimal', () => {
  it('never emits Was trifft / fachlich richtig / Darunter / im Thema pads', () => {
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
      expect(s!).not.toMatch(/ im Thema /i)
      expect(isVagueGlossaryStem(s!)).toBe(false)
      expect(isConcreteGlossaryStem(s!)).toBe(true)
    }
    const kieme = concreteGlossaryStem('Kieme', 'Atmungsvergleich', 'Atemorgan für Wasser')
    expect(kieme).toMatch(/^Wozu dient die Kieme/i)
    expect(kieme).not.toMatch(/Was versteht man/i)
  })

  it('builds Transparent / Quelle / Timer-style stems without topic pads', () => {
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

  it('expands fragments safely without stock pads or Sie-bezeichnet mash', () => {
    const ans = expandGlossaryAnswer('Lässt Licht klar durch', {
      term: 'Transparent',
      style: 'property',
    })
    expect(ans).toMatch(/^Er lässt/i)
    expect(ans).not.toMatch(/Darunter versteht man/i)
    expect(ans).not.toMatch(/— so bei/i)
    expect(ans).not.toMatch(/Nachbarbegriff/i)

    const def = expandGlossaryAnswer('Zeitliche Ordnung', {
      term: 'Chronologie',
      style: 'definition',
    })
    expect(def).toMatch(/zeitliche Ordnung/i)
    expect(def).not.toMatch(/ist hier:/i)
    expect(def).not.toMatch(/kurz gesagt:/i)
    expect(def).not.toMatch(/Es geht um/i)
    expect(def).not.toMatch(/und zwar gilt/i)
    expect(def).not.toMatch(/steht im Kern für Folgendes/i)
    expect(def).not.toMatch(/fasst zusammen/i)
    expect(def).not.toMatch(/Darunter versteht man/i)
    expect(def).not.toMatch(/^Sie bezeichnet\b/i)
    expect(def).not.toMatch(/— so bei/i)
    expect(isMechanicalGlossaryOption(def)).toBe(false)
    expect(isMechanicalGlossaryOption('Sie kennzeichnet die zeitliche Ordnung.')).toBe(true)
    expect(isMechanicalGlossaryOption('Sie steht im Kern für Folgendes: Zeitliche Ordnung.')).toBe(
      true,
    )

    const bankFull = 'Sie entzieht dem Wasser Sauerstoff und dient der Atmung.'
    expect(expandGlossaryAnswer(bankFull, { term: 'Kieme', style: 'purpose' })).toBe(bankFull)

    expect(isWeakGlossaryOption('Gemeint ist: Äußere Schutzschicht.')).toBe(true)
    const rebuilt = expandGlossaryAnswer('Gemeint ist: Äußere Schutzschicht.', {
      term: 'Schuppe',
      style: 'definition',
    })
    expect(rebuilt).not.toMatch(/^Gemeint ist\b/i)
    expect(rebuilt).not.toMatch(/— so bei/i)

    const kieme = expandGlossaryAnswer('Darunter versteht man den atemorgan für Wasser.', {
      term: 'Kieme',
      style: 'purpose',
    })
    expect(kieme).not.toMatch(/Darunter versteht man/i)
    expect(kieme.toLowerCase()).toMatch(/atemorgan/)
  })

  it('rebuilds mechanical wrappers without inventing banned tails', () => {
    expect(isMechanicalGlossaryOption('Sie bezeichnet die Geradliniges Modell der Lichtausbreitung.')).toBe(
      true,
    )
    expect(isMechanicalGlossaryOption('Sie ist das Körper der Selbst Licht Aussendet.')).toBe(true)

    const licht = expandGlossaryAnswer('Sie ist das Körper der Selbst Licht Aussendet.', {
      term: 'Lichtquelle',
      style: 'definition',
    })
    expect(licht).not.toMatch(/^Sie bezeichnet\b/i)
    expect(licht).not.toMatch(/— so bei/i)
    expect(licht).not.toMatch(/Nachbarbegriff/i)
    expect(licht.toLowerCase()).toMatch(/körper/)

    const modell = expandGlossaryAnswer('Geradliniges Modell der Lichtausbreitung', {
      term: 'Lichtstrahl',
      style: 'definition',
    })
    expect(modell).not.toMatch(/^Sie bezeichnet\b/i)
    expect(modell).toMatch(/[Mm]odell/)
    expect(modell).not.toMatch(/ist hier:/i)
    expect(modell).not.toMatch(/kurz gesagt:/i)
    expect(modell).not.toMatch(/Es geht um/i)
    expect(modell).not.toMatch(/und zwar gilt/i)
    expect(modell).not.toMatch(/steht im Kern für Folgendes/i)
    expect(modell).not.toMatch(/fasst zusammen/i)
    expect(modell).not.toMatch(/— so bei/i)
    expect(isMechanicalGlossaryOption('Die Religion ist hier: Glaubensvorstellungen.')).toBe(true)
    expect(isMechanicalGlossaryOption('Es geht um Glaubensvorstellungen.')).toBe(true)
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
