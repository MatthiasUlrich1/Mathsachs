/**
 * Mathematik-Banken: nur MC / Wert — keine Zuordnung, keine Lücken, kein TF.
 * siehe `.cursor/rules/curriculum-aufgaben-qualitaet.mdc`
 */
import { type Rng } from '../lib/rng'
import { mixedVariants, valueTask } from './taskHelpers'
import { sanitizeBioBank, type BioBank } from './biologieBank'
import { mcTask, pick, shuffle } from './biologieHelpers'
import type { Topic } from './types'

function conceptKey(concept: string | undefined, prefix: string | undefined, fallback: string): string {
  if (concept?.trim()) return concept
  const p = prefix?.trim()
  return p ? `${p}:${fallback.slice(0, 48)}` : fallback.slice(0, 64)
}

/**
 * Mathe-sichere Bank: Facts → MC, Pairs → MC (nie Match/Cloze/TF).
 * trueFalse-Einträge werden bewusst ignoriert (Mathe: kein TF).
 */
export function mathBankGenerate(bank: BioBank): Topic['generate'] {
  bank = sanitizeBioBank(bank)
  const prefix = bank.conceptPrefix
  const variants: Array<(rng: Rng) => ReturnType<Topic['generate']>> = []

  if (bank.facts?.length) {
    variants.push((rng) => {
      const f = pick(rng, bank.facts!)
      const key = conceptKey(f.concept, prefix, f.prompt)
      const wrong =
        f.wrong?.length && f.wrong.length >= 3
          ? shuffle(rng, f.wrong).slice(0, 3)
          : shuffle(
              rng,
              bank.facts!.filter((x) => x.answer !== f.answer).map((x) => x.answer),
            ).slice(0, 3)
      while (wrong.length < 3) wrong.push(`Nicht: ${f.answer} (${wrong.length})`)
      const question = f.prompt.replace(/\s*__+\s*/g, ' … ').trim()
      return mcTask(rng, {
        question,
        correct: f.answer,
        wrong,
        explanation: f.explanation,
        fachwissen: {
          text: f.wissen || f.explanation,
          quelle: bank.quelle,
          url: bank.url,
        },
        dedupeKey: key,
        contentIds: [key],
      })
    })
  }

  if (bank.pairs && bank.pairs.length >= 3) {
    variants.push((rng) => {
      const p = pick(rng, bank.pairs!)
      const key = conceptKey(p.concept, prefix, p.term)
      const wrong = shuffle(
        rng,
        bank.pairs!.filter((x) => x.meaning !== p.meaning).map((x) => x.meaning),
      ).slice(0, 3)
      while (wrong.length < 3) wrong.push(`Andere Aussage (${wrong.length})`)
      return mcTask(rng, {
        question: `Welche Aussage zu „${p.term}“ ist richtig?`,
        correct: p.meaning,
        wrong,
        explanation: p.wissen || `${p.term}: ${p.meaning}.`,
        fachwissen: {
          text: p.wissen || `${p.term}: ${p.meaning}.`,
          quelle: bank.quelle,
          url: bank.url,
        },
        dedupeKey: key,
        contentIds: [key],
      })
    })
  }

  // bank.trueFalse bewusst nicht verdrahtet — Mathe/Physik: kein TF.

  if (variants.length === 0) {
    return () =>
      valueTask({
        question: 'Berechne 2 + 3.',
        answerKind: 'integer',
        value: 5,
        solution: '5',
        explanation: '2 + 3 = 5.',
        fachwissen: {
          text: 'Addition natürlicher Zahlen: 2 + 3 = 5.',
          quelle: bank.quelle,
          url: bank.url,
        },
        dedupeKey: `${prefix ?? 'ma'}:fallback-add`,
      })
  }

  return mixedVariants(...variants)
}
