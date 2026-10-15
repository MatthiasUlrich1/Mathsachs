import { pick, randInt, type Rng } from '../lib/rng'
import {
  generateAssignmentGraphSvg,
  generateCuboidSvg,
  generateCubeNetChoicesSvg,
  generateCuboidFaceEdgeSvg,
  generateFractionBarSvg,
  generateFractionCircleSvg,
  generateFractionGridSvg,
  generatePrismVolumeSvg,
  generateQuadAnglesSvg,
  generateRightTriangleSvg,
  generateTriangleAnglesSvg,
  generateTriangleSvg,
  generateValueTableSvg,
  type CubeNetKind,
} from '../lib/geometrySvg'
import { generateExtrudedPrismSvg, generateQuadrilateralSvg } from '../lib/figureSvg'
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
import { formatDe, roundTo } from '../lib/num'
import {
  choicePickTask,
  dragDropSortTask,
  fractionTask,
  mixedVariants,
  numberLineTask,
  textTask,
  valueTask,
  visualTask,
} from './taskHelpers'
import { conversionTopic, FLAECHE, LAENGE } from './units'
import type { Grade, Topic } from './types'
import { MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE } from './mathLehrplanTeilaspekte'
import { shuffleArr } from './mathApplied'

/** Side-by-side fraction diagrams for comparison tasks. */
function twoFractionVisual(a: Fraction, b: Fraction, kind: 'circle' | 'bar'): string {
  const left =
    kind === 'circle'
      ? generateFractionCircleSvg({ numerator: a.n, denominator: a.d })
      : generateFractionBarSvg({ numerator: a.n, denominator: a.d })
  const right =
    kind === 'circle'
      ? generateFractionCircleSvg({ numerator: b.n, denominator: b.d, fillColor: '#e67e22' })
      : generateFractionBarSvg({ numerator: b.n, denominator: b.d, fillColor: '#e67e22' })
  return `<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-items:center">${left}<span style="font-size:1.6rem;font-weight:700;color:#64748b">?</span>${right}</div>`
}

// ---------------------------------------------------------------------------
// Lernbereich 1 — Arbeiten mit gebrochenen Zahlen
// ---------------------------------------------------------------------------

const BRUCH_NENNER = [2, 3, 4, 5, 6, 8, 10, 12] as const

const kuerzen: Topic = {
  id: 'lb1-kuerzen',
  title: 'Gleichungen und Ungleichungen mit Brüchen inhaltlich lösen',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Gleichungen wie 9/5 − a = 1 oder 7 = 14 · v löst man inhaltlich mit der Umkehraufgabe: Ein fehlender Summand ist Summe minus bekannter Summand, ein fehlender Subtrahend ist Minuend minus Differenz, ein fehlender Faktor ist Produkt geteilt durch den bekannten Faktor. Bei Ungleichungen wie 3/4 · x < 3/4 hilft die Überlegung: Multipliziert man mit einer Zahl kleiner als 1, wird das Ergebnis kleiner; mit einer Zahl größer als 1 wird es größer.',
    quelle: 'Wikipedia: Gleichung',
    url: 'https://de.wikipedia.org/wiki/Gleichung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      for (;;) {
        const p = makeFraction(randInt(rng, 1, 7), pick(rng, BRUCH_NENNER))
        const x = makeFraction(randInt(rng, 1, 7), pick(rng, BRUCH_NENNER))
        if (p.d === 1 || x.d === 1 || p.d === x.d) continue
        const b = add(p, x)
        return fractionTask({
          question: `Löse inhaltlich: ${format(p)} + x = ${format(b)}`,
          value: x,
          solution: `x = ${format(x)}`,
          explanation: `Gesucht ist der fehlende Summand: x = ${format(b)} − ${format(p)} = ${format(x)}. Probe: ${format(p)} + ${format(x)} = ${format(b)}.`,
          dedupeKey: `ma:k6:gl:add:${format(p)}:${format(x)}`,
        })
      }
    },
    (rng: Rng) => {
      for (;;) {
        const d = pick(rng, BRUCH_NENNER)
        const a = makeFraction(randInt(rng, 1, d - 1), d)
        if (a.d === 1) continue
        const k = randInt(rng, 1, 3)
        const m = add(makeFraction(k, 1), a)
        return fractionTask({
          question: `Löse inhaltlich: ${format(m)} − a = ${k}`,
          value: a,
          solution: `a = ${format(a)}`,
          explanation: `Gesucht ist die Zahl, die man von ${format(m)} subtrahieren muss, um ${k} zu erhalten: a = ${format(m)} − ${k} = ${format(a)}.`,
          dedupeKey: `ma:k6:gl:sub:${format(m)}:${k}`,
        })
      }
    },
    (rng: Rng) => {
      for (;;) {
        const k = randInt(rng, 2, 15)
        const v = makeFraction(randInt(rng, 1, 9), pick(rng, BRUCH_NENNER))
        if (v.d === 1) continue
        const prod = multiply(makeFraction(k, 1), v)
        if (prod.d === 1 && prod.n === k) continue
        const leftProduct = rng() < 0.5
        return fractionTask({
          question: leftProduct
            ? `Löse inhaltlich: ${format(prod)} = ${k} · v`
            : `Löse inhaltlich: ${k} · v = ${format(prod)}`,
          value: v,
          solution: `v = ${format(v)}`,
          explanation: `Gesucht ist der fehlende Faktor: v = ${format(prod)} : ${k} = ${format(v)}. Probe: ${k} · ${format(v)} = ${format(prod)}.`,
          dedupeKey: `ma:k6:gl:mul:${k}:${format(v)}`,
        })
      }
    },
    (rng: Rng) => {
      for (;;) {
        const f = makeFraction(randInt(rng, 1, 4), pick(rng, [3, 5, 7]))
        const kleiner = rng() < 0.5
        const proper = shuffleArr(rng, ['1/2', '2/3', '3/4', '3/5', '5/6', '4/7']).slice(0, kleiner ? 1 : 2)
        const improper = shuffleArr(rng, ['3/2', '4/3', '5/4', '7/5', '2', '5/3']).slice(0, kleiner ? 2 : 1)
        const correct = kleiner ? proper[0]! : improper[0]!
        const choices = shuffleArr(rng, [...proper, ...improper, '1'])
        if (new Set(choices).size !== choices.length) continue
        const zeichen = kleiner ? '<' : '>'
        return choicePickTask({
          question: `Welche Zahl erfüllt die Ungleichung ${format(f)} · x ${zeichen} ${format(f)}?`,
          choices,
          correct,
          solution: `x = ${correct}`,
          explanation: kleiner
            ? `Das Produkt ist kleiner als ${format(f)}, wenn man mit einer Zahl kleiner als 1 multipliziert. Bei x = 1 bleibt der Wert gleich, bei Zahlen größer als 1 wird er größer. Nur ${correct} ist kleiner als 1.`
            : `Das Produkt ist größer als ${format(f)}, wenn man mit einer Zahl größer als 1 multipliziert. Bei x = 1 bleibt der Wert gleich, bei Zahlen kleiner als 1 wird er kleiner. Nur ${correct} ist größer als 1.`,
          dedupeKey: `ma:k6:ungl:${format(f)}:${zeichen}:${correct}`,
        })
      }
    },
  ),
}

const erweitern: Topic = {
  id: 'lb1-erweitern',
  title: 'Hauptnenner finden und Brüche gleichnamig machen',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Zwei Brüche sind gleichnamig, wenn sie denselben Nenner haben. Der kleinste gemeinsame Nenner (Hauptnenner) ist das kleinste gemeinsame Vielfache (kgV) der Nenner; jeder Bruch wird dann mit dem passenden Faktor erweitert. Erst gleichnamige Brüche kann man durch Vergleich der Zähler ordnen oder addieren.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      for (;;) {
        const [d1, d2] = shuffleArr(rng, [4, 6, 8, 9, 10, 12, 14, 15, 18, 20]).slice(0, 2) as [number, number]
        if (d1 % d2 === 0 || d2 % d1 === 0) continue
        const k = (d1 * d2) / gcd(d1, d2)
        const n1 = randInt(rng, 1, d1 - 1)
        const n2 = randInt(rng, 1, d2 - 1)
        const big = Math.max(d1, d2)
        const small = Math.min(d1, d2)
        const multiples = Array.from({ length: k / big }, (_, i) => big * (i + 1))
        return valueTask({
          question: `Wie lautet der Hauptnenner von ${n1}/${d1} und ${n2}/${d2}?`,
          answerKind: 'integer',
          value: k,
          solution: String(k),
          explanation: `Vielfache von ${big}: ${multiples.join(', ')}. ${k} ist das erste Vielfache, das auch durch ${small} teilbar ist, also kgV(${d1}, ${d2}) = ${k}.`,
          dedupeKey: `ma:k6:hn:${small}:${big}`,
        })
      }
    },
    (rng: Rng) => {
      for (;;) {
        const [d1, d2] = shuffleArr(rng, [3, 4, 5, 6, 8, 9, 10, 12]).slice(0, 2) as [number, number]
        if (d1 % d2 === 0 || d2 % d1 === 0) continue
        const k = (d1 * d2) / gcd(d1, d2)
        const n1 = randInt(rng, 1, d1 - 1)
        const n2 = randInt(rng, 1, d2 - 1)
        if (gcd(n1, d1) !== 1 || gcd(n2, d2) !== 1) continue
        return valueTask({
          question: `Mache ${n1}/${d1} und ${n2}/${d2} gleichnamig mit dem Hauptnenner ${k}. Welchen Zähler bekommt ${n2}/${d2}?`,
          answerKind: 'integer',
          value: n2 * (k / d2),
          solution: String(n2 * (k / d2)),
          explanation: `${k} : ${d2} = ${k / d2}, also wird ${n2}/${d2} mit ${k / d2} erweitert: ${n2} · ${k / d2} = ${n2 * (k / d2)}. Ergebnis: ${n2 * (k / d2)}/${k}.`,
          dedupeKey: `ma:k6:gleichnamig:${n1}/${d1}:${n2}/${d2}`,
        })
      }
    },
    (rng: Rng) => {
      for (;;) {
        const ds = shuffleArr(rng, [2, 3, 4, 5, 6, 8, 9, 10, 12]).slice(0, 3) as [number, number, number]
        const k = (ds[0] * ds[1] / gcd(ds[0], ds[1])) * ds[2] / gcd(ds[0] * ds[1] / gcd(ds[0], ds[1]), ds[2])
        if (k > 72 || ds.some((d) => d === k)) continue
        const ns = ds.map((d) => {
          let n = randInt(rng, 1, d - 1)
          while (gcd(n, d) !== 1) n = randInt(rng, 1, d - 1)
          return n
        })
        const terms = ds.map((d, i) => `${ns[i]}/${d}`)
        return valueTask({
          question: `Lisa will ${terms.join(' + ')} berechnen. Welchen Hauptnenner wählt sie?`,
          answerKind: 'integer',
          value: k,
          solution: String(k),
          explanation: `Der Hauptnenner ist das kgV von ${ds.join(', ')}: ${k} ist die kleinste Zahl, die durch ${ds.join(', ')} teilbar ist (${ds.map((d) => `${k} : ${d} = ${k / d}`).join(', ')}).`,
          dedupeKey: `ma:k6:hn3:${[...ds].sort((a, b) => a - b).join(':')}`,
        })
      }
    },
  ),
}

const vergleichen: Topic = {
  id: 'lb1-vergleichen',
  title: 'Brüche vergleichen',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Um zwei Brüche zu vergleichen, bringt man sie auf einen gemeinsamen Nenner und vergleicht dann die Zähler. Das kleinste gemeinsame Vielfache (kgV) der Nenner ist der günstigste gemeinsame Nenner. Alternativ kann man beide Brüche in Dezimalzahlen umwandeln und dann vergleichen.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const byValue = new Map<number, Fraction>()
      while (byValue.size < 4) {
        const f = makeFraction(randInt(rng, 1, 11), randInt(rng, 2, 12))
        if (f.d === 1) continue
        byValue.set(roundTo(toDecimal(f), 9), f)
      }
      const list = [...byValue.entries()].sort((x, y) => y[0] - x[0])
      const biggest = list[0]![1]
      const smallestWanted = rng() < 0.4
      const target = smallestWanted ? list[list.length - 1]![1] : biggest
      const choices = shuffleArr(rng, list.map(([, f]) => format(f)))
      return choicePickTask({
        question: `Welcher der Brüche ist am ${smallestWanted ? 'kleinsten' : 'größten'}?`,
        choices,
        correct: format(target),
        solution: format(target),
        explanation: `Als Dezimalzahlen: ${list.map(([v, f]) => `${format(f)} ≈ ${formatDe(roundTo(v, 3))}`).join(', ')}. Am ${smallestWanted ? 'kleinsten' : 'größten'} ist ${format(target)}.`,
        dedupeKey: `ma:k6:bruchvergl:mc:${[...choices].sort().join(',')}:${smallestWanted}`,
      })
    },
    (rng: Rng) => {
      const properFraction = (): Fraction => {
        for (;;) {
          const f = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
          if (f.d > 1 && f.n < f.d) return f
        }
      }
      const a = properFraction()
      let b = properFraction()
      if (rng() < 0.2) b = { n: a.n * 2, d: a.d * 2 }
      const cmp = a.n * b.d - b.n * a.d
      const correct = cmp > 0 ? 'Der linke Anteil ist größer.' : cmp < 0 ? 'Der rechte Anteil ist größer.' : 'Beide Anteile sind gleich groß.'
      return {
        ...choicePickTask({
          question: 'Vergleiche die beiden dargestellten Bruchanteile.',
          choices: ['Der linke Anteil ist größer.', 'Der rechte Anteil ist größer.', 'Beide Anteile sind gleich groß.'],
          correct,
          solution: correct,
          explanation: `Links ${format(a)}, rechts ${format(b)}. Mit dem gemeinsamen Nenner ${a.d * b.d}: ${a.n * b.d}/${a.d * b.d} und ${b.n * a.d}/${a.d * b.d}.`,
          dedupeKey: `ma:k6:bruchvergl:bild:${a.n}/${a.d}:${b.n}/${b.d}`,
        }),
        visualContent: twoFractionVisual(a, b, pick(rng, ['circle', 'bar'] as const)),
      }
    },
    (rng: Rng) => {
      const items = [
        makeFraction(randInt(rng, 1, 5), randInt(rng, 2, 8)),
        makeFraction(randInt(rng, 1, 5), randInt(rng, 2, 8)),
        makeFraction(randInt(rng, 1, 5), randInt(rng, 2, 8)),
      ].map((f) => ({ label: format(f), value: toDecimal(f) }))
      // Ensure distinct labels for drag-drop UX
      const unique = new Map<string, { label: string; value: number }>()
      for (const item of items) unique.set(item.label, item)
      while (unique.size < 3) {
        const f = makeFraction(randInt(rng, 1, 6), randInt(rng, 2, 9))
        unique.set(format(f), { label: format(f), value: toDecimal(f) })
      }
      const list = [...unique.values()].slice(0, 3)
      const sorted = [...list].sort((x, y) => x.value - y.value)
      const correctOrder = sorted.map((s) => list.findIndex((i) => i.label === s.label))
      return dragDropSortTask({
        question: 'Ordne die Brüche der Größe nach (kleinster zuerst):',
        items: list,
        correctOrder,
        solution: sorted.map((i) => i.label).join(' < '),
        explanation: `Als Dezimalzahlen: ${list.map((i) => `${i.label} ≈ ${formatDe(roundTo(i.value, 3))}`).join(', ')}. Sortiert: ${sorted.map((i) => i.label).join(' < ')}.`,
      })
    },
  ),
}

const addSubBrueche: Topic = {
  id: 'lb1-add-sub-brueche',
  title: 'Brüche addieren und subtrahieren',
  hint: 'Gib das Ergebnis als gekürzten Bruch ein.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Brüche addiert und subtrahiert man, indem man sie zuerst auf einen gemeinsamen Nenner bringt (Erweitern). Dann werden nur die Zähler addiert oder subtrahiert; der gemeinsame Nenner bleibt unverändert. Das Ergebnis wird anschließend vollständig gekürzt.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 1, 6), randInt(rng, 2, 8))
      const b = makeFraction(randInt(rng, 1, 6), randInt(rng, 2, 8))
      const doAdd = rng() < 0.5 || a.n * b.d < b.n * a.d
      const result: Fraction = doAdd ? add(a, b) : subtract(a, b)
      const op = doAdd ? '+' : '−'
      const common = a.d * b.d
      const numResult = doAdd ? a.n * b.d + b.n * a.d : a.n * b.d - b.n * a.d
      return fractionTask({
        question: `Berechne: ${format(a)} ${op} ${format(b)}`,
        value: result,
        solution: format(result),
        explanation: `Gemeinsamer Nenner ist ${common}: ${format(a)} = ${a.n * b.d}/${common} und ${format(b)} = ${b.n * a.d}/${common}. Dann ${op === '+' ? 'addiere' : 'subtrahiere'} die Zähler: ${a.n * b.d} ${op} ${b.n * a.d} = ${numResult}. Ergebnis gekürzt: ${format(result)}.`,
      })
    },
    (rng: Rng) => {
      // Same denominator so visual bars/grid are easy to combine mentally
      const d = pick(rng, [4, 5, 6, 8, 10])
      const aN = randInt(rng, 1, d - 2)
      const bN = randInt(rng, 1, d - aN)
      const a = makeFraction(aN, d)
      const b = makeFraction(bN, d)
      const result = add(a, b)
      return {
        ...fractionTask({
          question: 'Addiere die beiden dargestellten Bruchanteile. Gib den gekürzten Bruch an.',
          value: result,
          solution: format(result),
          explanation: `Gleicher Nenner ${d}: ${format(a)} + ${format(b)} = ${aN + bN}/${d}. Gekürzt: ${format(result)}.`,
        }),
        visualContent: twoFractionVisual(a, b, pick(rng, ['bar', 'circle'] as const)),
      }
    },
    (rng: Rng) => {
      const d = pick(rng, [4, 6, 8, 10, 12])
      const aN = randInt(rng, 2, d - 1)
      const bN = randInt(rng, 1, aN - 1)
      const a = makeFraction(aN, d)
      const b = makeFraction(bN, d)
      const result = subtract(a, b)
      const cols = d === 12 ? 4 : d === 6 ? 3 : 4
      return {
        ...fractionTask({
          question: 'Subtrahiere: linker Anteil minus rechter Anteil. Gib den gekürzten Bruch an.',
          value: result,
          solution: format(result),
          explanation: `${format(a)} − ${format(b)} = ${aN - bN}/${d}. Gekürzt: ${format(result)}.`,
        }),
        visualContent: `<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-items:center">${generateFractionGridSvg({ numerator: aN, denominator: d, cols })}<span style="font-size:1.6rem;font-weight:700;color:#64748b">−</span>${generateFractionGridSvg({ numerator: bN, denominator: d, cols, fillColor: '#e67e22' })}</div>`,
      }
    },
  ),
}

const multBrueche: Topic = {
  id: 'lb1-mult-brueche',
  title: 'Brüche multiplizieren',
  hint: 'Gib das Ergebnis als gekürzten Bruch ein.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Brüche multipliziert man, indem man Zähler mal Zähler und Nenner mal Nenner rechnet. Es lohnt sich, vor dem Multiplizieren zu kürzen (kreuzweise Kürzung), um mit kleineren Zahlen zu arbeiten. Das Produkt zweier Brüche ist kleiner als beide Faktoren (wenn beide echte Brüche sind).',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: (rng: Rng) => {
    // Echte Brüche (Nenner > Zähler), damit die Frage nicht wie Bare-Integer „1 · 1“ wirkt.
    const a = makeFraction(randInt(rng, 1, 8), randInt(rng, 9, 16))
    const b = makeFraction(randInt(rng, 1, 8), randInt(rng, 9, 16))
    const result = multiply(a, b)
    return fractionTask({
      question: `Berechne das Produkt der Brüche: ${format(a)} · ${format(b)}`,
      value: result,
      solution: format(result),
      explanation: `Multipliziere Zähler mal Zähler und Nenner mal Nenner: (${a.n} · ${b.n}) / (${a.d} · ${b.d}) = ${a.n * b.n}/${a.d * b.d}. Gekürzt: ${format(result)}.`,
    })
  },
}

const divBrueche: Topic = {
  id: 'lb1-div-brueche',
  title: 'Brüche dividieren',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Durch einen Bruch dividieren bedeutet, mit dem Kehrwert dieses Bruchs zu multiplizieren: a/b ÷ c/d = a/b · d/c. Den Kehrwert erhält man durch Vertauschen von Zähler und Nenner. Diese Regel folgt daraus, dass das Produkt eines Bruchs mit seinem Kehrwert stets 1 ergibt.',
    quelle: 'Wikipedia: Kehrwert',
    url: 'https://de.wikipedia.org/wiki/Kehrwert',
  },
  generate: (rng: Rng) => {
    const a = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
    const b = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
    const result = divide(a, b)
    return fractionTask({
      question: `Berechne: ${format(a)} : ${format(b)}`,
      value: result,
      solution: format(result),
      explanation: `Durch einen Bruch teilt man, indem man mit seinem Kehrwert multipliziert: ${format(a)} · ${b.d}/${b.n} = ${a.n * b.d}/${a.d * b.n}. Gekürzt: ${format(result)}.`,
    })
  },
}

/** Brüche, deren Nenner sich auf 100 oder 1000 erweitern lässt, ohne Zehntel/Halbe/Viertel (Kl. 5). */
const ZEHNERBRUCH_NENNER = [8, 16, 20, 25, 40, 50, 125, 250] as const

function zehnerErweiterung(f: Fraction): { factor: number; power: number } {
  for (const power of [10, 100, 1000, 10000]) {
    if (power % f.d === 0) return { factor: power / f.d, power }
  }
  throw new Error(`kein Zehnerbruch: ${format(f)}`)
}

const bruchZuDezimal: Topic = {
  id: 'lb1-bruch-dezimal',
  title: 'Brüche und Dezimalzahlen ineinander umwandeln',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Enthält der gekürzte Nenner nur die Primfaktoren 2 und 5, kann man den Bruch ohne schriftliche Division auf einen Zehnerbruch erweitern: 7/8 = 875/1000 = 0,875. Umgekehrt schreibt man eine endliche Dezimalzahl als Zehnerbruch und kürzt vollständig: 0,375 = 375/1000 = 3/8.',
    quelle: 'Wikipedia: Dezimalbruch',
    url: 'https://de.wikipedia.org/wiki/Dezimalbruch',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      for (;;) {
        const f = makeFraction(randInt(rng, 1, 30), pick(rng, ZEHNERBRUCH_NENNER))
        if (f.n >= f.d || ![8, 16, 20, 25, 40, 50, 125, 250].includes(f.d)) continue
        const { factor, power } = zehnerErweiterung(f)
        const value = toDecimal(f)
        return valueTask({
          question: `Wandle ${format(f)} ohne schriftliche Division in eine Dezimalzahl um.`,
          answerKind: 'decimal',
          value,
          solution: formatDe(value),
          explanation: `Erweitere mit ${factor} auf den Nenner ${formatDe(power)}: ${format(f)} = ${f.n * factor}/${formatDe(power)} = ${formatDe(value)}.`,
          dedupeKey: `ma:k6:bruchdez:${format(f)}`,
        })
      }
    },
    (rng: Rng) => {
      for (;;) {
        const f = makeFraction(randInt(rng, 1, 30), pick(rng, ZEHNERBRUCH_NENNER))
        if (f.n >= f.d || ![8, 16, 20, 25, 40, 50, 125, 250].includes(f.d)) continue
        const { power } = zehnerErweiterung(f)
        const value = toDecimal(f)
        const zaehler = Math.round(value * power)
        return fractionTask({
          question: `Schreibe ${formatDe(value)} als vollständig gekürzten Bruch.`,
          value: f,
          requireReduced: true,
          solution: format(f),
          explanation: `${formatDe(value)} = ${zaehler}/${formatDe(power)}. Kürzen durch ${gcd(zaehler, power)} ergibt ${format(f)}.`,
          dedupeKey: `ma:k6:dezbruch:${format(f)}`,
        })
      }
    },
    (rng: Rng) => {
      for (;;) {
        const d = pick(rng, [8, 20, 40] as const)
        const f = makeFraction(randInt(rng, 1, d - 1), d)
        if (f.d !== d) continue
        const value = toDecimal(f)
        return numberLineTask({
          question: `Markiere ${format(f)} auf dem Zahlenstrahl.`,
          min: 0,
          max: 1,
          step: 0.025,
          value,
          decimals: 3,
          solution: formatDe(value),
          explanation: `${format(f)} = ${formatDe(value)}, denn ${f.n} · ${zehnerErweiterung(f).factor} = ${Math.round(value * zehnerErweiterung(f).power)} und ${format(f)} = ${Math.round(value * zehnerErweiterung(f).power)}/${formatDe(zehnerErweiterung(f).power)}.`,
          eps: 0.0125,
          dedupeKey: `ma:k6:bruchdez:zs:${format(f)}`,
        })
      }
    },
  ),
}

const prozentUmwandeln: Topic = {
  id: 'lb1-prozent',
  title: 'Brüche, Dezimalzahlen und Prozentangaben umwandeln',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Prozent bedeutet „von Hundert“: p % = p/100. Brüche wie 3/8 rechnet man über die Dezimalzahl um: 3/8 = 0,375 = 37,5 %. Bei Nennern wie 3 oder 6 entsteht eine periodische Dezimalzahl, dann rundet man: 1/3 ≈ 33,3 %. Umgekehrt schreibt man p % als Bruch p/100 und kürzt vollständig: 35 % = 35/100 = 7/20.',
    quelle: 'Wikipedia: Prozentrechnung',
    url: 'https://de.wikipedia.org/wiki/Prozentrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      for (;;) {
        const d = pick(rng, [8, 16, 40] as const)
        const f = makeFraction(randInt(rng, 1, d - 1), d)
        if (f.d !== d) continue
        const value = roundTo(toDecimal(f) * 100, 3)
        return valueTask({
          question: `Wie viel Prozent sind ${format(f)}?`,
          unit: '%',
          answerKind: 'decimal',
          value,
          solution: `${formatDe(value)} %`,
          explanation: `${format(f)} = ${formatDe(toDecimal(f))} (erweitern auf einen Zehnerbruch). ${formatDe(toDecimal(f))} = ${formatDe(value)}/100 = ${formatDe(value)} %.`,
          dedupeKey: `ma:k6:proz:bruch:${format(f)}`,
        })
      }
    },
    (rng: Rng) => {
      const f = pick(rng, [makeFraction(1, 3), makeFraction(2, 3), makeFraction(1, 6), makeFraction(5, 6), makeFraction(1, 9), makeFraction(4, 9)])
      const value = roundTo(toDecimal(f) * 100, 1)
      return valueTask({
        question: `Wie viel Prozent sind ${format(f)}? Runde auf eine Nachkommastelle.`,
        unit: '%',
        answerKind: 'decimal',
        value,
        eps: 0.051,
        solution: `${formatDe(value)} %`,
        explanation: `${f.n} : ${f.d} = ${formatDe(roundTo(toDecimal(f), 4))}… ist periodisch. In Prozent: ${formatDe(roundTo(toDecimal(f) * 100, 3))}… % ≈ ${formatDe(value)} %.`,
        dedupeKey: `ma:k6:proz:period:${format(f)}`,
      })
    },
    (rng: Rng) => {
      for (;;) {
        const p = pick(rng, [2, 4, 5, 6, 8, 12, 15, 24, 35, 45, 55, 65, 85, 12.5, 37.5, 62.5, 87.5])
        const f = makeFraction(Math.round(p * 10), 1000)
        if (f.d === 1) continue
        const raw = Number.isInteger(p) ? `${p}/100` : `${formatDe(p * 10)}/1000`
        return fractionTask({
          question: `Schreibe ${formatDe(p)} % als vollständig gekürzten Bruch.`,
          value: f,
          requireReduced: true,
          solution: format(f),
          explanation: `${formatDe(p)} % = ${raw}. Vollständig gekürzt: ${format(f)}.`,
          dedupeKey: `ma:k6:proz:zubruch:${p}`,
        })
      }
    },
    (rng: Rng) => {
      const dec = pick(rng, [0.125, 0.375, 0.045, 0.008, 1.2, 1.05, 2.5, 0.625, 0.015, 1.75])
      const value = roundTo(dec * 100, 3)
      return valueTask({
        question: `Schreibe ${formatDe(dec)} in Prozent.`,
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `Das Komma rückt zwei Stellen nach rechts (· 100): ${formatDe(dec)} = ${formatDe(value)}/100 = ${formatDe(value)} %.${dec > 1 ? ' Mehr als das Ganze ergibt mehr als 100 %.' : ''}`,
        dedupeKey: `ma:k6:proz:dez:${dec}`,
      })
    },
    (rng: Rng) => {
      const d = pick(rng, [8, 16] as const)
      let n = randInt(rng, 1, d - 1)
      while (n % 2 === 0) n = randInt(rng, 1, d - 1)
      const value = roundTo((n / d) * 100, 3)
      return visualTask({
        question: `Der Kreis ist in ${d} gleich große Teile geteilt. Wie viel Prozent sind eingefärbt?`,
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `${n} von ${d} Teilen = ${n}/${d}. Ein Teil sind 100 % : ${d} = ${formatDe(100 / d)} %, also ${n} · ${formatDe(100 / d)} % = ${formatDe(value)} %.`,
        visualContent: generateFractionCircleSvg({ numerator: n, denominator: d }),
        dedupeKey: `ma:k6:proz:kreis:${n}:${d}`,
      })
    },
  ),
}

const dezAddSub: Topic = {
  id: 'lb1-dez-add-sub',
  title: 'Dezimalzahlen addieren und subtrahieren: Terme und Sachaufgaben',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Bei Termen mit mehreren Dezimalzahlen rechnet man von links nach rechts und schreibt jede Teilrechnung kommagerecht untereinander; fehlende Nachkommastellen füllt man mit Nullen auf. Gesuchte Summanden oder Minuenden findet man mit der Umkehraufgabe: Aus x + a = s folgt x = s − a, aus x − a = d folgt x = d + a.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 1001, 9999) / 100
      const b = randInt(rng, 11, 999) / 1000
      const c = randInt(rng, 11, 99) / 10
      const value = roundTo(a + b - c, 3)
      return valueTask({
        question: `Berechne: ${formatDe(a)} + ${formatDe(b)} − ${formatDe(c)}`,
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `${formatDe(a)} + ${formatDe(b)} = ${formatDe(roundTo(a + b, 3))}; ${formatDe(roundTo(a + b, 3))} − ${formatDe(c)} = ${formatDe(value)}.`,
        dedupeKey: `ma:k6:dezaddsub:term:${a}:${b}:${c}`,
      })
    },
    (rng: Rng) => {
      const preise = [randInt(rng, 120, 899), randInt(rng, 120, 899), randInt(rng, 50, 499)].map((x) => x / 100)
      const schein = pick(rng, [20, 50])
      const summe = roundTo(preise.reduce((s, x) => s + x, 0), 2)
      const rueck = roundTo(schein - summe, 2)
      return valueTask({
        question: `Lea kauft ein Heft für ${formatDe(preise[0]!)} €, einen Füller für ${formatDe(preise[1]!)} € und Radiergummis für ${formatDe(preise[2]!)} €. Sie bezahlt mit einem ${schein}-€-Schein. Wie viel Euro bekommt sie zurück?`,
        unit: '€',
        answerKind: 'decimal',
        value: rueck,
        solution: `${formatDe(rueck)} €`,
        explanation: `Summe: ${preise.map((p) => formatDe(p)).join(' + ')} = ${formatDe(summe)} €. Rückgeld: ${schein} − ${formatDe(summe)} = ${formatDe(rueck)} €.`,
        dedupeKey: `ma:k6:dezaddsub:geld:${preise.join(':')}:${schein}`,
      })
    },
    (rng: Rng) => {
      const x = randInt(rng, 101, 999) / 100
      const s = randInt(rng, 1001, 4999) / 100
      const missingFirst = rng() < 0.5
      return valueTask({
        question: missingFirst
          ? `Welche Zahl muss man zu ${formatDe(x)} addieren, um ${formatDe(roundTo(x + s, 2))} zu erhalten?`
          : `Von welcher Zahl muss man ${formatDe(x)} subtrahieren, um ${formatDe(s)} zu erhalten?`,
        answerKind: 'decimal',
        value: missingFirst ? s : roundTo(s + x, 2),
        solution: formatDe(missingFirst ? s : roundTo(s + x, 2)),
        explanation: missingFirst
          ? `${formatDe(roundTo(x + s, 2))} − ${formatDe(x)} = ${formatDe(s)}.`
          : `${formatDe(s)} + ${formatDe(x)} = ${formatDe(roundTo(s + x, 2))}.`,
        dedupeKey: `ma:k6:dezaddsub:luecke:${x}:${s}:${missingFirst}`,
      })
    },
  ),
}

const dezMult: Topic = {
  id: 'lb1-dez-mult',
  title: 'Dezimalzahlen miteinander multiplizieren',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Zwei Dezimalzahlen multipliziert man zunächst ohne Komma wie natürliche Zahlen. Das Ergebnis hat so viele Nachkommastellen wie beide Faktoren zusammen. Ist ein Faktor kleiner als 1, wird das Produkt kleiner als der andere Faktor.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a10 = randInt(rng, 12, 99)
      const b100 = randInt(rng, 2, 99)
      const a = a10 / 10
      const b = b100 / 100
      const value = roundTo((a10 * b100) / 1000, 3)
      return valueTask({
        question: `Berechne: ${formatDe(a)} · ${formatDe(b)}`,
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `${a10} · ${b100} = ${a10 * b100}. Die Faktoren haben zusammen 1 + 2 = 3 Nachkommastellen, also ${formatDe(value)}.`,
        dedupeKey: `ma:k6:dezmult:${a10}:${b100}`,
      })
    },
    (rng: Rng) => {
      const preis100 = randInt(rng, 119, 489)
      const menge10 = randInt(rng, 12, 48)
      const value = roundTo((preis100 * menge10) / 1000, 2)
      return valueTask({
        question: `1 kg Äpfel kostet ${formatDe(preis100 / 100)} €. Was kosten ${formatDe(menge10 / 10)} kg? Runde auf Cent.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        eps: 0.006,
        solution: `${formatDe(value)} €`,
        explanation: `${formatDe(preis100 / 100)} € · ${formatDe(menge10 / 10)} = ${formatDe((preis100 * menge10) / 1000)} € ≈ ${formatDe(value)} €.`,
        dedupeKey: `ma:k6:dezmult:preis:${preis100}:${menge10}`,
      })
    },
  ),
}

const dezDiv: Topic = {
  id: 'lb1-dez-div',
  title: 'Durch Dezimalzahlen dividieren',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Bei der Division durch eine Dezimalzahl verschiebt man in Dividend und Divisor das Komma um gleich viele Stellen nach rechts, bis der Divisor eine natürliche Zahl ist. Der Quotient ändert sich dabei nicht, weil beide Zahlen mit derselben Zehnerpotenz multipliziert werden.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const d10 = pick(rng, [2, 3, 4, 5, 6, 8, 12, 15, 25])
      const q = randInt(rng, 3, 60)
      const divisor = d10 / 10
      const dividend = roundTo(q * divisor, 2)
      return valueTask({
        question: `Berechne: ${formatDe(dividend)} : ${formatDe(divisor)}`,
        answerKind: 'decimal',
        value: q,
        solution: formatDe(q),
        explanation: `Beide Zahlen mit 10 multiplizieren ändert den Quotienten nicht: ${formatDe(roundTo(dividend * 10, 2))} : ${d10} = ${q}.`,
        dedupeKey: `ma:k6:dezdiv:${d10}:${q}`,
      })
    },
    (rng: Rng) => {
      const d100 = pick(rng, [4, 5, 8, 12, 15, 25, 75])
      const q = randInt(rng, 4, 40)
      const divisor = d100 / 100
      const dividend = roundTo(q * divisor, 2)
      return valueTask({
        question: `Berechne: ${formatDe(dividend)} : ${formatDe(divisor)}`,
        answerKind: 'decimal',
        value: q,
        solution: formatDe(q),
        explanation: `Mit 100 erweitern: ${formatDe(roundTo(dividend * 100, 2))} : ${d100} = ${q}.`,
        dedupeKey: `ma:k6:dezdiv100:${d100}:${q}`,
      })
    },
    (rng: Rng) => {
      const flasche10 = pick(rng, [2, 3, 4, 5, 7, 15])
      const n = randInt(rng, 4, 24)
      const gesamt = roundTo((flasche10 * n) / 10, 1)
      return valueTask({
        question: `Aus einem Kanister mit ${formatDe(gesamt)} l Saft werden Flaschen zu je ${formatDe(flasche10 / 10)} l gefüllt. Wie viele Flaschen werden voll?`,
        answerKind: 'integer',
        value: n,
        solution: String(n),
        explanation: `${formatDe(gesamt)} : ${formatDe(flasche10 / 10)} = ${formatDe(gesamt * 10)} : ${flasche10} = ${n}.`,
        dedupeKey: `ma:k6:dezdiv:saft:${flasche10}:${n}`,
      })
    },
  ),
}

const runden: Topic = {
  id: 'lb1-runden',
  title: 'Ergebnisse sinnvoll runden',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Viele Divisionen gehen nicht auf; dann rundet man das Ergebnis auf eine sinnvolle Stelle, bei Geldbeträgen auf Cent (zwei Nachkommastellen). Entscheidend ist die erste weggelassene Ziffer: Bei 0–4 wird abgerundet, bei 5–9 aufgerundet.',
    quelle: 'Wikipedia: Runden (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Runden_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      let a = randInt(rng, 10, 99)
      const b = pick(rng, [3, 6, 7, 9, 11, 12])
      if (a % b === 0) a++
      const places = pick(rng, [1, 2])
      const rounded = roundTo(a / b, places)
      return valueTask({
        question: `Berechne ${a} : ${b} und runde das Ergebnis auf ${places === 1 ? 'eine Nachkommastelle' : 'zwei Nachkommastellen'}.`,
        answerKind: 'decimal',
        value: rounded,
        eps: 1e-9,
        solution: formatDe(rounded),
        explanation: `${a} : ${b} = ${formatDe(Math.floor((a / b) * 10000) / 10000)}… ≈ ${formatDe(rounded)}.`,
        dedupeKey: `ma:k6:runden:quot:${a}:${b}:${places}`,
      })
    },
    (rng: Rng) => {
      const preis = randInt(rng, 101, 999) / 100
      const stueck = pick(rng, [3, 6, 7, 9])
      const proStueck = roundTo(preis / stueck, 2)
      return valueTask({
        question: `Ein Pack mit ${stueck} Joghurts kostet ${formatDe(preis)} €. Wie viel kostet ein Joghurt, auf Cent gerundet?`,
        unit: '€',
        answerKind: 'decimal',
        value: proStueck,
        eps: 1e-9,
        solution: `${formatDe(proStueck)} €`,
        explanation: `${formatDe(preis)} € : ${stueck} = ${formatDe(Math.floor((preis / stueck) * 10000) / 10000)}… € ≈ ${formatDe(proStueck)} €.`,
        dedupeKey: `ma:k6:runden:preis:${preis}:${stueck}`,
      })
    },
    (rng: Rng) => {
      const value = randInt(rng, 10001, 99999) / 10000
      const places = pick(rng, [1, 2, 3])
      const rounded = roundTo(value, places)
      const step = 10 ** -places
      const cands = [
        rounded,
        roundTo(Math.floor(value * 10 ** places) / 10 ** places, places),
        roundTo(rounded + step, places),
        roundTo(value, places + 1),
        roundTo(rounded - step, places),
      ]
      const correct = formatDe(rounded)
      return choicePickTask({
        question: `Welche Zahl entsteht, wenn man ${formatDe(value)} auf ${places === 1 ? 'Zehntel' : places === 2 ? 'Hundertstel' : 'Tausendstel'} rundet?`,
        choices: shuffleArr(rng, [...new Set(cands.map((c) => formatDe(c)))].slice(0, 4)),
        correct,
        solution: correct,
        explanation: `Gerundet auf ${places === 1 ? 'Zehntel' : places === 2 ? 'Hundertstel' : 'Tausendstel'}: ${formatDe(value)} ≈ ${correct}.`,
        dedupeKey: `ma:k6:runden:mc:${value}:${places}`,
      })
    },
  ),
}

// --- NEW: Sachaufgabe Bruchrechnung ------------------------------------------

const sachaufgabeBruch: Topic = {
  id: 'lb1-sachaufgabe-bruch',
  title: 'Sachaufgabe: Bruchrechnung im Alltag',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sachaufgabe', 'Bruch', 'Anteil', 'Alltag'],
  fachwissen: {
    text: 'In Sachaufgaben zur Bruchrechnung muss man den Kontext verstehen und die passende Rechenoperation auswählen. Geht es um einen Anteil eines Ganzen, wird mit dem Bruch multipliziert. Geht es um den Vergleich zweier Mengen, werden Brüche auf einen gemeinsamen Nenner gebracht. Das Ergebnis muss stets auf seine Plausibilität geprüft werden.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: (rng: Rng) => {
    const d = pick(rng, [2, 3, 4, 5, 8])
    const n = randInt(rng, 1, d - 1)
    const gesamt = d * randInt(rng, 3, 10)
    const value = (n / d) * gesamt
    const ctx = pick(rng, [
      { text: (g: number, nn: number, dd: number) =>
          `Eine Klasse hat ${g} Schüler. ${nn}/${dd} der Klasse nehmen am Chor teil. Wie viele Schüler singen im Chor?`,
        unit: '' },
      { text: (g: number, nn: number, dd: number) =>
          `In einem Behälter sind ${g} Liter Wasser. ${nn}/${dd} davon werden verbraucht. Wie viele Liter wurden verbraucht?`,
        unit: 'Liter' },
      { text: (g: number, nn: number, dd: number) =>
          `Ein Weg ist ${g} km lang. ${nn}/${dd} des Weges wurden bereits zurückgelegt. Wie viele km wurden zurückgelegt?`,
        unit: 'km' },
    ])
    return valueTask({
      question: ctx.text(gesamt, n, d),
      unit: ctx.unit || undefined,
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)}${ctx.unit ? ' ' + ctx.unit : ''}`,
      explanation: `${n}/${d} von ${gesamt}: Teile durch ${d}: ${gesamt} : ${d} = ${gesamt / d}. Dann multipliziere mit ${n}: ${gesamt / d} · ${n} = ${formatDe(value)}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Zuordnungen in der Umwelt
// ---------------------------------------------------------------------------

const proportional: Topic = {
  id: 'lb2-proportional',
  title: 'Proportionale Zuordnung (Dreisatz)',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Bei einer proportionalen Zuordnung wächst y proportional zu x: y = k · x (k = Proportionalitätsfaktor). Im Dreisatz rechnet man erst auf die Einheit zurück (Division) und dann zur gesuchten Menge hoch (Multiplikation). Typische Beispiele: Preisberechnung, Mengenzuordnungen, Geschwindigkeit.',
    quelle: 'Wikipedia: Dreisatz',
    url: 'https://de.wikipedia.org/wiki/Dreisatz',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const unit = pick(rng, ['Brötchen', 'Hefte', 'Äpfel', 'Stifte', 'Flaschen', 'Ticket'])
      const pricePer = pick(rng, [0.5, 0.75, 1.25, 1.5, 2.5, 3.5, 4.25])
      const a = randInt(rng, 3, 12)
      const b = randInt(rng, 4, 24)
      const total = roundTo(pricePer * a, 2)
      const value = roundTo(pricePer * b, 2)
      return valueTask({
        question: `${a} ${unit} kosten ${formatDe(total)} €. Was kosten ${b} ${unit}?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Dreisatz: 1 ${unit} kostet ${formatDe(total)} € : ${a} = ${formatDe(pricePer)} €. Dann ${b} · ${formatDe(pricePer)} € = ${formatDe(value)} €.`,
      })
    },
    (rng: Rng) => {
      const k = pick(rng, [1.5, 2, 2.5, 3, 4, 5])
      const xs = [2, 4, 6, 8].map((x) => Math.min(x, Math.floor(20 / k) || 2))
      const uniqueXs = [...new Set(xs.filter((x) => x >= 1))].slice(0, 4)
      while (uniqueXs.length < 3) uniqueXs.push(uniqueXs.length + 1)
      const missIdx = randInt(rng, 1, uniqueXs.length - 1)
      const cells = uniqueXs.map((x, i) => ({
        x,
        y: i === missIdx ? null : roundTo(k * x, 2),
      }))
      const value = roundTo(k * uniqueXs[missIdx], 2)
      const arrow = Number.isInteger(k) ? `· ${k}` : `· ${formatDe(k)}`
      return visualTask({
        question: 'Die Zuordnung ist proportional. Welche Zahl gehört in die Zelle mit dem Fragezeichen?',
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `Proportionalitätsfaktor k = ${formatDe(k)}. Fehlender Wert: ${uniqueXs[missIdx]} · ${formatDe(k)} = ${formatDe(value)}.`,
        visualContent: generateValueTableSvg({
          cells,
          xLabel: 'x',
          yLabel: 'y',
          arrowHint: arrow,
        }),
      })
    },
    (rng: Rng) => {
      const k = pick(rng, [1, 2, 3, 4])
      const xs = [1, 2, 3, pick(rng, [4, 5])]
      const pts = xs.map((x) => ({ x, y: k * x }))
      const ask = pick(rng, pts)
      return {
        ...valueTask({
          question: `Die Punkte liegen auf einer Ursprungsgeraden (proportional). Lies die y-Koordinate von Punkt (${ask.x}|?) ab.`,
          answerKind: 'integer',
          value: ask.y,
          solution: `${ask.y}`,
          explanation: `y = ${k} · x, also bei x = ${ask.x}: y = ${ask.y}.`,
        }),
        visualContent: generateAssignmentGraphSvg({
          points: pts.map((p, i) => ({
            ...p,
            label: p.x === ask.x ? '?' : String.fromCharCode(65 + i),
          })),
          showRay: true,
          xMax: Math.max(6, ...xs) + 1,
          yMax: Math.max(6, ...pts.map((p) => p.y)) + 1,
        }),
      }
    },
    (rng: Rng) => {
      // Gerade (proportional) vs. Hyperbel-Skizze (antiproportional)
      const kProp = pick(rng, [1, 2, 3])
      const kAnti = pick(rng, [12, 24, 36])
      const propPts = [1, 2, 3].map((x) => ({ x, y: kProp * x }))
      const antiXs = [2, 3, 4, 6].filter((x) => kAnti % x === 0).slice(0, 3)
      const antiPts = antiXs.map((x) => ({ x, y: kAnti / x }))
      const propFirst = rng() < 0.5
      const left = propFirst
        ? generateAssignmentGraphSvg({ points: propPts, showRay: true, xMax: 6, yMax: 8, cellSize: 26 })
        : generateAssignmentGraphSvg({
            points: antiPts,
            productK: kAnti,
            xMax: 8,
            yMax: Math.max(8, ...antiPts.map((p) => p.y)) + 1,
            cellSize: 26,
          })
      const right = propFirst
        ? generateAssignmentGraphSvg({
            points: antiPts,
            productK: kAnti,
            xMax: 8,
            yMax: Math.max(8, ...antiPts.map((p) => p.y)) + 1,
            cellSize: 26,
          })
        : generateAssignmentGraphSvg({ points: propPts, showRay: true, xMax: 6, yMax: 8, cellSize: 26 })
      const answer = propFirst ? 'A' : 'B'
      return {
        ...textTask({
          question: 'Welche Zuordnung ist proportional (Ursprungsgerade)? Gib A oder B ein.',
          accepted: [answer, answer.toLowerCase()],
          solution: answer,
          explanation: `Proportional: Punkte auf einer Geraden durch den Ursprung (Diagramm ${answer}). Antiproportional: Produkt x·y konstant (Hyperbel-Skizze).`,
        }),
        visualContent: `<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:flex-start"><div><div style="text-align:center;font-weight:700;margin-bottom:4px">A</div>${left}</div><div><div style="text-align:center;font-weight:700;margin-bottom:4px">B</div>${right}</div></div>`,
      }
    },
  ),
}

const antiproportional: Topic = {
  id: 'lb2-antiproportional',
  title: 'Antiproportionale Zuordnung',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Bei einer antiproportionalen Zuordnung sinkt eine Größe, wenn die andere steigt, so dass ihr Produkt konstant bleibt: x · y = k. Je mehr Arbeiter an einer Aufgabe arbeiten, desto weniger Zeit wird benötigt. Im Dreisatz: Gesamtarbeit = Arbeiter · Zeit = konstant.',
    quelle: 'Wikipedia: Antiproportionalität',
    url: 'https://de.wikipedia.org/wiki/Antiproportionalit%C3%A4t',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const workers1 = randInt(rng, 3, 12)
      const perWorker = randInt(rng, 4, 18)
      const total = workers1 * perWorker
      const divisors: number[] = []
      for (let w = 2; w <= 24; w++) if (total % w === 0 && w !== workers1) divisors.push(w)
      const workers2 = divisors.length ? pick(rng, divisors) : workers1
      const hours1 = perWorker
      const hours2 = total / workers2
      return valueTask({
        question: `${workers1} Arbeiter brauchen für eine Aufgabe ${hours1} Stunden. Wie lange brauchen ${workers2} Arbeiter?`,
        unit: 'Stunden',
        answerKind: 'decimal',
        value: hours2,
        solution: `${formatDe(hours2)} Stunden`,
        explanation: `Die Gesamtarbeit bleibt gleich: ${workers1} · ${hours1} = ${total} Arbeiterstunden. Bei ${workers2} Arbeitern: ${total} : ${workers2} = ${formatDe(hours2)} Stunden.`,
      })
    },
    (rng: Rng) => {
      const product = pick(rng, [24, 36, 48, 60, 72])
      const xs = [2, 3, 4, 6, 8, 9, 12].filter((x) => product % x === 0).slice(0, 4)
      const missIdx = randInt(rng, 1, xs.length - 1)
      const cells = xs.map((x, i) => ({
        x,
        y: i === missIdx ? null : product / x,
      }))
      const value = product / xs[missIdx]
      return visualTask({
        question: 'Die Zuordnung ist antiproportional (x · y konstant). Welche Zahl gehört an die Stelle mit dem Fragezeichen?',
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `Produkt k = ${product}. Fehlender Wert: ${product} : ${xs[missIdx]} = ${formatDe(value)}.`,
        visualContent: generateValueTableSvg({
          cells,
          xLabel: 'x',
          yLabel: 'y',
          arrowHint: `k=${product}`,
        }),
      })
    },
    (rng: Rng) => {
      const product = pick(rng, [24, 36, 48])
      const xs = [2, 3, 4, 6].filter((x) => product % x === 0)
      const pts = xs.map((x) => ({ x, y: product / x }))
      const ask = pick(rng, pts)
      return {
        ...valueTask({
          question: `Antiproportional mit x · y = ${product}. Lies y für x = ${ask.x} ab.`,
          answerKind: 'integer',
          value: ask.y,
          solution: `${ask.y}`,
          explanation: `y = ${product} : ${ask.x} = ${ask.y}.`,
        }),
        visualContent: generateAssignmentGraphSvg({
          points: pts.map((p) => ({
            ...p,
            label: p.x === ask.x ? `(${p.x}|?)` : `(${p.x}|${p.y})`,
          })),
          productK: product,
          xMax: Math.max(8, ...xs) + 1,
          yMax: Math.max(8, ...pts.map((p) => p.y)) + 1,
        }),
      }
    },
  ),
}

const haeufigkeit: Topic = {
  id: 'lb2-haeufigkeit',
  title: 'Relative Häufigkeit in Prozent',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Die relative Häufigkeit eines Ereignisses ist der Quotient aus der Anzahl der Eintritte und der Gesamtanzahl aller Versuche. Als Prozentzahl: relative Häufigkeit × 100. Je größer die Stichprobe, desto stabiler (und vorhersagbarer) wird die relative Häufigkeit – dieses Gesetz heißt Gesetz der großen Zahlen.',
    quelle: 'Wikipedia: Relative Häufigkeit',
    url: 'https://de.wikipedia.org/wiki/Relative_H%C3%A4ufigkeit',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const total = pick(rng, [20, 25, 40, 50, 80, 100, 200])
      const k = randInt(rng, 1, total - 1)
      const value = roundTo((k / total) * 100, 2)
      return valueTask({
        question: `Bei ${total} Würfen fiel ${k}-mal eine gerade Zahl. Wie groß ist die relative Häufigkeit in Prozent?`,
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `Relative Häufigkeit = ${k} : ${total} = ${formatDe(k / total)}. In Prozent: · 100 = ${formatDe(value)} %.`,
      })
    },
    (rng: Rng) => {
      const total = pick(rng, [5, 8, 10, 20])
      const k = randInt(rng, 1, total - 1)
      const value = roundTo((k / total) * 100, 2)
      return visualTask({
        question: 'Wie groß ist die relative Häufigkeit (in %) des eingefärbten Anteils im Kreisdiagramm?',
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `${k} von ${total} Sektoren → ${k}/${total} · 100 = ${formatDe(value)} %.`,
        visualContent: generateFractionCircleSvg({ numerator: k, denominator: total }),
      })
    },
    (rng: Rng) => {
      const total = pick(rng, [5, 8, 10, 20])
      const k = randInt(rng, 1, total - 1)
      const value = roundTo((k / total) * 100, 2)
      return visualTask({
        question: 'Wie groß ist die relative Häufigkeit (in %) des eingefärbten Anteils im Streifendiagramm?',
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `${k} von ${total} Abschnitten → ${formatDe(value)} %.`,
        visualContent: generateFractionBarSvg({ numerator: k, denominator: total }),
      })
    },
  ),
}

/** Mehrstufiger Dreisatz / Alltagsproblem */
const sachaufgabeDreisatz: Topic = {
  id: 'lb2-sachaufgabe-dreisatz',
  title: 'Sachaufgabe: Dreisatz mit Einheiten',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sachaufgabe', 'Dreisatz', 'proportional', 'Einheiten'],
  fachwissen: {
    text: 'Der Dreisatz löst proportionale Zusammenhänge in drei Schritten: (1) den gegebenen Wert auf die Einheit reduzieren, (2) mit der gesuchten Menge multiplizieren. Oft müssen beim Dreisatz auch Einheiten umgerechnet werden. Das Aufschreiben der Einheiten in jedem Schritt verhindert Fehler.',
    quelle: 'Wikipedia: Dreisatz',
    url: 'https://de.wikipedia.org/wiki/Dreisatz',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const preis100 = randInt(rng, 45, 350)
      const menge = pick(rng, [150, 250, 300, 450, 500, 750, 1000, 1250])
      const value = roundTo((preis100 / 100) * menge, 2)
      const artikel = pick(rng, ['Käse', 'Aufschnitt', 'Nüsse', 'Schokolade', 'Kaffee'])
      return valueTask({
        question: `100 g ${artikel} kosten ${preis100} Cent. Was kosten ${menge} g?`,
        unit: 'Cent',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} Cent`,
        explanation: `Dreisatz: 1 g kostet ${preis100} : 100 = ${formatDe(preis100 / 100)} Cent. ${menge} g kosten ${formatDe(preis100 / 100)} · ${menge} = ${formatDe(value)} Cent.`,
      })
    },
    (rng: Rng) => {
      const preisProKg = pick(rng, [2.4, 3.5, 4.8, 5.25, 6.5, 8.75])
      const gram = pick(rng, [200, 250, 400, 600, 750])
      const value = roundTo(preisProKg * (gram / 1000), 2)
      const artikel = pick(rng, ['Äpfel', 'Kartoffeln', 'Mehl', 'Reis'])
      const cells = [
        { x: '1000 g', y: formatDe(preisProKg) },
        { x: `${gram} g`, y: null },
      ]
      return visualTask({
        question: `1 kg ${artikel} kostet ${formatDe(preisProKg)} €. Was kosten ${gram} g? Nutze die Wertetabelle.`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `${gram} g = ${formatDe(gram / 1000)} kg → ${formatDe(preisProKg)} · ${formatDe(gram / 1000)} = ${formatDe(value)} €.`,
        visualContent: generateValueTableSvg({
          cells,
          xLabel: 'Masse',
          yLabel: 'Preis',
          arrowHint: `· ${formatDe(gram / 1000)}`,
        }),
      })
    },
    (rng: Rng) => {
      const km = pick(rng, [12, 15, 18, 24, 30])
      const min = pick(rng, [20, 24, 30, 40, 45])
      const speed = roundTo(km / (min / 60), 2)
      const askMin = pick(rng, [10, 15, 25, 35, 50].filter((m) => m !== min))
      const value = roundTo(speed * (askMin / 60), 2)
      return visualTask({
        question: `Ein Radfahrer schafft ${km} km in ${min} min (proportional). Welche Strecke in km in ${askMin} min?`,
        unit: 'km',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} km`,
        explanation: `Geschwindigkeit = ${km} : (${min}/60) = ${formatDe(speed)} km/h. In ${askMin} min: ${formatDe(speed)} · ${formatDe(askMin / 60)} = ${formatDe(value)} km.`,
        visualContent: generateValueTableSvg({
          cells: [
            { x: min, y: km },
            { x: askMin, y: null },
          ],
          xLabel: 'min',
          yLabel: 'km',
        }),
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Dreiecke und Vierecke
// ---------------------------------------------------------------------------

const winkelDreieck: Topic = {
  id: 'lb3-winkel-dreieck',
  title: 'Innenwinkelsatz im Dreieck',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Die Summe der Innenwinkel in jedem Dreieck beträgt genau 180°. Dieser Satz gilt für alle Dreiecke – spitzwinklige, rechtwinklige und stumpfwinklige. Er folgt aus der Parallelentransversalen-Eigenschaft. Mit ihm lässt sich aus zwei bekannten Winkeln stets der dritte berechnen: γ = 180° − α − β.',
    quelle: 'Wikipedia: Dreieck',
    url: 'https://de.wikipedia.org/wiki/Dreieck',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 30, 100)
      const b = randInt(rng, 20, 150 - a)
      const c = 180 - a - b
      return valueTask({
        question: `In einem Dreieck sind zwei Winkel ${a}° und ${b}° groß. Wie groß ist der dritte Winkel?`,
        unit: '°',
        answerKind: 'integer',
        value: c,
        solution: `${c}°`,
        explanation: `Die Winkelsumme im Dreieck beträgt 180°. Also: 180° − ${a}° − ${b}° = ${c}°.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 35, 90)
      const b = randInt(rng, 25, 140 - a)
      const c = 180 - a - b
      const order = pick(rng, [
        { a: `${a}°`, b: `${b}°`, c: '?', value: c },
        { a: `${a}°`, b: '?', c: `${c}°`, value: b },
        { a: '?', b: `${b}°`, c: `${c}°`, value: a },
      ])
      return visualTask({
        question: 'Wie groß ist der fehlende Innenwinkel im Dreieck?',
        unit: '°',
        answerKind: 'integer',
        value: order.value,
        solution: `${order.value}°`,
        explanation: `Winkelsumme im Dreieck = 180°. Fehlender Winkel = 180° − (bekannte Winkel) = ${order.value}°.`,
        visualContent: generateTriangleAnglesSvg({
          aLabel: order.a,
          bLabel: order.b,
          cLabel: order.c,
          anglesDeg: [a, b, c],
        }),
      })
    },
  ),
}

const winkelViereck: Topic = {
  id: 'lb3-winkel-viereck',
  title: 'Winkelsumme im Viereck',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Die Summe der Innenwinkel in jedem (konvexen) Viereck beträgt 360°. Das lässt sich zeigen, indem man das Viereck durch eine Diagonale in zwei Dreiecke aufteilt: 2 × 180° = 360°. Für ein allgemeines n-Eck gilt: Winkelsumme = (n − 2) · 180°.',
    quelle: 'Wikipedia: Viereck',
    url: 'https://de.wikipedia.org/wiki/Viereck',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 60, 120)
      const b = randInt(rng, 60, 120)
      const c = randInt(rng, 40, 120)
      const d = 360 - a - b - c
      return valueTask({
        question: `In einem Viereck sind drei Winkel ${a}°, ${b}° und ${c}° groß. Wie groß ist der vierte Winkel?`,
        unit: '°',
        answerKind: 'integer',
        value: d,
        solution: `${d}°`,
        explanation: `Die Winkelsumme im Viereck beträgt 360°. Also: 360° − ${a}° − ${b}° − ${c}° = ${d}°.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 70, 110)
      const b = randInt(rng, 70, 110)
      const c = randInt(rng, 50, 110)
      const d = 360 - a - b - c
      if (d < 40 || d > 140) {
        return valueTask({
          question: `In einem Viereck sind drei Winkel ${a}°, ${b}° und ${c}° groß. Wie groß ist der vierte Winkel?`,
          unit: '°',
          answerKind: 'integer',
          value: d,
          solution: `${d}°`,
          explanation: `Winkelsumme = 360°. 360° − ${a}° − ${b}° − ${c}° = ${d}°.`,
        })
      }
      return visualTask({
        question: 'Wie groß ist der fehlende Innenwinkel im Viereck?',
        unit: '°',
        answerKind: 'integer',
        value: d,
        solution: `${d}°`,
        explanation: `Winkelsumme im Viereck = 360°. Fehlender Winkel = 360° − ${a}° − ${b}° − ${c}° = ${d}°.`,
        visualContent: generateQuadAnglesSvg({
          aLabel: `${a}°`,
          bLabel: `${b}°`,
          cLabel: `${c}°`,
          dLabel: '?',
          anglesDeg: [a, b, c, d],
        }),
      })
    },
  ),
}

const umfangRechteck: Topic = {
  id: 'lb3-umfang-rechteck',
  title: 'Umfang von Parallelogramm, Trapez, Drachen und Raute',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Umfang', 'Parallelogramm', 'Trapez', 'Drachenviereck', 'Raute'],
  fachwissen: {
    text: 'Der Umfang ist die Summe aller Seitenlängen. Im Parallelogramm sind gegenüberliegende Seiten gleich lang: U = 2 · (a + b). In der Raute sind alle vier Seiten gleich lang: U = 4 · a. Im Drachenviereck sind je zwei benachbarte Seiten gleich lang: U = 2 · (a + b). Beim Trapez addiert man alle vier Seiten: U = a + b + c + d.',
    quelle: 'Wikipedia: Viereck',
    url: 'https://de.wikipedia.org/wiki/Viereck',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 5, 24)
      let b = randInt(rng, 3, 18)
      while (b === a) b = randInt(rng, 3, 18)
      const value = 2 * (a + b)
      return visualTask({
        question: `Im Parallelogramm ABCD ist a = ${a} cm und b = ${b} cm. Berechne den Umfang.`,
        unit: 'cm',
        answerKind: 'integer',
        value,
        solution: `${value} cm`,
        explanation: `Gegenüberliegende Seiten sind gleich lang (c = a, d = b): U = 2 · (${a} cm + ${b} cm) = 2 · ${a + b} cm = ${value} cm.`,
        visualContent: generateQuadrilateralSvg({ kind: 'parallelogramm', sides: { a: `${a} cm`, b: `${b} cm` } }),
        dedupeKey: `ma:k6:u:para:${a}:${b}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 12, 30)
      const c = randInt(rng, 4, a - 4)
      const b = randInt(rng, 5, 14)
      const d = randInt(rng, 5, 14)
      const value = a + b + c + d
      return visualTask({
        question: `Ein Trapez hat die Seiten a = ${a} cm, b = ${b} cm, c = ${c} cm und d = ${d} cm. Berechne den Umfang.`,
        unit: 'cm',
        answerKind: 'integer',
        value,
        solution: `${value} cm`,
        explanation: `Im Trapez sind die Seiten im Allgemeinen verschieden lang, also werden alle vier addiert: U = ${a} + ${b} + ${c} + ${d} = ${value} cm.`,
        visualContent: generateQuadrilateralSvg({ kind: 'trapez', sides: { a: `${a} cm`, b: `${b} cm`, c: `${c} cm`, d: `${d} cm` } }),
        dedupeKey: `ma:k6:u:trapez:${a}:${b}:${c}:${d}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 6, 18)
      let b = randInt(rng, 10, 26)
      while (b === a) b = randInt(rng, 10, 26)
      const value = 2 * (a + b)
      return visualTask({
        question: `Ein Drachenviereck hat zwei Seiten der Länge ${a} cm und zwei Seiten der Länge ${b} cm. Berechne den Umfang.`,
        unit: 'cm',
        answerKind: 'integer',
        value,
        solution: `${value} cm`,
        explanation: `Im Drachenviereck kommen beide Seitenlängen je zweimal vor: U = 2 · (${a} cm + ${b} cm) = ${value} cm.`,
        visualContent: generateQuadrilateralSvg({ kind: 'drachen', sides: { a: `${Math.max(a, b)} cm`, b: `${Math.min(a, b)} cm` }, vertexNames: false }),
        dedupeKey: `ma:k6:u:drachen:${a}:${b}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 4, 25)
      const value = 4 * a
      const rueck = rng() < 0.5
      return valueTask({
        question: rueck
          ? `Eine Raute hat den Umfang ${value} cm. Wie lang ist eine Seite?`
          : `Eine Raute hat die Seitenlänge ${a} cm. Berechne den Umfang.`,
        unit: 'cm',
        answerKind: 'integer',
        value: rueck ? a : value,
        solution: rueck ? `${a} cm` : `${value} cm`,
        explanation: rueck
          ? `In der Raute sind alle vier Seiten gleich lang: a = U : 4 = ${value} cm : 4 = ${a} cm.`
          : `In der Raute sind alle vier Seiten gleich lang: U = 4 · ${a} cm = ${value} cm.`,
        visualContent: generateQuadrilateralSvg({ kind: 'raute', sides: { a: rueck ? 'a = ?' : `${a} cm` }, vertexNames: false }),
        dedupeKey: `ma:k6:u:raute:${a}:${rueck}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 6, 20)
      const b = randInt(rng, 4, 15)
      const U = 2 * (a + b)
      return valueTask({
        question: `Ein Parallelogramm hat den Umfang ${U} cm und die Seite a = ${a} cm. Wie lang ist die Seite b?`,
        unit: 'cm',
        answerKind: 'integer',
        value: b,
        solution: `${b} cm`,
        explanation: `U = 2 · (a + b) ⇒ a + b = ${U} : 2 = ${U / 2} cm ⇒ b = ${U / 2} − ${a} = ${b} cm.`,
        visualContent: generateQuadrilateralSvg({ kind: 'parallelogramm', sides: { a: `${a} cm`, b: 'b = ?' } }),
        dedupeKey: `ma:k6:u:para-rueck:${a}:${b}`,
      })
    },
  ),
}

const flaecheRechteck: Topic = {
  id: 'lb3-flaeche-rechteck',
  title: 'Flächeninhalt von Parallelogramm, Trapez und Drachenviereck',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Flächeninhalt', 'Parallelogramm', 'Trapez', 'Drachenviereck', 'Raute', 'Rückführprinzip'],
  fachwissen: {
    text: 'Mit dem Rückführprinzip führt man neue Figuren auf bekannte zurück. Ein Parallelogramm lässt sich durch Abschneiden und Ansetzen eines Dreiecks in ein Rechteck verwandeln: A = a · hₐ. Zwei gleiche Trapeze ergeben ein Parallelogramm mit der Grundseite a + c: A = (a + c) · h : 2. Drachenviereck und Raute sind halb so groß wie das Rechteck aus ihren Diagonalen: A = e · f : 2.',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 5, 22)
      const h = randInt(rng, 3, 15)
      const b = h + randInt(rng, 1, 5)
      const value = a * h
      return visualTask({
        question: `Ein Parallelogramm hat die Seite a = ${a} cm, die Seite b = ${b} cm und die Höhe hₐ = ${h} cm auf a. Berechne den Flächeninhalt.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Für die Fläche zählt die Höhe, nicht die schräge Seite b: A = a · hₐ = ${a} cm · ${h} cm = ${value} cm².`,
        visualContent: generateQuadrilateralSvg({ kind: 'parallelogramm', sides: { a: `${a} cm`, b: `${b} cm` }, heightLabel: `${h} cm` }),
        dedupeKey: `ma:k6:a:para:${a}:${h}:${b}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 10, 28)
      const c = randInt(rng, 3, a - 3)
      const h = randInt(rng, 3, 14)
      const value = roundTo(((a + c) * h) / 2, 1)
      return visualTask({
        question: `Ein Trapez hat die parallelen Seiten a = ${a} cm und c = ${c} cm sowie die Höhe h = ${h} cm. Berechne den Flächeninhalt.`,
        unit: 'cm²',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} cm²`,
        explanation: `A = (a + c) · h : 2 = (${a} + ${c}) · ${h} : 2 = ${a + c} · ${h} : 2 = ${formatDe(value)} cm².`,
        visualContent: generateQuadrilateralSvg({ kind: 'trapez', sides: { a: `${a} cm`, c: `${c} cm` }, heightLabel: `${h} cm` }),
        dedupeKey: `ma:k6:a:trapez:${a}:${c}:${h}`,
      })
    },
    (rng: Rng) => {
      const raute = rng() < 0.4
      const e = randInt(rng, 6, 24)
      let f = randInt(rng, 4, 20)
      while (f === e) f = randInt(rng, 4, 20)
      const value = roundTo((e * f) / 2, 1)
      return visualTask({
        question: `${raute ? 'Eine Raute' : 'Ein Drachenviereck'} hat die Diagonalen e = ${e} cm und f = ${f} cm. Berechne den Flächeninhalt.`,
        unit: 'cm²',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} cm²`,
        explanation: `Die Diagonalen stehen senkrecht aufeinander; die Figur ist halb so groß wie das Rechteck mit den Seiten e und f: A = e · f : 2 = ${e} · ${f} : 2 = ${formatDe(value)} cm².`,
        visualContent: generateQuadrilateralSvg({ kind: raute ? 'raute' : 'drachen', diagonals: { e: `e = ${e} cm`, f: `f = ${f} cm` }, vertexNames: false }),
        dedupeKey: `ma:k6:a:diag:${raute}:${e}:${f}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 4, 16)
      const h = randInt(rng, 3, 14)
      const A = a * h
      return valueTask({
        question: `Ein Parallelogramm hat den Flächeninhalt ${A} cm² und die Grundseite a = ${a} cm. Wie groß ist die Höhe hₐ?`,
        unit: 'cm',
        answerKind: 'integer',
        value: h,
        solution: `${h} cm`,
        explanation: `A = a · hₐ ⇒ hₐ = A : a = ${A} cm² : ${a} cm = ${h} cm.`,
        dedupeKey: `ma:k6:a:para-h:${a}:${h}`,
      })
    },
  ),
}

const flaecheDreieck: Topic = {
  id: 'lb3-flaeche-dreieck',
  title: 'Flächeninhalt von Dreiecken',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Der Flächeninhalt eines Dreiecks ist halb so groß wie der des umschriebenen Rechtecks mit gleicher Grundlinie und Höhe: A = (g · h) / 2. Die Höhe h steht senkrecht auf der Grundlinie g. Dieser Zusammenhang gilt für alle Dreiecke, unabhängig von ihrer Form.',
    quelle: 'Wikipedia: Dreieck',
    url: 'https://de.wikipedia.org/wiki/Dreieck',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const g = randInt(rng, 6, 36)
      const h = randInt(rng, 5, 32)
      const value = roundTo((g * h) / 2, 2)
      return valueTask({
        question: `Ein Dreieck hat die Grundseite ${g} cm und die Höhe ${h} cm. Berechne den Flächeninhalt.`,
        unit: 'cm²',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} cm²`,
        explanation: `A = (g · h) : 2 = (${g} · ${h}) : 2 = ${formatDe(value)} cm².`,
      })
    },
    (rng: Rng) => {
      const g = randInt(rng, 6, 20)
      const h = randInt(rng, 4, 18)
      // Prefer even products so answers stay clean integers often
      const value = roundTo((g * h) / 2, 2)
      return visualTask({
        question: 'Berechne den Flächeninhalt des abgebildeten Dreiecks:',
        unit: 'cm²',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} cm²`,
        explanation: `A = (g · h) : 2 = (${g} · ${h}) : 2 = ${formatDe(value)} cm².`,
        visualContent: generateTriangleSvg({
          baseLabel: `${g} cm`,
          heightLabel: `${h} cm`,
        }),
      })
    },
  ),
}

const kongruenzSatz: Topic = {
  id: 'lb3-kongruenzsatz',
  title: 'Kongruenzsatz wählen',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Kongruenz', 'SSS', 'SWS', 'WSW', 'SsW', 'Dreieck'],
  fachwissen: {
    text: 'Zwei Dreiecke sind kongruent, wenn sie in Form und Größe übereinstimmen. Die Kongruenzsätze SSS, SWS, WSW und SsW (zwei Seiten und der Gegenwinkel der größeren Seite) geben an, welche Maße ausreichen, um ein Dreieck eindeutig festzulegen.',
    quelle: 'Wikipedia: Kongruenzsatz',
    url: 'https://de.wikipedia.org/wiki/Kongruenzsatz',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const cases = [
        {
          correct: 'SSS',
          desc: 'Alle drei Seitenlängen a, b, c sind bekannt.',
          why: 'Drei Seiten bestimmen ein Dreieck eindeutig (SSS).',
        },
        {
          correct: 'SSS',
          desc: 'Gegeben sind a = 5 cm, b = 7 cm und c = 8 cm.',
          why: 'Drei Seiten → SSS.',
        },
        {
          correct: 'SSS',
          desc: 'Man kennt nur die drei Seitenmaße, keine Winkel.',
          why: 'Drei Seiten → SSS.',
        },
        {
          correct: 'SWS',
          desc: 'Zwei Seiten und der eingeschlossene Winkel sind bekannt.',
          why: 'Zwei Seiten mit dem Winkel dazwischen reichen (SWS).',
        },
        {
          correct: 'SWS',
          desc: 'Gegeben: Seite a, eingeschlossener Winkel γ, Seite b.',
          why: 'Seite–Winkel–Seite → SWS.',
        },
        {
          correct: 'SWS',
          desc: 'Zwei Schenkel und der Winkel zwischen ihnen sind gemessen.',
          why: 'SWS.',
        },
        {
          correct: 'WSW',
          desc: 'Eine Seite und die beiden anliegenden Winkel sind bekannt.',
          why: 'Seite mit beiden anliegenden Winkeln reicht (WSW).',
        },
        {
          correct: 'WSW',
          desc: 'Gegeben: Winkel α, Seite c, Winkel β (c zwischen α und β).',
          why: 'Winkel–Seite–Winkel → WSW.',
        },
        {
          correct: 'WSW',
          desc: 'Eine Seite liegt zwischen zwei bekannten Winkeln.',
          why: 'WSW.',
        },
        {
          correct: 'SsW',
          desc: 'Zwei Seiten und der Gegenwinkel der längeren Seite sind bekannt.',
          why: 'Zwei Seiten und der Winkel gegenüber der größeren Seite (SsW).',
        },
        {
          correct: 'SsW',
          desc: 'Gegeben: Seiten a < b und der Winkel β gegenüber der längeren Seite b.',
          why: 'SsW (Winkel gegenüber der größeren Seite).',
        },
        {
          correct: 'SsW',
          desc: 'Zwei Seiten plus Winkel gegenüber der größeren von beiden.',
          why: 'SsW.',
        },
      ] as const
      const c = pick(rng, [...cases])
      return choicePickTask({
        question: `Welcher Kongruenzsatz passt? ${c.desc}`,
        choices: ['SSS', 'SWS', 'WSW', 'SsW'],
        correct: c.correct,
        solution: c.correct,
        explanation: c.why,
        instruction: 'Tippe den passenden Kongruenzsatz:',
        dedupeKey: `ma:k6:kongr:${c.correct}:${c.desc.slice(0, 40)}`,
        contentIds: [`ma:k6:kongr:${c.correct}:${c.desc.slice(0, 40)}`],
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 8)
      const b = randInt(rng, 3, 8)
      return choicePickTask({
        question: `Im rechtwinkligen Dreieck sind beide Katheten (a=${a}, b=${b}) gegeben. Welcher Kongruenzsatz greift (inkl. rechter Winkel)?`,
        choices: ['SSS', 'SWS', 'WSW', 'SsW'],
        correct: 'SWS',
        solution: 'SWS',
        explanation: `Zwei Seiten (Katheten a=${a}, b=${b}) und der eingeschlossene rechte Winkel → SWS.`,
        visualContent: generateRightTriangleSvg({
          aLabel: `a=${a}`,
          bLabel: `b=${b}`,
          cLabel: 'c',
        }),
        instruction: 'Tippe den Kongruenzsatz:',
        dedupeKey: `ma:k6:kongr:SWS:recht:${a}:${b}`,
        contentIds: [`ma:k6:kongr:SWS:recht:${a}:${b}`],
      })
    },
  ),
}

const wuerfelNetz: Topic = {
  id: 'lb4-wuerfelnetz',
  title: 'Würfelnetz erkennen',
  pointsPerTask: 10,
  difficulty: 1,
  keywords: ['Würfel', 'Körpernetz', 'Netz', 'falten'],
  fachwissen: {
    text: 'Ein Körpernetz ist eine Abwicklung der Oberfläche in die Ebene. Für den Würfel gibt es 11 verschiedene Netze aus sechs Quadraten. Nicht jede Anordnung aus sechs Quadraten ist faltbar — z. B. ein 2×3-Rechteck oder sechs Quadrate in einer Reihe lassen sich nicht zum Würfel falten.',
    quelle: 'Wikipedia: Netz (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Netz_(Geometrie)',
  },
  generate: (rng: Rng) => {
    const valid = pick(rng, ['cross', 'zigzag'] as const)
    const invalid = pick(rng, ['invalid-row', 'invalid-block'] as const)
    const otherInvalid =
      invalid === 'invalid-row' ? ('invalid-block' as const) : ('invalid-row' as const)
    const options: Array<{ kind: CubeNetKind; label: string }> = [
      { kind: valid, label: 'A' },
      { kind: invalid, label: 'B' },
      { kind: otherInvalid, label: 'C' },
    ]
    // Shuffle labels while tracking correct letter
    for (let i = options.length - 1; i > 0; i--) {
      const j = randInt(rng, 0, i)
      ;[options[i], options[j]] = [options[j], options[i]]
    }
    options.forEach((o, i) => {
      o.label = String.fromCharCode(65 + i)
    })
    const correct = options.find((o) => o.kind === valid)!.label
    const layout = options.map((o) => o.kind).join('|')
    return choicePickTask({
      question: 'Welches der drei Netze lässt sich zu einem Würfel falten?',
      choices: ['A', 'B', 'C'],
      correct,
      solution: correct,
      explanation: `Nur Netz ${correct} ist ein gültiges Würfelnetz. Die anderen Anordnungen überlappen oder schließen sich nicht.`,
      visualContent: generateCubeNetChoicesSvg(options),
      instruction: 'Tippe den Buchstaben des faltbaren Netzes:',
      dedupeKey: `ma:k6:wuerfelnetz:${layout}:${correct}`,
      contentIds: [`ma:k6:wuerfelnetz:${layout}:${correct}`],
    })
  },
}

/** Sachaufgabe Geometrie: Kombiniertes Flächen-/Umfang-Problem im Alltag. */
const sachaufgabeGeometrie: Topic = {
  id: 'lb3-sachaufgabe-geometrie',
  title: 'Sachaufgabe: Dreiecke und Vierecke im Alltag',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sachaufgabe', 'Trapez', 'Parallelogramm', 'Dreieck', 'zusammengesetzte Fläche', 'Alltag'],
  fachwissen: {
    text: 'Bei Sachaufgaben zerlegt man die Fläche in bekannte Figuren (Rechteck, Dreieck, Parallelogramm, Trapez), berechnet die Teilflächen und addiert oder subtrahiert sie. Danach rechnet man mit der Sachgröße weiter, z. B. Kosten = Fläche · Preis pro m². Am Ende prüft man, ob das Ergebnis zur Frage passt (Fläche in m², Länge in m).',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const b = pick(rng, [6, 8, 10, 12])
      const hw = randInt(rng, 3, 6)
      const hd = randInt(rng, 2, 5)
      const fenster = pick(rng, [2, 3, 4])
      const value = roundTo(b * hw + (b * hd) / 2 - fenster, 1)
      return valueTask({
        question: `Eine Giebelwand besteht aus einem Rechteck (${b} m breit, ${hw} m hoch) und einem aufgesetzten Dreieck (Grundseite ${b} m, Höhe ${hd} m). Die Fenster sind zusammen ${fenster} m² groß. Wie viel m² Wand müssen gestrichen werden?`,
        unit: 'm²',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} m²`,
        explanation: `Rechteck: ${b} · ${hw} = ${b * hw} m². Dreieck: ${b} · ${hd} : 2 = ${formatDe((b * hd) / 2)} m². Wand ohne Fenster: ${b * hw} + ${formatDe((b * hd) / 2)} − ${fenster} = ${formatDe(value)} m².`,
        dedupeKey: `ma:k6:sach:giebel:${b}:${hw}:${hd}:${fenster}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 20, 40)
      const c = randInt(rng, 10, a - 4)
      const h = randInt(rng, 10, 25)
      const preis = pick(rng, [3, 4, 5, 8])
      const flaeche = ((a + c) * h) / 2
      const value = roundTo(flaeche * preis, 2)
      return valueTask({
        question: `Ein trapezförmiges Gartenstück hat die parallelen Seiten ${a} m und ${c} m, ihr Abstand beträgt ${h} m. Rollrasen kostet ${preis} € pro m². Was kostet der Rasen für das ganze Stück?`,
        unit: '€',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} €`,
        explanation: `Fläche: (${a} + ${c}) · ${h} : 2 = ${formatDe(flaeche)} m². Kosten: ${formatDe(flaeche)} · ${preis} € = ${formatDe(value)} €.`,
        dedupeKey: `ma:k6:sach:rasen:${a}:${c}:${h}:${preis}`,
      })
    },
    (rng: Rng) => {
      const n = randInt(rng, 6, 14)
      const a = pick(rng, [2.5, 3, 3.5])
      const h = pick(rng, [4.5, 5, 5.5])
      const value = roundTo(n * a * h, 2)
      return valueTask({
        question: `Auf einem Parkplatz sind ${n} schräge Stellplätze markiert. Jeder hat die Form eines Parallelogramms mit der Grundseite ${formatDe(a)} m und der Höhe ${formatDe(h)} m. Wie groß ist die markierte Fläche insgesamt?`,
        unit: 'm²',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} m²`,
        explanation: `Ein Stellplatz: A = g · h = ${formatDe(a)} · ${formatDe(h)} = ${formatDe(roundTo(a * h, 2))} m². Alle: ${n} · ${formatDe(roundTo(a * h, 2))} = ${formatDe(value)} m².`,
        dedupeKey: `ma:k6:sach:park:${n}:${a}:${h}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 14, 30)
      const c = randInt(rng, 6, a - 4)
      const s = randInt(rng, 6, 15)
      const tor = pick(rng, [1, 2, 3])
      const value = a + c + 2 * s - tor
      return valueTask({
        question: `Eine Weide hat die Form eines gleichschenkligen Trapezes mit den parallelen Seiten ${a} m und ${c} m und den Schenkeln je ${s} m. Sie wird eingezäunt, ein Tor ist ${tor} m breit. Wie viel Meter Zaun werden gebraucht?`,
        unit: 'm',
        answerKind: 'integer',
        value,
        solution: `${value} m`,
        explanation: `Umfang: ${a} + ${c} + 2 · ${s} = ${a + c + 2 * s} m. Ohne Tor: ${a + c + 2 * s} − ${tor} = ${value} m.`,
        dedupeKey: `ma:k6:sach:weide:${a}:${c}:${s}:${tor}`,
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Prismen
// ---------------------------------------------------------------------------

/** Vorderflächen für Prismen-Schrägbilder (Pixel). */
const FACE_DREIECK: Array<[number, number]> = [[40, 225], [220, 225], [130, 105]]
const FACE_TRAPEZ: Array<[number, number]> = [[40, 225], [250, 225], [190, 125], [100, 125]]
const FACE_HAUS: Array<[number, number]> = [[40, 235], [200, 235], [200, 150], [120, 90], [40, 150]]
const FACE_RECHTW: Array<[number, number]> = [[50, 225], [210, 225], [50, 105]]

const volumenQuader: Topic = {
  id: 'lb4-volumen-quader',
  title: 'Volumen von aus Prismen zusammengesetzten Körpern',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['zusammengesetzter Körper', 'Prisma', 'Volumen', 'Rückführprinzip'],
  fachwissen: {
    text: 'Zusammengesetzte Körper zerlegt man in Prismen (Rückführprinzip), berechnet jedes Teilvolumen mit V = G · h und addiert. Ist etwas herausgeschnitten, subtrahiert man das Volumen des fehlenden Teils. Hat der ganze Körper eine gleichbleibende Vorderfläche (z. B. ein Haus mit Satteldach), ist er selbst ein Prisma: G = Rechteck + Dreieck.',
    quelle: 'Wikipedia: Prisma (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Prisma_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const b = pick(rng, [4, 6, 8, 10])
      const hw = randInt(rng, 3, 6)
      const hd = randInt(rng, 2, 4)
      const l = randInt(rng, 5, 12)
      const G = b * hw + (b * hd) / 2
      const value = G * l
      return visualTask({
        question: `Das Modellhaus ist ein Prisma: Die Vorderfläche besteht aus einem Rechteck (Breite ${b} cm, Wandhöhe ${hw} cm) und einem Dachdreieck mit der Höhe ${hd} cm. Das Haus ist ${l} cm lang. Berechne das Volumen.`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `G = ${b} · ${hw} + ${b} · ${hd} : 2 = ${b * hw} + ${(b * hd) / 2} = ${G} cm². V = G · l = ${G} · ${l} = ${value} cm³.`,
        visualContent: generateExtrudedPrismSvg({
          face: FACE_HAUS,
          edgeLabels: [[0, 1, `${b} cm`], [4, 0, `${hw} cm`]],
          helper: { from: [120, 90], to: [120, 150], text: `${hd} cm` },
          depthLabel: { at: 2, text: `${l} cm` },
          ariaLabel: 'Haus als Prisma',
        }),
        dedupeKey: `ma:k6:zusprisma:haus:${b}:${hw}:${hd}:${l}`,
      })
    },
    (rng: Rng) => {
      const l = randInt(rng, 8, 16)
      const b = randInt(rng, 5, 9)
      const c = randInt(rng, 4, 7)
      const g = pick(rng, [2, 3, 4])
      const t = pick(rng, [1, 2, 3].filter((x) => x < c))
      const quader = l * b * c
      const rinne = (g * t * l) / 2
      const value = roundTo(quader - rinne, 1)
      return valueTask({
        question: `Ein Holzquader ist ${l} cm lang, ${b} cm breit und ${c} cm hoch. Über die ganze Länge wird oben eine Rinne gefräst; ihr Querschnitt ist ein Dreieck mit der Grundseite ${g} cm und der Tiefe ${t} cm. Wie groß ist das Restvolumen?`,
        unit: 'cm³',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} cm³`,
        explanation: `Quader: ${l} · ${b} · ${c} = ${quader} cm³. Rinne (dreiseitiges Prisma): ${g} · ${t} : 2 · ${l} = ${formatDe(rinne)} cm³. Rest: ${quader} − ${formatDe(rinne)} = ${formatDe(value)} cm³.`,
        dedupeKey: `ma:k6:zusprisma:rinne:${l}:${b}:${c}:${g}:${t}`,
      })
    },
    (rng: Rng) => {
      const b = pick(rng, [3, 4, 5, 6])
      const lg = pick(rng, [6, 7, 8])
      const hw = pick(rng, [2.5, 3])
      const hd = pick(rng, [1, 1.5, 2])
      const value = roundTo(b * lg * hw + (b * hd * lg) / 2, 2)
      return valueTask({
        question: `Eine Garage (Quader: ${b} m breit, ${lg} m lang, ${formatDe(hw)} m hoch) hat ein Satteldach in Form eines dreiseitigen Prismas: Giebelbreite ${b} m, Dachhöhe ${formatDe(hd)} m, Länge ${lg} m. Wie groß ist der umbaute Raum?`,
        unit: 'm³',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} m³`,
        explanation: `Quader: ${b} · ${lg} · ${formatDe(hw)} = ${formatDe(roundTo(b * lg * hw, 2))} m³. Dach: ${b} · ${formatDe(hd)} : 2 · ${lg} = ${formatDe(roundTo((b * hd * lg) / 2, 2))} m³. Zusammen: ${formatDe(value)} m³.`,
        dedupeKey: `ma:k6:zusprisma:garage:${b}:${lg}:${hw}:${hd}`,
      })
    },
  ),
}

const PYTH_TRIPEL: Array<[number, number, number]> = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 6, 10], [12, 5, 13]]

const oberflaecheQuader: Topic = {
  id: 'lb4-oberflaeche-quader',
  title: 'Oberflächeninhalt gerader Prismen',
  pointsPerTask: 10,
  difficulty: 3,
  keywords: ['Oberflächeninhalt', 'Prisma', 'Mantel', 'Körpernetz'],
  fachwissen: {
    text: 'Das Netz eines geraden Prismas besteht aus zwei deckungsgleichen Grundflächen und dem Mantel aus Rechtecken. Der Mantel ist ein Rechteck aus Umfang der Grundfläche mal Körperhöhe: M = u · h. Damit gilt O = 2 · G + M. Ein n-seitiges Prisma hat 2 n-Ecke als Grund- und Deckfläche und n Rechtecke als Seitenflächen.',
    quelle: 'Wikipedia: Prisma (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Prisma_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const [p, q, r] = pick(rng, PYTH_TRIPEL)
      const h = randInt(rng, 4, 15)
      const G = (p * q) / 2
      const M = (p + q + r) * h
      const value = 2 * G + M
      return visualTask({
        question: `Die Grundfläche eines geraden Prismas ist ein rechtwinkliges Dreieck mit den Seiten ${p} cm, ${q} cm und ${r} cm (der rechte Winkel liegt zwischen ${p} cm und ${q} cm). Das Prisma ist ${h} cm lang. Berechne den Oberflächeninhalt.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `G = ${p} · ${q} : 2 = ${G} cm². M = u · h = (${p} + ${q} + ${r}) · ${h} = ${M} cm². O = 2 · G + M = ${2 * G} + ${M} = ${value} cm².`,
        visualContent: generateExtrudedPrismSvg({
          face: FACE_RECHTW,
          edgeLabels: [[0, 1, `${q} cm`], [2, 0, `${p} cm`], [1, 2, `${r} cm`]],
          depthLabel: { at: 1, text: `${h} cm` },
          ariaLabel: 'Dreiseitiges Prisma',
        }),
        dedupeKey: `ma:k6:o:dreieck:${p}:${q}:${h}`,
      })
    },
    (rng: Rng) => {
      const [x, ht, s] = pick(rng, [[3, 4, 5], [4, 3, 5], [6, 8, 10], [5, 12, 13]] as Array<[number, number, number]>)
      const c = randInt(rng, 3, 10)
      const a = c + 2 * x
      const l = randInt(rng, 5, 15)
      const G = ((a + c) * ht) / 2
      const M = (a + c + 2 * s) * l
      const value = 2 * G + M
      return visualTask({
        question: `Ein gerades Prisma hat als Grundfläche ein gleichschenkliges Trapez: a = ${a} cm, c = ${c} cm, Schenkel je ${s} cm, Trapezhöhe ${ht} cm. Das Prisma ist ${l} cm lang. Berechne den Oberflächeninhalt.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `G = (${a} + ${c}) · ${ht} : 2 = ${G} cm². M = (${a} + ${c} + ${s} + ${s}) · ${l} = ${M} cm². O = 2 · ${G} + ${M} = ${value} cm².`,
        visualContent: generateExtrudedPrismSvg({
          face: FACE_TRAPEZ,
          edgeLabels: [[0, 1, `${a} cm`], [2, 3, `${c} cm`], [1, 2, `${s} cm`]],
          helper: { from: [100, 125], to: [100, 225], text: `${ht} cm`, rightAngleAlong: [1, 0] },
          depthLabel: { at: 1, text: `${l} cm` },
          ariaLabel: 'Prisma mit Trapezgrundfläche',
        }),
        dedupeKey: `ma:k6:o:trapez:${a}:${c}:${ht}:${l}`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [3, 5, 6, 8])
      const s = randInt(rng, 2, 9)
      const h = randInt(rng, 5, 20)
      const value = n * s * h
      const name = { 3: 'gleichseitiges Dreieck', 5: 'regelmäßiges Fünfeck', 6: 'regelmäßiges Sechseck', 8: 'regelmäßiges Achteck' }[n]
      return valueTask({
        question: `Ein Prisma hat als Grundfläche ein ${name} mit der Seitenlänge ${s} cm und ist ${h} cm hoch. Wie groß ist seine Mantelfläche?`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Der Mantel besteht aus ${n} gleichen Rechtecken ${s} cm × ${h} cm: M = u · h = ${n} · ${s} · ${h} = ${value} cm².`,
        dedupeKey: `ma:k6:o:mantel:${n}:${s}:${h}`,
      })
    },
    (rng: Rng) => {
      const n = pick(rng, [3, 4, 5, 6, 8])
      const eck = { 3: 'Dreiecke', 4: 'Vierecke', 5: 'Fünfecke', 6: 'Sechsecke', 8: 'Achtecke' } as Record<number, string>
      const correct = `2 ${eck[n]} und ${n} Rechtecke`
      const pool = [
        correct,
        `1 ${eck[n]!.replace(/e$/, '')} und ${n} Dreiecke`,
        `2 ${eck[n]} und ${n + 2} Rechtecke`,
        `${n} ${eck[n]} und 2 Rechtecke`,
      ]
      return choicePickTask({
        question: `Aus welchen Flächen besteht das Netz eines geraden ${n}-seitigen Prismas?`,
        choices: shuffleArr(rng, pool),
        correct,
        solution: correct,
        explanation: `Grund- und Deckfläche sind zwei deckungsgleiche ${eck[n]}; jede der ${n} Grundkanten trägt eine rechteckige Seitenfläche. Ein Vieleck mit ${n} Dreiecken wäre das Netz einer Pyramide.`,
        dedupeKey: `ma:k6:o:netz:${n}`,
      })
    },
  ),
}

const volumenPrisma: Topic = {
  id: 'lb4-volumen-prisma',
  title: 'Volumen gerader Prismen mit Dreieck- und Trapezgrundfläche',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Volumen', 'Prisma', 'Grundfläche', 'Dreieck', 'Trapez'],
  fachwissen: {
    text: 'Für jedes gerade Prisma gilt V = G · h: Grundfläche mal Körperhöhe. Die Grundfläche berechnet man zuerst mit der passenden Flächenformel, z. B. Dreieck G = g · h_g : 2 oder Trapez G = (a + c) · h_T : 2. Liegt das Prisma, ist die Körperhöhe die Länge des Prismas.',
    quelle: 'Wikipedia: Prisma (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Prisma_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const g = randInt(rng, 4, 14)
      const hg = randInt(rng, 3, 10)
      const h = randInt(rng, 5, 20)
      const G = (g * hg) / 2
      const value = roundTo(G * h, 1)
      return visualTask({
        question: `Ein dreiseitiges Prisma hat als Grundfläche ein Dreieck mit g = ${g} cm und h_g = ${hg} cm. Das Prisma ist ${h} cm lang. Berechne das Volumen.`,
        unit: 'cm³',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} cm³`,
        explanation: `G = g · h_g : 2 = ${g} · ${hg} : 2 = ${formatDe(G)} cm². V = G · h = ${formatDe(G)} · ${h} = ${formatDe(value)} cm³.`,
        visualContent: generateExtrudedPrismSvg({
          face: FACE_DREIECK,
          edgeLabels: [[0, 1, `g = ${g} cm`]],
          helper: { from: [130, 105], to: [130, 225], text: `h_g = ${hg} cm`, rightAngleAlong: [1, 0] },
          depthLabel: { at: 1, text: `${h} cm` },
          ariaLabel: 'Dreiseitiges Prisma',
        }),
        dedupeKey: `ma:k6:v:dreieck:${g}:${hg}:${h}`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 8, 16)
      const c = randInt(rng, 3, a - 2)
      const ht = randInt(rng, 3, 8)
      const l = randInt(rng, 5, 20)
      const G = ((a + c) * ht) / 2
      const value = roundTo(G * l, 1)
      return visualTask({
        question: `Ein Prisma hat als Grundfläche ein Trapez mit a = ${a} cm, c = ${c} cm und h_T = ${ht} cm. Es ist ${l} cm lang. Berechne das Volumen.`,
        unit: 'cm³',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} cm³`,
        explanation: `G = (a + c) · h_T : 2 = (${a} + ${c}) · ${ht} : 2 = ${formatDe(G)} cm². V = ${formatDe(G)} · ${l} = ${formatDe(value)} cm³.`,
        visualContent: generateExtrudedPrismSvg({
          face: FACE_TRAPEZ,
          edgeLabels: [[0, 1, `a = ${a} cm`], [2, 3, `c = ${c} cm`]],
          helper: { from: [100, 125], to: [100, 225], text: `h_T = ${ht} cm`, rightAngleAlong: [1, 0] },
          depthLabel: { at: 1, text: `${l} cm` },
          ariaLabel: 'Prisma mit Trapezgrundfläche',
        }),
        dedupeKey: `ma:k6:v:trapez:${a}:${c}:${ht}:${l}`,
      })
    },
    (rng: Rng) => {
      const L = pick(rng, [20, 25, 30])
      const w = pick(rng, [8, 10, 12])
      const t1 = pick(rng, [1, 1.2])
      const t2 = pick(rng, [1.8, 2, 2.5])
      const G = roundTo(((t1 + t2) * L) / 2, 2)
      const value = roundTo(G * w, 2)
      return valueTask({
        question: `Ein Schwimmbecken ist ${L} m lang und ${w} m breit. Am flachen Ende ist es ${formatDe(t1)} m tief, am tiefen Ende ${formatDe(t2)} m; der Boden fällt gleichmäßig ab. Wie viel m³ Wasser passen hinein?`,
        unit: 'm³',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} m³`,
        explanation: `Der Längsschnitt ist ein Trapez: G = (${formatDe(t1)} + ${formatDe(t2)}) · ${L} : 2 = ${formatDe(G)} m². Das Becken ist ein Prisma mit der Breite als Körperhöhe: V = ${formatDe(G)} · ${w} = ${formatDe(value)} m³.`,
        dedupeKey: `ma:k6:v:becken:${L}:${w}:${t1}:${t2}`,
      })
    },
    (rng: Rng) => {
      const g = pick(rng, [4, 6, 8, 10])
      const hg = randInt(rng, 3, 9)
      const h = randInt(rng, 4, 15)
      const G = (g * hg) / 2
      const V = G * h
      return valueTask({
        question: `Ein dreiseitiges Prisma mit der Grundfläche g = ${g} cm, h_g = ${hg} cm hat das Volumen ${formatDe(V)} cm³. Wie lang ist das Prisma?`,
        unit: 'cm',
        answerKind: 'integer',
        value: h,
        solution: `${h} cm`,
        explanation: `G = ${g} · ${hg} : 2 = ${formatDe(G)} cm². Aus V = G · h folgt h = V : G = ${formatDe(V)} : ${formatDe(G)} = ${h} cm.`,
        dedupeKey: `ma:k6:v:rueck:${g}:${hg}:${h}`,
      })
    },
  ),
}

/** Volumen ↔ Fläche × Höhe (2D + 1D = 3D). Nur für Entwickler-Freigabe. */
const flaecheKanteQuader: Topic = {
  id: 'lb4-flaeche-kante-quader',
  title: 'Fläche und senkrechte Seitenlänge',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Quader', 'Würfel', 'Volumen', 'Grundfläche', 'Höhe', 'Dimension', 'Prisma'],
  fachwissen: {
    text: 'Beim Quader, Würfel und Prisma gilt: Volumen (3D) = Flächeninhalt (2D) · dazu senkrechte Länge (1D). Schreibweise V = G · h. Deshalb: G = V : h und h = V : G. Beim Würfel ist jede Seitenfläche A = a² und V = A · a, also a = V : A.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    // --- Quader: Grundfläche oben ↔ Höhe ---
    (rng: Rng) => {
      const g = randInt(rng, 12, 80)
      const h = randInt(rng, 3, 18)
      const v = g * h
      return visualTask({
        question: `Ein Quader hat das Volumen ${v} cm³. Die Höhe (senkrecht zur Grundfläche) beträgt ${h} cm. Wie groß ist der Flächeninhalt der Grundfläche?`,
        unit: 'cm²',
        answerKind: 'integer',
        value: g,
        solution: `${g} cm²`,
        explanation: `2D · 1D = 3D: V = G · h ⇒ G = V : h = ${v} : ${h} = ${g} cm².`,
        visualContent: generateCuboidSvg({
          lengthLabel: '',
          widthLabel: '',
          heightLabel: '',
          areaFace: 'top',
          areaLabel: 'G = ?',
          perpendicularLabel: `${h} cm`,
        }),
      })
    },
    (rng: Rng) => {
      const g = randInt(rng, 10, 72)
      const h = randInt(rng, 4, 16)
      const v = g * h
      return visualTask({
        question: `Ein Quader hat das Volumen ${v} cm³ und die Grundfläche ${g} cm². Wie groß ist die Höhe (senkrecht zur Grundfläche)?`,
        unit: 'cm',
        answerKind: 'integer',
        value: h,
        solution: `${h} cm`,
        explanation: `2D · 1D = 3D: V = G · h ⇒ h = V : G = ${v} : ${g} = ${h} cm.`,
        visualContent: generateCuboidSvg({
          lengthLabel: '',
          widthLabel: '',
          heightLabel: '',
          areaFace: 'top',
          areaLabel: `G = ${g} cm²`,
          perpendicularLabel: '?',
        }),
      })
    },
    // --- Quader: Vorderfläche ↔ Tiefenkante ---
    (rng: Rng) => {
      const a = randInt(rng, 3, 10)
      const b = randInt(rng, 3, 10)
      const c = randInt(rng, 3, 12)
      const face = a * b
      const v = face * c
      return visualTask({
        question: `Ein Quader hat das Volumen ${v} cm³. Die gelb markierte Vorderfläche misst ${face} cm². Wie lang ist die dazu senkrechte Kante (in die Tiefe)?`,
        unit: 'cm',
        answerKind: 'integer',
        value: c,
        solution: `${c} cm`,
        explanation: `V = A · c (Fläche · senkrechte Länge) ⇒ c = V : A = ${v} : ${face} = ${c} cm.`,
        visualContent: generateCuboidFaceEdgeSvg({
          faceAreaLabel: `${face} cm²`,
          faceEdgeLabel: `${a} cm`,
          perpendicularLabel: '?',
          caption: `V = ${v} cm³`,
          highlightFace: 'front',
        }),
      })
    },
    // --- Quader: rechte Seitenfläche ↔ Länge ---
    (rng: Rng) => {
      const a = randInt(rng, 3, 10)
      const b = randInt(rng, 3, 10)
      const c = randInt(rng, 4, 14)
      const face = b * c
      const v = face * a
      return visualTask({
        question: `Ein Quader hat das Volumen ${v} cm³. Die gelb markierte rechte Seitenfläche misst ${face} cm². Wie lang ist die dazu senkrechte Kante?`,
        unit: 'cm',
        answerKind: 'integer',
        value: a,
        solution: `${a} cm`,
        explanation: `V = A · a ⇒ a = V : A = ${v} : ${face} = ${a} cm.`,
        visualContent: generateCuboidFaceEdgeSvg({
          faceAreaLabel: `${face} cm²`,
          faceEdgeLabel: `${b} cm`,
          perpendicularLabel: '?',
          caption: `V = ${v} cm³`,
          highlightFace: 'right',
          faceKindLabel: 'Rechte Seitenfläche',
        }),
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 10)
      const b = randInt(rng, 3, 10)
      const c = randInt(rng, 4, 14)
      const face = a * b
      const v = face * c
      return visualTask({
        question: `Ein Quader hat das Volumen ${v} cm³. Die Kante senkrecht zur gelb markierten Vorderfläche misst ${c} cm. Wie groß ist der Flächeninhalt dieser Seitenfläche?`,
        unit: 'cm²',
        answerKind: 'integer',
        value: face,
        solution: `${face} cm²`,
        explanation: `V = A · c ⇒ A = V : c = ${v} : ${c} = ${face} cm².`,
        visualContent: generateCuboidFaceEdgeSvg({
          faceAreaLabel: '?',
          faceEdgeLabel: '?',
          perpendicularLabel: `${c} cm`,
          caption: `V = ${v} cm³`,
          highlightFace: 'front',
        }),
      })
    },
    // --- Prisma ---
    (rng: Rng) => {
      const g = randInt(rng, 15, 60)
      const h = randInt(rng, 5, 20)
      const v = g * h
      return visualTask({
        question: `Ein Prisma hat das Volumen ${v} cm³. Die Höhe senkrecht zur Grundfläche ist ${h} cm. Berechne den Flächeninhalt der Grundfläche.`,
        unit: 'cm²',
        answerKind: 'integer',
        value: g,
        solution: `${g} cm²`,
        explanation: `V = G · h ⇒ G = V : h = ${v} : ${h} = ${g} cm² (Fläche ⊥ Höhe).`,
        visualContent: generatePrismVolumeSvg({
          baseAreaLabel: '?',
          heightLabel: `${h} cm`,
        }),
      })
    },
    (rng: Rng) => {
      const g = randInt(rng, 12, 54)
      const h = randInt(rng, 4, 15)
      const v = g * h
      return visualTask({
        question: `Ein Prisma hat das Volumen ${v} cm³ und die Grundfläche ${g} cm². Wie groß ist die Höhe?`,
        unit: 'cm',
        answerKind: 'integer',
        value: h,
        solution: `${h} cm`,
        explanation: `V = G · h ⇒ h = V : G = ${v} : ${g} = ${h} cm.`,
        visualContent: generatePrismVolumeSvg({
          baseAreaLabel: `${g} cm²`,
          heightLabel: '?',
        }),
      })
    },
    // --- Würfel: Fläche oben ↔ vertikale Kante ---
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const face = a * a
      const volume = a * a * a
      return visualTask({
        question: `Ein Würfel hat das Volumen ${volume} cm³. Die obere Seitenfläche misst ${face} cm². Wie lang ist die dazu senkrechte Kante?`,
        unit: 'cm',
        answerKind: 'integer',
        value: a,
        solution: `${a} cm`,
        explanation: `Beim Würfel: V = A · a. Also a = V : A = ${volume} : ${face} = ${a} cm.`,
        visualContent: generateCuboidSvg({
          lengthLabel: '',
          widthLabel: '',
          heightLabel: '',
          cube: true,
          areaFace: 'top',
          areaLabel: `A = ${face} cm²`,
          perpendicularLabel: '?',
        }),
      })
    },
    // --- Würfel: Vorderfläche ↔ Tiefenkante ---
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const face = a * a
      const volume = a * a * a
      return visualTask({
        question: `Ein Würfel hat das Volumen ${volume} cm³. Die gelb markierte Vorderfläche misst ${face} cm². Wie lang ist die dazu senkrechte Kante?`,
        unit: 'cm',
        answerKind: 'integer',
        value: a,
        solution: `${a} cm`,
        explanation: `V = A · a ⇒ a = V : A = ${volume} : ${face} = ${a} cm.`,
        visualContent: generateCuboidFaceEdgeSvg({
          faceAreaLabel: `${face} cm²`,
          faceEdgeLabel: 'a',
          perpendicularLabel: '?',
          caption: `V = ${volume} cm³ · Würfel`,
          cube: true,
          highlightFace: 'front',
        }),
      })
    },
    // --- Würfel: rechte Fläche ↔ Länge ---
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const face = a * a
      const volume = a * a * a
      return visualTask({
        question: `Ein Würfel hat das Volumen ${volume} cm³. Die gelb markierte rechte Seitenfläche misst ${face} cm². Wie lang ist die dazu senkrechte Kante?`,
        unit: 'cm',
        answerKind: 'integer',
        value: a,
        solution: `${a} cm`,
        explanation: `V = A · a ⇒ a = V : A = ${volume} : ${face} = ${a} cm.`,
        visualContent: generateCuboidFaceEdgeSvg({
          faceAreaLabel: `${face} cm²`,
          faceEdgeLabel: 'a',
          perpendicularLabel: '?',
          caption: `V = ${volume} cm³ · Würfel`,
          cube: true,
          highlightFace: 'right',
          faceKindLabel: 'Rechte Seitenfläche (Quadrat)',
        }),
      })
    },
    // --- Würfel: bekannte Kante → Fläche (wechselnde Fläche) ---
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const face = a * a
      const volume = a * a * a
      const which = randInt(rng, 0, 2) as 0 | 1 | 2
      const faces = [
        {
          areaFace: 'top' as const,
          q: `Ein Würfel hat das Volumen ${volume} cm³. Eine Kante senkrecht zur oberen Seitenfläche misst ${a} cm. Wie groß ist der Flächeninhalt dieser oberen Seitenfläche?`,
          svg: generateCuboidSvg({
            lengthLabel: '',
            widthLabel: '',
            heightLabel: '',
            cube: true,
            areaFace: 'top',
            areaLabel: 'A = ?',
            perpendicularLabel: `${a} cm`,
          }),
        },
        {
          areaFace: 'front' as const,
          q: `Ein Würfel hat das Volumen ${volume} cm³. Die Kante senkrecht zur Vorderfläche misst ${a} cm. Wie groß ist der Flächeninhalt der Vorderfläche?`,
          svg: generateCuboidFaceEdgeSvg({
            faceAreaLabel: '?',
            faceEdgeLabel: 'a',
            perpendicularLabel: `${a} cm`,
            caption: `V = ${volume} cm³ · Würfel`,
            cube: true,
            highlightFace: 'front',
          }),
        },
        {
          areaFace: 'right' as const,
          q: `Ein Würfel hat das Volumen ${volume} cm³. Die Kante senkrecht zur rechten Seitenfläche misst ${a} cm. Wie groß ist der Flächeninhalt dieser Seitenfläche?`,
          svg: generateCuboidFaceEdgeSvg({
            faceAreaLabel: '?',
            faceEdgeLabel: 'a',
            perpendicularLabel: `${a} cm`,
            caption: `V = ${volume} cm³ · Würfel`,
            cube: true,
            highlightFace: 'right',
            faceKindLabel: 'Rechte Seitenfläche (Quadrat)',
          }),
        },
      ]
      const pick = faces[which]!
      return visualTask({
        question: pick.q,
        unit: 'cm²',
        answerKind: 'integer',
        value: face,
        solution: `${face} cm²`,
        explanation: `V = A · a ⇒ A = V : a = ${volume} : ${a} = ${face} cm².`,
        visualContent: pick.svg,
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung: Anteile
// ---------------------------------------------------------------------------

const anteilVonGroesse: Topic = {
  id: 'lb5-anteil-groesse',
  title: 'Anteil einer Größe berechnen',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Den Anteil p/q von einer Größe G berechnet man als (p/q) · G. Praktisch: erst durch den Nenner teilen (ein Teil = G/q), dann mit dem Zähler multiplizieren (p Teile). Beispiel: 3/4 von 120 € = 120 € ÷ 4 · 3 = 30 € · 3 = 90 €. Das Ergebnis ist immer kleiner als G (wenn p < q).',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const d = pick(rng, [2, 3, 4, 5, 6, 8])
      const n = randInt(rng, 1, d - 1)
      const unit = pick(rng, ['kg', 'm', '€', 'Liter'])
      const whole = d * randInt(rng, 2, 12)
      const value = (n / d) * whole
      const prompts = [
        `Berechne ${n}/${d} von ${whole} ${unit}.`,
        `Wie viel sind ${n}/${d} von ${whole} ${unit}?`,
        `Ein Anteil von ${n}/${d} bezieht sich auf ${whole} ${unit}. Wie groß ist dieser Anteil?`,
        `${n} von ${d} gleichen Teilen von ${whole} ${unit} — wie groß ist das Ergebnis?`,
      ]
      return valueTask({
        question: pick(rng, prompts),
        unit,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} ${unit}`,
        explanation: `Teile durch den Nenner und multipliziere mit dem Zähler: ${whole} : ${d} = ${whole / d}, dann · ${n} = ${formatDe(value)} ${unit}.`,
        dedupeKey: `anteil:calc:${n}/${d}:${whole}:${unit}`,
      })
    },
    (rng: Rng) => {
      const d = pick(rng, [2, 4, 5, 8, 10])
      const n = randInt(rng, 1, d - 1)
      const unit = pick(rng, ['kg', 'm', '€', 'Liter'])
      const whole = d * randInt(rng, 2, 10)
      const value = (n / d) * whole
      const prompts = [
        `Der farbige Teil des Streifens gehört zu ${whole} ${unit}. Welcher Wert entspricht dem eingefärbten Anteil?`,
        `Am Anteilsstreifen zu ${whole} ${unit}: Wie groß ist nur der eingefärbte Teil?`,
        `Lies am Streifen ab: Wie viele ${unit} sind eingefärbt (Ganzes = ${whole} ${unit})?`,
      ]
      return visualTask({
        question: pick(rng, prompts),
        unit,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} ${unit}`,
        explanation: `${n}/${d} von ${whole} ${unit} = ${formatDe(value)} ${unit}.`,
        visualContent: generateFractionBarSvg({
          numerator: n,
          denominator: d,
          showLabel: false,
        }),
        dedupeKey: `anteil:bar:${n}/${d}:${whole}:${unit}`,
      })
    },
    (rng: Rng) => {
      const d = pick(rng, [4, 5, 8, 10])
      const n = randInt(rng, 1, d - 1)
      const unit = pick(rng, ['kg', '€', 'Liter'])
      const whole = d * randInt(rng, 3, 12)
      const value = (n / d) * whole
      const prompts = [
        `Im Kreisdiagramm ist ein Teil von ${whole} ${unit} eingefärbt. Wie groß ist dieser Anteil?`,
        `Kreisdiagramm zu ${whole} ${unit}: Welcher Wert gehört zum farbigen Sektor?`,
        `Nur der eingefärbte Kreissektor zählt. Ausgangswert ${whole} ${unit} — wie groß ist er?`,
      ]
      return visualTask({
        question: pick(rng, prompts),
        unit,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} ${unit}`,
        explanation: `${n}/${d} · ${whole} = ${formatDe(value)} ${unit}.`,
        visualContent: generateFractionCircleSvg({
          numerator: n,
          denominator: d,
          showLabel: false,
        }),
        dedupeKey: `anteil:circle:${n}/${d}:${whole}:${unit}`,
      })
    },
  ),
}

const anteilProzent: Topic = {
  id: 'lb5-anteil-prozent',
  title: 'Prozent einer Größe berechnen',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Den prozentualen Anteil eines Grundwerts berechnet man: Prozentwert W = Grundwert G × Prozentsatz p / 100. Zur Berechnung des Prozentsatzes aus Prozentwert und Grundwert gilt: p = (W / G) × 100. Prozentrechnung wird im Alltag ständig benötigt – für Rabatte, Zinsen, Noten, Steuern.',
    quelle: 'Wikipedia: Prozentrechnung',
    url: 'https://de.wikipedia.org/wiki/Prozentrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const percent = pick(rng, [10, 20, 25, 50, 75, 5])
      const unit = pick(rng, ['€', 'kg', 'm', 'Liter'])
      const whole = pick(rng, [20, 40, 50, 60, 80, 100, 200])
      const value = roundTo((percent / 100) * whole, 2)
      return valueTask({
        question: `Wie viel sind ${percent} % von ${whole} ${unit}?`,
        unit,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} ${unit}`,
        explanation: `${percent} % = ${formatDe(percent / 100)}. Also ${formatDe(percent / 100)} · ${whole} ${unit} = ${formatDe(value)} ${unit}.`,
      })
    },
    (rng: Rng) => {
      const percent = pick(rng, [10, 20, 25, 50, 75])
      const unit = pick(rng, ['€', 'kg', 'Liter'])
      const whole = pick(rng, [40, 50, 80, 100, 200])
      const value = roundTo((percent / 100) * whole, 2)
      // Represent percent as fraction of 10 or 20 slices for a clean bar
      const denom = percent % 10 === 0 ? 10 : 4
      const num = Math.round((percent / 100) * denom)
      return visualTask({
        question: `Der Streifen zeigt ${percent} % von ${whole} ${unit}. Wie groß ist der eingefärbte Anteil?`,
        unit,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} ${unit}`,
        explanation: `${percent} % von ${whole} ${unit} = ${formatDe(value)} ${unit}.`,
        visualContent: generateFractionBarSvg({
          numerator: num,
          denominator: denom,
          showLabel: false,
        }),
      })
    },
    (rng: Rng) => {
      const percent = pick(rng, [25, 50, 75])
      const unit = pick(rng, ['€', 'kg', 'Liter'])
      const whole = pick(rng, [40, 80, 100, 200])
      const value = roundTo((percent / 100) * whole, 2)
      const denom = 4
      const num = percent / 25
      return visualTask({
        question: `Das Kreisdiagramm zeigt ${percent} % von ${whole} ${unit}. Wie groß ist der eingefärbte Anteil?`,
        unit,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} ${unit}`,
        explanation: `${percent} % · ${whole} = ${formatDe(value)} ${unit}.`,
        visualContent: generateFractionCircleSvg({
          numerator: num,
          denominator: denom,
          showLabel: false,
        }),
      })
    },
  ),
}

// Einheiten umrechnen — Klasse 6: Größen in Kommaschreibweise und gemischte Angaben.
const flaecheUmrechnen = conversionTopic('k6', FLAECHE, { decimalAmounts: true })
const laengeUmrechnen = conversionTopic('k6', LAENGE, { decimalAmounts: true })

// ---------------------------------------------------------------------------
// Grade — Klasse 6 (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse6: Grade = {
  id: 'klasse-6',
  title: 'Klasse 6',
  areas: [
    {
      id: 'lb1',
      title: 'Arbeiten mit gebrochenen Zahlen',
      ustd: 34,
      topics: [
        kuerzen,
        erweitern,
        vergleichen,
        addSubBrueche,
        multBrueche,
        divBrueche,
        bruchZuDezimal,
        prozentUmwandeln,
        dezAddSub,
        dezMult,
        dezDiv,
        runden,
        sachaufgabeBruch,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math6"].filter((x) => x.areaId === "lb1").map((x) => x.topic),
      ],
    },
    {
      id: 'lb2',
      title: 'Zuordnungen in der Umwelt',
      ustd: 24,
      topics: [proportional, antiproportional, haeufigkeit, sachaufgabeDreisatz,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math6"].filter((x) => x.areaId === "lb2").map((x) => x.topic),
      ],
    },
    {
      id: 'lb3',
      title: 'Dreiecke und Vierecke',
      ustd: 30,
      topics: [
        winkelDreieck,
        winkelViereck,
        umfangRechteck,
        flaecheRechteck,
        flaecheDreieck,
        kongruenzSatz,
        sachaufgabeGeometrie,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math6"].filter((x) => x.areaId === "lb3").map((x) => x.topic),
      ],
    },
    {
      id: 'lb4',
      title: 'Prismen',
      ustd: 12,
      topics: [volumenQuader, oberflaecheQuader, volumenPrisma, flaecheKanteQuader, wuerfelNetz,
        ...MATH_LEHRPLAN_TEILASPEKTE_BY_GRADE["math6"].filter((x) => x.areaId === "lb4").map((x) => x.topic),
      ],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Anteile',
      ustd: 4,
      topics: [anteilVonGroesse, anteilProzent, flaecheUmrechnen, laengeUmrechnen],
    },
  ],
}
