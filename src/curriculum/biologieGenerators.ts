import { textTask } from './taskHelpers'
import { allBiologieTopicIds } from './biologieGymTopics'
import { BIOLOGIE_K5_GENERATORS } from './biologie5'
import { BIOLOGIE_K6_GENERATORS } from './biologie6'
import { BIOLOGIE_K7_GENERATORS } from './biologie7'
import { BIOLOGIE_K8_GENERATORS } from './biologie8'
import { BIOLOGIE_K9_GENERATORS } from './biologie9'
import { BIOLOGIE_K10_GENERATORS } from './biologie10'
import { BIOLOGIE_OBERSTUFE_GENERATORS } from './biologieOberstufe'
import type { Topic } from './types'

/** Alle spielbaren Biologie-Generatoren (K5–12, released:false → Entwickler). */
export const BIOLOGIE_GENERATORS: Record<string, Topic['generate']> = {
  ...BIOLOGIE_K5_GENERATORS,
  ...BIOLOGIE_K6_GENERATORS,
  ...BIOLOGIE_K7_GENERATORS,
  ...BIOLOGIE_K8_GENERATORS,
  ...BIOLOGIE_K9_GENERATORS,
  ...BIOLOGIE_K10_GENERATORS,
  ...BIOLOGIE_OBERSTUFE_GENERATORS,
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
