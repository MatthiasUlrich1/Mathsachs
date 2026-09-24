/**
 * Fact-bank → mixed quiz variants for Biologie (Lehrplan Gym Sachsen).
 * Question ideas modeled on typical school-quiz themes (e.g. Schlaukopf Biology),
 * wording fully original; placement follows lplanid=522 topic ids.
 *
 * Round uniqueness is **concept-level**: every fact/pair/TF shares a stable
 * `dedupeKey` / `contentIds` like `bio:spinnen:beinzahl` so the same learning
 * point cannot reappear via MC, cloze, flashcard, or pairMatch in one round.
 */
import type { Rng } from '../lib/rng'
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'
import {
  bioFw,
  clozeBlanksTask,
  flashcardBioTask,
  gapFillTask,
  iconBelongBioTask,
  matchTermsTask,
  mcTask,
  multiPickTask,
  pick,
  shuffle,
  sortChronologyTask,
  trueFalse,
} from './biologieHelpers'

export type BioFact = {
  /** Stable concept id, e.g. `bio:spinnen:beinzahl`. Auto-derived if omitted. */
  concept?: string
  prompt: string
  answer: string
  wrong?: string[]
  explanation: string
  wissen: string
  gap?: string
  gapAccepted?: string[]
  cloze?: string
  clozeAccepted?: string[][]
  flashFront?: string
}

export type BioPair = {
  concept?: string
  term: string
  meaning: string
  wissen: string
}

export type BioTf = {
  concept?: string
  statement: string
  correct: boolean
  explanation: string
  wissen: string
}

export type BioSort = {
  concept?: string
  question: string
  labels: string[]
  explanation: string
  wissen: string
}

export type BioMulti = {
  concept?: string
  question: string
  correct: string[]
  wrong: string[]
  explanation: string
  wissen: string
}

export type BioIcon = {
  concept?: string
  question: string
  prompt?: string
  options: Array<{ id: string; label: string; icon: string }>
  correctId: string
  explanation: string
  wissen: string
}

export type BioBank = {
  quelle?: string
  url?: string
  /** Namespace prefix when items omit full concept paths (legacy). */
  conceptPrefix?: string
  facts?: BioFact[]
  pairs?: BioPair[]
  trueFalse?: BioTf[]
  sorts?: BioSort[]
  multis?: BioMulti[]
  icons?: BioIcon[]
}

function fw(bank: BioBank, text: string, prompt?: string) {
  const body = prompt?.trim()
    ? `Zur Frage „${prompt.trim()}“: ${text}`
    : text
  return bioFw(
    body,
    bank.quelle ?? 'Wikipedia: Biologie',
    bank.url ?? 'https://de.wikipedia.org/wiki/Biologie',
  )
}

/** Normalize concept to a stable key. */
export function bioConceptKey(concept: string | undefined, prefix?: string, fallback = 'item'): string {
  const raw = (concept ?? fallback).trim()
  const c = raw
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9:]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (c.startsWith('bio:')) return c
  const p = (prefix ?? 'bio:topic').trim().replace(/\/$/, '')
  return `${p}:${c || fallback}`
}

/** Reject only spoilery / baby-level icon prompts — emoji UX itself is fine. */
function isTrivialAnimalIcon(ic: BioIcon): boolean {
  const q = ic.question.toLowerCase()
  // Spoiler in question: "(8 Beine)", "(6 Beine)"
  if (/\(\s*\d+\s*beine\s*\)/i.test(q)) return true
  // "Welches Tier ist eine Spinne?" + card labeled "Kreuzspinne"/"Spinne" = giveaway
  const nameHit = q.match(/welches tier ist (?:eine?|ein)\s+([a-zäöüß]+)/i)
  if (nameHit) {
    const needle = nameHit[1]!.toLowerCase()
    const correct = ic.options.find((o) => o.id === ic.correctId)
    if (correct && correct.label.toLowerCase().includes(needle)) return true
  }
  return false
}

/** Build a playable Topic.generate from a knowledge bank. */
export function bankGenerate(bank: BioBank): Topic['generate'] {
  const prefix = bank.conceptPrefix
  const variants: Array<(rng: Rng) => ReturnType<Topic['generate']>> = []

  if (bank.facts?.length) {
    // One variant family for facts: randomly MC / cloze / flash — same concept key.
    variants.push((rng) => {
      const f = pick(rng, bank.facts!)
      const key = bioConceptKey(f.concept, prefix, f.prompt)
      const mode = rng()
      const wrong =
        f.wrong?.length && f.wrong.length >= 3
          ? shuffle(rng, f.wrong).slice(0, 3)
          : shuffle(
              rng,
              bank.facts!.filter((x) => x.answer !== f.answer).map((x) => x.answer),
            ).slice(0, 3)
      while (wrong.length < 3) wrong.push(`Nicht: ${f.answer} (${wrong.length})`)

      if (mode < 0.34 && f.cloze && f.clozeAccepted?.length) {
        return clozeBlanksTask({
          question: f.prompt,
          template: f.cloze,
          accepted: f.clozeAccepted,
          solution: f.clozeAccepted.map((a) => a[0]).join(' / '),
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen, f.prompt),
          dedupeKey: key,
          contentIds: [key],
        })
      }
      if (mode < 0.55 && f.gap && f.gapAccepted?.length) {
        if (f.gap.includes('___')) {
          return clozeBlanksTask({
            question: f.prompt,
            template: f.gap,
            accepted: [f.gapAccepted],
            solution: f.gapAccepted[0]!,
            explanation: f.explanation,
            fachwissen: fw(bank, f.wissen, f.prompt),
            dedupeKey: key,
            contentIds: [key],
          })
        }
        return gapFillTask({
          question: f.gap,
          accepted: f.gapAccepted,
          solution: f.gapAccepted[0]!,
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen, f.prompt),
          dedupeKey: key,
          contentIds: [key],
        })
      }
      if (mode < 0.72) {
        const flashWrong =
          f.wrong?.length && f.wrong.length >= 2
            ? shuffle(rng, f.wrong).slice(0, 3)
            : wrong.slice(0, 3)
        return flashcardBioTask({
          question: 'Karteikarte: lesen → umdrehen → antworten.',
          front: f.flashFront ?? f.prompt,
          accepted: [f.answer, ...(f.gapAccepted ?? [])],
          solution: f.answer,
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen, f.prompt),
          choices: shuffle(rng, [f.answer, ...flashWrong.slice(0, 3)]),
          dedupeKey: key,
          contentIds: [key],
        })
      }
      return mcTask(rng, {
        question: f.prompt,
        correct: f.answer,
        wrong,
        explanation: f.explanation,
        fachwissen: fw(bank, f.wissen, f.prompt),
        dedupeKey: key,
        contentIds: [key],
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
      const keys = three.map((p) => bioConceptKey(p.concept, prefix, p.term))
      const fwText = three.map((p) => `${p.term}: ${p.wissen}`).join(' ')
      return matchTermsTask(rng, {
        question: 'Ordne Begriff und Erklärung einander zu (Klick-Paare).',
        terms: three.map((p) => p.term),
        meanings: three.map((p) => p.meaning),
        distractor,
        solution: three.map((p) => `${p.term} → ${p.meaning}`).join('; '),
        explanation: three.map((p) => `${p.term}: ${p.wissen}`).join(' '),
        fachwissen: fw(bank, fwText),
        // Pair set key + each concept so any shared fact blocks the round slot.
        dedupeKey: `pair:${[...keys].sort().join('+')}`,
        contentIds: keys,
      })
    })
  }

  if (bank.trueFalse?.length) {
    variants.push((rng) => {
      const t = pick(rng, bank.trueFalse!)
      const key = bioConceptKey(t.concept, prefix, t.statement)
      return trueFalse(rng, {
        statement: t.statement,
        correct: t.correct,
        explanation: t.explanation,
        fachwissen: fw(bank, t.wissen, t.statement),
        dedupeKey: key,
        contentIds: [key],
      })
    })
  }

  if (bank.sorts?.length) {
    variants.push((rng) => {
      const s = pick(rng, bank.sorts!)
      const key = bioConceptKey(s.concept, prefix, s.question)
      return sortChronologyTask(rng, {
        question: s.question,
        labels: s.labels,
        solution: s.labels.join(' → '),
        explanation: s.explanation,
        fachwissen: fw(bank, s.wissen, s.question),
        dedupeKey: key,
        contentIds: [key],
      })
    })
  }

  if (bank.multis?.length) {
    variants.push((rng) => {
      const m = pick(rng, bank.multis!)
      const key = bioConceptKey(m.concept, prefix, m.question)
      return multiPickTask(rng, {
        question: m.question,
        correct: m.correct,
        wrong: m.wrong,
        explanation: m.explanation,
        fachwissen: fw(bank, m.wissen, m.question),
        dedupeKey: key,
        contentIds: [key],
      })
    })
  }

  const usableIcons = (bank.icons ?? []).filter((ic) => !isTrivialAnimalIcon(ic))
  if (usableIcons.length) {
    variants.push((rng) => {
      const ic = pick(rng, usableIcons)
      const key = bioConceptKey(ic.concept, prefix, ic.question)
      return iconBelongBioTask(rng, {
        question: ic.question,
        prompt: ic.prompt,
        options: ic.options,
        correctId: ic.correctId,
        explanation: ic.explanation,
        fachwissen: fw(bank, ic.wissen, ic.question),
        dedupeKey: key,
        contentIds: [key],
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
        dedupeKey: 'bio:placeholder',
        contentIds: ['bio:placeholder'],
      })
  }

  return mixedVariants(...variants)
}
