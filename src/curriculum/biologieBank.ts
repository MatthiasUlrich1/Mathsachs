/**
 * Fact-bank → mixed quiz variants for Biologie (Lehrplan Gym Sachsen).
 * Question ideas modeled on typical school-quiz themes (e.g. Schlaukopf Biology),
 * wording fully original; placement follows lplanid=522 topic ids.
 */
import type { Rng } from '../lib/rng'
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'
import {
  bioFw,
  gapFillTask,
  matchTermsTask,
  mcTask,
  multiPickTask,
  pick,
  shuffle,
  sortChronologyTask,
  trueFalse,
} from './biologieHelpers'

export type BioFact = {
  /** Short prompt / term */
  prompt: string
  /** Correct answer or definition */
  answer: string
  wrong?: string[]
  explanation: string
  wissen: string
  /** Optional gap sentence with ___ */
  gap?: string
  gapAccepted?: string[]
}

export type BioPair = { term: string; meaning: string; wissen: string }

export type BioTf = {
  statement: string
  correct: boolean
  explanation: string
  wissen: string
}

export type BioSort = {
  question: string
  labels: string[]
  explanation: string
  wissen: string
}

export type BioMulti = {
  question: string
  correct: string[]
  wrong: string[]
  explanation: string
  wissen: string
}

export type BioBank = {
  quelle?: string
  url?: string
  facts?: BioFact[]
  pairs?: BioPair[]
  trueFalse?: BioTf[]
  sorts?: BioSort[]
  multis?: BioMulti[]
}

function fw(bank: BioBank, text: string) {
  return bioFw(
    text,
    bank.quelle ?? 'Wikipedia: Biologie',
    bank.url ?? 'https://de.wikipedia.org/wiki/Biologie',
  )
}

/** Build a playable Topic.generate from a knowledge bank (MC, TF, match, gap, sort, multi). */
export function bankGenerate(bank: BioBank): Topic['generate'] {
  const variants: Array<(rng: Rng) => ReturnType<Topic['generate']>> = []

  if (bank.facts?.length) {
    variants.push((rng) => {
      const f = pick(rng, bank.facts!)
      const wrong =
        f.wrong?.length && f.wrong.length >= 3
          ? shuffle(rng, f.wrong).slice(0, 3)
          : shuffle(
              rng,
              bank.facts!.filter((x) => x.answer !== f.answer).map((x) => x.answer),
            ).slice(0, 3)
      while (wrong.length < 3) wrong.push(`Nicht: ${f.answer} (${wrong.length})`)
      return mcTask(rng, {
        question: f.prompt,
        correct: f.answer,
        wrong,
        explanation: f.explanation,
        fachwissen: fw(bank, f.wissen),
        dedupeKey: `mc:${f.prompt}:${f.answer}`,
      })
    })
    variants.push((rng) => {
      const withGap = bank.facts!.filter((f) => f.gap && f.gapAccepted?.length)
      const f = withGap.length ? pick(rng, withGap) : pick(rng, bank.facts!)
      if (f.gap && f.gapAccepted?.length) {
        return gapFillTask({
          question: f.gap,
          accepted: f.gapAccepted,
          solution: f.gapAccepted[0]!,
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen),
          dedupeKey: `gap:${f.gap}`,
        })
      }
      return gapFillTask({
        question: `${f.prompt}\n\nSchreibe die Antwort als Fachwort oder kurze Phrase.`,
        accepted: [f.answer, f.answer.toLowerCase()],
        solution: f.answer,
        explanation: f.explanation,
        fachwissen: fw(bank, f.wissen),
      })
    })
  }

  if (bank.pairs && bank.pairs.length >= 3) {
    variants.push((rng) => {
      const three = shuffle(rng, bank.pairs!).slice(0, 3)
      const distractorPool = bank.pairs!.filter((p) => !three.includes(p))
      const distractor =
        distractorPool.length > 0
          ? pick(rng, distractorPool).meaning
          : 'Photosynthese in Mitochondrien'
      return matchTermsTask(rng, {
        question: 'Ordne Begriff und Erklärung einander zu.',
        terms: three.map((p) => p.term),
        meanings: three.map((p) => p.meaning),
        distractor,
        solution: three.map((p) => `${p.term} → ${p.meaning}`).join('; '),
        explanation: three.map((p) => p.wissen).join(' '),
        fachwissen: fw(bank, three.map((p) => p.wissen).join(' ')),
      })
    })
  }

  if (bank.trueFalse?.length) {
    variants.push((rng) => {
      const t = pick(rng, bank.trueFalse!)
      return trueFalse(rng, {
        statement: t.statement,
        correct: t.correct,
        explanation: t.explanation,
        fachwissen: fw(bank, t.wissen),
      })
    })
  }

  if (bank.sorts?.length) {
    variants.push((rng) => {
      const s = pick(rng, bank.sorts!)
      return sortChronologyTask(rng, {
        question: s.question,
        labels: s.labels,
        solution: s.labels.join(' → '),
        explanation: s.explanation,
        fachwissen: fw(bank, s.wissen),
      })
    })
  }

  if (bank.multis?.length) {
    variants.push((rng) => {
      const m = pick(rng, bank.multis!)
      return multiPickTask(rng, {
        question: m.question,
        correct: m.correct,
        wrong: m.wrong,
        explanation: m.explanation,
        fachwissen: fw(bank, m.wissen),
      })
    })
  }

  if (variants.length === 0) {
    return () =>
      gapFillTask({
        question: 'Tipp „ok“ — Aufgabenbank fehlt noch.',
        accepted: ['ok'],
        solution: 'ok',
        explanation: 'Platzhalter.',
        fachwissen: fw(bank, 'Platzhalter.'),
      })
  }

  return mixedVariants(...variants)
}
