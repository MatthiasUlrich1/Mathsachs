import { mixedVariants, textTask } from './taskHelpers'
import { allGeschichteTopicIds } from './geschichteGymTopics'
import { GESCHICHTE_K5_GENERATORS } from './geschichte5'
import { GESCHICHTE_K6_GENERATORS } from './geschichte6'
import { GESCHICHTE_K6_REST_GENERATORS } from './geschichte6Rest'
import { GESCHICHTE_K7_GENERATORS } from './geschichte7'
import { GESCHICHTE_K8_GENERATORS } from './geschichte8'
import { GESCHICHTE_K9_GENERATORS } from './geschichte9'
import { GESCHICHTE_K10_GENERATORS } from './geschichte10'
import { GESCHICHTE_OBERSTUFE_GENERATORS } from './geschichteOberstufe'
import { GESCHICHTE_DENSE_GENERATORS } from './geschichteDense'
import { GESCHICHTE_DENSE_K6_LB23_GENERATORS } from './geschichteDenseK6Lb23'
import { GESCHICHTE_DENSE_UPPER_GENERATORS } from './geschichteDenseUpper'
import { GESCHICHTE_LAENGSSCHNITT_GENERATORS } from './geschichteLaengsschnittDense'
import { GESCHICHTE_OVERVIEW_DENSE_GENERATORS } from './geschichteOverviewDense'
import { GESCHICHTE_THIN_FILL } from './geschichteThinFill'
import { GESCHICHTE_LEHRPLAN_TEILASPEKTE_GENERATORS } from './geschichteLehrplanTeilaspekte'
import { GESCHICHTE_DICHTE_FILL_PASS1_GENERATORS } from './geschichteDichteFillPass1'
import type { Topic } from './types'

/** Alle spielbaren Geschichte-Generatoren (K5–12; K6 freigegeben, Rest Entwickler). */
const GESCHICHTE_ALL_GENERATORS: Record<string, Topic['generate']> = {
  ...GESCHICHTE_K5_GENERATORS,
  ...GESCHICHTE_K6_GENERATORS,
  ...GESCHICHTE_K6_REST_GENERATORS,
  ...GESCHICHTE_K7_GENERATORS,
  ...GESCHICHTE_K8_GENERATORS,
  ...GESCHICHTE_K9_GENERATORS,
  ...GESCHICHTE_K10_GENERATORS,
  ...GESCHICHTE_OBERSTUFE_GENERATORS,
  ...GESCHICHTE_DENSE_GENERATORS,
  ...GESCHICHTE_DENSE_K6_LB23_GENERATORS,
  ...GESCHICHTE_DENSE_UPPER_GENERATORS,
  ...GESCHICHTE_LAENGSSCHNITT_GENERATORS,
  ...GESCHICHTE_OVERVIEW_DENSE_GENERATORS,
  ...GESCHICHTE_LEHRPLAN_TEILASPEKTE_GENERATORS,
  ...GESCHICHTE_DICHTE_FILL_PASS1_GENERATORS,
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
  const fill = GESCHICHTE_THIN_FILL[topicId]
  if (real && fill) return mixedVariants(fill, fill, fill, real)
  if (real) return real
  if (fill) return fill
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
