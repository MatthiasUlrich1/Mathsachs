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
    wissen: 'Atmung und Fortbewegung spiegeln den Lebensraum Wasser wider.',
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
    wissen: 'Übergang Wasser–Land: Kaulquappe → erwachsenes Tier.',
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
    wissen: 'Angepasstheit an das Landleben ohne Austrocknung.',
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
    wissen: 'Homologie/Analogie: Flug bei Vögeln und Fledermäusen, aber unterschiedliche Bedeckung.',
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
    wissen: 'Gleichwarm + Fell/Haare + Säugen sind zentrale Merkmale.',
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
      wissen: 'Atmungsorgane spiegeln den Lebensraum wider.',
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
      wissen: 'Struktur–Funktion–Angepasstheit (Systematisierung).',
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
  Array<{ front: string; answer: string; alt: string[]; wrong: string[] }>
> = {
  fisch: [
    {
      front: 'Atmungsorgan der Fische?',
      answer: 'Kiemen',
      alt: ['Kieme'],
      wrong: ['Lungen', 'Federn', 'Fell'],
    },
    {
      front: 'Womit steuern Fische beim Schwimmen?',
      answer: 'Flossen',
      alt: ['Flosse'],
      wrong: ['Flügel', 'Beine', 'Hörner'],
    },
  ],
  lurch: [
    {
      front: 'Entwicklungswechsel bei Frosch/Kröte?',
      answer: 'Metamorphose',
      alt: ['Verwandlung'],
      wrong: ['Photosynthese', 'Winterschlaf', 'Vogelzug'],
    },
    {
      front: 'Typische Haut der Lurche?',
      answer: 'feuchte Haut',
      alt: ['Feuchthaut', 'drüsenreiche Haut'],
      wrong: ['Hornschicht', 'Federn', 'Fell'],
    },
  ],
  kriechtier: [
    {
      front: 'Körpertemperatur der Kriechtiere?',
      answer: 'wechselwarm',
      alt: ['poikilotherm', 'kaltblütig'],
      wrong: ['gleichwarm', 'homoiotherm', 'warmblütig'],
    },
    {
      front: 'Körperbedeckung der Kriechtiere?',
      answer: 'Hornschicht',
      alt: ['Hornschuppen', 'Schuppen'],
      wrong: ['Federn', 'Fell', 'Schleimhaut'],
    },
  ],
  vogel: [
    {
      front: 'Was kennzeichnet Vögel äußerlich?',
      answer: 'Federn',
      alt: ['Federkleid'],
      wrong: ['Fell', 'Schuppenpanzer', 'Chitin'],
    },
    {
      front: 'Sind Vögel gleichwarm oder wechselwarm?',
      answer: 'gleichwarm',
      alt: ['homoiotherm', 'warmblütig'],
      wrong: ['wechselwarm', 'poikilotherm', 'kaltblütig'],
    },
  ],
  saeuger: [
    {
      front: 'Wie ernähren Säuger ihre Jungen?',
      answer: 'Säugen',
      alt: ['mit Milch', 'Milch'],
      wrong: ['nur mit Laich', 'Photosynthese', 'Kiemenatmung'],
    },
    {
      front: 'Typische Körperbedeckung der Säuger?',
      answer: 'Fell',
      alt: ['Haare', 'Fell/Haare'],
      wrong: ['Federn', 'Schuppenpanzer', 'Chitin'],
    },
  ],
}

function groupFlash(group: VertebrateGroup) {
  return (rng: Rng) => {
    const c = pick(rng, GROUP_FLASH[group])
    return flashcardBioTask({
      question: 'Karteikarte: lesen → umdrehen → antworten.',
      front: c.front,
      accepted: [c.answer, ...c.alt],
      solution: c.answer,
      explanation: `Gesucht war: ${c.answer}.`,
      fachwissen: fw(
        `Zur Frage „${c.front}“: Die gesuchte Antwort ist „${c.answer}“. ${c.alt.length ? `Auch akzeptiert: ${c.alt.join(', ')}.` : ''} Ordne das Merkmal der Wirbeltiergruppe zu.`,
      ),
      choices: shuffle(rng, [c.answer, ...c.wrong.slice(0, 3)]),
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

/** Enhanced K5 registry: topic-scoped — no foreign-group bleed. */
export const BIOLOGIE_K5_EXPANDED: Record<string, Topic['generate']> = {
  'bi-k5-lb1-merkmale': BASE_K5['bi-k5-lb1-merkmale']!,
  'bi-k5-lb1-kennzeichen': BASE_K5['bi-k5-lb1-kennzeichen']!,
  'bi-k5-lb2-fische': withTopicUx(
    BASE_K5['bi-k5-lb2-fische'],
    iconsForGroup('fisch'),
    groupFlash('fisch'),
  ),
  'bi-k5-lb2-fische-merkmale': withTopicUx(
    BASE_K5['bi-k5-lb2-fische-merkmale'],
    groupFlash('fisch'),
  ),
  'bi-k5-lb2-fische-lebensraum': BASE_K5['bi-k5-lb2-fische-lebensraum']!,
  'bi-k5-lb2-fische-schutz': BASE_K5['bi-k5-lb2-fische-schutz']!,
  'bi-k5-lb3-lurche': withTopicUx(
    BASE_K5['bi-k5-lb3-lurche'],
    iconsForGroup('lurch'),
    groupFlash('lurch'),
  ),
  'bi-k5-lb3-lurche-merkmale': withTopicUx(
    BASE_K5['bi-k5-lb3-lurche-merkmale'],
    groupFlash('lurch'),
  ),
  'bi-k5-lb3-lurche-meta': BASE_K5['bi-k5-lb3-lurche-meta']!,
  'bi-k5-lb3-lurche-schutz': BASE_K5['bi-k5-lb3-lurche-schutz']!,
  'bi-k5-lb4-kriechtiere': withTopicUx(
    BASE_K5['bi-k5-lb4-kriechtiere'],
    iconsForGroup('kriechtier'),
    groupFlash('kriechtier'),
  ),
  'bi-k5-lb4-kriechtiere-merkmale': withTopicUx(
    BASE_K5['bi-k5-lb4-kriechtiere-merkmale'],
    groupFlash('kriechtier'),
  ),
  'bi-k5-lb4-kriechtiere-arten': BASE_K5['bi-k5-lb4-kriechtiere-arten']!,
  'bi-k5-lb5-voegel': withTopicUx(
    BASE_K5['bi-k5-lb5-voegel'],
    iconsForGroup('vogel'),
    groupFlash('vogel'),
  ),
  'bi-k5-lb5-voegel-flug': withTopicUx(BASE_K5['bi-k5-lb5-voegel-flug'], groupFlash('vogel')),
  'bi-k5-lb5-voegel-fortpflanzung': BASE_K5['bi-k5-lb5-voegel-fortpflanzung']!,
  'bi-k5-lb6-saeugetiere': withTopicUx(
    BASE_K5['bi-k5-lb6-saeugetiere'],
    iconsForGroup('saeuger'),
    groupFlash('saeuger'),
  ),
  'bi-k5-lb6-saeuger-merkmale': withTopicUx(
    BASE_K5['bi-k5-lb6-saeuger-merkmale'],
    groupFlash('saeuger'),
  ),
  'bi-k5-lb6-saeuger-angepasst': BASE_K5['bi-k5-lb6-saeuger-angepasst']!,
  'bi-k5-lb6-saeuger-schutz': BASE_K5['bi-k5-lb6-saeuger-schutz']!,
  'bi-k5-lb7-systematik': withTopicUx(BASE_K5['bi-k5-lb7-systematik'], vertebrateCompareUx),
  'bi-k5-lb7-zuordnung': vertebrateCompareUx,
  'bi-k5-lbw-winter': BASE_K5['bi-k5-lbw-winter']!,
  'bi-k5-lbw-saurier': BASE_K5['bi-k5-lbw-saurier']!,
  'bi-k5-lbw-haltung': BASE_K5['bi-k5-lbw-haltung']!,
}

const cellIcons: NonNullable<BioBank['icons']> = [
  {
    concept: 'bio:zelle:icon-chloroplast',
    question: 'Welches Organell betreibt Fotosynthese?',
    prompt: 'Pflanzenzelle',
    options: [
      { id: 'chloro', label: 'Chloroplast', icon: '🟢' },
      { id: 'mito', label: 'Mitochondrium', icon: '⚡' },
      { id: 'kern', label: 'Zellkern', icon: '🔵' },
      { id: 'wand', label: 'Zellwand', icon: '🧱' },
    ],
    correctId: 'chloro',
    explanation: 'Chloroplasten enthalten Chlorophyll und betreiben Fotosynthese.',
    wissen: 'Vergleich Pflanzen-/Tierzelle.',
  },
]

/**
 * Alias / expand without foreign UX bundles.
 * Optional `extraBySrc` adds only topic-local extras keyed by source id.
 */
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

export const BIOLOGIE_K6_EXPANDED = expandFromBase(BASE_K6, {
  'bi-k6-lb1-bluete': 'bi-k6-lb1-samenpflanzen',
  'bi-k6-lb1-baeume': 'bi-k6-lb1-samenpflanzen',
  'bi-k6-lb1-organe': 'bi-k6-lb1-samenpflanzen',
  // insekten / spinnen / wirbellose have dedicated banks in BASE_K6 — do not alias together
  'bi-k6-lb4-nahrung': 'bi-k6-lb4-wald',
  'bi-k6-lb5-mikroskop': 'bi-k6-lb5-zellen',
})

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
        wissen: 'Organellen.',
        cloze:
          'Die ___ enthält DNA; ___ betreiben Fotosynthese; die ___ gibt der Pflanzenzelle Stabilität.',
        clozeAccepted: [
          ['Zellkern', 'Kern'],
          ['Chloroplasten', 'Chloroplast'],
          ['Zellwand', 'Wand'],
        ],
      },
    ],
  }),
)

export const BIOLOGIE_K7_EXPANDED = expandFromBase(BASE_K7, {
  'bi-k7-lb1-hygiene': 'bi-k7-lb1-mikroben',
  'bi-k7-lb2-herz': 'bi-k7-lb2-blut',
  'bi-k7-lb2-immun': 'bi-k7-lb2-blut',
  'bi-k7-lb3-naehrstoffe': 'bi-k7-lb3-ernaehrung',
  'bi-k7-lb3-organe': 'bi-k7-lb3-ernaehrung',
})

export const BIOLOGIE_K8_EXPANDED = expandFromBase(BASE_K8, {
  'bi-k8-lb1-auge-ohr': 'bi-k8-lb1-sinne',
  'bi-k8-lb1-hormone': 'bi-k8-lb1-sinne',
  'bi-k8-lb2-entwicklung': 'bi-k8-lb2-sexualitaet',
})

export const BIOLOGIE_K9_EXPANDED = expandFromBase(BASE_K9, {
  'bi-k9-lb1-fotosynthese': 'bi-k9-lb1-pflanzen',
  'bi-k9-lb1-wasser': 'bi-k9-lb1-pflanzen',
  'bi-k9-lb2-wald-gewaesser': 'bi-k9-lb2-oekosystem',
  'bi-k9-lb2-stoffkreis': 'bi-k9-lb2-oekosystem',
})

export const BIOLOGIE_K10_EXPANDED = expandFromBase(BASE_K10, {
  'bi-k10-lb1-mendel': 'bi-k10-lb1-genetik',
  'bi-k10-lb1-dna': 'bi-k10-lb1-genetik',
  'bi-k10-lb2-selektion': 'bi-k10-lb2-artenvielfalt',
})
