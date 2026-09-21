import { pick, randInt, type Rng } from '../lib/rng'
import {
  generateGridRectSvg,
  generateParabolaSvg,
  generateSpinnerSvg,
} from '../lib/geometrySvg'
import { formatDe, roundTo } from '../lib/num'
import { mixedVariants, valueTask, visualTask, choicePickTask } from './taskHelpers'
import { math10GraphicReviews } from './graphicReviewTopics'
import type { Grade, Topic } from './types'

// ---------------------------------------------------------------------------
// Lernbereich 1 — Wachstumsvorgänge und periodische Vorgänge
// ---------------------------------------------------------------------------

const zinsen: Topic = {
  id: 'k10-lb1-zinsen',
  title: 'Jahreszinsen berechnen',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Zinsen', 'Zinsrechnung', 'Kapital', 'Prozent', 'Prozentsatz'],
  fachwissen: {
    text: 'Zinsen sind die Vergütung für das Verleihen von Kapital. Die Jahreszinsen berechnen sich als Z = K · p / 100, wobei K das Kapital und p der Zinssatz in Prozent ist. In der Praxis spielen Zinsen bei Sparguthaben, Krediten und Anleihen eine zentrale Rolle.',
    quelle: 'Wikipedia: Zinsrechnung',
    url: 'https://de.wikipedia.org/wiki/Zinsrechnung',
  },
  generate: (rng: Rng) => {
    const k = randInt(rng, 2, 40) * 100
    const p = pick(rng, [1, 2, 3, 4, 5, 8, 10])
    const value = roundTo((k * p) / 100, 2)
    return valueTask({
      question: `Ein Kapital von ${formatDe(k)} € wird mit ${formatDe(p)} % pro Jahr verzinst. Wie viel Zinsen fallen in einem Jahr an?`,
      unit: '€',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} €`,
      explanation: `Z = K · p : 100 = ${formatDe(k)} € · ${p} : 100 = ${formatDe(value)} €.`,
    })
  },
}

const zinseszins: Topic = {
  id: 'k10-lb1-zinseszins',
  title: 'Zinseszins: Endkapital',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zinseszins', 'Endkapital', 'Zinsrechnung', 'exponentiell', 'Kapital'],
  fachwissen: {
    text: 'Beim Zinseszins werden die Zinsen zum Kapital hinzugefügt und im nächsten Jahr mitverzinst. Das führt zu exponentiellem Wachstum: Kₙ = K₀ · (1 + p/100)ⁿ. Einstein soll den Zinseszins als „achtes Weltwunder" bezeichnet haben – schon kleine Zinssätze führen über lange Zeiträume zu erheblichem Wachstum.',
    quelle: 'Wikipedia: Zinseszins',
    url: 'https://de.wikipedia.org/wiki/Zinseszins',
  },
  generate: (rng: Rng) => {
    const k0 = randInt(rng, 5, 50) * 100
    const p = pick(rng, [2, 3, 4, 5])
    const n = randInt(rng, 2, 4)
    const factor = 1 + p / 100
    const value = roundTo(k0 * factor ** n, 2)
    return valueTask({
      question: `Ein Kapital von ${formatDe(k0)} € wird ${n} Jahre mit ${p} % Zinseszins angelegt. Wie groß ist das Endkapital (auf zwei Nachkommastellen)?`,
      unit: '€',
      answerKind: 'decimal',
      value,
      eps: 0.05,
      solution: `${formatDe(value)} €`,
      explanation: `Kₙ = K₀ · (1 + p/100)ⁿ = ${formatDe(k0)} € · ${formatDe(factor)}^${n} ≈ ${formatDe(value)} €.`,
    })
  },
}

const prozentualeZunahme: Topic = {
  id: 'k10-lb1-prozentuale-zunahme',
  title: 'Prozentuale Zunahme',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['prozentuale Zunahme', 'Wachstum', 'Prozent', 'Erhöhung', 'Zunahme'],
  fachwissen: {
    text: 'Eine prozentuale Zunahme um p% bedeutet: neuer Wert = alter Wert · (1 + p/100). Entsprechend gilt bei einer Abnahme: neuer Wert = alter Wert · (1 − p/100). Wichtig: 20% Rabatt und dann 20% Aufschlag ergibt nicht wieder den Ausgangspreis – Prozentrechnung ist nicht einfach umkehrbar.',
    quelle: 'Wikipedia: Prozentrechnung',
    url: 'https://de.wikipedia.org/wiki/Prozentrechnung',
  },
  generate: (rng: Rng) => {
    const start = randInt(rng, 2, 40) * 50
    const p = pick(rng, [10, 20, 25, 50])
    const value = roundTo(start * (1 + p / 100), 2)
    return valueTask({
      question: `Ein Preis von ${formatDe(start)} € steigt um ${p} %. Wie hoch ist der neue Preis?`,
      unit: '€',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} €`,
      explanation: `Neuer Wert = ${formatDe(start)} € · (1 + ${p}/100) = ${formatDe(start)} € · ${formatDe(1 + p / 100)} = ${formatDe(value)} €.`,
    })
  },
}

const expWachstum: Topic = {
  id: 'k10-lb1-exp-wachstum',
  title: 'Exponentielles Wachstum',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['exponentielles Wachstum', 'Verdopplung', 'Wachstumsfaktor', 'Bakterien'],
  fachwissen: {
    text: 'Exponentielles Wachstum liegt vor, wenn eine Größe in gleichen Zeitabständen mit einem konstanten Faktor q multipliziert wird: f(n) = a · qⁿ. Bei q > 1 wächst sie, bei 0 < q < 1 nimmt sie ab (exponentieller Zerfall). Beispiele: Bakterienwachstum, Radioaktivität, Bevölkerungswachstum, Zinseszins.',
    quelle: 'Wikipedia: Exponentielles Wachstum',
    url: 'https://de.wikipedia.org/wiki/Exponentielles_Wachstum',
  },
  generate: (rng: Rng) => {
    const start = randInt(rng, 2, 20)
    const factor = pick(rng, [2, 3])
    const n = randInt(rng, 2, 5)
    const value = start * factor ** n
    return valueTask({
      question: `Eine Bakterienkultur beginnt mit ${start} Bakterien und ${factor === 2 ? 'verdoppelt' : 'verdreifacht'} sich stündlich. Wie viele Bakterien sind es nach ${n} Stunden?`,
      answerKind: 'integer',
      value,
      solution: `${formatDe(value)}`,
      explanation: `Bestand = ${start} · ${factor}^${n} = ${start} · ${factor ** n} = ${formatDe(value)}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Diskrete Zufallsgrößen
// ---------------------------------------------------------------------------

const erwartungswert: Topic = {
  id: 'k10-lb2-erwartungswert',
  title: 'Erwartungswert eines Glücksrads',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Erwartungswert', 'Zufallsgröße', 'Glücksrad', 'Wahrscheinlichkeit', 'E(X)'],
  fachwissen: {
    text: 'Der Erwartungswert E(X) einer diskreten Zufallsgröße X ist der gewichtete Mittelwert aller möglichen Werte: E(X) = Σ xᵢ · P(X=xᵢ). Er gibt an, welchen Wert man im Durchschnitt bei vielen Wiederholungen des Zufallsexperiments erwartet. Ein faires Spiel hat E(X) = 0.',
    quelle: 'Wikipedia: Erwartungswert',
    url: 'https://de.wikipedia.org/wiki/Erwartungswert',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const n = pick(rng, [4, 5, 8, 10])
      const payoffs: number[] = []
      for (let i = 0; i < n; i++) payoffs.push(randInt(rng, 0, 10))
      let sum = payoffs.reduce((s, x) => s + x, 0)
      const rem = sum % n
      if (rem !== 0) {
        payoffs[n - 1] += n - rem
        sum += n - rem
      }
      const value = sum / n
      return valueTask({
        question: `Ein Glücksrad hat ${n} gleich große Felder mit den Auszahlungen ${payoffs.join(', ')} €. Berechne den Erwartungswert.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Jedes Feld hat die Wahrscheinlichkeit 1/${n}. E(X) = (${payoffs.join(' + ')}) : ${n} = ${sum} : ${n} = ${formatDe(value)} €.`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [4, 5, 6, 8])
      const payoffs: number[] = []
      for (let i = 0; i < n; i++) payoffs.push(randInt(rng, 0, 8))
      let sum = payoffs.reduce((s, x) => s + x, 0)
      const rem = sum % n
      if (rem !== 0) {
        payoffs[n - 1] += n - rem
        sum += n - rem
      }
      const value = sum / n
      return visualTask({
        question: `Das Glücksrad hat ${n} gleich große Felder. Berechne den Erwartungswert der Auszahlung.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `E(X) = (${payoffs.join(' + ')}) : ${n} = ${formatDe(value)} €.`,
        visualContent: generateSpinnerSvg({
          payoffs: payoffs.map((p) => `${p}€`),
        }),
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [4, 5, 6])
      const payoffs: number[] = []
      for (let i = 0; i < n; i++) payoffs.push(randInt(rng, 1, 8))
      const askIdx = randInt(rng, 0, n - 1)
      const letter = String.fromCharCode(65 + askIdx)
      return choicePickTask({
        question: `Tippe den Sektor mit der Auszahlung ${payoffs[askIdx]} €. (Alle Sektoren sind gleich groß.)`,
        choices: Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i)),
        correct: letter,
        solution: `${letter} (${payoffs[askIdx]} €)`,
        explanation: `Sektor ${letter} zeigt ${payoffs[askIdx]} €. E(X) = (${payoffs.join(' + ')}) : ${n}.`,
        visualContent: generateSpinnerSvg({
          payoffs: payoffs.map((p, i) => `${String.fromCharCode(65 + i)}:${p}€`),
          highlightIndex: askIdx,
        }),
        instruction: 'Tippe den gesuchten Sektor:',
      })
    },
  ),
}

const erwartungswertWuerfel: Topic = {
  id: 'k10-lb2-erwartungswert-wuerfel',
  title: 'Erwartungswert beim Würfel',
  hint: 'Multipliziere jede Augenzahl mit 1/6 und addiere.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Erwartungswert', 'Würfel', 'Zufallsgröße', 'Gewinn', 'Wahrscheinlichkeit'],
  fachwissen: {
    text: 'Beim Würfel sind alle sechs Augenzahlen gleichwahrscheinlich (P = 1/6 je). Der Erwartungswert der Augenzahl ist E(X) = (1+2+3+4+5+6)/6 = 3,5. Das Ergebnis 3,5 kann beim einmaligen Würfeln nie auftreten – der Erwartungswert ist ein theoretischer Mittelwert bei sehr vielen Wiederholungen.',
    quelle: 'Wikipedia: Erwartungswert',
    url: 'https://de.wikipedia.org/wiki/Erwartungswert',
  },
  generate: (rng: Rng) => {
    // Payoff = augenzahl · faktor; E = faktor · 3,5 → keep clean by faktor even.
    const faktor = pick(rng, [2, 4, 6])
    const value = roundTo(faktor * 3.5, 2)
    return valueTask({
      question: `Bei einem Würfelspiel erhält man das ${faktor}-fache der gewürfelten Augenzahl (in €) ausgezahlt. Berechne den Erwartungswert des Gewinns.`,
      unit: '€',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} €`,
      explanation: `Der Erwartungswert der Augenzahl ist (1+2+3+4+5+6) : 6 = 3,5. Mit dem Faktor ${faktor}: ${faktor} · 3,5 = ${formatDe(value)} €.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Algebraisches Lösen geometrischer Probleme
// ---------------------------------------------------------------------------

const rechteckBreite: Topic = {
  id: 'k10-lb3-rechteck-breite',
  title: 'Rechteck: Breite aus Fläche',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Rechteck', 'Flächeninhalt', 'algebraisch', 'Gleichung', 'Seite'],
  fachwissen: {
    text: 'Geometrische Probleme lassen sich algebraisch lösen, indem man eine Gleichung aufstellt und nach der gesuchten Größe auflöst. Bei Flächenproblemen wird aus der Flächenformel A = a · b die Breite b = A / a berechnet. Dieses Vorgehen – Formel aufstellen, umformen, Wert einsetzen – ist ein Grundmuster in der angewandten Mathematik.',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 3, 20)
      const b = randInt(rng, 3, 20)
      const area = a * b
      return valueTask({
        question: `Ein Rechteck hat den Flächeninhalt ${area} cm² und die Länge a = ${a} cm. Berechne die Breite b.`,
        unit: 'cm',
        answerKind: 'integer',
        value: b,
        solution: `${b} cm`,
        explanation: `Aus A = a · b folgt b = A : a = ${area} cm² : ${a} cm = ${b} cm.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 8)
      const b = randInt(rng, 2, 6)
      const area = a * b
      return visualTask({
        question: `Das Rechteck im Koordinatensystem hat die Länge a = ${a}. Der Flächeninhalt ist ${area}. Berechne die Breite b.`,
        unit: '',
        answerKind: 'integer',
        value: b,
        solution: `${b}`,
        explanation: `b = A : a = ${area} : ${a} = ${b}.`,
        visualContent: generateGridRectSvg({
          x: 1,
          y: 1,
          width: a,
          height: b,
          widthLabel: `a=${a}`,
          heightLabel: 'b=?',
          xRange: [-1, Math.max(10, a + 2)],
          yRange: [-1, Math.max(8, b + 2)],
          cellSize: 26,
        }),
      })
    },
  ),
}

const quadratSeite: Topic = {
  id: 'k10-lb3-quadrat-seite',
  title: 'Quadrat: Seitenlänge aus Fläche',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Quadrat', 'Flächeninhalt', 'Wurzel', 'Seitenlänge', 'algebraisch'],
  fachwissen: {
    text: 'Die Quadratwurzel √a ist die nicht-negative Zahl, deren Quadrat gleich a ist. Sie ist die Umkehrfunktion des Quadrierens (für nichtnegative Zahlen). In Geometrie: Seitenlänge eines Quadrats mit Fläche A ist a = √A. Die Quadratwurzel ist für negative Zahlen in den reellen Zahlen nicht definiert.',
    quelle: 'Wikipedia: Quadratwurzel',
    url: 'https://de.wikipedia.org/wiki/Quadratwurzel',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 2, 25)
      const area = a * a
      return valueTask({
        question: `Ein Quadrat hat den Flächeninhalt ${area} cm². Berechne seine Seitenlänge.`,
        unit: 'cm',
        answerKind: 'integer',
        value: a,
        solution: `${a} cm`,
        explanation: `Aus A = a² folgt a = √A = √${area} cm² = ${a} cm.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2, 6)
      const area = a * a
      return visualTask({
        question: `Das Quadrat im Koordinatensystem hat den Flächeninhalt ${area}. Berechne die Seitenlänge a.`,
        unit: '',
        answerKind: 'integer',
        value: a,
        solution: `${a}`,
        explanation: `a = √${area} = ${a}.`,
        visualContent: generateGridRectSvg({
          x: 1,
          y: 1,
          width: a,
          height: a,
          widthLabel: 'a=?',
          heightLabel: 'a',
          xRange: [-1, Math.max(8, a + 2)],
          yRange: [-1, Math.max(8, a + 2)],
          cellSize: 28,
        }),
      })
    },
  ),
}

const rechteckBreiteUmfang: Topic = {
  id: 'k10-lb3-rechteck-umfang',
  title: 'Rechteck: Breite aus Umfang',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Rechteck', 'Umfang', 'algebraisch', 'Gleichung', 'Seite'],
  fachwissen: {
    text: 'Aus der Umfangsformel U = 2·(a+b) kann man die Breite b bestimmen, wenn Umfang und Länge bekannt sind: b = U/2 − a. Diese Art von Aufgaben – eine geometrische Größe aus einer Formel berechnen – ist ein grundlegendes algebraisches Denkmuster: Formel umformen, dann Werte einsetzen.',
    quelle: 'Wikipedia: Umfang (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Umfang_(Geometrie)',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 3, 20)
    const b = randInt(rng, 3, 20)
    const u = 2 * (a + b)
    return valueTask({
      question: `Ein Rechteck hat den Umfang ${u} cm und die Länge a = ${a} cm. Berechne die Breite b.`,
      unit: 'cm',
      answerKind: 'integer',
      value: b,
      solution: `${b} cm`,
      explanation: `Aus U = 2 · (a + b) folgt b = U : 2 − a = ${u} : 2 − ${a} = ${u / 2} − ${a} = ${b} cm.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Funktionale Zusammenhänge
// ---------------------------------------------------------------------------

const reinquadratisch: Topic = {
  id: 'k10-lb4-reinquadratisch',
  title: 'Reinquadratische Gleichung x² = a',
  hint: 'Nimm die positive Quadratwurzel.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['quadratische Gleichung', 'Wurzel', 'x²', 'lösen', 'reinquadratisch'],
  fachwissen: {
    text: 'Eine reinquadratische Gleichung hat die Form x² = a. Sie hat für a > 0 zwei Lösungen: x = +√a und x = −√a. Für a = 0 ist x = 0 die einzige Lösung. Für a < 0 gibt es keine reellen Lösungen. In geometrischen Aufgaben ist oft nur die positive Lösung sinnvoll.',
    quelle: 'Wikipedia: Quadratische Gleichung',
    url: 'https://de.wikipedia.org/wiki/Quadratische_Gleichung',
  },
  generate: (rng: Rng) => {
    const x = randInt(rng, 2, 20)
    const a = x * x
    return valueTask({
      question: `Bestimme die positive Lösung der Gleichung x² = ${a}.`,
      answerKind: 'integer',
      value: x,
      solution: `x = ${x}`,
      explanation: `x² = ${a} bedeutet x = √${a} = ${x} (die positive Lösung).`,
    })
  },
}

const quadratischGleichung: Topic = {
  id: 'k10-lb4-quadratische-gleichung',
  title: 'Quadratische Gleichung (größere Lösung)',
  hint: 'Faktorisiere und nutze den Satz vom Nullprodukt.',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['quadratische Gleichung', 'Nullstellen', 'faktorisieren', 'Satz von Vieta', 'lösen'],
  fachwissen: {
    text: 'Eine quadratische Gleichung x² + px + q = 0 hat (nach dem Satz von Vieta) bis zu zwei Lösungen x₁ und x₂ mit x₁ + x₂ = −p und x₁ · x₂ = q. Lösungsformeln: Mitternachtsformel x = (−p ± √(p²−4q)) / 2, oder Faktorisierung (x−x₁)(x−x₂) = 0, oder quadratische Ergänzung.',
    quelle: 'Wikipedia: Quadratische Gleichung',
    url: 'https://de.wikipedia.org/wiki/Quadratische_Gleichung',
  },
  generate: (rng: Rng) => {
    let r1 = randInt(rng, -8, 8)
    let r2 = randInt(rng, -8, 8)
    while (r1 === r2) r2 = randInt(rng, -8, 8)
    if (r1 < r2) [r1, r2] = [r2, r1] // r1 is the larger root
    const p = -(r1 + r2)
    const q = r1 * r2
    const pStr = p < 0 ? `− ${Math.abs(p)}x` : `+ ${p}x`
    const qStr = q < 0 ? `− ${Math.abs(q)}` : `+ ${q}`
    return valueTask({
      question: `Bestimme die größere Lösung der Gleichung x² ${pStr} ${qStr} = 0.`,
      answerKind: 'integer',
      value: r1,
      solution: `x = ${r1}`,
      explanation: `Die Gleichung lässt sich als (x − ${r1})(x − ${r2}) = 0 schreiben. Die Lösungen sind x₁ = ${r1} und x₂ = ${r2}; die größere ist ${r1}.`,
    })
  },
}

const parabelWert: Topic = {
  id: 'k10-lb4-parabel-wert',
  title: 'Funktionswert einer Parabel',
  hint: 'Setze den gegebenen x-Wert in die Funktion ein.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Parabel', 'quadratische Funktion', 'Funktionswert', 'einsetzen'],
  fachwissen: {
    text: 'Die einfachste Parabel ist f(x) = x² (Normalparabel). Durch den Faktor a wird sie gestreckt (|a|>1) oder gestaucht (|a|<1), bei negativem a gespiegelt. Der Parameter c verschiebt die Parabel vertikal. Parabeln beschreiben z. B. den Wurfparabel (ohne Luftwiderstand) und optische Reflektoren.',
    quelle: 'Wikipedia: Parabel (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Parabel_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = pick(rng, [-2, -1, 1, 2, 3])
      const c = randInt(rng, -8, 8)
      const x = randInt(rng, -6, 6)
      const value = a * x * x + c
      const cStr = c < 0 ? `− ${Math.abs(c)}` : `+ ${c}`
      return valueTask({
        question: `Gegeben ist f(x) = ${a}·x² ${cStr}. Berechne f(${x}).`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Setze x = ${x} ein: ${a} · ${x}² ${cStr} = ${a} · ${x * x} ${cStr} = ${a * x * x} ${cStr} = ${value}.`,
      })
    },
    (rng: Rng) => {
      const a = pick(rng, [-2, -1, 1, 2])
      const c = randInt(rng, -3, 3)
      const x = randInt(rng, -3, 3)
      const value = a * x * x + c
      const cStr = c < 0 ? `− ${Math.abs(c)}` : `+ ${c}`
      return visualTask({
        question: `Am Graphen von f(x) = ${a}·x² ${cStr}: Lies bzw. berechne f(${x}).`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `f(${x}) = ${a} · ${x}² ${cStr} = ${value}.`,
        visualContent: generateParabolaSvg({
          a,
          c,
          points: [{ x, y: value, label: `(${x}|?)` }],
          xRange: [-5, 5],
          yRange: [
            Math.min(-6, value - 2, c - 2),
            Math.max(8, value + 2, c + 2),
          ],
        }),
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung: Zinsrechnung
// ---------------------------------------------------------------------------

const kapitalAusZinsen: Topic = {
  id: 'k10-lb5-kapital',
  title: 'Kapital aus Zinsen bestimmen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zinsrechnung', 'Kapital', 'Zinsen', 'Prozentsatz', 'Grundwert'],
  fachwissen: {
    text: 'In der Zinsrechnung gibt es drei Grundgrößen: Kapital K, Zinssatz p (%) und Zinsen Z. Aus Z = K · p / 100 lassen sich die anderen Größen ableiten: K = Z · 100 / p und p = Z · 100 / K. Dieses Dreieck aus Grundwert, Prozentwert und Prozentsatz ist ein fundamentales Muster der Prozentrechnung.',
    quelle: 'Wikipedia: Zinsrechnung',
    url: 'https://de.wikipedia.org/wiki/Zinsrechnung',
  },
  generate: (rng: Rng) => {
    const k = randInt(rng, 2, 40) * 100
    const p = pick(rng, [1, 2, 4, 5, 10])
    const z = (k * p) / 100
    return valueTask({
      question: `Bei einem Zinssatz von ${p} % pro Jahr wurden ${formatDe(z)} € Zinsen gezahlt. Wie groß war das Kapital?`,
      unit: '€',
      answerKind: 'decimal',
      value: k,
      solution: `${formatDe(k)} €`,
      explanation: `Aus Z = K · p : 100 folgt K = Z · 100 : p = ${formatDe(z)} € · 100 : ${p} = ${formatDe(k)} €.`,
    })
  },
}

const zinssatz: Topic = {
  id: 'k10-lb5-zinssatz',
  title: 'Zinssatz bestimmen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zinsrechnung', 'Zinssatz', 'Prozentsatz', 'Zinsen', 'Kapital'],
  fachwissen: {
    text: 'Den Zinssatz ermittelt man aus bekanntem Kapital und bekannten Zinsen: p = Z · 100 / K. Diese Umkehrung der Zinsformel ist im Alltag wichtig, wenn man Konditionen von Geldanlagen oder Krediten vergleichen möchte. Ein höherer Zinssatz bedeutet pro Kapitaleinheit mehr Zinsen.',
    quelle: 'Wikipedia: Zinsrechnung',
    url: 'https://de.wikipedia.org/wiki/Zinsrechnung',
  },
  generate: (rng: Rng) => {
    const k = randInt(rng, 2, 40) * 100
    const p = pick(rng, [1, 2, 3, 4, 5, 8, 10])
    const z = (k * p) / 100
    return valueTask({
      question: `Für ein Kapital von ${formatDe(k)} € wurden ${formatDe(z)} € Zinsen in einem Jahr gezahlt. Wie hoch war der Zinssatz in Prozent?`,
      unit: '%',
      answerKind: 'decimal',
      value: p,
      solution: `${formatDe(p)} %`,
      explanation: `p = Z · 100 : K = ${formatDe(z)} € · 100 : ${formatDe(k)} € = ${formatDe(p)} %.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Grade — Klasse 10 (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse10: Grade = {
  id: 'klasse-10',
  title: 'Klasse 10',
  areas: [
    {
      id: 'lb1',
      title: 'Wachstumsvorgänge und periodische Vorgänge',
      ustd: 22,
      topics: [zinsen, zinseszins, prozentualeZunahme, expWachstum],
    },
    {
      id: 'lb2',
      title: 'Diskrete Zufallsgrößen',
      ustd: 16,
      topics: [erwartungswert, erwartungswertWuerfel],
    },
    {
      id: 'lb3',
      title: 'Algebraisches Lösen geometrischer Probleme',
      ustd: 20,
      topics: [rechteckBreite, quadratSeite, rechteckBreiteUmfang],
    },
    {
      id: 'lb4',
      title: 'Funktionale Zusammenhänge',
      ustd: 42,
      topics: [reinquadratisch, quadratischGleichung, parabelWert, ...math10GraphicReviews],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Zinsrechnung',
      ustd: 4,
      topics: [kapitalAusZinsen, zinssatz],
    },
  ],
}
