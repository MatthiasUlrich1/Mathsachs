import type { Rng } from '../lib/rng'

export type AnswerKind = 'integer' | 'decimal' | 'fraction' | 'text'

/** What the learner typed, depending on the input widget shown. */
export type UserInput =
  | { kind: 'value'; value: string }
  | { kind: 'fraction'; num: string; den: string }

/** A blank input matching the widget for a given answer kind. */
export const emptyInput = (kind: AnswerKind): UserInput =>
  kind === 'fraction'
    ? { kind: 'fraction', num: '', den: '' }
    : { kind: 'value', value: '' }

export interface Task {
  /** Question text. Fractions are written inline as "a/b". */
  question: string
  /** Optional unit rendered next to the answer field, e.g. "cm²". */
  unit?: string
  answerKind: AnswerKind
  /** Canonical solution, shown in worksheet keys and after a mistake. */
  solution: string
  /** Task-specific, step-by-step explanation. */
  explanation: string
  /** Validate the learner's answer. */
  check: (input: UserInput) => boolean
  /** The canonical correct input (used for answer keys and tests). */
  sampleAnswer: UserInput
}

/** A single, selectable curriculum topic (Einzelthema). */
export interface Topic {
  id: string
  title: string
  hint?: string
  pointsPerTask: number
  /**
   * Optional search keywords / synonyms (e.g. "Fläche", "m²", "Hektar").
   * Used by the topic search to broaden matches beyond the visible title.
   */
  keywords?: string[]
  generate: (rng: Rng) => Task
}

/** A curriculum topic area (Lernbereich). */
export interface TopicArea {
  id: string
  title: string
  ustd?: number
  topics: Topic[]
}

/**
 * A school year (Klassenstufe). Each grade lives in its own module and is
 * loaded on demand via the curriculum registry.
 */
export interface Grade {
  id: string
  title: string
  areas: TopicArea[]
}
