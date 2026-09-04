import { pick, randInt, type Rng } from '../lib/rng'
import { gcd, makeFraction } from '../lib/fraction'
import { formatDe, roundTo } from '../lib/num'
import { fractionTask, textTask, valueTask } from './taskHelpers'
import { conversionTopic, LAENGE, FLAECHE, VOLUMEN, MASSE, ZEIT } from './units'
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

// ---------------------------------------------------------------------------
// Lernbereich 3 — Lagebeziehungen geometrischer Objekte
// ---------------------------------------------------------------------------

const winkelarten: Topic = {
  id: 'lb3-winkelarten',
  title: 'Winkelarten erkennen',
  hint: 'spitz, recht, stumpf, gestreckt oder überstumpf.',
  pointsPerTask: 10,
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
  generate: (rng: Rng) => {
    const square = rng() < 0.4
    const a = randInt(rng, 2, 25)
    const b = square ? a : randInt(rng, 2, 25)
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
}

const volumenQuader: Topic = {
  id: 'lb4-volumen-quader',
  title: 'Volumen von Quader und Würfel',
  hint: 'V = a · b · c, beim Würfel V = a · a · a.',
  pointsPerTask: 10,
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
        laengeUmrechnen,
        flaecheUmrechnen,
        volumenUmrechnen,
        masseUmrechnen,
        zeitUmrechnen,
      ],
    },
  ],
}
