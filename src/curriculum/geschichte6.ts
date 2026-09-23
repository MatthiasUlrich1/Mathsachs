/**
 * Geschichte Klasse 6 — Römische Zivilisation (LB1).
 * Quellen: Heftnotizen (Anfänge, Republik, Punische Kriege, Mare Nostrum, Bürgerrecht, Ämter)
 * + gängige Schulgeschichte (Wikipedia/Lehrplan Sachsen).
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

/** Anfänge Roms: Sage, Siedlung, Etrusker, Republik */
export const romAnfaenge: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wann wurde Rom der Sage nach gegründet? (Merkhilfe: „Rom schlüpft aus dem Ei“)',
        correct: '753 v. Chr.',
        wrong: ['1000 v. Chr.', '500 v. Chr.', '146 v. Chr.'],
        explanation:
          'Die Gründungssage nennt 753 v. Chr. — Merkhilfe „Rom schlüpft aus dem Ei“ (7-5-3).',
      },
      {
        q: 'Wer gründete Rom der Sage nach?',
        correct: 'Romulus und Remus',
        wrong: ['Hannibal und Scipio', 'Caesar und Augustus', 'Sabiner und nur Remus'],
        explanation: 'Die Zwillinge Romulus und Remus stehen in der Gründungssage.',
      },
      {
        q: 'Rom lag der Sage nach auf …',
        correct: 'sieben Hügeln',
        wrong: ['drei Inseln', 'einem einzelnen Berg', 'zehn Hügeln'],
        explanation: 'Rom gilt als „Stadt auf sieben Hügeln“.',
      },
      {
        q: 'Welche Völkergruppen siedelten früh am Tiber und entwickelten einen Handelsplatz (um 1000 v. Chr.)?',
        correct: 'Sabiner und Latiner (Hirten und Bauern)',
        wrong: ['Punier und Phönizier', 'Germanen und Kelten', 'nur Etrusker als Händler'],
        explanation: 'Sabiner und Latiner siedelten als Hirten und Bauern und entwickelten Rom zum Handelsplatz.',
      },
      {
        q: 'Was brachten die Etrusker (um 700 v. Chr.) u. a. nach Rom?',
        correct: 'Stein- und Ziegelbau, Wassertechnik, Metallverarbeitung',
        wrong: ['Buchdruck und Dampfmaschine', 'nur das Bürgerrecht', 'die Punischen Kriege'],
        explanation:
          'Die Etrusker brachten u. a. Stein-/Ziegelbau, Wassertechnik und Metallverarbeitung.',
      },
      {
        q: 'Um 500 v. Chr. stürzten Patrizier den König. Was entstand?',
        correct: 'die römische Republik',
        wrong: ['das Kaiserreich', 'das Frankenreich', 'Karthago'],
        explanation: 'Nach Vertreibung der etruskischen Könige entstand die Republik (res publica).',
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
  (_rng) =>
    dragDropSortTask({
      question:
        'Ordne die Phasen chronologisch (älteste zuerst): Siedlung → Etruskerkönigtum → Republik → Gründungssage 753.',
      items: [
        { label: 'Sabiner/Latiner siedeln (~1000 v. Chr.)', value: 0 },
        { label: 'Etruskerkönigtum (~700 v. Chr.)', value: 1 },
        { label: 'Gründungssage Romulus/Remus (753 v. Chr.)', value: 2 },
        { label: 'Beginn der Republik (~500 v. Chr.)', value: 3 },
      ],
      correctOrder: [0, 1, 2, 3],
      solution: 'Siedlung → Etrusker → Sage 753 → Republik ~500',
      explanation:
        'Historisch: Siedlung und Etrusker früher; die Sage datiert 753; Republik um 500 v. Chr.',
      rng: _rng,
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zu den Anfängen Roms? (mehrere möglich)',
      choices: [
        'Lage auf sieben Hügeln',
        'Sage von Romulus und Remus',
        'Einfluss der Etrusker',
        'Beginn der Republik um 500 v. Chr.',
        'Hannibal überquert die Alpen als Gründungsmythos',
      ],
      correct: [
        'Lage auf sieben Hügeln',
        'Sage von Romulus und Remus',
        'Einfluss der Etrusker',
        'Beginn der Republik um 500 v. Chr.',
      ],
      solution: 'Hügel, Sage, Etrusker, Republik — nicht Hannibals Alpenzug.',
      explanation: 'Hannibal gehört zu den Punischen Kriegen, nicht zur Stadtgründung.',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
)

/** Wichtige Begriffe: Senat, Republik, Patrizier, Plebejer */
export const romBegriffe: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was bedeutet „Republik“ (lat. res publica)?',
        correct: 'öffentliche Sache — Regierung durch gewählte Vertreter',
        wrong: [
          'Alleinherrschaft eines Königs',
          'nur Militärdiktatur',
          'Herrschaft der Götter',
        ],
      },
      {
        q: 'Was war der Senat in der frühen Republik?',
        correct: 'Rat der Ältesten — politische Versammlung zunächst adliger Männer',
        wrong: [
          'Versammlung nur der Plebejer',
          'Heer der Gladiatoren',
          'Marktplatz für Getreide',
        ],
      },
      {
        q: 'Wer waren die Patrizier?',
        correct: 'Adlige und wohlhabende Römer (lat. „Väter“)',
        wrong: [
          'das einfache Volk ohne Adel',
          'nur Sklaven',
          'Feldherren Karthagos',
        ],
      },
      {
        q: 'Wer waren die Plebejer?',
        correct: 'Angehörige des römischen Volkes, die nicht zum Adel gehörten',
        wrong: [
          'nur die Konsuln',
          'etruskische Könige',
          'Mitglieder des Senats von Anfang an',
        ],
      },
      {
        q: 'Rom wird Republik — aber wer hat zunächst die Macht?',
        correct: 'nur die Patrizier; die Plebejer bleiben zunächst machtlos',
        wrong: [
          'alle Bürger gleichberechtigt',
          'nur die Plebejer',
          'Hannibal als Konsul',
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
  },
  (_rng) =>
    dragDropSlotsTask({
      question:
        'Ordne: Begriff → Bedeutung. Platz 1 = Republik, 2 = Senat, 3 = Patrizier, 4 = Plebejer. Einen Block brauchst du nicht.',
      items: [
        { label: 'öffentliche Sache / gewählte Vertreter', value: 0 },
        { label: 'Rat der Ältesten (zunächst Adlige)', value: 1 },
        { label: 'Adlige / wohlhabende „Väter“', value: 2 },
        { label: 'Volk ohne Adelszugehörigkeit', value: 3 },
        { label: 'König mit unbeschränkter Macht', value: 4 },
      ],
      correctSlots: [0, 1, 2, 3],
      solution: 'Republik · Senat · Patrizier · Plebejer',
      explanation: 'König gehört nicht zur republikanischen Begriffsreihe.',
      instruction: 'Platz 1–4 wie in der Frage',
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zur frühen Republik stimmen? (mehrere möglich)',
      choices: [
        'res publica = öffentliche Sache',
        'Senat berät die Politik',
        'Patrizier stellen zunächst die Machtelite',
        'Plebejer sind von Anfang an den Patriziern gleichgestellt',
        'Königsherrschaft wird abgelöst',
      ],
      correct: [
        'res publica = öffentliche Sache',
        'Senat berät die Politik',
        'Patrizier stellen zunächst die Machtelite',
        'Königsherrschaft wird abgelöst',
      ],
      solution: 'Gleichstellung der Plebejer kommt erst später (Ständekämpfe).',
      explanation: 'Die Plebejer erkämpfen Rechte schrittweise (z. B. Volkstribune).',
      instruction: 'Tippe alle zutreffenden Aussagen:',
    }),
)

/** Ämter der Republik */
export const romAemter: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welche Aufgabe hatten die Konsuln?',
        correct: 'oberste Beamte Roms (je zwei)',
        wrong: ['nur Finanzen', 'nur Sittenkontrolle', 'nur Veto der Plebejer'],
      },
      {
        q: 'Wofür waren die Prätoren zuständig?',
        correct: 'Gerichtswesen',
        wrong: ['Getreideimporte aus Ägypten', 'nur Krieg gegen Karthago', 'Sittenkontrolle'],
      },
      {
        q: 'Wofür waren die Ädile zuständig?',
        correct: 'Verwaltung (u. a. Stadt/Markt)',
        wrong: ['unbeschränkte Diktatur', 'nur Senatsberatung', 'Alpenübergang'],
      },
      {
        q: 'Wofür waren die Quästoren zuständig?',
        correct: 'Finanzen',
        wrong: ['Veto gegen Gesetze', 'nur Heiratserlaubnis', 'Zerstörung Karthagos'],
      },
      {
        q: 'Wofür waren die Zensoren zuständig?',
        correct: 'Sittenkontrolle (und Bürgerlisten)',
        wrong: ['nur Gladiatorenkämpfe', 'nur Straßenbau in Germanien', 'Flottenbau Karthagos'],
      },
      {
        q: 'Was konnten die Volkstribune?',
        correct: 'Veto einlegen (Schutz der Plebejer)',
        wrong: ['allein den Senat ersetzen', 'Könige ernennen', 'nur Steuern erheben'],
      },
      {
        q: 'Wann gab es einen Diktator in der Republik?',
        correct: 'auf Zeit in Notzeiten — mit großer Macht',
        wrong: ['dauerhaft als König', 'nur in Karthago', 'nie in Rom'],
      },
      {
        q: 'Der Senat …',
        correct: 'beriet die Magistrate und entschied u. a. über Krieg und Frieden',
        wrong: ['war nur die Plebejerversammlung', 'baute die Alpenstraße', 'war ein einzelner König'],
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
  },
  (_rng) =>
    dragDropSlotsTask({
      question:
        'Ämter → Aufgaben. Reihenfolge: 1 Konsuln, 2 Prätoren, 3 Ädile, 4 Quästoren, 5 Volkstribune. Einen Block brauchst du nicht.',
      items: [
        { label: 'oberste Beamte (2)', value: 0 },
        { label: 'Gerichtswesen', value: 1 },
        { label: 'Verwaltung', value: 2 },
        { label: 'Finanzen', value: 3 },
        { label: 'Veto möglich', value: 4 },
        { label: 'Seemacht Karthagos', value: 5 },
      ],
      correctSlots: [0, 1, 2, 3, 4],
      solution: 'Konsuln · Prätoren · Ädile · Quästoren · Volkstribune',
      explanation: 'Karthago gehört nicht zu den römischen Ämtern.',
      instruction: 'Platz 1–5 wie in der Frage',
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Welche Institutionen gehören zur römischen Republik? (mehrere möglich)',
      choices: [
        'Senat',
        'Konsuln',
        'Volkstribune',
        'Volksversammlung',
        'Pharao von Ägypten',
      ],
      correct: ['Senat', 'Konsuln', 'Volkstribune', 'Volksversammlung'],
      solution: 'Senat, Magistrate, Volksversammlung, Volkstribune — kein Pharao.',
      explanation: 'Der Pharao gehört zu Ägypten, nicht zur römischen Republik.',
      instruction: 'Tippe alle passenden Institutionen:',
    }),
)

/** Punische Kriege */
export const romPunisch: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wo lag Karthago?',
        correct: 'in Nordafrika',
        wrong: ['in Britannien', 'am Rhein', 'nur auf Sizilien'],
      },
      {
        q: 'Wer war Hannibal?',
        correct: 'Feldherr Karthagos; überquerte die Alpen mit seinem Heer',
        wrong: ['römischer Konsul', 'etruskischer König', 'germanischer Häuptling'],
      },
      {
        q: 'Wer besiegte Hannibal in Afrika (u. a. Zama)?',
        correct: 'Scipio (römischer Feldherr)',
        wrong: ['Cato allein mit Worten', 'Romulus', 'Augustus'],
      },
      {
        q: 'Was forderte Cato immer wieder?',
        correct: '„Carthago delenda est!“ — Karthago muss zerstört werden',
        wrong: [
          'Rom soll die Flotte abschaffen',
          'Hannibal soll Konsul werden',
          'nur Frieden ohne Bedingungen',
        ],
      },
      {
        q: 'Wann wurde Karthago zerstört?',
        correct: '146 v. Chr.',
        wrong: ['753 v. Chr.', '264 v. Chr.', '500 n. Chr.'],
      },
      {
        q: 'Erster Punischer Krieg (264–241): Worüber kämpften Rom und Karthago zuerst?',
        correct: 'um Sizilien; Rom baut eine Flotte und siegt',
        wrong: [
          'um Britannien',
          'um die Alpen alone',
          'um die Gründung Roms',
        ],
      },
      {
        q: 'Warum waren die Punischen Kriege für Rom wichtig?',
        correct: 'Rom wurde Großmacht und Vormacht im Mittelmeerraum',
        wrong: [
          'Rom verlor alle Kriege',
          'Rom blieb kleiner Stadtstaat',
          'Karthago eroberte Rom dauerhaft',
        ],
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Drei Punische Kriege (264–146): Sizilien → Hannibal/Alpen → Zerstörung Karthagos 146.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const trueFalse = [
      { statement: 'Karthago lag in Nordafrika.', truth: true },
      { statement: 'Hannibal war ein Feldherr Karthagos.', truth: true },
      { statement: 'Hannibal überquerte mit seinem Heer die Alpen.', truth: true },
      { statement: 'Rom verlor alle drei Punischen Kriege.', truth: false },
      { statement: 'Karthago wurde 146 v. Chr. zerstört.', truth: true },
    ] as const
    const item = pick(rng, trueFalse)
    const correct = item.truth ? 'richtig' : 'falsch'
    return choicePickTask({
      question: `Richtig oder falsch? „${item.statement}“`,
      choices: shuffleChoices(rng, ['richtig', 'falsch'], correct),
      correct,
      solution: correct,
      explanation: item.truth
        ? 'Die Aussage ist historisch zutreffend.'
        : 'Rom gewann die Punischen Kriege; Karthago unterlag.',
      instruction: 'Tippe „richtig“ oder „falsch“:',
    })
  },
  (_rng) =>
    dragDropSortTask({
      question: 'Ordne chronologisch (früh → spät):',
      items: [
        { label: 'Erster Punischer Krieg beginnt (264)', value: 0 },
        { label: 'Rom erobert Sizilien / siegt im 1. Krieg', value: 1 },
        { label: 'Hannibal zieht über die Alpen (2. Krieg)', value: 2 },
        { label: 'Scipio besiegt Hannibal in Afrika', value: 3 },
        { label: 'Karthago wird zerstört (146)', value: 4 },
      ],
      correctOrder: [0, 1, 2, 3, 4],
      solution: '1. Krieg → Sizilien → Alpen → Scipio → 146 Zerstörung',
      explanation: 'Klassische Reihenfolge der Punischen Kriege.',
      rng: _rng,
    }),
  (_rng) =>
    valueTask({
      question: 'In welchem Jahr v. Chr. wurde Karthago zerstört? (nur die Jahreszahl)',
      answerKind: 'integer',
      value: 146,
      solution: '146',
      explanation: 'Im Dritten Punischen Krieg wurde Karthago 146 v. Chr. zerstört.',
    }),
)

/** Vom Stadtstaat zum Weltreich / Mare Nostrum */
export const romWeltreich: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wie nannten die Römer das Mittelmeer, als sie es beherrschten?',
        correct: 'Mare Nostrum („unser Meer“)',
        wrong: ['Mare Germanicum', 'Ozeanus Atlanticus', 'Nilus'],
      },
      {
        q: 'Was bedeutet die Entwicklung „vom Stadtstaat zum Weltreich“?',
        correct: 'Rom wächst von einer Stadt zur Macht um das Mittelmeer',
        wrong: [
          'Rom schrumpft auf sieben Hügel zurück',
          'Rom wird von Karthago dauerhaft erobert',
          'Rom bleibt nur Handelsplatz ohne Heer',
        ],
      },
      {
        q: 'Um 270 v. Chr. war Rom vor allem …',
        correct: 'eine Landmacht in Italien',
        wrong: ['schon Weltmacht bis Britannien', 'nur ein Dorf ohne Senat', 'Hauptstadt Karthagos'],
      },
      {
        q: 'Nach den Punischen Kriegen und weiteren Eroberungen wird Rom …',
        correct: 'Vormacht / Weltmacht im Mittelmeerraum',
        wrong: ['abhängige Provinz Karthagos', 'nur Seemacht ohne Land', 'germanisches Königreich'],
      },
      {
        q: 'Welche Bezeichnung passt zur frühen Phase mit nur der Stadt Rom?',
        correct: 'Stadtstaat',
        wrong: ['Weltmacht', 'Seemacht Karthagos', 'Kaiserreich von Anfang an'],
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Kartenarbeit: Stadtstaat → Land-/Seemacht → Weltmacht; Mare Nostrum = beherrschtes Mittelmeer.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    dragDropSortTask({
      question: 'Ordne die Stufen der Macht (klein → groß):',
      items: [
        { label: 'Stadtstaat Rom', value: 0 },
        { label: 'Landmacht in Italien', value: 1 },
        { label: 'Seemacht nach Sieg über Karthago', value: 2 },
        { label: 'Weltmacht um das Mittelmeer', value: 3 },
      ],
      correctOrder: [0, 1, 2, 3],
      solution: 'Stadtstaat → Landmacht → Seemacht → Weltmacht',
      explanation: 'So lässt sich die Ausdehnung auf Geschichtskarten lesen.',
      rng: _rng,
    }),
  (_rng) =>
    textTask({
      question:
        'Wie nannten die Römer das Mittelmeer auf Latein (zwei Wörter)? Tipp: „unser Meer“.',
      accepted: ['mare nostrum', 'Mare Nostrum', 'mare nostrum.'],
      solution: 'Mare Nostrum',
      explanation:
        'Mare Nostrum = „unser Meer“ — Ausdruck der römischen Vorherrschaft im Mittelmeer.',
    }),
)

/** Bürgerrecht */
export const romBuergerrecht: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was brachte das römische Bürgerrecht u. a.?',
        correct: 'Schutz vor Willkür (z. B. Folter/Todesurteil)',
        wrong: [
          'Pflicht, König zu werden',
          'Verbot von Testamenten',
          'Verlust des Wahlrechts',
        ],
      },
      {
        q: 'Dürften römische Bürger Geschäfte und Verträge schließen?',
        correct: 'ja — Geschäftsverträge abschließen',
        wrong: ['nein — nur Patrizier', 'nur in Karthago', 'nur ohne Testament'],
      },
      {
        q: 'Hatten Bürger Wahlrecht in der Volksversammlung?',
        correct: 'ja',
        wrong: ['nein, nie', 'nur Hannibal', 'nur Sklaven'],
      },
    ] as const
    const c = pick(rng, cases)
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Bürgerrecht: Rechtsschutz, Verträge, Testament, Heirat, Wahlrecht, Steuerprivilegien.',
      instruction: 'Tippe die passende Antwort:',
    })
  },
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
      explanation: 'Bürgerrecht schützt und berechtigt; es macht niemanden zum Alleinherrscher.',
      instruction: 'Tippe alle zutreffenden Rechte:',
    }),
)

/** Überblick LB1 — mischt Kernwissen */
export const romUeberblick: Topic['generate'] = mixedVariants(
  romAnfaenge,
  romBegriffe,
  romPunisch,
  romWeltreich,
)

export const GESCHICHTE_K6_GENERATORS: Record<string, Topic['generate']> = {
  'ge-k6-lb1-rom': romUeberblick,
  'ge-k6-lb1-anfaenge': romAnfaenge,
  'ge-k6-lb1-begriffe': romBegriffe,
  'ge-k6-lb1-aemter': romAemter,
  'ge-k6-lb1-punische-kriege': romPunisch,
  'ge-k6-lb1-weltreich': romWeltreich,
  'ge-k6-lb1-buergerrecht': romBuergerrecht,
}
