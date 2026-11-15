import type { Rng } from '../lib/rng'
import { createRng, timeSeed } from '../lib/rng'
import { buildUniqueTaskRoundWithSeeds } from '../curriculum/uniqueRound'
import type { Task } from '../curriculum/types'
import type { ExamSpec } from './types'

/**
 * Proposal slots offered per selected topic in ExamBuilder.
 * Teachers can select all of them — formerly capped at 5.
 */
export const EXAM_POOL_SIZE = 12

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
 * Build a pool of distinct seeds for one topic (by content identity).
 * Avoids identical Geschichte / MC repeats when random seeds collide on variants.
 */
export function buildExamPoolSeeds(
  generate: (rng: Rng) => Task,
  count: number = EXAM_POOL_SIZE,
): number[] {
  const rows = buildUniqueTaskRoundWithSeeds(
    generate,
    createRng(timeSeed()),
    count,
    Math.max(120, count * 50),
  )
  return rows.map((row) => row.seed)
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

/**
 * Themenschluessel beim Bearbeiten einer Klausur: alle gespeicherten Schluessel bleiben erhalten,
 * auch solche ohne sichtbares Thema (z. B. gesperrt fuer diese Rolle), damit sie beim Speichern
 * nicht verloren gehen. `unresolved` sind die Schluessel ohne geladenes Thema (Warnung in Schritt 2).
 */
export function resolveEditThemeKeys(
  hydratedKeys: string[],
  knownKeys: ReadonlySet<string>,
): { keys: string[]; unresolved: string[] } {
  return { keys: [...hydratedKeys], unresolved: hydratedKeys.filter((k) => !knownKeys.has(k)) }
}

/**
 * Ist eine zu bearbeitende Klausur bereit? Entweder liegen alle benoetigten Module in `loaded`,
 * oder das Nachladen wurde fuer genau diese Klausur bestaetigt (`ensuredId === pendingId`).
 * Der zweite Fall deckt Module ab, die fuer die Rolle ausgeblendet sind (nur gesperrte Themen)
 * und deshalb nie in `loaded` erscheinen.
 */
export function isEditReady(
  needed: readonly string[],
  loadedModuleIds: readonly string[],
  ensuredId: string | null,
  pendingId: string,
): boolean {
  return needed.every((id) => loadedModuleIds.includes(id)) || ensuredId === pendingId
}
