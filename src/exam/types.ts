import type { AnswerKind } from '../curriculum/types'

/**
 * How the tasks of an exam are stored inside its shareable code.
 *
 * - `'A'` — seed-based (Variante A): every task is a reference
 *   `(modul, thema, seed)` and is re-created on the learner's device by loading
 *   the grade module via the registry and calling `topic.generate(createRng(seed))`.
 *   This keeps codes tiny and works entirely offline (no backend).
 * - `'B'` — embedded content (Variante B, future): the full question, solution
 *   and explanation travel inside the code, so the exam stays stable even if the
 *   curriculum generators change. The optional fields on {@link ExamTaskRef}
 *   already carry that payload, so a `'B'` producer can be added without touching
 *   the code/link format or the runner — see `resolveExam` in `examCode.ts`.
 */
export type ExamSchema = 'A' | 'B'

/**
 * A single exam task. In schema `'A'` only the reference fields
 * (`modul`, `thema`, `seed`, `punkte`) are used. The remaining, optional fields
 * hold embedded content for the forward-compatible schema `'B'`.
 */
export interface ExamTaskRef {
  /** Registry module id, e.g. `"mathematik-klasse-6"`. */
  modul: string
  /** `Topic.id` within that module, e.g. `"lb1-kuerzen"`. */
  thema: string
  /** PRNG seed handed to `createRng` so the task reproduces exactly. */
  seed: number
  /** Points awarded for a correct answer (default: `topic.pointsPerTask`). */
  punkte: number

  // --- Variante B (optional embedded content, not required for schema 'A') ---
  /** Fully rendered question text. */
  frage?: string
  /** Widget/answer kind used to check the embedded answer. */
  antwortart?: AnswerKind
  /** Unit rendered next to the answer field, e.g. `"cm²"`. */
  einheit?: string
  /** Canonical solution string, e.g. `"3/4"` or `"12,5"`. */
  loesung?: string
  /** Step-by-step explanation shown in the evaluation. */
  erklaerung?: string
}

/** A complete, shareable exam ("Übungsklausur per Code"). */
export interface ExamSpec {
  /** Storage variant of the contained tasks (see {@link ExamSchema}). */
  schema: ExamSchema
  /** `CURRICULUM_VERSION` the exam was created against. */
  curriculumVersion: number
  /** Human-readable exam title shown to the learner. */
  titel: string
  /** The exam's tasks, in the order they should be presented. */
  aufgaben: ExamTaskRef[]
}
