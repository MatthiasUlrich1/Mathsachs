import type { Rng } from '../lib/rng'

export type AnswerKind = 'integer' | 'decimal' | 'fraction' | 'text'

/**
 * Fachliches Basiswissen zu einem Thema.
 * Text ist eine eigene Formulierung (mathematische Fakten unterliegen
 * keinem Urheberrecht). Quellenangaben verweisen auf weiterführende Literatur.
 */
export interface Fachwissen {
  /** Kompakte Erklärung des mathematischen Themas (2–5 Sätze). */
  text: string
  /**
   * Titel der zitierten Quelle, z. B. „Wikipedia: Bruchrechnung".
   * Wird in der Benutzeroberfläche als „Quelle" angezeigt.
   */
  quelle?: string
  /**
   * URL zu einer weiterführenden Quelle (z. B. Wikipedia CC BY-SA 4.0).
   * Der Link öffnet sich in einem neuen Tab.
   */
  url?: string
}

/** What the learner typed, depending on the input widget shown. */
export type UserInput =
  | { kind: 'value'; value: string }
  | { kind: 'fraction'; num: string; den: string }
  | { kind: 'numberLine'; value: number }
  | { kind: 'dragDropSort'; order: number[] }
  | { kind: 'digitGrid'; digits: string[] }
  | { kind: 'choicePick'; choice: string }
  | { kind: 'multiSelect'; selected: string[] }
  | { kind: 'coordinateClick'; x: number; y: number }
  | { kind: 'paramSlider'; values: Record<string, number> }

/** A blank input matching the widget for a given answer kind. */
export const emptyInput = (
  kind:
    | AnswerKind
    | 'numberLine'
    | 'dragDropSort'
    | 'digitGrid'
    | 'choicePick'
    | 'multiSelect'
    | 'coordinateClick'
    | 'paramSlider',
): UserInput => {
  if (kind === 'fraction') return { kind: 'fraction', num: '', den: '' }
  if (kind === 'numberLine') return { kind: 'numberLine', value: 0 }
  if (kind === 'dragDropSort') return { kind: 'dragDropSort', order: [] }
  if (kind === 'digitGrid') return { kind: 'digitGrid', digits: [] }
  if (kind === 'choicePick') return { kind: 'choicePick', choice: '' }
  if (kind === 'multiSelect') return { kind: 'multiSelect', selected: [] }
  if (kind === 'coordinateClick') return { kind: 'coordinateClick', x: 0, y: 0 }
  if (kind === 'paramSlider') return { kind: 'paramSlider', values: {} }
  return { kind: 'value', value: '' }
}

/**
 * Interactive component configuration for tasks.
 */
export interface InteractiveConfig {
  type:
    | 'numberLine'
    | 'dragDropSort'
    | 'digitGrid'
    | 'choicePick'
    | 'multiSelect'
    | 'coordinateClick'
    | 'paramSlider'
  props: Record<string, any> // Component-specific props
}

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
  /** Optional SVG visual content (e.g., geometry diagrams). */
  visualContent?: string
  /** Optional interactive component configuration. */
  interactive?: InteractiveConfig
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
  source?: 'official' | 'lehrer'
  extraId?: string
  /** Official Lerninhalt without a practice generator yet. */
  outlineOnly?: boolean
  /**
   * Fachliches Basiswissen zu diesem Thema (eigene Formulierung).
   * Wird dem Lernenden als Wissensbox angezeigt.
   */
  fachwissen?: Fachwissen
  /**
   * Schwierigkeitsgrad: 1 = Basis, 2 = Standard, 3 = Erweiterung.
   * Gibt einen Hinweis auf die Komplexität der erzeugten Aufgaben.
   */
  difficulty?: 1 | 2 | 3
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
  packId?: string
  areas: TopicArea[]
}
