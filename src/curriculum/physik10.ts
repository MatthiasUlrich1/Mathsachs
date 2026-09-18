import { pick, randInt, type Rng } from '../lib/rng'
import {
  choicePickTask,
  coordinateClickTask,
  dragDropSortTask,
  mixedVariants,
  multiSelectTask,
  numberLineTask,
  paramSliderTask,
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

/** LB1 — Mechanische Schwingungen und Wellen */
const schwingung: Topic['generate'] = mixedVariants(
  (rng) => {
    // Nice pairs: integer f, T = 1/f (decimal ok); or ask f from T with integer result
    const f = pick(rng, [1, 2, 4, 5, 10])
    const T = 1 / f
    if (pick(rng, [true, false])) {
      return valueTask({
        question: `Eine Schwingung hat die Frequenz f = ${f} Hz. Berechne die Periodendauer.`,
        answerKind: T % 1 === 0 ? 'integer' : 'decimal',
        unit: 's',
        value: T,
        solution: `${T} s`,
        explanation: `T = 1 / f = 1 / ${f} = ${T} s.`,
      })
    }
    return valueTask({
      question: `Eine Schwingung hat die Periodendauer T = ${T} s. Berechne die Frequenz.`,
      answerKind: 'integer',
      unit: 'Hz',
      value: f,
      solution: `${f} Hz`,
      explanation: `f = 1 / T = 1 / ${T} = ${f} Hz.`,
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Was gilt qualitativ für ein Federpendel (ungedämpft, kleine Auslenkung)?',
        correct: 'größere Masse → größere Periodendauer',
        wrong: [
          'größere Masse → kleinere Periodendauer immer',
          'die Federkonstante spielt keine Rolle',
          'Amplitude bestimmt allein die Periodendauer',
        ],
      },
      {
        q: 'Was gilt qualitativ für ein Fadenpendel (kleine Winkel)?',
        correct: 'längerer Faden → größere Periodendauer',
        wrong: [
          'längerer Faden → kleinere Periodendauer',
          'nur die Masse bestimmt T',
          'T ist unabhängig von der Länge',
        ],
      },
      {
        q: 'Feder- und Fadenpendel: Welche Aussage stimmt?',
        correct: 'beide führen periodische Schwingungen aus',
        wrong: [
          'nur die Feder schwingt, das Fadenpendel nie',
          'Periodendauer ist immer genau 1 s',
          'Schwingungen brauchen keine rücktreibende Kraft',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Feder: T hängt von m und D ab; Faden: T hängt vor allem von der Länge ab. Beide schwingen periodisch.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const A = pick(rng, [2, 3, 4, 5, 6, 8])
    const mode = pick(rng, ['choice', 'line', 'slider'] as const)
    if (mode === 'choice') {
      return choicePickTask({
        question: `Was bedeutet die Amplitude A = ${A} cm bei einer Schwingung?`,
        choices: shuffleChoices(
          rng,
          [
            'maximale Auslenkung aus der Ruhelage',
            'Periodendauer in Sekunden',
            'Frequenz in Hertz',
            'nur die Masse des Pendels',
          ],
          'maximale Auslenkung aus der Ruhelage',
        ),
        correct: 'maximale Auslenkung aus der Ruhelage',
        solution: 'maximale Auslenkung aus der Ruhelage',
        explanation: 'Die Amplitude ist die maximale Auslenkung aus der Ruhelage.',
        instruction: 'Tippe die passende Aussage:',
      })
    }
    if (mode === 'line') {
      return numberLineTask({
        question: `Stelle die Amplitude A = ${A} cm auf dem Zahlenstrahl ein.`,
        min: 0,
        max: 10,
        step: 1,
        value: A,
        solution: `${A} cm`,
        explanation: `Die Markierung liegt bei A = ${A} cm.`,
      })
    }
    return paramSliderTask({
      question: `Stelle die Amplitude auf A = ${A} cm.`,
      params: [
        {
          id: 'A',
          label: 'Amplitude A (cm)',
          min: 0,
          max: 10,
          step: 1,
          start: A === 4 ? 2 : 4,
        },
      ],
      correct: { A },
      solution: `A = ${A} cm`,
      explanation: 'Amplitude = maximale Auslenkung aus der Ruhelage.',
      instruction: 'Schieberegler auf den geforderten Wert:',
    })
  },
)

/** LB2 — Kosmos, Erde und Mensch */
const kosmos: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welcher Himmelskörper steht im Zentrum des Sonnensystems?',
        correct: 'die Sonne',
        wrong: ['die Erde', 'der Mond', 'der Mars'],
      },
      {
        q: 'Was umkreist typischerweise einen Planeten?',
        correct: 'ein Mond (Satellit)',
        wrong: ['die Sonne als Trabant des Planeten', 'nur Asteroidenringe der Erde', 'Galaxienkerne'],
      },
      {
        q: 'Welche Aussage stimmt?',
        correct: 'Planeten umkreisen die Sonne',
        wrong: [
          'die Sonne umkreist die Erde als Zentrum',
          'Planeten stehen fest und bewegen sich nie',
          'nur der Mond umkreist die Sonne direkt',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Sonne im Zentrum; Planeten umkreisen die Sonne; Monde umkreisen Planeten.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Warum gibt es Jahreszeiten auf der Erde?',
        correct: 'weil die Erdachse geneigt ist und die Einstrahlung sich ändert',
        wrong: [
          'weil die Erde mal näher, mal weiter von der Sonne ist (alleinige Ursache)',
          'weil der Mond die Sonne verdunkelt',
          'weil die Sonne jeden Monat erlischt',
        ],
      },
      {
        q: 'Welche Aussage zu den Jahreszeiten stimmt?',
        correct: 'Im Sommer steht die Sonne höher und die Tage sind länger',
        wrong: [
          'Im Sommer ist die Erde immer am weitesten von der Sonne',
          'Jahreszeiten entstehen nur durch den Erdmond',
          'Überall auf der Erde herrscht gleichzeitig Sommer',
        ],
      },
      {
        q: 'Was ändert sich im Jahreslauf durch die Achsneigung?',
        correct: 'Einfallswinkel des Sonnenlichts und Tageslänge',
        wrong: [
          'die Masse der Erde',
          'die Anzahl der Planeten',
          'die Lichtgeschwindigkeit',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Jahreszeiten entstehen vor allem durch die geneigte Erdachse → unterschiedliche Einstrahlung und Tageslänge.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Was ist ein Lichtjahr?',
        correct: 'die Strecke, die Licht in einem Jahr zurücklegt',
        wrong: [
          'eine Zeiteinheit für Uhren auf der Erde',
          'die Masse der Sonne',
          'die Temperatur im Weltraum',
        ],
      },
      {
        q: 'Wozu nutzt man Lichtjahre in der Astronomie?',
        correct: 'um große Entfernungen anzugeben',
        wrong: [
          'um die Lautstärke von Sternen zu messen',
          'um die Farbe von Planeten zu zählen',
          'als Einheit für die Erdmasse',
        ],
      },
      {
        q: 'Welche Aussage zum Lichtjahr stimmt?',
        correct: 'Es ist eine Längeneinheit, keine Zeiteinheit',
        wrong: [
          'Es misst nur Zeit, nie Strecke',
          'Licht braucht kein Jahr für ein Lichtjahr',
          'Ein Lichtjahr ist kürzer als ein Meter',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Ein Lichtjahr ist die Strecke, die Licht in einem Jahr zurücklegt — eine Längeneinheit.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB3 — Licht als Strahl und Welle */
const licht: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was beschreibt die Reflexion von Licht?',
        correct: 'Licht wird an einer Grenzfläche zurückgeworfen',
        wrong: [
          'Licht wird beim Übergang gebrochen und ändert die Richtung im neuen Medium',
          'Licht verschwindet immer vollständig',
          'Licht läuft nur im Kreis',
        ],
      },
      {
        q: 'Was beschreibt die Brechung von Licht?',
        correct: 'Licht ändert an der Grenzfläche die Richtung beim Übergang ins andere Medium',
        wrong: [
          'Licht wird immer vollständig zurückgeworfen',
          'Licht braucht keine Grenzfläche',
          'Brechung bedeutet nur „lauter werden“',
        ],
      },
      {
        q: 'Einfallswinkel = Ausfallswinkel gilt für …',
        correct: 'Reflexion am Spiegel',
        wrong: ['jede Brechung im Wasser', 'nur für Schall', 'nur ohne Lot'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation:
        'Reflexion: zurückwerfen (Einfall = Ausfall). Brechung: Richtungsänderung beim Medienwechsel.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    // c = λ · f with nice integers; use wave speed in m/s for light-scale simplified: f in MHz, λ in m
    // c = 3·10^8 m/s: λ = 3 m → f = 1·10^8 Hz = 100 MHz
    const pairs = [
      { lambda: 3, fMhz: 100 },
      { lambda: 6, fMhz: 50 },
      { lambda: 2, fMhz: 150 },
      { lambda: 1, fMhz: 300 },
      { lambda: 5, fMhz: 60 },
    ] as const
    const { lambda, fMhz } = pick(rng, [...pairs])
    const askF = pick(rng, [true, false])
    if (askF) {
      return valueTask({
        question: `Licht / EM-Welle mit c = 3·10⁸ m/s und Wellenlänge λ = ${lambda} m. Berechne die Frequenz in MHz (1 MHz = 10⁶ Hz).`,
        answerKind: 'integer',
        unit: 'MHz',
        value: fMhz,
        solution: `${fMhz} MHz`,
        explanation: `f = c / λ = 3·10⁸ / ${lambda} = ${fMhz}·10⁶ Hz = ${fMhz} MHz.`,
      })
    }
    return valueTask({
      question: `EM-Welle mit f = ${fMhz} MHz und c = 3·10⁸ m/s. Berechne die Wellenlänge in m (f in Hz: ${fMhz}·10⁶ Hz).`,
      answerKind: 'integer',
      unit: 'm',
      value: lambda,
      solution: `${lambda} m`,
      explanation: `λ = c / f = 3·10⁸ / (${fMhz}·10⁶) = ${lambda} m.`,
    })
  },
  (rng) => {
    const alpha = pick(rng, [20, 30, 35, 40, 45, 50, 55, 60])
    return choicePickTask({
      question: `Am ebenen Spiegel beträgt der Einfallswinkel ${alpha}°. Wie groß ist der Ausfallswinkel?`,
      choices: shuffleChoices(
        rng,
        [`${alpha}°`, `${90 - alpha}°`, `${180 - alpha}°`, `${alpha + 10}°`],
        `${alpha}°`,
      ),
      correct: `${alpha}°`,
      solution: `${alpha}°`,
      explanation: 'Reflexionsgesetz: Einfallswinkel = Ausfallswinkel.',
      instruction: 'Tippe den Ausfallswinkel:',
    })
  },
)

/** LB4 — Hertzsche Wellen */
const hertz: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was sind Hertzsche Wellen?',
        correct: 'elektromagnetische Wellen',
        wrong: ['nur Schallwellen in Luft', 'Wasserwellen im Teich', 'mechanische Seilwellen allein'],
      },
      {
        q: 'Welche Aussage zu elektromagnetischen Wellen stimmt?',
        correct: 'sie können sich auch im Vakuum ausbreiten',
        wrong: [
          'sie brauchen zwingend Luft wie Schall',
          'sie sind immer hörbar',
          'sie entstehen nur unter Wasser',
        ],
      },
      {
        q: 'Radiowellen gehören zu …',
        correct: 'den elektromagnetischen Wellen',
        wrong: ['den Schallwellen im Hörbereich', 'den Wasserwellen', 'den Erdbebenwellen'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Hertzsche / EM-Wellen breiten sich auch im Vakuum aus; Radio nutzt EM-Wellen.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Wozu dienen Radiowellen qualitativ?',
        correct: 'zur drahtlosen Übertragung von Signalen',
        wrong: [
          'nur zum Kochen von Wasser',
          'nur als hörbarer Schall in der Luft',
          'nur zur Beleuchtung wie eine Lampe',
        ],
      },
      {
        q: 'Welche Aussage zum Radioempfang stimmt?',
        correct: 'Antenne und Empfänger wandeln EM-Wellen in nutzbare Signale um',
        wrong: [
          'Radio braucht keine Antenne und kein Signal',
          'Radiowellen sind reine Schallwellen vom Sender zum Ohr',
          'Empfang funktioniert nur ohne Energie',
        ],
      },
      {
        q: 'Sender und Empfänger bei Radio …',
        correct: 'nutzen elektromagnetische Wellen zur Übertragung',
        wrong: [
          'tauschen nur mechanische Seile aus',
          'brauchen zwingend ein Wasserkabel',
          'arbeiten nur mit sichtbarem Licht',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Radio: Sender → EM-Wellen → Antenne/Empfänger → nutzbares Signal.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const pairs = [
      { lambda: 3, fMhz: 100 },
      { lambda: 300, fMhz: 1 },
      { lambda: 150, fMhz: 2 },
      { lambda: 6, fMhz: 50 },
      { lambda: 30, fMhz: 10 },
    ] as const
    const { lambda, fMhz } = pick(rng, [...pairs])
    return valueTask({
      question: `Radiowelle mit λ = ${lambda} m und c = 3·10⁸ m/s. Berechne die Frequenz in MHz.`,
      answerKind: 'integer',
      unit: 'MHz',
      value: fMhz,
      solution: `${fMhz} MHz`,
      explanation: `f = c / λ = 3·10⁸ / ${lambda} = ${fMhz}·10⁶ Hz = ${fMhz} MHz.`,
    })
  },
)

/** LB5 — Physikalisches Praktikum */
const praktikum: Topic['generate'] = mixedVariants(
  (rng) => {
    const sequences = [
      [
        { label: 'Frage / Hypothese formulieren', value: 1 },
        { label: 'Versuch planen und aufbauen', value: 2 },
        { label: 'Messwerte aufnehmen', value: 3 },
        { label: 'auswerten und Schluss folgern', value: 4 },
      ],
      [
        { label: 'Messgeräte prüfen', value: 1 },
        { label: 'Versuch starten', value: 2 },
        { label: 'Daten notieren', value: 3 },
        { label: 'Versuch abbauen / aufräumen', value: 4 },
      ],
      [
        { label: 'Ziel des Versuchs klären', value: 1 },
        { label: 'Größen festlegen (unabhängig/abhängig)', value: 2 },
        { label: 'Messreihe durchführen', value: 3 },
        { label: 'Diagramm / Ergebnis darstellen', value: 4 },
      ],
    ] as const
    const ordered = pick(rng, [...sequences])
    const items = [...ordered]
    const correctOrder = ordered.map((_, i) => i)
    return dragDropSortTask({
      question: 'Ordne die Versuchsschritte in sinnvoller Reihenfolge (Anfang → Ende).',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Typisch: planen → durchführen → auswerten (bzw. prüfen → messen → aufräumen).',
    })
  },
  (rng) => {
    const cases = [
      {
        q: 'Was gehört zu einem sauberen Versuchsprotokoll?',
        correct: 'Ziel, Aufbau, Messwerte und Auswertung',
        wrong: [
          'nur die Namen der Gruppe ohne Messwerte',
          'Ergebnisse ohne Beschreibung weglassen',
          'Einheiten immer weglassen',
        ],
      },
      {
        q: 'Warum wiederholt man Messungen oft?',
        correct: 'um Zufallsfehler zu erkennen und Mittelwerte zu bilden',
        wrong: [
          'weil einmal Messen verboten ist',
          'um die Einheit zu ändern',
          'um den Versuch unnötig zu verlängern',
        ],
      },
      {
        q: 'Was solltest du vor dem Start prüfen?',
        correct: 'Aufbau, Messbereich und Sicherheit',
        wrong: [
          'nur die Farbe der Kabel',
          'ob das Protokoll schon fertig ausgewertet ist',
          'ob man ohne Geräte messen kann',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Protokoll = Ziel/Aufbau/Messwerte/Auswertung; Wiederholen und Prüfen gehören dazu.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Schritte gehören typischerweise zum Experimentieren? (mehrere möglich)',
      choices: [
        'Hypothese oder Fragestellung formulieren',
        'Messwerte systematisch aufnehmen',
        'Ergebnisse auswerten und diskutieren',
        'Messgeräte absichtlich falsch einstellen',
        'Sicherheitshinweise beachten',
      ],
      correct: [
        'Hypothese oder Fragestellung formulieren',
        'Messwerte systematisch aufnehmen',
        'Ergebnisse auswerten und diskutieren',
        'Sicherheitshinweise beachten',
      ],
      solution:
        'Fragen → messen → auswerten; Sicherheit beachten. Falsch: absichtlich falsch einstellen.',
      explanation: 'Gutes Experimentieren verbindet Planung, sorgfältiges Messen, Auswertung und Sicherheit.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** LBW — Fernrohre */
const fernrohr: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Welche Linse sammelt beim Fernrohr typischerweise zuerst das Licht vom Objekt?',
        correct: 'das Objektiv',
        wrong: ['das Okular', 'nur der Tubus ohne Linse', 'der Spiegel im Auge'],
      },
      {
        q: 'Durch welche Linse schaut man beim Fernrohr hindurch?',
        correct: 'das Okular',
        wrong: ['nur das Objektiv von außen', 'den Stativfuß', 'die Blende allein'],
      },
      {
        q: 'Welche Aussage zu Objektiv und Okular stimmt?',
        correct: 'Objektiv sammelt Licht; Okular vergrößert das Zwischenbild zum Betrachten',
        wrong: [
          'Okular sammelt immer zuerst das Sternenlicht',
          'Objektiv und Okular haben dieselbe Aufgabe',
          'Fernrohre brauchen keine Linsen oder Spiegel',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Objektiv: lichtseitig zum Objekt; Okular: augenseitig zum Betrachten.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const ordered = pick(rng, [
      [
        { label: 'Licht vom fernen Objekt', value: 1 },
        { label: 'Objektiv bildet ab', value: 2 },
        { label: 'Okular vergrößert zum Auge', value: 3 },
      ],
      [
        { label: 'Objektiv (objektseitig)', value: 1 },
        { label: 'Tubus / Strahlengang', value: 2 },
        { label: 'Okular (augenseitig)', value: 3 },
      ],
    ])
    const items = [...ordered]
    const correctOrder = ordered.map((_, i) => i)
    return dragDropSortTask({
      question: 'Ordne den Weg des Lichts durchs Fernrohr (Objekt → Auge).',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Licht trifft zuerst aufs Objektiv, dann zum Okular und ins Auge.',
    })
  },
  (rng) => {
    const correct = pick(rng, [
      'Ein größeres Objektiv sammelt mehr Licht',
      'Das Okular wirkt wie eine Lupe auf das Zwischenbild',
      'Fernrohre helfen, ferne Objekte vergrößert zu sehen',
    ])
    return choicePickTask({
      question: 'Welche Aussage zum Fernrohr stimmt qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Fernrohre verkleinern immer alles',
          'Ohne Objektiv sieht man Sterne schärfer',
          'Okular und Objektiv sind dieselbe Linse',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'Objektiv sammelt Licht; Okular vergrößert; zusammen sieht man Fernes besser.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LBW — Kommunikation mit elektronischen Medien */
const medien: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Was braucht man typischerweise zur Signalübertragung?',
        correct: 'Sender, Übertragungskanal und Empfänger',
        wrong: [
          'nur einen Empfänger ohne Signal',
          'nur Papier ohne Energie',
          'keine Information und keinen Kanal',
        ],
      },
      {
        q: 'Welche Aussage zur Signalübertragung stimmt?',
        correct: 'Informationen werden als Signale über einen Kanal übertragen',
        wrong: [
          'Signale entstehen nur ohne Energie',
          'Empfänger senden immer zuerst',
          'Kabel und Funk sind nie Übertragungskanäle',
        ],
      },
      {
        q: 'Funkübertragung nutzt typischerweise …',
        correct: 'elektromagnetische Wellen',
        wrong: ['nur Wasserschläuche', 'nur hörbaren Schall über Kilometer', 'nur mechanische Seile'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Übertragung: Sender → Kanal (Kabel/Funk) → Empfänger.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const sequences = [
      [
        { label: 'Information / Nachricht', value: 1 },
        { label: 'Sender wandelt in Signal um', value: 2 },
        { label: 'Übertragung über Kanal', value: 3 },
        { label: 'Empfänger stellt Information wieder her', value: 4 },
      ],
      [
        { label: 'Nachricht erzeugen', value: 1 },
        { label: 'Signal senden', value: 2 },
        { label: 'Kanal durchlaufen', value: 3 },
        { label: 'Signal empfangen', value: 4 },
      ],
    ] as const
    const ordered = pick(rng, [...sequences])
    const items = [...ordered]
    const correctOrder = ordered.map((_, i) => i)
    return dragDropSortTask({
      question: 'Ordne die Schritte der Signalübertragung (Anfang → Ende).',
      items,
      correctOrder,
      solution: ordered.map((row) => row.label).join(' → '),
      explanation: 'Nachricht → Sender → Kanal → Empfänger.',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zur elektronischen Kommunikation stimmen? (mehrere möglich)',
      choices: [
        'Kabel und Funk können Übertragungskanäle sein',
        'Sender und Empfänger gehören zum Übertragungsweg',
        'Signale können analog oder digital kodiert sein',
        'Ohne Energie und ohne Kanal kommt die Nachricht immer an',
        'Störungen im Kanal können die Übertragung verschlechtern',
      ],
      correct: [
        'Kabel und Funk können Übertragungskanäle sein',
        'Sender und Empfänger gehören zum Übertragungsweg',
        'Signale können analog oder digital kodiert sein',
        'Störungen im Kanal können die Übertragung verschlechtern',
      ],
      solution:
        'Kanal + Sender/Empfänger + Kodierung; Störungen möglich. Nicht: Ankunft ohne Energie/Kanal.',
      explanation: 'Elektronische Medien übertragen kodierte Signale über Kanäle — Störungen können stören.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

/** LBW — Fernsehbildtechnik */
const fernsehen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      {
        q: 'Wie entsteht ein Fernsehbild klassisch (qualitativ)?',
        correct: 'Zeile für Zeile (Abtastung / Bildzeilen)',
        wrong: [
          'als einzelnes unverändertes Pixel für immer',
          'nur durch Schallwellen',
          'ohne Licht oder Signal',
        ],
      },
      {
        q: 'Was bedeuten Bildzeilen qualitativ?',
        correct: 'das Bild wird in horizontale Zeilen zerlegt und nacheinander aufgebaut',
        wrong: [
          'das Bild besteht nur aus einer einzigen Farbe ohne Struktur',
          'Zeilen sind nur der Lautsprecher',
          'Bildzeilen sind die Antenne',
        ],
      },
      {
        q: 'Mehr Bildzeilen bedeuten qualitativ oft …',
        correct: 'feinere Bildauflösung (mehr Detail)',
        wrong: [
          'immer schlechteres Bild',
          'gar kein Einfluss auf die Schärfe',
          'nur lauteren Ton',
        ],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: 'Klassisches Fernsehbild: Aufbau aus Bildzeilen; mehr Zeilen → feinere Auflösung.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const lines = pick(rng, [576, 720, 1080])
    return choicePickTask({
      question: `Ein Bildformat arbeitet mit etwa ${lines} Bildzeilen. Was folgt qualitativ?`,
      choices: shuffleChoices(
        rng,
        [
          'Das Bild wird aus vielen horizontalen Zeilen aufgebaut',
          'Es gibt gar keine Zeilenstruktur',
          'Nur der Ton hat Zeilen',
          'Bildzeilen sind die Lautstärke',
        ],
        'Das Bild wird aus vielen horizontalen Zeilen aufgebaut',
      ),
      correct: 'Das Bild wird aus vielen horizontalen Zeilen aufgebaut',
      solution: 'Das Bild wird aus vielen horizontalen Zeilen aufgebaut',
      explanation: `Mit ca. ${lines} Zeilen wird das Bild zeilenweise aufgebaut — Grundlage der Bildauflösung.`,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    // Simple coordinate click: tippe a point on a "scan line" y = fixed
    const y = pick(rng, [1, 2, 3])
    const x = randInt(rng, 1, 5)
    return coordinateClickTask({
      question: `Eine Bildzeile verläuft horizontal bei y = ${y}. Tippe einen Punkt auf dieser Zeile (z. B. (${x}|${y})).`,
      x,
      y,
      xRange: [0, 6],
      yRange: [0, 5],
      solution: `(${x}|${y})`,
      explanation: `Bildzeilen sind horizontale Linien; hier liegt die Zeile bei y = ${y}.`,
      instruction: 'Tippe einen Punkt auf der Bildzeile:',
    })
  },
)

export const PHYSIK_K10_GENERATORS: Record<string, Topic['generate']> = {
  'ph-k10-lb1-schwingung': schwingung,
  'ph-k10-lb2-kosmos': kosmos,
  'ph-k10-lb3-licht': licht,
  'ph-k10-lb4-hertz': hertz,
  'ph-k10-lb5-praktikum': praktikum,
  'ph-k10-lbw-fernrohr': fernrohr,
  'ph-k10-lbw-medien': medien,
  'ph-k10-lbw-fernsehen': fernsehen,
}
