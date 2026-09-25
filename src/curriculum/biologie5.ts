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
    contentIds?: string[]
  },
) => {
  const correctLabel = opts.correct ? 'Richtig' : 'Falsch'
  const key = opts.dedupeKey ?? `tf:${opts.statement.slice(0, 64)}`
  return choicePickTask({
    question: `Stimmt die Aussage?\n\n„${opts.statement}“`,
    choices: shuffleChoices(rng, ['Richtig', 'Falsch'], correctLabel),
    correct: correctLabel,
    solution: correctLabel,
    explanation: opts.explanation,
    instruction: 'Richtig oder falsch?',
    fachwissen: opts.fachwissen,
    dedupeKey: key,
    contentIds: opts.contentIds ?? [key],
  })
}

/** Attach stable concept ids (within-round + cross-topic isolation). */
const withConcept = <T extends { dedupeKey?: string; contentIds?: string[] }>(
  task: T,
  concept: string,
): T => ({
  ...task,
  dedupeKey: concept,
  contentIds: [concept],
})

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
    concept?: string
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
  const task = dragDropSlotsTask({
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
  const concept =
    opts.concept ??
    `bio:k5:slots:${opts.question.slice(0, 48)}:${[...opts.itemLabels].sort().join('+')}`
  return withConcept(task, concept)
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
    concept?: string
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
    concept:
      opts.concept ??
      `bio:k5:match:${[...opts.terms].map((t) => t.toLowerCase()).sort().join('+')}`,
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
  { name: 'Karpfen', group: 'fisch', note: 'Friedfisch; oft in Teichen gehalten' },
  { name: 'Barsch', group: 'fisch', note: 'Raubfisch mit Stachelflossen' },
  { name: 'Schleie', group: 'fisch', note: 'Bodenfisch in ruhigen Gewässern' },
  { name: 'Erdkröte', group: 'lurch', note: 'Froschlurch; feuchte Haut, Metamorphose' },
  { name: 'Grasfrosch', group: 'lurch', note: 'Laicht im Frühjahr in Tümpeln' },
  { name: 'Feuersalamander', group: 'lurch', note: 'Schwanzlurch mit Warnfärbung' },
  { name: 'Teichmolch', group: 'lurch', note: 'Schwanzlurch; Laichgewässer nötig' },
  { name: 'Laubfrosch', group: 'lurch', note: 'Kletternder Froschlurch; Haftscheiben' },
  { name: 'Knoblauchkröte', group: 'lurch', note: 'Grabende Kröte; Versteck im Boden' },
  { name: 'Zauneidechse', group: 'kriechtier', note: 'Heimisches Kriechtier; Hornschuppen' },
  { name: 'Ringelnatter', group: 'kriechtier', note: 'Ungiftige Schlange; Eiablage an Land' },
  { name: 'Blindschleiche', group: 'kriechtier', note: 'Beinlose Echse (kein Wurm!)' },
  { name: 'Waldeidechse', group: 'kriechtier', note: 'Kleine Echse; oft in Heide und Wald' },
  { name: 'Kreuzotter', group: 'kriechtier', note: 'Giftige Viper; charakteristische Zeichnung' },
  { name: 'Europäische Sumpfschildkröte', group: 'kriechtier', note: 'Panzer; an Gewässer gebunden' },
  { name: 'Amsel', group: 'vogel', note: 'Singvogel; Federkleid, gleichwarm' },
  { name: 'Kohlmeise', group: 'vogel', note: 'Häufiger Höhlenbrüter in Gärten' },
  { name: 'Rotmilan', group: 'vogel', note: 'Greifvogel; Schnabel an Beute angepasst' },
  { name: 'Buchfink', group: 'vogel', note: 'Häufiger Singvogel; Körnerfresser-Anteil' },
  { name: 'Mauersegler', group: 'vogel', note: 'Ausgesprochener Flugjäger; Zugvogel' },
  { name: 'Stockente', group: 'vogel', note: 'Wasservogel; Schwimmhäute' },
  { name: 'Hausrotschwanz', group: 'vogel', note: 'Singvogel an Gebäuden und Felsen' },
  { name: 'Blaumeise', group: 'vogel', note: 'Kleiner Höhlenbrüter; Insektenjäger' },
  { name: 'Buntspecht', group: 'vogel', note: 'Specht; meißelt Insekten aus Holz' },
  { name: 'Graureiher', group: 'vogel', note: 'Watvogel; jagt Fische an Gewässern' },
  { name: 'Reh', group: 'saeuger', note: 'Pflanzenfresser; Wiederkäuer-Gebiss' },
  { name: 'Fuchs', group: 'saeuger', note: 'Allesfresser; Fell, lebendgebärend' },
  { name: 'Maulwurf', group: 'saeuger', note: 'Grabende Gliedmaßen – Angepasstheit' },
  { name: 'Fledermaus', group: 'saeuger', note: 'Flughäute – Angepasstheit an Luftleben' },
  { name: 'Igel', group: 'saeuger', note: 'Insektenfresser; Stacheln als Schutz' },
  { name: 'Rothirsch', group: 'saeuger', note: 'Großer Wiederkäuer; Geweih der Männchen' },
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
    text: 'Seitenlinie zum Wahrnehmen von Wasserbewegungen',
    group: 'fisch',
    wissen: 'Die Seitenlinie hilft Fischen, Strömung und Bewegungen im Wasser wahrzunehmen.',
  },
  {
    text: 'Schwimmblase zur Auftriebsregulation (viele Knochenfische)',
    group: 'fisch',
    wissen: 'Die Schwimmblase ermöglicht vielen Knochenfischen, ohne ständiges Schwimmen in der Tiefe zu schweben.',
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
    text: 'Oft äußere Befruchtung und Laich im Wasser',
    group: 'lurch',
    wissen: 'Viele Froschlurche legen Laich in Gewässern ab; die Befruchtung erfolgt oft äußerlich.',
  },
  {
    text: 'Wechselwarm; Aktivität stark temperaturabhängig',
    group: 'lurch',
    wissen: 'Als Wechselwarme sind Lurche bei Kälte träge und suchen Schutz oder erstarren.',
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
    text: 'Lungenatmung ohne Hautatmung wie bei Lurchen',
    group: 'kriechtier',
    wissen: 'Kriechtiere atmen mit Lungen; die trockene Hornschicht erlaubt kein feuchtes Hautatmen wie bei vielen Lurchen.',
  },
  {
    text: 'Eier mit ledriger oder kalkiger Schale (viele Arten)',
    group: 'kriechtier',
    wissen: 'Landleben der Fortpflanzung: Eihüllen schützen vor Austrocknung.',
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
    text: 'Schnabel statt Zähne; innere Befruchtung',
    group: 'vogel',
    wissen: 'Vögel haben einen Schnabel; die Fortpflanzung erfolgt mit innerer Befruchtung und Eiablage.',
  },
  {
    text: 'Gleichwarm; hoher Energiebedarf',
    group: 'vogel',
    wissen: 'Gleichwarme Vögel halten ihre Temperatur — der Flug kostet viel Energie.',
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
  {
    text: 'Differenziertes Gebiss je nach Ernährung',
    group: 'saeuger',
    wissen: 'Schneide-, Eck- und Backenzähne sind an Pflanzen-, Fleisch- oder Allesfresser angepasst.',
  },
  {
    text: 'Milchdrüsen ernähren die Jungen',
    group: 'saeuger',
    wissen: 'Namengebend: Säugetiere säugen ihre Nachkommen mit Milch.',
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
  {
    trait: 'Zellulärer Aufbau',
    meaning: 'Lebewesen bestehen aus einer oder vielen Zellen',
    wissen: 'Die Zelle ist die grundlegende strukturelle und funktionelle Einheit des Lebens.',
  },
  {
    trait: 'Regulation',
    meaning: 'Innere Zustände werden aktiv im Gleichgewicht gehalten',
    wissen: 'Regulation (Homöostase) steuert z. B. Temperatur, Wasser- und Stoffhaushalt.',
  },
  {
    trait: 'Erbinformation',
    meaning: 'Merkmale werden über Erbgut an Nachkommen weitergegeben',
    wissen: 'Erbinformation in der DNA ermöglicht Vererbung und Entwicklung.',
  },
  {
    trait: 'Ausscheidung',
    meaning: 'Abgabe nicht mehr benötigter oder schädlicher Stoffe',
    wissen: 'Ausscheidung gehört zum Stoffwechselgeschehen und schützt vor Giftstoffen.',
  },
  {
    trait: 'Angepasstheit',
    meaning: 'Merkmale passen zu Lebensraum und Lebensweise',
    wissen: 'Angepasstheit zeigt sich in Bau und Verhalten — Ergebnis langfristiger Evolution.',
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

// ─── LB1 Merkmale des Lebens (Bug A: concept once per round; Bug B: merkmale ≠ kennzeichen) ─

const LIFE_CONCEPT = (trait: string) => `bio:k5:leben:${trait.toLowerCase()}`

function merkmaleMc(rng: Rng) {
  const trait = pick(rng, LIFE_TRAITS)
  const wrong = shuffle(
    rng,
    LIFE_TRAITS.filter((t) => t.trait !== trait.trait).map((t) => t.meaning),
  ).slice(0, 3)
  const concept = LIFE_CONCEPT(trait.trait)
  return choicePickTask({
    question: `Was bedeutet das Lebensmerkmal „${trait.trait}“?`,
    choices: shuffleChoices(rng, [trait.meaning, ...wrong], trait.meaning),
    correct: trait.meaning,
    solution: trait.meaning,
    explanation: trait.wissen,
    instruction: 'Wähle die passende Erklärung:',
    fachwissen: fw(trait.wissen),
    dedupeKey: concept,
    contentIds: [concept],
  })
}

function merkmaleTrueFalse(rng: Rng) {
  const cases = [
    {
      concept: 'bio:k5:leben:tf-stein',
      statement: 'Ein Stein zeigt Stoffwechsel und Fortpflanzung.',
      correct: false,
      explanation: 'Steine sind unbelebt — sie haben keinen Stoffwechsel und keine Fortpflanzung.',
      wissen: 'Biologie untersucht Lebewesen. Unbelebte Objekte erfüllen die Lebensmerkmale nicht.',
    },
    {
      concept: 'bio:k5:leben:tf-atmung-stoffwechsel',
      statement: 'Atmung und Ernährung gehören zum Stoffwechsel.',
      correct: true,
      explanation: 'Stoffwechsel umfasst Aufnahme, Umbau und Abgabe von Stoffen und Energie.',
      wissen: 'Stoffwechsel ist ein zentrales Merkmal des Lebens neben Bewegung, Reizbarkeit und Fortpflanzung.',
    },
    {
      concept: 'bio:k5:leben:tf-pflanzen-bewegung',
      statement: 'Nur Tiere bewegen sich — Pflanzen nie.',
      correct: false,
      explanation: 'Auch Pflanzen bewegen sich (z. B. Blätter zur Sonne, Ranker) — oft langsamer.',
      wissen: 'Bewegung als Lebensmerkmal gilt für Organismen allgemein, nicht nur für Tiere.',
    },
    {
      concept: 'bio:k5:leben:tf-reizbarkeit',
      statement: 'Reizbarkeit bedeutet, dass Lebewesen auf Umwelteinflüsse reagieren können.',
      correct: true,
      explanation: 'Reizbarkeit ist ein Lebensmerkmal: Reaktion auf Reize.',
      wissen: 'Ohne Reizbarkeit wären Orientierung und Anpassung an die Umwelt unmöglich.',
    },
    {
      concept: 'bio:k5:leben:tf-wachstum',
      statement: 'Wachstum und Entwicklung zählen zu den Merkmalen des Lebens.',
      correct: true,
      explanation: 'Lebewesen verändern Größe und Gestalt im Lebenslauf.',
      wissen: 'Wachstum/Entwicklung gehört neben Stoffwechsel und Fortpflanzung zu den Lebensmerkmalen.',
    },
    {
      concept: 'bio:k5:leben:tf-zelle',
      statement: 'Lebewesen bestehen aus einer oder vielen Zellen.',
      correct: true,
      explanation: 'Der zelluläre Aufbau ist ein zentrales Lebensmerkmal.',
      wissen: 'Die Zelle ist die grundlegende Einheit des Lebens.',
    },
    {
      concept: 'bio:k5:leben:tf-regulation',
      statement: 'Regulation hält innere Zustände im Gleichgewicht (Homöostase).',
      correct: true,
      explanation: 'Lebewesen steuern z. B. Wasser- und Stoffhaushalt aktiv.',
      wissen: 'Regulation gehört zu den Merkmalen des Lebens.',
    },
    {
      concept: 'bio:k5:leben:tf-erbgut-stein',
      statement: 'Auch unbelebte Steine speichern Erbinformation in DNA.',
      correct: false,
      explanation: 'Erbinformation in DNA ist ein Merkmal von Lebewesen.',
      wissen: 'Vererbung über Erbgut gilt für Organismen, nicht für Steine.',
    },
    {
      concept: 'bio:k5:leben:tf-ausscheidung',
      statement: 'Ausscheidung von Abfallstoffen gehört zum Stoffwechselgeschehen.',
      correct: true,
      explanation: 'Aufnahme, Umbau und Abgabe bilden den Stoffwechsel.',
      wissen: 'Ausscheidung schützt vor schädlichen Stoffansammlungen.',
    },
    {
      concept: 'bio:k5:leben:tf-angepasstheit',
      statement: 'Angepasstheit bedeutet, dass Merkmale zu Lebensraum und Lebensweise passen.',
      correct: true,
      explanation: 'Bau und Verhalten zeigen oft Angepasstheit.',
      wissen: 'Angepasstheit ist im Schulunterricht ein zentrales Beobachtungsziel.',
    },
  ]
  const c = pick(rng, cases)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
}

/** Prefer full/half pool Zuordnung so rounds are not 10× the same MC. */
function merkmaleMatch(rng: Rng) {
  const n = LIFE_TRAITS.length
  // Large Zuordnungen (5–6 Begriffe) when possible — variety, not short rounds.
  const size = n >= 10 ? (rng() < 0.55 ? 6 : 5) : n >= 6 ? 5 : Math.min(4, n)
  const pool = shuffle(rng, LIFE_TRAITS).slice(0, size)
  const concepts = pool.map((t) => LIFE_CONCEPT(t.trait))
  const task = matchTermsTask(rng, {
    question: `Ordne ${size} Lebensmerkmale ihren Erklärungen zu.`,
    terms: pool.map((t) => t.trait),
    meanings: pool.map((t) => t.meaning),
    distractor: 'Besteht nur aus Metall und Glas',
    solution: pool.map((t) => `${t.trait} → ${t.meaning}`).join('; '),
    explanation: pool.map((t) => t.wissen).join(' '),
    fachwissen: fw(
      'Merkmale des Lebens: u. a. Reizbarkeit, Bewegung, Fortpflanzung, Wachstum/Entwicklung, Stoffwechsel, zellulärer Aufbau, Regulation.',
    ),
    concept: `bio:k5:leben:match:${[...concepts].sort().join('+')}`,
  })
  // Each trait concept blocks MC/TF of the same Lebensmerkmal in one round (Bug A).
  return { ...task, contentIds: concepts, dedupeKey: concepts.slice().sort().join('+') }
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
    dedupeKey: 'bio:k5:leben:multi-typisch',
    contentIds: ['bio:k5:leben:multi-typisch', ...living.map(LIFE_CONCEPT)],
  })
}

/** Merkmale = Begriffsdefinitionen + Zuordnung (pair-heavy). */
export const biMerkmale: Topic['generate'] = mixedVariants(
  merkmaleMatch,
  merkmaleMatch,
  merkmaleMc,
  merkmaleTrueFalse,
  merkmaleMulti,
)

/** Kennzeichen = belebte/unbelebte Abgrenzung — DISJOINT from biMerkmale. */
function kennzeichenMc(rng: Rng) {
  const cases = [
    {
      concept: 'bio:k5:kennzeichen:stein-vs-pflanze',
      q: 'Was unterscheidet eine Pflanze klar von einem Stein?',
      good: 'Die Pflanze erfüllt Lebensmerkmale (z. B. Stoffwechsel, Wachstum)',
      bad: [
        'Nur die Farbe ist anders',
        'Steine haben immer Fortpflanzung',
        'Pflanzen haben keinen Stoffwechsel',
      ],
      wissen:
        'Kennzeichen des Lebendigen: Nur Lebewesen zeigen Stoffwechsel, Wachstum, Reizbarkeit und Fortpflanzung.',
    },
    {
      concept: 'bio:k5:kennzeichen:unbelebt',
      q: 'Welches Objekt ist eindeutig unbelebt?',
      good: 'Ein Quarzstück ohne Stoffwechsel',
      bad: [
        'Eine keimende Bohne',
        'Ein Regenwurm',
        'Eine Hefezelle in Gärung',
      ],
      wissen: 'Unbelebte Dinge erfüllen die Lebensmerkmale nicht — auch wenn sie sich chemisch verändern können.',
    },
    {
      concept: 'bio:k5:kennzeichen:beobachtung',
      q: 'Woran erkennst du im Alltag am ehesten „lebendig“?',
      good: 'Eigenständige Reaktion auf Umwelt und Stoffwechselzeichen',
      bad: [
        'Nur dass etwas schwer ist',
        'Nur dass etwas glänzt',
        'Nur dass etwas kalt ist',
      ],
      wissen: 'Beobachtbare Kennzeichen: Wachstum, Bewegung/Reaktion, Ernährung/Atmung — nicht bloß Aussehen.',
    },
    {
      concept: 'bio:k5:kennzeichen:virus-grenze',
      q: 'Warum gelten Viren im Schulmodell oft als Grenzfall?',
      good: 'Sie haben keinen eigenen Stoffwechsel und brauchen Wirtszellen',
      bad: [
        'Sie sind immer Pflanzen',
        'Sie atmen mit Kiemen',
        'Sie sind Säugetiere',
      ],
      wissen: 'Viren zeigen keine eigenen Stoffwechselprozesse — sie nutzen Wirtszellen zur Vermehrung.',
    },
    {
      concept: 'bio:k5:kennzeichen:kristall',
      q: 'Warum ist Kristallwachstum kein Lebensmerkmal wie bei Organismen?',
      good: 'Es ist Anlagerung von Stoff — ohne Stoffwechsel und Fortpflanzung im biologischen Sinn',
      bad: [
        'Kristalle säugen ihre Jungen',
        'Kristalle haben immer Kiemen',
        'Kristalle sind Säugetiere',
      ],
      wissen:
        'Ähnliche Wörter (Wachstum) meinen bei Kristallen etwas anderes als bei Lebewesen — Kennzeichen prüfen.',
    },
    {
      concept: 'bio:k5:kennzeichen:auto',
      q: 'Warum ist ein fahrendes Auto kein Lebewesen?',
      good: 'Es hat keinen eigenen Stoffwechsel und keine Fortpflanzung als Organismus',
      bad: [
        'Weil es immer Federn hat',
        'Weil es Laich ablegt',
        'Weil es aus Zellen mit DNA besteht',
      ],
      wissen:
        'Maschinen bewegen sich und setzen Stoffe um, erfüllen aber nicht die Kennzeichen eines Organismus.',
    },
    {
      concept: 'bio:k5:kennzeichen:hefe',
      q: 'Warum zählt Hefe zu den Lebewesen?',
      good: 'Sie ist zellulär, hat Stoffwechsel und kann sich vermehren',
      bad: [
        'Weil sie aus reinem Glas besteht',
        'Weil sie keine Zellen hat',
        'Weil sie ein Steinmineral ist',
      ],
      wissen: 'Mikroorganismen wie Hefe erfüllen die Kennzeichen des Lebendigen.',
    },
    {
      concept: 'bio:k5:kennzeichen:samen',
      q: 'Warum kann ein ruhender Samen als lebendig gelten?',
      good: 'Er kann keimen — Wachstum, Stoffwechsel und Entwicklung setzen ein',
      bad: [
        'Weil Samen immer Steine sind',
        'Weil Samen nie DNA enthalten',
        'Weil Samen nur Metall sind',
      ],
      wissen: 'Überdauerungsstadien gehören zum Lebenszyklus — Kennzeichen werden bei Keimung sichtbar.',
    },
  ]
  const c = pick(rng, cases)
  return choicePickTask({
    question: c.q,
    choices: shuffleChoices(rng, [c.good, ...c.bad], c.good),
    correct: c.good,
    solution: c.good,
    explanation: c.wissen,
    instruction: 'Wähle die passende Antwort:',
    fachwissen: fw(c.wissen),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
}

function kennzeichenTf(rng: Rng) {
  const cases = [
    {
      concept: 'bio:k5:kennzeichen:tf-feuer',
      statement: 'Ein Lagerfeuer ist ein Lebewesen, weil es sich bewegt und Stoffe umsetzt.',
      correct: false,
      explanation: 'Feuer hat keinen eigenen Organismus mit Fortpflanzung und geregeltem Stoffwechsel.',
      wissen: 'Chemische Prozesse allein machen noch kein Lebewesen aus — Kennzeichen des Lebendigen fehlen.',
    },
    {
      concept: 'bio:k5:kennzeichen:tf-samen',
      statement: 'Ein ruhender Samen kann zu einem Lebewesen werden und zeigt damit Entwicklungsfähigkeit.',
      correct: true,
      explanation: 'Samen können keimen — Wachstum und Entwicklung setzen ein.',
      wissen: 'Überdauerungsstadien gehören zum Lebenszyklus vieler Organismen und zeigen Entwicklungsfähigkeit.',
    },
    {
      concept: 'bio:k5:kennzeichen:tf-kristall',
      statement: 'Kristalle „wachsen“ wie Lebewesen und erfüllen deshalb alle Lebensmerkmale.',
      correct: false,
      explanation: 'Kristallwachstum ist Anlagerung — kein Stoffwechsel und keine Fortpflanzung im biologischen Sinn.',
      wissen: 'Ähnliche Wörter (Wachstum) meinen bei Kristallen etwas anderes als bei Organismen.',
    },
    {
      concept: 'bio:k5:kennzeichen:tf-auto',
      statement: 'Ein fahrendes Auto ist ein Lebewesen, weil es sich bewegt und Kraftstoff umsetzt.',
      correct: false,
      explanation: 'Maschinen erfüllen nicht die Kennzeichen eines Organismus.',
      wissen: 'Bewegung und Stoffumsatz allein reichen nicht — ohne zellulären Organismus kein Lebewesen.',
    },
    {
      concept: 'bio:k5:kennzeichen:tf-hefe',
      statement: 'Hefezellen gelten als Lebewesen, weil sie Stoffwechsel und Vermehrung zeigen.',
      correct: true,
      explanation: 'Hefen sind Mikroorganismen mit zellulärem Aufbau.',
      wissen: 'Auch einzellige Organismen erfüllen die Kennzeichen des Lebendigen.',
    },
    {
      concept: 'bio:k5:kennzeichen:tf-rost',
      statement: 'Rostbildung an Eisen ist Fortpflanzung eines Lebewesens.',
      correct: false,
      explanation: 'Rost ist eine chemische Reaktion unbelebter Materie.',
      wissen: 'Chemische Veränderungen an Metallen sind keine biologische Fortpflanzung.',
    },
    {
      concept: 'bio:k5:kennzeichen:tf-regenwurm',
      statement: 'Ein Regenwurm ist ein Lebewesen mit Stoffwechsel und Reizbarkeit.',
      correct: true,
      explanation: 'Tiere wie der Regenwurm erfüllen die Kennzeichen des Lebendigen.',
      wissen: 'Konkrete Organismen-Beispiele helfen, belebt und unbelebt zu unterscheiden.',
    },
  ]
  const c = pick(rng, cases)
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
}

function kennzeichenMatch(rng: Rng) {
  const pool = [
    {
      term: 'keimende Bohne',
      meaning: 'Belebt — Wachstum und Stoffwechsel',
      concept: 'bio:k5:kennzeichen:paar-bohne',
    },
    {
      term: 'Regenwurm',
      meaning: 'Belebt — Organismus mit Reizbarkeit',
      concept: 'bio:k5:kennzeichen:paar-wurm',
    },
    {
      term: 'Hefezelle',
      meaning: 'Belebt — einzelliger Organismus',
      concept: 'bio:k5:kennzeichen:paar-hefe',
    },
    {
      term: 'Salzkristall',
      meaning: 'Unbelebt — kein Stoffwechsel',
      concept: 'bio:k5:kennzeichen:paar-salz',
    },
    {
      term: 'Glasstück',
      meaning: 'Unbelebt — keine Fortpflanzung',
      concept: 'bio:k5:kennzeichen:paar-glas',
    },
    {
      term: 'Quarz',
      meaning: 'Unbelebt — Mineral ohne Zellen',
      concept: 'bio:k5:kennzeichen:paar-quarz',
    },
  ]
  const size = rng() < 0.5 ? 5 : 4
  const subset = shuffle(rng, pool).slice(0, size)
  const concepts = subset.map((p) => p.concept)
  const task = matchTermsTask(rng, {
    question: `Ordne ${size} Beispiele zu: belebt oder unbelebt?`,
    terms: subset.map((p) => p.term),
    meanings: subset.map((p) => p.meaning),
    distractor: 'Photosynthese nur in Knochenmark',
    solution: subset.map((p) => `${p.term} → ${p.meaning}`).join('; '),
    explanation: 'Kennzeichen des Lebendigen prüfst du an konkreten Beispielen.',
    fachwissen: fw(
      'Kennzeichen des Lebendigen: Organismen vs. unbelebte Materie — an Beispielen wie Bohne, Wurm, Hefe gegen Glas und Kristall.',
    ),
    concept: `bio:k5:kennzeichen:match:${[...concepts].sort().join('+')}`,
  })
  return { ...task, contentIds: concepts, dedupeKey: concepts.slice().sort().join('+') }
}

function kennzeichenMulti(rng: Rng) {
  const living = ['keimende Bohne', 'Regenwurm', 'Hefezelle']
  const non = ['Glasstück', 'Salzkristall']
  return multiSelectTask({
    question: 'Welche Beispiele gelten klar als belebt (Organismen)?',
    choices: shuffle(rng, [...living, ...non]),
    correct: living,
    solution: living.join(', '),
    explanation: 'Glas und Salzkristall sind unbelebt; Bohne, Wurm und Hefe sind Organismen.',
    instruction: 'Tippe alle belebten Beispiele:',
    fachwissen: fw(
      'Kennzeichen des Lebendigen prüfst du an konkreten Beispielen: Organismus vs. unbelebte Materie.',
    ),
    dedupeKey: 'bio:k5:kennzeichen:multi-beispiele',
    contentIds: ['bio:k5:kennzeichen:multi-beispiele'],
  })
}

export const biKennzeichen: Topic['generate'] = mixedVariants(
  kennzeichenMatch,
  kennzeichenMatch,
  kennzeichenMc,
  kennzeichenTf,
  kennzeichenMulti,
  kennzeichenMc,
)

// ─── Per-group DISJOINT topic helpers (Bug B) ────────────────────────────────

function groupFeatureMc(rng: Rng, group: GroupKey) {
  const pool = FEATURES.filter((f) => f.group === group)
  const feat = pick(rng, pool)
  const wrong = shuffle(
    rng,
    FEATURES.filter((f) => f.group !== group).map((f) => f.text),
  ).slice(0, 3)
  const concept = `bio:k5:${group}:merkmal:${feat.text.slice(0, 40)}`
  return choicePickTask({
    question: `Welches Körper-/Funktionsmerkmal passt besonders zu ${GROUP_LABEL[group]}?`,
    choices: shuffleChoices(rng, [feat.text, ...wrong], feat.text),
    correct: feat.text,
    solution: feat.text,
    explanation: feat.wissen,
    instruction: 'Wähle das passende Merkmal:',
    fachwissen: fw(feat.wissen),
    dedupeKey: concept,
    contentIds: [concept],
  })
}

function groupSpeciesMc(rng: Rng, group: GroupKey) {
  const species = SPECIES.filter((s) => s.group === group)
  const s = pick(rng, species)
  const wrong = shuffle(
    rng,
    SPECIES.filter((x) => x.group !== group).map((x) => x.name),
  ).slice(0, 3)
  const concept = `bio:k5:${group}:art:${s.name.toLowerCase()}`
  return choicePickTask({
    question: `Welche Art gehört zu den ${GROUP_LABEL[group]}?`,
    choices: shuffleChoices(rng, [s.name, ...wrong], s.name),
    correct: s.name,
    solution: s.name,
    explanation: `${s.name}: ${s.note}.`,
    instruction: 'Wähle die passende Art:',
    fachwissen: fw(`${s.name} — ${s.note}. Heimische Beispiele helfen, Gruppenmerkmale abzuleiten.`),
    dedupeKey: concept,
    contentIds: [concept],
  })
}

/** Überblick-only TF — high-level group identity (NOT anatomy detail). */
function groupOverviewTf(rng: Rng, group: GroupKey) {
  const bank: Record<
    GroupKey,
    { concept: string; statement: string; correct: boolean; explanation: string; wissen: string }[]
  > = {
    fisch: [
      {
        concept: 'bio:k5:fisch:ueberblick:tf-wirbeltier',
        statement: 'Fische gehören zu den Wirbeltieren.',
        correct: true,
        explanation: 'Fische haben eine Wirbelsäule — sie sind Wirbeltiere.',
        wissen: 'Überblick: Fische sind eine Wirbeltiergruppe mit typischem Wasserleben.',
      },
      {
        concept: 'bio:k5:fisch:ueberblick:tf-insekten',
        statement: 'Forelle und Hecht sind Insekten.',
        correct: false,
        explanation: 'Forelle und Hecht sind Fische, keine Insekten.',
        wissen: 'Artenkenntnis im Überblick: heimische Beispiele den richtigen Gruppen zuordnen.',
      },
      {
        concept: 'bio:k5:fisch:ueberblick:tf-wasser',
        statement: 'Die meisten Fische leben dauerhaft im Wasser.',
        correct: true,
        explanation: 'Fische sind an das Wasserleben angepasst.',
        wissen: 'Überblick: Wasser ist der typische Lebensraum der Fische.',
      },
      {
        concept: 'bio:k5:fisch:ueberblick:tf-fell',
        statement: 'Fische haben typischerweise dichtes Fell und säugen ihre Jungen.',
        correct: false,
        explanation: 'Fell und Säugen kennzeichnen Säugetiere, nicht Fische.',
        wissen: 'Gruppen im Überblick unterscheiden: Fische ≠ Säuger.',
      },
      {
        concept: 'bio:k5:fisch:ueberblick:tf-karpfen',
        statement: 'Karpfen und Barsch sind Beispiele für Fische.',
        correct: true,
        explanation: 'Karpfen und Barsch gehören zu den Fischen.',
        wissen: 'Heimische Beispiele stärken die Gruppenzuordnung im Überblick.',
      },
      {
        concept: 'bio:k5:fisch:ueberblick:tf-flug',
        statement: 'Fische fliegen typischerweise mit Federflügeln.',
        correct: false,
        explanation: 'Federn und Flug gehören zu den Vögeln.',
        wissen: 'Überblick: Fische bewegen sich schwimmend im Wasser.',
      },
    ],
    lurch: [
      {
        concept: 'bio:k5:lurch:ueberblick:tf-wirbeltier',
        statement: 'Lurche (Amphibien) gehören zu den Wirbeltieren.',
        correct: true,
        explanation: 'Lurche sind Wirbeltiere mit oft feuchtem Lebensraumbezug.',
        wissen: 'Überblick: Lurche sind eine eigene Wirbeltiergruppe neben Fischen und Kriechtieren.',
      },
      {
        concept: 'bio:k5:lurch:ueberblick:tf-vogel',
        statement: 'Erdkröte und Grasfrosch sind Vögel.',
        correct: false,
        explanation: 'Kröte und Frosch sind Lurche.',
        wissen: 'Artenkenntnis: heimische Lurche wie Frosch und Kröte korrekt der Wirbeltiergruppe zuordnen.',
      },
      {
        concept: 'bio:k5:lurch:ueberblick:tf-amphibien',
        statement: 'Lurche werden auch Amphibien genannt.',
        correct: true,
        explanation: 'Amphibien ist die wissenschaftliche Bezeichnung für Lurche.',
        wissen: 'Überblick: Lurche werden fachsprachlich auch Amphibien genannt — eine eigene Wirbeltiergruppe.',
      },
      {
        concept: 'bio:k5:lurch:ueberblick:tf-ozean',
        statement: 'Alle erwachsenen Lurche leben ausschließlich im offenen Ozean.',
        correct: false,
        explanation: 'Viele erwachsene Lurche leben an Land, brauchen aber Feuchtigkeit und Laichgewässer.',
        wissen: 'Überblick Lurche: Viele Adulttiere leben an Land, brauchen aber Feuchtigkeit und Laichgewässer.',
      },
      {
        concept: 'bio:k5:lurch:ueberblick:tf-molch',
        statement: 'Teichmolch und Feuersalamander sind Lurche.',
        correct: true,
        explanation: 'Molche und Salamander gehören zu den Schwanzlurchen.',
        wissen: 'Artenkenntnis im Überblick: heimische Lurche wie Molch und Salamander korrekt zuordnen.',
      },
      {
        concept: 'bio:k5:lurch:ueberblick:tf-hornpanzer',
        statement: 'Lurche tragen typischerweise einen trockenen Hornpanzer wie Schildkröten.',
        correct: false,
        explanation: 'Trockene Hornschicht/Panzer ist typisch für Kriechtiere.',
        wissen: 'Gruppenunterscheidung im Überblick: Lurche haben feuchte Haut, keine trockene Hornschicht wie Kriechtiere.',
      },
    ],
    kriechtier: [
      {
        concept: 'bio:k5:kriechtier:ueberblick:tf-wirbeltier',
        statement: 'Kriechtiere (Reptilien) gehören zu den Wirbeltieren.',
        correct: true,
        explanation: 'Kriechtiere sind landlebende Wirbeltiere.',
        wissen: 'Überblick: Kriechtiere bilden eine eigene Wirbeltiergruppe.',
      },
      {
        concept: 'bio:k5:kriechtier:ueberblick:tf-fisch',
        statement: 'Zauneidechse und Ringelnatter sind Fische.',
        correct: false,
        explanation: 'Eidechse und Natter sind Kriechtiere.',
        wissen: 'Artenkenntnis im Überblick: heimische Beispiele den richtigen Wirbeltiergruppen zuordnen.',
      },
      {
        concept: 'bio:k5:kriechtier:ueberblick:tf-reptilien',
        statement: 'Kriechtiere werden auch Reptilien genannt.',
        correct: true,
        explanation: 'Reptilien ist die wissenschaftliche Bezeichnung.',
        wissen: 'Überblick: Kriechtiere werden fachsprachlich auch Reptilien genannt — eigene Wirbeltiergruppe.',
      },
      {
        concept: 'bio:k5:kriechtier:ueberblick:tf-kiemenfortpflanzung',
        statement: 'Kriechtiere können sich nur mit Kiemen im Wasser fortpflanzen.',
        correct: false,
        explanation: 'Kriechtiere pflanzen sich typischerweise an Land fort (innere Befruchtung, Eier).',
        wissen: 'Überblick: Kriechtiere sind in der Fortpflanzung vom offenen Wasser unabhängiger als Fische.',
      },
      {
        concept: 'bio:k5:kriechtier:ueberblick:tf-eidechse',
        statement: 'Waldeidechse und Blindschleiche sind Kriechtiere.',
        correct: true,
        explanation: 'Beide sind heimische Kriechtiere (Echsen).',
        wissen: 'Artenkenntnis im Überblick: heimische Echsen korrekt den Kriechtieren zuordnen.',
      },
      {
        concept: 'bio:k5:kriechtier:ueberblick:tf-saeugen',
        statement: 'Kriechtiere säugen ihre Jungen mit Milch.',
        correct: false,
        explanation: 'Säugen ist das Kennzeichen der Säugetiere.',
        wissen: 'Gruppenunterscheidung im Überblick: Säugen gehört zu Säugern, nicht zu Kriechtieren.',
      },
    ],
    vogel: [
      {
        concept: 'bio:k5:vogel:ueberblick:tf-wirbeltier',
        statement: 'Vögel gehören zu den Wirbeltieren.',
        correct: true,
        explanation: 'Vögel sind gleichwarme Wirbeltiere.',
        wissen: 'Überblick: Vögel sind eine Wirbeltiergruppe mit Federkleid und typischerweise Flugvermögen.',
      },
      {
        concept: 'bio:k5:vogel:ueberblick:tf-saeuger',
        statement: 'Amsel und Kohlmeise sind Säugetiere.',
        correct: false,
        explanation: 'Amsel und Meise sind Vögel.',
        wissen: 'Artenkenntnis: Singvögel wie Amsel und Kohlmeise korrekt den Vögeln zuordnen.',
      },
      {
        concept: 'bio:k5:vogel:ueberblick:tf-federn',
        statement: 'Federn sind ein typisches Kennzeichen der Vögel.',
        correct: true,
        explanation: 'Nur Vögel haben ein Federkleid.',
        wissen: 'Überblick Vögel: Das Federkleid ist das klare Gruppenmerkmal und unterscheidet sie von Säugern und Kriechtieren.',
      },
      {
        concept: 'bio:k5:vogel:ueberblick:tf-kiemen',
        statement: 'Erwachsene Vögel atmen typischerweise über Kiemen.',
        correct: false,
        explanation: 'Vögel atmen mit Lungen (und Luftsäcken).',
        wissen: 'Überblick Vögel: Atmung über Lungen und Luftsäcke — keine Kiemenatmung wie bei Fischen.',
      },
      {
        concept: 'bio:k5:vogel:ueberblick:tf-zug',
        statement: 'Mauersegler und Stockente sind Beispiele für Vögel.',
        correct: true,
        explanation: 'Beide gehören zu den Vögeln.',
        wissen: 'Artenkenntnis im Überblick: heimische und häufige Vögel korrekt der Wirbeltiergruppe zuordnen.',
      },
      {
        concept: 'bio:k5:vogel:ueberblick:tf-schuppenpanzer',
        statement: 'Vögel tragen einen trockenen Schuppenpanzer statt Federn.',
        correct: false,
        explanation: 'Federn kennzeichnen Vögel; Schuppen/Hornschicht eher Kriechtiere.',
        wissen: 'Gruppenunterscheidung im Überblick: Federn = Vögel, Hornschicht = Kriechtiere, Fell = Säuger.',
      },
      {
        concept: 'bio:k5:vogel:ueberblick:tf-gleichwarm',
        statement: 'Vögel sind typischerweise gleichwarm.',
        correct: true,
        explanation: 'Gleichwarme Tiere halten ihre Körpertemperatur aktiv konstant.',
        wissen: 'Überblick Vögel: Gleichwarmsein unterstützt Flug und hohen Stoffwechsel.',
      },
      {
        concept: 'bio:k5:vogel:ueberblick:tf-eier',
        statement: 'Vögel legen typischerweise Eier mit kalkhaltiger Schale.',
        correct: true,
        explanation: 'Die meisten Vögel sind eierlegend.',
        wissen: 'Überblick Fortpflanzung: Vogeleier mit Schale — typisches Gruppenmerkmal.',
      },
      {
        concept: 'bio:k5:vogel:ueberblick:tf-fell',
        statement: 'Vögel haben typischerweise dichtes Fell statt Federn.',
        correct: false,
        explanation: 'Fell kennzeichnet Säugetiere; Vögel haben Federn.',
        wissen: 'Körperbedeckung im Überblick: Federn = Vögel, Haare/Fell = Säuger.',
      },
      {
        concept: 'bio:k5:vogel:ueberblick:tf-specht',
        statement: 'Buntspecht und Blaumeise sind Beispiele für Vögel.',
        correct: true,
        explanation: 'Beide gehören zu den Vögeln.',
        wissen: 'Artenkenntnis im Überblick: weitere heimische Vögel korrekt zuordnen.',
      },
    ],
    saeuger: [
      {
        concept: 'bio:k5:saeuger:ueberblick:tf-wirbeltier',
        statement: 'Säugetiere gehören zu den Wirbeltieren.',
        correct: true,
        explanation: 'Säugetiere sind Wirbeltiere mit Säugen der Jungen.',
        wissen: 'Überblick: Säugetiere sind eine Wirbeltiergruppe mit Fell und Säugen der Nachkommen.',
      },
      {
        concept: 'bio:k5:saeuger:ueberblick:tf-milch',
        statement: 'Säugetiere ernähren ihre Jungen typischerweise mit Milch.',
        correct: true,
        explanation: 'Säugen ist namengebend für die Gruppe.',
        wissen: 'Überblick Säuger: Milchdrüsen ernähren die Jungen — darum heißt die Gruppe Säugetiere.',
      },
      {
        concept: 'bio:k5:saeuger:ueberblick:tf-gleichwarm',
        statement: 'Säugetiere sind typischerweise gleichwarm und halten eine hohe Körpertemperatur.',
        correct: true,
        explanation: 'Gleichwarmsein ist ein zentrales Säugermerkmal neben Fell und Säugen.',
        wissen:
          'Überblick Säuger: Gleichwarm, Haare/Fell und Säugen der Jungen kennzeichnen die Gruppe gegenüber wechselwarmen Wirbeltieren.',
      },
      {
        concept: 'bio:k5:saeuger:ueberblick:tf-laich',
        statement: 'Säugetiere legen typischerweise Laich im Wasser wie Fische.',
        correct: false,
        explanation: 'Die meisten Säuger sind lebendgebärend und säugen — kein Fischlaich.',
        wissen: 'Gruppenunterscheidung im Überblick: Säuger sind meist lebendgebärend, Fische laichen oft im Wasser.',
      },
      {
        concept: 'bio:k5:saeuger:ueberblick:tf-igel',
        statement: 'Igel und Fledermaus sind Säugetiere.',
        correct: true,
        explanation: 'Beide säugen ihre Jungen; die Fledermaus fliegt mit Flughaut.',
        wissen: 'Artenkenntnis im Überblick — auch ungewöhnliche Säuger wie Fledermaus gehören zur Gruppe.',
      },
      {
        concept: 'bio:k5:saeuger:ueberblick:tf-federn',
        statement: 'Säugetiere haben typischerweise ein Federkleid.',
        correct: false,
        explanation: 'Federn kennzeichnen Vögel; Säuger haben Haare/Fell.',
        wissen: 'Gruppenunterscheidung im Überblick: Säuger haben Haare/Fell, Vögel ein Federkleid.',
      },
    ],
  }
  const c = pick(rng, bank[group])
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
}

/** Merkmale-only TF — anatomy / Angepasstheit (NOT overview species). */
function groupMerkmaleTf(rng: Rng, group: GroupKey) {
  const bank: Record<
    GroupKey,
    { concept: string; statement: string; correct: boolean; explanation: string; wissen: string }[]
  > = {
    fisch: [
      {
        concept: 'bio:k5:fisch:merkmale:tf-stromlinie',
        statement: 'Die Stromlinienform der Fische ist eine Angepasstheit an das Schwimmen.',
        correct: true,
        explanation: 'Stromlinienform verringert den Wasserwiderstand.',
        wissen: 'Körperbau passt zum Lebensraum Wasser — Stromlinienform spart Energie beim Schwimmen.',
      },
      {
        concept: 'bio:k5:fisch:merkmale:tf-lungen',
        statement: 'Fische atmen typischerweise mit Lungen an Land.',
        correct: false,
        explanation: 'Fische atmen über Kiemen im Wasser.',
        wissen: 'Kiemen entziehen dem Wasser Sauerstoff — typische Angepasstheit der Fische.',
      },
      {
        concept: 'bio:k5:fisch:merkmale:tf-seitenlinie',
        statement: 'Die Seitenlinie hilft Fischen, Bewegungen und Strömung im Wasser wahrzunehmen.',
        correct: true,
        explanation: 'Die Seitenlinie ist ein Sinnesorgan der Fische.',
        wissen: 'Über die Seitenlinie registrieren Fische Druckwellen — wichtig für Orientierung und Beutefang.',
      },
      {
        concept: 'bio:k5:fisch:merkmale:tf-schwimmblase',
        statement: 'Viele Knochenfische nutzen eine Schwimmblase zur Auftriebsregulation.',
        correct: true,
        explanation: 'Die Schwimmblase ermöglicht Schweben ohne ständiges Schwimmen.',
        wissen: 'Schwimmblase: Angepasstheit an das Schweben in unterschiedlichen Wassertiefen.',
      },
      {
        concept: 'bio:k5:fisch:merkmale:tf-federn',
        statement: 'Fische haben typischerweise ein Federkleid statt Schuppen.',
        correct: false,
        explanation: 'Federn kennzeichnen Vögel; Fische haben oft Schuppen und Schleimhaut.',
        wissen: 'Körperbedeckung der Fische: Schuppen und Schleim — keine Federn.',
      },
      {
        concept: 'bio:k5:fisch:merkmale:tf-befruchtung',
        statement: 'Bei vielen Fischen findet die Befruchtung äußerlich im Wasser statt.',
        correct: true,
        explanation: 'Eier und Samen werden oft ins Wasser abgegeben.',
        wissen: 'Äußere Befruchtung ist bei vielen Fischarten typisch und an das Wasserleben gebunden.',
      },
      {
        concept: 'bio:k5:fisch:merkmale:tf-flossen',
        statement: 'Flossen dienen nur der Atmung, nie der Steuerung.',
        correct: false,
        explanation: 'Flossen dienen Vortrieb, Steuerung und Stabilität.',
        wissen: 'Flossen sind Bewegungsorgane — Angepasstheit an das Schwimmen.',
      },
      {
        concept: 'bio:k5:fisch:merkmale:tf-schleim',
        statement: 'Schleim auf der Fischhaut verringert den Reibungswiderstand im Wasser.',
        correct: true,
        explanation: 'Schleimhaut schützt und gleitet.',
        wissen: 'Schleimschicht: Schutz und geringerer Wasserwiderstand — Bau und Funktion.',
      },
    ],
    lurch: [
      {
        concept: 'bio:k5:lurch:merkmale:tf-meta',
        statement: 'Viele Lurche durchlaufen eine Metamorphose.',
        correct: true,
        explanation: 'Kaulquappe → Frosch ist das klassische Beispiel.',
        wissen: 'Metamorphose verbindet Wasserlarve und landlebendes Adulttier.',
      },
      {
        concept: 'bio:k5:lurch:merkmale:tf-horn',
        statement: 'Lurche haben eine trockene Hornschicht wie Kriechtiere.',
        correct: false,
        explanation: 'Lurche haben feuchte, drüsenreiche Haut (Feuchtlufttiere).',
        wissen: 'Feuchte Haut ermöglicht Hautatmung.',
      },
    ],
    kriechtier: [
      {
        concept: 'bio:k5:kriechtier:merkmale:tf-trocken',
        statement: 'Kriechtiere sind typische Trockenlufttiere mit Lungenatmung.',
        correct: true,
        explanation: 'Hornschicht und Lungen passen zum Landleben.',
        wissen: 'Trockene Haut, innere Befruchtung, Eiablage an Land.',
      },
      {
        concept: 'bio:k5:kriechtier:merkmale:tf-wasser',
        statement: 'Heimische Kriechtiere brauchen zur Fortpflanzung zwingend offenes Wasser wie Fische.',
        correct: false,
        explanation: 'Kriechtiere legen Eier an Land; innere Befruchtung.',
        wissen: 'Kriechtiere sind unabhängiger vom Wasser als Fische/Lurche.',
      },
    ],
    vogel: [
      {
        concept: 'bio:k5:vogel:merkmale:tf-luftsacke',
        statement: 'Luftsäcke unterstützen den effizienten Gasaustausch beim Fliegen.',
        correct: true,
        explanation: 'Vögel haben Lunge plus Luftsäcke.',
        wissen: 'Atmungsorgane sind an den Flug angepasst.',
      },
      {
        concept: 'bio:k5:vogel:merkmale:tf-nestfluechter',
        statement: 'Alle Vögel sind Nestflüchter und verlassen das Nest sofort nach dem Schlüpfen.',
        correct: false,
        explanation: 'Es gibt Nesthocker und Nestflüchter.',
        wissen: 'Brutpflegeverhalten unterscheidet sich.',
      },
    ],
    saeuger: [
      {
        concept: 'bio:k5:saeuger:merkmale:tf-saeugen',
        statement: 'Säugetiere säugen ihre Nachkommen mit Milch.',
        correct: true,
        explanation: 'Das Säugen ist namensgebend für die Gruppe.',
        wissen: 'Fell, Säugen und meist lebendgebärend zeichnen Säugetiere aus.',
      },
      {
        concept: 'bio:k5:saeuger:merkmale:tf-fell',
        statement: 'Säugetiere haben typischerweise Federn statt Haare.',
        correct: false,
        explanation: 'Säugetiere haben Haare/Fell — Federn kennzeichnen Vögel.',
        wissen: 'Körperbedeckung ist ein Leitmerkmal der Gruppen.',
      },
    ],
  }
  const c = pick(rng, bank[group])
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
    dedupeKey: c.concept,
    contentIds: [c.concept],
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
  const concept = `bio:k5:${group}:merkmale:multi:${correct.join('|').slice(0, 48)}`
  return multiSelectTask({
    question: `Welche Bau- und Funktionsmerkmale gehören zu ${GROUP_LABEL[group]}?`,
    choices: shuffle(rng, [...correct, ...wrong]),
    correct,
    solution: correct.join('; '),
    explanation: `Typisch für ${GROUP_LABEL[group]}: ${correct.join('; ')}.`,
    instruction: 'Tippe alle passenden Merkmale:',
    fachwissen: fw(
      `Leite Gruppenmerkmale aus heimischen Arten ab (Vielfalt und Angepasstheit).`,
    ),
    dedupeKey: concept,
    contentIds: [concept],
  })
}

function groupSchutzMc(rng: Rng, group: GroupKey) {
  const tips: Record<
    GroupKey,
    { concept: string; q: string; good: string; bad: string[]; wissen: string }[]
  > = {
    fisch: [
      {
        concept: 'bio:k5:fisch:schutz:lebensraum',
        q: 'Was schützt Fischbestände nachhaltig?',
        good: 'Erhalt von Lebensräumen und guter Wasserqualität',
        bad: [
          'Einleiten ungeklärter Abwässer',
          'Zerstören von Laichplätzen',
          'Überfischung ohne Schonzeiten',
        ],
        wissen: 'Schutz heißt: Gewässerqualität und Lebensräume erhalten.',
      },
      {
        concept: 'bio:k5:fisch:schutz:schonzeit',
        q: 'Welche Regel schützt laichende Fische besonders?',
        good: 'Schonzeiten und geschützte Laichplätze einhalten',
        bad: [
          'Laichplätze trockenlegen',
          'Jede Menge Dünger direkt ins Gewässer',
          'Netze in Schongebieten ohne Kontrolle',
        ],
        wissen: 'Schonzeiten sichern die Fortpflanzung der Bestände.',
      },
    ],
    lurch: [
      {
        concept: 'bio:k5:lurch:schutz:laich',
        q: 'Was hilft dem Schutz heimischer Lurche?',
        good: 'Laichgewässer und Wanderwege erhalten / vernetzen',
        bad: [
          'Tümpel zuschütten',
          'Straßen ohne Amphibienschutz zur Wanderzeit',
          'Feuchtgebiete trocknen',
        ],
        wissen: 'Lurche brauchen feuchte Lebensräume und sichere Wanderungen.',
      },
      {
        concept: 'bio:k5:lurch:schutz:zaun',
        q: 'Wozu dienen Amphibienschutzzäune an Straßen?',
        good: 'Wandernde Lurche vor dem Überfahren schützen und ableiten',
        bad: [
          'Fische im Bach fangen',
          'Vögel am Nest stören',
          'Kriechtiere in Terrarien sammeln',
        ],
        wissen: 'Zur Laichzeit queren viele Lurche Straßen — Zäune und Leitungen retten Tiere.',
      },
    ],
    kriechtier: [
      {
        concept: 'bio:k5:kriechtier:schutz:habitat',
        q: 'Welche Maßnahme schützt heimische Kriechtiere?',
        good: 'Sonnige Lebensräume und Verstecke erhalten',
        bad: [
          'Alle Totholzhaufen entfernen',
          'Habitate zersiedeln ohne Ausgleich',
          'Wildfang für Terrarien ohne Genehmigung',
        ],
        wissen: 'Artenschutz: Lebensräume (Trockenrasen, Lesesteinhaufen) erhalten.',
      },
    ],
    vogel: [
      {
        concept: 'bio:k5:vogel:schutz:nisthilfe',
        q: 'Was unterstützt den Schutz heimischer Vögel?',
        good: 'Lebensräume erhalten und artgerechte Nisthilfen',
        bad: [
          'Hecken im Brutgeschäft radikal entfernen',
          'Dauerhafte Störung an Brutplätzen',
          'Giftköder auslegen',
        ],
        wissen: 'Schutz der Lebensräume und verantwortungsvoller Umgang in der Brutzeit.',
      },
    ],
    saeuger: [
      {
        concept: 'bio:k5:saeuger:schutz:vernetzung',
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
    dedupeKey: tip.concept,
    contentIds: [tip.concept],
  })
}

function groupSchutzTf(rng: Rng, group: GroupKey) {
  const bank: Record<
    GroupKey,
    { concept: string; statement: string; correct: boolean; explanation: string; wissen: string }[]
  > = {
    fisch: [
      {
        concept: 'bio:k5:fisch:schutz:tf-abwasser',
        statement: 'Ungeklärte Abwässer verbessern langfristig die Fischbestände.',
        correct: false,
        explanation: 'Schlechte Wasserqualität schädigt Fische und Laichplätze.',
        wissen:
          'Gewässerschutz ist Artenschutz: Sauberes Wasser, intakte Ufer und Laichplätze sichern nachhaltige Fischbestände in Sachsen.',
      },
    ],
    lurch: [
      {
        concept: 'bio:k5:lurch:schutz:tf-tuempel',
        statement: 'Das Zuschütten kleiner Tümpel gefährdet viele Lurcharten.',
        correct: true,
        explanation: 'Laichgewässer sind unverzichtbar.',
        wissen:
          'Viele Lurche brauchen kleine Gewässer zum Laichen. Wer Tümpel zuschüttet, zerstört Fortpflanzungsorte und gefährdet ganze Populationen.',
      },
    ],
    kriechtier: [
      {
        concept: 'bio:k5:kriechtier:schutz:tf-totholz',
        statement: 'Totholz- und Steinhaufen können als Verstecke für Kriechtiere wichtig sein.',
        correct: true,
        explanation: 'Strukturen bieten Wärme und Schutz.',
        wissen:
          'Kriechtiere nutzen sonnige Plätze und Verstecke aus Stein oder Totholz. Solche Kleinstrukturen im Lebensraum zu erhalten ist praktischer Artenschutz.',
      },
    ],
    vogel: [
      {
        concept: 'bio:k5:vogel:schutz:tf-brut',
        statement: 'Heckenrodung mitten in der Brutzeit ist unproblematisch für Vögel.',
        correct: false,
        explanation: 'Brutgeschäft wird gestört, Gelege können verloren gehen.',
        wissen:
          'In der Brutzeit stören Eingriffe an Hecken und Gehölzen Nester und Jungvögel. Rücksicht und zeitliche Schonung sind wirksamer Vogelschutz.',
      },
    ],
    saeuger: [
      {
        concept: 'bio:k5:saeuger:schutz:tf-korridor',
        statement: 'Vernetzte Lebensräume (Korridore) helfen wandernden Säugetieren.',
        correct: true,
        explanation: 'Zerschneidung isoliert Populationen.',
        wissen:
          'Biotopverbund verbindet Teillebensräume. Ohne Korridore bleiben Populationen isoliert und anfälliger für lokale Störungen oder Verluste.',
      },
    ],
  }
  const c = pick(rng, bank[group])
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
}

/** Lebensraum-only content (habitat / Nahrung) — not features/schutz/species. */
function groupLebensraumTf(rng: Rng, group: GroupKey) {
  const bank: Record<
    GroupKey,
    { concept: string; statement: string; correct: boolean; explanation: string; wissen: string }[]
  > = {
    fisch: [
      {
        concept: 'bio:k5:fisch:lebensraum:tf-wasser',
        statement: 'Der typische Lebensraum der meisten Fische ist das Wasser.',
        correct: true,
        explanation: 'Fische sind an das Wasserleben angepasst.',
        wissen: 'Lebensraum Wasser prägt Atmung, Bewegung und Fortpflanzung der Fische.',
      },
      {
        concept: 'bio:k5:fisch:lebensraum:tf-wueste',
        statement: 'Die meisten Knochenfische leben dauerhaft in der Wüste ohne Wasser.',
        correct: false,
        explanation: 'Ohne Wasser kein typisches Fischleben.',
        wissen: 'Lebensraum und Angepasstheit gehören zusammen.',
      },
    ],
    lurch: [
      {
        concept: 'bio:k5:lurch:lebensraum:tf-feucht',
        statement: 'Viele Lurche sind an feuchte Lebensräume gebunden.',
        correct: true,
        explanation: 'Feuchte Haut und oft Wasserlarven erfordern Feuchtigkeit.',
        wissen: 'Lebensraum Feuchtgebiet / Gewässerrand.',
      },
    ],
    kriechtier: [
      {
        concept: 'bio:k5:kriechtier:lebensraum:tf-land',
        statement: 'Heimische Kriechtiere nutzen oft sonnige Landlebensräume.',
        correct: true,
        explanation: 'Als Wechselwarme brauchen sie Sonnenplätze.',
        wissen: 'Trockenrasen, Säume und Steinstrukturen sind typische Habitate.',
      },
    ],
    vogel: [
      {
        concept: 'bio:k5:vogel:lebensraum:tf-luft',
        statement: 'Viele Vögel nutzen den Luftraum zum Fliegen und verschiedene Biotope zum Brüten.',
        correct: true,
        explanation: 'Flug und Brutplatz gehören zum Lebensraumbezug.',
        wissen: 'Lebensraum umfasst Nahrung, Brut und Zugwege.',
      },
    ],
    saeuger: [
      {
        concept: 'bio:k5:saeuger:lebensraum:tf-vielfalt',
        statement: 'Säugetiere besiedeln sehr unterschiedliche Lebensräume (Wald, Feld, Wasser, Luft).',
        correct: true,
        explanation: 'Von Maulwurf bis Fledermaus — große Habitatvielfalt.',
        wissen: 'Angepasstheit der Gliedmaßen spiegelt den Lebensraum wider.',
      },
    ],
  }
  const c = pick(rng, bank[group])
  return trueFalse(rng, {
    statement: c.statement,
    correct: c.correct,
    explanation: c.explanation,
    fachwissen: fw(c.wissen),
    dedupeKey: c.concept,
    contentIds: [c.concept],
  })
}

function groupLebensraumMc(rng: Rng, group: GroupKey) {
  const tips: Record<
    GroupKey,
    { concept: string; q: string; good: string; bad: string[]; wissen: string }[]
  > = {
    fisch: [
      {
        concept: 'bio:k5:fisch:lebensraum:sauerstoff',
        q: 'Was ist für Fische im Gewässer besonders wichtig?',
        good: 'Ausreichend gelöster Sauerstoff und geeignete Temperatur',
        bad: [
          'Nur trockene Steppenluft',
          'Nur Nestkästen in Bäumen',
          'Nur Winterfütterung mit Brotkrumen an Land',
        ],
        wissen: 'Abiotische Faktoren im Wasser bestimmen, welche Fische wo leben können.',
      },
    ],
    lurch: [
      {
        concept: 'bio:k5:lurch:lebensraum:laichgewaesser',
        q: 'Welcher Lebensraum ist für viele Froschlurche zur Fortpflanzung zentral?',
        good: 'Laichgewässer (Tümpel, Weiher) plus umliegende Landhabitate',
        bad: [
          'Nur Hochgebirgsgletscher ohne Wasser',
          'Nur Meeresboden in 2000 m Tiefe',
          'Nur Wüsten ohne Feuchtigkeit',
        ],
        wissen: 'Laichgewässer und Landlebensraum bilden zusammen den Jahreslebensraum.',
      },
    ],
    kriechtier: [
      {
        concept: 'bio:k5:kriechtier:lebensraum:sonne',
        q: 'Warum sind sonnige Plätze für Kriechtiere wichtig?',
        good: 'Als Wechselwarme nutzen sie Sonne zur Aktivitätssteuerung',
        bad: [
          'Weil sie Kiemen trocknen müssen',
          'Weil sie Federn wärmen',
          'Weil sie Milch produzieren',
        ],
        wissen: 'Verhaltensweisen wie Sonnenbaden hängen mit dem Temperaturhaushalt zusammen.',
      },
    ],
    vogel: [
      {
        concept: 'bio:k5:vogel:lebensraum:brut',
        q: 'Was gehört typischerweise zum Lebensraum eines Brutvogels?',
        good: 'Geeigneter Nistplatz plus Nahrungsflächen in erreichbarer Nähe',
        bad: [
          'Nur ein Aquarium ohne Land',
          'Nur ein steinernes Labyrinth ohne Pflanzen',
          'Nur ein dunkler Keller ohne Zugang',
        ],
        wissen: 'Brut- und Nahrungsraum müssen zusammenpassen.',
      },
    ],
    saeuger: [
      {
        concept: 'bio:k5:saeuger:lebensraum:deckung',
        q: 'Was brauchen viele Säugetiere in der Kulturlandschaft?',
        good: 'Deckung, Vernetzung und ungestörte Rückzugsräume',
        bad: [
          'Nur Kiemenwasser ohne Unterschlupf',
          'Nur Nestkästen ausschließlich für Fische',
          'Nur dauerhafte Beleuchtung ohne Schatten',
        ],
        wissen: 'Strukturreiche Landschaften sichern Lebensräume.',
      },
    ],
  }
  const tip = pick(rng, tips[group])
  return choicePickTask({
    question: tip.q,
    choices: shuffleChoices(rng, [tip.good, ...tip.bad], tip.good),
    correct: tip.good,
    solution: tip.good,
    explanation: tip.wissen,
    instruction: 'Wähle die passende Antwort:',
    fachwissen: fw(tip.wissen),
    dedupeKey: tip.concept,
    contentIds: [tip.concept],
  })
}

// Group-specific Spezial extras (only used in their own topic)

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
    concept: 'bio:k5:fisch:lebensraum:nahrungskette',
  })
}

function fischeBauMatch(rng: Rng) {
  const pool = [
    {
      term: 'Kiemen',
      meaning: 'Gasaustausch im Wasser',
      wissen: 'Kiemen entziehen dem Wasser Sauerstoff.',
      concept: 'bio:k5:fisch:merkmale:paar-kiemen',
    },
    {
      term: 'Flossen',
      meaning: 'Steuerung und Vortrieb beim Schwimmen',
      wissen: 'Flossen dienen Antrieb, Steuerung und Stabilität.',
      concept: 'bio:k5:fisch:merkmale:paar-flossen',
    },
    {
      term: 'Schuppen',
      meaning: 'Äußerer Schutz der Körperoberfläche',
      wissen: 'Schuppen schützen die Haut und verringern Verletzungen.',
      concept: 'bio:k5:fisch:merkmale:paar-schuppen',
    },
    {
      term: 'Schwimmblase',
      meaning: 'Auftriebsregulation (viele Knochenfische)',
      wissen: 'Die Schwimmblase hilft, ohne ständiges Schwimmen in der Tiefe zu schweben.',
      concept: 'bio:k5:fisch:merkmale:paar-schwimmblase',
    },
    {
      term: 'Seitenlinie',
      meaning: 'Wahrnehmung von Wasserbewegungen',
      wissen: 'Die Seitenlinie registriert Druckwellen und Strömung.',
      concept: 'bio:k5:fisch:merkmale:paar-seitenlinie',
    },
    {
      term: 'Schleimhaut',
      meaning: 'Verringert Reibung und schützt',
      wissen: 'Schleim auf der Haut vermindert den Wasserwiderstand.',
      concept: 'bio:k5:fisch:merkmale:paar-schleim',
    },
  ]
  const size = rng() < 0.55 ? 4 : 5
  const subset = shuffle(rng, pool).slice(0, size)
  const concepts = subset.map((p) => p.concept)
  const task = matchTermsTask(rng, {
    question: `Ordne ${size} Bau- und Funktionsbegriffe bei Fischen zu.`,
    terms: subset.map((p) => p.term),
    meanings: subset.map((p) => p.meaning),
    distractor: 'Aufnahme von Luftsauerstoff wie bei Säugern',
    solution: subset.map((p) => `${p.term}→${p.meaning}`).join('; '),
    explanation: subset.map((p) => p.wissen).join(' '),
    fachwissen: fw(
      'Körpergliederung und äußerer Bau der Fische: Stromlinienform, Flossen, Schleimhaut, Schuppen, Kiemen, Seitenlinie, Schwimmblase.',
    ),
    concept: `bio:k5:fisch:merkmale:bau:${[...concepts].sort().join('+')}`,
  })
  return { ...task, contentIds: concepts, dedupeKey: concepts.slice().sort().join('+') }
}

function lurcheMetaSort(rng: Rng) {
  const steps = ['Laich im Wasser', 'Kaulquappe mit Kiemen', 'Beine wachsen', 'Landlebender Frosch']
  return withConcept(
    dragDropSortTask({
      question: 'Ordne die Metamorphose eines Froschlurchs von früh nach spät.',
      items: steps.map((label, value) => ({ label, value })),
      correctOrder: [0, 1, 2, 3],
      solution: steps.join(' → '),
      explanation: 'Aus dem Laich wird die wasserlebende Larve; später entsteht das landlebende Adulttier.',
      rng,
      fachwissen: fw(
        'Fortpflanzung der Lurche: äußere Befruchtung, Metamorphose, Wanderung zu Laichgewässern.',
      ),
    }),
    'bio:k5:lurch:meta:sort-phasen',
  )
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
    concept: 'bio:k5:lurch:merkmale:begriffe',
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
    concept: 'bio:k5:kriechtier:merkmale:zuordnung',
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
    concept: `bio:k5:vogel:fortpflanzung:schnabel:${three.map((p) => p.form.slice(0, 12)).join('+')}`,
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
    concept: 'bio:k5:vogel:flug:zuordnung',
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
    distractors: ['Nur Barten'],
    solution: 'Fleisch- / Pflanzen- / Allesfresser',
    explanation: 'Gebissform zeigt die Angepasstheit an die Nahrung.',
    fachwissen: fw(
      'Säugetiere: Fell, Säugen, gleichwarm; Angepasstheit von Gliedmaßen und Gebiss an Lebensraum und Nahrung.',
    ),
    concept: 'bio:k5:saeuger:merkmale:gebiss',
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
    concept: 'bio:k5:saeuger:angepasst:gliedmassen',
  })
}

/**
 * DISJOINT topic factories — Überblick never reuses Merkmale/Lebensraum/Schutz pools.
 * Each sibling topic needs its own rich unique pool so rounds of ~10 stay normal.
 */
function makeOverviewTopic(group: GroupKey): Topic['generate'] {
  // Species ID + high-level TF + Arten-Zuordnung. No feature/schutz/lebensraum bleed.
  const speciesMatch = (rng: Rng) => {
    const species = SPECIES.filter((s) => s.group === group)
    const size = Math.min(5, Math.max(3, species.length))
    const subset = shuffle(rng, species).slice(0, size)
    const concepts = subset.map((s) => `bio:k5:${group}:art:${s.name.toLowerCase()}`)
    const matchId = `bio:k5:${group}:ueberblick:arten-match:${[...concepts].sort().join('+')}`
    const task = matchTermsTask(rng, {
      question: `Ordne ${size} Arten der Gruppe ${GROUP_LABEL[group]} ihren Kurzinfos zu.`,
      terms: subset.map((s) => s.name),
      meanings: subset.map((s) => s.note),
      distractor: 'Typisches Insekt mit genau sechs Beinen',
      solution: subset.map((s) => `${s.name} → ${s.note}`).join('; '),
      explanation: subset.map((s) => `${s.name}: ${s.note}`).join(' '),
      fachwissen: fw(
        `Überblick ${GROUP_LABEL[group]}: heimische Arten den richtigen Wirbeltiergruppen zuordnen und Kurzinfos kennen.`,
      ),
      concept: matchId,
    })
    // Match-level identity only — do not burn every art:* id, otherwise
    // overview rounds top out below 10 when species banks are small.
    return { ...task, contentIds: [matchId], dedupeKey: matchId }
  }
  if (group === 'kriechtier') {
    // Arten-IDs gehören zu kriechtiere-arten — Überblick nur TF + Definition (Bug B).
    return mixedVariants(
      (rng) => groupOverviewTf(rng, group),
      (rng) => groupOverviewTf(rng, group),
      (rng) =>
        choicePickTask({
          question: 'Welche Aussage beschreibt Kriechtiere im Überblick korrekt?',
          choices: shuffleChoices(
            rng,
            [
              'Landlebende Wirbeltiere mit typischer Hornschicht',
              'Ausschließlich Insekten ohne Wirbelsäule',
              'Nur wasserlebende Kiemenatmer',
              'Nur Vögel mit Federkleid',
            ],
            'Landlebende Wirbeltiere mit typischer Hornschicht',
          ),
          correct: 'Landlebende Wirbeltiere mit typischer Hornschicht',
          solution: 'Landlebende Wirbeltiere mit typischer Hornschicht',
          explanation: 'Kriechtiere: Wirbeltiere, an Land angepasst.',
          fachwissen: fw('Überblick Kriechtiere: Gruppe der Wirbeltiere, Trockenlufttiere.'),
          dedupeKey: 'bio:k5:kriechtier:ueberblick:definition',
          contentIds: ['bio:k5:kriechtier:ueberblick:definition'],
        }),
      (rng) =>
        choicePickTask({
          question: 'Was beschreibt die Gruppe der Kriechtiere im Schulüberblick am besten?',
          choices: shuffleChoices(
            rng,
            [
              'Trockenlufttiere mit Hornschicht und Lungenatmung',
              'Nur Kiemenatmer ohne Wirbelsäule',
              'Nur Federkleid und Luftsäcke',
              'Nur Säugen der Jungen mit Milch',
            ],
            'Trockenlufttiere mit Hornschicht und Lungenatmung',
          ),
          correct: 'Trockenlufttiere mit Hornschicht und Lungenatmung',
          solution: 'Trockenlufttiere mit Hornschicht und Lungenatmung',
          explanation: 'Kriechtiere sind an Landleben angepasst.',
          fachwissen: fw(
            'Überblick Kriechtiere: Hornschicht, Lungen, Fortpflanzung unabhängig vom Wasser — eigene Wirbeltiergruppe.',
          ),
          dedupeKey: 'bio:k5:kriechtier:ueberblick:definition-2',
          contentIds: ['bio:k5:kriechtier:ueberblick:definition-2'],
        }),
    )
  }
  return mixedVariants(
    (rng) => groupSpeciesMc(rng, group),
    (rng) => groupOverviewTf(rng, group),
    speciesMatch,
    speciesMatch,
    (rng) => groupSpeciesMc(rng, group),
    (rng) => groupOverviewTf(rng, group),
  )
}

function makeMerkmaleTopic(
  group: GroupKey,
  extra?: (rng: Rng) => ReturnType<Topic['generate']>,
): Topic['generate'] {
  const variants: Array<(rng: Rng) => ReturnType<Topic['generate']>> = [
    (rng) => groupFeatureMc(rng, group),
    (rng) => groupFeatureMulti(rng, group),
    (rng) => groupMerkmaleTf(rng, group),
  ]
  if (extra) variants.unshift(extra)
  return mixedVariants(...variants)
}

function makeLebensraumTopic(
  group: GroupKey,
  extra?: (rng: Rng) => ReturnType<Topic['generate']>,
): Topic['generate'] {
  const variants: Array<(rng: Rng) => ReturnType<Topic['generate']>> = [
    (rng) => groupLebensraumMc(rng, group),
    (rng) => groupLebensraumTf(rng, group),
  ]
  if (extra) variants.unshift(extra)
  return mixedVariants(...variants)
}

function makeSchutzTopic(group: GroupKey): Topic['generate'] {
  return mixedVariants(
    (rng) => groupSchutzMc(rng, group),
    (rng) => groupSchutzTf(rng, group),
    (rng) => groupSchutzMc(rng, group),
  )
}

function makeMetaTopic(extra: (rng: Rng) => ReturnType<Topic['generate']>): Topic['generate'] {
  return mixedVariants(extra, extra)
}

function makeArtenTopic(group: GroupKey): Topic['generate'] {
  // Species only — no overview TF (would collide with Überblick stems/ids).
  return mixedVariants(
    (rng) => groupSpeciesMc(rng, group),
    (rng) => groupSpeciesMc(rng, group),
    (rng) => {
      const species = SPECIES.filter((s) => s.group === group)
      const s = pick(rng, species)
      const concept = `bio:k5:${group}:arten:note:${s.name.toLowerCase()}`
      return choicePickTask({
        question: `Welches Kennzeichen passt zur Art „${s.name}“?`,
        choices: shuffleChoices(
          rng,
          [
            s.note,
            'Atmung nur über Federn',
            'Typisches Insekt mit sechs Beinen',
            'Lebt ausschließlich als Stein ohne Stoffwechsel',
          ],
          s.note,
        ),
        correct: s.note,
        solution: s.note,
        explanation: `${s.name}: ${s.note}.`,
        fachwissen: fw(`${s.name} — ${s.note}.`),
        dedupeKey: concept,
        contentIds: [concept, `bio:k5:${group}:art:${s.name.toLowerCase()}`],
      })
    },
  )
}

/** Überblick: nur Arten + Gruppenidentität — ohne Spezial-Inhalte. */
export const biFischeOverview = makeOverviewTopic('fisch')
export const biLurcheOverview = makeOverviewTopic('lurch')
export const biKriechtiereOverview = makeOverviewTopic('kriechtier')
export const biVoegelOverview = makeOverviewTopic('vogel')
export const biSaeugetiereOverview = makeOverviewTopic('saeuger')

/** Spezial: jeweils eigene, disjunkte Banken. */
export const biFischeMerkmale = makeMerkmaleTopic('fisch', fischeBauMatch)
export const biFischeLebensraum = makeLebensraumTopic('fisch', fischeNahrung)
export const biFischeSchutz = makeSchutzTopic('fisch')
export const biLurcheMerkmale = makeMerkmaleTopic('lurch', lurcheMatch)
export const biLurcheMeta = makeMetaTopic(lurcheMetaSort)
export const biLurcheSchutz = makeSchutzTopic('lurch')
export const biKriechtiereMerkmale = makeMerkmaleTopic('kriechtier', kriechMatch)
export const biKriechtiereArten = makeArtenTopic('kriechtier')
export const biVoegelFlug = makeMerkmaleTopic('vogel', voegelFlugMatch)
export const biVoegelFortpflanzung = makeLebensraumTopic('vogel', voegelSchnabel)
export const biSaeugerMerkmale = makeMerkmaleTopic('saeuger', saeugerGebiss)
export const biSaeugerAngepasst = makeLebensraumTopic('saeuger', saeugerGliedmass)
export const biSaeugerSchutz = makeSchutzTopic('saeuger')

/** @deprecated Prefer Überblick / Spezial-Exports — kept as Überblick alias. */
export const biFische = biFischeOverview
export const biLurche = biLurcheOverview
export const biKriechtiere = biKriechtiereOverview
export const biVoegel = biVoegelOverview
export const biSaeugetiere = biSaeugetiereOverview


// ─── LB7 Systematisierung — classification tree / feature matrix ─────────────

function systematikClassify(rng: Rng) {
  // Genau eine Art pro Gruppe → slotLabels.length === Slotanzahl (sonst nur Nummern 1–4).
  const allGroups = Object.keys(GROUP_LABEL) as GroupKey[]
  const slotKeys = shuffle(rng, allGroups).slice(0, 4)
  const sample = slotKeys.map((g) => pick(rng, SPECIES.filter((s) => s.group === g)))
  const slotLabels = slotKeys.map((g) => GROUP_LABEL[g])
  const itemLabels = sample.map((s) => s.name)
  const correctSlots = sample.map((_, i) => i)
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
    instruction:
      'Klassifikationsbaum als Fächer: Ziehe jede Art in die passende Wirbeltiergruppe. Einen Block brauchst du nicht.',
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
  'bi-k5-lb1-kennzeichen': biKennzeichen,
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
  'bi-k5-lb7-zuordnung': biSystematik, // overridden in biologieNewUx to vertebrateCompareUx only
  'bi-k5-lbw-winter': biWinter,
  'bi-k5-lbw-saurier': biSaurier,
  'bi-k5-lbw-haltung': biHaltung,
}
