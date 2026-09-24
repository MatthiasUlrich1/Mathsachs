import { textTask } from './taskHelpers'
import { allGeschichteTopicIds } from './geschichteGymTopics'
import { GESCHICHTE_K5_GENERATORS } from './geschichte5'
import { GESCHICHTE_K6_GENERATORS } from './geschichte6'
import { GESCHICHTE_K6_REST_GENERATORS } from './geschichte6Rest'
import { GESCHICHTE_K7_GENERATORS } from './geschichte7'
import { GESCHICHTE_K8_GENERATORS } from './geschichte8'
import { GESCHICHTE_K9_GENERATORS } from './geschichte9'
import { GESCHICHTE_K10_GENERATORS } from './geschichte10'
import { GESCHICHTE_OBERSTUFE_GENERATORS } from './geschichteOberstufe'
import type { Topic } from './types'

/** Alle spielbaren Geschichte-Generatoren (K5–12; K6 LB1 freigegeben, Rest Entwickler). */
const GESCHICHTE_ALL_GENERATORS: Record<string, Topic['generate']> = {
  ...GESCHICHTE_K5_GENERATORS,
  ...GESCHICHTE_K6_GENERATORS,
  ...GESCHICHTE_K6_REST_GENERATORS,
  ...GESCHICHTE_K7_GENERATORS,
  ...GESCHICHTE_K8_GENERATORS,
  ...GESCHICHTE_K9_GENERATORS,
  ...GESCHICHTE_K10_GENERATORS,
  ...GESCHICHTE_OBERSTUFE_GENERATORS,
}

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
    .filter((id) => !GESCHICHTE_ALL_GENERATORS[id])
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
  const real = GESCHICHTE_ALL_GENERATORS[topicId]
  if (real) return real
  if (STUBS[topicId]) return STUBS[topicId]
  if (title) return stubGenerate(title)
  return undefined
}

export function isGeschichteTopic(topicId: string): boolean {
  return topicId.startsWith('ge-')
}

export function isPlayableGeschichteTopic(topicId: string): boolean {
  return Boolean(GESCHICHTE_ALL_GENERATORS[topicId])
}
