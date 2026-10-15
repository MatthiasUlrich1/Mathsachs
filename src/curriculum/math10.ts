import { pick, randInt, type Rng } from '../lib/rng'
import { generateSpinnerSvg } from '../lib/geometrySvg'
import { formatDe, roundTo } from '../lib/num'
import { addNum, parenNum, signedNum } from '../lib/termFormat'
import { mixedVariants, valueTask, visualTask, choicePickTask } from './taskHelpers'
import { math10GraphicReviews } from './graphicReviewTopics'
import {
  k10ExpGleichung,
  k10FolgeExplizit,
  k10Kosinussatz,
  k10Logarithmus,
  k10Sinussatz,
  k10SinusWert,
  k10VarianzZufall,
} from './mathUpperDense'
import type { Grade, Topic } from './types'
import { MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE } from './mathLehrplanTeilaspekte'
import { shuffleArr } from './mathApplied'

// ---------------------------------------------------------------------------
// Lernbereich 1 — Wachstumsvorgänge und periodische Vorgänge
// ---------------------------------------------------------------------------

const zinsen: Topic = {
  id: 'k10-lb1-zinsen',
  title: 'Lineares und exponentielles Wachstum unterscheiden',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['lineares Wachstum', 'exponentielles Wachstum', 'Wachstumsfaktor', 'Tabelle', 'Vergleich'],
  fachwissen: {
    text: 'Bei linearem Wachstum kommt in gleichen Zeitschritten immer derselbe Betrag d dazu: B(n) = B(0) + n · d. Bei exponentiellem Wachstum wird in gleichen Zeitschritten immer mit demselben Faktor q multipliziert: B(n) = B(0) · qⁿ. In einer Tabelle erkennt man lineares Wachstum an gleichen Differenzen, exponentielles an gleichen Quotienten aufeinanderfolgender Werte.',
    quelle: 'Wikipedia: Exponentielles Wachstum',
    url: 'https://de.wikipedia.org/wiki/Exponentielles_Wachstum',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const art = pick(rng, ['linear', 'exponentiell', 'weder noch'] as const)
      const b0 = pick(rng, [40, 80, 100, 160, 200])
      let werte: number[]
      if (art === 'linear') {
        const d = pick(rng, [10, 15, 20, 25, 40])
        werte = [0, 1, 2, 3].map((n) => b0 + n * d)
      } else if (art === 'exponentiell') {
        const q = pick(rng, [1.5, 2, 0.5, 1.25])
        werte = [0, 1, 2, 3].map((n) => roundTo(b0 * q ** n, 2))
      } else {
        werte = [b0, b0 + 20, b0 + 60, b0 + 80]
      }
      return choicePickTask({
        question: `Ein Bestand wird jährlich gemessen: ${werte.map((w, n) => `Jahr ${n}: ${formatDe(w)}`).join('; ')}. Welche Art von Wachstum liegt vor?`,
        choices: ['linear', 'exponentiell', 'weder noch'],
        correct: art,
        solution: art,
        explanation:
          art === 'linear'
            ? `Die Differenzen sind gleich (${werte.slice(1).map((w, i) => formatDe(w - werte[i]!)).join('; ')}), also lineares Wachstum.`
            : art === 'exponentiell'
              ? `Die Quotienten sind gleich (${werte.slice(1).map((w, i) => formatDe(roundTo(w / werte[i]!, 3))).join('; ')}), also exponentielles Wachstum.`
              : `Weder die Differenzen (${werte.slice(1).map((w, i) => formatDe(w - werte[i]!)).join('; ')}) noch die Quotienten sind gleich.`,
        dedupeKey: `ma:k10:wachstum:art:${werte.join(',')}`,
      })
    },
    (rng: Rng) => {
      const exp = rng() < 0.5
      const b0 = pick(rng, [64, 81, 120, 250, 400])
      const [q, qStr] =
        b0 === 81 ? pick(rng, [[2 / 3, '2/3'], [4 / 3, '4/3']] as Array<[number, string]>) : pick(rng, [[0.5, '0,5'], [1.5, '1,5'], [1.25, '1,25']] as Array<[number, string]>)
      const d = pick(rng, [-12, -8, 6, 15, 35])
      const werte = [0, 1, 2, 3, 4].map((n) => (exp ? roundTo(b0 * q ** n, 2) : b0 + n * d))
      const value = werte[4]!
      return valueTask({
        question: `Die Tabelle zeigt einen Bestand: ${werte.slice(0, 4).map((w, n) => `t = ${n}: ${formatDe(w)}`).join('; ')}. Setze das Wachstumsmuster fort. Welcher Wert ergibt sich für t = 4?`,
        answerKind: 'decimal',
        value,
        eps: 0.011,
        solution: formatDe(value),
        explanation: exp
          ? `Gleiche Quotienten: q = ${qStr}. B(4) = ${formatDe(werte[3]!)} · ${qStr} ≈ ${formatDe(value)}.`
          : `Gleiche Differenzen: d = ${signedNum(d)}. B(4) = ${formatDe(werte[3]!)}${addNum(d)} = ${formatDe(value)}.`,
        dedupeKey: `ma:k10:wachstum:fort:${werte.join(',')}`,
      })
    },
    (rng: Rng) => {
      const start = pick(rng, [1000, 2000, 5000])
      const p = pick(rng, [4, 5, 6])
      const d = (start * pick(rng, [6, 8, 10])) / 100
      let lin = start
      let ex = start
      let n = 0
      while (ex <= lin) {
        n++
        lin += d
        ex *= 1 + p / 100
      }
      return valueTask({
        question: `Angebot A: Ein Guthaben von ${formatDe(start)} € wächst jedes Jahr um ${formatDe(d)} €. Angebot B: Dasselbe Guthaben wächst jedes Jahr um ${p} %. Nach wie vielen Jahren ist das Guthaben bei B erstmals größer als bei A?`,
        unit: 'Jahre',
        answerKind: 'integer',
        value: n,
        solution: `nach ${n} Jahren`,
        explanation: `A ist linear: ${formatDe(start)} + n · ${formatDe(d)}. B ist exponentiell: ${formatDe(start)} · ${formatDe(1 + p / 100)}ⁿ. Nach ${n - 1} Jahren: A = ${formatDe(roundTo(start + (n - 1) * d, 2))} €, B ≈ ${formatDe(roundTo(start * (1 + p / 100) ** (n - 1), 2))} €. Nach ${n} Jahren: A = ${formatDe(roundTo(lin, 2))} €, B ≈ ${formatDe(roundTo(ex, 2))} €.`,
        dedupeKey: `ma:k10:wachstum:vergleich:${start}:${p}:${d}`,
      })
    },
  ),
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
  title: 'Exponentielle Abnahme und Halbwertszeit',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['exponentielle Abnahme', 'Zerfall', 'Halbwertszeit', 'Abnahmefaktor', 'Kernzerfall'],
  fachwissen: {
    text: 'Nimmt eine Größe in gleichen Zeitschritten um p % ab, wird sie jeweils mit dem Abnahmefaktor q = 1 − p/100 multipliziert: B(n) = B(0) · qⁿ. Die Halbwertszeit T ist die Zeit, nach der nur noch die Hälfte vorhanden ist; nach k Halbwertszeiten ist noch B(0) · (1/2)ᵏ übrig. Beispiele sind radioaktiver Zerfall, Medikamentenabbau oder der Wertverlust eines Autos.',
    quelle: 'Wikipedia: Halbwertszeit',
    url: 'https://de.wikipedia.org/wiki/Halbwertszeit',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const stoff = pick(rng, [
        { name: 'Iod-131', T: 8, einheit: 'Tage' },
        { name: 'Radon-222', T: 4, einheit: 'Tage' },
        { name: 'ein Medikament im Blut', T: 6, einheit: 'Stunden' },
        { name: 'Technetium-99m', T: 6, einheit: 'Stunden' },
      ])
      const m0 = pick(rng, [80, 160, 240, 320, 640])
      const k = randInt(rng, 2, 5)
      const value = roundTo(m0 / 2 ** k, 2)
      return valueTask({
        question: `${stoff.name[0]!.toUpperCase()}${stoff.name.slice(1)} hat eine Halbwertszeit von ${stoff.T} ${stoff.einheit}. Anfangs sind ${m0} mg vorhanden. Wie viel ist nach ${k * stoff.T} ${stoff.einheit} noch übrig?`,
        unit: 'mg',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} mg`,
        explanation: `${k * stoff.T} ${stoff.einheit} sind ${k} Halbwertszeiten: ${m0} mg · (1/2)^${k} = ${m0} : ${2 ** k} = ${formatDe(value)} mg.`,
        dedupeKey: `ma:k10:zerfall:hwz:${stoff.name}:${m0}:${k}`,
      })
    },
    (rng: Rng) => {
      const preis = pick(rng, [18000, 24000, 30000, 36000])
      const p = pick(rng, [10, 12, 15, 20])
      const n = randInt(rng, 2, 5)
      const value = roundTo(preis * (1 - p / 100) ** n, 2)
      return valueTask({
        question: `Ein Auto kostet neu ${formatDe(preis)} € und verliert jedes Jahr ${p} % seines Wertes. Wie viel ist es nach ${n} Jahren noch wert? Runde auf Euro.`,
        unit: '€',
        answerKind: 'decimal',
        value: Math.round(value),
        eps: 1.01,
        solution: `${formatDe(Math.round(value))} €`,
        explanation: `Abnahmefaktor q = 1 − ${p}/100 = ${formatDe(1 - p / 100)}. Wert: ${formatDe(preis)} € · ${formatDe(1 - p / 100)}^${n} ≈ ${formatDe(Math.round(value))} €.`,
        dedupeKey: `ma:k10:zerfall:auto:${preis}:${p}:${n}`,
      })
    },
    (rng: Rng) => {
      const p = pick(rng, [8, 10, 12, 15, 20, 25, 30])
      const q = 1 - p / 100
      let n = 0
      let rest = 1
      while (rest >= 0.5) {
        n++
        rest *= q
      }
      return valueTask({
        question: `Ein Bestand nimmt jedes Jahr um ${p} % ab. Nach wie vielen ganzen Jahren ist erstmals weniger als die Hälfte des Anfangsbestands übrig?`,
        unit: 'Jahre',
        answerKind: 'integer',
        value: n,
        solution: `nach ${n} Jahren`,
        explanation: `Abnahmefaktor ${formatDe(q)}. ${formatDe(q)}^${n - 1} ≈ ${formatDe(roundTo(q ** (n - 1), 3))} ≥ 0,5, aber ${formatDe(q)}^${n} ≈ ${formatDe(roundTo(q ** n, 3))} < 0,5.`,
        dedupeKey: `ma:k10:zerfall:haelfte:${p}`,
      })
    },
  ),
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
      const m = randInt(rng, 3, 6)
      const n = pick(rng, [4, 5])
      let d1 = randInt(rng, 1, 3)
      let d2 = randInt(rng, 1, 3)
      while (d2 === d1) d2 = randInt(rng, 1, 3)
      if (d1 > d2) [d1, d2] = [d2, d1]
      const devs = n === 4 ? [d1 + d2, -d1, -d2] : [d1, -d1, d2, -d2]
      const payoffs = shuffleArr(rng, [m, ...devs.map((d) => m + d)])
      const askIdx = payoffs.indexOf(m)
      const letter = String.fromCharCode(65 + askIdx)
      return choicePickTask({
        question: `Alle ${n} Sektoren des Glücksrads sind gleich groß. Bei welchem Sektor ist die Auszahlung genau so groß wie der Erwartungswert der Auszahlung?`,
        choices: Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i)),
        correct: letter,
        solution: `${letter} (${m} €)`,
        explanation: `E(X) = (${payoffs.join(' + ')}) : ${n} = ${m * n} : ${n} = ${m} €. Nur Sektor ${letter} zahlt genau ${m} € aus.`,
        visualContent: generateSpinnerSvg({
          payoffs: payoffs.map((p, i) => `${String.fromCharCode(65 + i)}:${p}€`),
        }),
        instruction: 'Tippe den gesuchten Sektor:',
        dedupeKey: `ma:k10:ew:sektor:${payoffs.join('-')}`,
      })
    },
  ),
}

const erwartungswertWuerfel: Topic = {
  id: 'k10-lb2-erwartungswert-wuerfel',
  title: 'Erwartungswert beim Würfel',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Erwartungswert', 'Würfel', 'Zufallsgröße', 'Gewinn', 'Wahrscheinlichkeit'],
  fachwissen: {
    text: 'Beim Würfel sind alle sechs Augenzahlen gleichwahrscheinlich (P = 1/6 je). Der Erwartungswert der Augenzahl ist E(X) = (1+2+3+4+5+6)/6 = 3,5. Das Ergebnis 3,5 kann beim einmaligen Würfeln nie auftreten – der Erwartungswert ist ein theoretischer Mittelwert bei sehr vielen Wiederholungen.',
    quelle: 'Wikipedia: Erwartungswert',
    url: 'https://de.wikipedia.org/wiki/Erwartungswert',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      // Auszahlung für bestimmte Augenzahlen, Einsatz abziehen
      const win = shuffleArr(rng, [1, 2, 3, 4, 5, 6]).slice(0, randInt(rng, 1, 3)).sort((a, b) => a - b)
      const pay = pick(rng, [2, 3, 4, 5, 6, 10])
      const stake = pick(rng, [1, 2])
      const value = roundTo((win.length * pay) / 6 - stake, 2)
      return valueTask({
        question: `Ein Spiel kostet ${stake} € Einsatz. Bei der Augenzahl ${win.join(' oder ')} werden ${pay} € ausgezahlt, sonst nichts. Berechne den Erwartungswert des Reingewinns pro Spiel. Runde auf Cent.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        eps: 0.006,
        solution: `${formatDe(value)} €`,
        explanation: `P(Auszahlung) = ${win.length}/6. E = ${win.length}/6 · ${pay} € − ${stake} € ≈ ${formatDe(value)} €${value < 0 ? ' — auf Dauer verliert man' : value > 0 ? ' — auf Dauer gewinnt man' : ' — das Spiel ist fair'}.`,
        dedupeKey: `ma:k10:ew:wuerfel:einsatz:${win.join('')}:${pay}:${stake}`,
      })
    },
    (rng: Rng) => {
      const win = shuffleArr(rng, [1, 2, 3, 4, 5, 6]).slice(0, randInt(rng, 1, 3)).sort((a, b) => a - b)
      const stake = pick(rng, [1, 2, 3])
      const fair = (6 * stake) / win.length
      return valueTask({
        question: `Bei einem Würfelspiel mit ${stake} € Einsatz gewinnt man bei der Augenzahl ${win.join(' oder ')}. Wie hoch muss die Auszahlung sein, damit das Spiel fair ist?`,
        unit: '€',
        answerKind: 'decimal',
        value: fair,
        eps: 0.006,
        solution: `${formatDe(fair)} €`,
        explanation: `Fair heißt: Erwartungswert der Auszahlung = Einsatz. ${win.length}/6 · A = ${stake} € ⇒ A = ${formatDe(fair)} €.`,
        dedupeKey: `ma:k10:ew:wuerfel:fair:${win.join('')}:${stake}`,
      })
    },
    (rng: Rng) => {
      // Auszahlung = a · Augenzahl − b
      const a = pick(rng, [1, 2, 3])
      const b = randInt(rng, 2, 9)
      const value = roundTo(a * 3.5 - b, 2)
      return valueTask({
        question: `Bei einem Spiel wird einmal gewürfelt. Man erhält ${a === 1 ? 'die Augenzahl' : `das ${a}-Fache der Augenzahl`} in Euro, zahlt aber vorher ${b} € Einsatz. Berechne den Erwartungswert des Reingewinns.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        eps: 0.006,
        solution: `${formatDe(value)} €`,
        explanation: `E(Augenzahl) = (1 + 2 + … + 6) : 6 = 3,5. E(Gewinn) = ${a} · 3,5 − ${b} = ${formatDe(value)} €.`,
        dedupeKey: `ma:k10:ew:wuerfel:linear:${a}:${b}`,
      })
    },
    (rng: Rng) => {
      // Zwei Würfel: Augensumme
      const target = randInt(rng, 2, 12)
      const ways = 6 - Math.abs(7 - target)
      const pay = pick(rng, [6, 9, 12, 18, 36])
      const value = roundTo((ways * pay) / 36, 2)
      return valueTask({
        question: `Zwei Würfel werden geworfen. Ist die Augensumme genau ${target}, erhält man ${pay} €, sonst nichts. Berechne den Erwartungswert der Auszahlung. Runde auf Cent.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        eps: 0.006,
        solution: `${formatDe(value)} €`,
        explanation: `Die Summe ${target} entsteht auf ${ways} von 36 gleich wahrscheinlichen Arten. E = ${ways}/36 · ${pay} € ≈ ${formatDe(value)} €.`,
        dedupeKey: `ma:k10:ew:wuerfel:summe:${target}:${pay}`,
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Algebraisches Lösen geometrischer Probleme
// ---------------------------------------------------------------------------

const DEG = Math.PI / 180

const nonZeroInt = (rng: Rng, min: number, max: number): number => {
  let v = 0
  while (v === 0) v = randInt(rng, min, max)
  return v
}

const rechteckBreite: Topic = {
  id: 'k10-lb3-rechteck-breite',
  title: 'Flächeninhalt allgemeiner Dreiecke mit dem Sinus',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Dreieck', 'Flächeninhalt', 'Sinus', 'Flächeninhaltsformel', 'Trigonometrie'],
  fachwissen: {
    text: 'Sind in einem Dreieck zwei Seiten und der eingeschlossene Winkel bekannt, gilt A = ½ · a · b · sin γ. Die Formel folgt aus A = ½ · a · h_a mit h_a = b · sin γ. Sie funktioniert auch für stumpfe Winkel, denn sin(180° − γ) = sin γ.',
    quelle: 'Wikipedia: Dreieck',
    url: 'https://de.wikipedia.org/wiki/Dreieck#Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 4, 15)
      const b = randInt(rng, 4, 15)
      const gamma = pick(rng, [25, 35, 40, 50, 65, 75, 110, 125, 140])
      const value = roundTo(0.5 * a * b * Math.sin(gamma * DEG), 1)
      return valueTask({
        question: `In einem Dreieck ist a = ${a} cm, b = ${b} cm und der eingeschlossene Winkel γ = ${gamma}°. Berechne den Flächeninhalt. Runde auf eine Nachkommastelle.`,
        unit: 'cm²',
        answerKind: 'decimal',
        value,
        eps: 0.051,
        solution: `${formatDe(value)} cm²`,
        explanation: `A = ½ · a · b · sin γ = 0,5 · ${a} · ${b} · sin(${gamma}°) ≈ ${formatDe(value)} cm².`,
        dedupeKey: `ma:k10:adreieck:${a}:${b}:${gamma}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 6, 15)
      const b = randInt(rng, 6, 15)
      const gamma = pick(rng, [20, 30, 40, 50, 60, 70])
      const A = roundTo(0.5 * a * b * Math.sin(gamma * DEG), 2)
      const value = roundTo(Math.asin((2 * A) / (a * b)) / DEG, 0)
      return valueTask({
        question: `Ein spitzwinkliges Dreieck hat die Seiten a = ${a} cm und b = ${b} cm und den Flächeninhalt ${formatDe(A)} cm². Wie groß ist der eingeschlossene Winkel γ? Runde auf ganze Grad.`,
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `sin γ = 2 · A : (a · b) = 2 · ${formatDe(A)} : ${a * b} ≈ ${formatDe(roundTo((2 * A) / (a * b), 4))}. Spitzer Winkel: γ ≈ ${value}°.`,
        dedupeKey: `ma:k10:adreieck:winkel:${a}:${b}:${gamma}`,
      })
    },
    (rng: Rng) => {
      const s1 = randInt(rng, 30, 80)
      const s2 = randInt(rng, 30, 80)
      const w = pick(rng, [48, 57, 63, 72, 105, 118])
      const preis = pick(rng, [45, 60, 80, 120])
      const A = 0.5 * s1 * s2 * Math.sin(w * DEG)
      const value = Math.round(A * preis)
      return valueTask({
        question: `Ein dreieckiges Grundstück hat zwei Grenzseiten von ${s1} m und ${s2} m, die einen Winkel von ${w}° einschließen. Der Quadratmeter kostet ${preis} €. Wie teuer ist das Grundstück? Runde auf Euro.`,
        unit: '€',
        answerKind: 'integer',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `A = 0,5 · ${s1} · ${s2} · sin(${w}°) ≈ ${formatDe(roundTo(A, 2))} m². Preis: ${formatDe(roundTo(A, 2))} · ${preis} € ≈ ${formatDe(value)} €.`,
        dedupeKey: `ma:k10:adreieck:grund:${s1}:${s2}:${w}:${preis}`,
      })
    },
  ),
}

function triangleSides(rng: Rng): [number, number, number] {
  for (;;) {
    const a = randInt(rng, 4, 15)
    const b = randInt(rng, 4, 15)
    const c = randInt(rng, 4, 15)
    if (a + b > c + 1 && a + c > b + 1 && b + c > a + 1 && new Set([a, b, c]).size === 3) return [a, b, c]
  }
}

const quadratSeite: Topic = {
  id: 'k10-lb3-quadrat-seite',
  title: 'Winkel mit dem Kosinussatz berechnen',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Kosinussatz', 'Winkel', 'Dreieck', 'SSS', 'Trigonometrie'],
  fachwissen: {
    text: 'Sind alle drei Seiten eines Dreiecks bekannt, liefert der umgestellte Kosinussatz jeden Winkel: cos γ = (a² + b² − c²) : (2ab). Der größte Winkel liegt der längsten Seite gegenüber; ist cos γ negativ, ist γ stumpf.',
    quelle: 'Wikipedia: Kosinussatz',
    url: 'https://de.wikipedia.org/wiki/Kosinussatz',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [a, b, c] = triangleSides(rng)
      const cos = (a * a + b * b - c * c) / (2 * a * b)
      const value = roundTo(Math.acos(cos) / DEG, 1)
      return valueTask({
        question: `Ein Dreieck hat die Seiten a = ${a} cm, b = ${b} cm und c = ${c} cm. Berechne den Winkel γ (gegenüber von c). Runde auf eine Nachkommastelle.`,
        unit: '°',
        answerKind: 'decimal',
        value,
        eps: 0.051,
        solution: `${formatDe(value)}°`,
        explanation: `cos γ = (${a}² + ${b}² − ${c}²) : (2 · ${a} · ${b}) = ${a * a + b * b - c * c} : ${2 * a * b} ≈ ${formatDe(roundTo(cos, 4))}. γ ≈ ${formatDe(value)}°.`,
        dedupeKey: `ma:k10:kosw:${a}:${b}:${c}`,
      })
    },
    (rng: Rng) => {
      const [a, b, c] = triangleSides(rng)
      const sides = [a, b, c]
      const longest = Math.max(...sides)
      const others = sides.filter((s) => s !== longest) as [number, number]
      const cos = (others[0] ** 2 + others[1] ** 2 - longest ** 2) / (2 * others[0] * others[1])
      const value = roundTo(Math.acos(cos) / DEG, 1)
      return valueTask({
        question: `Ein Dreieck hat die Seitenlängen ${a} cm, ${b} cm und ${c} cm. Wie groß ist sein größter Innenwinkel? Runde auf eine Nachkommastelle.`,
        unit: '°',
        answerKind: 'decimal',
        value,
        eps: 0.051,
        solution: `${formatDe(value)}°`,
        explanation: `Der größte Winkel liegt der längsten Seite ${longest} cm gegenüber: cos φ = (${others[0]}² + ${others[1]}² − ${longest}²) : (2 · ${others[0]} · ${others[1]}) ≈ ${formatDe(roundTo(cos, 4))}, φ ≈ ${formatDe(value)}°${cos < 0 ? ' (stumpf, weil cos φ < 0)' : ''}.`,
        dedupeKey: `ma:k10:kosw:max:${[...sides].sort((x, y) => x - y).join(':')}`,
      })
    },
    (rng: Rng) => {
      const s1 = randInt(rng, 3, 9)
      const s2 = randInt(rng, 3, 9)
      const gamma = pick(rng, [40, 55, 70, 85, 100])
      const d = roundTo(Math.sqrt(s1 * s1 + s2 * s2 - 2 * s1 * s2 * Math.cos(gamma * DEG)), 1)
      const cos = (s1 * s1 + s2 * s2 - d * d) / (2 * s1 * s2)
      const value = Math.round(Math.acos(cos) / DEG)
      return valueTask({
        question: `Zwei Wanderwege starten am selben Punkt. Nach ${s1} km auf dem einen und ${s2} km auf dem anderen Weg sind zwei Wanderer ${formatDe(d)} km Luftlinie voneinander entfernt. Unter welchem Winkel laufen die Wege auseinander? Runde auf ganze Grad.`,
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `cos φ = (${s1}² + ${s2}² − ${formatDe(d)}²) : (2 · ${s1} · ${s2}) ≈ ${formatDe(roundTo(cos, 4))}. φ ≈ ${value}°.`,
        dedupeKey: `ma:k10:kosw:wander:${s1}:${s2}:${d}`,
      })
    },
  ),
}

const rechteckBreiteUmfang: Topic = {
  id: 'k10-lb3-rechteck-umfang',
  title: 'Berechnungen an Pyramiden und Kegeln',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Pyramide', 'Kegel', 'Neigungswinkel', 'Mantellinie', 'Trigonometrie'],
  fachwissen: {
    text: 'In Pyramiden und Kegeln findet man rechtwinklige Stützdreiecke: beim Kegel aus Radius r, Höhe h und Mantellinie s; bei der quadratischen Pyramide z. B. aus halber Diagonale, Höhe und Seitenkante. Neigungswinkel bestimmt man mit tan, sin oder cos in diesen Dreiecken, Längen mit dem Satz des Pythagoras.',
    quelle: 'Wikipedia: Kegel (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Kegel_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const r = randInt(rng, 3, 12)
      const h = randInt(rng, 4, 20)
      const value = roundTo(Math.atan(h / r) / DEG, 1)
      return valueTask({
        question: `Ein Kegel hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Unter welchem Winkel ist die Mantellinie gegen die Grundfläche geneigt? Runde auf eine Nachkommastelle.`,
        unit: '°',
        answerKind: 'decimal',
        value,
        eps: 0.051,
        solution: `${formatDe(value)}°`,
        explanation: `Im Stützdreieck aus r, h und s gilt tan α = h : r = ${h} : ${r}. α ≈ ${formatDe(value)}°.`,
        dedupeKey: `ma:k10:kegel:neig:${r}:${h}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 4, 14)
      const h = randInt(rng, 4, 16)
      const halfDiag = (a * Math.SQRT2) / 2
      const value = roundTo(Math.atan(h / halfDiag) / DEG, 1)
      return valueTask({
        question: `Eine quadratische Pyramide hat die Grundkante a = ${a} cm und die Höhe h = ${h} cm. Wie groß ist der Neigungswinkel einer Seitenkante gegen die Grundfläche? Runde auf eine Nachkommastelle.`,
        unit: '°',
        answerKind: 'decimal',
        value,
        eps: 0.051,
        solution: `${formatDe(value)}°`,
        explanation: `Die Seitenkante steht über der halben Diagonale d/2 = ${a} · √2 : 2 ≈ ${formatDe(roundTo(halfDiag, 3))} cm. tan α = h : (d/2) = ${h} : ${formatDe(roundTo(halfDiag, 3))}, α ≈ ${formatDe(value)}°.`,
        dedupeKey: `ma:k10:pyr:neig:${a}:${h}`,
      })
    },
    (rng: Rng) => {
      const r = randInt(rng, 3, 10)
      const s = r + randInt(rng, 2, 10)
      const value = roundTo((2 * Math.asin(r / s)) / DEG, 1)
      return valueTask({
        question: `Eine kegelförmige Eistüte hat den Radius ${r} cm und die Mantellinie ${s} cm. Wie groß ist ihr Öffnungswinkel an der Spitze? Runde auf eine Nachkommastelle.`,
        unit: '°',
        answerKind: 'decimal',
        value,
        eps: 0.11,
        solution: `${formatDe(value)}°`,
        explanation: `Der halbe Öffnungswinkel φ/2 liegt im Stützdreieck gegenüber von r: sin(φ/2) = r : s = ${r} : ${s}. φ/2 ≈ ${formatDe(roundTo(Math.asin(r / s) / DEG, 2))}°, also φ ≈ ${formatDe(value)}°.`,
        dedupeKey: `ma:k10:kegel:oeff:${r}:${s}`,
      })
    },
    (rng: Rng) => {
      const r = pick(rng, [1.5, 2, 2.5, 3, 4])
      const w = pick(rng, [30, 32, 35, 38, 40])
      const h = r * Math.tan(w * DEG)
      const value = roundTo((Math.PI * r * r * h) / 3, 2)
      return valueTask({
        question: `Ein Kieshaufen bildet einen Kegel mit dem Radius ${formatDe(r)} m; die Seiten sind unter ${w}° geneigt (Schüttwinkel). Wie viel m³ Kies sind es? Runde auf zwei Nachkommastellen.`,
        unit: 'm³',
        answerKind: 'decimal',
        value,
        eps: 0.011,
        solution: `${formatDe(value)} m³`,
        explanation: `Höhe: h = r · tan ${w}° ≈ ${formatDe(roundTo(h, 3))} m. V = 1/3 · π · r² · h ≈ ${formatDe(value)} m³.`,
        dedupeKey: `ma:k10:kegel:kies:${r}:${w}`,
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Funktionale Zusammenhänge
// ---------------------------------------------------------------------------

const reinquadratisch: Topic = {
  id: 'k10-lb4-reinquadratisch',
  title: 'Zahlenfolgen: Grenzwert und Schranken',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Zahlenfolge', 'Grenzwert', 'Schranke', 'Monotonie', 'Konvergenz'],
  fachwissen: {
    text: 'Eine Folge (aₙ) hat den Grenzwert g, wenn ihre Glieder für große n beliebig nahe an g herankommen: Für jedes ε > 0 gilt ab einem Index |aₙ − g| < ε. Bei aₙ = g + d/n wird der Bruch d/n immer kleiner, der Grenzwert ist g. Eine obere Schranke ist eine Zahl, die kein Glied übersteigt; bei wachsenden, gegen g strebenden Folgen ist g die kleinste obere Schranke.',
    quelle: 'Wikipedia: Grenzwert (Folge)',
    url: 'https://de.wikipedia.org/wiki/Grenzwert_(Folge)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const k = nonZeroInt(rng, -5, 6)
      const m = nonZeroInt(rng, -9, 9)
      return valueTask({
        question: `Bestimme den Grenzwert der Folge aₙ = (${k === 1 ? '' : k === -1 ? '−' : `${signedNum(k)}`}n${addNum(m)}) / n für n → ∞.`,
        answerKind: 'integer',
        value: k,
        solution: signedNum(k),
        explanation: `aₙ = ${signedNum(k)} + ${parenNum(m)}/n. Der Bruch ${parenNum(m)}/n strebt gegen 0, also ist der Grenzwert ${signedNum(k)}.`,
        dedupeKey: `ma:k10:folge:gw:${k}:${m}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 2, 6)
      const m = randInt(rng, 1, 9)
      const value = roundTo(k, 0)
      return valueTask({
        question: `Bestimme den Grenzwert der Folge aₙ = (${k}n² + ${m}) / (n² + 1) für n → ∞.`,
        answerKind: 'integer',
        value,
        solution: String(value),
        explanation: `Kürzen durch n²: aₙ = (${k} + ${m}/n²) / (1 + 1/n²). Zähler → ${k}, Nenner → 1, also Grenzwert ${k}.`,
        dedupeKey: `ma:k10:folge:gw2:${k}:${m}`,
      })
    },
    (rng: Rng) => {
      const g = randInt(rng, 1, 6)
      const d = pick(rng, [1, 2, 3, 5])
      const eps = pick(rng, [0.1, 0.05, 0.01])
      const value = Math.floor(d / eps) + 1
      return valueTask({
        question: `Die Folge aₙ = ${g} + ${d}/n strebt gegen ${g}. Ab welchem Index n ist der Abstand |aₙ − ${g}| erstmals kleiner als ${formatDe(eps)}?`,
        answerKind: 'integer',
        value,
        solution: `ab n = ${value}`,
        explanation: `|aₙ − ${g}| = ${d}/n < ${formatDe(eps)} ⇔ n > ${d} : ${formatDe(eps)} = ${formatDe(d / eps)}. Die erste natürliche Zahl ist n = ${value}.`,
        dedupeKey: `ma:k10:folge:eps:${g}:${d}:${eps}`,
      })
    },
    (rng: Rng) => {
      const g = randInt(rng, 2, 9)
      const d = randInt(rng, 1, 6)
      return valueTask({
        question: `Die Folge aₙ = ${g} − ${d}/n ist monoton wachsend. Gib ihre kleinste obere Schranke an.`,
        answerKind: 'integer',
        value: g,
        solution: String(g),
        explanation: `Jedes Glied ist kleiner als ${g}, weil ${d}/n > 0 abgezogen wird. Die Glieder kommen ${g} aber beliebig nahe (Grenzwert ${g}), daher ist ${g} die kleinste obere Schranke.`,
        dedupeKey: `ma:k10:folge:schranke:${g}:${d}`,
      })
    },
  ),
}

const TAN_EXAKT: Array<{ w: number; v: string }> = [
  { w: 30, v: '√3/3' },
  { w: 45, v: '1' },
  { w: 60, v: '√3' },
  { w: 120, v: '−√3' },
  { w: 135, v: '−1' },
  { w: 150, v: '−√3/3' },
  { w: 210, v: '√3/3' },
  { w: 225, v: '1' },
  { w: 315, v: '−1' },
  { w: 180, v: '0' },
]

const quadratischGleichung: Topic = {
  id: 'k10-lb4-quadratische-gleichung',
  title: 'Tangensfunktion als Quotient von Sinus und Kosinus',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Tangens', 'Sinus', 'Kosinus', 'Verknüpfung', 'Periode'],
  fachwissen: {
    text: 'Die Tangensfunktion entsteht durch Verknüpfung: tan x = sin x : cos x. Sie ist überall dort nicht definiert, wo cos x = 0 ist (bei 90°, 270°, …). Sie hat die Periode 180°: tan(α + 180°) = tan α. Im 2. und 4. Quadranten ist der Tangens negativ, weil Sinus und Kosinus dort verschiedene Vorzeichen haben.',
    quelle: 'Wikipedia: Tangens und Kotangens',
    url: 'https://de.wikipedia.org/wiki/Tangens_und_Kotangens',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [g, a, h] = pick(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]] as Array<[number, number, number]>)
      const quadrant = pick(rng, [1, 2])
      const sin = g / h
      const cos = quadrant === 1 ? a / h : -a / h
      const value = roundTo(sin / cos, 3)
      return valueTask({
        question: `Für einen Winkel α gilt sin α = ${formatDe(roundTo(sin, 4))} und cos α = ${formatDe(roundTo(cos, 4))}. Berechne tan α. Runde auf drei Nachkommastellen.`,
        answerKind: 'decimal',
        value,
        eps: 0.0011,
        solution: formatDe(value),
        explanation: `tan α = sin α : cos α = ${formatDe(roundTo(sin, 4))} : ${parenNum(roundTo(cos, 4))} = ${quadrant === 1 ? '' : '−'}${g}/${a} ≈ ${formatDe(value)}.${cos < 0 ? ' Der Kosinus ist negativ (2. Quadrant), deshalb auch der Tangens.' : ''}`,
        dedupeKey: `ma:k10:tan:quot:${g}:${a}:${quadrant}`,
      })
    },
    (rng: Rng) => {
      const t = pick(rng, TAN_EXAKT)
      const pool = ['0', '1', '−1', '√3', '−√3', '√3/3', '−√3/3']
      const distractors = shuffleArr(rng, pool.filter((p) => p !== t.v)).slice(0, 3)
      return choicePickTask({
        question: `Welchen exakten Wert hat tan(${t.w}°)?`,
        choices: shuffleArr(rng, [t.v, ...distractors]),
        correct: t.v,
        solution: t.v,
        explanation: `tan(${t.w}°) = sin(${t.w}°) : cos(${t.w}°). Bezugswinkel ${t.w % 180 === 0 ? '0°' : `${t.w % 90 === 0 ? 90 : Math.min(t.w % 180, 180 - (t.w % 180))}°`}; das Vorzeichen ergibt sich aus den Vorzeichen von Sinus und Kosinus im Quadranten: tan(${t.w}°) = ${t.v}.`,
        dedupeKey: `ma:k10:tan:exakt:${t.w}`,
      })
    },
    (rng: Rng) => {
      const alpha = randInt(rng, 5, 85)
      const t = roundTo(Math.tan(alpha * DEG), 4)
      const value = alpha + 180
      return valueTask({
        question: `Es gilt tan(${alpha}°) ≈ ${formatDe(t)}. Welcher Winkel zwischen 180° und 270° hat denselben Tangenswert?`,
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `Der Tangens hat die Periode 180°: tan(${alpha}° + 180°) = tan(${alpha}°). Also ${value}°.`,
        dedupeKey: `ma:k10:tan:periode:${alpha}`,
      })
    },
    (rng: Rng) => {
      const correct = pick(rng, ['90°', '270°', '450°', '−90°'])
      const others = shuffleArr(rng, ['0°', '45°', '135°', '180°', '225°', '360°']).slice(0, 3)
      return choicePickTask({
        question: 'An welcher dieser Stellen ist die Tangensfunktion nicht definiert?',
        choices: shuffleArr(rng, [correct, ...others]),
        correct,
        solution: correct,
        explanation: `tan x = sin x : cos x ist nicht definiert, wo cos x = 0 ist: bei ±90°, ±270°, … Also bei ${correct}. An den anderen Stellen ist cos x ≠ 0.`,
        dedupeKey: `ma:k10:tan:luecke:${correct}:${[...others].sort().join(',')}`,
      })
    },
  ),
}

const FUNKTIONEN: Record<string, string> = {
  sqrt: 'f(x) = √x',
  x2: 'f(x) = x²',
  inv: 'f(x) = 1/x',
  ln: 'f(x) = ln x',
  exp: 'f(x) = eˣ',
  sin: 'f(x) = sin x',
}

const FUNKTION_WISSEN: Record<string, string> = {
  sqrt: 'f(x) = √x: Definitionsbereich x ≥ 0, Wertebereich y ≥ 0. Der Graph beginnt im Ursprung und ist streng monoton wachsend – immer langsamer. √x ist die Umkehrfunktion von x² für x ≥ 0.',
  x2: 'f(x) = x²: Definitionsbereich alle reellen Zahlen, Wertebereich y ≥ 0. Der Graph (Normalparabel) ist achsensymmetrisch zur y-Achse und verläuft durch den Ursprung; für x < 0 fällt er, für x > 0 steigt er.',
  inv: 'f(x) = 1/x: Definitionsbereich alle x ≠ 0, bei x = 0 liegt eine Polstelle. Wertebereich alle y ≠ 0. Der Graph (Hyperbel) ist punktsymmetrisch zum Ursprung und fällt auf jedem seiner beiden Äste.',
  ln: 'f(x) = ln x: Definitionsbereich x > 0, Wertebereich alle reellen Zahlen. Nullstelle bei x = 1, weil e⁰ = 1. Der Graph ist streng monoton wachsend; ln x ist die Umkehrfunktion von eˣ.',
  exp: 'f(x) = eˣ: Definitionsbereich alle reellen Zahlen, Wertebereich y > 0. Der Graph schneidet die y-Achse bei y = 1 (weil e⁰ = 1), ist streng monoton wachsend und nähert sich für x → −∞ der x-Achse.',
  sin: 'f(x) = sin x: Definitionsbereich alle reellen Zahlen, Wertebereich −1 ≤ y ≤ 1. Der Graph ist periodisch mit der Periode 2π, verläuft durch den Ursprung und ist wegen sin(−x) = −sin x punktsymmetrisch zum Ursprung.',
}

const funktionFw = (key: string) => ({
  text: FUNKTION_WISSEN[key]!,
  quelle: 'Wikipedia: Elementare Funktion',
  url: 'https://de.wikipedia.org/wiki/Elementare_Funktion',
})

const EIGENSCHAFTEN: Array<{ s: string; f: string[] }> = [
  { s: 'Definitionsbereich: alle x > 0', f: ['ln'] },
  { s: 'Wertebereich: alle y > 0', f: ['exp'] },
  { s: 'Nullstelle bei x = 1', f: ['ln'] },
  { s: 'periodisch mit der Periode 2π', f: ['sin'] },
  { s: 'Graph achsensymmetrisch zur y-Achse', f: ['x2'] },
  { s: 'Polstelle bei x = 0', f: ['inv'] },
  { s: 'Definitionsbereich: alle x ≥ 0', f: ['sqrt'] },
  { s: 'Graph schneidet die y-Achse bei y = 1', f: ['exp'] },
  { s: 'Graph verläuft durch den Ursprung', f: ['sqrt', 'x2', 'sin'] },
  { s: 'Graph punktsymmetrisch zum Ursprung', f: ['inv', 'sin'] },
  { s: 'streng monoton wachsend im ganzen Definitionsbereich', f: ['sqrt', 'ln', 'exp'] },
  { s: 'Wertebereich: alle y ≥ 0', f: ['sqrt', 'x2'] },
]

const parabelWert: Topic = {
  id: 'k10-lb4-parabel-wert',
  title: 'Eigenschaften elementarer Funktionen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Funktion', 'Definitionsbereich', 'Wertebereich', 'Symmetrie', 'Monotonie', 'Logarithmusfunktion', 'Exponentialfunktion'],
  fachwissen: {
    text: 'Ohne Hilfsmittel sollte man die Graphen von y = √x, y = x², y = 1/x, y = ln x, y = eˣ und y = sin x kennen: √x ist nur für x ≥ 0 definiert, ln x nur für x > 0 und hat die Nullstelle 1, eˣ ist immer positiv und schneidet die y-Achse bei 1, 1/x hat bei 0 eine Polstelle, x² ist symmetrisch zur y-Achse, sin x ist periodisch mit 2π.',
    quelle: 'Wikipedia: Elementare Funktion',
    url: 'https://de.wikipedia.org/wiki/Elementare_Funktion',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const e = pick(rng, EIGENSCHAFTEN.filter((x) => x.f.length === 1))
      const correctKey = e.f[0]!
      const excluded = e.s.startsWith('Polstelle') ? ['ln'] : []
      const distractors = shuffleArr(rng, Object.keys(FUNKTIONEN).filter((k) => !e.f.includes(k) && !excluded.includes(k))).slice(0, 3)
      return choicePickTask({
        question: `Welche Funktion hat die Eigenschaft „${e.s}“?`,
        choices: shuffleArr(rng, [correctKey, ...distractors].map((k) => FUNKTIONEN[k]!)),
        correct: FUNKTIONEN[correctKey]!,
        solution: FUNKTIONEN[correctKey]!,
        explanation: `${FUNKTIONEN[correctKey]} hat die Eigenschaft „${e.s}“; ${distractors.map((k) => FUNKTIONEN[k]).join(', ')} nicht.`,
        fachwissen: funktionFw(correctKey),
        dedupeKey: `ma:k10:elfkt:welche:${e.s}`,
      })
    },
    (rng: Rng) => {
      const key = pick(rng, Object.keys(FUNKTIONEN))
      const wahr = EIGENSCHAFTEN.filter((x) => x.f.includes(key))
      const falsch = EIGENSCHAFTEN.filter((x) => !x.f.includes(key))
      const correct = pick(rng, wahr).s
      const distractors = shuffleArr(rng, falsch).slice(0, 3).map((x) => x.s)
      return choicePickTask({
        question: `Welche Aussage trifft auf ${FUNKTIONEN[key]} zu?`,
        choices: shuffleArr(rng, [correct, ...distractors]),
        correct,
        solution: correct,
        explanation: `Für ${FUNKTIONEN[key]} gilt: ${wahr.map((x) => x.s).join('; ')}. Die übrigen Aussagen treffen nicht zu.`,
        fachwissen: funktionFw(key),
        dedupeKey: `ma:k10:elfkt:aussage:${key}:${correct}`,
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung: Zinsrechnung
// ---------------------------------------------------------------------------

const kapitalAusZinsen: Topic = {
  id: 'k10-lb5-kapital',
  title: 'Zinsen für Monate und Tage',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zinsrechnung', 'Monatszinsen', 'Tageszinsen', 'Kapital', 'Zinssatz'],
  fachwissen: {
    text: 'Für Laufzeiten unter einem Jahr rechnet man anteilig: Zinsen für m Monate Z = K · p/100 · m/12, für t Tage (Bankjahr mit 360 Tagen) Z = K · p/100 · t/360. Aus der Formel lassen sich auch Kapital oder Laufzeit bestimmen, wenn die Zinsen bekannt sind.',
    quelle: 'Wikipedia: Zinsrechnung',
    url: 'https://de.wikipedia.org/wiki/Zinsrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const k = randInt(rng, 6, 60) * 100
      const p = pick(rng, [1.5, 2, 2.5, 3, 4])
      const m = pick(rng, [2, 3, 4, 5, 7, 8, 9, 10])
      const value = roundTo((k * p * m) / 1200, 2)
      return valueTask({
        question: `${formatDe(k)} € werden ${m} Monate lang zu ${formatDe(p)} % pro Jahr angelegt. Wie viel Zinsen gibt es?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        eps: 0.006,
        solution: `${formatDe(value)} €`,
        explanation: `Z = K · p/100 · m/12 = ${formatDe(k)} · ${formatDe(p / 100)} · ${m}/12 = ${formatDe(value)} €.`,
        dedupeKey: `ma:k10:zins:monat:${k}:${p}:${m}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 10, 80) * 100
      const p = pick(rng, [3, 4, 6, 9])
      const t = pick(rng, [30, 45, 60, 90, 120, 150, 200])
      const value = roundTo((k * p * t) / 36000, 2)
      return valueTask({
        question: `Ein Konto ist ${t} Tage lang mit ${formatDe(k)} € überzogen. Die Bank verlangt ${p} % Überziehungszinsen pro Jahr (Bankjahr: 360 Tage). Wie hoch sind die Zinsen?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        eps: 0.006,
        solution: `${formatDe(value)} €`,
        explanation: `Z = K · p/100 · t/360 = ${formatDe(k)} · ${formatDe(p / 100)} · ${t}/360 = ${formatDe(value)} €.`,
        dedupeKey: `ma:k10:zins:tage:${k}:${p}:${t}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 6, 60) * 200
      const p = pick(rng, [2, 3, 4, 5])
      const m = pick(rng, [3, 4, 6, 8, 9])
      const z = roundTo((k * p * m) / 1200, 2)
      return valueTask({
        question: `Für eine Geldanlage zu ${p} % pro Jahr erhält man nach ${m} Monaten ${formatDe(z)} € Zinsen. Wie groß war das angelegte Kapital?`,
        unit: '€',
        answerKind: 'decimal',
        value: k,
        eps: 0.6,
        solution: `${formatDe(k)} €`,
        explanation: `Aus Z = K · p/100 · m/12 folgt K = Z · 100 · 12 : (p · m) = ${formatDe(z)} · 1200 : ${p * m} = ${formatDe(k)} €.`,
        dedupeKey: `ma:k10:zins:kapital:${k}:${p}:${m}`,
      })
    },
  ),
}

const zinssatz: Topic = {
  id: 'k10-lb5-zinssatz',
  title: 'Zinssatz und Laufzeit bestimmen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zinsrechnung', 'Zinssatz', 'Laufzeit', 'Zinsen', 'Kapital'],
  fachwissen: {
    text: 'Stellt man die Zinsformel Z = K · p/100 · m/12 um, erhält man den Zinssatz p = Z · 1200 : (K · m) oder die Laufzeit m = Z · 1200 : (K · p) in Monaten. So lassen sich Angebote mit unterschiedlichen Laufzeiten vergleichen.',
    quelle: 'Wikipedia: Zinsrechnung',
    url: 'https://de.wikipedia.org/wiki/Zinsrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const k = randInt(rng, 6, 50) * 200
      const p = pick(rng, [1.5, 2, 2.5, 3, 3.5, 4])
      const m = pick(rng, [3, 4, 6, 8, 9])
      const z = roundTo((k * p * m) / 1200, 2)
      return valueTask({
        question: `${formatDe(k)} € bringen in ${m} Monaten ${formatDe(z)} € Zinsen. Wie hoch ist der Zinssatz pro Jahr?`,
        unit: '%',
        answerKind: 'decimal',
        value: p,
        eps: 0.011,
        solution: `${formatDe(p)} %`,
        explanation: `p = Z · 1200 : (K · m) = ${formatDe(z)} · 1200 : (${formatDe(k)} · ${m}) = ${formatDe(p)} %.`,
        dedupeKey: `ma:k10:zinssatz:${k}:${p}:${m}`,
      })
    },
    (rng: Rng) => {
      const k = randInt(rng, 6, 50) * 200
      const p = pick(rng, [2, 3, 4, 5, 6])
      const m = pick(rng, [2, 3, 4, 5, 6, 8, 9, 10])
      const z = roundTo((k * p * m) / 1200, 2)
      return valueTask({
        question: `Ein Kapital von ${formatDe(k)} € wird zu ${p} % pro Jahr angelegt und bringt ${formatDe(z)} € Zinsen. Wie viele Monate war es angelegt?`,
        unit: 'Monate',
        answerKind: 'integer',
        value: m,
        solution: `${m} Monate`,
        explanation: `m = Z · 1200 : (K · p) = ${formatDe(z)} · 1200 : (${formatDe(k)} · ${p}) = ${m} Monate.`,
        dedupeKey: `ma:k10:laufzeit:${k}:${p}:${m}`,
      })
    },
  ),
}

const zinsenAusKapital: Topic = {
  id: 'k10-lb5-zinsen',
  title: 'Ratenkredit: Tilgung, Zinsen und Rate',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Kredit', 'Tilgung', 'Restschuld', 'Ratenkredit', 'Zinsen'],
  fachwissen: {
    text: 'Beim Ratenkredit (Ratentilgung) zahlt man jedes Jahr denselben Tilgungsbetrag T zurück. Die Zinsen werden auf die jeweilige Restschuld berechnet und sinken deshalb von Jahr zu Jahr. Die Jahresrate ist Tilgung plus Zinsen; im Jahr j beträgt die Restschuld zu Jahresbeginn K − (j − 1) · T.',
    quelle: 'Wikipedia: Ratenkredit',
    url: 'https://de.wikipedia.org/wiki/Ratenkredit',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const n = pick(rng, [4, 5, 6, 8])
      const T = pick(rng, [1000, 1500, 2000, 2500])
      const K = n * T
      const p = pick(rng, [3, 4, 5, 6])
      const j = randInt(rng, 2, n)
      const rest = K - (j - 1) * T
      const value = roundTo((rest * p) / 100, 2)
      return valueTask({
        question: `Ein Kredit über ${formatDe(K)} € wird in ${n} Jahren mit gleich hoher Tilgung zurückgezahlt; der Zinssatz beträgt ${p} % pro Jahr. Wie viel Zinsen fallen im ${j}. Jahr an?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Tilgung pro Jahr: ${formatDe(K)} : ${n} = ${formatDe(T)} €. Restschuld zu Beginn des ${j}. Jahres: ${formatDe(K)} − ${j - 1} · ${formatDe(T)} = ${formatDe(rest)} €. Zinsen: ${formatDe(rest)} · ${p}/100 = ${formatDe(value)} €.`,
        dedupeKey: `ma:k10:kredit:zins:${K}:${n}:${p}:${j}`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [4, 5, 6, 8])
      const T = pick(rng, [1000, 1500, 2000, 2500])
      const K = n * T
      const p = pick(rng, [3, 4, 5, 6])
      const j = randInt(rng, 1, n)
      const rest = K - (j - 1) * T
      const value = roundTo(T + (rest * p) / 100, 2)
      return valueTask({
        question: `Ratenkredit: ${formatDe(K)} €, Laufzeit ${n} Jahre, gleiche jährliche Tilgung, ${p} % Zinsen auf die Restschuld. Wie hoch ist die Jahresrate im ${j}. Jahr?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Tilgung ${formatDe(T)} €. Restschuld ${formatDe(rest)} €, Zinsen ${formatDe(roundTo((rest * p) / 100, 2))} €. Rate = ${formatDe(T)} + ${formatDe(roundTo((rest * p) / 100, 2))} = ${formatDe(value)} €.`,
        dedupeKey: `ma:k10:kredit:rate:${K}:${n}:${p}:${j}`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [3, 4, 5])
      const T = pick(rng, [1000, 2000, 3000])
      const K = n * T
      const p = pick(rng, [4, 5, 6])
      let sum = 0
      for (let j = 1; j <= n; j++) sum += ((K - (j - 1) * T) * p) / 100
      const value = roundTo(sum, 2)
      return valueTask({
        question: `Ein Ratenkredit über ${formatDe(K)} € wird in ${n} gleichen Tilgungsraten zurückgezahlt (Zinssatz ${p} % auf die Restschuld). Wie viel Zinsen zahlt man insgesamt?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Restschulden: ${Array.from({ length: n }, (_, j) => formatDe(K - j * T)).join(' €, ')} €. Zinsen: ${Array.from({ length: n }, (_, j) => formatDe(roundTo(((K - j * T) * p) / 100, 2))).join(' + ')} = ${formatDe(value)} €.`,
        dedupeKey: `ma:k10:kredit:summe:${K}:${n}:${p}`,
      })
    },
  ),
}

const endkapital: Topic = {
  id: 'k10-lb5-endkapital',
  title: 'Annuitätenkredit: Restschuld berechnen',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Kredit', 'Annuität', 'Restschuld', 'Tilgung', 'Zinseszins'],
  fachwissen: {
    text: 'Beim Annuitätenkredit zahlt man jedes Jahr dieselbe Rate R. Zuerst werden die Zinsen auf die Restschuld fällig, der Rest der Rate tilgt: neue Restschuld = alte Restschuld · (1 + p/100) − R. Weil die Zinsen sinken, wächst der Tilgungsanteil von Jahr zu Jahr.',
    quelle: 'Wikipedia: Annuitätendarlehen',
    url: 'https://de.wikipedia.org/wiki/Annuit%C3%A4tendarlehen',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const K = pick(rng, [10000, 12000, 15000, 20000])
      const p = pick(rng, [3, 4, 5, 6])
      const R = pick(rng, [2000, 2500, 3000, 4000])
      const n = randInt(rng, 1, 3)
      let s = K
      const steps: string[] = []
      for (let i = 0; i < n; i++) {
        const next = roundTo(s * (1 + p / 100) - R, 2)
        steps.push(`${formatDe(s)} · ${formatDe(1 + p / 100)} − ${formatDe(R)} = ${formatDe(next)}`)
        s = next
      }
      return valueTask({
        question: `Ein Kredit über ${formatDe(K)} € wird mit ${p} % pro Jahr verzinst und mit einer jährlichen Rate von ${formatDe(R)} € (am Jahresende) zurückgezahlt. Wie hoch ist die Restschuld nach ${n} ${n === 1 ? 'Jahr' : 'Jahren'}?`,
        unit: '€',
        answerKind: 'decimal',
        value: s,
        eps: 0.02,
        solution: `${formatDe(s)} €`,
        explanation: `Jedes Jahr: Restschuld · ${formatDe(1 + p / 100)} − Rate. ${steps.join('; ')} €.`,
        dedupeKey: `ma:k10:annuitaet:rest:${K}:${p}:${R}:${n}`,
      })
    },
    (rng: Rng) => {
      const K = pick(rng, [10000, 12000, 15000, 20000])
      const p = pick(rng, [3, 4, 5, 6])
      const R = pick(rng, [2000, 2500, 3000, 4000])
      const zinsen = (K * p) / 100
      const value = R - zinsen
      return valueTask({
        question: `Annuitätenkredit: ${formatDe(K)} €, ${p} % Zinsen pro Jahr, jährliche Rate ${formatDe(R)} €. Wie viel Euro der ersten Rate dienen zur Tilgung?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Zinsen im 1. Jahr: ${formatDe(K)} · ${p}/100 = ${formatDe(zinsen)} €. Tilgung = Rate − Zinsen = ${formatDe(R)} − ${formatDe(zinsen)} = ${formatDe(value)} €.`,
        dedupeKey: `ma:k10:annuitaet:tilg:${K}:${p}:${R}`,
      })
    },
  ),
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
      topics: [
        zinsen,
        zinseszins,
        prozentualeZunahme,
        expWachstum,
        k10SinusWert,
      ],
    },
    {
      id: 'lb2',
      title: 'Diskrete Zufallsgrößen',
      ustd: 16,
      topics: [erwartungswert, erwartungswertWuerfel, k10VarianzZufall,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math10"].filter((x) => x.areaId === "lb2").map((x) => x.topic),
      ],
    },
    {
      id: 'lb3',
      title: 'Algebraisches Lösen geometrischer Probleme',
      ustd: 20,
      topics: [
        rechteckBreite,
        quadratSeite,
        rechteckBreiteUmfang,
        k10Sinussatz,
        k10Kosinussatz,
      ],
    },
    {
      id: 'lb4',
      title: 'Funktionale Zusammenhänge',
      ustd: 42,
      topics: [
        reinquadratisch,
        quadratischGleichung,
        parabelWert,
        k10ExpGleichung,
        k10Logarithmus,
        k10FolgeExplizit,
        ...math10GraphicReviews,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math10"].filter((x) => x.areaId === "lb4").map((x) => x.topic),
      ],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Zinsrechnung',
      ustd: 4,
      topics: [kapitalAusZinsen, zinssatz, zinsenAusKapital, endkapital],
    },
  ],
}
