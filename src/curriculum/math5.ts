import { pick, randInt, type Rng } from '../lib/rng'
import { gcd, makeFraction } from '../lib/fraction'
import { formatDe, roundTo } from '../lib/num'
import { fractionTask, dragDropSortTask, numberLineTask, textTask, valueTask, visualTask } from './taskHelpers'
import { conversionTopic, LAENGE, FLAECHE, VOLUMEN, MASSE, ZEIT } from './units'
import { generateRectangleSvg } from '../lib/geometrySvg'
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
  generate: (rng: Rng) => {
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
  generate: (rng: Rng) => {
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
}

const multiplikation: Topic = {
  id: 'lb1-multiplikation',
  title: 'Multiplikation natürlicher Zahlen',
  hint: 'Zerlege den zweiten Faktor in Zehner und Einer.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Die Multiplikation ist eine verkürzte Addition: a · b bedeutet, a genau b-mal zu addieren. Bei der schriftlichen Multiplikation wird der erste Faktor schrittweise mit jeder Ziffer des zweiten Faktors (von rechts) multipliziert; die Teilprodukte werden stellenrichtig aufaddiert.',
    quelle: 'Wikipedia: Multiplikation',
    url: 'https://de.wikipedia.org/wiki/Multiplikation',
  },
  generate: (rng: Rng) => {
    const a = randInt(rng, 12, 99)
    const b = randInt(rng, 3, 19)
    const value = a * b
    return valueTask({
      question: `Berechne: ${a} · ${b}`,
      answerKind: 'integer',
      value,
      solution: formatDe(value),
      explanation: `Multipliziere schriftlich: ${a} · ${b} = ${formatDe(value)}.`,
    })
  },
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
  generate: (rng: Rng) => {
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
  generate: (rng: Rng) => {
    // Generate two decimals (1 decimal place) whose midpoint is also clean.
    const a = randInt(rng, 10, 89) / 10
    const step = randInt(rng, 1, 8) / 10
    const b = roundTo(a + step * 2, 1) // ensures midpoint is exactly halfway
    const mid = roundTo((a + b) / 2, 2)
    return numberLineTask({
      question: `Auf dem Zahlenstrahl liegen die Zahlen ${formatDe(a)} und ${formatDe(b)}. Welche Dezimalzahl befindet sich genau in der Mitte zwischen ihnen?`,
      min: Math.floor(a) - 1,
      max: Math.ceil(b) + 1,
      step: 0.1,
      value: mid,
      decimals: 1,
      solution: formatDe(mid),
      explanation: `Die Mitte zweier Zahlen berechnet man als Durchschnitt: (${formatDe(a)} + ${formatDe(b)}) : 2 = ${formatDe(a + b)} : 2 = ${formatDe(mid)}.`,
      eps: 0.05,
    })
  },
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
    type Scenario = { items: { label: string; valueInBase: number }[]; unitName: string }
    
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
          { label: `${formatDe(m1)} m`, valueInBase: m1 * 100 },
          { label: `${cm1} cm`, valueInBase: cm1 },
          { label: `${dm1} dm`, valueInBase: dm1 * 10 },
        ],
      })
      lengthScenarios.push({
        unitName: 'mm',
        items: [
          { label: `${cm1} cm`, valueInBase: cm1 * 10 },
          { label: `${mm1} mm`, valueInBase: mm1 },
          { label: `${dm1} dm`, valueInBase: dm1 * 100 },
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
          { label: `${formatDe(kg1)} kg`, valueInBase: kg1 * 1000 },
          { label: `${g1} g`, valueInBase: g1 },
          { label: `${g2} g`, valueInBase: g2 },
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
          { label: `${formatDe(l1)} l`, valueInBase: l1 * 1000 },
          { label: `${ml1} ml`, valueInBase: ml1 },
          { label: `${formatDe(ml2 / 1000)} l`, valueInBase: ml2 },
        ],
      })
    }
    
    const allScenarios = [...lengthScenarios, ...massScenarios, ...volumeScenarios]
    const sc = pick(rng, allScenarios)
    const sorted = [...sc.items].sort((a, b) => a.valueInBase - b.valueInBase)
    const correctOrder = sorted.map((sortedItem) => 
      sc.items.findIndex((item) => item.valueInBase === sortedItem.valueInBase)
    )
    
    return dragDropSortTask({
      question: 'Sortiere die Größen von klein nach groß (kleinste zuerst):',
      items: sc.items,
      correctOrder,
      solution: sorted.map((i) => i.label).join(' < '),
      explanation: `Rechne alle Angaben in ${sc.unitName} um:\n${sc.items.map((i) => `${i.label} = ${formatDe(i.valueInBase)} ${sc.unitName}`).join('\n')}.\n\nSortiert von klein nach groß: ${sorted.map((i) => i.label).join(' < ')}.`,
    })
  },
}

// ---------------------------------------------------------------------------
// Lernbereich 3 — Lagebeziehungen geometrischer Objekte
// ---------------------------------------------------------------------------

const winkelarten: Topic = {
  id: 'lb3-winkelarten',
  title: 'Winkelarten erkennen',
  hint: 'spitz, recht, stumpf, gestreckt oder überstumpf.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Winkel werden nach ihrer Größe unterschieden: Ein spitzer Winkel liegt zwischen 0° und 90°, ein rechter Winkel beträgt genau 90°, ein stumpfer Winkel liegt zwischen 90° und 180°, ein gestreckter Winkel beträgt genau 180° und ein überstumpfer (konvexer) Winkel liegt zwischen 180° und 360°. Der Vollwinkel beträgt 360°.',
    quelle: 'Wikipedia: Winkel',
    url: 'https://de.wikipedia.org/wiki/Winkel',
  },
  generate: (rng: Rng) => {
    const kind = pick(rng, ['spitz', 'recht', 'stumpf', 'gestreckt', 'überstumpf'])
    let deg: number
    switch (kind) {
      case 'spitz':
        deg = randInt(rng, 1, 89)
        break
      case 'recht':
        deg = 90
        break
      case 'stumpf':
        deg = randInt(rng, 91, 179)
        break
      case 'gestreckt':
        deg = 180
        break
      default:
        deg = randInt(rng, 181, 359)
    }
    const accepted =
      kind === 'überstumpf' ? ['überstumpf', 'ueberstumpf'] : [kind]
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
}

const winkelErgaenzung: Topic = {
  id: 'lb3-winkel-ergaenzung',
  title: 'Winkel zu 90° oder 180° ergänzen',
  hint: 'Ziehe den gegebenen Winkel von 90° bzw. 180° ab.',
  pointsPerTask: 10,
  difficulty: 1,
  fachwissen: {
    text: 'Zwei Winkel, die zusammen 90° ergeben, heißen Komplementärwinkel. Zwei Winkel, die zusammen 180° ergeben, heißen Supplementärwinkel (Ergänzungswinkel). An Geraden entstehen Supplementärwinkel auf jeder Seite. Diese Beziehungen sind wichtig beim Berechnen unbekannter Winkel in geometrischen Figuren.',
    quelle: 'Wikipedia: Winkel',
    url: 'https://de.wikipedia.org/wiki/Winkel',
  },
  generate: (rng: Rng) => {
    const toStraight = rng() < 0.5
    const gesamt = toStraight ? 180 : 90
    const a = randInt(rng, 10, gesamt - 10)
    const value = gesamt - a
    return valueTask({
      question: `Zwei Winkel ergänzen sich zu ${gesamt}° (${
        toStraight ? 'gestreckter' : 'rechter'
      } Winkel). Ein Winkel ist ${a}°. Wie groß ist der andere?`,
      unit: '°',
      answerKind: 'integer',
      value,
      solution: `${value}°`,
      explanation: `Die beiden Winkel ergeben zusammen ${gesamt}°. Also: ${gesamt}° − ${a}° = ${value}°.`,
    })
  },
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
  generate: (rng: Rng) => {
    const square = rng() < 0.4
    const a = randInt(rng, 2, 25)
    const b = square ? a : randInt(rng, 2, 25)
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
  generate: (rng: Rng) => {
    const square = rng() < 0.4
    const a = randInt(rng, 2, 25)
    const b = square ? a : randInt(rng, 2, 25)
    const value = a * b
    
    const svg = generateRectangleSvg({
      widthLabel: `${a} cm`,
      heightLabel: `${b} cm`,
    })
    
    return visualTask({
      question: square
        ? `Ein Quadrat hat die Seitenlänge ${a} cm. Berechne den Flächeninhalt.`
        : `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne den Flächeninhalt.`,
      unit: 'cm²',
      answerKind: 'integer',
      value,
      visualContent: svg,
      solution: `${value} cm²`,
      explanation: square
        ? `Flächeninhalt eines Quadrats = Seite · Seite = ${a} · ${a} cm² = ${value} cm².`
        : `Flächeninhalt = Länge · Breite = ${a} cm · ${b} cm = ${value} cm².`,
    })
  },
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
  generate: (rng: Rng) => {
    const cube = rng() < 0.4
    const a = randInt(rng, 2, 12)
    const b = cube ? a : randInt(rng, 2, 12)
    const c = cube ? a : randInt(rng, 2, 12)
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
        ? `Volumen eines Würfels = Kante · Kante · Kante = ${a} · ${a} · ${a} cm³ = ${value} cm³.`
        : `Volumen = Länge · Breite · Höhe = ${a} · ${b} · ${c} cm³ = ${value} cm³.`,
    })
  },
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
  generate: (rng: Rng) => {
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
        divisionMitRest,
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
      topics: [winkelarten, winkelErgaenzung],
    },
    {
      id: 'lb4',
      title: 'Rechtecke und Quader',
      ustd: 24,
      topics: [umfangRechteck, flaecheRechteck, volumenQuader, oberflaecheQuader],
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
