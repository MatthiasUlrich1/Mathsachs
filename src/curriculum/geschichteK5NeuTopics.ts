/**
 * K5 Geschichte — hand-authored banks for former „Neu“ placeholders (Lehrplan Gym Sachsen).
 * Themen: Archäologie Sachsen, Jetztmensch, Gesellschaftspyramide, Polis,
 * Gruppen ohne Mitbestimmung, Ressourcen, Landschaftswandel.
 * Interaktionen aus dem Gesamtportfolio (Zuordnen, Klassifikation, Bildbeschriftung,
 * Sortieren, Ursache–Wirkung, MC/Multi, Richtig/Falsch).
 * Keine Bulk-Skripte — Inhalte bewusst pro Thema gesetzt.
 * Pack: neu:true + released:false bis expliziter Freigabe.
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
  trueFalse,
} from './biologieHelpers'
import type { Topic } from './types'

const geFw = bioFw

/** Themen-Fachwissen — allgemeines Sachwissen, nie die konkrete Lösung. */
const TOPIC_FW = {
  archaeo: geFw(
    'Archäologie erschließt Vergangenheit über materielle Funde und Grabungen. Der Fundkontext (Lage, Schicht, Begleitfunde) ist oft wichtiger als das Einzelstück. Regionalgeschichte verbindet örtliche Funde mit größeren Epochen.',
    'Wikipedia: Archäologie',
    'https://de.wikipedia.org/wiki/Arch%C3%A4ologie',
  ),
  jetztmensch: geFw(
    'Der heutige Mensch gehört zur Art Homo sapiens. Frühere Menschenformen unterscheiden sich in Körperbau, Werkzeugen und Lebensweise. Steinzeitliche Stufen (Alt-/Jungsteinzeit) beschreiben Technik und Ernährung, nicht nur „Jahre“.',
    'Wikipedia: Homo sapiens',
    'https://de.wikipedia.org/wiki/Homo_sapiens',
  ),
  pyramide: geFw(
    'Die altägyptische Gesellschaft wird oft als Pyramide beschrieben: Wenige an der Spitze, viele an der Basis. Schrift und Verwaltung stützten Herrschaft und Wirtschaft. Hieroglyphen waren vor allem eine Angelegenheit gebildeter Schreiber.',
    'Wikipedia: Altes Ägypten',
    'https://de.wikipedia.org/wiki/Altes_%C3%84gypten',
  ),
  polis: geFw(
    'Eine Polis war ein griechischer Stadtstaat: Stadt, Umland und oft ein Hafen bildeten eine politische Einheit. Typisch sind Agora (Markt und Versammlung) und Akropolis (Burgberg mit Heiligtümern). Die Bewohner fühlten sich vor allem ihrer Polis zugehörig.',
    'Wikipedia: Polis',
    'https://de.wikipedia.org/wiki/Polis',
  ),
  ohne: geFw(
    'In der attischen Demokratie galten nur volljährige männliche Bürger als politisch berechtigt. Frauen, Metöken (Zugewanderte ohne Bürgerrecht) und Sklaven lebten in der Polis, hatten aber keine Stimme in der Volksversammlung.',
    'Wikipedia: Attische Demokratie',
    'https://de.wikipedia.org/wiki/Attische_Demokratie',
  ),
  ressourcen: geFw(
    'Wasser, Boden und Nahrung sind grundlegende Ressourcen früher Gesellschaften. Hochkulturen am Nil oder in Flusstälern nutzten Überschwemmung und Bewässerung. Knappheit und Technik prägen Siedlung und Herrschaft.',
    'Wikipedia: Ressource',
    'https://de.wikipedia.org/wiki/Ressource',
  ),
  landschaft: geFw(
    'Menschen verändern Landschaften durch Rodung, Ackerbau und Siedlung. Waldverlust kann Erosion begünstigen. Technik (Pflug, Metallwerkzeuge) beschleunigt Nutzung — Folgen für Boden und Umwelt sind historisch oft spürbar.',
    'Wikipedia: Landschaft',
    'https://de.wikipedia.org/wiki/Landschaft',
  ),
} as const

/**
 * Polis-Ansicht: Leo von Klenze, Ideale Ansicht der Akropolis (1846), Public Domain.
 * Gemälde ohne Textbeschriftung — keine Spoiler-Abdeckung nötig.
 * 1 Akropolis · 2 Parthenon · 3 Propyläen · 4 Unterstadt
 */
const POLIS_DIAGRAM = {
  imageSrc: '/anatomy/polis-athen-uebersicht.jpg',
  imageAlt: 'Ideale Ansicht der Akropolis und des Areopags in Athen (Leo von Klenze, 1846)',
  attribution:
    'Leo von Klenze: Ideale Ansicht der Akropolis und des Areopag in Athen (1846), ' +
    'Neue Pinakothek / Wikimedia Commons, Public Domain — ' +
    'https://commons.wikimedia.org/wiki/File:Klenze,_Leo_von_-_Ideale_Ansicht_der_Akropolis_und_des_Areopag_in_Athen,_1846.jpg ' +
    '(Drop-Felder/Leader nur UI-Overlay; Bild unverändert).',
  slots: [
    { id: 'akropolis', x: 8, y: 18, targetX: 62.0, targetY: 42.0, label: 'Akropolis' },
    { id: 'parthenon', x: 8, y: 36, targetX: 67.0, targetY: 34.0, label: 'Parthenon' },
    { id: 'propylaen', x: 8, y: 54, targetX: 52.0, targetY: 44.0, label: 'Propyläen' },
    // Tip must not sit on the Propyläen leader (old 16/52 lay on that segment).
    { id: 'unterstadt', x: 8, y: 72, targetX: 22.0, targetY: 70.0, label: 'Unterstadt' },
  ],
} as const

function knowledgeMc(
  rng: Rng,
  items: Array<{ q: string; correct: string; wrong: string[] }>,
  keyPrefix: string,
  topicFw: ReturnType<typeof geFw>,
) {
  const it = items[Math.floor(rng() * items.length)]!
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: 'Prüfe Begriffe und Zusammenhänge am Schulstoff.',
    fachwissen: topicFw,
    dedupeKey: `${keyPrefix}:${it.q.slice(0, 48)}`,
    contentIds: [`${keyPrefix}:${it.q.slice(0, 48)}`],
  })
}

function causePairs(
  rng: Rng,
  opts: {
    question: string
    pairs: Array<{ cause: string; effect: string }>
    distractorEffects: string[]
    explanation: string
    fachwissen: ReturnType<typeof geFw>
    dedupeKey: string
  },
) {
  const left = opts.pairs.map((p, i) => ({ id: `c${i}`, label: p.cause }))
  const rightCore = opts.pairs.map((p, i) => ({ id: `e${i}`, label: p.effect }))
  const distractors = opts.distractorEffects.map((label, i) => ({ id: `xd${i}`, label }))
  const right = shuffle(rng, [...rightCore, ...distractors])
  const correctLinks: Record<string, string> = {}
  opts.pairs.forEach((_, i) => {
    correctLinks[`c${i}`] = `e${i}`
  })
  // Lösung = echte Zuordnungen (nicht nur ein Merksatz).
  const solution = opts.pairs.map((p) => `${p.cause} → ${p.effect}`).join('; ')
  return causeEffectTask({
    question: opts.question,
    left,
    right,
    correctLinks,
    solution,
    explanation: opts.explanation,
    fachwissen: opts.fachwissen,
    dedupeKey: opts.dedupeKey,
    contentIds: [opts.dedupeKey],
  })
}

const pick = <T,>(rng: Rng, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)]!

// ─── Archäologie Sachsen ─────────────────────────────────────────────────────

function archaeoMc(rng: Rng) {
  const items = [
    {
      q: 'Womit arbeitet Archäologie besonders?',
      correct: 'Mit materiellen Funden und Grabungen',
      wrong: [
        'Nur mit heutigen Instantnachrichten',
        'Nur mit Wetterkarten ohne Funde',
        'Nur mit Sportregeln der Gegenwart',
      ],
    },
    {
      q: 'Warum ist der Fundkontext wichtig?',
      correct: 'Lage und Begleitfunde helfen bei der Einordnung',
      wrong: [
        'Weil Funde ohne Kontext wertvoller sind',
        'Weil Schichten keine Rolle spielen',
        'Weil Archäologie keine Datierung kennt',
      ],
    },
    {
      q: 'Was meint Regionalgeschichte bei Funden in Sachsen?',
      correct: 'Örtliche Funde in größere Epochen einordnen',
      wrong: [
        'Nur Weltgeschichte ohne Ortsbezug',
        'Nur Märchen ohne Belege',
        'Nur moderne Stadtpläne ohne Vergangenheit',
      ],
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: 'Materielle Quellen und Kontext erschließen Vergangenheit.',
    fachwissen: TOPIC_FW.archaeo,
    dedupeKey: `ge:k5:archaeo:mc:${it.q.slice(0, 40)}`,
    contentIds: [`ge:k5:archaeo:mc:${it.q.slice(0, 40)}`],
  })
}

function archaeoMatch(rng: Rng) {
  const terms = ['Grabung', 'Fundkontext', 'Steinzeitfund']
  const meanings = [
    'Systematisches Freilegen von Schichten',
    'Lage und Begleitfunde eines Objekts',
    'Werkzeug aus vorgeschichtlicher Zeit',
  ]
  return matchTermsTask(rng, {
    question: 'Was gehört zusammen?',
    terms,
    meanings,
    distractor: 'Nur eine heutige Werbeanzeige',
    solution: terms.map((t, i) => `${t} → ${meanings[i]}`).join('; '),
    explanation: 'Begriffe der archäologischen Arbeit sauber trennen.',
    fachwissen: TOPIC_FW.archaeo,
    dedupeKey: 'ge:k5:archaeo:match',
    contentIds: ['ge:k5:archaeo:match'],
  })
}

function archaeoClassify(rng: Rng) {
  const pairs = [
    { a: 'Keramikscherbe in Schicht', b: 'Materielle Quelle' },
    { a: 'Heutiges Schulbuch über Steinzeit', b: 'Sekundärdarstellung' },
    { a: 'Grabungsfoto mit Maßstab', b: 'Dokumentation des Fundorts' },
  ]
  return classifySlotsTask(rng, {
    question: 'Ordne zu: Was beschreibt die Quelle / den Umgang?',
    slotLabels: pairs.map((p) => p.a),
    itemLabels: pairs.map((p) => p.b),
    correctSlots: [0, 1, 2],
    distractors: ['Nur ein Computerspiel ohne Bezug'],
    solution: pairs.map((p) => `${p.a} → ${p.b}`).join('; '),
    explanation: 'Quellenarten und Dokumentation unterscheiden.',
    fachwissen: TOPIC_FW.archaeo,
  })
}

function archaeoCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Folge in der Archäologie.',
    pairs: [
      { cause: 'Schichten sorgfältig getrennt', effect: 'Datierung wird zuverlässiger' },
      { cause: 'Fund ohne Lageangabe', effect: 'Einordnung wird schwieriger' },
      { cause: 'Regionale Funde verglichen', effect: 'Verbindungen zu Epochen werden sichtbar' },
    ],
    distractorEffects: ['Wettervorhersage wird genauer'],
    explanation: 'Methode und Dokumentation bestimmen die Aussagekraft.',
    fachwissen: TOPIC_FW.archaeo,
    dedupeKey: 'ge:k5:archaeo:cause',
  })
}

function archaeoTf(rng: Rng) {
  return trueFalse(rng, {
    statement: 'Ein einzelner schöner Fund ohne Fundort reicht für sichere Datierung völlig aus.',
    correct: false,
    explanation: 'Ohne Kontext fehlt oft die sichere zeitliche und räumliche Einordnung.',
    fachwissen: TOPIC_FW.archaeo,
    dedupeKey: 'ge:k5:archaeo:tf',
    contentIds: ['ge:k5:archaeo:tf'],
  })
}

function archaeoKnow(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Warum eignen sich Steinwerkzeuge für die Vorgeschichte?',
        correct: 'Weil sie materiell erhalten bleiben und Technik zeigen',
        wrong: [
          'Weil sie immer mit Datumsstempel versehen sind',
          'Weil sie nur in Museen erfunden wurden',
          'Weil sie gar keine Informationen liefern',
        ],
      },
      {
        q: 'Was leistet eine Grabungsdokumentation?',
        correct: 'Sie hält Fundlage und Beobachtungen nachvollziehbar fest',
        wrong: [
          'Sie ersetzt jede weitere Forschung dauerhaft',
          'Sie löscht bewusst alle Schichten',
          'Sie dient nur der Unterhaltung ohne Wissenschaft',
        ],
      },
    ],
    'ge:k5:archaeo:know',
    TOPIC_FW.archaeo,
  )
}

export const geArchaologieSachsen: Topic['generate'] = mixedVariants(
  archaeoMc,
  archaeoMatch,
  archaeoClassify,
  archaeoCause,
  archaeoTf,
  archaeoKnow,
)

// ─── Entwicklungsstufen zum Jetztmenschen ────────────────────────────────────

function jetztMc(rng: Rng) {
  const items = [
    {
      q: 'Zu welcher Art gehört der heutige Mensch?',
      correct: 'Homo sapiens',
      wrong: ['Nur Dinosaurier', 'Nur Fische ohne Wirbelsäule', 'Nur Roboterarten'],
    },
    {
      q: 'Was kennzeichnet die Jungsteinzeit besonders?',
      correct: 'Ackerbau, Viehzucht und sesshafteres Leben',
      wrong: [
        'Nur Raumfahrttechnik',
        'Ausschließlich Jagd ohne jegliche Technik',
        'Nur Buchdruck mit Metalltypen',
      ],
    },
    {
      q: 'Wozu dienen Steinwerkzeuge als Quelle?',
      correct: 'Sie zeigen Technik und Lebensweise früher Menschen',
      wrong: [
        'Sie beweisen immer exakte Geburtsdaten',
        'Sie ersetzen jede Frage nach Ernährung',
        'Sie sind nur moderne Fälschungen',
      ],
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: 'Art, Technik und Lebensweise gehören zusammen.',
    fachwissen: TOPIC_FW.jetztmensch,
    dedupeKey: `ge:k5:jetzt:mc:${it.q.slice(0, 40)}`,
    contentIds: [`ge:k5:jetzt:mc:${it.q.slice(0, 40)}`],
  })
}

function jetztSort(rng: Rng) {
  const labels = [
    'Frühe Menschenformen mit einfachen Steinwerkzeugen',
    'Ausbreitung von Homo sapiens',
    'Übergang zu Ackerbau und Viehzucht (Jungsteinzeit)',
  ]
  return sortChronologyTask(rng, {
    question: 'Ordne grob von früher nach später (Schulüberblick).',
    labels,
    solution: labels.join(' → '),
    explanation: 'Grobe Abfolge für die Orientierung — ohne Detailstreit.',
    fachwissen: TOPIC_FW.jetztmensch,
    dedupeKey: 'ge:k5:jetzt:sort',
  })
}

function jetztMatch(rng: Rng) {
  const terms = ['Homo sapiens', 'Altsteinzeit', 'Jungsteinzeit']
  const meanings = [
    'Art des heutigen Menschen',
    'Lange Phase mit Jagd/Sammeln und Steinwerkzeugen',
    'Phase mit Ackerbau und Sesshaftigkeit',
  ]
  return matchTermsTask(rng, {
    question: 'Begriff und Bedeutung.',
    terms,
    meanings,
    distractor: 'Nur ein modernes Smartphone-Modell',
    solution: terms.map((t, i) => `${t} → ${meanings[i]}`).join('; '),
    explanation: 'Fachbegriffe der Menschheitsgeschichte in K5.',
    fachwissen: TOPIC_FW.jetztmensch,
    dedupeKey: 'ge:k5:jetzt:match',
    contentIds: ['ge:k5:jetzt:match'],
  })
}

function jetztCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Folge beim Übergang zur Sesshaftigkeit.',
    pairs: [
      { cause: 'Ackerbau und Viehzucht', effect: 'Festere Siedlungen werden möglich' },
      { cause: 'Vorratshaltung von Getreide', effect: 'Größere Gruppen können sich ernähren' },
      { cause: 'Polierte Steinbeile', effect: 'Rodung und Holzbearbeitung erleichtern' },
    ],
    distractorEffects: ['Sofortige Industrialisierung mit Fabriken'],
    explanation: 'Jungsteinzeitliche Veränderungen greifen ineinander.',
    fachwissen: TOPIC_FW.jetztmensch,
    dedupeKey: 'ge:k5:jetzt:cause',
  })
}

function jetztMulti(rng: Rng) {
  const correct = ['Ackerbau', 'Viehzucht', 'Sesshafteres Dorfleben']
  return multiSelectTask({
    question: 'Was gehört typisch zur Jungsteinzeit? (mehrere richtig)',
    choices: shuffle(rng, [...correct, 'Raumflug zum Mond']),
    correct,
    solution: correct.join('; '),
    explanation: 'Technik und Wirtschaft der Jungsteinzeit — ohne Moderne.',
    fachwissen: TOPIC_FW.jetztmensch,
    dedupeKey: 'ge:k5:jetzt:multi',
    contentIds: ['ge:k5:jetzt:multi'],
  })
}

export const geJetztmensch: Topic['generate'] = mixedVariants(
  jetztMc,
  jetztSort,
  jetztMatch,
  jetztCause,
  jetztMulti,
)

// ─── Ägypten: Gesellschaftspyramide ──────────────────────────────────────────

function pyramideMc(rng: Rng) {
  const items = [
    {
      q: 'Warum spricht man von einer Gesellschafts-„Pyramide“?',
      correct: 'Weil oben wenige und unten viele Menschen stehen',
      wrong: [
        'Weil alle Ägypter gleich viel Macht hatten',
        'Weil es keine Bauern gab',
        'Weil Pyramiden nur Sportgeräte waren',
      ],
    },
    {
      q: 'Wozu brauchte der Pharao Schreiber?',
      correct: 'Zur Verwaltung, Steuer und Aufzeichnung',
      wrong: [
        'Nur zum Fußballspielen',
        'Weil niemand in Ägypten jemals zählte',
        'Nur zur Abschaffung jeder Schrift',
      ],
    },
    {
      q: 'Was waren Hieroglyphen vor allem?',
      correct: 'Eine Schrift, die vor allem Gebildete beherrschten',
      wrong: [
        'Nur moderne Emojis ohne Bedeutung',
        'Ein Ersatz für den Nil',
        'Ein Verbot jeder Verwaltung',
      ],
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: 'Herrschaft, Verwaltung und Schrift hängen zusammen.',
    fachwissen: TOPIC_FW.pyramide,
    dedupeKey: `ge:k5:pyramide:mc:${it.q.slice(0, 40)}`,
    contentIds: [`ge:k5:pyramide:mc:${it.q.slice(0, 40)}`],
  })
}

function pyramideMatch(rng: Rng) {
  const terms = ['Pharao', 'Schreiber', 'Bauer']
  const meanings = [
    'Oberste Herrschaft und Kult',
    'Schrift und Verwaltung',
    'Felder bestellen, Abgaben liefern',
  ]
  return matchTermsTask(rng, {
    question: 'Stand und typische Aufgabe.',
    terms,
    meanings,
    distractor: 'Nur ein heutiger Pilot ohne Bezug',
    solution: terms.map((t, i) => `${t} → ${meanings[i]}`).join('; '),
    explanation: 'Rollen in der Gesellschaftspyramide.',
    fachwissen: TOPIC_FW.pyramide,
    dedupeKey: 'ge:k5:pyramide:match',
    contentIds: ['ge:k5:pyramide:match'],
  })
}

function pyramideCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Folge in Ägypten.',
    pairs: [
      { cause: 'Schriftliche Verwaltung', effect: 'Abgaben und Vorräte lassen sich erfassen' },
      { cause: 'Nilüberschwemmung', effect: 'Fruchtbarer Boden für Getreide' },
      { cause: 'Viele Bauern an der Basis', effect: 'Versorgung der oberen Stände möglich' },
    ],
    distractorEffects: ['Sofortige Demokratie wie im 21. Jahrhundert'],
    explanation: 'Hochkultur braucht Ressourcen und Organisation.',
    fachwissen: TOPIC_FW.pyramide,
    dedupeKey: 'ge:k5:pyramide:cause',
  })
}

function pyramideClassify(rng: Rng) {
  const pairs = [
    { a: 'Pharao', b: 'Spitze der Pyramide' },
    { a: 'Bauern und Unfreie', b: 'Breite Basis' },
    { a: 'Hieroglyphen', b: 'Schrift der Verwaltung und Tempel' },
  ]
  return classifySlotsTask(rng, {
    question: 'Ordne Begriff und Einordnung zu.',
    slotLabels: pairs.map((p) => p.a),
    itemLabels: pairs.map((p) => p.b),
    correctSlots: [0, 1, 2],
    distractors: ['Nur ein mittelalterlicher Ritterorden'],
    solution: pairs.map((p) => `${p.a} → ${p.b}`).join('; '),
    explanation: 'Struktur und Schriftlichkeit der Hochkultur.',
    fachwissen: TOPIC_FW.pyramide,
  })
}

export const geGesellschaftspyramide: Topic['generate'] = mixedVariants(
  pyramideMc,
  pyramideMatch,
  pyramideCause,
  pyramideClassify,
)

// ─── Griechische Polis ───────────────────────────────────────────────────────

function polisLabel(rng: Rng) {
  const slots = [...POLIS_DIAGRAM.slots]
  const distractors = shuffle(rng, ['Agora', 'Areopag', 'Pnyx']).slice(0, 2)
  return imageLabelSlotsTask({
    question:
      'Ansicht von Athen: Ziehe zu den Feldern 1–4 die passenden Orte der Polis.',
    imageSrc: POLIS_DIAGRAM.imageSrc,
    imageAlt: POLIS_DIAGRAM.imageAlt,
    attribution: POLIS_DIAGRAM.attribution,
    drawLeaders: true,
    items: [...slots.map((s) => ({ label: s.label })), ...distractors.map((label) => ({ label }))],
    slots: slots.map(({ id, x, y, targetX, targetY }) => ({ id, x, y, targetX, targetY })),
    correctSlots: [0, 1, 2, 3],
    solution: slots.map((s, i) => `${i + 1} ${s.label}`).join('; '),
    explanation: 'Akropolis, Tempel und Unterstadt bilden die sichtbare Struktur der Polis.',
    fachwissen: TOPIC_FW.polis,
    dedupeKey: 'ge:k5:polis:label',
    contentIds: ['ge:k5:polis:label'],
    rng,
  })
}

function polisMc(rng: Rng) {
  const items = [
    {
      q: 'Was war eine Polis?',
      correct: 'Ein griechischer Stadtstaat mit Stadt und Umland',
      wrong: [
        'Ein einziges Weltreich ohne Städte',
        'Nur ein einzelner Tempel ohne Bewohner',
        'Ein modernes Bundesland Deutschlands',
      ],
    },
    {
      q: 'Wozu diente die Agora?',
      correct: 'Als Markt- und Versammlungsplatz',
      wrong: [
        'Ausschließlich als unterirdisches Bergwerk',
        'Nur als königlicher Schlafsaal',
        'Nur als römisches Kolosseum',
      ],
    },
    {
      q: 'Was war die Akropolis typischerweise?',
      correct: 'Ein Burgberg mit Heiligtümern',
      wrong: [
        'Ein reiner Getreidespeicher im Flachland',
        'Ein Hafen ohne Tempel',
        'Ein modernes Rathaus aus Glas',
      ],
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: 'Aufbau und Selbstverständnis der Polis.',
    fachwissen: TOPIC_FW.polis,
    dedupeKey: `ge:k5:polis:mc:${it.q.slice(0, 40)}`,
    contentIds: [`ge:k5:polis:mc:${it.q.slice(0, 40)}`],
  })
}

function polisMatch(rng: Rng) {
  const terms = ['Agora', 'Akropolis', 'Umland']
  const meanings = [
    'Markt und politische Versammlung',
    'Burgberg mit Tempeln / Schutz',
    'Felder und Dörfer zur Versorgung',
  ]
  return matchTermsTask(rng, {
    question: 'Ort und Funktion in der Polis.',
    terms,
    meanings,
    distractor: 'Nur ein mittelalterlicher Domplatz in Köln',
    solution: terms.map((t, i) => `${t} → ${meanings[i]}`).join('; '),
    explanation: 'Typische Elemente des Polis-Aufbaus.',
    fachwissen: TOPIC_FW.polis,
    dedupeKey: 'ge:k5:polis:match',
    contentIds: ['ge:k5:polis:match'],
  })
}

function polisCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Folge rund um die Polis.',
    pairs: [
      { cause: 'Gebirgiges Land und Inseln', effect: 'Viele kleine Stadtstaaten statt eines Großreichs' },
      { cause: 'Eigenes Umland und eigene Regeln', effect: 'Starke Zugehörigkeit zur eigenen Polis' },
      { cause: 'Hafen und Handel', effect: 'Kontakt und Austausch mit anderen Orten' },
    ],
    distractorEffects: ['Sofortige Einigung zu einem modernen Nationalstaat'],
    explanation: 'Warum Griechenland viele Poleis kannte.',
    fachwissen: TOPIC_FW.polis,
    dedupeKey: 'ge:k5:polis:cause',
  })
}

function polisTf(rng: Rng) {
  return trueFalse(rng, {
    statement: 'Alle Bewohner einer Polis hatten dieselben politischen Rechte.',
    correct: false,
    explanation: 'Nur Bürger (meist erwachsene Männer mit Bürgerrecht) bestimmten mit.',
    fachwissen: TOPIC_FW.polis,
    dedupeKey: 'ge:k5:polis:tf',
    contentIds: ['ge:k5:polis:tf'],
  })
}

function polisKnow(rng: Rng) {
  return knowledgeMc(
    rng,
    [
      {
        q: 'Woraus leitet sich das Wort „Politik“ ab?',
        correct: 'Vom griechischen Wort Polis',
        wrong: [
          'Vom lateinischen Wort für Pyramide',
          'Vom deutschen Wort für Polizei allein',
          'Vom Namen eines modernen Computers',
        ],
      },
      {
        q: 'Was gehörte oft zur Polis außer der Stadt selbst?',
        correct: 'Umland mit Feldern und manchmal ein Hafen',
        wrong: [
          'Nur eine Wüste ohne Siedlung',
          'Nur ein einzelnes Zeltlager ohne Regeln',
          'Nur eine Fabrikhalle',
        ],
      },
    ],
    'ge:k5:polis:know',
    TOPIC_FW.polis,
  )
}

export const gePolis: Topic['generate'] = mixedVariants(
  polisLabel,
  polisMc,
  polisMatch,
  polisCause,
  polisTf,
  polisKnow,
)

// ─── Gruppen ohne Mitbestimmung ──────────────────────────────────────────────

function ohneMc(rng: Rng) {
  const items = [
    {
      q: 'Wer durfte in der attischen Demokratie typischerweise mitbestimmen?',
      correct: 'Volljährige männliche Bürger',
      wrong: [
        'Alle Einwohner einschließlich Sklaven',
        'Nur Frauen ohne Ausnahme',
        'Nur Kinder unter zehn Jahren',
      ],
    },
    {
      q: 'Wer waren Metöken?',
      correct: 'Zugewanderte Freie ohne Bürgerrecht',
      wrong: [
        'Nur die Könige Spartas',
        'Nur die Götter auf dem Olymp',
        'Nur römische Legionäre',
      ],
    },
    {
      q: 'Warum ist „Demokratie“ in Athen nicht „alle Menschen“?',
      correct: 'Weil große Gruppen ausgeschlossen blieben',
      wrong: [
        'Weil es gar keine Volksversammlung gab',
        'Weil niemand jemals abstimmte',
        'Weil Athen keine Polis war',
      ],
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: 'Bürgerrecht und Ausschluss gehören zusammen gedacht.',
    fachwissen: TOPIC_FW.ohne,
    dedupeKey: `ge:k5:ohne:mc:${it.q.slice(0, 40)}`,
    contentIds: [`ge:k5:ohne:mc:${it.q.slice(0, 40)}`],
  })
}

function ohneClassify(rng: Rng) {
  const pairs = [
    { a: 'Männlicher Vollbürger', b: 'Darf in der Volksversammlung mitstimmen' },
    { a: 'Frau in Athen', b: 'Lebt in der Polis, ohne politisches Stimmrecht' },
    { a: 'Sklave', b: 'Unfrei, keine politischen Rechte' },
    { a: 'Metöke', b: 'Frei, aber ohne Bürgerrecht' },
  ]
  const three = shuffle(rng, pairs).slice(0, 3)
  return classifySlotsTask(rng, {
    question: 'Ordne Gruppe und politische Lage zu.',
    slotLabels: three.map((p) => p.a),
    itemLabels: three.map((p) => p.b),
    correctSlots: [0, 1, 2],
    distractors: ['Hat allein die Weltherrschaft inne'],
    solution: three.map((p) => `${p.a} → ${p.b}`).join('; '),
    explanation: 'Mitbestimmung war an das Bürgerrecht gebunden.',
    fachwissen: TOPIC_FW.ohne,
  })
}

function ohneMatch(rng: Rng) {
  const terms = ['Bürger', 'Metöken', 'Sklaven']
  const meanings = [
    'Politisch berechtigte Vollmitglieder',
    'Zugewanderte ohne Bürgerrecht',
    'Unfreie ohne politische Rechte',
  ]
  return matchTermsTask(rng, {
    question: 'Gruppe und Kurzbeschreibung.',
    terms,
    meanings,
    distractor: 'Nur moderne Parteivorsitzende',
    solution: terms.map((t, i) => `${t} → ${meanings[i]}`).join('; '),
    explanation: 'Zentrale Gruppen der attischen Gesellschaft.',
    fachwissen: TOPIC_FW.ohne,
    dedupeKey: 'ge:k5:ohne:match',
    contentIds: ['ge:k5:ohne:match'],
  })
}

function ohneMulti(rng: Rng) {
  const correct = ['Frauen', 'Metöken', 'Sklaven']
  return multiSelectTask({
    question: 'Welche Gruppen hatten in Athen typisch keine politische Mitbestimmung?',
    choices: shuffle(rng, [...correct, 'Männliche Vollbürger']),
    correct,
    solution: correct.join('; '),
    explanation: 'Nur männliche Bürger mit Bürgerrecht bestimmten mit.',
    fachwissen: TOPIC_FW.ohne,
    dedupeKey: 'ge:k5:ohne:multi',
    contentIds: ['ge:k5:ohne:multi'],
  })
}

function ohneCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Folge bei politischer Teilhabe.',
    pairs: [
      { cause: 'Kein Bürgerrecht', effect: 'Keine Stimme in der Volksversammlung' },
      { cause: 'Unfreiheit (Sklaverei)', effect: 'Körperliche und rechtliche Abhängigkeit' },
      { cause: 'Bürgerrecht männlicher Athener', effect: 'Teilnahme an Abstimmungen möglich' },
    ],
    distractorEffects: ['Automatisches Wahlrecht für alle Kinder weltweit'],
    explanation: 'Attische Demokratie war begrenzt.',
    fachwissen: TOPIC_FW.ohne,
    dedupeKey: 'ge:k5:ohne:cause',
  })
}

export const geOhneMitbestimmung: Topic['generate'] = mixedVariants(
  ohneMc,
  ohneClassify,
  ohneMatch,
  ohneMulti,
  ohneCause,
)

// ─── Ressourcen: Wasser, Boden, Ernährung ────────────────────────────────────

function resMc(rng: Rng) {
  const items = [
    {
      q: 'Warum war der Nil für Ägypten zentral?',
      correct: 'Weil Überschwemmung fruchtbaren Boden und Wasser brachte',
      wrong: [
        'Weil er nur aus Salz ohne Nutzen bestand',
        'Weil Ägypten gar keinen Fluss brauchte',
        'Weil er nur im Winter gefror und Schiffahrt verhinderte',
      ],
    },
    {
      q: 'Was sind grundlegende Ressourcen früher Gesellschaften?',
      correct: 'Wasser, Boden und Nahrung',
      wrong: [
        'Nur Smartphones und Internet',
        'Nur moderne Börsenkurse',
        'Nur Raumstationen',
      ],
    },
    {
      q: 'Wozu dient Bewässerung?',
      correct: 'Felder gezielt mit Wasser zu versorgen',
      wrong: [
        'Nur Tempel zu zerstören',
        'Nur Schrift zu verbieten',
        'Nur Städte ohne Nahrung zu bauen',
      ],
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: 'Ressourcen bestimmen Siedlung und Wirtschaft.',
    fachwissen: TOPIC_FW.ressourcen,
    dedupeKey: `ge:k5:res:mc:${it.q.slice(0, 40)}`,
    contentIds: [`ge:k5:res:mc:${it.q.slice(0, 40)}`],
  })
}

function resMatch(rng: Rng) {
  const terms = ['Wasser', 'Fruchtbarer Boden', 'Getreidevorrat']
  const meanings = [
    'Trinken, Bewässern, Transport',
    'Anbau von Nahrungspflanzen',
    'Ernährung und Absicherung bei Knappheit',
  ]
  return matchTermsTask(rng, {
    question: 'Ressource und Nutzen.',
    terms,
    meanings,
    distractor: 'Nur ein modernes Videospiel',
    solution: terms.map((t, i) => `${t} → ${meanings[i]}`).join('; '),
    explanation: 'Grundressourcen früher Kulturen.',
    fachwissen: TOPIC_FW.ressourcen,
    dedupeKey: 'ge:k5:res:match',
    contentIds: ['ge:k5:res:match'],
  })
}

function resCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Folge bei Ressourcen.',
    pairs: [
      { cause: 'Regelmäßige Überschwemmung', effect: 'Nährstoffreicher Boden' },
      { cause: 'Dürre oder Wassermangel', effect: 'Ernten und Siedlungen geraten in Gefahr' },
      { cause: 'Vorratshaltung', effect: 'Gruppen überstehen knappe Zeiten besser' },
    ],
    distractorEffects: ['Sofortige Abschaffung jeder Landwirtschaft'],
    explanation: 'Ressourcenkrisen und Technik gehören zum Längsschnitt.',
    fachwissen: TOPIC_FW.ressourcen,
    dedupeKey: 'ge:k5:res:cause',
  })
}

function resClassify(rng: Rng) {
  const pairs = [
    { a: 'Nilüberschwemmung', b: 'Natürliche Fruchtbarkeit nutzen' },
    { a: 'Bewässerungskanal', b: 'Technik zur Wasserverteilung' },
    { a: 'Getreidespeicher', b: 'Vorräte sichern' },
  ]
  return classifySlotsTask(rng, {
    question: 'Ordne Maßnahme / Vorgang und Zweck zu.',
    slotLabels: pairs.map((p) => p.a),
    itemLabels: pairs.map((p) => p.b),
    correctSlots: [0, 1, 2],
    distractors: ['Nur Unterhaltung ohne Versorgung'],
    solution: pairs.map((p) => `${p.a} → ${p.b}`).join('; '),
    explanation: 'Ressourcenmanagement in frühen Gesellschaften.',
    fachwissen: TOPIC_FW.ressourcen,
  })
}

function resTf(rng: Rng) {
  return trueFalse(rng, {
    statement: 'Frühe Hochkulturen waren unabhängig von Wasser und Boden.',
    correct: false,
    explanation: 'Ohne Wasser und fruchtbaren Boden keine stabile Ernährung.',
    fachwissen: TOPIC_FW.ressourcen,
    dedupeKey: 'ge:k5:res:tf',
    contentIds: ['ge:k5:res:tf'],
  })
}

export const geRessourcen: Topic['generate'] = mixedVariants(
  resMc,
  resMatch,
  resCause,
  resClassify,
  resTf,
)

// ─── Landschaftswandel: Rodung und Nutzung ───────────────────────────────────

function landMc(rng: Rng) {
  const items = [
    {
      q: 'Was bedeutet Rodung?',
      correct: 'Wald entfernen, um Fläche zu nutzen',
      wrong: [
        'Nur Tempel bauen ohne Flächenbedarf',
        'Nur Flüsse umleiten ohne Grund',
        'Nur Schrift erfinden',
      ],
    },
    {
      q: 'Was kann nach starker Rodung am Hang folgen?',
      correct: 'Erosion — Boden wird leichter abgetragen',
      wrong: [
        'Sofort mehr Urwald ohne Nutzung',
        'Automatisch mehr Pyramiden',
        'Gar keine Veränderung der Landschaft',
      ],
    },
    {
      q: 'Wie beeinflusst Technik die Landschaft?',
      correct: 'Werkzeuge und Methoden beschleunigen Nutzung und Veränderung',
      wrong: [
        'Technik hat nie etwas an der Umwelt geändert',
        'Technik verhindert jede Rodung dauerhaft',
        'Technik ersetzt Wasser vollständig',
      ],
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.correct, ...it.wrong], it.correct),
    correct: it.correct,
    solution: it.correct,
    explanation: 'Menschliche Nutzung formt Landschaften.',
    fachwissen: TOPIC_FW.landschaft,
    dedupeKey: `ge:k5:land:mc:${it.q.slice(0, 40)}`,
    contentIds: [`ge:k5:land:mc:${it.q.slice(0, 40)}`],
  })
}

function landSort(rng: Rng) {
  const labels = [
    'Waldfläche wird gerodet',
    'Acker oder Weide entsteht',
    'Bei Hanglage droht Erosion',
  ]
  return sortChronologyTask(rng, {
    question: 'Ordne einen typischen Ablauf (Ursachekette).',
    labels,
    solution: labels.join(' → '),
    explanation: 'Nutzungsschritte und mögliche Folgen.',
    fachwissen: TOPIC_FW.landschaft,
    dedupeKey: 'ge:k5:land:sort',
  })
}

function landCause(rng: Rng) {
  return causePairs(rng, {
    question: 'Ursache und Folge beim Landschaftswandel.',
    pairs: [
      { cause: 'Rodung für Ackerland', effect: 'Offene Fläche statt Wald' },
      { cause: 'Fehlender Bewuchs am Hang', effect: 'Bodenabtrag durch Regen steigt' },
      { cause: 'Bessere Werkzeuge', effect: 'Größere Flächen lassen sich erschließen' },
    ],
    distractorEffects: ['Sofortige Rückkehr aller Dinosaurier'],
    explanation: 'Längsschnitt Mensch–Natur.',
    fachwissen: TOPIC_FW.landschaft,
    dedupeKey: 'ge:k5:land:cause',
  })
}

function landMatch(rng: Rng) {
  const terms = ['Rodung', 'Erosion', 'Nutzung']
  const meanings = [
    'Wald entfernen',
    'Abtrag von Boden',
    'Fläche für Ackerbau, Weide oder Siedlung',
  ]
  return matchTermsTask(rng, {
    question: 'Begriff und Bedeutung.',
    terms,
    meanings,
    distractor: 'Nur ein modernes Verkehrszeichen',
    solution: terms.map((t, i) => `${t} → ${meanings[i]}`).join('; '),
    explanation: 'Grundbegriffe des Landschaftswandels.',
    fachwissen: TOPIC_FW.landschaft,
    dedupeKey: 'ge:k5:land:match',
    contentIds: ['ge:k5:land:match'],
  })
}

function landMulti(rng: Rng) {
  const correct = [
    'Mehr offene Ackerfläche',
    'Höheres Erosionsrisiko am Hang',
    'Verlust von Waldlebensraum',
  ]
  return multiSelectTask({
    question: 'Welche Folgen kann Rodung haben?',
    choices: shuffle(rng, [...correct, 'Sofortige Mondlandung']),
    correct,
    solution: correct.join('; '),
    explanation: 'Chancen der Nutzung und Risiken für den Boden.',
    fachwissen: TOPIC_FW.landschaft,
    dedupeKey: 'ge:k5:land:multi',
    contentIds: ['ge:k5:land:multi'],
  })
}

export const geLandschaft: Topic['generate'] = mixedVariants(
  landMc,
  landSort,
  landCause,
  landMatch,
  landMulti,
)

/** Registry — wiring in geschichteGenerators. */
export const GESCHICHTE_K5_NEU_TOPIC_GENERATORS: Record<string, Topic['generate']> = {
  'ge-k5-lb1-archaologie-sachsen': geArchaologieSachsen,
  'ge-k5-lb2-jetztmensch': geJetztmensch,
  'ge-k5-lb2-gesellschaftspyramide': geGesellschaftspyramide,
  'ge-k5-lb3-polis': gePolis,
  'ge-k5-lb3-ohne-mitbestimmung': geOhneMitbestimmung,
  'ge-k5-lb4-ressourcen': geRessourcen,
  'ge-k5-lb4-landschaft': geLandschaft,
}
