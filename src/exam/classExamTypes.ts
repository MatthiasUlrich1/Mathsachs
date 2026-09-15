import type { CurriculumRef } from '../curriculum/pack'

/** Local copy on Lehrer (LAN merge). Never posted as ownership proof to the Worker. */
export interface StoredClassExam {
  id: string
  /** Klassencode the exam is assigned to. */
  hostCode: string
  /** Optional display name of the class (for the manage list). */
  className?: string
  name: string
  /** Full MSX1:… shareable exam code. */
  examCode: string
  createdAt: number
  taskCount?: number
  totalPoints?: number
  /** How often learners submitted this class exam (Worker counter). */
  solveCount?: number
  /** True when this user created/assigned the exam. */
  owned?: boolean
  curriculumRefs?: CurriculumRef[]
}

/** Tombstone so LAN merge cannot resurrect a deleted class exam. */
export interface DeletedClassExam {
  id: string
  deletedAt: number
}

export const DELETED_CLASS_EXAM_TTL_MS = 30 * 24 * 60 * 60 * 1000
export const MAX_DELETED_CLASS_EXAMS = 200
export const MAX_CLASS_EXAM_NAME_LENGTH = 80
export const MAX_EXAM_CODE_PAYLOAD = 50_000

export function deleteClassExamConfirm(name: string): string {
  const trimmed = name.trim() || 'diese Klausur'
  return `Klausur „${trimmed}“ wirklich löschen? Schüler in der Klasse sehen sie danach nicht mehr. Das kann nicht rückgängig gemacht werden.`
}
