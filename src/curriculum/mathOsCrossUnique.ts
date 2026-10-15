/**
 * OS-Themen, die bisher denselben Gym-Generator teilten → jeweils eigener Pool
 * (Cross-Topic-Duplikate / Themenbindung).
 */
import { formatDe } from '../lib/num'
import { pick, randInt } from '../lib/rng'
import { appliedMc, distinctDistractors, generateDrehungK5 } from './mathApplied'
import { mixedVariants, valueTask } from './taskHelpers'
import type { Fachwissen, Topic } from './types'

const fw = (text: string): Fachwissen => ({
  text,
  quelle: 'Lehrplan Oberschule Mathematik Sachsen',
  url: 'https://www.schulportal.sachsen.de/lplandb/index.php?id=67',
})

/** Historische Zahlzeichen — Stellenwert-Idee, nicht Runden. */
export const genOsZahlzeichen: Topic['generate'] = mixedVariants(
  (rng) => {
    const n = randInt(rng, 12, 39)
    const roemisch = (() => {
      const map: [number, string][] = [
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
      ]
      let x = n
      let s = ''
      for (const [v, sym] of map) {
        while (x >= v) {
          s += sym
          x -= v
        }
      }
      return s
    })()
    return appliedMc(rng, {
      question: `Welche römische Schreibweise entspricht der Zahl ${n}?`,
      correct: roemisch,
      distractors: distinctDistractors(roemisch, [
        roemisch + 'I',
        'X'.repeat(Math.min(4, Math.floor(n / 10))) + 'I'.repeat(n % 5),
        String(n),
        'V' + 'I'.repeat(n % 5),
      ]),
      explanation: `${n} schreibt man römisch als ${roemisch}.`,
      fachwissen: fw(
        'Römische Zahlen nutzen Zeichen I, V, X, L, C … ohne Stellenwertsystem. Unser Dezimalsystem braucht die Null als Platzhalter.',
      ),
      dedupeKey: `os:zahlzeichen:${n}`,
    })
  },
  (rng) => {
    const h = randInt(rng, 1, 4)
    const z = randInt(rng, 0, 9)
    const e = randInt(rng, 0, 9)
    const n = 100 * h + 10 * z + e
    return valueTask({
      question: `Im Stellenwertsystem: ${h} Hunderter, ${z} Zehner und ${e} Einer. Welche Zahl ist das?`,
      answerKind: 'integer',
      value: n,
      solution: String(n),
      explanation: `${h}·100 + ${z}·10 + ${e} = ${n}.`,
      fachwissen: fw('Im Dezimalsystem bestimmt die Position den Stellenwert (Einer, Zehner, Hunderter, …).'),
      dedupeKey: `os:zahlzeichen:sw:${n}`,
      contentIds: [`os:zahlzeichen:sw:${n}`],
    })
  },
)

/** Abakus: Stellenwerte legen. */
export const genOsAbakus: Topic['generate'] = mixedVariants(
  (rng) => {
    const z = randInt(rng, 1, 8)
    const e = randInt(rng, 0, 9)
    const n = 10 * z + e
    return valueTask({
      question: `Auf dem Abakus liegen ${z} Kugeln auf der Zehnerstange und ${e} auf der Einerstange. Welche Zahl ist dargestellt?`,
      answerKind: 'integer',
      value: n,
      solution: String(n),
      explanation: `${z} Zehner und ${e} Einer ergeben ${n}.`,
      fachwissen: fw('Der Abakus stellt Zahlen über die Anzahl der Kugeln je Stellenwert dar — Vorläufer unseres Stellenwertsystems.'),
      dedupeKey: `os:abakus:${n}`,
      contentIds: [`os:abakus:${n}`],
    })
  },
  (rng) => {
    const n = randInt(rng, 25, 90)
    const z = Math.floor(n / 10)
    return valueTask({
      question: `Wie viele Zehner-Kugeln braucht man auf dem Abakus für die Zahl ${n}?`,
      answerKind: 'integer',
      value: z,
      solution: String(z),
      explanation: `${n} = ${z} Zehner + ${n % 10} Einer.`,
      fachwissen: fw('Zehnerstange und Einerstange trennen die Stellenwerte; Bündelung bei 10 Kugeln.'),
      dedupeKey: `os:abakus:z:${n}`,
      contentIds: [`os:abakus:z:${n}`],
    })
  },
)

/** Stellenwertsysteme vergleichen. */
export const genOsStellenwert: Topic['generate'] = mixedVariants(
  (rng) => {
    const h = randInt(rng, 1, 5)
    const z = randInt(rng, 0, 9)
    const e = randInt(rng, 1, 9)
    return appliedMc(rng, {
      question: `In der Zahl ${h}${z}${e} hat die Ziffer ${h} welchen Stellenwert?`,
      correct: `${h} Hunderter`,
      distractors: [`${h} Zehner`, `${h} Einer`, `${h} Tausender`, `${z} Hunderter`],
      explanation: `Die vordere Ziffer steht in der Hunderterstelle.`,
      fachwissen: fw('Stellenwert = Ziffer · 10^Position. Dieselbe Ziffer bedeutet je nach Position etwas anderes.'),
      dedupeKey: `os:sw:h:${h}${z}${e}`,
    })
  },
  (rng) => {
    const n = randInt(rng, 3, 9)
    return valueTask({
      question: `Wie groß ist der Stellenwert der Ziffer ${n} in der Zahl ${n}04?`,
      answerKind: 'integer',
      value: n * 100,
      solution: String(n * 100),
      explanation: `${n} steht in der Hunderterstelle → ${n}·100 = ${n * 100}. Die 0 ist Platzhalter.`,
      fachwissen: fw('Die Null als Platzhalter hält Stellen frei — ohne sie wären 304 und 34 nicht unterscheidbar.'),
      dedupeKey: `os:sw:val:${n}`,
      contentIds: [`os:sw:val:${n}`],
    })
  },
)

/** Achsensymmetrie erkennen (nicht dieselbe Spiegelungs-Aufgabe wie Geschwisterthemen). */
export const genOsAchsen: Topic['generate'] = mixedVariants(
  (rng) => {
    const fig = pick(rng, [
      ['Quadrat', 4],
      ['gleichseitiges Dreieck', 3],
      ['Rechteck (kein Quadrat)', 2],
      ['gleichschenkliges Dreieck (nicht gleichseitig)', 1],
      ['regelmäßiges Sechseck', 6],
      ['regelmäßiges Achteck', 8],
      ['Parallelogramm (kein Rechteck)', 0],
      ['Kreis', 999],
    ] as const)
    if (fig[1] === 999) {
      return appliedMc(rng, {
        question: 'Wie viele Symmetrieachsen hat ein Kreis?',
        correct: 'unendlich viele',
        distractors: ['1', '2', '4', '0'],
        explanation: 'Jeder Durchmesser ist Symmetrieachse — unendlich viele.',
        fachwissen: fw('Eine Figur ist achsensymmetrisch, wenn sie durch Spiegelung an einer Geraden auf sich selbst abgebildet wird.'),
        dedupeKey: 'os:achsen:kreis',
      })
    }
    return valueTask({
      question: `Wie viele Symmetrieachsen hat ein ${fig[0]}?`,
      answerKind: 'integer',
      value: fig[1],
      solution: String(fig[1]),
      explanation: `Ein ${fig[0]} hat ${fig[1]} Symmetrieachsen.`,
      fachwissen: fw('Regelmäßige n-Ecke haben n Symmetrieachsen. Rechtecke (kein Quadrat) haben 2.'),
      dedupeKey: `os:achsen:${fig[0]}`,
      contentIds: [`os:achsen:${fig[0]}`],
    })
  },
  (rng) => {
    const n = pick(rng, [3, 4, 5, 6, 8])
    return valueTask({
      question: `Ein regelmäßiges ${n}-Eck: Wie viele Symmetrieachsen hat es?`,
      answerKind: 'integer',
      value: n,
      solution: String(n),
      explanation: `Regelmäßiges ${n}-Eck → ${n} Symmetrieachsen.`,
      fachwissen: fw('Bei regelmäßigen n-Ecken gibt es genau n Achsen der Symmetrie.'),
      dedupeKey: `os:achsen:n:${n}`,
      contentIds: [`os:achsen:n:${n}`],
    })
  },
)

/** Deckungsgleichheit: Seiten vergleichen. */
export const genOsDeckung: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = randInt(rng, 3, 9)
    const b = randInt(rng, 3, 9)
    const c = randInt(rng, 3, 9)
    return appliedMc(rng, {
      question: `Dreieck ABC mit Seiten ${a}, ${b}, ${c} und Dreieck DEF mit Seiten ${b}, ${c}, ${a}. Sind sie deckungsgleich?`,
      correct: 'Ja, SSS (gleiche Seitenlängen)',
      distractors: [
        'Nein, Reihenfolge der Seiten ist anders',
        'Nur wenn zusätzlich ein Winkel gleich ist',
        'Nur bei rechtwinkligen Dreiecken',
        'Nein, Flächeninhalte fehlen',
      ],
      explanation: 'SSS: Drei Paare gleicher Seiten ⇒ deckungsgleich (kongruent).',
      fachwissen: fw('Deckungsgleiche (kongruente) Figuren stimmen in allen entsprechenden Seiten und Winkeln überein; SSS ist ein Kongruenzsatz.'),
      dedupeKey: `os:deckung:sss:${a}:${b}:${c}`,
    })
  },
  (rng) => {
    const a = randInt(rng, 4, 10)
    const b = randInt(rng, 4, 10)
    const w = randInt(rng, 30, 80)
    return appliedMc(rng, {
      question: `Zwei Dreiecke haben je zwei Seiten ${a} cm und ${b} cm sowie den eingeschlossenen Winkel ${w}°. Welcher Kongruenzsatz greift?`,
      correct: 'SWS',
      distractors: ['SSS', 'WSW', 'SsW', 'WWW'],
      explanation: `Zwei Seiten und der eingeschlossene Winkel → SWS.`,
      fachwissen: fw('Kongruenzsätze: SSS, SWS, WSW, SsW (mit dem größeren Gegenwinkel zur längeren Seite).'),
      dedupeKey: `os:deckung:sws:${a}:${b}:${w}`,
    })
  },
  (rng) => {
    const u = randInt(rng, 5, 12)
    return valueTask({
      question: `Ein Rechteck 3 cm × 5 cm und ein dazu kongruentes Rechteck: Wie groß ist der Umfang des zweiten?`,
      answerKind: 'integer',
      value: 16,
      solution: '16 cm',
      unit: 'cm',
      explanation: 'Kongruente Figuren haben gleichen Umfang: 2·(3+5) = 16 cm.',
      fachwissen: fw('Deckungsgleiche Figuren stimmen in allen Längenmaßen überein — also auch im Umfang.'),
      dedupeKey: `os:deckung:umfang:${u}`,
      contentIds: [`os:deckung:umfang:16`],
    })
  },
)

/** Spiegelung: Bildpunkt (eigene Zahlen als Spiegelungs-Thema). */
export const genOsSpiegelung: Topic['generate'] = mixedVariants(
  (rng) => {
    const x = randInt(rng, 1, 6)
    const y = randInt(rng, 1, 6)
    return appliedMc(rng, {
      question: `Punkt A(${x}|${y}) wird an der y-Achse gespiegelt. Wohin fällt A'?`,
      correct: `(−${x}|${y})`,
      distractors: [`(${x}|−${y})`, `(−${x}|−${y})`, `(${y}|${x})`, `(${x}|${y})`],
      explanation: `Spiegelung an der y-Achse: (x|y) → (−x|y) = (−${x}|${y}).`,
      fachwissen: fw('Bei Spiegelung an der y-Achse bleibt y gleich, x wechselt das Vorzeichen. An der x-Achse umgekehrt.'),
      dedupeKey: `os:spiegel:y:${x}:${y}`,
    })
  },
  (rng) => {
    const x = randInt(rng, 1, 5)
    const y = randInt(rng, 2, 6)
    return appliedMc(rng, {
      question: `Punkt B(${x}|${y}) wird an der x-Achse gespiegelt. Wohin fällt B'?`,
      correct: `(${x}|−${y})`,
      distractors: [`(−${x}|${y})`, `(−${x}|−${y})`, `(${y}|${x})`, `(0|${y})`],
      explanation: `Spiegelung an der x-Achse: (x|y) → (x|−y).`,
      fachwissen: fw('Die Spiegelungsachse ist die Mittelsenkrechte der Strecke von Punkt zu Bildpunkt.'),
      dedupeKey: `os:spiegel:x:${x}:${y}`,
    })
  },
)

/** Brüche vergleichen K5 — eigene Formulierung gegenüber K6. */
export const genOsBruchVergleichK5: Topic['generate'] = mixedVariants(
  (rng) => {
    const n1 = randInt(rng, 1, 4)
    const n2 = n1 + randInt(rng, 1, 3)
    const d = randInt(rng, n2 + 1, 12)
    return appliedMc(rng, {
      question: `Welcher Bruch ist größer: ${n1}/${d} oder ${n2}/${d}?`,
      correct: `${n2}/${d}`,
      distractors: [`${n1}/${d}`, `${d}/${n1}`, `${d}/${n2}`, 'gleich groß'],
      explanation: `Gleicher Nenner: größerer Zähler ⇒ größerer Bruch. ${n2}/${d} > ${n1}/${d}.`,
      fachwissen: fw('Bei gleichem Nenner entscheidet der Zähler. Bei gleichem Zähler ist der Bruch mit kleinerem Nenner größer.'),
      dedupeKey: `os:k5:bruchvgl:${n1}:${n2}:${d}`,
    })
  },
)

/** Brüche vergleichen K6 — Hauptnenner. */
export const genOsBruchVergleichK6: Topic['generate'] = mixedVariants(
  (rng) => {
    const a = pick(rng, [1, 2, 3])
    const b = pick(rng, [1, 2, 3, 4])
    // compare a/4 vs b/6 over Hauptnenner 12
    const left = a * 3
    const right = b * 2
    const bigger = left === right ? 'gleich groß' : left > right ? `${a}/4` : `${b}/6`
    return appliedMc(rng, {
      question: `Vergleiche ${a}/4 und ${b}/6 (Hauptnenner 12). Welcher Bruch ist größer — oder sind sie gleich?`,
      correct: bigger,
      distractors: distinctDistractors(bigger, [`${a}/4`, `${b}/6`, 'gleich groß', `${a}/6`, `${b}/4`]),
      explanation: `${a}/4 = ${left}/12, ${b}/6 = ${right}/12 ⇒ ${bigger}.`,
      fachwissen: fw('Ungleichnamige Brüche vergleicht man über einen gemeinsamen Nenner (Hauptnenner) oder als Dezimalzahl.'),
      dedupeKey: `os:k6:bruchvgl:${a}:${b}`,
    })
  },
)

/** Parkett — tag hält HS/RS auseinander. */
function makeParkett(tag: string, context: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const n = pick(rng, [3, 4, 6])
      const w = ((n - 2) * 180) / n
      return valueTask({
        question: `${context}: Welchen Innenwinkel hat ein regelmäßiges ${n}-Eck?`,
        answerKind: 'integer',
        value: w,
        solution: `${w}°`,
        unit: '°',
        explanation: `Innenwinkel = ((${n} − 2) · 180°) : ${n} = ${w}°.`,
        fachwissen: fw('Parkettierung mit regelmäßigen n-Ecken gelingt, wenn sich Innenwinkel an einer Ecke zu 360° ergänzen.'),
        dedupeKey: `${tag}:parkett:${n}`,
        contentIds: [`${tag}:parkett:${n}`],
      })
    },
    (rng) => {
      const w = pick(rng, [60, 90, 120])
      const count = 360 / w
      return valueTask({
        question: `${context}: An einer Ecke stoßen Innenwinkel von je ${w}° zusammen. Wie viele passen um die Ecke?`,
        answerKind: 'integer',
        value: count,
        solution: String(count),
        explanation: `360° : ${w}° = ${count}.`,
        fachwissen: fw('Vollständige Parkettierung: Summe der Innenwinkel um einen Punkt muss 360° ergeben.'),
        dedupeKey: `${tag}:parkett:um:${w}`,
        contentIds: [`${tag}:parkett:um:${w}`],
      })
    },
    (rng) =>
      appliedMc(rng, {
        question: `${context}: Mit welchem regelmäßigen Vieleck allein kann man die Ebene parkettieren?`,
        correct: 'regelmäßiges Sechseck',
        distractors: ['regelmäßiges Fünfeck', 'regelmäßiges Achteck', 'regelmäßiges Siebeneck', 'regelmäßiges Neuneck'],
        explanation: 'Nur Dreieck, Quadrat und regelmäßiges Sechseck parkettieren die Ebene allein.',
        fachwissen: fw('Einfache Parkette: gleichseitiges Dreieck (60°), Quadrat (90°), regelmäßiges Sechseck (120°).'),
        dedupeKey: `${tag}:parkett:welche`,
      }),
    (rng) => {
      const n = pick(rng, [3, 4, 6])
      const need = 360 / (((n - 2) * 180) / n)
      return valueTask({
        question: `${context}: Wie viele regelmäßige ${n}-Ecke passen mit ihren Innenwinkeln um einen Punkt?`,
        answerKind: 'integer',
        value: need,
        solution: String(need),
        explanation: `360° : Innenwinkel = ${need}.`,
        fachwissen: fw('Anzahl um einen Punkt = 360° geteilt durch den Innenwinkel.'),
        dedupeKey: `${tag}:parkett:n:${n}`,
        contentIds: [`${tag}:parkett:n:${n}`],
      })
    },
  )
}

/** Spiegelung — eigene Frageformulierung je Topic. */
function makeSpiegel(tag: string, axis: 'x' | 'y' | 'origin'): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const x = randInt(rng, 1, 6)
      const y = randInt(rng, 1, 6)
      if (axis === 'y') {
        return appliedMc(rng, {
          question: `Spiegelung an der y-Achse: Wohin fällt A(${x}|${y})?`,
          correct: `(−${x}|${y})`,
          distractors: [`(${x}|−${y})`, `(−${x}|−${y})`, `(${y}|${x})`, `(${x}|${y})`],
          explanation: `(x|y) → (−x|y).`,
          fachwissen: fw('Spiegelung an der y-Achse: x wechselt das Vorzeichen, y bleibt.'),
          dedupeKey: `${tag}:spiegel:y:${x}:${y}`,
        })
      }
      if (axis === 'x') {
        return appliedMc(rng, {
          question: `Spiegelung an der x-Achse: Wohin fällt B(${x}|${y})?`,
          correct: `(${x}|−${y})`,
          distractors: [`(−${x}|${y})`, `(−${x}|−${y})`, `(${y}|${x})`, `(0|${y})`],
          explanation: `(x|y) → (x|−y).`,
          fachwissen: fw('Spiegelung an der x-Achse: y wechselt das Vorzeichen, x bleibt.'),
          dedupeKey: `${tag}:spiegel:x:${x}:${y}`,
        })
      }
      return appliedMc(rng, {
        question: `Punktspiegelung am Ursprung: Wohin fällt C(${x}|${y})?`,
        correct: `(−${x}|−${y})`,
        distractors: [`(−${x}|${y})`, `(${x}|−${y})`, `(${y}|${x})`, `(${x}|${y})`],
        explanation: `(x|y) → (−x|−y).`,
        fachwissen: fw('Punktspiegelung am Ursprung kehrt beide Vorzeichen um (Drehung um 180°).'),
        dedupeKey: `${tag}:spiegel:o:${x}:${y}`,
      })
    },
    (rng) => {
      const x = randInt(rng, 2, 7)
      return valueTask({
        question: `A(${x}|3) wird an der ${axis === 'x' ? 'x' : 'y'}-Achse gespiegelt. Wie lautet die ${axis === 'x' ? 'y' : 'x'}-Koordinate von A'?`,
        answerKind: 'integer',
        value: axis === 'x' ? -3 : -x,
        solution: axis === 'x' ? '−3' : `−${x}`,
        explanation: axis === 'x' ? 'y wird zu −3.' : `x wird zu −${x}.`,
        fachwissen: fw('Bei Achsenspiegelung bleibt der Abstand zur Achse gleich, die Seite wechselt.'),
        dedupeKey: `${tag}:spiegel:coord:${axis}:${x}`,
        contentIds: [`${tag}:spiegel:coord:${axis}:${x}`],
      })
    },
  )
}

/** Winkel messen / Arten — eigene Pools. */
function makeWinkelArten(tag: string, focus: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const w = randInt(rng, 1, 179)
      const art =
        w < 90 ? 'spitz' : w === 90 ? 'recht' : w < 180 ? 'stumpf' : 'gestreckt'
      return appliedMc(rng, {
        question: `${focus}: Ein Winkel misst ${w}°. Welche Art ist das?`,
        correct: art === 'spitz' ? 'spitzer Winkel' : art === 'recht' ? 'rechter Winkel' : 'stumpfer Winkel',
        distractors: distinctDistractors(
          art === 'spitz' ? 'spitzer Winkel' : art === 'recht' ? 'rechter Winkel' : 'stumpfer Winkel',
          ['spitzer Winkel', 'rechter Winkel', 'stumpfer Winkel', 'gestreckter Winkel', 'voller Winkel'],
        ),
        explanation: `0° < spitz < 90° < stumpf < 180°. ${w}° ist ${art}.`,
        fachwissen: fw('Winkelarten: spitz (unter 90°), recht (90°), stumpf (zwischen 90° und 180°), gestreckt (180°).'),
        dedupeKey: `${tag}:wa:${w}`,
      })
    },
    (rng) => {
      const a = randInt(rng, 20, 70)
      return valueTask({
        question: `${focus}: Ein spitzer Winkel misst ${a}°. Wie groß ist sein Ergänzungswinkel zu 90°?`,
        answerKind: 'integer',
        value: 90 - a,
        solution: `${90 - a}°`,
        unit: '°',
        explanation: `90° − ${a}° = ${90 - a}°.`,
        fachwissen: fw('Komplementärwinkel ergänzen sich zu 90°, Supplementärwinkel zu 180°.'),
        dedupeKey: `${tag}:komp:${a}`,
        contentIds: [`${tag}:komp:${a}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 40, 140)
      return valueTask({
        question: `${focus}: Winkel α = ${a}°. Wie groß ist der Nebenwinkel?`,
        answerKind: 'integer',
        value: 180 - a,
        solution: `${180 - a}°`,
        unit: '°',
        explanation: `Nebenwinkel: 180° − ${a}° = ${180 - a}°.`,
        fachwissen: fw('Nebenwinkel liegen an einer Geraden und ergänzen sich zu 180°.'),
        dedupeKey: `${tag}:neben:${a}`,
        contentIds: [`${tag}:neben:${a}`],
      })
    },
  )
}

/** Lagebeziehungen / Koordinaten — getrennte Formulierungen. */
function makeLage(tag: string, title: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const x1 = randInt(rng, 0, 5)
      const y1 = randInt(rng, 0, 5)
      const x2 = x1
      const y2 = y1 + randInt(rng, 1, 4)
      return appliedMc(rng, {
        question: `${title}: Die Strecke von (${x1}|${y1}) nach (${x2}|${y2}) verläuft …`,
        correct: 'parallel zur y-Achse',
        distractors: ['parallel zur x-Achse', 'durch den Ursprung', 'als Winkelhalbierende', 'nicht bestimmbar'],
        explanation: `Gleiche x-Koordinaten ⇒ senkrechte Gerade (parallel zur y-Achse).`,
        fachwissen: fw('Parallele zur y-Achse: konstantes x. Parallele zur x-Achse: konstantes y.'),
        dedupeKey: `${tag}:lage:vy:${x1}:${y1}:${y2}`,
      })
    },
    (rng) => {
      const x = randInt(rng, 1, 6)
      const y = randInt(rng, 1, 6)
      return valueTask({
        question: `${title}: Lies die y-Koordinate von P(${x}|${y}) ab.`,
        answerKind: 'integer',
        value: y,
        solution: String(y),
        explanation: `P liegt bei y = ${y}.`,
        fachwissen: fw('Koordinaten: zuerst x (waagerecht), dann y (senkrecht).'),
        dedupeKey: `${tag}:lage:y:${x}:${y}`,
        contentIds: [`${tag}:lage:y:${x}:${y}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 2, 8)
      return appliedMc(rng, {
        question: `${title}: Welche Aussage zu den Geraden y = ${a} und x = ${a} ist richtig?`,
        correct: 'Sie schneiden einander senkrecht',
        distractors: ['Sie sind parallel', 'Sie fallen zusammen', 'Sie schneiden sich spitz', 'Sie haben keinen Schnittpunkt'],
        explanation: `Waagerechte und senkrechte Gerade schneiden sich rechtwinklig in (${a}|${a}).`,
        fachwissen: fw('Eine waagerechte und eine senkrechte Gerade stehen senkrecht aufeinander.'),
        dedupeKey: `${tag}:lage:schnitt:${a}`,
      })
    },
  )
}

/** DGS / Konstruktion / Makro — themenspezifische Rechen-/Deutungsaufgaben. */
function makeDgs(tag: string, title: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const n = randInt(rng, 3, 12)
      return valueTask({
        question: `${title}: Du spiegelst einen Punkt nacheinander an zwei senkrechten Achsen. Welcher Drehwinkel (in Grad) entspricht der Gesamtbewegung?`,
        answerKind: 'integer',
        value: 180,
        solution: '180',
        unit: '°',
        explanation: 'Zwei Spiegelungen an senkrechten Achsen ergeben eine 180°-Drehung.',
        fachwissen: fw('Verkettung von Geradenspiegelungen: parallel → Verschiebung, schneidend → Drehung um den doppelten Schnittwinkel.'),
        dedupeKey: `${tag}:dgs:180:${n}`,
        contentIds: [`${tag}:dgs:180:${n}`],
      })
    },
    (rng) => {
      const steps = randInt(rng, 3, 12)
      return appliedMc(rng, {
        question: `${title}: Ein Makro führt ${steps} Konstruktionsschritte aus. Was ist der Sinn eines Makros in der DGS?`,
        correct: 'Wiederkehrende Konstruktionen speichern und erneut anwenden',
        distractors: [
          'Nur die Farbe von Linien ändern',
          'Zufällige Punkte erzeugen ohne Konstruktion',
          'Die Zoomstufe fest einstellen',
          'Koordinatenachsen ausblenden',
        ],
        explanation: 'Makros bündeln Konstruktionsschritte zur Wiederverwendung.',
        fachwissen: fw('In dynamischer Geometriesoftware speichern Makros Konstruktionsabläufe (z. B. Mittelsenkrechte, Ortslinien).'),
        dedupeKey: `${tag}:dgs:makro:${steps}`,
        contentIds: [`${tag}:dgs:makro:${steps}`],
      })
    },
    (rng) => {
      const r = randInt(rng, 2, 12)
      return valueTask({
        question: `${title}: Ein Punkt bewegt sich auf einem Kreis mit Radius ${r}. Welchen Abstand hat er ständig zum Mittelpunkt?`,
        answerKind: 'integer',
        value: r,
        solution: String(r),
        explanation: `Alle Kreispunkte haben Abstand ${r} zum Mittelpunkt — typische Ortslinie.`,
        fachwissen: fw('Ortslinie „Kreis“: Menge aller Punkte mit festem Abstand zum Mittelpunkt.'),
        dedupeKey: `${tag}:dgs:ort:${r}`,
        contentIds: [`${tag}:dgs:ort:${r}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 20, 70)
      return valueTask({
        question: `${title}: Zwei Spiegelachsen schneiden sich unter ${a}°. Welcher Drehwinkel (in Grad) entsteht durch die Verkettung der beiden Spiegelungen?`,
        answerKind: 'integer',
        value: 2 * a,
        solution: String(2 * a),
        unit: '°',
        explanation: `Drehwinkel = 2 · Schnittwinkel = 2 · ${a}° = ${2 * a}°.`,
        fachwissen: fw('Zwei Geradenspiegelungen an schneidenden Achsen ergeben eine Drehung um den doppelten Schnittwinkel.'),
        dedupeKey: `${tag}:dgs:2a:${a}`,
        contentIds: [`${tag}:dgs:2a:${a}`],
      })
    },
    (rng) => {
      const d = randInt(rng, 2, 9)
      return appliedMc(rng, {
        question: `${title}: Die Ortslinie aller Punkte mit Abstand ${d} zu einer festen Geraden g ist …`,
        correct: 'ein Paar paralleler Geraden im Abstand d zu g',
        distractors: [
          'ein Kreis mit Radius d',
          'die Mittelsenkrechte von g',
          'nur der Punkt im Ursprung',
          'eine Parabel mit Brennpunkt auf g',
        ],
        explanation: `Abstand ${d} zu einer Geraden: zwei Parallelen im Abstand ${d}.`,
        fachwissen: fw('Ortslinie „Abstand zu einer Geraden“: zwei Parallelen; „Abstand zu einem Punkt“: Kreis.'),
        dedupeKey: `${tag}:dgs:par:${d}`,
        contentIds: [`${tag}:dgs:par:${d}`],
      })
    },
  )
}

function makeVieleck(tag: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const n = pick(rng, [5, 6, 8])
      return valueTask({
        question: `Regelmäßiges ${n}-Eck: Wie groß ist ein Innenwinkel in Grad?`,
        answerKind: 'integer',
        value: ((n - 2) * 180) / n,
        solution: `${((n - 2) * 180) / n}°`,
        unit: '°',
        explanation: `((${n} − 2) · 180°) : ${n} = ${((n - 2) * 180) / n}°.`,
        fachwissen: fw('Innenwinkelsumme im n-Eck: (n − 2) · 180°. Beim regelmäßigen n-Eck alle Innenwinkel gleich.'),
        dedupeKey: `${tag}:vieleck:${n}`,
        contentIds: [`${tag}:vieleck:${n}`],
      })
    },
    (rng) => {
      const n = pick(rng, [4, 5, 6, 8])
      return valueTask({
        question: `Wie viele Symmetrieachsen hat ein regelmäßiges ${n}-Eck?`,
        answerKind: 'integer',
        value: n,
        solution: String(n),
        explanation: `Regelmäßiges ${n}-Eck → ${n} Achsen.`,
        fachwissen: fw('Regelmäßige n-Ecke besitzen n Achsen- und n-zählige Drehsymmetrie.'),
        dedupeKey: `${tag}:vieleck:ach:${n}`,
        contentIds: [`${tag}:vieleck:ach:${n}`],
      })
    },
    (rng) => {
      const n = pick(rng, [3, 4, 6])
      return valueTask({
        question: `Kleinster Drehwinkel (in Grad), der ein regelmäßiges ${n}-Eck auf sich abbildet?`,
        answerKind: 'integer',
        value: 360 / n,
        solution: `${360 / n}°`,
        unit: '°',
        explanation: `360° : ${n} = ${360 / n}°.`,
        fachwissen: fw('Drehsymmetrieordnung n: kleinster positiver Drehwinkel 360°/n.'),
        dedupeKey: `${tag}:vieleck:dreh:${n}`,
        contentIds: [`${tag}:vieleck:dreh:${n}`],
      })
    },
  )
}

function makeTaeuschung(tag: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const a = randInt(rng, 3, 12)
      return appliedMc(rng, {
        question: `Optische Täuschung: Zwei Strecken wirken verschieden lang, messen aber beide ${a} cm. Was prüft man am besten?`,
        correct: 'Nachmessen mit dem Lineal',
        distractors: ['Nur aus dem Augenwinkel schätzen', 'Die Farbe der Linien vergleichen', 'Den Bildschirm drehen', 'Nur die Endpunkte zählen'],
        explanation: 'Geometrische Länge entscheidet — nicht der visuelle Eindruck.',
        fachwissen: fw('Räumliche Illusionen nutzen Kontextlinien; Messen und Konstruktion entlarven den Eindruck.'),
        dedupeKey: `${tag}:taeusch:${a}`,
        contentIds: [`${tag}:taeusch:${a}`],
      })
    },
    (rng) => {
      const n = randInt(rng, 2, 5)
      return valueTask({
        question: `In einer Scheinraum-Zeichnung erscheinen ${n} Fluchtpunkt(e). Wie viele Fluchtpunkte hat eine typische Ein-Punkt-Perspektive?`,
        answerKind: 'integer',
        value: 1,
        solution: '1',
        explanation: 'Ein-Punkt-Perspektive: genau ein Fluchtpunkt auf dem Horizont.',
        fachwissen: fw('Zentralperspektive: parallele Kanten treffen sich im Fluchtpunkt — das erzeugt Tiefenwirkung.'),
        dedupeKey: `${tag}:flucht:${n}`,
        contentIds: [`${tag}:flucht:${n}`],
      })
    },
    (rng) => {
      const w = randInt(rng, 4, 10)
      return appliedMc(rng, {
        question: `Zwei gleich lange Strecken (${w} cm) wirken durch Pfeilspitzen verschieden. Was verursacht die Täuschung?`,
        correct: 'Kontextlinien und Winkel täuschen den Längeneindruck',
        distractors: ['Die Strecken haben wirklich andere Längen', 'Nur die Bildschirmfarbe', 'Der Maßstab des Lineals ändert sich', 'Koordinatenachsen fehlen'],
        explanation: 'Die Müller-Lyer-Täuschung nutzt Kontextwinkel — die gemessene Länge bleibt gleich.',
        fachwissen: fw('Optische Täuschungen entstehen durch Kontext; Messen und Konstruktion liefern die wahre Länge.'),
        dedupeKey: `${tag}:mueller:${w}`,
        contentIds: [`${tag}:mueller:${w}`],
      })
    },
    (rng) => {
      const d = randInt(rng, 2, 8)
      return valueTask({
        question: `Bei einer Zwei-Punkt-Perspektive liegen ${d} Kantenlinien auf Fluchtstrahlen. Wie viele Fluchtpunkte hat die Zwei-Punkt-Perspektive?`,
        answerKind: 'integer',
        value: 2,
        solution: '2',
        explanation: 'Zwei-Punkt-Perspektive: zwei Fluchtpunkte auf dem Horizont.',
        fachwissen: fw('Ein-/Zwei-/Drei-Punkt-Perspektive: Anzahl der Fluchtpunkte entspricht den Hauptflucht-Richtungen.'),
        dedupeKey: `${tag}:zwei:${d}`,
        contentIds: [`${tag}:zwei:${d}`],
      })
    },
  )
}

function makeAchsenTagged(tag: string, focus: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const fig = pick(rng, [
        ['Quadrat', 4],
        ['gleichseitiges Dreieck', 3],
        ['Rechteck (kein Quadrat)', 2],
        ['regelmäßiges Sechseck', 6],
      ] as const)
      return valueTask({
        question: `${focus}: Wie viele Symmetrieachsen hat ein ${fig[0]}?`,
        answerKind: 'integer',
        value: fig[1],
        solution: String(fig[1]),
        explanation: `${fig[0]} → ${fig[1]} Achsen.`,
        fachwissen: fw('Achsensymmetrie: Spiegelung an einer Geraden bildet die Figur auf sich ab.'),
        dedupeKey: `${tag}:achsen:${fig[0]}`,
        contentIds: [`${tag}:achsen:${fig[0]}`],
      })
    },
    (rng) => {
      const n = pick(rng, [3, 4, 5, 6, 8])
      return valueTask({
        question: `${focus}: Regelmäßiges ${n}-Eck — Anzahl der Symmetrieachsen?`,
        answerKind: 'integer',
        value: n,
        solution: String(n),
        explanation: `n = ${n} Achsen.`,
        fachwissen: fw('Bei regelmäßigen n-Ecken gibt es genau n Symmetrieachsen.'),
        dedupeKey: `${tag}:achsen:n:${n}`,
        contentIds: [`${tag}:achsen:n:${n}`],
      })
    },
    (rng) =>
      appliedMc(rng, {
        question: `${focus}: Wie viele Symmetrieachsen hat ein Kreis?`,
        correct: 'unendlich viele',
        distractors: ['1', '2', '4', '0'],
        explanation: 'Jeder Durchmesser ist Symmetrieachse.',
        fachwissen: fw('Der Kreis ist achsensymmetrisch zu jedem Durchmesser.'),
        dedupeKey: `${tag}:achsen:kreis`,
      }),
  )
}

/** Würfel/Netz/Raum — großer Pool (ersetzt dünnes lb4-wuerfelnetz). */
function makeRaumNetz(tag: string, focus: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const a = randInt(rng, 2, 9)
      return valueTask({
        question: `${focus}: Ein Würfel hat Kantenlänge ${a} cm. Wie viele Flächen hat er?`,
        answerKind: 'integer',
        value: 6,
        solution: '6',
        explanation: 'Jeder Würfel hat 6 Quadrate als Seitenflächen.',
        fachwissen: fw('Würfel: 6 Flächen, 12 Kanten, 8 Ecken. Euler: E − K + F = 2.'),
        dedupeKey: `${tag}:fl:${a}`,
        contentIds: [`${tag}:fl:${a}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 2, 9)
      return valueTask({
        question: `${focus}: Ein Würfel mit Kantenlänge ${a} cm — wie viele Kanten?`,
        answerKind: 'integer',
        value: 12,
        solution: '12',
        explanation: '12 Kanten.',
        fachwissen: fw('Am Würfel stoßen an jeder Ecke 3 Kanten; insgesamt 12 Kanten.'),
        dedupeKey: `${tag}:ka:${a}`,
        contentIds: [`${tag}:ka:${a}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 2, 8)
      return valueTask({
        question: `${focus}: Wie viele Ecken hat ein Würfel (Kante ${a})?`,
        answerKind: 'integer',
        value: 8,
        solution: '8',
        explanation: '8 Ecken.',
        fachwissen: fw('Der Würfel ist ein regelmäßiges Hexaeder mit 8 Ecken.'),
        dedupeKey: `${tag}:ec:${a}`,
        contentIds: [`${tag}:ec:${a}`],
      })
    },
    (rng) => {
      const e = 8
      const k = 12
      const f = 6
      const n = randInt(rng, 1, 5)
      return valueTask({
        question: `${focus}: Euler-Formel für den Würfel: E − K + F = ? (Probe ${n})`,
        answerKind: 'integer',
        value: 2,
        solution: '2',
        explanation: `${e} − ${k} + ${f} = 2.`,
        fachwissen: fw('Für konvexe Polyeder gilt E − K + F = 2 (Euler).'),
        dedupeKey: `${tag}:euler:${n}`,
        contentIds: [`${tag}:euler:${n}`],
      })
    },
    (rng) => {
      const n = randInt(rng, 3, 8)
      return appliedMc(rng, {
        question: `${focus}: Ein Würfelnetz besteht aus wie vielen Quadraten? (Variante ${n})`,
        correct: '6',
        distractors: ['4', '5', '7', '8', '12'],
        explanation: 'Genau die 6 Seitenflächen.',
        fachwissen: fw('Ein Würfelnetz ist eine zusammenhängende Abwicklung der 6 Quadrate ohne Überlappung.'),
        dedupeKey: `${tag}:netz6:${n}`,
        contentIds: [`${tag}:netz6:${n}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 2, 10)
      return valueTask({
        question: `${focus}: Oberfläche eines Würfels mit Kante ${a} cm (in cm²)?`,
        answerKind: 'integer',
        value: 6 * a * a,
        solution: String(6 * a * a),
        unit: 'cm²',
        explanation: `O = 6·${a}² = ${6 * a * a} cm².`,
        fachwissen: fw(
          'Die Oberfläche eines Würfels mit Kantenlänge a beträgt O = 6·a² — sechs gleiche Quadrate.',
        ),
        dedupeKey: `${tag}:o:${a}`,
        contentIds: [`${tag}:o:${a}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 2, 8)
      return valueTask({
        question: `${focus}: Volumen eines Würfels mit Kante ${a} cm (in cm³)?`,
        answerKind: 'integer',
        value: a * a * a,
        solution: String(a * a * a),
        unit: 'cm³',
        explanation: `V = ${a}³ = ${a * a * a} cm³.`,
        fachwissen: fw(
          'Das Volumen eines Würfels mit Kantenlänge a berechnet man als V = a³ (Länge · Breite · Höhe).',
        ),
        dedupeKey: `${tag}:v:${a}`,
        contentIds: [`${tag}:v:${a}`],
      })
    },
    (rng) => {
      const n = randInt(rng, 2, 9)
      return appliedMc(rng, {
        question: `${focus}: Welche Aussage zu Würfelnetzen ist richtig? (Fall ${n})`,
        correct: 'Es gibt mehrere verschiedene gültige Netze',
        distractors: [
          'Es gibt genau ein gültiges Netz',
          'Jedes Anordnung aus 6 Quadraten ist ein Netz',
          'Würfel haben keine Netze',
          'Nur Ketten aus 6 Quadraten funktionieren',
        ],
        explanation: 'Es gibt 11 Netze bis auf Kongruenz.',
        fachwissen: fw(
          'Zu Würfelnetzen gibt es mehrere richtige Aussagen: Nicht jede Anordnung aus 6 Quadraten ist faltbar, aber es gibt verschiedene gültige Netze.',
        ),
        dedupeKey: `${tag}:anz:${n}`,
        contentIds: [`${tag}:anz:${n}`],
      })
    },
    (rng) => {
      const f = randInt(rng, 4, 12)
      return valueTask({
        question: `${focus}: Ein gerades Prisma hat ${f} Seitenflächen (ohne Deckel/Boden gezählt?). Nein — insgesamt inkl. Deckel: wie viele Flächen hat ein Dreieckprisma?`,
        answerKind: 'integer',
        value: 5,
        solution: '5',
        explanation: '3 Rechtecke + 2 Dreiecke = 5 Flächen.',
        fachwissen: fw('n-seitiges Prisma: n + 2 Flächen (n Rechtecke + 2 n-Ecke).'),
        dedupeKey: `${tag}:prisma:${f}`,
        contentIds: [`${tag}:prisma:5:${f}`],
      })
    },
    (rng) => {
      const n = randInt(rng, 3, 8)
      return valueTask({
        question: `${focus}: Wie viele Fluchtpunkte hat eine typische Ein-Punkt-Perspektive? (Skizze ${n})`,
        answerKind: 'integer',
        value: 1,
        solution: '1',
        explanation: 'Ein Fluchtpunkt auf dem Horizont.',
        fachwissen: fw('Zentralperspektive: parallele Kanten treffen sich im Fluchtpunkt.'),
        dedupeKey: `${tag}:flucht:${n}`,
        contentIds: [`${tag}:flucht:${n}`],
      })
    },
  )
}

/** Grafische Anteile / Kreisdiagramm — großer Pool. */
function makeAnteilGrafik(tag: string, focus: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const n = randInt(rng, 2, 12)
      const d = randInt(rng, n + 1, 16)
      return valueTask({
        question: `${focus}: ${n} von ${d} gleich großen Teilen sind gefärbt. Welcher Bruchteil ist gefärbt? (Zähler)`,
        answerKind: 'integer',
        value: n,
        solution: String(n),
        explanation: `Gefärbt: ${n}/${d}.`,
        fachwissen: fw('Anteil = gefärbte Teile : alle gleich großen Teile.'),
        dedupeKey: `${tag}:z:${n}:${d}`,
        contentIds: [`${tag}:z:${n}:${d}`],
      })
    },
    (rng) => {
      const pct = pick(rng, [10, 20, 25, 40, 50, 60, 75])
      return valueTask({
        question: `${focus}: Ein Kreisdiagramm zeigt ${pct} %. Wie groß ist der Mittelpunktswinkel in Grad?`,
        answerKind: 'integer',
        value: (pct / 100) * 360,
        solution: String((pct / 100) * 360),
        unit: '°',
        explanation: `${pct} % von 360° = ${(pct / 100) * 360}°.`,
        fachwissen: fw('Im Kreisdiagramm: Winkel = Anteil · 360°.'),
        dedupeKey: `${tag}:w:${pct}`,
        contentIds: [`${tag}:w:${pct}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 1, 5)
      const b = randInt(rng, a + 1, 10)
      return appliedMc(rng, {
        question: `${focus}: Welcher Bruch ist größer: ${a}/${b} oder ${a}/${b + 1}?`,
        correct: `${a}/${b}`,
        distractors: [`${a}/${b + 1}`, 'gleich groß', `${b}/${a}`, '0'],
        explanation: `Gleicher Zähler, kleinerer Nenner → größerer Bruch: ${a}/${b}.`,
        fachwissen: fw('Bei gleichem Zähler ist der Bruch mit dem kleineren Nenner größer.'),
        dedupeKey: `${tag}:vgl:${a}:${b}`,
        contentIds: [`${tag}:vgl:${a}:${b}`],
      })
    },
    (rng) => {
      const k = randInt(rng, 2, 9)
      return valueTask({
        question: `${focus}: Ein Rechteck ist in ${k} gleiche Streifen geteilt, 1 ist gefärbt. Nenner des Anteils?`,
        answerKind: 'integer',
        value: k,
        solution: String(k),
        explanation: `Anteil 1/${k}.`,
        fachwissen: fw('Einheitliche Teilung: Nenner = Anzahl der gleich großen Teile.'),
        dedupeKey: `${tag}:str:${k}`,
        contentIds: [`${tag}:str:${k}`],
      })
    },
    (rng) => {
      const p = pick(rng, [1, 2, 3, 4])
      const q = 4
      return valueTask({
        question: `${focus}: ${p} von ${q} Viertelkreisen sind gefärbt. Anteil in Prozent?`,
        answerKind: 'integer',
        value: (p / q) * 100,
        solution: String((p / q) * 100),
        unit: '%',
        explanation: `${p}/${q} = ${(p / q) * 100} %.`,
        fachwissen: fw('Bruch → Prozent: mit 100 multiplizieren.'),
        dedupeKey: `${tag}:pct:${p}`,
        contentIds: [`${tag}:pct:${p}`],
      })
    },
  )
}

/** Konstruktion / Mittelsenkrechte — großer Pool. */
function makeKonstruktion(tag: string, focus: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const a = randInt(rng, 4, 20)
      return valueTask({
        question: `${focus}: Strecke AB = ${a} cm. Welchen Abstand hat der Mittelpunkt M von A (in cm)?`,
        answerKind: 'decimal',
        value: a / 2,
        solution: formatDe(a / 2),
        unit: 'cm',
        explanation: `M liegt in der Mitte: ${formatDe(a / 2)} cm von A.`,
        fachwissen: fw('Mittelsenkrechte: Gerade durch den Mittelpunkt von AB, senkrecht zu AB.'),
        dedupeKey: `${tag}:mid:${a}`,
        contentIds: [`${tag}:mid:${a}`],
      })
    },
    (rng) => {
      const n = randInt(rng, 2, 12)
      return appliedMc(rng, {
        question: `${focus}: Welcher Punkt liegt auf der Mittelsenkrechten von AB? (Fall ${n})`,
        correct: 'Jeder Punkt mit gleichem Abstand zu A und B',
        distractors: [
          'Nur der Punkt A',
          'Nur der Punkt B',
          'Nur Punkte auf der Strecke AB',
          'Der Umkreismittelpunkt eines beliebigen Dreiecks',
        ],
        explanation: 'Definition: Menge aller Punkte mit gleichem Abstand zu A und B.',
        fachwissen: fw('Die Mittelsenkrechte ist der Ort aller Punkte, die von A und B gleich weit entfernt sind.'),
        dedupeKey: `${tag}:def:${n}`,
        contentIds: [`${tag}:def:${n}`],
      })
    },
    (rng) => {
      const r = randInt(rng, 3, 10)
      return valueTask({
        question: `${focus}: Umkreisradius eines gleichseitigen Dreiecks mit Umkreisradius ${r} cm — Abstand Mittelpunkt zu einer Ecke?`,
        answerKind: 'integer',
        value: r,
        solution: String(r),
        unit: 'cm',
        explanation: `Alle Ecken liegen auf dem Umkreis → Abstand = ${r} cm.`,
        fachwissen: fw('Umkreismittelpunkt: Schnitt der Mittelsenkrechten; Abstand zu allen Ecken gleich (Radius).'),
        dedupeKey: `${tag}:u:${r}`,
        contentIds: [`${tag}:u:${r}`],
      })
    },
    (rng) => {
      const n = randInt(rng, 2, 10)
      return valueTask({
        question: `${focus}: Wie viele Mittelsenkrechten bestimmen den Umkreismittelpunkt eines Dreiecks eindeutig? (mind., Fall ${n})`,
        answerKind: 'integer',
        value: 2,
        solution: '2',
        explanation: 'Zwei Mittelsenkrechten schneiden sich im Umkreismittelpunkt; die dritte geht ebenfalls hindurch.',
        fachwissen: fw('Im Dreieck schneiden sich die drei Mittelsenkrechten in einem Punkt (Umkreismittelpunkt).'),
        dedupeKey: `${tag}:zwei:${n}`,
        contentIds: [`${tag}:zwei:${n}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 5, 15)
      return appliedMc(rng, {
        question: `${focus}: Beim Konstruieren der Mittelsenkrechten zu AB (${a} cm) öffnet man den Zirkel …`,
        correct: 'auf mehr als die Hälfte von AB',
        distractors: [
          'genau auf AB',
          'auf weniger als ein Viertel von AB',
          'beliebig klein',
          'genau auf den Radius 0',
        ],
        explanation: 'Die Kreise um A und B müssen sich schneiden → Radius > AB/2.',
        fachwissen: fw('Konstruktion: Kreise um A und B mit gleichem Radius > AB/2; Verbindungsgerade der Schnittpunkte.'),
        dedupeKey: `${tag}:zirk:${a}`,
        contentIds: [`${tag}:zirk:${a}`],
      })
    },
  )
}

/** Schriftliches Rechnen — großer Pool. */
function makeSchriftlich(tag: string, focus: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const a = randInt(rng, 12, 89)
      const b = randInt(rng, 13, 89)
      return valueTask({
        question: `${focus}: Berechne schriftlich: ${a} + ${b}`,
        answerKind: 'integer',
        value: a + b,
        solution: String(a + b),
        explanation: `${a} + ${b} = ${a + b}.`,
        fachwissen: fw('Schriftliche Addition: Stellen untereinander, von rechts nach links, Übertrag beachten.'),
        dedupeKey: `${tag}:add:${a}:${b}`,
        contentIds: [`${tag}:add:${a}:${b}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 40, 99)
      const b = randInt(rng, 10, a - 1)
      return valueTask({
        question: `${focus}: Berechne schriftlich: ${a} − ${b}`,
        answerKind: 'integer',
        value: a - b,
        solution: String(a - b),
        explanation: `${a} − ${b} = ${a - b}.`,
        fachwissen: fw('Schriftliche Subtraktion: von rechts nach links, bei Bedarf entbündeln.'),
        dedupeKey: `${tag}:sub:${a}:${b}`,
        contentIds: [`${tag}:sub:${a}:${b}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 12, 48)
      const b = randInt(rng, 3, 9)
      return valueTask({
        question: `${focus}: Berechne schriftlich: ${a} · ${b}`,
        answerKind: 'integer',
        value: a * b,
        solution: String(a * b),
        explanation: `${a} · ${b} = ${a * b}.`,
        fachwissen: fw('Schriftliche Multiplikation: Einmaleins und Stellenwerte.'),
        dedupeKey: `${tag}:mul:${a}:${b}`,
        contentIds: [`${tag}:mul:${a}:${b}`],
      })
    },
  )
}

/** Größen ordnen. */
function makeGroessenOrdnen(tag: string, focus: string): Topic['generate'] {
  return mixedVariants(
    (rng) => {
      const cm = randInt(rng, 2, 9)
      return valueTask({
        question: `${focus}: ${cm} cm = ? mm`,
        answerKind: 'integer',
        value: cm * 10,
        solution: String(cm * 10),
        unit: 'mm',
        explanation: `1 cm = 10 mm ⇒ ${cm} cm = ${cm * 10} mm.`,
        fachwissen: fw(
          'Längen umrechnen: 1 m = 100 cm = 1000 mm. Zentimeter in Millimeter: mit 10 multiplizieren.',
        ),
        dedupeKey: `${tag}:cm:${cm}`,
        contentIds: [`${tag}:cm:${cm}`],
      })
    },
    (rng) => {
      const g = randInt(rng, 2, 9)
      return valueTask({
        question: `${focus}: ${g} kg = ? g`,
        answerKind: 'integer',
        value: g * 1000,
        solution: String(g * 1000),
        unit: 'g',
        explanation: `1 kg = 1000 g ⇒ ${g} kg = ${g * 1000} g.`,
        fachwissen: fw(
          'Masse umrechnen: 1 kg = 1000 g. Kilogramm in Gramm: mit 1000 multiplizieren.',
        ),
        dedupeKey: `${tag}:kg:${g}`,
        contentIds: [`${tag}:kg:${g}`],
      })
    },
    (rng) => {
      const a = randInt(rng, 2, 8)
      const b = a + randInt(rng, 1, 5)
      return appliedMc(rng, {
        question: `${focus}: Was ist größer: ${a} m oder ${b * 10} cm?`,
        correct: `${a} m`,
        distractors: [`${b * 10} cm`, 'gleich', `${b} mm`, '0 m'],
        explanation: `${a} m = ${a * 100} cm > ${b * 10} cm.`,
        fachwissen: fw(
          `Größen vergleichen: ${a} m und ${b * 10} cm zuerst in dieselbe Einheit umrechnen, dann der Größe nach ordnen.`,
        ),
        dedupeKey: `${tag}:vgl:${a}:${b}`,
        contentIds: [`${tag}:vgl:${a}:${b}`],
      })
    },
  )
}

export const OS_CROSS_UNIQUE_GENERATORS: Record<string, Topic['generate']> = {
  'os-k5-lbw1-zahlzeichen': genOsZahlzeichen,
  'os-k5-lbw1-abakus': genOsAbakus,
  'os-k5-lbw1-stellenwert': genOsStellenwert,
  'os-k5-lb4-achsen': genOsAchsen,
  'os-k5-lb4-deckung': genOsDeckung,
  'os-k5-lb4-spiegelung': makeSpiegel('os-k5-spiegel', 'y'),
  'os-k5-lb4-drehung': generateDrehungK5,
  'os-k5-lb2-vergleichen': genOsBruchVergleichK5,
  'os-k6-lb1-vergleichen': genOsBruchVergleichK6,
  'os-k5-lb3-winkelarten': makeWinkelArten('os-k5-wa', 'Winkelarten'),
  'os-k6-lb3-einteilung': makeWinkelArten('os-k6-einteilung', 'Dreieckseinteilung nach Winkeln'),
  'os-k6-lbw1-messen': makeWinkelArten('os-k6-messen', 'Winkel messen am Bildschirm'),
  'os-k5-lb3-lage': makeLage('os-k5-lage', 'Lage im Koordinatensystem'),
  'os-hs-k8-lb3-lage': makeLage('os-hs-lage', 'Lagebeziehungen in der Ebene'),
  'os-rs-k8-lb3-lage': makeLage('os-rs-lage', 'Lage und Schnitt von Geraden'),
  'os-hs-k7-lbw1-parkett': makeParkett('os-hs-parkett', 'Bandornament/Parkett'),
  'os-rs-k7-lbw3-parkett': makeParkett('os-rs-parkett', 'Parkettierung der Ebene'),
  'os-hs-k7-lbw1-spiegel': makeSpiegel('os-hs-spiegel', 'x'),
  'os-rs-k7-lbw3-symmetrie': makeAchsenTagged('os-rs-sym', 'Symmetrie in Parketten'),
  'os-hs-k7-lbw2-taeuschung': makeTaeuschung('os-hs-taeusch'),
  'os-hs-k8-lb3-vieleck': makeVieleck('os-hs-vieleck'),
  'os-k6-lbw1-dgs': makeDgs('os-k6-dgs', 'DGS Klasse 6'),
  'os-k6-lbw1-konstruktion': makeDgs('os-k6-konstr', 'Grundkonstruktionen am Computer'),
  'os-rs-k10-lbw1-dgs': makeDgs('os-rs10-dgs', 'Zentralperspektive/DGS'),
  'os-rs-k10-lbw1-ort': makeDgs('os-rs10-ort', 'Ortslinien'),
  'os-rs-k10-lbw1-makro': makeDgs('os-rs10-makro', 'Makros'),

  // Short-round-Füller (dünne Gym-Pools)
  'os-k5-lb2-anteil': makeAnteilGrafik('os-k5-anteil', 'Anteil'),
  'os-k6-lb2-darstellung': makeAnteilGrafik('os-k6-darst', 'Darstellung von Anteilen'),
  'os-hs-k8-lb1-diagramme': makeAnteilGrafik('os-hs-diag', 'Diagramme'),
  'st-k5-bruch-grafik': makeAnteilGrafik('st-bruch-g', 'Brüche grafisch'),
  'sks-k5-bruch-grafik': makeAnteilGrafik('sks-bruch-g', 'Brüche grafisch'),

  'os-k5-lb3-wuerfel': makeRaumNetz('os-k5-wuerfel', 'Würfel'),
  'os-hs-k7-lbw2-perspektive': makeRaumNetz('os-hs-persp', 'Perspektive'),
  'os-hs-k8-lb4-darstellen': makeRaumNetz('os-hs-k8-dar', 'Körper darstellen'),
  'os-hs-k9-lb2-darstellen': makeRaumNetz('os-hs-k9-dar', 'Körper darstellen'),
  'os-hs-k9-lbw3-zeichnen': makeRaumNetz('os-hs-zeich', 'Körper zeichnen'),
  'os-hs-k9-lbw3-schnitt': makeRaumNetz('os-hs-schnitt', 'Schnitte'),
  'os-rs-k7-lbw1-zeichnen': makeRaumNetz('os-rs-zeich', 'Körper zeichnen'),
  'os-rs-k7-lbw1-schnitt': makeRaumNetz('os-rs-schnitt', 'Schnitte'),
  'os-rs-k8-lb3-darstellen': makeRaumNetz('os-rs-k8-dar', 'Körper darstellen'),
  'os-rs-k8-lbw3-polyeder': makeRaumNetz('os-rs-poly', 'Polyeder'),
  'os-rs-k8-lbw3-netz': makeRaumNetz('os-rs-netz', 'Netze'),
  'os-rs-k8-lbw3-euler': makeRaumNetz('os-rs-euler', 'Euler'),
  'os-rs-k9-lb2-darstellen': makeRaumNetz('os-rs-k9-dar', 'Körper darstellen'),
  'os-rs-k9-lbw2-schnitt': makeRaumNetz('os-rs9-schnitt', 'Schnitte'),
  'os-rs-k9-lbw2-netz': makeRaumNetz('os-rs9-netz', 'Netze'),
  'st-k6-wuerfelnetz': makeRaumNetz('st-wuerfelnetz', 'Würfelnetz'),
  'sks-k7-netz': makeRaumNetz('sks-netz', 'Netze'),

  'os-hs-k7-lb4-konstruieren': makeKonstruktion('os-hs-konstr', 'Konstruieren'),
  'os-rs-k7-lb4-konstruieren': makeKonstruktion('os-rs-konstr', 'Konstruieren'),
  'st-k7-mittelsenkrechte': makeKonstruktion('st-ms', 'Mittelsenkrechte'),
  'sks-k6-umkreis': makeKonstruktion('sks-umkreis', 'Umkreis'),

  'st-k5-nat-schriftlich': makeSchriftlich('st-schrift', 'Schriftliches Rechnen'),
  'sks-k5-nat-schriftlich': makeSchriftlich('sks-schrift', 'Schriftliches Rechnen'),
  'st-k5-groessen-ordnen': makeGroessenOrdnen('st-groessen', 'Größen ordnen'),
  'sks-k5-groessen-ordnen': makeGroessenOrdnen('sks-groessen', 'Größen ordnen'),
  'st-k6-bruch-vergleichen': genOsBruchVergleichK6,
  'sks-k6-bruch-vergleichen': genOsBruchVergleichK6,
  'st-k5-geo-koord-ablesen': makeLage('st-koord', 'Koordinaten ablesen'),
  'sks-k5-geo-koord-ablesen': makeLage('sks-koord', 'Koordinaten ablesen'),
}
