/**
 * K5 Bio — hand-authored banks for former „Neu“ placeholders (Lehrplan Gym Sachsen).
 * Schulstoff: Schnabel–Nahrung, Revier/Balz, Vogelschutz, Kriechtierschutz,
 * Arbeitsweisen, Säuger-Lunge, Verhaltensbeobachtung, Sinne, Sozialverhalten.
 * Interaktionen: Zuordnen, Klassifikation/Drag-Drop, Bildbeschriftung,
 * Sortieren, Ursache–Wirkung, MC/Multi, Wissens-MC.
 * Keine Bulk-Generator-Skripte — Inhalte bewusst pro Thema gesetzt.
 */
import type { Rng } from '../lib/rng'
import {
  causeEffectTask,
  choicePickTask,
  imageLabelSlotsTask,
  mixedVariants,
  multiSelectTask,
} from './taskHelpers'
import {
  bioFw,
  classifySlotsTask,
  matchTermsTask,
  shuffle,
  shuffleChoices,
  sortChronologyTask,
} from './biologieHelpers'
import type { Topic } from './types'

/**
 * 4 Schnabeltypen — Collage aus Commons-Fotos (nummeriert, ohne Namensspoiler).
 * Panel-Mitten ca. 13 / 38 / 62 / 87 %; Drop-Felder darunter.
 */
const SCHNABEL_DIAGRAM = {
  imageSrc: '/anatomy/vogel-schnabel-typen.jpg',
  imageAlt: 'Vier nummerierte Vogelfotos mit unterschiedlichen Schnabelformen',
  attribution:
    'Collage (unveränderte Fotos): 1 Marek Szczepanek, Common Buzzard, CC BY-SA 3.0 — ' +
    'https://commons.wikimedia.org/wiki/File:Buteo_buteo_2_(Marek_Szczepanek).jpg · ' +
    '2 birdsaspoetry.com, European Goldfinch, CC BY 2.0 — ' +
    'https://commons.wikimedia.org/wiki/File:European_Goldfinch_Glowing_(50257614467).jpg · ' +
    '3 Andy Morffew, Grey Heron Portrait, CC BY 2.0 — ' +
    'https://commons.wikimedia.org/wiki/File:Grey_Heron_Portrait_(15760878075).jpg · ' +
    '4 Andy Morffew, Great Spotted Woodpecker Portrait, CC BY 2.0 — ' +
    'https://commons.wikimedia.org/wiki/File:Great_Spotted_Woodpecker_Portrait_(7142225643).jpg',
  slots: [
    { id: 'haken', x: 13, y: 88, targetX: 13, targetY: 42, label: 'Hakenschnabel' },
    { id: 'kegel', x: 38, y: 88, targetX: 38, targetY: 42, label: 'Kegelschnabel' },
    { id: 'pfriem', x: 62, y: 88, targetX: 62, targetY: 42, label: 'Pfriemschnabel' },
    { id: 'meissel', x: 87, y: 88, targetX: 87, targetY: 42, label: 'Meißelschnabel' },
  ],
} as const

/**
 * Atemweg Säuger — Commons-Unterrichtstafel ohne Text, Nummern 1–4 als Overlay.
 * 1 Nase · 2 Luftröhre · 3 Bronchien · 4 Lungenbläschen (Inset).
 */
const ATEM_DIAGRAM = {
  imageSrc: '/anatomy/saeuger-atemweg-schema.jpg',
  imageAlt: 'Atemwege mit Nummern 1 bis 4 (Nase bis Lungenbläschen)',
  attribution:
    'LadyofHats / Jmarchn: Respiratory system complete (no labels), Wikimedia Commons, ' +
    'CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Respiratory_system_complete_no_labels.svg ' +
    '(Nummern 1–4 als App-Overlay, keine inhaltliche Bildbearbeitung)',
  slots: [
    // Drop-Felder am Rand, Leader-Spitze auf die Nummer im Bild
    { id: 'nase', x: 8, y: 10, targetX: 18, targetY: 10, label: 'Nase / Mund' },
    { id: 'luftröhre', x: 8, y: 38, targetX: 48, targetY: 38, label: 'Luftröhre' },
    { id: 'bronchien', x: 8, y: 54, targetX: 36, targetY: 54, label: 'Bronchien' },
    { id: 'alveolen', x: 92, y: 18, targetX: 84, targetY: 18, label: 'Lungenbläschen' },
  ],
} as const

function knowledgeMc(
  rng: Rng,
  items: Array<{ q: string; correct: string; wrong: string[]; w: string; quelle: string; url: string }>,
  keyPrefix: string,
) {
  const it = items[Math.floor(rng() * items.length)]!
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(it.w, it.quelle, it.url),
    dedupeKey: `${keyPrefix}:${it.q.slice(0, 48)}`,
    contentIds: [`${keyPrefix}:${it.q.slice(0, 48)}`],
  })
}

/** Ursache–Wirkung mit Ablenker rechts (hand-authored pairs). */
function causePairs(
  rng: Rng,
  opts: {
    question: string
    pairs: Array<{ cause: string; effect: string }>
    distractorEffects: string[]
    solution: string
    explanation: string
    fachwissen: ReturnType<typeof bioFw>
    dedupeKey: string
  },
) {
  const left = opts.pairs.map((p, i) => ({ id: `c${i}`, label: p.cause }))
  const rightCore = opts.pairs.map((p, i) => ({ id: `e${i}`, label: p.effect }))
  const distractors = opts.distractorEffects.map((label, i) => ({
    id: `xd${i}`,
    label,
  }))
  const right = shuffle(rng, [...rightCore, ...distractors])
  const correctLinks: Record<string, string> = {}
  opts.pairs.forEach((_, i) => {
    correctLinks[`c${i}`] = `e${i}`
  })
  return causeEffectTask({
    question: opts.question,
    left,
    right,
    correctLinks,
    solution: opts.solution,
    explanation: opts.explanation,
    fachwissen: opts.fachwissen,
    dedupeKey: opts.dedupeKey,
    contentIds: [opts.dedupeKey],
  })
}

const pick = <T,>(rng: Rng, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)]!

// ─── Vögel – Schnabelformen und Nahrung ─────────────────────────────────────

function schnabelClassify(rng: Rng) {
  const pairs = [
    { form: 'Hakenschnabel (Greifvogel)', food: 'Fleisch zerreißen (z. B. Mäusebussard)' },
    { form: 'Kegelschnabel (Fink)', food: 'Samen und Körner knacken' },
    { form: 'Pfriemschnabel (Insektenfresser)', food: 'Insekten und Weichtiere picken' },
    { form: 'Sieb-/Löffelschnabel', food: 'Plankton und Kleinsttiere aus dem Wasser sieben' },
    { form: 'Meißelschnabel (Specht)', food: 'Insektenlarven unter Rinde meißeln' },
  ]
  const three = shuffle(rng, pairs).slice(0, 3)
  return classifySlotsTask(rng, {
    question: 'Ordne Schnabelform und typische Nahrung zu (Angepasstheit).',
    slotLabels: three.map((p) => p.form),
    itemLabels: three.map((p) => p.food),
    correctSlots: [0, 1, 2],
    distractors: ['Ausschließlich Filterplankton wie bei Bartenwalen'],
    solution: three.map((p) => `${p.form} → ${p.food}`).join('; '),
    explanation:
      'Die Schnabelform spiegelt die Nahrung wider — Erschließungsfeld Angepasstheit.',
    fachwissen: bioFw(
      'Schnabelform und Nahrung gehören zusammen: Ein gebogener Hakenschnabel zerreißt Beute, ein kurzer Kegelschnabel knackt Samen, ein spitzer Pfriemschnabel pickt Insekten und Weichtiere, ein Meißelschnabel öffnet Holz.',
      'Wikipedia: Vogelschnabel',
      'https://de.wikipedia.org/wiki/Vogelschnabel',
    ),
  })
}

function schnabelMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Welches „Werkzeug“ passt zur Schnabelform?',
    terms: ['Hakenschnabel', 'Kegelschnabel', 'Pfriemschnabel'],
    meanings: [
      'Zange / Reißhaken zum Zerteilen von Beute',
      'Nussknacker zum Aufbrechen harter Samen',
      'Pinzette zum Aufpicken kleiner Beute',
    ],
    distractor: 'Kieme zum Filtern von Sauerstoff aus Wasser',
    solution: 'Haken→Zange; Kegel→Nussknacker; Pfriem→Pinzette',
    explanation: 'Der Werkzeugvergleich macht Angepasstheit anschaulich.',
    fachwissen: bioFw(
      'Angepasstheit heißt: Körperbau und Lebensweise passen zusammen. Beim Vogel zeigt sich das besonders am Schnabel — Form und typische Nahrung gehören fachlich zusammen.',
      'Wikipedia: Angepasstheit',
      'https://de.wikipedia.org/wiki/Angepasstheit',
    ),
    dedupeKey: 'bio:k5:vogel:schnabel:werkzeug',
    contentIds: ['bio:k5:vogel:schnabel:werkzeug'],
  })
}

function schnabelMc(rng: Rng) {
  const items = [
    {
      q: 'Warum hat der Specht einen meißelartigen Schnabel?',
      correct: 'Um Rinde zu öffnen und Insektenlarven zu erreichen',
      wrong: [
        'Um ausschließlich Fischschwärme zu fangen',
        'Um Plankton wie ein Bartenwal zu sieben',
        'Um Nektar aus Blüten zu saugen wie ein Kolibri',
      ],
      w: 'Spechte hämmern und meißeln in Holz; die Schnabelform ist an diese Nahrungssuche angepasst.',
    },
    {
      q: 'Wozu dient der hakige Schnabel eines Greifvogels?',
      correct: 'Zum Festhalten und Zerreißen von Beute',
      wrong: [
        'Zum reinen Körnerknacken ohne Fleisch',
        'Zum Filtern von Plankton im Teich',
        'Zum Nestbau aus Schleim wie bei manchen Fischen',
      ],
      w: 'Greifvögel (z. B. Bussard, Falke) haben einen gebogenen Schnabel zum Zerlegen der Beute.',
    },
    {
      q: 'Ein Fink hat einen kurzen, kräftigen Kegelschnabel. Welche Nahrung passt am besten?',
      correct: 'Samen und Körner',
      wrong: [
        'Nur große Säugetiere als Beute',
        'Nur Plankton aus dem Meer',
        'Nur Nektar aus Orchideen',
      ],
      w: 'Kegelschnäbel erzeugen Druck, um harte Samenschalen zu knacken.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(
      `${it.w} Angepasstheit heißt: Körperbau und Lebensweise passen zusammen — hier Schnabel und Nahrung.`,
      'Wikipedia: Vogelschnabel',
      'https://de.wikipedia.org/wiki/Vogelschnabel',
    ),
    dedupeKey: `bio:k5:vogel:schnabel:mc:${it.q.slice(0, 40)}`,
    contentIds: [`bio:k5:vogel:schnabel:mc:${it.q.slice(0, 40)}`],
  })
}

function schnabelCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Folge bei Schnabel und Nahrung.',
    pairs: [
      {
        cause: 'Kurzer, kräftiger Kegelschnabel',
        effect: 'Harte Samen lassen sich knacken',
      },
      {
        cause: 'Langer, spitzer Pfriemschnabel',
        effect: 'Kleine Insekten lassen sich präzise greifen',
      },
      {
        cause: 'Gebogener Hakenschnabel',
        effect: 'Fleischbeute lässt sich zerreißen',
      },
    ],
    distractorEffects: ['Kiemenatmung im Süßwasser wird möglich'],
    solution: 'Schnabelform → passende Nahrungsaufnahme',
    explanation: 'Ursache (Form) und Wirkung (Nahrung) gehören zusammen.',
    fachwissen: bioFw(
      'Passt die Schnabelform nicht zur Nahrung, stimmt die Zuordnung nicht. Ein Körnerfresser braucht einen kräftigen Kegel — kein Hakenschnabel wie bei Greifvögeln.',
      'Wikipedia: Angepasstheit',
      'https://de.wikipedia.org/wiki/Angepasstheit',
    ),
    dedupeKey: 'bio:k5:vogel:schnabel:cause',
  })
}

function schnabelLabel(rng: Rng) {
  const slots = [...SCHNABEL_DIAGRAM.slots]
  /** Plausible Vogelschnäbel als Ablenkung — nicht offensichtliche Nicht-Schnäbel. */
  const distractors = shuffle(rng, [
    'Siebschnabel',
    'Röhrenschnabel',
    'Kreuzschnabel',
    'Säbelschnabel',
  ]).slice(0, 3)
  return imageLabelSlotsTask({
    question:
      'Auf dem Bild siehst du vier nummerierte Schnäbel. Ziehe zu jedem Feld (1–4) den passenden Namen.',
    imageSrc: SCHNABEL_DIAGRAM.imageSrc,
    imageAlt: SCHNABEL_DIAGRAM.imageAlt,
    attribution: SCHNABEL_DIAGRAM.attribution,
    drawLeaders: true,
    instruction:
      'Schau die Schnabelform bei Nummer 1–4 auf dem Bild an. Ziehe den Namen in das Feld unter der jeweiligen Nummer. Drei Namen brauchst du nicht.',
    items: [...slots.map((s) => ({ label: s.label })), ...distractors.map((label) => ({ label }))],
    slots: slots.map(({ id, x, y, targetX, targetY }) => ({ id, x, y, targetX, targetY })),
    correctSlots: [0, 1, 2, 3],
    solution: '1 Hakenschnabel; 2 Kegelschnabel; 3 Pfriemschnabel; 4 Meißelschnabel',
    explanation:
      'Haken gebogen (reißen); Kegel kurz/kräftig (knacken); Pfriem spitz (picken); Meißel gerade/kräftig (Holz).',
    fachwissen: bioFw(
      'Der Vogelschnabel besteht aus Knochen mit einer Hornscheide. Länge, Krümmung und Stärke sind an die typische Nahrung angepasst — ein klares Beispiel für Angepasstheit von Bau und Funktion.',
      'Wikipedia: Vogelschnabel',
      'https://de.wikipedia.org/wiki/Vogelschnabel',
    ),
    dedupeKey: 'bio:k5:vogel:schnabel:label',
    contentIds: ['bio:k5:vogel:schnabel:label'],
    rng,
  })
}

function schnabelFoodSlots(rng: Rng) {
  /** Andere Beispiele/Wording als schnabelClassify — weniger Rundenduplikate. */
  const bank = [
    { form: 'Habicht: Hakenschnabel', food: 'Beute mit gebogenem Schnabel zerlegen' },
    { form: 'Buchfink: Kegelschnabel', food: 'Samenschalen unter Druck knacken' },
    { form: 'Rotkehlchen: Pfriemschnabel', food: 'Kleine Insekten vom Boden aufnehmen' },
    { form: 'Buntspecht: Meißelschnabel', food: 'Holz öffnen, Larven erreichen' },
    { form: 'Löffelente: Siebschnabel', food: 'Wasser durchseihen, Kleinstnahrung behalten' },
  ]
  const three = shuffle(rng, bank).slice(0, 3)
  return classifySlotsTask(rng, {
    question: 'Welches Fressverhalten passt zu welchem Schnabel-Beispiel?',
    slotLabels: three.map((p) => p.form),
    itemLabels: three.map((p) => p.food),
    correctSlots: [0, 1, 2],
    distractors: ['Mit Kiemen Plankton unter Wasser filtrieren'],
    solution: three.map((p) => `${p.form} → ${p.food}`).join('; '),
    explanation: 'Artenbeispiel + Handlung macht Angepasstheit konkret.',
    fachwissen: bioFw(
      'Dieselbe Form–Funktions-Logik gilt bei vielen Arten: Habicht (Haken), Buchfink (Kegel), Rotkehlchen (Pfriem), Buntspecht (Meißel), Löffelente (Sieb).',
      'Wikipedia: Angepasstheit',
      'https://de.wikipedia.org/wiki/Angepasstheit',
    ),
  })
}

function schnabelKnowledgeMc(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Was bedeutet Angepasstheit bei Schnabel und Nahrung?',
        correct: 'Bau und Funktion des Schnabels passen zur typischen Nahrung',
        wrong: [
          'Alle Vögel haben denselben Schnabel',
          'Schnäbel dienen nur der Balz, nie der Nahrung',
          'Nahrung ändert die Federn, nicht den Schnabel',
        ],
        w: 'Angepasstheit verknüpft Struktur (Schnabelform) mit Funktion (Nahrungsaufnahme).',
        quelle: 'Wikipedia: Angepasstheit',
        url: 'https://de.wikipedia.org/wiki/Angepasstheit',
      },
      {
        q: 'Welcher Schnabel passt am ehesten zum Kernbeißer / Fink?',
        correct: 'Kurzer, kräftiger Kegelschnabel',
        wrong: [
          'Langer Siebschnabel wie bei Flamingos',
          'Nur ein weicher Saugschnabel ohne Knochen',
          'Kiemenblatt ohne Hornscheide',
        ],
        w: 'Kegelschnäbel erzeugen Druck auf harte Samen.',
        quelle: 'Wikipedia: Vogelschnabel',
        url: 'https://de.wikipedia.org/wiki/Vogelschnabel',
      },
      {
        q: 'Warum ist ein Löffelschnabel für Plankton geeignet?',
        correct: 'Er kann Wasser durchsieben und Kleinsttiere zurückhalten',
        wrong: [
          'Er zerreißt große Säugerbeute',
          'Er meißelt Baumstämme auf',
          'Er ersetzt die Lungen vollständig',
        ],
        w: 'Filter-/Siebstrukturen passen zur Nahrung im Wasser.',
        quelle: 'Wikipedia: Vogelschnabel',
        url: 'https://de.wikipedia.org/wiki/Vogelschnabel',
      },
      {
        q: 'Was wäre ein Widerspruch zur Angepasstheit?',
        correct: 'Ein reiner Körnerfresser mit starkem Hakenschnabel ohne Kegel',
        wrong: [
          'Ein Greifvogel mit Hakenschnabel',
          'Ein Specht mit Meißelschnabel',
          'Ein Insektenfresser mit Pfriemschnabel',
        ],
        w: 'Passt die Form nicht zur Nahrung, stimmt die Zuordnung nicht.',
        quelle: 'Wikipedia: Angepasstheit',
        url: 'https://de.wikipedia.org/wiki/Angepasstheit',
      },
    ],
    'bio:k5:vogel:schnabel:know',
  )
}

export const biVoegelSchnabelNahrung: Topic['generate'] = mixedVariants(
  schnabelLabel,
  schnabelFoodSlots,
  schnabelMc,
  schnabelMatch,
  schnabelKnowledgeMc,
  schnabelCause,
  schnabelClassify,
  schnabelMc,
  schnabelLabel,
  schnabelKnowledgeMc,
)

// ─── Vögel – Revier, Balz und Gesang ────────────────────────────────────────

function verhaltenMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Verhaltensweisen der Vögel zu.',
    terms: ['Reviergesang', 'Balz', 'Nestbau'],
    meanings: [
      'Markiert und verteidigt ein Gebiet gegen Rivalen',
      'Paarbildung / Werben um einen Partner',
      'Errichten oder Auskleiden eines Brutplatzes',
    ],
    distractor: 'Laichen mit äußerer Befruchtung im Teich',
    solution: 'Gesang→Revier; Balz→Partner; Nestbau→Brutplatz',
    explanation: 'Revier, Balz und Nest gehören zur Fortpflanzungszeit, sind aber unterschiedliche Funktionen.',
    fachwissen: bioFw(
      'Gesang kann Revier und Paarbildung signalisieren. Balz umfasst oft Bewegungen und Gefiederzeigen. Nestbau bereitet die Brutpflege vor — alles Funktionen in der Fortpflanzungszeit, aber nicht dasselbe Verhalten.',
      'Wikipedia: Vogelgesang',
      'https://de.wikipedia.org/wiki/Vogelgesang',
    ),
    dedupeKey: 'bio:k5:vogel:verhalten:match',
    contentIds: ['bio:k5:vogel:verhalten:match'],
  })
}

function verhaltenSort(rng: Rng) {
  return sortChronologyTask(rng, {
    question: 'Ordne typische Schritte in der Brutzeit (früh → später).',
    labels: ['Revier besetzen / Gesang', 'Balz und Paarbildung', 'Nestbau', 'Eiablage'],
    solution: 'Revier → Balz → Nest → Gelege',
    explanation: 'Oft zuerst Revier, dann Partner, Nest und Gelege — artabhängig mit Überschneidungen.',
    fachwissen: bioFw(
      'Viele Singvögel besetzen im Frühjahr ein Revier und singen; nach der Paarbildung folgen Nest und Gelege. Die genaue Reihenfolge kann artabhängig variieren, das Muster hilft aber beim Einordnen von Beobachtungen.',
      'Wikipedia: Brutpflege',
      'https://de.wikipedia.org/wiki/Brutpflege',
    ),
    dedupeKey: 'bio:k5:vogel:verhalten:sort',
    contentIds: ['bio:k5:vogel:verhalten:sort'],
  })
}

function verhaltenMc(rng: Rng) {
  const items = [
    {
      q: 'Wozu dient der Gesang vieler Singvögel im Frühjahr vor allem?',
      correct: 'Revier markieren und Partner anlocken',
      wrong: [
        'Nur zum Kühlen der Federn beim Flug',
        'Nur zum Filtern von Plankton',
        'Nur zum Öffnen von Samenschalen',
      ],
      w: 'Gesang transportiert Information: „Hier ist mein Revier“ und oft auch Paarbildung.',
    },
    {
      q: 'Was versteht man unter Balz bei Vögeln?',
      correct: 'Verhaltensweisen zur Paarbildung und Partnerwahl',
      wrong: [
        'Nur das Atmen mit Luftsäcken',
        'Nur den Federwechsel im Winter',
        'Nur das Fressen von Körnern',
      ],
      w: 'Balz kann Gesang, Tänze, Imponierflüge oder Futterübergabe umfassen.',
    },
    {
      q: 'Ein Amselmännchen singt laut von einer Antenne. Welche Deutung ist sinnvoll?',
      correct: 'Es zeigt Präsenz im Revier (und wirbt oft zugleich)',
      wrong: [
        'Es atmet unter Wasser mit Kiemen',
        'Es legt gerade Eier ohne Nest',
        'Es filtert Plankton aus der Luft',
      ],
      w: 'Singen ist beobachtbar; Revier/Werbung ist die fachliche Einordnung.',
    },
    {
      q: 'Zwei Kohlmeisen-Männchen singen dicht beieinander. Was ist eine sinnvolle Deutung?',
      correct: 'Reviergrenzen werden ausgehandelt / Rivalen werden abgewiesen',
      wrong: [
        'Sie bauen gemeinsam Kiemen',
        'Sie legen Eier ohne Nestmaterial',
        'Sie atmen nur über die Haut',
      ],
      w: 'Gesang dient oft der Revierverteidigung gegen Rivalen.',
    },
    {
      q: 'Warum gehört Nestbau zur Fortpflanzungszeit, ist aber keine Balz?',
      correct: 'Nestbau bereitet den Brutplatz vor — Balz wirbt um den Partner',
      wrong: [
        'Nestbau und Balz sind immer dasselbe Wort',
        'Nestbau ersetzt den Gesang vollständig',
        'Balz bedeutet nur das Tragen von Zweigen',
      ],
      w: 'Funktionen trennen: Partnerwahl ≠ Brutplatz herrichten.',
    },
    {
      q: 'Ein Buchfink trägt Moos in eine Astgabel. Welche Verhaltensweise passt?',
      correct: 'Nestbau / Vorbereitung des Brutplatzes',
      wrong: [
        'Nur Reviergesang ohne Material',
        'Nur Kiemenatmung im Bach',
        'Nur Planktonfiltern in der Luft',
      ],
      w: 'Materialtransport ist typisch für Nestbau.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(
      `${it.w} Laute und Bewegungen übertragen Botschaften zwischen Tieren — Sender, Signal und Empfänger gehören zusammen.`,
      'Wikipedia: Balz',
      'https://de.wikipedia.org/wiki/Balz',
    ),
    dedupeKey: `bio:k5:vogel:verhalten:mc:${it.q.slice(0, 36)}`,
    contentIds: [`bio:k5:vogel:verhalten:mc:${it.q.slice(0, 36)}`],
  })
}

function verhaltenCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Wirkung beim Vogelverhalten.',
    pairs: [
      {
        cause: 'Männchen besetzt ein Revier',
        effect: 'Rivalen werden durch Gesang/Imponieren abgewiesen',
      },
      {
        cause: 'Erfolgreiche Balz',
        effect: 'Paarbildung und oft gemeinsame Brutpflege',
      },
      {
        cause: 'Geeigneter Nistplatz gefunden',
        effect: 'Nestbau und spätere Eiablage werden möglich',
      },
    ],
    distractorEffects: ['Kiemenatmung der Larve beginnt im Nest'],
    solution: 'Verhalten → Fortpflanzungserfolg / Revierhaltung',
    explanation: 'Verhaltensweisen dienen oft dem Fortpflanzungserfolg.',
    fachwissen: bioFw(
      'Revierverhalten reduziert Konkurrenz um Nahrung und Nistplatz. Balz sichert Partnerwahl. Nest schützt Gelege — alles Teil der Fortpflanzungsstrategie.',
      'Wikipedia: Revier (Tierverhalten)',
      'https://de.wikipedia.org/wiki/Revier_(Biologie)',
    ),
    dedupeKey: 'bio:k5:vogel:verhalten:cause',
  })
}

function verhaltenSlots(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welche Funktion hat welches Verhalten? Ziehe in die Felder.',
    slotLabels: ['Revier markieren', 'Partner werben', 'Brutplatz vorbereiten'],
    itemLabels: [
      'Lautes Singen von einer Warte',
      'Balztanz / Gefiederzeigen',
      'Zweige und Material ins Nest tragen',
    ],
    correctSlots: [0, 1, 2],
    distractors: ['Kiemen unter Wasser belüften'],
    solution: 'Gesang→Revier; Balz→Partner; Material→Nest',
    explanation: 'Drei Funktionen in der Fortpflanzungszeit — klar trennen.',
    fachwissen: bioFw(
      'Revier, Balz und Nest haben unterschiedliche Funktionen: Gebiet sichern, Partner werben, Gelege schützen. So lassen sich Beobachtungen fachlich einordnen.',
      'Wikipedia: Balz',
      'https://de.wikipedia.org/wiki/Balz',
    ),
  })
}

function verhaltenKnowledgeMc(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Was ist der Unterschied zwischen Reviergesang und Nestbau?',
        correct: 'Gesang markiert Gebiet/Partner; Nestbau bereitet den Brutplatz vor',
        wrong: [
          'Beides ist identisch und nur Federnputzen',
          'Nestbau ersetzt die Lungenatmung',
          'Gesang dient nur dem Planktonfangen',
        ],
        w: 'Beide gehören zur Fortpflanzung, erfüllen aber unterschiedliche Aufgaben.',
        quelle: 'Wikipedia: Vogelgesang',
        url: 'https://de.wikipedia.org/wiki/Vogelgesang',
      },
      {
        q: 'Warum singen viele Singvögel besonders im Frühjahr?',
        correct: 'Reviere werden besetzt und Partner gesucht',
        wrong: [
          'Weil Federn im Winter Photosynthese machen',
          'Weil Eier dann unter Wasser gelegt werden',
          'Weil Kiemen nur im Frühjahr arbeiten',
        ],
        w: 'Jahreszeit und Fortpflanzungszeit hängen zusammen.',
        quelle: 'Wikipedia: Brutpflege',
        url: 'https://de.wikipedia.org/wiki/Brutpflege',
      },
      {
        q: 'Welche Aussage zur Balz ist fachlich korrekt?',
        correct: 'Balz dient der Paarbildung und Partnerwahl',
        wrong: [
          'Balz ist nur das Atmen mit Luftsäcken',
          'Balz ersetzt den gesamten Gasaustausch',
          'Balz bedeutet ausschließlich Laichen im Teich',
        ],
        w: 'Balz umfasst Signale und Verhaltensweisen zur Partnerwahl.',
        quelle: 'Wikipedia: Balz',
        url: 'https://de.wikipedia.org/wiki/Balz',
      },
      {
        q: 'Ein Revier bringt welchem Vorteil?',
        correct: 'Zugang zu Nahrung und Nistplatz mit weniger Konkurrenz',
        wrong: [
          'Es ersetzt die Schnabelform vollständig',
          'Es macht Vögel zu Fischen mit Kiemen',
          'Es verhindert jede Kommunikation',
        ],
        w: 'Reviere sichern Ressourcen für die Fortpflanzung.',
        quelle: 'Wikipedia: Revier (Biologie)',
        url: 'https://de.wikipedia.org/wiki/Revier_(Biologie)',
      },
      {
        q: 'Was kann zur Balz gehören — außer Gesang?',
        correct: 'Imponierflug, Gefiederzeigen oder Futterübergabe',
        wrong: [
          'Nur das Atmen mit Kiemen',
          'Nur das Knacken von Samenschalen',
          'Nur das Filtern von Plankton',
        ],
        w: 'Balz ist multimodal: Laut, Bewegung, Optik, manchmal Futter.',
        quelle: 'Wikipedia: Balz',
        url: 'https://de.wikipedia.org/wiki/Balz',
      },
      {
        q: 'Warum verteidigen viele Vögel ein Revier?',
        correct: 'Um Nahrung und Nistplatz für die eigene Brut zu sichern',
        wrong: [
          'Um die Lungen durch Federn zu ersetzen',
          'Um unter Wasser zu laichen',
          'Um Schnäbel überflüssig zu machen',
        ],
        w: 'Revierverhalten ist eine Fortpflanzungsstrategie.',
        quelle: 'Wikipedia: Revier (Biologie)',
        url: 'https://de.wikipedia.org/wiki/Revier_(Biologie)',
      },
      {
        q: 'Was folgt oft nach erfolgreicher Paarbildung?',
        correct: 'Nestbau und später Eiablage / Brutpflege',
        wrong: [
          'Sofort Kiemenatmung im Nest',
          'Sofort Federverlust ohne Nest',
          'Sofort Planktonfang ohne Partner',
        ],
        w: 'Typische Abfolge in der Brutzeit — artabhängig mit Überschneidungen.',
        quelle: 'Wikipedia: Brutpflege',
        url: 'https://de.wikipedia.org/wiki/Brutpflege',
      },
    ],
    'bio:k5:vogel:verhalten:know',
  )
}

export const biVoegelRevierBalz: Topic['generate'] = mixedVariants(
  verhaltenMatch,
  verhaltenSlots,
  verhaltenSort,
  verhaltenMc,
  verhaltenKnowledgeMc,
  verhaltenCause,
  verhaltenKnowledgeMc,
  verhaltenSlots,
  verhaltenMc,
)

// ─── Vögel – Schutz und Artenschutz ─────────────────────────────────────────

function vogelSchutzMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Maßnahme und Wirkung im Vogelschutz zu.',
    terms: ['Nistkasten', 'Glasmarkierung', 'Hecke / Lebensraum'],
    meanings: [
      'Ersatzbrutplatz, wenn natürliche Höhlen fehlen',
      'Verringert Anprall an spiegelnde Scheiben',
      'Bietet Nahrung, Deckung und Nistmöglichkeiten',
    ],
    distractor: 'Laichgewässer ausschließlich für Frösche anlegen',
    solution: 'Nistkasten→Brutplatz; Markierung→weniger Anprall; Hecke→Habitat',
    explanation: 'Schutz wirkt über Lebensraum, Brutplätze und Gefahrenminderung.',
    fachwissen: bioFw(
      'Nistkästen ersetzen fehlende Baumhöhlen; Hecken liefern Insekten und Deckung; Glasflächen sind eine häufige Todesursache — Markierungen machen Scheiben für Vögel sichtbar.',
      'NABU: Vogelschutz',
      'https://www.nabu.de/tiere-und-pflanzen/voegel/vogelschutz/',
    ),
    dedupeKey: 'bio:k5:vogel:schutz:match',
    contentIds: ['bio:k5:vogel:schutz:match'],
  })
}

function vogelSchutzMc(rng: Rng) {
  const items = [
    {
      q: 'Warum sind große, unmarkierte Glasflächen ein Problem für Vögel?',
      correct: 'Vögel erkennen Spiegelungen oft nicht und prallen an',
      wrong: [
        'Glas erzeugt immer giftige Federn',
        'Glas verhindert jede innere Befruchtung',
        'Glas ersetzt die Lungen durch Kiemen',
      ],
      w: 'Reflexion und Durchsicht täuschen freien Flugraum vor — Markierungen helfen.',
    },
    {
      q: 'Welche Maßnahme schützt gebäudebrütende Arten wie den Mauersegler besonders?',
      correct: 'Nistmöglichkeiten am Gebäude erhalten oder Nistkästen anbieten',
      wrong: [
        'Alle Dachziegel glatt versiegeln ohne Öffnungen',
        'Nur Plankton im Aquarium füttern',
        'Laich im Keller ausbringen',
      ],
      w: 'Gebäudebrüter brauchen zugängliche Nischen; Sanierungen vernichten sonst Nistplätze.',
    },
    {
      q: 'Was ist ein sinnvolles Vogelschutz-Ziel im Siedlungsraum?',
      correct: 'Lebensräume mit Nahrung, Deckung und Nistplätzen erhalten',
      wrong: [
        'Alle Hecken entfernen für „Ordnung“',
        'Nur Kunststoffrasen ohne Insekten',
        'Fenster immer maximal spiegelnd halten',
      ],
      w: 'Artenschutz beginnt beim Lebensraum — nicht nur bei einzelnen Tieren.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(
      `${it.w} Alltagshandeln in Garten, an Gebäuden und an Glasflächen wirkt direkt auf heimische Vogelarten.`,
      'NABU Sachsen: Vogelkollisionen',
      'https://sachsen.nabu.de/',
    ),
    dedupeKey: `bio:k5:vogel:schutz:mc:${it.q.slice(0, 36)}`,
    contentIds: [`bio:k5:vogel:schutz:mc:${it.q.slice(0, 36)}`],
  })
}

function vogelSchutzMulti(rng: Rng) {
  return multiSelectTask({
    question: 'Welche Maßnahmen helfen heimischen Vögeln wirklich?',
    choices: shuffle(rng, [
      'Hecken und Wildsträucher belassen',
      'Nistkästen artgerecht aufhängen',
      'Scheiben gegen Anprall markieren',
      'Alle Altgrasflächen im März flächig abbrennen',
      'Katzen nachts unkontrolliert frei jagen lassen ohne Schutz',
    ]),
    correct: [
      'Hecken und Wildsträucher belassen',
      'Nistkästen artgerecht aufhängen',
      'Scheiben gegen Anprall markieren',
    ],
    solution: 'Habitat + Nistplatz + Anprallschutz',
    explanation: 'Mehrere Maßnahmen greifen zusammen — Lebensraum hat Vorrang.',
    fachwissen: bioFw(
      'Wirksamer Vogelschutz kombiniert Habitat, Brutplätze und Gefahrenreduktion. Einzelne Futterstellen ersetzen keinen Lebensraum.',
      'Wikipedia: Vogelschutz',
      'https://de.wikipedia.org/wiki/Vogelschutz',
    ),
    dedupeKey: 'bio:k5:vogel:schutz:multi',
    contentIds: ['bio:k5:vogel:schutz:multi'],
  })
}

function vogelSchutzCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Gefährdung und Schutzmaßnahme zuordnen.',
    pairs: [
      {
        cause: 'Fehlende Baumhöhlen in jungen Alleen',
        effect: 'Nistkästen als Ersatzbrutplatz',
      },
      {
        cause: 'Spiegelnde Glasfassade',
        effect: 'Sichtbare Markierung der Scheiben',
      },
      {
        cause: 'Ausgeräumte Agrarlandschaft ohne Hecken',
        effect: 'Heckenstreifen und Randstrukturen fördern',
      },
    ],
    distractorEffects: ['Kiemen der Vögel regelmäßig reinigen'],
    solution: 'Problem → passende Schutzmaßnahme',
    explanation: 'Gute Schutzfragen verknüpfen Ursache und konkrete Abhilfe.',
    fachwissen: bioFw(
      'In Sachsen und deutschlandweit zählen Lebensraumverlust und Gebäudefallen zu zentralen Themen. Maßnahmen müssen zur Gefährdung passen — sonst bleibt Schutz wirkungslos.',
      'NABU: Vogelschutz',
      'https://www.nabu.de/tiere-und-pflanzen/voegel/vogelschutz/',
    ),
    dedupeKey: 'bio:k5:vogel:schutz:cause',
  })
}

function vogelSchutzSlots(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welche Maßnahme wirkt wie? Ziehe in die Felder.',
    slotLabels: ['Brutplatz schaffen', 'Anprall mindern', 'Lebensraum fördern'],
    itemLabels: [
      'Artgerechten Nistkasten aufhängen',
      'Fensterscheiben sichtbar markieren',
      'Hecke und Wildsträucher belassen',
    ],
    correctSlots: [0, 1, 2],
    distractors: ['Alle Altgrasflächen flächig abbrennen'],
    solution: 'Nistkasten / Markierung / Hecke',
    explanation: 'Drei Wirkwege: Brutplatz, Gefahr, Habitat.',
    fachwissen: bioFw(
      'Wirksamer Vogelschutz greift auf mehreren Ebenen: Lebensraum erhalten, Brutplätze schaffen und Gefahren (z. B. Glas) verringern.',
      'NABU: Vogelschutz',
      'https://www.nabu.de/tiere-und-pflanzen/voegel/vogelschutz/',
    ),
  })
}

function vogelSchutzKnowledgeMc(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Was ist oft wirksamer als nur Futterstellen im Winter?',
        correct: 'Ganzjährig Lebensraum mit Nahrung, Deckung und Nistplätzen',
        wrong: [
          'Nur spiegelnde Glasflächen ohne Markierung',
          'Alle Hecken entfernen',
          'Nistkästen nie reinigen und nie aufhängen',
        ],
        w: 'Artenschutz beginnt beim Habitat, nicht nur beim Füttern.',
        quelle: 'Wikipedia: Vogelschutz',
        url: 'https://de.wikipedia.org/wiki/Vogelschutz',
      },
      {
        q: 'Warum helfen Glasmarkierungen?',
        correct: 'Vögel erkennen die Scheibe und prallen seltener an',
        wrong: [
          'Markierungen erzeugen neue Federn',
          'Markierungen ersetzen die Atmung',
          'Markierungen machen Eier wasserdicht',
        ],
        w: 'Sichtbarkeit verhindert Kollisionen.',
        quelle: 'NABU: Vogelschutz',
        url: 'https://www.nabu.de/tiere-und-pflanzen/voegel/vogelschutz/',
      },
      {
        q: 'Was gefährdet Gebäudebrüter bei Sanierungen?',
        correct: 'Verschließen von Nischen ohne Ersatzbrutplätze',
        wrong: [
          'Das Aufhängen eines Nistkastens',
          'Das Markieren einer Scheibe',
          'Das Belassen einer Hecke',
        ],
        w: 'Sanierung ohne Rücksicht vernichtet Nistplätze.',
        quelle: 'NABU: Vogelschutz',
        url: 'https://www.nabu.de/tiere-und-pflanzen/voegel/vogelschutz/',
      },
      {
        q: 'Welche Aussage zum Artenschutz stimmt?',
        correct: 'Maßnahmen müssen zur konkreten Gefährdung passen',
        wrong: [
          'Jede Maßnahme hilft jeder Art gleich',
          'Schutz braucht keinen Lebensraum',
          'Vögel brauchen ausschließlich Kiemengewässer',
        ],
        w: 'Ursache und Abhilfe müssen zusammenpassen.',
        quelle: 'Wikipedia: Artenschutz',
        url: 'https://de.wikipedia.org/wiki/Artenschutz',
      },
    ],
    'bio:k5:vogel:schutz:know',
  )
}

export const biVoegelSchutz: Topic['generate'] = mixedVariants(
  vogelSchutzMatch,
  vogelSchutzSlots,
  vogelSchutzMc,
  vogelSchutzKnowledgeMc,
  vogelSchutzMulti,
  vogelSchutzCause,
  vogelSchutzKnowledgeMc,
  vogelSchutzSlots,
  vogelSchutzMc,
)

// ─── Kriechtiere – Schutz und Artenschutz ───────────────────────────────────

function kriechSchutzMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Schutzbedarf und Maßnahme bei Kriechtieren zu.',
    terms: ['Sonnenplatz', 'Versteck / Winterquartier', 'Eiablageplatz'],
    meanings: [
      'Besonnte Steine/Holz zum Aufwärmen (wechselwarm)',
      'Frostfreie Hohlräume, Steinhaufen, Totholz',
      'Grabbarer, warmer Sand/Boden für Gelege',
    ],
    distractor: 'Nur Nistkasten für Meisen in 5 m Höhe',
    solution: 'Sonne / Versteck / Eiablage — Habitatmosaik',
    explanation: 'Zauneidechse & Co. brauchen ein Mosaik aus Wärme, Deckung und Eiablage.',
    fachwissen: bioFw(
      'Wechselwarme Kriechtiere regulieren die Temperatur über Verhalten und Mikrohabitate. Die Zauneidechse (in Sachsen gefährdet) braucht besonnte Plätze, Verstecke und grabbaren Boden für Eier — Lebensraumverlust ist die Hauptgefahr.',
      'NABU Sachsen: Zauneidechse',
      'https://sachsen.nabu.de/',
    ),
    dedupeKey: 'bio:k5:kriechtier:schutz:match',
    contentIds: ['bio:k5:kriechtier:schutz:match'],
  })
}

function kriechSchutzMc(rng: Rng) {
  const items = [
    {
      q: 'Warum sind besonnte Böschungen und Steinhaufen für Zauneidechsen wichtig?',
      correct: 'Sie brauchen Wärmeplätze und Verstecke (wechselwarm)',
      wrong: [
        'Sie atmen nur mit Kiemen im Schatten',
        'Sie brüten ausschließlich in Baumhöhlen',
        'Sie sind gleichwarm und brauchen keine Sonne',
      ],
      w: 'Als wechselwarme Tiere nutzen sie Sonnenplätze zur Thermoregulation.',
    },
    {
      q: 'Welche Baumaßnahme gefährdet Kriechtiere besonders?',
      correct: 'Zerstörung von Saumstrukturen, Brachen und Eiablageflächen',
      wrong: [
        'Aufhängen eines Meisenkastens am Haus',
        'Markieren einer Fensterscheibe',
        'Anlegen eines Laichgewässers für Amphibien',
      ],
      w: 'Lebensraumverlust und Isolation von Populationen sind zentrale Gefährdungen.',
    },
    {
      q: 'Was hilft beim Schutz heimischer Kriechtiere im Garten?',
      correct: 'Trockenmauern, Steinhaufen und ungestörte Sonnenplätze belassen',
      wrong: [
        'Alles lückenlos versiegeln und schattig halten',
        'Nur dichten Rasen ohne Versteckstrukturen',
        'Gelegeplätze täglich umgraben in der Ablagezeit',
      ],
      w: 'Kleine Strukturen schaffen Lebensraum — oft wirksamer als Einzeltierschutz.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(
      `${it.w} Die Zauneidechse braucht Sonne, Verstecke und grabbaren Boden — Lebensraumschutz ist der wichtigste Artenschutz.`,
      'Wikipedia: Zauneidechse',
      'https://de.wikipedia.org/wiki/Zauneidechse',
    ),
    dedupeKey: `bio:k5:kriechtier:schutz:mc:${it.q.slice(0, 36)}`,
    contentIds: [`bio:k5:kriechtier:schutz:mc:${it.q.slice(0, 36)}`],
  })
}

function kriechSchutzClassify(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Ordne: Hilft der Maßnahme dem Kriechtierschutz — oder eher nicht?',
    slotLabels: ['Hilft dem Schutz', 'Schadet / hilft nicht'],
    itemLabels: [
      'Trockenmauer und Steinhaufen erhalten',
      'Saumstreifen an Wegen belassen',
      'Gesamte Böschung versiegeln',
      'Alle Verstecke im Winter räumen und verdichten',
    ],
    correctSlots: [0, 0, 1, 1],
    solution: 'Strukturen erhalten vs. versiegeln/räumen',
    explanation: 'Schutz = Habitatstrukturen lassen; Versiegeln zerstört Lebensraum.',
    fachwissen: bioFw(
      'Artenschutz bei Kriechtieren ist vor allem Habitatschutz: Sonne, Deckung, Vernetzung. Umsiedlungen sind Spezialfälle bei Bauprojekten — Alltagsschutz beginnt im Lebensraum.',
      'Wikipedia: Artenschutz',
      'https://de.wikipedia.org/wiki/Artenschutz',
    ),
  })
}

function kriechSchutzCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Gefährdung → Folge für Kriechtiere.',
    pairs: [
      {
        cause: 'Verlust besonnter Saumstrukturen',
        effect: 'Weniger geeignete Thermoregulationsplätze',
      },
      {
        cause: 'Zerstörung grabbarer Eiablageflächen',
        effect: 'Gelege können nicht erfolgreich abgelegt werden',
      },
      {
        cause: 'Isolation kleiner Populationen',
        effect: 'Höheres Aussterberisiko lokal',
      },
    ],
    distractorEffects: ['Mehr Kiemenatmung bei erwachsenen Eidechsen'],
    solution: 'Habitatverlust → Populationsrisiko',
    explanation: 'Ursachen wirken über Lebensraum und Fortpflanzung.',
    fachwissen: bioFw(
      'Kleine, isolierte Populationen können Verluste schlechter ausgleichen. Deshalb zählen Vernetzung und Erhalt von Saumstrukturen.',
      'Wikipedia: Zauneidechse',
      'https://de.wikipedia.org/wiki/Zauneidechse',
    ),
    dedupeKey: 'bio:k5:kriechtier:schutz:cause',
  })
}

function kriechSchutzHabitatSlots(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welches Habitat-Element erfüllt welche Funktion? Ziehe zu.',
    slotLabels: ['Wärmeplatz', 'Versteck / Winter', 'Eiablage'],
    itemLabels: [
      'Besonnter Stein oder Totholz',
      'Frostfreier Steinhaufen',
      'Lockerer, warmer Sandboden',
    ],
    correctSlots: [0, 1, 2],
    distractors: ['Nur ein Meisenkasten in 5 m Höhe'],
    solution: 'Sonne / Versteck / grabbarer Boden',
    explanation: 'Zauneidechsen brauchen ein Mosaik — nicht nur ein Element.',
    fachwissen: bioFw(
      'Wechselwarme Kriechtiere brauchen besonnte Plätze zur Thermoregulation und sichere, grabbare Gelegeplätze — oft ein Mosaik aus offenen und deckungsreichen Stellen.',
      'Wikipedia: Zauneidechse',
      'https://de.wikipedia.org/wiki/Zauneidechse',
    ),
  })
}

function kriechSchutzKnowledgeMc(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Warum sind Kriechtiere „wechselwarm“ im Schutzkontext wichtig?',
        correct: 'Sie brauchen besonnte Plätze zur Temperaturregulation',
        wrong: [
          'Sie erzeugen eigene Körperwärme wie Vögel immer gleich',
          'Sie atmen nur mit Kiemen im Schatten',
          'Sie brauchen keine Verstecke',
        ],
        w: 'Ohne Wärmeplätze funktioniert der Stoffwechsel schlecht.',
        quelle: 'Wikipedia: Wechselwarmes Tier',
        url: 'https://de.wikipedia.org/wiki/Poikilothermie',
      },
      {
        q: 'Was ist die Hauptgefährdung vieler heimischer Kriechtiere?',
        correct: 'Verlust und Zerschneidung geeigneter Lebensräume',
        wrong: [
          'Zu viele Nistkästen für Vögel',
          'Zu viele Glasmarkierungen',
          'Zu viel Laichgewässer für Amphibien',
        ],
        w: 'Habitatverlust und Isolation treffen Populationen hart.',
        quelle: 'Wikipedia: Zauneidechse',
        url: 'https://de.wikipedia.org/wiki/Zauneidechse',
      },
      {
        q: 'Welche Gartenstruktur hilft Zauneidechsen?',
        correct: 'Trockenmauer, Steinhaufen, ungestörte Sonnenplätze',
        wrong: [
          'Vollständige Versiegelung',
          'Nur dichter Schattenrasen ohne Lücken',
          'Tägliches Umgraben der Gelegeplätze in der Ablagezeit',
        ],
        w: 'Kleine Strukturen schaffen nutzbaren Lebensraum.',
        quelle: 'NABU Sachsen',
        url: 'https://sachsen.nabu.de/',
      },
      {
        q: 'Wozu brauchen Eidechsen grabbaren Boden?',
        correct: 'Zur Ablage der Eier an warmen Stellen',
        wrong: [
          'Zum Nestbau in Baumhöhlen wie Meisen',
          'Zum Filtern von Plankton',
          'Zum Erzeugen von Vogelgesang',
        ],
        w: 'Ohne geeignete Eiablage keine erfolgreiche Fortpflanzung.',
        quelle: 'Wikipedia: Zauneidechse',
        url: 'https://de.wikipedia.org/wiki/Zauneidechse',
      },
    ],
    'bio:k5:kriechtier:schutz:know',
  )
}

export const biKriechtiereSchutz: Topic['generate'] = mixedVariants(
  kriechSchutzMatch,
  kriechSchutzHabitatSlots,
  kriechSchutzMc,
  kriechSchutzKnowledgeMc,
  kriechSchutzClassify,
  kriechSchutzCause,
  kriechSchutzKnowledgeMc,
  kriechSchutzHabitatSlots,
  kriechSchutzMc,
)

// ─── Arbeitsweisen der Biologen ─────────────────────────────────────────────

function arbeitMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne biologische Arbeitsweisen zu.',
    terms: ['Beobachten', 'Untersuchen', 'Vergleichen', 'Protokollieren'],
    meanings: [
      'Genau wahrnehmen, ohne sofort zu deuten',
      'Gezielt Merkmale prüfen (z. B. mit Lupe)',
      'Gemeinsamkeiten und Unterschiede feststellen',
      'Datum, Objekt, Beobachtung schriftlich festhalten',
    ],
    distractor: 'Nur raten ohne Wahrnehmung',
    solution: 'Beobachten / Untersuchen / Vergleichen / Protokoll',
    explanation: 'Naturwissenschaftliches Arbeiten trennt Wahrnehmung, Methode und Dokumentation.',
    fachwissen: bioFw(
      'Beobachten, Untersuchen, Vergleichen: Ein gutes Protokoll enthält Ort/Zeit, Objekt und beschreibende (nicht wertende) Beobachtungen — Deutungen gehören getrennt dazu.',
      'Wikipedia: Wissenschaftliche Methode',
      'https://de.wikipedia.org/wiki/Wissenschaftliche_Methode',
    ),
    dedupeKey: 'bio:k5:arbeit:match',
    contentIds: ['bio:k5:arbeit:match'],
  })
}

function arbeitSort(rng: Rng) {
  return sortChronologyTask(rng, {
    question: 'Ordne Schritte einer einfachen Untersuchung.',
    labels: [
      'Frage / Vermutung formulieren',
      'Beobachtung oder Versuch planen',
      'Daten / Beobachtungen notieren',
      'Ergebnis deuten und prüfen',
    ],
    solution: 'Frage → Plan → Daten → Deutung',
    explanation: 'Zuerst Frage, dann Methode, dann Daten, dann Erklärung.',
    fachwissen: bioFw(
      'Auch in Klasse 5 gilt: Ohne klare Frage und Dokumentation wird aus „Schauen“ kein nachvollziehbares Ergebnis. Deutungen dürfen die Rohbeobachtung nicht ersetzen.',
      'Wikipedia: Experiment',
      'https://de.wikipedia.org/wiki/Experiment',
    ),
    dedupeKey: 'bio:k5:arbeit:sort',
    contentIds: ['bio:k5:arbeit:sort'],
  })
}

function arbeitMc(rng: Rng) {
  const items = [
    {
      q: 'Was gehört in ein Beobachtungsprotokoll — und was eher nicht?',
      correct: 'Beschreiben, was man sieht (z. B. „Ohren angelegt“) — nicht „ist beleidigt“',
      wrong: [
        'Nur Deutungen ohne sichtbare Hinweise',
        'Gar keine Zeit- oder Ortsangabe',
        'Nur Fantasiegeschichten ohne Tierbezug',
      ],
      w: 'Beobachtung und Deutung trennen verhindert Fehlschlüsse.',
    },
    {
      q: 'Wozu dient eine Lupe bei der Feder- oder Blattuntersuchung?',
      correct: 'Strukturen genauer sichtbar machen als mit bloßem Auge',
      wrong: [
        'Die Temperatur des Tieres messen',
        'Den Gesang aufzeichnen',
        'Die Lungenbläschen im Blut zählen',
      ],
      w: 'Untersuchen heißt: geeignete Hilfsmittel gezielt einsetzen.',
    },
    {
      q: 'Warum vergleicht man mehrere Vogelarten miteinander?',
      correct: 'Um Gemeinsamkeiten und Angepasstheiten zu erkennen',
      wrong: [
        'Um Beweise zu vermeiden',
        'Um Protokolle unnötig zu machen',
        'Um nur eine Art als „richtig“ zu erklären',
      ],
      w: 'Vergleichen ist eine Kernmethode der Biologie.',
    },
    {
      q: 'Welches Gerät hilft beim Untersuchen kleiner Blattadern?',
      correct: 'Eine Lupe oder ein Mikroskop',
      wrong: [
        'Ein Thermometer allein ohne Blick',
        'Nur ein Lineal ohne Optik',
        'Ein Lautsprecher für Gesang',
      ],
      w: 'Hilfsmittel erweitern die Wahrnehmung gezielt.',
    },
    {
      q: 'Was bedeutet „Protokollieren“ im Biologieunterricht?',
      correct: 'Beobachtungen und Daten so notieren, dass andere sie nachvollziehen können',
      wrong: [
        'Nur raten ohne aufzuschreiben',
        'Nur Gefühle ohne sichtbare Hinweise notieren',
        'Hilfsmittel absichtlich weglassen',
      ],
      w: 'Nachvollziehbarkeit ist das Ziel der Dokumentation.',
    },
    {
      q: 'Wann ist eine Vermutung sinnvoll?',
      correct: 'Vor dem Versuch — als prüfbare Erwartung',
      wrong: [
        'Erst nachdem man alle Daten erfunden hat',
        'Niemals, weil Biologie keine Fragen stellt',
        'Nur als Ersatz für jede Messung',
      ],
      w: 'Vermutung → Plan → Daten → Prüfung.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(
      `${it.w} Arbeitsweisen sind Werkzeuge: Sie helfen, Lebewesen und Lebenserscheinungen zuverlässig zu erschließen.`,
      'Wikipedia: Beobachtung',
      'https://de.wikipedia.org/wiki/Beobachtung',
    ),
    dedupeKey: `bio:k5:arbeit:mc:${it.q.slice(0, 36)}`,
    contentIds: [`bio:k5:arbeit:mc:${it.q.slice(0, 36)}`],
  })
}

function arbeitClassify(rng: Rng) {
  /** Methoden-Thema: Beispiele aus Alltag/Pflanzen — nicht Säuger-Ethologie. */
  const bank = [
    { text: 'Das Blatt hat fünf Blattadern', slot: 0 },
    { text: 'Die Pflanze ist traurig', slot: 1 },
    { text: 'Unter der Lupe sind Härchen sichtbar', slot: 0 },
    { text: 'Die Feder mag den Wind', slot: 1 },
    { text: 'Der Regenwurm kriecht in 10 s 8 cm', slot: 0 },
    { text: 'Der Regenwurm hasst den Boden', slot: 1 },
  ]
  const four = shuffle(rng, bank).slice(0, 4)
  return classifySlotsTask(rng, {
    question: 'Ist das eine Beobachtung oder schon eine Deutung?',
    slotLabels: ['Beobachtung', 'Deutung'],
    itemLabels: four.map((b) => b.text),
    correctSlots: four.map((b) => b.slot),
    solution: 'Sicht-/Messbares vs. vermutete Absicht/Gefühl',
    explanation: 'Nur Wahrnehmbares gehört zur Beobachtung; Motive sind Deutung.',
    fachwissen: bioFw(
      'Arbeitsweisen-Kern: erst beschreiben, dann vorsichtig deuten — überprüfbar und vergleichbar.',
      'Wikipedia: Beobachtung',
      'https://de.wikipedia.org/wiki/Beobachtung',
    ),
  })
}

function arbeitMethodSlots(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welche Arbeitsweise passt? Ziehe in die Felder.',
    slotLabels: ['Beobachten', 'Untersuchen', 'Vergleichen', 'Protokollieren'],
    itemLabels: [
      'Verhalten der Amsel 5 Minuten beschreiben',
      'Feder unter der Lupe betrachten',
      'Schnäbel von Fink und Bussard gegenüberstellen',
      'Datum, Ort und Merkmal aufschreiben',
    ],
    correctSlots: [0, 1, 2, 3],
    distractors: ['Nur raten ohne Wahrnehmung'],
    solution: 'Wahrnehmen / Hilfsmittel / Gegenüberstellen / Dokumentieren',
    explanation: 'Vier Kernmethoden — klar trennen und zuordnen.',
    fachwissen: bioFw(
      'Vier Kernmethoden der Biologie: Wahrnehmen, mit Hilfsmitteln untersuchen, gegenüberstellen und dokumentieren — klar trennen und zuordnen.',
      'Wikipedia: Wissenschaftliche Methode',
      'https://de.wikipedia.org/wiki/Wissenschaftliche_Methode',
    ),
  })
}

function arbeitKnowledgeMc(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Warum trennt man Beobachtung und Deutung?',
        correct: 'Damit Ergebnisse überprüfbar bleiben und Fehlschlüsse seltener werden',
        wrong: [
          'Weil Deutungen immer verboten sind',
          'Weil Protokolle keine Daten brauchen',
          'Weil Biologie keine Methoden hat',
        ],
        w: 'Zuerst beschreiben, dann vorsichtig erklären.',
        quelle: 'Wikipedia: Beobachtung',
        url: 'https://de.wikipedia.org/wiki/Beobachtung',
      },
      {
        q: 'Was ist „Vergleichen“ in der Biologie?',
        correct: 'Gemeinsamkeiten und Unterschiede gezielt feststellen',
        wrong: [
          'Nur eine Art als einzig möglich erklären',
          'Ohne Merkmale urteilen',
          'Nur Fantasiegeschichten schreiben',
        ],
        w: 'Vergleichen erschließt Angepasstheiten und Verwandtschaften.',
        quelle: 'Wikipedia: Wissenschaftliche Methode',
        url: 'https://de.wikipedia.org/wiki/Wissenschaftliche_Methode',
      },
      {
        q: 'Welche Angabe fehlt oft in schwachen Protokollen?',
        correct: 'Zeit, Ort und klare Beschreibung des Objekts',
        wrong: [
          'Jede erfundene Gefühlslage ohne Sichtbares',
          'Die Lieblingsfarbe der Klasse',
          'Nur eine Note ohne Inhalt',
        ],
        w: 'Metadaten machen Beobachtungen nachvollziehbar.',
        quelle: 'Wikipedia: Beobachtung',
        url: 'https://de.wikipedia.org/wiki/Beobachtung',
      },
      {
        q: 'Wozu dient eine Vermutung vor dem Versuch?',
        correct: 'Sie gibt der Untersuchung eine prüfbare Richtung',
        wrong: [
          'Sie ersetzt alle Daten',
          'Sie macht Protokolle überflüssig',
          'Sie verhindert jede Beobachtung',
        ],
        w: 'Frage/Vermutung → Plan → Daten → Deutung.',
        quelle: 'Wikipedia: Experiment',
        url: 'https://de.wikipedia.org/wiki/Experiment',
      },
    ],
    'bio:k5:arbeit:know',
  )
}

export const biArbeitsweisen: Topic['generate'] = mixedVariants(
  arbeitMatch,
  arbeitMethodSlots,
  arbeitSort,
  arbeitMc,
  arbeitKnowledgeMc,
  arbeitClassify,
  arbeitKnowledgeMc,
  arbeitMethodSlots,
  arbeitMc,
)

// ─── Säugetiere – Lunge und Gasaustausch ────────────────────────────────────

function lungeMatch(rng: Rng) {
  /** Andere Begriffspaare als Gas-Slots / Knowledge-MC — weniger Wiederholung. */
  return matchTermsTask(rng, {
    question: 'Ordne Bau und Atmungsvorgang der Säuger-Lunge zu.',
    terms: ['Zwerchfell', 'Kapillarnetz', 'Einatmen', 'Ausatmen'],
    meanings: [
      'Muskelplatte, die den Brustkorbraum vergrößert/verkleinert',
      'Feine Blutgefäße um die Lungenbläschen',
      'Brustkorb weitet sich, Luft strömt hinein',
      'Brustkorb verengt sich, Luft strömt hinaus',
    ],
    distractor: 'Kiemendeckelbewegung wie bei Knochenfischen',
    solution: 'Zwerchfell / Kapillaren / Einatmen / Ausatmen',
    explanation: 'Neben den Alveolen gehören Mechanik und Blutanschluss zur Lungenatmung.',
    fachwissen: bioFw(
      'Das Zwerchfell steuert die Belüftung der Lunge. In den Lungenbläschen nehmen Kapillaren Sauerstoff auf und geben Kohlenstoffdioxid ab.',
      'Wikipedia: Zwerchfell',
      'https://de.wikipedia.org/wiki/Zwerchfell',
    ),
    dedupeKey: 'bio:k5:saeuger:lunge:match-bau',
    contentIds: ['bio:k5:saeuger:lunge:match-bau'],
  })
}

function lungeSort(rng: Rng) {
  return sortChronologyTask(rng, {
    question: 'Ordne den Weg der Atemluft (von außen nach innen).',
    labels: ['Nase / Mund', 'Luftröhre', 'Bronchien', 'Lungenbläschen'],
    solution: 'Nase → Luftröhre → Bronchien → Alveolen',
    explanation: 'Die Luft wird verzweigt bis in die Bläschen geführt.',
    fachwissen: bioFw(
      'Die Atemwege verzweigen sich baumartig. Erst in den Lungenbläschen ist die Wand dünn genug für effizienten Gasaustausch mit den Blutkapillaren.',
      'Wikipedia: Lunge',
      'https://de.wikipedia.org/wiki/Lunge',
    ),
    dedupeKey: 'bio:k5:saeuger:lunge:sort',
    contentIds: ['bio:k5:saeuger:lunge:sort'],
  })
}

function lungeMc(rng: Rng) {
  const items = [
    {
      q: 'Warum sind viele kleine Lungenbläschen besser als ein großer Hohlraum?',
      correct: 'Sie vergrößern die Oberfläche für den Gasaustausch',
      wrong: [
        'Sie erzeugen Federn für den Flug',
        'Sie ersetzen das Herz vollständig',
        'Sie speichern nur Dotter für Eier',
      ],
      w: 'Oberflächenvergrößerung ist ein zentrales Funktionsprinzip.',
    },
    {
      q: 'Welche Rolle spielt das Zwerchfell beim Atmen?',
      correct: 'Es verändert den Brustraum und treibt Ein- und Ausatmen an',
      wrong: [
        'Es filtert Plankton aus der Luft',
        'Es bildet die Federn',
        'Es ersetzt die Blutgefäße vollständig',
      ],
      w: 'Mechanik der Belüftung — ohne Luftwechsel kein frischer Sauerstoff.',
    },
    {
      q: 'Wozu brauchen Säugetiere überhaupt Lungenatmung?',
      correct: 'Zellen brauchen Sauerstoff für die Energiefreisetzung',
      wrong: [
        'Nur um Federfahnen zu bilden',
        'Nur um Kiemendeckel zu bewegen',
        'Nur um Laich im Wasser zu kühlen',
      ],
      w: 'Ohne O₂-Nachschub stockt der Zellstoffwechsel.',
    },
    {
      q: 'Warum umgeben Blutkapillaren die Lungenbläschen?',
      correct: 'Damit Gase auf kurzem Weg zwischen Luft und Blut wechseln können',
      wrong: [
        'Damit Federn in den Alveolen wachsen',
        'Damit Nahrung dort verdaut wird',
        'Damit Eier dort befruchtet werden',
      ],
      w: 'Kurze Diffusionswege sind entscheidend für effizienten Austausch.',
    },
    {
      q: 'Was passiert beim Einatmen grob gesagt?',
      correct: 'Der Brustraum wird größer — Luft strömt in die Lunge',
      wrong: [
        'Die Lunge wird zu Kiemen',
        'Nur CO₂ wird produziert ohne Luftbewegung',
        'Federn füllen die Bronchien',
      ],
      w: 'Volumenänderung → Druckänderung → Luftstrom.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(
      `${it.w} Säuger sind lungatmende Landwirbeltiere (auch Wale atmen Luft). Die Lunge ist an den Sauerstoffbedarf angepasst.`,
      'Wikipedia: Atmung',
      'https://de.wikipedia.org/wiki/Atmung',
    ),
    dedupeKey: `bio:k5:saeuger:lunge:mc:${it.q.slice(0, 36)}`,
    contentIds: [`bio:k5:saeuger:lunge:mc:${it.q.slice(0, 36)}`],
  })
}

function lungeCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Wirkung beim Gasaustausch.',
    pairs: [
      {
        cause: 'Sehr große innere Oberfläche der Lunge',
        effect: 'Viel Gasaustausch pro Atemzug möglich',
      },
      {
        cause: 'Dünne Wand zwischen Luft und Blut',
        effect: 'Gase können leicht diffundieren',
      },
      {
        cause: 'Körperzellen verbrauchen Sauerstoff',
        effect: 'Atemluft muss ständig erneuert werden',
      },
    ],
    distractorEffects: ['Federn wachsen direkt in den Alveolen'],
    solution: 'Bau → Funktion der Lunge',
    explanation: 'Struktur ermöglicht Funktion.',
    fachwissen: bioFw(
      'Diffusionswege müssen kurz und Flächen groß sein — deshalb Alveolen mit Kapillarnetz. Ventilation (Ein-/Ausatmen) erneuert die Luft.',
      'Wikipedia: Diffusion',
      'https://de.wikipedia.org/wiki/Diffusion',
    ),
    dedupeKey: 'bio:k5:saeuger:lunge:cause',
  })
}

function lungeLabel(rng: Rng) {
  const slots = [...ATEM_DIAGRAM.slots]
  /** Naheliegende Organe/Strukturen — nicht „Federfahne“. */
  const distractors = shuffle(rng, [
    'Speiseröhre',
    'Kehlkopf',
    'Zwerchfell',
    'Herzvorhof',
    'Mageneingang',
  ]).slice(0, 3)
  return imageLabelSlotsTask({
    question:
      'Auf dem Bild siehst du den Atemweg mit Nummern 1–4. Ziehe zu jedem Feld den passenden Abschnitt (von außen nach innen).',
    imageSrc: ATEM_DIAGRAM.imageSrc,
    imageAlt: ATEM_DIAGRAM.imageAlt,
    attribution: ATEM_DIAGRAM.attribution,
    drawLeaders: false,
    instruction:
      'Feld 1 = Bild-Nummer 1 (Anfang des Luftwegs), Feld 4 = Bild-Nummer 4 (Gasaustausch). Drei Begriffe brauchst du nicht.',
    items: [...slots.map((s) => ({ label: s.label })), ...distractors.map((label) => ({ label }))],
    slots: slots.map(({ id, x, y, targetX, targetY }) => ({ id, x, y, targetX, targetY })),
    correctSlots: [0, 1, 2, 3],
    solution: '1 Nase/Mund; 2 Luftröhre; 3 Bronchien; 4 Lungenbläschen',
    explanation: 'Luftweg: Einlass → Leitung → Verzweigung → Gasaustausch in den Bläschen.',
    fachwissen: bioFw(
      'In der Säugerlunge findet der Gasaustausch statt: Sauerstoff geht ins Blut, Kohlenstoffdioxid wird abgegeben. Dafür braucht es eine große, dünne Austauschfläche und eine gute Belüftung der Atemwege.',
      'Wikipedia: Lunge',
      'https://de.wikipedia.org/wiki/Lunge',
    ),
    dedupeKey: 'bio:k5:saeuger:lunge:label',
    contentIds: ['bio:k5:saeuger:lunge:label'],
    rng,
  })
}

function lungePartSlots(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welche Aufgabe hat welcher Atemwegsabschnitt?',
    slotLabels: ['Nase / Mund', 'Luftröhre', 'Bronchien', 'Lungenbläschen'],
    itemLabels: [
      'Luft einlassen und grob reinigen / anwärmen',
      'Luft in den Brustkorb leiten',
      'Luft in die Lungenflügel verzweigen',
      'Gasaustausch mit dem Blut',
    ],
    correctSlots: [0, 1, 2, 3],
    distractors: ['Kiemenblatt für erwachsene Hunde'],
    solution: 'Einlass → Leitung → Verzweigung → Austausch',
    explanation: 'Jeder Abschnitt hat eine andere Aufgabe auf dem Luftweg.',
    fachwissen: bioFw(
      'Die Atemwege leiten die Luft; erst an den Lungenbläschen ist die Wand dünn genug für den Stoffaustausch mit den Blutkapillaren.',
      'Wikipedia: Lunge',
      'https://de.wikipedia.org/wiki/Lunge',
    ),
  })
}

function lungeKnowledgeMc(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Warum liegen die Lungenbläschen am Ende des Atemwegs?',
        correct: 'Dort ist die Wand dünn genug für den Gasaustausch mit dem Blut',
        wrong: [
          'Weil dort Federn wachsen',
          'Weil dort Nahrung zerkleinert wird',
          'Weil dort Kiemen sitzen',
        ],
        w: 'Atemwege transportieren; Alveolen tauschen.',
        quelle: 'Wikipedia: Lungenbläschen',
        url: 'https://de.wikipedia.org/wiki/Lungenbl%C3%A4schen',
      },
      {
        q: 'Was bedeutet Oberflächenvergrößerung in der Lunge?',
        correct: 'Viele kleine Bläschen schaffen viel Kontaktfläche zum Blut',
        wrong: [
          'Ein einziger großer Hohlraum wäre immer besser',
          'Oberfläche spielt für Gase keine Rolle',
          'Nur Federn vergrößern die Lunge',
        ],
        w: 'Mehr Fläche → mehr Diffusion pro Zeit.',
        quelle: 'Wikipedia: Lunge',
        url: 'https://de.wikipedia.org/wiki/Lunge',
      },
      {
        q: 'Welches Gas wird in den Alveolen typischerweise abgegeben?',
        correct: 'Kohlenstoffdioxid aus dem Blut in die Atemluft',
        wrong: [
          'Nur Stickstoff aus Federn',
          'Nur Dotter in die Luft',
          'Nur Hornsubstanz',
        ],
        w: 'O₂ rein, CO₂ raus — Grundmuster der äußeren Atmung.',
        quelle: 'Wikipedia: Atmung',
        url: 'https://de.wikipedia.org/wiki/Atmung',
      },
      {
        q: 'Warum müssen Säuger regelmäßig atmen?',
        correct: 'Zellen verbrauchen Sauerstoff; Luft muss erneuert werden',
        wrong: [
          'Weil Lungen Federn erzeugen',
          'Weil Säuger unter Wasser kiemenatmen',
          'Weil Alveolen Photosynthese betreiben',
        ],
        w: 'Ventilation erneuert die Luft am Ort des Austauschs.',
        quelle: 'Wikipedia: Atmung',
        url: 'https://de.wikipedia.org/wiki/Atmung',
      },
      {
        q: 'Was transportiert der Sauerstoff nach dem Übertritt ins Blut vor allem?',
        correct: 'Er wird zu den Körperzellen weitergeführt',
        wrong: [
          'Er bleibt für immer in der Luftröhre',
          'Er wird zu Federn umgebaut',
          'Er ersetzt das Zwerchfell',
        ],
        w: 'Blutkreislauf verbindet Lunge und Gewebe.',
        quelle: 'Wikipedia: Atmung',
        url: 'https://de.wikipedia.org/wiki/Atmung',
      },
      {
        q: 'Wale atmen mit Lungen. Was folgt daraus?',
        correct: 'Sie müssen zum Atmen an die Wasseroberfläche',
        wrong: [
          'Sie haben Kiemen wie erwachsene Fische',
          'Sie brauchen keine Luft',
          'Sie atmen nur über Federn',
        ],
        w: 'Auch Wasser lebende Säuger sind lungatmend.',
        quelle: 'Wikipedia: Lunge',
        url: 'https://de.wikipedia.org/wiki/Lunge',
      },
    ],
    'bio:k5:saeuger:lunge:know',
  )
}

export const biSaeugerLunge: Topic['generate'] = mixedVariants(
  lungeLabel,
  lungePartSlots,
  lungeMatch,
  lungeSort,
  lungeMc,
  lungeKnowledgeMc,
  lungeCause,
  lungeLabel,
  lungeKnowledgeMc,
  lungeMc,
)

// ─── Säugetiere – Verhalten beobachten ──────────────────────────────────────
// Keine Überschneidung mit LB1 Arbeitsweisen (Beobachtung/Deutung-Klassifikation).

function beobMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Begriffe zur Säuger-Verhaltensbeobachtung zu.',
    terms: ['Ethogramm', 'Verhaltensweise', 'Häufigkeitszählung', 'Beobachtungsdauer'],
    meanings: [
      'Liste arttypischer Verhaltensweisen (z. B. Putzen, Fressen)',
      'Ein einzelnes, klar benanntes Verhalten im Ethogramm',
      'Wie oft ein Verhalten in einer Zeitspanne vorkommt',
      'Festgelegte Zeit, in der man systematisch schaut',
    ],
    distractor: 'Schnabelform eines Finken als Ethogramm-Eintrag',
    solution: 'Ethogramm / Verhaltensweise / Zählung / Dauer',
    explanation: 'Säuger beobachten heißt: klare Kategorien und messbare Notizen.',
    fachwissen: bioFw(
      'Verhaltensbeobachtungen bei Säugetieren: Ethogramme und Zählungen machen Verhalten vergleichbar und nachvollziehbar.',
      'Wikipedia: Ethogramm',
      'https://de.wikipedia.org/wiki/Ethogramm',
    ),
    dedupeKey: 'bio:k5:saeuger:beob:match',
    contentIds: ['bio:k5:saeuger:beob:match'],
  })
}

function beobEthogramSlots(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welches Säuger-Verhalten passt zu welcher Ethogramm-Kategorie?',
    slotLabels: ['Komfortverhalten', 'Nahrungsaufnahme', 'Fortbewegung', 'Sozialkontakt'],
    itemLabels: [
      'Katze putzt das Fell mit der Zunge',
      'Hund kaut an einem Kauknochen',
      'Reh wechselt trabend die Wiese',
      'Welpen raufen spielerisch miteinander',
    ],
    correctSlots: [0, 1, 2, 3],
    distractors: ['Amsel trägt Moos ins Nest'],
    solution: 'Putzen / Fressen / Laufen / Spielkontakt',
    explanation: 'Ethogramm-Kategorien helfen, Säugerverhalten zu ordnen.',
    fachwissen: bioFw(
      'Ethogramme listen arttypische Verhaltensweisen (z. B. Putzen, Fressen, Ruhen). Mit klaren Kategorien und Zeitfenstern wird Verhalten vergleichbar.',
      'Wikipedia: Ethologie',
      'https://de.wikipedia.org/wiki/Ethologie',
    ),
  })
}

function beobMc(rng: Rng) {
  const items = [
    {
      q: 'Du zählst 5 Minuten lang, wie oft sich eine Katze putzt. Was misst du?',
      correct: 'Die Häufigkeit eines Verhaltens in einer festen Zeit',
      wrong: [
        'Die Temperatur der Lungenbläschen',
        'Die Schnabelform der Katze',
        'Die Rangordnung ohne Hinschauen',
      ],
      w: 'Zählprotokolle machen Verhalten auswertbar.',
    },
    {
      q: 'Warum legt man vor der Zoo-Beobachtung ein Ethogramm fest?',
      correct: 'Damit alle dasselbe Verhalten gleich benennen und zählen',
      wrong: [
        'Damit Tiere gestresst werden',
        'Damit Protokolle überflüssig werden',
        'Damit Säuger zu Vögeln werden',
      ],
      w: 'Gemeinsame Kategorien → vergleichbare Daten.',
    },
    {
      q: 'Was ist beim Beobachten von Säugern im Zoo besonders wichtig?',
      correct: 'Abstand halten und Tiere nicht unnötig stören',
      wrong: [
        'Tiere anfassen und füttern ohne Erlaubnis',
        'Laut schreien, um Reaktionen zu erzwingen',
        'Ins Gehege steigen',
      ],
      w: 'Tierschutz gehört zur Beobachtungsmethode.',
    },
    {
      q: 'Ein Hund wedelt und läuft zur Tür. Was ist eine sinnvolle Ethogramm-Notiz?',
      correct: '„Wedeln + Laufen zur Tür“ (beschreibend notieren)',
      wrong: [
        'Nur „Hund ist genial“ ohne Verhalten',
        'Nur die Lieblingsfarbe notieren',
        'Lungenvolumen schätzen ohne Blick',
      ],
      w: 'Sichtbare Verhaltensweisen eintragen — klar und knapp.',
    },
    {
      q: 'Warum reicht oft ein kurzer Blick nicht für eine Verhaltensbeobachtung?',
      correct: 'Viele Verhaltensweisen wiederholen sich erst über Minuten',
      wrong: [
        'Weil Säuger keine Verhaltensweisen haben',
        'Weil Ethogramme verboten sind',
        'Weil Zählen sinnlos ist',
      ],
      w: 'Dauer und Wiederholung zeigen Muster.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(
      `${it.w} Ethologie erfasst Verhalten mit klaren Kategorien und messbaren Notizen — nicht nur mit Eindrücken.`,
      'Wikipedia: Ethologie',
      'https://de.wikipedia.org/wiki/Ethologie',
    ),
    dedupeKey: `bio:k5:saeuger:beob:mc:${it.q.slice(0, 36)}`,
    contentIds: [`bio:k5:saeuger:beob:mc:${it.q.slice(0, 36)}`],
  })
}

function beobSort(rng: Rng) {
  return sortChronologyTask(rng, {
    question: 'Ordne Schritte einer Säuger-Verhaltensbeobachtung.',
    labels: [
      'Ethogramm / Frage festlegen (z. B. Putzen)',
      'Feste Zeit beobachten und Striche setzen',
      'Häufigkeiten auszählen',
      'Muster vorsichtig erklären',
    ],
    solution: 'Ethogramm → Zählen → Auswerten → Erklären',
    explanation: 'Zuerst Kategorien und Daten, dann Erklärung.',
    fachwissen: bioFw(
      'Zuerst legt man ein Ethogramm und eine Frage fest, dann beobachtet und zählt man in einem festen Zeitfenster — erst danach deutet man vorsichtig.',
      'Wikipedia: Ethologie',
      'https://de.wikipedia.org/wiki/Ethologie',
    ),
    dedupeKey: 'bio:k5:saeuger:beob:sort',
    contentIds: ['bio:k5:saeuger:beob:sort'],
  })
}

function beobSpeciesSlots(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welches Verhalten typischerweise zu welchem Säuger?',
    slotLabels: ['Haushund', 'Hauskatze', 'Reh', 'Feldhase'],
    itemLabels: [
      'Wedelt oft bei Begrüßung mit dem Schwanz',
      'Putzt Fell ausgiebig mit der Zunge',
      'Äst auf der Wiese und sichert mit erhobenem Kopf',
      'Macht große Sätze und legt Ohren flach an beim Flüchten',
    ],
    correctSlots: [0, 1, 2, 3],
    distractors: ['Baut ein FederNest in der Astgabel'],
    solution: 'Hund / Katze / Reh / Hase',
    explanation: 'Arttypische Verhaltensweisen sind Beobachtungsgegenstand.',
    fachwissen: bioFw(
      'Ethogramme mit heimischen Säugern (z. B. Katze, Hund, Reh) listen arttypische Verhaltensweisen und machen Beobachtungen vergleichbar.',
      'Wikipedia: Ethologie',
      'https://de.wikipedia.org/wiki/Ethologie',
    ),
  })
}

function beobKnowledgeMc(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Was ist ein Ethogramm bei der Säugerbeobachtung?',
        correct: 'Eine Liste typischer Verhaltensweisen der beobachteten Art',
        wrong: [
          'Ein Organ in der Lunge',
          'Ein Schnabeltyp bei Finken',
          'Ein Laichballen im Teich',
        ],
        w: 'Ethogramme machen Beobachtungen vergleichbar.',
        quelle: 'Wikipedia: Ethogramm',
        url: 'https://de.wikipedia.org/wiki/Ethogramm',
      },
      {
        q: 'Was gehört in eine Häufigkeitszählung?',
        correct: 'Festgelegte Zeit + klar benanntes Verhalten + Strichliste',
        wrong: [
          'Nur Fantasie ohne Tier',
          'Nur die Lieblingsfarbe',
          'Nur eine Note ohne Verhalten',
        ],
        w: 'Zeit, Kategorie, Zählung — sonst kein Muster.',
        quelle: 'Wikipedia: Ethologie',
        url: 'https://de.wikipedia.org/wiki/Ethologie',
      },
      {
        q: 'Warum beobachtet man Säuger oft mehrere Minuten?',
        correct: 'Um Sequenzen und Wiederholungen zu erkennen',
        wrong: [
          'Weil eine Sekunde immer reicht',
          'Weil Ethogramme verboten sind',
          'Weil Säuger keine Sinne haben',
        ],
        w: 'Kurzblicke erfassen oft nur Ausschnitte.',
        quelle: 'Wikipedia: Verhaltensbiologie',
        url: 'https://de.wikipedia.org/wiki/Verhaltensbiologie',
      },
      {
        q: 'Welches Verhalten passt typischerweise zur Hauskatze?',
        correct: 'Ausgiebiges Fellputzen mit der Zunge',
        wrong: [
          'Hakenschnabel zum Zerreißen',
          'Nestbau mit Moos in der Astgabel',
          'Laichen im Teich',
        ],
        w: 'Komfortverhalten ist bei Katzen gut beobachtbar.',
        quelle: 'Wikipedia: Hauskatze',
        url: 'https://de.wikipedia.org/wiki/Hauskatze',
      },
      {
        q: 'Was gilt ethisch bei der Beobachtung im Zoo?',
        correct: 'Tiere nicht unnötig stressen, Abstand halten',
        wrong: [
          'Immer anfassen und Futter werfen',
          'Laut schreien für „echte“ Reaktionen',
          'Ohne Erlaubnis ins Gehege',
        ],
        w: 'Methode und Tierschutz gehören zusammen.',
        quelle: 'Wikipedia: Zoo',
        url: 'https://de.wikipedia.org/wiki/Zoo',
      },
    ],
    'bio:k5:saeuger:beob:know',
  )
}

export const biSaeugerVerhaltenBeobachten: Topic['generate'] = mixedVariants(
  beobEthogramSlots,
  beobMatch,
  beobSpeciesSlots,
  beobMc,
  beobKnowledgeMc,
  beobSort,
  beobKnowledgeMc,
  beobEthogramSlots,
  beobMc,
)

// ─── Säugetiere – Sinne und Kommunikation ───────────────────────────────────

function sinneMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Sinne und typische Leistungen zu.',
    terms: ['Geruchssinn', 'Gehör', 'Gesichtssinn', 'Tastsinn'],
    meanings: [
      'Duftspuren und Nahrung erkennen (z. B. Hund)',
      'Laute und Warnsignale wahrnehmen',
      'Bewegung und Formen erkennen',
      'Berührung über Schnurrhaare/Haut',
    ],
    distractor: 'Nur Photosynthese in Blättern',
    solution: 'Geruch / Gehör / Sehen / Tasten',
    explanation: 'Sinne liefern Informationen — Grundlage von Kommunikation.',
    fachwissen: bioFw(
      'Hunde nutzen Geruch besonders stark; Katzen kombinieren Gehör, Sehen und Schnurrhaare. Tierkommunikation braucht Sender, Signal und Empfänger.',
      'Wikipedia: Sinnesorgan',
      'https://de.wikipedia.org/wiki/Sinnesorgan',
    ),
    dedupeKey: 'bio:k5:saeuger:sinne:match',
    contentIds: ['bio:k5:saeuger:sinne:match'],
  })
}

function sinneClassify(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Ordne Signal und Sinneskanal zu.',
    slotLabels: ['Akustisch (Gehör)', 'Chemisch (Geruch)', 'Visuell (Sehen)'],
    itemLabels: [
      'Bellendes Warnsignal',
      'Duftmarke am Baum',
      'Imponierstellung mit aufgestelltem Fell',
    ],
    correctSlots: [0, 1, 2],
    distractors: ['Kiemenschlag als Atemsignal unter Wasser bei erwachsenen Hunden'],
    solution: 'Laut / Duft / Haltung',
    explanation: 'Kommunikation nutzt verschiedene Kanäle.',
    fachwissen: bioFw(
      'Tiere senden Signale (Laut, Duft, Haltung); Artgenossen empfangen sie über passende Sinne. Ohne Sender, Signal und Empfänger kommt keine Botschaft an.',
      'Wikipedia: Tierkommunikation',
      'https://de.wikipedia.org/wiki/Tierkommunikation',
    ),
  })
}

function sinneMc(rng: Rng) {
  const items = [
    {
      q: 'Was gehört zum Sender–Empfänger-Modell?',
      correct: 'Sender erzeugt Signal — Empfänger nimmt es über Sinne wahr',
      wrong: [
        'Nur der Empfänger sendet ohne Signal',
        'Signale entstehen ohne Lebewesen',
        'Sinne sind nur bei Pflanzen nötig',
      ],
      w: 'Ohne Empfänger bleibt ein Signal wirkungslos.',
    },
    {
      q: 'Warum sind Schnurrhaare für Katzen wichtig?',
      correct: 'Sie liefern Tastinformationen über Umgebung und Beute',
      wrong: [
        'Sie ersetzen die Lunge vollständig',
        'Sie dienen nur der Photosynthese',
        'Sie erzeugen Vogelgesang',
      ],
      w: 'Vibrissen sind spezialisierte Tastorgane.',
    },
    {
      q: 'Ein Hund markiert mit Urin einen Pfosten. Welche Aussage passt?',
      correct: 'Chemische Kommunikation über Duftmarken',
      wrong: [
        'Rein akustische Balz wie Vogelgesang',
        'Nur Gasaustausch in Alveolen',
        'Nur Nestbau mit Speichel',
      ],
      w: 'Duftmarken sind klassische chemische Signale.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(
      `${it.w} Sinne und Kommunikation hängen zusammen: Ohne Wahrnehmung keine Reaktion auf Artgenossen oder Umwelt.`,
      'Wikipedia: Kommunikation (Biologie)',
      'https://de.wikipedia.org/wiki/Kommunikation_(Biologie)',
    ),
    dedupeKey: `bio:k5:saeuger:sinne:mc:${it.q.slice(0, 36)}`,
    contentIds: [`bio:k5:saeuger:sinne:mc:${it.q.slice(0, 36)}`],
  })
}

function sinneCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Signal und mögliche Wirkung.',
    pairs: [
      {
        cause: 'Warnlaut des Rudels',
        effect: 'Artgenossen werden aufmerksam / flüchten',
      },
      {
        cause: 'Duftmarke im Revier',
        effect: 'Andere Tiere erkennen „besetzt“',
      },
      {
        cause: 'Imponierhaltung',
        effect: 'Rivalen werden eingeschüchtert',
      },
    ],
    distractorEffects: ['Alveolen verdoppeln sich sofort'],
    solution: 'Signal → Verhaltensänderung beim Empfänger',
    explanation: 'Kommunikation verändert Verhalten.',
    fachwissen: bioFw(
      'Ob Laut, Duft oder Haltung: Erfolgreiche Signale lösen beim Empfänger eine Reaktion aus — sonst kommt keine Botschaft an.',
      'Wikipedia: Tierkommunikation',
      'https://de.wikipedia.org/wiki/Tierkommunikation',
    ),
    dedupeKey: 'bio:k5:saeuger:sinne:cause',
  })
}

function sinneSenderSlots(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Sender, Signal oder Empfänger? Ziehe in die Felder.',
    slotLabels: ['Sender', 'Signal', 'Empfänger'],
    itemLabels: [
      'Hund, der bellt',
      'Belllaut in der Luft',
      'Artgenosse, der den Laut hört',
    ],
    correctSlots: [0, 1, 2],
    distractors: ['Photosynthese im Blatt als „Bellsignal“'],
    solution: 'Sender → Signal → Empfänger',
    explanation: 'Das Modell strukturiert Kommunikation.',
    fachwissen: bioFw(
      'Ohne passenden Sinn beim Empfänger bleibt das Signal wirkungslos.',
      'Wikipedia: Tierkommunikation',
      'https://de.wikipedia.org/wiki/Tierkommunikation',
    ),
  })
}

function sinneKnowledgeMc(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Welcher Sinn dominiert bei vielen Hunden bei der Spurensuche?',
        correct: 'Geruchssinn',
        wrong: [
          'Nur Photosynthese',
          'Nur Federfühlen',
          'Nur Kiemenschlag',
        ],
        w: 'Hunde nutzen Duftspuren extrem leistungsfähig.',
        quelle: 'Wikipedia: Sinnesorgan',
        url: 'https://de.wikipedia.org/wiki/Sinnesorgan',
      },
      {
        q: 'Was sind Vibrissen (Schnurrhaare)?',
        correct: 'Spezialisierte Tastorgane',
        wrong: [
          'Lungenbläschen',
          'Federn zum Flug',
          'Kiemenblätter',
        ],
        w: 'Sie liefern Informationen über Nähe und Bewegung.',
        quelle: 'Wikipedia: Vibrisse',
        url: 'https://de.wikipedia.org/wiki/Vibrisse',
      },
      {
        q: 'Duftmarken sind welche Art von Signal?',
        correct: 'Chemische Signale',
        wrong: [
          'Nur rein akustische Vogelgesänge',
          'Nur Alveolen-Gasaustausch',
          'Nur Nestbaumaterial',
        ],
        w: 'Chemische Kommunikation über Geruch.',
        quelle: 'Wikipedia: Tierkommunikation',
        url: 'https://de.wikipedia.org/wiki/Tierkommunikation',
      },
      {
        q: 'Warum braucht Kommunikation passende Sinne?',
        correct: 'Der Empfänger muss das Signal wahrnehmen können',
        wrong: [
          'Sinne sind nur bei Pflanzen nötig',
          'Signale wirken ohne Lebewesen',
          'Empfänger senden immer ohne Signal',
        ],
        w: 'Sender–Signal–Empfänger setzt Wahrnehmung voraus.',
        quelle: 'Wikipedia: Kommunikation (Biologie)',
        url: 'https://de.wikipedia.org/wiki/Kommunikation_(Biologie)',
      },
    ],
    'bio:k5:saeuger:sinne:know',
  )
}

export const biSaeugerSinne: Topic['generate'] = mixedVariants(
  sinneMatch,
  sinneSenderSlots,
  sinneClassify,
  sinneMc,
  sinneKnowledgeMc,
  sinneCause,
  sinneKnowledgeMc,
  sinneSenderSlots,
  sinneMc,
)

// ─── Säugetiere – Sozialverhalten ───────────────────────────────────────────

function sozialMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Begriffe des Sozialverhaltens zu.',
    terms: ['Rudel / Gruppe', 'Rangordnung', 'Revier', 'Kooperation'],
    meanings: [
      'Mehrere Tiere leben und handeln zusammen',
      'Abstufung von Dominanz und Zugang zu Ressourcen',
      'Gegen Artgenossen verteidigtes Gebiet',
      'Gemeinsames Handeln zum Vorteil (z. B. Jagd, Aufzucht)',
    ],
    distractor: 'Einzelzelle ohne Nervensystem als Rudel',
    solution: 'Gruppe / Rang / Revier / Kooperation',
    explanation: 'Sozialverhalten organisiert Zusammenleben und Konkurrenz.',
    fachwissen: bioFw(
      'Wölfe oder Primaten zeigen Rang und Kooperation; viele Arten markieren Reviere. Sozialverhalten ist art- und situationsabhängig — nicht jede Art lebt im Rudel.',
      'Wikipedia: Sozialverhalten',
      'https://de.wikipedia.org/wiki/Sozialverhalten',
    ),
    dedupeKey: 'bio:k5:saeuger:sozial:match',
    contentIds: ['bio:k5:saeuger:sozial:match'],
  })
}

function sozialMc(rng: Rng) {
  const items = [
    {
      q: 'Was beschreibt eine Rangordnung in einer Gruppe?',
      correct: 'Unterschiedliche Positionen bei Zugang zu Futter, Ruheplatz oder Partner',
      wrong: [
        'Dass alle Tiere immer identisch handeln',
        'Dass Säuger keine Sinne haben',
        'Dass Lungenbläschen die Rangfolge speichern',
      ],
      w: 'Rang ordnet Konflikte — oft über Imponieren statt Dauerstreit.',
    },
    {
      q: 'Warum leben manche Säuger in Gruppen?',
      correct: 'Vorteile bei Jagd, Feindvermeidung oder Jungenaufzucht',
      wrong: [
        'Weil Gruppen Photosynthese betreiben',
        'Weil Einzeltiere keine Lungen haben',
        'Weil Revier immer verboten ist',
      ],
      w: 'Vorteile und Kosten (Konkurrenz, Krankheit) stehen im Gleichgewicht.',
    },
    {
      q: 'Was ist ein Revier im Sozialverhalten?',
      correct: 'Ein Gebiet, das gegen Rivalen verteidigt oder markiert wird',
      wrong: [
        'Nur ein Organ in der Lunge',
        'Nur ein Federabschnitt',
        'Nur ein Laichballen im Teich',
      ],
      w: 'Reviere sichern Ressourcen — Größe und Härte der Verteidigung sind artabhängig.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: it.w,
    fachwissen: bioFw(
      `${it.w} Sozialverhalten umfasst auch Pflege, Spiel und Aggression — immer im Kontext der Art.`,
      'Wikipedia: Rudel',
      'https://de.wikipedia.org/wiki/Rudel',
    ),
    dedupeKey: `bio:k5:saeuger:sozial:mc:${it.q.slice(0, 36)}`,
    contentIds: [`bio:k5:saeuger:sozial:mc:${it.q.slice(0, 36)}`],
  })
}

function sozialClassify(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Ordne Beispiele dem Sozialverhalten zu.',
    slotLabels: ['Kooperation', 'Rang / Imponieren', 'Reviermarkierung'],
    itemLabels: [
      'Gemeinsame Jagd im Rudel',
      'Imponierstellung gegenüber Rivalen',
      'Duftmarken an Reviergrenzen',
    ],
    correctSlots: [0, 1, 2],
    distractors: ['Einzelne Alveole speichert die Rangliste'],
    solution: 'Jagd / Imponieren / Duftmarke',
    explanation: 'Verschiedene Formen sozialen Handelns.',
    fachwissen: bioFw(
      'Konkrete Beispiele (Wolf, Hund, Affe, Reh) machen abstrakte Begriffe greifbar. Wichtig: nicht jedes Tier lebt in festen Rudeln — Solitärleben ist ebenfalls Sozialstrategie.',
      'Wikipedia: Sozialverhalten',
      'https://de.wikipedia.org/wiki/Sozialverhalten',
    ),
  })
}

function sozialMulti(rng: Rng) {
  return multiSelectTask({
    question: 'Welche Aussagen zum Sozialverhalten stimmen?',
    choices: shuffle(rng, [
      'Rangordnungen können Konflikte um Ressourcen regeln',
      'Reviere werden oft markiert oder verteidigt',
      'Kooperation kann Jagd oder Aufzucht betreffen',
      'Alle Säuger leben immer in riesigen Rudeln',
      'Sozialverhalten braucht keine Sinne und keine Signale',
    ]),
    correct: [
      'Rangordnungen können Konflikte um Ressourcen regeln',
      'Reviere werden oft markiert oder verteidigt',
      'Kooperation kann Jagd oder Aufzucht betreffen',
    ],
    solution: 'Rang, Revier, Kooperation — nicht „immer riesiges Rudel“',
    explanation: 'Sozialformen sind vielfältig.',
    fachwissen: bioFw(
      'Sozialverhalten und Kommunikation greifen ineinander: Signale steuern Rang, Zusammenhalt und Revier. Einzelgänger nutzen andere Strategien.',
      'Wikipedia: Sozialverhalten',
      'https://de.wikipedia.org/wiki/Sozialverhalten',
    ),
    dedupeKey: 'bio:k5:saeuger:sozial:multi',
    contentIds: ['bio:k5:saeuger:sozial:multi'],
  })
}

function sozialSlots(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welches Sozialverhalten passt? Ziehe in die Felder.',
    slotLabels: ['Kooperation', 'Rang / Dominanz', 'Revier', 'Gruppe'],
    itemLabels: [
      'Gemeinsame Jagd oder Jungenaufzucht',
      'Zugang zu Futter nach Status',
      'Duftmarken an Grenzen',
      'Mehrere Tiere leben und handeln zusammen',
    ],
    correctSlots: [0, 1, 2, 3],
    distractors: ['Einzelne Alveole speichert die Rangliste'],
    solution: 'Kooperation / Rang / Revier / Gruppe',
    explanation: 'Vier Grundbegriffe des Sozialverhaltens zuordnen.',
    fachwissen: bioFw(
      'Rudel, Rangordnung, Revier und Einzelgänger beschreiben unterschiedliche Sozialstrategien — z. B. bei Wolf, Hund oder Reh.',
      'Wikipedia: Sozialverhalten',
      'https://de.wikipedia.org/wiki/Sozialverhalten',
    ),
  })
}

function sozialKnowledgeMc(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Was ist ein Vorteil von Gruppenleben?',
        correct: 'Bessere Feindvermeidung, Jagd oder Aufzucht möglich',
        wrong: [
          'Gruppen betreiben immer Photosynthese',
          'Einzeltiere haben nie Sinne',
          'Reviere sind bei Säugern verboten',
        ],
        w: 'Vorteile stehen Kosten (Konkurrenz, Krankheit) gegenüber.',
        quelle: 'Wikipedia: Sozialverhalten',
        url: 'https://de.wikipedia.org/wiki/Sozialverhalten',
      },
      {
        q: 'Wozu kann eine Rangordnung dienen?',
        correct: 'Konflikte um Ressourcen regeln, oft ohne Dauerstreit',
        wrong: [
          'Lungenbläschen speichern die Rangfolge',
          'Alle Tiere handeln immer identisch',
          'Sinne werden abgeschaltet',
        ],
        w: 'Dominanz strukturiert Zugang zu Futter, Platz, Partner.',
        quelle: 'Wikipedia: Dominanz (Ökologie)',
        url: 'https://de.wikipedia.org/wiki/Dominanz_(%C3%96kologie)',
      },
      {
        q: 'Müssen alle Säuger in großen Rudeln leben?',
        correct: 'Nein — Solitärleben ist ebenfalls eine mögliche Strategie',
        wrong: [
          'Ja, jedes Säugetier lebt immer im Riesenrudel',
          'Ja, sonst gibt es keine Lungen',
          'Ja, sonst gibt es keine Sinne',
        ],
        w: 'Sozialformen sind art- und situationsabhängig.',
        quelle: 'Wikipedia: Sozialverhalten',
        url: 'https://de.wikipedia.org/wiki/Sozialverhalten',
      },
      {
        q: 'Was verknüpft Sozialverhalten mit Kommunikation?',
        correct: 'Signale steuern Rang, Zusammenhalt und Revier',
        wrong: [
          'Sozialverhalten braucht keine Signale',
          'Nur Alveolen kommunizieren',
          'Nur Federn speichern Ranglisten',
        ],
        w: 'Ohne Wahrnehmung und Signale kein koordiniertes Sozialleben.',
        quelle: 'Wikipedia: Tierkommunikation',
        url: 'https://de.wikipedia.org/wiki/Tierkommunikation',
      },
    ],
    'bio:k5:saeuger:sozial:know',
  )
}

export const biSaeugerSozial: Topic['generate'] = mixedVariants(
  sozialMatch,
  sozialSlots,
  sozialMc,
  sozialKnowledgeMc,
  sozialClassify,
  sozialMulti,
  sozialKnowledgeMc,
  sozialSlots,
  sozialMc,
)

/** Registry for NewUx / generators wiring. */
export const BIOLOGIE_K5_NEU_TOPIC_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k5-lb1-arbeitsweisen': biArbeitsweisen,
  'bi-k5-lb4-kriechtiere-schutz': biKriechtiereSchutz,
  'bi-k5-lb5-voegel-schnabel': biVoegelSchnabelNahrung,
  'bi-k5-lb5-voegel-verhalten': biVoegelRevierBalz,
  'bi-k5-lb5-voegel-schutz': biVoegelSchutz,
  'bi-k5-lb6-saeuger-lunge': biSaeugerLunge,
  'bi-k5-lb6-saeuger-verhalten': biSaeugerVerhaltenBeobachten,
  'bi-k5-lb6-saeuger-sinne': biSaeugerSinne,
  'bi-k5-lb6-saeuger-sozial': biSaeugerSozial,
}
