import { pick, randInt, type Rng } from '../lib/rng'
import { gcd, makeFraction } from '../lib/fraction'
import { formatDe, roundTo } from '../lib/num'
import { fractionTask, dragDropSortTask, digitGridTask, digitGridMultiplyTask, digitGridDivideTask, mixedVariants, numberLineTask, textTask, valueTask, visualTask, choicePickTask, coordinateClickTask } from './taskHelpers'
import { conversionTopic, LAENGE, FLAECHE, VOLUMEN, MASSE, ZEIT } from './units'
import {
  generateRectangleSvg,
  generateCuboidSvg,
  generateAngleSvg,
  generateFractionCircleSvg,
  generateFractionBarSvg,
  generateFractionGridSvg,
  generateLShapeSvg,
  generateUShapeSvg,
  generateCompositeCuboidSvg,
  generatePointsOnGridSvg,
  generateTranslationSvg,
  generateSymmetryShapeSvg,
  generateReflectionSvg,
  generatePointReflectionSvg,
  generateSegmentsOnGridSvg,
  generateRayOrLineSvg,
  reflectPointAcross,
  pointReflectAcross,
  symmetryAxisCount,
  symmetryShapeLabel,
  type SymmetryShapeKind,
  type MirrorLineKind,
  type LineFigureKind,
} from '../lib/geometrySvg'
import type { Grade, Topic } from './types'

/** Whether n is a prime number (n ≥ 2). */
const isPrime = (n: number): boolean => {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false
  return true
}

// ---------------------------------------------------------------------------
// Lernbereich 1 — Arbeiten mit natürlichen Zahlen
// ---------------------------------------------------------------------------

const rundenNatuerlich: Topic = {
  id: 'lb1-runden-natuerlich',
  title: 'Natürliche Zahlen runden',
  hint: 'Schau auf die Ziffer rechts von der Rundungsstelle.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Beim Runden ersetzt man eine Zahl durch eine annähernde Zahl mit weniger besetzten Stellen. Dazu schaut man auf die Ziffer rechts der Rundungsstelle: ist sie 0–4, bleibt die Rundungsstelle unverändert (abrunden); ist sie 5–9, wird sie um 1 erhöht (aufrunden). Alle Stellen rechts der Rundungsstelle werden durch Nullen ersetzt. Runden ist wichtig für Überschlagsrechnungen und das Schätzen von Ergebnissen.',
    quelle: 'Wikipedia: Runden (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Runden_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const n = randInt(rng, 1234, 98765)
    const place = pick(rng, [10, 100, 1000])
    const label = place === 10 ? 'Zehner' : place === 100 ? 'Hunderter' : 'Tausender'
    const value = Math.round(n / place) * place
    return valueTask({
      question: `Runde ${formatDe(n)} auf ${label}.`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Zum Runden auf ${label} schaust du auf die Ziffer rechts der ${label}stelle. Ist sie 5 oder größer, wird aufgerundet, sonst abgerundet: ${formatDe(n)} ≈ ${formatDe(value)}.`,
    })
  },
}

const addition: Topic = {
  id: 'lb1-addition',
  title: 'Addition natürlicher Zahlen',
  hint: 'Rechne schriftlich, Stelle für Stelle.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Die Addition ist eine der vier Grundrechenarten und verbindet zwei oder mehr Zahlen (Summanden) zu einer Summe. Beim schriftlichen Addieren schreibt man die Zahlen stellenweise untereinander (Einer unter Einer, Zehner unter Zehner usw.) und addiert von rechts nach links. Ergibt eine Stelle mehr als 9, trägt man den Übertrag in die nächsthöhere Stelle.',
    quelle: 'Wikipedia: Addition',
    url: 'https://de.wikipedia.org/wiki/Addition',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 124, 8999)
      const b = randInt(rng, 124, 8999)
      const value = a + b
      return valueTask({
        question: `Berechne: ${formatDe(a)} + ${formatDe(b)}`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Addiere die Zahlen stellenweise (mit Übertrag): ${formatDe(a)} + ${formatDe(b)} = ${formatDe(value)}.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 124, 8999)
      const b = randInt(rng, 124, 8999)
      const value = a + b
      return digitGridTask({
        question: 'Addiere schriftlich. Trage die Summe in die Kästchen ein:',
        a,
        b,
        operator: '+',
        value,
        solution: formatDe(value),
        explanation: `Addiere stellenweise (mit Übertrag): ${formatDe(a)} + ${formatDe(b)} = ${formatDe(value)}.`,
      })
    },
  ),
}

const subtraktion: Topic = {
  id: 'lb1-subtraktion',
  title: 'Subtraktion natürlicher Zahlen',
  hint: 'Der Minuend (vorne) ist immer größer.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Die Subtraktion ist die Umkehrung der Addition: Minuend − Subtrahend = Differenz. Beim schriftlichen Subtrahieren schreibt man beide Zahlen untereinander und rechnet von rechts nach links. Ist eine Stelle des Subtrahenden größer als die entsprechende Stelle des Minuenden, entbündelt man aus der nächsthöheren Stelle.',
    quelle: 'Wikipedia: Subtraktion',
    url: 'https://de.wikipedia.org/wiki/Subtraktion',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 2000, 9999)
      const b = randInt(rng, 100, a - 1)
      const value = a - b
      return valueTask({
        question: `Berechne: ${formatDe(a)} − ${formatDe(b)}`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Subtrahiere stellenweise (mit Entbündeln): ${formatDe(a)} − ${formatDe(b)} = ${formatDe(value)}.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2000, 9999)
      const b = randInt(rng, 100, a - 1)
      const value = a - b
      return digitGridTask({
        question: 'Subtrahiere schriftlich. Trage die Differenz in die Kästchen ein:',
        a,
        b,
        operator: '−',
        value,
        solution: formatDe(value),
        explanation: `Subtrahiere stellenweise (mit Entbündeln): ${formatDe(a)} − ${formatDe(b)} = ${formatDe(value)}.`,
      })
    },
  ),
}

const multiplikation: Topic = {
  id: 'lb1-multiplikation',
  title: 'Multiplikation natürlicher Zahlen',
  hint: 'Zerlege den zweiten Faktor nach Stellenwerten (Zehner, Einer, …) von links.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Die Multiplikation ist eine verkürzte Addition: a · b bedeutet, a genau b-mal zu addieren. Beim Stellenwertverfahren multipliziert man den ersten Faktor nacheinander mit den Stellenwerten des zweiten Faktors (von links: Hunderter, Zehner, Einer) und addiert die Teilprodukte.',
    quelle: 'Wikipedia: Multiplikation',
    url: 'https://de.wikipedia.org/wiki/Multiplikation',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 12, 99)
      const b = randInt(rng, 12, 99)
      const value = a * b
      return valueTask({
        question: `Berechne: ${a} · ${b}`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `Multipliziere schriftlich: ${a} · ${b} = ${formatDe(value)}.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 12, 99)
      const b = randInt(rng, 12, 99)
      const value = a * b
      return digitGridMultiplyTask({
        question: 'Multipliziere schriftlich. Trage Teilprodukte und Summe in die Kästchen ein:',
        a,
        b,
        solution: formatDe(value),
        explanation: `Stellenwertverfahren: ${a} · ${b} = ${formatDe(value)}.`,
      })
    },
  ),
}

/** Dediziertes Thema: immer Kästchenpapier für schriftliches Rechnen. */
const schriftlichesRechnen: Topic = {
  id: 'lb1-schriftliches-rechnen',
  title: 'Schriftliches Rechnen (Kästchenpapier)',
  hint: 'Schreibe stellenrichtig untereinander und trage jede Ziffer in ein Kästchen.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['schriftlich', 'Kästchen', 'Übertrag', 'Stellenwert'],
  fachwissen: {
    text: 'Beim schriftlichen Rechnen werden Zahlen stellenrichtig untereinander geschrieben. Man rechnet von rechts (Einer) nach links und notiert Überträge bzw. Entbündelungen. Das Kästchenpapier hilft, jede Ziffer einem Stellenwert zuzuordnen und Rechenfehler zu vermeiden.',
    quelle: 'Wikipedia: Schriftliches Rechnen',
    url: 'https://de.wikipedia.org/wiki/Schriftliches_Rechnen',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const a = randInt(rng, 125, 8999)
      const b = randInt(rng, 125, 8999)
      const value = a + b
      return digitGridTask({
        question: 'Addiere schriftlich auf dem Kästchenpapier:',
        a,
        b,
        operator: '+',
        value,
        solution: formatDe(value),
        explanation: `${formatDe(a)} + ${formatDe(b)} = ${formatDe(value)}.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 2000, 9999)
      const b = randInt(rng, 100, a - 1)
      const value = a - b
      return digitGridTask({
        question: 'Subtrahiere schriftlich auf dem Kästchenpapier:',
        a,
        b,
        operator: '−',
        value,
        solution: formatDe(value),
        explanation: `${formatDe(a)} − ${formatDe(b)} = ${formatDe(value)}.`,
      })
    },
    (rng: Rng) => {
      const a = randInt(rng, 12, 99)
      const b = randInt(rng, 12, 99)
      const value = a * b
      return digitGridMultiplyTask({
        question: 'Multipliziere schriftlich auf dem Kästchenpapier (Teilprodukte + Summe):',
        a,
        b,
        solution: formatDe(value),
        explanation: `${a} · ${b} = ${formatDe(value)}.`,
      })
    },
    (rng: Rng) => {
      const divisor = randInt(rng, 3, 9)
      const q = randInt(rng, 25, 999)
      const r = randInt(rng, 0, divisor - 1)
      const dividend = q * divisor + r
      return digitGridDivideTask({
        question: 'Dividiere schriftlich. Trage den Quotienten (und ggf. den Rest) ein:',
        dividend,
        divisor,
        quotient: q,
        rest: r,
        solution: r > 0 ? `${q} R ${r}` : String(q),
        explanation:
          r > 0
            ? `${dividend} : ${divisor} = ${q} Rest ${r}.`
            : `${dividend} : ${divisor} = ${q}.`,
      })
    },
  ),
}

const divisionMitRest: Topic = {
  id: 'lb1-division-rest',
  title: 'Division mit Rest',
  hint: 'Antwortformat: „q R r" (Quotient, dann Rest).',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Die Division prüft, wie oft ein Divisor in einem Dividenden enthalten ist. Ist der Dividend kein genaues Vielfaches des Divisors, gibt es einen Rest: Dividend = Quotient · Divisor + Rest. Der Rest ist stets kleiner als der Divisor. Die Division ist die Umkehrung der Multiplikation.',
    quelle: 'Wikipedia: Division (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Division_(Mathematik)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const divisor = randInt(rng, 3, 9)
      const q = randInt(rng, 11, 120)
      const r = randInt(rng, 1, divisor - 1)
      const dividend = q * divisor + r
      return textTask({
        question: `Berechne mit Rest: ${dividend} : ${divisor}`,
        accepted: [`${q} R ${r}`, `${q}R${r}`, `${q} Rest ${r}`],
        solution: `${q} R ${r}`,
        explanation: `${divisor} passt ${q}-mal in ${dividend} (${divisor} · ${q} = ${q * divisor}). Es bleibt der Rest ${dividend} − ${q * divisor} = ${r}. Also ${q} R ${r}.`,
      })
    },
    (rng: Rng) => {
      const divisor = randInt(rng, 3, 9)
      const q = randInt(rng, 11, 120)
      const r = randInt(rng, 1, divisor - 1)
      const dividend = q * divisor + r
      return digitGridDivideTask({
        question: 'Dividiere schriftlich mit Rest. Trage Quotient und Rest ein:',
        dividend,
        divisor,
        quotient: q,
        rest: r,
        solution: `${q} R ${r}`,
        explanation: `${dividend} : ${divisor} = ${q} Rest ${r}.`,
      })
    },
  ),
}

/** Dediziertes Thema: schriftliche Division auf dem Kästchenpapier. */
const schriftlicheDivision: Topic = {
  id: 'lb1-schriftliche-division',
  title: 'Schriftliche Division',
  hint: 'Schreibe Dividend : Divisor = und trage den Quotienten ziffernweise ein. Bei Rest zusätzlich die Rest-Zeile füllen.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['schriftlich', 'Division', 'Quotient', 'Rest', 'Kästchen', 'Nullen'],
  fachwissen: {
    text: 'Bei der schriftlichen Division bestimmt man den Quotienten ziffernweise von links. Man multipliziert die Quotientenziffer mit dem Divisor, subtrahiert vom jeweiligen Teil des Dividenden und zieht die nächste Ziffer herunter. Passt der Divisor nicht, schreibt man eine Null in den Quotienten.',
    quelle: 'Wikipedia: Schriftliches Rechnen',
    url: 'https://de.wikipedia.org/wiki/Schriftliches_Rechnen',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      // Exact division (no remainder)
      const divisor = randInt(rng, 2, 9)
      const q = randInt(rng, 15, 850)
      const dividend = q * divisor
      return digitGridDivideTask({
        question: 'Dividiere schriftlich. Trage den Quotienten in die Kästchen ein:',
        dividend,
        divisor,
        quotient: q,
        rest: 0,
        solution: String(q),
        explanation: `${dividend} : ${divisor} = ${q}.`,
      })
    },
    (rng: Rng) => {
      // With remainder
      const divisor = randInt(rng, 3, 9)
      const q = randInt(rng, 15, 850)
      const r = randInt(rng, 1, divisor - 1)
      const dividend = q * divisor + r
      return digitGridDivideTask({
        question: 'Dividiere schriftlich mit Rest. Trage Quotient und Rest ein:',
        dividend,
        divisor,
        quotient: q,
        rest: r,
        solution: `${q} R ${r}`,
        explanation: `${dividend} : ${divisor} = ${q} Rest ${r}.`,
      })
    },
    (rng: Rng) => {
      // Prefer a zero in the quotient (like 59535:7 = 8505)
      const divisor = randInt(rng, 3, 9)
      let q = randInt(rng, 100, 9999)
      // Force at least one zero digit in the middle
      const qDigits = String(q).split('')
      if (!qDigits.includes('0') && qDigits.length >= 3) {
        qDigits[randInt(rng, 1, qDigits.length - 2)] = '0'
        q = Number(qDigits.join(''))
      }
      const r = randInt(rng, 0, divisor - 1)
      const dividend = q * divisor + r
      return digitGridDivideTask({
        question: 'Dividiere schriftlich (Achtung auf Nullen im Quotienten):',
        dividend,
        divisor,
        quotient: q,
        rest: r,
        solution: r > 0 ? `${q} R ${r}` : String(q),
        explanation:
          r > 0
            ? `${dividend} : ${divisor} = ${q} Rest ${r}. Nullen im Quotienten nicht vergessen.`
            : `${dividend} : ${divisor} = ${q}. Nullen im Quotienten nicht vergessen.`,
      })
    },
  ),
}

const potenzieren: Topic = {
  id: 'lb1-potenzieren',
  title: 'Potenzieren (Quadrat- und Zehnerpotenzen)',
  hint: 'a² = a · a; 10ⁿ ist eine 1 mit n Nullen.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Eine Potenz aⁿ bedeutet, die Basis a genau n-mal mit sich selbst zu multiplizieren (n = Exponent). Zehnerpotenzen (10¹ = 10, 10² = 100, 10³ = 1000 …) sind die Grundlage unseres Dezimalsystems. Quadratzahlen (1, 4, 9, 16, 25 …) entstehen durch Potenzieren mit dem Exponenten 2.',
    quelle: 'Wikipedia: Potenz (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Potenz_(Mathematik)',
  },
  generate: (rng: Rng) => {
    if (rng() < 0.5) {
      const base = randInt(rng, 2, 20)
      const value = base * base
      return valueTask({
        question: `Berechne: ${base}²`,
        answerKind: 'integer',
        value,
        solution: formatDe(value),
        explanation: `${base}² bedeutet ${base} · ${base} = ${formatDe(value)}.`,
      })
    }
    const exp = randInt(rng, 1, 6)
    const value = 10 ** exp
    return valueTask({
      question: `Berechne: 10${['⁰', '¹', '²', '³', '⁴', '⁵', '⁶'][exp]}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `10^${exp} ist eine 1 mit ${exp} Null${exp > 1 ? 'en' : ''}: ${formatDe(value)}.`,
    })
  },
}

const teilbarkeit: Topic = {
  id: 'lb1-teilbarkeit',
  title: 'Teilbarkeit prüfen',
  hint: 'Antworte mit „ja" oder „nein".',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Eine ganze Zahl a ist durch b teilbar, wenn a = b · k für eine ganze Zahl k gilt (kein Rest). Wichtige Teilbarkeitsregeln: durch 2 → letzte Ziffer gerade; durch 3 → Quersumme durch 3 teilbar; durch 5 → endet auf 0 oder 5; durch 10 → endet auf 0; durch 4 → die letzten beiden Ziffern durch 4 teilbar.',
    quelle: 'Wikipedia: Teilbarkeit',
    url: 'https://de.wikipedia.org/wiki/Teilbarkeit',
  },
  generate: (rng: Rng) => {
    const d = pick(rng, [2, 3, 4, 5, 6, 9, 10])
    const divisible = rng() < 0.5
    let n: number
    if (divisible) {
      n = d * randInt(rng, 4, 40)
    } else {
      n = d * randInt(rng, 4, 40) + randInt(rng, 1, d - 1)
    }
    const yes = n % d === 0
    return textTask({
      question: `Ist ${n} durch ${d} teilbar?`,
      accepted: yes ? ['ja'] : ['nein'],
      solution: yes ? 'ja' : 'nein',
      explanation: yes
        ? `${n} : ${d} = ${n / d} ohne Rest. Also ist ${n} durch ${d} teilbar.`
        : `${n} : ${d} = ${Math.floor(n / d)} Rest ${n % d}. Also ist ${n} nicht durch ${d} teilbar.`,
    })
  },
}

const primzahl: Topic = {
  id: 'lb1-primzahl',
  title: 'Primzahlen erkennen',
  hint: 'Eine Primzahl hat genau zwei Teiler: 1 und sich selbst.',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Eine Primzahl ist eine natürliche Zahl größer als 1, die genau zwei verschiedene Teiler hat: 1 und sich selbst. Die kleinsten Primzahlen sind 2, 3, 5, 7, 11, 13, 17, 19 … Die Zahl 2 ist die einzige gerade Primzahl. Jede natürliche Zahl lässt sich eindeutig als Produkt von Primzahlen schreiben (Primfaktorzerlegung – fundamentaler Satz der Arithmetik).',
    quelle: 'Wikipedia: Primzahl',
    url: 'https://de.wikipedia.org/wiki/Primzahl',
  },
  generate: (rng: Rng) => {
    const n = randInt(rng, 5, 60)
    const yes = isPrime(n)
    let reason: string
    if (yes) {
      reason = `${n} ist nur durch 1 und ${n} teilbar, also eine Primzahl.`
    } else {
      let teiler = 2
      while (n % teiler !== 0) teiler++
      reason = `${n} ist durch ${teiler} teilbar (${n} = ${teiler} · ${n / teiler}), also keine Primzahl.`
    }
    return textTask({
      question: `Ist ${n} eine Primzahl?`,
      accepted: yes ? ['ja'] : ['nein'],
      solution: yes ? 'ja' : 'nein',
      explanation: reason,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 2 — Gemeine Brüche und Dezimalzahlen
// ---------------------------------------------------------------------------

const kuerzen: Topic = {
  id: 'lb2-kuerzen',
  title: 'Brüche kürzen',
  hint: 'Gib den vollständig gekürzten Bruch ein.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Einen Bruch kürzen bedeutet, Zähler und Nenner durch denselben Teiler zu dividieren, ohne den Wert des Bruchs zu ändern. Ein Bruch ist vollständig gekürzt, wenn Zähler und Nenner keinen gemeinsamen Teiler außer 1 mehr haben. Den größten gemeinsamen Teiler (ggT) findet man durch Primfaktorzerlegung oder sukzessives Teilen.',
    quelle: 'Wikipedia: Bruchrechnung',
    url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
  },
  generate: (rng: Rng) => {
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
}

const erweitern: Topic = {
  id: 'lb2-erweitern',
  title: 'Brüche erweitern',
  hint: 'Gib den gesuchten Zähler ein.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Einen Bruch erweitern bedeutet, Zähler und Nenner mit derselben Zahl (≠ 0) zu multiplizieren. Der Wert des Bruchs ändert sich dabei nicht, da man den Bruch mit 1 multipliziert (k/k = 1). Das Erweitern ist die Umkehrung des Kürzens und wird benötigt, um Brüche auf einen gemeinsamen Nenner zu bringen.',
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

const anteilAlsBruch: Topic = {
  id: 'lb2-anteil-bruch',
  title: 'Anteil als Bruch',
  hint: 'Gib den vollständig gekürzten Bruch ein.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Ein Bruch p/q beschreibt den Anteil von p gleich großen Teilen an einer aus q Teilen bestehenden Gesamtheit. Der Zähler p gibt an, wie viele Teile betrachtet werden; der Nenner q gibt die Gesamtanzahl der gleichen Teile an. Brüche beschreiben nicht nur Teile eines Ganzen, sondern auch Verhältnisse, Quotienten und Wahrscheinlichkeiten.',
    quelle: 'Wikipedia: Bruch (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Bruch_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const total = randInt(rng, 4, 20)
    const k = randInt(rng, 1, total - 1)
    const value = makeFraction(k, total)
    const thing = pick(rng, [
      ['Kugeln', 'rot'],
      ['Felder', 'blau'],
      ['Tiere', 'Katzen'],
      ['Autos', 'grün'],
    ])
    return fractionTask({
      question: `Von ${total} ${thing[0]} sind ${k} ${thing[1]}. Welcher Anteil ist ${thing[1]}? Gib den gekürzten Bruch an.`,
      value,
      requireReduced: true,
      solution: `${value.n}/${value.d}`,
      explanation: `Der Anteil ist ${k} von ${total}, also ${k}/${total}. Vollständig gekürzt ergibt das ${value.n}/${value.d}.`,
    })
  },
}

const grafischeBrueche: Topic = {
  id: 'lb2-grafische-brueche',
  title: 'Brüche grafisch ablesen',
  hint: 'Zähle die eingefärbten Teile und die Gesamtanzahl. Gib den gekürzten Bruch an.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Brüche lassen sich grafisch darstellen: als Kreisdiagramm (Tortendiagramm), als Rechteckstreifen (Balken) oder als Raster aus gleich großen Feldern. Der Zähler entspricht der Anzahl der eingefärbten Teile, der Nenner der Gesamtanzahl aller gleich großen Teile. Anschließend wird der Bruch vollständig gekürzt.',
    quelle: 'Wikipedia: Bruch (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Bruch_(Mathematik)',
  },
  generate: mixedVariants(
    // Variant: Kreisdiagramm
    (rng: Rng) => {
      const denominator = pick(rng, [3, 4, 5, 6, 8])
      const numerator = randInt(rng, 1, denominator - 1)
      const value = makeFraction(numerator, denominator)
      const svg = generateFractionCircleSvg({ numerator, denominator })
      return {
        ...fractionTask({
          question: 'Welcher Bruchanteil ist im Kreisdiagramm eingefärbt? Gib den gekürzten Bruch an.',
          value,
          requireReduced: true,
          solution: `${value.n}/${value.d}`,
          explanation: `${numerator} von ${denominator} Teilen sind eingefärbt, also ${numerator}/${denominator}. Vollständig gekürzt: ${value.n}/${value.d}.`,
        }),
        visualContent: svg,
      }
    },
    // Variant: Balken
    (rng: Rng) => {
      const denominator = pick(rng, [3, 4, 5, 6, 8, 10])
      const numerator = randInt(rng, 1, denominator - 1)
      const value = makeFraction(numerator, denominator)
      const svg = generateFractionBarSvg({ numerator, denominator })
      return {
        ...fractionTask({
          question: 'Welcher Bruchanteil ist im Balken eingefärbt? Gib den gekürzten Bruch an.',
          value,
          requireReduced: true,
          solution: `${value.n}/${value.d}`,
          explanation: `${numerator} von ${denominator} Abschnitten sind eingefärbt, also ${numerator}/${denominator}. Vollständig gekürzt: ${value.n}/${value.d}.`,
        }),
        visualContent: svg,
      }
    },
    // Variant: Raster
    (rng: Rng) => {
      const denominator = pick(rng, [4, 6, 8, 9, 12])
      const numerator = randInt(rng, 1, denominator - 1)
      const value = makeFraction(numerator, denominator)
      const cols = denominator === 9 ? 3 : denominator === 12 ? 4 : denominator === 6 ? 3 : 4
      const svg = generateFractionGridSvg({ numerator, denominator, cols })
      return {
        ...fractionTask({
          question: 'Welcher Bruchanteil ist im Raster eingefärbt? Gib den gekürzten Bruch an.',
          value,
          requireReduced: true,
          solution: `${value.n}/${value.d}`,
          explanation: `${numerator} von ${denominator} Feldern sind eingefärbt, also ${numerator}/${denominator}. Vollständig gekürzt: ${value.n}/${value.d}.`,
        }),
        visualContent: svg,
      }
    },
  ),
}

const dezAddSub: Topic = {
  id: 'lb2-dez-add-sub',
  title: 'Dezimalzahlen addieren und subtrahieren',
  hint: 'Achte auf die Ausrichtung des Kommas.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Dezimalzahlen werden addiert und subtrahiert, indem man sie kommagerecht untereinanderschreibt und stellenweise rechnet. Stellen hinter dem Komma heißen Zehntel, Hundertstel, Tausendstel usw. – sie folgen dem gleichen Prinzip wie Einer, Zehner und Hunderter bei natürlichen Zahlen. Fehlende Stellen kann man mit Nullen auffüllen.',
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
  id: 'lb2-dez-mult',
  title: 'Dezimalzahl multiplizieren',
  hint: 'Mit einstelliger Zahl oder Zehnerpotenz.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Dezimalzahlen werden wie natürliche Zahlen multipliziert; anschließend zählt man die Nachkommastellen beider Faktoren zusammen und setzt im Ergebnis das Komma entsprechend. Beim Multiplizieren mit 10, 100, 1000 … verschiebt sich das Komma um 1, 2, 3 … Stellen nach rechts.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 11, 249) / 10
    const factor = pick(rng, [2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 1000])
    const value = roundTo(a * factor, 2)
    const isTen = factor === 10 || factor === 100 || factor === 1000
    const stellen = factor === 10 ? 'eine' : factor === 100 ? 'zwei' : 'drei'
    const tip = isTen
      ? `Multiplizieren mit ${factor} verschiebt das Komma um ${stellen} Stelle(n) nach rechts.`
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
  id: 'lb2-dez-div',
  title: 'Dezimalzahl dividieren',
  hint: 'Durch einstellige Zahl oder Zehnerpotenz.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Beim Dividieren einer Dezimalzahl durch eine natürliche Zahl teilt man wie bei ganzen Zahlen und setzt das Komma im Ergebnis an der entsprechenden Stelle. Beim Dividieren durch 10, 100, 1000 … verschiebt sich das Komma um 1, 2, 3 … Stellen nach links – dies ist die Umkehrung der Multiplikation.',
    quelle: 'Wikipedia: Dezimalzahl',
    url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
  },
  generate: (rng: Rng) => {
    const divisor = pick(rng, [2, 3, 4, 5, 6, 10, 100, 1000])
    const quotient = randInt(rng, 11, 199) / 10
    const dividend = roundTo(quotient * divisor, 2)
    const isTen = divisor === 10 || divisor === 100 || divisor === 1000
    const stellen = divisor === 10 ? 'eine' : divisor === 100 ? 'zwei' : 'drei'
    const tip = isTen
      ? `Dividieren durch ${divisor} verschiebt das Komma um ${stellen} Stelle(n) nach links.`
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

const rundenDezimal: Topic = {
  id: 'lb2-runden-dezimal',
  title: 'Dezimalzahlen runden',
  hint: 'Ist die nächste Ziffer 5 oder größer, wird aufgerundet.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Dezimalzahlen rundet man durch Abschneiden auf die gewünschte Stelle. Ist die erste nicht mehr benötigte Ziffer 5 oder größer, wird die letzte behaltene Stelle um 1 erhöht (aufrunden); sonst bleibt sie unverändert (abrunden). Runden auf ganze Zahlen, auf eine Nachkommastelle, auf zwei Nachkommastellen usw. ist im Alltag häufig – z. B. bei Geldbeträgen.',
    quelle: 'Wikipedia: Runden (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Runden_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const value0 = randInt(rng, 1000, 99999) / 1000
    const places = pick(rng, [0, 1, 2])
    const label =
      places === 0 ? 'ganze Zahl' : `${places} Nachkommastelle${places > 1 ? 'n' : ''}`
    const rounded = roundTo(value0, places)
    return valueTask({
      question: `Runde ${formatDe(value0)} auf ${places === 0 ? 'eine ganze Zahl' : label}.`,
      answerKind: 'decimal',
      value: rounded,
      eps: 1e-9,
      solution: formatDe(rounded),
      explanation: `Schau auf die Ziffer nach der ${
        places === 0 ? 'Einerstelle' : `${places}. Nachkommastelle`
      }. Ist sie 5 oder größer, wird aufgerundet, sonst abgerundet. ${formatDe(value0)} ≈ ${formatDe(rounded)}.`,
    })
  },
}

const mittelwert: Topic = {
  id: 'lb2-mittelwert',
  title: 'Arithmetisches Mittel',
  hint: 'Mittelwert = Summe : Anzahl.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Das arithmetische Mittel (Durchschnitt) einer Datenmenge berechnet sich als Summe aller Werte geteilt durch ihre Anzahl: x̄ = (x₁ + x₂ + … + xₙ) / n. Es ist ein Maß der zentralen Tendenz und wird genutzt, um eine Datenmenge durch eine einzige typische Zahl zu beschreiben. Bei stark unterschiedlichen Werten kann er jedoch täuschen.',
    quelle: 'Wikipedia: Arithmetisches Mittel',
    url: 'https://de.wikipedia.org/wiki/Arithmetisches_Mittel',
  },
  generate: (rng: Rng) => {
    const count = randInt(rng, 3, 5)
    const numbers: number[] = []
    for (let i = 0; i < count; i++) numbers.push(randInt(rng, 2, 20))
    let sum = numbers.reduce((s, x) => s + x, 0)
    const remainder = sum % count
    if (remainder !== 0) {
      numbers[count - 1] += count - remainder
      sum += count - remainder
    }
    const mean = sum / count
    return valueTask({
      question: `Berechne das arithmetische Mittel von ${numbers.join(', ')}.`,
      answerKind: 'integer',
      value: mean,
      solution: formatDe(mean),
      explanation: `Addiere alle Zahlen: ${numbers.join(' + ')} = ${sum}. Teile durch die Anzahl ${count}: ${sum} : ${count} = ${formatDe(mean)}.`,
    })
  },
}

// --- NEW: Anwendungsaufgaben Lernbereich 2 -----------------------------------

/** Mittelpunkt zweier Dezimalzahlen auf dem Zahlenstrahl (Anwendung). */
const zahlenstrahl: Topic = {
  id: 'lb2-zahlenstrahl',
  title: 'Dezimalzahlen auf dem Zahlenstrahl: Mitte finden',
  hint: 'Die Mitte zwischen zwei Zahlen ist ihr Durchschnitt: (a + b) : 2.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Zahlenstrahl', 'Mitte', 'einordnen', 'Mittelwert', 'Dezimalzahl'],
  fachwissen: {
    text: 'Auf dem Zahlenstrahl sind alle Zahlen der Größe nach von links nach rechts angeordnet. Der Mittelpunkt zwischen zwei Zahlen a und b liegt bei (a + b) / 2 – das ist ihr arithmetisches Mittel. Das Einordnen von Dezimalzahlen auf dem Zahlenstrahl schärft das Verständnis für den Wert einer Dezimalzahl und ihre Lage im Verhältnis zu ganzen Zahlen oder anderen Dezimalzahlen.',
    quelle: 'Wikipedia: Zahlenstrahl',
    url: 'https://de.wikipedia.org/wiki/Zahlenstrahl',
  },
  generate: mixedVariants(
    // Variant 1: Interaktiv - Zwei Dezimalzahlen, Mitte finden
    (rng: Rng) => {
      const a = randInt(rng, 10, 89) / 10
      const step = randInt(rng, 2, 10) / 10
      const b = roundTo(a + step * 2, 1)
      const mid = roundTo((a + b) / 2, 1)
      return numberLineTask({
        question: `Zwei Zahlen sind auf dem Zahlenstrahl markiert: ${formatDe(a)} und ${formatDe(b)}.\nWo liegt die Mitte?`,
        min: Math.floor(a) - 0.5,
        max: Math.ceil(b) + 0.5,
        step: 0.1,
        value: mid,
        decimals: 1,
        solution: formatDe(mid),
        explanation: `Die Mitte: (${formatDe(a)} + ${formatDe(b)}) : 2 = ${formatDe(a + b)} : 2 = ${formatDe(mid)}.`,
        eps: 0.05,
      })
    },
    // Variant 2: Interaktiv - Dezimalzahl zwischen zwei ganzen Zahlen platzieren
    (rng: Rng) => {
      const a = randInt(rng, 2, 8)
      const b = a + 1
      const target = roundTo(a + randInt(rng, 2, 8) / 10, 1)
      return numberLineTask({
        question: `Wo liegt die Zahl ${formatDe(target)} auf dem Zahlenstrahl zwischen ${a} und ${b}?`,
        min: a - 0.5,
        max: b + 0.5,
        step: 0.1,
        value: target,
        decimals: 1,
        solution: formatDe(target),
        explanation: `Die Zahl ${formatDe(target)} liegt zwischen ${a} und ${b} auf dem Zahlenstrahl.`,
        eps: 0.05,
      })
    },
    // Variant 3: Interaktiv - Drei Dezimalzahlen, mittlere Position finden
    (rng: Rng) => {
      const a = randInt(rng, 15, 35) / 10
      const mid = roundTo(a + randInt(rng, 3, 8) / 10, 1)
      const b = roundTo(mid + (mid - a), 1)
      return numberLineTask({
        question: `${formatDe(a)} und ${formatDe(b)} sind gegeben.\nMarkiere die Mitte zwischen ihnen auf dem Zahlenstrahl.`,
        min: Math.floor(a) - 0.5,
        max: Math.ceil(b) + 0.5,
        step: 0.1,
        value: mid,
        decimals: 1,
        solution: formatDe(mid),
        explanation: `Die Mitte zwischen ${formatDe(a)} und ${formatDe(b)} liegt bei ${formatDe(mid)}. Das ist genau in der Mitte, weil ${formatDe(mid)} - ${formatDe(a)} = ${formatDe(b)} - ${formatDe(mid)}.`,
        eps: 0.05,
      })
    },
    // Variant 4: Interaktiv - Feiner Zahlenstrahl mit kleineren Schritten
    (rng: Rng) => {
      const base = randInt(rng, 10, 40) / 10
      const target = roundTo(base + randInt(rng, 1, 5) / 20, 2)
      return numberLineTask({
        question: `Wo liegt ${formatDe(target)} auf diesem feinen Zahlenstrahl?`,
        min: Math.floor(base) - 0.2,
        max: Math.ceil(base + 0.5) + 0.2,
        step: 0.05,
        value: target,
        decimals: 2,
        solution: formatDe(target),
        explanation: `Die Zahl ${formatDe(target)} liegt genau dort auf dem Zahlenstrahl.`,
        eps: 0.03,
      })
    },
  ),
}

/** Größen verschiedener Einheiten vergleichen — Sachkompetenz. */
const ordnenMitEinheiten: Topic = {
  id: 'lb2-ordnen-einheiten',
  title: 'Größen mit verschiedenen Einheiten ordnen',
  hint: 'Rechne alle Angaben in dieselbe Einheit um, dann vergleiche.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['ordnen', 'vergleichen', 'Einheiten', 'umrechnen', 'Länge', 'Masse'],
  fachwissen: {
    text: 'Um Größen der Größe nach zu ordnen, müssen sie zunächst in eine gemeinsame Einheit umgerechnet werden. Erst dann ist ein direkter Vergleich der Zahlenwerte möglich. Dieses zweistufige Vorgehen – zuerst umrechnen, dann ordnen – ist eine typische Anwendungsaufgabe, die rechnerisches und konzeptuelles Verständnis verbindet.',
    quelle: 'Wikipedia: Maßeinheit',
    url: 'https://de.wikipedia.org/wiki/Ma%C3%9Feinheit',
  },
  generate: (rng: Rng) => {
    type Scenario = { items: { label: string; value: number }[]; unitName: string }
    
    // Generate 30+ different scenarios with varying values
    const lengthScenarios: Scenario[] = []
    for (let i = 0; i < 12; i++) {
      const mm1 = randInt(rng, 5, 15) * 100
      const cm1 = randInt(rng, 80, 180)
      const dm1 = randInt(rng, 8, 18)
      const m1 = randInt(rng, 10, 25) / 10
      lengthScenarios.push({
        unitName: 'cm',
        items: [
          { label: `${formatDe(m1)} m`, value: m1 * 100 },
          { label: `${cm1} cm`, value: cm1 },
          { label: `${dm1} dm`, value: dm1 * 10 },
        ],
      })
      lengthScenarios.push({
        unitName: 'mm',
        items: [
          { label: `${cm1} cm`, value: cm1 * 10 },
          { label: `${mm1} mm`, value: mm1 },
          { label: `${dm1} dm`, value: dm1 * 100 },
        ],
      })
    }
    
    const massScenarios: Scenario[] = []
    for (let i = 0; i < 12; i++) {
      const g1 = randInt(rng, 700, 1500)
      const kg1 = randInt(rng, 8, 18) / 10
      const g2 = randInt(rng, 500, 2000)
      massScenarios.push({
        unitName: 'g',
        items: [
          { label: `${formatDe(kg1)} kg`, value: kg1 * 1000 },
          { label: `${g1} g`, value: g1 },
          { label: `${g2} g`, value: g2 },
        ],
      })
    }
    
    const volumeScenarios: Scenario[] = []
    for (let i = 0; i < 12; i++) {
      const ml1 = randInt(rng, 500, 1800)
      const l1 = randInt(rng, 8, 18) / 10
      const ml2 = randInt(rng, 700, 2500)
      volumeScenarios.push({
        unitName: 'ml',
        items: [
          { label: `${formatDe(l1)} l`, value: l1 * 1000 },
          { label: `${ml1} ml`, value: ml1 },
          { label: `${formatDe(ml2 / 1000)} l`, value: ml2 },
        ],
      })
    }
    
    const allScenarios = [...lengthScenarios, ...massScenarios, ...volumeScenarios]
    const sc = pick(rng, allScenarios)
    const sorted = [...sc.items].sort((a, b) => a.value - b.value)
    const correctOrder = sorted.map((sortedItem) => 
      sc.items.findIndex((item) => item.value === sortedItem.value)
    )
    
    return dragDropSortTask({
      question: 'Sortiere die Größen von klein nach groß (kleinste zuerst):',
      items: sc.items,
      correctOrder,
      solution: sorted.map((i) => i.label).join(' < '),
      explanation: `Rechne alle Angaben in ${sc.unitName} um:\n${sc.items.map((i) => `${i.label} = ${formatDe(i.value)} ${sc.unitName}`).join('\n')}.\n\nSortiert von klein nach groß: ${sorted.map((i) => i.label).join(' < ')}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Lagebeziehungen geometrischer Objekte
// ---------------------------------------------------------------------------

const winkelarten: Topic = {
  id: 'lb3-winkelarten',
  title: 'Winkelarten erkennen',
  hint: 'spitz (<90°), recht (90°), stumpf (90°–180°), gestreckt (180°) oder überstumpf (>180°).',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Winkel werden nach ihrer Größe unterschieden: Ein spitzer Winkel liegt zwischen 0° und 90°, ein rechter Winkel beträgt genau 90°, ein stumpfer Winkel liegt zwischen 90° und 180°, ein gestreckter Winkel beträgt genau 180° und ein überstumpfer (konvexer) Winkel liegt zwischen 180° und 360°. Der Vollwinkel beträgt 360°.',
    quelle: 'Wikipedia: Winkel',
    url: 'https://de.wikipedia.org/wiki/Winkel',
  },
  generate: mixedVariants(
    // Variant 1: Text only — varied degrees so fingerprints differ
    (rng: Rng) => {
      const kind = pick(rng, ['spitz', 'recht', 'stumpf', 'gestreckt', 'überstumpf'])
      let deg: number
      switch (kind) {
        case 'spitz':
          deg = randInt(rng, 5, 85)
          break
        case 'recht':
          deg = 90
          break
        case 'stumpf':
          deg = randInt(rng, 95, 175)
          break
        case 'gestreckt':
          deg = 180
          break
        default:
          deg = randInt(rng, 185, 350)
      }
      const accepted = kind === 'überstumpf' ? ['überstumpf', 'ueberstumpf'] : [kind]
      return textTask({
        question: `Welche Winkelart hat ein Winkel von ${deg}°?`,
        accepted,
        solution: kind,
        explanation: `Ein Winkel von ${deg}° ist ${
          kind === 'recht'
            ? 'genau 90° groß, also ein rechter Winkel'
            : kind === 'gestreckt'
              ? 'genau 180° groß, also ein gestreckter Winkel'
              : kind === 'spitz'
                ? 'kleiner als 90°, also spitz'
                : kind === 'stumpf'
                  ? 'zwischen 90° und 180°, also stumpf'
                  : 'größer als 180°, also überstumpf'
        }.`,
      })
    },
    // Variant 2: Grafisch + Tippen — rotate figure so same kind ≠ same image
    (rng: Rng) => {
      const kind = pick(rng, ['spitz', 'recht', 'stumpf', 'gestreckt'] as const)
      let deg: number
      switch (kind) {
        case 'spitz':
          deg = randInt(rng, 25, 75)
          break
        case 'recht':
          deg = 90
          break
        case 'stumpf':
          deg = randInt(rng, 100, 155)
          break
        default:
          deg = 180
      }
      const startAngle = pick(rng, [0, 20, 35, 45, 60, 90, 120, 150, 180, 210, 240, 270])
      const choices = ['spitz', 'recht', 'stumpf', 'gestreckt']
      // Shuffle choice order for variety
      const shuffled = [...choices]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return choicePickTask({
        question: 'Welche Winkelart hat dieser Winkel?',
        choices: shuffled,
        correct: kind,
        solution: kind,
        explanation: `Der Winkel ist ${
          kind === 'recht'
            ? 'genau 90°'
            : kind === 'gestreckt'
              ? 'genau 180°'
              : kind === 'spitz'
                ? 'kleiner als 90°'
                : 'zwischen 90° und 180°'
        }, also ${kind}.`,
        visualContent: generateAngleSvg({ angle: deg, label: '?', startAngle }),
        instruction: 'Tippe die passende Winkelart:',
      })
    },
  ),
}

const winkelErgaenzung: Topic = {
  id: 'lb3-winkel-ergaenzung',
  title: 'Winkel zu 90° oder 180° ergänzen',
  hint: 'Vom Zielwert (90° oder 180°) den gegebenen Winkel abziehen.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Zwei Winkel, die zusammen 90° ergeben, heißen Komplementärwinkel. Zwei Winkel, die zusammen 180° ergeben, heißen Supplementärwinkel (Ergänzungswinkel). An Geraden entstehen Supplementärwinkel auf jeder Seite. Diese Beziehungen sind wichtig beim Berechnen unbekannter Winkel in geometrischen Figuren.',
    quelle: 'Wikipedia: Winkel',
    url: 'https://de.wikipedia.org/wiki/Winkel',
  },
  generate: mixedVariants(
    // Variant 1: Text
    (rng: Rng) => {
      const toStraight = rng() < 0.5
      const gesamt = toStraight ? 180 : 90
      const a = randInt(rng, 10, gesamt - 10)
      const value = gesamt - a
      const zielName = toStraight ? 'gestreckten Winkel (180°)' : 'rechten Winkel (90°)'
      return valueTask({
        question: `Zwei Winkel sollen zusammen einen ${zielName} ergeben. Ein Winkel ist ${a}°. Wie groß ist der andere?\n\nRechne: ${gesamt}° − ${a}° = ?`,
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `Ziel: ${gesamt}°. Gegeben: ${a}°. Ergänzungswinkel = ${gesamt}° − ${a}° = ${value}°.`,
      })
    },
    // Variant 2: Grafisch
    (rng: Rng) => {
      const toStraight = rng() < 0.6
      const gesamt = toStraight ? 180 : 90
      const a = randInt(rng, 20, gesamt - 20)
      const value = gesamt - a
      const startAngle = pick(rng, [0, 15, 30, 45, 60, 90, 120])
      const zielName = toStraight ? 'gestreckten Winkel (180°)' : 'rechten Winkel (90°)'
      const svg = generateAngleSvg({
        angle: a,
        label: `${a}°`,
        startAngle,
      })
      return visualTask({
        question: `Der abgebildete Winkel misst ${a}°. Ergänze ihn zu einem ${zielName}. Wie groß ist der Ergänzungswinkel?\n\nRechne: ${gesamt}° − ${a}° = ?`,
        unit: '°',
        answerKind: 'integer',
        value,
        solution: `${value}°`,
        explanation: `Vom Zielwert ${gesamt}° den gegebenen Winkel abziehen: ${gesamt}° − ${a}° = ${value}°.`,
        visualContent: svg,
      })
    },
  ),
}

/** Flexible accepted formats for a pair (a; b) — spaces, comma/semicolon, optional parentheses/pipe. */
const pairAnswerAccepted = (a: number, b: number): string[] => {
  const raw = [
    `${a}; ${b}`,
    `${a};${b}`,
    `${a}, ${b}`,
    `${a},${b}`,
    `${a} ; ${b}`,
    `${a}|${b}`,
    `${a} | ${b}`,
    `(${a}|${b})`,
    `(${a} | ${b})`,
    `(${a}; ${b})`,
    `(${a};${b})`,
    `(${a}, ${b})`,
    `(${a},${b})`,
  ]
  return [...new Set(raw)]
}

const COORD_X_RANGE: [number, number] = [-5, 8]
const COORD_Y_RANGE: [number, number] = [-5, 8]
const POINT_LABELS = ['A', 'B', 'C'] as const

/** Distinct integer grid points, preferably off the origin. */
const distinctGridPoints = (
  rng: Rng,
  count: number,
  opts?: { avoidAxes?: boolean },
): Array<{ x: number; y: number }> => {
  const pts: Array<{ x: number; y: number }> = []
  const used = new Set<string>()
  let guard = 0
  while (pts.length < count && guard < 200) {
    guard++
    const x = randInt(rng, -4, 7)
    const y = randInt(rng, -4, 7)
    if (opts?.avoidAxes && (x === 0 || y === 0)) continue
    const key = `${x},${y}`
    if (used.has(key)) continue
    used.add(key)
    pts.push({ x, y })
  }
  return pts
}

const quadrantOf = (x: number, y: number): 'I' | 'II' | 'III' | 'IV' => {
  if (x > 0 && y > 0) return 'I'
  if (x < 0 && y > 0) return 'II'
  if (x < 0 && y < 0) return 'III'
  return 'IV'
}

const QUADRANT_ACCEPTED: Record<'I' | 'II' | 'III' | 'IV', string[]> = {
  I: ['I', '1', 'i', 'quadrant i', '1. quadrant', 'erster', '1.'],
  II: ['II', '2', 'ii', 'quadrant ii', '2. quadrant', 'zweiter', '2.'],
  III: ['III', '3', 'iii', 'quadrant iii', '3. quadrant', 'dritter', '3.'],
  IV: ['IV', '4', 'iv', 'quadrant iv', '4. quadrant', 'vierter', '4.'],
}

/** Integer axis-aligned or 3-4-5 distances for coordinate distance tasks. */
const pickCoordinateDistance = (
  rng: Rng,
): { a: { x: number; y: number }; b: { x: number; y: number }; dist: number } => {
  const kind = pick(rng, ['h', 'v', '345'] as const)
  // Keep both endpoints inside roughly [-4, 7] for the -5..8 display grid
  if (kind === 'h') {
    const dist = randInt(rng, 2, 6)
    const ax = randInt(rng, -4, 7 - dist)
    const ay = randInt(rng, -4, 7)
    return { a: { x: ax, y: ay }, b: { x: ax + dist, y: ay }, dist }
  }
  if (kind === 'v') {
    const dist = randInt(rng, 2, 6)
    const ax = randInt(rng, -4, 7)
    const ay = randInt(rng, -4, 7 - dist)
    return { a: { x: ax, y: ay }, b: { x: ax, y: ay + dist }, dist }
  }
  const flip = rng() < 0.5
  const dx = flip ? 3 : 4
  const dy = flip ? 4 : 3
  const ax = randInt(rng, -4, 7 - dx)
  const ay = randInt(rng, -4, 7 - dy)
  return {
    a: { x: ax, y: ay },
    b: { x: ax + dx, y: ay + dy },
    dist: 5,
  }
}

const koordinatenAblesen: Topic = {
  id: 'lb3-koordinaten-ablesen',
  title: 'Koordinaten ablesen',
  hint: 'Antwortformat: x; y (auch Komma oder (x|y) sind ok).',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Ein kartesisches Koordinatensystem besteht aus zwei senkrecht aufeinander stehenden Zahlengeraden (x-Achse waagerecht, y-Achse senkrecht), die sich im Ursprung (0|0) schneiden. Jeder Punkt der Ebene wird durch ein geordnetes Paar (x|y) beschrieben: x gibt die Lage parallel zur x-Achse an, y parallel zur y-Achse. Positive x-Werte liegen rechts vom Ursprung, positive y-Werte oberhalb.',
    quelle: 'Wikipedia: Kartesisches Koordinatensystem',
    url: 'https://de.wikipedia.org/wiki/Kartesisches_Koordinatensystem',
  },
  generate: mixedVariants(
    // Variant 1: Single labeled point — read coordinates of A
    (rng: Rng) => {
      const [p] = distinctGridPoints(rng, 1)
      const svg = generatePointsOnGridSvg({
        points: [{ ...p, label: 'A' }],
        xRange: COORD_X_RANGE,
        yRange: COORD_Y_RANGE,
      })
      const accepted = pairAnswerAccepted(p.x, p.y)
      return {
        ...textTask({
          question: 'Lies die Koordinaten von Punkt A ab. Gib x; y an.',
          accepted,
          solution: `${p.x}; ${p.y}`,
          explanation: `Punkt A liegt ${p.x} Einheiten ${
            p.x >= 0 ? 'rechts' : 'links'
          } und ${p.y} Einheiten ${p.y >= 0 ? 'oberhalb' : 'unterhalb'} des Ursprungs. Also A = (${p.x}|${p.y}).`,
        }),
        visualContent: svg,
      }
    },
    // Variant 2: 2–3 labeled points — ask for one of them
    (rng: Rng) => {
      const n = randInt(rng, 2, 3)
      const pts = distinctGridPoints(rng, n)
      const labeled = pts.map((p, i) => ({ ...p, label: POINT_LABELS[i] }))
      const askIdx = randInt(rng, 0, n - 1)
      const target = labeled[askIdx]
      const svg = generatePointsOnGridSvg({
        points: labeled,
        xRange: COORD_X_RANGE,
        yRange: COORD_Y_RANGE,
      })
      const accepted = pairAnswerAccepted(target.x, target.y)
      return {
        ...textTask({
          question: `Lies die Koordinaten von Punkt ${target.label} ab. Gib x; y an.`,
          accepted,
          solution: `${target.x}; ${target.y}`,
          explanation: `Punkt ${target.label} liegt bei (${target.x}|${target.y}).`,
        }),
        visualContent: svg,
      }
    },
  ),
}

const koordinatenEintragen: Topic = {
  id: 'lb3-koordinaten-eintragen',
  title: 'Punkte im Koordinatensystem zuordnen',
  hint: 'Bei Buchstaben: A, B oder C. Bei Quadranten: I, II, III oder IV.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Um einen Punkt mit gegebenen Koordinaten (x|y) im Koordinatensystem zu finden, geht man vom Ursprung x Einheiten waagerecht und y Einheiten senkrecht. Die vier Quadranten werden gegen den Uhrzeigersinn nummeriert: I (rechts oben, x>0, y>0), II (links oben, x<0, y>0), III (links unten, x<0, y<0), IV (rechts unten, x>0, y<0). Punkte auf den Achsen liegen in keinem Quadranten.',
    quelle: 'Wikipedia: Kartesisches Koordinatensystem',
    url: 'https://de.wikipedia.org/wiki/Kartesisches_Koordinatensystem',
  },
  generate: mixedVariants(
    // Variant 1: Which labeled point — tippen A/B/C
    (rng: Rng) => {
      const pts = distinctGridPoints(rng, 3)
      const labeled = pts.map((p, i) => ({ ...p, label: POINT_LABELS[i] }))
      const askIdx = randInt(rng, 0, 2)
      const target = labeled[askIdx]
      return choicePickTask({
        question: `Welcher Punkt liegt bei (${target.x}|${target.y})?`,
        choices: ['A', 'B', 'C'],
        correct: target.label,
        solution: target.label,
        explanation: `Punkt ${target.label} hat die Koordinaten (${target.x}|${target.y}).`,
        visualContent: generatePointsOnGridSvg({
          points: labeled,
          xRange: COORD_X_RANGE,
          yRange: COORD_Y_RANGE,
        }),
        instruction: 'Tippe den richtigen Punkt:',
      })
    },
    // Variant 2: Quadrant tippen
    (rng: Rng) => {
      const [p] = distinctGridPoints(rng, 1, { avoidAxes: true })
      const q = quadrantOf(p.x, p.y)
      return choicePickTask({
        question: `Punkt P hat die Koordinaten (${p.x}|${p.y}). In welchem Quadranten liegt P?`,
        choices: ['I', 'II', 'III', 'IV'],
        correct: q,
        solution: q,
        explanation: `x = ${p.x} (${p.x > 0 ? 'positiv' : 'negativ'}), y = ${p.y} (${
          p.y > 0 ? 'positiv' : 'negativ'
        }) → Quadrant ${q}.`,
        visualContent: generatePointsOnGridSvg({
          points: [{ ...p, label: 'P' }],
          xRange: COORD_X_RANGE,
          yRange: COORD_Y_RANGE,
        }),
        instruction: 'Tippe den Quadranten:',
      })
    },
    // Variant 3: Punkt setzen (klicken)
    (rng: Rng) => {
      const [p] = distinctGridPoints(rng, 1)
      return coordinateClickTask({
        question: `Setze den Punkt P(${p.x}|${p.y}) im Koordinatensystem.`,
        x: p.x,
        y: p.y,
        solution: `(${p.x}|${p.y})`,
        explanation: `Vom Ursprung ${p.x} Einheiten waagerecht und ${p.y} Einheiten senkrecht → P(${p.x}|${p.y}).`,
        xRange: COORD_X_RANGE,
        yRange: COORD_Y_RANGE,
        instruction: 'Tippe auf die richtige Gitterstelle:',
      })
    },
    // Variant 4: Text-only quadrant
    (rng: Rng) => {
      const [p] = distinctGridPoints(rng, 1, { avoidAxes: true })
      const q = quadrantOf(p.x, p.y)
      return textTask({
        question: `Punkt P hat die Koordinaten (${p.x}|${p.y}). In welchem Quadranten liegt P? Antworte mit I, II, III oder IV.`,
        accepted: QUADRANT_ACCEPTED[q],
        solution: q,
        explanation: `x = ${p.x}, y = ${p.y} → Quadrant ${q}.`,
      })
    },
  ),
}

const koordinatenAbstand: Topic = {
  id: 'lb3-koordinaten-abstand',
  title: 'Abstand zwischen Punkten',
  hint: 'Waagerecht/senkrecht: |Δx| bzw. |Δy|. Schräg: Pythagoras (z. B. 3–4–5).',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Der Abstand zweier Punkte A(x₁|y₁) und B(x₂|y₂) im kartesischen Koordinatensystem ist die Länge der Strecke AB. Bei gleicher y-Koordinate ist der Abstand |x₂ − x₁|, bei gleicher x-Koordinate |y₂ − y₁|. Allgemein gilt d = √((x₂ − x₁)² + (y₂ − y₁)²) (Satz des Pythagoras). Die Einheit auf dem Raster heißt oft Längeneinheit (LE).',
    quelle: 'Wikipedia: Kartesisches Koordinatensystem',
    url: 'https://de.wikipedia.org/wiki/Kartesisches_Koordinatensystem',
  },
  generate: mixedVariants(
    // Variant 1: Visual A,B with connecting segment
    (rng: Rng) => {
      const { a, b, dist } = pickCoordinateDistance(rng)
      const svg = generatePointsOnGridSvg({
        points: [
          { ...a, label: 'A' },
          { ...b, label: 'B' },
        ],
        connectLabels: [['A', 'B']],
        xRange: COORD_X_RANGE,
        yRange: COORD_Y_RANGE,
      })
      return {
        ...valueTask({
          question: 'Wie groß ist der Abstand zwischen A und B? (1 Kästchen = 1 LE)',
          unit: 'LE',
          answerKind: 'integer',
          value: dist,
          solution: `${dist}`,
          explanation: `A(${a.x}|${a.y}), B(${b.x}|${b.y}): d = √((${b.x}−${a.x})² + (${b.y}−${a.y})²) = ${dist} LE.`,
        }),
        visualContent: svg,
      }
    },
    // Variant 2: Same visual without drawn segment (points only)
    (rng: Rng) => {
      const { a, b, dist } = pickCoordinateDistance(rng)
      const svg = generatePointsOnGridSvg({
        points: [
          { ...a, label: 'A' },
          { ...b, label: 'B' },
        ],
        xRange: COORD_X_RANGE,
        yRange: COORD_Y_RANGE,
      })
      return {
        ...valueTask({
          question: 'Wie groß ist der Abstand der Punkte A und B in Längeneinheiten?',
          unit: 'LE',
          answerKind: 'integer',
          value: dist,
          solution: `${dist} LE`,
          explanation: `A(${a.x}|${a.y}), B(${b.x}|${b.y}): Abstand = ${dist} LE.`,
        }),
        visualContent: svg,
      }
    },
    // Variant 3: Text — given coordinates
    (rng: Rng) => {
      const { a, b, dist } = pickCoordinateDistance(rng)
      const axisAligned = a.x === b.x || a.y === b.y
      return valueTask({
        question: `A = (${a.x}|${a.y}), B = (${b.x}|${b.y}). Wie groß ist der Abstand AB?`,
        unit: 'LE',
        answerKind: 'integer',
        value: dist,
        solution: `${dist}`,
        explanation: axisAligned
          ? a.y === b.y
            ? `Gleiche y-Koordinate: Abstand = |${b.x} − ${a.x}| = ${dist} LE.`
            : `Gleiche x-Koordinate: Abstand = |${b.y} − ${a.y}| = ${dist} LE.`
          : `d = √((${b.x}−${a.x})² + (${b.y}−${a.y})²) = ${dist} LE.`,
      })
    },
  ),
}

const sampleTriangle = (): Array<[number, number]> => [
  [1, 1],
  [3, 1],
  [2, 3],
]

const sampleQuad = (): Array<[number, number]> => [
  [1, 1],
  [3, 1],
  [3, 2],
  [1, 3],
]

const verschiebungFormen: Topic = {
  id: 'lb3-verschiebung',
  title: 'Verschiebung von Figuren',
  hint: 'Antwortformat für Vektor und Punkt: dx; dy bzw. x; y (positiv = rechts / oben). Auch Komma oder (x|y) sind ok.',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Eine Verschiebung (Translation) ist eine Kongruenzabbildung, bei der jeder Punkt der Figur um denselben Vektor verschoben wird. Der Verschiebungsvektor gibt an, um wie viele Einheiten nach rechts (positive x-Richtung) bzw. nach oben (positive y-Richtung) verschoben wird; negative Werte bedeuten nach links bzw. nach unten. Die Bildfigur ist deckungsgleich zur Ausgangsfigur und gleich orientiert.',
    quelle: 'Wikipedia: Verschiebung (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Verschiebung_(Geometrie)',
  },
  generate: mixedVariants(
    // Variant 1: Visual — figure + vector, ask where point A goes
    (rng: Rng) => {
      const useTri = rng() < 0.6
      const points = useTri ? sampleTriangle() : sampleQuad()
      let dx = randInt(rng, 1, 4)
      let dy = randInt(rng, 1, 3)
      if (rng() < 0.35) dx = -dx
      if (rng() < 0.35) dy = -dy
      // Keep image inside a small grid
      const ax = points[0][0]
      const ay = points[0][1]
      const bx = ax + dx
      const by = ay + dy
      if (bx < -4 || bx > 7 || by < -4 || by > 7) {
        dx = Math.abs(dx)
        dy = Math.abs(dy)
      }
      const tx = ax + dx
      const ty = ay + dy
      const describe =
        rng() < 0.5
          ? `um ${Math.abs(dx)} nach ${dx >= 0 ? 'rechts' : 'links'} und ${Math.abs(dy)} nach ${
              dy >= 0 ? 'oben' : 'unten'
            }`
          : `mit dem Vektor (${dx}|${dy})`
      const svg = generateTranslationSvg({
        points,
        dx,
        dy,
        showTranslated: false,
        showArrows: describe.includes('Vektor'),
        singleVectorArrow: true,
        xRange: [-5, 8],
        yRange: [-5, 8],
        labelVertices: true,
      })
      const accepted = pairAnswerAccepted(tx, ty)
      return {
        ...textTask({
          question: `Die Figur wird ${describe} verschoben. Wohin wandert Punkt A? Gib die Koordinaten als x; y an.`,
          accepted,
          solution: `${tx}; ${ty}`,
          explanation: `Punkt A liegt bei (${ax}|${ay}). Verschiebung um (${dx}|${dy}): neues x = ${ax} + (${dx}) = ${tx}, neues y = ${ay} + (${dy}) = ${ty}. Also (${tx}|${ty}).`,
        }),
        visualContent: svg,
      }
    },
    // Variant 2: Visual — original + image, ask for Verschiebungsvektor
    (rng: Rng) => {
      const useTri = rng() < 0.55
      const points = useTri ? sampleTriangle() : sampleQuad()
      let dx = randInt(rng, 1, 4)
      let dy = randInt(rng, 0, 3)
      if (rng() < 0.4) dx = -dx
      if (rng() < 0.4 && dy !== 0) dy = -dy
      const svg = generateTranslationSvg({
        points,
        dx,
        dy,
        showTranslated: true,
        showArrows: true,
        xRange: [-5, 8],
        yRange: [-5, 8],
        labelVertices: true,
      })
      const accepted = pairAnswerAccepted(dx, dy)
      return {
        ...textTask({
          question: `Die Figur F wird auf F' verschoben. Wie lautet der Verschiebungsvektor? Gib dx; dy an (positiv = rechts / oben).`,
          accepted,
          solution: `${dx}; ${dy}`,
          explanation: `Von A nach A' ändert sich x um ${dx} und y um ${dy}. Der Verschiebungsvektor ist also (${dx}|${dy}) bzw. ${dx}; ${dy}.`,
        }),
        visualContent: svg,
      }
    },
    // Variant 3: Text only — describe shift, ask for image of a point
    (rng: Rng) => {
      const x = randInt(rng, 0, 4)
      const y = randInt(rng, 0, 4)
      let dx = randInt(rng, 1, 4)
      let dy = randInt(rng, 1, 3)
      if (rng() < 0.3) dx = -dx
      if (rng() < 0.3) dy = -dy
      const tx = x + dx
      const ty = y + dy
      const rechtsLinks = dx >= 0 ? `${dx} nach rechts` : `${-dx} nach links`
      const obenUnten = dy >= 0 ? `${dy} nach oben` : `${-dy} nach unten`
      const accepted = pairAnswerAccepted(tx, ty)
      return textTask({
        question: `Eine Figur wird um ${rechtsLinks} und ${obenUnten} verschoben. Wohin gelangt der Punkt (${x}|${y})? Gib x; y an.`,
        accepted,
        solution: `${tx}; ${ty}`,
        explanation: `Neues x = ${x} + (${dx}) = ${tx}, neues y = ${y} + (${dy}) = ${ty}. Der Bildpunkt ist (${tx}|${ty}).`,
      })
    },
  ),
}

const AXIS_SHAPES: SymmetryShapeKind[] = [
  'square',
  'rectangle',
  'kite',
  'isoscelesTrapezoid',
  'equilateralTriangle',
  'isoscelesTriangle',
  'scaleneTriangle',
  'parallelogram',
]

const pickMirror = (rng: Rng): MirrorLineKind => {
  const kind = pick(rng, ['x-axis', 'y-axis', 'y=x', 'vertical', 'horizontal'] as const)
  if (kind === 'vertical') return { type: 'vertical', x: pick(rng, [0, 1, 2]) }
  if (kind === 'horizontal') return { type: 'horizontal', y: pick(rng, [0, 1, 2]) }
  return kind
}

const mirrorDescribe = (mirror: MirrorLineKind): string => {
  if (mirror === 'x-axis') return 'die x-Achse (Gerade s)'
  if (mirror === 'y-axis') return 'die y-Achse (Gerade s)'
  if (mirror === 'y=x') return 'die Gerade s mit y = x'
  if (mirror.type === 'vertical') return `die Gerade s mit x = ${mirror.x}`
  return `die Gerade s mit y = ${mirror.y}`
}

const symmetrieAchsen: Topic = {
  id: 'lb3-achsensymmetrie',
  title: 'Achsensymmetrie erkennen',
  hint: 'Eine Figur ist achsensymmetrisch, wenn sie an einer Geraden gespiegelt auf sich selbst fällt. Bildpunkt: x; y.',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Eine Figur heißt achsensymmetrisch, wenn es eine Gerade (Symmetrieachse) gibt, sodass die Figur durch Spiegelung an dieser Geraden auf sich selbst abgebildet wird. Jeder Punkt und sein Bildpunkt liegen spiegelbildlich zur Achse: die Verbindungsstrecke steht senkrecht auf der Achse und der Schnittpunkt ist der Mittelpunkt der Strecke. Viele bekannte Figuren besitzen eine oder mehrere Symmetrieachsen (z. B. Quadrat: 4, gleichseitiges Dreieck: 3, gleichschenkliges Trapez: 1).',
    quelle: 'Wikipedia: Achsensymmetrie',
    url: 'https://de.wikipedia.org/wiki/Achsensymmetrie',
  },
  generate: mixedVariants(
    // Variant 1: How many axes of symmetry?
    (rng: Rng) => {
      const shape = pick(rng, AXIS_SHAPES)
      const value = symmetryAxisCount(shape)
      const showAxes = rng() < 0.45 && value > 0
      const svg = generateSymmetryShapeSvg({
        shape,
        showAxes,
        showPointOfSymmetry: false,
        showWrongAxis: false,
      })
      return {
        ...valueTask({
          question: showAxes
            ? 'Wie viele Symmetrieachsen hat die Figur? (Die eingezeichneten grünen Geraden sind die Symmetrieachsen.)'
            : 'Wie viele Symmetrieachsen hat die Figur?',
          answerKind: 'integer',
          value,
          solution: `${value}`,
          explanation: `Die Figur ist ein ${symmetryShapeLabel(shape)}. Sie besitzt ${value} Symmetrieachse${value === 1 ? '' : 'n'}.`,
        }),
        visualContent: svg,
      }
    },
    // Variant 2: Is the figure axis-symmetric? (ja/nein)
    (rng: Rng) => {
      const shape = pick(rng, AXIS_SHAPES)
      const yes = symmetryAxisCount(shape) > 0
      const svg = generateSymmetryShapeSvg({ shape, showAxes: false })
      const askByName = rng() < 0.4
      const task = textTask({
        question: askByName
          ? `Ist ein ${symmetryShapeLabel(shape)} achsensymmetrisch? Antworte mit ja oder nein.`
          : 'Ist die Figur achsensymmetrisch? Antworte mit ja oder nein.',
        accepted: yes ? ['ja'] : ['nein'],
        solution: yes ? 'ja' : 'nein',
        explanation: yes
          ? `Ja. Ein ${symmetryShapeLabel(shape)} besitzt ${symmetryAxisCount(shape)} Symmetrieachse${symmetryAxisCount(shape) === 1 ? '' : 'n'}.`
          : `Nein. Ein ${symmetryShapeLabel(shape)} besitzt keine Spiegelachse (keine Achsensymmetrie).`,
      })
      if (askByName) return task
      return { ...task, visualContent: svg }
    },
    // Variant 3: Reflect point A across mirror line s
    (rng: Rng) => {
      const mirror = pickMirror(rng)
      const ax = randInt(rng, 1, 4)
      const ay = randInt(rng, 1, 4)
      // Keep A off the mirror when possible
      let A: [number, number] = [ax, ay]
      if (mirror === 'x-axis') A = [ax, Math.max(1, ay)]
      if (mirror === 'y-axis') A = [Math.max(1, ax), ay]
      if (mirror === 'y=x' && ax === ay) A = [ax, ay + 1]
      if (typeof mirror === 'object' && mirror.type === 'vertical' && A[0] === mirror.x) {
        A = [A[0] + 1, A[1]]
      }
      if (typeof mirror === 'object' && mirror.type === 'horizontal' && A[1] === mirror.y) {
        A = [A[0], A[1] + 1]
      }
      const [tx, ty] = reflectPointAcross(A, mirror)
      // Small triangle for context; first vertex is A
      const points: Array<[number, number]> = [A, [A[0] + 2, A[1]], [A[0] + 1, A[1] + 2]]
      const svg = generateReflectionSvg({
        points,
        mirror,
        showImage: false,
        xRange: [-5, 8],
        yRange: [-5, 8],
        labelVertices: true,
      })
      const accepted = pairAnswerAccepted(tx, ty)
      return {
        ...textTask({
          question: `Spiegle Punkt A an ${mirrorDescribe(mirror)}. Gib die Koordinaten von A' als x; y an.`,
          accepted,
          solution: `${tx}; ${ty}`,
          explanation: `A liegt bei (${A[0]}|${A[1]}). Spiegelung an ${mirrorDescribe(mirror)} liefert A' = (${tx}|${ty}).`,
        }),
        visualContent: svg,
      }
    },
  ),
}

const symmetriePunkt: Topic = {
  id: 'lb3-punktsymmetrie',
  title: 'Punktsymmetrie / Punktspiegelung',
  hint: 'Punktspiegelung an S: A\' = 2S − A. Antwortformat x; y (auch Komma oder (x|y)).',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Punktsymmetrie (Punktspiegelung) ist eine Kongruenzabbildung: Jeder Punkt A wird so auf A\' abgebildet, dass der Punkt S der Mittelpunkt der Strecke AA\' ist. Rechnerisch gilt A\' = 2S − A, also x\' = 2·sx − x und y\' = 2·sy − y. Eine Punktspiegelung entspricht einer Drehung um 180° um S. Figuren, die durch Punktspiegelung an einem inneren Punkt auf sich selbst fallen, heißen punktsymmetrisch.',
    quelle: 'Wikipedia: Punktsymmetrie',
    url: 'https://de.wikipedia.org/wiki/Punktsymmetrie',
  },
  generate: mixedVariants(
    // Variant 1: Visual — A and S given, find A' (image hidden)
    (rng: Rng) => {
      const sx = randInt(rng, 0, 2)
      const sy = randInt(rng, 0, 2)
      const ax = randInt(rng, 1, 4)
      const ay = randInt(rng, 1, 4)
      const A: [number, number] = ax === sx && ay === sy ? [ax + 1, ay + 1] : [ax, ay]
      const S: [number, number] = [sx, sy]
      const [tx, ty] = pointReflectAcross(A, S)
      const points: Array<[number, number]> = [A, [A[0] + 2, A[1]], [A[0] + 1, A[1] + 2]]
      const svg = generatePointReflectionSvg({
        points,
        center: S,
        showImage: false,
        xRange: [-5, 8],
        yRange: [-5, 8],
        labelVertices: true,
      })
      const accepted = pairAnswerAccepted(tx, ty)
      return {
        ...textTask({
          question: `Spiegle Punkt A am Punkt S. Gib die Koordinaten von A' als x; y an.`,
          accepted,
          solution: `${tx}; ${ty}`,
          explanation: `S = (${sx}|${sy}), A = (${A[0]}|${A[1]}). A' = 2S − A = (${2 * sx} − ${A[0]}|${2 * sy} − ${A[1]}) = (${tx}|${ty}).`,
        }),
        visualContent: svg,
      }
    },
    // Variant 2: Show original + image, ask for S or for A'
    (rng: Rng) => {
      const sx = randInt(rng, 0, 2)
      const sy = randInt(rng, 0, 2)
      const A: [number, number] = [randInt(rng, 1, 4), randInt(rng, 1, 4)]
      if (A[0] === sx && A[1] === sy) A[0] += 1
      const S: [number, number] = [sx, sy]
      const [apx, apy] = pointReflectAcross(A, S)
      const points: Array<[number, number]> = [A, [A[0] + 2, A[1]], [A[0] + 1, A[1] + 2]]
      const askS = rng() < 0.5
      const svg = generatePointReflectionSvg({
        points,
        center: S,
        showImage: true,
        xRange: [-5, 8],
        yRange: [-5, 8],
        labelVertices: true,
        // When asking for S, still show S label — students read from figure.
        // For variety: when asking A', S is labeled; when asking S, both A and A' shown.
      })
      if (askS) {
        const accepted = pairAnswerAccepted(sx, sy)
        return {
          ...textTask({
            question: `Die Figur F wird durch Punktspiegelung auf F' abgebildet. Lies die Koordinaten des Symmetriezentrums S ab (x; y).`,
            accepted,
            solution: `${sx}; ${sy}`,
            explanation: `S ist der Mittelpunkt von A und A': ((${A[0]}+${apx})/2 | (${A[1]}+${apy})/2) = (${sx}|${sy}).`,
          }),
          visualContent: svg,
        }
      }
      const accepted = pairAnswerAccepted(apx, apy)
      return {
        ...textTask({
          question: `Die Figur wird am Punkt S punktgespiegelt. Welche Koordinaten hat A'? Gib x; y an.`,
          accepted,
          solution: `${apx}; ${apy}`,
          explanation: `A' = 2S − A = (${2 * sx} − ${A[0]}|${2 * sy} − ${A[1]}) = (${apx}|${apy}).`,
        }),
        visualContent: svg,
      }
    },
    // Variant 3: Text only — mirror a point across another point
    (rng: Rng) => {
      const ax = randInt(rng, -3, 4)
      const ay = randInt(rng, -3, 4)
      const sx = randInt(rng, -2, 2)
      const sy = randInt(rng, -2, 2)
      const [tx, ty] = pointReflectAcross([ax, ay], [sx, sy])
      const accepted = pairAnswerAccepted(tx, ty)
      return textTask({
        question: `Spiegle (${ax}|${ay}) am Punkt (${sx}|${sy}). Gib x; y an.`,
        accepted,
        solution: `${tx}; ${ty}`,
        explanation: `Punktspiegelung: x' = 2·${sx} − ${ax} = ${tx}, y' = 2·${sy} − ${ay} = ${ty}. Also (${tx}|${ty}).`,
      })
    },
  ),
}

/** Integer grid lengths and clean 3-4-5 diagonals for Strecken tasks. */
const pickIntegerSegment = (
  rng: Rng,
  bounds: { xMax: number; yMax: number } = { xMax: 8, yMax: 8 },
): { a: [number, number]; b: [number, number]; len: number } => {
  const kind = pick(rng, ['h', 'v', '345'] as const)
  if (kind === 'h') {
    const len = randInt(rng, 2, Math.min(6, bounds.xMax - 1))
    const ax = randInt(rng, 1, Math.max(1, bounds.xMax - len - 1))
    const ay = randInt(rng, 1, bounds.yMax - 1)
    return { a: [ax, ay], b: [ax + len, ay], len }
  }
  if (kind === 'v') {
    const len = randInt(rng, 2, Math.min(6, bounds.yMax - 1))
    const ax = randInt(rng, 1, bounds.xMax - 1)
    const ay = randInt(rng, 1, Math.max(1, bounds.yMax - len - 1))
    return { a: [ax, ay], b: [ax, ay + len], len }
  }
  // 3-4-5 triangle — keep both ends inside [1, bounds]
  const flip = rng() < 0.5
  const dx = flip ? 3 : 4
  const dy = flip ? 4 : 3
  const ax = randInt(rng, 1, Math.max(1, bounds.xMax - dx - 1))
  const ay = randInt(rng, 1, Math.max(1, bounds.yMax - dy - 1))
  return { a: [ax, ay], b: [ax + dx, ay + dy], len: 5 }
}

const streckenLaenge: Topic = {
  id: 'lb3-strecken-laenge',
  title: 'Länge von Strecken',
  hint: '1 Kästchen = 1 Längeneinheit (cm). Länge = Abstand der Endpunkte.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Eine Strecke ist die kürzeste Verbindung zweier Punkte und hat eine bestimmte Länge. Die Länge einer Strecke AB ist der Abstand der Endpunkte A und B. Auf einem Koordinatenraster mit Kästchenlänge 1 cm misst man horizontale und vertikale Strecken durch Abzählen der Kästchen; bei schrägen Strecken gilt der Satz des Pythagoras (z. B. 3–4–5). Geraden und Halbgeraden sind unbegrenzt und haben keine endliche Länge.',
    quelle: 'Wikipedia: Strecke (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Strecke_(Geometrie)',
  },
  generate: mixedVariants(
    // Variant 1: Always on Kästchenpapier
    (rng: Rng) => {
      const { a, b, len } = pickIntegerSegment(rng)
      const svg = generateSegmentsOnGridSvg({
        segments: [{ a, b, labelA: 'A', labelB: 'B' }],
        showSegments: true,
        showLengthLabels: false,
        xRange: [-1, 9],
        yRange: [-1, 9],
      })
      return {
        ...valueTask({
          question: 'Wie lang ist die Strecke AB? (1 Kästchen = 1 cm)',
          unit: 'cm',
          answerKind: 'integer',
          value: len,
          solution: `${len} cm`,
          explanation: `Die Endpunkte sind A(${a[0]}|${a[1]}) und B(${b[0]}|${b[1]}). Länge = √((${b[0]}−${a[0]})² + (${b[1]}−${a[1]})²) = ${len} cm.`,
        }),
        visualContent: svg,
      }
    },
    // Variant 2: Two segments on grid — which is longer?
    (rng: Rng) => {
      let lenAB = randInt(rng, 2, 6)
      let lenCD = randInt(rng, 2, 6)
      if (lenAB === lenCD) lenCD = lenAB === 6 ? 5 : lenAB + 1
      const longer = lenAB > lenCD ? 'AB' : 'CD'
      const ay = randInt(rng, 5, 7)
      const cy = randInt(rng, 1, 3)
      const svg = generateSegmentsOnGridSvg({
        segments: [
          { a: [1, ay], b: [1 + lenAB, ay], labelA: 'A', labelB: 'B' },
          { a: [1, cy], b: [1 + lenCD, cy], labelA: 'C', labelB: 'D' },
        ],
        showSegments: true,
        showLengthLabels: false,
        xRange: [-1, 9],
        yRange: [-1, 9],
      })
      return choicePickTask({
        question: 'Welche Strecke ist länger? (1 Kästchen = 1 cm)',
        choices: ['AB', 'CD'],
        correct: longer,
        solution: longer,
        explanation: `AB ist ${lenAB} cm lang, CD ist ${lenCD} cm lang. Also ist ${longer} länger.`,
        visualContent: svg,
        instruction: 'Tippe die längere Strecke:',
      })
    },
    // Variant 3: Text — horizontal/vertical distance described in words
    (rng: Rng) => {
      const horizontal = rng() < 0.5
      const ax = randInt(rng, 0, 4)
      const ay = randInt(rng, 0, 4)
      const len = randInt(rng, 2, 7)
      const bx = horizontal ? ax + len : ax
      const by = horizontal ? ay : ay + len
      const dir = horizontal
        ? `${len} Einheiten nach rechts`
        : `${len} Einheiten nach oben`
      return valueTask({
        question: `Punkt A liegt bei (${ax}|${ay}). Punkt B liegt ${dir} von A entfernt. Wie lang ist die Strecke AB?`,
        unit: 'LE',
        answerKind: 'integer',
        value: len,
        solution: `${len}`,
        explanation: `B liegt bei (${bx}|${by}). Bei einer ${
          horizontal ? 'waagerechten' : 'senkrechten'
        } Strecke ist die Länge der Abstand der ${horizontal ? 'x' : 'y'}-Koordinaten: |${
          horizontal ? `${bx} − ${ax}` : `${by} − ${ay}`
        }| = ${len}.`,
      })
    },
  ),
}

const streckenMittelpunkt: Topic = {
  id: 'lb3-strecken-mittelpunkt',
  title: 'Mittelpunkt einer Strecke',
  hint: 'Mittelpunkt M = ((x₁+x₂)/2 ; (y₁+y₂)/2). Antwortformat: x; y.',
  pointsPerTask: 10,
  difficulty: 2,
  fachwissen: {
    text: 'Der Mittelpunkt M einer Strecke AB ist der Punkt, der von A und B denselben Abstand hat und auf der Strecke liegt. In Koordinaten gilt: M = ((x_A + x_B) : 2 | (y_A + y_B) : 2). Der Mittelpunkt halbiert die Strecke: AM = MB = ½ · AB.',
    quelle: 'Wikipedia: Mittelpunkt',
    url: 'https://de.wikipedia.org/wiki/Mittelpunkt',
  },
  generate: mixedVariants(
    // Variant 1: Visual — keep both endpoints inside the drawn grid
    (rng: Rng) => {
      const xMax = 8
      const yMax = 8
      const halfDx = randInt(rng, 1, 3)
      const halfDy = rng() < 0.4 ? 0 : randInt(rng, 0, 2)
      const ax = randInt(rng, 0, xMax - 2 * halfDx)
      const ay = randInt(rng, 0, yMax - 2 * halfDy)
      const bx = ax + 2 * halfDx
      const by = ay + 2 * halfDy
      const mx = (ax + bx) / 2
      const my = (ay + by) / 2
      const svg = generateSegmentsOnGridSvg({
        segments: [{ a: [ax, ay], b: [bx, by], labelA: 'A', labelB: 'B' }],
        showSegments: true,
        showLengthLabels: false,
        xRange: [-1, 9],
        yRange: [-1, 9],
      })
      const accepted = pairAnswerAccepted(mx, my)
      return {
        ...textTask({
          question:
            'Welchen Mittelpunkt hat die Strecke AB? Gib die Koordinaten als x; y an.',
          accepted,
          solution: `${mx}; ${my}`,
          explanation: `M = ((${ax}+${bx})/2 | (${ay}+${by})/2) = (${mx}|${my}).`,
        }),
        visualContent: svg,
      }
    },
    // Variant 2: Text only — given coordinates
    (rng: Rng) => {
      const ax = randInt(rng, -2, 4)
      const ay = randInt(rng, -2, 4)
      const bx = ax + 2 * randInt(rng, 1, 3)
      const by = ay + 2 * randInt(rng, -2, 2)
      const mx = (ax + bx) / 2
      const my = (ay + by) / 2
      const accepted = pairAnswerAccepted(mx, my)
      return textTask({
        question: `A = (${ax}|${ay}), B = (${bx}|${by}). Wie lautet der Mittelpunkt der Strecke AB? Gib x; y an.`,
        accepted,
        solution: `${mx}; ${my}`,
        explanation: `M = ((${ax}+${bx})/2 | (${ay}+${by})/2) = (${mx}|${my}).`,
      })
    },
  ),
}

const LINE_KIND_LABEL: Record<LineFigureKind, string> = {
  strecke: 'Strecke',
  halbgerade: 'Halbgerade',
  gerade: 'Gerade',
}

const LINE_KIND_CHOICES = ['Strecke', 'Halbgerade', 'Gerade']

const streckenBezeichnung: Topic = {
  id: 'lb3-strecken-bezeichnung',
  title: 'Strecke, Gerade und Halbgerade',
  hint: 'Strecke: begrenzt; Halbgerade: ein Endpunkt; Gerade: unbegrenzt in beide Richtungen.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Eine Strecke ist durch zwei Endpunkte begrenzt und hat eine endliche Länge. Eine Halbgerade (Strahl) hat genau einen Anfangspunkt und verläuft von dort unbegrenzt in eine Richtung. Eine Gerade verläuft in beide Richtungen unbegrenzt und hat weder Anfang noch Ende. Zwei Punkte bestimmen eindeutig eine Gerade; die Verbindungsstrecke ist der begrenzte Teil dazwischen.',
    quelle: 'Wikipedia: Gerade',
    url: 'https://de.wikipedia.org/wiki/Gerade',
  },
  generate: mixedVariants(
    // Variant 1: Identify from diagram — tippen
    (rng: Rng) => {
      const kind = pick(rng, ['strecke', 'halbgerade', 'gerade'] as LineFigureKind[])
      const svg = generateRayOrLineSvg({ kind })
      const solution = LINE_KIND_LABEL[kind]
      return choicePickTask({
        question: 'Was zeigt die Abbildung?',
        choices: LINE_KIND_CHOICES,
        correct: solution,
        solution,
        explanation:
          kind === 'strecke'
            ? 'Die Figur ist zwischen A und B begrenzt — das ist eine Strecke.'
            : kind === 'halbgerade'
              ? 'Die Figur beginnt bei A und geht durch B mit Pfeil weiter — das ist eine Halbgerade (Strahl).'
              : 'Die Figur geht in beide Richtungen mit Pfeilen weiter — das ist eine Gerade.',
        visualContent: svg,
        instruction: 'Tippe die passende Bezeichnung:',
      })
    },
    // Variant 2: Text definition — tippen
    (rng: Rng) => {
      const kind = pick(rng, ['strecke', 'halbgerade', 'gerade'] as LineFigureKind[])
      const question =
        kind === 'strecke'
          ? 'Wie heißt die Verbindung zweier Punkte, die durch die beiden Endpunkte begrenzt ist und eine Länge hat?'
          : kind === 'halbgerade'
            ? 'Wie heißt eine Linie, die bei einem Punkt beginnt und in eine Richtung unbegrenzt weitergeht?'
            : 'Wie heißt eine Linie, die in beide Richtungen unbegrenzt verläuft?'
      const solution = LINE_KIND_LABEL[kind]
      return choicePickTask({
        question,
        choices: LINE_KIND_CHOICES,
        correct: solution,
        solution,
        explanation: `Die gesuchte Bezeichnung ist: ${solution}.`,
        instruction: 'Tippe die passende Bezeichnung:',
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 4 — Rechtecke und Quader
// ---------------------------------------------------------------------------

const umfangRechteck: Topic = {
  id: 'lb4-umfang-rechteck',
  title: 'Umfang von Rechteck und Quadrat',
  hint: 'U = 2 · (a + b), beim Quadrat U = 4 · a.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Der Umfang eines Vielecks ist die Länge seiner Begrenzungslinie, also die Summe aller Seiten. Beim Rechteck mit Länge a und Breite b gilt: U = 2 · (a + b). Beim Quadrat mit Seite a gilt: U = 4 · a. Der Umfang hat immer die gleiche Maßeinheit wie die Längen der Seiten.',
    quelle: 'Wikipedia: Umfang (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Umfang_(Geometrie)',
  },
  generate: mixedVariants(
    // Variant 1: Text-only
    (rng: Rng) => {
      const square = rng() < 0.4
      const a = randInt(rng, 2, 20)
      const b = square ? a : randInt(rng, 2, 20)
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
          ? `Umfang eines Quadrats = 4 · Seite = 4 · ${a} cm = ${value} cm.`
          : `Umfang = 2 · (Länge + Breite) = 2 · (${a} + ${b}) cm = 2 · ${a + b} cm = ${value} cm.`,
      })
    },
    // Variant 2: Mit SVG
    (rng: Rng) => {
      const square = rng() < 0.4
      const a = randInt(rng, 3, 18)
      const b = square ? a : randInt(rng, 3, 18)
      const value = 2 * (a + b)
      const svg = generateRectangleSvg({
        widthLabel: `${a} m`,
        heightLabel: `${b} m`,
      })
      return visualTask({
        question: square
          ? 'Berechne den Umfang des abgebildeten Quadrats:'
          : 'Berechne den Umfang des abgebildeten Rechtecks:',
        unit: 'm',
        answerKind: 'integer',
        value,
        visualContent: svg,
        solution: `${value} m`,
        explanation: square
          ? `Umfang = 4 · ${a} m = ${value} m.`
          : `Umfang = 2 · (${a} + ${b}) m = ${value} m.`,
      })
    },
    // Variant 3: Sachaufgabe mit Zaun/Rahmen
    (rng: Rng) => {
      const a = randInt(rng, 4, 15)
      const b = randInt(rng, 4, 15)
      const value = 2 * (a + b)
      const contexts = [
        'Du möchtest einen rechteckigen Garten ({a} m × {b} m) einzäunen. Wie viel Meter Zaun brauchst du?',
        'Ein Bilderrahmen für ein Foto ({a} cm × {b} cm) soll gebaut werden. Wie lang muss die Leiste insgesamt sein?',
        'Ein rechteckiges Grundstück ({a} m × {b} m) soll mit einer Hecke umrandet werden. Wie viele Meter Hecke brauchst du?',
      ]
      const q = pick(rng, contexts).replace('{a}', String(a)).replace('{b}', String(b))
      const unit = q.includes('cm') ? 'cm' : 'm'
      return valueTask({
        question: q,
        unit,
        answerKind: 'integer',
        value,
        solution: `${value} ${unit}`,
        explanation: `Umfang = 2 · (${a} + ${b}) = ${value} ${unit}.`,
      })
    },
  ),
}

const flaecheRechteck: Topic = {
  id: 'lb4-flaeche-rechteck',
  title: 'Flächeninhalt von Rechteck und Quadrat',
  hint: 'A = a · b, beim Quadrat A = a · a.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Der Flächeninhalt gibt an, wie groß die von einer ebenen Figur begrenzte Fläche ist. Beim Rechteck gilt: A = a · b (Länge × Breite). Beim Quadrat gilt: A = a². Flächeneinheiten sind die Quadrate der Längeneinheiten: 1 m² = 100 dm² = 10 000 cm² = 1 000 000 mm².',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    // Variant 1: Text-only (einfach)
    (rng: Rng) => {
      const square = rng() < 0.4
      const a = randInt(rng, 2, 15)
      const b = square ? a : randInt(rng, 2, 15)
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
          ? `Flächeninhalt eines Quadrats = Seite · Seite = ${a} · ${a} cm² = ${value} cm².`
          : `Flächeninhalt = Länge · Breite = ${a} cm · ${b} cm = ${value} cm².`,
      })
    },
    // Variant 2: Mit SVG-Diagramm
    (rng: Rng) => {
      const square = rng() < 0.4
      const a = randInt(rng, 3, 20)
      const b = square ? a : randInt(rng, 3, 20)
      const value = a * b
      const svg = generateRectangleSvg({
        widthLabel: `${a} cm`,
        heightLabel: `${b} cm`,
      })
      return visualTask({
        question: square
          ? `Berechne den Flächeninhalt des abgebildeten Quadrats:`
          : `Berechne den Flächeninhalt des abgebildeten Rechtecks:`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        visualContent: svg,
        solution: `${value} cm²`,
        explanation: square
          ? `Flächeninhalt = ${a} · ${a} cm² = ${value} cm².`
          : `Flächeninhalt = ${a} · ${b} cm² = ${value} cm².`,
      })
    },
    // Variant 3: Sachaufgabe
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const b = randInt(rng, 3, 12)
      const value = a * b
      const contexts = [
        { noun: 'Zimmer', verb: 'streichen', unit: 'm²' },
        { noun: 'Garten', verb: 'bepflanzen', unit: 'm²' },
        { noun: 'Teppich', verb: 'verlegen', unit: 'm²' },
        { noun: 'Wandfläche', verb: 'tapezieren', unit: 'm²' },
      ]
      const ctx = pick(rng, contexts)
      return valueTask({
        question: `Ein rechteckiges ${ctx.noun} ist ${a} m lang und ${b} m breit. Wie groß ist die Fläche, die man ${ctx.verb} muss?`,
        unit: ctx.unit,
        answerKind: 'integer',
        value,
        solution: `${value} ${ctx.unit}`,
        explanation: `Fläche = Länge · Breite = ${a} m · ${b} m = ${value} m².`,
      })
    },
  ),
}

const volumenQuader: Topic = {
  id: 'lb4-volumen-quader',
  title: 'Volumen von Quader und Würfel',
  hint: 'V = a · b · c, beim Würfel V = a · a · a.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Das Volumen (Rauminhalt) eines Körpers gibt an, wie viel dreidimensionalen Raum er einnimmt. Beim Quader mit Länge a, Breite b und Höhe c gilt: V = a · b · c. Beim Würfel (a = b = c) gilt: V = a³. Volumeneinheiten sind die Kuben der Längeneinheiten: 1 m³ = 1 000 dm³ = 1 000 000 cm³.',
    quelle: 'Wikipedia: Volumen',
    url: 'https://de.wikipedia.org/wiki/Volumen',
  },
  generate: mixedVariants(
    // Variant 1: Text only - Würfel
    (rng: Rng) => {
      const a = randInt(rng, 2, 12)
      const value = a * a * a
      return valueTask({
        question: `Ein Würfel hat die Kantenlänge ${a} cm. Berechne sein Volumen.`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Volumen eines Würfels = Kante · Kante · Kante = ${a} · ${a} · ${a} cm³ = ${value} cm³.`,
      })
    },
    // Variant 2: Grafisch - Quader mit 3D-SVG
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const b = randInt(rng, 3, 12)
      const c = randInt(rng, 3, 12)
      const value = a * b * c
      const svg = generateCuboidSvg({
        lengthLabel: `${a} cm`,
        widthLabel: `${b} cm`,
        heightLabel: `${c} cm`,
      })
      return visualTask({
        question: `Berechne das Volumen des abgebildeten Quaders:`,
        unit: 'cm³',
        answerKind: 'integer',
        value,
        solution: `${value} cm³`,
        explanation: `Volumen = Länge · Breite · Höhe = ${a} · ${b} · ${c} cm³ = ${value} cm³.`,
        visualContent: svg,
      })
    },
    // Variant 3: Sachaufgabe
    (rng: Rng) => {
      const a = randInt(rng, 2, 8)
      const b = randInt(rng, 2, 8)
      const c = randInt(rng, 2, 8)
      const value = a * b * c
      const contexts = [
        { item: 'Aquarium', unit: 'dm', volUnit: 'Liter' },
        { item: 'Karton', unit: 'dm', volUnit: 'Liter' },
        { item: 'Schuhkarton', unit: 'cm', volUnit: 'cm³' },
        { item: 'Kiste', unit: 'dm', volUnit: 'Liter' },
      ]
      const ctx = pick(rng, contexts)
      return valueTask({
        question: `Ein ${ctx.item} ist ${a} ${ctx.unit}, ${b} ${ctx.unit} und ${c} ${ctx.unit} groß. Wie viel ${ctx.volUnit} passen hinein?`,
        unit: ctx.volUnit,
        answerKind: 'integer',
        value,
        solution: `${value} ${ctx.volUnit}`,
        explanation: `Volumen = ${a} · ${b} · ${c} ${ctx.unit}³ = ${value} ${ctx.volUnit}.`,
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
    text: 'Die Oberfläche eines Körpers ist die Summe der Flächeninhalte aller Seitenflächen. Beim Quader mit Länge a, Breite b und Höhe c gilt: O = 2 · (a · b + a · c + b · c). Ein Quader hat drei Paare gleich großer gegenüberliegender Flächen. Die Oberfläche wird benötigt, um z. B. den Materialbedarf für eine Verpackung zu berechnen.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    // Variant 1: Text only
    (rng: Rng) => {
      const a = randInt(rng, 2, 12)
      const b = randInt(rng, 2, 12)
      const c = randInt(rng, 2, 12)
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
    // Variant 2: Grafisch - mit 3D-SVG
    (rng: Rng) => {
      const a = randInt(rng, 3, 10)
      const b = randInt(rng, 3, 10)
      const c = randInt(rng, 3, 10)
      const value = 2 * (a * b + a * c + b * c)
      const svg = generateCuboidSvg({
        lengthLabel: `${a} dm`,
        widthLabel: `${b} dm`,
        heightLabel: `${c} dm`,
      })
      return visualTask({
        question: `Berechne die Oberfläche des abgebildeten Quaders:`,
        unit: 'dm²',
        answerKind: 'integer',
        value,
        solution: `${value} dm²`,
        explanation: `Oberfläche = 2 · (a·b + a·c + b·c) = 2 · (${a * b} + ${a * c} + ${b * c}) dm² = ${value} dm².`,
        visualContent: svg,
      })
    },
    // Variant 3: Sachaufgabe
    (rng: Rng) => {
      const a = randInt(rng, 3, 12)
      const b = randInt(rng, 3, 12)
      const c = randInt(rng, 3, 12)
      const value = 2 * (a * b + a * c + b * c)
      const contexts = [
        'Du willst einen Karton',
        'Eine Geschenkbox',
        'Ein Aquarium',
        'Eine Kiste',
      ]
      const ctx = pick(rng, contexts)
      return valueTask({
        question: `${ctx} (${a} cm × ${b} cm × ${c} cm) soll komplett mit Papier beklebt werden. Wie viel cm² Papier brauchst du?`,
        unit: 'cm²',
        answerKind: 'integer',
        value,
        solution: `${value} cm²`,
        explanation: `Oberfläche = 2 · (${a}·${b} + ${a}·${c} + ${b}·${c}) cm² = 2 · ${
          a * b + a * c + b * c
        } cm² = ${value} cm².`,
      })
    },
  ),
}

/** Pick L-shape dimensions so the cutout fits strictly inside. */
const randomLDims = (rng: Rng) => {
  const outerWidth = randInt(rng, 6, 14)
  const outerHeight = randInt(rng, 5, 12)
  const cutWidth = randInt(rng, 2, outerWidth - 2)
  const cutHeight = randInt(rng, 2, outerHeight - 2)
  const stemWidth = outerWidth - cutWidth
  const footHeight = outerHeight - cutHeight
  const area = outerWidth * outerHeight - cutWidth * cutHeight
  // L-perimeter equals bounding rectangle perimeter when cut from a corner
  const perimeter = 2 * (outerWidth + outerHeight)
  return { outerWidth, outerHeight, cutWidth, cutHeight, stemWidth, footHeight, area, perimeter }
}

const flaecheZusammengesetzt: Topic = {
  id: 'lb4-flaeche-zusammengesetzt',
  title: 'Zusammengesetzte Flächen: Fläche berechnen',
  hint: 'Zerlege die Figur in Rechtecke oder ziehe die Aussparung ab.',
  pointsPerTask: 12,
  difficulty: 2,
  fachwissen: {
    text: 'Zusammengesetzte Flächen (z. B. L-Formen) berechnet man, indem man die Figur in bekannte Teilflächen zerlegt und deren Flächeninhalte addiert – oder indem man von einem großen Rechteck eine Aussparung abzieht. Beide Wege führen zum gleichen Ergebnis: A = A₁ + A₂ bzw. A = A_groß − A_Aussparung.',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: mixedVariants(
    // Text: L als Summe zweier Rechtecke
    (rng: Rng) => {
      const d = randomLDims(rng)
      const a1 = d.stemWidth * d.outerHeight
      const a2 = d.cutWidth * d.footHeight
      return valueTask({
        question: `Eine L-förmige Figur besteht aus zwei Rechtecken: ${d.stemWidth} m × ${d.outerHeight} m und ${d.cutWidth} m × ${d.footHeight} m. Berechne den Flächeninhalt.`,
        unit: 'm²',
        answerKind: 'integer',
        value: d.area,
        solution: `${d.area} m²`,
        explanation: `A = ${d.stemWidth}·${d.outerHeight} + ${d.cutWidth}·${d.footHeight} = ${a1} + ${a2} = ${d.area} m².`,
      })
    },
    // Text: großes Rechteck minus Aussparung
    (rng: Rng) => {
      const d = randomLDims(rng)
      return valueTask({
        question: `Von einem Rechteck ${d.outerWidth} m × ${d.outerHeight} m wird oben rechts ein Rechteck ${d.cutWidth} m × ${d.cutHeight} m ausgeschnitten. Wie groß ist die verbleibende Fläche?`,
        unit: 'm²',
        answerKind: 'integer',
        value: d.area,
        solution: `${d.area} m²`,
        explanation: `A = ${d.outerWidth}·${d.outerHeight} − ${d.cutWidth}·${d.cutHeight} = ${d.outerWidth * d.outerHeight} − ${d.cutWidth * d.cutHeight} = ${d.area} m².`,
      })
    },
    // Visual: L-Form
    (rng: Rng) => {
      const d = randomLDims(rng)
      const svg = generateLShapeSvg({
        outerWidth: d.outerWidth,
        outerHeight: d.outerHeight,
        cutWidth: d.cutWidth,
        cutHeight: d.cutHeight,
        bottomLabel: `${d.outerWidth} m`,
        leftLabel: `${d.outerHeight} m`,
        topLabel: `${d.stemWidth} m`,
        rightLabel: `${d.footHeight} m`,
      })
      return visualTask({
        question: 'Berechne den Flächeninhalt der abgebildeten L-Form.',
        unit: 'm²',
        answerKind: 'integer',
        value: d.area,
        solution: `${d.area} m²`,
        explanation: `Zerlegung: A = ${d.stemWidth}·${d.outerHeight} + ${d.cutWidth}·${d.footHeight} = ${d.area} m².\nOder: A = ${d.outerWidth}·${d.outerHeight} − ${d.cutWidth}·${d.cutHeight} = ${d.area} m².`,
        visualContent: svg,
      })
    },
    // Visual: U-Form
    (rng: Rng) => {
      const outerWidth = pick(rng, [8, 10, 12])
      const outerHeight = randInt(rng, 5, 9)
      const notchWidth = pick(rng, [2, 4].filter((n) => n <= outerWidth / 2))
      const notchHeight = randInt(rng, 2, outerHeight - 2)
      const side = (outerWidth - notchWidth) / 2
      const area = outerWidth * outerHeight - notchWidth * notchHeight
      const svg = generateUShapeSvg({
        outerWidth,
        outerHeight,
        notchWidth,
        notchHeight,
        bottomLabel: `${outerWidth} m`,
        leftLabel: `${outerHeight} m`,
        rightLabel: `${outerHeight} m`,
        topLeftLabel: `${side} m`,
        topRightLabel: `${side} m`,
      })
      return visualTask({
        question: 'Berechne den Flächeninhalt der abgebildeten U-Form.',
        unit: 'm²',
        answerKind: 'integer',
        value: area,
        solution: `${area} m²`,
        explanation: `A = ${outerWidth}·${outerHeight} − ${notchWidth}·${notchHeight} = ${outerWidth * outerHeight} − ${notchWidth * notchHeight} = ${area} m².`,
        visualContent: svg,
      })
    },
  ),
}

const umfangZusammengesetzt: Topic = {
  id: 'lb4-umfang-zusammengesetzt',
  title: 'Zusammengesetzte Flächen: Umfang berechnen',
  hint: 'Addiere alle äußeren Kanten. Bei einer Eckaussparung gilt: U = 2 · (Länge + Breite).',
  pointsPerTask: 12,
  difficulty: 2,
  fachwissen: {
    text: 'Der Umfang einer zusammengesetzten Figur ist die Länge ihrer äußeren Begrenzungslinie. Wird aus einem Rechteck an einer Ecke ein kleineres Rechteck ausgeschnitten, bleibt der Umfang gleich dem des Ausgangsrechtecks: U = 2 · (a + b). Die beiden entfernten Außenkanten werden durch zwei gleich lange Innenkanten ersetzt.',
    quelle: 'Wikipedia: Umfang (Geometrie)',
    url: 'https://de.wikipedia.org/wiki/Umfang_(Geometrie)',
  },
  generate: mixedVariants(
    (rng: Rng) => {
      const d = randomLDims(rng)
      return valueTask({
        question: `Eine L-Form entsteht, indem man aus einem Rechteck ${d.outerWidth} m × ${d.outerHeight} m oben rechts ein Rechteck ${d.cutWidth} m × ${d.cutHeight} m ausschneidet. Berechne den Umfang der L-Form.`,
        unit: 'm',
        answerKind: 'integer',
        value: d.perimeter,
        solution: `${d.perimeter} m`,
        explanation: `Bei einer Eckaussparung bleibt der Umfang gleich dem des großen Rechtecks: U = 2 · (${d.outerWidth} + ${d.outerHeight}) = ${d.perimeter} m.`,
      })
    },
    (rng: Rng) => {
      const d = randomLDims(rng)
      const svg = generateLShapeSvg({
        outerWidth: d.outerWidth,
        outerHeight: d.outerHeight,
        cutWidth: d.cutWidth,
        cutHeight: d.cutHeight,
        bottomLabel: `${d.outerWidth} m`,
        leftLabel: `${d.outerHeight} m`,
        topLabel: `${d.stemWidth} m`,
        rightLabel: `${d.footHeight} m`,
        innerHorizontalLabel: `${d.cutWidth} m`,
        innerVerticalLabel: `${d.cutHeight} m`,
      })
      return visualTask({
        question: 'Berechne den Umfang der abgebildeten L-Form.',
        unit: 'm',
        answerKind: 'integer',
        value: d.perimeter,
        solution: `${d.perimeter} m`,
        explanation: `Alle äußeren Kanten: U = 2 · (${d.outerWidth} + ${d.outerHeight}) = ${d.perimeter} m.`,
        visualContent: svg,
      })
    },
  ),
}

/** Dimensions for an L-shaped solid (constant height). */
const randomCompositeCuboid = (rng: Rng) => {
  const length = randInt(rng, 6, 12)
  const width = randInt(rng, 4, 10)
  const height = randInt(rng, 2, 6)
  const cutLength = randInt(rng, 2, length - 2)
  const cutWidth = randInt(rng, 2, width - 2)
  const stemLength = length - cutLength
  const footWidth = width - cutWidth
  const volume = (length * width - cutLength * cutWidth) * height
  // Two-cuboid decomposition volumes
  const v1 = stemLength * width * height
  const v2 = cutLength * footWidth * height
  return { length, width, height, cutLength, cutWidth, stemLength, footWidth, volume, v1, v2 }
}

const volumenZusammengesetzt: Topic = {
  id: 'lb4-volumen-zusammengesetzt',
  title: 'Zusammengesetzte Quader: Volumen',
  hint: 'Zerlege in zwei Quader und addiere die Volumina – oder ziehe die Aussparung ab.',
  pointsPerTask: 12,
  difficulty: 2,
  fachwissen: {
    text: 'Zusammengesetzte Körper aus Quadern berechnet man analog zu zusammengesetzten Flächen: Entweder zerlegt man den Körper in Quader und addiert die Volumina (V = V₁ + V₂), oder man zieht von einem großen Quader eine Aussparung ab (V = V_groß − V_Aussparung). Das Volumen eines Quaders ist V = Länge · Breite · Höhe.',
    quelle: 'Wikipedia: Quader',
    url: 'https://de.wikipedia.org/wiki/Quader',
  },
  generate: mixedVariants(
    // Text: Summe zweier Quader
    (rng: Rng) => {
      const d = randomCompositeCuboid(rng)
      return valueTask({
        question: `Ein L-förmiger Körper besteht aus zwei Quadern: ${d.stemLength} cm × ${d.width} cm × ${d.height} cm und ${d.cutLength} cm × ${d.footWidth} cm × ${d.height} cm. Berechne das Volumen.`,
        unit: 'cm³',
        answerKind: 'integer',
        value: d.volume,
        solution: `${d.volume} cm³`,
        explanation: `V = ${d.stemLength}·${d.width}·${d.height} + ${d.cutLength}·${d.footWidth}·${d.height} = ${d.v1} + ${d.v2} = ${d.volume} cm³.`,
      })
    },
    // Text: großer Quader minus Aussparung
    (rng: Rng) => {
      const d = randomCompositeCuboid(rng)
      return valueTask({
        question: `Von einem Quader ${d.length} cm × ${d.width} cm × ${d.height} cm wird ein Quader ${d.cutLength} cm × ${d.cutWidth} cm × ${d.height} cm abgeschnitten. Wie groß ist das verbleibende Volumen?`,
        unit: 'cm³',
        answerKind: 'integer',
        value: d.volume,
        solution: `${d.volume} cm³`,
        explanation: `V = ${d.length}·${d.width}·${d.height} − ${d.cutLength}·${d.cutWidth}·${d.height} = ${d.length * d.width * d.height} − ${d.cutLength * d.cutWidth * d.height} = ${d.volume} cm³.`,
      })
    },
    // Visual: L-Körper
    (rng: Rng) => {
      const d = randomCompositeCuboid(rng)
      const svg = generateCompositeCuboidSvg({
        length: d.length,
        width: d.width,
        height: d.height,
        cutLength: d.cutLength,
        cutWidth: d.cutWidth,
        lengthLabel: `${d.length} cm`,
        widthLabel: `${d.width} cm`,
        heightLabel: `${d.height} cm`,
        cutLengthLabel: `${d.cutLength} cm`,
        cutWidthLabel: `${d.cutWidth} cm`,
      })
      return visualTask({
        question: 'Berechne das Volumen des abgebildeten L-förmigen Körpers.',
        unit: 'cm³',
        answerKind: 'integer',
        value: d.volume,
        solution: `${d.volume} cm³`,
        explanation: `Zerlegung: V = ${d.stemLength}·${d.width}·${d.height} + ${d.cutLength}·${d.footWidth}·${d.height} = ${d.volume} cm³.\nOder: V = ${d.length}·${d.width}·${d.height} − ${d.cutLength}·${d.cutWidth}·${d.height} = ${d.volume} cm³.`,
        visualContent: svg,
      })
    },
    // Text: zwei Quader nebeneinander (unterschiedliche Maße, gleiche Höhe)
    (rng: Rng) => {
      const a = randInt(rng, 3, 8)
      const b = randInt(rng, 2, 6)
      const h = randInt(rng, 2, 5)
      const c = randInt(rng, 2, 7)
      const d = randInt(rng, 2, 6)
      const volume = a * b * h + c * d * h
      return valueTask({
        question: `Zwei Quader stehen nebeneinander. Der erste misst ${a} dm × ${b} dm × ${h} dm, der zweite ${c} dm × ${d} dm × ${h} dm. Wie groß ist das Gesamtvolumen?`,
        unit: 'dm³',
        answerKind: 'integer',
        value: volume,
        solution: `${volume} dm³`,
        explanation: `V = ${a}·${b}·${h} + ${c}·${d}·${h} = ${a * b * h} + ${c * d * h} = ${volume} dm³.`,
      })
    },
  ),
}

// ---------------------------------------------------------------------------
// Lernbereich 5 — Vernetzung: Mathematik im Alltag
// ---------------------------------------------------------------------------

const sachaufgabeGesamtpreis: Topic = {
  id: 'lb5-gesamtpreis',
  title: 'Sachaufgabe: Gesamtpreis',
  hint: 'Gesamtpreis = Anzahl · Stückpreis.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'In Sachaufgaben zur Multiplikation berechnet man den Gesamtpreis mehrerer gleicher Artikel: Gesamtpreis = Anzahl × Stückpreis. Das Aufstellen einer Gleichung aus dem Sachtext ist der entscheidende Schritt: Bekannte Größen herausarbeiten, Unbekannte benennen, dann rechnen und die Einheit prüfen.',
    quelle: 'Wikipedia: Dreisatz',
    url: 'https://de.wikipedia.org/wiki/Dreisatz',
  },
  generate: (rng: Rng) => {
    const anzahl = randInt(rng, 3, 12)
    const preis = randInt(rng, 2, 15)
    const artikel = pick(rng, ['Heft', 'Stift', 'Buch', 'Ticket', 'Brötchen'])
    const value = anzahl * preis
    return valueTask({
      question: `Ein ${artikel} kostet ${preis} €. Wie viel kosten ${anzahl} ${artikel}s?`,
      unit: '€',
      answerKind: 'integer',
      value,
      solution: `${value} €`,
      explanation: `Gesamtpreis = Anzahl · Stückpreis = ${anzahl} · ${preis} € = ${value} €.`,
    })
  },
}

const sachaufgabeTeilen: Topic = {
  id: 'lb5-teilen',
  title: 'Sachaufgabe: Gerecht aufteilen',
  hint: 'Teile die Gesamtmenge durch die Anzahl.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Sachaufgaben zur Division beschreiben Situationen, in denen eine Menge gleichmäßig aufgeteilt wird oder ermittelt wird, wie oft ein Wert in einem anderen enthalten ist. Der Rest zeigt, was nach der gleichmäßigen Aufteilung übrig bleibt. Diese Aufgaben erfordern zunächst das Verstehen der Situation (Was ist gesucht?), bevor gerechnet wird.',
    quelle: 'Wikipedia: Division (Mathematik)',
    url: 'https://de.wikipedia.org/wiki/Division_(Mathematik)',
  },
  generate: (rng: Rng) => {
    const anzahl = randInt(rng, 2, 9)
    const proKind = randInt(rng, 2, 15)
    const gesamt = anzahl * proKind
    const dinge = pick(rng, ['Äpfel', 'Bonbons', 'Sticker', 'Nüsse', 'Karten'])
    return valueTask({
      question: `${gesamt} ${dinge} werden gleichmäßig auf ${anzahl} Kinder verteilt. Wie viele bekommt jedes Kind?`,
      answerKind: 'integer',
      value: proKind,
      solution: `${proKind}`,
      explanation: `Teile gleichmäßig auf: ${gesamt} : ${anzahl} = ${proKind}. Jedes Kind bekommt ${proKind} ${dinge}.`,
    })
  },
}

/** Mehrstufige Sachaufgabe: Wechselgeld, Rückgabe, Kauf. */
const sachaufgabeMehrstufig: Topic = {
  id: 'lb5-mehrstufig',
  title: 'Sachaufgabe: Mehrstufige Alltagsrechnung',
  hint: 'Löse Schritt für Schritt: Zuerst den Gesamtpreis, dann das Wechselgeld.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sachaufgabe', 'Wechselgeld', 'Alltag', 'mehrstufig'],
  fachwissen: {
    text: 'Mehrstufige Sachaufgaben erfordern mehrere Rechenschritte nacheinander. Wichtig ist, das Ergebnis jedes Schritts als Zwischenergebnis festzuhalten und erst am Ende die Antwort formulieren. Typische Schritte sind: Gesamtpreis berechnen → von bezahltem Betrag abziehen → Wechselgeld. Das Überprüfen durch Überschlagen sichert das Ergebnis.',
    quelle: 'Wikipedia: Dreisatz',
    url: 'https://de.wikipedia.org/wiki/Dreisatz',
  },
  generate: (rng: Rng) => {
    const anzahl = randInt(rng, 2, 6)
    const stk = randInt(rng, 1, 8)
    const total = anzahl * stk
    // Use only realistic Euro bills: 5, 10, 20, 50
    const realBills = [5, 10, 20, 50]
    const availableBills = realBills.filter((bill) => bill > total)
    if (availableBills.length === 0) availableBills.push(50) // fallback
    const bezahlt = pick(rng, availableBills)
    const rest = bezahlt - total
    const artikel = pick(rng, ['Äpfel', 'Brötchen', 'Hefte', 'Stifte'])
    return valueTask({
      question: `${anzahl} ${artikel} kosten je ${stk} €. Du bezahlst mit einem ${bezahlt}-Euro-Schein. Wie viel Wechselgeld bekommst du zurück?`,
      unit: '€',
      answerKind: 'integer',
      value: rest,
      solution: `${rest} €`,
      explanation: `Gesamtpreis: ${anzahl} · ${stk} € = ${total} €. Wechselgeld: ${bezahlt} € − ${total} € = ${rest} €.`,
    })
  },
}

/** Sachaufgabe Geometrie: Zaun / Tapete / Boden im Alltag. */
const sachaufgabeFlaeche: Topic = {
  id: 'lb5-sachaufgabe-flaeche',
  title: 'Sachaufgabe: Fläche und Umfang im Alltag',
  hint: 'Entscheide, ob Umfang oder Fläche gefragt ist.',
  pointsPerTask: 10,
  difficulty: 2,
  keywords: ['Sachaufgabe', 'Fläche', 'Umfang', 'Garten', 'Zimmer'],
  fachwissen: {
    text: 'Viele Alltagsprobleme erfordern das Berechnen von Flächen und Umfängen: Wandflächen beim Tapezieren, Bodenflächen beim Verlegen, Zaun- und Wegstrecken im Garten. Der Schlüssel liegt im richtigen Erkennen, ob die Kantenlänge (Umfang) oder die Fläche (Inhalt) gefragt ist. Die Einheiten müssen stets zum Ergebnis passen.',
    quelle: 'Wikipedia: Flächeninhalt',
    url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 3, 15)
    const b = randInt(rng, 3, 15)
    const type = pick(rng, ['zaun', 'boden', 'tapete'])

    if (type === 'zaun') {
      const umfang = 2 * (a + b)
      return valueTask({
        question: `Ein rechteckiger Garten ist ${a} m lang und ${b} m breit. Wie lang muss ein Zaun sein, der den Garten vollständig umschließt?`,
        unit: 'm',
        answerKind: 'integer',
        value: umfang,
        solution: `${umfang} m`,
        explanation: `Der Zaun ist so lang wie der Umfang des Rechtecks: U = 2 · (${a} + ${b}) m = 2 · ${a + b} m = ${umfang} m.`,
      })
    }
    if (type === 'boden') {
      const flaeche = a * b
      return valueTask({
        question: `Ein rechteckiges Zimmer ist ${a} m lang und ${b} m breit. Wie viele Quadratmeter Bodenbelag werden benötigt?`,
        unit: 'm²',
        answerKind: 'integer',
        value: flaeche,
        solution: `${flaeche} m²`,
        explanation: `Fläche = Länge · Breite = ${a} m · ${b} m = ${flaeche} m².`,
      })
    }
    const flaeche = a * b
    const tuerFenster = randInt(rng, 1, Math.floor(flaeche / 4))
    const netto = flaeche - tuerFenster
    return valueTask({
      question: `Eine Wand ist ${a} m breit und ${b} m hoch. Fenster und Tür nehmen zusammen ${tuerFenster} m² ein. Wie viel Wandfläche muss tapeziert werden?`,
      unit: 'm²',
      answerKind: 'integer',
      value: netto,
      solution: `${netto} m²`,
      explanation: `Gesamte Wandfläche: ${a} · ${b} = ${flaeche} m². Abzüglich Fenster/Tür: ${flaeche} − ${tuerFenster} = ${netto} m².`,
    })
  },
}

// Einheiten umrechnen (Größen im Alltag) — Länge, Fläche, Volumen, Masse, Zeit.
const laengeUmrechnen = conversionTopic('k5', LAENGE)
const flaecheUmrechnen = conversionTopic('k5', FLAECHE)
const volumenUmrechnen = conversionTopic('k5', VOLUMEN)
const masseUmrechnen = conversionTopic('k5', MASSE)
const zeitUmrechnen = conversionTopic('k5', ZEIT)

// ---------------------------------------------------------------------------
// Grade — Klasse 5 (Gymnasium Mathematik, Sachsen)
// ---------------------------------------------------------------------------

export const klasse5: Grade = {
  id: 'klasse-5',
  title: 'Klasse 5',
  areas: [
    {
      id: 'lb1',
      title: 'Arbeiten mit natürlichen Zahlen',
      ustd: 32,
      topics: [
        rundenNatuerlich,
        addition,
        subtraktion,
        multiplikation,
        schriftlichesRechnen,
        divisionMitRest,
        schriftlicheDivision,
        potenzieren,
        teilbarkeit,
        primzahl,
      ],
    },
    {
      id: 'lb2',
      title: 'Gemeine Brüche und Dezimalzahlen',
      ustd: 30,
      topics: [
        kuerzen,
        erweitern,
        anteilAlsBruch,
        grafischeBrueche,
        dezAddSub,
        dezMult,
        dezDiv,
        rundenDezimal,
        mittelwert,
        zahlenstrahl,
        ordnenMitEinheiten,
      ],
    },
    {
      id: 'lb3',
      title: 'Lagebeziehungen geometrischer Objekte',
      ustd: 22,
      topics: [
        koordinatenAblesen,
        koordinatenEintragen,
        koordinatenAbstand,
        winkelarten,
        winkelErgaenzung,
        streckenLaenge,
        streckenMittelpunkt,
        streckenBezeichnung,
        verschiebungFormen,
        symmetrieAchsen,
        symmetriePunkt,
      ],
    },
    {
      id: 'lb4',
      title: 'Rechtecke und Quader',
      ustd: 24,
      topics: [
        umfangRechteck,
        flaecheRechteck,
        volumenQuader,
        oberflaecheQuader,
        flaecheZusammengesetzt,
        umfangZusammengesetzt,
        volumenZusammengesetzt,
      ],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Mathematik im Alltag',
      ustd: 6,
      topics: [
        sachaufgabeGesamtpreis,
        sachaufgabeTeilen,
        sachaufgabeMehrstufig,
        sachaufgabeFlaeche,
        laengeUmrechnen,
        flaecheUmrechnen,
        volumenUmrechnen,
        masseUmrechnen,
        zeitUmrechnen,
      ],
    },
  ],
}
