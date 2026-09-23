import { textTask } from './taskHelpers'
import { allGeschichteTopicIds } from './geschichteGymTopics'
import { GESCHICHTE_K6_GENERATORS } from './geschichte6'
import type { Topic } from './types'

/** Platzhalter-Generator bis echte Geschichtsaufgaben vorliegen. */
function stubGenerate(title: string): Topic['generate'] {
  return () =>
    textTask({
      question: `Thema „${title}“ (Geschichte · Gymnasium Sachsen) — Übungsaufgaben folgen. Tippe „ok“.`,
      accepted: ['ok', '—', '-'],
      solution: 'ok',
      explanation:
        'Der Lehrplan ist vorbereitet, die Aufgabengeneratoren sind noch in Arbeit. ' +
        'Nur in der Entwickleransicht sichtbar (Freigabe ausstehend).',
    })
}

const STUBS: Record<string, Topic['generate']> = Object.fromEntries(
  allGeschichteTopicIds()
    .filter((id) => !GESCHICHTE_K6_GENERATORS[id])
    .map((id) => [id, stubGenerate(id)]),
)

export function geschichteStubForTitle(title: string): Topic['generate'] {
  return stubGenerate(title)
}

export function resolveGeschichteGenerate(
  topicId: string,
  title?: string,
): Topic['generate'] | undefined {
  if (!topicId.startsWith('ge-')) return undefined
  const real = GESCHICHTE_K6_GENERATORS[topicId]
  if (real) return real
  if (STUBS[topicId]) return STUBS[topicId]
  if (title) return stubGenerate(title)
  return undefined
}

export function isGeschichteTopic(topicId: string): boolean {
  return topicId.startsWith('ge-')
}

export function isPlayableGeschichteTopic(topicId: string): boolean {
  return Boolean(GESCHICHTE_K6_GENERATORS[topicId])
}
