/**
 * Klasse 6 Mathematik — zusätzliche Neu-(Prüfung)-Banken nach Bettermarks.
 * Sibling-IDs: `${parentId}__neu`, neu:true, released:false.
 * Händisch; keine Bulk-Skripte. Originale in math6.ts unberührt.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import {
  add,
  divide,
  format,
  gcd,
  makeFraction,
  multiply,
  subtract,
  toDecimal,
  type Fraction,
} from '../lib/fraction'
import { shuffleChoices } from './biologieHelpers'
import {
  angleProtractorTask,
  choicePickTask,
  constructionStepsTask,
  fractionTask,
  mixedVariants,
  numberLineTask,
  textTask,
  valueTask,
  visualTask,
} from './taskHelpers'
import {
  generateCubeNetChoicesSvg,
  generateCuboidFaceEdgeSvg,
  generateCuboidSvg,
  generateFractionBarSvg,
  generateFractionCircleSvg,
  generateFractionGridSvg,
  generatePrismNetChoicesSvg,
  generatePrismVolumeSvg,
  generateRectangleSvg,
  generateRightTriangleSvg,
  generateTriangleSvg,
  generateValueTableSvg,
} from '../lib/geometrySvg'
import { hasCircle, hasPointNear, hasSegment } from './measureTaskHelpers'
import { emptyCoordinateScene } from '../lib/coordinateScene'
import { asNeuTopic } from './neuTopic'
import type { Topic } from './types'

// ---------------------------------------------------------------------------
// Lokale Helfer (bewusst nicht aus math6.ts importiert — Zirkelimport-Gefahr,
// da math6.ts seinerseits math6NeuLb1 importiert).
// ---------------------------------------------------------------------------

/** 4 MC-Choice-Labels: korrekt + bis zu 3 verschiedene falsche Kandidaten. */
function fourChoices(correct: string, wrongCandidates: string[]): string[] {
  const out = [correct]
  const seen = new Set([correct])
  for (const w of wrongCandidates) {
    if (out.length >= 4) break
    if (!seen.has(w)) {
      seen.add(w)
      out.push(w)
    }
  }
  return out
}

/** Zwei SVGs nebeneinander mit einem Operator-/Vergleichssymbol dazwischen. */
function sideBySideVisual(left: string, right: string, symbol: string): string {
  return `<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-items:center">${left}<span style="font-size:1.6rem;font-weight:700;color:#64748b">${symbol}</span>${right}</div>`
}

/**
 * Echter Bruch, der beim Anzeigen als Diagramm noch gekürzt werden muss:
 * gekürzte Basis mit n < d, um k≥2 erweitert (Anzeige ist nie 1/1 o. Ganzzahl).
 */
function reducibleProperForVisualNeu(
  rng: Rng,
): { base: Fraction; n: number; d: number; g: number } {
  const rawN = randInt(rng, 1, 5)
  const rawD = randInt(rng, rawN + 1, 8)
  const base = makeFraction(rawN, rawD)
  const k = randInt(rng, 2, 4)
  const n = base.n * k
  const d = base.d * k
  return { base, n, d, g: gcd(n, d) }
}

// ---------------------------------------------------------------------------
// 1) Brüche kürzen
// ---------------------------------------------------------------------------

const kuerzenNeu: Topic = asNeuTopic('lb1-kuerzen', {
  id: 'lb1-kuerzen__neu',
  title: 'Brüche kürzen',
  hint: 'Teile Zähler und Nenner durch ihren größten gemeinsamen Teiler.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Kürzen', 'ggT', 'Bruch', 'vollständig gekürzt'],
  fachwissen: {
    text: 'Zum vollständigen Kürzen eines Bruchs sucht man den größten gemeinsamen Teiler (ggT) von Zähler und Nenner und teilt beide Zahlen durch ihn. Ein Bruch, bei dem Zähler und Nenner außer der 1 keinen gemeinsamen Teiler mehr haben, heißt vollständig gekürzt. Primfaktorzerlegung hilft, den ggT auch bei größeren Zahlen sicher zu finden.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    // V1 Tippen — größere Zahlen als im Haupt-Thema
    (rng: Rng) => {
      const rawN = randInt(rng, 2, 9)
      const rawD = randInt(rng, rawN + 1, 12)
      const base = makeFraction(rawN, rawD)
      const k = randInt(rng, 2, 7)
      const n = base.n * k
      const d = base.d * k
      const g = gcd(n, d)
      return fractionTask({
        question: `Kürze den Bruch ${n}/${d} vollständig.`,
        value: base,
        requireReduced: true,
        solution: `${base.n}/${base.d}`,
        explanation: `ggT(${n}, ${d}) = ${g}. Teile beide Zahlen durch ${g}: ${n} : ${g} = ${base.n} und ${d} : ${g} = ${base.d}, also ${base.n}/${base.d}.`,
      })
    },
    // V2 MC — richtig vollständig gekürzte Form erkennen
    (rng: Rng) => {
      const rawN = randInt(rng, 2, 8)
      const rawD = randInt(rng, rawN + 1, 11)
      const base = makeFraction(rawN, rawD)
      const k = randInt(rng, 2, 5)
      const n = base.n * k
      const d = base.d * k
      const g = gcd(n, d)
      const correct = `${base.n}/${base.d}`
      const wrong1 = `${n}/${base.d}` // nur Nenner gekürzt
      const wrong2 = `${base.n}/${d}` // nur Zähler gekürzt
      const wrong3 = `${base.d}/${base.n}` // Zähler/Nenner vertauscht
      const wrong4 = `${n}/${d}` // gar nicht gekürzt
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3, wrong4]), correct)
      return choicePickTask({
        question: `Welcher Bruch ist die vollständig gekürzte Form von ${n}/${d}?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `ggT(${n}, ${d}) = ${g}. Teile Zähler und Nenner durch ${g}: ${correct}.`,
        dedupeKey: `kuerzen-mc:${n}:${d}`,
      })
    },
    // V3 MC — welcher Bruch ist NICHT vollständig gekürzt
    (rng: Rng) => {
      const base = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 9))
      const k = randInt(rng, 2, 5)
      const correct = `${base.n * k}/${base.d * k}`
      const reducedA = format(makeFraction(randInt(rng, 1, 9), randInt(rng, 2, 10)))
      const reducedB = format(makeFraction(randInt(rng, 1, 9), randInt(rng, 2, 10)))
      const reducedC = format(makeFraction(randInt(rng, 1, 9), randInt(rng, 2, 10)))
      const labeled = shuffleChoices(rng, fourChoices(correct, [reducedA, reducedB, reducedC]), correct)
      return choicePickTask({
        question: 'Welcher der folgenden Brüche ist NICHT vollständig gekürzt?',
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${correct} hat den ggT ${gcd(base.n * k, base.d * k)} und lässt sich zu ${base.n}/${base.d} kürzen. Die anderen Brüche haben außer 1 keinen gemeinsamen Teiler mehr.`,
        dedupeKey: `kuerzen-notreduced:${base.n}:${base.d}:${k}`,
      })
    },
    // V4 Portfolio — Rastermodell
    (rng: Rng) => {
      const { base, n, d, g } = reducibleProperForVisualNeu(rng)
      const cols = d <= 6 ? d : Math.ceil(Math.sqrt(d))
      return {
        ...fractionTask({
          question: 'Welcher gekürzte Bruchanteil ist im Rastermodell eingefärbt?',
          value: base,
          requireReduced: true,
          solution: `${base.n}/${base.d}`,
          explanation: `${n} von ${d} Feldern sind eingefärbt (= ${n}/${d}). Mit ggT ${g} gekürzt: ${base.n}/${base.d}.`,
        }),
        visualContent: generateFractionGridSvg({ numerator: n, denominator: d, cols }),
      }
    },
  ),
})

// ---------------------------------------------------------------------------
// 2) Brüche erweitern
// ---------------------------------------------------------------------------

const erweiternNeu: Topic = asNeuTopic('lb1-erweitern', {
  id: 'lb1-erweitern__neu',
  title: 'Brüche erweitern',
  hint: 'Multipliziere Zähler und Nenner mit demselben Faktor.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Erweitern', 'gleichwertig', 'Bruch', 'Faktor'],
  fachwissen: {
    text: 'Beim Erweitern eines Bruchs werden Zähler und Nenner mit derselben Zahl k (k ≠ 0) multipliziert. Da man dabei mit k/k = 1 multipliziert, ändert sich der Wert des Bruchs nicht. Erweitern wird gebraucht, um Brüche auf einen gemeinsamen Nenner zu bringen, bevor man sie addiert, subtrahiert oder vergleicht.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    // V1 Tippen — Nenner gesucht (Gegenrichtung zum Haupt-Thema)
    (rng: Rng) => {
      const n = randInt(rng, 1, 6)
      const d = randInt(rng, 2, 8)
      const k = randInt(rng, 2, 6)
      const targetNum = n * k
      return valueTask({
        question: `Erweitere den Bruch ${n}/${d} so, dass der Zähler ${targetNum} wird. Wie lautet der neue Nenner?`,
        answerKind: 'integer',
        value: d * k,
        solution: `${d * k}`,
        explanation: `Der Zähler wird von ${n} auf ${targetNum} vergrößert, also mit ${k} multipliziert (${n} · ${k} = ${targetNum}). Denselben Faktor wendet man auf den Nenner an: ${d} · ${k} = ${d * k}.`,
        dedupeKey: `erw-nenner:${n}:${d}:${k}`,
      })
    },
    // V2 MC — gleichwertigen (erweiterten) Bruch erkennen
    (rng: Rng) => {
      const n = randInt(rng, 1, 7)
      const d = randInt(rng, 2, 9)
      const k = randInt(rng, 2, 5)
      const correct = `${n * k}/${d * k}`
      const wrong1 = `${n * k}/${d}` // nur Zähler erweitert
      const wrong2 = `${n}/${d * k}` // nur Nenner erweitert
      const wrong3 = `${n + k}/${d + k}` // addiert statt multipliziert
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welcher Bruch ist gleichwertig zu ${n}/${d} (erweitert mit dem Faktor ${k})?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `Beim Erweitern werden Zähler UND Nenner mit demselben Faktor multipliziert: ${n} · ${k} = ${n * k} und ${d} · ${k} = ${d * k}, also ${correct}.`,
        dedupeKey: `erw-mc:${n}:${d}:${k}`,
      })
    },
    // V3 Portfolio — Bruchmodell (Balken), Zähler gesucht
    (rng: Rng) => {
      const d = pick(rng, [3, 4, 5, 6])
      const n = randInt(rng, 1, d - 1)
      const k = randInt(rng, 2, 4)
      const targetDen = d * k
      const value = n * k
      return {
        ...valueTask({
          question: `Die beiden Bruchmodelle zeigen gleich große Anteile. Welcher Zähler fehlt beim rechten Bruch mit Nenner ${targetDen}?`,
          answerKind: 'integer',
          value,
          solution: `${value}`,
          explanation: `${n}/${d} wird mit dem Faktor ${k} erweitert: ${n} · ${k} = ${value} und ${d} · ${k} = ${targetDen}.`,
        }),
        visualContent: sideBySideVisual(
          generateFractionBarSvg({ numerator: n, denominator: d }),
          generateFractionBarSvg({ numerator: value, denominator: targetDen, fillColor: '#e67e22' }),
          '=',
        ),
      }
    },
  ),
})

// ---------------------------------------------------------------------------
// 3) Brüche vergleichen
// ---------------------------------------------------------------------------

const vergleichenNeu: Topic = asNeuTopic('lb1-vergleichen', {
  id: 'lb1-vergleichen__neu',
  title: 'Brüche vergleichen',
  hint: 'Bringe beide Brüche auf einen gemeinsamen Nenner.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Vergleichen', 'gemeinsamer Nenner', 'kgV', 'Bruch'],
  fachwissen: {
    text: 'Um zwei Brüche zu vergleichen, bringt man sie auf einen gemeinsamen Nenner (am günstigsten das kgV der Nenner) und vergleicht dann nur noch die Zähler. Alternativ lassen sich beide Brüche in Dezimalzahlen umwandeln und direkt vergleichen. Bei gleichem Nenner ist der Bruch mit dem größeren Zähler der größere Bruch.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    // V1 Tippen — größerer Zahlenraum als im Haupt-Thema
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 1, 11), randInt(rng, 2, 12))
      const b = makeFraction(randInt(rng, 1, 11), randInt(rng, 2, 12))
      const cmp = a.n * b.d - b.n * a.d
      const symbol = cmp < 0 ? '<' : cmp > 0 ? '>' : '='
      const left = a.n * b.d
      const right = b.n * a.d
      return textTask({
        question: `Vergleiche: ${format(a)} ___ ${format(b)}`,
        accepted: [symbol],
        solution: symbol,
        explanation: `Gemeinsamer Nenner ${a.d * b.d}: ${format(a)} = ${left}/${a.d * b.d}, ${format(b)} = ${right}/${a.d * b.d}. Da ${left} ${symbol} ${right}, gilt ${format(a)} ${symbol} ${format(b)}.`,
        dedupeKey: `vgl-tippen:${a.n}:${a.d}:${b.n}:${b.d}`,
      })
    },
    // V2 MC — den größeren Bruch erkennen
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 1, 9), randInt(rng, 2, 10))
      let b = makeFraction(randInt(rng, 1, 9), randInt(rng, 2, 10))
      while (a.n * b.d === b.n * a.d) {
        b = makeFraction(randInt(rng, 1, 9), randInt(rng, 2, 10))
      }
      const aIsBigger = a.n * b.d > b.n * a.d
      const correct = aIsBigger ? format(a) : format(b)
      const otherLabel = aIsBigger ? format(b) : format(a)
      const labeled = shuffleChoices(rng, [format(a), format(b)], correct)
      return choicePickTask({
        question: `Welcher Bruch ist größer: ${format(a)} oder ${format(b)}?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `Gemeinsamer Nenner ${a.d * b.d}: ${format(a)} = ${a.n * b.d}/${a.d * b.d}, ${format(b)} = ${b.n * a.d}/${a.d * b.d}. ${correct} ist größer als ${otherLabel}.`,
        dedupeKey: `vgl-mc:${a.n}:${a.d}:${b.n}:${b.d}`,
      })
    },
    // V3 Portfolio — Rastermodell-Vergleich
    (rng: Rng) => {
      const d = pick(rng, [4, 6, 8, 10, 12])
      const aN = randInt(rng, 1, d - 1)
      const bN = randInt(rng, 1, d - 1)
      const symbol = aN < bN ? '<' : aN > bN ? '>' : '='
      const cols = d === 12 ? 4 : d === 6 ? 3 : 4
      return {
        ...textTask({
          question: 'Vergleiche die eingefärbten Anteile im Rastermodell. Gib <, > oder = ein.',
          accepted: [symbol],
          solution: symbol,
          explanation: `${aN}/${d} ${symbol} ${bN}/${d}, weil bei gleichem Nenner der größere Zähler den größeren Bruch ergibt.`,
        }),
        visualContent: sideBySideVisual(
          generateFractionGridSvg({ numerator: aN, denominator: d, cols }),
          generateFractionGridSvg({ numerator: bN, denominator: d, cols, fillColor: '#e67e22' }),
          '?',
        ),
      }
    },
    // V4 Portfolio — Zahlenstrahl, größeren Wert markieren
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
      let b = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
      while (a.n * b.d === b.n * a.d) {
        b = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
      }
      const valueA = toDecimal(a)
      const valueB = toDecimal(b)
      const value = Math.max(valueA, valueB)
      const biggerLabel = valueA > valueB ? format(a) : format(b)
      return numberLineTask({
        question: `Vergleiche ${format(a)} und ${format(b)}. Markiere den größeren der beiden Werte auf dem Zahlenstrahl.`,
        min: 0,
        max: 1,
        step: 0.05,
        decimals: 2,
        value,
        solution: formatDe(value),
        explanation: `${format(a)} ≈ ${formatDe(roundTo(valueA, 3))} und ${format(b)} ≈ ${formatDe(roundTo(valueB, 3))}. Der größere Wert ist ${biggerLabel} ≈ ${formatDe(value)}.`,
        eps: 0.03,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// 4) Brüche addieren und subtrahieren
// ---------------------------------------------------------------------------

const addSubNeu: Topic = asNeuTopic('lb1-add-sub-brueche', {
  id: 'lb1-add-sub-brueche__neu',
  title: 'Brüche addieren und subtrahieren',
  hint: 'Bringe beide Brüche zuerst auf einen gemeinsamen Nenner.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Addition', 'Subtraktion', 'Brüche', 'gemeinsamer Nenner'],
  fachwissen: {
    text: 'Brüche mit unterschiedlichen Nennern müssen vor dem Addieren oder Subtrahieren erweitert werden, bis beide denselben Nenner haben. Erst dann werden die Zähler addiert bzw. subtrahiert; der gemeinsame Nenner bleibt dabei stehen. Zum Schluss wird das Ergebnis vollständig gekürzt.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    // V1 Tippen — echte, nicht-vielfache Nenner (kgV wirklich nötig)
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 1, 7), pick(rng, [3, 5, 7, 9]))
      const b = makeFraction(randInt(rng, 1, 7), pick(rng, [4, 6, 8, 10]))
      const doAdd = rng() < 0.5 || a.n * b.d < b.n * a.d
      const result = doAdd ? add(a, b) : subtract(a, b)
      const op = doAdd ? '+' : '−'
      const common = a.d * b.d
      const numResult = doAdd ? a.n * b.d + b.n * a.d : a.n * b.d - b.n * a.d
      return fractionTask({
        question: `Berechne: ${format(a)} ${op} ${format(b)}`,
        value: result,
        solution: format(result),
        explanation: `Gemeinsamer Nenner ${common}: ${format(a)} = ${a.n * b.d}/${common}, ${format(b)} = ${b.n * a.d}/${common}. ${op === '+' ? 'Addiere' : 'Subtrahiere'} die Zähler: ${a.n * b.d} ${op} ${b.n * a.d} = ${numResult}. Gekürzt: ${format(result)}.`,
      })
    },
    // V2 MC — typische Fehler als Distraktoren
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 1, 6), randInt(rng, 2, 7))
      const b = makeFraction(randInt(rng, 1, 6), randInt(rng, 2, 7))
      const doAdd = rng() < 0.5 || a.n * b.d < b.n * a.d
      const result = doAdd ? add(a, b) : subtract(a, b)
      const op = doAdd ? '+' : '−'
      const correct = format(result)
      const wrong1 = doAdd
        ? `${a.n + b.n}/${a.d + b.d}`
        : `${Math.abs(a.n - b.n)}/${Math.abs(a.d - b.d) || 1}`
      const wrong2 = doAdd ? `${a.n + b.n}/${a.d}` : `${Math.abs(a.n - b.n)}/${a.d}`
      const wrong3 = format(doAdd ? subtract(a, b) : add(a, b))
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welches Ergebnis ist richtig? ${format(a)} ${op} ${format(b)} = ?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${format(a)} ${op} ${format(b)} = ${correct}. Erst auf den gemeinsamen Nenner ${a.d * b.d} erweitern, dann die Zähler verrechnen, zuletzt kürzen.`,
        dedupeKey: `addsub-mc:${a.n}:${a.d}:${b.n}:${b.d}:${op}`,
      })
    },
    // V3 Portfolio — Rastermodell-Addition
    (rng: Rng) => {
      const d = pick(rng, [6, 8, 10, 12])
      const aN = randInt(rng, 1, d - 2)
      const bN = randInt(rng, 1, d - aN)
      const a = makeFraction(aN, d)
      const b = makeFraction(bN, d)
      const result = add(a, b)
      const cols = d === 12 ? 4 : d === 6 ? 3 : 5
      return {
        ...fractionTask({
          question: 'Addiere die beiden im Rastermodell dargestellten Bruchanteile. Gib den gekürzten Bruch an.',
          value: result,
          solution: format(result),
          explanation: `Gleicher Nenner ${d}: ${format(a)} + ${format(b)} = ${aN + bN}/${d}. Gekürzt: ${format(result)}.`,
        }),
        visualContent: sideBySideVisual(
          generateFractionGridSvg({ numerator: aN, denominator: d, cols }),
          generateFractionGridSvg({ numerator: bN, denominator: d, cols, fillColor: '#e67e22' }),
          '+',
        ),
      }
    },
  ),
})

// ---------------------------------------------------------------------------
// 5) Brüche multiplizieren
// ---------------------------------------------------------------------------

const multNeu: Topic = asNeuTopic('lb1-mult-brueche', {
  id: 'lb1-mult-brueche__neu',
  title: 'Brüche multiplizieren',
  hint: 'Zähler mal Zähler, Nenner mal Nenner – dann kürzen.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Multiplikation', 'Brüche', 'kürzen', 'Produkt'],
  fachwissen: {
    text: 'Zwei Brüche multipliziert man, indem man Zähler mal Zähler und Nenner mal Nenner rechnet: a/b · c/d = (a·c)/(b·d). Vor dem Ausmultiplizieren lohnt sich oft ein kreuzweises Kürzen, um mit kleineren Zahlen zu rechnen. Das Produkt zweier echter Brüche ist stets kleiner als jeder der beiden Faktoren.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    // V1 Tippen — größerer Zahlenraum
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 2, 11), randInt(rng, 3, 12))
      const b = makeFraction(randInt(rng, 2, 11), randInt(rng, 3, 12))
      const result = multiply(a, b)
      return fractionTask({
        question: `Berechne: ${format(a)} · ${format(b)}`,
        value: result,
        solution: format(result),
        explanation: `Zähler mal Zähler, Nenner mal Nenner: (${a.n} · ${b.n}) / (${a.d} · ${b.d}) = ${a.n * b.n}/${a.d * b.d}. Gekürzt: ${format(result)}.`,
      })
    },
    // V2 MC — typische Fehler (Addition statt Multiplikation, falscher Nenner)
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 2, 9), randInt(rng, 3, 10))
      const b = makeFraction(randInt(rng, 2, 9), randInt(rng, 3, 10))
      const result = multiply(a, b)
      const correct = format(result)
      const wrong1 = format(add(a, b)) // Verwechslung mit Addition
      const wrong2 = `${a.n * b.n}/${a.d}` // nur einen Nenner verwendet
      const wrong3 = `${a.n + b.n}/${a.d * b.d}` // Zähler addiert statt multipliziert
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welches Ergebnis ist richtig? ${format(a)} · ${format(b)} = ?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${format(a)} · ${format(b)} = (${a.n} · ${b.n})/(${a.d} · ${b.d}) = ${correct}. Bei der Multiplikation werden Zähler und Nenner jeweils miteinander multipliziert, nicht addiert.`,
        dedupeKey: `mult-mc:${a.n}:${a.d}:${b.n}:${b.d}`,
      })
    },
    // V3 Portfolio — Flächenmodell der Faktoren
    (rng: Rng) => {
      const d1 = pick(rng, [2, 3, 4])
      const d2 = pick(rng, [2, 3, 4])
      const n1 = randInt(rng, 1, d1 - 1)
      const n2 = randInt(rng, 1, d2 - 1)
      const a = makeFraction(n1, d1)
      const b = makeFraction(n2, d2)
      const result = multiply(a, b)
      return {
        ...fractionTask({
          question: 'Die beiden Bruchmodelle zeigen die Faktoren einer Multiplikation. Berechne das Produkt (gekürzt).',
          value: result,
          solution: format(result),
          explanation: `${format(a)} · ${format(b)} = (${n1} · ${n2})/(${d1} · ${d2}) = ${n1 * n2}/${d1 * d2}. Gekürzt: ${format(result)}.`,
        }),
        visualContent: sideBySideVisual(
          generateFractionBarSvg({ numerator: n1, denominator: d1 }),
          generateFractionBarSvg({ numerator: n2, denominator: d2, fillColor: '#e67e22' }),
          '·',
        ),
      }
    },
  ),
})

// ---------------------------------------------------------------------------
// 6) Brüche dividieren
// ---------------------------------------------------------------------------

const divNeu: Topic = asNeuTopic('lb1-div-brueche', {
  id: 'lb1-div-brueche__neu',
  title: 'Brüche dividieren',
  hint: 'Durch einen Bruch teilen heißt: mit dem Kehrwert multiplizieren.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Division', 'Kehrwert', 'Brüche', 'Quotient'],
  fachwissen: {
    text: 'Durch einen Bruch zu dividieren bedeutet, mit seinem Kehrwert zu multiplizieren: a/b ÷ c/d = a/b · d/c. Den Kehrwert eines Bruchs erhält man, indem man Zähler und Nenner vertauscht. Diese Regel gilt, weil das Produkt eines Bruchs mit seinem Kehrwert immer 1 ergibt.',
    quelle: 'Wikipedia: Kehrwert',
    url: 'https://de.wikipedia.org/wiki/Kehrwert',
  },
  generate: mixedVariants(
    // V1 Tippen — größerer Zahlenraum
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 2, 9), randInt(rng, 3, 10))
      const b = makeFraction(randInt(rng, 2, 9), randInt(rng, 3, 10))
      const result = divide(a, b)
      return fractionTask({
        question: `Berechne: ${format(a)} : ${format(b)}`,
        value: result,
        solution: format(result),
        explanation: `Durch einen Bruch teilt man, indem man mit seinem Kehrwert multipliziert: ${format(a)} · ${b.d}/${b.n} = (${a.n} · ${b.d})/(${a.d} · ${b.n}) = ${a.n * b.d}/${a.d * b.n}. Gekürzt: ${format(result)}.`,
      })
    },
    // V2 MC — typische Fehler (Kehrwert vergessen, vertauschte Reihenfolge)
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 1, 8), randInt(rng, 2, 9))
      const b = makeFraction(randInt(rng, 1, 8), randInt(rng, 2, 9))
      const result = divide(a, b)
      const correct = format(result)
      const wrong1 = format(multiply(a, b)) // Kehrwert vergessen
      const wrong2 = `${a.n * b.n}/${a.d * b.d}` // wie Multiplikation gerechnet
      const wrong3 = format(divide(b, a)) // Reihenfolge vertauscht
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welches Ergebnis ist richtig? ${format(a)} : ${format(b)} = ?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${format(a)} : ${format(b)} = ${format(a)} · ${b.d}/${b.n} = ${correct}. Beim Dividieren wird mit dem Kehrwert des zweiten Bruchs multipliziert.`,
        dedupeKey: `div-mc:${a.n}:${a.d}:${b.n}:${b.d}`,
      })
    },
    // V3 MC — Kehrwert-Konzept isoliert
    (rng: Rng) => {
      let a = makeFraction(randInt(rng, 2, 11), randInt(rng, 2, 11))
      while (a.n === a.d) {
        a = makeFraction(randInt(rng, 2, 11), randInt(rng, 2, 11))
      }
      const correct = `${a.d}/${a.n}`
      const wrong1 = `${a.n}/${a.d}` // Bruch selbst, nicht vertauscht
      const wrong2 = `${a.d}/${a.d}`
      const wrong3 = `${a.n}/${a.n}`
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Was ist der Kehrwert von ${format(a)}?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `Der Kehrwert eines Bruchs entsteht durch Vertauschen von Zähler und Nenner: Der Kehrwert von ${format(a)} ist ${correct}.`,
        dedupeKey: `div-kehrwert:${a.n}:${a.d}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// 7) Brüche in Dezimalzahlen umwandeln
// ---------------------------------------------------------------------------

const bruchDezimalNeu: Topic = asNeuTopic('lb1-bruch-dezimal', {
  id: 'lb1-bruch-dezimal__neu',
  title: 'Brüche in Dezimalzahlen umwandeln',
  hint: 'Dividiere Zähler durch Nenner.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Dezimalzahl', 'Bruch', 'periodisch', 'endlich'],
  fachwissen: {
    text: 'Jeder Bruch p/q lässt sich durch die Division p : q in eine Dezimalzahl umwandeln. Enthält der gekürzte Nenner nur die Primfaktoren 2 und 5, entsteht eine endliche Dezimalzahl. Andernfalls entsteht eine periodische Dezimalzahl mit einem sich wiederholenden Ziffernblock, z. B. 1/3 = 0,333….',
    quelle: 'Wikipedia: Dezimalbruch',
    url: 'https://de.wikipedia.org/wiki/Dezimalbruch',
  },
  generate: mixedVariants(
    // V1 MC — Bruch -> Dezimalzahl
    (rng: Rng) => {
      const denom = pick(rng, [2, 4, 5, 8, 10, 20, 25])
      const n = randInt(rng, 1, denom - 1)
      const f = makeFraction(n, denom)
      const value = toDecimal(f)
      const correct = formatDe(value)
      const wrong1 = formatDe(roundTo(value + 0.1, 2))
      const wrong2 = formatDe(roundTo(n / (denom + 1), 3))
      const wrong3 = formatDe(roundTo(denom / n, 2))
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welcher Dezimalwert entspricht ${format(f)}?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${format(f)} bedeutet ${f.n} : ${f.d} = ${correct}.`,
        dedupeKey: `bd-mc:${f.n}:${f.d}`,
      })
    },
    // V2 Umkehrung — Dezimalzahl -> vollständig gekürzter Bruch
    (rng: Rng) => {
      const denom = pick(rng, [2, 4, 5, 8, 10, 20])
      const whole = randInt(rng, 1, denom - 1)
      const value = whole / denom
      const target = makeFraction(whole, denom)
      return fractionTask({
        question: `Wandle die Dezimalzahl ${formatDe(value)} in einen vollständig gekürzten Bruch um.`,
        value: target,
        requireReduced: true,
        solution: format(target),
        explanation: `${formatDe(value)} = ${whole}/${denom}. Gekürzt (ggT ${gcd(whole, denom)}): ${format(target)}.`,
      })
    },
    // V3 Portfolio — Kreismodell
    (rng: Rng) => {
      const denom = pick(rng, [4, 5, 8, 10])
      const n = randInt(rng, 1, denom - 1)
      const value = toDecimal(makeFraction(n, denom))
      return visualTask({
        question: 'Welcher Dezimalwert entspricht dem im Kreis eingefärbten Anteil?',
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `${n}/${denom} = ${formatDe(value)}.`,
        visualContent: generateFractionCircleSvg({ numerator: n, denominator: denom }),
      })
    },
    // V4 MC — Konzept: endlich vs. periodisch
    (rng: Rng) => {
      const terminating = makeFraction(randInt(rng, 1, 7), pick(rng, [2, 4, 5, 8, 10]))
      const repeating = makeFraction(randInt(rng, 1, 7), pick(rng, [3, 7, 9, 11, 13]))
      const terminatingLabel = format(terminating)
      const repeatingLabel = format(repeating)
      const correct = repeatingLabel
      const labeled = shuffleChoices(rng, [terminatingLabel, repeatingLabel], correct)
      return choicePickTask({
        question: 'Welcher der beiden Brüche ergibt eine periodische (unendliche) Dezimalzahl?',
        choices: labeled,
        correct,
        solution: correct,
        explanation: `Der Nenner von ${repeatingLabel} enthält nach dem Kürzen einen anderen Primfaktor als 2 oder 5 – die Dezimalzahl wird periodisch. ${terminatingLabel} hat einen Nenner mit nur den Primfaktoren 2 und 5 und ergibt eine endliche Dezimalzahl.`,
        dedupeKey: `bd-periodisch:${terminating.n}:${terminating.d}:${repeating.n}:${repeating.d}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// 8) In Prozent umwandeln
// ---------------------------------------------------------------------------

const prozentNeu: Topic = asNeuTopic('lb1-prozent', {
  id: 'lb1-prozent__neu',
  title: 'In Prozent umwandeln',
  hint: 'Prozent bedeutet „von Hundert".',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Prozent', 'Bruch', 'Dezimalzahl', 'von Hundert'],
  fachwissen: {
    text: 'Prozent bedeutet „von Hundert" (lateinisch per centum). Ein Prozentsatz p % entspricht dem Bruch p/100 bzw. der Dezimalzahl p/100. Um zwischen Bruch, Dezimalzahl und Prozent zu wechseln, nutzt man stets den Nenner bzw. Faktor 100 als gemeinsame Brücke.',
    quelle: 'Wikipedia: Prozentrechnung',
    url: 'https://de.wikipedia.org/wiki/Prozentrechnung',
  },
  generate: mixedVariants(
    // V1 MC — Bruch -> Prozent
    (rng: Rng) => {
      const denom = pick(rng, [2, 4, 5, 10, 20, 25, 50])
      const n = randInt(rng, 1, denom - 1)
      const f = makeFraction(n, denom)
      const value = roundTo(toDecimal(f) * 100, 2)
      const correct = `${formatDe(value)} %`
      const wrong1 = `${formatDe(roundTo(value / 10, 2))} %`
      const wrong2 = `${formatDe(roundTo(value + 10, 2))} %`
      const wrong3 = `${n} %`
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Wie viel Prozent sind ${format(f)}?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${format(f)} · 100 = ${formatDe(value)} %.`,
        dedupeKey: `proz-mc:${f.n}:${f.d}`,
      })
    },
    // V2 Umkehrung — Prozent -> vollständig gekürzter Bruch
    (rng: Rng) => {
      const percent = pick(rng, [5, 10, 20, 25, 40, 50, 60, 75, 80])
      const target = makeFraction(percent, 100)
      return fractionTask({
        question: `Wandle ${percent} % in einen vollständig gekürzten Bruch um.`,
        value: target,
        requireReduced: true,
        solution: format(target),
        explanation: `${percent} % = ${percent}/100. Gekürzt (ggT ${gcd(percent, 100)}): ${format(target)}.`,
      })
    },
    // V3 Umkehrung — Prozent -> Dezimalzahl
    (rng: Rng) => {
      const percent = randInt(rng, 1, 99)
      const value = percent / 100
      return valueTask({
        question: `Welche Dezimalzahl entspricht ${percent} %?`,
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `Teile durch 100: ${percent} : 100 = ${formatDe(value)}.`,
        dedupeKey: `proz-reverse-dez:${percent}`,
      })
    },
    // V4 Portfolio — Rastermodell
    (rng: Rng) => {
      const denom = pick(rng, [4, 5, 8, 10, 20])
      const n = randInt(rng, 1, denom - 1)
      const value = roundTo((n / denom) * 100, 2)
      const cols = denom <= 8 ? denom : Math.ceil(Math.sqrt(denom))
      return visualTask({
        question: 'Wie viel Prozent des Rasters sind eingefärbt?',
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `${n} von ${denom} Feldern = ${n}/${denom} = ${formatDe(value)} %.`,
        visualContent: generateFractionGridSvg({ numerator: n, denominator: denom, cols }),
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// 9) Dezimalzahlen addieren und subtrahieren
// ---------------------------------------------------------------------------

const dezAddSubNeu: Topic = asNeuTopic('lb1-dez-add-sub', {
  id: 'lb1-dez-add-sub__neu',
  title: 'Dezimalzahlen addieren und subtrahieren',
  hint: 'Schreibe die Zahlen kommagerecht untereinander.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Dezimalzahl', 'Addition', 'Subtraktion', 'Komma'],
  fachwissen: {
    text: 'Bei mehreren Dezimalzahlen wird genauso stellenweise gerechnet wie bei zwei Zahlen: Alle Zahlen kommagerecht untereinanderschreiben und von rechts nach links rechnen. Reihenfolge und Klammerung sind bei reinen Additionen egal; bei gemischten Rechnungen mit Subtraktion ist die Reihenfolge wichtig.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: mixedVariants(
    // V1 Tippen — Dreierkette aus Addition/Subtraktion
    (rng: Rng) => {
      const a = randInt(rng, 10, 599) / 10
      const b = randInt(rng, 10, 599) / 10
      const c = randInt(rng, 10, 599) / 10
      const op1 = rng() < 0.5 ? '+' : '−'
      const afterFirst = roundTo(op1 === '+' ? a + b : a - b, 2)
      const op2 = rng() < 0.5 || afterFirst < c ? '+' : '−'
      const value = roundTo(op2 === '+' ? afterFirst + c : afterFirst - c, 2)
      return valueTask({
        question: `Berechne: ${formatDe(a)} ${op1} ${formatDe(b)} ${op2} ${formatDe(c)}`,
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `Rechne von links nach rechts: ${formatDe(a)} ${op1} ${formatDe(b)} = ${formatDe(afterFirst)}. Dann ${formatDe(afterFirst)} ${op2} ${formatDe(c)} = ${formatDe(value)}.`,
        dedupeKey: `dezas-tippen:${a}:${op1}:${b}:${op2}:${c}`,
      })
    },
    // V2 MC — typische Fehler (Komma verschoben, falsche Operation)
    (rng: Rng) => {
      const a = randInt(rng, 10, 899) / 10
      const b = randInt(rng, 10, 899) / 10
      const doAdd = rng() < 0.5 || a < b
      const value = roundTo(doAdd ? a + b : a - b, 2)
      const op = doAdd ? '+' : '−'
      const correct = formatDe(value)
      const wrong1 = formatDe(roundTo(value + 1, 2))
      const wrong2 = formatDe(roundTo(doAdd ? a - b : a + b, 2))
      const wrong3 = formatDe(roundTo(value / 10, 2))
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welches Ergebnis ist richtig? ${formatDe(a)} ${op} ${formatDe(b)} = ?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${formatDe(a)} ${op} ${formatDe(b)} = ${correct}. Achte auf die kommagerechte Ausrichtung der Stellen.`,
        dedupeKey: `dezas-mc:${a}:${op}:${b}`,
      })
    },
    // V3 Ergänzen — Zusammenhang zur Subtraktion
    (rng: Rng) => {
      const b = randInt(rng, 10, 799) / 10
      const extra = randInt(rng, 10, 799) / 10
      const sum = roundTo(b + extra, 2)
      return valueTask({
        question: `Ergänze: ${formatDe(b)} + ___ = ${formatDe(sum)}`,
        answerKind: 'decimal',
        value: extra,
        solution: formatDe(extra),
        explanation: `${formatDe(sum)} − ${formatDe(b)} = ${formatDe(extra)}, denn ${formatDe(b)} + ${formatDe(extra)} = ${formatDe(sum)}.`,
        dedupeKey: `dezas-erg:${b}:${extra}`,
      })
    },
    // V4 Sachaufgabe — Geldbeträge
    (rng: Rng) => {
      const preis1 = randInt(rng, 100, 1999) / 100
      const preis2 = randInt(rng, 100, 1999) / 100
      const value = roundTo(preis1 + preis2, 2)
      return valueTask({
        question: `Ein Heft kostet ${formatDe(preis1)} €, ein Lineal kostet ${formatDe(preis2)} €. Wie viel kosten beide zusammen?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Addiere die beiden Preise: ${formatDe(preis1)} € + ${formatDe(preis2)} € = ${formatDe(value)} €.`,
        dedupeKey: `dezas-geld:${preis1}:${preis2}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// 10) Dezimalzahlen multiplizieren
// ---------------------------------------------------------------------------

const dezMultNeu: Topic = asNeuTopic('lb1-dez-mult', {
  id: 'lb1-dez-mult__neu',
  title: 'Dezimalzahlen multiplizieren',
  hint: 'Zähle die Nachkommastellen beider Faktoren zusammen.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Dezimalzahl', 'Multiplikation', 'Komma', 'Nachkommastellen'],
  fachwissen: {
    text: 'Zwei Dezimalzahlen multipliziert man, indem man zunächst wie mit natürlichen Zahlen rechnet und am Ende das Komma setzt: Die Anzahl der Nachkommastellen im Ergebnis entspricht der Summe der Nachkommastellen beider Faktoren. Beispiel: 2,5 (1 Nachkommastelle) · 1,2 (1 Nachkommastelle) = 3,00, also 2 Nachkommastellen vor dem Streichen der Null.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: mixedVariants(
    // V1 Tippen — Dezimalzahl mal Dezimalzahl (nicht nur ×natürliche Zahl)
    (rng: Rng) => {
      const a = randInt(rng, 11, 99) / 10
      const b = randInt(rng, 11, 99) / 10
      const value = roundTo(a * b, 2)
      return valueTask({
        question: `Berechne: ${formatDe(a)} · ${formatDe(b)}`,
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `Rechne wie mit natürlichen Zahlen (${Math.round(a * 10)} · ${Math.round(b * 10)} = ${Math.round(a * 10) * Math.round(b * 10)}) und setze dann das Komma 2 Stellen von rechts: ${formatDe(a)} · ${formatDe(b)} = ${formatDe(value)}.`,
        dedupeKey: `dezmul-tippen:${a}:${b}`,
      })
    },
    // V2 MC — typische Fehler (Komma falsch gesetzt)
    (rng: Rng) => {
      const a = randInt(rng, 12, 89) / 10
      const factor = pick(rng, [2, 3, 4, 6])
      const value = roundTo(a * factor, 2)
      const correct = formatDe(value)
      const wrong1 = formatDe(roundTo(value * 10, 2))
      const wrong2 = formatDe(roundTo(value / 10, 2))
      const wrong3 = formatDe(roundTo(a + factor, 2))
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welches Ergebnis ist richtig? ${formatDe(a)} · ${factor} = ?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${formatDe(a)} · ${factor} = ${correct}. Rechne wie mit natürlichen Zahlen und setze das Komma am Ende richtig.`,
        dedupeKey: `dezmul-mc:${a}:${factor}`,
      })
    },
    // V3 MC — Zehnerpotenzen (Komma-Verschiebung)
    (rng: Rng) => {
      const a = randInt(rng, 11, 299) / 100
      const power = pick(rng, [10, 100])
      const value = roundTo(a * power, power === 10 ? 1 : 0)
      const shift = power === 10 ? 'eine Stelle' : 'zwei Stellen'
      const correct = formatDe(value)
      const wrong1 = formatDe(roundTo(a / power, 4))
      const wrong2 = formatDe(a)
      const wrong3 = formatDe(roundTo(a * power * 10, 2))
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Wie lautet ${formatDe(a)} · ${power}?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `Multiplizieren mit ${power} verschiebt das Komma um ${shift} nach rechts: ${formatDe(a)} · ${power} = ${correct}.`,
        dedupeKey: `dezmul-zehnerpotenz:${a}:${power}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// 11) Dezimalzahlen dividieren
// ---------------------------------------------------------------------------

const dezDivNeu: Topic = asNeuTopic('lb1-dez-div', {
  id: 'lb1-dez-div__neu',
  title: 'Dezimalzahlen dividieren',
  hint: 'Teile wie bei natürlichen Zahlen und setze das Komma richtig.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Dezimalzahl', 'Division', 'Komma', 'Zehnerpotenz'],
  fachwissen: {
    text: 'Beim Dividieren einer Dezimalzahl durch eine natürliche Zahl rechnet man wie mit ganzen Zahlen und setzt das Komma im Ergebnis an der passenden Stelle. Beim Dividieren durch 10, 100, 1000 … verschiebt sich das Komma dagegen einfach um 1, 2, 3 … Stellen nach links.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: mixedVariants(
    // V1 Tippen — größerer Zahlenraum, andere Divisoren
    (rng: Rng) => {
      const divisor = pick(rng, [3, 4, 6, 8, 25])
      const quotient = randInt(rng, 11, 399) / 10
      const dividend = roundTo(quotient * divisor, 2)
      return valueTask({
        question: `Berechne: ${formatDe(dividend)} : ${divisor}`,
        answerKind: 'decimal',
        value: quotient,
        solution: formatDe(quotient),
        explanation: `Teile wie bei natürlichen Zahlen und setze das Komma richtig: ${formatDe(dividend)} : ${divisor} = ${formatDe(quotient)}.`,
        dedupeKey: `dezdiv-tippen:${dividend}:${divisor}`,
      })
    },
    // V2 MC — typische Fehler
    (rng: Rng) => {
      const divisor = pick(rng, [2, 4, 5, 8])
      const quotient = randInt(rng, 11, 199) / 10
      const dividend = roundTo(quotient * divisor, 2)
      const correct = formatDe(quotient)
      const wrong1 = formatDe(roundTo(quotient * 10, 2))
      const wrong2 = formatDe(roundTo(quotient / 10, 2))
      const wrong3 = formatDe(roundTo(dividend * divisor, 2))
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Welches Ergebnis ist richtig? ${formatDe(dividend)} : ${divisor} = ?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${formatDe(dividend)} : ${divisor} = ${correct}. Teile wie bei natürlichen Zahlen und setze das Komma an die richtige Stelle.`,
        dedupeKey: `dezdiv-mc:${dividend}:${divisor}`,
      })
    },
    // V3 MC — Zehnerpotenzen (Komma-Verschiebung nach links)
    (rng: Rng) => {
      const value = randInt(rng, 110, 9999) / 10
      const power = pick(rng, [10, 100])
      const result = roundTo(value / power, power === 10 ? 2 : 3)
      const correct = formatDe(result)
      const wrong1 = formatDe(roundTo(value * power, 1))
      const wrong2 = formatDe(value)
      const wrong3 = formatDe(roundTo(result * 10, 3))
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Wie lautet ${formatDe(value)} : ${power}?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `Dividieren durch ${power} verschiebt das Komma um ${power === 10 ? 'eine Stelle' : 'zwei Stellen'} nach links: ${formatDe(value)} : ${power} = ${correct}.`,
        dedupeKey: `dezdiv-zehnerpotenz:${value}:${power}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// 12) Dezimalzahlen runden
// ---------------------------------------------------------------------------

const rundenNeu: Topic = asNeuTopic('lb1-runden', {
  id: 'lb1-runden__neu',
  title: 'Dezimalzahlen runden',
  hint: 'Schau auf die Ziffer rechts von der Rundungsstelle.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Runden', 'Dezimalzahl', 'Rundungsstelle', 'Cent'],
  fachwissen: {
    text: 'Beim Runden einer Dezimalzahl schaut man auf die Ziffer rechts der gewünschten Rundungsstelle: Ist sie 0 bis 4, bleibt die Rundungsstelle gleich (abrunden); ist sie 5 bis 9, wird sie um 1 erhöht (aufrunden). Alle Ziffern rechts der Rundungsstelle entfallen danach. Geldbeträge werden meist auf zwei Nachkommastellen (Cent) gerundet.',
    quelle: 'Wikipedia: Runden (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Runden_(Mathematik)',
  },
  generate: mixedVariants(
    // V1 Tippen — Geldbetrag auf Cent runden
    (rng: Rng) => {
      const value = randInt(rng, 1000, 49999) / 1000
      const rounded = roundTo(value, 2)
      return valueTask({
        question: `Ein Produkt kostet genau ${formatDe(value)} €. Runde den Preis auf volle Cent (2 Nachkommastellen).`,
        unit: '€',
        answerKind: 'decimal',
        value: rounded,
        eps: 1e-9,
        solution: `${formatDe(rounded)} €`,
        explanation: `Schau auf die 3. Nachkommastelle: Ist sie 5 oder größer, wird aufgerundet, sonst abgerundet. ${formatDe(value)} € ≈ ${formatDe(rounded)} €.`,
        dedupeKey: `runden-cent:${value}`,
      })
    },
    // V2 MC — typische Fehler (falsch gerundet, gar nicht gerundet)
    (rng: Rng) => {
      const value = randInt(rng, 1000, 99999) / 1000
      const places = pick(rng, [0, 1, 2])
      const rounded = roundTo(value, places)
      const correct = formatDe(rounded)
      const stepSize = Math.pow(10, -places)
      const wrong1 = formatDe(roundTo(rounded + stepSize, places))
      const wrong2 = formatDe(roundTo(rounded - stepSize, places))
      const wrong3 = formatDe(value)
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      const label = places === 0 ? 'eine ganze Zahl' : `${places} Nachkommastelle${places > 1 ? 'n' : ''}`
      return choicePickTask({
        question: `Welcher Wert entsteht, wenn man ${formatDe(value)} auf ${label} rundet?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `Schau auf die Ziffer nach der Rundungsstelle: ${formatDe(value)} ≈ ${correct}.`,
        dedupeKey: `runden-mc:${value}:${places}`,
      })
    },
    // V3 Portfolio — Zahlenstrahl, gerundeten Nachbarn markieren
    (rng: Rng) => {
      const place = pick(rng, [0.1, 1])
      const multiplier = randInt(rng, 3, 90)
      const lower = roundTo(multiplier * place, 2)
      const upper = roundTo(lower + place, 2)
      const offsetSteps = randInt(rng, 1, 8)
      const n = roundTo(lower + (offsetSteps * place) / 10, 2)
      const value = n - lower >= place / 2 ? upper : lower
      return numberLineTask({
        question: `${formatDe(n)} liegt zwischen ${formatDe(lower)} und ${formatDe(upper)}. Markiere auf dem Zahlenstrahl, auf welchen Wert ${formatDe(n)} gerundet wird.`,
        min: roundTo(lower - place / 2, 2),
        max: roundTo(upper + place / 2, 2),
        step: place / 10,
        decimals: place === 0.1 ? 2 : 1,
        value,
        solution: formatDe(value),
        explanation: `${formatDe(n)} liegt näher an ${formatDe(value)} (ab der Mitte wird aufgerundet, sonst abgerundet).`,
        eps: place / 20,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// 13) Sachaufgabe: Bruchrechnung im Alltag
// ---------------------------------------------------------------------------

const sachaufgabeBruchNeu: Topic = asNeuTopic('lb1-sachaufgabe-bruch', {
  id: 'lb1-sachaufgabe-bruch__neu',
  title: 'Sachaufgabe: Bruchrechnung im Alltag',
  hint: 'Überlege erst, welcher Bruch gesucht ist, dann rechne.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sachaufgabe', 'Bruch', 'Anteil', 'Alltag'],
  fachwissen: {
    text: 'Bei Sachaufgaben zur Bruchrechnung muss man zuerst erkennen, welche Größe gesucht ist. Ist der Anteil einer Gesamtmenge gesucht, multipliziert man die Gesamtmenge mit dem Bruch. Ist dagegen die Gesamtmenge gesucht und nur ein Anteil bekannt, rechnet man zuerst auf einen Teil (dividieren) und dann auf das Ganze hoch (multiplizieren). Das Ergebnis sollte stets auf Plausibilität geprüft werden.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    // V1 Tippen — neue Kontexte (Rezept, Taschengeld, Buch)
    (rng: Rng) => {
      const d = pick(rng, [2, 3, 4, 5, 8])
      const n = randInt(rng, 1, d - 1)
      const gesamt = d * randInt(rng, 3, 12)
      const value = (n / d) * gesamt
      const ctx = pick(rng, [
        {
          id: 'rezept',
          unit: 'g',
          text: (g: number, nn: number, dd: number) =>
            `Ein Rezept braucht ${g} g Mehl. ${nn}/${dd} davon sind Vollkornmehl. Wie viele Gramm Vollkornmehl werden gebraucht?`,
        },
        {
          id: 'taschengeld',
          unit: '€',
          text: (g: number, nn: number, dd: number) =>
            `Lea hat ${g} € Taschengeld. Sie spart ${nn}/${dd} davon. Wie viele Euro spart sie?`,
        },
        {
          id: 'buch',
          unit: '',
          text: (g: number, nn: number, dd: number) =>
            `Ein Buch hat ${g} Seiten. Tom hat bereits ${nn}/${dd} des Buches gelesen. Wie viele Seiten hat er gelesen?`,
        },
      ])
      return valueTask({
        question: ctx.text(gesamt, n, d),
        unit: ctx.unit || undefined,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)}${ctx.unit ? ' ' + ctx.unit : ''}`,
        explanation: `${n}/${d} von ${gesamt}: ${gesamt} : ${d} = ${gesamt / d}, dann mal ${n}: ${gesamt / d} · ${n} = ${formatDe(value)}.`,
        dedupeKey: `sach-tippen:${ctx.id}:${n}:${d}:${gesamt}`,
      })
    },
    // V2 MC — Sachaufgabe mit typischen Fehlern als Distraktoren
    (rng: Rng) => {
      const d = pick(rng, [3, 4, 5, 6])
      const n = randInt(rng, 1, d - 1)
      const gesamt = d * randInt(rng, 2, 10)
      const value = (n / d) * gesamt
      const correct = `${formatDe(value)}`
      const wrong1 = `${formatDe(gesamt - value)}` // Restmenge statt Anteil
      const wrong2 = `${formatDe(gesamt)}` // Gesamtmenge statt Anteil
      const wrong3 = `${formatDe(value * d)}` // falscher Faktor
      const labeled = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `In einer Sporthalle gibt es ${gesamt} Plätze. ${n}/${d} davon sind von der 6. Klasse belegt. Wie viele Plätze belegt die 6. Klasse?`,
        choices: labeled,
        correct,
        solution: correct,
        explanation: `${n}/${d} von ${gesamt}: ${gesamt} : ${d} = ${gesamt / d}, dann mal ${n}: ${gesamt / d} · ${n} = ${correct}.`,
        dedupeKey: `sach-mc:${n}:${d}:${gesamt}`,
      })
    },
    // V3 Umkehrung — Gesamtmenge gesucht
    (rng: Rng) => {
      const d = pick(rng, [2, 3, 4, 5])
      const n = randInt(rng, 1, d - 1)
      const proTeil = randInt(rng, 2, 20)
      const anteilBetrag = proTeil * n
      const gesamt = proTeil * d
      return valueTask({
        question: `${n}/${d} einer Schulbücherei sind ${anteilBetrag} Bücher. Wie viele Bücher hat die Bücherei insgesamt?`,
        unit: 'Bücher',
        answerKind: 'integer',
        value: gesamt,
        solution: `${gesamt} Bücher`,
        explanation: `${n} Teile entsprechen ${anteilBetrag} Büchern, also entspricht 1 Teil ${anteilBetrag} : ${n} = ${proTeil} Büchern. Das Ganze (${d} Teile) sind dann ${proTeil} · ${d} = ${gesamt} Bücher.`,
        dedupeKey: `sach-reverse:${n}:${d}:${anteilBetrag}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Lernbereich 2 — Zuordnungen in der Umwelt
// ---------------------------------------------------------------------------

// 14) Proportionale Zuordnung (Dreisatz)
const proportionalNeu: Topic = asNeuTopic('lb2-proportional', {
  id: 'lb2-proportional__neu',
  title: 'Proportionale Zuordnung (Dreisatz)',
  hint: 'Rechne erst auf eine Einheit zurück, dann auf die gesuchte Menge hoch.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Proportional', 'Dreisatz', 'Zuordnung', 'Faktor'],
  fachwissen: {
    text: 'Bei einer proportionalen Zuordnung ist der Quotient y : x für alle Wertepaare gleich groß; man nennt ihn Proportionalitätsfaktor k, und es gilt y = k · x. Verdoppelt sich x, verdoppelt sich auch y. Im Koordinatensystem liegen alle Punkte einer proportionalen Zuordnung auf einer Geraden durch den Ursprung.',
    quelle: 'Wikipedia: Dreisatz',
    url: 'https://de.wikipedia.org/wiki/Dreisatz',
  },
  generate: mixedVariants(
    // V1 Tippen — Benzinverbrauch, größerer Kontext als Haupt-Thema
    (rng: Rng) => {
      const literPer100 = pick(rng, [5.5, 6, 6.5, 7, 7.5, 8, 9])
      const km = pick(rng, [120, 150, 200, 250, 300, 400])
      const askKm = pick(rng, [50, 80, 180, 220, 350, 450].filter((k) => k !== km))
      const literFor = roundTo((literPer100 / 100) * km, 2)
      const perKm = literFor / km
      const value = roundTo(perKm * askKm, 2)
      return valueTask({
        question: `Ein Auto verbraucht bei gleichmäßiger Fahrt ${formatDe(literFor)} Liter Benzin für ${km} km (proportional). Wie viele Liter werden für ${askKm} km benötigt?`,
        unit: 'Liter',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} Liter`,
        explanation: `Verbrauch pro km: ${formatDe(literFor)} : ${km} = ${formatDe(roundTo(perKm, 4))} Liter/km. Für ${askKm} km: ${formatDe(roundTo(perKm, 4))} · ${askKm} = ${formatDe(value)} Liter.`,
        dedupeKey: `lb2prop-tippen:${literPer100}:${km}:${askKm}`,
      })
    },
    // V2 MC — welches Wertepaar passt NICHT zum Faktor k
    (rng: Rng) => {
      const k = pick(rng, [0.5, 1.5, 2, 2.5, 3, 4])
      const xsPool = [2, 3, 4, 5, 6, 8, 9, 10]
      const chosen: number[] = []
      for (let i = 0; i < 3; i++) {
        const idx = randInt(rng, 0, xsPool.length - 1)
        chosen.push(xsPool[idx])
        xsPool.splice(idx, 1)
      }
      const correctPairs = chosen.map((x) => `(${x}|${formatDe(roundTo(k * x, 2))})`)
      const wrongX = pick(rng, xsPool)
      const wrongOffset = pick(rng, [1, 2, -1, -2].filter((o) => k * wrongX + o > 0))
      const wrongY = roundTo(k * wrongX + wrongOffset, 2)
      const wrongPair = `(${wrongX}|${formatDe(wrongY)})`
      const choices = shuffleChoices(rng, [...correctPairs, wrongPair], wrongPair)
      return choicePickTask({
        question: `Eine proportionale Zuordnung hat den Faktor k = ${formatDe(k)} (y = k · x). Welches Zahlenpaar (x|y) gehört NICHT dazu?`,
        choices,
        correct: wrongPair,
        solution: wrongPair,
        explanation: `Bei k = ${formatDe(k)} muss y = k · x gelten. Für x = ${wrongX} wäre y = ${formatDe(roundTo(k * wrongX, 2))}, nicht ${formatDe(wrongY)}.`,
        dedupeKey: `lb2prop-mc:${k}:${chosen.join(',')}:${wrongX}:${wrongOffset}`,
      })
    },
    // V3 Portfolio — Wertetabelle mit Dezimalfaktor
    (rng: Rng) => {
      const k = pick(rng, [0.25, 0.5, 0.75, 1.25])
      const xs = [4, 8, 12, 16]
      const missIdx = randInt(rng, 1, xs.length - 1)
      const cells = xs.map((x, i) => ({ x, y: i === missIdx ? null : roundTo(k * x, 2) }))
      const value = roundTo(k * xs[missIdx], 2)
      return visualTask({
        question: 'Die Zuordnung ist proportional. Welche Zahl gehört in die Zelle mit dem Fragezeichen?',
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `Proportionalitätsfaktor k = ${formatDe(k)}. Fehlender Wert: ${xs[missIdx]} · ${formatDe(k)} = ${formatDe(value)}.`,
        visualContent: generateValueTableSvg({
          cells,
          xLabel: 'x',
          yLabel: 'y',
          arrowHint: Number.isInteger(k) ? `· ${k}` : `· ${formatDe(k)}`,
        }),
      })
    },
    // V4 MC — Konzept: Eigenschaften einer proportionalen Zuordnung
    (rng: Rng) => {
      const correct = 'Der Quotient y : x ist für alle Wertepaare gleich groß.'
      const wrong1 = 'Das Produkt x · y ist für alle Wertepaare gleich groß.'
      const wrong2 = 'Je größer x wird, desto kleiner wird y.'
      const wrong3 = 'Der Graph ist eine Gerade, die nicht durch den Ursprung verläuft.'
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Welche Aussage über eine proportionale Zuordnung ist richtig?',
        choices,
        correct,
        solution: correct,
        explanation:
          'Bei einer proportionalen Zuordnung ist der Quotient y : x = k konstant. Ein konstantes Produkt kennzeichnet dagegen eine antiproportionale Zuordnung, und der Graph einer proportionalen Zuordnung ist eine Ursprungsgerade (sie verläuft durch (0|0)).',
      })
    },
  ),
})

// 15) Antiproportionale Zuordnung
const antiproportionalNeu: Topic = asNeuTopic('lb2-antiproportional', {
  id: 'lb2-antiproportional__neu',
  title: 'Antiproportionale Zuordnung',
  hint: 'Produkt x · y bleibt konstant.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Antiproportional', 'Dreisatz', 'Zuordnung', 'Produkt'],
  fachwissen: {
    text: 'Bei einer antiproportionalen Zuordnung ist das Produkt x · y für alle Wertepaare gleich groß: x · y = k. Verdoppelt sich x, halbiert sich y. Typisches Beispiel: Je mehr Maschinen an einer Arbeit beteiligt sind, desto kürzer die benötigte Zeit, da Maschinenzahl mal Zeit stets die gleiche Gesamtarbeit ergibt.',
    quelle: 'Wikipedia: Antiproportionalität',
    url: 'https://de.wikipedia.org/wiki/Antiproportionalit%C3%A4t',
  },
  generate: mixedVariants(
    // V1 Tippen — Maschinen/Baustelle statt Arbeiter
    (rng: Rng) => {
      const machines1 = randInt(rng, 2, 10)
      const perMachine = randInt(rng, 6, 24)
      const total = machines1 * perMachine
      const divisors: number[] = []
      for (let m = 2; m <= 20; m++) if (total % m === 0 && m !== machines1) divisors.push(m)
      const machines2 = divisors.length ? pick(rng, divisors) : machines1
      const hours1 = perMachine
      const hours2 = total / machines2
      return valueTask({
        question: `${machines1} Maschinen füllen gemeinsam einen Lagerplatz in ${hours1} Stunden. Wie lange brauchen ${machines2} Maschinen (gleiche Leistung, antiproportional)?`,
        unit: 'Stunden',
        answerKind: 'decimal',
        value: hours2,
        solution: `${formatDe(hours2)} Stunden`,
        explanation: `Die Gesamtarbeit bleibt gleich: ${machines1} · ${hours1} = ${total} Maschinenstunden. Bei ${machines2} Maschinen: ${total} : ${machines2} = ${formatDe(hours2)} Stunden.`,
        dedupeKey: `lb2anti-tippen:${machines1}:${hours1}:${machines2}`,
      })
    },
    // V2 MC — welches Wertepaar passt NICHT zum Produkt k
    (rng: Rng) => {
      const product = pick(rng, [24, 36, 48, 60, 72, 90])
      const pool = [2, 3, 4, 5, 6, 8, 9, 10, 12].filter((x) => product % x === 0)
      const chosen: number[] = []
      for (let i = 0; i < Math.min(3, pool.length - 1); i++) {
        const idx = randInt(rng, 0, pool.length - 1)
        chosen.push(pool[idx])
        pool.splice(idx, 1)
      }
      const correctPairs = chosen.map((x) => `(${x}|${product / x})`)
      const wrongX = pool.length ? pick(rng, pool) : chosen[0] + 1
      const correctY = product % wrongX === 0 ? product / wrongX : Math.round(product / wrongX)
      const wrongY = correctY + pick(rng, [1, 2, -1, -2])
      const wrongPair = `(${wrongX}|${wrongY})`
      const choices = shuffleChoices(rng, [...correctPairs, wrongPair], wrongPair)
      return choicePickTask({
        question: `Eine antiproportionale Zuordnung hat das Produkt x · y = ${product}. Welches Zahlenpaar (x|y) gehört NICHT dazu?`,
        choices,
        correct: wrongPair,
        solution: wrongPair,
        explanation: `Bei x · y = ${product} muss y = ${product} : x gelten. Für x = ${wrongX} wäre y = ${correctY}, nicht ${wrongY}.`,
        dedupeKey: `lb2anti-mc:${product}:${chosen.join(',')}:${wrongX}:${wrongY}`,
      })
    },
    // V3 Portfolio — Wertetabelle mit Produkt k
    (rng: Rng) => {
      const product = pick(rng, [18, 30, 42, 54])
      const xs = [2, 3, 6, 9].filter((x) => product % x === 0)
      const missIdx = randInt(rng, 1, xs.length - 1)
      const cells = xs.map((x, i) => ({ x, y: i === missIdx ? null : product / x }))
      const value = product / xs[missIdx]
      return visualTask({
        question: 'Die Zuordnung ist antiproportional (x · y konstant). Welche Zahl gehört an die Stelle mit dem Fragezeichen?',
        answerKind: 'integer',
        value,
        solution: `${value}`,
        explanation: `Produkt k = ${product}. Fehlender Wert: ${product} : ${xs[missIdx]} = ${value}.`,
        visualContent: generateValueTableSvg({
          cells,
          xLabel: 'x',
          yLabel: 'y',
          arrowHint: `k=${product}`,
        }),
      })
    },
    // V4 MC — Konzept: Eigenschaften einer antiproportionalen Zuordnung
    (rng: Rng) => {
      const correct = 'Das Produkt x · y ist für alle Wertepaare gleich groß.'
      const wrong1 = 'Der Quotient y : x ist für alle Wertepaare gleich groß.'
      const wrong2 = 'Je größer x wird, desto größer wird auch y.'
      const wrong3 = 'Der Graph ist eine Gerade durch den Ursprung.'
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Welche Aussage über eine antiproportionale Zuordnung ist richtig?',
        choices,
        correct,
        solution: correct,
        explanation:
          'Bei einer antiproportionalen Zuordnung bleibt das Produkt x · y konstant – steigt x, sinkt y im gleichen Verhältnis. Ein konstanter Quotient und eine Ursprungsgerade kennzeichnen dagegen eine proportionale Zuordnung.',
      })
    },
  ),
})

// 16) Relative Häufigkeit in Prozent
const haeufigkeitNeu: Topic = asNeuTopic('lb2-haeufigkeit', {
  id: 'lb2-haeufigkeit__neu',
  title: 'Relative Häufigkeit in Prozent',
  hint: 'Relative Häufigkeit = Anzahl der Treffer : Gesamtanzahl, dann · 100 für Prozent.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Relative Häufigkeit', 'Prozent', 'Statistik', 'Gesetz der großen Zahlen'],
  fachwissen: {
    text: 'Die relative Häufigkeit eines Ereignisses berechnet man als Anzahl der Treffer geteilt durch die Gesamtanzahl aller Versuche; multipliziert mit 100 erhält man die relative Häufigkeit in Prozent. Nach dem Gesetz der großen Zahlen nähert sich die relative Häufigkeit bei sehr vielen Versuchen immer stärker einem festen Wert an.',
    quelle: 'Wikipedia: Relative Häufigkeit',
    url: 'https://de.wikipedia.org/wiki/Relative_H%C3%A4ufigkeit',
  },
  generate: mixedVariants(
    // V1 Tippen — Umfrage-Kontext statt Würfel
    (rng: Rng) => {
      const total = pick(rng, [60, 120, 150, 250, 400])
      const k = randInt(rng, 1, total - 1)
      const value = roundTo((k / total) * 100, 2)
      return valueTask({
        question: `Bei einer Umfrage unter ${total} Schülern gaben ${k} an, lieber Mathe als Deutsch zu mögen. Wie groß ist die relative Häufigkeit in Prozent?`,
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `Relative Häufigkeit = ${k} : ${total} = ${formatDe(roundTo(k / total, 4))}. In Prozent: · 100 = ${formatDe(value)} %.`,
        dedupeKey: `lb2haeuf-tippen:${k}:${total}`,
      })
    },
    // V2 MC — Umkehrung: aus Prozent + Gesamtzahl die absolute Anzahl bestimmen
    (rng: Rng) => {
      const total = pick(rng, [20, 25, 40, 50, 80])
      const percent = pick(rng, [10, 20, 25, 40, 50, 60, 75])
      const correctCount = roundTo((percent / 100) * total, 0)
      const correct = `${correctCount}`
      const wrong1 = `${total - correctCount}` // Restmenge statt Treffer
      const wrong2 = `${percent}` // Prozentzahl statt Anzahl
      const wrong3 = `${roundTo(total / (percent / 100), 0)}` // falsch gerechnet (dividiert statt multipliziert)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Bei ${total} Würfen eines Glücksrads landete der Zeiger in ${percent} % der Fälle auf Rot. Wie oft war das (absolute Häufigkeit)?`,
        choices,
        correct,
        solution: correct,
        explanation: `${percent} % von ${total}: ${formatDe(percent / 100)} · ${total} = ${correctCount}.`,
        dedupeKey: `lb2haeuf-mc:${total}:${percent}`,
      })
    },
    // V3 Portfolio — absolute Häufigkeit aus Kreisdiagramm-Anteil bestimmen (Umkehrung)
    (rng: Rng) => {
      const total = pick(rng, [20, 25, 40, 50])
      const denom = pick(rng, [5, 8, 10, 20])
      const k = randInt(rng, 1, denom - 1)
      const percent = roundTo((k / denom) * 100, 2)
      const value = roundTo((k / denom) * total, 0)
      return visualTask({
        question: `Im Kreisdiagramm ist der eingefärbte Anteil markiert. Bei insgesamt ${total} Versuchen: Wie viele davon entspricht dieser Anteil?`,
        answerKind: 'integer',
        value,
        solution: `${value}`,
        explanation: `Der eingefärbte Anteil ist ${k}/${denom} = ${formatDe(percent)} %. Davon bei ${total} Versuchen: ${formatDe(k / denom)} · ${total} = ${value}.`,
        visualContent: generateFractionCircleSvg({ numerator: k, denominator: denom }),
      })
    },
    // V4 MC — Konzept: Gesetz der großen Zahlen
    (rng: Rng) => {
      const correct = 'Je mehr Versuche durchgeführt werden, desto stabiler wird die relative Häufigkeit.'
      const wrong1 = 'Die relative Häufigkeit ist bei wenigen Versuchen immer am genauesten.'
      const wrong2 = 'Die relative Häufigkeit ändert sich bei mehr Versuchen immer stärker.'
      const wrong3 = 'Die absolute Häufigkeit bleibt bei mehr Versuchen immer gleich groß.'
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Welche Aussage zum Gesetz der großen Zahlen ist richtig?',
        choices,
        correct,
        solution: correct,
        explanation:
          'Das Gesetz der großen Zahlen besagt: Je mehr Versuche man durchführt, desto stabiler (vorhersagbarer) wird die relative Häufigkeit eines Ereignisses. Bei wenigen Versuchen kann sie stark schwanken.',
      })
    },
  ),
})

// 17) Sachaufgabe: Dreisatz mit Einheiten
const sachaufgabeDreisatzNeu: Topic = asNeuTopic('lb2-sachaufgabe-dreisatz', {
  id: 'lb2-sachaufgabe-dreisatz__neu',
  title: 'Sachaufgabe: Dreisatz mit Einheiten',
  hint: 'Erst den Wert für eine Einheit bestimmen, dann auf die gesuchte Menge hochrechnen.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sachaufgabe', 'Dreisatz', 'proportional', 'Einheiten'],
  fachwissen: {
    text: 'Beim Dreisatz wird der gegebene Wert zunächst auf eine Einheit zurückgerechnet (meist durch Teilen) und danach auf die gesuchte Menge hochgerechnet (durch Multiplizieren). Wichtig ist, bei jedem Zwischenschritt die Einheit mitzuschreiben, damit klar bleibt, was gerade berechnet wird. Der Dreisatz funktioniert nur bei proportionalen Zusammenhängen.',
    quelle: 'Wikipedia: Dreisatz',
    url: 'https://de.wikipedia.org/wiki/Dreisatz',
  },
  generate: mixedVariants(
    // V1 Tippen — Kopierpapier (Masse statt Preis)
    (rng: Rng) => {
      const blaetter1 = pick(rng, [100, 200, 250, 500])
      const gramPer100 = pick(rng, [48, 50, 52, 55, 60, 70, 80])
      const gewicht1 = roundTo((gramPer100 / 100) * blaetter1, 0)
      const blaetter2 = pick(rng, [150, 300, 400, 600, 750, 1000].filter((b) => b !== blaetter1))
      const value = roundTo((gewicht1 / blaetter1) * blaetter2, 0)
      return valueTask({
        question: `${blaetter1} Blätter Kopierpapier wiegen ${gewicht1} g. Wie viel wiegen ${blaetter2} Blätter (gleiche Papiersorte)?`,
        unit: 'g',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} g`,
        explanation: `1 Blatt wiegt ${gewicht1} : ${blaetter1} = ${formatDe(roundTo(gewicht1 / blaetter1, 4))} g. ${blaetter2} Blätter wiegen ${formatDe(roundTo(gewicht1 / blaetter1, 4))} · ${blaetter2} = ${formatDe(value)} g.`,
        dedupeKey: `lb2sach-tippen:${blaetter1}:${gewicht1}:${blaetter2}`,
      })
    },
    // V2 MC — typische Fehler (verkehrte Rechenrichtung, Einheit vergessen)
    (rng: Rng) => {
      const preisPro5 = pick(rng, [2, 3, 4, 5, 6])
      const menge1 = 5
      const total1 = preisPro5
      const menge2 = pick(rng, [8, 12, 15, 20])
      const value = roundTo((total1 / menge1) * menge2, 2)
      const correct = `${formatDe(value)} €`
      const wrong1 = `${formatDe(roundTo(total1 * menge2, 2))} €` // ohne vorher zu teilen
      const wrong2 = `${formatDe(roundTo(total1 / menge2, 2))} €` // Division statt Dreisatz
      const wrong3 = `${formatDe(roundTo((total1 / menge1) * menge1, 2))} €` // falsche Menge verwendet
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `${menge1} kg Kartoffeln kosten ${formatDe(total1)} €. Was kosten ${menge2} kg?`,
        choices,
        correct,
        solution: correct,
        explanation: `1 kg kostet ${formatDe(total1)} : ${menge1} = ${formatDe(roundTo(total1 / menge1, 4))} €. ${menge2} kg kosten ${formatDe(roundTo(total1 / menge1, 4))} · ${menge2} = ${correct}.`,
        dedupeKey: `lb2sach-mc:${preisPro5}:${menge2}`,
      })
    },
    // V3 Portfolio — Wertetabelle, Drucker (Seiten pro Minute)
    (rng: Rng) => {
      const seitenProMin = pick(rng, [4, 6, 8, 10, 12])
      const min1 = pick(rng, [3, 5, 7])
      const seiten1 = seitenProMin * min1
      const min2 = pick(rng, [9, 11, 13, 15].filter((m) => m !== min1))
      const value = seitenProMin * min2
      return visualTask({
        question: `Ein Drucker druckt ${seiten1} Seiten in ${min1} Minuten (gleichmäßiges Tempo). Wie viele Seiten druckt er in ${min2} Minuten? Nutze die Wertetabelle.`,
        unit: 'Seiten',
        answerKind: 'integer',
        value,
        solution: `${value} Seiten`,
        explanation: `Pro Minute: ${seiten1} : ${min1} = ${seitenProMin} Seiten. In ${min2} Minuten: ${seitenProMin} · ${min2} = ${value} Seiten.`,
        visualContent: generateValueTableSvg({
          cells: [
            { x: min1, y: seiten1 },
            { x: min2, y: null },
          ],
          xLabel: 'min',
          yLabel: 'Seiten',
        }),
      })
    },
    // V4 Tippen (Umkehrung) — gesuchte Menge statt Endwert
    (rng: Rng) => {
      const preisPro100 = pick(rng, [60, 80, 100, 120, 150])
      const budget = preisPro100 * pick(rng, [2, 3, 4, 5, 6])
      const value = roundTo((budget / preisPro100) * 100, 0)
      const artikel = pick(rng, ['Nüsse', 'Käse', 'Schokolade', 'Kaffee'])
      return valueTask({
        question: `100 g ${artikel} kosten ${preisPro100} Cent. Wie viele Gramm bekommt man für ${budget} Cent?`,
        unit: 'g',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} g`,
        explanation: `1 Cent entspricht 100 : ${preisPro100} = ${formatDe(roundTo(100 / preisPro100, 4))} g. Für ${budget} Cent: ${formatDe(roundTo(100 / preisPro100, 4))} · ${budget} = ${formatDe(value)} g.`,
        dedupeKey: `lb2sach-rev:${preisPro100}:${budget}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Lernbereich 3 — Dreiecke und Vierecke
// ---------------------------------------------------------------------------

// 18) Innenwinkelsatz im Dreieck
const winkelDreieckNeu: Topic = asNeuTopic('lb3-winkel-dreieck', {
  id: 'lb3-winkel-dreieck__neu',
  title: 'Innenwinkelsatz im Dreieck',
  hint: 'Die Innenwinkel im Dreieck ergeben zusammen 180°.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Winkelsumme', 'Dreieck', 'Innenwinkel', 'gleichschenklig'],
  fachwissen: {
    text: 'Die Summe der Innenwinkel in jedem Dreieck beträgt stets 180°. Bei einem gleichschenkligen Dreieck sind zusätzlich die beiden Basiswinkel (an der Grundseite) gleich groß. Kennt man einen Winkel und weiß, dass das Dreieck gleichschenklig ist, lässt sich der dritte Winkel daher oft ohne weitere Angaben berechnen.',
    quelle: 'Wikipedia: Dreieck',
    url: 'https://de.wikipedia.org/wiki/Dreieck',
  },
  generate: mixedVariants(
    // V1 Tippen — gleichschenkliges Dreieck, Spitzenwinkel gesucht
    (rng: Rng) => {
      const basis = randInt(rng, 20, 80)
      const spitze = 180 - 2 * basis
      return valueTask({
        question: `In einem gleichschenkligen Dreieck sind die beiden Basiswinkel gleich groß und betragen je ${basis}°. Wie groß ist der Winkel an der Spitze?`,
        unit: '°',
        answerKind: 'integer',
        value: spitze,
        solution: `${spitze}°`,
        explanation: `Winkelsumme = 180°. Die beiden Basiswinkel zusammen: 2 · ${basis}° = ${2 * basis}°. Spitzenwinkel = 180° − ${2 * basis}° = ${spitze}°.`,
        dedupeKey: `lb3dreieck-tippen:${basis}`,
      })
    },
    // V2 MC — typische Fehler (360° statt 180°, Vorzeichenfehler)
    (rng: Rng) => {
      const a = randInt(rng, 30, 100)
      const b = randInt(rng, 20, 150 - a)
      const c = 180 - a - b
      const correct = `${c}°`
      const wrong1 = `${360 - a - b}°` // 360° statt 180° verwendet
      const wrong2 = `${a + b}°` // addiert statt von 180° abgezogen
      const wrong3 = `${180 - a}°` // zweiten Winkel vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `In einem Dreieck sind zwei Winkel ${a}° und ${b}° groß. Wie groß ist der dritte Winkel?`,
        choices,
        correct,
        solution: correct,
        explanation: `Winkelsumme im Dreieck = 180°. Dritter Winkel = 180° − ${a}° − ${b}° = ${c}°.`,
        dedupeKey: `lb3dreieck-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — Winkel γ mit dem Geodreieck messen (Figur ohne Gradzahl)
    (rng: Rng) => {
      const a = randInt(rng, 40, 90)
      const b = randInt(rng, 30, 150 - a)
      const c = 180 - a - b
      const startAngle = pick(rng, [0, 20, 45, 90, 135, 180, 225, 270])
      return angleProtractorTask({
        question: `Ein Dreieck hat die Winkel α = ${a}° und β = ${b}°. Der dritte Winkel γ ist abgebildet (ohne Gradangabe). Miss γ mit dem Geodreieck und kontrolliere dein Ergebnis mit der Winkelsumme.`,
        mode: 'measure',
        angle: c,
        startAngle,
        solution: `${c}°`,
        explanation: `Am Geodreieck liest du γ = ${c}° ab. Zur Probe: Die Winkelsumme im Dreieck beträgt 180°, also γ = 180° − ${a}° − ${b}° = ${c}°.`,
        instruction: 'Miss den Winkel γ mit dem Geodreieck und trage die Gradzahl ein:',
        dedupeKey: `lb3dreieck-messen:${a}:${b}`,
      })
    },
    // V4 MC — Konzept: Winkelsumme unabhängig von der Dreiecksart
    (rng: Rng) => {
      const correct = 'Die Innenwinkelsumme beträgt 180° — unabhängig davon, ob das Dreieck spitz-, recht- oder stumpfwinklig ist.'
      const wrong1 = 'Die Innenwinkelsumme beträgt nur bei rechtwinkligen Dreiecken 180°.'
      const wrong2 = 'Je größer das Dreieck ist, desto größer wird die Innenwinkelsumme.'
      const wrong3 = 'Die Innenwinkelsumme beträgt 360°, wie beim Viereck.'
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Welche Aussage zur Innenwinkelsumme im Dreieck ist richtig?',
        choices,
        correct,
        solution: correct,
        explanation:
          'Die Innenwinkelsumme beträgt in jedem Dreieck 180° — egal ob spitz-, recht- oder stumpfwinklig und unabhängig von der Größe des Dreiecks.',
      })
    },
  ),
})

// 19) Winkelsumme im Viereck
const winkelViereckNeu: Topic = asNeuTopic('lb3-winkel-viereck', {
  id: 'lb3-winkel-viereck__neu',
  title: 'Winkelsumme im Viereck',
  hint: 'Die Innenwinkel im Viereck ergeben zusammen 360°.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Winkelsumme', 'Viereck', 'Innenwinkel', 'Vieleck'],
  fachwissen: {
    text: 'Die Innenwinkelsumme eines Vierecks beträgt 360°, da man es durch eine Diagonale in zwei Dreiecke mit je 180° zerlegen kann. Für ein beliebiges n-Eck gilt allgemein die Formel Winkelsumme = (n − 2) · 180°; für n = 4 ergibt das 360°, für n = 5 (Fünfeck) bereits 540°.',
    quelle: 'Wikipedia: Viereck',
    url: 'https://de.wikipedia.org/wiki/Viereck',
  },
  generate: mixedVariants(
    // V1 Tippen — größerer Zahlenraum als Haupt-Thema
    (rng: Rng) => {
      const a = randInt(rng, 50, 130)
      const b = randInt(rng, 50, 130)
      const c = randInt(rng, 30, 130)
      const d = 360 - a - b - c
      return valueTask({
        question: `In einem Viereck sind drei Winkel α = ${a}°, β = ${b}° und γ = ${c}° groß. Wie groß ist der vierte Winkel δ?`,
        unit: '°',
        answerKind: 'integer',
        value: d,
        solution: `${d}°`,
        explanation: `Winkelsumme im Viereck = 360°. δ = 360° − ${a}° − ${b}° − ${c}° = ${d}°.`,
        dedupeKey: `lb3viereck-tippen:${a}:${b}:${c}`,
      })
    },
    // V2 MC — typische Fehler (180° statt 360°, nur zwei Winkel abgezogen)
    (rng: Rng) => {
      const a = randInt(rng, 70, 110)
      const b = randInt(rng, 70, 110)
      const c = randInt(rng, 50, 110)
      const d = 360 - a - b - c
      const correct = `${d}°`
      const wrong1 = `${720 - a - b - c}°` // 720° (wie zwei Vierecke) statt 360° verwendet
      const wrong2 = `${360 - a - b}°` // einen Winkel vergessen abzuziehen
      const wrong3 = `${360 - a - c}°` // falschen Winkel vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `In einem Viereck sind drei Winkel ${a}°, ${b}° und ${c}° groß. Wie groß ist der vierte Winkel?`,
        choices,
        correct,
        solution: correct,
        explanation: `Winkelsumme im Viereck = 360°. Vierter Winkel = 360° − ${a}° − ${b}° − ${c}° = ${d}°.`,
        dedupeKey: `lb3viereck-mc:${a}:${b}:${c}`,
      })
    },
    // V3 Portfolio — Winkel schätzen und am Regler einstellen
    (rng: Rng) => {
      const a = randInt(rng, 70, 110)
      const b = randInt(rng, 70, 110)
      const c = randInt(rng, 60, 110)
      const d = 360 - a - b - c
      const startAngle = pick(rng, [0, 20, 45, 90, 135, 180, 225, 270])
      return angleProtractorTask({
        question: `Ein Viereck hat die Winkel α = ${a}°, β = ${b}° und γ = ${c}°. Der vierte Winkel δ ist abgebildet (ohne Gradangabe). Miss δ mit dem Geodreieck und kontrolliere dein Ergebnis mit der Winkelsumme.`,
        mode: 'measure',
        angle: d,
        startAngle,
        solution: `${d}°`,
        explanation: `Am Geodreieck liest du δ = ${d}° ab. Zur Probe: Die Winkelsumme im Viereck beträgt 360°, also δ = 360° − ${a}° − ${b}° − ${c}° = ${d}°.`,
        instruction: 'Miss den Winkel δ mit dem Geodreieck und trage die Gradzahl ein:',
        dedupeKey: `lb3viereck-messen:${a}:${b}:${c}`,
      })
    },
    // V4 MC — Konzept: Winkelsumme im Fünfeck (Formel (n−2)·180°)
    (rng: Rng) => {
      const correct = '540°'
      const wrong1 = '360°' // Viereck-Wert verwechselt
      const wrong2 = '450°'
      const wrong3 = '900°' // 5 · 180° statt (5−2) · 180°
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: 'Die Innenwinkelsumme eines Vierecks beträgt 360°. Mit der Formel (n − 2) · 180° — wie groß ist die Innenwinkelsumme eines Fünfecks (n = 5)?',
        choices,
        correct,
        solution: correct,
        explanation: 'Für n = 5: (5 − 2) · 180° = 3 · 180° = 540°.',
      })
    },
  ),
})

// 20) Umfang von Rechteck und Quadrat
const umfangRechteckNeu: Topic = asNeuTopic('lb3-umfang-rechteck', {
  id: 'lb3-umfang-rechteck__neu',
  title: 'Umfang von Rechteck und Quadrat',
  hint: 'U = 2 · (a + b) beim Rechteck, U = 4 · a beim Quadrat.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Umfang', 'Rechteck', 'Quadrat', 'Seitenlänge'],
  fachwissen: {
    text: 'Ist der Umfang eines Rechtecks und eine Seite bekannt, lässt sich die andere Seite berechnen: Aus U = 2 · (a + b) folgt b = U : 2 − a. Beim Quadrat mit U = 4 · a gilt entsprechend a = U : 4. Diese Umkehrung wird häufig gebraucht, wenn z. B. nur die Zaunlänge und eine Grundstücksseite bekannt sind.',
    quelle: 'Wikipedia: Umfang (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Umfang_(Geometrie)',
  },
  generate: mixedVariants(
    // V1 Tippen — Umkehrung: Umfang + eine Seite bekannt, andere Seite gesucht
    (rng: Rng) => {
      const a = randInt(rng, 4, 20)
      const b = randInt(rng, 4, 20)
      const u = 2 * (a + b)
      return valueTask({
        question: `Ein Rechteck hat den Umfang ${u} cm. Eine Seite ist ${a} cm lang. Wie lang ist die andere Seite?`,
        unit: 'cm',
        answerKind: 'integer',
        value: b,
        solution: `${b} cm`,
        explanation: `b = U : 2 − a = ${u} : 2 − ${a} = ${u / 2} − ${a} = ${b} cm.`,
        dedupeKey: `lb3umfang-tippen:${a}:${b}`,
      })
    },
    // V2 MC — Umfang vs. Fläche verwechseln
    (rng: Rng) => {
      const a = randInt(rng, 5, 22)
      const b = randInt(rng, 5, 22)
      const u = 2 * (a + b)
      const correct = `${u} cm`
      const wrong1 = `${a * b} cm` // Fläche statt Umfang
      const wrong2 = `${a + b} cm` // nicht verdoppelt
      const wrong3 = `${4 * Math.max(a, b)} cm` // wie Quadrat behandelt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist der Umfang?`,
        choices,
        correct,
        solution: correct,
        explanation: `Umfang = 2 · (${a} + ${b}) = 2 · ${a + b} = ${u} cm. Nicht zu verwechseln mit der Fläche (${a} · ${b} = ${a * b} cm²).`,
        dedupeKey: `lb3umfang-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — Rechteck mit fehlender Seite, Gesamtumfang im Text gegeben
    (rng: Rng) => {
      const a = randInt(rng, 5, 18)
      const b = randInt(rng, 5, 18)
      const u = 2 * (a + b)
      return visualTask({
        question: `Das abgebildete Rechteck hat insgesamt den Umfang ${u} cm. Wie lang ist die fehlende Seite?`,
        unit: 'cm',
        answerKind: 'integer',
        value: b,
        solution: `${b} cm`,
        explanation: `b = U : 2 − a = ${u} : 2 − ${a} = ${b} cm.`,
        visualContent: generateRectangleSvg({
          widthLabel: `${a} cm`,
          heightLabel: '?',
        }),
      })
    },
    // V4 MC — Quadrat-Sonderfall, Seite aus Umfang
    (rng: Rng) => {
      const a = randInt(rng, 3, 25)
      const u = 4 * a
      const correct = `${a} cm`
      const wrong1 = `${u} cm` // Umfang statt Seite
      const wrong2 = `${u * 2} cm` // mit 2 statt durch 4 geteilt
      const wrong3 = `${a * a} cm` // Fläche statt Seite
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Quadrat hat den Umfang ${u} cm. Wie lang ist eine Seite?`,
        choices,
        correct,
        solution: correct,
        explanation: `Beim Quadrat gilt U = 4 · a, also a = U : 4 = ${u} : 4 = ${a} cm.`,
        dedupeKey: `lb3umfang-quadrat:${a}`,
      })
    },
  ),
})

// 21) Flächeninhalt von Rechteck und Quadrat
const flaecheRechteckNeu: Topic = asNeuTopic('lb3-flaeche-rechteck', {
  id: 'lb3-flaeche-rechteck__neu',
  title: 'Flächeninhalt von Rechteck und Quadrat',
  hint: 'A = a · b beim Rechteck, A = a² beim Quadrat.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Fläche', 'Rechteck', 'Quadrat', 'Flächeneinheit'],
  fachwissen: {
    text: 'Ist der Flächeninhalt eines Rechtecks und eine Seite bekannt, lässt sich die andere Seite durch Division berechnen: b = A : a. Beim Umrechnen von Flächeneinheiten gilt: 1 m² = 10 000 cm² (nicht 100, da sowohl Länge als auch Breite mit 100 multipliziert werden). Dieser Umrechnungsfaktor wird oft übersehen.',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    // V1 Tippen — Umkehrung: Fläche + eine Seite bekannt, andere Seite gesucht
    (rng: Rng) => {
      const a = randInt(rng, 3, 15)
      const b = randInt(rng, 3, 15)
      const flaeche = a * b
      return valueTask({
        question: `Ein Rechteck hat den Flächeninhalt ${flaeche} cm². Eine Seite ist ${a} cm lang. Wie lang ist die andere Seite?`,
        unit: 'cm',
        answerKind: 'integer',
        value: b,
        solution: `${b} cm`,
        explanation: `b = A : a = ${flaeche} : ${a} = ${b} cm.`,
        dedupeKey: `lb3flaeche-tippen:${a}:${b}`,
      })
    },
    // V2 MC — Fläche vs. Umfang verwechseln
    (rng: Rng) => {
      const a = randInt(rng, 4, 16)
      const b = randInt(rng, 4, 16)
      const flaeche = a * b
      const correct = `${flaeche} cm²`
      const wrong1 = `${2 * (a + b)} cm²` // Umfang statt Fläche
      const wrong2 = `${a + b} cm²` // addiert statt multipliziert
      const wrong3 = `${a * a} cm²` // nur eine Seite quadriert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist der Flächeninhalt?`,
        choices,
        correct,
        solution: correct,
        explanation: `Fläche = ${a} · ${b} = ${flaeche} cm². Nicht zu verwechseln mit dem Umfang (2 · (${a} + ${b}) = ${2 * (a + b)} cm).`,
        dedupeKey: `lb3flaeche-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — Rechteck mit fehlender Seite, Gesamtfläche im Text gegeben
    (rng: Rng) => {
      const a = randInt(rng, 3, 14)
      const b = randInt(rng, 3, 14)
      const flaeche = a * b
      return visualTask({
        question: `Das abgebildete Rechteck hat insgesamt den Flächeninhalt ${flaeche} cm². Wie lang ist die fehlende Seite?`,
        unit: 'cm',
        answerKind: 'integer',
        value: b,
        solution: `${b} cm`,
        explanation: `b = A : a = ${flaeche} : ${a} = ${b} cm.`,
        visualContent: generateRectangleSvg({
          widthLabel: `${a} cm`,
          heightLabel: '?',
        }),
      })
    },
    // V4 MC — Umrechnung m² in cm²
    (rng: Rng) => {
      const a = randInt(rng, 2, 6)
      const b = randInt(rng, 2, 6)
      const flaecheM2 = a * b
      const correct = `${flaecheM2 * 10000} cm²`
      const wrong1 = `${flaecheM2 * 100} cm²` // falscher Umrechnungsfaktor (nur ·100)
      const wrong2 = `${flaecheM2} cm²` // gar nicht umgerechnet
      const wrong3 = `${flaecheM2 * 1000} cm²` // Verwechslung mit dm³/Liter-Faktor
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Rechteck ist ${a} m lang und ${b} m breit (Fläche ${flaecheM2} m²). Wie groß ist die Fläche in cm²?`,
        choices,
        correct,
        solution: correct,
        explanation: `1 m² = 10 000 cm², da sowohl Länge als auch Breite mit 100 multipliziert werden (100 · 100 = 10 000). ${flaecheM2} m² = ${flaecheM2} · 10 000 cm² = ${flaecheM2 * 10000} cm².`,
        dedupeKey: `lb3flaeche-umrechnen:${a}:${b}`,
      })
    },
  ),
})

// 22) Flächeninhalt von Dreiecken
const flaecheDreieckNeu: Topic = asNeuTopic('lb3-flaeche-dreieck', {
  id: 'lb3-flaeche-dreieck__neu',
  title: 'Flächeninhalt von Dreiecken',
  hint: 'A = (g · h) : 2',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Fläche', 'Dreieck', 'Grundseite', 'Höhe'],
  fachwissen: {
    text: 'Sind Flächeninhalt und Grundseite eines Dreiecks bekannt, lässt sich die Höhe berechnen: Aus A = (g · h) : 2 folgt h = (2 · A) : g. Ein Dreieck hat stets die halbe Fläche eines Rechtecks (oder Parallelogramms) mit gleicher Grundseite und gleicher Höhe — ein hilfreicher Zusammenhang zum Merken der Formel.',
    quelle: 'Wikipedia: Dreieck',
    url: 'https://de.wikipedia.org/wiki/Dreieck',
  },
  generate: mixedVariants(
    // V1 Tippen — Umkehrung: Fläche + Grundseite bekannt, Höhe gesucht
    (rng: Rng) => {
      const g = randInt(rng, 4, 16)
      const h = randInt(rng, 4, 16)
      const flaeche = (g * h) / 2
      return valueTask({
        question: `Ein Dreieck hat den Flächeninhalt ${formatDe(flaeche)} cm² und die Grundseite ${g} cm. Wie groß ist die Höhe?`,
        unit: 'cm',
        answerKind: 'decimal',
        value: h,
        solution: `${formatDe(h)} cm`,
        explanation: `h = (2 · A) : g = (2 · ${formatDe(flaeche)}) : ${g} = ${2 * flaeche} : ${g} = ${formatDe(h)} cm.`,
        dedupeKey: `lb3dreifl-tippen:${g}:${h}`,
      })
    },
    // V2 MC — typischer Fehler: /2 vergessen
    (rng: Rng) => {
      const g = randInt(rng, 6, 30)
      const h = randInt(rng, 5, 28)
      const value = roundTo((g * h) / 2, 2)
      const correct = `${formatDe(value)} cm²`
      const wrong1 = `${g * h} cm²` // /2 vergessen (wie Rechteck gerechnet)
      const wrong2 = `${g + h} cm²` // addiert statt multipliziert
      const wrong3 = `${formatDe(roundTo(g * h * 2, 2))} cm²` // mit 2 statt durch 2 geteilt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Dreieck hat die Grundseite ${g} cm und die Höhe ${h} cm. Welches Ergebnis für den Flächeninhalt ist richtig?`,
        choices,
        correct,
        solution: correct,
        explanation: `A = (g · h) : 2 = (${g} · ${h}) : 2 = ${formatDe(value)} cm². Das Dreieck hat nur die halbe Fläche des Rechtecks mit gleicher Grundseite und Höhe.`,
        dedupeKey: `lb3dreifl-mc:${g}:${h}`,
      })
    },
    // V3 Portfolio — Dreieck mit fehlender Höhe, Gesamtfläche im Text gegeben
    (rng: Rng) => {
      const g = randInt(rng, 6, 20)
      const h = randInt(rng, 4, 18)
      const flaeche = (g * h) / 2
      return visualTask({
        question: `Das abgebildete Dreieck hat insgesamt den Flächeninhalt ${formatDe(flaeche)} cm². Wie groß ist die Höhe?`,
        unit: 'cm',
        answerKind: 'decimal',
        value: h,
        solution: `${formatDe(h)} cm`,
        explanation: `h = (2 · A) : g = (2 · ${formatDe(flaeche)}) : ${g} = ${formatDe(h)} cm.`,
        visualContent: generateTriangleSvg({
          baseLabel: `${g} cm`,
          heightLabel: '?',
        }),
      })
    },
    // V4 MC — Konzept: Dreieck als halbes Rechteck
    (rng: Rng) => {
      const g = randInt(rng, 4, 20)
      const h = randInt(rng, 4, 20)
      const rechteckFlaeche = g * h
      const correct = `${formatDe(roundTo(rechteckFlaeche / 2, 2))} cm²`
      const wrong1 = `${rechteckFlaeche} cm²` // gleiche Fläche wie Rechteck angenommen
      const wrong2 = `${formatDe(roundTo(rechteckFlaeche / 4, 2))} cm²` // ein Viertel statt die Hälfte
      const wrong3 = `${formatDe(roundTo(rechteckFlaeche * 2, 2))} cm²` // verdoppelt statt halbiert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Rechteck und ein Dreieck haben dieselbe Grundseite g und dieselbe Höhe h. Das Rechteck hat die Fläche ${rechteckFlaeche} cm². Wie groß ist die Fläche des Dreiecks?`,
        choices,
        correct,
        solution: correct,
        explanation: `Ein Dreieck hat bei gleicher Grundseite und Höhe immer nur die halbe Fläche des Rechtecks: ${rechteckFlaeche} : 2 = ${formatDe(roundTo(rechteckFlaeche / 2, 2))} cm².`,
        dedupeKey: `lb3dreifl-konzept:${g}:${h}`,
      })
    },
  ),
})

/** Planfigur Dreieck (Skizze, nicht maßstabsgetreu) mit den gegebenen Seitenlängen. */
const dreieckPlanSvg = (c: string, b: string, a: string): string =>
  `<svg viewBox="0 0 300 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Skizze des Dreiecks ABC mit den drei Seitenlängen">` +
  `<polygon points="40,160 260,160 190,40" fill="#eef3fb" stroke="#1d3557" stroke-width="2"/>` +
  `<g font-family="sans-serif" font-size="15" fill="#1f2937">` +
  `<text x="26" y="176">A</text><text x="262" y="176">B</text><text x="188" y="30">C</text>` +
  `<text x="118" y="184">c = ${c}</text>` +
  `<text x="40" y="94">b = ${b}</text>` +
  `<text x="232" y="94">a = ${a}</text>` +
  `</g></svg>`

// 23) Kongruenzsatz wählen
const kongruenzSatzNeu: Topic = asNeuTopic('lb3-kongruenzsatz', {
  id: 'lb3-kongruenzsatz__neu',
  title: 'Kongruenzsatz wählen',
  hint: 'SSS, SWS, WSW oder SsW — welche Angabe reicht?',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Kongruenz', 'SSS', 'SWS', 'WSW', 'SsW', 'Dreieck', 'Hypotenuse', 'Kathete'],
  fachwissen: {
    text: 'Beim rechtwinkligen Dreieck sind eine Kathete und die Hypotenuse ein wichtiger Sonderfall: Die Hypotenuse ist die längere der beiden bekannten Seiten, und der rechte Winkel (90°) liegt ihr gegenüber. Damit greift der Kongruenzsatz SsW (zwei Seiten und der Gegenwinkel der längeren Seite). Gleiche Winkel allein (ohne Seitenangabe) legen ein Dreieck dagegen nur in der Form, nicht in der Größe fest — solche Dreiecke sind nur ähnlich, nicht notwendig kongruent.',
    quelle: 'Wikipedia: Kongruenzsatz',
    url: 'https://de.wikipedia.org/wiki/Kongruenzsatz',
  },
  generate: mixedVariants(
    // V1 Tippen — freie Texteingabe, Klassiker SSS
    (rng: Rng) => {
      const a = randInt(rng, 3, 10)
      const b = randInt(rng, 3, 10)
      const c = randInt(rng, 3, 10)
      return textTask({
        question: `Von einem Dreieck sind alle drei Seitenlängen bekannt: a = ${a} cm, b = ${b} cm, c = ${c} cm. Welcher Kongruenzsatz legt das Dreieck eindeutig fest? (Tippe die Abkürzung, z. B. SWS)`,
        accepted: ['SSS', 'sss'],
        solution: 'SSS',
        explanation: 'Drei bekannte Seitenlängen bestimmen ein Dreieck eindeutig: SSS.',
        dedupeKey: `lb3kong-text-sss:${a}:${b}:${c}`,
      })
    },
    // V2 MC — Sonderfall Kathete + Hypotenuse (SsW)
    (rng: Rng) => {
      const a = randInt(rng, 3, 9)
      const c = randInt(rng, a + 2, 12)
      return choicePickTask({
        question: `In einem rechtwinkligen Dreieck sind eine Kathete (a = ${a} cm) und die Hypotenuse (c = ${c} cm) bekannt. Welcher Kongruenzsatz greift (zusammen mit dem rechten Winkel)?`,
        choices: ['SSS', 'SWS', 'WSW', 'SsW'],
        correct: 'SsW',
        solution: 'SsW',
        explanation: `Die Hypotenuse c ist die längere der beiden bekannten Seiten, und der rechte Winkel liegt ihr gegenüber. Zwei Seiten + Gegenwinkel der längeren Seite → SsW.`,
        instruction: 'Tippe den passenden Kongruenzsatz:',
        dedupeKey: `lb3kong-mc-ssw:${a}:${c}`,
      })
    },
    // V3 Portfolio — Visualisierung Kathete + Hypotenuse
    (rng: Rng) => {
      const a = randInt(rng, 4, 8)
      const c = randInt(rng, a + 3, 13)
      return choicePickTask({
        question: 'Im abgebildeten rechtwinkligen Dreieck sind eine Kathete a und die Hypotenuse c bekannt. Welcher Kongruenzsatz greift (inkl. rechtem Winkel)?',
        choices: ['SSS', 'SWS', 'WSW', 'SsW'],
        correct: 'SsW',
        solution: 'SsW',
        explanation: `c (Hypotenuse) ist die längere Seite der beiden bekannten Seiten und liegt dem rechten Winkel gegenüber: SsW (Kathete-Hypotenuse-Satz).`,
        visualContent: generateRightTriangleSvg({
          aLabel: `a=${a}`,
          bLabel: 'b',
          cLabel: `c=${c}`,
        }),
        instruction: 'Tippe den passenden Kongruenzsatz:',
      })
    },
    // V4 MC — Konzept: gleiche Winkel reichen NICHT für Kongruenz
    (rng: Rng) => {
      const correct = 'Nein'
      const choices = shuffleChoices(rng, ['Ja', 'Nein'], correct)
      return choicePickTask({
        question: 'Zwei Dreiecke haben in allen drei Winkeln die gleichen Gradzahlen, aber unterschiedlich lange Seiten. Sind die beiden Dreiecke kongruent?',
        choices,
        correct,
        solution: correct,
        explanation: 'Nein — gleiche Winkel allein legen nur die Form fest (die Dreiecke sind ähnlich), nicht die Größe. Für Kongruenz braucht man zusätzlich mindestens eine Seitenlänge (z. B. WSW statt nur WWW).',
        instruction: 'Ja oder Nein?',
      })
    },
    // V5 Geführte Konstruktion — Dreieck aus drei Seiten (SSS) mit Zirkel und Lineal
    (rng: Rng) => {
      const setup = pick(rng, [
        { c: 6, b: 5, a: 5, cx: 3, cy: 4 },
        { c: 8, b: 5, a: 5, cx: 4, cy: 3 },
        { c: 4, b: 5, a: 3, cx: 4, cy: 3 },
        { c: 4, b: 3, a: 5, cx: 0, cy: 3 },
      ])
      const { c, b, a, cx, cy } = setup
      const B = { x: c, y: 0 }
      const candidates = [
        { x: cx, y: cy },
        { x: cx, y: -cy },
      ]
      const startScene = emptyCoordinateScene({
        xRange: [-3, c + 3],
        yRange: [-5, 5],
        snap: 'half',
        objects: [{ id: 'A', kind: 'point', x: 0, y: 0, label: 'A', fixed: true }],
      })
      const connected = (s: typeof startScene) =>
        candidates.some(
          (p) => hasPointNear(s, p.x, p.y) && hasSegment(s, 'A', p, b) && hasSegment(s, B, p, a),
        )
      return constructionStepsTask({
        question: `Konstruiere das Dreieck ABC mit c = ${c} cm, b = ${b} cm und a = ${a} cm. Der Punkt A ist vorgegeben, B soll rechts von A liegen.`,
        planFigureSvg: dreieckPlanSvg(`${c} cm`, `${b} cm`, `${a} cm`),
        startScene,
        steps: [
          {
            instruction: `Zeichne die Seite c = ${c} cm: Strecke von A aus ${c} cm nach rechts bis B.`,
            allowedTools: ['segment', 'select', 'delete'],
            check: (s) => hasSegment(s, 'A', B, c),
          },
          {
            instruction: `Schlage einen Kreisbogen um A mit dem Radius b = ${b} cm.`,
            allowedTools: ['circle', 'select', 'delete'],
            check: (s) => hasCircle(s, 'A', b),
          },
          {
            instruction: `Schlage einen Kreisbogen um B mit dem Radius a = ${a} cm.`,
            allowedTools: ['circle', 'select', 'delete'],
            check: (s) => hasCircle(s, B, a),
          },
          {
            instruction: 'Markiere einen Schnittpunkt der beiden Kreisbögen als C.',
            allowedTools: ['point', 'select', 'delete'],
            check: (s) => candidates.some((p) => hasPointNear(s, p.x, p.y)),
          },
          {
            instruction: 'Verbinde C mit A und mit B.',
            allowedTools: ['segment', 'select', 'delete'],
            check: connected,
          },
        ],
        solutionScene: {
          ...startScene,
          objects: [
            ...startScene.objects,
            { id: 's-ab', kind: 'segment', x1: 0, y1: 0, x2: B.x, y2: B.y },
            { id: 's-ka', kind: 'circle', cx: 0, cy: 0, r: b },
            { id: 's-kb', kind: 'circle', cx: B.x, cy: B.y, r: a },
            { id: 's-c', kind: 'point', x: cx, y: cy },
            { id: 's-ac', kind: 'segment', x1: 0, y1: 0, x2: cx, y2: cy },
            { id: 's-bc', kind: 'segment', x1: B.x, y1: B.y, x2: cx, y2: cy },
          ],
        },
        solution: `Dreieck ABC mit C(${cx}|${cy}) (oder gespiegelt an AB)`,
        explanation: `Bei SSS sind alle drei Seiten bekannt. Die Kreisbögen um A (b = ${b} cm) und um B (a = ${a} cm) schneiden sich in zwei Punkten, die spiegelbildlich zu AB liegen. Beide Punkte liefern ein Dreieck mit denselben Seitenlängen, die beiden Dreiecke sind kongruent. Das Dreieck ist durch SSS also bis auf Spiegelung eindeutig festgelegt.`,
        dedupeKey: `lb3kong-konstruktion-sss:${c}:${b}:${a}`,
      })
    },
  ),
})

// 24) Sachaufgabe: Fläche und Umfang im Alltag
const sachaufgabeGeometrieNeu: Topic = asNeuTopic('lb3-sachaufgabe-geometrie', {
  id: 'lb3-sachaufgabe-geometrie__neu',
  title: 'Sachaufgabe: Fläche und Umfang im Alltag',
  hint: 'Umfang für Begrenzungen/Strecken, Fläche für Belag/Material.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sachaufgabe', 'Fläche', 'Umfang', 'Dreieck', 'Rechteck', 'Alltag'],
  fachwissen: {
    text: 'Bei Sachaufgaben zur Geometrie hilft die Überlegung, ob eine Begrenzungslänge (Umfang, z. B. Zaun, Bordüre, Einfassung) oder eine Materialmenge für eine Fläche (z. B. Fußboden, Tapete, Rasen) gesucht ist. Für ein Dreieck lässt sich der Umfang nur berechnen, wenn alle drei Seitenlängen bekannt sind — aus Grundseite und Höhe allein lässt er sich nicht bestimmen, denn die beiden anderen Seiten könnten unterschiedlich lang sein.',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    // V1 Tippen — Teppich (Fläche), neuer Kontext
    (rng: Rng) => {
      const a = randInt(rng, 2, 6)
      const b = randInt(rng, 2, 5)
      const value = a * b
      return valueTask({
        question: `Ein rechteckiger Teppich ist ${a} m lang und ${b} m breit. Wie viele m² Fußboden deckt er ab?`,
        unit: 'm²',
        answerKind: 'integer',
        value,
        solution: `${value} m²`,
        explanation: `Fläche = ${a} · ${b} = ${value} m².`,
        dedupeKey: `lb3sach-tippen:${a}:${b}`,
      })
    },
    // V2 MC — Welche Rechnung (Umfang vs. Fläche) passt zum Zaun-Kontext
    (rng: Rng) => {
      const a = randInt(rng, 4, 16)
      const b = randInt(rng, 4, 16)
      const umfang = 2 * (a + b)
      const flaeche = a * b
      const correct = `${umfang} m`
      const wrong1 = `${flaeche} m` // Fläche statt Umfang gewählt
      const wrong2 = `${a + b} m` // nicht verdoppelt
      const wrong3 = `${umfang * 2} m` // Umfang verdoppelt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein rechteckiges Beet (${a} m × ${b} m) soll komplett mit einem Zaun umgeben werden. Wie viele Meter Zaun werden benötigt?`,
        choices,
        correct,
        solution: correct,
        explanation: `Für den Zaun wird der Umfang gebraucht: 2 · (${a} + ${b}) = ${umfang} m. Die Fläche (${flaeche} m²) wäre nur für Rasensaat o. Ä. relevant, nicht für den Zaun.`,
        dedupeKey: `lb3sach-mc:${a}:${b}`,
      })
    },
    // V3 Portfolio — dreieckiges Beet, Fläche mit Dreieck-Visual
    (rng: Rng) => {
      const g = randInt(rng, 4, 16)
      const h = randInt(rng, 4, 14)
      const flaeche = roundTo((g * h) / 2, 1)
      return visualTask({
        question: `Das abgebildete dreieckige Rabatten-Beet hat die Grundseite ${g} m und die Höhe ${h} m. Wie groß ist seine Fläche?`,
        unit: 'm²',
        answerKind: 'decimal',
        value: flaeche,
        solution: `${formatDe(flaeche)} m²`,
        explanation: `Dreiecks-Fläche = (Grundseite · Höhe) : 2 = (${g} · ${h}) : 2 = ${formatDe(flaeche)} m².`,
        visualContent: generateTriangleSvg({
          baseLabel: `${g} m`,
          heightLabel: `${h} m`,
        }),
      })
    },
    // V4 MC — Konzept: Dreiecks-Umfang aus Grundseite und Höhe allein nicht berechenbar
    (rng: Rng) => {
      const g = randInt(rng, 4, 14)
      const h = randInt(rng, 3, 12)
      const correct = 'Nein'
      const choices = shuffleChoices(rng, ['Ja', 'Nein'], correct)
      return choicePickTask({
        question: `Ein dreieckiges Grundstück hat die Grundseite ${g} m und die Höhe ${h} m. Reicht das, um die Länge des Zauns (Umfang) zu berechnen?`,
        choices,
        correct,
        solution: correct,
        explanation: 'Nein — Grundseite und Höhe ergeben nur die Fläche, (g · h) : 2. Für den Umfang (Zaunlänge) müsste man alle drei Seitenlängen kennen und addieren; diese lassen sich aus Grundseite und Höhe allein nicht eindeutig bestimmen.',
        instruction: 'Ja oder Nein?',
        dedupeKey: `lb3sach-konzept:${g}:${h}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// LB4 — Prismen (zusätzliche Bank)
// ---------------------------------------------------------------------------

// 23) Volumen von Quader und Würfel
const volumenQuaderNeu: Topic = asNeuTopic('lb4-volumen-quader', {
  id: 'lb4-volumen-quader__neu',
  title: 'Volumen von Quader und Würfel',
  hint: 'V = a · b · c beim Quader, V = a³ beim Würfel.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Volumen', 'Quader', 'Würfel', 'Rauminhalt'],
  fachwissen: {
    text: 'Ist das Volumen eines Quaders und zwei Kantenlängen bekannt, lässt sich die dritte Kante durch Division berechnen: c = V : (a · b). Beim Würfel mit V = a³ gilt entsprechend a = ∛V. Diese Umkehrung wird oft gebraucht, wenn z. B. nur Grundfläche und Rauminhalt einer Kiste bekannt sind.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    // V1 Tippen — Umkehrung: Volumen + zwei Kanten bekannt, dritte Kante gesucht
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const b = randInt(rng, 3, 12)
      const c = randInt(rng, 2, 10)
      const v = a * b * c
      return valueTask({
        question: `Ein Quader hat das Volumen ${v} cm³. Zwei Kanten sind ${a} cm und ${b} cm lang. Wie lang ist die dritte Kante?`,
        unit: 'cm',
        answerKind: 'integer',
        value: c,
        solution: `${c} cm`,
        explanation: `c = V : (a · b) = ${v} : (${a} · ${b}) = ${v} : ${a * b} = ${c} cm.`,
        dedupeKey: `lb4volquad-tippen:${a}:${b}:${c}`,
      })
    },
    // V2 MC — Volumen vs. Oberfläche verwechseln
    (rng: Rng) => {
      const a = randInt(rng, 4, 15)
      const b = randInt(rng, 3, 12)
      const c = randInt(rng, 2, 10)
      const value = a * b * c
      const correct = `${value} cm³`
      const wrong1 = `${a * b} cm³` // dritte Dimension vergessen
      const wrong2 = `${a + b + c} cm³` // addiert statt multipliziert
      const wrong3 = `${2 * (a * b + a * c + b * c)} cm³` // Oberfläche statt Volumen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Quader ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Welches Ergebnis für das Volumen ist richtig?`,
        choices,
        correct,
        solution: correct,
        explanation: `Volumen = Länge · Breite · Höhe = ${a} · ${b} · ${c} = ${value} cm³. Nicht zu verwechseln mit der Oberfläche (2 · (${a * b}+${a * c}+${b * c}) = ${2 * (a * b + a * c + b * c)} cm²).`,
        dedupeKey: `lb4volquad-mc:${a}:${b}:${c}`,
      })
    },
    // V3 Visual — Würfel aus Kantenlänge
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const value = a * a * a
      return visualTask({
        question: 'Berechne das Volumen des abgebildeten Würfels:',
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Volumen = a³ = ${a} · ${a} · ${a} = ${value} cm³ (beim Würfel sind alle Kanten gleich lang).`,
        visualContent: generateCuboidSvg({
          lengthLabel: `${a} cm`,
          widthLabel: `${a} cm`,
          heightLabel: `${a} cm`,
          cube: true,
        }),
      })
    },
    // V4 Visual — Dezimalmaße, Umkehrung (Höhe gesucht)
    (rng: Rng) => {
      const a = pick(rng, [2, 2.5, 3, 3.5, 4])
      const b = pick(rng, [1.5, 2, 2.5, 3])
      const c = pick(rng, [2, 2.5, 3, 3.5, 4])
      const v = roundTo(a * b * c, 2)
      return visualTask({
        question: `Der abgebildete Quader hat das Volumen ${formatDe(v)} dm³. Länge und Breite sind bekannt. Wie lang ist die Höhe?`,
        unit: 'dm',
        answerKind: 'decimal',
        value: c,
        solution: `${formatDe(c)} dm`,
        explanation: `c = V : (a · b) = ${formatDe(v)} : (${formatDe(a)} · ${formatDe(b)}) = ${formatDe(v)} : ${formatDe(roundTo(a * b, 2))} = ${formatDe(c)} dm.`,
        visualContent: generateCuboidSvg({
          lengthLabel: `${formatDe(a)} dm`,
          widthLabel: `${formatDe(b)} dm`,
          heightLabel: '?',
        }),
      })
    },
  ),
})

// 24) Oberflächeninhalt von Quadern
const oberflaecheQuaderNeu: Topic = asNeuTopic('lb4-oberflaeche-quader', {
  id: 'lb4-oberflaeche-quader__neu',
  title: 'Oberflächeninhalt von Quadern',
  hint: 'O = 2 · (a·b + a·c + b·c) beim Quader, O = 6 · a² beim Würfel.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Oberfläche', 'Quader', 'Würfel', 'Mantelfläche'],
  fachwissen: {
    text: 'Die Oberfläche eines Würfels ist ein Sonderfall der Quaderformel: Da alle sechs Flächen gleich große Quadrate sind, gilt O = 6 · a². Bei Sachaufgaben zu Verpackungen (Pappe, Geschenkpapier) wird die Oberfläche berechnet — nicht das Volumen, das den Rauminhalt angibt.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    // V1 Tippen — Würfel-Sonderfall
    (rng: Rng) => {
      const a = randInt(rng, 3, 20)
      const value = 6 * a * a
      return valueTask({
        question: `Ein Würfel hat die Kantenlänge ${a} cm. Berechne seinen Oberflächeninhalt.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Beim Würfel gilt O = 6 · a² = 6 · ${a}² = 6 · ${a * a} = ${value} cm².`,
        dedupeKey: `lb4oberflquad-wuerfel:${a}`,
      })
    },
    // V2 MC — Faktor 2 vergessen
    (rng: Rng) => {
      const a = randInt(rng, 4, 16)
      const b = randInt(rng, 3, 14)
      const c = randInt(rng, 2, 12)
      const sum = a * b + a * c + b * c
      const value = 2 * sum
      const correct = `${value} cm²`
      const wrong1 = `${sum} cm²` // Faktor 2 vergessen
      const wrong2 = `${a * b * c} cm²` // mit Volumen verwechselt
      const wrong3 = `${2 * (a + b + c)} cm²` // Seiten addiert statt Flächenpaare
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Quader ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Welches Ergebnis für die Oberfläche ist richtig?`,
        choices,
        correct,
        solution: correct,
        explanation: `O = 2 · (a·b + a·c + b·c) = 2 · (${a * b} + ${a * c} + ${b * c}) = 2 · ${sum} = ${value} cm². Jedes der drei Flächenpaare zählt doppelt.`,
        dedupeKey: `lb4oberflquad-mc:${a}:${b}:${c}`,
      })
    },
    // V3 Visual — Dezimalmaße
    (rng: Rng) => {
      const a = pick(rng, [2, 2.5, 3, 3.5])
      const b = pick(rng, [1.5, 2, 2.5])
      const c = randInt(rng, 1, 2)
      const value = roundTo(2 * (a * b + a * c + b * c), 2)
      return visualTask({
        question: 'Berechne die Oberfläche des abgebildeten Quaders (Dezimalmaße):',
        unit: 'dm²',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} dm²`,
        explanation: `O = 2 · (${formatDe(a)}·${formatDe(b)} + ${formatDe(a)}·${formatDe(c)} + ${formatDe(b)}·${formatDe(c)}) = 2 · (${formatDe(roundTo(a * b, 2))} + ${formatDe(roundTo(a * c, 2))} + ${formatDe(roundTo(b * c, 2))}) = ${formatDe(value)} dm².`,
        visualContent: generateCuboidSvg({
          lengthLabel: `${formatDe(a)} dm`,
          widthLabel: `${formatDe(b)} dm`,
          heightLabel: `${formatDe(c)} dm`,
        }),
      })
    },
    // V4 Tippen — Sachaufgabe Geschenkpapier
    (rng: Rng) => {
      const a = randInt(rng, 5, 30)
      const b = randInt(rng, 4, 25)
      const c = randInt(rng, 3, 20)
      const value = 2 * (a * b + a * c + b * c)
      return valueTask({
        question: `Eine Geschenkbox ist ${a} cm lang, ${b} cm breit und ${c} cm hoch. Wie viel cm² Geschenkpapier wird mindestens benötigt, um die ganze Box zu bekleben (ohne Überlappung)?`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Oberfläche = 2 · (${a}·${b} + ${a}·${c} + ${b}·${c}) = 2 · (${a * b}+${a * c}+${b * c}) = ${value} cm².`,
        dedupeKey: `lb4oberflquad-sach:${a}:${b}:${c}`,
      })
    },
  ),
})

// 25) Volumen gerader Prismen
const volumenPrismaNeu: Topic = asNeuTopic('lb4-volumen-prisma', {
  id: 'lb4-volumen-prisma__neu',
  title: 'Volumen gerader Prismen',
  hint: 'V = G · h, wobei G die Grundfläche ist.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Volumen', 'Prisma', 'Grundfläche', 'Höhe'],
  fachwissen: {
    text: 'Aus V = G · h lassen sich die Umkehrungen G = V : h und h = V : G ableiten. Hat ein Prisma eine dreieckige Grundfläche, muss zuerst die Dreiecksfläche G = (g · h_Dreieck) : 2 berechnet werden, bevor man sie mit der Prismenhöhe multipliziert.',
    quelle: 'Wikipedia: Prisma (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Prisma_(Geometrie)',
  },
  generate: mixedVariants(
    // V1 Tippen — Umkehrung: Grundfläche aus Volumen und Höhe
    (rng: Rng) => {
      const g = randInt(rng, 6, 60)
      const h = randInt(rng, 2, 20)
      const v = g * h
      return valueTask({
        question: `Ein gerades Prisma hat das Volumen ${v} cm³ und die Höhe ${h} cm. Wie groß ist die Grundfläche?`,
        unit: 'cm²',
        answerKind: 'integer',
        value: g,
        solution: `${g} cm²`,
        explanation: `G = V : h = ${v} : ${h} = ${g} cm².`,
        dedupeKey: `lb4volprisma-tippen-g:${g}:${h}`,
      })
    },
    // V2 Tippen — Umkehrung: Höhe aus Volumen und Grundfläche
    (rng: Rng) => {
      const g = randInt(rng, 8, 70)
      const h = randInt(rng, 3, 18)
      const v = g * h
      return valueTask({
        question: `Ein gerades Prisma hat das Volumen ${v} cm³ und die Grundfläche ${g} cm². Wie groß ist die Höhe?`,
        unit: 'cm',
        answerKind: 'integer',
        value: h,
        solution: `${h} cm`,
        explanation: `h = V : G = ${v} : ${g} = ${h} cm.`,
        dedupeKey: `lb4volprisma-tippen-h:${g}:${h}`,
      })
    },
    // V3 MC — Dreiecks-Grundfläche + Prismenhöhe kombiniert, /2 vergessen
    (rng: Rng) => {
      const b = randInt(rng, 4, 16)
      let hb = randInt(rng, 4, 16)
      if ((b * hb) % 2 !== 0) hb += 1
      const H = randInt(rng, 3, 15)
      const g = (b * hb) / 2
      const value = roundTo(g * H, 1)
      const correct = `${formatDe(value)} cm³`
      const wrong1 = `${formatDe(roundTo(b * hb * H, 1))} cm³` // /2 für Dreieck vergessen
      const wrong2 = `${formatDe(roundTo(((b + hb) / 2) * H, 1))} cm³` // addiert statt multipliziert
      const wrong3 = `${formatDe(g)} cm³` // Prismenhöhe vergessen
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein gerades Prisma hat eine dreieckige Grundfläche mit Grundseite ${b} cm und Höhe ${hb} cm; das Prisma selbst ist ${H} cm hoch. Welches Ergebnis für das Volumen ist richtig?`,
        choices,
        correct,
        solution: correct,
        explanation: `Erst die Grundfläche: G = (g · h) : 2 = (${b} · ${hb}) : 2 = ${formatDe(g)} cm². Dann Volumen = G · H = ${formatDe(g)} · ${H} = ${formatDe(value)} cm³.`,
        dedupeKey: `lb4volprisma-mc:${b}:${hb}:${H}`,
      })
    },
    // V4 Visual — Höhe aus Volumen und abgebildeter Grundfläche
    (rng: Rng) => {
      const g = randInt(rng, 10, 70)
      const h = randInt(rng, 3, 16)
      const v = g * h
      return visualTask({
        question: `Das abgebildete Prisma hat das Volumen ${v} cm³. Wie groß ist die Höhe h?`,
        unit: 'cm',
        answerKind: 'integer',
        value: h,
        solution: `${h} cm`,
        explanation: `h = V : G = ${v} : ${g} = ${h} cm.`,
        visualContent: generatePrismVolumeSvg({
          baseAreaLabel: `${g} cm²`,
          heightLabel: '?',
        }),
      })
    },
  ),
})

// 26) Fläche und senkrechte Seitenlänge (Dimensionsdenken 2D × 1D = 3D)
const flaecheKanteQuaderNeu: Topic = asNeuTopic('lb4-flaeche-kante-quader', {
  id: 'lb4-flaeche-kante-quader__neu',
  title: 'Fläche und senkrechte Seitenlänge',
  hint: '2D · 1D = 3D: V = G · h, also G = V : h und h = V : G.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Quader', 'Würfel', 'Volumen', 'Grundfläche', 'Höhe', 'Dimension', 'Prisma'],
  fachwissen: {
    text: 'Beim Quader, Würfel und Prisma gilt immer: Volumen (3D) = Flächeninhalt (2D) · dazu senkrechte Länge (1D). Beim Würfel ist jede Seitenfläche A = a² und V = A · a, also a = V : A — eine Kantenlänge lässt sich also sogar aus Volumen und einer einzigen Seitenfläche bestimmen.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    // V1 Visual — Würfel: Kante aus Volumen und Seitenfläche
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const area = a * a
      const v = area * a
      return visualTask({
        question: `Ein Würfel hat das Volumen ${v} cm³. Eine Seitenfläche misst ${area} cm². Wie lang ist eine Kante?`,
        unit: 'cm',
        answerKind: 'integer',
        value: a,
        solution: `${a} cm`,
        explanation: `V = A · a ⇒ a = V : A = ${v} : ${area} = ${a} cm (Kontrolle: A = a² = ${a}² = ${area} cm²).`,
        visualContent: generateCuboidSvg({
          lengthLabel: '',
          widthLabel: '',
          heightLabel: '',
          cube: true,
          areaFace: 'top',
          areaLabel: `A = ${area} cm²`,
          perpendicularLabel: '?',
        }),
      })
    },
    // V2 MC — Höhe aus Volumen und Grundfläche, mit Visual
    (rng: Rng) => {
      const g = randInt(rng, 10, 60)
      const h = randInt(rng, 3, 15)
      const v = g * h
      const correct = `${h} cm`
      const wrong1 = `${g} cm` // Grundfläche mit Höhe verwechselt
      const wrong2 = `${v} cm` // gar nicht dividiert
      const wrong3 = `${formatDe(roundTo(g / h, 2))} cm` // falsch herum dividiert
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Ein Quader hat das Volumen ${v} cm³ und die Grundfläche ${g} cm². Welche Höhe (senkrecht zur Grundfläche) ist richtig?`,
        choices,
        correct,
        solution: correct,
        explanation: `2D · 1D = 3D: V = G · h ⇒ h = V : G = ${v} : ${g} = ${h} cm.`,
        visualContent: generateCuboidSvg({
          lengthLabel: '',
          widthLabel: '',
          heightLabel: '',
          areaFace: 'top',
          areaLabel: `G = ${g} cm²`,
          perpendicularLabel: '?',
        }),
        dedupeKey: `lb4flaechekante-mc:${g}:${h}`,
      })
    },
    // V3 Visual — Dezimalmaße, Vorderfläche ↔ Tiefenkante
    (rng: Rng) => {
      const a = pick(rng, [2, 2.5, 3, 3.5])
      const b = pick(rng, [2, 2.5, 3])
      const c = randInt(rng, 3, 12)
      const face = roundTo(a * b, 2)
      const v = roundTo(face * c, 2)
      return visualTask({
        question: `Ein Quader hat das Volumen ${formatDe(v)} cm³. Die gelb markierte Vorderfläche misst ${formatDe(face)} cm². Wie lang ist die dazu senkrechte Kante (in die Tiefe)?`,
        unit: 'cm',
        answerKind: 'integer',
        value: c,
        solution: `${c} cm`,
        explanation: `V = A · c (Fläche · senkrechte Länge) ⇒ c = V : A = ${formatDe(v)} : ${formatDe(face)} = ${c} cm.`,
        visualContent: generateCuboidFaceEdgeSvg({
          faceAreaLabel: `${formatDe(face)} cm²`,
          faceEdgeLabel: `${formatDe(a)} cm`,
          perpendicularLabel: '?',
          caption: `V = ${formatDe(v)} cm³`,
          highlightFace: 'front',
        }),
      })
    },
    // V4 Visual — rechte Seitenfläche gesucht
    (rng: Rng) => {
      const a = randInt(rng, 3, 10)
      const b = randInt(rng, 3, 10)
      const c = randInt(rng, 4, 14)
      const face = b * c
      const v = face * a
      return visualTask({
        question: `Ein Quader hat das Volumen ${v} cm³. Die Kante senkrecht zur gelb markierten rechten Seitenfläche misst ${a} cm. Wie groß ist der Flächeninhalt dieser Seitenfläche?`,
        unit: 'cm²',
        answerKind: 'integer',
        value: face,
        solution: `${face} cm²`,
        explanation: `V = A · a ⇒ A = V : a = ${v} : ${a} = ${face} cm².`,
        visualContent: generateCuboidFaceEdgeSvg({
          faceAreaLabel: '?',
          faceEdgeLabel: '?',
          perpendicularLabel: `${a} cm`,
          caption: `V = ${v} cm³`,
          highlightFace: 'right',
          faceKindLabel: 'Rechte Seitenfläche',
        }),
      })
    },
  ),
})

// 27) Würfelnetz erkennen
const wuerfelnetzNeu: Topic = asNeuTopic('lb4-wuerfelnetz', {
  id: 'lb4-wuerfelnetz__neu',
  title: 'Würfelnetz erkennen',
  hint: 'Ein faltbares Netz hat sechs Quadrate ohne Überlappung beim Falten.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Würfel', 'Körpernetz', 'Netz', 'falten', 'Prisma', 'Kanten', 'Ecken', 'Flächen'],
  fachwissen: {
    text: 'Ein Würfel hat 6 Flächen, 12 Kanten und 8 Ecken. Für den Würfel gibt es genau 11 verschiedene faltbare Netze aus sechs Quadraten. Auch bei einem dreiseitigen Prisma besteht das Netz aus zwei Dreiecken (Grund- und Deckfläche) und drei Rechtecken (Seitenflächen) — nicht jede Anordnung dieser Teile ist faltbar.',
    quelle: 'Wikipedia: Netz (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Netz_(Geometrie)',
  },
  generate: mixedVariants(
    // V1 Tippen — Ecken/Kanten/Flächen des Würfels (mit Visual)
    (rng: Rng) => {
      const kind = pick(rng, ['Flächen', 'Kanten', 'Ecken'] as const)
      const value = kind === 'Flächen' ? 6 : kind === 'Kanten' ? 12 : 8
      const explanations: Record<string, string> = {
        Flächen: 'Ein Würfel hat 6 gleich große, quadratische Flächen (Seitenflächen).',
        Kanten: 'Ein Würfel hat 12 gleich lange Kanten.',
        Ecken: 'Ein Würfel hat 8 Ecken (Eckpunkte).',
      }
      return visualTask({
        question: `Der abgebildete Würfel hat überall gleich lange Kanten. Wie viele ${kind} hat ein Würfel?`,
        answerKind: 'integer',
        value,
        solution: `${value}`,
        explanation: explanations[kind]!,
        visualContent: generateCuboidSvg({
          lengthLabel: 'a',
          widthLabel: 'a',
          heightLabel: 'a',
          cube: true,
        }),
      })
    },
    // V2 MC — Anzahl der Würfelnetze (Faktenwissen)
    (rng: Rng) => {
      const correct = '11'
      const choices = shuffleChoices(rng, ['6', '8', '11', '12'], correct)
      return choicePickTask({
        question: 'Wie viele unterschiedliche Netze (aus sechs Quadraten) kann man zu einem Würfel falten?',
        choices,
        correct,
        solution: correct,
        explanation: 'Es gibt genau 11 verschiedene Würfelnetze — alle anderen Anordnungen aus sechs Quadraten lassen sich nicht faltbar zu einem Würfel zusammensetzen.',
        instruction: 'Tippe die Anzahl:',
      })
    },
    // V3 Visual MC — nicht faltbares Netz erkennen
    (rng: Rng) => {
      const invalid = pick(rng, ['invalid-row', 'invalid-block'] as const)
      const options: Array<{ kind: 'cross' | 'zigzag' | 'invalid-row' | 'invalid-block'; label: string }> = [
        { kind: 'cross', label: 'A' },
        { kind: 'zigzag', label: 'B' },
        { kind: invalid, label: 'C' },
      ]
      for (let i = options.length - 1; i > 0; i--) {
        const j = randInt(rng, 0, i)
        ;[options[i], options[j]] = [options[j]!, options[i]!]
      }
      options.forEach((o, i) => {
        o.label = String.fromCharCode(65 + i)
      })
      const correct = options.find((o) => o.kind === invalid)!.label
      return choicePickTask({
        question: 'Welches der drei Netze lässt sich NICHT zu einem Würfel falten?',
        choices: ['A', 'B', 'C'],
        correct,
        solution: correct,
        explanation: `Netz ${correct} überlappt beim Falten bzw. schließt sich nicht zu einem Würfel. Die anderen beiden Netze (Kreuz- bzw. Zickzackform) sind gültige Würfelnetze.`,
        visualContent: generateCubeNetChoicesSvg(options),
        instruction: 'Tippe den Buchstaben des nicht faltbaren Netzes:',
      })
    },
    // V4 Visual MC — Prismennetz erkennen
    (rng: Rng) => {
      const validFirst = rng() < 0.5
      const options: Array<{ kind: 'valid' | 'invalid'; label: string }> = validFirst
        ? [
            { kind: 'valid', label: 'A' },
            { kind: 'invalid', label: 'B' },
          ]
        : [
            { kind: 'invalid', label: 'A' },
            { kind: 'valid', label: 'B' },
          ]
      const correct = validFirst ? 'A' : 'B'
      return choicePickTask({
        question: 'Welches der beiden Netze lässt sich zu einem dreiseitigen Prisma falten?',
        choices: ['A', 'B'],
        correct,
        solution: correct,
        explanation: `Netz ${correct} zeigt zwei Dreiecke (Grund- und Deckfläche) und drei Rechtecke (Seitenflächen) richtig angeordnet — das lässt sich zu einem Prisma falten. Die andere Anordnung überlappt bzw. schließt nicht.`,
        visualContent: generatePrismNetChoicesSvg(options),
        instruction: 'Tippe den Buchstaben des faltbaren Netzes:',
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// LB5 — Vernetzung: Anteile, Prozent, Einheiten (zusätzliche Bank)
// ---------------------------------------------------------------------------

// 28) Anteil einer Größe berechnen
const anteilVonGroesseNeu: Topic = asNeuTopic('lb5-anteil-groesse', {
  id: 'lb5-anteil-groesse__neu',
  title: 'Anteil einer Größe berechnen',
  hint: 'Erst durch den Nenner teilen, dann mit dem Zähler multiplizieren.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Anteil', 'Bruch', 'Größe', 'Zähler', 'Nenner'],
  fachwissen: {
    text: 'Kennt man den Anteil p/q und den berechneten Teil, lässt sich die ganze Größe zurückrechnen: ein Teil entspricht Teilwert : p, die ganze Größe ist dann (Teilwert : p) · q. Diese Umkehrung ist nützlich, wenn z. B. nur „3/4 des Preises sind 60 €" bekannt ist und der volle Preis gesucht wird.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    // V1 Tippen — Umkehrung: Anteil-Wert bekannt, ganze Größe gesucht
    (rng: Rng) => {
      const d = pick(rng, [2, 3, 4, 5, 6, 8])
      const n = randInt(rng, 1, d - 1)
      const unit = pick(rng, ['kg', 'm', '€', 'Liter'])
      const whole = d * randInt(rng, 2, 12)
      const value = (n / d) * whole
      return valueTask({
        question: `${n}/${d} einer Menge sind ${formatDe(value)} ${unit}. Wie groß ist die ganze Menge?`,
        unit,
        answerKind: 'decimal',
        value: whole,
        solution: `${formatDe(whole)} ${unit}`,
        explanation: `Ein Teil entspricht ${formatDe(value)} : ${n} = ${formatDe(value / n)} ${unit}. Die ganze Menge (${d} Teile) ist ${formatDe(value / n)} · ${d} = ${formatDe(whole)} ${unit}.`,
        dedupeKey: `lb5anteilgroesse-tippen:${n}:${d}:${whole}`,
      })
    },
    // V2 MC — typische Fehler beim Anteil berechnen
    (rng: Rng) => {
      const d = pick(rng, [2, 4, 5, 8])
      const n = randInt(rng, 1, d - 1)
      const unit = pick(rng, ['kg', 'm', '€'])
      const whole = d * randInt(rng, 2, 10)
      const value = (n / d) * whole
      const correct = `${formatDe(value)} ${unit}`
      const wrong1 = `${formatDe(n * whole)} ${unit}` // nicht durch Nenner geteilt
      const wrong2 = `${formatDe(((d - n) / d) * whole)} ${unit}` // Gegenanteil berechnet
      const wrong3 = `${formatDe(whole / d)} ${unit}` // Zähler vergessen (nur ein Teil)
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `Berechne ${n}/${d} von ${whole} ${unit}. Welches Ergebnis ist richtig?`,
        choices,
        correct,
        solution: correct,
        explanation: `Ein Teil = ${whole} : ${d} = ${formatDe(whole / d)} ${unit}. ${n} Teile = ${formatDe(whole / d)} · ${n} = ${formatDe(value)} ${unit}.`,
        dedupeKey: `lb5anteilgroesse-mc:${n}:${d}:${whole}`,
      })
    },
    // V3 Visual — Streifen zeigt Anteil, Teilwert bekannt, ganze Menge gesucht
    (rng: Rng) => {
      const d = pick(rng, [2, 4, 5, 8])
      const n = randInt(rng, 1, d - 1)
      const unit = pick(rng, ['kg', 'm', '€'])
      const whole = d * randInt(rng, 2, 10)
      const value = (n / d) * whole
      return visualTask({
        question: `Der Streifen zeigt den Anteil ${n}/${d}. Der eingefärbte Teil entspricht ${formatDe(value)} ${unit}. Wie groß ist die ganze Menge?`,
        unit,
        answerKind: 'decimal',
        value: whole,
        solution: `${formatDe(whole)} ${unit}`,
        explanation: `Ein Teil = ${formatDe(value)} : ${n} = ${formatDe(value / n)} ${unit}. Ganze Menge = ${formatDe(value / n)} · ${d} = ${formatDe(whole)} ${unit}.`,
        visualContent: generateFractionBarSvg({
          numerator: n,
          denominator: d,
          showLabel: true,
        }),
      })
    },
    // V4 Visual — Kreisdiagramm, nicht eingefärbter Teil gesucht
    (rng: Rng) => {
      const d = pick(rng, [4, 5, 8, 10])
      const n = randInt(rng, 1, d - 1)
      const unit = pick(rng, ['kg', '€', 'Liter'])
      const whole = d * randInt(rng, 3, 12)
      const valueColored = (n / d) * whole
      const valueRest = whole - valueColored
      return visualTask({
        question: `Das Kreisdiagramm zeigt den Anteil ${n}/${d} von ${whole} ${unit} (eingefärbt). Wie groß ist der NICHT eingefärbte Teil?`,
        unit,
        answerKind: 'decimal',
        value: valueRest,
        solution: `${formatDe(valueRest)} ${unit}`,
        explanation: `Eingefärbt: ${n}/${d} · ${whole} = ${formatDe(valueColored)} ${unit}. Rest: ${whole} − ${formatDe(valueColored)} = ${formatDe(valueRest)} ${unit}.`,
        visualContent: generateFractionCircleSvg({
          numerator: n,
          denominator: d,
          showLabel: true,
        }),
      })
    },
  ),
})

// 29) Prozent einer Größe berechnen
const anteilProzentNeu: Topic = asNeuTopic('lb5-anteil-prozent', {
  id: 'lb5-anteil-prozent__neu',
  title: 'Prozent einer Größe berechnen',
  hint: 'W = G · p : 100; umgekehrt G = W : p · 100 und p = W : G · 100.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Prozent', 'Grundwert', 'Prozentwert', 'Prozentsatz'],
  fachwissen: {
    text: 'Aus W = G · p / 100 lassen sich zwei Umkehrungen bilden: Den Grundwert erhält man mit G = (W : p) · 100, den Prozentsatz mit p = (W : G) · 100. Alle drei Größen — Grundwert, Prozentsatz, Prozentwert — hängen über diese eine Formel zusammen.',
    quelle: 'Wikipedia: Prozentrechnung',
    url: 'https://de.wikipedia.org/wiki/Prozentrechnung',
  },
  generate: mixedVariants(
    // V1 Tippen — Umkehrung: Grundwert aus Prozentwert und Prozentsatz
    (rng: Rng) => {
      const percent = pick(rng, [10, 20, 25, 50, 75, 5])
      const unit = pick(rng, ['€', 'kg', 'm', 'Liter'])
      const whole = pick(rng, [20, 40, 50, 60, 80, 100, 200])
      const value = roundTo((percent / 100) * whole, 2)
      return valueTask({
        question: `${percent} % einer Menge sind ${formatDe(value)} ${unit}. Wie groß ist die ganze Menge (Grundwert)?`,
        unit,
        answerKind: 'decimal',
        value: whole,
        solution: `${formatDe(whole)} ${unit}`,
        explanation: `G = W : p · 100 = ${formatDe(value)} : ${percent} · 100 = ${formatDe(roundTo(value / percent, 4))} · 100 = ${formatDe(whole)} ${unit}.`,
        dedupeKey: `lb5anteilprozent-tippen:${percent}:${whole}`,
      })
    },
    // V2 MC — Prozentsatz aus Prozentwert und Grundwert
    (rng: Rng) => {
      const percent = pick(rng, [10, 20, 25, 50, 75])
      const unit = pick(rng, ['€', 'kg', 'Liter'])
      const whole = pick(rng, [40, 50, 80, 100, 200])
      const value = roundTo((percent / 100) * whole, 2)
      const correct = `${percent} %`
      const wrong1 = `${formatDe(roundTo(value / whole, 2))} %` // ·100 vergessen
      const wrong2 = `${formatDe(roundTo((whole / value) * 100, 1))} %` // Verhältnis vertauscht
      const wrong3 = `${percent + 10} %` // nahe Rateantwort
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `${formatDe(value)} ${unit} sind wie viel Prozent von ${whole} ${unit}?`,
        choices,
        correct,
        solution: correct,
        explanation: `p = (W : G) · 100 = (${formatDe(value)} : ${whole}) · 100 = ${formatDe(roundTo(value / whole, 4))} · 100 = ${percent} %.`,
        dedupeKey: `lb5anteilprozent-mc:${percent}:${whole}`,
      })
    },
    // V3 Visual — Streifen zeigt Prozent, Teilwert bekannt, ganze Menge gesucht
    (rng: Rng) => {
      const percent = pick(rng, [10, 20, 25, 50, 75])
      const unit = pick(rng, ['€', 'kg'])
      const whole = pick(rng, [40, 50, 80, 100, 200])
      const value = roundTo((percent / 100) * whole, 2)
      const denom = percent % 10 === 0 ? 10 : 4
      const num = Math.round((percent / 100) * denom)
      return visualTask({
        question: `Der Streifen zeigt ${percent} % einer Menge. Der eingefärbte Teil entspricht ${formatDe(value)} ${unit}. Wie groß ist die ganze Menge?`,
        unit,
        answerKind: 'decimal',
        value: whole,
        solution: `${formatDe(whole)} ${unit}`,
        explanation: `${percent} % entsprechen ${formatDe(value)} ${unit}. 100 % (ganze Menge) = ${formatDe(value)} : ${percent} · 100 = ${formatDe(whole)} ${unit}.`,
        visualContent: generateFractionBarSvg({
          numerator: num,
          denominator: denom,
          showLabel: true,
        }),
      })
    },
    // V4 Visual — Kreisdiagramm, nicht eingefärbter Teil (Rest-Prozent) gesucht
    (rng: Rng) => {
      const percent = pick(rng, [25, 50, 75])
      const unit = pick(rng, ['€', 'kg', 'Liter'])
      const whole = pick(rng, [40, 80, 100, 200])
      const valueColored = roundTo((percent / 100) * whole, 2)
      const valueRest = roundTo(whole - valueColored, 2)
      const restPercent = 100 - percent
      const denom = 4
      const num = percent / 25
      return visualTask({
        question: `Das Kreisdiagramm zeigt ${percent} % von ${whole} ${unit} (eingefärbt). Wie groß ist der NICHT eingefärbte Teil (${restPercent} %)?`,
        unit,
        answerKind: 'decimal',
        value: valueRest,
        solution: `${formatDe(valueRest)} ${unit}`,
        explanation: `Eingefärbt: ${percent} % von ${whole} ${unit} = ${formatDe(valueColored)} ${unit}. Rest (${restPercent} %): ${formatDe(whole)} − ${formatDe(valueColored)} = ${formatDe(valueRest)} ${unit}.`,
        visualContent: generateFractionCircleSvg({
          numerator: num,
          denominator: denom,
          showLabel: true,
        }),
      })
    },
  ),
})

// 30) Flächeneinheiten umrechnen
const umrechnenFlaecheNeu: Topic = asNeuTopic('k6-umrechnen-flaeche', {
  id: 'k6-umrechnen-flaeche__neu',
  title: 'Einheiten umrechnen: Flächeninhalt',
  hint: '1 m² = 10 000 cm², da Länge UND Breite je ×100 gehen.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Fläche', 'Flächeninhalt', 'Flächeneinheiten', 'm²', 'cm²', 'a', 'ha', 'umrechnen'],
  fachwissen: {
    text: 'Bei Flächeneinheiten ist der Umrechnungsfaktor zwischen zwei benachbarten Einheiten nicht 10 oder 100 wie bei Längen, sondern das Quadrat davon: 1 m² = 10 000 cm², weil sowohl Länge als auch Breite mit 100 multipliziert werden. Für Grundstücke verwendet man die Sondereinheiten Ar (1 a = 100 m²) und Hektar (1 ha = 10 000 m²).',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    // V1 Tippen — m² in cm² (Faktor 10 000)
    (rng: Rng) => {
      const whole = randInt(rng, 2, 9)
      const value = whole * 10000
      return valueTask({
        question: `Rechne um: ${whole} m² = ? cm²`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `1 m² = 10 000 cm² (Länge und Breite gehen je ×100). ${whole} m² = ${whole} · 10 000 = ${value} cm².`,
        dedupeKey: `k6umrflaeche-tippen:${whole}`,
      })
    },
    // V2 MC — falscher Umrechnungsfaktor
    (rng: Rng) => {
      const whole = randInt(rng, 2, 9)
      const correct = `${whole * 10000} cm²`
      const wrong1 = `${whole * 100} cm²` // falscher Faktor 100 statt 10 000
      const wrong2 = `${whole} cm²` // gar nicht umgerechnet
      const wrong3 = `${whole * 1000} cm²` // mit Volumen-Faktor verwechselt
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `${whole} m² sind wie viele cm²?`,
        choices,
        correct,
        solution: correct,
        explanation: `1 m² = 10 000 cm², da beide Seiten (Länge und Breite) mit 100 multipliziert werden (100 · 100 = 10 000). ${whole} m² = ${whole} · 10 000 cm² = ${whole * 10000} cm².`,
        dedupeKey: `k6umrflaeche-mc:${whole}`,
      })
    },
    // V3 Visual — Rechteck in m, Fläche in cm² gesucht
    (rng: Rng) => {
      const a = randInt(rng, 2, 8)
      const b = randInt(rng, 2, 7)
      const flaecheM2 = a * b
      const value = flaecheM2 * 10000
      return visualTask({
        question: `Das abgebildete Rechteck ist ${a} m lang und ${b} m breit. Wie groß ist seine Fläche in cm²?`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${formatDe(value)} cm²`,
        explanation: `Fläche = ${a} · ${b} = ${flaecheM2} m². Umrechnung: ${flaecheM2} m² = ${flaecheM2} · 10 000 cm² = ${formatDe(value)} cm².`,
        visualContent: generateRectangleSvg({
          widthLabel: `${a} m`,
          heightLabel: `${b} m`,
        }),
      })
    },
    // V4 Tippen — Sachaufgabe: m² in a (Ar)
    (rng: Rng) => {
      const m2 = randInt(rng, 2, 40) * 100
      const value = m2 / 100
      return valueTask({
        question: `Ein Grundstück ist ${m2} m² groß. Wie viele a (Ar) sind das?`,
        unit: 'a',
        answerKind: 'integer',
        value,
        solution: `${value} a`,
        explanation: `1 a = 100 m². ${m2} m² : 100 = ${value} a.`,
        dedupeKey: `k6umrflaeche-ar:${m2}`,
      })
    },
  ),
})

// 31) Längeneinheiten umrechnen
const umrechnenLaengeNeu: Topic = asNeuTopic('k6-umrechnen-laenge', {
  id: 'k6-umrechnen-laenge__neu',
  title: 'Einheiten umrechnen: Länge',
  hint: '1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm.',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Länge', 'Längeneinheiten', 'mm', 'cm', 'dm', 'm', 'km', 'umrechnen'],
  fachwissen: {
    text: 'Bei Längeneinheiten gilt zwischen benachbarten Einheiten meist der Faktor 10 (mm↔cm↔dm) oder 100/1000 (m↔cm, km↔m). Häufige Fehlerquelle: den falschen Faktor aus einer anderen Einheitenstufe verwenden, z. B. ×10 statt ×100 bei m→cm.',
    quelle: 'Wikipedia: Länge',
    url: 'https://de.wikipedia.org/wiki/L%C3%A4nge',
  },
  generate: mixedVariants(
    // V1 Tippen — km in m
    (rng: Rng) => {
      const km = randInt(rng, 2, 9)
      const value = km * 1000
      return valueTask({
        question: `Rechne um: ${km} km = ? m`,
        unit: 'm',
        answerKind: 'integer',
        value,
        solution: `${value} m`,
        explanation: `1 km = 1000 m. ${km} km = ${km} · 1000 = ${value} m.`,
        dedupeKey: `k6umrlaenge-tippen:${km}`,
      })
    },
    // V2 MC — falscher Umrechnungsfaktor
    (rng: Rng) => {
      const m = randInt(rng, 2, 9)
      const correct = `${m * 100} cm`
      const wrong1 = `${m * 10} cm` // mit dm-Faktor verwechselt
      const wrong2 = `${m * 1000} cm` // mit mm-Faktor verwechselt
      const wrong3 = `${m} cm` // gar nicht umgerechnet
      const choices = shuffleChoices(rng, fourChoices(correct, [wrong1, wrong2, wrong3]), correct)
      return choicePickTask({
        question: `${m} m sind wie viele cm?`,
        choices,
        correct,
        solution: correct,
        explanation: `1 m = 100 cm. ${m} m = ${m} · 100 = ${m * 100} cm.`,
        dedupeKey: `k6umrlaenge-mc:${m}`,
      })
    },
    // V3 Visual — Rechteck in dm, Umfang in cm gesucht
    (rng: Rng) => {
      const a = randInt(rng, 2, 9)
      const b = randInt(rng, 2, 9)
      const perimeterDm = 2 * (a + b)
      const valueCm = perimeterDm * 10
      return visualTask({
        question: `Das abgebildete Rechteck hat die Seiten ${a} dm und ${b} dm. Wie groß ist sein Umfang in cm?`,
        unit: 'cm',
        answerKind: 'integer',
        value: valueCm,
        solution: `${valueCm} cm`,
        explanation: `Umfang = 2 · (${a} + ${b}) = ${perimeterDm} dm. Umrechnung: ${perimeterDm} dm = ${perimeterDm} · 10 cm = ${valueCm} cm (1 dm = 10 cm).`,
        visualContent: generateRectangleSvg({
          widthLabel: `${a} dm`,
          heightLabel: `${b} dm`,
        }),
      })
    },
    // V4 Tippen — Sachaufgabe: mm in cm
    (rng: Rng) => {
      const mm = randInt(rng, 15, 995)
      const value = roundTo(mm / 10, 1)
      return valueTask({
        question: `Eine Schnecke kriecht ${mm} mm weit. Wie viele cm sind das?`,
        unit: 'cm',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} cm`,
        explanation: `1 cm = 10 mm, also ${mm} mm : 10 = ${formatDe(value)} cm.`,
        dedupeKey: `k6umrlaenge-mm:${mm}`,
      })
    },
  ),
})

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const math6NeuLb1: Topic[] = [
  kuerzenNeu,
  erweiternNeu,
  vergleichenNeu,
  addSubNeu,
  multNeu,
  divNeu,
  bruchDezimalNeu,
  prozentNeu,
  dezAddSubNeu,
  dezMultNeu,
  dezDivNeu,
  rundenNeu,
  sachaufgabeBruchNeu,
]
export const math6NeuLb2: Topic[] = [
  proportionalNeu,
  antiproportionalNeu,
  haeufigkeitNeu,
  sachaufgabeDreisatzNeu,
]
export const math6NeuLb3: Topic[] = [
  winkelDreieckNeu,
  winkelViereckNeu,
  umfangRechteckNeu,
  flaecheRechteckNeu,
  flaecheDreieckNeu,
  kongruenzSatzNeu,
  sachaufgabeGeometrieNeu,
]
export const math6NeuLb4: Topic[] = [
  volumenQuaderNeu,
  oberflaecheQuaderNeu,
  volumenPrismaNeu,
  flaecheKanteQuaderNeu,
  wuerfelnetzNeu,
]
export const math6NeuLb5: Topic[] = [
  anteilVonGroesseNeu,
  anteilProzentNeu,
  umrechnenFlaecheNeu,
  umrechnenLaengeNeu,
]

export const math6NeuTopics: Topic[] = [
  ...math6NeuLb1,
  ...math6NeuLb2,
  ...math6NeuLb3,
  ...math6NeuLb4,
  ...math6NeuLb5,
]
