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

/** LB1 — Erhaltungssätze: Impuls p = m·v, Energieerhaltung */
const erhaltung: Topic['generate'] = mixedVariants(
  (rng) => {
    const m = pick(rng, [2, 3, 4, 5, 6, 8])
    const v = pick(rng, [2, 3, 4, 5, 6, 10])
    const p = m * v
    return valueTask({
      question: `Ein Körper der Masse m = ${m} kg bewegt sich mit v = ${v} m/s. Berechne den Impulsbetrag p = m · v.`,
      answerKind: 'integer',
      unit: 'kg·m/s',
      value: p,
      solution: `${p} kg·m/s`,
      explanation: `p = m · v = ${m} · ${v} = ${p} kg·m/s.`,
    })
  },
  (rng) => {
    const m1 = pick(rng, [2, 3, 4])
    const v1 = pick(rng, [4, 6, 8, 10])
    const m2 = pick(rng, [2, 4, 5])
    const pGes = m1 * v1
    const v2 = pGes / m2
    if (v2 % 1 !== 0) {
      // Fallback: elastischer 1-D-Stoß mit ruhendem Ziel ist hier nicht nötig —
      // Impulserhaltung bei vollkommen unelastischem Stoß: m1·v1 = (m1+m2)·v
      const mA = pick(rng, [2, 3, 4])
      const vA = pick(rng, [4, 6, 8])
      const mB = pick(rng, [2, 4])
      const v = (mA * vA) / (mA + mB)
      if (v % 1 !== 0) {
        const m = pick(rng, [2, 4, 5])
        const p = pick(rng, [10, 12, 20, 24])
        const vv = p / m
        return valueTask({
          question: `Impuls p = ${p} kg·m/s, Masse m = ${m} kg. Berechne v = p / m.`,
          answerKind: 'integer',
          unit: 'm/s',
          value: vv,
          solution: `${vv} m/s`,
          explanation: `v = p / m = ${p} / ${m} = ${vv} m/s.`,
        })
      }
      return valueTask({
        question: `Körper A (m₁ = ${mA} kg, v₁ = ${vA} m/s) stößt unelastisch auf ruhendes B (m₂ = ${mB} kg). Berechne die gemeinsame Geschwindigkeit v nach dem Stoß (Impulserhaltung).`,
        answerKind: 'integer',
        unit: 'm/s',
        value: v,
        solution: `${v} m/s`,
        explanation: `m₁·v₁ = (m₁+m₂)·v ⇒ v = ${mA * vA} / ${mA + mB} = ${v} m/s.`,
      })
    }
    return valueTask({
      question: `Zwei Körper tauschen Impuls aus. Körper 1: m₁ = ${m1} kg, v₁ = ${v1} m/s. Nach dem Stoß hat Körper 2 (m₂ = ${m2} kg) den gesamten Impuls übernommen und Körper 1 ruht. Berechne v₂.`,
      answerKind: 'integer',
      unit: 'm/s',
      value: v2,
      solution: `${v2} m/s`,
      explanation: `Impulserhaltung: m₁·v₁ = m₂·v₂ ⇒ v₂ = ${pGes} / ${m2} = ${v2} m/s.`,
    })
  },
  (rng) => {
    const correct = 'mechanische Energie bleibt erhalten (kein Energieverlust)'
    return choicePickTask({
      question: 'Was bedeutet Energieerhaltung in einem abgeschlossenen System ohne Reibung?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'die kinetische Energie ist immer null',
          'Impuls und Energie können beliebig entstehen',
          'nur die potentielle Energie ist konstant',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Ohne Dissipation bleibt die Summe aus kinetischer und potentieller Energie konstant; Energie wird umgewandelt, nicht vernichtet.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB2 — Kinematik: s = v₀t + ½at², v = v₀ + at */
const kinematik: Topic['generate'] = mixedVariants(
  (rng) => {
    const v0 = pick(rng, [0, 2, 4, 5, 10])
    const a = pick(rng, [2, 4, 5, 6])
    const t = pick(rng, [2, 3, 4, 5])
    const v = v0 + a * t
    return valueTask({
      question: `Geradlinige Beschleunigung: v₀ = ${v0} m/s, a = ${a} m/s², t = ${t} s. Berechne v = v₀ + a·t.`,
      answerKind: 'integer',
      unit: 'm/s',
      value: v,
      solution: `${v} m/s`,
      explanation: `v = ${v0} + ${a}·${t} = ${v} m/s.`,
    })
  },
  (rng) => {
    // ½ a t² ganzzahlig: a gerade oder t gerade
    const cases = [
      { v0: 0, a: 2, t: 4, s: 16 },
      { v0: 0, a: 4, t: 3, s: 18 },
      { v0: 5, a: 2, t: 3, s: 24 },
      { v0: 0, a: 6, t: 2, s: 12 },
      { v0: 10, a: 2, t: 4, s: 56 },
      { v0: 4, a: 4, t: 2, s: 16 },
    ] as const
    const c = pick(rng, [...cases])
    return valueTask({
      question: `s = v₀·t + ½·a·t² mit v₀ = ${c.v0} m/s, a = ${c.a} m/s², t = ${c.t} s. Berechne s.`,
      answerKind: 'integer',
      unit: 'm',
      value: c.s,
      solution: `${c.s} m`,
      explanation: `s = ${c.v0}·${c.t} + ½·${c.a}·${c.t}² = ${c.s} m.`,
    })
  },
  (rng) => {
    const v0 = pick(rng, [10, 12, 15, 20])
    const a = pick(rng, [2, 3, 4, 5])
    const t = pick(rng, [2, 3, 4])
    const v = v0 - a * t
    if (v <= 0) {
      const vv = v0 + a * t
      return valueTask({
        question: `v₀ = ${v0} m/s, a = ${a} m/s² (Beschleunigen), t = ${t} s. Berechne v = v₀ + a·t.`,
        answerKind: 'integer',
        unit: 'm/s',
        value: vv,
        solution: `${vv} m/s`,
        explanation: `v = ${v0} + ${a}·${t} = ${vv} m/s.`,
      })
    }
    return valueTask({
      question: `Bremsvorgang: v₀ = ${v0} m/s, Betrag der Bremsverzögerung a = ${a} m/s², t = ${t} s. Berechne die Geschwindigkeit v = v₀ − a·t.`,
      answerKind: 'integer',
      unit: 'm/s',
      value: v,
      solution: `${v} m/s`,
      explanation: `v = ${v0} − ${a}·${t} = ${v} m/s.`,
    })
  },
)

/** LB3 — Newton: F = m·a, Aktion = Reaktion */
const newton: Topic['generate'] = mixedVariants(
  (rng) => {
    const m = pick(rng, [2, 3, 4, 5, 8, 10])
    const a = pick(rng, [2, 3, 4, 5, 6])
    const F = m * a
    return valueTask({
      question: `Newton 2: Masse m = ${m} kg, Beschleunigung a = ${a} m/s². Berechne F = m · a.`,
      answerKind: 'integer',
      unit: 'N',
      value: F,
      solution: `${F} N`,
      explanation: `F = m · a = ${m} · ${a} = ${F} N.`,
    })
  },
  (rng) => {
    const F = pick(rng, [12, 15, 20, 24, 30])
    const m = pick(rng, [2, 3, 4, 5, 6])
    if (F % m !== 0) {
      const mm = pick(rng, [2, 3, 4, 5])
      const FF = mm * pick(rng, [3, 4, 5, 6])
      return valueTask({
        question: `F = ${FF} N wirkt auf m = ${mm} kg. Berechne a = F / m.`,
        answerKind: 'integer',
        unit: 'm/s²',
        value: FF / mm,
        solution: `${FF / mm} m/s²`,
        explanation: `a = F / m = ${FF} / ${mm} = ${FF / mm} m/s².`,
      })
    }
    return valueTask({
      question: `F = ${F} N wirkt auf m = ${m} kg. Berechne a = F / m.`,
      answerKind: 'integer',
      unit: 'm/s²',
      value: F / m,
      solution: `${F / m} m/s²`,
      explanation: `a = F / m = ${F} / ${m} = ${F / m} m/s².`,
    })
  },
  (rng) => {
    const correct = 'gleich groß, entgegengesetzt gerichtet, an verschiedenen Körpern'
    return choicePickTask({
      question: 'Was gilt für Aktions- und Reaktionskraft (Newton 3)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'gleich groß und am selben Körper wirkend',
          'unterschiedlich groß, gleiche Richtung',
          'nur bei ruhenden Körpern vorhanden',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Kräftepaare sind betragsgleich und entgegengesetzt, greifen aber an unterschiedlichen Körpern an.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB4 — Modellbildung und Simulation */
const modell: Topic['generate'] = mixedVariants(
  (_rng) =>
    multiSelectTask({
      question: 'Welche typischen Modellannahmen vereinfachen oft eine Bewegung? (mehrere möglich)',
      choices: [
        'Reibung vernachlässigen',
        'Körper als Punktmasse behandeln',
        'g als konstant annehmen',
        'Luftwiderstand immer mit exakter Turbulenz berechnen',
        'jedes Molekül einzeln simulieren',
      ],
      correct: [
        'Reibung vernachlässigen',
        'Körper als Punktmasse behandeln',
        'g als konstant annehmen',
      ],
      solution:
        'Häufig: Reibung weg, Punktmasse, konstantes g — nicht jede Mikrodetail-Simulation.',
      explanation:
        'Modelle reduzieren Komplexität bewusst. Exakte Turbulenz und Molekülsimulationen sind meist zu aufwendig für Schulmodelle.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
  (rng) => {
    const correct = 'die Realität vereinfacht und prüfbar abbilden'
    return choicePickTask({
      question: 'Wozu dienen physikalische Modelle und Simulationen?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'die Naturgesetze außer Kraft setzen',
          'Messungen überflüssig machen',
          'nur schöne Bilder ohne Bezug zu Größen erzeugen',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Modelle und Simulationen bilden die Realität vereinfacht ab und lassen Vorhersagen mit Messungen vergleichen.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Abweichungen zeigen Grenzen des Modells'
    return choicePickTask({
      question: 'Simulation und Messung stimmen nicht überein. Was ist die sinnvollste Folgerung?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'die Messung ist immer falsch',
          'Modelle dürfen nie angepasst werden',
          'Physikgesetze gelten dann nicht mehr',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Diskrepanzen weisen auf Vernachlässigungen, Messfehler oder ungeeignete Annahmen hin — das Modell wird geprüft und ggf. verbessert.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB5 — Krummlinige Bewegungen: a = v²/r */
const kurven: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      { v: 4, r: 2, a: 8 },
      { v: 6, r: 3, a: 12 },
      { v: 10, r: 5, a: 20 },
      { v: 8, r: 4, a: 16 },
      { v: 5, r: 5, a: 5 },
      { v: 9, r: 3, a: 27 },
    ] as const
    const c = pick(rng, [...cases])
    return valueTask({
      question: `Gleichförmige Kreisbewegung: v = ${c.v} m/s, Bahnradius r = ${c.r} m. Berechne den Betrag der Zentripetalbeschleunigung a = v² / r.`,
      answerKind: 'integer',
      unit: 'm/s²',
      value: c.a,
      solution: `${c.a} m/s²`,
      explanation: `a = v² / r = ${c.v}² / ${c.r} = ${c.a} m/s².`,
    })
  },
  (rng) => {
    const correct = 'zum Kreismittelpunkt (radial einwärts)'
    return choicePickTask({
      question: 'Wohin zeigt die Zentripetalbeschleunigung bei gleichförmiger Kreisbewegung?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'tangential in Bewegungsrichtung',
          'radial auswärts',
          'senkrecht zur Bahnebene nach oben',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Die Geschwindigkeit ändert nur die Richtung; die Beschleunigung zeigt zum Mittelpunkt.',
      instruction: 'Tippe die Richtung:',
    })
  },
  (rng) => {
    const correct = 'a wird viermal so groß'
    return choicePickTask({
      question: 'Bei gleichem Radius verdoppelt sich die Bahngeschwindigkeit. Was passiert mit a = v²/r?',
      choices: shuffleChoices(
        rng,
        [correct, 'a verdoppelt sich', 'a bleibt gleich', 'a wird halb so groß'],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'a ∝ v²: doppeltes v → vierfaches a bei festem r.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB6 — Relativität: c invariant, Zeitdilatation qualitativ */
const relativitaet: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'in allen Inertialsystemen gleich (c ≈ 3·10⁸ m/s)'
    return choicePickTask({
      question: 'Was gilt für die Lichtgeschwindigkeit c im Vakuum laut spezieller Relativitätstheorie?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'c hängt von der Geschwindigkeit der Quelle ab',
          'c ist nur für ruhende Beobachter definiert',
          'c kann beliebig überschritten werden',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'c ist eine universelle Konstante und in allen Inertialsystemen gleich — unabhängig von der Bewegung der Quelle.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'bewegte Uhren gehen aus Sicht des ruhenden Beobachters langsamer'
    return choicePickTask({
      question: 'Was beschreibt die Zeitdilatation qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'bewegte Uhren gehen immer schneller',
          'die Zeit hängt nur von der Masse ab',
          'Licht braucht in bewegten Systemen keine Zeit',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Für einen ruhenden Beobachter vergeht in einem relativ bewegten System weniger Eigenzeit (Zeitdilatation).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'bei Geschwindigkeiten nahe c'
    return choicePickTask({
      question: 'Wann werden relativistische Effekte (z. B. Zeitdilatation) besonders deutlich?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'nur bei ruhenden Körpern',
          'nur bei Schallgeschwindigkeit',
          'nur auf der Erde, nie im All',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Relativistische Korrekturen werden bei v nahe c groß; bei Alltagsgeschwindigkeiten sind sie winzig.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB7 — Elektrisches Feld: E = F/q, Feldlinien */
const efeld: Topic['generate'] = mixedVariants(
  (rng) => {
    const cases = [
      { F: 12, q: 3, E: 4 },
      { F: 20, q: 4, E: 5 },
      { F: 15, q: 5, E: 3 },
      { F: 24, q: 6, E: 4 },
      { F: 10, q: 2, E: 5 },
      { F: 18, q: 3, E: 6 },
    ] as const
    const c = pick(rng, [...cases])
    return valueTask({
      question: `Auf eine Probeladung q = ${c.q} C wirkt die Kraft F = ${c.F} N. Berechne den Betrag der Feldstärke E = F / q.`,
      answerKind: 'integer',
      unit: 'N/C',
      value: c.E,
      solution: `${c.E} N/C`,
      explanation: `E = F / q = ${c.F} / ${c.q} = ${c.E} N/C.`,
    })
  },
  (rng) => {
    const correct = 'von Plus nach Minus (außerhalb positiver Ladungen wegzeigend)'
    return choicePickTask({
      question: 'In welche Richtung verlaufen elektrische Feldlinien (Konvention)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'von Minus nach Plus',
          'immer kreisförmig um jede Ladung',
          'nur parallel zur Erdoberfläche',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Feldlinien beginnen an positiven und enden an negativen Ladungen; die Richtung zeigt die Kraft auf eine positive Probeladung.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const E = pick(rng, [2, 3, 4, 5])
    const q = pick(rng, [2, 3, 4, 5])
    const F = E * q
    return valueTask({
      question: `Homogenes Feld E = ${E} N/C, Ladung q = ${q} C. Berechne F = E · q.`,
      answerKind: 'integer',
      unit: 'N',
      value: F,
      solution: `${F} N`,
      explanation: `F = E · q = ${E} · ${q} = ${F} N.`,
    })
  },
)

/** LB8 — Magnetisches Feld, Rechte-Hand-Regel */
const mfeld: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'Daumen in Stromrichtung, Finger zeigen die Magnetfeldrichtung um den Leiter'
    return choicePickTask({
      question: 'Rechte-Hand-Regel für einen geraden stromdurchflossenen Leiter: Was gilt?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Daumen gegen die Stromrichtung, Finger zeigen immer nach Norden',
          'nur die linke Hand ist erlaubt',
          'Feldlinien entstehen nur ohne Strom',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Rechte Hand: Daumen = technische Stromrichtung, gekrümmte Finger = Richtung der B-Feldlinien um den Leiter.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'geschlossen (keine Anfangs-/Endpunkte wie bei elektrischen Ladungen)'
    return choicePickTask({
      question: 'Wie verlaufen magnetische Feldlinien qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'von Plus nach Minus wie beim E-Feld',
          'nur geradlinig und nie gekrümmt',
          'nur innerhalb von Isolatoren',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Es gibt keine magnetischen Monopole: B-Feldlinien sind geschlossen (z. B. vom Nord- zum Südpol außerhalb des Magneten).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'die Feldlinien treten dort aus dem Magneten aus'
    return choicePickTask({
      question: 'Was kennzeichnet den magnetischen Nordpol eines Stabmagneten (außerhalb)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'dort enden alle Feldlinien',
          'dort gibt es kein Magnetfeld',
          'dort fließt immer Strom',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Außerhalb des Magneten treten Feldlinien am Nordpol aus und am Südpol wieder ein.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB9 — Geladene Teilchen: Lorentzkraft F = q·v·B */
const teilchen: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'senkrecht zu v und senkrecht zu B'
    return choicePickTask({
      question: 'In welche Richtung wirkt die Lorentzkraft auf ein geladenes Teilchen (v ⊥ B)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'immer parallel zu v',
          'immer parallel zu B',
          'entgegen der Erdanziehung',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'F_L steht senkrecht auf Geschwindigkeit und Magnetfeld (Rechte-Hand-Regel für positive Ladungen).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      { q: 2, v: 3, B: 4, F: 24 },
      { q: 1, v: 5, B: 2, F: 10 },
      { q: 3, v: 4, B: 2, F: 24 },
      { q: 2, v: 5, B: 3, F: 30 },
      { q: 4, v: 2, B: 5, F: 40 },
    ] as const
    const c = pick(rng, [...cases])
    return valueTask({
      question: `v ⊥ B: q = ${c.q} C, v = ${c.v} m/s, B = ${c.B} T. Berechne den Betrag F = q · v · B.`,
      answerKind: 'integer',
      unit: 'N',
      value: c.F,
      solution: `${c.F} N`,
      explanation: `F = q·v·B = ${c.q}·${c.v}·${c.B} = ${c.F} N.`,
    })
  },
  (rng) => {
    const correct = 'Kreis- oder Spiralbahn (Betrag von v bleibt, Richtung ändert sich)'
    return choicePickTask({
      question: 'Ein Teilchen fliegt mit v ⊥ B in ein homogenes B-Feld. Welche Bahn erwartet man qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'geradeaus mit zunehmender Geschwindigkeit',
          'sofortiger Stillstand',
          'nur geradlinig parallel zu B',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Die Lorentzkraft ändert die Richtung, nicht den Betrag von v → Kreisbahn (oder Helix bei v-Anteil parallel zu B).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB10 — Induktion: U_ind ~ ΔΦ/Δt */
const induktion: Topic['generate'] = mixedVariants(
  (rng) => {
    const dPhi = pick(rng, [4, 6, 8, 10, 12])
    const dt = pick(rng, [1, 2, 4])
    if (dPhi % dt !== 0) {
      const D = pick(rng, [4, 6, 8, 10])
      const T = pick(rng, [1, 2])
      return valueTask({
        question: `Flussänderung ΔΦ = ${D} Wb in Δt = ${T} s. Berechne |U_ind| ≈ |ΔΦ/Δt| (idealer Fall).`,
        answerKind: 'integer',
        unit: 'V',
        value: D / T,
        solution: `${D / T} V`,
        explanation: `|U_ind| ≈ |ΔΦ/Δt| = ${D}/${T} = ${D / T} V.`,
      })
    }
    return valueTask({
      question: `Magnetischer Fluss ändert sich um ΔΦ = ${dPhi} Wb in Δt = ${dt} s. Berechne |U_ind| ≈ |ΔΦ/Δt|.`,
      answerKind: 'integer',
      unit: 'V',
      value: dPhi / dt,
      solution: `${dPhi / dt} V`,
      explanation: `|U_ind| ≈ |ΔΦ/Δt| = ${dPhi}/${dt} = ${dPhi / dt} V.`,
    })
  },
  (rng) => {
    const correct = 'eine größere induzierte Spannung'
    return choicePickTask({
      question: 'Der magnetische Fluss durch eine Leiterschleife ändert sich schneller (Δt kleiner, ΔΦ gleich). Was folgt qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'keine Induktion mehr',
          'immer kleinere Spannung',
          'nur Wärme ohne Spannung',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'U_ind ∝ ΔΦ/Δt: kleinere Zeitspanne bei gleichem ΔΦ → größere |U_ind|.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Änderung des magnetischen Flusses durch die Fläche'
    return choicePickTask({
      question: 'Was ist die Ursache für elektromagnetische Induktion in einer Leiterschleife?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'ein konstantes B-Feld ohne jede Änderung',
          'nur die Temperatur der Luft',
          'Ruhe aller Ladungen ohne Feld',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Induktion entsteht bei zeitlicher Änderung des magnetischen Flusses Φ (durch Bewegung, Drehung oder wechselndes B).',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** LB11 — Praktikum: Messunsicherheit, Versuchsreihenfolge */
const praktikum: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'Angabe eines Unsicherheitsintervalls / Fehlerbetrachtung'
    return choicePickTask({
      question: 'Was gehört zu einer sauberen Messwertangabe im Praktikum?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'nur der Mittelwert ohne jede Unsicherheit',
          'beliebige Zahlen ohne Einheit',
          'Messwerte erfinden, wenn nichts klappt',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Messwerte haben Unsicherheiten; man gibt Intervall/Fehler an und diskutiert systematische/statistische Einflüsse.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) => {
    const items = [
      { label: 'Versuchsziel und Hypothese klären', value: 1 },
      { label: 'Aufbau und Messgeräte vorbereiten', value: 2 },
      { label: 'Messreihe durchführen und notieren', value: 3 },
      { label: 'Auswerten, Unsicherheit und Fazit', value: 4 },
    ]
    return dragDropSortTask({
      question: 'Ordne die Schritte eines Praktikumsversuchs in sinnvoller Reihenfolge.',
      items,
      correctOrder: [0, 1, 2, 3],
      solution: items.map((i) => i.label).join(' → '),
      explanation:
        'Zuerst Ziel/Hypothese, dann Aufbau, Messung, danach Auswertung mit Unsicherheit und Fazit.',
    })
  },
  (rng) => {
    const correct = 'Wiederholung / Mittelwertbildung verringert statistische Streuung'
    return choicePickTask({
      question: 'Wie geht man sinnvoll mit zufälligen Messschwankungen um?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'nur einmal messen und nie wiederholen',
          'Ausreißer immer ohne Prüfung behalten',
          'Unsicherheit ignorieren',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Mehrfachmessung und Mittelwert (ggf. Standardabweichung) reduzieren den Einfluss zufälliger Fehler.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahlbereich — Physik des Fahrens */
const fahren: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'entgegen der Bewegungsrichtung (haftet / gleitet)'
    return choicePickTask({
      question: 'In welche Richtung wirkt die Reibungskraft beim Abbremsen eines Autos qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'in Fahrtrichtung beschleunigend',
          'senkrecht nach oben ohne Einfluss',
          'nur bei stehenden Rädern null und sonst beliebig',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Beim Bremsen wirkt Reibung der Bewegungsrichtung entgegen und verzögert das Fahrzeug.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'etwa vervierfacht sich der Bremsweg (bei gleicher Verzögerung)'
    return choicePickTask({
      question: 'Verdoppelt sich die Anfangsgeschwindigkeit, was gilt näherungsweise für den Bremsweg (s ∝ v²)?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Bremsweg bleibt gleich',
          'Bremsweg verdoppelt sich',
          'Bremsweg wird halb so groß',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'Aus v² = 2·a·s folgt s ∝ v²: doppeltes v → etwa vierfacher Bremsweg.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const cases = [
      { v: 10, a: 5, s: 10 },
      { v: 20, a: 5, s: 40 },
      { v: 12, a: 4, s: 18 },
      { v: 16, a: 4, s: 32 },
      { v: 10, a: 2, s: 25 },
    ] as const
    const c = pick(rng, [...cases])
    return valueTask({
      question: `Konstante Bremsverzögerung a = ${c.a} m/s², Anfangsgeschwindigkeit v = ${c.v} m/s. Berechne den Bremsweg s = v² / (2·a).`,
      answerKind: 'integer',
      unit: 'm',
      value: c.s,
      solution: `${c.s} m`,
      explanation: `s = v²/(2a) = ${c.v}²/(2·${c.a}) = ${c.s} m.`,
    })
  },
)

/** Wahlbereich — Halbleiter */
const halbleiter: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'Elektronen (negative Ladungsträger) sind Majorität'
    return choicePickTask({
      question: 'Was kennzeichnet n-Halbleiter qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Löcher sind die Majorität',
          'es gibt keine beweglichen Ladungsträger',
          'nur Ionen leiten den Strom',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'n-Leitung: Donatoren liefern überschüssige Elektronen als Majoritätsladungsträger.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Löcher (Defektelektronen) sind Majorität'
    return choicePickTask({
      question: 'Was kennzeichnet p-Halbleiter qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Elektronen sind die Majorität',
          'p steht für „perfekt isolierend“',
          'Strom fließt nur ohne Dotierung',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation: 'p-Leitung: Akzeptoren erzeugen Löcher als Majoritätsladungsträger.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'leitet in Durchlassrichtung deutlich besser als in Sperrrichtung'
    return choicePickTask({
      question: 'Welche Eigenschaft hat eine Diode (pn-Übergang) qualitativ?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'leitet in beiden Richtungen gleich gut',
          'sperrt immer vollständig bei jeder Spannung',
          'erzeugt Magnetfelder ohne Strom',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Die Diode ist ein Gleichrichter: in Durchlassrichtung niederohmig, in Sperrrichtung hochohmig.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
)

/** Wahlbereich — Messen und Modellieren */
const messen: Topic['generate'] = mixedVariants(
  (rng) => {
    const correct = 'Abgleich mit bekanntem Normal / Referenz'
    return choicePickTask({
      question: 'Was bedeutet Kalibrierung eines Messgeräts?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'Gerät einschalten und nie prüfen',
          'Anzeige zufällig verdrehen',
          'nur die Batterie wechseln',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Kalibrierung stellt sicher, dass die Anzeige mit einem bekannten Normal übereinstimmt bzw. korrigiert wird.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (rng) => {
    const correct = 'Messbereich und Genauigkeit zur Aufgabe passend wählen'
    return choicePickTask({
      question: 'Worauf sollte man bei der Wahl eines Messgeräts achten?',
      choices: shuffleChoices(
        rng,
        [
          correct,
          'immer den kleinsten messbaren Wert ignorieren',
          'nur Geräte ohne Einheit verwenden',
          'Kalibrierung ist überflüssig',
        ],
        correct,
      ),
      correct,
      solution: correct,
      explanation:
        'Messbereich, Auflösung und Unsicherheit müssen zur Messgröße und geforderten Genauigkeit passen.',
      instruction: 'Tippe die passende Aussage:',
    })
  },
  (_rng) =>
    multiSelectTask({
      question: 'Welche Aussagen zum Messen stimmen? (mehrere möglich)',
      choices: [
        'Jedes Messergebnis hat eine Unsicherheit',
        'Kalibrierung verbessert die Zuverlässigkeit',
        'Einheiten gehören zur Angabe dazu',
        'Messwerte ohne Unsicherheit sind immer exakt wahr',
        'Modelle ersetzen jede Messung vollständig',
      ],
      correct: [
        'Jedes Messergebnis hat eine Unsicherheit',
        'Kalibrierung verbessert die Zuverlässigkeit',
        'Einheiten gehören zur Angabe dazu',
      ],
      solution:
        'Unsicherheit, Kalibrierung und Einheiten sind zentral; Messungen bleiben nötig und nie „absolut wahr“.',
      explanation:
        'Falsch: Messwerte ohne Unsicherheit als absolut wahr; Modelle ersetzen Messungen nicht vollständig.',
      instruction: 'Tippe alle richtigen Aussagen:',
    }),
)

export const PHYSIK_J11LK_GENERATORS: Record<string, Topic['generate']> = {
  'ph-j11lk-lb1-erhaltung': erhaltung,
  'ph-j11lk-lb2-kinematik': kinematik,
  'ph-j11lk-lb3-newton': newton,
  'ph-j11lk-lb4-modell': modell,
  'ph-j11lk-lb5-kurven': kurven,
  'ph-j11lk-lb6-relativitaet': relativitaet,
  'ph-j11lk-lb7-efeld': efeld,
  'ph-j11lk-lb8-mfeld': mfeld,
  'ph-j11lk-lb9-teilchen': teilchen,
  'ph-j11lk-lb10-induktion': induktion,
  'ph-j11lk-lb11-praktikum': praktikum,
  'ph-j11lk-lbw-fahren': fahren,
  'ph-j11lk-lbw-halbleiter': halbleiter,
  'ph-j11lk-lbw-messen': messen,
}
