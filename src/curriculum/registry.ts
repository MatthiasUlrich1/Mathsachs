import type { Grade } from './types'

/**
 * Metadata for a single, on-demand loadable grade curriculum.
 *
 * `load()` uses a dynamic `import(...)` so the actual topic definitions are
 * only fetched (as a separate code-split chunk) once a grade is activated in
 * the "Lehrpläne" setup screen — that is the "Nachladen" mechanism.
 */
export interface CurriculumModule {
  id: string
  subjectTitle: string
  gradeTitle: string
  description: string
  load: () => Promise<Grade>
}

export const availableCurricula: CurriculumModule[] = [
  {
    id: 'mathematik-klasse-5',
    subjectTitle: 'Mathematik',
    gradeTitle: 'Klasse 5',
    description:
      'Natürliche Zahlen, gemeine Brüche und Dezimalzahlen, Lagebeziehungen, Rechtecke und Quader sowie Sachaufgaben aus dem Alltag.',
    load: () => import('./math5').then((m) => m.klasse5),
  },
  {
    id: 'mathematik-klasse-6',
    subjectTitle: 'Mathematik',
    gradeTitle: 'Klasse 6',
    description:
      'Arbeiten mit gebrochenen Zahlen, Zuordnungen, Dreiecke und Vierecke, Prismen und das Rechnen mit Anteilen.',
    load: () => import('./math6').then((m) => m.klasse6),
  },
]

export const getCurriculumModule = (id: string): CurriculumModule | undefined =>
  availableCurricula.find((m) => m.id === id)

const LOADED_KEY = 'mathsachs.loadedGrades.v1'

/** The grade that is always available when nothing has been persisted yet. */
export const DEFAULT_LOADED_IDS = ['mathematik-klasse-6']

const canStore = (): boolean => {
  try {
    return typeof localStorage !== 'undefined'
  } catch {
    return false
  }
}

/** The ids of the curricula the user has chosen to load, in registry order. */
export const getLoadedIds = (): string[] => {
  if (!canStore()) return [...DEFAULT_LOADED_IDS]
  let stored: string[] | null = null
  try {
    const raw = localStorage.getItem(LOADED_KEY)
    if (raw) stored = JSON.parse(raw) as string[]
  } catch {
    stored = null
  }
  if (stored === null) return [...DEFAULT_LOADED_IDS]
  // Keep only ids that still exist, preserving the registry's order.
  return availableCurricula
    .map((m) => m.id)
    .filter((id) => stored!.includes(id))
}

export const setLoadedIds = (ids: string[]): void => {
  if (!canStore()) return
  localStorage.setItem(LOADED_KEY, JSON.stringify(ids))
}
