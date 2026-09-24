import { textTask } from './taskHelpers'
import { allBiologieTopicIds } from './biologieGymTopics'
import { BIOLOGIE_K5_GENERATORS } from './biologie5'
import type { Topic } from './types'

/** Platzhalter-Generator bis echte Biologie-Aufgaben vorliegen. */
function stubGenerate(title: string): Topic['generate'] {
  return () =>
    textTask({
      question: `Thema „${title}“ (Biologie · Gymnasium Sachsen) — Übungsaufgaben folgen. Tippe „ok“.`,
      accepted: ['ok', '—', '-'],
      solution: 'ok',
      explanation:
        'Der Lehrplan ist vorbereitet, die Aufgabengeneratoren sind noch in Arbeit. ' +
        'Nur in der Entwickleransicht sichtbar (Freigabe ausstehend).',
    })
}

const STUBS: Record<string, Topic['generate']> = Object.fromEntries(
  allBiologieTopicIds()
    .filter((id) => !BIOLOGIE_K5_GENERATORS[id])
    .map((id) => [id, stubGenerate(id)]),
)

export function biologieStubForTitle(title: string): Topic['generate'] {
  return stubGenerate(title)
}

export function resolveBiologieGenerate(
  topicId: string,
  title?: string,
): Topic['generate'] | undefined {
  if (!topicId.startsWith('bi-')) return undefined
  const real = BIOLOGIE_K5_GENERATORS[topicId]
  if (real) return real
  if (STUBS[topicId]) return STUBS[topicId]
  if (title) return stubGenerate(title)
  return undefined
}

export function isBiologieTopic(topicId: string): boolean {
  return topicId.startsWith('bi-')
}

export function isPlayableBiologieTopic(topicId: string): boolean {
  return Boolean(BIOLOGIE_K5_GENERATORS[topicId])
}
