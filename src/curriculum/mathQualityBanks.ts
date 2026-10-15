/**
 * Themenreine Mathe-Generatoren (Rechnung/MC) — K5/K6 altersgerecht.
 * Kein TF, keine Zuordnung, keine Lücken. Kein released:true.
 */
import { gcd, makeFraction } from '../lib/fraction'
import { formatDe } from '../lib/num'
import { pick, randInt, type Rng } from '../lib/rng'
import { appliedMc, shuffleArr } from './mathApplied'
import { fractionTask, mixedVariants, multiSelectTask, valueTask } from './taskHelpers'
import type { Fachwissen, Topic } from './types'

const wiki = (text: string, title: string, slug: string): Fachwissen => ({
  text,
  quelle: `Wikipedia: ${title}`,
  url: `https://de.wikipedia.org/wiki/${slug}`,
})

/** Zahl mit Tausender-Leerzeichen (deutsche Schreibweise großer Zahlen). */
const big = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

// ---------------------------------------------------------------------------
// K5: Rechengesetze und Rechenvorteile
// ---------------------------------------------------------------------------

const FW_ASSOZ = wiki(
  'Kommutativgesetz (a · b = b · a) und Assoziativgesetz ((a · b) · c = a · (b · c)) erlauben, Faktoren beliebig zu vertauschen und zu gruppieren. Günstige Paare wie 4 · 25 = 100 oder 2 · 50 = 100 vereinfachen das Rechnen.',
  'Assoziativgesetz',
  'Assoziativgesetz',
)
const FW_DISTRIB = wiki(
  'Distributivgesetz: a · (b + c) = a · b + a · c bzw. a · (b − c) = a · b − a · c. Beide Terme haben denselben Wert. So kann man einen gemeinsamen Faktor ausklammern oder eine Zahl zerlegen (z. B. 98 = 100 − 2) und vorteilhaft rechnen.',
  'Distributivgesetz',
  'Distributivgesetz',
)
const FW_REIHENFOLGE = wiki(
  'Reihenfolge beim Rechnen: zuerst Klammern, dann Punktrechnung (· und :), zuletzt Strichrechnung (+ und −). Gleichrangige Rechenarten rechnet man von links nach rechts.',
  'Operatorrangfolge',
  'Operatorrangfolge',
)

export const generateRechengesetzeK5: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const [p, q] = pick(rng, [
      [4, 25],
      [2, 50],
      [5, 20],
      [8, 125],
      [4, 250],
    ] as Array<[number, number]>)
    const m = randInt(rng, 7, 99)
    const order = shuffleArr(rng, [p, m, q])
    const value = p * q * m
    return valueTask({
      question: `Berechne geschickt: ${order.join(' · ')}`,
      answerKind: 'integer',
      value,
      solution: big(value),
      explanation: `Vertauschen und zusammenfassen: (${p} · ${q}) · ${m} = ${p * q} · ${m} = ${big(value)}.`,
      fachwissen: FW_ASSOZ,
      dedupeKey: `ma:k5:gesetze:assoz:${order.join(',')}`,
    })
  },
  (rng: Rng) => {
    const a = randInt(rng, 12, 48)
    const b = randInt(rng, 11, 89)
    const total = pick(rng, [100, 100, 1000])
    const c = total - b
    const value = a * total
    return valueTask({
      question: `Berechne geschickt: ${a} · ${b} + ${a} · ${c}`,
      answerKind: 'integer',
      value,
      solution: big(value),
      explanation: `${a} ausklammern: ${a} · (${b} + ${c}) = ${a} · ${total} = ${big(value)}.`,
      fachwissen: FW_DISTRIB,
      dedupeKey: `ma:k5:gesetze:aus:${a}:${b}:${c}`,
    })
  },
  (rng: Rng) => {
    const a = randInt(rng, 3, 19)
    const round = pick(rng, [100, 1000])
    const d = randInt(rng, 1, 4)
    const minus = rng() < 0.6
    const n = minus ? round - d : round + d
    const value = a * n
    return valueTask({
      question: `Berechne im Kopf: ${a} · ${n}`,
      answerKind: 'integer',
      value,
      solution: big(value),
      explanation: `${n} = ${round} ${minus ? '−' : '+'} ${d}: ${a} · ${round} ${minus ? '−' : '+'} ${a} · ${d} = ${big(a * round)} ${minus ? '−' : '+'} ${a * d} = ${big(value)}.`,
      fachwissen: FW_DISTRIB,
      dedupeKey: `ma:k5:gesetze:zerl:${a}:${n}`,
    })
  },
  (rng: Rng) => {
    for (;;) {
      const a = randInt(rng, 40, 200)
      const b = randInt(rng, 2, 9)
      const c = randInt(rng, 2, 12)
      const d = randInt(rng, 1, 9)
      const e = pick(rng, [2, 3, 4, 5])
      const inner = c + d
      if ((b * inner) % e !== 0) continue
      const value = a - (b * inner) / e
      if (value < 0) continue
      return valueTask({
        question: `Berechne: ${a} − ${b} · (${c} + ${d}) : ${e}`,
        answerKind: 'integer',
        value,
        solution: String(value),
        explanation: `Klammer: ${c} + ${d} = ${inner}. Punktrechnung von links: ${b} · ${inner} = ${b * inner}, ${b * inner} : ${e} = ${(b * inner) / e}. Strich: ${a} − ${(b * inner) / e} = ${value}.`,
        fachwissen: FW_REIHENFOLGE,
        dedupeKey: `ma:k5:gesetze:reihe:${a}:${b}:${c}:${d}:${e}`,
      })
    }
  },
  (rng: Rng) => {
    for (;;) {
      const a = randInt(rng, 3, 9)
      const b = 10 * randInt(rng, 2, 9)
      const c = randInt(rng, 2, 9)
      const target = a * (b + c)
      const cands: Array<[string, number]> = [
        [`${a} · ${b} + ${c}`, a * b + c],
        [`${a} + ${b} · ${c}`, a + b * c],
        [`(${a} + ${b}) · ${c}`, (a + b) * c],
        [`${a} · ${b} + ${b} · ${c}`, a * b + b * c],
      ]
      const wrong = cands.filter(([, v]) => v !== target).map(([s]) => s)
      if (wrong.length < 3) continue
      return appliedMc(rng, {
        question: `Welcher Term hat denselben Wert wie ${a} · (${b} + ${c})?`,
        correct: `${a} · ${b} + ${a} · ${c}`,
        distractors: wrong,
        explanation: `Distributivgesetz: Jeder Summand in der Klammer wird mit ${a} multipliziert: ${a} · ${b} + ${a} · ${c} = ${a * b} + ${a * c} = ${target}.`,
        fachwissen: FW_DISTRIB,
        dedupeKey: `ma:k5:gesetze:termmc:${a}:${b}:${c}`,
      })
    }
  },
)

// ---------------------------------------------------------------------------
// K6: Endliche und periodische Dezimalzahlen
// ---------------------------------------------------------------------------

const FW_ENDLICH = wiki(
  'Ein vollständig gekürzter Bruch ergibt genau dann eine endliche Dezimalzahl, wenn sein Nenner nur die Primfaktoren 2 und 5 enthält. Kommt ein anderer Primfaktor vor (z. B. 3, 7 oder 11), ist die Dezimalzahl periodisch.',
  'Dezimalbruch',
  'Dezimalbruch',
)
const FW_PERIODE = wiki(
  'Reinperiodische Dezimalzahlen lassen sich direkt als Bruch schreiben: 0,aaa… = a/9 und 0,abab… = ab/99. Anschließend kürzt man, falls möglich.',
  'Periodische Dezimalzahl',
  'Periodische_Dezimalzahl',
)

const FINITE_DENOMS = [2, 4, 5, 8, 10, 16, 20, 25, 40, 50]
const PERIOD_DENOMS = [3, 6, 7, 9, 11, 12, 15, 18]

const reducedNumerator = (rng: Rng, d: number): number => {
  for (;;) {
    const n = randInt(rng, 1, d - 1)
    if (gcd(n, d) === 1) return n
  }
}

export const generatePeriodischeDezimalK6: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const d = pick(rng, [8, 16, 20, 25, 40, 50])
    const n = reducedNumerator(rng, d)
    const value = n / d
    return valueTask({
      question: `Schreibe den Bruch ${n}/${d} als endliche Dezimalzahl.`,
      answerKind: 'decimal',
      value,
      solution: formatDe(value),
      explanation: `${n} : ${d} = ${formatDe(value)}. Der Nenner ${d} enthält nur die Primfaktoren 2 und 5, darum bricht die Division ab.`,
      fachwissen: FW_ENDLICH,
      dedupeKey: `ma:k6:period:wert:${n}/${d}`,
    })
  },
  (rng: Rng) => {
    const pd = pick(rng, PERIOD_DENOMS)
    const per = `${reducedNumerator(rng, pd)}/${pd}`
    const fins = new Set<string>()
    while (fins.size < 3) {
      const d = pick(rng, FINITE_DENOMS)
      fins.add(`${reducedNumerator(rng, d)}/${d}`)
    }
    return appliedMc(rng, {
      question: 'Welcher dieser Brüche ergibt eine periodische Dezimalzahl?',
      correct: per,
      distractors: [...fins],
      explanation: `${per}: Der Nenner ${pd} enthält einen Primfaktor außer 2 und 5, deshalb ist die Dezimalzahl periodisch. Die Nenner der anderen Brüche bestehen nur aus 2 und 5.`,
      fachwissen: FW_ENDLICH,
      dedupeKey: `ma:k6:period:mc:${per}:${[...fins].sort().join(',')}`,
    })
  },
  (rng: Rng) => {
    const fracs = new Map<string, boolean>()
    const want = randInt(rng, 2, 3)
    while (fracs.size < 6) {
      const finite = [...fracs.values()].filter(Boolean).length < want
      const d = finite ? pick(rng, FINITE_DENOMS) : pick(rng, PERIOD_DENOMS)
      fracs.set(`${reducedNumerator(rng, d)}/${d}`, finite)
    }
    const all = shuffleArr(rng, [...fracs.keys()])
    const good = all.filter((f) => fracs.get(f))
    return multiSelectTask({
      question: 'Tippe alle Brüche an, die eine endliche Dezimalzahl ergeben.',
      choices: all,
      correct: good,
      solution: good.join(', '),
      explanation: `Endlich sind die Brüche, deren (gekürzter) Nenner nur 2 und 5 als Primfaktoren hat: ${good.join(', ')}.`,
      instruction: 'Tippe alle zutreffenden Brüche an:',
      fachwissen: FW_ENDLICH,
      dedupeKey: `ma:k6:period:multi:${[...all].sort().join(',')}`,
    })
  },
  (rng: Rng) => {
    const two = rng() < 0.5
    const digits = two ? randInt(rng, 10, 98) : randInt(rng, 1, 8)
    if (two && digits % 11 === 0) return generatePeriodischeDezimalK6(rng)
    const den = two ? 99 : 9
    const f = makeFraction(digits, den)
    const shown = two ? `0,${digits}${digits}${digits}…` : `0,${digits}${digits}${digits}${digits}…`
    return fractionTask({
      question: `Schreibe die periodische Dezimalzahl ${shown} als vollständig gekürzten Bruch.`,
      value: f,
      requireReduced: true,
      solution: `${f.n}/${f.d}`,
      explanation: `Periode ${digits} mit ${two ? 'zwei Ziffern' : 'einer Ziffer'}: ${shown} = ${digits}/${den}${f.d !== den ? ` = ${f.n}/${f.d}` : ''}.`,
      fachwissen: FW_PERIODE,
      dedupeKey: `ma:k6:period:bruch:${digits}:${den}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K5: Große natürliche Zahlen vergleichen und ordnen
// ---------------------------------------------------------------------------

const FW_STELLEN = wiki(
  'Natürliche Zahlen vergleicht man stellenweise von links: Bei gleicher Stellenzahl entscheidet die erste Stelle, an der sich die Ziffern unterscheiden. Mehr Stellen bedeuten (ohne führende Nullen) eine größere Zahl.',
  'Stellenwertsystem',
  'Stellenwertsystem',
)

export const generateVergleichenOrdnenK5: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const digits = shuffleArr(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, randInt(rng, 6, 7))
    const toNum = (arr: number[]) => Number(arr.join(''))
    const nums = new Set<number>()
    while (nums.size < 4) {
      const arr = shuffleArr(rng, digits)
      if (arr[0] === 0) continue
      nums.add(toNum(arr))
    }
    const list = [...nums]
    const askMax = rng() < 0.5
    const target = askMax ? Math.max(...list) : Math.min(...list)
    return appliedMc(rng, {
      question: `Welche Zahl ist am ${askMax ? 'größten' : 'kleinsten'}?`,
      correct: big(target),
      distractors: list.filter((n) => n !== target).map(big),
      explanation: `Alle Zahlen haben gleich viele Stellen. Man vergleicht von links: ${big(target)} hat an der ersten unterschiedlichen Stelle die ${askMax ? 'größte' : 'kleinste'} Ziffer.`,
      fachwissen: FW_STELLEN,
      dedupeKey: `ma:k5:vgl:mc:${[...list].sort().join(',')}:${askMax}`,
    })
  },
  (rng: Rng) => {
    const digits = shuffleArr(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6)
    const asc = [...digits].sort((a, b) => a - b)
    const askMax = rng() < 0.5
    let arr: number[]
    if (askMax) arr = [...asc].reverse()
    else {
      arr = [...asc]
      if (arr[0] === 0) [arr[0], arr[1]] = [arr[1]!, arr[0]!]
    }
    const value = Number(arr.join(''))
    return valueTask({
      question: `Bilde aus den Ziffern ${digits.join(', ')} (jede genau einmal) die ${askMax ? 'größte' : 'kleinste'} sechsstellige Zahl.`,
      answerKind: 'integer',
      value,
      solution: big(value),
      explanation: askMax
        ? `Die größte Ziffer kommt an die höchste Stelle: ${big(value)}.`
        : `Die kleinste Ziffer kommt nach vorn${asc[0] === 0 ? ', aber nicht die 0 (sonst wäre die Zahl nur fünfstellig)' : ''}: ${big(value)}.`,
      fachwissen: FW_STELLEN,
      dedupeKey: `ma:k5:vgl:ziffern:${[...digits].sort().join('')}:${askMax}`,
    })
  },
  (rng: Rng) => {
    const step = pick(rng, [1000, 10000, 100000])
    const k = randInt(rng, 2, 98)
    const base = k * step
    const vor = rng() < 0.5
    const value = vor ? base - 1 : base + 1
    return valueTask({
      question: `Gib den ${vor ? 'Vorgänger' : 'Nachfolger'} von ${big(base)} an.`,
      answerKind: 'integer',
      value,
      solution: big(value),
      explanation: `${vor ? 'Vorgänger: eins weniger' : 'Nachfolger: eins mehr'}: ${big(base)} ${vor ? '−' : '+'} 1 = ${big(value)}.`,
      fachwissen: FW_STELLEN,
      dedupeKey: `ma:k5:vgl:nachbar:${base}:${vor}`,
    })
  },
  (rng: Rng) => {
    const step = pick(rng, [1000, 10000, 100000, 1000000])
    const n = randInt(rng, 11, 99) * step + randInt(rng, 1, step - 1)
    const unit = step === 1000 ? 'Tausender' : step === 10000 ? 'Zehntausender' : step === 100000 ? 'Hunderttausender' : 'Millionen'
    const lower = Math.floor(n / step) * step
    const upper = lower + step
    const askUpper = rng() < 0.5
    return valueTask({
      question: `Zwischen welchen beiden benachbarten ${unit}zahlen liegt ${big(n)}? Gib die ${askUpper ? 'größere' : 'kleinere'} an.`,
      answerKind: 'integer',
      value: askUpper ? upper : lower,
      solution: big(askUpper ? upper : lower),
      explanation: `${big(lower)} < ${big(n)} < ${big(upper)}.`,
      fachwissen: FW_STELLEN,
      dedupeKey: `ma:k5:vgl:zwischen:${n}:${askUpper}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K5: Primfaktorzerlegung
// ---------------------------------------------------------------------------

const FW_PRIMFAKTOR = wiki(
  'Jede natürliche Zahl größer als 1 lässt sich eindeutig als Produkt von Primzahlen schreiben (Primfaktorzerlegung). Man teilt dazu so lange durch die kleinste passende Primzahl, bis 1 übrig bleibt.',
  'Primfaktorzerlegung',
  'Primfaktorzerlegung',
)

const randomFactors = (rng: Rng): number[] => {
  for (;;) {
    const k = randInt(rng, 3, 5)
    const fs = Array.from({ length: k }, () => pick(rng, [2, 2, 2, 3, 3, 5, 7, 11, 13])).sort((a, b) => a - b)
    const n = fs.reduce((p, x) => p * x, 1)
    if (n >= 24 && n <= 1000) return fs
  }
}

export const generatePrimfaktorK5: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const fs = randomFactors(rng)
    const n = fs.reduce((p, x) => p * x, 1)
    const show = (arr: number[]) => [...arr].sort((a, b) => a - b).join(' · ')
    const wrong = [
      [...fs.slice(1), fs[0] === 2 ? 3 : 2],
      fs.slice(1),
      [...fs, 2],
      fs.map((x, i) => (i === fs.length - 1 ? x + 2 : x)),
    ].filter((w) => w.reduce((p, x) => p * x, 1) !== n)
    return appliedMc(rng, {
      question: `Wie lautet die Primfaktorzerlegung von ${n}?`,
      correct: show(fs),
      distractors: wrong.map(show),
      explanation: `${n} = ${show(fs)}. Probe: Das Produkt ergibt ${n}, und alle Faktoren sind Primzahlen.`,
      fachwissen: FW_PRIMFAKTOR,
      dedupeKey: `ma:k5:prim:mc:${n}`,
    })
  },
  (rng: Rng) => {
    const fs = randomFactors(rng)
    const n = fs.reduce((p, x) => p * x, 1)
    return valueTask({
      question: `Die Primfaktorzerlegung einer Zahl lautet ${fs.join(' · ')}. Wie heißt die Zahl?`,
      answerKind: 'integer',
      value: n,
      solution: String(n),
      explanation: `${fs.join(' · ')} = ${n}.`,
      fachwissen: FW_PRIMFAKTOR,
      dedupeKey: `ma:k5:prim:produkt:${fs.join('.')}`,
    })
  },
  (rng: Rng) => {
    const fs = randomFactors(rng)
    const n = fs.reduce((p, x) => p * x, 1)
    const max = Math.max(...fs)
    return valueTask({
      question: `Welches ist der größte Primfaktor von ${n}?`,
      answerKind: 'integer',
      value: max,
      solution: String(max),
      explanation: `${n} = ${fs.join(' · ')}. Der größte Primfaktor ist ${max}.`,
      fachwissen: FW_PRIMFAKTOR,
      dedupeKey: `ma:k5:prim:max:${n}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K5: Echte und unechte Brüche, gemischte Zahlen
// ---------------------------------------------------------------------------

const FW_GEMISCHT = wiki(
  'Ein Bruch ist echt, wenn der Zähler kleiner als der Nenner ist (Wert kleiner als 1), sonst unecht. Unechte Brüche kann man als gemischte Zahl schreiben: 11/4 = 2 3/4, denn 11 : 4 = 2 Rest 3. Rückwärts: 2 3/4 = (2 · 4 + 3)/4.',
  'Bruchrechnung',
  'Bruchrechnung',
)

export const generateEchteUnechteBruecheK5: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const d = randInt(rng, 2, 12)
    const whole = randInt(rng, 1, 9)
    const r = reducedNumerator(rng, d)
    const n = whole * d + r
    return fractionTask({
      question: `Schreibe die gemischte Zahl ${whole} ${r}/${d} als unechten Bruch.`,
      value: { n, d },
      solution: `${n}/${d}`,
      explanation: `${whole} Ganze = ${whole * d}/${d}. Dazu ${r}/${d}: ${whole * d + r}/${d}.`,
      fachwissen: FW_GEMISCHT,
      dedupeKey: `ma:k5:echt:zuunecht:${whole}:${r}:${d}`,
    })
  },
  (rng: Rng) => {
    const d = randInt(rng, 3, 12)
    const whole = randInt(rng, 1, 9)
    const r = reducedNumerator(rng, d)
    const n = whole * d + r
    const mixed = (w: number, z: number) => `${w} ${z}/${d}`
    return appliedMc(rng, {
      question: `Welche gemischte Zahl ist gleich ${n}/${d}?`,
      correct: mixed(whole, r),
      distractors: [
        r > 1 ? mixed(whole, r - 1) : mixed(whole, r + 1),
        mixed(whole + 1, r),
        whole > 1 ? mixed(whole - 1, r) : mixed(whole + 2, r),
      ],
      explanation: `${n} : ${d} = ${whole} Rest ${r}, also ${n}/${d} = ${mixed(whole, r)}.`,
      fachwissen: FW_GEMISCHT,
      dedupeKey: `ma:k5:echt:zugemischt:${n}/${d}`,
    })
  },
  (rng: Rng) => {
    const fr = new Map<string, boolean>()
    const want = randInt(rng, 2, 3)
    while (fr.size < 6) {
      const d = randInt(rng, 2, 12)
      const unecht = [...fr.values()].filter(Boolean).length < want
      const n = unecht ? randInt(rng, d + 1, 3 * d) : randInt(rng, 1, d - 1)
      if (gcd(n, d) !== 1) continue
      fr.set(`${n}/${d}`, unecht)
    }
    const all = shuffleArr(rng, [...fr.keys()])
    const good = all.filter((f) => fr.get(f))
    return multiSelectTask({
      question: 'Tippe alle unechten Brüche an.',
      choices: all,
      correct: good,
      solution: good.join(', '),
      explanation: `Bei ${good.join(', ')} ist der Zähler größer als der Nenner; diese Brüche sind größer als 1.`,
      instruction: 'Tippe alle zutreffenden Brüche an:',
      fachwissen: FW_GEMISCHT,
      dedupeKey: `ma:k5:echt:multi:${[...all].sort().join(',')}`,
    })
  },
  (rng: Rng) => {
    const d = randInt(rng, 3, 15)
    const whole = randInt(rng, 2, 6)
    return valueTask({
      question: `Wie viele ${d}tel ergeben zusammen ${whole} Ganze?`,
      answerKind: 'integer',
      value: whole * d,
      solution: `${whole * d}`,
      explanation: `1 Ganzes = ${d}/${d}, also ${whole} Ganze = ${whole * d}/${d}.`,
      fachwissen: FW_GEMISCHT,
      dedupeKey: `ma:k5:echt:ganze:${d}:${whole}`,
    })
  },
)

// ---------------------------------------------------------------------------
// K5: Bruch ↔ Dezimalzahl ↔ Prozent
// ---------------------------------------------------------------------------

const FW_PROZENT = wiki(
  'Prozent bedeutet „von Hundert“: 1 % = 1/100 = 0,01. Um einen Bruch in Prozent umzurechnen, erweitert man ihn auf den Nenner 100, z. B. 7/20 = 35/100 = 35 % = 0,35.',
  'Prozent',
  'Prozent',
)
const HUNDERT_DENOMS = [2, 4, 5, 10, 20, 25, 50]

const randomHundredth = (rng: Rng): { n: number; d: number; pct: number } => {
  const d = pick(rng, HUNDERT_DENOMS)
  const n = reducedNumerator(rng, d)
  return { n, d, pct: (n * 100) / d }
}

export const generateBruchDezimalProzentK5: Topic['generate'] = mixedVariants(
  (rng: Rng) => {
    const { n, d, pct } = randomHundredth(rng)
    return valueTask({
      question: `Schreibe ${n}/${d} als Dezimalzahl.`,
      answerKind: 'decimal',
      value: pct / 100,
      solution: formatDe(pct / 100),
      explanation: `Auf Hundertstel erweitern: ${n}/${d} = ${pct}/100 = ${formatDe(pct / 100)}.`,
      fachwissen: FW_PROZENT,
      dedupeKey: `ma:k5:bdp:dez:${n}/${d}`,
    })
  },
  (rng: Rng) => {
    const { n, d, pct } = randomHundredth(rng)
    return valueTask({
      question: `Wie viel Prozent sind ${n}/${d}?`,
      unit: '%',
      answerKind: 'integer',
      value: pct,
      solution: `${pct} %`,
      explanation: `${n}/${d} = ${pct}/100 = ${pct} %.`,
      fachwissen: FW_PROZENT,
      dedupeKey: `ma:k5:bdp:pct:${n}/${d}`,
    })
  },
  (rng: Rng) => {
    const d = pick(rng, [20, 25, 50])
    const n = randInt(rng, 1, d - 1)
    const ctx = pick(rng, [
      ['Kindern einer Klasse', 'kommen', 'mit dem Fahrrad zur Schule'],
      ['Losen in einer Lostrommel', 'sind', 'Gewinne'],
      ['Tulpenzwiebeln', 'sind', 'aufgegangen'],
    ] as Array<[string, string, string]>)
    const pct = (n * 100) / d
    return valueTask({
      question: `Von ${d} ${ctx[0]} ${ctx[1]} ${n} ${ctx[2]}. Wie viel Prozent sind das?`,
      unit: '%',
      answerKind: 'integer',
      value: pct,
      solution: `${pct} %`,
      explanation: `${n}/${d} = ${pct}/100 = ${pct} %.`,
      fachwissen: FW_PROZENT,
      dedupeKey: `ma:k5:bdp:ctx:${d}:${n}:${ctx[0]}`,
    })
  },
  (rng: Rng) => {
    const vals = new Set<number>()
    while (vals.size < 4) vals.add(randomHundredth(rng).pct)
    const list = [...vals]
    const forms = shuffleArr(rng, ['bruch', 'dez', 'pct', 'dez'] as const)
    const label = (pct: number, f: 'bruch' | 'dez' | 'pct') => {
      if (f === 'pct') return `${pct} %`
      if (f === 'dez') return formatDe(pct / 100)
      const fr = makeFraction(pct, 100)
      return `${fr.n}/${fr.d}`
    }
    const shown = list.map((p, i) => label(p, forms[i]!))
    const max = Math.max(...list)
    const correct = shown[list.indexOf(max)]!
    return appliedMc(rng, {
      question: 'Welcher Anteil ist am größten?',
      correct,
      distractors: shown.filter((s) => s !== correct),
      explanation: `In Prozent umgerechnet: ${shown.map((s, i) => `${s} = ${list[i]} %`).join('; ')}. Am größten ist ${correct}.`,
      fachwissen: FW_PROZENT,
      dedupeKey: `ma:k5:bdp:max:${[...list].sort((a, b) => a - b).join(',')}`,
    })
  },
)

export const MATH_QUALITY_GENERATORS: Record<string, Topic['generate']> = {
  'lb1-rechengesetze': generateRechengesetzeK5,
  'k6-lb1-periodische-dezimal': generatePeriodischeDezimalK6,
  'lb1-vergleichen-ordnen': generateVergleichenOrdnenK5,
  'lb1-primfaktorzerlegung': generatePrimfaktorK5,
  'lb2-echte-unechte-brueche': generateEchteUnechteBruecheK5,
  'lb2-bruch-dezimal-prozent': generateBruchDezimalProzentK5,
}
