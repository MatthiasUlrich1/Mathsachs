/**
 * Geschichte Klasse 6 — LB1 Römische Zivilisation.
 * Themen scharf getrennt (wenig Überschneidung). Jahreszahlen nur im eigenen Thema.
 * Spoiler: Merkhilfen/Jahreszahlen stehen erst in der Erklärung nach dem Prüfen.
 * Fachwissen ist immer auf die *aktuelle* Frage bezogen (z. B. Jahr → Ereignis).
 */
import type { Rng } from '../lib/rng'
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
  })
}

// ─── Nur Jahreszahlen (gesamter LB1) ─────────────────────────────────────────

export const romJahreszahlen: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.5) return yearValueTask(rng)
  if (roll < 0.78) return yearMcTask(rng)
  return yearEventChoice(rng)
}

// ─── Chronologie: nur Reihenfolge (keine Jahreszahl tippen) ──────────────────

export const romChronologie: Topic['generate'] = mixedVariants(
  (_rng) =>
    dragDropSortTask({
      question: 'Ordne die Ereignisse chronologisch (früh → spät):',
      items: [
        { label: 'Gründung Roms (Sage)', value: 0 },
        { label: 'Beginn der Republik', value: 1 },
        { label: 'Erster Punischer Krieg beginnt', value: 2 },
        { label: 'Hannibal überquert die Alpen', value: 3 },
        { label: 'Zerstörung Karthagos', value: 4 },
      ],
      correctOrder: [0, 1, 2, 3, 4],
      solution: 'Gründung → Republik → 1. Punischer Krieg → Alpen → Karthago zerstört',
      explanation: 'So baut sich LB1 zeitlich auf — von den Anfängen bis zur Vormacht.',
      rng: _rng,
      fachwissen: fw(
        'Chronologie LB1 (früh → spät): Gründungssage Roms → Beginn der Republik (~500) → Erster Punischer Krieg (Sizilien) → Hannibal über die Alpen (2. Punischer Krieg) → Zerstörung Karthagos (146). So merkst du die Reihenfolge ohne jede Jahreszahl tippen zu müssen.',
      ),
    }),
  (_rng) =>
    dragDropSortTask({
      question: 'Ordne die drei Punischen Kriege chronologisch (früh → spät):',
      items: [
        { label: 'Krieg um Sizilien (1. Punischer Krieg)', value: 0 },
        { label: 'Hannibal / Alpen / Zama (2. Punischer Krieg)', value: 1 },
        { label: 'Zerstörung Karthagos (3. Punischer Krieg)', value: 2 },
      ],
      correctOrder: [0, 1, 2],
      solution: '1. → 2. → 3. Punischer Krieg',
      explanation: 'Die drei Kriege gegen Karthago folgen nacheinander.',
      rng: _rng,
      fachwissen: fw(
        'Die drei Punischen Kriege folgen nacheinander: (1) Kampf um Sizilien — Rom wird Seemacht; (2) Hannibal über die Alpen, Entscheidung bei Zama; (3) Belagerung und Zerstörung Karthagos. Merke: Sizilien → Hannibal → Zerstörung.',
      ),
    }),
  (rng) =>
    matchTermsTask(rng, {
      question: 'Ordne: Welcher Krieg passt zu welchem Schwerpunkt?',
      terms: ['1. Punischer Krieg', '2. Punischer Krieg', '3. Punischer Krieg'],
      meanings: [
        'Kampf um Sizilien; Rom wird Seemacht',
        'Hannibal über die Alpen; Entscheidung bei Zama',
        'Karthago wird belagert und zerstört',
      ],
      distractor: 'Gründung Roms durch Romulus und Remus',
      solution: '1. Sizilien · 2. Hannibal/Zama · 3. Zerstörung',
      explanation: 'Jeder Krieg hat einen klaren Schwerpunkt — so merkst du die Reihenfolge.',
      fachwissen: fw(
        'Schwerpunkte der Punischen Kriege: 1. Sizilien und Flotte; 2. Hannibal, Alpen, Zama (Scipio); 3. Belagerung und Zerstörung Karthagos. Die Gründungssage gehört nicht in diese Kriegslinie.',
      ),
    }),
)

// ─── Anfänge: Sage, Siedlung, Etrusker (kein Senat/Krieg/Ämter) ───────────────

export const romAnfaenge: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.35) {
    return matchTermsTask(rng, {
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
        'Anfänge Roms in vier Schichten: (1) Sage — Romulus und Remus; (2) frühe Siedlung von Sabinern und Latinern am Tiber; (3) Etrusker bringen Steinbau, Wasser und Metall; (4) Lage auf sieben Hügeln. Hannibal gehört in die Punischen Kriege, nicht hierher.',
      ),
    })
  }
  const cases = [
    {
      q: 'Wer gründete Rom der Sage nach?',
      correct: 'Romulus und Remus',
      wrong: ['Hannibal und Scipio', 'Caesar und Augustus', 'Cato und Scipio'],
      explanation: 'Zwillinge Romulus und Remus — Sage zur Stadtgründung.',
      wissen:
        'Der Sage nach gründeten die Zwillinge Romulus und Remus Rom. Romulus tötete Remus und wurde erster König. Die Geschichte erklärt mythisch den Ursprung der Stadt — historisch ist sie nicht wörtlich belegbar.',
    },
    {
      q: 'Auf wie vielen Hügeln lag Rom der Sage nach?',
      correct: 'sieben',
      wrong: ['drei', 'zehn', 'zwei'],
      explanation: '„Stadt auf sieben Hügeln“.',
      wissen:
        'Rom heißt in der Überlieferung die „Stadt auf sieben Hügeln“. Die Hügellage am Tiber bot Schutz und Überblick — ein zentrales Bild in der römischen Gründungserzählung.',
    },
    {
      q: 'Was brachten die Etrusker nach Rom?',
      correct: 'Stein-/Ziegelbau, Wassertechnik, Metallverarbeitung',
      wrong: ['Buchdruck', 'das Bürgerrecht Karthagos', 'die Zerstörung Karthagos'],
      explanation: 'Etrusker: neue Lebensweise, Steinbau, Wasser, Metall.',
      wissen:
        'Die Etrusker beeinflussten frühes Rom stark: Stein- und Ziegelbau, Wassertechnik und Metallverarbeitung. In der Königszeit hatten etruskische Herrscher Einfluss — Technik und städtische Kultur vor der Republik.',
    },
    {
      q: 'Sabiner und Latiner (Hirten/Bauern) …',
      correct: 'siedeln früh am Tiber und entwickeln einen Handelsplatz',
      wrong: [
        'zerstören Karthago',
        'überqueren die Alpen mit Elefanten',
        'sind nur Feldherren Karthagos',
      ],
      explanation: 'Frühe Siedlung am Tiber → Handelsplatz.',
      wissen:
        'Sabiner und Latiner siedelten früh als Hirten und Bauern am Tiber. Aus ihren Siedlungen wuchs ein Handelsplatz — die reale Schicht unter der späteren Gründungssage.',
    },
    {
      q: 'Warum endet die Königszeit in Rom (ca. 500 v. Chr.)?',
      correct: 'Patrizier vertreiben den König und begründen die Republik',
      wrong: [
        'Hannibal erobert Rom',
        'Karthago gründet den Senat',
        'Romulus wird Konsul',
      ],
      explanation: 'Ende der Königszeit → Republik (res publica).',
      wissen:
        'Um 500 v. Chr. vertreiben Patrizier den König und begründen die Republik (res publica). Statt Alleinherrschaft: gewählte Magistrate und der Senat als Rat. Das ist der Übergang von der Königszeit zur frühen Republik.',
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
}

// ─── Begriffe: nur Republik / Senat / Patrizier / Plebejer ───────────────────

export const romBegriffe: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.55) {
    return matchTermsTask(rng, {
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
      explanation:
        'res publica = öffentliche Sache; Senat berät; Patrizier = Adel; Plebejer = Volk.',
      fachwissen: fw(
        'Kernbegriffe der frühen Republik: res publica = „öffentliche Sache“ (Regierung durch gewählte Vertreter); Senat = Rat der Ältesten; Patrizier = Adlige („Väter“); Plebejer = Volk ohne Adelszugehörigkeit. Ein König mit unbeschränkter Macht ist das Gegenteil der Republik.',
      ),
    })
  }
  const cases = [
    {
      q: '„Republik“ kommt von lat. res publica und bedeutet …',
      correct: 'öffentliche Sache — Regierung durch gewählte Vertreter',
      wrong: [
        'Alleinherrschaft eines Königs',
        'nur Militär ohne Senat',
        'Herrschaft der Götter',
      ],
      wissen:
        'Res publica heißt wörtlich „öffentliche Sache“. In der römischen Republik regieren gewählte Vertreter (Magistrate), nicht ein König auf Lebenszeit. Der Senat berät; das Volk hat in Versammlungen Mitspracherechte — mit Abstufungen je nach Stand.',
    },
    {
      q: 'Was war der Senat in der frühen Republik?',
      correct: 'Rat der Ältesten; politische Versammlung zunächst adliger Männer',
      wrong: [
        'nur die Plebejerversammlung',
        'das Heer Hannibals',
        'ein einzelner König',
      ],
      wissen:
        'Der Senat war der Rat der Ältesten: eine politische Versammlung zunächst adliger Männer. Er beriet Magistrate zu Krieg, Frieden und Politik — kein einzelner König und keine reine Plebejerversammlung.',
    },
    {
      q: 'Wer waren die Patrizier?',
      correct: 'Adlige und wohlhabende Römer (lat. „Väter“)',
      wrong: [
        'das einfache Volk ohne Adel',
        'Feldherren Karthagos',
        'nur Sklaven',
      ],
      wissen:
        'Patrizier (von lat. „Väter“) waren die adligen, wohlhabenden Familien. In der frühen Republik hatten sie den größten politischen Einfluss; Plebejer standen ihnen als Volk ohne Adelszugehörigkeit gegenüber.',
    },
    {
      q: 'Wer waren die Plebejer?',
      correct: 'Angehörige des Volkes, die nicht zum Adel gehörten',
      wrong: [
        'nur die Konsuln',
        'etruskische Könige',
        'Mitglieder des Senats von Anfang an',
      ],
      wissen:
        'Plebejer waren Angehörige des Volkes ohne Adelszugehörigkeit. Sie waren lange von vielen Ämtern ausgeschlossen und erkämpften sich später Rechte (z. B. Volkstribune mit Veto).',
    },
    {
      q: 'In der frühen Republik hatten zunächst vor allem … die Macht.',
      correct: 'die Patrizier; Plebejer blieben lange machtlos',
      wrong: [
        'alle Bürger gleichermaßen',
        'nur die Plebejer',
        'nur Sklaven',
      ],
      wissen:
        'In der frühen Republik lag die Macht zunächst bei den Patriziern. Plebejer blieben lange politisch benachteiligt — Gleichheit aller Bürger war kein Ausgangspunkt der Republik.',
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
}

// ─── Ämter: nur Magistrate / Institutionen ───────────────────────────────────

export const romAemter: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.5) {
    return matchTermsTask(rng, {
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
        'Klassische Magistrate der Republik: zwei Konsuln (oberste Beamte), Prätoren (Gerichtswesen), Ädile (Stadt-/Marktverwaltung), Quästoren (Finanzen). Jedes Amt hat einen klaren Zuständigkeitsbereich — nicht zu verwechseln mit Kriegsereignissen wie der Zerstörung Karthagos.',
      ),
    })
  }
  if (roll < 0.75) {
    return matchTermsTask(rng, {
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
      explanation: 'Neben den normalen Magistraten: Kontrolle, Plebejerschutz, Notstand, Senat.',
      fachwissen: fw(
        'Weitere Organe: Zensoren (Sittenkontrolle, Bürgerlisten), Volkstribune (Veto zum Schutz der Plebejer), Diktator (große Macht auf Zeit in Notlagen), Senat (berät zu Krieg und Frieden). Ein ständiger König — egal ob Hannibal — widerspricht dem Republikprinzip.',
      ),
    })
  }
  const cases = [
    {
      q: 'Welche Aufgabe hatten die beiden Konsuln?',
      correct: 'die obersten Beamten Roms',
      wrong: ['nur für Finanzen zuständig', 'nur Volkstribune', 'Könige auf Lebenszeit'],
      wissen:
        'Zwei Konsuln waren die obersten Beamten der Republik. Sie führten gemeinsam, damit nicht ein Einzelner Alleinherrscher wurde — und nur auf begrenzte Zeit, nicht als Könige auf Lebenszeit.',
    },
    {
      q: 'Wofür waren die Prätoren zuständig?',
      correct: 'das Gerichtswesen',
      wrong: ['nur Sittenkontrolle', 'nur die Flotte Karthagos', 'Getreide aus Germanien'],
      wissen:
        'Prätoren waren für das Gerichtswesen zuständig: Rechtsprechung und Rechtsordnung in der Republik. Sittenkontrolle war Sache der Zensoren; Finanzen der Quästoren.',
    },
    {
      q: 'Was konnten Volkstribune?',
      correct: 'Veto einlegen (Schutz der Plebejer)',
      wrong: ['den Senat abschaffen', 'Könige ernennen', 'nur Steuern in Karthago erheben'],
      wissen:
        'Volkstribune schützten die Plebejer: Sie konnten ein Veto gegen Beschlüsse einlegen. Das Amt entstand aus den Standeskämpfen und begrenzte die Macht der Patrizier — ohne den Senat abzuschaffen oder Könige einzusetzen.',
    },
    {
      q: 'Ein Diktator in der Republik …',
      correct: 'wurde auf Zeit in Notzeiten mit großer Macht eingesetzt',
      wrong: ['war dauerhafter König', 'gab es nur in Karthago', 'wurde nie gewählt'],
      wissen:
        'Ein Diktator wurde in Notzeiten auf begrenzte Zeit mit großer Macht eingesetzt. Das war kein dauerhaftes Königtum: Die Befristung sollte Missbrauch verhindern und die Republik retten, nicht ersetzen.',
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
}

// ─── Punische Kriege: Inhalt (keine Jahreszahl tippen) ───────────────────────

export const romPunisch: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.4) {
    return matchTermsTask(rng, {
      question: 'Ordne Personen und Orte den Punischen Kriegen zu:',
      terms: ['Karthago', 'Hannibal', 'Scipio', 'Cato'],
      meanings: [
        'Stadt in Nordafrika; Rivale Roms',
        'Feldherr Karthagos; Alpenübergang',
        'römischer Feldherr; Sieg bei Zama',
        'forderte die Zerstörung Karthagos',
      ],
      distractor: 'Romulus gründet Rom',
      solution: 'Karthago · Hannibal · Scipio · Cato',
      explanation: 'Kernfiguren und Schauplatz der Punischen Kriege.',
      fachwissen: fw(
        'Punische Kriege — Personen und Ort: Karthago (Nordafrika, Rivale), Hannibal (karthagischer Feldherr, Alpen), Scipio (römischer Sieger bei Zama), Cato (forderte die Zerstörung Karthagos). Die Gründungssage um Romulus gehört nicht hierher.',
      ),
    })
  }
  const cases = [
    {
      q: 'Wo lag die Stadt Karthago?',
      correct: 'in Nordafrika',
      wrong: ['in Britannien', 'am Rhein', 'nur in Gallien'],
      wissen:
        'Karthago lag in Nordafrika (nahe dem heutigen Tunis). Die Stadt war Handels- und Seemacht und der große Rivale Roms in den Punischen Kriegen — nicht in Britannien oder am Rhein.',
    },
    {
      q: 'Wer war Hannibal in den Punischen Kriegen?',
      correct: 'Feldherr Karthagos; überquerte die Alpen mit seinem Heer',
      wrong: ['römischer Konsul', 'etruskischer König', 'germanischer Häuptling'],
      wissen:
        'Hannibal war der bedeutendste Feldherr Karthagos im Zweiten Punischen Krieg. Er führte sein Heer (mit Elefanten) über die Alpen nach Italien und bedrohte Rom jahrelang.',
    },
    {
      q: 'Was leistete der Römer Scipio im Zweiten Punischen Krieg?',
      correct: 'besiegte Hannibal in Afrika (Zama)',
      wrong: ['gründete Rom', 'war König der Etrusker', 'zerstörte Rom'],
      wissen:
        'Scipio (Africanus) besiegte Hannibal 202 v. Chr. in der Schlacht bei Zama in Nordafrika. Damit entschied Rom den Zweiten Punischen Krieg — Scipio gründete Rom nicht und war kein etruskischer König.',
    },
    {
      q: 'Was forderte Cato immer wieder im Senat?',
      correct: '„Carthago delenda est!“ — Karthago muss zerstört werden',
      wrong: [
        'Rom soll die Flotte abschaffen',
        'Hannibal soll Konsul werden',
        'nur Frieden ohne Sieg',
      ],
      wissen:
        'Cato der Ältere schloss Reden im Senat oft mit „Carthago delenda est!“ — Karthago müsse zerstört werden. Diese Haltung bereitete den Dritten Punischen Krieg und die endgültige Zerstörung Karthagos mit vor.',
    },
    {
      q: 'Worum ging es im Ersten Punischen Krieg zuerst?',
      correct: 'um Sizilien; Rom baut eine Flotte und siegt',
      wrong: ['um Britannien', 'um die Gründung Roms', 'um den Senat in Karthago'],
      wissen:
        'Im Ersten Punischen Krieg ging es zuerst um Sizilien. Rom baute eine Flotte, um Karthago zur See zu schlagen, und machte Sizilien zur ersten Provinz — der Start als Seemacht.',
    },
    {
      q: 'Warum waren die Punischen Kriege für Rom wichtig?',
      correct: 'Rom wurde Großmacht und Vormacht im Mittelmeerraum',
      wrong: [
        'Rom verlor alle Kriege',
        'Rom blieb kleiner Stadtstaat',
        'Karthago eroberte Italien dauerhaft',
      ],
      wissen:
        'Durch den Sieg in allen drei Punischen Kriegen wurde Rom Großmacht und Vormacht im Mittelmeerraum. Karthago fiel aus; Rom war nicht länger nur Stadtstaat in Italien.',
    },
    {
      q: 'Richtig oder falsch? „Rom verlor alle drei Punischen Kriege.“',
      correct: 'falsch — Rom gewann alle drei Kriege',
      wrong: ['richtig — Rom verlor alle drei'],
      wissen:
        'Rom gewann alle drei Punischen Kriege gegen Karthago. Am Ende stand die Zerstörung Karthagos (146 v. Chr.) und Roms Aufstieg zur Mittelmeer-Vormacht.',
    },
  ] as const
  const c = pick(rng, cases)
  return choicePickTask({
    question: c.q,
    choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
    correct: c.correct,
    solution: c.correct,
    explanation: 'Drei Kriege gegen Karthago: Sizilien → Hannibal/Zama → Zerstörung.',
    instruction: 'Tippe die passende Antwort:',
    fachwissen: fw(c.wissen),
  })
}

// ─── Weltreich: Mare Nostrum / Expansion (kein Kriegsdetail) ─────────────────

export const romWeltreich: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.4) {
    return matchTermsTask(rng, {
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
      fachwissen: fw(
        'Wachstum Roms: Stadtstaat (Stadt + Umland) → Land-/Seemacht (Italien und Seewege) → Weltmacht um das Mittelmeer. Mare Nostrum („unser Meer“) nennt das beherrschte Mittelmeer. Romulus und Remus als Konsuln sind eine Vermischung von Sage und Republik.',
      ),
    })
  }
  const cases = [
    {
      q: 'Wie nannten die Römer das beherrschte Mittelmeer?',
      correct: 'Mare Nostrum („unser Meer“)',
      wrong: ['Mare Germanicum', 'Ozeanus Atlanticus', 'Pontus Euxinus'],
      wissen:
        'Mare Nostrum bedeutet „unser Meer“. So nannten die Römer das Mittelmeer, als sie es weitgehend beherrschten — Ausdruck der römischen Vormacht rund um das Mittelmeerbecken.',
    },
    {
      q: '„Vom Stadtstaat zum Weltreich“ bedeutet …',
      correct: 'Rom wächst von einer Stadt zur Macht um das Mittelmeer',
      wrong: [
        'Rom schrumpft auf sieben Hügel',
        'Karthago erobert Rom dauerhaft',
        'Rom bleibt ohne Heer',
      ],
      wissen:
        '„Vom Stadtstaat zum Weltreich“ beschreibt Roms Wachstum: von einer Stadt am Tiber zur Macht, die das Mittelmeer und weite Gebiete beherrscht — nicht Schrumpfung oder dauerhafte Eroberung durch Karthago.',
    },
    {
      q: 'Nach den großen Kriegen im Westen wird Rom vor allem …',
      correct: 'Vormacht / Weltmacht im Mittelmeerraum',
      wrong: [
        'abhängige Provinz Karthagos',
        'nur ein Dorf',
        'germanisches Königreich',
      ],
      wissen:
        'Nach den Siegen im Westen (bes. gegen Karthago) wird Rom Vormacht im Mittelmeerraum. Karthago ist besiegt; Rom ist weder Provinz noch Dorf oder germanisches Königreich.',
    },
  ] as const
  if (roll < 0.7) {
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Stadtstaat → Land-/Seemacht → Weltmacht; Mare Nostrum.',
      instruction: 'Tippe die passende Aussage:',
      fachwissen: fw(c.wissen),
    })
  }
  return textTask({
    question: 'Lateinisch: Wie nannten die Römer das Mittelmeer? (zwei Wörter)',
    accepted: ['mare nostrum', 'Mare Nostrum'],
    solution: 'Mare Nostrum',
    explanation: 'Mare Nostrum = „unser Meer“.',
    fachwissen: fw(
      'Mare Nostrum („unser Meer“) ist der lateinische Name der Römer für das beherrschte Mittelmeer. Zwei Wörter: Mare + Nostrum — Symbol der römischen Mittelmeer-Vormacht.',
    ),
  })
}

// ─── Bürgerrecht: nur Rechte / Schutz ────────────────────────────────────────

export const romBuergerrecht: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.4) {
    return multiSelectTask({
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
        'Zum römischen Bürgerrecht gehörten u. a.: Schutz vor Willkür (z. B. Folter), Testamente, Geschäftsverträge und Wahlrecht in der Volksversammlung. Es macht niemanden zum König mit unbeschränkter Macht.',
      ),
    })
  }
  if (roll < 0.7) {
    return matchTermsTask(rng, {
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
        'Bürgerrecht bündelt Schutz und Teilhabe: Schutz vor Willkür, Recht auf Verträge und Testament sowie Wahlrecht in der Volksversammlung. Automatische Königsmacht für jeden Bürger gehört nicht dazu.',
      ),
    })
  }
  const cases = [
    {
      q: 'Das Bürgerrecht schützte vor …',
      correct: 'Willkür (z. B. Folter / Todesurteil)',
      wrong: [
        'jeder Steuer überhaupt weltweit',
        'Handelsverboten in Karthago allein',
        'der Pflicht, Konsul zu werden',
      ],
      wissen:
        'Das Bürgerrecht schützte vor Willkür — etwa Folter oder willkürlichem Todesurteil. Es befreite nicht von allen Steuern weltweit und machte niemanden automatisch zum Konsul.',
    },
    {
      q: 'Dürften Bürger Geschäftsverträge schließen?',
      correct: 'ja',
      wrong: ['nein', 'nur Patrizierinnen', 'nur in Karthago'],
      wissen:
        'Römische Bürger durften Geschäftsverträge abschließen. Das Vertragsrecht war ein Kernbestandteil des Bürgerstatus — nicht auf Patrizierinnen oder Karthago beschränkt.',
    },
    {
      q: 'Hatten Bürger Wahlrecht in der Volksversammlung?',
      correct: 'ja',
      wrong: ['nein, nie', 'nur Sklaven', 'nur Hannibal'],
      wissen:
        'Bürger hatten Wahlrecht in der Volksversammlung (mit Abstufungen je nach Zeit und Stand). Sklaven und fremde Feldherren wie Hannibal hatten dieses Recht nicht.',
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
}

// ─── Prägende Wirkung für Europa (Legacy — kein Kriegs-/Ämter-Drill) ─────────

export const romUeberblick: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.45) {
    return matchTermsTask(rng, {
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
        'Prägende Nachwirkungen Roms in Europa: Latein (Sprachen und Fachwörter), Recht (Gesetz, Vertrag, Bürgerstatus), Straßen/Infrastruktur und städtisches Leben (Forum, öffentliche Bauten). Kriege allein erklären diese Langzeitwirkung nicht.',
      ),
    })
  }
  const cases = [
    {
      q: 'Warum gilt die römische Zivilisation als prägend für Europa?',
      correct: 'u. a. Sprache, Recht, Städtebau und Infrastruktur wirkten lange nach',
      wrong: [
        'weil Rom nie Krieg führte',
        'weil nur Karthago Europa prägte',
        'weil es keine Straßen gab',
      ],
      wissen:
        'Rom gilt als prägend für Europa, weil Sprache (Latein), Recht, Städtebau und Infrastruktur lange nachwirkten — nicht weil Rom nie Krieg führte oder Karthago Europa formte.',
    },
    {
      q: 'Welche Idee verbindet man oft mit römischem Recht?',
      correct: 'klare Regeln, Verträge und Rechte von Bürgern',
      wrong: [
        'nur Willkür eines Königs ohne Gesetz',
        'nur Regeln für Elefanten',
        'kein Eigentum und keine Verträge',
      ],
      wissen:
        'Römisches Recht steht für klare Regeln, Verträge und Rechte von Bürgern. Willkür ohne Gesetz oder „keine Verträge“ widersprechen diesem Bild.',
    },
    {
      q: 'Latein ist für Europa wichtig, weil …',
      correct: 'viele Wörter und Fachbegriffe darauf zurückgehen',
      wrong: [
        'es nur in Karthago gesprochen wurde',
        'es keine Schrift hatte',
        'es erst 2024 erfunden wurde',
      ],
      wissen:
        'Latein ist die Wurzel vieler europäischer Sprachen und Fachbegriffe (Recht, Medizin, Wissenschaft). Es wurde in Rom und dem Reich gesprochen — nicht erst 2024 erfunden und nicht nur in Karthago.',
    },
  ] as const
  const c = pick(rng, cases)
  return choicePickTask({
    question: c.q,
    choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
    correct: c.correct,
    solution: c.correct,
    explanation: 'Nachwirkung: Latein, Recht, Städte, Straßen — Lehrplan-Leitidee „prägend für Europa“.',
    instruction: 'Tippe die passende Aussage:',
    fachwissen: fw(c.wissen),
  })
}

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
