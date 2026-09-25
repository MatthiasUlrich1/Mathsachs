/**
 * Biologie — Aufbau/Beschriftung (imageLabelSlots) für K5 Fische, Vögel, Säuger.
 * Lehrplan Gym Sachsen (lplanid=522): LB2 Fische / LB5 Vögel / LB6 Säugetiere.
 */
import type { Rng } from '../lib/rng'
import {
  BIRD_AIR_SACS_ASSET,
  BIRD_ORGANS_ASSET,
  FEATHER_PARTS_ASSET,
  FISH_TROUT_ASSET,
  SKELETON_AXIAL_ASSET,
  SKELETON_UPPER_ASSET,
  TEETH_TYPES_ASSET,
  type AnatomyAsset,
} from './anatomyAssets'
import {
  bioFw,
  clozeBlanksTask,
  matchTermsTask,
  pick,
  shuffle,
  shuffleChoices,
  trueFalse,
} from './biologieHelpers'
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
        Math.min(asset.slots.length, rng() < 0.45 ? 5 : Math.min(asset.slots.length, 6)),
      )
  const distractorCount = Math.min(2, asset.distractors.length)
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
      ? `imgLabel:${asset.id}:all`
      : `imgLabel:${asset.id}:${[...concepts].sort().join('+')}`,
    rng,
  })
}

function buildFunctionMatch(rng: Rng, asset: AnatomyAsset, question: string) {
  const size = Math.min(asset.slots.length, rng() < 0.5 ? 4 : 5)
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

function partFachwissen(part: AnatomyAsset['slots'][number], asset: AnatomyAsset) {
  // Quality bar: ≥2 substantive sentences (function + wissen).
  return bioFw(
    `${part.label}: ${part.functionDe}. ${part.wissen}`,
    asset.fachwissenQuelle,
    asset.fachwissenUrl,
  )
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
    fachwissen: partFachwissen(part, asset),
    contentIds: [part.concept, `${part.concept}:fn`],
    dedupeKey: `${part.concept}:fn-mc`,
  })
}

/** Tolerante Synonyme für Cloze-Funktionen (Komma/Teilantworten erlaubt). */
function functionAccepted(part: AnatomyAsset['slots'][number]): string[] {
  const base = part.functionDe
  const extras: string[] = [base]
  // Einzelne Teilstücke bei „A und B“ / „A und B“
  for (const chunk of base.split(/\s+und\s+|\s*\/\s*|,\s*/i)) {
    const t = chunk.trim()
    if (t.length >= 3) extras.push(t)
  }
  if (part.id === 'auge') {
    extras.push(
      'Sehen',
      'sehen',
      'Orientierung',
      'orientierung',
      'Sehen und Orientierung',
      'Orientierung und Sehen',
      'Sehen, Orientierung',
      'Orientierung, Sehen',
      'Lichtwahrnehmung',
      'Wahrnehmen von Licht',
    )
  }
  return [...new Set(extras)]
}

function buildPartCloze(rng: Rng, asset: AnatomyAsset) {
  const part = pick(rng, asset.slots)
  const accepted = functionAccepted(part)
  const question =
    part.id === 'auge'
      ? 'Ergänze die Funktion vom Auge.'
      : `Ergänze die Funktion von ${part.label}.`
  return clozeBlanksTask({
    question,
    template: `${part.label}: ___.`,
    accepted: [accepted],
    solution: part.functionDe,
    explanation: part.wissen,
    fachwissen: partFachwissen(part, asset),
    dedupeKey: `${part.concept}:cloze`,
    contentIds: [part.concept, `${part.concept}:cloze`],
  })
}

/** Auge: Komma-Liste mit Teilpunkten (Sehen / Orientierung). */
function fishEyeClozePartial(_rng: Rng) {
  const grade = (answer: import('./types').UserInput) => {
    if (answer.kind !== 'value' && answer.kind !== 'clozeMulti') {
      return { fraction: 0, parts: [false, false] }
    }
    const raw =
      answer.kind === 'value' ? answer.value : (answer.blanks ?? []).join(', ')
    const parts = raw
      .toLowerCase()
      .split(/[,;/]|\bund\b/i)
      .map((s) =>
        s
          .trim()
          .replace(/ä/g, 'ae')
          .replace(/ö/g, 'oe')
          .replace(/ü/g, 'ue')
          .replace(/ß/g, 'ss'),
      )
      .filter(Boolean)
    const hitSehen = parts.some((p) => p.includes('sehen') || p.includes('licht'))
    const hitOri = parts.some((p) => p.includes('orient'))
    const flags = [hitSehen, hitOri]
    const ok = flags.filter(Boolean).length
    return { parts: flags, fraction: ok / 2 }
  }
  return {
    question: 'Ergänze die Funktion vom Auge.',
    answerKind: 'text' as const,
    solution: 'Sehen und Orientierung',
    explanation:
      'Das Auge dient dem Sehen und der Orientierung unter Wasser. Auch Einzelnennungen wie „Sehen“ oder „Orientierung“ geben Teilpunkte.',
    fachwissen: partFachwissen(FISH_TROUT_ASSET.slots[0]!, FISH_TROUT_ASSET),
    dedupeKey: 'bio:k5:fisch:aufbau:auge:cloze-partial',
    contentIds: ['bio:k5:fisch:aufbau:auge', 'bio:k5:fisch:aufbau:auge:cloze'],
    sampleAnswer: { kind: 'value' as const, value: 'Sehen, Orientierung' },
    interactive: {
      type: 'clozeMulti' as const,
      props: {
        segments: ['Auge: ', '.'],
        blankCount: 1,
        instruction: 'Tippe die Funktion (Komma erlaubt, z. B. Sehen, Orientierung):',
      },
    },
    check: (answer: import('./types').UserInput) => grade(answer).fraction >= 0.5,
    grade,
  }
}

function buildPartTf(rng: Rng, asset: AnatomyAsset) {
  const part = pick(rng, asset.slots)
  const other = pick(
    rng,
    asset.slots.filter((s) => s.id !== part.id),
  )
  const correct = rng() < 0.5
  const statement = correct
    ? `${part.label}: ${part.functionDe}.`
    : `${part.label}: ${other.functionDe}.`
  return trueFalse(rng, {
    statement,
    correct,
    explanation: correct
      ? part.wissen
      : `Falsch — ${part.label}: ${part.functionDe}. ${part.wissen}`,
    fachwissen: partFachwissen(part, asset),
    dedupeKey: `${part.concept}:tf:${correct ? 'ok' : other.id}`,
    contentIds: [part.concept, `${part.concept}:tf`],
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

function fishCloze(rng: Rng) {
  // Auge-Funktion besonders oft und tolerant (Freigabeliste).
  if (rng() < 0.45) return fishEyeClozePartial(rng)
  return buildPartCloze(rng, FISH_TROUT_ASSET)
}

function fishTf(rng: Rng) {
  return buildPartTf(rng, FISH_TROUT_ASSET)
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

function birdAirSacsLabel(rng: Rng) {
  return buildLabelTask(
    rng,
    BIRD_AIR_SACS_ASSET,
    'Beschrifte Atmungsorgane des Vogels (Lunge und Luftsäcke). Ziehe die Begriffe in die Felder.',
  )
}

function birdAirSacsMatch(rng: Rng) {
  return buildFunctionMatch(
    rng,
    BIRD_AIR_SACS_ASSET,
    'Ordne den Teilen der Vogelatmung die passende Funktion zu.',
  )
}

function birdAirSacsMc(rng: Rng) {
  return buildFunctionMc(rng, BIRD_AIR_SACS_ASSET)
}

function featherLabel(rng: Rng) {
  return buildLabelTask(
    rng,
    FEATHER_PARTS_ASSET,
    'Beschrifte den Aufbau einer Konturfeder. Ziehe die Begriffe in die nummerierten Felder.',
  )
}

function featherFunctions(rng: Rng) {
  return buildFunctionMatch(
    rng,
    FEATHER_PARTS_ASSET,
    'Ordne den Federteilen die passende Funktion zu.',
  )
}

function featherFnMc(rng: Rng) {
  return buildFunctionMc(rng, FEATHER_PARTS_ASSET)
}

function teethLabel(rng: Rng) {
  return buildLabelTask(
    rng,
    TEETH_TYPES_ASSET,
    'Beschrifte die Zahnarten im Gebiss. Ziehe die Begriffe in die Felder.',
  )
}

function teethFunctions(rng: Rng) {
  return buildFunctionMatch(
    rng,
    TEETH_TYPES_ASSET,
    'Ordne den Zahnarten die passende Funktion zu.',
  )
}

function teethFnMc(rng: Rng) {
  return buildFunctionMc(rng, TEETH_TYPES_ASSET)
}

function skeletonUpperLabel(rng: Rng) {
  return buildLabelTask(
    rng,
    SKELETON_UPPER_ASSET,
    'Beschrifte Knochen am Skelett (Oberkörper). Ziehe die Begriffe in die Felder.',
  )
}

function skeletonAxialLabel(rng: Rng) {
  return buildLabelTask(
    rng,
    SKELETON_AXIAL_ASSET,
    'Beschrifte Körpergliederung und Skelett. Ziehe die Begriffe in die Felder.',
  )
}

function skeletonFunctions(rng: Rng) {
  const asset = rng() < 0.5 ? SKELETON_UPPER_ASSET : SKELETON_AXIAL_ASSET
  return buildFunctionMatch(
    rng,
    asset,
    'Ordne Skelettteilen die passende Funktion zu.',
  )
}

function skeletonFnMc(rng: Rng) {
  return buildFunctionMc(rng, rng() < 0.5 ? SKELETON_UPPER_ASSET : SKELETON_AXIAL_ASSET)
}

function skeletonGliederungMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Körperabschnitte und Skelettbezug zu.',
    terms: ['Kopf', 'Rumpf', 'Obere Gliedmaßen', 'Untere Gliedmaßen'],
    meanings: [
      'Schädel und Sinnesorgane',
      'Wirbelsäule, Brustkorb, Becken',
      'Schultergürtel und Arme',
      'Beckengürtel und Beine',
    ],
    distractor: 'Nur Federfahne ohne Knochen',
    solution: 'Kopf / Rumpf / Arme / Beine',
    explanation:
      'Körpergliederung: Kopf, Rumpf sowie obere und untere Gliedmaßen — das Skelett stützt und schützt.',
    fachwissen: bioFw(
      'Beim Menschen und anderen Säugetieren gliedert sich der Körper in Kopf, Rumpf und Gliedmaßen. Das Achsenskelett (Schädel, Wirbelsäule, Brustkorb) und das Gliedmaßenskelett arbeiten zusammen.',
      'Wikipedia: Menschliches Skelett',
      'https://de.wikipedia.org/wiki/Menschliches_Skelett',
    ),
    dedupeKey: 'bio:k5:saeuger:skelett:gliederung-match',
    contentIds: [
      'bio:k5:saeuger:skelett:kopf',
      'bio:k5:saeuger:skelett:rumpf',
      'bio:k5:saeuger:skelett:arme',
      'bio:k5:saeuger:skelett:beine',
    ],
  })
}

/** K5 LB2 — Aufbau des Fisches (Freigabe nach Auge-Toleranz + 10er-Runde). */
export const biFischeAufbau: Topic['generate'] = mixedVariants(
  fishLabel,
  fishLabel,
  fishFunctions,
  fishFnMc,
  fishCloze,
  fishEyeClozePartial,
  fishTf,
  fishFunctions,
)

/** K5 LB5 — Aufbau des Vogels (Organe + Luftsäcke). */
export const biVoegelAufbau: Topic['generate'] = mixedVariants(
  birdLabel,
  birdLabel,
  birdAirSacsLabel,
  birdFunctions,
  birdAirSacsMatch,
  birdFnMc,
  birdAirSacsMc,
  birdFunctions,
)

/** Federaufbau image+blocks — mix into Flug/Federkleid. */
export const biVoegelFederBild: Topic['generate'] = mixedVariants(
  featherLabel,
  featherLabel,
  featherFunctions,
  featherFnMc,
  featherFunctions,
)

/** Gebiss image+blocks — mix into Säuger Merkmale. */
export const biSaeugerGebissBild: Topic['generate'] = mixedVariants(
  teethLabel,
  teethLabel,
  teethFunctions,
  teethFnMc,
  teethFunctions,
)

/** K5 LB6 — Körpergliederung und Skelett (released:false). */
export const biSaeugerSkelett: Topic['generate'] = mixedVariants(
  skeletonUpperLabel,
  skeletonAxialLabel,
  skeletonGliederungMatch,
  skeletonFunctions,
  skeletonFnMc,
  skeletonUpperLabel,
  skeletonAxialLabel,
)

export const BIOLOGIE_ANATOMY_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k5-lb2-fische-aufbau': biFischeAufbau,
  'bi-k5-lb5-voegel-aufbau': biVoegelAufbau,
  'bi-k5-lb5-voegel-feder': biVoegelFederBild,
  'bi-k5-lb6-saeuger-gebiss': biSaeugerGebissBild,
  'bi-k5-lb6-saeuger-skelett': biSaeugerSkelett,
}
