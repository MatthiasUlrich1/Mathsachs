/**
 * Shared Biologie quiz helpers — original tasks; UX inspired by school quizzes.
 * Includes legacy wrappers (MC/slots/sort) plus NEW widgets:
 * pairMatch, clozeMulti, iconBelong, flashcardFlip.
 */
import type { Rng } from '../lib/rng'
import {
  choicePickTask,
  clozeMultiTask,
  dragDropSlotsTask,
  dragDropSortTask,
  flashcardFlipTask,
  iconBelongTask,
  multiSelectTask,
  pairMatchTask,
  textTask,
  type IconBelongOption,
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

/**
 * NEW: paired matching via two click-columns (no slot labels / no drag spoiler).
 * Prefers this over dragDropSlots for term↔meaning quizzes.
 */
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
  const left = opts.terms.map((label, i) => ({ id: `L${i}`, label }))
  const rightPairs = opts.meanings.map((label, i) => ({ id: `R${i}`, label }))
  const distractor = { id: 'Rd', label: opts.distractor }
  const right = shuffle(rng, [...rightPairs, distractor])
  const correctLinks: Record<string, string> = {}
  for (let i = 0; i < left.length; i++) {
    correctLinks[left[i]!.id] = rightPairs[i]!.id
  }
  return pairMatchTask({
    question: opts.question,
    left,
    right,
    correctLinks,
    solution: opts.solution,
    explanation: opts.explanation,
    fachwissen: opts.fachwissen,
    instruction:
      'Tippe links einen Begriff, dann rechts die passende Erklärung (einen Eintrag brauchst du nicht).',
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

/**
 * NEW: multi-blank cloze. `template` uses `___` placeholders (one per blank).
 */
export function clozeBlanksTask(opts: {
  question: string
  /** Running text with `___` for each blank */
  template: string
  accepted: string[][]
  solution: string
  explanation: string
  fachwissen: Fachwissen
  dedupeKey?: string
}): Task {
  const segments = opts.template.split('___')
  const n = opts.accepted.length
  if (segments.length !== n + 1) {
    // Fallback: treat whole as one blank if mismatch
    return clozeMultiTask({
      question: opts.question,
      segments: [opts.template, ''],
      accepted: opts.accepted.slice(0, 1),
      solution: opts.solution,
      explanation: opts.explanation,
      fachwissen: opts.fachwissen,
      ...(opts.dedupeKey ? { dedupeKey: opts.dedupeKey } : {}),
    })
  }
  return clozeMultiTask({
    question: opts.question,
    segments,
    accepted: opts.accepted,
    solution: opts.solution,
    explanation: opts.explanation,
    fachwissen: opts.fachwissen,
    instruction: 'Fülle alle Lücken aus:',
    ...(opts.dedupeKey ? { dedupeKey: opts.dedupeKey } : {}),
  })
}

/** NEW: emoji/icon „welches gehört dazu?“ */
export function iconBelongBioTask(
  rng: Rng,
  opts: {
    question: string
    prompt?: string
    options: IconBelongOption[]
    correctId: string
    explanation: string
    fachwissen: Fachwissen
    dedupeKey?: string
  },
): Task {
  const options = shuffle(rng, opts.options)
  const correct = opts.options.find((o) => o.id === opts.correctId)
  return iconBelongTask({
    question: opts.question,
    options,
    correctId: opts.correctId,
    solution: correct?.label ?? opts.correctId,
    explanation: opts.explanation,
    fachwissen: opts.fachwissen,
    prompt: opts.prompt,
    instruction: 'Tippe das passende Symbol:',
    ...(opts.dedupeKey ? { dedupeKey: opts.dedupeKey } : {}),
  })
}

/** NEW: flashcard flip → choose or tip answer (prefer choices when available). */
export function flashcardBioTask(opts: {
  question: string
  front: string
  accepted: string[]
  solution: string
  explanation: string
  fachwissen: Fachwissen
  backHint?: string
  /** MC options on the back; if set, UI shows choice buttons instead of free text. */
  choices?: string[]
  dedupeKey?: string
}): Task {
  const hasChoices = Boolean(opts.choices && opts.choices.length > 0)
  return flashcardFlipTask({
    question: opts.question,
    front: opts.front,
    accepted: opts.accepted,
    solution: opts.solution,
    explanation: opts.explanation,
    fachwissen: opts.fachwissen,
    backHint:
      opts.backHint ??
      (hasChoices ? 'Was passt dazu? Wähle eine Antwort.' : 'Was passt dazu? Tippe die Antwort.'),
    choices: opts.choices,
    instruction: hasChoices
      ? '1) Vorderseite lesen  2) Karte umdrehen  3) Antwort tippen (Option wählen).'
      : '1) Vorderseite lesen  2) Karte umdrehen  3) Antwort tippen.',
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
