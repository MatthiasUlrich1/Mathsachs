import type { Rng } from '../lib/rng'

export type AnswerKind = 'integer' | 'decimal' | 'fraction' | 'text'

/**
 * Fachliches Basiswissen (Rubrik „Wissen“ / „Fachwissen“).
 * Nur **reines Fachwissen**, das zur Lösung der *aktuellen* Frage beiträgt
 * (Fakten, Zusammenhänge, Merkmale) — kein Meta zu Bedienung, Wertung oder
 * Aufgabenablauf. Text ist eine eigene Formulierung (Fakten ohne Urheberrecht).
 * Quellenangaben verweisen auf weiterführende Literatur.
 *
 * Bevorzugt auf der `Task` setzen (fragebezogen). Topic-Level ist Fallback
 * (Curriculum-Browser / Themen ohne per-Task-Text).
 */
export interface Fachwissen {
  /** Reines Fachwissen zur Frage (typisch 2–5 Sätze). */
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
  | { kind: 'dragDropSlots'; slots: Array<number | null>; result?: string }
  | { kind: 'digitGrid'; digits: string[]; answerRows?: string[][] }
  | { kind: 'choicePick'; choice: string }
  | { kind: 'multiSelect'; selected: string[] }
  | { kind: 'coordinateClick'; x: number; y: number; points?: Array<{ x: number; y: number }> }
  | { kind: 'coordinateDraw'; scene: import('../lib/coordinateScene').CoordinateScene }
  | { kind: 'paramSlider'; values: Record<string, number> }
  | { kind: 'equationSteps'; ops: string[] }
  /** Two-column click pairing: leftId → rightId ('' = unpaired). */
  | { kind: 'pairMatch'; links: Record<string, string> }
  /** Several gaps in one cloze text. */
  | { kind: 'clozeMulti'; blanks: string[] }
  /** Icon/emoji card pick (same shape as choice, distinct widget). */
  | { kind: 'iconBelong'; choice: string }
  /** Flashcard: must flip, then tip answer. */
  | { kind: 'flashcardFlip'; flipped: boolean; answer: string }

/** A blank input matching the widget for a given answer kind. */
export const emptyInput = (
  kind:
    | AnswerKind
    | InteractiveConfig['type'],
): UserInput => {
  if (kind === 'fraction') return { kind: 'fraction', num: '', den: '' }
  if (kind === 'numberLine') return { kind: 'numberLine', value: 0 }
  if (kind === 'dragDropSort') return { kind: 'dragDropSort', order: [] }
  if (kind === 'dragDropSlots') return { kind: 'dragDropSlots', slots: [] }
  if (kind === 'digitGrid') return { kind: 'digitGrid', digits: [] }
  // sourceQuote answers via choicePick; causeEffect via pairMatch.
  if (kind === 'choicePick' || kind === 'sourceQuote') return { kind: 'choicePick', choice: '' }
  if (kind === 'multiSelect') return { kind: 'multiSelect', selected: [] }
  if (kind === 'coordinateClick') return { kind: 'coordinateClick', x: 0, y: 0 }
  if (kind === 'coordinateDraw')
    return {
      kind: 'coordinateDraw',
      scene: { xRange: [-5, 5], yRange: [-5, 5], snap: 'half', objects: [] },
    }
  if (kind === 'paramSlider') return { kind: 'paramSlider', values: {} }
  if (kind === 'equationSteps') return { kind: 'equationSteps', ops: [] }
  if (kind === 'pairMatch' || kind === 'causeEffect') return { kind: 'pairMatch', links: {} }
  if (kind === 'clozeMulti') return { kind: 'clozeMulti', blanks: [] }
  if (kind === 'iconBelong') return { kind: 'iconBelong', choice: '' }
  if (kind === 'flashcardFlip') return { kind: 'flashcardFlip', flipped: false, answer: '' }
  return { kind: 'value', value: '' }
}

/**
 * Interactive component configuration for tasks.
 */
export interface InteractiveConfig {
  type:
    | 'numberLine'
    | 'dragDropSort'
    | 'dragDropSlots'
    | 'digitGrid'
    | 'choicePick'
    | 'multiSelect'
    | 'coordinateClick'
    | 'coordinateDraw'
    | 'paramSlider'
    | 'equationSteps'
    | 'pairMatch'
    | 'clozeMulti'
    | 'iconBelong'
    | 'flashcardFlip'
    | 'sourceQuote'
    | 'causeEffect'
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
  /** Validate the learner's answer (all-or-nothing). */
  check: (input: UserInput) => boolean
  /**
   * Optional partial credit. When set, PracticeSession awards
   * `round(pointsPerTask * fraction)` and can highlight per-part results
   * (e.g. cloze blanks, pairMatch links). Defaults to check ? 1 : 0.
   */
  grade?: (input: UserInput) => TaskGrade
  /** The canonical correct input (used for answer keys and tests). */
  sampleAnswer: UserInput
  /** Optional SVG visual content (e.g., geometry diagrams). */
  visualContent?: string
  /**
   * Optional SVG shown after the answer is checked (Auflösung),
   * e.g. Schatten erst nach dem Prüfen einblenden.
   */
  solutionVisualContent?: string
  /** Optional interactive component configuration. */
  interactive?: InteractiveConfig
  /**
   * Question-specific Fachwissen (preferred in PracticeSession over topic.fachwissen).
   * Use for facts that change per generated task (e.g. Jahreszahl → Ereignis).
   */
  fachwissen?: Fachwissen
  /**
   * Optional round-dedupe identity. When set, practice rounds treat tasks with the
   * same key as duplicates even if question wording / answer format differs
   * (e.g. same year as tip-in vs. multiple-choice).
   */
  dedupeKey?: string
  /**
   * Content / fact identities for round uniqueness. If any id overlaps an earlier
   * task in the same round, the task is rejected — so the same fact cannot reappear
   * as MC, cloze, flashcard, or pairMatch.
   */
  contentIds?: string[]
}

/** Partial / full credit for a single attempt. */
export type TaskGrade = {
  /** Share of task points in [0, 1]. */
  fraction: number
  /** Per-part correctness (blanks, left-column pairs, …) for UI feedback. */
  parts?: boolean[]
}

/** Resolve grade from optional `task.grade`, else all-or-nothing `check`. */
export function gradeTask(task: Task, input: UserInput): TaskGrade {
  if (task.grade) return task.grade(input)
  return { fraction: task.check(input) ? 1 : 0 }
}

/** Integer points awarded for a graded attempt. */
export function awardPoints(pointsPerTask: number, grade: TaskGrade): number {
  if (grade.fraction <= 0) return 0
  if (grade.fraction >= 1) return pointsPerTask
  return Math.round(pointsPerTask * grade.fraction)
}

/** A single, selectable curriculum topic (Einzelthema). */
export interface Topic {
  id: string
  title: string
  /**
   * Short under-task tip (answer format, strategy). Never put formulas here —
   * formulas belong in `fachwissen` (expandable panel only).
   */
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
   * Freigabe für Schüler/Eltern. false = vorbereitet, aber gesperrt
   * („Noch keine Aufgaben enthalten“), außer bei stiller Pack-Vorschau.
   */
  released?: boolean
  /**
   * Wenn gesetzt: Grafik-/Interactive-Unterthema zur Prüfung vor dem Merge
   * in die Haupt-ID (`reviewOf`). Bleibt gesperrt, bis manuell freigegeben/gemerged.
   */
  reviewOf?: string
  /** Stable numeric ID for Freigabe-Feedback (z. B. „ID 8545“). */
  contentId?: number
  /** Tasks per practice round (pack-driven; default depends on subject). */
  tasksPerRound?: number
  /**
   * Thema-Fallback für Rubrik „Wissen“ (Curriculum-Browser / wenn die Task
   * kein eigenes `fachwissen` hat). Standard: immer gesetzt
   * (authored oder per `ensureTopicFachwissen` / Hydrate-Default).
   */
  fachwissen?: Fachwissen
  /**
   * Opt-out: keine Wissens-Rubrik für dieses Thema.
   * Ohne dieses Flag gehört „Wissen“ zu jedem Thema in jedem Lehrplan.
   */
  excludeFachwissen?: boolean
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

/**
 * True when a topic `hint` looks like a formula (belongs in Fachwissen, not
 * sticky under-task text). Used as a safety net while rendering.
 */
export function isFormulaLikeHint(hint: string): boolean {
  const t = hint.trim()
  if (!t) return false
  // Strategy / format tips that may contain "=" but are not formulas
  if (/Antwortformat|Schreibe Dividend|Gib <|Tippe oder|Antworte mit|1 Kästchen/.test(t)) {
    return false
  }
  return (
    /^(?:[A-Za-z|ρπ√μσλΔδ]\S{0,12}|Mittelwert|Winkelsumme|Relative Häufigkeit|Gesamtpreis|Spannweite|Anteil|Volumen|Neuer Wert|Bestand)\s*=/.test(
      t,
    ) ||
    /\b[VAUOGPZKmnabcfhρ]\s*=\s/.test(t) ||
    /aᵐ|π\s*·|√\(/.test(t)
  )
}
