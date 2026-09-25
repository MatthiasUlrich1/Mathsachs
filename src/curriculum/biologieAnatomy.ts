/**
 * Biologie — Aufbau/Beschriftung (imageLabelSlots) für K5 Fische & Vögel.
 * Lehrplan Gym Sachsen (lplanid=522): LB2 Fische / LB5 Vögel.
 */
import type { Rng } from '../lib/rng'
import {
  BIRD_ORGANS_ASSET,
  FISH_TROUT_ASSET,
  type AnatomyAsset,
} from './anatomyAssets'
import { bioFw, matchTermsTask, pick, shuffle, shuffleChoices } from './biologieHelpers'
import {
  choicePickTask,
  imageLabelSlotsTask,
  mixedVariants,
} from './taskHelpers'
import type { Topic } from './types'

const shufflePool = <T,>(rng: Rng, arr: readonly T[]): T[] => shuffle(rng, [...arr])

function buildLabelTask(rng: Rng, asset: AnatomyAsset, question: string) {
  // Vorgezeichnete Nummernfelder (drawLeaders:false): immer alle Slots in Bildreihenfolge,
  // damit Drop-Felder exakt auf 1…n liegen und keine Organe fehlen.
  const useFixedNumbered = !asset.drawLeaders
  const subset = useFixedNumbered
    ? [...asset.slots]
    : shufflePool(rng, asset.slots).slice(
        0,
        Math.min(asset.slots.length, rng() < 0.45 ? 6 : 7),
      )
  const distractorCount = useFixedNumbered
    ? Math.min(2, asset.distractors.length)
    : Math.min(2, asset.distractors.length)
  const distractors = shufflePool(rng, asset.distractors).slice(0, distractorCount)
  const labels = [...subset.map((s) => s.label), ...distractors]
  const items = labels.map((label) => ({ label }))
  const correctSlots = subset.map((_, i) => i)
  const concepts = subset.map((s) => s.concept)
  return imageLabelSlotsTask({
    question,
    imageSrc: asset.imageSrc,
    imageAlt: asset.imageAlt,
    attribution: asset.attribution,
    drawLeaders: asset.drawLeaders,
    items,
    slots: subset.map(({ id, x, y, targetX, targetY }) => ({
      id,
      x,
      y,
      targetX,
      targetY,
    })),
    correctSlots,
    solution: subset.map((s, i) => `${i + 1}:${s.label}`).join('; '),
    explanation: subset.map((s) => `${s.label}: ${s.wissen}`).join(' '),
    instruction: useFixedNumbered
      ? 'Ziehe die Bezeichnungen in die nummerierten Felder auf dem Bild.'
      : 'Ziehe die Bezeichnungen in die Felder. Die Linien zeigen auf die Körperregion.',
    fachwissen: bioFw(
      subset.map((s) => `${s.label} — ${s.functionDe}. ${s.wissen}`).join(' '),
      asset.fachwissenQuelle,
      asset.fachwissenUrl,
    ),
    contentIds: concepts,
    dedupeKey: useFixedNumbered
      ? `imgLabel:${asset.id}:all8`
      : `imgLabel:${asset.id}:${[...concepts].sort().join('+')}`,
    rng,
  })
}

function buildFunctionMatch(rng: Rng, asset: AnatomyAsset, question: string) {
  const size = rng() < 0.5 ? 4 : 5
  const subset = shufflePool(rng, asset.slots).slice(0, size)
  const distractor = pick(rng, [
    ...asset.distractors.map((d) => `passt zu ${d}`),
    'Fotosynthese wie bei Pflanzen',
    'Nur bei Insekten vorhanden',
  ])
  return matchTermsTask(rng, {
    question,
    terms: subset.map((s) => s.label),
    meanings: subset.map((s) => s.functionDe),
    distractor,
    solution: subset.map((s) => `${s.label}→${s.functionDe}`).join('; '),
    explanation: subset.map((s) => s.wissen).join(' '),
    fachwissen: bioFw(
      subset.map((s) => `${s.label}: ${s.wissen}`).join(' '),
      asset.fachwissenQuelle,
      asset.fachwissenUrl,
    ),
    dedupeKey: `func:${asset.id}:${subset
      .map((s) => s.id)
      .sort()
      .join('+')}`,
    contentIds: subset.map((s) => s.concept),
  })
}

function buildFunctionMc(rng: Rng, asset: AnatomyAsset) {
  const part = pick(rng, asset.slots)
  const wrongFns = shufflePool(
    rng,
    asset.slots.filter((s) => s.id !== part.id).map((s) => s.functionDe),
  ).slice(0, 3)
  while (wrongFns.length < 3) {
    wrongFns.push(pick(rng, asset.distractors))
  }
  return choicePickTask({
    question: `Welche Funktion hat ${part.label}?`,
    choices: shuffleChoices(rng, [part.functionDe, ...wrongFns], part.functionDe),
    correct: part.functionDe,
    solution: part.functionDe,
    explanation: part.wissen,
    fachwissen: bioFw(part.wissen, asset.fachwissenQuelle, asset.fachwissenUrl),
    contentIds: [part.concept, `${part.concept}:fn`],
    dedupeKey: `${part.concept}:fn-mc`,
  })
}

function fishLabel(rng: Rng) {
  return buildLabelTask(
    rng,
    FISH_TROUT_ASSET,
    'Beschrifte den äußeren Aufbau des Fisches. Ziehe die Begriffe in die Felder.',
  )
}

function fishFunctions(rng: Rng) {
  return buildFunctionMatch(
    rng,
    FISH_TROUT_ASSET,
    'Ordne den Körperteilen der Fische die passende Funktion zu.',
  )
}

function fishFnMc(rng: Rng) {
  return buildFunctionMc(rng, FISH_TROUT_ASSET)
}

function birdLabel(rng: Rng) {
  return buildLabelTask(
    rng,
    BIRD_ORGANS_ASSET,
    'Beschrifte den inneren Aufbau des Vogels. Ziehe die Organnamen in die Felder.',
  )
}

function birdFunctions(rng: Rng) {
  return buildFunctionMatch(
    rng,
    BIRD_ORGANS_ASSET,
    'Ordne den Organen des Vogels die passende Funktion zu.',
  )
}

function birdFnMc(rng: Rng) {
  return buildFunctionMc(rng, BIRD_ORGANS_ASSET)
}

/** K5 LB2 — Aufbau des Fisches (released:false via Gym-Topics). */
export const biFischeAufbau: Topic['generate'] = mixedVariants(
  fishLabel,
  fishLabel,
  fishFunctions,
  fishFnMc,
  fishFunctions,
)

/** K5 LB5 — Aufbau des Vogels. */
export const biVoegelAufbau: Topic['generate'] = mixedVariants(
  birdLabel,
  birdLabel,
  birdFunctions,
  birdFnMc,
  birdFunctions,
)

export const BIOLOGIE_ANATOMY_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k5-lb2-fische-aufbau': biFischeAufbau,
  'bi-k5-lb5-voegel-aufbau': biVoegelAufbau,
}
