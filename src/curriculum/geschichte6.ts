/**
 * Geschichte Klasse 6 — LB1 Römische Zivilisation.
 * Themen scharf getrennt (wenig Überschneidung). Jahreszahlen nur im eigenen Thema.
 * Spoiler: Merkhilfen/Jahreszahlen stehen erst in der Erklärung nach dem Prüfen.
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
import type { Topic } from './types'

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

/** Kern-Jahreszahlen LB1 (v. Chr.). */
const YEAR_FACTS = [
  {
    year: 753,
    event: 'Gründung Roms (Sage: Romulus und Remus)',
    hint: 'Merkhilfe: „Rom schlüpft aus dem Ei“ (7-5-3)',
  },
  {
    year: 1000,
    event: 'Frühe Siedlung von Sabinern und Latinern am Tiber (ca.)',
    hint: 'Lange vor der Sage — Hirten und Bauern, Handelsplatz',
  },
  {
    year: 700,
    event: 'Etrusker prägen Rom (Steinbau, Wassertechnik, Metall) (ca.)',
    hint: 'Etruskerkönigtum vor der Republik',
  },
  {
    year: 500,
    event: 'Beginn der römischen Republik (ca., Könige vertrieben)',
    hint: 'Patrizier stürzen den König — res publica',
  },
  {
    year: 264,
    event: 'Beginn des Ersten Punischen Krieges (Kampf um Sizilien)',
    hint: 'Rom gegen Karthago — Rom baut eine Flotte',
  },
  {
    year: 241,
    event: 'Ende des Ersten Punischen Krieges; Sizilien wird römische Provinz',
    hint: 'Rom siegt zur See / um Sizilien',
  },
  {
    year: 218,
    event: 'Beginn des Zweiten Punischen Krieges; Hannibal überquert die Alpen',
    hint: 'Hannibal mit Heer und Elefanten über die Alpen',
  },
  {
    year: 202,
    event: 'Schlacht bei Zama: Scipio besiegt Hannibal',
    hint: 'Entscheidung in Afrika zugunsten Roms',
  },
  {
    year: 201,
    event: 'Ende des Zweiten Punischen Krieges',
    hint: 'Nach Zama — Karthago stark geschwächt',
  },
  {
    year: 149,
    event: 'Beginn des Dritten Punischen Krieges',
    hint: 'Cato: „Carthago delenda est!“',
  },
  {
    year: 146,
    event: 'Zerstörung Karthagos (Ende des Dritten Punischen Krieges)',
    hint: 'Rom alleinige Vormacht im Mittelmeer',
  },
] as const

type YearFact = (typeof YEAR_FACTS)[number]

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
    })
  }
  const cases = [
    {
      q: 'Wer gründete Rom der Sage nach?',
      correct: 'Romulus und Remus',
      wrong: ['Hannibal und Scipio', 'Caesar und Augustus', 'Cato und Scipio'],
      explanation: 'Zwillinge Romulus und Remus — Sage zur Stadtgründung.',
    },
    {
      q: 'Auf wie vielen Hügeln lag Rom der Sage nach?',
      correct: 'sieben',
      wrong: ['drei', 'zehn', 'zwei'],
      explanation: '„Stadt auf sieben Hügeln“.',
    },
    {
      q: 'Was brachten die Etrusker nach Rom?',
      correct: 'Stein-/Ziegelbau, Wassertechnik, Metallverarbeitung',
      wrong: ['Buchdruck', 'das Bürgerrecht Karthagos', 'die Zerstörung Karthagos'],
      explanation: 'Etrusker: neue Lebensweise, Steinbau, Wasser, Metall.',
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
    },
    {
      q: 'Was war der Senat in der frühen Republik?',
      correct: 'Rat der Ältesten; politische Versammlung zunächst adliger Männer',
      wrong: [
        'nur die Plebejerversammlung',
        'das Heer Hannibals',
        'ein einzelner König',
      ],
    },
    {
      q: 'Wer waren die Patrizier?',
      correct: 'Adlige und wohlhabende Römer (lat. „Väter“)',
      wrong: [
        'das einfache Volk ohne Adel',
        'Feldherren Karthagos',
        'nur Sklaven',
      ],
    },
    {
      q: 'Wer waren die Plebejer?',
      correct: 'Angehörige des Volkes, die nicht zum Adel gehörten',
      wrong: [
        'nur die Konsuln',
        'etruskische Könige',
        'Mitglieder des Senats von Anfang an',
      ],
    },
    {
      q: 'In der frühen Republik hatten zunächst vor allem … die Macht.',
      correct: 'die Patrizier; Plebejer blieben lange machtlos',
      wrong: [
        'alle Bürger gleichermaßen',
        'nur die Plebejer',
        'nur Sklaven',
      ],
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
    })
  }
  const cases = [
    {
      q: 'Welche Aufgabe hatten die beiden Konsuln?',
      correct: 'die obersten Beamten Roms',
      wrong: ['nur für Finanzen zuständig', 'nur Volkstribune', 'Könige auf Lebenszeit'],
    },
    {
      q: 'Wofür waren die Prätoren zuständig?',
      correct: 'das Gerichtswesen',
      wrong: ['nur Sittenkontrolle', 'nur die Flotte Karthagos', 'Getreide aus Germanien'],
    },
    {
      q: 'Was konnten Volkstribune?',
      correct: 'Veto einlegen (Schutz der Plebejer)',
      wrong: ['den Senat abschaffen', 'Könige ernennen', 'nur Steuern in Karthago erheben'],
    },
    {
      q: 'Ein Diktator in der Republik …',
      correct: 'wurde auf Zeit in Notzeiten mit großer Macht eingesetzt',
      wrong: ['war dauerhafter König', 'gab es nur in Karthago', 'wurde nie gewählt'],
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
    })
  }
  const cases = [
    {
      q: 'Wo lag die Stadt Karthago?',
      correct: 'in Nordafrika',
      wrong: ['in Britannien', 'am Rhein', 'nur in Gallien'],
    },
    {
      q: 'Wer war Hannibal in den Punischen Kriegen?',
      correct: 'Feldherr Karthagos; überquerte die Alpen mit seinem Heer',
      wrong: ['römischer Konsul', 'etruskischer König', 'germanischer Häuptling'],
    },
    {
      q: 'Was leistete der Römer Scipio im Zweiten Punischen Krieg?',
      correct: 'besiegte Hannibal in Afrika (Zama)',
      wrong: ['gründete Rom', 'war König der Etrusker', 'zerstörte Rom'],
    },
    {
      q: 'Was forderte Cato immer wieder im Senat?',
      correct: '„Carthago delenda est!“ — Karthago muss zerstört werden',
      wrong: [
        'Rom soll die Flotte abschaffen',
        'Hannibal soll Konsul werden',
        'nur Frieden ohne Sieg',
      ],
    },
    {
      q: 'Worum ging es im Ersten Punischen Krieg zuerst?',
      correct: 'um Sizilien; Rom baut eine Flotte und siegt',
      wrong: ['um Britannien', 'um die Gründung Roms', 'um den Senat in Karthago'],
    },
    {
      q: 'Warum waren die Punischen Kriege für Rom wichtig?',
      correct: 'Rom wurde Großmacht und Vormacht im Mittelmeerraum',
      wrong: [
        'Rom verlor alle Kriege',
        'Rom blieb kleiner Stadtstaat',
        'Karthago eroberte Italien dauerhaft',
      ],
    },
    {
      q: 'Richtig oder falsch? „Rom verlor alle drei Punischen Kriege.“',
      correct: 'falsch — Rom gewann alle drei Kriege',
      wrong: ['richtig — Rom verlor alle drei'],
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
    })
  }
  const cases = [
    {
      q: 'Wie nannten die Römer das beherrschte Mittelmeer?',
      correct: 'Mare Nostrum („unser Meer“)',
      wrong: ['Mare Germanicum', 'Ozeanus Atlanticus', 'Pontus Euxinus'],
    },
    {
      q: '„Vom Stadtstaat zum Weltreich“ bedeutet …',
      correct: 'Rom wächst von einer Stadt zur Macht um das Mittelmeer',
      wrong: [
        'Rom schrumpft auf sieben Hügel',
        'Karthago erobert Rom dauerhaft',
        'Rom bleibt ohne Heer',
      ],
    },
    {
      q: 'Nach den großen Kriegen im Westen wird Rom vor allem …',
      correct: 'Vormacht / Weltmacht im Mittelmeerraum',
      wrong: [
        'abhängige Provinz Karthagos',
        'nur ein Dorf',
        'germanisches Königreich',
      ],
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
    })
  }
  return textTask({
    question: 'Lateinisch: Wie nannten die Römer das Mittelmeer? (zwei Wörter)',
    accepted: ['mare nostrum', 'Mare Nostrum'],
    solution: 'Mare Nostrum',
    explanation: 'Mare Nostrum = „unser Meer“.',
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
    },
    {
      q: 'Dürften Bürger Geschäftsverträge schließen?',
      correct: 'ja',
      wrong: ['nein', 'nur Patrizierinnen', 'nur in Karthago'],
    },
    {
      q: 'Hatten Bürger Wahlrecht in der Volksversammlung?',
      correct: 'ja',
      wrong: ['nein, nie', 'nur Sklaven', 'nur Hannibal'],
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
    },
    {
      q: 'Welche Idee verbindet man oft mit römischem Recht?',
      correct: 'klare Regeln, Verträge und Rechte von Bürgern',
      wrong: [
        'nur Willkür eines Königs ohne Gesetz',
        'nur Regeln für Elefanten',
        'kein Eigentum und keine Verträge',
      ],
    },
    {
      q: 'Latein ist für Europa wichtig, weil …',
      correct: 'viele Wörter und Fachbegriffe darauf zurückgehen',
      wrong: [
        'es nur in Karthago gesprochen wurde',
        'es keine Schrift hatte',
        'es erst 2024 erfunden wurde',
      ],
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
