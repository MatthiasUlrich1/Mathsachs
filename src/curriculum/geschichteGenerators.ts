import { textTask } from './taskHelpers'
import { allGeschichteTopicIds } from './geschichteGymTopics'
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

const GENERATORS: Record<string, Topic['generate']> = Object.fromEntries(
  allGeschichteTopicIds().map((id) => {
    const title = id
    return [id, stubGenerate(title)]
  }),
)

/** Ensure stubs use the human title from the pack when hydrating. */
export function geschichteStubForTitle(title: string): Topic['generate'] {
  return stubGenerate(title)
}

export function resolveGeschichteGenerate(
  topicId: string,
  title?: string,
): Topic['generate'] | undefined {
  if (!topicId.startsWith('ge-')) return undefined
  if (title) return stubGenerate(title)
  return GENERATORS[topicId]
}

export function isGeschichteTopic(topicId: string): boolean {
  return topicId.startsWith('ge-')
}
