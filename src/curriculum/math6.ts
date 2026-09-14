import { pick, randInt, type Rng } from '../lib/rng'
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
import { fractionTask, textTask, valueTask } from './taskHelpers'
import { conversionTopic, FLAECHE, LAENGE } from './units'
import type { Grade, Topic } from './types'

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
  generate: (rng: Rng) => {
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
  generate: (rng: Rng) => {
    const a = makeFraction(randInt(rng, 1, 6), randInt(rng, 2, 8))
    const b = makeFraction(randInt(rng, 1, 6), randInt(rng, 2, 8))
    // Subtract only when a >= b, otherwise add — keeps results non-negative.
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
    const a = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
    const b = makeFraction(randInt(rng, 1, 7), randInt(rng, 2, 8))
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
  generate: (rng: Rng) => {
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
  generate: (rng: Rng) => {
    if (rng() < 0.5) {
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
    }
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
  generate: (rng: Rng) => {
    const unit = pick(rng, ['Brötchen', 'Hefte', 'Äpfel', 'Stifte'])
    const pricePer = randInt(rng, 2, 9) / 2
    const a = randInt(rng, 2, 6)
    const b = randInt(rng, 2, 12)
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
  generate: (rng: Rng) => {
    const workers1 = randInt(rng, 2, 6)
    const perWorker = randInt(rng, 2, 9)
    const total = workers1 * perWorker
    const divisors: number[] = []
    for (let w = 2; w <= 12; w++) if (total % w === 0 && w !== workers1) divisors.push(w)
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
  generate: (rng: Rng) => {
    const total = pick(rng, [10, 20, 25, 40, 50, 100])
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
  generate: (rng: Rng) => {
    const preis100 = randInt(rng, 40, 200) // Preis für 100g
    const menge = pick(rng, [250, 500, 750, 1000, 150, 300]) // in g
    const value = roundTo((preis100 / 100) * menge, 2)
    const artikel = pick(rng, ['Käse', 'Aufschnitt', 'Nüsse', 'Schokolade'])
    return valueTask({
      question: `100 g ${artikel} kosten ${preis100} Cent. Was kosten ${menge} g?`,
      unit: 'Cent',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} Cent`,
      explanation: `Dreisatz: 1 g kostet ${preis100} : 100 = ${formatDe(preis100 / 100)} Cent. ${menge} g kosten ${formatDe(preis100 / 100)} · ${menge} = ${formatDe(value)} Cent.`,
    })
  },
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
  generate: (rng: Rng) => {
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
  generate: (rng: Rng) => {
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
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 20)
    const b = randInt(rng, 2, 20)
    const value = 2 * (a + b)
    return valueTask({
      question: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne den Umfang.`,
      unit: 'cm',
      answerKind: 'integer',
      value,
      solution: `${value} cm`,
      explanation: `Umfang = 2 · (Länge + Breite) = 2 · (${a} + ${b}) cm = 2 · ${a + b} cm = ${value} cm.`,
    })
  },
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
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 20)
    const b = randInt(rng, 2, 20)
    const value = a * b
    return valueTask({
      question: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne den Flächeninhalt.`,
      unit: 'cm²',
      answerKind: 'integer',
      value,
      solution: `${value} cm²`,
      explanation: `Flächeninhalt = Länge · Breite = ${a} cm · ${b} cm = ${value} cm².`,
    })
  },
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
  generate: (rng: Rng) => {
    const g = randInt(rng, 2, 20)
    const h = randInt(rng, 2, 20)
    const value = roundTo((g * h) / 2, 2)
    return valueTask({
      question: `Ein Dreieck hat die Grundseite ${g} cm und die Höhe ${h} cm. Berechne den Flächeninhalt.`,
      unit: 'cm²',
      answerKind: 'decimal',
      value,
      solution: `${formatDe(value)} cm²`,
      explanation: `Flächeninhalt = (Grundseite · Höhe) : 2 = (${g} · ${h}) : 2 = ${g * h} : 2 = ${formatDe(value)} cm².`,
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
  generate: (rng: Rng) => {
    const a = randInt(rng, 2, 12)
    const b = randInt(rng, 2, 12)
    const c = randInt(rng, 2, 12)
    const value = a * b * c
    return valueTask({
      question: `Ein Quader ist ${a} cm, ${b} cm und ${c} cm groß. Berechne sein Volumen.`,
      unit: 'cm³',
      answerKind: 'integer',
      value,
      solution: `${value} cm³`,
      explanation: `Volumen = Länge · Breite · Höhe = ${a} · ${b} · ${c} cm³ = ${value} cm³.`,
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
    text: 'Die Oberfläche eines Quaders ist die Summe aller sechs Seitenflächen. Ein Quader hat drei Paare gleich großer Flächen: 2 · (a · b + a · c + b · c). Die Oberfläche gibt an, wie viel Material man für eine Verpackung oder eine Holzkiste benötigt.',
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
      explanation: `Oberfläche = 2 · (a·b + a·c + b·c) = 2 · (${a * b} + ${a * c} + ${b * c}) cm² = 2 · ${a * b + a * c + b * c} cm² = ${value} cm².`,
    })
  },
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
  generate: (rng: Rng) => {
    const grund = randInt(rng, 6, 40)
    const hoehe = randInt(rng, 2, 15)
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
  generate: (rng: Rng) => {
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
  generate: (rng: Rng) => {
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
        sachaufgabeGeometrie,
      ],
    },
    {
      id: 'lb4',
      title: 'Prismen',
      ustd: 12,
      topics: [volumenQuader, oberflaecheQuader, volumenPrisma],
    },
    {
      id: 'lb5',
      title: 'Vernetzung: Anteile',
      ustd: 4,
      topics: [anteilVonGroesse, anteilProzent, flaecheUmrechnen, laengeUmrechnen],
    },
  ],
}
