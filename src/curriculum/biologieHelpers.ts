/**
 * Shared Biologie quiz helpers — original tasks; UX inspired by typical school quizzes
 * (MC, true/false, multi-select, match/classify slots, sort, gap-fill).
 */
import type { Rng } from '../lib/rng'
import {
  choicePickTask,
  dragDropSlotsTask,
  dragDropSortTask,
  multiSelectTask,
  textTask,
} from './taskHelpers'
import type { Fachwissen, Task } from './types'

export const pick = <T,>(rng: Rng, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)]!

export const shuffle = <T,>(rng: Rng, arr: readonly T[]): T[] => {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export const shuffleChoices = (rng: Rng, choices: string[], correct: string): string[] => {
  const rest = choices.filter((c) => c !== correct)
  return shuffle(rng, [correct, ...rest])
}

export const bioFw = (
  text: string,
  quelle = 'Wikipedia: Biologie',
  url = 'https://de.wikipedia.org/wiki/Biologie',
): Fachwissen => ({ text, quelle, url })

export const trueFalse = (
  rng: Rng,
  opts: {
    statement: string
    correct: boolean
    explanation: string
    fachwissen: Fachwissen
    dedupeKey?: string
  },
): Task => {
  const correctLabel = opts.correct ? 'Richtig' : 'Falsch'
  return choicePickTask({
    question: `Stimmt die Aussage?\n\n„${opts.statement}“`,
    choices: shuffleChoices(rng, ['Richtig', 'Falsch'], correctLabel),
    correct: correctLabel,
    solution: correctLabel,
    explanation: opts.explanation,
    instruction: 'Richtig oder falsch?',
    fachwissen: opts.fachwissen,
    ...(opts.dedupeKey ? { dedupeKey: opts.dedupeKey } : {}),
  })
}

/** Klassifikation / Bild-Label-Slots ohne Bild: Begriffe → Fächer. */
export function classifySlotsTask(
  rng: Rng,
  opts: {
    question: string
    slotLabels: string[]
    itemLabels: string[]
    correctSlots: number[]
    distractors?: string[]
    solution: string
    explanation: string
    fachwissen: Fachwissen
    instruction?: string
  },
): Task {
  const distractors = opts.distractors ?? []
  const items = [
    ...opts.itemLabels.map((label, value) => ({ label, value })),
    ...distractors.map((label, i) => ({
      label,
      value: opts.itemLabels.length + i,
    })),
  ]
  return dragDropSlotsTask({
    question: opts.question,
    items,
    correctSlots: opts.correctSlots,
    slotLabels: opts.slotLabels,
    solution: opts.solution,
    explanation: opts.explanation,
    instruction:
      opts.instruction ??
      (distractors.length
        ? 'Ordne zu. Einen oder mehrere Blöcke brauchst du nicht.'
        : 'Ordne jeden Block dem passenden Fach zu.'),
    rng,
    fachwissen: opts.fachwissen,
  })
}

export function matchTermsTask(
  rng: Rng,
  opts: {
    question: string
    terms: string[]
    meanings: string[]
    distractor: string
    solution: string
    explanation: string
    fachwissen: Fachwissen
  },
): Task {
  return classifySlotsTask(rng, {
    question: opts.question,
    slotLabels: opts.terms,
    itemLabels: opts.meanings,
    correctSlots: opts.meanings.map((_, i) => i),
    distractors: [opts.distractor],
    solution: opts.solution,
    explanation: opts.explanation,
    fachwissen: opts.fachwissen,
    instruction: 'Ziehe die passende Erklärung zum Begriff. Einen Block brauchst du nicht.',
  })
}

export function sortChronologyTask(
  rng: Rng,
  opts: {
    question: string
    labels: string[]
    solution: string
    explanation: string
    fachwissen: Fachwissen
  },
): Task {
  return dragDropSortTask({
    question: opts.question,
    items: opts.labels.map((label, value) => ({ label, value })),
    correctOrder: opts.labels.map((_, i) => i),
    solution: opts.solution,
    explanation: opts.explanation,
    rng,
    fachwissen: opts.fachwissen,
  })
}

/** Lückentext: ein Schlüsselwort tippen (Gap-fill). */
export function gapFillTask(opts: {
  question: string
  accepted: string[]
  solution: string
  explanation: string
  fachwissen: Fachwissen
  dedupeKey?: string
}): Task {
  return textTask({
    question: opts.question,
    accepted: opts.accepted,
    solution: opts.solution,
    explanation: opts.explanation,
    fachwissen: opts.fachwissen,
    ...(opts.dedupeKey ? { dedupeKey: opts.dedupeKey } : {}),
  })
}

export function mcTask(
  rng: Rng,
  opts: {
    question: string
    correct: string
    wrong: string[]
    explanation: string
    fachwissen: Fachwissen
    instruction?: string
    dedupeKey?: string
  },
): Task {
  return choicePickTask({
    question: opts.question,
    choices: shuffleChoices(rng, [opts.correct, ...opts.wrong.slice(0, 3)], opts.correct),
    correct: opts.correct,
    solution: opts.correct,
    explanation: opts.explanation,
    instruction: opts.instruction ?? 'Wähle die passende Antwort:',
    fachwissen: opts.fachwissen,
    ...(opts.dedupeKey ? { dedupeKey: opts.dedupeKey } : {}),
  })
}

export function multiPickTask(
  rng: Rng,
  opts: {
    question: string
    correct: string[]
    wrong: string[]
    explanation: string
    fachwissen: Fachwissen
    instruction?: string
  },
): Task {
  const choices = shuffle(rng, [...opts.correct, ...opts.wrong])
  return multiSelectTask({
    question: opts.question,
    choices,
    correct: opts.correct,
    solution: opts.correct.join(', '),
    explanation: opts.explanation,
    instruction: opts.instruction ?? 'Wähle alle zutreffenden Antworten:',
    fachwissen: opts.fachwissen,
  })
}
