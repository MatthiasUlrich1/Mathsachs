import { PHYSIK_K6_GENERATORS } from './physik6'
import { PHYSIK_K7_GENERATORS } from './physik7'
import { PHYSIK_K8_GENERATORS } from './physik8'
import { PHYSIK_K9_GENERATORS } from './physik9'
import { PHYSIK_K10_GENERATORS } from './physik10'
import { PHYSIK_J11GK_GENERATORS } from './physik11gk'
import { PHYSIK_J12GK_GENERATORS } from './physik12gk'
import { PHYSIK_J11LK_GENERATORS } from './physik11lk'
import { PHYSIK_J12LK_GENERATORS } from './physik12lk'
import { PHYSIK_DENSE_GENERATORS } from './physikDenseBanks'
import { PHYSIK_THIN_FILL, withSubjectThinFill } from './physikThinFill'
import { LEHRPLAN_TOPIC_GAP_GENERATORS } from './lehrplanTopicGaps'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { makePhysikTopicGenerate } from './physikTopicFactory'
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'

const HAND_WRITTEN: Record<string, Topic['generate']> = {
  ...PHYSIK_DENSE_GENERATORS,
  ...PHYSIK_K6_GENERATORS,
  ...PHYSIK_K7_GENERATORS,
  ...PHYSIK_K8_GENERATORS,
  ...PHYSIK_K9_GENERATORS,
  ...PHYSIK_K10_GENERATORS,
  ...PHYSIK_J11GK_GENERATORS,
  ...PHYSIK_J12GK_GENERATORS,
  ...PHYSIK_J11LK_GENERATORS,
  ...PHYSIK_J12LK_GENERATORS,
  // Lehrplan-Punkt → neue Topics (Newton K10, JGS12 Schwingungen/Atom, …)
  ...Object.fromEntries(
    Object.entries(LEHRPLAN_TOPIC_GAP_GENERATORS).filter(([id]) => id.startsWith('ph-')),
  ),
}

function buildAllPhysikGenerators(): Record<string, Topic['generate']> {
  const out: Record<string, Topic['generate']> = { ...HAND_WRITTEN }
  const pack = buildGymSachsenPhysikPack()
  for (const grade of pack.official) {
    for (const area of grade.areas) {
      for (const t of area.topics) {
        if (!out[t.id]) {
          out[t.id] = makePhysikTopicGenerate(t.id, t.title)
        }
      }
    }
  }
  // Volumen: dense Begriffspool + Factory (Formel/Rechnung/Slots) für schulische Breite.
  const volDense = PHYSIK_DENSE_GENERATORS['ph-k6-lb2-volumen']
  if (volDense) {
    out['ph-k6-lb2-volumen'] = mixedVariants(
      volDense,
      makePhysikTopicGenerate('ph-k6-lb2-volumen', 'Volumen bestimmen'),
    )
  }
  return out
}

const PHYSIK_GENERATORS = buildAllPhysikGenerators()

export function resolvePhysikGenerate(topicId: string): Topic['generate'] | undefined {
  return withSubjectThinFill(topicId, PHYSIK_GENERATORS[topicId], PHYSIK_THIN_FILL)
}

export function isPlayablePhysikTopic(topicId: string): boolean {
  return Boolean(PHYSIK_GENERATORS[topicId])
}

export function listPhysikGeneratorIds(): string[] {
  return Object.keys(PHYSIK_GENERATORS)
}
