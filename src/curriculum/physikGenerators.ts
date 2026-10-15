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
import { PHYSIK_LEHRPLAN_GAPS_FILL_GENERATORS } from './physikLehrplanGapsFill'
import { PHYSIK_HEBEL_GENERATORS } from './physikHebelBank'
import { PHYSIK_FLASCHENZUG_GENERATORS } from './physikFlaschenzugBank'
import { PHYSIK_LEITUNG_GENERATORS } from './physikLeitungBank'
import { PHYSIK_FELDLINIEN_GENERATORS } from './physikFeldlinienBank'
import { PHYSIK_OS_DENSITY_FILL_GENERATORS } from './physikOsDensityFill'
import { withSek1RoundBoost } from './physikSek1RoundBoost'
import { withOsRoundBoost } from './physikOsRoundBoost'
import { PHYSIK_THIN_FILL, withSubjectThinFill } from './physikThinFill'
import { LEHRPLAN_TOPIC_GAP_GENERATORS } from './lehrplanTopicGaps'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { makePhysikTopicGenerate } from './physikTopicFactory'
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'

const HAND_WRITTEN: Record<string, Topic['generate']> = {
  ...PHYSIK_DENSE_GENERATORS,
  ...PHYSIK_LEHRPLAN_GAPS_FILL_GENERATORS,
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
  // Themenreine Qualitätsbanken zuletzt (Rules: Themenbindung, Fachwissen, uniqueRound).
  ...PHYSIK_HEBEL_GENERATORS,
  ...PHYSIK_FLASCHENZUG_GENERATORS,
  ...PHYSIK_LEITUNG_GENERATORS,
  ...PHYSIK_FELDLINIEN_GENERATORS,
  ...PHYSIK_OS_DENSITY_FILL_GENERATORS,
}

/** Dedicated banks must not be diluted by LB-wide Thin-Fill copies (cross-topic). */
const HAND_WRITTEN_IDS = new Set(Object.keys(HAND_WRITTEN))

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
  const base = PHYSIK_GENERATORS[topicId]
  if (!base) return undefined
  // P1/P2: Unique-Runden-Boost (Anwendung/Rechnung) für dünne Pools.
  const boosted =
    withOsRoundBoost(topicId, withSek1RoundBoost(topicId, base) ?? base) ?? base
  // curriculum-aufgaben-qualitaet: keine Cross-Topic-Vermischung —
  // Thin-Fill nur für reine Factory-Stubs, nie über Hand-/Gap-/Qualitätsbanken.
  if (HAND_WRITTEN_IDS.has(topicId)) return boosted
  return withSubjectThinFill(topicId, boosted, PHYSIK_THIN_FILL)
}

export function isPlayablePhysikTopic(topicId: string): boolean {
  return Boolean(PHYSIK_GENERATORS[topicId])
}

export function listPhysikGeneratorIds(): string[] {
  return Object.keys(PHYSIK_GENERATORS)
}
