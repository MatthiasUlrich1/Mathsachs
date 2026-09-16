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
  generateRectangleSvg,
  generateRightTriangleSvg,
  generateTriangleAnglesSvg,
  generateTriangleSvg,
  generateValueTableSvg,
  type CubeNetKind,
} from '../lib/geometrySvg'
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

const kuerzen: Topic = {
  id: 'lb1-kuerzen',
  title: 'Brüche kürzen',
  hint: 'Gib den vollständig gekürzten Bruch ein.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Einen Bruch kürzen bedeutet, Zähler und Nenner durch denselben Teiler zu dividieren, ohne den Wert zu ändern. Ein Bruch ist vollständig gekürzt, wenn Zähler und Nenner keinen gemeinsamen Teiler außer 1 mehr besitzen. Den größten gemeinsamen Teiler (ggT) bestimmt man durch sukzessives Teilen oder Primfaktorzerlegung.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const base = makeFraction(randInt(rng, 1, 8), randInt(rng, 2, 9))
      const k = randInt(rng, 2, 6)
      const n = base.n * k
      const d = base.d * k
      const g = gcd(n, d)
      return fractionTask({
        question: `Kürze den Bruch ${n}/${d} vollständig.`,
        value: base,
        requireReduced: true,
        solution: `${base.n}/${base.d}`,
        explanation: `Zähler und Nenner haben den größten gemeinsamen Teiler ${g}. Teile beide durch ${g}: ${n} : ${g} = ${base.n} und ${d} : ${g} = ${base.d}, also ${base.n}/${base.d}.`,
      })
    },
    (rng: Rng) => {
      const base = makeFraction(randInt(rng, 1, 5), randInt(rng, 2, 8))
      const k = randInt(rng, 2, 4)
      const n = base.n * k
      const d = base.d * k
      const g = gcd(n, d)
      return {
        ...fractionTask({
          question: 'Welcher gekürzte Bruchanteil ist im Kreisdiagramm eingefärbt?',
          value: base,
          requireReduced: true,
          solution: `${base.n}/${base.d}`,
          explanation: `${n} von ${d} Teilen sind eingefärbt (= ${n}/${d}). Mit ggT ${g} gekürzt: ${base.n}/${base.d}.`,
        }),
        visualContent: generateFractionCircleSvg({ numerator: n, denominator: d }),
      }
    },
    (rng: Rng) => {
      const base = makeFraction(randInt(rng, 1, 5), randInt(rng, 2, 8))
      const k = randInt(rng, 2, 4)
      const n = base.n * k
      const d = base.d * k
      const g = gcd(n, d)
      return {
        ...fractionTask({
          question: 'Welcher gekürzte Bruchanteil ist im Balken eingefärbt?',
          value: base,
          requireReduced: true,
          solution: `${base.n}/${base.d}`,
          explanation: `${n} von ${d} Abschnitten sind eingefärbt (= ${n}/${d}). Mit ggT ${g} gekürzt: ${base.n}/${base.d}.`,
        }),
        visualContent: generateFractionBarSvg({ numerator: n, denominator: d }),
      }
    },
  ),
}

const erweitern: Topic = {
  id: 'lb1-erweitern',
  title: 'Brüche erweitern',
  hint: 'Gib den gesuchten Zähler ein.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Einen Bruch erweitern bedeutet, Zähler und Nenner mit derselben Zahl (≠ 0) zu multiplizieren. Der Wert des Bruchs ändert sich dabei nicht (man multipliziert mit k/k = 1). Erweitern wird benötigt, um Brüche auf einen gemeinsamen Nenner zu bringen und sie dadurch addieren oder vergleichen zu können.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: (rng: Rng) => {
    const n = randInt(rng, 1, 6)
    const d = randInt(rng, 2, 8)
    const k = randInt(rng, 2, 6)
    return valueTask({
      question: `Erweitere den Bruch ${n}/${d} auf den Nenner ${d * k}. Wie lautet der Zähler?`,
      answerKind: 'integer',
      value: n * k,
      solution: `${n * k}`,
      explanation: `Der Nenner wird mit ${k} multipliziert (${d} · ${k} = ${d * k}). Also muss auch der Zähler mit ${k} multipliziert werden: ${n} · ${k} = ${n * k}.`,
    })
  },
}

const vergleichen: Topic = {
  id: 'lb1-vergleichen',
  title: 'Brüche vergleichen',
  hint: 'Gib <, > oder = ein.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Um zwei Brüche zu vergleichen, bringt man sie auf einen gemeinsamen Nenner und vergleicht dann die Zähler. Das kleinste gemeinsame Vielfache (kgV) der Nenner ist der günstigste gemeinsame Nenner. Alternativ kann man beide Brüche in Dezimalzahlen umwandeln und dann vergleichen.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 1, 9), randInt(rng, 2, 9))
      const b = makeFraction(randInt(rng, 1, 9), randInt(rng, 2, 9))
      const cmp = a.n * b.d - b.n * a.d
      const symbol = cmp < 0 ? '<' : cmp > 0 ? '>' : '='
      const left = a.n * b.d
      const right = b.n * a.d
      return textTask({
        question: `Vergleiche: ${format(a)} ___ ${format(b)}`,
        accepted: [symbol],
        solution: symbol,
        explanation: `Bringe beide Brüche auf den gemeinsamen Nenner ${a.d * b.d}: ${format(a)} = ${left}/${a.d * b.d} und ${format(b)} = ${right}/${a.d * b.d}. Da ${left} ${symbol} ${right}, gilt ${format(a)} ${symbol} ${format(b)}.`,
      })
    },
    (rng: Rng) => {
      const a = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
      const b = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
      const cmp = a.n * b.d - b.n * a.d
      const symbol = cmp < 0 ? '<' : cmp > 0 ? '>' : '='
      return {
        ...textTask({
          question: 'Vergleiche die beiden dargestellten Bruchanteile. Gib <, > oder = ein.',
          accepted: [symbol],
          solution: symbol,
          explanation: `${format(a)} ${symbol} ${format(b)}, weil ${a.n * b.d} ${symbol} ${b.n * a.d} bei gemeinsamem Nenner ${a.d * b.d}.`,
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
    const a = makeFraction(randInt(rng, 1, 11), randInt(rng, 2, 12))
    const b = makeFraction(randInt(rng, 1, 11), randInt(rng, 2, 12))
    const result = multiply(a, b)
    return fractionTask({
      question: `Berechne: ${format(a)} · ${format(b)}`,
      value: result,
      solution: format(result),
      explanation: `Multipliziere Zähler mal Zähler und Nenner mal Nenner: (${a.n} · ${b.n}) / (${a.d} · ${b.d}) = ${a.n * b.n}/${a.d * b.d}. Gekürzt: ${format(result)}.`,
    })
  },
}

const divBrueche: Topic = {
  id: 'lb1-div-brueche',
  title: 'Brüche dividieren',
  hint: 'Dividieren heißt mit dem Kehrwert multiplizieren.',
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

const bruchZuDezimal: Topic = {
  id: 'lb1-bruch-dezimal',
  title: 'Brüche in Dezimalzahlen umwandeln',
  hint: 'Nutze das Komma als Dezimaltrennzeichen.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Jeden Bruch p/q kann man in eine Dezimalzahl umwandeln, indem man p durch q dividiert. Enthält der gekürzte Nenner nur die Primfaktoren 2 und 5, entsteht eine endliche Dezimalzahl (z. B. 3/4 = 0,75). Andernfalls entsteht eine periodische Dezimalzahl mit einem sich wiederholenden Block.',
    quelle: 'Wikipedia: Dezimalbruch',
    url: 'https://de.wikipedia.org/wiki/Dezimalbruch',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const denom = pick(rng, [2, 4, 5, 8, 10, 20, 25])
      const n = randInt(rng, 1, denom - 1)
      const f = makeFraction(n, denom)
      const value = toDecimal(f)
      return valueTask({
        question: `Wandle den Bruch ${format(f)} in eine Dezimalzahl um.`,
        answerKind: 'decimal',
        value,
        solution: formatDe(value),
        explanation: `${format(f)} bedeutet ${f.n} : ${f.d}. Erweitere auf einen Zehnerbruch oder dividiere: ${f.n} : ${f.d} = ${formatDe(value)}.`,
      })
    },
    (rng: Rng) => {
      const denom = pick(rng, [2, 4, 5, 8, 10])
      const n = randInt(rng, 1, denom - 1)
      const f = makeFraction(n, denom)
      const value = toDecimal(f)
      return numberLineTask({
        question: `Markiere den Wert von ${format(f)} auf dem Zahlenstrahl.`,
        min: 0,
        max: 1,
        step: 0.05,
        value,
        decimals: 2,
        solution: formatDe(value),
        explanation: `${format(f)} = ${f.n} : ${f.d} = ${formatDe(value)}.`,
        eps: 0.03,
      })
    },
    (rng: Rng) => {
      const denom = pick(rng, [4, 5, 8, 10])
      const n = randInt(rng, 1, denom - 1)
      const f = makeFraction(n, denom)
      const value = toDecimal(f)
      return {
        ...valueTask({
          question: 'Welcher Dezimalwert entspricht dem eingefärbten Anteil?',
          answerKind: 'decimal',
          value,
          solution: formatDe(value),
          explanation: `${n}/${denom} = ${formatDe(value)}.`,
        }),
        visualContent: generateFractionBarSvg({ numerator: n, denominator: denom }),
      }
    },
  ),
}

const prozentUmwandeln: Topic = {
  id: 'lb1-prozent',
  title: 'In Prozent umwandeln',
  hint: 'Gib nur die Zahl vor dem Prozentzeichen ein.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Prozent bedeutet „von Hundert" (lateinisch: per centum). Der Prozentsatz p% entspricht dem Bruch p/100 oder der Dezimalzahl p/100. Zur Umwandlung eines Bruchs in Prozent erweitert man auf den Nenner 100 oder multipliziert den Dezimalwert mit 100. Beispiel: 3/4 = 75/100 = 75 %.',
    quelle: 'Wikipedia: Prozentrechnung',
    url: 'https://de.wikipedia.org/wiki/Prozentrechnung',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const denom = pick(rng, [2, 4, 5, 10, 20, 25, 50])
      const n = randInt(rng, 1, denom - 1)
      const f = makeFraction(n, denom)
      const value = roundTo(toDecimal(f) * 100, 2)
      return valueTask({
        question: `Wie viel Prozent sind ${format(f)}?`,
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `Prozent bedeutet „von hundert". Erweitere ${format(f)} so, dass der Nenner 100 wird, oder rechne ${format(f)} · 100 = ${formatDe(value)} %.`,
      })
    },
    (rng: Rng) => {
      const value = randInt(rng, 1, 99)
      const dec = value / 100
      return valueTask({
        question: `Wie viel Prozent ist die Dezimalzahl ${formatDe(dec)}?`,
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${value} %`,
        explanation: `Multipliziere die Dezimalzahl mit 100: ${formatDe(dec)} · 100 = ${value} %.`,
      })
    },
    (rng: Rng) => {
      const denom = pick(rng, [4, 5, 8, 10, 20])
      const n = randInt(rng, 1, denom - 1)
      const value = roundTo((n / denom) * 100, 2)
      return visualTask({
        question: 'Wie viel Prozent des Kreises sind eingefärbt?',
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `${n} von ${denom} Sektoren = ${n}/${denom} = ${formatDe(value)} %.`,
        visualContent: generateFractionCircleSvg({ numerator: n, denominator: denom }),
      })
    },
    (rng: Rng) => {
      const denom = pick(rng, [4, 5, 8, 10, 20])
      const n = randInt(rng, 1, denom - 1)
      const value = roundTo((n / denom) * 100, 2)
      return visualTask({
        question: 'Wie viel Prozent des Streifens sind eingefärbt?',
        unit: '%',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} %`,
        explanation: `${n} von ${denom} Abschnitten = ${formatDe(value)} %.`,
        visualContent: generateFractionBarSvg({ numerator: n, denominator: denom }),
      })
    },
  ),
}

const dezAddSub: Topic = {
  id: 'lb1-dez-add-sub',
  title: 'Dezimalzahlen addieren und subtrahieren',
  hint: 'Achte auf die Ausrichtung des Kommas.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Dezimalzahlen werden addiert und subtrahiert, indem man sie kommagerecht untereinanderschreibt und stellenweise rechnet. Stellen hinter dem Komma (Zehntel, Hundertstel, …) folgen dem gleichen Prinzip wie ganze Stellen. Fehlende Dezimalstellen kann man mit Nullen auffüllen, ohne den Wert zu ändern.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 10, 999) / 10
    const b = randInt(rng, 10, 999) / 10
    const doAdd = rng() < 0.5 || a < b
    const value = roundTo(doAdd ? a + b : a - b, 2)
    const op = doAdd ? '+' : '−'
    return valueTask({
      question: `Berechne: ${formatDe(a)} ${op} ${formatDe(b)}`,
      answerKind: 'decimal',
      value,
      solution: formatDe(value),
      explanation: `Schreibe die Zahlen kommagerecht untereinander und rechne stellenweise: ${formatDe(a)} ${op} ${formatDe(b)} = ${formatDe(value)}.`,
    })
  },
}

const dezMult: Topic = {
  id: 'lb1-dez-mult',
  title: 'Dezimalzahlen multiplizieren',
  hint: 'Mit natürlichen Zahlen oder Zehnerpotenzen.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Dezimalzahlen werden wie natürliche Zahlen multipliziert; anschließend wird das Komma so gesetzt, dass die Gesamtanzahl der Nachkommastellen beider Faktoren stimmt. Beim Multiplizieren mit 10, 100, 1000 … verschiebt sich das Komma um 1, 2, 3 … Stellen nach rechts.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 11, 249) / 10
    const factor = pick(rng, [2, 3, 4, 5, 6, 10, 100])
    const value = roundTo(a * factor, 2)
    const tip =
      factor === 10 || factor === 100
        ? `Multiplizieren mit ${factor} verschiebt das Komma um ${factor === 10 ? 'eine' : 'zwei'} Stelle(n) nach rechts.`
        : `Rechne wie mit natürlichen Zahlen und setze am Ende das Komma richtig.`
    return valueTask({
      question: `Berechne: ${formatDe(a)} · ${factor}`,
      answerKind: 'decimal',
      value,
      solution: formatDe(value),
      explanation: `${tip} Ergebnis: ${formatDe(a)} · ${factor} = ${formatDe(value)}.`,
    })
  },
}

const dezDiv: Topic = {
  id: 'lb1-dez-div',
  title: 'Dezimalzahlen dividieren',
  hint: 'Durch natürliche Zahlen oder Zehnerpotenzen.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Beim Dividieren einer Dezimalzahl durch eine natürliche Zahl teilt man wie bei ganzen Zahlen und setzt das Komma im Ergebnis korrekt. Beim Dividieren durch 10, 100, 1000 … verschiebt sich das Komma um 1, 2, 3 … Stellen nach links.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: (rng: Rng) => {
    const divisor = pick(rng, [2, 4, 5, 10, 100])
    const quotient = randInt(rng, 11, 199) / 10
    const dividend = roundTo(quotient * divisor, 2)
    const tip =
      divisor === 10 || divisor === 100
        ? `Dividieren durch ${divisor} verschiebt das Komma um ${divisor === 10 ? 'eine' : 'zwei'} Stelle(n) nach links.`
        : `Teile wie bei natürlichen Zahlen und setze das Komma korrekt.`
    return valueTask({
      question: `Berechne: ${formatDe(dividend)} : ${divisor}`,
      answerKind: 'decimal',
      value: quotient,
      solution: formatDe(quotient),
      explanation: `${tip} Ergebnis: ${formatDe(dividend)} : ${divisor} = ${formatDe(quotient)}.`,
    })
  },
}

const runden: Topic = {
  id: 'lb1-runden',
  title: 'Dezimalzahlen runden',
  hint: 'Ist die nächste Ziffer 5 oder größer, wird aufgerundet.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Dezimalzahlen rundet man auf eine bestimmte Anzahl von Nachkommastellen. Entscheidend ist die Ziffer rechts der Rundungsstelle: Ist sie 0–4, bleibt die Rundungsstelle gleich; ist sie 5–9, wird aufgerundet. Runden auf zwei Dezimalstellen entspricht dem kaufmännischen Runden auf Cent-Beträge.',
    quelle: 'Wikipedia: Runden (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Runden_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const value = randInt(rng, 1000, 99999) / 1000
    const places = pick(rng, [0, 1, 2])
    const label = places === 0 ? 'ganze Zahl' : `${places} Nachkommastelle${places > 1 ? 'n' : ''}`
    const rounded = roundTo(value, places)
    return valueTask({
      question: `Runde ${formatDe(value)} auf ${places === 0 ? 'eine ganze Zahl' : label}.`,
      answerKind: 'decimal',
      value: rounded,
      eps: 1e-9,
      solution: formatDe(rounded),
      explanation: `Schau auf die Ziffer nach der ${places === 0 ? 'Einerstelle' : `${places}. Nachkommastelle`}. Ist sie 5 oder größer, wird aufgerundet, sonst abgerundet. ${formatDe(value)} ≈ ${formatDe(rounded)}.`,
    })
  },
}

// --- NEW: Sachaufgabe Bruchrechnung ------------------------------------------

const sachaufgabeBruch: Topic = {
  id: 'lb1-sachaufgabe-bruch',
  title: 'Sachaufgabe: Bruchrechnung im Alltag',
  hint: 'Lies die Aufgabe genau. Welcher Bruch wird gesucht? Dann rechne.',
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
  hint: 'Erst auf eine Einheit zurückrechnen.',
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
  hint: 'Mehr Personen → weniger Zeit. Produktgleichheit nutzen.',
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
  hint: 'Relative Häufigkeit = Anzahl : Gesamt.',
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
  hint: 'Zuerst den Einheitspreis oder -wert bestimmen, dann umrechnen.',
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
  hint: 'Die Innenwinkel im Dreieck ergeben zusammen 180°.',
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
  hint: 'Die Innenwinkel im Viereck ergeben zusammen 360°.',
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
  title: 'Umfang von Rechteck und Quadrat',
  hint: 'U = 2 · (a + b).',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Der Umfang eines Vielecks ist die Länge seiner Begrenzungslinie, also die Summe aller Seiten. Beim Rechteck: U = 2 · (a + b). Beim Quadrat: U = 4 · a. Der Umfang hat dieselbe Einheit wie die Seiten. Im Alltag wird der Umfang z. B. für Zaun- oder Rahmenlängen benötigt.',
    quelle: 'Wikipedia: Umfang (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Umfang_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const square = rng() < 0.35
      const a = randInt(rng, 4, 28)
      const b = square ? a : randInt(rng, 4, 28)
      const value = 2 * (a + b)
      return valueTask({
        question: square
          ? `Ein Quadrat hat die Seitenlänge ${a} cm. Berechne den Umfang.`
          : `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne den Umfang.`,
        unit: 'cm',
        answerKind: 'integer',
        value,
        solution: `${value} cm`,
        explanation: square
          ? `Umfang = 4 · ${a} cm = ${value} cm.`
          : `Umfang = 2 · (${a} + ${b}) cm = ${value} cm.`,
      })
    },
    (rng: Rng) => {
      const square = rng() < 0.35
      const a = randInt(rng, 4, 20)
      const b = square ? a : randInt(rng, 4, 20)
      const value = 2 * (a + b)
      return visualTask({
        question: square
          ? 'Berechne den Umfang des abgebildeten Quadrats:'
          : 'Berechne den Umfang des abgebildeten Rechtecks:',
        unit: 'cm',
        answerKind: 'integer',
        value,
        solution: `${value} cm`,
        explanation: square
          ? `Umfang = 4 · ${a} cm = ${value} cm.`
          : `Umfang = 2 · (${a} + ${b}) cm = ${value} cm.`,
        visualContent: generateRectangleSvg({
          widthLabel: `${a} cm`,
          heightLabel: `${b} cm`,
        }),
      })
    },
  ),
}

const flaecheRechteck: Topic = {
  id: 'lb3-flaeche-rechteck',
  title: 'Flächeninhalt von Rechteck und Quadrat',
  hint: 'A = a · b.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Der Flächeninhalt eines Rechtecks ist das Produkt aus Länge und Breite: A = a · b. Beim Quadrat gilt A = a². Flächeneinheiten sind Quadrate der Längeneinheiten: 1 m² = 10 000 cm². Der Flächeninhalt gibt an, wie viele Einheitsquadrate in eine Figur passen.',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const square = rng() < 0.35
      const a = randInt(rng, 4, 28)
      const b = square ? a : randInt(rng, 4, 28)
      const value = a * b
      return valueTask({
        question: square
          ? `Ein Quadrat hat die Seitenlänge ${a} cm. Berechne den Flächeninhalt.`
          : `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne den Flächeninhalt.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: square
          ? `Fläche = ${a} · ${a} = ${value} cm².`
          : `Fläche = ${a} · ${b} = ${value} cm².`,
      })
    },
    (rng: Rng) => {
      const square = rng() < 0.35
      const a = randInt(rng, 4, 18)
      const b = square ? a : randInt(rng, 4, 18)
      const value = a * b
      return visualTask({
        question: square
          ? 'Berechne den Flächeninhalt des abgebildeten Quadrats:'
          : 'Berechne den Flächeninhalt des abgebildeten Rechtecks:',
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: square
          ? `Fläche = ${a} · ${a} = ${value} cm².`
          : `Fläche = ${a} · ${b} = ${value} cm².`,
        visualContent: generateRectangleSvg({
          widthLabel: `${a} cm`,
          heightLabel: `${b} cm`,
        }),
      })
    },
  ),
}

const flaecheDreieck: Topic = {
  id: 'lb3-flaeche-dreieck',
  title: 'Flächeninhalt von Dreiecken',
  hint: 'A = (g · h) : 2.',
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
  hint: 'SSS, SWS, WSW oder SsW – welche Angabe reicht?',
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
          correct: 'SWS',
          desc: 'Zwei Seiten und der eingeschlossene Winkel sind bekannt.',
          why: 'Zwei Seiten mit dem Winkel dazwischen reichen (SWS).',
        },
        {
          correct: 'WSW',
          desc: 'Eine Seite und die beiden anliegenden Winkel sind bekannt.',
          why: 'Seite mit beiden anliegenden Winkeln reicht (WSW).',
        },
        {
          correct: 'SsW',
          desc: 'Zwei Seiten und der Gegenwinkel der längeren Seite sind bekannt.',
          why: 'Zwei Seiten und der Winkel gegenüber der größeren Seite (SsW).',
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
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 3, 8)
      const b = randInt(rng, 3, 8)
      return choicePickTask({
        question: 'Im rechtwinkligen Dreieck sind beide Katheten gegeben. Welcher Kongruenzsatz greift (inkl. rechter Winkel)?',
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
      })
    },
  ),
}

const wuerfelNetz: Topic = {
  id: 'lb4-wuerfelnetz',
  title: 'Würfelnetz erkennen',
  hint: 'Ein faltbares Netz hat sechs Quadrate ohne Überlappung beim Falten.',
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
    return choicePickTask({
      question: 'Welches der drei Netze lässt sich zu einem Würfel falten?',
      choices: ['A', 'B', 'C'],
      correct,
      solution: correct,
      explanation: `Nur Netz ${correct} ist ein gültiges Würfelnetz. Die anderen Anordnungen überlappen oder schließen sich nicht.`,
      visualContent: generateCubeNetChoicesSvg(options),
      instruction: 'Tippe den Buchstaben des faltbaren Netzes:',
    })
  },
}

/** Sachaufgabe Geometrie: Kombiniertes Flächen-/Umfang-Problem im Alltag. */
const sachaufgabeGeometrie: Topic = {
  id: 'lb3-sachaufgabe-geometrie',
  title: 'Sachaufgabe: Fläche und Umfang im Alltag',
  hint: 'Welche Formel passt? Umfang für Strecken, Fläche für Belag/Tapete.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sachaufgabe', 'Fläche', 'Umfang', 'Dreieck', 'Rechteck', 'Alltag'],
  fachwissen: {
    text: 'Bei Sachaufgaben zur Geometrie ist es wichtig, zwischen Umfang (Länge der Begrenzung) und Flächeninhalt (Größe der Fläche) zu unterscheiden. Für zusammengesetzte Figuren addiert man Teilflächen oder Teilstrecken. Beim Lösen: zuerst die Skizze, dann die passende Formel, dann die Rechnung mit Einheiten.',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 4, 18)
    const b = randInt(rng, 4, 18)
    const type = pick(rng, ['zaun', 'boden', 'dreieck-garten'])

    if (type === 'zaun') {
      const wert = 2 * (a + b)
      return valueTask({
        question: `Ein rechteckiges Blumenbeet ist ${a} m lang und ${b} m breit. Wie viel Meter Beeteinfassung wird benötigt?`,
        unit: 'm',
        answerKind: 'integer',
        value: wert,
        solution: `${wert} m`,
        explanation: `Umfang = 2 · (${a} + ${b}) = 2 · ${a + b} = ${wert} m.`,
      })
    }
    if (type === 'boden') {
      const wert = a * b
      return valueTask({
        question: `Ein Zimmer ist ${a} m lang und ${b} m breit. Wie viele m² Laminat werden benötigt?`,
        unit: 'm²',
        answerKind: 'integer',
        value: wert,
        solution: `${wert} m²`,
        explanation: `Fläche = ${a} · ${b} = ${wert} m².`,
      })
    }
    // Dreieck: Grundlinie und Höhe im Alltag
    const g2 = a
    const h2 = b
    const flaeche = roundTo((g2 * h2) / 2, 1)
    return valueTask({
      question: `Ein dreieckiges Rabatten-Beet hat die Grundseite ${g2} m und die Höhe ${h2} m. Wie groß ist seine Fläche?`,
      unit: 'm²',
      answerKind: 'decimal',
      value: flaeche,
      solution: `${formatDe(flaeche)} m²`,
      explanation: `Dreiecks-Fläche = (Grundseite · Höhe) : 2 = (${g2} · ${h2}) : 2 = ${formatDe(flaeche)} m².`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Prismen
// ---------------------------------------------------------------------------

const volumenQuader: Topic = {
  id: 'lb4-volumen-quader',
  title: 'Volumen von Quader und Würfel',
  hint: 'V = a · b · c.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Das Volumen eines Quaders berechnet sich als Produkt der drei Kantenlängen: V = a · b · c. Ein Würfel ist ein Sonderfall des Quaders mit a = b = c, daher V = a³. Volumeneinheiten: 1 m³ = 1 000 dm³ (Liter) = 1 000 000 cm³.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const cube = rng() < 0.3
      const a = randInt(rng, 4, 25)
      const b = cube ? a : randInt(rng, 3, 20)
      const c = cube ? a : randInt(rng, 3, 18)
      const value = a * b * c
      return valueTask({
        question: cube
          ? `Ein Würfel hat die Kantenlänge ${a} cm. Berechne sein Volumen.`
          : `Ein Quader ist ${a} cm, ${b} cm und ${c} cm groß. Berechne sein Volumen.`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: cube
          ? `Volumen = ${a} · ${a} · ${a} = ${value} cm³.`
          : `Volumen = Länge · Breite · Höhe = ${a} · ${b} · ${c} cm³ = ${value} cm³.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 5, 18)
      const b = randInt(rng, 4, 16)
      const c = randInt(rng, 3, 14)
      const value = a * b * c
      return visualTask({
        question: 'Berechne das Volumen des abgebildeten Quaders:',
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Volumen = Länge · Breite · Höhe = ${a} · ${b} · ${c} cm³ = ${value} cm³.`,
        visualContent: generateCuboidSvg({
          lengthLabel: `${a} cm`,
          widthLabel: `${b} cm`,
          heightLabel: `${c} cm`,
        }),
      })
    },
    (rng: Rng) => {
      // Decimal edge lengths (K6 vs K5)
      const a = pick(rng, [2.5, 3.5, 4.5, 5.5, 6.5])
      const b = pick(rng, [2, 2.5, 3, 3.5, 4])
      const c = pick(rng, [1.5, 2, 2.5, 3])
      const value = roundTo(a * b * c, 2)
      return valueTask({
        question: `Ein Quader ist ${formatDe(a)} dm, ${formatDe(b)} dm und ${formatDe(c)} dm groß. Berechne sein Volumen in dm³.`,
        unit: 'dm³',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} dm³`,
        explanation: `V = ${formatDe(a)} · ${formatDe(b)} · ${formatDe(c)} = ${formatDe(value)} dm³.`,
      })
    },
  ),
}

const oberflaecheQuader: Topic = {
  id: 'lb4-oberflaeche-quader',
  title: 'Oberflächeninhalt von Quadern',
  hint: 'O = 2 · (a·b + a·c + b·c).',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Die Oberfläche eines Quaders ist die Summe aller sechs Seitenflächen. Ein Quader hat drei Paare gleich großer Flächen: 2 · (a · b + a · c + b · c). Die Oberfläche gibt an, wie viel Material man für eine Verpackung oder eine Holzkiste benötigt.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 4, 20)
      const b = randInt(rng, 3, 18)
      const c = randInt(rng, 2, 15)
      const value = 2 * (a * b + a * c + b * c)
      return valueTask({
        question: `Ein Quader ist ${a} cm, ${b} cm und ${c} cm groß. Berechne seinen Oberflächeninhalt.`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Oberfläche = 2 · (a·b + a·c + b·c) = 2 · (${a * b} + ${a * c} + ${b * c}) cm² = 2 · ${
          a * b + a * c + b * c
        } cm² = ${value} cm².`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 4, 14)
      const b = randInt(rng, 3, 12)
      const c = randInt(rng, 3, 12)
      const value = 2 * (a * b + a * c + b * c)
      return visualTask({
        question: 'Berechne die Oberfläche des abgebildeten Quaders:',
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Oberfläche = 2 · (a·b + a·c + b·c) = 2 · (${a * b} + ${a * c} + ${b * c}) cm² = ${value} cm².`,
        visualContent: generateCuboidSvg({
          lengthLabel: `${a} cm`,
          widthLabel: `${b} cm`,
          heightLabel: `${c} cm`,
        }),
      })
    },
  ),
}

const volumenPrisma: Topic = {
  id: 'lb4-volumen-prisma',
  title: 'Volumen gerader Prismen',
  hint: 'V = Grundfläche · Höhe.',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Das Volumen eines geraden Prismas (und damit auch eines Zylinders) berechnet sich als V = G · h, wobei G der Flächeninhalt der Grundfläche und h die Höhe des Prismas ist. Diese Formel gilt für alle Prismen, unabhängig von der Form der Grundfläche (Dreieck, Viereck, Sechseck …).',
    quelle: 'Wikipedia: Prisma (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Prisma_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const grund = randInt(rng, 12, 96)
      const hoehe = randInt(rng, 4, 28)
      const value = grund * hoehe
      return valueTask({
        question: `Ein gerades Prisma hat die Grundfläche ${grund} cm² und die Höhe ${hoehe} cm. Berechne sein Volumen.`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Volumen eines Prismas = Grundfläche · Höhe = ${grund} cm² · ${hoehe} cm = ${value} cm³.`,
      })
    },
    (rng: Rng) => {
      const grund = randInt(rng, 15, 80)
      const hoehe = randInt(rng, 5, 24)
      const value = grund * hoehe
      return visualTask({
        question: 'Berechne das Volumen des abgebildeten Prismas (Grundfläche gegeben):',
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Volumen = Grundfläche · Höhe = ${grund} cm² · ${hoehe} cm = ${value} cm³.`,
        visualContent: generatePrismVolumeSvg({
          baseAreaLabel: `${grund} cm²`,
          heightLabel: `${hoehe} cm`,
        }),
      })
    },
    (rng: Rng) => {
      const grund = pick(rng, [12.5, 18.5, 24.5, 32.5, 45.5])
      const hoehe = pick(rng, [3.5, 4.5, 5.5, 6.5, 8])
      const value = roundTo(grund * hoehe, 2)
      return visualTask({
        question: 'Berechne das Volumen (Dezimalmaße, Grundfläche gegeben):',
        unit: 'cm³',
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} cm³`,
        explanation: `V = ${formatDe(grund)} · ${formatDe(hoehe)} = ${formatDe(value)} cm³.`,
        visualContent: generatePrismVolumeSvg({
          baseAreaLabel: `${formatDe(grund)} cm²`,
          heightLabel: `${formatDe(hoehe)} cm`,
        }),
      })
    },
  ),
}

/** Volumen ↔ Fläche × Höhe (2D + 1D = 3D). Nur für Entwickler-Freigabe. */
const flaecheKanteQuader: Topic = {
  id: 'lb4-flaeche-kante-quader',
  title: 'Fläche und senkrechte Seitenlänge',
  hint: 'Volumen = Fläche · dazu senkrechte Länge (2D · 1D = 3D): V = G · h, also G = V : h und h = V : G.',
  pointsPerTask: 10,
  difficulty: 2,
  released: false,
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
  hint: 'Anteil = Bruch · Ganzes.',
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
      return valueTask({
        question: `Berechne ${n}/${d} von ${whole} ${unit}.`,
        unit,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} ${unit}`,
        explanation: `Teile durch den Nenner und multipliziere mit dem Zähler: ${whole} : ${d} = ${whole / d}, dann · ${n} = ${formatDe(value)} ${unit}.`,
      })
    },
    (rng: Rng) => {
      const d = pick(rng, [2, 4, 5, 8, 10])
      const n = randInt(rng, 1, d - 1)
      const unit = pick(rng, ['kg', 'm', '€', 'Liter'])
      const whole = d * randInt(rng, 2, 10)
      const value = (n / d) * whole
      return visualTask({
        question: `Der Streifen zeigt den Anteil von ${whole} ${unit}. Wie groß ist der eingefärbte Anteil?`,
        unit,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} ${unit}`,
        explanation: `${n}/${d} von ${whole} ${unit} = ${formatDe(value)} ${unit}.`,
        visualContent: generateFractionBarSvg({
          numerator: n,
          denominator: d,
          showLabel: true,
        }),
      })
    },
    (rng: Rng) => {
      const d = pick(rng, [4, 5, 8, 10])
      const n = randInt(rng, 1, d - 1)
      const unit = pick(rng, ['kg', '€', 'Liter'])
      const whole = d * randInt(rng, 3, 12)
      const value = (n / d) * whole
      return visualTask({
        question: `Das Kreisdiagramm zeigt den Anteil von ${whole} ${unit}. Wie groß ist der eingefärbte Anteil?`,
        unit,
        answerKind: 'decimal',
        value,
        solution: `${formatDe(value)} ${unit}`,
        explanation: `${n}/${d} · ${whole} = ${formatDe(value)} ${unit}.`,
        visualContent: generateFractionCircleSvg({
          numerator: n,
          denominator: d,
          showLabel: true,
        }),
      })
    },
  ),
}

const anteilProzent: Topic = {
  id: 'lb5-anteil-prozent',
  title: 'Prozent einer Größe berechnen',
  hint: 'Prozent bedeutet „von hundert".',
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
          showLabel: true,
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
          showLabel: true,
        }),
      })
    },
  ),
}

// Einheiten umrechnen — in Klasse 6 mit Schwerpunkt auf Flächeneinheiten.
const flaecheUmrechnen = conversionTopic('k6', FLAECHE)
const laengeUmrechnen = conversionTopic('k6', LAENGE)

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
      ],
    },
    {
      id: 'lb2',
      title: 'Zuordnungen in der Umwelt',
      ustd: 24,
      topics: [proportional, antiproportional, haeufigkeit, sachaufgabeDreisatz],
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
      ],
    },
    {
      id: 'lb4',
      title: 'Prismen',
      ustd: 12,
      topics: [volumenQuader, oberflaecheQuader, volumenPrisma, flaecheKanteQuader, wuerfelNetz],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Anteile',
      ustd: 4,
      topics: [anteilVonGroesse, anteilProzent, flaecheUmrechnen, laengeUmrechnen],
    },
  ],
}
