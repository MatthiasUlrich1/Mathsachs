/**
 * Geschichte Klasse 6 — LB1 Römische Zivilisation.
 * Themen scharf getrennt (wenig Überschneidung). Jahreszahlen nur im eigenen Thema.
 * Spoiler: Merkhilfen/Jahreszahlen stehen erst in der Erklärung nach dem Prüfen.
 * Fachwissen ist immer auf die *aktuelle* Frage bezogen (z. B. Jahr → Ereignis).
 */
import type { Rng } from '../lib/rng'
import {
  ROM_MAP_ATTRIBUTION,
  ROM_MAP_PHASES,
  ROM_MAP_QUELLE,
  romanExpansionMapSvg,
  type RomMapHighlight,
} from './geschichteRomMap'
import {
  choicePickTask,
  dragDropSlotsTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  textTask,
  valueTask,
} from './taskHelpers'
import type { Fachwissen, Topic } from './types'

const pick = <T,>(rng: Rng, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)]!

const shuffleChoices = (rng: Rng, choices: string[], correct: string): string[] => {
  const rest = choices.filter((c) => c !== correct)
  const out = [correct, ...rest]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const ROM_QUELLE: Pick<Fachwissen, 'quelle' | 'url'> = {
  quelle: 'Wikipedia: Römisches Reich',
  url: 'https://de.wikipedia.org/wiki/R%C3%B6misches_Reich',
}

const fw = (text: string): Fachwissen => ({ text, ...ROM_QUELLE })
const fwMap = (text: string): Fachwissen => ({
  text: `${text} ${ROM_MAP_ATTRIBUTION}`,
  ...ROM_MAP_QUELLE,
})

/** Kern-Jahreszahlen LB1 (v. Chr.) — wissen = fragebezogenes Fachwissen. */
const YEAR_FACTS = [
  {
    year: 753,
    event: 'Gründung Roms (Sage: Romulus und Remus)',
    hint: 'Merkhilfe: „Rom schlüpft aus dem Ei“ (7-5-3)',
    wissen:
      '753 v. Chr. gilt in der römischen Tradition als Gründungsjahr Roms. Der Sage nach gründeten die Zwillinge Romulus und Remus die Stadt am Tiber; Romulus wurde erster König. Historisch ist das eine mythische Datierung — sie markiert den Beginn der römischen Zeitrechnung ab urbe condita.',
  },
  {
    year: 1000,
    event: 'Frühe Siedlung von Sabinern und Latinern am Tiber (ca.)',
    hint: 'Lange vor der Sage — Hirten und Bauern, Handelsplatz',
    wissen:
      'Um 1000 v. Chr. siedelten am Tiber bereits Sabiner und Latiner: Hirten und Bauern, aus deren Dörfern später ein Handelsplatz wuchs. Das liegt lange vor der Gründungssage und erklärt, warum die Lage am Fluss und an den Hügeln so wichtig war.',
  },
  {
    year: 700,
    event: 'Etrusker prägen Rom (Steinbau, Wassertechnik, Metall) (ca.)',
    hint: 'Etruskerkönigtum vor der Republik',
    wissen:
      'Um 700 v. Chr. prägen die Etrusker Rom stark: Stein- und Ziegelbau, Wassertechnik und Metallverarbeitung. In der Königszeit hatten etruskische Könige Einfluss — neue Techniken und städtische Lebensweise vor dem Beginn der Republik.',
  },
  {
    year: 500,
    event: 'Beginn der römischen Republik (ca., Könige vertrieben)',
    hint: 'Patrizier stürzen den König — res publica',
    wissen:
      'Um 500 v. Chr. endet die Königszeit: Patrizier vertreiben den letzten König und begründen die res publica („öffentliche Sache“). Statt eines Königs regieren gewählte Magistrate; der Senat berät. Das ist der Start der römischen Republik.',
  },
  {
    year: 264,
    event: 'Beginn des Ersten Punischen Krieges (Kampf um Sizilien)',
    hint: 'Rom gegen Karthago — Rom baut eine Flotte',
    wissen:
      '264 v. Chr. beginnt der Erste Punische Krieg: Rom und Karthago kämpfen um Sizilien. Rom muss erst eine Flotte aufbauen, um zur See zu bestehen. Der Krieg macht Rom zur Seemacht im westlichen Mittelmeer.',
  },
  {
    year: 241,
    event: 'Ende des Ersten Punischen Krieges; Sizilien wird römische Provinz',
    hint: 'Rom siegt zur See / um Sizilien',
    wissen:
      '241 v. Chr. endet der Erste Punische Krieg: Rom siegt, Sizilien wird erste römische Provinz. Damit ist Rom nicht mehr nur Landmacht in Italien, sondern kontrolliert auch Seewege und eine Insel vor der Küste.',
  },
  {
    year: 218,
    event: 'Beginn des Zweiten Punischen Krieges; Hannibal überquert die Alpen',
    hint: 'Hannibal mit Heer und Elefanten über die Alpen',
    wissen:
      '218 v. Chr. beginnt der Zweite Punische Krieg. Der karthagische Feldherr Hannibal führt sein Heer (mit Kriegselefanten) über die Alpen nach Italien — einer der berühmtesten Feldzüge der Antike und eine direkte Bedrohung für Rom.',
  },
  {
    year: 202,
    event: 'Schlacht bei Zama: Scipio besiegt Hannibal',
    hint: 'Entscheidung in Afrika zugunsten Roms',
    wissen:
      '202 v. Chr. entscheidet die Schlacht bei Zama in Nordafrika: Der Römer Scipio besiegt Hannibal. Damit kippt der Zweite Punische Krieg endgültig zugunsten Roms; Karthago verliert seine Großmachtstellung.',
  },
  {
    year: 201,
    event: 'Ende des Zweiten Punischen Krieges',
    hint: 'Nach Zama — Karthago stark geschwächt',
    wissen:
      '201 v. Chr. endet der Zweite Punische Krieg (nach Zama). Karthago muss harte Friedensbedingungen akzeptieren und bleibt stark geschwächt — Rom steigt zur führenden Macht im westlichen Mittelmeer auf.',
  },
  {
    year: 149,
    event: 'Beginn des Dritten Punischen Krieges',
    hint: 'Cato: „Carthago delenda est!“',
    wissen:
      '149 v. Chr. beginnt der Dritte Punische Krieg. In Rom hatte Cato im Senat immer wieder „Carthago delenda est!“ gefordert. Rom belagert die geschwächte Stadt Karthago — Ziel ist die endgültige Ausschaltung des Rivalen.',
  },
  {
    year: 146,
    event: 'Zerstörung Karthagos (Ende des Dritten Punischen Krieges)',
    hint: 'Rom alleinige Vormacht im Mittelmeer',
    wissen:
      '146 v. Chr. wird Karthago zerstört; der Dritte Punische Krieg endet. Rom bleibt als alleinige Großmacht im westlichen Mittelmeer übrig — ein Meilenstein auf dem Weg vom Stadtstaat zur Weltmacht (Mare Nostrum).',
  },
] as const

type YearFact = (typeof YEAR_FACTS)[number]

const yearFw = (fact: YearFact): Fachwissen => fw(fact.wissen)

const otherYears = (fact: YearFact): number[] =>
  YEAR_FACTS.filter((f) => f.year !== fact.year).map((f) => f.year)

/** Nur Jahreszahl tippen — ohne Merkhilfe in der Frage (kein Spoiler). */
function yearValueTask(rng: Rng) {
  const fact = pick(rng, YEAR_FACTS)
  const forms = [
    `In welchem Jahr v. Chr. geschah Folgendes?\n\n${fact.event}\n\n(Nur die Jahreszahl tippen)`,
    `Wann geschah das? (Jahr v. Chr., nur die Zahl)\n\n${fact.event}`,
    `Jahreszahl: ${fact.event}\n\nJahr v. Chr.:`,
  ]
  return valueTask({
    question: pick(rng, forms),
    answerKind: 'integer',
    value: fact.year,
    solution: `${fact.year}`,
    explanation: `${fact.year} v. Chr. — ${fact.event}. ${fact.hint}`,
    fachwissen: yearFw(fact),
  })
}

/** Welches Ereignis gehört zur Jahreszahl? */
function yearEventChoice(rng: Rng) {
  const fact = pick(rng, YEAR_FACTS)
  const distractors = YEAR_FACTS.filter((f) => f.year !== fact.year)
    .map((f) => f.event)
  const wrong = shuffleChoices(rng, distractors, distractors[0]!).slice(0, 3)
  return choicePickTask({
    question: `Was geschah ${fact.year} v. Chr.?`,
    choices: shuffleChoices(rng, [fact.event, ...wrong], fact.event),
    correct: fact.event,
    solution: fact.event,
    explanation: `${fact.year} v. Chr.: ${fact.event}. ${fact.hint}`,
    instruction: 'Tippe das passende Ereignis:',
    fachwissen: yearFw(fact),
  })
}

/** Welche Jahreszahl passt? (MC) — ohne Hint in der Frage. */
function yearMcTask(rng: Rng) {
  const fact = pick(rng, YEAR_FACTS)
  const wrongYears = shuffleChoices(
    rng,
    otherYears(fact).map(String),
    String(fact.year),
  )
    .filter((y) => y !== String(fact.year))
    .slice(0, 3)
  const correct = `${fact.year} v. Chr.`
  return choicePickTask({
    question: `${fact.event}\n\nWelches Jahr?`,
    choices: shuffleChoices(
      rng,
      [correct, ...wrongYears.map((y) => `${y} v. Chr.`)],
      correct,
    ),
    correct,
    solution: correct,
    explanation: `${fact.year} v. Chr. — ${fact.hint}`,
    instruction: 'Tippe die Jahreszahl:',
    fachwissen: yearFw(fact),
  })
}

/** Zuordnung: Begriffe links, Erklärungen rechts (Slot-Labels). */
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
    visualContent?: string
  },
) {
  const items = [
    ...opts.meanings.map((label, value) => ({ label, value })),
    { label: opts.distractor, value: opts.meanings.length },
  ]
  return dragDropSlotsTask({
    question: opts.question,
    items,
    correctSlots: opts.meanings.map((_, i) => i),
    slotLabels: opts.terms,
    solution: opts.solution,
    explanation: opts.explanation,
    instruction: 'Ziehe rechts die passende Erklärung zum Begriff links. Einen Block brauchst du nicht.',
    rng,
    fachwissen: opts.fachwissen,
    ...(opts.visualContent ? { visualContent: opts.visualContent } : {}),
  })
}

// ─── Nur Jahreszahlen (gesamter LB1) ─────────────────────────────────────────

export const romJahreszahlen: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.5) return yearValueTask(rng)
  if (roll < 0.78) return yearMcTask(rng)
  return yearEventChoice(rng)
}

// ─── Chronologie: nur Reihenfolge (keine Ordnungszahlen als Spoiler) ─────────

export const romChronologie: Topic['generate'] = mixedVariants(
  (_rng) =>
    dragDropSortTask({
      question: 'Ordne die Ereignisse chronologisch (früh → spät):',
      items: [
        { label: 'Gründung Roms (Sage)', value: 0 },
        { label: 'Beginn der Republik', value: 1 },
        { label: 'Krieg um Sizilien beginnt', value: 2 },
        { label: 'Hannibal überquert die Alpen', value: 3 },
        { label: 'Zerstörung Karthagos', value: 4 },
      ],
      correctOrder: [0, 1, 2, 3, 4],
      solution: 'Gründung → Republik → Sizilien → Alpen → Karthago zerstört',
      explanation: 'So baut sich LB1 zeitlich auf — von den Anfängen bis zur Vormacht.',
      rng: _rng,
      fachwissen: fw(
        'Chronologie LB1 (früh → spät): Gründungssage Roms → Beginn der Republik (~500) → Krieg um Sizilien → Hannibal über die Alpen → Zerstörung Karthagos (146). So merkst du die Reihenfolge ohne jede Jahreszahl tippen zu müssen.',
      ),
    }),
  (_rng) =>
    dragDropSortTask({
      question: 'Ordne diese Ereignisse chronologisch (früh → spät):',
      items: [
        { label: 'Krieg um Sizilien', value: 0 },
        { label: 'Hannibal / Alpen / Zama', value: 1 },
        { label: 'Zerstörung Karthagos', value: 2 },
      ],
      correctOrder: [0, 1, 2],
      solution: 'Sizilien → Hannibal/Zama → Zerstörung Karthagos',
      explanation: 'Drei große Konflikte gegen Karthago folgen nacheinander.',
      rng: _rng,
      fachwissen: fw(
        'Reihenfolge der Konflikte mit Karthago: zuerst Kampf um Sizilien (Rom wird Seemacht); dann Hannibal über die Alpen und Entscheidung bei Zama; zuletzt Belagerung und Zerstörung Karthagos. Merke Inhalt: Sizilien → Hannibal → Zerstörung — ohne Nummern in der Aufgabe.',
      ),
    }),
  (_rng) =>
    dragDropSortTask({
      question: 'Ordne die Anfänge Roms chronologisch (früh → spät):',
      items: [
        { label: 'Sabiner & Latiner am Tiber', value: 0 },
        { label: 'Etrusker prägen Rom', value: 1 },
        { label: 'Gründungssage (Romulus/Remus)', value: 2 },
        { label: 'Beginn der Republik', value: 3 },
      ],
      correctOrder: [0, 1, 2, 3],
      solution: 'Siedlung → Etrusker → Sage (Tradition) → Republik',
      explanation:
        'Historisch früh: Siedlung und Etrusker; die Sage datiert die Gründung; danach Republik.',
      rng: _rng,
      fachwissen: fw(
        'Anfänge zeitlich: Sabiner und Latiner siedeln früh am Tiber; Etrusker prägen Technik und Stadt; die Gründungssage setzt die mythische Stadtgründung; um 500 beginnt die Republik.',
      ),
    }),
  (_rng) =>
    dragDropSortTask({
      question: 'Ordne die Expansionsphasen (klein → groß):',
      items: [
        { label: 'Stadtstaat Rom', value: 0 },
        { label: 'Landmacht in Italien', value: 1 },
        { label: 'Vormacht im Westmittelmeer', value: 2 },
        { label: 'Mare Nostrum', value: 3 },
      ],
      correctOrder: [0, 1, 2, 3],
      solution: 'Stadtstaat → Italien → Westmittelmeer → Mare Nostrum',
      explanation: 'Rom wächst schrittweise vom Stadtstaat zur Mittelmeer-Vormacht.',
      rng: _rng,
      fachwissen: fw(
        'Expansionslinie: Stadtstaat → Kontrolle Italiens → Vormacht im westlichen Mittelmeer → Mare Nostrum („unser Meer“).',
      ),
    }),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne: Welcher Schwerpunkt passt zu welchem Konflikt?',
      terms: ['Krieg um Sizilien', 'Hannibal / Alpen / Zama', 'Zerstörung Karthagos'],
      meanings: [
        'Rom wird Seemacht; Insel vor der italienischen Küste',
        'Feldzug über die Alpen; Entscheidung in Afrika',
        'Belagerung; Rivale fällt endgültig',
      ],
      distractor: 'Gründung Roms durch Romulus und Remus',
      solution: 'Sizilien · Hannibal/Zama · Zerstörung',
      explanation: 'Jeder Konflikt hat einen klaren Schwerpunkt — so merkst du die Abfolge.',
      fachwissen: fw(
        'Schwerpunkte ohne Nummern-Spoiler: Sizilien und Flotte; Hannibal, Alpen, Zama (Scipio); Belagerung und Zerstörung Karthagos. Die Gründungssage gehört nicht in diese Kriegslinie.',
      ),
    }),
  (rng) => {
    const cases = [
      {
        q: 'Was kommt zeitlich zuerst?',
        correct: 'Beginn der Republik',
        wrong: ['Zerstörung Karthagos', 'Hannibal über die Alpen', 'Krieg um Sizilien'],
        wissen:
          'Die Republik beginnt um 500 v. Chr. — lange vor den Konflikten mit Karthago (Sizilien, Hannibal, Zerstörung).',
      },
      {
        q: 'Was kommt zeitlich zuletzt?',
        correct: 'Zerstörung Karthagos',
        wrong: ['Gründungssage Roms', 'Beginn der Republik', 'Krieg um Sizilien'],
        wissen:
          'Die Zerstörung Karthagos (146) steht am Ende der großen Konflikte mit Karthago — nach Sizilien und Hannibal/Zama.',
      },
      {
        q: 'Was liegt zeitlich zwischen Republikbeginn und Zerstörung Karthagos?',
        correct: 'Krieg um Sizilien und Hannibals Alpenzug',
        wrong: [
          'nur die Gründungssage',
          'nur das Ende des Mittelalters',
          'die Entdeckung Amerikas',
        ],
        wissen:
          'Zwischen Republikbeginn und Zerstörung Karthagos liegen u. a. der Krieg um Sizilien und Hannibals Alpenzug mit der Entscheidung bei Zama.',
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Chronologie: Anfänge → Republik → Konflikte mit Karthago → Vormacht.',
      instruction: 'Tippe die passende Antwort:',
      fachwissen: fw(c.wissen),
    })
  },
)

// ─── Anfänge: Sage, Siedlung, Etrusker (kein Senat/Krieg/Ämter) ───────────────

export const romAnfaenge: Topic['generate'] = mixedVariants(
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne den frühen Phasen Roms die passende Aussage zu:',
      terms: ['Sage', 'Sabiner & Latiner', 'Etrusker', 'Sieben Hügel'],
      meanings: [
        'Romulus und Remus gründen die Stadt',
        'Hirten und Bauern siedeln am Tiber; Handelsplatz entsteht',
        'bringen Steinbau, Wassertechnik und Metallverarbeitung',
        'Lage der Stadt laut Überlieferung',
      ],
      distractor: 'Hannibal überquert die Alpen',
      solution: 'Sage · Siedlung · Etrusker · Hügel',
      explanation: 'Anfänge: Sage, frühe Siedlung, Etruskereinfluss, Lage auf sieben Hügeln.',
      fachwissen: fw(
        'Anfänge Roms in vier Schichten: Sage (Romulus/Remus); frühe Siedlung am Tiber; Etrusker (Steinbau, Wasser, Metall); sieben Hügel. Hannibal gehört nicht hierher.',
      ),
    }),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne Ort und Fluss den Anfängen zu:',
      terms: ['Tiber', 'Latium', 'Palatin', 'Forum'],
      meanings: [
        'Fluss, an dem Rom entsteht',
        'Landschaft Mittelitaliens um Rom',
        'einer der sieben Hügel (Sage: Gründung)',
        'späterer Markt- und Versammlungsplatz',
      ],
      distractor: 'Alpenpass Hannibals',
      solution: 'Tiber · Latium · Palatin · Forum',
      explanation: 'Lage: Tiber, Latium, Hügel — Forum wird später Zentrum.',
      fachwissen: fw(
        'Geografie der Anfänge: Tiber, Latium, Palatin; Forum wird später Zentrum. Hannibals Alpenpass gehört nicht zu den Anfängen.',
      ),
    }),
  (rng) => {
    const cases = [
      {
        q: 'Wer gründete Rom der Sage nach?',
        correct: 'Romulus und Remus',
        wrong: ['Zwei etruskische Kaufleute ohne Sage', 'Ein einzelner Sabinerkönig allein', 'Nur Plebejer ohne Anführer'],
        explanation: 'Zwillinge Romulus und Remus — Sage zur Stadtgründung.',
        wissen: 'Der Sage nach gründeten die Zwillinge Romulus und Remus Rom. Historisch ist die Erzählung mythisch, nicht wörtlich belegbar.',
      },
      {
        q: 'Auf wie vielen Hügeln lag Rom der Sage nach?',
        correct: 'sieben',
        wrong: ['drei', 'zehn', 'zwei'],
        explanation: '„Stadt auf sieben Hügeln“.',
        wissen: 'Rom heißt in der Überlieferung die „Stadt auf sieben Hügeln“. Die Hügellage am Tiber bot Schutz und Überblick.',
      },
      {
        q: 'Was brachten die Etrusker nach Rom?',
        correct: 'Stein-/Ziegelbau, Wassertechnik, Metallverarbeitung',
        wrong: ['nur mündliche Märkte ohne Technik', 'ausschließlich Seefahrt nach Karthago', 'das Ende jeder Stadtanlage'],
        explanation: 'Etrusker: neue Lebensweise, Steinbau, Wasser, Metall.',
        wissen: 'Die Etrusker beeinflussten frühes Rom stark: Stein- und Ziegelbau, Wassertechnik und Metallverarbeitung.',
      },
      {
        q: 'Sabiner und Latiner (Hirten/Bauern) …',
        correct: 'siedeln früh am Tiber und entwickeln einen Handelsplatz',
        wrong: ['gründen zuerst Karthago in Afrika', 'sind nur Feldherren einer späteren Flotte', 'leben ausschließlich in Gallien'],
        explanation: 'Frühe Siedlung am Tiber → Handelsplatz.',
        wissen: 'Sabiner und Latiner siedelten früh als Hirten und Bauern am Tiber. Aus ihren Siedlungen wuchs ein Handelsplatz.',
      },
      {
        q: 'Warum endet die Königszeit in Rom (ca. 500 v. Chr.)?',
        correct: 'Patrizier vertreiben den König und begründen die Republik',
        wrong: ['Ein fremdes Heer setzt einen neuen König auf Lebenszeit ein', 'Der Senat wird abgeschafft und nie ersetzt', 'Romulus wird erneut zum einzigen Herrscher gewählt'],
        explanation: 'Ende der Königszeit → Republik (res publica).',
        wissen: 'Um 500 v. Chr. vertreiben Patrizier den König und begründen die Republik (res publica).',
      },
      {
        q: 'Was bedeutet „ab urbe condita“ grob?',
        correct: '„seit der Stadtgründung“ — römische Zeitrechnung ab der Sage',
        wrong: ['„seit dem Ende Karthagos“', '„seit dem ersten Konsul in Gallien“', '„seit dem Bau der Alpenstraße“'],
        explanation: 'Römische Zählung ab der (sagenhaften) Stadtgründung.',
        wissen: 'Ab urbe condita heißt „seit der Stadtgründung“. Die Römer zählten Jahre ab der traditionellen Gründung (753).',
      },
      {
        q: 'Warum war die Lage am Tiber für frühes Rom günstig?',
        correct: 'Flussweg, Hügelsschutz und Handelsplatz',
        wrong: ['weil dort kein Wasser existierte', 'weil die Alpen direkt an Rom grenzten', 'weil Karthago dort lag'],
        explanation: 'Fluss + Hügel = Schutz und Handel.',
        wissen: 'Am Tiber gab es Wasserweg und Handel; die Hügel boten Schutz. Karthago lag in Nordafrika.',
      },
      {
        q: 'Die Königszeit Roms liegt …',
        correct: 'vor dem Beginn der Republik',
        wrong: ['erst nach der Zerstörung Karthagos', 'gleichzeitig mit Hannibals Alpenzug', 'erst im Mittelalter'],
        explanation: 'Könige → danach Republik.',
        wissen: 'Die Königszeit liegt vor der Republik — nicht erst nach Karthago oder Hannibal.',
      },
      {
        q: 'Was ist an der Gründungssage historisch besonders?',
        correct: 'Sie ist mythische Tradition — nicht wörtlich belegbare Geschichte',
        wrong: ['Sie ist ein Tagesbericht aus dem Senat', 'Sie beschreibt nur die Punischen Kriege', 'Sie gilt nur für Karthago'],
        explanation: 'Sage = Ursprungsmythos, kein Protokoll.',
        wissen: 'Die Gründungssage ist mythische Tradition und kein historischer Tagesbericht.',
      },
      {
        q: 'Wer hatte in der Königszeit oft Einfluss auf Rom?',
        correct: 'etruskische Könige / etruskische Kultur',
        wrong: ['nur germanische Stammesführer', 'nur karthagische Konsuln', 'nur mittelalterliche Fürsten'],
        explanation: 'Etrusker prägen Königszeit und Technik.',
        wissen: 'In der Königszeit hatten etruskische Herrscher und Kultur starken Einfluss auf Rom.',
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
      fachwissen: fw(c.wissen),
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zu den Anfängen Roms? (mehrere möglich)',
      choices: [
        'Sage von Romulus und Remus',
        'Siedlung am Tiber',
        'Etruskischer Einfluss',
        'Lage auf sieben Hügeln',
        'Zerstörung Karthagos als Gründungsakt',
      ],
      correct: [
        'Sage von Romulus und Remus',
        'Siedlung am Tiber',
        'Etruskischer Einfluss',
        'Lage auf sieben Hügeln',
      ],
      solution: 'Sage, Tiber-Siedlung, Etrusker, sieben Hügel — nicht Karthagos Ende.',
      explanation: 'Anfänge ≠ spätere Kriege gegen Karthago.',
      instruction: 'Tippe alle zutreffenden Punkte:',
      fachwissen: fw(
        'Zu den Anfängen gehören Sage, frühe Siedlung am Tiber, Etruskereinfluss und die sieben Hügel. Die Zerstörung Karthagos ist kein Gründungsakt.',
      ),
    }),
)

// ─── Begriffe: nur Republik / Senat / Patrizier / Plebejer ───────────────────

export const romBegriffe: Topic['generate'] = mixedVariants(
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne: Begriff → Bedeutung',
      terms: ['Republik', 'Senat', 'Patrizier', 'Plebejer'],
      meanings: [
        'öffentliche Sache / gewählte Vertreter',
        'Rat der Ältesten (zunächst Adlige)',
        'Adlige / wohlhabende „Väter“',
        'Volk ohne Adelszugehörigkeit',
      ],
      distractor: 'König mit unbeschränkter Macht',
      solution: 'Republik · Senat · Patrizier · Plebejer',
      explanation: 'res publica = öffentliche Sache; Senat berät; Patrizier = Adel; Plebejer = Volk.',
      fachwissen: fw(
        'Kernbegriffe: res publica; Senat = Rat der Ältesten; Patrizier = Adlige; Plebejer = Volk ohne Adelszugehörigkeit. Ein König mit unbeschränkter Macht ist das Gegenteil.',
      ),
    }),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne weitere Republik-Begriffe:',
      terms: ['res publica', 'SPQR', 'Standeskampf', 'Klientel'],
      meanings: [
        'lateinisch: öffentliche Sache',
        'Senatus Populusque Romanus',
        'Auseinandersetzung Patrizier ↔ Plebejer',
        'Schutzverhältnis Patron — Klient',
      ],
      distractor: 'Alleinherrschaft eines Königs auf Lebenszeit',
      solution: 'res publica · SPQR · Standeskampf · Klientel',
      explanation: 'Weitere Schlüsselbegriffe der frühen Republik.',
      fachwissen: fw(
        'res publica; SPQR = Senatus Populusque Romanus; Standeskampf; Klientel. Königs-Alleinherrschaft ist das Gegenteil.',
      ),
    }),
  (rng) => {
    const cases = [
      {
        q: '„Republik“ kommt von lat. res publica und bedeutet …',
        correct: 'öffentliche Sache — Regierung durch gewählte Vertreter',
        wrong: ['Alleinherrschaft eines Königs', 'nur Militär ohne jede Beratung', 'Herrschaft der Götter ohne Menschen'],
        wissen: 'Res publica heißt „öffentliche Sache“. Gewählte Magistrate statt König auf Lebenszeit.',
      },
      {
        q: 'Was war der Senat in der frühen Republik?',
        correct: 'Rat der Ältesten; politische Versammlung zunächst adliger Männer',
        wrong: ['nur die Versammlung aller Sklaven', 'ein einzelner Feldherr ohne Rat', 'ein Königshof auf Lebenszeit'],
        wissen: 'Der Senat war der Rat der Ältesten und beriet Magistrate zu Krieg, Frieden und Politik.',
      },
      {
        q: 'Wer waren die Patrizier?',
        correct: 'Adlige und wohlhabende Römer (lat. „Väter“)',
        wrong: ['das einfache Volk ohne Adel', 'nur freigelassene Sklaven', 'nur fremde Händler ohne Bürgerstatus'],
        wissen: 'Patrizier waren die adligen, wohlhabenden Familien mit großem Einfluss in der frühen Republik.',
      },
      {
        q: 'Wer waren die Plebejer?',
        correct: 'Angehörige des Volkes, die nicht zum Adel gehörten',
        wrong: ['nur die beiden Konsuln', 'etruskische Könige', 'von Anfang an alleiniger Senat'],
        wissen: 'Plebejer gehörten nicht zum Adel und erkämpften sich später Rechte (z. B. Volkstribune).',
      },
      {
        q: 'In der frühen Republik hatten zunächst vor allem … die Macht.',
        correct: 'die Patrizier; Plebejer blieben lange machtlos',
        wrong: ['alle Einwohner gleichermaßen inklusive Sklaven', 'nur die Plebejer ohne Patrizier', 'nur Kinder ohne Erwachsene'],
        wissen: 'Die Macht lag zunächst bei den Patriziern; Plebejer blieben lange benachteiligt.',
      },
      {
        q: 'Was bedeutet SPQR?',
        correct: 'Senatus Populusque Romanus — Senat und Volk von Rom',
        wrong: ['nur „Senat ohne Volk“', '„Sklave, Patrizier, Quästor, Rex“', 'ein Name nur für Karthago'],
        wissen: 'SPQR = Senatus Populusque Romanus — Senat und römisches Volk.',
      },
      {
        q: 'Der Standeskampf war vor allem …',
        correct: 'der Konflikt zwischen Patriziern und Plebejern um Rechte',
        wrong: ['ein Krieg nur gegen die Etrusker ohne Innenpolitik', 'ein Streit nur um die Farbe der Toga', 'die Abschaffung des Tiber'],
        wissen: 'Im Standeskampf rangen Plebejer mit Patriziern um politische Rechte.',
      },
      {
        q: 'Ein Patron und sein Klient …',
        correct: 'stehen in einem Schutz- und Abhängigkeitsverhältnis',
        wrong: ['sind immer zwei gleichrangige Könige', 'bilden den Senat allein ohne andere', 'ersetzen den Tiber als Fluss'],
        wissen: 'Klientel: Patron gewährt Schutz; Klient schuldet Loyalität — soziales Netz der Republik.',
      },
      {
        q: 'Warum ist „König auf Lebenszeit“ das Gegenteil der Republik?',
        correct: 'Republik setzt auf befristete, gewählte Magistrate statt Alleinherrschaft',
        wrong: ['weil Könige immer Plebejer waren', 'weil der Senat nur aus Sklaven bestand', 'weil res publica „Königsburg“ heißt'],
        wissen: 'Die Republik ersetzt den König durch befristete, gewählte Magistrate und Senatsberatung.',
      },
      {
        q: 'Plebejer erkämpften sich später u. a. …',
        correct: 'mehr Rechte und eigene Vertreter (z. B. Volkstribune)',
        wrong: ['das Recht, den Tiber trockenzulegen', 'die alleinige Königswürde für jeden Bürger', 'das Verbot jeglicher Verträge'],
        wissen: 'Plebejer gewannen Rechte und Ämter — etwa Volkstribune mit Veto.',
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Frühe Republik: res publica, Senat, Patrizier vs. Plebejer.',
      instruction: 'Tippe die passende Erklärung:',
      fachwissen: fw(c.wissen),
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zur frühen Republik stimmen? (mehrere möglich)',
      choices: [
        'Res publica heißt öffentliche Sache',
        'Der Senat berät die Magistrate',
        'Patrizier sind adlige Familien',
        'Plebejer gehören nicht zum Adel',
        'Jeder Bürger ist automatisch König',
      ],
      correct: [
        'Res publica heißt öffentliche Sache',
        'Der Senat berät die Magistrate',
        'Patrizier sind adlige Familien',
        'Plebejer gehören nicht zum Adel',
      ],
      solution: 'Res publica, Senat, Patrizier, Plebejer — keine Königsmacht für alle.',
      explanation: 'Vier Kernaussagen; Königsmacht für jeden Bürger ist falsch.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
      fachwissen: fw(
        'Frühe Republik: res publica, Senat, Patrizier vs. Plebejer. Niemand wird automatisch König.',
      ),
    }),
  (rng) =>
    textTask({
      question: pick(rng, [
        'Lateinisch: Wie heißt „öffentliche Sache“? (zwei Wörter)',
        'Welcher lateinische Begriff bedeutet „öffentliche Sache“?',
      ]),
      accepted: ['res publica', 'Res publica', 'respublica'],
      solution: 'res publica',
      explanation: 'res publica = öffentliche Sache → Republik.',
      fachwissen: fw(
        'Res publica („öffentliche Sache“) ist der lateinische Ursprung von „Republik“.',
      ),
    }),
)

// ─── Ämter: nur Magistrate / Institutionen ───────────────────────────────────

export const romAemter: Topic['generate'] = mixedVariants(
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne den Ämtern die Zuständigkeit zu:',
      terms: ['Konsuln', 'Prätoren', 'Ädile', 'Quästoren'],
      meanings: [
        'oberste Beamte Roms (zwei)',
        'Gerichtswesen',
        'Stadt-/Marktverwaltung',
        'Finanzen',
      ],
      distractor: 'Zerstörung Karthagos',
      solution: 'Konsuln · Prätoren · Ädile · Quästoren',
      explanation: 'Klassische Magistraturen der Republik — je ein klarer Aufgabenbereich.',
      fachwissen: fw(
        'Zwei Konsuln (oberste Beamte), Prätoren (Gericht), Ädile (Stadt/Markt), Quästoren (Finanzen).',
      ),
    }),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne weitere Ämter und Organe:',
      terms: ['Zensoren', 'Volkstribune', 'Diktator', 'Senat'],
      meanings: [
        'Sittenkontrolle und Bürgerlisten',
        'Veto zum Schutz der Plebejer',
        'auf Zeit in Notzeiten mit großer Macht',
        'berät Magistrate; Krieg und Frieden',
      ],
      distractor: 'Hannibal als ständiger König Roms',
      solution: 'Zensoren · Volkstribune · Diktator · Senat',
      explanation: 'Kontrolle, Plebejerschutz, Notstand, Senat.',
      fachwissen: fw(
        'Zensoren, Volkstribune (Veto), Diktator (befristet), Senat. Kein ständiger König.',
      ),
    }),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne Prinzipien der Ämterordnung:',
      terms: ['Annuität', 'Kollegialität', 'Veto', 'Imperium'],
      meanings: [
        'Ämter meist nur für ein Jahr',
        'zwei Amtsinhaber teilen die Führung',
        'Einspruch / Blockade einer Entscheidung',
        'Befehlsmacht der hohen Magistrate',
      ],
      distractor: 'Königswürde auf Lebenszeit für alle',
      solution: 'Annuität · Kollegialität · Veto · Imperium',
      explanation: 'Befristung, Doppelbesetzung, Einspruch, Befehlsmacht.',
      fachwissen: fw(
        'Annuität, Kollegialität, Veto, Imperium — Republikprinzipien gegen Alleinherrschaft.',
      ),
    }),
  (rng) => {
    const cases = [
      {
        q: 'Welche Aufgabe hatten die beiden Konsuln?',
        correct: 'die obersten Beamten Roms',
        wrong: ['nur für Finanzen zuständig', 'nur Volkstribune ohne Heer', 'Könige auf Lebenszeit'],
        wissen: 'Zwei Konsuln waren die obersten Beamten — gemeinsam und befristet, nicht als Könige.',
      },
      {
        q: 'Wofür waren die Prätoren zuständig?',
        correct: 'das Gerichtswesen',
        wrong: ['nur Sittenkontrolle', 'nur die Getreidepreise in Gallien', 'nur Tempelbau ohne Recht'],
        wissen: 'Prätoren: Gerichtswesen. Sitten = Zensoren; Finanzen = Quästoren.',
      },
      {
        q: 'Was konnten Volkstribune?',
        correct: 'Veto einlegen (Schutz der Plebejer)',
        wrong: ['den Senat dauerhaft abschaffen', 'Könige auf Lebenszeit ernennen', 'nur Steuern in fernen Provinzen erheben'],
        wissen: 'Volkstribune schützten Plebejer mit Veto — ohne den Senat abzuschaffen.',
      },
      {
        q: 'Ein Diktator in der Republik …',
        correct: 'wurde auf Zeit in Notzeiten mit großer Macht eingesetzt',
        wrong: ['war dauerhafter König', 'gab es nur außerhalb Roms ohne Notlage', 'wurde nie mit Macht ausgestattet'],
        wissen: 'Diktator: große Macht auf begrenzte Zeit in Notlagen — kein dauerhaftes Königtum.',
      },
      {
        q: 'Wofür waren Quästoren zuständig?',
        correct: 'Finanzen / Staatskasse',
        wrong: ['nur das Gerichtswesen', 'nur die Sittenkontrolle', 'nur das Veto der Plebejer'],
        wissen: 'Quästoren verwalteten Finanzen und Staatskasse.',
      },
      {
        q: 'Was machten die Ädile?',
        correct: 'Stadt- und Marktverwaltung (u. a. Ordnung, Spiele, Versorgung)',
        wrong: ['nur Kriegführung als einzige Aufgabe', 'nur Königszeremonien', 'nur die Bürgerlisten der Zensoren'],
        wissen: 'Ädile: Stadt und Markt — Ordnung, oft Spiele und Versorgung.',
      },
      {
        q: 'Zensoren waren zuständig für …',
        correct: 'Sittenkontrolle und Bürgerlisten (Census)',
        wrong: ['nur das Veto der Tribune', 'nur die Finanzen der Quästoren', 'nur den Bau von Kriegsschiffen'],
        wissen: 'Zensoren: Census und öffentliche Sitte.',
      },
      {
        q: 'Warum gab es zwei Konsuln?',
        correct: 'Kollegialität — Machtteilung, keine Alleinherrschaft',
        wrong: ['weil Rom zwei Könige auf Lebenszeit wollte', 'weil einer immer in Karthago residieren musste', 'weil der Senat abgeschafft war'],
        wissen: 'Zwei Konsuln teilen die Macht — Kollegialität gegen Alleinherrschaft.',
      },
      {
        q: 'Annuität bei Magistraten bedeutet …',
        correct: 'das Amt gilt in der Regel nur für ein Jahr',
        wrong: ['das Amt gilt immer lebenslang', 'das Amt darf nur Sklaven ausüben', 'das Amt existiert nur in Karthago'],
        wissen: 'Annuität: typische Befristung auf ein Jahr.',
      },
      {
        q: 'Der Senat …',
        correct: 'berät Magistrate und beeinflusst Krieg und Frieden',
        wrong: ['ersetzt alle Magistrate dauerhaft durch einen König', 'ist nur eine Sportversammlung', 'besteht nur aus Kindern'],
        wissen: 'Der Senat berät Magistrate und beeinflusst Politik, Krieg und Frieden.',
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Republik: Magistrate, Senat, Volkstribune, Diktator auf Zeit.',
      instruction: 'Tippe die passende Zuordnung:',
      fachwissen: fw(c.wissen),
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Ämter/Organe gehören zur römischen Republik? (mehrere möglich)',
      choices: ['Konsuln', 'Prätoren', 'Volkstribune', 'Senat', 'lebenslanger König als Normalfall'],
      correct: ['Konsuln', 'Prätoren', 'Volkstribune', 'Senat'],
      solution: 'Konsuln, Prätoren, Tribune, Senat — kein Normal-König.',
      explanation: 'Klassische Republikorgane; lebenslanger König ist Ausnahme/Gegenteil.',
      instruction: 'Tippe alle zutreffenden:',
      fachwissen: fw(
        'Zur Republik gehören Konsuln, Prätoren, Volkstribune und der Senat — kein lebenslanger König als Normalfall.',
      ),
    }),
)

// ─── Punische Kriege: Inhalt (keine Jahreszahl tippen) ───────────────────────

export const romPunisch: Topic['generate'] = mixedVariants(
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne Personen und Orte den Konflikten mit Karthago zu:',
      terms: ['Karthago', 'Hannibal', 'Scipio', 'Cato'],
      meanings: [
        'Stadt in Nordafrika; Rivale Roms',
        'Feldherr Karthagos; Alpenübergang',
        'römischer Feldherr; Sieg bei Zama',
        'forderte die Zerstörung Karthagos',
      ],
      distractor: 'Romulus gründet Rom',
      solution: 'Karthago · Hannibal · Scipio · Cato',
      explanation: 'Kernfiguren und Schauplatz der Kriege gegen Karthago.',
      fachwissen: fw(
        'Karthago (Nordafrika), Hannibal (Alpen), Scipio (Zama), Cato (Zerstörungsforderung). Gründungssage gehört nicht hierher.',
      ),
    }),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne Schauplätze und Stichworte:',
      terms: ['Sizilien', 'Alpen', 'Zama', 'Nordafrika'],
      meanings: [
        'Insel — Streitobjekt; Rom wird Seemacht',
        'Übergang Hannibals nach Italien',
        'Entscheidungsschlacht; Scipio siegt',
        'Lage Karthagos; später Kriegsschauplatz',
      ],
      distractor: 'Sieben Hügel als Gründungssage',
      solution: 'Sizilien · Alpen · Zama · Nordafrika',
      explanation: 'Geografie der Konflikte mit Karthago.',
      fachwissen: fw(
        'Sizilien: Streitobjekt und Seemacht-Einstieg; Alpen: Hannibal; Zama: Scipio; Nordafrika: Karthago.',
      ),
    }),
  (rng) => {
    const cases = [
      {
        q: 'Wo lag die Stadt Karthago?',
        correct: 'in Nordafrika',
        wrong: ['in Britannien', 'am Rhein', 'nur in Gallien ohne Afrika'],
        wissen: 'Karthago lag in Nordafrika (nahe dem heutigen Tunis) — Rivale Roms.',
      },
      {
        q: 'Wer war Hannibal in den Kriegen gegen Karthago?',
        correct: 'Feldherr Karthagos; überquerte die Alpen mit seinem Heer',
        wrong: ['römischer Konsul auf Lebenszeit', 'etruskischer König Roms', 'germanischer Häuptling am Rhein'],
        wissen: 'Hannibal führte sein Heer über die Alpen nach Italien und bedrohte Rom jahrelang.',
      },
      {
        q: 'Was leistete der Römer Scipio?',
        correct: 'besiegte Hannibal in Afrika (Zama)',
        wrong: ['gründete Rom der Sage nach', 'war König der Etrusker', 'zerstörte die Stadt Rom'],
        wissen: 'Scipio besiegte Hannibal bei Zama in Nordafrika.',
      },
      {
        q: 'Was forderte Cato immer wieder im Senat?',
        correct: '„Carthago delenda est!“ — Karthago muss zerstört werden',
        wrong: ['Rom soll die Flotte abschaffen', 'Hannibal soll Konsul werden', 'nur Frieden ohne jeden Sieg'],
        wissen: 'Cato forderte die Zerstörung Karthagos: „Carthago delenda est!“',
      },
      {
        q: 'Worum ging es im Konflikt um Sizilien zuerst?',
        correct: 'um Sizilien; Rom baut eine Flotte und siegt',
        wrong: ['um Britannien', 'um die Gründung Roms', 'um den Senat in Karthago als römische Behörde'],
        wissen: 'Um Sizilien: Rom baut eine Flotte und wird Seemacht; Sizilien wird Provinz.',
      },
      {
        q: 'Warum waren die Kriege gegen Karthago für Rom wichtig?',
        correct: 'Rom wurde Großmacht und Vormacht im Mittelmeerraum',
        wrong: ['Rom verlor dauerhaft jede Seehöheit', 'Rom blieb kleiner Stadtstaat ohne Provinzen', 'Karthago eroberte Italien dauerhaft'],
        wissen: 'Siege gegen Karthago machen Rom zur Mittelmeer-Vormacht.',
      },
      {
        q: 'Richtig oder falsch? „Rom verlor alle Kriege gegen Karthago.“',
        correct: 'falsch — Rom gewann die großen Konflikte',
        wrong: ['richtig — Rom verlor alle'],
        wissen: 'Rom gewann die großen Konflikte; am Ende stand die Zerstörung Karthagos.',
      },
      {
        q: 'Was kennzeichnet Hannibals Zug nach Italien?',
        correct: 'Übergang über die Alpen mit Heer (u. a. Elefanten)',
        wrong: ['Ankunft nur mit Handelsschiffen in Britannien', 'Gründung Roms am Tiber', 'Bau des Forum Romanum'],
        wissen: 'Hannibal führte sein Heer über die Alpen nach Italien.',
      },
      {
        q: 'Welche Rolle spielte Sizilien?',
        correct: 'Streitobjekt; Einstieg Roms als Seemacht / Provinz',
        wrong: ['Hauptstadt Karthagos', 'Sitz des Senats von Anfang an', 'nur ein Fluss in Latium'],
        wissen: 'Sizilien war Streitobjekt und wurde römische Provinz.',
      },
      {
        q: 'Was passierte am Ende mit Karthago?',
        correct: 'Die Stadt wurde belagert und zerstört',
        wrong: ['Karthago wurde römische Königsresidenz auf Lebenszeit', 'Hannibal wurde Konsul in Rom', 'Rom zog sich dauerhaft nach Latium zurück'],
        wissen: 'Karthago wurde belagert und zerstört; Rom blieb Vormacht im Westmittelmeer.',
      },
      {
        q: 'Scipio und Hannibal treffen entscheidend …',
        correct: 'bei Zama (in Afrika)',
        wrong: ['nur auf dem Forum in Rom', 'nur am Rhein', 'nur auf den sieben Hügeln ohne Heer'],
        wissen: 'Die Entscheidung fiel bei Zama in Nordafrika.',
      },
      {
        q: '„Punisch“ bezieht sich auf …',
        correct: 'die Karthager (von lat. Poeni / Punier)',
        wrong: ['nur die Etrusker', 'nur die Germanen', 'nur die Griechen Athens'],
        wissen: '„Punisch“ kommt von den Puniern/Poeni — Bezeichnung für die Karthager.',
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Konflikte mit Karthago: Sizilien → Hannibal/Zama → Zerstörung.',
      instruction: 'Tippe die passende Antwort:',
      fachwissen: fw(c.wissen),
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zu den Kriegen gegen Karthago? (mehrere möglich)',
      choices: [
        'Kampf um Sizilien',
        'Hannibals Alpenzug',
        'Schlacht bei Zama',
        'Zerstörung Karthagos',
        'Gründung Roms durch Romulus',
      ],
      correct: [
        'Kampf um Sizilien',
        'Hannibals Alpenzug',
        'Schlacht bei Zama',
        'Zerstörung Karthagos',
      ],
      solution: 'Sizilien, Hannibal, Zama, Zerstörung — nicht die Gründungssage.',
      explanation: 'Vier Kriegsinhalte; Gründungssage gehört zu den Anfängen.',
      instruction: 'Tippe alle zutreffenden:',
      fachwissen: fw(
        'Zu den Konflikten gehören Sizilien, Hannibal, Zama und die Zerstörung Karthagos — nicht die Gründungssage.',
      ),
    }),
)

// ─── Weltreich: Mare Nostrum / Expansion (+ Karte) ───────────────────────────

function weltreichMapChoice(rng: Rng) {
  const phases: { key: RomMapHighlight; ask: string; correct: string; wrong: string[] }[] = [
    {
      key: 'stadt',
      ask: 'Welche Farbe / Phase steht auf der Karte für den Stadtstaat Rom?',
      correct: ROM_MAP_PHASES.stadt.label,
      wrong: [ROM_MAP_PHASES.italien.label, ROM_MAP_PHASES.west.label, ROM_MAP_PHASES.mare.label],
    },
    {
      key: 'italien',
      ask: 'Welche Phase zeigt die Kontrolle über die italienische Halbinsel?',
      correct: ROM_MAP_PHASES.italien.label,
      wrong: [ROM_MAP_PHASES.stadt.label, ROM_MAP_PHASES.west.label, ROM_MAP_PHASES.mare.label],
    },
    {
      key: 'west',
      ask: 'Welche Phase steht für die Vormacht im westlichen Mittelmeer (nach großen Kriegen)?',
      correct: ROM_MAP_PHASES.west.label,
      wrong: [ROM_MAP_PHASES.stadt.label, ROM_MAP_PHASES.italien.label, ROM_MAP_PHASES.mare.label],
    },
    {
      key: 'mare',
      ask: 'Welche Phase meint Mare Nostrum — das beherrschte Mittelmeer?',
      correct: ROM_MAP_PHASES.mare.label,
      wrong: [ROM_MAP_PHASES.stadt.label, ROM_MAP_PHASES.italien.label, ROM_MAP_PHASES.west.label],
    },
    {
      key: 'all',
      ask: 'Was zeigt die Karte insgesamt?',
      correct: 'Roms Wachstum vom Stadtstaat zur Mittelmeer-Vormacht',
      wrong: [
        'nur die Gründungssage ohne Expansion',
        'nur das Ende Roms im Mittelalter',
        'nur die Stadt Karthago ohne Rom',
      ],
    },
  ]
  const c = pick(rng, phases)
  return choicePickTask({
    question: `${c.ask}\n\n(Legende beachten)`,
    choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
    correct: c.correct,
    solution: c.correct,
    explanation: `Stadtstaat → Italien → Westmittelmeer → Mare Nostrum. ${ROM_MAP_ATTRIBUTION}`,
    instruction: 'Tippe die passende Phase / Aussage:',
    visualContent: romanExpansionMapSvg(c.key),
    fachwissen: fwMap(
      'Die Schulkarte zeigt schematisch Roms Expansion: dunkler Kern = Stadtstaat, orange = Italien, gelb = Westmittelmeer, grün = Mare Nostrum.',
    ),
  })
}

export const romWeltreich: Topic['generate'] = mixedVariants(
  (rng) => weltreichMapChoice(rng),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne den Phasen die passende Beschreibung zu:',
      terms: ['Stadtstaat', 'Land-/Seemacht', 'Weltmacht', 'Mare Nostrum'],
      meanings: [
        'nur die Stadt Rom und näheres Umland',
        'Kontrolle über Italien und Seewege',
        'Vormacht um das Mittelmeer',
        '„unser Meer“ — beherrschtes Mittelmeer',
      ],
      distractor: 'Romulus und Remus als Konsuln',
      solution: 'Stadtstaat → Land/Seemacht → Weltmacht; Mare Nostrum',
      explanation: 'Kartenbild: Wachstum vom Stadtstaat zur Mittelmeer-Vormacht.',
      visualContent: romanExpansionMapSvg('all'),
      fachwissen: fwMap(
        'Stadtstaat → Land-/Seemacht → Weltmacht; Mare Nostrum = beherrschtes Mittelmeer.',
      ),
    }),
  (rng) => {
    const cases = [
      {
        q: 'Wie nannten die Römer das beherrschte Mittelmeer?',
        correct: 'Mare Nostrum („unser Meer“)',
        wrong: ['Mare Germanicum', 'Ozeanus Atlanticus', 'Pontus Euxinus'],
        wissen: 'Mare Nostrum bedeutet „unser Meer“ — Ausdruck der römischen Mittelmeer-Vormacht.',
        map: 'mare' as RomMapHighlight,
      },
      {
        q: '„Vom Stadtstaat zum Weltreich“ bedeutet …',
        correct: 'Rom wächst von einer Stadt zur Macht um das Mittelmeer',
        wrong: ['Rom schrumpft auf sieben Hügel', 'Karthago erobert Rom dauerhaft', 'Rom bleibt ohne Heer und Provinzen'],
        wissen: 'Vom Stadtstaat am Tiber zur Macht um das Mittelmeer.',
        map: 'all' as RomMapHighlight,
      },
      {
        q: 'Nach den großen Kriegen im Westen wird Rom vor allem …',
        correct: 'Vormacht / Weltmacht im Mittelmeerraum',
        wrong: ['abhängige Provinz Karthagos', 'nur ein Dorf ohne Einfluss', 'germanisches Königreich'],
        wissen: 'Nach den Siegen im Westen wird Rom Vormacht im Mittelmeerraum.',
        map: 'west' as RomMapHighlight,
      },
      {
        q: 'Der erste Schritt der Expansion ist …',
        correct: 'Kontrolle über Italien (Landmacht)',
        wrong: ['sofort das gesamte Mare Nostrum ohne Italien', 'Rückzug nur auf den Palatin', 'Aufgabe aller Seewege'],
        wissen: 'Zuerst Italien, danach Seewege und das weitere Mittelmeer.',
        map: 'italien' as RomMapHighlight,
      },
      {
        q: 'Was bedeutet Mare Nostrum wörtlich?',
        correct: 'unser Meer',
        wrong: ['fremdes Meer', 'kaltes Meer', 'leeres Meer'],
        wissen: 'Mare = Meer, Nostrum = unser.',
        map: 'mare' as RomMapHighlight,
      },
      {
        q: 'Warum ist eine Phasen-Karte für dieses Thema nützlich?',
        correct: 'Sie zeigt Wachstumsschritte vom Kern zur Mittelmeer-Vormacht',
        wrong: ['Sie ersetzt jedes Datum tippen', 'Sie zeigt nur moderne Autobahnen', 'Sie gilt nur für das Mittelalter'],
        wissen: 'Die Phasen-Karte macht Expansionsschritte sichtbar — ein Lernbild, keine Autobahnkarte.',
        map: 'all' as RomMapHighlight,
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: `Stadtstaat → Land-/Seemacht → Weltmacht; Mare Nostrum. ${ROM_MAP_ATTRIBUTION}`,
      instruction: 'Tippe die passende Aussage:',
      visualContent: romanExpansionMapSvg(c.map),
      fachwissen: fwMap(c.wissen),
    })
  },
  (_rng) =>
    textTask({
      question: 'Lateinisch: Wie nannten die Römer das Mittelmeer? (zwei Wörter)',
      accepted: ['mare nostrum', 'Mare Nostrum'],
      solution: 'Mare Nostrum',
      explanation: `Mare Nostrum = „unser Meer“. ${ROM_MAP_ATTRIBUTION}`,
      visualContent: romanExpansionMapSvg('mare'),
      fachwissen: fwMap(
        'Mare Nostrum („unser Meer“) — lateinischer Name für das beherrschte Mittelmeer.',
      ),
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zur Expansion Roms? (mehrere möglich)',
      choices: [
        'Stadtstaat am Tiber',
        'Kontrolle Italiens',
        'Vormacht im Westmittelmeer',
        'Mare Nostrum',
        'Rom bleibt dauerhaft nur ein Dorf',
      ],
      correct: [
        'Stadtstaat am Tiber',
        'Kontrolle Italiens',
        'Vormacht im Westmittelmeer',
        'Mare Nostrum',
      ],
      solution: 'Stadtstaat → Italien → Westmittelmeer → Mare Nostrum.',
      explanation: `Vier Expansionsstufen; „nur Dorf“ ist falsch. ${ROM_MAP_ATTRIBUTION}`,
      instruction: 'Tippe alle zutreffenden Phasen:',
      visualContent: romanExpansionMapSvg('all'),
      fachwissen: fwMap(
        'Expansion: Stadtstaat → Italien → Westmittelmeer → Mare Nostrum.',
      ),
    }),
)

// ─── Bürgerrecht: nur Rechte / Schutz ────────────────────────────────────────

export const romBuergerrecht: Topic['generate'] = mixedVariants(
  (_rng) =>
    multiSelectTask({
      question: 'Was gehörte zum römischen Bürgerrecht? (mehrere möglich)',
      choices: [
        'Schutz vor Willkür / Folter',
        'Testamente verfassen',
        'Geschäftsverträge abschließen',
        'Wahlrecht in der Volksversammlung',
        'unbeschränkte Königsmacht für jeden Bürger',
      ],
      correct: [
        'Schutz vor Willkür / Folter',
        'Testamente verfassen',
        'Geschäftsverträge abschließen',
        'Wahlrecht in der Volksversammlung',
      ],
      solution: 'Rechte und Schutz — keine persönliche Königsmacht.',
      explanation: 'Bürgerrecht schützt und berechtigt; es macht niemanden zum König.',
      instruction: 'Tippe alle zutreffenden Rechte:',
      fachwissen: fw(
        'Bürgerrecht: Schutz vor Willkür, Testamente, Verträge, Wahlrecht — keine Königsmacht.',
      ),
    }),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne: Welches Recht gehört wohin?',
      terms: ['Schutz', 'Verträge', 'Testament', 'Wahlrecht'],
      meanings: [
        'Schutz vor Willkür (z. B. Folter)',
        'Geschäftsverträge abschließen',
        'letzter Wille schriftlich festlegen',
        'Mitbestimmung in der Volksversammlung',
      ],
      distractor: 'Jeder Bürger wird automatisch König',
      solution: 'Schutz · Verträge · Testament · Wahlrecht',
      explanation: 'Bürgerrecht = Schutz + rechtliche und politische Teilhabe.',
      fachwissen: fw(
        'Schutz, Verträge, Testament, Wahlrecht — keine automatische Königsmacht.',
      ),
    }),
  (rng) => {
    const cases = [
      {
        q: 'Das Bürgerrecht schützte vor …',
        correct: 'Willkür (z. B. Folter / willkürliches Todesurteil)',
        wrong: [
          'jeder Steuer überhaupt weltweit',
          'der Pflicht, jemals Verträge zu schließen',
          'der Teilnahme an der Volksversammlung',
        ],
        wissen: 'Schutz vor Willkür (Folter, willkürliches Todesurteil) — nicht Steuerfreiheit weltweit.',
      },
      {
        q: 'Dürften Bürger Geschäftsverträge schließen?',
        correct: 'ja — Vertragsfähigkeit gehörte zum Status',
        wrong: [
          'nein — Verträge waren nur Königen erlaubt',
          'nur wenn sie den Senat abschafften',
          'nur außerhalb jeder Rechtsordnung',
        ],
        wissen: 'Bürger durften Geschäftsverträge abschließen — Kernbestandteil des Status.',
      },
      {
        q: 'Hatten Bürger Wahlrecht in der Volksversammlung?',
        correct: 'ja — mit Abstufungen je nach Zeit und Stand',
        wrong: [
          'nein, nie in der gesamten Republik',
          'nur Sklaven hatten Wahlrecht',
          'nur fremde Feldherren ohne Bürgerstatus',
        ],
        wissen: 'Bürger hatten Wahlrecht in der Volksversammlung (mit Abstufungen).',
      },
      {
        q: 'Ein Testament verfassen …',
        correct: 'gehörte zu den rechtlichen Möglichkeiten von Bürgern',
        wrong: [
          'war nur ohne jedes Eigentum möglich',
          'war ausschließlich Sklaven vorbehalten',
          'ersetzte das Bürgerrecht vollständig',
        ],
        wissen: 'Bürger konnten ihren letzten Willen in einem Testament festlegen.',
      },
      {
        q: 'Was bedeutet „Schutz vor Willkür“ praktisch?',
        correct: 'Verfahren und Rechte statt reiner Gewalt eines Beamten',
        wrong: [
          'Bürger dürfen Gesetze jederzeit ignorieren',
          'Bürger müssen nie Steuern zahlen',
          'Bürger werden automatisch Magistrate auf Lebenszeit',
        ],
        wissen: 'Rechtliche Grenzen und Verfahren — nicht Steuerfreiheit oder lebenslanges Amt.',
      },
      {
        q: 'Wer hatte typischerweise kein volles römisches Bürgerrecht?',
        correct: 'Sklaven (und oft auch Peregrine / Nichtbürger)',
        wrong: [
          'Konsuln während ihrer Amtszeit',
          'Patrizier grundsätzlich',
          'alle Bewohner Italiens automatisch von Anfang an',
        ],
        wissen: 'Sklaven hatten kein Bürgerrecht; viele Nichtbürger waren eingeschränkt.',
      },
      {
        q: 'Warum war das Bürgerrecht attraktiv?',
        correct: 'Es bot Schutz und rechtliche/politische Teilhabe',
        wrong: [
          'Es entzog jede Rechtsfähigkeit',
          'Es machte automatisch zum König',
          'Es verbot alle Verträge und Testamente',
        ],
        wissen: 'Attraktiv wegen Schutz und Teilhabe — nicht wegen Königswürde.',
      },
      {
        q: 'Das Bürgerrecht macht aus einem Menschen …',
        correct: 'einen Rechtsträger mit bestimmten Rechten und Pflichten',
        wrong: [
          'automatisch den Alleinherrscher Roms',
          'automatisch einen Sklaven',
          'jemand ohne jede Rechtsbindung',
        ],
        wissen: 'Bürgerstatus = Rechte und Pflichten — nicht Alleinherrschaft.',
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Bürgerrecht: Schutz, Verträge, Testament, Wahlrecht.',
      instruction: 'Tippe die passende Antwort:',
      fachwissen: fw(c.wissen),
    })
  },
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne: Wer hat typischerweise welches Verhältnis zum Bürgerrecht?',
      terms: ['römischer Bürger', 'Sklave', 'Peregrinus', 'Freigelassener'],
      meanings: [
        'volle/teilweise Bürgerrechte je nach Zeit',
        'kein Bürgerrecht; Eigentum eines Herrn',
        'freier Nichtbürger mit eingeschränkten Rechten',
        'ehemals Sklave; oft eingeschränktes Bürgerrecht',
      ],
      distractor: 'Jeder Einwohner ist automatisch König',
      solution: 'Bürger · Sklave · Peregrinus · Freigelassener',
      explanation: 'Statusunterschiede erklären, warum Bürgerrecht so wichtig war.',
      fachwissen: fw(
        'Bürger mit Rechten; Sklaven ohne; Peregrine eingeschränkt; Freigelassene oft eingeschränkt.',
      ),
    }),
)

// ─── Prägende Wirkung für Europa (Legacy — kein Kriegs-/Ämter-Drill) ─────────

export const romUeberblick: Topic['generate'] = mixedVariants(
  (rng) =>
    matchTermsTask(rng, {
      question: 'Was wirkt aus Rom bis heute in Europa nach?',
      terms: ['Latein', 'Recht', 'Straßen', 'Städte'],
      meanings: [
        'Wurzel vieler europäischer Sprachen / Fachwörter',
        'Ideen von Gesetz, Vertrag und Bürgerstatus',
        'Fernwege und Infrastruktur als Vorbild',
        'städtisches Leben, Forum, öffentliche Bauten',
      ],
      distractor: 'Hannibal als heutiger EU-Präsident',
      solution: 'Latein · Recht · Straßen · Städte',
      explanation: 'Prägend: Sprache, Recht, Infrastruktur, Stadtidee — nicht nur Kriege.',
      fachwissen: fw(
        'Nachwirkungen: Latein, Recht, Straßen/Infrastruktur, städtisches Leben. Kriege allein erklären das nicht.',
      ),
    }),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne weitere Nachwirkungen:',
      terms: ['Kalender', 'Schriftkultur', 'Architektur', 'Verwaltung'],
      meanings: [
        'Monatsnamen und Jahresstruktur wirken nach',
        'lateinische Schrift und Bildungstradition',
        'Bögen, Kuppel, öffentliche Gebäude',
        'Provinzen, Beamte, Steuern als Vorbild',
      ],
      distractor: 'Abschaffung jeder Stadt in Europa',
      solution: 'Kalender · Schrift · Architektur · Verwaltung',
      explanation: 'Weitere Spuren: Zeitrechnung, Schrift, Bauen, Verwaltung.',
      fachwissen: fw(
        'Kalender, lateinische Schriftkultur, Architektur und Verwaltungsmodelle wirken nach.',
      ),
    }),
  (rng) => {
    const cases = [
      {
        q: 'Warum gilt die römische Zivilisation als prägend für Europa?',
        correct: 'u. a. Sprache, Recht, Städtebau und Infrastruktur wirkten lange nach',
        wrong: ['weil Rom nie Krieg führte', 'weil nur Karthago Europa prägte', 'weil es keine Straßen gab'],
        wissen: 'Prägend wegen Latein, Recht, Städtebau und Infrastruktur.',
      },
      {
        q: 'Welche Idee verbindet man oft mit römischem Recht?',
        correct: 'klare Regeln, Verträge und Rechte von Bürgern',
        wrong: [
          'nur Willkür eines Königs ohne Gesetz',
          'nur Regeln ohne Eigentum und Verträge',
          'Recht gilt nur für Gebäude, nie für Menschen',
        ],
        wissen: 'Römisches Recht: klare Regeln, Verträge, Bürgerrechte.',
      },
      {
        q: 'Latein ist für Europa wichtig, weil …',
        correct: 'viele Wörter und Fachbegriffe darauf zurückgehen',
        wrong: [
          'es nur in einer einzigen Stadt ohne Schrift existierte',
          'es keine Fachsprache beeinflusste',
          'es erst im 21. Jahrhundert erfunden wurde',
        ],
        wissen: 'Latein ist Wurzel vieler Sprachen und Fachbegriffe.',
      },
      {
        q: 'Römische Straßen stehen sinnbildlich für …',
        correct: 'Infrastruktur, Vernetzung und Verwaltung über weite Räume',
        wrong: [
          'die Ablehnung jeder Fernverbindung',
          'nur den Bau von Schiffen ohne Landweg',
          'das Ende städtischen Lebens',
        ],
        wissen: 'Straßen ermöglichten Militär, Handel und Verwaltung.',
      },
      {
        q: 'Das Forum steht für …',
        correct: 'öffentliches städtisches Zentrum (Markt, Politik, Begegnung)',
        wrong: ['nur private Schlafzimmer', 'nur Wälder ohne Siedlung', 'nur eine einzelne Hütte ohne Öffentlichkeit'],
        wissen: 'Das Forum war öffentlicher Mittelpunkt: Markt, Politik, Begegnung.',
      },
      {
        q: 'Welche Sprachenfamilie prägte Latein besonders?',
        correct: 'die romanischen Sprachen (u. a. Italienisch, Französisch, Spanisch)',
        wrong: [
          'nur Sprachen ohne jeden lateinischen Einfluss',
          'ausschließlich Sprachen außerhalb Europas ohne Kontakt',
          'keine Sprache nach der Antike',
        ],
        wissen: 'Aus dem Lateinischen entwickelten sich die romanischen Sprachen.',
      },
      {
        q: 'Bürgerstatus und Vertragsideen wirken nach, weil …',
        correct: 'Rechtspersonen, Regeln und Verbindlichkeit spätere Ordnungen beeinflussten',
        wrong: [
          'Rom alle Verträge verboten hatte',
          'es kein Recht gab',
          'nur Könige Verträge kannten und Bürger nie',
        ],
        wissen: 'Ideen von Rechtsperson, Vertrag und Bürgerstatus beeinflussten spätere Ordnungen.',
      },
      {
        q: 'Öffentliche Bauten (Thermen, Theater, Aquädukte) zeigen …',
        correct: 'städtische Infrastruktur und Gemeinschaftsleben',
        wrong: ['dass Rom Städte ablehnte', 'dass es keine Technik gab', 'dass nur Zelte erlaubt waren'],
        wissen: 'Thermen, Theater und Aquädukte = öffentliche Infrastruktur.',
      },
      {
        q: '„Prägend für Europa“ meint vor allem …',
        correct: 'langfristige kulturelle und institutionelle Nachwirkungen',
        wrong: [
          'dass Europa geografisch identisch mit Latium ist',
          'dass es keine anderen Einflüsse gab',
          'dass nur ein einziges Kriegsjahr zählt',
        ],
        wissen: 'Langfristige Spuren in Sprache, Recht, Stadt und Infrastruktur.',
      },
      {
        q: 'Welche Aussage ist richtig?',
        correct: 'Römische Einflüsse mischen sich mit anderen Traditionen in Europa',
        wrong: [
          'Nur Rom hat Europa jemals beeinflusst',
          'Rom hinterließ keinerlei Spuren',
          'Latein verschwand ohne jede Nachwirkung',
        ],
        wissen: 'Römische Einflüsse sind wichtig, aber Europa hat viele Wurzeln.',
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Nachwirkung: Latein, Recht, Städte, Straßen — „prägend für Europa“.',
      instruction: 'Tippe die passende Aussage:',
      fachwissen: fw(c.wissen),
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Was wirkt aus der römischen Zivilisation nach? (mehrere möglich)',
      choices: [
        'Latein / romanische Sprachen',
        'Rechtsideen (Vertrag, Bürger)',
        'Straßen und Infrastruktur',
        'städtisches Leben / Forum',
        'Rom hat nie gebaut und nie geschrieben',
      ],
      correct: [
        'Latein / romanische Sprachen',
        'Rechtsideen (Vertrag, Bürger)',
        'Straßen und Infrastruktur',
        'städtisches Leben / Forum',
      ],
      solution: 'Sprache, Recht, Infrastruktur, Stadt — nicht „nie gebaut“.',
      explanation: 'Vier Nachwirkungen; die Negativaussage ist falsch.',
      instruction: 'Tippe alle zutreffenden:',
      fachwissen: fw(
        'Nachwirkungen: Latein, Recht, Straßen, städtisches Leben. Rom hat gebaut und geschrieben.',
      ),
    }),
)


export const GESCHICHTE_K6_GENERATORS: Record<string, Topic['generate']> = {
  'ge-k6-lb1-rom': romUeberblick,
  'ge-k6-lb1-jahreszahlen': romJahreszahlen,
  'ge-k6-lb1-anfaenge': romAnfaenge,
  'ge-k6-lb1-begriffe': romBegriffe,
  'ge-k6-lb1-aemter': romAemter,
  'ge-k6-lb1-punische-kriege': romPunisch,
  'ge-k6-lb1-weltreich': romWeltreich,
  'ge-k6-lb1-buergerrecht': romBuergerrecht,
  'ge-k6-lb1-chronologie': romChronologie,
}
