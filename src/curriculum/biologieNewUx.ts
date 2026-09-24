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
  question: string
  prompt: string
  correctId: string
  options: Array<{ id: string; label: string; icon: string }>
  explanation: string
  wissen: string
}

/** Cross-group assignment — ONLY for Systematik / Zuordnung. */
const VERTEBRATE_ASSIGN_SETS: IconSet[] = [
  {
    group: 'fisch',
    question: 'Welches Tier gehört zu den Fischen?',
    prompt: 'Gruppe: Fische',
    correctId: 'forelle',
    options: [
      { id: 'forelle', label: 'Forelle', icon: '🐟' },
      { id: 'frosch', label: 'Frosch', icon: '🐸' },
      { id: 'adler', label: 'Adler', icon: '🦅' },
      { id: 'hirsch', label: 'Hirsch', icon: '🦌' },
    ],
    explanation: 'Fische leben im Wasser, atmen über Kiemen und haben Flossen.',
    wissen: 'Zuordnung zu Wirbeltiergruppen anhand typischer Vertreter.',
  },
  {
    group: 'lurch',
    question: 'Welches Tier gehört zu den Lurchen (Amphibien)?',
    prompt: 'Gruppe: Lurche',
    correctId: 'frosch',
    options: [
      { id: 'frosch', label: 'Frosch', icon: '🐸' },
      { id: 'forelle', label: 'Forelle', icon: '🐟' },
      { id: 'schlange', label: 'Schlange', icon: '🐍' },
      { id: 'fledermaus', label: 'Fledermaus', icon: '🦇' },
    ],
    explanation: 'Lurche haben feuchte Haut und oft eine Metamorphose.',
    wissen: 'Amphibien: Übergang Wasser–Land.',
  },
  {
    group: 'kriechtier',
    question: 'Welches Tier gehört zu den Kriechtieren?',
    prompt: 'Gruppe: Kriechtiere',
    correctId: 'schlange',
    options: [
      { id: 'schlange', label: 'Schlange', icon: '🐍' },
      { id: 'frosch', label: 'Frosch', icon: '🐸' },
      { id: 'pinguin', label: 'Pinguin', icon: '🐧' },
      { id: 'forelle', label: 'Forelle', icon: '🐟' },
    ],
    explanation: 'Kriechtiere haben eine trockene Hornschicht und Lungenatmung.',
    wissen: 'Reptilien sind an das Landleben angepasst.',
  },
  {
    group: 'vogel',
    question: 'Welches Tier gehört zu den Vögeln?',
    prompt: 'Gruppe: Vögel',
    correctId: 'adler',
    options: [
      { id: 'adler', label: 'Adler', icon: '🦅' },
      { id: 'fledermaus', label: 'Fledermaus', icon: '🦇' },
      { id: 'frosch', label: 'Frosch', icon: '🐸' },
      { id: 'forelle', label: 'Forelle', icon: '🐟' },
    ],
    explanation: 'Vögel haben Federn — Fledermäuse sind Säugetiere.',
    wissen: 'Federn sind das Leitmerkmal der Vögel.',
  },
  {
    group: 'saeuger',
    question: 'Welches Tier gehört zu den Säugetieren?',
    prompt: 'Gruppe: Säugetiere',
    correctId: 'hirsch',
    options: [
      { id: 'hirsch', label: 'Hirsch', icon: '🦌' },
      { id: 'adler', label: 'Adler', icon: '🦅' },
      { id: 'schlange', label: 'Schlange', icon: '🐍' },
      { id: 'forelle', label: 'Forelle', icon: '🐟' },
    ],
    explanation: 'Säugetiere säugen ihre Jungen und sind gleichwarm.',
    wissen: 'Fell/Haare und Säugen kennzeichnen Säuger.',
  },
]

function iconsForGroup(group: VertebrateGroup) {
  return (rng: Rng) => {
    const s = pick(
      rng,
      VERTEBRATE_ASSIGN_SETS.filter((x) => x.group === group),
    )
    return iconBelongBioTask(rng, { ...s, fachwissen: fw(s.wissen) })
  }
}

/** All groups — Systematik / Zuordnung only. */
function vertebrateAssignIcons(rng: Rng) {
  const s = pick(rng, VERTEBRATE_ASSIGN_SETS)
  return iconBelongBioTask(rng, { ...s, fachwissen: fw(s.wissen) })
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
  })
}

function vertebrateComparePairs(rng: Rng) {
  const pool = [
    { term: 'Kieme', meaning: 'Atemorgan im Wasser', wissen: 'Fische.' },
    { term: 'Feder', meaning: 'Flug und Wärmeschutz bei Vögeln', wissen: 'Vögel.' },
    { term: 'Laich', meaning: 'Eigelege im Wasser (oft Lurche/Fische)', wissen: 'Fortpflanzung.' },
    { term: 'Hornschicht', meaning: 'Trockene Hautbedeckung der Kriechtiere', wissen: 'Landleben.' },
    { term: 'Säugen', meaning: 'Jungtiere mit Milch ernähren', wissen: 'Säugetiere.' },
  ]
  const three = shuffle(rng, pool).slice(0, 3)
  const rest = pool.filter((p) => !three.includes(p))
  return matchTermsTask(rng, {
    question: 'Ordne Fachbegriff und Bedeutung (Klick-Paare).',
    terms: three.map((p) => p.term),
    meanings: three.map((p) => p.meaning),
    distractor: rest[0]?.meaning ?? 'Photosynthese der Blätter',
    solution: three.map((p) => `${p.term} → ${p.meaning}`).join('; '),
    explanation: three.map((p) => p.wissen).join(' '),
    fachwissen: fw(three.map((p) => p.wissen).join(' ')),
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
      fachwissen: fw(`Kurzabfrage zu ${group}.`),
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
