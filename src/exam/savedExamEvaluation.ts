import { emptyInput, type Task, type UserInput } from '../curriculum/types'
import type { ExamTaskResult } from '../components/ExamProtocolSheet'
import type { ResolvedExamTask } from './examCode'
import type { ExamTaskRef } from './types'

const MAX_SAVED = 20

/** Serializable snapshot of one graded exam task (display / reopen only). */
export interface SavedExamTaskResult {
  moduleId: string
  topicId: string
  topicTitle: string
  areaTitle: string
  gradeTitle: string
  punkte: number
  ref: ExamTaskRef
  question: string
  unit?: string
  solution: string
  explanation: string
  visualContent?: string
  solutionVisualContent?: string
  answerKind: Task['answerKind']
  answer: UserInput
  correct: boolean
  earned: number
}

export interface SavedExamEvaluation {
  id: string
  finishedAt: number
  title: string
  totalPoints: number
  /** Klassenklausur-Id when started from the class inbox. */
  classExamId?: string
  /** Normalized exam code key when available. */
  examCodeKey?: string
  results: SavedExamTaskResult[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const parseUserInput = (raw: unknown): UserInput | null => {
  if (!isRecord(raw) || typeof raw.kind !== 'string') return null
  return raw as unknown as UserInput
}

const parseSavedTask = (raw: unknown): SavedExamTaskResult | null => {
  if (!isRecord(raw)) return null
  if (typeof raw.moduleId !== 'string' || typeof raw.topicId !== 'string') return null
  if (typeof raw.question !== 'string' || typeof raw.solution !== 'string') return null
  if (typeof raw.explanation !== 'string' || typeof raw.answerKind !== 'string') return null
  if (typeof raw.punkte !== 'number' || typeof raw.earned !== 'number') return null
  if (typeof raw.correct !== 'boolean') return null
  const answer = parseUserInput(raw.answer)
  if (!answer) return null
  const ref = isRecord(raw.ref) ? (raw.ref as unknown as ExamTaskRef) : { modul: '', thema: '', seed: 0, punkte: 0 }
  return {
    moduleId: raw.moduleId,
    topicId: raw.topicId,
    topicTitle: typeof raw.topicTitle === 'string' ? raw.topicTitle : raw.topicId,
    areaTitle: typeof raw.areaTitle === 'string' ? raw.areaTitle : '',
    gradeTitle: typeof raw.gradeTitle === 'string' ? raw.gradeTitle : '',
    punkte: raw.punkte,
    ref,
    question: raw.question,
    unit: typeof raw.unit === 'string' ? raw.unit : undefined,
    solution: raw.solution,
    explanation: raw.explanation,
    visualContent: typeof raw.visualContent === 'string' ? raw.visualContent : undefined,
    solutionVisualContent:
      typeof raw.solutionVisualContent === 'string' ? raw.solutionVisualContent : undefined,
    answerKind: raw.answerKind as Task['answerKind'],
    answer,
    correct: raw.correct,
    earned: raw.earned,
  }
}

export const parseSavedExamEvaluations = (raw: unknown): SavedExamEvaluation[] => {
  if (!Array.isArray(raw)) return []
  const out: SavedExamEvaluation[] = []
  for (const row of raw) {
    if (!isRecord(row)) continue
    if (typeof row.id !== 'string' || typeof row.title !== 'string') continue
    if (typeof row.finishedAt !== 'number' || typeof row.totalPoints !== 'number') continue
    if (!Array.isArray(row.results)) continue
    const results = row.results
      .map(parseSavedTask)
      .filter((r): r is SavedExamTaskResult => r !== null)
    if (results.length === 0) continue
    out.push({
      id: row.id,
      finishedAt: row.finishedAt,
      title: row.title,
      totalPoints: row.totalPoints,
      classExamId: typeof row.classExamId === 'string' ? row.classExamId : undefined,
      examCodeKey: typeof row.examCodeKey === 'string' ? row.examCodeKey : undefined,
      results,
    })
  }
  out.sort((a, b) => b.finishedAt - a.finishedAt)
  return out.slice(0, MAX_SAVED)
}

export const mergeSavedExamEvaluations = (
  a: SavedExamEvaluation[] | undefined,
  b: SavedExamEvaluation[] | undefined,
): SavedExamEvaluation[] => {
  const map = new Map<string, SavedExamEvaluation>()
  for (const row of [...(a ?? []), ...(b ?? [])]) {
    const prev = map.get(row.id)
    if (!prev || row.finishedAt >= prev.finishedAt) map.set(row.id, row)
  }
  return [...map.values()]
    .sort((x, y) => y.finishedAt - x.finishedAt)
    .slice(0, MAX_SAVED)
}

export const toSavedExamEvaluation = (input: {
  title: string
  totalPoints: number
  results: ExamTaskResult[]
  classExamId?: string | null
  examCodeKey?: string | null
  finishedAt?: number
}): SavedExamEvaluation => {
  const finishedAt = input.finishedAt ?? Date.now()
  const classExamId = input.classExamId?.trim() || undefined
  const examCodeKey = input.examCodeKey?.trim() || undefined
  const id =
    classExamId != null
      ? `class:${classExamId}:${finishedAt}`
      : examCodeKey != null
        ? `code:${examCodeKey}:${finishedAt}`
        : `local:${finishedAt}`
  return {
    id,
    finishedAt,
    title: input.title,
    totalPoints: input.totalPoints,
    classExamId,
    examCodeKey,
    results: input.results.map((r) => ({
      moduleId: r.resolved.moduleId,
      topicId: r.resolved.topicId,
      topicTitle: r.resolved.topicTitle,
      areaTitle: r.resolved.areaTitle,
      gradeTitle: r.resolved.gradeTitle,
      punkte: r.resolved.punkte,
      ref: r.resolved.ref,
      question: r.resolved.task.question,
      unit: r.resolved.task.unit,
      solution: r.resolved.task.solution,
      explanation: r.resolved.task.explanation,
      visualContent: r.resolved.task.visualContent,
      solutionVisualContent: r.resolved.task.solutionVisualContent,
      answerKind: r.resolved.task.answerKind,
      answer: r.answer,
      correct: r.correct,
      earned: r.earned,
    })),
  }
}

/** Rebuild in-memory results for the Auswertung UI (check is a display stub). */
export const fromSavedExamEvaluation = (
  saved: SavedExamEvaluation,
): { title: string; totalPoints: number; results: ExamTaskResult[] } => ({
  title: saved.title,
  totalPoints: saved.totalPoints,
  results: saved.results.map((r) => {
    const task: Task = {
      question: r.question,
      unit: r.unit,
      answerKind: r.answerKind,
      solution: r.solution,
      explanation: r.explanation,
      visualContent: r.visualContent,
      solutionVisualContent: r.solutionVisualContent,
      check: () => false,
      sampleAnswer: emptyInput(r.answerKind),
    }
    const resolved: ResolvedExamTask = {
      ref: r.ref,
      task,
      punkte: r.punkte,
      moduleId: r.moduleId,
      topicId: r.topicId,
      topicTitle: r.topicTitle,
      areaTitle: r.areaTitle,
      gradeTitle: r.gradeTitle,
    }
    return {
      resolved,
      answer: r.answer,
      correct: r.correct,
      earned: r.earned,
    }
  }),
})

export const findSavedEvaluationForClassExam = (
  list: SavedExamEvaluation[],
  classExamId: string,
): SavedExamEvaluation | null => {
  const id = classExamId.trim().toUpperCase()
  if (!id) return null
  return list.find((row) => row.classExamId?.toUpperCase() === id) ?? null
}
