import type { ExamSpec } from './types'

/** Number of concrete task proposals offered per selected topic in ExamBuilder. */
export const EXAM_POOL_SIZE = 5

export const examThemeKey = (moduleId: string, topicId: string): string =>
  `${moduleId}::${topicId}`

export const examSelKey = (moduleId: string, topicId: string, seed: number): string =>
  `${moduleId}::${topicId}::${seed}`

export interface ExamBuilderHydrateState {
  title: string
  selectedThemes: string[]
  pools: Record<string, number[]>
  selections: Record<string, number>
}

/**
 * Rebuild ExamBuilder UI state from a decoded MSX1 {@link ExamSpec}
 * so teachers can reopen and edit an assigned Klausur.
 */
export function hydrateExamBuilderFromSpec(spec: ExamSpec): ExamBuilderHydrateState {
  const pools: Record<string, number[]> = {}
  const selections: Record<string, number> = {}
  const themes = new Set<string>()

  for (const task of spec.aufgaben) {
    const tKey = examThemeKey(task.modul, task.thema)
    themes.add(tKey)
    const list = pools[tKey] ?? []
    if (!list.includes(task.seed)) list.push(task.seed)
    pools[tKey] = list
    selections[examSelKey(task.modul, task.thema, task.seed)] = Math.max(1, task.punkte)
  }

  for (const tKey of themes) {
    const list = pools[tKey] ?? []
    while (list.length < EXAM_POOL_SIZE) {
      const seed = Math.floor(Math.random() * 0xffffffff) >>> 0
      if (!list.includes(seed)) list.push(seed)
    }
    pools[tKey] = list
  }

  return {
    title: spec.titel.trim() || 'Übungsklausur',
    selectedThemes: [...themes],
    pools,
    selections,
  }
}
