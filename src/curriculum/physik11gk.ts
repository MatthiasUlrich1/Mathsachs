import { pick, randInt, type Rng } from '../lib/rng'
import {
  choicePickTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  valueTask,
} from './taskHelpers'
import type { Topic } from './types'

const shuffleChoices = (rng: Rng, choices: string[], correct: string): string[] => {
  const list = [...choices]
  for (let i = list.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i)
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  if (!list.includes(correct)) list[0] = correct
  return list
}

/** LB1 — Erhaltung der Energie */
const energie: Topic['generate'] = mixedVariants(
  (rng) => {
    // Gerade m und v → E_kin = ½ m v² ganzzahlig oder mit höchstens einer Nachkommastelle
    const pairs = [
      { m: 2, v: 2, e: 4 },
      { m: 2, v: 4, e: 16 },
      { m: 4, v: 2, e: 8 },
      { m: 4, v: 4, e: 32 },
      { m: 6, v: 2, e: 12 },
      { m: 8, v: 2, e: 16 },
      { m: 8, v: 4, e: 64 },
      { m: 10, v: 2, e: 20 },
    ] as const
    const { m, v, e } = pick(rng, [...pairs])
    return valueTask({
      question: `Ein Körper der Masse m = ${m} kg bewegt sich mit v = ${v} m/s. Berechne die kinetische Energie.`,
      answerKind: 'integer',
      unit: 'J',
      value: e,
      solution: `${e} J`,
      explanation: `E_kin = ½ · ${m} · ${v}² = ½ · ${m} · ${v * v} = ${e} J.`,
    })
  },
  (rng) => {
    const m = pick(rng, [1, 2, 3, 4, 5])
    const h = pick(rng, [2, 4, 5, 6, 8, 10])
    const g = 10
    const e = m * g * h
    return valueTask({
      question: `Ein Körper der Masse m = ${m} kg liegt in der Höhe h = ${h} m (g = ${g} m/s²). Berechne die potenzielle Energie.`,
      answerKind: 'integer',
      unit: 'J',
      value: e,
      solution: `${e} J`,
      explanation: `E_pot = m · g · h = ${m} · ${g} · ${h} = ${e} J.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Ein Schlitten rutscht reibungsfrei einen Hang hinunter. Was gilt näherungsweise für die mechanische Energie?',
        correct: 'E_kin + E_pot bleibt erhalten',
        wrong: [
          'Nur E_kin bleibt konstant',
          'Energie entsteht aus dem Nichts',
          'E_pot steigt, während E_kin sinkt',
        ],
        explanation:
          'Ohne Reibung und ohne äußere Arbeit bleibt die Summe aus kinetischer und potenzieller Energie erhalten.',
      },
      {
        q: 'Ein Ball fällt frei (Luftwiderstand vernachlässigt). Was passiert mit E_pot und E_kin?',
        correct: 'E_pot nimmt ab, E_kin nimmt zu',
        wrong: [
          'Beide Energien nehmen zu',
          'Beide Energien nehmen ab',
          'E_pot nimmt zu, E_kin nimmt ab',
        ],
        explanation:
          'Beim Fallen wird potenzielle in kinetische Energie umgewandelt; die Summe bleibt näherungsweise gleich.',
      },
      {
        q: 'Was bedeutet Energieerhaltung in einem abgeschlossenen System ohne Reibung?',
        correct: 'Die Gesamtenergie bleibt konstant',
        wrong: [
          'Energie verschwindet am Ende',
          'Nur Wärme bleibt erhalten',
          'Masse wird zu Energie umgewandelt',
        ],
        explanation:
          'Energie kann umgewandelt werden, verschwindet aber nicht. Die Summe der Energieformen bleibt konstant.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB2 — Kinematik und Dynamik */
const mechanik: Topic['generate'] = mixedVariants(
  (rng) => {
    const triples = [
      { v0: 0, v: 10, t: 2, a: 5 },
      { v0: 0, v: 20, t: 4, a: 5 },
      { v0: 2, v: 12, t: 5, a: 2 },
      { v0: 4, v: 14, t: 5, a: 2 },
      { v0: 5, v: 25, t: 4, a: 5 },
      { v0: 10, v: 30, t: 5, a: 4 },
      { v0: 0, v: 15, t: 5, a: 3 },
    ] as const
    const { v0, v, t, a } = pick(rng, [...triples])
    return valueTask({
      question: `Ein Körper beschleunigt von v₀ = ${v0} m/s auf v = ${v} m/s in t = ${t} s. Berechne die Beschleunigung.`,
      answerKind: 'integer',
      unit: 'm/s²',
      value: a,
      solution: `${a} m/s²`,
      explanation: `a = (${v} − ${v0}) / ${t} = ${a} m/s².`,
    })
  },
  (rng) => {
    const m = pick(rng, [2, 3, 4, 5, 8, 10])
    const a = pick(rng, [2, 3, 4, 5])
    const F = m * a
    return valueTask({
      question: `Auf einen Körper der Masse m = ${m} kg wirkt die Beschleunigung a = ${a} m/s². Berechne die Kraft.`,
      answerKind: 'integer',
      unit: 'N',
      value: F,
      solution: `${F} N`,
      explanation: `F = m · a = ${m} · ${a} = ${F} N.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Beim freien Fall (Luftwiderstand vernachlässigt) gilt näherungsweise …',
        correct: 'alle Körper fallen gleich schnell (gleiche Beschleunigung g)',
        wrong: [
          'schwere Körper fallen immer schneller',
          'leichte Körper fallen immer schneller',
          'Körper fallen mit konstanter Geschwindigkeit',
        ],
        explanation:
          'Ohne Luftwiderstand beschleunigen alle Körper mit derselben Erdbeschleunigung g.',
      },
      {
        q: 'Ein Stein fällt frei aus der Ruhe. Was trifft zu?',
        correct: 'Die Geschwindigkeit nimmt mit der Zeit zu',
        wrong: [
          'Die Geschwindigkeit bleibt null',
          'Die Beschleunigung nimmt ständig ab',
          'Die Masse nimmt beim Fallen zu',
        ],
        explanation:
          'Beim freien Fall wirkt die Gewichtskraft → konstante Beschleunigung g → Geschwindigkeit nimmt zu.',
      },
      {
        q: 'Was ist beim freien Fall ungefähr konstant?',
        correct: 'die Beschleunigung (Betrag ≈ g)',
        wrong: [
          'die Geschwindigkeit',
          'die kinetische Energie',
          'die potenzielle Energie',
        ],
        explanation:
          'g ist näherungsweise konstant; Geschwindigkeit und Energien ändern sich.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB3 — Kondensator und Spule (Praktikum) */
const praktikum: Topic['generate'] = mixedVariants(
  (rng) => {
    const pairs = [
      { Q: 6, U: 3, C: 2 },
      { Q: 8, U: 4, C: 2 },
      { Q: 10, U: 5, C: 2 },
      { Q: 12, U: 4, C: 3 },
      { Q: 15, U: 5, C: 3 },
      { Q: 20, U: 4, C: 5 },
      { Q: 24, U: 6, C: 4 },
    ] as const
    const { Q, U, C } = pick(rng, [...pairs])
    return valueTask({
      question: `Ein Kondensator speichert die Ladung Q = ${Q} C bei der Spannung U = ${U} V. Berechne die Kapazität.`,
      answerKind: 'integer',
      unit: 'F',
      value: C,
      solution: `${C} F`,
      explanation: `C = Q / U = ${Q} / ${U} = ${C} F.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'In einer Spule ändert sich der Strom. Was passiert?',
        correct: 'Es wird eine Induktionsspannung induziert',
        wrong: [
          'Die Spule speichert nur Ladung wie ein Kondensator',
          'Es entsteht immer Gleichstrom ohne Spannung',
          'Magnetfelder entstehen nur ohne Stromänderung',
        ],
        explanation:
          'Eine zeitliche Änderung des Magnetfelds (durch Stromänderung) induziert eine Spannung (Induktionsgesetz).',
      },
      {
        q: 'Wann ist die Induktionsspannung in einer Spule besonders groß?',
        correct: 'bei schneller Änderung des Stroms bzw. Magnetfelds',
        wrong: [
          'nur bei konstantem Gleichstrom ohne Änderung',
          'nur wenn die Spule ungewickelt ist',
          'nur bei Temperatur unter 0 °C',
        ],
        explanation:
          'Die induzierte Spannung hängt von der Änderungsgeschwindigkeit des magnetischen Flusses ab.',
      },
      {
        q: 'Eine Spule im Gleichstromkreis nach dem Einschalten …',
        correct: 'baut ein Magnetfeld auf und wirkt der Stromänderung entgegen',
        wrong: [
          'löscht sofort jedes Magnetfeld',
          'wirkt wie ein idealer Kurzschluss ohne Magnetfeld',
          'kann keinen Strom führen',
        ],
        explanation:
          'Selbstinduktion: Die Spule wirkt Stromänderungen entgegen und speichert Energie im Magnetfeld.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const ordered = pick(rng, [
      [
        { label: 'U = 2 V → Q = 4 C', value: 2 },
        { label: 'U = 4 V → Q = 8 C', value: 4 },
        { label: 'U = 6 V → Q = 12 C', value: 6 },
      ],
      [
        { label: 'U = 1 V → Q = 3 C', value: 1 },
        { label: 'U = 2 V → Q = 6 C', value: 2 },
        { label: 'U = 3 V → Q = 9 C', value: 3 },
      ],
      [
        { label: 't = 0 s: I = 0 A', value: 0 },
        { label: 't = 2 s: I = 1 A', value: 2 },
        { label: 't = 4 s: I = 2 A', value: 4 },
      ],
    ])
    const items = [...ordered]
    for (let i = items.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[items[i], items[j]] = [items[j]!, items[i]!]
    }
    const correctOrder = ordered.map((row) => items.findIndex((it) => it.value === row.value))
    return dragDropSortTask({
      question: 'Ordne die Messreihe nach steigender Steuergröße (klein → groß).',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Messwerte werden nach der Steuergröße (Spannung bzw. Zeit) aufsteigend geordnet.',
    })
  },
)

/** LB4 — Geladene Teilchen in Feldern */
const felder: Topic['generate'] = mixedVariants(
  (rng) => {
    const pairs = [
      { q: 2, E: 3, F: 6 },
      { q: 4, E: 2, F: 8 },
      { q: 5, E: 2, F: 10 },
      { q: 3, E: 4, F: 12 },
      { q: 6, E: 2, F: 12 },
      { q: 8, E: 3, F: 24 },
    ] as const
    const { q, E, F } = pick(rng, [...pairs])
    return valueTask({
      question: `Ein Teilchen mit der Ladung q = ${q} C befindet sich in einem homogenen elektrischen Feld E = ${E} N/C. Berechne den Betrag der Kraft.`,
      answerKind: 'integer',
      unit: 'N',
      value: F,
      solution: `${F} N`,
      explanation: `F = q · E = ${q} · ${E} = ${F} N.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Ein positiv geladenes Teilchen fliegt nach rechts in ein Magnetfeld, das in die Zeichenebene hinein zeigt. Die Lorentzkraft wirkt …',
        correct: 'nach oben (Rechte-Hand-Regel für positive Ladung)',
        wrong: [
          'entgegen der Bewegungsrichtung',
          'parallel zum Magnetfeld',
          'immer nach unten unabhängig von q',
        ],
        explanation:
          'Die Lorentzkraft steht senkrecht zu v und B. Mit der Rechte-Hand-Regel ergibt sich die Richtung für positive Ladungen.',
      },
      {
        q: 'Die Lorentzkraft auf ein geladenes Teilchen ist null, wenn …',
        correct: 'v parallel (oder antiparallel) zu B ist bzw. v = 0',
        wrong: [
          'immer, sobald ein Magnetfeld existiert',
          'nur bei sehr großer Masse',
          'nur bei negativer Ladung',
        ],
        explanation:
          'F_L = q · (v × B). Bei parallelem v und B (oder v = 0) ist das Kreuzprodukt null.',
      },
      {
        q: 'Was gilt für die Richtung der Lorentzkraft?',
        correct: 'sie steht senkrecht zu Geschwindigkeit und Magnetfeld',
        wrong: [
          'sie zeigt immer in Bewegungsrichtung',
          'sie zeigt immer parallel zum Magnetfeld',
          'sie ist unabhängig von der Ladung',
        ],
        explanation:
          'Das Vektorprodukt v × B liefert eine Kraft senkrecht zu beiden Vektoren; das Vorzeichen hängt von q ab.',
      },
    ] as const
    const c = pick(rng, [...cases])
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
    multiSelectTask({
      question: 'Welche Aussagen zu Feldlinien stimmen? (mehrere möglich)',
      choices: [
        'Feldlinien zeigen die Richtung der Kraft auf eine positive Probeladung',
        'Elektrische Feldlinien beginnen an positiven und enden an negativen Ladungen',
        'Feldlinien kreuzen sich nicht',
        'Je dichter die Feldlinien, desto stärker das Feld',
        'Feldlinien sind immer geschlossene Kreise um positive Ladungen',
        'Magnetische Feldlinien enden an Nordpolen',
      ],
      correct: [
        'Feldlinien zeigen die Richtung der Kraft auf eine positive Probeladung',
        'Elektrische Feldlinien beginnen an positiven und enden an negativen Ladungen',
        'Feldlinien kreuzen sich nicht',
        'Je dichter die Feldlinien, desto stärker das Feld',
      ],
      solution:
        'Richtung für +q; elektrisch von + nach −; keine Kreuzungen; Dichte ≈ Feldstärke.',
      explanation:
        'Falsch: Elektrische Feldlinien enden nicht als Kreise um +; magnetische Feldlinien sind geschlossen und enden nicht am Nordpol.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** Wahl — Naturkonstanten */
const konstanten: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Die Elementarladung e ist …',
        correct: 'die kleinste frei vorkommende Ladungsmenge eines Protons/Elektrons',
        wrong: [
          'die Geschwindigkeit des Lichts',
          'eine Energie pro Zeit',
          'nur eine Rechenkonstante ohne Bedeutung',
        ],
        explanation:
          'e ≈ 1,6 · 10⁻¹⁹ C ist die Ladung eines Protons (bzw. Betrag der Elektronenladung).',
      },
      {
        q: 'Das plancksche Wirkungsquantum h verknüpft …',
        correct: 'Energie und Frequenz eines Photons (E = h · f)',
        wrong: [
          'nur Masse und Volumen',
          'nur Strom und Spannung ohne Energie',
          'nur Temperatur und Druck',
        ],
        explanation:
          'h ist die fundamentale Konstante der Quantenphysik: E = h · f für Photonen.',
      },
      {
        q: 'Warum misst man elementare Naturkonstanten so genau?',
        correct: 'sie sind Grundlage für Einheiten und physikalische Modelle',
        wrong: [
          'sie ändern sich stündlich stark',
          'sie gelten nur im Weltall',
          'sie ersetzen jede Messung im Labor',
        ],
        explanation:
          'Naturkonstanten sind zentral für das SI-Einheitensystem und für die Theorie.',
      },
    ] as const
    const c = pick(rng, [...cases])
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
    multiSelectTask({
      question: 'Welche Aussagen zu e und h stimmen? (mehrere möglich)',
      choices: [
        'e ist die Elementarladung',
        'h ist das plancksche Wirkungsquantum',
        'Photonenenergie hängt über E = h · f mit der Frequenz zusammen',
        'e ist die Lichtgeschwindigkeit',
        'h hat die Einheit einer Energie mal Zeit (Wirkung)',
      ],
      correct: [
        'e ist die Elementarladung',
        'h ist das plancksche Wirkungsquantum',
        'Photonenenergie hängt über E = h · f mit der Frequenz zusammen',
        'h hat die Einheit einer Energie mal Zeit (Wirkung)',
      ],
      solution: 'e = Elementarladung; h = Wirkungsquantum; E = h·f; Einheit von h: J·s.',
      explanation: 'Falsch ist: e sei die Lichtgeschwindigkeit.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  (rng) => {
    const correct = 'e und h sind fundamentale Naturkonstanten'
    return choicePickTask({
      question: 'Welche Einordnung passt am besten?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'e und h sind nur Schätzwerte ohne festen Wert',
          'e und h sind reine Gerätedefekte',
          'e und h gelten nur bei Raumtemperatur',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Elementarladung und Wirkungsquantum sind universelle Konstanten der Physik.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahl — Exkursion */
const exkursion: Topic['generate'] = mixedVariants(
  (_rng) =>
    multiSelectTask({
      question: 'Welche Sicherheitsregeln gelten typischerweise bei einer physikalisch-technischen Exkursion? (mehrere möglich)',
      choices: [
        'Anweisungen der Aufsichtspersonen beachten',
        'Schutzausrüstung tragen, wenn vorgeschrieben',
        'Absperrungen und Warnschilder beachten',
        'Ohne Erlaubnis an laufenden Maschinen hantieren',
        'Schutzbrille absetzen in der Nähe von Funken',
      ],
      correct: [
        'Anweisungen der Aufsichtspersonen beachten',
        'Schutzausrüstung tragen, wenn vorgeschrieben',
        'Absperrungen und Warnschilder beachten',
      ],
      solution: 'Anweisungen, Schutzausrüstung und Absperrungen beachten.',
      explanation:
        'Eigenmächtiges Eingreifen an Maschinen und das Ablegen von Schutzausrüstung sind gefährlich und verboten.',
      instruction: 'Tippe alle richtigen Regeln:',
    }),
  (_rng) =>
    multiSelectTask({
      question: 'Was gehört zu einer guten Beobachtung vor Ort? (mehrere möglich)',
      choices: [
        'Messwerte und Einheiten notieren',
        'Auffälligkeiten und Bedingungen dokumentieren',
        'Skizzen oder Fotos (falls erlaubt) anfertigen',
        'Nur schätzen und nichts aufschreiben',
        'Ergebnisse erfinden, wenn man etwas verpasst hat',
      ],
      correct: [
        'Messwerte und Einheiten notieren',
        'Auffälligkeiten und Bedingungen dokumentieren',
        'Skizzen oder Fotos (falls erlaubt) anfertigen',
      ],
      solution: 'Notieren, dokumentieren, skizzieren — keine erfundenen Daten.',
      explanation:
        'Wissenschaftliche Beobachtung braucht nachvollziehbare Aufzeichnungen, keine Fantasiewerte.',
      instruction: 'Tippe alle passenden Punkte:',
    }),
  (rng) => {
    const cases = [
      {
        q: 'Vor dem Betreten eines Laborbereichs solltest du …',
        correct: 'Sicherheitsunterweisung und Regeln beachten',
        wrong: [
          'einfach hineinlaufen und alles anfassen',
          'Warnschilder ignorieren',
          'Schutzausrüstung ablehnen',
        ],
      },
      {
        q: 'Wenn etwas unklar oder gefährlich wirkt, …',
        correct: 'nachfragen und Abstand halten',
        wrong: [
          'selbst experimentieren',
          'andere anstupsen, damit sie es testen',
          'Warnungen übersehen',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Sicherheit geht vor: Regeln beachten, nachfragen, Risiken meiden.',
      instruction: 'Tippe die beste Antwort:',
    })
  },
)

/** Wahl — Technische Anwendungen Spule/Kondensator */
const anwendungen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wofür wird ein Kondensator typischerweise eingesetzt?',
        correct: 'zum Speichern elektrischer Ladung / Glätten von Spannungen',
        wrong: [
          'als reiner mechanischer Hebel',
          'nur als Massestück ohne Elektrik',
          'als Lichtquelle ohne Strom',
        ],
        explanation:
          'Kondensatoren speichern Ladung und werden z. B. zur Spannungsglättung und in Schwingkreisen genutzt.',
      },
      {
        q: 'Wofür wird eine Spule typischerweise eingesetzt?',
        correct: 'zum Erzeugen von Magnetfeldern / in Transformatoren und Motoren',
        wrong: [
          'nur als Wärmespeicher ohne Strom',
          'als reiner optischer Spiegel',
          'zum Messen von Temperatur ohne Sensor',
        ],
        explanation:
          'Spulen erzeugen Magnetfelder und sind zentrale Bauteile in Motoren, Transformatoren und Induktivitäten.',
      },
      {
        q: 'In einem Radio-Schwingkreis wirken Spule und Kondensator zusammen. Was passiert?',
        correct: 'Energie schwankt zwischen elektrischem und magnetischem Feld',
        wrong: [
          'Es entsteht dauerhaft nur Wärme ohne Schwingung',
          'Beide Bauteile speichern nur mechanische Energie',
          'Es fließt nie ein Strom',
        ],
        explanation:
          'Im LC-Schwingkreis oszilliert Energie zwischen Kondensator (E-Feld) und Spule (B-Feld).',
      },
    ] as const
    const c = pick(rng, [...cases])
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
    multiSelectTask({
      question: 'Welche technischen Anwendungen passen? (mehrere möglich)',
      choices: [
        'Kondensator in Netzteilen zur Glättung',
        'Spule im Elektromotor',
        'Transformator mit Spulen',
        'Kondensator als reiner Holzkeil',
        'Spule als optische Linse',
      ],
      correct: [
        'Kondensator in Netzteilen zur Glättung',
        'Spule im Elektromotor',
        'Transformator mit Spulen',
      ],
      solution: 'Glättung, Motor, Transformator — nicht Holzkeil oder Linse.',
      explanation:
        'Kondensatoren und Spulen sind elektrische Bauteile, keine mechanischen oder optischen Ersatzteile.',
      instruction: 'Tippe alle passenden Anwendungen:',
    }),
  (rng) => {
    const correct = 'Spule: Magnetfeld; Kondensator: elektrisches Feld / Ladungsspeicher'
    return choicePickTask({
      question: 'Welche Kurzbeschreibung passt am besten?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Beide speichern nur Wärme ohne Feld',
          'Beide sind reine Widerstände ohne Induktion/Kapazität',
          'Beide wirken nur bei Temperatur unter −100 °C',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Spulen speichern Energie im Magnetfeld, Kondensatoren im elektrischen Feld (Ladung).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahl — Relativität */
const relativitaet: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was beschreibt die Zeitdilatation qualitativ?',
        correct: 'Bewegte Uhren gehen aus Sicht eines ruhenden Beobachters langsamer',
        wrong: [
          'Zeit läuft für alle Beobachter immer gleich schnell',
          'Bewegte Uhren gehen immer schneller',
          'Zeitdilatation gilt nur für Schall',
        ],
        explanation:
          'In der speziellen Relativitätstheorie vergeht für relativ bewegte Uhren weniger Eigenzeit.',
      },
      {
        q: 'Ein Raumschiff fliegt sehr schnell an der Erde vorbei. Was gilt für die Borduhr aus Erd-Sicht?',
        correct: 'sie geht langsamer als eine ruhende Erduhr',
        wrong: [
          'sie geht schneller',
          'sie bleibt stehen und springt zurück',
          'sie zeigt immer die gleiche Zeit wie jede Erduhr ohne Relativität',
        ],
        explanation:
          'Zeitdilatation: Aus Sicht der Erde geht die schnell bewegte Uhr langsamer.',
      },
      {
        q: 'Wann wird Zeitdilatation alltagsrelevant messbar?',
        correct: 'bei Geschwindigkeiten nahe der Lichtgeschwindigkeit bzw. präzisen Uhren',
        wrong: [
          'nur beim Gehen mit 1 m/s',
          'nie, auch nicht bei GPS-Satelliten',
          'nur in Flüssigkeiten',
        ],
        explanation:
          'Der Effekt ist bei Alltagstempo winzig, aber mit Atomuhren (z. B. GPS) relevant.',
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: c.explanation,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Die Lichtgeschwindigkeit c ist …',
        correct: 'eine Grenzgeschwindigkeit: nichts mit Masse erreicht c',
        wrong: [
          'beliebig überschreitbar mit genug Kraft',
          'nur für Schall gültig',
          'abhängig vom Beobachter und beliebig groß',
        ],
        explanation:
          'c ist die maximale Signalgeschwindigkeit; massive Körper erreichen sie nicht.',
      },
      {
        q: 'Warum kann ein Körper mit Masse c nicht erreichen?',
        correct: 'seine Energie/Impuls würde unbegrenzt anwachsen',
        wrong: [
          'weil Motoren zu schwach gebaut sind',
          'weil die Erde zu klein ist',
          'weil Schall schneller ist',
        ],
        explanation:
          'Relativistisch steigt der Impuls bei Annäherung an c stark an; c bleibt unerreichbar.',
      },
    ] as const
    const c = pick(rng, [...cases])
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
    multiSelectTask({
      question: 'Welche Aussagen zur Relativität stimmen? (mehrere möglich)',
      choices: [
        'c ist die Grenzgeschwindigkeit für Signale und massive Körper',
        'Zeitdilatation: bewegte Uhren gehen langsamer (aus Ruhesicht)',
        'Gleichzeitigkeit ist relativ zum Bezugssystem',
        'Man kann mit genug Schub beliebig über c beschleunigen',
        'Zeitdilatation gilt nur für Schallwellen',
      ],
      correct: [
        'c ist die Grenzgeschwindigkeit für Signale und massive Körper',
        'Zeitdilatation: bewegte Uhren gehen langsamer (aus Ruhesicht)',
        'Gleichzeitigkeit ist relativ zum Bezugssystem',
      ],
      solution: 'c als Grenze; Zeitdilatation; relative Gleichzeitigkeit.',
      explanation: 'Überlichtgeschwindigkeit und „nur Schall“ sind falsch.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

export const PHYSIK_J11GK_GENERATORS: Record<string, Topic['generate']> = {
  'ph-j11gk-lb1-energie': energie,
  'ph-j11gk-lb2-mechanik': mechanik,
  'ph-j11gk-lb3-praktikum': praktikum,
  'ph-j11gk-lb4-felder': felder,
  'ph-j11gk-lbw-konstanten': konstanten,
  'ph-j11gk-lbw-exkursion': exkursion,
  'ph-j11gk-lbw-anwendungen': anwendungen,
  'ph-j11gk-lbw-relativitaet': relativitaet,
}
