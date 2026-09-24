/**
 * Dense subtopic generators + NEW UX variants for Biologie K5–10.
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

function vertebrateIcons(rng: Rng) {
  const sets = [
    {
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
  const s = pick(rng, sets)
  return iconBelongBioTask(rng, { ...s, fachwissen: fw(s.wissen) })
}

function vertebrateCloze(rng: Rng) {
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
    {
      q: 'Fortpflanzung Lurch',
      template: 'Viele Lurche legen ___ ab; die Larve heißt oft ___; daraus wird das erwachsene Tier.',
      accepted: [
        ['Laich', 'Eier im Laich'],
        ['Kaulquappe', 'Larve'],
      ],
      explanation: 'Metamorphose: Laich → Larve → erwachsenes Tier.',
      wissen: 'Entwicklungszyklus der Amphibien.',
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

function vertebrateFlash(rng: Rng) {
  const cards = [
    { front: 'Atmungsorgan der Fische?', answer: 'Kiemen', alt: ['Kieme'] },
    { front: 'Was kennzeichnet Vögel äußerlich?', answer: 'Federn', alt: ['Federkleid'] },
    { front: 'Wie ernähren Säuger ihre Jungen?', answer: 'Säugen', alt: ['mit Milch', 'Milch'] },
    { front: 'Entwicklungswechsel bei Frosch/Kröte?', answer: 'Metamorphose', alt: ['Verwandlung'] },
    { front: 'Körpertemperatur der Kriechtiere?', answer: 'wechselwarm', alt: ['poikilotherm', 'kaltblütig'] },
  ]
  const c = pick(rng, cards)
  return flashcardBioTask({
    question: 'Karte umdrehen und Fachwort tippen.',
    front: c.front,
    accepted: [c.answer, ...c.alt],
    solution: c.answer,
    explanation: `Gesucht war: ${c.answer}.`,
    fachwissen: fw('Kurzabfrage zentraler Fachbegriffe der Wirbeltiere.'),
  })
}

function vertebratePairs(rng: Rng) {
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

const newUxBundle = mixedVariants(
  vertebrateIcons,
  vertebrateCloze,
  vertebrateFlash,
  vertebratePairs,
  vertebrateIcons,
  vertebrateCloze,
)

function blend(base: Topic['generate'] | undefined): Topic['generate'] {
  if (!base) return newUxBundle
  return mixedVariants(base, newUxBundle, newUxBundle)
}

/** Enhanced K5 registry: legacy generators + NEW UX + expanded subtopics. */
export const BIOLOGIE_K5_EXPANDED: Record<string, Topic['generate']> = {
  'bi-k5-lb1-merkmale': blend(BASE_K5['bi-k5-lb1-merkmale']),
  'bi-k5-lb1-kennzeichen': blend(BASE_K5['bi-k5-lb1-merkmale']),
  'bi-k5-lb2-fische': blend(BASE_K5['bi-k5-lb2-fische']),
  'bi-k5-lb2-fische-merkmale': blend(BASE_K5['bi-k5-lb2-fische']),
  'bi-k5-lb2-fische-lebensraum': blend(BASE_K5['bi-k5-lb2-fische']),
  'bi-k5-lb2-fische-schutz': blend(BASE_K5['bi-k5-lb2-fische']),
  'bi-k5-lb3-lurche': blend(BASE_K5['bi-k5-lb3-lurche']),
  'bi-k5-lb3-lurche-merkmale': blend(BASE_K5['bi-k5-lb3-lurche']),
  'bi-k5-lb3-lurche-meta': blend(BASE_K5['bi-k5-lb3-lurche']),
  'bi-k5-lb3-lurche-schutz': blend(BASE_K5['bi-k5-lb3-lurche']),
  'bi-k5-lb4-kriechtiere': blend(BASE_K5['bi-k5-lb4-kriechtiere']),
  'bi-k5-lb4-kriechtiere-merkmale': blend(BASE_K5['bi-k5-lb4-kriechtiere']),
  'bi-k5-lb4-kriechtiere-arten': blend(BASE_K5['bi-k5-lb4-kriechtiere']),
  'bi-k5-lb5-voegel': blend(BASE_K5['bi-k5-lb5-voegel']),
  'bi-k5-lb5-voegel-flug': blend(BASE_K5['bi-k5-lb5-voegel']),
  'bi-k5-lb5-voegel-fortpflanzung': blend(BASE_K5['bi-k5-lb5-voegel']),
  'bi-k5-lb6-saeugetiere': blend(BASE_K5['bi-k5-lb6-saeugetiere']),
  'bi-k5-lb6-saeuger-merkmale': blend(BASE_K5['bi-k5-lb6-saeugetiere']),
  'bi-k5-lb6-saeuger-angepasst': blend(BASE_K5['bi-k5-lb6-saeugetiere']),
  'bi-k5-lb6-saeuger-schutz': blend(BASE_K5['bi-k5-lb6-saeugetiere']),
  'bi-k5-lb7-systematik': blend(BASE_K5['bi-k5-lb7-systematik']),
  'bi-k5-lb7-zuordnung': mixedVariants(vertebrateIcons, vertebratePairs, vertebrateCloze),
  'bi-k5-lbw-winter': blend(BASE_K5['bi-k5-lbw-winter']),
  'bi-k5-lbw-saurier': blend(BASE_K5['bi-k5-lbw-saurier']),
  'bi-k5-lbw-haltung': blend(BASE_K5['bi-k5-lbw-haltung']),
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

const insectIcons: NonNullable<BioBank['icons']> = [
  {
    question: 'Welches Tier ist ein Insekt (6 Beine)?',
    prompt: 'Wirbellose',
    options: [
      { id: 'biene', label: 'Biene', icon: '🐝' },
      { id: 'spinne', label: 'Kreuzspinne', icon: '🕷️' },
      { id: 'regenwurm', label: 'Regenwurm', icon: '🪱' },
      { id: 'schnecke', label: 'Schnecke', icon: '🐌' },
    ],
    correctId: 'biene',
    explanation: 'Insekten haben sechs Beine; Spinnen acht.',
    wissen: 'Gliederfüßer unterscheiden.',
  },
]

/** Patch K6+ banks: export expanded maps by aliasing + icons. */
export function expandFromBase(
  base: Record<string, Topic['generate']>,
  aliases: Record<string, string>,
): Record<string, Topic['generate']> {
  const out: Record<string, Topic['generate']> = {}
  for (const [id, gen] of Object.entries(base)) {
    out[id] = mixedVariants(gen, newUxBundle)
  }
  for (const [id, src] of Object.entries(aliases)) {
    const g = out[src] ?? base[src]
    if (g) out[id] = mixedVariants(g, newUxBundle)
  }
  return out
}

export const BIOLOGIE_K6_EXPANDED = expandFromBase(BASE_K6, {
  'bi-k6-lb1-bluete': 'bi-k6-lb1-samenpflanzen',
  'bi-k6-lb1-baeume': 'bi-k6-lb1-samenpflanzen',
  'bi-k6-lb1-organe': 'bi-k6-lb1-samenpflanzen',
  'bi-k6-lb2-insekten': 'bi-k6-lb2-wirbellose',
  'bi-k6-lb2-spinnen': 'bi-k6-lb2-wirbellose',
  'bi-k6-lb4-nahrung': 'bi-k6-lb4-wald',
  'bi-k6-lb5-mikroskop': 'bi-k6-lb5-zellen',
})

// Enrich K6 cells/insects with dedicated icon banks blended in
BIOLOGIE_K6_EXPANDED['bi-k6-lb5-zellen'] = mixedVariants(
  BASE_K6['bi-k6-lb5-zellen']!,
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
        cloze: 'Die ___ enthält DNA; ___ betreiben Fotosynthese; die ___ gibt der Pflanzenzelle Stabilität.',
        clozeAccepted: [
          ['Zellkern', 'Kern'],
          ['Chloroplasten', 'Chloroplast'],
          ['Zellwand', 'Wand'],
        ],
      },
    ],
  }),
  newUxBundle,
)

BIOLOGIE_K6_EXPANDED['bi-k6-lb2-insekten'] = mixedVariants(
  BASE_K6['bi-k6-lb2-wirbellose']!,
  bankGenerate({
    quelle: 'Wikipedia: Insekten',
    url: 'https://de.wikipedia.org/wiki/Insekten',
    icons: insectIcons,
    sorts: [
      {
        question: 'Ordne die vollständige Metamorphose.',
        labels: ['Ei', 'Larve', 'Puppe', 'Imago'],
        explanation: 'Klassische Reihenfolge.',
        wissen: 'Insektenentwicklung.',
      },
    ],
  }),
  newUxBundle,
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
