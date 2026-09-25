/**
 * Biologie — Aufbau/Beschriftung (imageLabelSlots) für K5 Fische, Vögel, Säuger.
 * Lehrplan Gym Sachsen (lplanid=522): LB2 Fische / LB5 Vögel / LB6 Säugetiere.
 */
import type { Rng } from '../lib/rng'
import {
  BIRD_ORGANS_ASSET,
  FEATHER_PARTS_ASSET,
  FISH_ORGANS_ASSET,
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
  // Full numbered diagrams: one task-level identity so organ-MC/cloze about
  // individual parts can still fill a 10er-Runde (label ≠ Funktions-MC).
  // Subset labels keep per-organ contentIds for within-round fact uniqueness.
  const contentIds = useFixedNumbered ? [`${asset.id}:diagram`] : concepts
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
    contentIds,
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

const normFn = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, ' ')

/** Stems for partial-credit function clozes (fish Aufbau). */
function functionStems(part: AnatomyAsset['slots'][number]): string[][] {
  const id = part.id
  if (id === 'auge') {
    return [
      ['sehen', 'licht', 'lichtwahrnehmung'],
      ['orientierung', 'orientieren'],
    ]
  }
  if (id === 'brustflosse') {
    return [
      ['steuer', 'steuern', 'steuerung', 'lenken', 'lenkung'],
      ['brems', 'bremsen', 'abbremsen'],
    ]
  }
  if (id === 'bauchflosse') {
    return [
      ['lage', 'halten'],
      ['balance', 'gleichgewicht'],
    ]
  }
  if (id === 'schwanzflosse') {
    return [['vortrieb', 'antrieb', 'vorwaerts', 'schwung']]
  }
  if (id === 'rueckenflosse' || id === 'afterflosse') {
    return [['stabil', 'stabilitaet', 'stabilisieren', 'kentern']]
  }
  if (id === 'kiamendeckel') {
    return [['schutz', 'schuetzt', 'schuetzen', 'decken', 'bedecken', 'kiemen']]
  }
  if (id === 'seitenlinie') {
    return [
      ['wahrnehmung', 'wahrnehmen', 'registr', 'fuehlen', 'spueren'],
      ['wasser', 'stroemung', 'druck', 'bewegung'],
    ]
  }
  if (id === 'fettflosse') {
    return [['kennzeichen', 'merkmal', 'typisch', 'salmon', 'forelle']]
  }
  if (id === 'kiemen') {
    return [
      ['sauerstoff', 'o2', 'atmen', 'atmung'],
      ['wasser', 'aufnehmen', 'aufnahme'],
    ]
  }
  if (id === 'herz') {
    return [['blut', 'kreislauf', 'pumpen', 'antreiben']]
  }
  if (id === 'leber') {
    return [['stoffwechsel', 'entgift', 'speicher']]
  }
  if (id === 'magen') {
    return [['verdau', 'zersetz', 'chemisch', 'nahrung']]
  }
  if (id === 'schwimmblase') {
    return [['schweb', 'auftrieb', 'schweben', 'ohne staendiges schwimmen']]
  }
  if (id === 'darm') {
    return [['naehrstoff', 'aufnehmen', 'aufnahme']]
  }
  // Fallback: each "und"-chunk is one stem group
  return part.functionDe
    .split(/\s+und\s+|\s*\/\s*|,\s*/i)
    .map((c) => c.trim())
    .filter((c) => c.length >= 3)
    .map((c) => [normFn(c)])
}

/** Tolerante Synonyme für Cloze-Funktionen (Komma/Teilantworten erlaubt). */
function functionAccepted(part: AnatomyAsset['slots'][number]): string[] {
  const base = part.functionDe
  const extras: string[] = [base]
  for (const chunk of base.split(/\s+und\s+|\s*\/\s*|,\s*/i)) {
    const t = chunk.trim()
    if (t.length >= 3) extras.push(t)
  }
  const byId: Record<string, string[]> = {
    auge: [
      'Sehen',
      'Orientierung',
      'Sehen und Orientierung',
      'Orientierung und Sehen',
      'Sehen, Orientierung',
      'Orientierung, Sehen',
      'Lichtwahrnehmung',
      'Wahrnehmen von Licht',
    ],
    brustflosse: [
      'Steuern',
      'Bremsen',
      'Steuerung',
      'Steuern und Bremsen',
      'Bremsen und Steuern',
      'Steuern, Bremsen',
      'Steuerung und Bremsen',
      'Lenken und Bremsen',
      'Lenken',
    ],
    bauchflosse: [
      'Lage halten',
      'Balance',
      'Balance halten',
      'Gleichgewicht',
      'Lage und Balance',
      'Lage und Balance halten',
    ],
    schwanzflosse: ['Vortrieb', 'Antrieb', 'Vortrieb erzeugen', 'Antrieb beim Schwimmen'],
    rueckenflosse: ['Stabilität', 'Stabilisieren', 'Stabilität beim Schwimmen'],
    afterflosse: ['Stabilität', 'Stabilisieren', 'Stabilität am Hinterkörper'],
    kiamendeckel: [
      'Schutz der Kiemen',
      'Kiemen schützen',
      'Schützt die Kiemen',
      'Bedeckt die Kiemen',
      'Schutz',
    ],
    seitenlinie: [
      'Wahrnehmung',
      'Wasserbewegungen wahrnehmen',
      'Strömung wahrnehmen',
      'Druckwellen wahrnehmen',
      'Wahrnehmung von Wasserbewegungen',
    ],
    fettflosse: [
      'Kennzeichen',
      'Artmerkmal',
      'Kennzeichen mancher Arten',
      'Kennzeichen der Forelle',
    ],
    kiemen: [
      'Atmung',
      'Atmen',
      'Sauerstoffaufnahme',
      'Sauerstoff aufnehmen',
      'Sauerstoff aus dem Wasser aufnehmen',
    ],
    herz: ['Blut pumpen', 'Kreislauf antreiben', 'Blutkreislauf antreiben', 'Pumpt das Blut'],
    leber: ['Stoffwechsel', 'Entgiftung', 'Stoffwechsel und Entgiftung'],
    magen: ['Verdauung', 'Nahrung verdauen', 'chemische Verdauung', 'Nahrung chemisch verdauen'],
    schwimmblase: [
      'Schweben',
      'Auftrieb',
      'Auftrieb regulieren',
      'Schweben ohne ständiges Schwimmen',
    ],
    darm: ['Nährstoffaufnahme', 'Nährstoffe aufnehmen', 'Aufnahme von Nährstoffen'],
  }
  extras.push(...(byId[part.id] ?? []))
  return [...new Set(extras)]
}

/** Cloze with stem-based partial credit (Steuerung allein = Teilpunkt). */
function buildPartCloze(rng: Rng, asset: AnatomyAsset) {
  const part = pick(rng, asset.slots)
  const accepted = functionAccepted(part)
  const stems = functionStems(part)
  const question =
    part.id === 'auge'
      ? 'Ergänze die Funktion vom Auge.'
      : `Ergänze die Funktion von ${part.label}.`

  if (stems.length >= 1) {
    const grade = (answer: import('./types').UserInput) => {
      if (answer.kind !== 'value' && answer.kind !== 'clozeMulti') {
        return { fraction: 0, parts: stems.map(() => false) }
      }
      const raw =
        answer.kind === 'value' ? answer.value : (answer.blanks ?? []).join(', ')
      const n = normFn(raw)
      // Full accepted phrase → full credit
      if (accepted.some((a) => normFn(a) === n)) {
        return { fraction: 1, parts: stems.map(() => true) }
      }
      const tokens = n
        .split(/[,;/]|\bund\b/i)
        .map((t) => normFn(t))
        .filter(Boolean)
      const hay = [n, ...tokens].join(' ')
      const flags = stems.map((group) =>
        group.some((stem) => hay.includes(stem) || tokens.some((t) => t.includes(stem))),
      )
      const ok = flags.filter(Boolean).length
      return { parts: flags, fraction: ok / flags.length }
    }
    return {
      question,
      answerKind: 'text' as const,
      solution: part.functionDe,
      explanation: part.wissen,
      fachwissen: partFachwissen(part, asset),
      dedupeKey: `${part.concept}:cloze`,
      contentIds: [part.concept, `${part.concept}:cloze`],
      sampleAnswer: { kind: 'value' as const, value: part.functionDe },
      interactive: {
        type: 'clozeMulti' as const,
        props: {
          segments: [`${part.label}: `, '.'],
          blankCount: 1,
          instruction:
            'Tippe die Funktion (Synonyme und Teilantworten wie „Steuerung“ sind ok):',
        },
      },
      check: (answer: import('./types').UserInput) => grade(answer).fraction >= 0.5,
      grade,
    }
  }

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
  // Always include the corrected landmarks from user feedback.
  const mustIds = ['auge', 'kiamendeckel', 'fettflosse', 'schwanzflosse'] as const
  const must = mustIds
    .map((id) => FISH_TROUT_ASSET.slots.find((s) => s.id === id)!)
    .filter(Boolean)
  const rest = FISH_TROUT_ASSET.slots.filter((s) => !mustIds.includes(s.id as (typeof mustIds)[number]))
  const want = rng() < 0.45 ? 5 : 6
  const fill = shufflePool(rng, rest).slice(0, Math.max(0, want - must.length))
  const subset = shufflePool(rng, [...must, ...fill]).slice(0, want)
  const distractors = shufflePool(rng, FISH_TROUT_ASSET.distractors).slice(0, 2)
  const labels = [...subset.map((s) => s.label), ...distractors]
  const concepts = subset.map((s) => s.concept)
  return imageLabelSlotsTask({
    question:
      'Beschrifte den äußeren Aufbau des Fisches. Ziehe die Begriffe in die Felder.',
    imageSrc: FISH_TROUT_ASSET.imageSrc,
    imageAlt: FISH_TROUT_ASSET.imageAlt,
    attribution: FISH_TROUT_ASSET.attribution,
    drawLeaders: FISH_TROUT_ASSET.drawLeaders,
    items: labels.map((label) => ({ label })),
    slots: subset.map(({ id, x, y, targetX, targetY }) => ({
      id,
      x,
      y,
      targetX,
      targetY,
    })),
    correctSlots: subset.map((_, i) => i),
    solution: subset.map((s, i) => `${i + 1}:${s.label}`).join('; '),
    explanation: subset.map((s) => `${s.label}: ${s.wissen}`).join(' '),
    instruction:
      'Ziehe die Bezeichnungen in die Felder. Die Linien zeigen auf die Körperregion.',
    fachwissen: bioFw(
      subset.map((s) => `${s.label} — ${s.functionDe}. ${s.wissen}`).join(' '),
      FISH_TROUT_ASSET.fachwissenQuelle,
      FISH_TROUT_ASSET.fachwissenUrl,
    ),
    contentIds: concepts,
    dedupeKey: `imgLabel:${FISH_TROUT_ASSET.id}:${[...concepts].sort().join('+')}`,
    rng,
  })
}

function fishOrgansLabel(rng: Rng) {
  return buildLabelTask(
    rng,
    FISH_ORGANS_ASSET,
    'Beschrifte die inneren Organe des Fisches. Ziehe die Begriffe in die Felder.',
  )
}

function fishOrgansFunctions(rng: Rng) {
  return buildFunctionMatch(
    rng,
    FISH_ORGANS_ASSET,
    'Ordne den Organen des Fisches die passende Funktion zu.',
  )
}

function fishOrgansFnMc(rng: Rng) {
  return buildFunctionMc(rng, FISH_ORGANS_ASSET)
}

function fishOrgansCloze(rng: Rng) {
  return buildPartCloze(rng, FISH_ORGANS_ASSET)
}

function fishOrgansTf(rng: Rng) {
  return buildPartTf(rng, FISH_ORGANS_ASSET)
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
  // Mix outer + inner organ function clozes (tolerant stems).
  if (rng() < 0.4) return buildPartCloze(rng, FISH_ORGANS_ASSET)
  return buildPartCloze(rng, FISH_TROUT_ASSET)
}

function fishTf(rng: Rng) {
  if (rng() < 0.4) return buildPartTf(rng, FISH_ORGANS_ASSET)
  return buildPartTf(rng, FISH_TROUT_ASSET)
}

function birdCloze(rng: Rng) {
  return buildPartCloze(rng, BIRD_ORGANS_ASSET)
}

function birdTf(rng: Rng) {
  return buildPartTf(rng, BIRD_ORGANS_ASSET)
}

function birdAdaptationExtra(rng: Rng) {
  const bank = [
    {
      concept: 'bio:k5:vogel:aufbau:adapt:gleichwarm',
      statement: 'Vögel sind gleichwarm und halten ihre Körpertemperatur weitgehend konstant.',
      correct: true,
      explanation: 'Gleichwarmsein unterstützt den energieintensiven Flug.',
      wissen:
        'Gleichwarme Tiere halten die Körpertemperatur aktiv. Bei Vögeln ermöglicht das dauerhaft hohe Leistung für Flug und Stoffwechsel.',
    },
    {
      concept: 'bio:k5:vogel:aufbau:adapt:luftsaecke',
      statement: 'Luftsäcke speichern Luft und unterstützen die effiziente Atmung der Vögel.',
      correct: true,
      explanation: 'Luftsäcke sind ein Kennzeichen der Vogelatmung.',
      wissen:
        'Vordere und hintere Luftsäcke speichern Luft und ermöglichen einen nahezu kontinuierlichen Gasfluss durch die Lunge.',
    },
    {
      concept: 'bio:k5:vogel:aufbau:adapt:kropf',
      statement: 'Der Kropf speichert und erweicht Nahrung vor der eigentlichen Verdauung.',
      correct: true,
      explanation: 'Der Kropf ist ein Vorratsorgan im Verdauungsweg.',
      wissen: 'Im Kropf wird Nahrung zwischengespeichert und vorgeweicht — Angepasstheit an unregelmäßige Nahrungsaufnahme.',
    },
    {
      concept: 'bio:k5:vogel:aufbau:adapt:muskelmagen',
      statement: 'Der Muskelmagen zerkleinert Nahrung mechanisch, oft mit aufgenommenen Steinchen.',
      correct: true,
      explanation: 'Muskelmagen = mechanische Zerkleinerung.',
      wissen: 'Viele Vögel haben keinen Kauapparat mit Zähnen; der Muskelmagen übernimmt das Zerkleinern.',
    },
    {
      concept: 'bio:k5:vogel:aufbau:adapt:kloake',
      statement: 'Die Kloake ist bei Vögeln ein gemeinsamer Ausgang für Darm, Harn- und Geschlechtswege.',
      correct: true,
      explanation: 'Kloake = gemeinsamer Ausgang.',
      wissen: 'Anders als beim Menschen enden mehrere Organsysteme in der Kloake.',
    },
    {
      concept: 'bio:k5:vogel:aufbau:adapt:lungen-tf-falsch',
      statement: 'Vögel atmen wie Fische ausschließlich über Kiemen.',
      correct: false,
      explanation: 'Vögel atmen mit Lunge und Luftsäcken, nicht mit Kiemen.',
      wissen: 'Atmung der Vögel: Lunge plus Luftsäcke — keine Kiemenatmung.',
    },
    {
      concept: 'bio:k5:vogel:aufbau:adapt:herz-tf',
      statement: 'Das Herz treibt den Blutkreislauf der Vögel an.',
      correct: true,
      explanation: 'Das Herz pumpt das Blut durch den Körper.',
      wissen: 'Vögel haben ein leistungsfähiges Herz für den hohen Sauerstoffbedarf beim Fliegen.',
    },
    {
      concept: 'bio:k5:vogel:aufbau:adapt:druesenmagen',
      statement: 'Im Drüsenmagen wird Nahrung vor allem chemisch verdaut.',
      correct: true,
      explanation: 'Drüsenmagen = chemische Verdauung.',
      wissen: 'Verdauungssäfte im Drüsenmagen bereiten die Nahrung für den Muskelmagen vor.',
    },
  ]
  const c = pick(rng, bank)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: bioFw(c.wissen, 'Wikipedia: Vögel', 'https://de.wikipedia.org/wiki/V%C3%B6gel'),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
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

function fishAdaptationExtra(rng: Rng) {
  const bank = [
    {
      concept: 'bio:k5:fisch:aufbau:adapt:kiemen',
      statement: 'Fische nehmen Sauerstoff aus dem Wasser über die Kiemen auf.',
      correct: true,
      explanation: 'Kiemen sind das Atmungsorgan der Fische.',
      wissen: 'Wasser strömt über die Kiemen; dort diffundiert Sauerstoff ins Blut.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:seitenlinie',
      statement: 'Die Seitenlinie hilft Fischen, Strömung und Bewegungen im Wasser wahrzunehmen.',
      correct: true,
      explanation: 'Seitenlinie = Sinnesorgan für Wasserbewegungen.',
      wissen: 'Über die Seitenlinie registrieren Fische Druckwellen — wichtig für Orientierung und Beutefang.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:flossen',
      statement: 'Flossen dienen Vortrieb, Steuerung und Stabilität beim Schwimmen.',
      correct: true,
      explanation: 'Flossen sind Bewegungsorgane.',
      wissen: 'Verschiedene Flossenarten übernehmen Antrieb, Steuerung und Stabilisierung.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:lungen-falsch',
      statement: 'Knochenfische atmen typischerweise mit einer Lunge an Land.',
      correct: false,
      explanation: 'Fische atmen über Kiemen im Wasser.',
      wissen: 'Kiemenatmung ist die typische Angepasstheit der Fische an das Wasserleben.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:stromlinie',
      statement: 'Die Stromlinienform verringert den Wasserwiderstand.',
      correct: true,
      explanation: 'Stromlinienform spart Energie beim Schwimmen.',
      wissen: 'Körperbau und Schwimmen: Stromlinienform ist eine Angepasstheit an das Wasser.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:auge',
      statement: 'Das Auge dient dem Sehen und der Orientierung unter Wasser.',
      correct: true,
      explanation: 'Augen sind wichtige Sinnesorgane der Fische.',
      wissen: 'Fische nutzen das Auge zur Orientierung und zum Beutefang im Wasser.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:schwimmblase',
      statement: 'Die Schwimmblase hilft dem Fisch, ohne ständiges Schwimmen zu schweben.',
      correct: true,
      explanation: 'Schwimmblase = Auftriebsorgan.',
      wissen: 'Durch Gasfüllung der Schwimmblase bleibt der Fisch mit wenig Kraftaufwand in der gewünschten Wassertiefe.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:herz',
      statement: 'Das Herz treibt den Blutkreislauf des Fisches an.',
      correct: true,
      explanation: 'Das Herz pumpt das Blut.',
      wissen: 'Blut transportiert Sauerstoff von den Kiemen zu den Organen — das Herz hält den Kreislauf in Gang.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:schwanzflosse',
      statement: 'Die Schwanzflosse erzeugt den Hauptvortrieb beim Schwimmen.',
      correct: true,
      explanation: 'Schwanzflosse = Antriebsflosse.',
      wissen: 'Seitliche Schläge der Schwanzflosse schieben den Fisch vorwärts.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:magen-darm',
      statement: 'Magen und Darm verdauen Nahrung und nehmen Nährstoffe auf.',
      correct: true,
      explanation: 'Verdauungsorgane der Fische.',
      wissen: 'Im Magen wird Nahrung zersetzt; im Darm werden Nährstoffe aufgenommen.',
    },
    {
      concept: 'bio:k5:fisch:aufbau:adapt:federfahne-falsch',
      statement: 'Fische atmen mit Federfahnen wie Vögel.',
      correct: false,
      explanation: 'Federfahnen gehören zu Vogelfedern — Fische atmen mit Kiemen.',
      wissen: 'Kiemen sind das Atmungsorgan der Fische; Federfahnen sind Teile der Vogelfeder.',
    },
  ]
  const c = pick(rng, bank)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: bioFw(c.wissen, 'Wikipedia: Fische', 'https://de.wikipedia.org/wiki/Fische'),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
}

/** K5 LB2 — Aufbau des Fisches (äußerer + innerer Aufbau, tolerante Clozes, 10er-Runde). */
export const biFischeAufbau: Topic['generate'] = mixedVariants(
  fishLabel,
  fishOrgansLabel,
  fishFunctions,
  fishOrgansFunctions,
  fishFnMc,
  fishOrgansFnMc,
  fishCloze,
  fishOrgansCloze,
  fishTf,
  fishOrgansTf,
  fishAdaptationExtra,
  fishEyeClozePartial,
  fishFnMc,
  fishAdaptationExtra,
)

/** K5 LB5 — Aufbau des Vogels (Organ-Schema; engl. Luftsäcke-Diagramm entfernt). Pool ≥10. */
export const biVoegelAufbau: Topic['generate'] = mixedVariants(
  birdLabel,
  birdLabel,
  birdFunctions,
  birdFnMc,
  birdCloze,
  birdTf,
  birdAdaptationExtra,
  birdFnMc,
  birdCloze,
  birdAdaptationExtra,
  birdTf,
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

/** Gebiss image+blocks (Zahnarten, Commons-Tafel) — mix into Säuger Merkmale. */
export const biSaeugerGebissBild: Topic['generate'] = mixedVariants(
  teethLabel,
  teethLabel,
  teethLabel,
  teethFunctions,
  teethFnMc,
  teethFunctions,
  teethFnMc,
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
