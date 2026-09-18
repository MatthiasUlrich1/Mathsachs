import { pick, randInt, type Rng } from '../lib/rng'
import {
  choicePickTask,
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

/** LB1 — Schwingungen: T = 2π√(l/g), T = 1/f, LC qualitativ */
const schwingung: Topic['generate'] = mixedVariants(
  (rng) => {
    const exact = pick(rng, [
      {
        q: 'Eine Schwingung hat die Periodendauer T = 1 s. Berechne die Frequenz.',
        ans: 1,
        unit: 'Hz',
        explanation: 'f = 1/T = 1/1 = 1 Hz.',
      },
      {
        q: 'Eine Schwingung hat die Frequenz f = 1 Hz. Berechne die Periodendauer.',
        ans: 1,
        unit: 's',
        explanation: 'T = 1/f = 1/1 = 1 s.',
      },
      {
        q: 'Periodendauer T = 1 s. Wie viele Schwingungen erfolgen in t = 5 s? (N = t/T)',
        ans: 5,
        unit: '',
        explanation: 'N = t/T = 5/1 = 5.',
      },
      {
        q: 'Frequenz f = 5 Hz. Wie viele Schwingungen erfolgen in t = 4 s?',
        ans: 20,
        unit: '',
        explanation: 'N = f·t = 5·4 = 20.',
      },
      {
        q: 'Frequenz f = 2 Hz. Berechne die Anzahl der Schwingungen in t = 10 s.',
        ans: 20,
        unit: '',
        explanation: 'N = f·t = 2·10 = 20.',
      },
    ])
    return valueTask({
      question: exact.q,
      answerKind: 'integer',
      unit: exact.unit || undefined,
      value: exact.ans,
      solution: exact.unit ? `${exact.ans} ${exact.unit}` : String(exact.ans),
      explanation: exact.explanation,
    })
  },
  (rng) => {
    const correct = 'T hängt von der Pendellänge ab (näherungsweise T = 2π√(l/g)), nicht von der Masse'
    return choicePickTask({
      question: 'Was gilt näherungsweise für das mathematische Pendel (kleine Winkel)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'T ist unabhängig von der Länge',
          'T verdoppelt sich, wenn man die Masse verdoppelt',
          'g hat keinen Einfluss auf T',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Für kleine Auslenkungen: T = 2π√(l/g). Die Masse kommt in der Formel nicht vor.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Energie pendelt zwischen elektrischem und magnetischem Feld'
    return choicePickTask({
      question: 'Was beschreibt einen LC-Schwingkreis qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'nur Gleichstrom ohne jede Änderung',
          'Schwingungen nur bei fehlender Kapazität',
          'Frequenz unabhängig von L und C',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Im LC-Kreis oszilliert Energie zwischen Kondensator (E-Feld) und Spule (B-Feld); die Eigenfrequenz hängt von L und C ab.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB2 — Wellen: c = λ·f, Interferenz */
const wellen: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      { lambda: 2, f: 5, c: 10 },
      { lambda: 4, f: 3, c: 12 },
      { lambda: 5, f: 4, c: 20 },
      { lambda: 3, f: 6, c: 18 },
      { lambda: 10, f: 2, c: 20 },
      { lambda: 8, f: 5, c: 40 },
    ] as const
    const c = pick(rng, [...cases])
    return valueTask({
      question: `Welle mit Wellenlänge λ = ${c.lambda} m und Frequenz f = ${c.f} Hz. Berechne die Ausbreitungsgeschwindigkeit.`,
      answerKind: 'integer',
      unit: 'm/s',
      value: c.c,
      solution: `${c.c} m/s`,
      explanation: `c = λ · f = ${c.lambda} · ${c.f} = ${c.c} m/s.`,
    })
  },
  (rng) => {
    const c = pick(rng, [10, 20, 30, 40])
    const f = pick(rng, [2, 4, 5, 10])
    if (c % f !== 0) {
      const ff = pick(rng, [2, 4, 5])
      const cc = ff * pick(rng, [2, 3, 4, 5])
      return valueTask({
        question: `c = ${cc} m/s, f = ${ff} Hz. Berechne die Wellenlänge.`,
        answerKind: 'integer',
        unit: 'm',
        value: cc / ff,
        solution: `${cc / ff} m`,
        explanation: `λ = c / f = ${cc} / ${ff} = ${cc / ff} m.`,
      })
    }
    return valueTask({
      question: `Ausbreitungsgeschwindigkeit c = ${c} m/s, Frequenz f = ${f} Hz. Berechne die Wellenlänge.`,
      answerKind: 'integer',
      unit: 'm',
      value: c / f,
      solution: `${c / f} m`,
      explanation: `λ = c / f = ${c} / ${f} = ${c / f} m.`,
    })
  },
  (rng) => {
    const correct = 'konstruktive Interferenz: Verstärkung; destruktive: Abschwächung/Auslöschung'
    return choicePickTask({
      question: 'Was bedeutet Interferenz zweier kohärenter Wellen qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Wellen können sich nie überlagern',
          'nur Frequenzen ändern sich, Amplituden nie',
          'Interferenz gibt es nur im Vakuum ohne Medium',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Überlagerung führt je nach Gangunterschied zu Verstärkung (konstruktiv) oder Abschwächung (destruktiv).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB4 — Quantenphysik: E = h·f, Unschärfe qualitativ */
const quanten: Topic['generate'] = mixedVariants(
  (rng) => {
    // Use h = 4 (Platzhalter-Einheiten) oder ganzzahlige Vielfache: E = h·f mit h=6 und f ganz
    // Schulnah: qualitative Beziehung + einfache Proportionalität E ∝ f
    const f1 = pick(rng, [2, 3, 4, 5])
    const E1 = pick(rng, [2, 3, 4, 6])
    const f2 = 2 * f1
    const E2 = 2 * E1
    return valueTask({
      question: `Photon: E = h·f. Für f₁ = ${f1}·10¹⁴ Hz sei E₁ = ${E1}·10⁻¹⁹ J. Wie groß ist E₂ (in 10⁻¹⁹ J) bei verdoppelter Frequenz f₂ = ${f2}·10¹⁴ Hz?`,
      answerKind: 'integer',
      unit: '·10⁻¹⁹ J',
      value: E2,
      solution: `${E2}·10⁻¹⁹ J`,
      explanation: `E ∝ f: doppelte Frequenz → doppelte Energie E₂ = ${E2}·10⁻¹⁹ J.`,
    })
  },
  (rng) => {
    const correct = 'höhere Frequenz → höhere Photonenenergie'
    return choicePickTask({
      question: 'Was folgt aus E = h·f für Photonen?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Energie ist unabhängig von der Frequenz',
          'nur die Amplitude bestimmt E, nie f',
          'größere Wellenlänge bedeutet immer größere E',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'E = h·f: je höher die Frequenz, desto energiereicher das Photon (h Planck-Konstante).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Ort und Impuls eines Teilchens sind nicht gleichzeitig beliebig genau bestimmbar'
    return choicePickTask({
      question: 'Was besagt die Heisenberg-Unschärferelation qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Messgeräte sind immer ungenau und Physik versagt',
          'Energie ist immer unendlich',
          'Teilchen haben keinen Impuls',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Δx·Δp ≥ h̅/2: je genauer der Ort, desto unschärfer der Impuls (und umgekehrt) — eine fundamentale Grenze.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB5 — Atomphysik: Bohr, Spektrallinien */
const atom: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'Elektronen nur auf diskreten Bahnen / Energieniveaus; Übergänge mit ΔE = h·f'
    return choicePickTask({
      question: 'Welche Idee gehört zu den Bohrschen Postulaten (qualitativ)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Elektronen strahlen auf jeder Bahn ständig kontinuierlich Energie ab',
          'Atome haben keine Energieniveaus',
          'Licht entsteht nur ohne Elektronenübergänge',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Bohr: stationäre Zustände ohne Strahlung; Lichtemission/-absorption bei Übergängen mit E = h·f.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Übergänge zwischen Energieniveaus erzeugen diskrete Linien'
    return choicePickTask({
      question: 'Wie entstehen Spektrallinien qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'durch kontinuierliche Geschwindigkeitsänderung ohne Energieniveaus',
          'nur durch Erwärmen der Messgeräte',
          'Spektren sind immer vollkommen strukturlos',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Diskrete Niveaus ⇒ diskrete Photonenenergien ⇒ Linien im Spektrum (Emission/Absorption).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'die Energiedifferenz der beteiligten Niveaus'
    return choicePickTask({
      question: 'Wovon hängt die Frequenz einer Spektrallinie ab (Bohr/ Quantenbild)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'nur von der Atommasse, nie von Niveaus',
          'nur vom Luftdruck im Klassenzimmer',
          'von der Farbe der Laborwände',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'ΔE = E_oben − E_unten = h·f bestimmt die Frequenz der Linie.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB6 — Kerne: Bindungsenergie, Zerfall, Halbwertszeit */
const kerne: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'Energie, die freigesetzt würde, wenn man den Kern aus Nukleonen aufbaut (Maß für Stabilität)'
    return choicePickTask({
      question: 'Was bedeutet Bindungsenergie eines Atomkerns qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'die kinetische Energie eines freien Elektrons in Metallen',
          'die Wärme nur durch Reibung',
          'eine rein chemische Bindung zwischen Molekülen',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Bindungsenergie hängt mit dem Massendefekt zusammen und ist ein Maß für die Stabilität des Kerns.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const kinds = [
      {
        name: 'α-Zerfall',
        correct: 'Aussendung eines Heliumkerns (⁴He / α-Teilchen)',
        wrong: [
          'Aussendung eines Elektrons aus dem Kern',
          'Aussendung energiereicher Photonstrahlung ohne Teilchen',
          'Umwandlung in ein Molekül ohne Kernänderung',
        ],
      },
      {
        name: 'β⁻-Zerfall',
        correct: 'Umwandlung n → p unter Aussendung eines Elektrons (und Antineutrino)',
        wrong: [
          'Aussendung eines Heliumkerns',
          'nur Photonemission ohne Teilchenänderung',
          'Kern bleibt in Protonen- und Neutronenzahl unverändert',
        ],
      },
      {
        name: 'γ-Zerfall',
        correct: 'Aussendung energiereicher elektromagnetischer Strahlung (Photon)',
        wrong: [
          'Aussendung eines α-Teilchens',
          'Aussendung eines Elektrons als β⁻',
          'kein Energieverlust des Kerns möglich',
        ],
      },
    ] as const
    const k = pick(rng, [...kinds])
    return choicePickTask({
      question: `Was kennzeichnet den ${k.name} qualitativ?`,
      choices: shuffleChoices(rng, [k.correct, ...k.wrong], k.correct),
      correct: k.correct,
      solution: k.correct,
      explanation: `${k.name}: ${k.correct}.`,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const N0 = pick(rng, [80, 100, 160, 200])
    const steps = pick(rng, [1, 2, 3])
    const N = N0 / 2 ** steps
    if (N % 1 !== 0) {
      const n0 = pick(rng, [64, 128, 256])
      const s = pick(rng, [1, 2, 3])
      return valueTask({
        question: `Halbwertszeit T½: Startaktivität bzw. Kernzahl N₀ = ${n0}. Nach ${s} Halbwertszeiten: Berechne die verbleibende Menge N.`,
        answerKind: 'integer',
        value: n0 / 2 ** s,
        solution: String(n0 / 2 ** s),
        explanation: `Nach ${s} Halbwertszeiten: N = ${n0} / ${2 ** s} = ${n0 / 2 ** s}.`,
      })
    }
    return valueTask({
      question: `Radioaktiver Zerfall: N₀ = ${N0}. Nach ${steps} Halbwertszeiten: Berechne die verbleibende Menge N.`,
      answerKind: 'integer',
      value: N,
      solution: String(N),
      explanation: `N = ${N0} / ${2 ** steps} = ${N}.`,
    })
  },
)

/** LB7 — Thermodynamik: pV = nRT, Hauptsätze */
const thermo: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'bei konstantem n und T: p·V ≈ konstant (p und V umgekehrt proportional)'
    return choicePickTask({
      question: 'Was folgt qualitativ aus der idealen Gasgleichung pV = nRT?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Druck ist unabhängig vom Volumen',
          'Temperatur hat keinen Einfluss auf pV',
          'n kann beliebig negativ werden',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Bei festem n und T: pV = konst. — isotherm: Druck und Volumen verhalten sich umgekehrt proportional.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Energieerhaltung: ΔU = Q + W (Formulierung je nach Vorzeichenkonvention)'
    return choicePickTask({
      question: 'Was beschreibt der 1. Hauptsatz der Thermodynamik qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Wärme fließt von selbst immer von kalt nach warm',
          'Entropie eines abgeschlossenen Systems nimmt nie zu',
          'ideale Gase haben keine Energie',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        '1. HS: Energieerhaltung — Änderung der inneren Energie durch Wärme und Arbeit.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Wärme fließt von selbst nicht von kalt nach warm; Entropie abgeschlossener Systeme nimmt nicht ab'
    return choicePickTask({
      question: 'Was trifft den 2. Hauptsatz qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Energie kann beliebig aus dem Nichts entstehen',
          'alle Prozesse sind vollständig umkehrbar ohne Verluste',
          'Temperatur hat keine Richtung beim Wärmefluss',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        '2. HS: natürliche Richtung von Prozessen / Entropiezunahme; spontaner Wärmefluss von warm nach kalt.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahlbereich — Deterministisches Chaos */
const chaos: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'winzige Änderungen der Anfangswerte können zu stark abweichenden Verläufen führen'
    return choicePickTask({
      question: 'Was meint empfindliche Abhängigkeit von den Anfangsbedingungen (Chaos)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Systeme reagieren nie auf Anfangswerte',
          'Vorhersagen sind immer exakt für alle Zeiten',
          'Chaos bedeutet reine Zufallszahlen ohne Gesetz',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Deterministisch chaotische Systeme folgen Gesetzen, sind aber langfristig praktisch unvorhersagbar wegen sensibler Anfangswerte.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'deterministisch, aber langfristig praktisch unvorhersagbar'
    return choicePickTask({
      question: 'Wie ist deterministisches Chaos am besten zu verstehen?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'rein zufällig ohne jede Gleichung',
          'immer periodisch und einfach',
          'nur in der Quantenmechanik möglich',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Die Dynamik ist durch Gleichungen bestimmt; Chaos entsteht durch starke Sensitivität, nicht durch „reinen Zufall“.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Wetter: kleine Messunsicherheiten wachsen stark an'
    return choicePickTask({
      question: 'Welches Beispiel passt qualitativ zu chaotischem Verhalten?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'gleichförmige Bewegung ohne Störung auf idealer Bahn für immer exakt',
          'einfacher Taschenrechner ohne Iteration',
          'ruhender Stein ohne äußere Kräfte und ohne Dynamik',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Atmosphärische Dynamik ist ein klassisches Beispiel: kleine Unsicherheiten wachsen und begrenzen die Vorhersage.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahlbereich — Kinetische Gastheorie */
const gas: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'mit steigender Temperatur nimmt die mittlere Molekülgeschwindigkeit zu'
    return choicePickTask({
      question: 'Was gilt qualitativ für die mittlere Geschwindigkeit der Gasmoleküle?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Temperatur beeinflusst die Molekülbewegung nicht',
          'bei höherer T stehen alle Moleküle still',
          'nur die Farbe des Gefäßes bestimmt die Geschwindigkeit',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Thermische Energie wächst mit T; typische Molekülgeschwindigkeiten steigen (z. B. ~√T beim idealen Gas).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'viele Stöße der Moleküle auf die Gefäßwände (Impulsübertragung)'
    return choicePickTask({
      question: 'Wie erklärt die kinetische Gastheorie den Gasdruck qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'durch ruhende Moleküle ohne Bewegung',
          'nur durch Anziehung der Wände ohne Stöße',
          'Druck entsteht ohne Teilchen',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Druck = Impulsübertragung bei Stößen der Moleküle auf die Wand — häufiger/härter bei höherer Dichte/T.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'idealisierte Teilchen, elastische Stöße, vernachlässigbares Eigenvolumen (ideales Gas)'
    return choicePickTask({
      question: 'Welche Modellannahmen gehören typisch zur kinetischen Gastheorie (ideales Gas)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Moleküle haben riesiges Volumen und haften dauerhaft an Wänden',
          'keine Bewegung der Teilchen',
          'Stöße sind immer unelastisch mit Totalverlust',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Ideales Gas: punktförmig/klein, elastische Stöße, keine dauerhaften Anziehungen — Grundlage für pV = nRT.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahlbereich — Anwendungen der Physik */
const anwendungen: Topic['generate'] = mixedVariants(
  (_rng) =>
    multiSelectTask({
      question: 'Welche Beispiele sind typische Technik-Anwendungen der Physik? (mehrere möglich)',
      choices: [
        'Elektromagnetische Induktion im Generator',
        'Halbleiterdiode in der Gleichrichterschaltung',
        'Laser auf Basis angeregter Quantensysteme',
        'Perpetuum mobile erster Art als Alltagsgerät',
        'Kräfte ohne Wechselwirkungspartner nach Newton 3',
      ],
      correct: [
        'Elektromagnetische Induktion im Generator',
        'Halbleiterdiode in der Gleichrichterschaltung',
        'Laser auf Basis angeregter Quantensysteme',
      ],
      solution:
        'Generator (Induktion), Diode (Halbleiter), Laser (Quanten) — nicht Perpetuum mobile oder Newton-3-Verstoß.',
      explanation:
        'Physikalische Prinzipien stecken in Generatoren, Halbleiterelektronik und Lasern. Energieerhaltung und Newton 3 bleiben gültig.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  (rng) => {
    const cases = [
      {
        q: 'Welches Prinzip steckt hinter einem Transformator / Generator qualitativ?',
        correct: 'elektromagnetische Induktion',
        wrong: ['reine Gravitation ohne Felder', 'nur chemische Verbrennung', 'Zeitdilatation im Alltag'],
      },
      {
        q: 'Wofür nutzt man Halbleiterdioden technisch typischerweise?',
        correct: 'Gleichrichtung / Stromrichtung steuern',
        wrong: ['Lichtgeschwindigkeit messen', 'Kernspaltung starten', 'Pendellänge verdoppeln'],
      },
      {
        q: 'Was nutzt ein Laser physikalisch aus?',
        correct: 'angeregte Zustände und stimulierte Emission',
        wrong: ['nur klassische Reibung', 'α-Zerfall im Gehäuse', 'ideales Gas ohne Photonen'],
      },
    ] as const
    const c = pick(rng, [...cases])
    return choicePickTask({
      question: c.q,
      choices: shuffleChoices(rng, [c.correct, ...c.wrong], c.correct),
      correct: c.correct,
      solution: c.correct,
      explanation: `${c.correct} — typische Physik-Anwendung in der Technik.`,
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'physikalische Modelle und Messungen leiten Konstruktion und Sicherheit'
    return choicePickTask({
      question: 'Warum sind physikalische Modelle in der Technik wichtig?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Technik braucht keine Naturgesetze',
          'Messungen sind in der Technik überflüssig',
          'Nur Zufall entscheidet über Dimensionierung',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Berechnung, Simulation und Messung sichern Funktion und Sicherheit technischer Systeme.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

export const PHYSIK_J12LK_GENERATORS: Record<string, Topic['generate']> = {
  'ph-j12lk-lb1-schwingung': schwingung,
  'ph-j12lk-lb2-wellen': wellen,
  'ph-j12lk-lb4-quanten': quanten,
  'ph-j12lk-lb5-atom': atom,
  'ph-j12lk-lb6-kerne': kerne,
  'ph-j12lk-lb7-thermo': thermo,
  'ph-j12lk-lbw-chaos': chaos,
  'ph-j12lk-lbw-gas': gas,
  'ph-j12lk-lbw-anwendungen': anwendungen,
}
