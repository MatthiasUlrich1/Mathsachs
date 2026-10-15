/**
 * OS-Themen, die bisher denselben Gym-Generator teilten → jeweils eigener Pool
 * (Cross-Topic-Duplikate / Themenbindung).
 */
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
          question: `Spiegelung an der y-Achse (${tag}): Wohin fällt A(${x}|${y})?`,
          correct: `(−${x}|${y})`,
          distractors: [`(${x}|−${y})`, `(−${x}|−${y})`, `(${y}|${x})`, `(${x}|${y})`],
          explanation: `(x|y) → (−x|y).`,
          fachwissen: fw('Spiegelung an der y-Achse: x wechselt das Vorzeichen, y bleibt.'),
          dedupeKey: `${tag}:spiegel:y:${x}:${y}`,
        })
      }
      if (axis === 'x') {
        return appliedMc(rng, {
          question: `Spiegelung an der x-Achse (${tag}): Wohin fällt B(${x}|${y})?`,
          correct: `(${x}|−${y})`,
          distractors: [`(−${x}|${y})`, `(−${x}|−${y})`, `(${y}|${x})`, `(0|${y})`],
          explanation: `(x|y) → (x|−y).`,
          fachwissen: fw('Spiegelung an der x-Achse: y wechselt das Vorzeichen, x bleibt.'),
          dedupeKey: `${tag}:spiegel:x:${x}:${y}`,
        })
      }
      return appliedMc(rng, {
        question: `Punktspiegelung am Ursprung (${tag}): Wohin fällt C(${x}|${y})?`,
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
      const n = randInt(rng, 3, 8)
      return valueTask({
        question: `${title}: Du spiegelst einen Punkt nacheinander an zwei senkrechten Achsen. Welcher Drehwinkel (in Grad) entspricht der Gesamtbewegung?`,
        answerKind: 'integer',
        value: 180,
        solution: '180°',
        unit: '°',
        explanation: 'Zwei Spiegelungen an senkrechten Achsen ergeben eine 180°-Drehung.',
        fachwissen: fw('Verkettung von Geradenspiegelungen: parallel → Verschiebung, schneidend → Drehung um den doppelten Schnittwinkel.'),
        dedupeKey: `${tag}:dgs:180:${n}`,
        contentIds: [`${tag}:dgs:180`],
      })
    },
    (rng) => {
      const steps = randInt(rng, 3, 7)
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
      })
    },
    (rng) => {
      const r = randInt(rng, 2, 6)
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
      const a = randInt(rng, 3, 9)
      return appliedMc(rng, {
        question: `Optische Täuschung: Zwei Strecken wirken verschieden lang, messen aber beide ${a} cm. Was prüft man am besten?`,
        correct: 'Nachmessen mit dem Lineal',
        distractors: ['Nur aus dem Augenwinkel schätzen', 'Die Farbe der Linien vergleichen', 'Den Bildschirm drehen', 'Nur die Endpunkte zählen'],
        explanation: 'Geometrische Länge entscheidet — nicht der visuelle Eindruck.',
        fachwissen: fw('Räumliche Illusionen nutzen Kontextlinien; Messen und Konstruktion entlarven den Eindruck.'),
        dedupeKey: `${tag}:taeusch:${a}`,
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
        contentIds: [`${tag}:flucht:1`],
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
}
