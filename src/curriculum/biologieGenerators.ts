import { textTask } from './taskHelpers'
import { allBiologieTopicIds } from './biologieGymTopics'
import {
  BIOLOGIE_K5_EXPANDED,
  BIOLOGIE_K6_EXPANDED,
  BIOLOGIE_K7_EXPANDED,
  BIOLOGIE_K8_EXPANDED,
  BIOLOGIE_K9_EXPANDED,
  BIOLOGIE_K10_EXPANDED,
} from './biologieNewUx'
import { BIOLOGIE_OBERSTUFE_GENERATORS } from './biologieOberstufe'
import { BIOLOGIE_SPECIAL_GENERATORS } from './biologieSpecialTopics'
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'

/** Alle spielbaren Biologie-Generatoren (K5–12, released:false → Entwickler). */
export const BIOLOGIE_GENERATORS: Record<string, Topic['generate']> = {
  ...BIOLOGIE_K5_EXPANDED,
  ...BIOLOGIE_K6_EXPANDED,
  ...BIOLOGIE_K7_EXPANDED,
  ...BIOLOGIE_K8_EXPANDED,
  ...BIOLOGIE_K9_EXPANDED,
  ...BIOLOGIE_K10_EXPANDED,
  ...BIOLOGIE_OBERSTUFE_GENERATORS,
  // Dedicated Spezial banks win over any leftover overview aliases.
  ...BIOLOGIE_SPECIAL_GENERATORS,
}

// GK extra subtopic alias
if (BIOLOGIE_OBERSTUFE_GENERATORS['bi-gk11-lb1-zellen']) {
  BIOLOGIE_GENERATORS['bi-gk11-lb1-organellen'] = mixedVariants(
    BIOLOGIE_OBERSTUFE_GENERATORS['bi-gk11-lb1-zellen'],
    BIOLOGIE_OBERSTUFE_GENERATORS['bi-gk11-lb1-zellen'],
  )
}

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
    .filter((id) => !BIOLOGIE_GENERATORS[id])
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
  const real = BIOLOGIE_GENERATORS[topicId]
  if (real) return real
  if (STUBS[topicId]) return STUBS[topicId]
  if (title) return stubGenerate(title)
  return undefined
}

export function isBiologieTopic(topicId: string): boolean {
  return topicId.startsWith('bi-')
}

export function isPlayableBiologieTopic(topicId: string): boolean {
  return Boolean(BIOLOGIE_GENERATORS[topicId])
}
