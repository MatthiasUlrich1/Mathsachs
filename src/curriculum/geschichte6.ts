/**
 * Geschichte Klasse 6 — LB1 Römische Zivilisation.
 * Schwerpunkt Leistungskontrolle: Jahreszahlen einprägen + Kernwissen aus dem Heft.
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

/** Kern-Jahreszahlen für die LK (v. Chr., nur die Zahl eingeben). */
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

/** Jahreszahl tippen (viele Wiederholungen). */
function yearValueTask(rng: Rng, pool: readonly YearFact[] = YEAR_FACTS) {
  const fact = pick(rng, pool)
  const forms = [
    `In welchem Jahr v. Chr. geschah Folgendes?\n\n${fact.event}\n\n(Nur die Jahreszahl tippen, z. B. 753)`,
    `Jahreszahl lernen: ${fact.event}\n\nWelches Jahr v. Chr.? ${fact.hint}\n\n(Nur die Zahl)`,
    `LK-Drill: Wann? „${fact.event}“\n\nJahr v. Chr. (nur Zahl):`,
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
function yearEventChoice(rng: Rng, pool: readonly YearFact[] = YEAR_FACTS) {
  const fact = pick(rng, pool)
  const distractors = shuffleChoices(
    rng,
    YEAR_FACTS.filter((f) => f.year !== fact.year).map((f) => f.event),
    fact.event,
  ).filter((e) => e !== fact.event)
  const wrong = distractors.slice(0, 3)
  return choicePickTask({
    question: `Was geschah ${fact.year} v. Chr.?`,
    choices: shuffleChoices(rng, [fact.event, ...wrong], fact.event),
    correct: fact.event,
    solution: fact.event,
    explanation: `${fact.year} v. Chr.: ${fact.event}. ${fact.hint}`,
    instruction: 'Tippe das passende Ereignis:',
  })
}

/** Welche Jahreszahl passt zum Ereignis? (MC) */
function yearMcTask(rng: Rng, pool: readonly YearFact[] = YEAR_FACTS) {
  const fact = pick(rng, pool)
  const wrongYears = shuffleChoices(
    rng,
    otherYears(fact).map(String),
    String(fact.year),
  )
    .filter((y) => y !== String(fact.year))
    .slice(0, 3)
  const correct = `${fact.year} v. Chr.`
  const choices = shuffleChoices(
    rng,
    [correct, ...wrongYears.map((y) => `${y} v. Chr.`)],
    correct,
  )
  return choicePickTask({
    question: `${fact.event}\n\nWelches Jahr? ${fact.hint}`,
    choices,
    correct,
    solution: correct,
    explanation: `${fact.year} v. Chr. — ${fact.hint}`,
    instruction: 'Tippe die Jahreszahl:',
  })
}

/** ~70 % Jahreszahlen, Rest Inhalt — für LK-Drill. */
function withYearWeight(
  rng: Rng,
  content: () => ReturnType<Topic['generate']>,
  yearPool?: readonly YearFact[],
): ReturnType<Topic['generate']> {
  const roll = rng()
  if (roll < 0.45) return yearValueTask(rng, yearPool)
  if (roll < 0.65) return yearMcTask(rng, yearPool)
  if (roll < 0.78) return yearEventChoice(rng, yearPool)
  return content()
}

const ANFANGE_YEARS = YEAR_FACTS.filter((f) => [753, 1000, 700, 500].includes(f.year))
const PUNISCH_YEARS = YEAR_FACTS.filter((f) =>
  [264, 241, 218, 202, 201, 149, 146].includes(f.year),
)

/** Reine Jahreszahl-Wiederholung (LK). */
export const romJahreszahlen: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.55) return yearValueTask(rng)
  if (roll < 0.78) return yearMcTask(rng)
  return yearEventChoice(rng)
}

export const romAnfaenge: Topic['generate'] = (rng) =>
  withYearWeight(
    rng,
    () => {
      const cases = [
        {
          q: 'Wer gründete Rom der Sage nach?',
          correct: 'Romulus und Remus',
          wrong: ['Hannibal und Scipio', 'Caesar und Augustus', 'Cato und Scipio'],
          explanation: 'Zwillinge Romulus und Remus — Sage zur Stadtgründung.',
        },
        {
          q: 'Rom lag der Sage nach auf …',
          correct: 'sieben Hügeln',
          wrong: ['drei Inseln', 'einem Berg', 'zehn Hügeln'],
          explanation: '„Stadt auf sieben Hügeln“.',
        },
        {
          q: 'Merkhilfe für 753 v. Chr.?',
          correct: '„Rom schlüpft aus dem Ei“ (7-5-3)',
          wrong: [
            '„Rom baut eine Flotte“',
            '„Carthago delenda est“',
            '„Mare Nostrum“',
          ],
          explanation: '7-5-3 = 753 — „Rom schlüpft aus dem Ei“.',
        },
        {
          q: 'Sabiner und Latiner (Hirten/Bauern) …',
          correct: 'siedeln früh am Tiber und entwickeln einen Handelsplatz',
          wrong: [
            'zerstören Karthago 146',
            'überqueren die Alpen mit Elefanten',
            'sind nur Feldherren Karthagos',
          ],
          explanation: 'Frühe Siedlung → Handelsplatz (ca. 1000 v. Chr.).',
        },
        {
          q: 'Was brachten die Etrusker nach Rom?',
          correct: 'Stein-/Ziegelbau, Wassertechnik, Metallverarbeitung',
          wrong: [
            'Buchdruck',
            'nur das Bürgerrecht',
            'die Zerstörung Karthagos',
          ],
          explanation: 'Etrusker: neue Lebensweise, Steinbau, Wasser, Metall.',
        },
        {
          q: 'Um 500 v. Chr. entsteht die Republik, weil …',
          correct: 'Patrizier den König stürzen und die Etrusker vertreiben',
          wrong: [
            'Hannibal Rom erobert',
            'Karthago den Senat gründet',
            'Romulus Konsul wird',
          ],
          explanation: 'Königszeit endet → Republik (res publica).',
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
    },
    ANFANGE_YEARS,
  )

export const romBegriffe: Topic['generate'] = (rng) =>
  withYearWeight(rng, () => {
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
        q: 'Rom wird Republik — aber zunächst …',
        correct: 'haben nur die Patrizier die Macht; Plebejer bleiben machtlos',
        wrong: [
          'sind alle sofort gleichberechtigt',
          'herrschen nur die Plebejer',
          'gibt es keinen Senat',
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
  }, ANFANGE_YEARS)

export const romAemter: Topic['generate'] = (rng) =>
  withYearWeight(rng, () => {
    const cases = [
      {
        q: 'Welche Aufgabe hatten die beiden Konsuln?',
        correct: 'die obersten Beamten Roms',
        wrong: ['nur für Finanzen zuständig', 'nur Volkstribune', 'Könige auf Lebenszeit'],
      },
      {
        q: 'Prätoren waren zuständig für …',
        correct: 'das Gerichtswesen',
        wrong: ['nur Sittenkontrolle', 'nur die Flotte Karthagos', 'Getreide aus Germanien'],
      },
      {
        q: 'Ädile waren zuständig für …',
        correct: 'die Verwaltung (Stadt/Markt u. a.)',
        wrong: ['unbeschränkte Diktatur', 'nur Alpenübergänge', 'nur Krieg und Frieden allein'],
      },
      {
        q: 'Quästoren waren zuständig für …',
        correct: 'die Finanzen',
        wrong: ['nur das Veto', 'nur Heiraten', 'nur die Zerstörung Karthagos'],
      },
      {
        q: 'Zensoren waren zuständig für …',
        correct: 'Sittenkontrolle (und Bürgerlisten)',
        wrong: ['nur Gladiatoren', 'nur Straßen in Britannien', 'die Flotte Karthagos'],
      },
      {
        q: 'Volkstribune konnten …',
        correct: 'Veto einlegen (Schutz der Plebejer)',
        wrong: [
          'den Senat abschaffen',
          'Könige ernennen',
          'nur Steuern in Karthago erheben',
        ],
      },
      {
        q: 'Ein Diktator in der Republik …',
        correct: 'wurde auf Zeit in Notzeiten mit großer Macht eingesetzt',
        wrong: [
          'war dauerhafter König',
          'gab es nur in Karthago',
          'wurde nie gewählt',
        ],
      },
      {
        q: 'Welche Rolle hatte der Senat in der Republik?',
        correct: 'beriet die Magistrate und entschied u. a. über Krieg und Frieden',
        wrong: [
          'war nur die Plebejerversammlung',
          'baute die Alpenstraße',
          'war ein einzelner Kaiser von Anfang an',
        ],
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Republik: Magistrate, Senat, Volksversammlung, Volkstribune, Diktator auf Zeit.',
      instruction: 'Tippe die passende Zuordnung:',
    })
  })

export const romPunisch: Topic['generate'] = (rng) =>
  withYearWeight(
    rng,
    () => {
      const cases = [
        {
          q: 'Wo lag die Stadt Karthago?',
          correct: 'in Nordafrika',
          wrong: ['in Britannien', 'am Rhein', 'nur in Gallien'],
        },
        {
          q: 'Wer war Hannibal in den Punischen Kriegen?',
          correct: 'Feldherr Karthagos; überquerte die Alpen mit seinem Heer',
          wrong: [
            'römischer Konsul',
            'etruskischer König',
            'germanischer Häuptling',
          ],
        },
        {
          q: 'Was leistete der Römer Scipio im Zweiten Punischen Krieg?',
          correct: 'besiegte Hannibal in Afrika (Zama)',
          wrong: [
            'gründete Rom 753',
            'war König der Etrusker',
            'zerstörte Rom',
          ],
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
          q: 'Erster Punischer Krieg: Worum ging es zuerst?',
          correct: 'um Sizilien; Rom baut eine Flotte und siegt',
          wrong: [
            'um Britannien',
            'um die Gründung Roms',
            'um den Senat in Karthago',
          ],
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
        {
          q: 'Richtig oder falsch? „Karthago lag in Nordafrika.“',
          correct: 'richtig — Karthago lag in Nordafrika',
          wrong: ['falsch — Karthago lag in Britannien'],
        },
      ] as const
      const c = pick(rng, cases)
      return choicePickTask({
        question: c.q,
        choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
        correct: c.correct,
        solution: c.correct,
        explanation:
          'Drei Punische Kriege (264–146): Sizilien → Hannibal/Alpen → Zerstörung 146.',
        instruction: 'Tippe die passende Antwort:',
      })
    },
    PUNISCH_YEARS,
  )

export const romWeltreich: Topic['generate'] = (rng) =>
  withYearWeight(rng, () => {
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
        q: 'Frühe Phase nur mit der Stadt Rom = …',
        correct: 'Stadtstaat',
        wrong: ['Weltmacht', 'Seemacht Karthagos', 'Kaiserreich von Beginn an'],
      },
      {
        q: 'Nach den Punischen Kriegen wird Rom vor allem …',
        correct: 'Vormacht / Weltmacht im Mittelmeerraum',
        wrong: [
          'abhängige Provinz Karthagos',
          'nur ein Dorf',
          'germanisches Königreich',
        ],
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Karten: Stadtstaat → Land-/Seemacht → Weltmacht; Mare Nostrum.',
      instruction: 'Tippe die passende Aussage:',
    })
  }, PUNISCH_YEARS)

export const romBuergerrecht: Topic['generate'] = (rng) =>
  withYearWeight(rng, () => {
    const roll = rng()
    if (roll < 0.45) {
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
      explanation: 'Bürgerrecht: Schutz, Verträge, Testament, Heirat, Wahlrecht, Steuerprivilegien.',
      instruction: 'Tippe die passende Antwort:',
    })
  })

/** Überblick = stark jahreszahl-lastig (LK). */
export const romUeberblick: Topic['generate'] = (rng) => {
  const roll = rng()
  if (roll < 0.5) return romJahreszahlen(rng)
  if (roll < 0.65) return romAnfaenge(rng)
  if (roll < 0.8) return romPunisch(rng)
  if (roll < 0.9) return romBegriffe(rng)
  return romWeltreich(rng)
}

/** Chronologie Punische Kriege einprägen. */
export const romChronologie: Topic['generate'] = mixedVariants(
  (rng) => yearValueTask(rng, PUNISCH_YEARS),
  (rng) => yearMcTask(rng, PUNISCH_YEARS),
  (_rng) =>
    dragDropSortTask({
      question: 'Ordne chronologisch (früh → spät) — Punische Kriege:',
      items: [
        { label: '1. Punischer Krieg beginnt (264)', value: 0 },
        { label: 'Rom siegt / Sizilien (bis 241)', value: 1 },
        { label: 'Hannibal über die Alpen (218)', value: 2 },
        { label: 'Scipio siegt bei Zama (202)', value: 3 },
        { label: 'Karthago zerstört (146)', value: 4 },
      ],
      correctOrder: [0, 1, 2, 3, 4],
      solution: '264 → 241 → 218 → 202 → 146',
      explanation: 'Merke die Reihenfolge für die Leistungskontrolle.',
      rng: _rng,
    }),
  (_rng) =>
    dragDropSlotsTask({
      question:
        'Jahreszahlen zuordnen. Platz 1 = Gründungssage, 2 = Republikbeginn, 3 = 1. Punischer Krieg beginnt, 4 = Karthago zerstört. Einen Block brauchst du nicht.',
      items: [
        { label: '753', value: 0 },
        { label: '500', value: 1 },
        { label: '264', value: 2 },
        { label: '146', value: 3 },
        { label: '2024', value: 4 },
      ],
      correctSlots: [0, 1, 2, 3],
      solution: '753 · 500 · 264 · 146',
      explanation: 'Die wichtigsten LK-Jahreszahlen in der Reihenfolge der Frage.',
      instruction: 'Platz 1–4 = Jahreszahlen v. Chr.',
    }),
() =>
    textTask({
      question:
        'Lateinisch: Wie nannten die Römer das Mittelmeer? (zwei Wörter, z. B. Mare Nostrum)',
      accepted: ['mare nostrum', 'Mare Nostrum'],
      solution: 'Mare Nostrum',
      explanation: 'Mare Nostrum = „unser Meer“.',
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
