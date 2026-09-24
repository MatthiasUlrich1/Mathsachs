/**
 * Biologie Klasse 5 — Wirbeltiere (Lehrplan Gym Sachsen, lplanid=522).
 * Originalaufgaben; Interaktionsmuster an typische Schulquiz-Formate angelehnt
 * (MC, Richtig/Falsch, Mehrfachauswahl, Zuordnung, Sortieren, Klassifikation).
 * Spoiler: Merkhilfen stehen erst in der Erklärung nach dem Prüfen.
 */
import type { Rng } from '../lib/rng'
import {
  choicePickTask,
  dragDropSlotsTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
} from './taskHelpers'
import type { Fachwissen, Topic } from './types'

const pick = <T,>(rng: Rng, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)]!

const shuffle = <T,>(rng: Rng, arr: readonly T[]): T[] => {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const shuffleChoices = (rng: Rng, choices: string[], correct: string): string[] => {
  const rest = choices.filter((c) => c !== correct)
  return shuffle(rng, [correct, ...rest])
}

const BIO_QUELLE: Pick<Fachwissen, 'quelle' | 'url'> = {
  quelle: 'Wikipedia: Wirbeltiere',
  url: 'https://de.wikipedia.org/wiki/Wirbeltiere',
}

const fw = (text: string): Fachwissen => ({ text, ...BIO_QUELLE })

const trueFalse = (
  rng: Rng,
  opts: {
    statement: string
    correct: boolean
    explanation: string
    fachwissen: Fachwissen
    dedupeKey?: string
  },
) => {
  const correctLabel = opts.correct ? 'Richtig' : 'Falsch'
  return choicePickTask({
    question: `Stimmt die Aussage?\n\n„${opts.statement}“`,
    choices: shuffleChoices(rng, ['Richtig', 'Falsch'], correctLabel),
    correct: correctLabel,
    solution: correctLabel,
    explanation: opts.explanation,
    instruction: 'Richtig oder falsch?',
    fachwissen: opts.fachwissen,
    ...(opts.dedupeKey ? { dedupeKey: opts.dedupeKey } : {}),
  })
}

/** Zuordnung: Merkmale/Arten → Gruppen (Klassifikations-Slots). */
function classifySlotsTask(
  rng: Rng,
  opts: {
    question: string
    slotLabels: string[]
    itemLabels: string[]
    correctSlots: number[]
    distractors?: string[]
    solution: string
    explanation: string
    fachwissen: Fachwissen
    instruction?: string
  },
) {
  const distractors = opts.distractors ?? []
  const items = [
    ...opts.itemLabels.map((label, value) => ({ label, value })),
    ...distractors.map((label, i) => ({
      label,
      value: opts.itemLabels.length + i,
    })),
  ]
  return dragDropSlotsTask({
    question: opts.question,
    items,
    correctSlots: opts.correctSlots,
    slotLabels: opts.slotLabels,
    solution: opts.solution,
    explanation: opts.explanation,
    instruction:
      opts.instruction ??
      (distractors.length
        ? 'Ordne zu. Einen oder mehrere Blöcke brauchst du nicht.'
        : 'Ordne jeden Block dem passenden Fach zu.'),
    rng,
    fachwissen: opts.fachwissen,
  })
}

/** Merkmals-Zuordnung: Begriffe links, Erklärungen rechts. */
function matchTermsTask(
  rng: Rng,
  opts: {
    question: string
    terms: string[]
    meanings: string[]
    distractor: string
    solution: string
    explanation: string
    fachwissen: Fachwissen
  },
) {
  return classifySlotsTask(rng, {
    question: opts.question,
    slotLabels: opts.terms,
    itemLabels: opts.meanings,
    correctSlots: opts.meanings.map((_, i) => i),
    distractors: [opts.distractor],
    solution: opts.solution,
    explanation: opts.explanation,
    fachwissen: opts.fachwissen,
    instruction: 'Ziehe rechts die passende Erklärung zum Begriff links. Einen Block brauchst du nicht.',
  })
}

// ─── Shared vertebrate knowledge banks ───────────────────────────────────────

type GroupKey = 'fisch' | 'lurch' | 'kriechtier' | 'vogel' | 'saeuger'

const GROUP_LABEL: Record<GroupKey, string> = {
  fisch: 'Fische',
  lurch: 'Lurche',
  kriechtier: 'Kriechtiere',
  vogel: 'Vögel',
  saeuger: 'Säugetiere',
}

const SPECIES: { name: string; group: GroupKey; note: string }[] = [
  { name: 'Forelle', group: 'fisch', note: 'Süßwasserfisch mit Kiemen und Flossen' },
  { name: 'Hecht', group: 'fisch', note: 'Raubfisch in sächsischen Gewässern' },
  { name: 'Aal', group: 'fisch', note: 'Wanderfisch zwischen Süß- und Salzwasser' },
  { name: 'Erdkröte', group: 'lurch', note: 'Froschlurch; feuchte Haut, Metamorphose' },
  { name: 'Grasfrosch', group: 'lurch', note: 'Laicht im Frühjahr in Tümpeln' },
  { name: 'Feuersalamander', group: 'lurch', note: 'Schwanzlurch mit Warnfärbung' },
  { name: 'Zauneidechse', group: 'kriechtier', note: 'Heimisches Kriechtier; Hornschuppen' },
  { name: 'Ringelnatter', group: 'kriechtier', note: 'Ungiftige Schlange; Eiablage an Land' },
  { name: 'Blindschleiche', group: 'kriechtier', note: 'Beinlose Echse (kein Wurm!)' },
  { name: 'Amsel', group: 'vogel', note: 'Singvogel; Federkleid, gleichwarm' },
  { name: 'Kohlmeise', group: 'vogel', note: 'Häufiger Höhlenbrüter in Gärten' },
  { name: 'Rotmilan', group: 'vogel', note: 'Greifvogel; Schnabel an Beute angepasst' },
  { name: 'Reh', group: 'saeuger', note: 'Pflanzenfresser; Wiederkäuer-Gebiss' },
  { name: 'Fuchs', group: 'saeuger', note: 'Allesfresser; Fell, lebendgebärend' },
  { name: 'Maulwurf', group: 'saeuger', note: 'Grabende Gliedmaßen – Angepasstheit' },
  { name: 'Fledermaus', group: 'saeuger', note: 'Flughäute – Angepasstheit an Luftleben' },
]

const FEATURES: { text: string; group: GroupKey | 'alle' | 'keines'; wissen: string }[] = [
  {
    text: 'Atmung über Kiemen',
    group: 'fisch',
    wissen: 'Fische nehmen Sauerstoff aus dem Wasser über Kiemen auf — Angepasstheit an das Wasserleben.',
  },
  {
    text: 'Körper mit Flossen und oft Schleimhaut',
    group: 'fisch',
    wissen: 'Stromlinienform, Flossen und Schleimhaut verringern den Wasserwiderstand.',
  },
  {
    text: 'Äußere Befruchtung im Wasser (typisch)',
    group: 'fisch',
    wissen: 'Bei vielen Fischen werden Eier und Samen im Wasser abgegeben (äußere Befruchtung).',
  },
  {
    text: 'Feuchte, drüsenreiche Haut; Feuchtlufttier',
    group: 'lurch',
    wissen: 'Lurche atmen auch über die Haut; sie brauchen Feuchtigkeit und sind wechselwarm.',
  },
  {
    text: 'Metamorphose (z. B. Kaulquappe → Frosch)',
    group: 'lurch',
    wissen: 'Die Larve im Wasser (Kiemen) wird zum landlebenden Adulttier — typische Metamorphose.',
  },
  {
    text: 'Hornschicht oder Hornpanzer; Trockenlufttier',
    group: 'kriechtier',
    wissen: 'Kriechtiere sind an Landleben angepasst: trockene Haut mit Hornschicht, Lungenatmung.',
  },
  {
    text: 'Innere Befruchtung und Eiablage an Land (typisch)',
    group: 'kriechtier',
    wissen: 'Anders als Fische/Lurche: innere Befruchtung; Eier entwickeln sich ohne Wasserbad.',
  },
  {
    text: 'Federkleid und hohle Knochen',
    group: 'vogel',
    wissen: 'Federn und leichtes Skelett (u. a. hohle Knochen) unterstützen den Flug.',
  },
  {
    text: 'Lunge mit Luftsäcken',
    group: 'vogel',
    wissen: 'Luftsäcke verbessern den Gasaustausch beim energetisch aufwendigen Fliegen.',
  },
  {
    text: 'Fell; Nachkommen werden gesäugt',
    group: 'saeuger',
    wissen: 'Säugetiere: Haare/Fell, lebendgebärend (meist), Säugen — gleichwarme Körpertemperatur.',
  },
  {
    text: 'Gleichwarme Körpertemperatur und lebendgebärend (meist)',
    group: 'saeuger',
    wissen: 'Gleichwarm hält die Körpertemperatur weitgehend konstant; Jungtiere werden oft im Körper ausgetragen.',
  },
]

const LIFE_TRAITS = [
  {
    trait: 'Reizbarkeit',
    meaning: 'Lebewesen reagieren auf Reize aus der Umwelt',
    wissen: 'Reizbarkeit bedeutet: Sinneseindrücke lösen Reaktionen aus (z. B. Flucht, Zuwendung).',
  },
  {
    trait: 'Bewegung',
    meaning: 'Aktive Orts- oder Lageveränderung (auch Pflanzenbewegungen)',
    wissen: 'Bewegung gehört zu den Lebensmerkmalen — von Muskelbewegung bis Wachstumsbewegung.',
  },
  {
    trait: 'Fortpflanzung',
    meaning: 'Erzeugen von Nachkommen',
    wissen: 'Ohne Fortpflanzung gäbe es keine Weitergabe der Art — ein zentrales Merkmal des Lebens.',
  },
  {
    trait: 'Stoffwechsel',
    meaning: 'Aufnahme, Umbau und Abgabe von Stoffen und Energie',
    wissen: 'Ernährung, Atmung und Ausscheidung gehören zum Stoffwechsel.',
  },
  {
    trait: 'Wachstum und Entwicklung',
    meaning: 'Größenzunahme und Veränderung im Lebenslauf',
    wissen: 'Lebewesen wachsen und durchlaufen Entwicklungsstadien (Geburt/Keimung bis Tod).',
  },
]

const WINTER_STRATEGIES = [
  {
    name: 'Winterschlaf',
    meaning: 'Lange Starre mit stark gesenktem Stoffwechsel (z. B. Igel)',
    wissen: 'Beim Winterschlaf sinken Körpertemperatur und Stoffwechsel stark — Energiesparen.',
  },
  {
    name: 'Winterruhe',
    meaning: 'Ruhephasen mit geleglichem Aufwachen (z. B. Dachs, Bär)',
    wissen: 'Winterruhe: Tiere ruhen viel, wachen aber zwischendurch auf und können fressen.',
  },
  {
    name: 'Kältestarre',
    meaning: 'Wechselwarme Tiere erstarren bei Kälte (z. B. Lurche, Kriechtiere)',
    wissen: 'Wechselwarme Tiere können ihre Temperatur nicht halten — bei Frost erstarren sie.',
  },
  {
    name: 'Vogelzug',
    meaning: 'Saisonale Wanderung in wärmere Gebiete',
    wissen: 'Zugvögel weichen dem Nahrungsmangel im Winter durch Wanderung aus.',
  },
]

// ─── LB1 Merkmale des Lebens ─────────────────────────────────────────────────

function merkmaleMc(rng: Rng) {
  const trait = pick(rng, LIFE_TRAITS)
  const wrong = shuffle(
    rng,
    LIFE_TRAITS.filter((t) => t.trait !== trait.trait).map((t) => t.meaning),
  ).slice(0, 3)
  return choicePickTask({
    question: `Was bedeutet das Lebensmerkmal „${trait.trait}“?`,
    choices: shuffleChoices(rng, [trait.meaning, ...wrong], trait.meaning),
    correct: trait.meaning,
    solution: trait.meaning,
    explanation: trait.wissen,
    instruction: 'Wähle die passende Erklärung:',
    fachwissen: fw(trait.wissen),
    dedupeKey: `leben:${trait.trait}`,
  })
}

function merkmaleTrueFalse(rng: Rng) {
  const cases = [
    {
      statement: 'Ein Stein zeigt Stoffwechsel und Fortpflanzung.',
      correct: false,
      explanation: 'Steine sind unbelebt — sie haben keinen Stoffwechsel und keine Fortpflanzung.',
      wissen: 'Biologie untersucht Lebewesen. Unbelebte Objekte erfüllen die Lebensmerkmale nicht.',
    },
    {
      statement: 'Atmung und Ernährung gehören zum Stoffwechsel.',
      correct: true,
      explanation: 'Stoffwechsel umfasst Aufnahme, Umbau und Abgabe von Stoffen und Energie.',
      wissen: 'Stoffwechsel ist ein zentrales Merkmal des Lebens neben Bewegung, Reizbarkeit und Fortpflanzung.',
    },
    {
      statement: 'Nur Tiere bewegen sich — Pflanzen nie.',
      correct: false,
      explanation: 'Auch Pflanzen bewegen sich (z. B. Blätter zur Sonne, Ranker) — oft langsamer.',
      wissen: 'Bewegung als Lebensmerkmal gilt für Organismen allgemein, nicht nur für Tiere.',
    },
  ]
  const c = pick(rng, cases)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
  })
}

function merkmaleMatch(rng: Rng) {
  const three = shuffle(rng, LIFE_TRAITS).slice(0, 3)
  return matchTermsTask(rng, {
    question: 'Ordne jedem Lebensmerkmal die passende Erklärung zu.',
    terms: three.map((t) => t.trait),
    meanings: three.map((t) => t.meaning),
    distractor: 'Besteht nur aus Metall und Glas',
    solution: three.map((t) => `${t.trait} → ${t.meaning}`).join('; '),
    explanation: three.map((t) => t.wissen).join(' '),
    fachwissen: fw(
      'Merkmale des Lebens: Reizbarkeit, Bewegung, Fortpflanzung, Wachstum/Entwicklung, Stoffwechsel (Ernährung/Atmung).',
    ),
  })
}

function merkmaleMulti(rng: Rng) {
  const living = ['Reizbarkeit', 'Stoffwechsel', 'Fortpflanzung']
  const non = ['Rostbildung', 'Schmelzpunkt']
  const choices = shuffle(rng, [...living, ...non])
  return multiSelectTask({
    question: 'Welche Eigenschaften sind typische Merkmale des Lebens?',
    choices,
    correct: living,
    solution: living.join(', '),
    explanation: 'Rost und Schmelzpunkt beschreiben unbelebte Materie, nicht Lebensmerkmale.',
    instruction: 'Tippe alle zutreffenden Merkmale:',
    fachwissen: fw(
      'Unterscheide belebte und unbelebte Natur: Nur Lebewesen erfüllen die Merkmale des Lebens.',
    ),
  })
}

export const biMerkmale: Topic['generate'] = mixedVariants(
  merkmaleMc,
  merkmaleTrueFalse,
  merkmaleMatch,
  merkmaleMulti,
)

// ─── Per-group topic helpers ─────────────────────────────────────────────────

function groupFeatureMc(rng: Rng, group: GroupKey) {
  const pool = FEATURES.filter((f) => f.group === group)
  const feat = pick(rng, pool)
  const wrong = shuffle(
    rng,
    FEATURES.filter((f) => f.group !== group).map((f) => f.text),
  ).slice(0, 3)
  return choicePickTask({
    question: `Welches Merkmal passt besonders zu ${GROUP_LABEL[group]}?`,
    choices: shuffleChoices(rng, [feat.text, ...wrong], feat.text),
    correct: feat.text,
    solution: feat.text,
    explanation: feat.wissen,
    instruction: 'Wähle das passende Merkmal:',
    fachwissen: fw(feat.wissen),
    dedupeKey: `feat:${group}:${feat.text}`,
  })
}

function groupSpeciesMc(rng: Rng, group: GroupKey) {
  const species = SPECIES.filter((s) => s.group === group)
  const s = pick(rng, species)
  const wrong = shuffle(
    rng,
    SPECIES.filter((x) => x.group !== group).map((x) => x.name),
  ).slice(0, 3)
  return choicePickTask({
    question: `Welche Art gehört zu den ${GROUP_LABEL[group]}?`,
    choices: shuffleChoices(rng, [s.name, ...wrong], s.name),
    correct: s.name,
    solution: s.name,
    explanation: `${s.name}: ${s.note}.`,
    instruction: 'Wähle die passende Art:',
    fachwissen: fw(`${s.name} — ${s.note}. Heimische Beispiele helfen, Gruppenmerkmale abzuleiten.`),
    dedupeKey: `art:${s.name}`,
  })
}

function groupTrueFalse(rng: Rng, group: GroupKey) {
  const bank: Record<GroupKey, { statement: string; correct: boolean; explanation: string; wissen: string }[]> = {
    fisch: [
      {
        statement: 'Die Stromlinienform der Fische ist eine Angepasstheit an das Schwimmen.',
        correct: true,
        explanation: 'Stromlinienform verringert den Wasserwiderstand.',
        wissen: 'Erschließungsfeld Angepasstheit: Körperbau passt zum Lebensraum Wasser.',
      },
      {
        statement: 'Fische atmen typischerweise mit Lungen an Land.',
        correct: false,
        explanation: 'Fische atmen über Kiemen im Wasser.',
        wissen: 'Kiemen entziehen dem Wasser Sauerstoff — typisch für Wasserleben.',
      },
    ],
    lurch: [
      {
        statement: 'Viele Lurche durchlaufen eine Metamorphose.',
        correct: true,
        explanation: 'Kaulquappe → Frosch ist das klassische Beispiel.',
        wissen: 'Metamorphose verbindet Wasserlarve und landlebendes Adulttier.',
      },
      {
        statement: 'Lurche haben eine trockene Hornschicht wie Kriechtiere.',
        correct: false,
        explanation: 'Lurche haben feuchte, drüsenreiche Haut (Feuchtlufttiere).',
        wissen: 'Körperbedeckung und Atmung hängen zusammen — feuchte Haut ermöglicht Hautatmung.',
      },
    ],
    kriechtier: [
      {
        statement: 'Kriechtiere sind typische Trockenlufttiere mit Lungenatmung.',
        correct: true,
        explanation: 'Hornschicht und Lungen passen zum Landleben.',
        wissen: 'Angepasstheit: trockene Haut, innere Befruchtung, Eiablage an Land.',
      },
      {
        statement: 'Heimische Kriechtiere brauchen zur Fortpflanzung zwingend offenes Wasser wie Fische.',
        correct: false,
        explanation: 'Kriechtiere legen Eier an Land; innere Befruchtung.',
        wissen: 'Im Vergleich zu Fischen/Lurchen sind Kriechtiere unabhängiger vom Wasser.',
      },
    ],
    vogel: [
      {
        statement: 'Luftsäcke unterstützen den effizienten Gasaustausch beim Fliegen.',
        correct: true,
        explanation: 'Vögel haben Lunge plus Luftsäcke.',
        wissen: 'Struktur und Funktion: Atmungsorgane sind an den Flug angepasst.',
      },
      {
        statement: 'Alle Vögel sind Nestflüchter und verlassen das Nest sofort nach dem Schlüpfen.',
        correct: false,
        explanation: 'Es gibt Nesthocker und Nestflüchter.',
        wissen: 'Brutpflegeverhalten unterscheidet sich — Nesthocker bleiben länger im Nest.',
      },
    ],
    saeuger: [
      {
        statement: 'Säugetiere säugen ihre Nachkommen mit Milch.',
        correct: true,
        explanation: 'Das Säugen ist namensgebend für die Gruppe.',
        wissen: 'Fell, Säugen und meist lebendgebärend zeichnen Säugetiere aus.',
      },
      {
        statement: 'Der Maulwurf hat Grabextremitäten — eine Angepasstheit an unterirdisches Leben.',
        correct: true,
        explanation: 'Gliedmaßenbau spiegelt den Lebensraum wider.',
        wissen: 'Vergleiche Maulwurf, Fledermaus, Delphin, Pferd: gleiche Grundbaupläne, andere Angepasstheit.',
      },
    ],
  }
  const c = pick(rng, bank[group])
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
  })
}

function groupFeatureMulti(rng: Rng, group: GroupKey) {
  const correct = shuffle(
    rng,
    FEATURES.filter((f) => f.group === group).map((f) => f.text),
  ).slice(0, 2)
  const wrong = shuffle(
    rng,
    FEATURES.filter((f) => f.group !== group).map((f) => f.text),
  ).slice(0, 2)
  return multiSelectTask({
    question: `Welche Merkmale gehören zu ${GROUP_LABEL[group]}?`,
    choices: shuffle(rng, [...correct, ...wrong]),
    correct,
    solution: correct.join('; '),
    explanation: `Typisch für ${GROUP_LABEL[group]}: ${correct.join('; ')}.`,
    instruction: 'Tippe alle passenden Merkmale:',
    fachwissen: fw(
      `Leite Gruppenmerkmale aus heimischen Arten ab und nutze die Erschließungsfelder Vielfalt und Angepasstheit.`,
    ),
  })
}

function groupSchutzMc(rng: Rng, group: GroupKey) {
  const tips: Record<GroupKey, { q: string; good: string; bad: string[]; wissen: string }[]> = {
    fisch: [
      {
        q: 'Was schützt Fischbestände nachhaltig?',
        good: 'Erhalt von Lebensräumen und guter Wasserqualität',
        bad: [
          'Einleiten ungeklärter Abwässer',
          'Zerstören von Laichplätzen',
          'Überfischung ohne Schonzeiten',
        ],
        wissen: 'Schutz heißt: Gewässerqualität und Lebensräume erhalten (BNE, Beispiele aus Sachsen).',
      },
    ],
    lurch: [
      {
        q: 'Was hilft dem Schutz heimischer Lurche?',
        good: 'Laichgewässer und Wanderwege erhalten / vernetzen',
        bad: [
          'Tümpel zuschütten',
          'Straßen ohne Amphibienschutz zur Wanderzeit',
          'Feuchtgebiete trocknen',
        ],
        wissen: 'Lurche brauchen feuchte Lebensräume und sichere Wanderungen zu Laichgewässern.',
      },
    ],
    kriechtier: [
      {
        q: 'Welche Maßnahme schützt heimische Kriechtiere?',
        good: 'Sonnige Lebensräume und Verstecke erhalten',
        bad: [
          'Alle Totholzhaufen entfernen',
          'Habitate zersiedeln ohne Ausgleich',
          'Wildfang für Terrarien ohne Genehmigung',
        ],
        wissen: 'Artenschutz: Lebensräume (z. B. Trockenrasen, Lesesteinhaufen) erhalten.',
      },
    ],
    vogel: [
      {
        q: 'Was unterstützt den Schutz heimischer Vögel?',
        good: 'Lebensräume erhalten und artgerechte Nisthilfen',
        bad: [
          'Hecken im Brutgeschäft radikal entfernen',
          'Dauerhafte Störung an Brutplätzen',
          'Giftköder auslegen',
        ],
        wissen: 'Schutz der Lebensräume, Artenschutz und verantwortungsvolle Jagd/Regeln in Sachsen.',
      },
    ],
    saeuger: [
      {
        q: 'Was ist eine sinnvolle Schutzmaßnahme für heimische Säugetiere?',
        good: 'Lebensräume vernetzen und Störungen in Kernzonen vermeiden',
        bad: [
          'Dauerhafte Fütterung wilder Raubtiere in Siedlungen',
          'Zerstören von Feldgehölzen ohne Ersatz',
          'Unkontrolliertes Aussetzen von Haustieren',
        ],
        wissen: 'Schutz der Lebensräume und Artenschutz — Verantwortung des Menschen in der Natur.',
      },
    ],
  }
  const tip = pick(rng, tips[group])
  return choicePickTask({
    question: tip.q,
    choices: shuffleChoices(rng, [tip.good, ...tip.bad.slice(0, 3)], tip.good),
    correct: tip.good,
    solution: tip.good,
    explanation: tip.wissen,
    instruction: 'Wähle die beste Maßnahme:',
    fachwissen: fw(tip.wissen),
  })
}

function makeGroupTopic(group: GroupKey, extra?: (rng: Rng) => ReturnType<Topic['generate']>) {
  const variants = [
    (rng: Rng) => groupFeatureMc(rng, group),
    (rng: Rng) => groupSpeciesMc(rng, group),
    (rng: Rng) => groupTrueFalse(rng, group),
    (rng: Rng) => groupFeatureMulti(rng, group),
    (rng: Rng) => groupSchutzMc(rng, group),
  ]
  if (extra) variants.push(extra)
  return mixedVariants(...variants)
}

// Group-specific extras

function fischeNahrung(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Ordne die Glieder einer einfachen Nahrungskette im Gewässer.',
    slotLabels: ['Produzent', 'Friedfisch', 'Raubfisch'],
    itemLabels: ['Wasserpflanze', 'Rotauge', 'Hecht'],
    correctSlots: [0, 1, 2],
    distractors: ['Stein'],
    solution: 'Wasserpflanze → Rotauge → Hecht',
    explanation: 'Pflanzen erzeugen Biomasse; Friedfische fressen Pflanzen/Kleintiere; Raubfische jagen Fische.',
    fachwissen: fw(
      'Nahrungsbeziehungen im Lebensraum Wasser: Produzenten, Fried- und Raubfische bilden Ketten.',
    ),
  })
}

function fischeBauMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Bau und Funktion bei Fischen zu.',
    terms: ['Kiemen', 'Flossen', 'Schuppen'],
    meanings: [
      'Gasaustausch im Wasser',
      'Steuerung und Vortrieb beim Schwimmen',
      'Äußerer Schutz der Körperoberfläche',
    ],
    distractor: 'Aufnahme von Luftsauerstoff wie bei Säugern',
    solution: 'Kiemen→Gasaustausch; Flossen→Steuerung; Schuppen→Schutz',
    explanation: 'Struktur und Funktion: Organe sind an das Wasserleben angepasst.',
    fachwissen: fw(
      'Körpergliederung und äußerer Bau der Fische: Stromlinienform, Flossen, Schleimhaut, Schuppen, Kiemen.',
    ),
  })
}

function lurcheMetaSort(rng: Rng) {
  const steps = ['Laich im Wasser', 'Kaulquappe mit Kiemen', 'Beine wachsen', 'Landlebender Frosch']
  return dragDropSortTask({
    question:
      'Ordne die Metamorphose eines Froschlurchs von früh nach spät.',
    items: steps.map((label, value) => ({ label, value })),
    correctOrder: [0, 1, 2, 3],
    solution: steps.join(' → '),
    explanation: 'Aus dem Laich wird die wasserlebende Larve; später entsteht das landlebende Adulttier.',
    rng,
    fachwissen: fw(
      'Fortpflanzung der Lurche: äußere Befruchtung, Metamorphose, Wanderung zu Laichgewässern.',
    ),
  })
}

function lurcheMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Lurch-Begriffe den Erklärungen zu.',
    terms: ['Schwanzlurch', 'Froschlurch', 'Feuchtlufttier'],
    meanings: [
      'Lurch mit Schwanz auch als Adulttier (z. B. Salamander)',
      'Lurch ohne Schwanz als Adulttier (z. B. Frosch, Kröte)',
      'Lebewesen, das feuchte Luft/Hautfeuchtigkeit braucht',
    ],
    distractor: 'Gleichwarm mit Federkleid',
    solution: 'Schwanzlurch / Froschlurch / Feuchtlufttier korrekt zugeordnet',
    explanation: 'Vielfalt der Lurche: Schwanz- und Froschlurche; feuchte Haut kennzeichnet Feuchtlufttiere.',
    fachwissen: fw(
      'Typische Merkmale: feuchte Haut, wechselwarm, äußere Befruchtung, Metamorphose.',
    ),
  })
}

function kriechMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Kriechtier-Merkmale zu.',
    terms: ['Hornschicht', 'Lungen', 'Innere Befruchtung'],
    meanings: [
      'Trockene Körperbedeckung aus Hornstoffen',
      'Atmungsorgane für das Landleben',
      'Befruchtung im Körper der Weibchen',
    ],
    distractor: 'Kiemenatmung wie bei Fischen',
    solution: 'Hornschicht / Lungen / innere Befruchtung',
    explanation: 'Kriechtiere sind Trockenlufttiere: Hornschicht, Lungen, Fortpflanzung unabhängig vom Wasser.',
    fachwissen: fw(
      'Heimische Arten (z. B. Zauneidechse, Ringelnatter) zeigen typische Kriechtiermerkmale.',
    ),
  })
}

function voegelSchnabel(rng: Rng) {
  const pairs = [
    { form: 'Spitzer, schlanker Schnabel', food: 'Insekten / Weichteile (z. B. Singvogel)' },
    { form: 'Kurzer, kräftiger Körner-Schnabel', food: 'Samen und Körner' },
    { form: 'Hakiger Greifvogel-Schnabel', food: 'Fleisch / Beute zerreißen' },
  ]
  const three = shuffle(rng, pairs).slice(0, 3)
  return classifySlotsTask(rng, {
    question: 'Ordne Schnabelform und typische Nahrung zu (Angepasstheit).',
    slotLabels: three.map((p) => p.form),
    itemLabels: three.map((p) => p.food),
    correctSlots: [0, 1, 2],
    distractors: ['Ausschließlich Filterplankton wie Bartenwale'],
    solution: three.map((p) => `${p.form} → ${p.food}`).join('; '),
    explanation: 'Schnabelform spiegelt die Nahrung wider — Erschließungsfeld Angepasstheit.',
    fachwissen: fw(
      'Angepasstheit der Vögel: Körperform/Skelett zum Fliegen, Schnabel zur Nahrung, Luftsäcke zur Atmung.',
    ),
  })
}

function voegelFlugMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Was unterstützt den Vogelflug?',
    terms: ['Brustbeinkamm', 'Hohle Knochen', 'Federn'],
    meanings: [
      'Ansatz großer Flugmuskeln',
      'Leichtes Skelett',
      'Tragfläche und Isolation',
    ],
    distractor: 'Schwimmblase wie bei Knochenfischen',
    solution: 'Brustbeinkamm / hohle Knochen / Federn',
    explanation: 'Mehrere Merkmale wirken zusammen: leichtes Skelett, Muskelansatz, Federkleid.',
    fachwissen: fw(
      'Vögel: Federkleid, gleichwarm, innere Befruchtung, Brutpflege (Nesthocker/Nestflüchter).',
    ),
  })
}

function saeugerGebiss(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Ordne Gebisstyp und Ernährungsweise zu.',
    slotLabels: ['Fleischfresser', 'Pflanzenfresser', 'Allesfresser'],
    itemLabels: [
      'Reißzähne / scharfe Backenzähne (z. B. Katze)',
      'Breite Mahlzähne (z. B. Reh)',
      'Gemischtes Gebiss (z. B. Mensch, Schwein)',
    ],
    correctSlots: [0, 1, 2],
    distractors: ['Nur Kiemenreusen'],
    solution: 'Fleisch- / Pflanzen- / Allesfresser',
    explanation: 'Gebissform zeigt die Angepasstheit an die Nahrung.',
    fachwissen: fw(
      'Säugetiere: Fell, Säugen, gleichwarm; Angepasstheit von Gliedmaßen und Gebiss an Lebensraum und Nahrung.',
    ),
  })
}

function saeugerGliedmass(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welches Säugetier passt zur Gliedmaßen-Angepasstheit?',
    slotLabels: ['Graben', 'Fliegen', 'Schwimmen', 'Laufen'],
    itemLabels: ['Maulwurf', 'Fledermaus', 'Delphin', 'Pferd'],
    correctSlots: [0, 1, 2, 3],
    solution: 'Maulwurf→Graben; Fledermaus→Fliegen; Delphin→Schwimmen; Pferd→Laufen',
    explanation: 'Gleicher Grundbauplan, unterschiedliche Spezialisierung der Gliedmaßen.',
    fachwissen: fw(
      'Vergleich von Gliedmaßenskeletten zeigt Angepasstheit an unterschiedliche Lebensräume.',
    ),
  })
}

/** Überblick: Gruppenmerkmale / Zuordnung — ohne Spezial-Extras anderer Unterthemen. */
export const biFischeOverview = makeGroupTopic('fisch')
export const biLurcheOverview = makeGroupTopic('lurch')
export const biKriechtiereOverview = makeGroupTopic('kriechtier')
export const biVoegelOverview = makeGroupTopic('vogel')
export const biSaeugetiereOverview = makeGroupTopic('saeuger')

/** Spezialisierte Unterthemen — nur gruppeninterne Details. */
export const biFischeMerkmale = makeGroupTopic('fisch', fischeBauMatch)
export const biFischeLebensraum = makeGroupTopic('fisch', fischeNahrung)
export const biFischeSchutz = makeGroupTopic('fisch', (rng) => groupSchutzMc(rng, 'fisch'))
export const biLurcheMerkmale = makeGroupTopic('lurch', lurcheMatch)
export const biLurcheMeta = makeGroupTopic('lurch', lurcheMetaSort)
export const biLurcheSchutz = makeGroupTopic('lurch', (rng) => groupSchutzMc(rng, 'lurch'))
export const biKriechtiereMerkmale = makeGroupTopic('kriechtier', kriechMatch)
export const biKriechtiereArten = makeGroupTopic('kriechtier', (rng) => groupSpeciesMc(rng, 'kriechtier'))
export const biVoegelFlug = makeGroupTopic('vogel', voegelFlugMatch)
export const biVoegelFortpflanzung = makeGroupTopic('vogel', voegelSchnabel)
export const biSaeugerMerkmale = makeGroupTopic('saeuger', saeugerGebiss)
export const biSaeugerAngepasst = makeGroupTopic('saeuger', saeugerGliedmass)
export const biSaeugerSchutz = makeGroupTopic('saeuger', (rng) => groupSchutzMc(rng, 'saeuger'))

/** @deprecated Prefer Überblick / Spezial-Exports — kept as Überblick alias. */
export const biFische = biFischeOverview
export const biLurche = biLurcheOverview
export const biKriechtiere = biKriechtiereOverview
export const biVoegel = biVoegelOverview
export const biSaeugetiere = biSaeugetiereOverview

// ─── LB7 Systematisierung — classification tree / feature matrix ─────────────

function systematikClassify(rng: Rng) {
  const sample = shuffle(rng, SPECIES).slice(0, 4)
  const groups = [...new Set(sample.map((s) => s.group))]
  // Ensure slots cover the groups present
  const slotKeys = shuffle(rng, groups)
  const slotLabels = slotKeys.map((g) => GROUP_LABEL[g])
  const itemLabels = sample.map((s) => s.name)
  const correctSlots = sample.map((s) => slotKeys.indexOf(s.group))
  return classifySlotsTask(rng, {
    question: 'Ordne die Arten der richtigen Wirbeltiergruppe zu (Klassifikation).',
    slotLabels,
    itemLabels,
    correctSlots,
    distractors: ['Regenwurm'],
    solution: sample.map((s) => `${s.name}→${GROUP_LABEL[s.group]}`).join('; '),
    explanation: sample.map((s) => `${s.name}: ${s.note}`).join(' '),
    fachwissen: fw(
      'Systematisierung: Vergleiche Struktur, Funktion und Angepasstheit der Wirbeltiergruppen.',
    ),
    instruction: 'Klassifikationsbaum als Fächer: Ziehe jede Art in die passende Gruppe. Einen Block brauchst du nicht.',
  })
}

function systematikAtmung(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welches Atmungsorgan passt zum Lebensraum?',
    slotLabels: ['Wasserleben', 'Feuchtluft / Haut+Lunge', 'Trockenland / Lunge', 'Flug / Lunge+Luftsäcke'],
    itemLabels: ['Kiemen (Fische)', 'Haut und Lunge (Lurche)', 'Stark gekammerte Lungen (Kriechtiere)', 'Lunge mit Luftsäcken (Vögel)'],
    correctSlots: [0, 1, 2, 3],
    distractors: ['Nur Blätterphotosynthese'],
    solution: 'Kiemen / Haut+Lunge / Lungen / Luftsäcke',
    explanation: 'Atmungsorgane und Körperbedeckung hängen mit dem Lebensraum zusammen.',
    fachwissen: fw(
      'Wechselwirkung: Atmungsorgane – Lebensraum; Körperbedeckung – Temperaturhaushalt; Fortpflanzung – Wasserbindung.',
    ),
  })
}

function systematikTemperatur(rng: Rng) {
  const gleichwarm = ['Vögel', 'Säugetiere']
  const wechselwarm = ['Fische', 'Lurche', 'Kriechtiere']
  const correct = shuffle(rng, gleichwarm)
  const wrong = shuffle(rng, wechselwarm).slice(0, 2)
  return multiSelectTask({
    question: 'Welche Wirbeltiergruppen sind gleichwarm?',
    choices: shuffle(rng, [...correct, ...wrong]),
    correct,
    solution: gleichwarm.join(', '),
    explanation:
      'Gleichwarm: Vögel und Säugetiere. Wechselwarm: Fische, Lurche und Kriechtiere.',
    instruction: 'Tippe alle gleichwarmen Gruppen:',
    fachwissen: fw(
      'Körperbedeckung und Temperaturhaushalt: nackte/feuchte Haut vs. Schuppen/Federn/Fell.',
    ),
  })
}

function systematikFortpflanzung(rng: Rng) {
  return choicePickTask({
    question: 'Welche Aussage zur Fortpflanzung der Wirbeltiere stimmt?',
    choices: shuffleChoices(
      rng,
      [
        'Fische und viele Lurche: oft äußere Befruchtung und Bindung ans Wasser',
        'Alle Wirbeltiere legen Eier ausschließlich im Meer ab',
        'Säugetiere haben niemals Brutpflege',
        'Kriechtiere atmen als Adulttiere nur über Kiemen',
      ],
      'Fische und viele Lurche: oft äußere Befruchtung und Bindung ans Wasser',
    ),
    correct: 'Fische und viele Lurche: oft äußere Befruchtung und Bindung ans Wasser',
    solution: 'Fische und viele Lurche: oft äußere Befruchtung und Bindung ans Wasser',
    explanation:
      'Mit dem Landgang (Kriechtiere, Vögel, Säuger) wird innere Befruchtung und Unabhängigkeit vom Wasser wichtiger.',
    instruction: 'Wähle die richtige Aussage:',
    fachwissen: fw(
      'Fortpflanzung – Lebensraum: äußere vs. innere Befruchtung; Brutfürsorge und Brutpflege.',
    ),
  })
}

function systematikSortGruppen(rng: Rng) {
  // Didactic order: increasing independence from water (simplified teaching sequence)
  const labels = ['Fische', 'Lurche', 'Kriechtiere', 'Vögel', 'Säugetiere']
  return dragDropSortTask({
    question:
      'Ordne die Wirbeltiergruppen nach typischer Bindung ans Wasser bei der Fortpflanzung (stark gebunden → weitgehend unabhängig).',
    items: labels.map((label, value) => ({ label, value })),
    correctOrder: [0, 1, 2, 3, 4],
    solution: labels.join(' → '),
    explanation:
      'Fische und Lurche brauchen Wasser zur Fortpflanzung; Kriechtiere, Vögel und Säuger sind stärker landgebunden (vereinfachtes Unterrichtsmodell).',
    rng,
    fachwissen: fw(
      'Hinführung zum Entwicklungsgedanken: Vergleich der Wirbeltiere als Systematisierung.',
    ),
  })
}

export const biSystematik: Topic['generate'] = mixedVariants(
  systematikClassify,
  systematikAtmung,
  systematikTemperatur,
  systematikFortpflanzung,
  systematikSortGruppen,
)

// ─── Wahl: Wirbeltiere im Winter ──────────────────────────────────────────────

function winterMc(rng: Rng) {
  const s = pick(rng, WINTER_STRATEGIES)
  const wrong = shuffle(
    rng,
    WINTER_STRATEGIES.filter((x) => x.name !== s.name).map((x) => x.meaning),
  ).slice(0, 3)
  return choicePickTask({
    question: `Was bedeutet „${s.name}“?`,
    choices: shuffleChoices(rng, [s.meaning, ...wrong], s.meaning),
    correct: s.meaning,
    solution: s.meaning,
    explanation: s.wissen,
    instruction: 'Wähle die passende Erklärung:',
    fachwissen: fw(s.wissen),
    dedupeKey: `winter:${s.name}`,
  })
}

function winterMatch(rng: Rng) {
  const three = shuffle(rng, WINTER_STRATEGIES).slice(0, 3)
  return matchTermsTask(rng, {
    question: 'Ordne die Überwinterungsstrategien zu.',
    terms: three.map((s) => s.name),
    meanings: three.map((s) => s.meaning),
    distractor: 'Fotosynthese im Winterstopp',
    solution: three.map((s) => `${s.name} → ${s.meaning}`).join('; '),
    explanation: three.map((s) => s.wissen).join(' '),
    fachwissen: fw(
      'Angepasstheit im Winter: Winterschlaf, Winterruhe, Kältestarre, Vogelzug.',
    ),
  })
}

function winterTrueFalse(rng: Rng) {
  const cases = [
    {
      statement: 'Zugvögel lösen das Nahrungsproblem im Winter oft durch Wanderung.',
      correct: true,
      explanation: 'Vogelzug ist eine Angepasstheit an saisonalen Nahrungsmangel.',
      wissen: 'Nicht alle Vögel ziehen — Standvögel nutzen andere Strategien.',
    },
    {
      statement: 'Kältestarre betrifft vor allem gleichwarme Säugetiere wie den Fuchs.',
      correct: false,
      explanation: 'Kältestarre betrifft wechselwarme Tiere (z. B. Lurche, Kriechtiere).',
      wissen: 'Gleichwarme nutzen eher Winterschlaf, Winterruhe oder bleiben aktiv.',
    },
  ]
  const c = pick(rng, cases)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
  })
}

function winterClassify(rng: Rng) {
  return classifySlotsTask(rng, {
    question: 'Welche Überwinterungsstrategie passt zum Beispiel?',
    slotLabels: ['Winterschlaf', 'Kältestarre', 'Vogelzug'],
    itemLabels: ['Igel', 'Grasfrosch', 'Kranich'],
    correctSlots: [0, 1, 2],
    distractors: ['Immergrüne Fotosynthese'],
    solution: 'Igel→Winterschlaf; Grasfrosch→Kältestarre; Kranich→Vogelzug',
    explanation: 'Beispiele helfen, Strategien zu unterscheiden — Angepasstheit an Kälte und Nahrungsmangel.',
    fachwissen: fw(
      'Wende das Erschließungsfeld Angepasstheit auf Überwinterungsstrategien an.',
    ),
  })
}

export const biWinter: Topic['generate'] = mixedVariants(
  winterMc,
  winterMatch,
  winterTrueFalse,
  winterClassify,
)

// ─── Wahl: Kriechtiere vergangener Zeiten / Artgerechte Haltung ───────────────

function saurierMc(rng: Rng) {
  const items = [
    {
      q: 'Was sind Fossilien?',
      a: 'Versteinerte Reste oder Spuren früherer Lebewesen',
      w: ['Nur heutige Federn', 'Nur frisches Laub', 'Nur Magensaft'],
      e: 'Fossilien belegen ausgestorbene Lebensformen wie Saurier.',
      wissen:
        'Fossilien sind erhaltene Reste oder Spuren früherer Lebewesen. Die Paläontologie rekonstruiert damit vergangene Lebenswelten.',
    },
    {
      q: 'Warum sind viele Saurier ausgestorben (Schulmodell)?',
      a: 'Umweltveränderungen (u. a. nach Impaktereignissen) führten zum Artensterben',
      w: ['Weil sie zu Insekten wurden', 'Weil sie keine DNA hatten', 'Weil Knochen weich wurden über Nacht'],
      e: 'Massensterben am Ende der Kreide — vereinfachtes Unterrichtsmodell.',
      wissen:
        'Angepasstheit hilft nur, solange die Umwelt passt. Starke Umweltveränderungen (z. B. am Ende der Kreide) können zum Massensterben führen.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.a, ...it.w], it.a),
    correct: it.a,
    solution: it.a,
    explanation: it.e,
    instruction: 'Wähle die passende Antwort:',
    fachwissen: fw(it.wissen),
  })
}

function saurierTf(rng: Rng) {
  return trueFalse(rng, {
    statement: 'Alle Saurier waren flugunfähige Riesenechsen ohne Ausnahme.',
    correct: false,
    explanation: 'Die Vielfalt war groß — u. a. flugfähige Formen in verwandten Gruppen; „Saurier“ im Unterricht oft vereinfacht.',
    fachwissen: fw(
      'Vergangene Kriechtiere zeigten große Formenvielfalt — von kleinen bis riesigen Arten; nicht alle waren flugunfähige Riesenechsen.',
    ),
  })
}

function saurierMatch(rng: Rng) {
  return matchTermsTask(rng, {
    question: 'Ordne Begriffe zur Paläontologie zu.',
    terms: ['Fossil', 'Aussterben', 'Angepasstheit'],
    meanings: [
      'Erhaltener Rest oder Spur',
      'Verschwinden einer Art',
      'Merkmal, das in einer Umwelt Vorteile bringt',
    ],
    distractor: 'Spaltöffnung der Blätter',
    solution: 'Fossil → Rest/Spur; Aussterben → Verschwinden; Angepasstheit → Vorteil',
    explanation: 'Mit Fossilien und Aussterben wird der Blick auf heutige Kriechtiere geschärft.',
    fachwissen: fw(
      'Fossil: erhaltener Rest oder Spur. Aussterben: Verschwinden einer Art. Angepasstheit: Merkmal mit Vorteil in einer Umwelt.',
    ),
  })
}

export const biSaurier: Topic['generate'] = mixedVariants(saurierMc, saurierTf, saurierMatch)

function haltungMc(rng: Rng) {
  const items = [
    {
      q: 'Was meint artgerechte Tierhaltung?',
      a: 'Bedürfnisse der Art (Raum, Klima, Nahrung, Soziales) werden berücksichtigt',
      w: ['Nur möglichst kleiner Käfig', 'Nie Wasser anbieten', 'Nur Kunststoffpflanzen ohne Licht'],
      e: 'Artgerecht heißt: Lebensweise der Art ernst nehmen.',
      wissen:
        'Artgerechte Haltung berücksichtigt Raum, Klima, Nahrung und Sozialverhalten der Art — z. B. Temperatur, Feuchte, Verstecke und artgerechtes Futter im Aquarium oder Terrarium.',
    },
    {
      q: 'Warum ist Überfütterung im Aquarium problematisch?',
      a: 'Wasserqualität sinkt, Tiere können erkranken',
      w: ['Weil Fische dann fliegen', 'Weil Knochen verschwinden', 'Weil Photosynthese stoppt sofort weltweit'],
      e: 'Futterreste belasten das Wasser.',
      wissen:
        'Überschüssiges Futter zersetzt sich, belastet das Wasser (Ammoniak/Nitrit) und kann Fische krank machen — sparsam und artgerecht füttern.',
    },
  ]
  const it = pick(rng, items)
  return choicePickTask({
    question: it.q,
    choices: shuffleChoices(rng, [it.a, ...it.w], it.a),
    correct: it.a,
    solution: it.a,
    explanation: it.e,
    instruction: 'Wähle die passende Antwort:',
    fachwissen: fw(it.wissen),
  })
}

function haltungMulti(rng: Rng) {
  return multiSelectTask({
    question: 'Was gehört zu verantwortlicher Haltung?',
    choices: shuffle(rng, [
      'Passende Temperatur',
      'Sauberes Wasser / Hygiene',
      'Artgerechtes Futter',
      'Nie informieren vor dem Kauf',
      'Tiere als Wegwerfartikel',
    ]),
    correct: ['Passende Temperatur', 'Sauberes Wasser / Hygiene', 'Artgerechtes Futter'],
    solution: 'Temperatur, Hygiene, Futter',
    explanation: 'Vorbereitung und Pflege schützen Tiere.',
    instruction: 'Wähle alle zutreffenden Antworten:',
    fachwissen: fw(
      'Verantwortliche Haltung braucht passende Temperatur, sauberes Wasser bzw. Hygiene und artgerechtes Futter — abgestimmt auf die Bedürfnisse der Art.',
    ),
  })
}

function haltungTf(rng: Rng) {
  return trueFalse(rng, {
    statement: 'Vor der Anschaffung sollte man den Platz- und Pflegebedarf der Art kennen.',
    correct: true,
    explanation: 'Planung verhindert Leid und Abgabe.',
    fachwissen: fw(
      'Vor dem Kauf den Platz-, Klima- und Pflegebedarf der Art klären — so vermeidet man Überforderung und Tierleid.',
    ),
  })
}

export const biHaltung: Topic['generate'] = mixedVariants(haltungMc, haltungMulti, haltungTf)

// ─── Registry ────────────────────────────────────────────────────────────────

export const BIOLOGIE_K5_GENERATORS: Record<string, Topic['generate']> = {
  'bi-k5-lb1-merkmale': biMerkmale,
  'bi-k5-lb1-kennzeichen': biMerkmale,
  'bi-k5-lb2-fische': biFischeOverview,
  'bi-k5-lb2-fische-merkmale': biFischeMerkmale,
  'bi-k5-lb2-fische-lebensraum': biFischeLebensraum,
  'bi-k5-lb2-fische-schutz': biFischeSchutz,
  'bi-k5-lb3-lurche': biLurcheOverview,
  'bi-k5-lb3-lurche-merkmale': biLurcheMerkmale,
  'bi-k5-lb3-lurche-meta': biLurcheMeta,
  'bi-k5-lb3-lurche-schutz': biLurcheSchutz,
  'bi-k5-lb4-kriechtiere': biKriechtiereOverview,
  'bi-k5-lb4-kriechtiere-merkmale': biKriechtiereMerkmale,
  'bi-k5-lb4-kriechtiere-arten': biKriechtiereArten,
  'bi-k5-lb5-voegel': biVoegelOverview,
  'bi-k5-lb5-voegel-flug': biVoegelFlug,
  'bi-k5-lb5-voegel-fortpflanzung': biVoegelFortpflanzung,
  'bi-k5-lb6-saeugetiere': biSaeugetiereOverview,
  'bi-k5-lb6-saeuger-merkmale': biSaeugerMerkmale,
  'bi-k5-lb6-saeuger-angepasst': biSaeugerAngepasst,
  'bi-k5-lb6-saeuger-schutz': biSaeugerSchutz,
  'bi-k5-lb7-systematik': biSystematik,
  'bi-k5-lb7-zuordnung': biSystematik,
  'bi-k5-lbw-winter': biWinter,
  'bi-k5-lbw-saurier': biSaurier,
  'bi-k5-lbw-haltung': biHaltung,
}
