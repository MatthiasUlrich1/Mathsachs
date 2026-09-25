/**
 * Dense subtopic generators + NEW UX variants for Biologie K5–10.
 * Topic-scoped: no cross-pollination between Überblick / Spezial / andere Gruppen.
 * Original German; themes mapped from Schlaukopf under Lehrplan 522 LBs.
 */
import { bankGenerate } from './biologieBank'
import {
  clozeBlanksTask,
  flashcardBioTask,
  iconBelongBioTask,
  matchTermsTask,
  pick,
  shuffle,
} from './biologieHelpers'
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'
import { BIOLOGIE_K5_GENERATORS as BASE_K5 } from './biologie5'
import { BIOLOGIE_K6_GENERATORS as BASE_K6 } from './biologie6'
import { BIOLOGIE_K7_GENERATORS as BASE_K7 } from './biologie7'
import { BIOLOGIE_K8_GENERATORS as BASE_K8 } from './biologie8'
import { BIOLOGIE_K9_GENERATORS as BASE_K9 } from './biologie9'
import { BIOLOGIE_K10_GENERATORS as BASE_K10 } from './biologie10'
import { BIOLOGIE_SPECIAL_GENERATORS } from './biologieSpecialTopics'
import { BIOLOGIE_ANATOMY_GENERATORS } from './biologieAnatomy'
import {
  buildFischeLebensraumDense,
  buildFischeSchutzDense,
  buildLurcheMetaDense,
  buildVoegelFortpflanzungDense,
} from './biologieFischeDense'
import {
  biKriechtiereFortpflanzung,
  biLurcheFortpflanzung,
  buildSaeugerSchutzDense,
  buildSaeugerUeberblickDense,
  buildVoegelFlugDense,
} from './biologieFortpflanzungExpand'
import type { Rng } from '../lib/rng'
import type { BioBank } from './biologieBank'

const fw = (text: string) => ({
  text,
  quelle: 'Wikipedia: Wirbeltiere',
  url: 'https://de.wikipedia.org/wiki/Wirbeltiere',
})

type VertebrateGroup = 'fisch' | 'lurch' | 'kriechtier' | 'vogel' | 'saeuger'

type IconSet = {
  group: VertebrateGroup
  concept: string
  question: string
  prompt: string
  correctId: string
  options: Array<{ id: string; label: string; icon: string }>
  explanation: string
  wissen: string
}

/**
 * Feature-based iconBelong (Gym K5): no “pick the labeled animal” giveaways.
 * Cards show Merkmale — student must know which trait fits which group.
 */
const VERTEBRATE_FEATURE_ICONS: IconSet[] = [
  {
    group: 'fisch',
    concept: 'bio:wirbeltiere:fisch-kiemen-flossen',
    question: 'Welches Merkmalspaar passt typisch zu Fischen?',
    prompt: 'Angepasstheit ans Wasser',
    correctId: 'kiemen',
    options: [
      { id: 'kiemen', label: 'Kiemen und Flossen', icon: '🫧' },
      { id: 'federn', label: 'Federn und Flug', icon: '🪶' },
      { id: 'fell', label: 'Fell und Säugen', icon: '🍼' },
      { id: 'horn', label: 'Trockene Hornschicht an Land', icon: '🛡️' },
    ],
    explanation: 'Fische atmen über Kiemen und steuern mit Flossen.',
    wissen:
      'Fische sind an Wasser angepasst: Kiemen entziehen dem Wasser Sauerstoff, Flossen dienen Antrieb und Steuerung.',
  },
  {
    group: 'lurch',
    concept: 'bio:wirbeltiere:lurch-haut-meta',
    question: 'Welches Merkmal ist typisch für viele Lurche?',
    prompt: 'Entwicklung / Haut',
    correctId: 'meta',
    options: [
      { id: 'meta', label: 'Feuchte Haut, oft Metamorphose', icon: '🔁' },
      { id: 'federn', label: 'Federkleid', icon: '🪶' },
      { id: 'kiemen', label: 'Nur Kiemen lebenslang, nie Lungen', icon: '🫧' },
      { id: 'fell', label: 'Gleichwarm mit Fell', icon: '🦌' },
    ],
    explanation: 'Viele Lurche haben feuchte Haut und durchlaufen eine Metamorphose.',
    wissen:
      'Viele Lurche haben feuchte Haut (Hautatmung) und eine Metamorphose von der Wasserlarve zum landlebenden Adulttier.',
  },
  {
    group: 'kriechtier',
    concept: 'bio:wirbeltiere:kriechtier-horn',
    question: 'Welches Merkmal kennzeichnet Kriechtiere besonders?',
    prompt: 'Körperbedeckung',
    correctId: 'horn',
    options: [
      { id: 'horn', label: 'Trockene Hornschicht / Schuppen', icon: '🛡️' },
      { id: 'haut', label: 'Ständig feuchte Nackthaut', icon: '💧' },
      { id: 'federn', label: 'Federn', icon: '🪶' },
      { id: 'fell', label: 'Dichtes Fell und Säugen', icon: '🍼' },
    ],
    explanation: 'Kriechtiere haben eine trockene Hornschicht und Lungenatmung.',
    wissen:
      'Kriechtiere tragen eine trockene Hornschicht bzw. Schuppen und atmen mit Lungen — Schutz vor Austrocknung an Land.',
  },
  {
    group: 'vogel',
    concept: 'bio:wirbeltiere:vogel-federn',
    question: 'Welches Merkmal unterscheidet Vögel klar von Fledermäusen?',
    prompt: 'Körperbedeckung',
    correctId: 'federn',
    options: [
      { id: 'federn', label: 'Federn', icon: '🪶' },
      { id: 'fell', label: 'Fell und Säugen', icon: '🦇' },
      { id: 'schuppen', label: 'Nur Fischschuppen', icon: '🐟' },
      { id: 'chitin', label: 'Chitinpanzer außen', icon: '🪲' },
    ],
    explanation: 'Federn sind das Leitmerkmal der Vögel — Fledermäuse sind Säuger.',
    wissen:
      'Federn kennzeichnen Vögel. Fledermäuse fliegen mit Flughaut und Fell — gleicher Flug, andere Körperbedeckung.',
  },
  {
    group: 'saeuger',
    concept: 'bio:wirbeltiere:saeuger-saeugen',
    question: 'Welches Merkmal ist namensgebend für Säugetiere?',
    prompt: 'Fortpflanzung / Ernährung der Jungen',
    correctId: 'milch',
    options: [
      { id: 'milch', label: 'Junge mit Milch ernähren', icon: '🍼' },
      { id: 'laich', label: 'Nur Laich im Wasser ablegen', icon: '🥚' },
      { id: 'federn', label: 'Federkleid', icon: '🪶' },
      { id: 'kiemen', label: 'Kiemenatmung lebenslang', icon: '🫧' },
    ],
    explanation: 'Säugetiere säugen ihre Jungen — daher der Name.',
    wissen:
      'Säugetiere säugen ihre Jungen mit Milch; dazu kommen meist Fell/Haare und Gleichwarmigkeit.',
  },
]

function iconsForGroup(group: VertebrateGroup) {
  return (rng: Rng) => {
    const s = pick(
      rng,
      VERTEBRATE_FEATURE_ICONS.filter((x) => x.group === group),
    )
    return iconBelongBioTask(rng, {
      ...s,
      fachwissen: fw(s.wissen),
      dedupeKey: s.concept,
      contentIds: [s.concept],
    })
  }
}

/** Systematik / Zuordnung: Merkmalsvergleich über Gruppen. */
function vertebrateAssignIcons(rng: Rng) {
  const s = pick(rng, VERTEBRATE_FEATURE_ICONS)
  return iconBelongBioTask(rng, {
    ...s,
    fachwissen: fw(s.wissen),
    dedupeKey: s.concept,
    contentIds: [s.concept],
  })
}

function vertebrateCompareCloze(rng: Rng) {
  const items = [
    {
      q: 'Atmung der Wirbeltiergruppen',
      template: 'Fische atmen über ___, Lurche oft auch über die ___, Vögel und Säuger über ___.',
      accepted: [
        ['Kiemen', 'Kieme'],
        ['Haut', 'feuchte Haut', 'Hautatmung'],
        ['Lungen', 'Lunge'],
      ],
      explanation: 'Kiemen (Wasser), Haut/Lungen (Lurche), Lungen (Landwirbeltiere).',
      wissen:
        'Atmungsorgane spiegeln den Lebensraum: Fische — Kiemen; viele Lurche zusätzlich Haut; Vögel und Säuger — Lungen.',
    },
    {
      q: 'Körperbedeckung',
      template: 'Fische haben oft ___, Kriechtiere eine ___, Vögel ___, Säuger ___ oder Haare.',
      accepted: [
        ['Schuppen', 'Schuppe'],
        ['Hornschicht', 'Schuppenpanzer', 'Hornschuppen'],
        ['Federn', 'Federkleid'],
        ['Fell', 'Fell/Haare'],
      ],
      explanation: 'Die Körperbedeckung ist an den Lebensraum angepasst.',
      wissen:
        'Körperbedeckung ist an den Lebensraum angepasst: Schuppen (Wasser), Hornschicht (Land), Federn (Flug/Wärme), Fell (Wärme).',
    },
  ]
  const it = pick(rng, items)
  return clozeBlanksTask({
    question: it.q,
    template: it.template,
    accepted: it.accepted,
    solution: it.accepted.map((a) => a[0]).join(' / '),
    explanation: it.explanation,
    fachwissen: fw(it.wissen),
    dedupeKey: it.q === 'Körperbedeckung' ? 'bio:wirbeltiere:koerperbedeckung-vergleich' : 'bio:wirbeltiere:atmung-vergleich',
    contentIds: [
      it.q === 'Körperbedeckung'
        ? 'bio:wirbeltiere:koerperbedeckung-vergleich'
        : 'bio:wirbeltiere:atmung-vergleich',
    ],
  })
}

function vertebrateComparePairs(rng: Rng) {
  const pool = [
    { term: 'Kieme', meaning: 'Atemorgan im Wasser', wissen: 'Fische atmen mit Kiemen.' },
    { term: 'Feder', meaning: 'Flug und Wärmeschutz bei Vögeln', wissen: 'Federn sind typisch für Vögel.' },
    { term: 'Laich', meaning: 'Eigelege im Wasser (oft Lurche/Fische)', wissen: 'Laichen hängt am Wasserleben.' },
    { term: 'Hornschicht', meaning: 'Trockene Hautbedeckung der Kriechtiere', wissen: 'Schützt vor Austrocknung an Land.' },
    { term: 'Säugen', meaning: 'Jungtiere mit Milch ernähren', wissen: 'Namensgebend für Säugetiere.' },
    { term: 'Flosse', meaning: 'Steuer- und Antriebsorgan der Fische', wissen: 'Angepasstheit an Schwimmen.' },
    { term: 'Metamorphose', meaning: 'Gestaltwechsel (z. B. Kaulquappe → Frosch)', wissen: 'Typisch für viele Lurche.' },
    { term: 'Gleichwarm', meaning: 'Körpertemperatur relativ konstant', wissen: 'Vögel und Säuger sind gleichwarm.' },
    { term: 'Wechselwarm', meaning: 'Körpertemperatur folgt der Umgebung', wissen: 'Fische, Lurche, Kriechtiere.' },
    { term: 'Lunge', meaning: 'Atemorgan der Landwirbeltiere', wissen: 'Vögel, Säuger, viele Kriechtiere.' },
    { term: 'Nest', meaning: 'Brut- und Aufzuchtort vieler Vögel', wissen: 'Fortpflanzung der Vögel.' },
    { term: 'Fell', meaning: 'Haarkleid der Säugetiere', wissen: 'Wärmeschutz und Schutz.' },
  ]
  const three = shuffle(rng, pool).slice(0, 3)
  const rest = pool.filter((p) => !three.includes(p))
  const keys = three.map((p) => `bio:wirbeltiere:paar-${p.term.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')}`)
  return matchTermsTask(rng, {
    question: 'Ordne Fachbegriff und Bedeutung (Klick-Paare).',
    terms: three.map((p) => p.term),
    meanings: three.map((p) => p.meaning),
    distractor: rest[0]?.meaning ?? 'Photosynthese der Blätter',
    solution: three.map((p) => `${p.term} → ${p.meaning}`).join('; '),
    explanation: three.map((p) => p.wissen).join(' '),
    fachwissen: fw(three.map((p) => `${p.term}: ${p.wissen}`).join(' ')),
    dedupeKey: `pair:${[...keys].sort().join('+')}`,
    contentIds: keys,
  })
}

const GROUP_FLASH: Record<
  VertebrateGroup,
  Array<{ front: string; answer: string; alt: string[]; wrong: string[]; wissen: string }>
> = {
  fisch: [
    {
      front: 'Atmungsorgan der Fische?',
      answer: 'Kiemen',
      alt: ['Kieme'],
      wrong: ['Lungen', 'Federn', 'Fell'],
      wissen:
        'Fische nehmen Sauerstoff aus dem Wasser über Kiemen auf. Lamellen vergrößern die Austauschfläche; Wasser strömt am Kiemengewebe vorbei.',
    },
    {
      front: 'Womit steuern Fische beim Schwimmen?',
      answer: 'Flossen',
      alt: ['Flosse'],
      wrong: ['Flügel', 'Beine', 'Hörner'],
      wissen:
        'Flossen dienen Antrieb, Steuerung und Stabilität im Wasser. Rücken- und Afterflosse stabilisieren, Brust- und Bauchflossen steuern, die Schwanzflosse treibt oft an.',
    },
  ],
  lurch: [
    {
      front: 'Entwicklungswechsel bei Frosch/Kröte?',
      answer: 'Metamorphose',
      alt: ['Verwandlung'],
      wrong: ['Photosynthese', 'Winterschlaf', 'Vogelzug'],
      wissen:
        'Viele Lurche durchlaufen eine Metamorphose: aus der wasserlebenden Larve (z. B. Kaulquappe mit Kiemen) wird ein landtaugliches Adulttier mit Lungen und Beinen.',
    },
    {
      front: 'Typische Haut der Lurche?',
      answer: 'feuchte Haut',
      alt: ['Feuchthaut', 'drüsenreiche Haut'],
      wrong: ['Hornschicht', 'Federn', 'Fell'],
      wissen:
        'Die Haut der Lurche ist dünn, drüsenreich und feucht — sie ermöglicht zusätzliche Hautatmung und ist daher an feuchte Lebensräume gebunden.',
    },
  ],
  kriechtier: [
    {
      front: 'Körpertemperatur der Kriechtiere?',
      answer: 'wechselwarm',
      alt: ['poikilotherm', 'kaltblütig'],
      wrong: ['gleichwarm', 'homoiotherm', 'warmblütig'],
      wissen:
        'Kriechtiere sind wechselwarm: ihre Körpertemperatur folgt weitgehend der Umgebung. Aktivität hängt stark von der Außentemperatur ab.',
    },
    {
      front: 'Körperbedeckung der Kriechtiere?',
      answer: 'Hornschicht',
      alt: ['Hornschuppen', 'Schuppen'],
      wrong: ['Federn', 'Fell', 'Schleimhaut'],
      wissen:
        'Eine trockene Hornschicht bzw. Hornschuppen schützt vor Austrocknung an Land. Kriechtiere atmen mit Lungen und sind unabhängiger vom Wasser als Lurche.',
    },
  ],
  vogel: [
    {
      front: 'Was kennzeichnet Vögel äußerlich?',
      answer: 'Federn',
      alt: ['Federkleid'],
      wrong: ['Fell', 'Schuppenpanzer', 'Chitin'],
      wissen:
        'Federn sind das typische Körperkleid der Vögel: sie isolieren Wärme und bilden bei vielen Arten die Tragfläche für den Flug.',
    },
    {
      front: 'Sind Vögel gleichwarm oder wechselwarm?',
      answer: 'gleichwarm',
      alt: ['homoiotherm', 'warmblütig'],
      wrong: ['wechselwarm', 'poikilotherm', 'kaltblütig'],
      wissen:
        'Vögel halten ihre Körpertemperatur relativ konstant (gleichwarm). Das ermöglicht hohe Aktivität, erfordert aber viel Energie und gute Isolierung durch Federn.',
    },
  ],
  saeuger: [
    {
      front: 'Wie ernähren Säuger ihre Jungen?',
      answer: 'Säugen',
      alt: ['mit Milch', 'Milch'],
      wrong: ['nur mit Laich', 'Photosynthese', 'Kiemenatmung'],
      wissen:
        'Säugetiere ernähren ihre Jungen mit Milch aus Milchdrüsen — das namensgebende Merkmal. Dazu kommen meist Fell/Haare und oft lebendgebärend.',
    },
    {
      front: 'Typische Körperbedeckung der Säuger?',
      answer: 'Fell',
      alt: ['Haare', 'Fell/Haare'],
      wrong: ['Federn', 'Schuppenpanzer', 'Chitin'],
      wissen:
        'Haare bzw. Fell isolieren und schützen die Haut. Zusammen mit Gleichwarmigkeit und Säugen kennzeichnen sie die Säugetiere.',
    },
  ],
}

function groupFlash(group: VertebrateGroup) {
  return (rng: Rng) => {
    const c = pick(rng, GROUP_FLASH[group])
    const concept = `bio:k5:${group}:merkmale:flash:${c.answer.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/[^a-z0-9]+/g, '-')}`
    return flashcardBioTask({
      question: c.front,
      front: c.front,
      accepted: [c.answer, ...c.alt],
      solution: c.answer,
      explanation: `${c.answer}: ${c.wissen}`,
      fachwissen: fw(c.wissen),
      choices: shuffle(rng, [c.answer, ...c.wrong.slice(0, 3)]),
      dedupeKey: concept,
      contentIds: [concept],
    })
  }
}

/** Blend base with optional same-topic UX only (never foreign groups). */
function withTopicUx(
  base: Topic['generate'] | undefined,
  ...extras: Array<(rng: Rng) => ReturnType<Topic['generate']>>
): Topic['generate'] {
  if (!base && extras.length === 0) {
    throw new Error('withTopicUx: need base or extras')
  }
  if (!base) return mixedVariants(...extras)
  if (extras.length === 0) return base
  return mixedVariants(base, ...extras)
}

/** Systematik / Zuordnung: Vergleich über Gruppen hinweg ist hier absichtlich. */
const vertebrateCompareUx = mixedVariants(
  vertebrateAssignIcons,
  vertebrateCompareCloze,
  vertebrateComparePairs,
  vertebrateAssignIcons,
)

/** Enhanced K5 registry: Überblick gets icons only; Merkmale/Flug get flash only — never both. */
export const BIOLOGIE_K5_EXPANDED: Record<string, Topic['generate']> = {
  'bi-k5-lb1-merkmale': BASE_K5['bi-k5-lb1-merkmale']!,
  'bi-k5-lb1-kennzeichen': BASE_K5['bi-k5-lb1-kennzeichen']!,
  'bi-k5-lb2-fische': withTopicUx(BASE_K5['bi-k5-lb2-fische'], iconsForGroup('fisch')),
  'bi-k5-lb2-fische-aufbau': BIOLOGIE_ANATOMY_GENERATORS['bi-k5-lb2-fische-aufbau']!,
  'bi-k5-lb2-fische-merkmale': withTopicUx(
    BASE_K5['bi-k5-lb2-fische-merkmale'],
    groupFlash('fisch'),
  ),
  'bi-k5-lb2-fische-lebensraum': buildFischeLebensraumDense(
    BASE_K5['bi-k5-lb2-fische-lebensraum']!,
  ),
  'bi-k5-lb2-fische-schutz': buildFischeSchutzDense(BASE_K5['bi-k5-lb2-fische-schutz']!),
  'bi-k5-lb3-lurche': withTopicUx(BASE_K5['bi-k5-lb3-lurche'], iconsForGroup('lurch')),
  'bi-k5-lb3-lurche-merkmale': withTopicUx(
    BASE_K5['bi-k5-lb3-lurche-merkmale'],
    groupFlash('lurch'),
  ),
  'bi-k5-lb3-lurche-meta': buildLurcheMetaDense(BASE_K5['bi-k5-lb3-lurche-meta']!),
  'bi-k5-lb3-lurche-fortpflanzung': biLurcheFortpflanzung,
  'bi-k5-lb3-lurche-schutz': BASE_K5['bi-k5-lb3-lurche-schutz']!,
  'bi-k5-lb4-kriechtiere': withTopicUx(
    BASE_K5['bi-k5-lb4-kriechtiere'],
    iconsForGroup('kriechtier'),
  ),
  'bi-k5-lb4-kriechtiere-merkmale': withTopicUx(
    BASE_K5['bi-k5-lb4-kriechtiere-merkmale'],
    groupFlash('kriechtier'),
  ),
  'bi-k5-lb4-kriechtiere-arten': BASE_K5['bi-k5-lb4-kriechtiere-arten']!,
  'bi-k5-lb4-kriechtiere-fortpflanzung': biKriechtiereFortpflanzung,
  'bi-k5-lb5-voegel': withTopicUx(BASE_K5['bi-k5-lb5-voegel'], iconsForGroup('vogel')),
  'bi-k5-lb5-voegel-aufbau': BIOLOGIE_ANATOMY_GENERATORS['bi-k5-lb5-voegel-aufbau']!,
  'bi-k5-lb5-voegel-flug': buildVoegelFlugDense(
    withTopicUx(BASE_K5['bi-k5-lb5-voegel-flug'], groupFlash('vogel')),
  ),
  'bi-k5-lb5-voegel-fortpflanzung': buildVoegelFortpflanzungDense(
    BASE_K5['bi-k5-lb5-voegel-fortpflanzung']!,
  ),
  'bi-k5-lb6-saeugetiere': buildSaeugerUeberblickDense(
    withTopicUx(BASE_K5['bi-k5-lb6-saeugetiere'], iconsForGroup('saeuger')),
  ),
  'bi-k5-lb6-saeuger-merkmale': withTopicUx(
    BASE_K5['bi-k5-lb6-saeuger-merkmale'],
    groupFlash('saeuger'),
  ),
  'bi-k5-lb6-saeuger-angepasst': BASE_K5['bi-k5-lb6-saeuger-angepasst']!,
  'bi-k5-lb6-saeuger-schutz': buildSaeugerSchutzDense(BASE_K5['bi-k5-lb6-saeuger-schutz']!),
  // Systematik = Lehrplan-Klassifikation; Zuordnung = Merkmalsvergleich UX — disjoint.
  'bi-k5-lb7-systematik': BASE_K5['bi-k5-lb7-systematik']!,
  'bi-k5-lb7-zuordnung': vertebrateCompareUx,
  'bi-k5-lbw-winter': BASE_K5['bi-k5-lbw-winter']!,
  'bi-k5-lbw-saurier': BASE_K5['bi-k5-lbw-saurier']!,
  'bi-k5-lbw-haltung': BASE_K5['bi-k5-lbw-haltung']!,
}

const cellIcons: NonNullable<BioBank['icons']> = [
  {
    concept: 'bio:zelle:icon-zellkern',
    question: 'Welches Organell enthält die Erbinformation?',
    prompt: 'Pflanzen- und Tierzelle',
    options: [
      { id: 'kern', label: 'Zellkern', icon: '🔵' },
      { id: 'wand', label: 'Zellwand', icon: '🧱' },
      { id: 'mito', label: 'Mitochondrium', icon: '⚡' },
      { id: 'vakuole', label: 'Vakuole', icon: '💧' },
    ],
    correctId: 'kern',
    explanation: 'Im Zellkern liegt die DNA.',
    wissen:
      'Der Zellkern enthält die Erbinformation (DNA). Zellwand und große Vakuole sind typisch für Pflanzenzellen; Organellen-Details → Mikroskop-Spezial.',
  },
]

/**
 * Merge overview banks with dedicated special-topic generators.
 * Never alias Spezial → Überblick (that caused Blütenfragen under „Bäume“).
 */
export function withSpecialTopics(
  base: Record<string, Topic['generate']>,
  specialIds: readonly string[],
): Record<string, Topic['generate']> {
  const out: Record<string, Topic['generate']> = { ...base }
  for (const id of specialIds) {
    const g = BIOLOGIE_SPECIAL_GENERATORS[id]
    if (g) out[id] = g
  }
  return out
}

/** @deprecated Prefer withSpecialTopics — kept for any external callers. */
export function expandFromBase(
  base: Record<string, Topic['generate']>,
  aliases: Record<string, string>,
): Record<string, Topic['generate']> {
  const out: Record<string, Topic['generate']> = { ...base }
  for (const [id, src] of Object.entries(aliases)) {
    const g = out[src] ?? base[src]
    if (g) out[id] = g
  }
  return out
}

export const BIOLOGIE_K6_EXPANDED = withSpecialTopics(BASE_K6, [
  'bi-k6-lb1-bluete',
  'bi-k6-lb1-baeume',
  'bi-k6-lb1-organe',
  'bi-k6-lb4-nahrung',
  'bi-k6-lb5-mikroskop',
])

// Cells: cell icons only — never vertebrate assign sets
BIOLOGIE_K6_EXPANDED['bi-k6-lb5-zellen'] = withTopicUx(
  BASE_K6['bi-k6-lb5-zellen'],
  bankGenerate({
    quelle: 'Wikipedia: Zelle (Biologie)',
    url: 'https://de.wikipedia.org/wiki/Zelle_(Biologie)',
    icons: cellIcons,
    facts: [
      {
        prompt: 'Zellvergleich',
        answer: 'Pflanzenzelle',
        explanation: 'Cloze zu Organellen.',
        wissen:
          'Der Zellkern steuert die Zelle und enthält DNA; Chloroplasten und Zellwand sind typische Pflanzenmerkmale — Vertiefung im Mikroskop-Spezial.',
        cloze:
          'Die ___ enthält DNA; Pflanzenzellen haben oft eine feste ___.',
        clozeAccepted: [
          ['Zellkern', 'Kern'],
          ['Zellwand', 'Wand'],
        ],
      },
    ],
  }),
)

export const BIOLOGIE_K7_EXPANDED = withSpecialTopics(BASE_K7, [
  'bi-k7-lb1-hygiene',
  'bi-k7-lb2-herz',
  'bi-k7-lb2-immun',
  'bi-k7-lb3-naehrstoffe',
  'bi-k7-lb3-organe',
])

export const BIOLOGIE_K8_EXPANDED = withSpecialTopics(BASE_K8, [
  'bi-k8-lb1-auge-ohr',
  'bi-k8-lb1-hormone',
  'bi-k8-lb1-nerv-reflex',
  'bi-k8-lb1-haut',
  'bi-k8-lb2-entwicklung',
])

export const BIOLOGIE_K9_EXPANDED = withSpecialTopics(BASE_K9, [
  'bi-k9-lb1-fotosynthese',
  'bi-k9-lb1-wasser',
  'bi-k9-lb1-blatt',
  'bi-k9-lb2-wald-gewaesser',
  'bi-k9-lb2-stoffkreis',
  'bi-k9-lb2-stickstoff',
])

export const BIOLOGIE_K10_EXPANDED = withSpecialTopics(BASE_K10, [
  'bi-k10-lb1-mendel',
  'bi-k10-lb1-dna',
  'bi-k10-lb2-selektion',
])
