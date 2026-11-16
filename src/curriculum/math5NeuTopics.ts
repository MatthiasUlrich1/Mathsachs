/**
 * Klasse 5 Mathematik — zusätzliche Neu-(Prüfung)-Banken nach Bettermarks.
 * Sibling-IDs: `${parentId}__neu`, neu:true, released:false.
 * Händisch; keine Bulk-Skripte. Originale in math5.ts unberührt.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { formatDe, roundTo } from '../lib/num'
import { gcd, makeFraction } from '../lib/fraction'
import { shuffleChoices } from './biologieHelpers'
import {
  angleProtractorTask,
  choicePickTask,
  clockTask,
  coordinateClickTask,
  digitGridMultiplyTask,
  digitGridTask,
  dragDropSortTask,
  fractionModelTask,
  fractionWallTask,
  divideToolTask,
  fractionTask,
  mixedVariants,
  numberLineTask,
  rulerMeasureTask,
  textTask,
  valueTask,
  numberLineMultiTask,
} from './taskHelpers'
import { ckFormatTime } from '../lib/clockLogic'
import { barChartTableSvg } from '../lib/barChartLogic'
import { symmetryHorizontalVariant, symmetryPointVariantA, symmetryPointVariantB, symmetryVerticalVariant } from './symmetryDrawContent'
import { digitGridDivideTask, longDivisionSteps } from './digitGridTasks'
import {
  generateCompositeCuboidSvg,
  generateCuboidSvg,
  generateFractionBarSvg,
  generateFractionCircleSvg,
  generateFractionGridSvg,
  generateLShapeSvg,
  generatePointReflectionSvg,
  generatePointsOnGridSvg,
  generateRectangleSvg,
  generateReflectionSvg,
  generateSegmentsOnGridSvg,
  generateTranslationSvg,
  generateUShapeSvg,
  pointReflectAcross,
  reflectPointAcross,
  type MirrorLineKind,
} from '../lib/geometrySvg'
import { asNeuTopic } from './neuTopic'
import { SIBLING_SURVEYS, surveyBarChartTask } from './barChartSurveys'
import type { Topic } from './types'

const fmt1 = (n: number): string => n.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Zahl mit echtem Minuszeichen ("−3"), für Koordinaten und Ergebnisse. */
const coordNum = (n: number): string => (n < 0 ? `−${-n}` : `${n}`)
/** Zahl für Rechnungen: negative Zahlen in Klammern ("(−3)"). */
const calcNum = (n: number): string => (n < 0 ? `(−${-n})` : `${n}`)
const coordPair = (x: number, y: number): string => `(${coordNum(x)}|${coordNum(y)})`

/** Whether n is a prime number (n ≥ 2). Lokale Kopie für die Neu-Bank. */
const isPrimeNeu = (n: number): boolean => {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false
  return true
}

/** LB1 — natürliche Zahlen */
export const math5NeuLb1: Topic[] = [
  // ---------------------------------------------------------------------
  // 1) Natürliche Zahlen runden
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-runden-natuerlich', {
    id: 'lb1-runden-natuerlich__neu',
    title: 'Natürliche Zahlen runden (große Zahlen)',
    hint: 'Schau auf die Ziffer rechts von der Rundungsstelle – ab 5 wird aufgerundet.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['runden', 'Zehntausender', 'Hunderttausender', 'Überschlag', 'Zahlenstrahl'],
    fachwissen: {
      text: 'Beim Runden großer Zahlen bleibt das Verfahren gleich: Man schaut auf die Ziffer rechts der Rundungsstelle. Besonders bei sehr großen Zahlen (z. B. Hunderttausendern) nutzt man das Runden häufig für Überschlagsrechnungen, um Ergebnisse grob zu kontrollieren, bevor man genau rechnet.',
      quelle: 'Wikipedia: Runden (Mathematik)',
      url: 'https://de.wikipedia.org/wiki/Runden_(Mathematik)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — mehrstellige Zahl runden
      (rng: Rng) => {
        const n = randInt(rng, 100000, 987654)
        const place = pick(rng, [1000, 10000, 100000])
        const label = place === 1000 ? 'Tausender' : place === 10000 ? 'Zehntausender' : 'Hunderttausender'
        const value = Math.round(n / place) * place
        return valueTask({
          question: `Runde ${formatDe(n)} auf ${label}.`,
          answerKind: 'integer',
          value,
          solution: formatDe(value),
          explanation: `Zum Runden auf ${label} schaust du auf die Ziffer rechts der ${label}stelle: ${formatDe(n)} ≈ ${formatDe(value)}.`,
        })
      },
      // Variant 2: Zahlenstrahl — gerundeten Nachbarn markieren
      (rng: Rng) => {
        const place = pick(rng, [10, 100])
        const multiplier = randInt(rng, 3, 90)
        const lower = multiplier * place
        const upper = lower + place
        const offset = randInt(rng, 1, place - 1)
        const n = lower + offset
        const value = offset * 2 >= place ? upper : lower
        const label = place === 10 ? 'Zehnerzahl' : 'Hunderterzahl'
        return numberLineTask({
          question: `Die Zahl ${formatDe(n)} liegt zwischen ${formatDe(lower)} und ${formatDe(upper)}.\nMarkiere auf dem Zahlenstrahl, auf welche ${label} sie gerundet wird.`,
          min: lower - place / 2,
          max: upper + place / 2,
          step: place / 10,
          decimals: 0,
          value,
          solution: formatDe(value),
          explanation: `${formatDe(n)} liegt näher an ${formatDe(value)} (ab der Mitte wird aufgerundet, sonst abgerundet).`,
          eps: place / 20,
        })
      },
      // Variant 3: MC — richtig gerundeten Wert erkennen
      (rng: Rng) => {
        const place = pick(rng, [10, 100, 1000])
        const label = place === 10 ? 'Zehner' : place === 100 ? 'Hunderter' : 'Tausender'
        const base = randInt(rng, 2, 900)
        const lower = base * place
        const offset = randInt(rng, 1, place - 1)
        const n = lower + offset
        const value = Math.round(n / place) * place
        const choices = [value, value + place, value - place, n]
        const correct = formatDe(value)
        const labeled = shuffleChoices(
          rng,
          choices.map((c) => formatDe(c)),
          correct,
        )
        return choicePickTask({
          question: `Wie lautet ${formatDe(n)} gerundet auf ${label}?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${formatDe(n)} liegt zwischen ${formatDe(lower)} und ${formatDe(lower + place)}. Gerundet auf ${label} ergibt sich ${correct}.`,
          dedupeKey: `rund-mc:${n}:${place}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 2) Addition
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-addition', {
    id: 'lb1-addition__neu',
    title: 'Addition natürlicher Zahlen (Dreiersummen & Ergänzen)',
    hint: 'Reihenfolge und Klammerung sind bei der Addition egal.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Addition', 'Summand', 'Übertrag', 'Ergänzen', 'Dreiersumme', 'Kommutativgesetz'],
    fachwissen: {
      text: 'Bei der Addition mehrerer Summanden darf man die Reihenfolge beliebig wählen (Kommutativgesetz) und beliebig klammern (Assoziativgesetz) — das Ergebnis ändert sich nicht. Ergänzungsaufgaben wie „a + ___ = b“ nutzen den Zusammenhang zur Subtraktion: Der fehlende Summand ergibt sich aus b − a.',
      quelle: 'Wikipedia: Addition',
      url: 'https://de.wikipedia.org/wiki/Addition',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Dreiersumme
      (rng: Rng) => {
        const a = randInt(rng, 124, 4999)
        const b = randInt(rng, 124, 4999)
        const c = randInt(rng, 124, 4999)
        const value = a + b + c
        return valueTask({
          question: `Berechne: ${formatDe(a)} + ${formatDe(b)} + ${formatDe(c)}`,
          answerKind: 'integer',
          value,
          solution: formatDe(value),
          explanation: `Addiere nacheinander: ${formatDe(a)} + ${formatDe(b)} = ${formatDe(a + b)}; dann ${formatDe(a + b)} + ${formatDe(c)} = ${formatDe(value)}.`,
        })
      },
      // Variant 2: Kästchenpapier — fünfstellige Summanden
      (rng: Rng) => {
        const a = randInt(rng, 12500, 89999)
        const b = randInt(rng, 12500, 89999)
        const value = a + b
        return digitGridTask({
          question: 'Addiere schriftlich (fünfstellige Zahlen). Trage die Summe in die Kästchen ein:',
          a,
          b,
          operator: '+',
          value,
          solution: formatDe(value),
          explanation: `Addiere stellenweise mit Übertrag: ${formatDe(a)} + ${formatDe(b)} = ${formatDe(value)}.`,
        })
      },
      // Variant 3: MC — richtige Summe erkennen
      (rng: Rng) => {
        const a = randInt(rng, 1240, 8999)
        const b = randInt(rng, 1240, 8999)
        const value = a + b
        const choices = [value, value + 10, value - 10, value + 100]
        const correct = formatDe(value)
        const labeled = shuffleChoices(
          rng,
          choices.map((c) => formatDe(c)),
          correct,
        )
        return choicePickTask({
          question: `Welches Ergebnis ist richtig? ${formatDe(a)} + ${formatDe(b)} = ?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${formatDe(a)} + ${formatDe(b)} = ${correct}. Achte beim Addieren auf den Übertrag an jeder Stelle.`,
          dedupeKey: `add-mc:${a}:${b}`,
        })
      },
      // Variant 4: Tippen — Ergänzen (Zusammenhang zur Subtraktion)
      (rng: Rng) => {
        const b = randInt(rng, 124, 7999)
        const extra = randInt(rng, 124, 7999)
        const sum = b + extra
        return valueTask({
          question: `Ergänze: ${formatDe(b)} + ___ = ${formatDe(sum)}`,
          answerKind: 'integer',
          value: extra,
          solution: formatDe(extra),
          explanation: `${formatDe(sum)} − ${formatDe(b)} = ${formatDe(extra)}, denn ${formatDe(b)} + ${formatDe(extra)} = ${formatDe(sum)}.`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 3) Subtraktion
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-subtraktion', {
    id: 'lb1-subtraktion__neu',
    title: 'Subtraktion natürlicher Zahlen (mit Nullen)',
    hint: 'Bei Nullen im Minuenden musst du über mehrere Stellen entbündeln.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Subtraktion', 'Minuend', 'Subtrahend', 'Entbündeln', 'Nullen'],
    fachwissen: {
      text: 'Wenn der Minuend Nullen enthält (z. B. 5000), muss man beim schriftlichen Subtrahieren oft über mehrere Stellen hinweg entbündeln: Aus einem Tausender werden zehn Hunderter, aus einem Hunderter zehn Zehner usw. Genaues Arbeiten verhindert Fehler beim mehrfachen Übertrag.',
      quelle: 'Wikipedia: Subtraktion',
      url: 'https://de.wikipedia.org/wiki/Subtraktion',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — fünfstellige Subtraktion
      (rng: Rng) => {
        const a = randInt(rng, 20000, 98999)
        const b = randInt(rng, 1000, a - 1)
        const value = a - b
        return valueTask({
          question: `Berechne: ${formatDe(a)} − ${formatDe(b)}`,
          answerKind: 'integer',
          value,
          solution: formatDe(value),
          explanation: `Subtrahiere stellenweise mit Entbündeln: ${formatDe(a)} − ${formatDe(b)} = ${formatDe(value)}.`,
        })
      },
      // Variant 2: Kästchenpapier — Nullen im Minuenden
      (rng: Rng) => {
        const thousand = randInt(rng, 3, 9)
        const a = thousand * 1000
        const b = randInt(rng, 123, a - 100)
        const value = a - b
        return digitGridTask({
          question: 'Subtrahiere schriftlich:',
          a,
          b,
          operator: '−',
          value,
          solution: formatDe(value),
          explanation: `${formatDe(a)} − ${formatDe(b)} = ${formatDe(value)}. Da der Minuend Nullen enthält, musst du über mehrere Stellen entbündeln.`,
        })
      },
      // Variant 3: MC — richtige Differenz erkennen
      (rng: Rng) => {
        const a = randInt(rng, 2000, 9999)
        const b = randInt(rng, 100, a - 500)
        const value = a - b
        const choices = [value, value + 10, value - 10, value + 100]
        const correct = formatDe(value)
        const labeled = shuffleChoices(
          rng,
          choices.map((c) => formatDe(c)),
          correct,
        )
        return choicePickTask({
          question: `Welches Ergebnis ist richtig? ${formatDe(a)} − ${formatDe(b)} = ?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${formatDe(a)} − ${formatDe(b)} = ${correct}. Achte beim Subtrahieren auf das Entbündeln.`,
          dedupeKey: `sub-mc:${a}:${b}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 4) Multiplikation
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-multiplikation', {
    id: 'lb1-multiplikation__neu',
    title: 'Multiplikation natürlicher Zahlen (große Faktoren)',
    hint: 'Zerlege den zweiten Faktor in Zehner und Einer.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Multiplikation', 'Faktor', 'Teilprodukt', 'Stellenwertverfahren'],
    fachwissen: {
      text: 'Bei größeren Faktoren wird das Stellenwertverfahren erweitert: Man zerlegt den zweiten Faktor in Hunderter, Zehner und Einer und multipliziert den ersten Faktor jeweils damit. Die entstehenden Teilprodukte werden stellenrichtig verschoben und anschließend addiert.',
      quelle: 'Wikipedia: Multiplikation',
      url: 'https://de.wikipedia.org/wiki/Multiplikation',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — dreistellig mal zweistellig
      (rng: Rng) => {
        const a = randInt(rng, 123, 899)
        const b = randInt(rng, 12, 89)
        const value = a * b
        return valueTask({
          question: `Berechne: ${a} · ${b}`,
          answerKind: 'integer',
          value,
          solution: formatDe(value),
          explanation: `Multipliziere schriftlich: ${a} · ${b} = ${formatDe(value)}.`,
        })
      },
      // Variant 2: Kästchenpapier — dreistellig mal zweistellig
      (rng: Rng) => {
        const a = randInt(rng, 123, 899)
        const b = randInt(rng, 12, 89)
        const value = a * b
        return digitGridMultiplyTask({
          question: 'Multipliziere schriftlich (dreistellig · zweistellig). Trage Teilprodukte und Summe ein:',
          a,
          b,
          solution: formatDe(value),
          explanation: `Stellenwertverfahren: ${a} · ${b} = ${formatDe(value)}.`,
        })
      },
      // Variant 3: MC — richtiges Produkt erkennen
      (rng: Rng) => {
        const a = randInt(rng, 12, 99)
        const b = randInt(rng, 12, 99)
        const value = a * b
        const choices = [value, value + a, value - a, value + 10]
        const correct = formatDe(value)
        const labeled = shuffleChoices(
          rng,
          choices.map((c) => formatDe(c)),
          correct,
        )
        return choicePickTask({
          question: `Welches Ergebnis ist richtig? ${a} · ${b} = ?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${a} · ${b} = ${correct}. Prüfe alle Teilprodukte beim schriftlichen Multiplizieren.`,
          dedupeKey: `mul-mc:${a}:${b}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 5) Schriftliches Rechnen (Kästchenpapier) — erweitert
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-schriftliches-rechnen', {
    id: 'lb1-schriftliches-rechnen__neu',
    title: 'Schriftliches Rechnen (Kästchenpapier) — erweitert',
    hint: 'Schreibe stellenrichtig untereinander und trage jede Ziffer in ein Kästchen.',
    pointsPerTask: 10,
    difficulty: 3,
    keywords: ['schriftlich', 'Kästchen', 'Übertrag', 'Stellenwert', 'Überschlag'],
    fachwissen: {
      text: 'Auf Kästchenpapier wird jede Ziffer einem Stellenwert zugeordnet. Besonders bei Nullen im Minuenden, mehrstelligen Faktoren oder Resten bei der Division hilft die klare Spaltenstruktur, Flüchtigkeitsfehler zu vermeiden.',
      quelle: 'Wikipedia: Schriftliches Rechnen',
      url: 'https://de.wikipedia.org/wiki/Schriftliches_Rechnen',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Überschlagsrechnung
      (rng: Rng) => {
        const a = randInt(rng, 1250, 8999)
        const b = randInt(rng, 1250, 8999)
        const roundA = Math.round(a / 100) * 100
        const roundB = Math.round(b / 100) * 100
        const estimate = roundA + roundB
        return valueTask({
          question: `Schätze durch Runden auf Hunderter: ${formatDe(a)} + ${formatDe(b)} ≈ ?`,
          answerKind: 'integer',
          value: estimate,
          solution: formatDe(estimate),
          explanation: `Runde zuerst: ${formatDe(a)} ≈ ${formatDe(roundA)} und ${formatDe(b)} ≈ ${formatDe(roundB)}. Dann: ${formatDe(roundA)} + ${formatDe(roundB)} = ${formatDe(estimate)}.`,
        })
      },
      // Variant 2: Kästchenpapier — Subtraktion mit Nullen
      (rng: Rng) => {
        const thousand = randInt(rng, 3, 9)
        const a = thousand * 1000
        const b = randInt(rng, 123, a - 100)
        const value = a - b
        return digitGridTask({
          question: 'Subtrahiere schriftlich auf dem Kästchenpapier (Nullen im Minuenden):',
          a,
          b,
          operator: '−',
          value,
          solution: formatDe(value),
          explanation: `${formatDe(a)} − ${formatDe(b)} = ${formatDe(value)}.`,
        })
      },
      // Variant 3: Kästchenpapier — dreistellig mal zweistellig
      (rng: Rng) => {
        const a = randInt(rng, 123, 899)
        const b = randInt(rng, 12, 89)
        const value = a * b
        return digitGridMultiplyTask({
          question: 'Multipliziere schriftlich auf dem Kästchenpapier (dreistellig · zweistellig):',
          a,
          b,
          solution: formatDe(value),
          explanation: `${a} · ${b} = ${formatDe(value)}.`,
        })
      },
      // Variant 4: Kästchenpapier — Division mit Rest, größere Zahlen
      (rng: Rng) => {
        const divisor = randInt(rng, 3, 9)
        const q = randInt(rng, 250, 9999)
        const r = randInt(rng, 0, divisor - 1)
        const dividend = q * divisor + r
        return digitGridDivideTask({
          question: 'Dividiere schriftlich auf dem Kästchenpapier. Trage Quotient (und ggf. Rest) ein:',
          dividend,
          divisor,
          quotient: q,
          rest: r,
          solution: r > 0 ? `${q} R ${r}` : String(q),
          explanation:
            r > 0 ? `${dividend} : ${divisor} = ${q} Rest ${r}.` : `${dividend} : ${divisor} = ${q}.`,
        })
      },
      // Variant 5: MC — ersten Rechenschritt der schriftlichen Division erkennen
      (rng: Rng) => {
        const divisor = randInt(rng, 3, 9)
        const q = randInt(rng, 150, 900)
        const dividend = q * divisor + randInt(rng, 0, divisor - 1)
        const { steps } = longDivisionSteps(dividend, divisor)
        const first = steps[0]!
        const correct = `${first.take} : ${divisor} = ${first.qDigit} Rest ${first.remainder}`
        const wrong1 = `${first.take} : ${divisor} = ${first.qDigit + 1} Rest ${Math.max(0, first.remainder - divisor)}`
        const wrong2 = `${first.take} : ${divisor} = ${Math.max(0, first.qDigit - 1)} Rest ${first.remainder + divisor}`
        const wrong3 = `${dividend} : ${divisor} = ${q} Rest 0`
        const choices = shuffleChoices(rng, [correct, wrong1, wrong2, wrong3], correct)
        return choicePickTask({
          question: `Schriftliche Division ${dividend} : ${divisor}: Was ist der erste Rechenschritt?`,
          choices,
          correct,
          solution: correct,
          explanation: `Der erste Schritt nimmt die kleinste führende Ziffernfolge, die mindestens so groß wie der Divisor ist: ${correct}.`,
          dedupeKey: `schriftlDiv-step:${dividend}:${divisor}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 6) Division mit Rest
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-division-rest', {
    id: 'lb1-division-rest__neu',
    title: 'Division mit Rest (große Zahlen)',
    hint: 'Der Rest ist immer kleiner als der Divisor.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Division', 'Rest', 'Quotient', 'Probe'],
    fachwissen: {
      text: 'Bei der Division mit Rest gilt immer: Der Rest ist kleiner als der Divisor. Das lässt sich zur Kontrolle nutzen: Multipliziert man den Quotienten mit dem Divisor und addiert den Rest, muss wieder der Dividend herauskommen (Probe).',
      quelle: 'Wikipedia: Division (Mathematik)',
      url: 'https://de.wikipedia.org/wiki/Division_(Mathematik)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — größere Zahlen
      (rng: Rng) => {
        const divisor = randInt(rng, 3, 9)
        const q = randInt(rng, 120, 950)
        const r = randInt(rng, 1, divisor - 1)
        const dividend = q * divisor + r
        return textTask({
          question: `Berechne mit Rest: ${dividend} : ${divisor}`,
          accepted: [`${q} R ${r}`, `${q}R${r}`, `${q} Rest ${r}`],
          solution: `${q} R ${r}`,
          explanation: `${divisor} passt ${q}-mal in ${dividend} (${divisor} · ${q} = ${q * divisor}). Es bleibt der Rest ${dividend} − ${q * divisor} = ${r}. Also ${q} R ${r}.`,
        })
      },
      // Variant 2: Kästchenpapier
      (rng: Rng) => {
        const divisor = randInt(rng, 3, 9)
        const q = randInt(rng, 120, 950)
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
      // Variant 3: MC — nur den Rest bestimmen
      (rng: Rng) => {
        const divisor = randInt(rng, 4, 9)
        const q = randInt(rng, 11, 300)
        const r = randInt(rng, 1, divisor - 1)
        const dividend = q * divisor + r
        const wrongRests: number[] = []
        for (let k = 0; k < divisor && wrongRests.length < 3; k++) {
          if (k !== r) wrongRests.push(k)
        }
        const correct = String(r)
        const choices = shuffleChoices(rng, [correct, ...wrongRests.map(String)], correct)
        return choicePickTask({
          question: `Welchen Rest lässt ${dividend} bei Division durch ${divisor}?`,
          choices,
          correct,
          solution: correct,
          explanation: `${dividend} : ${divisor} = ${q} Rest ${r}, denn ${divisor} · ${q} = ${divisor * q} und ${dividend} − ${divisor * q} = ${r}.`,
          dedupeKey: `divrest-mc:${dividend}:${divisor}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 7) Schriftliche Division
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-schriftliche-division', {
    id: 'lb1-schriftliche-division__neu',
    title: 'Schriftliche Division (Verfahren verstehen)',
    hint: 'Prüfe zuerst, wie viele führende Ziffern mindestens so groß wie der Divisor sind.',
    pointsPerTask: 10,
    difficulty: 3,
    keywords: ['schriftlich', 'Division', 'Quotient', 'Probe', 'Nullen'],
    fachwissen: {
      text: 'Beim schriftlichen Dividieren bestimmt man zuerst, wie viele führende Ziffern des Dividenden mindestens so groß wie der Divisor sind — das ist die erste Teilzahl. Reicht eine Ziffernfolge nicht aus, schreibt man eine Null in den Quotienten und holt die nächste Ziffer herunter.',
      quelle: 'Wikipedia: Schriftliches Rechnen',
      url: 'https://de.wikipedia.org/wiki/Schriftliches_Rechnen',
    },
    generate: mixedVariants(
      // Variant 1: Kästchenpapier — größere Zahl mit erzwungener Null im Quotienten
      (rng: Rng) => {
        const divisor = randInt(rng, 3, 9)
        let q = randInt(rng, 1000, 90000)
        const qDigits = String(q).split('')
        if (!qDigits.includes('0') && qDigits.length >= 3) {
          qDigits[randInt(rng, 1, qDigits.length - 2)] = '0'
          q = Number(qDigits.join(''))
        }
        const r = randInt(rng, 0, divisor - 1)
        const dividend = q * divisor + r
        return digitGridDivideTask({
          question: 'Dividiere schriftlich (große Zahl):',
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
      // Variant 2: MC — Anzahl der Ziffern des Quotienten
      (rng: Rng) => {
        const divisor = randInt(rng, 3, 9)
        const q = randInt(rng, 100, 9999)
        const r = randInt(rng, 0, divisor - 1)
        const dividend = q * divisor + r
        const correctDigits = String(q).length
        const choices = [correctDigits, correctDigits - 1, correctDigits + 1, correctDigits + 2]
        const correct = String(correctDigits)
        const labeled = shuffleChoices(
          rng,
          choices.map((c) => String(c)),
          correct,
        )
        return choicePickTask({
          question: `Wie viele Ziffern hat der Quotient von ${dividend} : ${divisor}?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${dividend} : ${divisor} = ${q}${r > 0 ? ` Rest ${r}` : ''}. Der Quotient ${q} hat ${correctDigits} Ziffern.`,
          dedupeKey: `schriftlDiv-digits:${dividend}:${divisor}`,
        })
      },
      // Variant 3: Tippen — Probe (Rückrechnung)
      (rng: Rng) => {
        const divisor = randInt(rng, 3, 9)
        const q = randInt(rng, 50, 900)
        const r = randInt(rng, 0, divisor - 1)
        const dividend = q * divisor + r
        return valueTask({
          question: `Mach die Probe zur Division ${dividend} : ${divisor} = ${q}${r > 0 ? ` R ${r}` : ''}.\nBerechne: ${q} · ${divisor}${r > 0 ? ` + ${r}` : ''}`,
          answerKind: 'integer',
          value: dividend,
          solution: formatDe(dividend),
          explanation:
            r > 0
              ? `${q} · ${divisor} = ${q * divisor}, dann ${q * divisor} + ${r} = ${dividend}. Die Probe bestätigt ${dividend} : ${divisor} = ${q} Rest ${r}.`
              : `${q} · ${divisor} = ${dividend}. Die Probe bestätigt ${dividend} : ${divisor} = ${q}.`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 8) Potenzieren
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-potenzieren', {
    id: 'lb1-potenzieren__neu',
    title: 'Potenzieren (Potenzschreibweise & Zehnerpotenzen)',
    hint: 'aⁿ bedeutet: a wird n-mal mit sich selbst multipliziert.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Potenz', 'Exponent', 'Basis', 'Zehnerpotenz', 'Kubikzahl'],
    fachwissen: {
      text: 'Eine Potenz ist eine Kurzschreibweise für eine wiederholte Multiplikation gleicher Faktoren: a · a · a · a = a⁴. Große Zahlen wie 1 000 000 lassen sich mit Zehnerpotenzen (10⁶) besonders kompakt darstellen, da der Exponent genau die Anzahl der Nullen angibt.',
      quelle: 'Wikipedia: Potenz (Mathematik)',
      url: 'https://de.wikipedia.org/wiki/Potenz_(Mathematik)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Umkehrung: Basis gesucht
      (rng: Rng) => {
        const exp = pick(rng, [2, 3])
        const base = exp === 2 ? randInt(rng, 2, 15) : randInt(rng, 2, 9)
        const value = base ** exp
        const sup = exp === 2 ? '²' : '³'
        return valueTask({
          question: `Welche Zahl gehört auf das Fragezeichen? ?${sup} = ${formatDe(value)}`,
          answerKind: 'integer',
          value: base,
          solution: formatDe(base),
          explanation: `Gesucht ist die Basis: ${base}${sup} bedeutet ${Array(exp).fill(String(base)).join(' · ')} = ${formatDe(value)}. Also ist die gesuchte Zahl ${base}.`,
          dedupeKey: `pot-basis:${base}:${exp}`,
        })
      },
      // Variant 2: MC — wiederholte Multiplikation als Potenz schreiben
      (rng: Rng) => {
        const a = randInt(rng, 2, 12)
        const n = randInt(rng, 3, 5)
        const supers = ['⁰', '¹', '²', '³', '⁴', '⁵']
        const correct = `${a}${supers[n]}`
        const wrong1 = `${a} · ${n}`
        const wrong2 = `${n}${supers[a] ?? 'ⁿ'}`
        const wrong3 = `${a}${supers[n - 1]}`
        const choices = shuffleChoices(rng, [correct, wrong1, wrong2, wrong3], correct)
        return choicePickTask({
          question: `Wie schreibt man ${Array(n).fill(String(a)).join(' · ')} als Potenz?`,
          choices,
          correct,
          solution: correct,
          explanation: `${Array(n).fill(String(a)).join(' · ')} ist ${n}-mal der Faktor ${a}, also ${a}${supers[n]} (Basis ${a}, Exponent ${n}).`,
          dedupeKey: `pot-mc:${a}:${n}`,
        })
      },
      // Variant 3: MC — Zahl als Zehnerpotenz erkennen
      (rng: Rng) => {
        const exp = randInt(rng, 3, 7)
        const value = 10 ** exp
        const correct = `10${['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷'][exp]}`
        const choices = [exp - 1, exp, exp + 1, exp + 2].map((e) => `10${['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸'][e]}`)
        const labeled = shuffleChoices(rng, choices, correct)
        return choicePickTask({
          question: `Wie schreibt man ${formatDe(value)} als Zehnerpotenz?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${formatDe(value)} hat ${exp} Nullen, also 10^${exp} = ${correct}.`,
          dedupeKey: `zehnpot-mc:${exp}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 9) Teilbarkeit
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-teilbarkeit', {
    id: 'lb1-teilbarkeit__neu',
    title: 'Teilbarkeit und Rest',
    hint: 'Teilbar heißt: Rest 0 bei der Division.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Teilbarkeit', 'Rest', 'Teilbarkeitsregel', 'Quersumme'],
    fachwissen: {
      text: 'Der Zusammenhang zwischen Teilbarkeit und Rest ist eng: Eine Zahl a ist genau dann durch b teilbar, wenn die Division a : b den Rest 0 lässt. Mit den Teilbarkeitsregeln (z. B. Endziffer bei 2, 5, 10 oder Quersumme bei 3, 9) lässt sich das oft ohne Division direkt erkennen.',
      quelle: 'Wikipedia: Teilbarkeit',
      url: 'https://de.wikipedia.org/wiki/Teilbarkeit',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Rest bestimmen
      (rng: Rng) => {
        const d = pick(rng, [2, 3, 4, 5, 6, 8, 9, 10])
        const n = randInt(rng, 20, 300)
        const value = n % d
        return valueTask({
          question: `Welchen Rest lässt ${n} bei Division durch ${d}?`,
          answerKind: 'integer',
          value,
          solution: formatDe(value),
          explanation:
            value === 0
              ? `${n} : ${d} = ${n / d} ohne Rest, also Rest 0.`
              : `${n} : ${d} = ${Math.floor(n / d)} Rest ${value}.`,
        })
      },
      // Variant 2: MC — Teilbarkeit als Ja/Nein-Auswahl
      (rng: Rng) => {
        const d = pick(rng, [2, 3, 4, 5, 6, 8, 9, 10])
        const divisible = rng() < 0.5
        let n: number
        if (divisible) {
          n = d * randInt(rng, 6, 60)
        } else {
          n = d * randInt(rng, 6, 60) + randInt(rng, 1, d - 1)
        }
        const yes = n % d === 0
        const correct = yes ? 'ja' : 'nein'
        return choicePickTask({
          question: `Ist ${n} durch ${d} teilbar?`,
          choices: ['ja', 'nein'],
          correct,
          solution: correct,
          explanation: yes
            ? `${n} : ${d} = ${n / d} ohne Rest. Also ist ${n} durch ${d} teilbar.`
            : `${n} : ${d} = ${Math.floor(n / d)} Rest ${n % d}. Also ist ${n} nicht durch ${d} teilbar.`,
          dedupeKey: `teilbar-janein:${n}:${d}`,
        })
      },
      // Variant 3: MC — die durch d teilbare Zahl in einer Liste finden
      (rng: Rng) => {
        const d = pick(rng, [3, 4, 6, 8, 9])
        const correctValue = d * randInt(rng, 6, 40)
        const wrongOffsets = [1, 2, 3].map((o) => (o % d === 0 ? o + 1 : o))
        const wrongs = wrongOffsets.map((o) => correctValue + o)
        const correct = formatDe(correctValue)
        const choices = shuffleChoices(
          rng,
          [correctValue, ...wrongs].map((n) => formatDe(n)),
          correct,
        )
        return choicePickTask({
          question: `Welche dieser Zahlen ist durch ${d} teilbar?`,
          choices,
          correct,
          solution: correct,
          explanation: `${correctValue} : ${d} = ${correctValue / d} ohne Rest. Die anderen Zahlen lassen bei Division durch ${d} einen Rest.`,
          dedupeKey: `teilbar-find:${correctValue}:${d}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 10) Primzahlen
  // ---------------------------------------------------------------------
  asNeuTopic('lb1-primzahl', {
    id: 'lb1-primzahl__neu',
    title: 'Primzahlen erkennen (erweitert)',
    hint: 'Eine Primzahl hat genau zwei Teiler: 1 und sich selbst.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Primzahl', 'Teiler', 'Primfaktorzerlegung'],
    fachwissen: {
      text: 'Primzahlen werden mit wachsender Zahl seltener, kommen aber unendlich oft vor (bewiesen von Euklid). Um zu prüfen, ob eine Zahl prim ist, genügt es, die Teilbarkeit durch alle Primzahlen bis zur Quadratwurzel der Zahl auszuschließen.',
      quelle: 'Wikipedia: Primzahl',
      url: 'https://de.wikipedia.org/wiki/Primzahl',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Primzahlen in einem Bereich zählen
      (rng: Rng) => {
        const start = randInt(rng, 2, 60)
        const end = start + randInt(rng, 8, 15)
        let count = 0
        for (let i = start; i <= end; i++) if (isPrimeNeu(i)) count++
        return valueTask({
          question: `Wie viele Primzahlen liegen zwischen ${start} und ${end} (einschließlich)?`,
          answerKind: 'integer',
          value: count,
          solution: formatDe(count),
          explanation: `Primzahlen zwischen ${start} und ${end}: ${Array.from({ length: end - start + 1 }, (_, i) => start + i)
            .filter(isPrimeNeu)
            .join(', ') || 'keine'}. Das sind ${count} Primzahlen.`,
        })
      },
      // Variant 2: MC — Primzahl als Ja/Nein-Auswahl (größerer Bereich)
      (rng: Rng) => {
        const n = randInt(rng, 60, 200)
        const yes = isPrimeNeu(n)
        const correct = yes ? 'ja' : 'nein'
        let reason: string
        if (yes) {
          reason = `${n} ist nur durch 1 und ${n} teilbar, also eine Primzahl.`
        } else {
          let teiler = 2
          while (n % teiler !== 0) teiler++
          reason = `${n} ist durch ${teiler} teilbar (${n} = ${teiler} · ${n / teiler}), also keine Primzahl.`
        }
        return choicePickTask({
          question: `Ist ${n} eine Primzahl?`,
          choices: ['ja', 'nein'],
          correct,
          solution: correct,
          explanation: reason,
          dedupeKey: `prim-janein:${n}`,
        })
      },
      // Variant 3: MC — die Primzahl in einer Liste finden
      (rng: Rng) => {
        const candidates: number[] = []
        while (candidates.length < 1) {
          const p = randInt(rng, 11, 97)
          if (isPrimeNeu(p)) candidates.push(p)
        }
        const primeValue = candidates[0]!
        const composites: number[] = []
        while (composites.length < 3) {
          const c = randInt(rng, 10, 99)
          if (!isPrimeNeu(c) && c !== primeValue && !composites.includes(c)) composites.push(c)
        }
        const correct = String(primeValue)
        const choices = shuffleChoices(rng, [primeValue, ...composites].map(String), correct)
        return choicePickTask({
          question: 'Welche dieser Zahlen ist eine Primzahl?',
          choices,
          correct,
          solution: correct,
          explanation: `${primeValue} ist nur durch 1 und ${primeValue} teilbar. Die anderen Zahlen haben weitere Teiler.`,
          dedupeKey: `prim-find:${primeValue}:${composites.join('-')}`,
        })
      },
    ),
  }),
]

/** LB2 — Brüche / Dezimal */
export const math5NeuLb2: Topic[] = [
  // ---------------------------------------------------------------------
  // 1) Brüche kürzen
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-kuerzen', {
    id: 'lb2-kuerzen__neu',
    title: 'Brüche kürzen (Anwendungen & Erkennen)',
    hint: 'Teile Zähler und Nenner durch ihren größten gemeinsamen Teiler (ggT).',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['kürzen', 'ggT', 'gekürzt', 'äquivalent', 'Bruch'],
    fachwissen: {
      text: 'Ein Bruch wird gekürzt, indem Zähler und Nenner durch denselben Teiler geteilt werden – der Wert ändert sich dabei nicht. Vollständig gekürzt ist ein Bruch, wenn Zähler und Nenner außer der 1 keinen gemeinsamen Teiler mehr besitzen. In Sachaufgaben taucht das Kürzen oft versteckt auf, z. B. wenn ein Anteil zunächst als unhandlicher Bruch entsteht und erst beim Kürzen übersichtlich wird.',
      quelle: 'Wikipedia: Bruchrechnung',
      url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Sachkontext, kürzen
      (rng: Rng) => {
        const rawN = randInt(rng, 1, 8)
        const rawD = randInt(rng, rawN + 2, 11)
        const base = makeFraction(rawN, rawD)
        const k = randInt(rng, 2, 7)
        const n = base.n * k
        const d = base.d * k
        const context = pick(rng, [
          ['Pizza', 'Stücke'],
          ['Tafel Schokolade', 'Stücke'],
          ['Klasse', 'Kinder'],
          ['Blumenbeet', 'Felder'],
        ])
        return fractionTask({
          question: `Eine ${context[0]} ist in ${d} gleich große ${context[1]} geteilt. ${n} davon sind markiert. Welcher Anteil ist das, vollständig gekürzt?`,
          value: base,
          requireReduced: true,
          solution: `${base.n}/${base.d}`,
          explanation: `${n}/${d} hat den größten gemeinsamen Teiler ${gcd(n, d)}: ${n} : ${gcd(n, d)} = ${base.n} und ${d} : ${gcd(n, d)} = ${base.d}, also ${base.n}/${base.d}.`,
        })
      },
      // Variant 2: MC — vollständig gekürzten Bruch erkennen
      (rng: Rng) => {
        const coprimePairs: [number, number][] = [
          [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
          [5, 6], [1, 6], [2, 7], [3, 7], [4, 7], [5, 7], [1, 8], [3, 8], [5, 8], [7, 8],
        ]
        const chosen: [number, number][] = []
        while (chosen.length < 4) {
          const p = pick(rng, coprimePairs)
          if (!chosen.some((c) => c[0] === p[0] && c[1] === p[1])) chosen.push(p)
        }
        const correctPair = chosen[0]!
        const correct = `${correctPair[0]}/${correctPair[1]}`
        const choices = chosen.map((p, i) => {
          if (i === 0) return correct
          const factor = randInt(rng, 2, 4)
          return `${p[0] * factor}/${p[1] * factor}`
        })
        const labeled = shuffleChoices(rng, choices, correct)
        return choicePickTask({
          question: 'Welcher dieser Brüche ist vollständig gekürzt?',
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${correct} ist vollständig gekürzt, da Zähler und Nenner außer 1 keinen gemeinsamen Teiler haben. Die anderen Brüche lassen sich noch kürzen.`,
          dedupeKey: `kuerzen-mc:${correctPair.join('-')}`,
        })
      },
      // Variant 3: Portfolio — Raster (Kürzen am Bild erkennen)
      (rng: Rng) => {
        const base = makeFraction(randInt(rng, 1, 4), randInt(rng, 5, 7))
        const k = randInt(rng, 2, 3)
        const numerator = base.n * k
        const denominator = base.d * k
        const cols = denominator <= 6 ? denominator : denominator === 8 ? 4 : 3
        const svg = generateFractionGridSvg({ numerator, denominator, cols })
        return {
          ...fractionTask({
            question: `Im Raster sind ${numerator} von ${denominator} Feldern eingefärbt. Kürze den Bruch vollständig.`,
            value: base,
            requireReduced: true,
            solution: `${base.n}/${base.d}`,
            explanation: `${numerator}/${denominator} hat den ggT ${gcd(numerator, denominator)}. Gekürzt ergibt sich ${base.n}/${base.d}.`,
          }),
          visualContent: svg,
        }
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 2) Brüche erweitern
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-erweitern', {
    id: 'lb2-erweitern__neu',
    title: 'Brüche erweitern (Nenner finden & Vergleich)',
    hint: 'Multipliziere Zähler und Nenner mit derselben Zahl.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['erweitern', 'äquivalent', 'gemeinsamer Nenner', 'Bruch', 'Zehntel'],
    fachwissen: {
      text: 'Erweitern bedeutet, Zähler und Nenner eines Bruchs mit derselben Zahl ungleich 0 zu multiplizieren – der Wert bleibt unverändert, da man mit k/k = 1 multipliziert. Erweitern ist die Umkehrung des Kürzens und wird gebraucht, um Brüche vergleichbar zu machen oder auf einen gemeinsamen Nenner wie 10 oder 100 zu bringen, was den Übergang zu Dezimalzahlen erleichtert.',
      quelle: 'Wikipedia: Bruchrechnung',
      url: 'https://de.wikipedia.org/wiki/Bruchrechnung',
      explore: { boardId: 'bruchErweitern' },
    },
    generate: mixedVariants(
      // Variant 1: Tippen — fehlenden Nenner bestimmen
      (rng: Rng) => {
        const d = randInt(rng, 3, 8)
        const n = randInt(rng, 1, d - 1)
        const k = randInt(rng, 2, 6)
        return valueTask({
          question: `Der Bruch ${n}/${d} wird erweitert. Der neue Zähler lautet ${n * k}. Wie lautet der neue Nenner?`,
          answerKind: 'integer',
          value: d * k,
          solution: `${d * k}`,
          explanation: `Der Zähler wurde mit ${k} multipliziert (${n} · ${k} = ${n * k}). Also muss auch der Nenner mit ${k} multipliziert werden: ${d} · ${k} = ${d * k}.`,
        })
      },
      // Variant 2: MC — nicht gleichwertigen Bruch erkennen
      (rng: Rng) => {
        const n = randInt(rng, 1, 6)
        const d = randInt(rng, n + 1, 9)
        const kA = randInt(rng, 2, 3)
        const kB = randInt(rng, 4, 5)
        const kC = randInt(rng, 6, 7)
        const equivalents = [`${n * kA}/${d * kA}`, `${n * kB}/${d * kB}`, `${n * kC}/${d * kC}`]
        const wrong = `${n * kA + 1}/${d * kA}`
        const choices = shuffleChoices(rng, [...equivalents, wrong], wrong)
        return choicePickTask({
          question: `Welcher dieser Brüche ist NICHT gleichwertig zu ${n}/${d}?`,
          choices,
          correct: wrong,
          solution: wrong,
          explanation: `${equivalents.join(', ')} sind alle durch Erweitern aus ${n}/${d} entstanden (Zähler und Nenner mit derselben Zahl multipliziert). Bei ${wrong} wurden Zähler und Nenner nicht mit derselben Zahl multipliziert: Der Zähler ist ${n * kA + 1}, der Nenner ${d * kA}. Wäre ${wrong} gleichwertig, müsste der Zähler ${n * kA} sein.`,
          dedupeKey: `erweitern-mc:${n}:${d}:${wrong}`,
        })
      },
      // Variant 3: Zahlenstrahl — Erweitern auf Zehntel/Hundertstel als Dezimalzahl
      (rng: Rng) => {
        const useHundred = rng() < 0.5
        const d = useHundred ? pick(rng, [4, 20, 25, 50]) : pick(rng, [2, 5])
        const targetDen = useHundred ? 100 : 10
        const k = targetDen / d
        const n = randInt(rng, 1, d - 1)
        const newNum = n * k
        const decimalValue = roundTo(newNum / targetDen, 2)
        return numberLineTask({
          question: `Erweitere ${n}/${d} auf den Nenner ${targetDen} und markiere den Bruch als Dezimalzahl auf dem Zahlenstrahl.`,
          min: 0,
          max: 1,
          step: targetDen === 10 ? 0.1 : 0.01,
          decimals: targetDen === 10 ? 1 : 2,
          value: decimalValue,
          solution: formatDe(decimalValue),
          explanation: `${n}/${d} erweitert auf den Nenner ${targetDen}: Zähler und Nenner werden mit ${k} multipliziert, also ${newNum}/${targetDen} = ${formatDe(decimalValue)}.`,
          eps: targetDen === 10 ? 0.05 : 0.005,
        })
      },
      // Variant 4: Bruchmodell — Streifen mit neuer Teilung zeigen
      (rng: Rng) => {
        const [n, d, k] = pick(rng, [
          [1, 2, 4], [1, 2, 6], [2, 3, 3], [2, 3, 4], [3, 4, 2], [3, 4, 3], [1, 3, 4], [1, 4, 3], [2, 5, 2],
        ] as Array<[number, number, number]>)
        return {
          ...fractionModelTask({
            question: `Der Streifen oben zeigt ${n}/${d}. Erweitere den Bruch mit ${k}: Teile den Streifen darunter in ${d * k} gleich große Teile und färbe denselben Anteil.`,
            shape: 'bar',
            target: { num: n * k, den: d * k },
            allowEquivalent: false,
            solution: `${n * k}/${d * k}`,
            explanation: `Beim Erweitern mit ${k} werden Zähler und Nenner mit ${k} multipliziert: ${n} · ${k} = ${n * k} und ${d} · ${k} = ${d * k}. Du stellst also ${d * k} Teile ein und färbst ${n * k} davon. Der gefärbte Anteil bleibt gleich groß: ${n}/${d} = ${n * k}/${d * k}.`,
            dedupeKey: `erweitern-modell:${n}:${d}:${k}`,
          }),
          visualContent: generateFractionBarSvg({ numerator: n, denominator: d }),
        }
      },
      // Variant 5: Bruchwand — alle gleichwertigen Brüche finden
      (rng: Rng) => {
        const [n, d] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]] as Array<[number, number]>)
        const rows = [1, 2, 3, 4, 6, 8, 12]
        const same = rows.filter((r) => r !== d && (n * r) % d === 0).map((r) => `${(n * r) / d}/${r}`)
        return fractionWallTask({
          mode: 'equivalent',
          rows,
          target: { num: n, den: d },
          question: `In der Bruchwand ${n === 1 ? 'ist in der Reihe mit' : 'sind in der Reihe mit'} ${d} Teilen ${n === 1 ? 'der erste Teil' : `die ersten ${n} Teile`} gefärbt (${n}/${d}). Färbe in den anderen Reihen die Teile, die genauso weit reichen. Welche Brüche sind gleichwertig zu ${n}/${d}?`,
          solution: same.join(', '),
          explanation: `Alle Teile, die von links genauso weit reichen wie ${n}/${d}, zeigen denselben Anteil. Du findest ${same.join(', ')}. Sie entstehen, wenn du Zähler und Nenner von ${n}/${d} mit derselben Zahl multiplizierst (erweiterst). Die Wand zeigt nur die Reihen mit ${rows.join(', ')} Teilen. Eine Reihe ohne passendes Teilstück bleibt leer.`,
          dedupeKey: `erweitern-wand:${n}:${d}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 3) Anteil als Bruch
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-anteil-bruch', {
    id: 'lb2-anteil-bruch__neu',
    title: 'Anteil als Bruch (Alltag & Komplement)',
    hint: 'Zähler = Anzahl der betrachteten Teile, Nenner = Gesamtanzahl.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Anteil', 'Bruch', 'Verhältnis', 'Komplement', 'Alltag'],
    fachwissen: {
      text: 'Ein Bruch p/q beschreibt den Anteil von p gleich großen Teilen an einer aus q Teilen bestehenden Gesamtheit. Wird nach dem „Rest“ gefragt (dem Anteil, der eine Eigenschaft NICHT hat), ergänzt sich dieser Anteil mit dem ursprünglichen Anteil immer zum Ganzen: Anteil + Gegen-Anteil = q/q. Das Komplement zu bestimmen ist eine wichtige Grundlage für spätere Prozentrechnung.',
      quelle: 'Wikipedia: Bruch (Mathematik)',
      url: 'https://de.wikipedia.org/wiki/Bruch_(Mathematik)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Komplement-Anteil
      (rng: Rng) => {
        const scenario = pick(rng, [
          { min: 18, max: 30, text: (t: number, k: number) => `In einer Klasse mit ${t} Kindern tragen ${k} eine Brille. Welcher Anteil der Kinder trägt keine Brille?` },
          { min: 8, max: 24, text: (t: number, k: number) => `Von ${t} Karten sind ${k} rot. Welcher Anteil der Karten ist nicht rot?` },
          { min: 10, max: 24, text: (t: number, k: number) => `Von ${t} Plätzchen sind ${k} schon gegessen. Welcher Anteil der Plätzchen ist noch übrig?` },
          { min: 10, max: 24, text: (t: number, k: number) => `Im Aquarium schwimmen ${t} Fische, ${k} davon sind orange. Welcher Anteil der Fische ist nicht orange?` },
        ])
        const total = randInt(rng, scenario.min, scenario.max)
        const k = randInt(rng, 2, total - 1)
        const rest = total - k
        const value = makeFraction(rest, total)
        return fractionTask({
          question: `${scenario.text(total, k)} Gib den gekürzten Bruch an.`,
          value,
          requireReduced: true,
          solution: `${value.n}/${value.d}`,
          explanation: `Von ${total} sind ${k} gemeint, also bleiben ${total} − ${k} = ${rest} übrig: ${rest}/${total}. Vollständig gekürzt: ${value.n}/${value.d}.`,
        })
      },
      // Variant 2: MC — richtigen Anteil-Bruch erkennen
      (rng: Rng) => {
        const total = randInt(rng, 5, 16)
        const k = randInt(rng, 1, total - 1)
        const correct = `${k}/${total}`
        const wrong1 = `${total}/${k}`
        const wrong2 = `${k}/${total + 1}`
        const wrong3 = `${k + 1}/${total}`
        const choices = shuffleChoices(rng, [correct, wrong1, wrong2, wrong3], correct)
        const thing = pick(rng, [['Murmeln', 'blau'], ['Stiften', 'rot'], ['Eiskugeln', 'Schoko']])
        return choicePickTask({
          question: `Von ${total} ${thing[0]} ${k === 1 ? 'ist' : 'sind'} ${k} ${thing[1]}. Welcher Bruch beschreibt den Anteil richtig (muss nicht gekürzt sein)?`,
          choices,
          correct,
          solution: correct,
          explanation: `Der Anteil ist Anzahl der betrachteten Teile (${k}) durch Gesamtanzahl (${total}), also ${correct}.`,
          dedupeKey: `anteil-mc:${k}:${total}`,
        })
      },
      // Variant 3: Portfolio — Raster, Komplement-Anteil ablesen
      (rng: Rng) => {
        const denominator = pick(rng, [6, 8, 9, 10, 12])
        const numerator = randInt(rng, 1, denominator - 1)
        const uncolored = denominator - numerator
        const value = makeFraction(uncolored, denominator)
        const cols = denominator === 9 ? 3 : denominator === 12 ? 4 : denominator === 6 ? 3 : denominator === 10 ? 5 : 4
        const svg = generateFractionGridSvg({ numerator, denominator, cols })
        return {
          ...fractionTask({
            question: `Im Raster sind ${numerator} von ${denominator} Feldern eingefärbt. Welcher Anteil der Felder ist NICHT eingefärbt? Gib den gekürzten Bruch an.`,
            value,
            requireReduced: true,
            solution: `${value.n}/${value.d}`,
            explanation: `${uncolored} von ${denominator} Feldern sind nicht eingefärbt: ${uncolored}/${denominator}. Vollständig gekürzt: ${value.n}/${value.d}.`,
          }),
          visualContent: svg,
        }
      },
      // Variant 4: Bruchmodell — Anteil im Kreis darstellen (Nenner vorgegeben)
      (rng: Rng) => {
        const [n, d] = pick(rng, [[2, 3], [3, 4], [5, 6], [3, 8], [2, 5], [5, 8]] as Array<[number, number]>)
        const food = pick(rng, ['Pizza', 'Torte'])
        return fractionModelTask({
          question: `Eine ${food} ist in ${d} gleich große Stücke geschnitten. ${n} Stücke wurden gegessen. Zeige den gegessenen Anteil im Kreismodell.`,
          shape: 'circle',
          target: { num: n, den: d },
          allowEquivalent: false,
          solution: `${n}/${d}`,
          explanation: `Die ${food} hat ${d} gleich große Stücke, also stellst du ${d} Teile ein. ${n} davon wurden gegessen, also färbst du ${n} Teile. Der gegessene Anteil ist ${n}/${d}.`,
          dedupeKey: `anteil-modell:${n}:${d}:${food}`,
        })
      },
      // Variant 5: Bruchmodell — Anteil mit frei gewählter Teilung (gleichwertige Brüche zählen)
      (rng: Rng) => {
        const [n, d, word] = pick(rng, [
          [1, 2, 'die Hälfte'], [1, 3, 'ein Drittel'], [1, 4, 'ein Viertel'], [3, 4, 'drei Viertel'],
        ] as Array<[number, number, string]>)
        return fractionModelTask({
          question: `Färbe ${word} des Kreises. Du darfst die Anzahl der Teile selbst wählen.`,
          shape: 'circle',
          target: { num: n, den: d },
          explanation: `${word.charAt(0).toUpperCase()}${word.slice(1)} ${n > 1 ? 'sind' : 'ist'} der Bruch ${n}/${d}. Du kannst ihn auch mit mehr Teilen zeigen, zum Beispiel als ${n * 2}/${d * 2} oder ${n * 3}/${d * 3}. Wichtig ist nur, dass die gefärbten Teile im gleichen Verhältnis zur Gesamtzahl der Teile stehen.`,
          solution: `${n}/${d}`,
          dedupeKey: `anteil-modell-frei:${n}:${d}`,
        })
      },
      // Variant 6: Teilwerkzeug — gerecht verteilen, Anteil pro Kind als Bruch (Anzahl der Teile selbst finden)
      (rng: Rng) => {
        const [count, persons] = pick(rng, [[3, 4], [2, 3], [3, 5], [1, 4], [2, 5], [1, 3]] as Array<[number, number]>)
        const food = pick(rng, [
          { shape: 'circle' as const, art: 'Eine', one: 'Pizza', many: 'Pizzen' },
          { shape: 'circle' as const, art: 'Eine', one: 'Torte', many: 'Torten' },
        ])
        const subject = count === 1 ? `${food.art} ${food.one} soll` : `${count} ${food.many} sollen`
        return divideToolTask({
          question: `${subject} gerecht auf ${persons} Kinder verteilt werden. Teile sie so in gleich große Stücke, dass jedes Kind gleich viel bekommt.`,
          shape: food.shape,
          count,
          persons,
          objectName: food.one,
          solution: `Jedes Kind bekommt ${count}/${persons} ${food.one}.`,
          explanation: `Schneide jede ${food.one} in ${persons} gleich große Stücke. Jedes Kind bekommt dann von jeder ${food.one} genau ein Stück, insgesamt ${count} Stück${count === 1 ? '' : 'e'}. Ein Stück ist 1/${persons} einer ${food.one}, also bekommt jedes Kind ${count}/${persons} ${food.one}. Das ist dasselbe wie ${count} : ${persons}. Du darfst auch kleiner schneiden, solange am Ende alle Kinder gleich viele Stücke haben.`,
          dedupeKey: `teilen-verteilen:${food.one}:${count}:${persons}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 4) Grafische Brüche
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-grafische-brueche', {
    id: 'lb2-grafische-brueche__neu',
    title: 'Brüche grafisch erkennen (Multiple Choice & genaues Ablesen)',
    hint: 'Zähle die eingefärbten Teile und die Gesamtanzahl.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Bruch', 'grafisch', 'Kreisdiagramm', 'Balken', 'Raster', 'ablesen'],
    fachwissen: {
      text: 'Grafische Bruchdarstellungen (Kreis, Balken, Raster) zeigen den Zähler als Anzahl der eingefärbten Teile und den Nenner als Gesamtanzahl gleich großer Teile. Beim genauen Ablesen zählt zunächst, was im Bild tatsächlich zu sehen ist – ob der abgelesene Bruch sich noch kürzen lässt, ist eine zweite, getrennte Frage.',
      quelle: 'Wikipedia: Bruch (Mathematik)',
      url: 'https://de.wikipedia.org/wiki/Bruch_(Mathematik)',
    },
    generate: mixedVariants(
      // Variant 1: MC — Kreisdiagramm
      (rng: Rng) => {
        const denominator = pick(rng, [3, 4, 5, 6, 8])
        const numerator = randInt(rng, 1, denominator - 1)
        const svg = generateFractionCircleSvg({ numerator, denominator })
        const correct = `${numerator}/${denominator}`
        const wrong1 = `${denominator - numerator}/${denominator}`
        const wrong2 = `${numerator}/${denominator + 1}`
        const wrong3 = `${Math.max(1, Math.min(numerator + 1, denominator - 1))}/${denominator}`
        const choices = shuffleChoices(rng, [correct, wrong1, wrong2, wrong3], correct)
        return choicePickTask({
          question: 'Welcher Bruch ist im Kreisdiagramm dargestellt?',
          choices,
          correct,
          solution: correct,
          explanation: `${numerator} von ${denominator} Teilen sind eingefärbt, also ${correct}.`,
          visualContent: svg,
          dedupeKey: `graf:kreis:${numerator}:${denominator}`,
        })
      },
      // Variant 2: MC — Balken
      (rng: Rng) => {
        const denominator = pick(rng, [3, 4, 5, 6, 8, 10])
        const numerator = randInt(rng, 1, denominator - 1)
        const svg = generateFractionBarSvg({ numerator, denominator })
        const correct = `${numerator}/${denominator}`
        const wrong1 = `${denominator - numerator}/${denominator}`
        const wrong2 = `${numerator}/${denominator - 1 || 1}`
        const wrong3 = `${Math.max(1, numerator - 1)}/${denominator}`
        const choices = shuffleChoices(rng, [correct, wrong1, wrong2, wrong3], correct)
        return choicePickTask({
          question: 'Welcher Bruch ist im Balken dargestellt?',
          choices,
          correct,
          solution: correct,
          explanation: `${numerator} von ${denominator} Abschnitten sind eingefärbt, also ${correct}.`,
          visualContent: svg,
          dedupeKey: `graf:balken:${numerator}:${denominator}`,
        })
      },
      // Variant 3: Tippen — Raster, genau ablesen (nicht kürzen)
      (rng: Rng) => {
        const denominator = pick(rng, [4, 6, 8, 9, 10, 12])
        const numerator = randInt(rng, 1, denominator - 1)
        const cols = denominator === 9 ? 3 : denominator === 12 ? 4 : denominator === 6 ? 3 : denominator === 10 ? 5 : 4
        const svg = generateFractionGridSvg({ numerator, denominator, cols })
        const value = { n: numerator, d: denominator }
        return {
          ...fractionTask({
            question: 'Welcher Bruch ist im Raster eingefärbt? Gib ihn genau so an, wie du ihn siehst (nicht kürzen).',
            value,
            requireReduced: false,
            solution: `${numerator}/${denominator}`,
            explanation: `${numerator} von ${denominator} Feldern sind eingefärbt. Im Bild siehst du genau ${numerator}/${denominator} – ob man das noch kürzen kann, ist hier nicht gefragt.`,
          }),
          visualContent: svg,
          dedupeKey: `graf:raster:${numerator}:${denominator}`,
        }
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 5) Dezimalzahlen addieren und subtrahieren
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-dez-add-sub', {
    id: 'lb2-dez-add-sub__neu',
    title: 'Dezimalzahlen addieren/subtrahieren (Ketten & Alltag)',
    hint: 'Schreibe die Zahlen kommagerecht untereinander und rechne stellenweise.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Dezimalzahl', 'addieren', 'subtrahieren', 'Geld', 'Alltag', 'Komma'],
    fachwissen: {
      text: 'Bei Ketten aus Addition und Subtraktion von Dezimalzahlen wird von links nach rechts gerechnet, wobei jede Zwischensumme wieder kommagerecht notiert wird. Im Alltag – etwa beim Einkaufen – treten solche Ketten häufig auf: Preise werden addiert, das gezahlte Geld wird subtrahiert, das Ergebnis ist das Wechselgeld.',
      quelle: 'Wikipedia: Dezimalzahl',
      url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Kette (addieren, dann subtrahieren)
      (rng: Rng) => {
        const a = roundTo(randInt(rng, 100, 999) / 10, 1)
        const b = roundTo(randInt(rng, 10, 500) / 10, 1)
        const maxC = Math.max(10, Math.round((a + b) * 10) - 10)
        const c = roundTo(randInt(rng, 10, Math.min(300, maxC)) / 10, 1)
        const sumAB = roundTo(a + b, 2)
        const value = roundTo(sumAB - c, 2)
        return valueTask({
          question: `Berechne: ${formatDe(a)} + ${formatDe(b)} − ${formatDe(c)}`,
          answerKind: 'decimal',
          value,
          eps: 0.005,
          solution: formatDe(value),
          explanation: `Addiere zuerst: ${formatDe(a)} + ${formatDe(b)} = ${formatDe(sumAB)}. Subtrahiere dann: ${formatDe(sumAB)} − ${formatDe(c)} = ${formatDe(value)}.`,
        })
      },
      // Variant 2: MC — richtiges Ergebnis erkennen
      (rng: Rng) => {
        const a = roundTo(randInt(rng, 20, 799) / 10, 1)
        const b = roundTo(randInt(rng, 20, 799) / 10, 1)
        const doAdd = rng() < 0.5 || a < b
        const value = roundTo(doAdd ? a + b : a - b, 2)
        const op = doAdd ? '+' : '−'
        const choices = [value, roundTo(value + 1, 1), roundTo(value - 1, 1), roundTo(value + 0.1, 2)]
        const correct = formatDe(value)
        const labeled = shuffleChoices(rng, choices.map((c) => formatDe(c)), correct)
        return choicePickTask({
          question: `Welches Ergebnis ist richtig? ${formatDe(a)} ${op} ${formatDe(b)} = ?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${formatDe(a)} ${op} ${formatDe(b)} = ${correct}. Achte auf das Komma beim Rechnen.`,
          dedupeKey: `dezaddsub-mc:${a}:${b}:${op}`,
        })
      },
      // Variant 3: Tippen — Alltag (Wechselgeld)
      (rng: Rng) => {
        const price1 = roundTo(randInt(rng, 150, 1999) / 100, 2)
        const price2 = roundTo(randInt(rng, 100, 1500) / 100, 2)
        const total = roundTo(price1 + price2, 2)
        const bills = [5, 10, 20, 50].filter((b) => b >= total)
        const given = bills[0] ?? 50
        const change = roundTo(given - total, 2)
        const item = pick(rng, [
          ['ein Buch', 'einen Stift'],
          ['eine Mütze', 'einen Schal'],
          ['ein Heft', 'einen Kugelschreiber'],
        ])
        return valueTask({
          question: `Du kaufst ${item[0]} für ${formatDe(price1)} € und ${item[1]} für ${formatDe(price2)} €. Du bezahlst mit einem ${given}-€-Schein. Wie viel Wechselgeld bekommst du zurück?`,
          answerKind: 'decimal',
          value: change,
          eps: 0.005,
          solution: formatDe(change),
          explanation: `Gesamtpreis: ${formatDe(price1)} € + ${formatDe(price2)} € = ${formatDe(total)} €. Wechselgeld: ${given} € − ${formatDe(total)} € = ${formatDe(change)} €.`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 6) Dezimalzahl multiplizieren
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-dez-mult', {
    id: 'lb2-dez-mult__neu',
    title: 'Dezimalzahl multiplizieren (Dezimal mal Dezimal & Alltag)',
    hint: 'Rechne wie mit natürlichen Zahlen, zähle die Nachkommastellen zusammen.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Dezimalzahl', 'multiplizieren', 'Nachkommastellen', 'Alltag', 'Preis'],
    fachwissen: {
      text: 'Multipliziert man zwei Dezimalzahlen, rechnet man zunächst wie mit natürlichen Zahlen (ohne Komma) und zählt danach die Nachkommastellen beider Faktoren zusammen – so viele Stellen hat das Ergebnis hinter dem Komma. Im Alltag begegnet das z. B. beim Berechnen von Preisen: Preis pro Kilogramm mal gekaufte Menge.',
      quelle: 'Wikipedia: Dezimalzahl',
      url: 'https://de.wikipedia.org/wiki/Dezimalzahl',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Dezimal mal Dezimal
      (rng: Rng) => {
        const a = roundTo(randInt(rng, 11, 99) / 10, 1)
        const b = roundTo(randInt(rng, 11, 99) / 10, 1)
        const value = roundTo(a * b, 2)
        const aWhole = Math.round(a * 10)
        const bWhole = Math.round(b * 10)
        return valueTask({
          question: `Berechne: ${formatDe(a)} · ${formatDe(b)}`,
          answerKind: 'decimal',
          value,
          eps: 0.005,
          solution: formatDe(value),
          explanation: `Multipliziere zunächst ohne Komma: ${aWhole} · ${bWhole} = ${aWhole * bWhole}. Beide Faktoren haben zusammen 2 Nachkommastellen, also wandert das Komma 2 Stellen nach links: ${formatDe(value)}.`,
        })
      },
      // Variant 2: MC — richtiges Produkt erkennen
      (rng: Rng) => {
        const a = roundTo(randInt(rng, 15, 299) / 10, 1)
        const factor = randInt(rng, 2, 9)
        const value = roundTo(a * factor, 2)
        const choices = [value, roundTo(value + factor, 1), roundTo(value - factor, 1), roundTo(value * 10, 1)]
        const correct = formatDe(value)
        const labeled = shuffleChoices(rng, choices.map((c) => formatDe(c)), correct)
        return choicePickTask({
          question: `Welches Ergebnis ist richtig? ${formatDe(a)} · ${factor} = ?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${formatDe(a)} · ${factor} = ${correct}. Achte darauf, das Komma an der richtigen Stelle zu setzen.`,
          dedupeKey: `dezmult-mc:${a}:${factor}`,
        })
      },
      // Variant 3: Tippen — Alltag (Preis pro kg)
      (rng: Rng) => {
        const pricePerKg = roundTo(randInt(rng, 15, 99) / 10, 1)
        const weight = roundTo(randInt(rng, 5, 40) / 10, 1)
        const value = roundTo(pricePerKg * weight, 2)
        const good = pick(rng, ['Äpfel', 'Kartoffeln', 'Tomaten', 'Bananen'])
        return valueTask({
          question: `${good} kosten ${formatDe(pricePerKg)} € pro kg. Wie viel kosten ${formatDe(weight)} kg?`,
          answerKind: 'decimal',
          value,
          eps: 0.005,
          solution: formatDe(value),
          explanation: `Preis mal Menge: ${formatDe(pricePerKg)} € · ${formatDe(weight)} = ${formatDe(value)} €.`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 7) Dezimalzahl dividieren
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-dez-div', {
    id: 'lb2-dez-div__neu',
    title: 'Dezimalzahl dividieren (Dezimal durch Dezimal & Verteilen)',
    hint: 'Teile wie bei natürlichen Zahlen und setze das Komma richtig.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Dezimalzahl', 'dividieren', 'Alltag', 'Verteilen', 'Komma'],
    fachwissen: {
      text: 'Dividiert man durch eine Dezimalzahl, hilft es, sich die Umkehraufgabe der Multiplikation vorzustellen: Divisor mal Quotient ergibt wieder den Dividenden. Im Alltag tritt Division von Dezimalzahlen häufig beim gleichmäßigen Verteilen auf, z. B. wenn ein Geldbetrag gerecht auf mehrere Personen aufgeteilt wird.',
      quelle: 'Wikipedia: Division (Mathematik)',
      url: 'https://de.wikipedia.org/wiki/Division_(Mathematik)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Dezimal durch Dezimal
      (rng: Rng) => {
        const divisor = roundTo(randInt(rng, 15, 50) / 10, 1)
        const quotient = randInt(rng, 2, 12)
        const dividend = roundTo(divisor * quotient, 2)
        return valueTask({
          question: `Berechne: ${formatDe(dividend)} : ${formatDe(divisor)}`,
          answerKind: 'decimal',
          value: quotient,
          eps: 0.005,
          solution: formatDe(quotient),
          explanation: `${formatDe(dividend)} : ${formatDe(divisor)} = ${formatDe(quotient)}, denn ${formatDe(divisor)} · ${quotient} = ${formatDe(dividend)}.`,
        })
      },
      // Variant 2: MC — richtigen Quotienten erkennen
      (rng: Rng) => {
        const divisor = pick(rng, [2, 4, 5, 8])
        const quotient = roundTo(randInt(rng, 11, 99) / 10, 1)
        const dividend = roundTo(quotient * divisor, 2)
        const choices = [quotient, roundTo(quotient * 10, 1), roundTo(quotient / 10, 2), roundTo(quotient + 1, 1)]
        const correct = formatDe(quotient)
        const labeled = shuffleChoices(rng, choices.map((c) => formatDe(c)), correct)
        return choicePickTask({
          question: `Welches Ergebnis ist richtig? ${formatDe(dividend)} : ${divisor} = ?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `${formatDe(dividend)} : ${divisor} = ${correct}. Ein häufiger Fehler ist, das Komma an der falschen Stelle zu setzen.`,
          dedupeKey: `dezdiv-mc:${dividend}:${divisor}`,
        })
      },
      // Variant 3: Tippen — Alltag (gerecht verteilen)
      (rng: Rng) => {
        const persons = randInt(rng, 2, 6)
        const perPerson = roundTo(randInt(rng, 15, 99) / 10, 1)
        const total = roundTo(perPerson * persons, 2)
        return valueTask({
          question: `${formatDe(total)} € werden gleichmäßig auf ${persons} Kinder verteilt. Wie viel € bekommt jedes Kind?`,
          answerKind: 'decimal',
          value: perPerson,
          eps: 0.005,
          solution: formatDe(perPerson),
          explanation: `${formatDe(total)} € : ${persons} = ${formatDe(perPerson)} € pro Kind.`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 8) Dezimalzahlen runden
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-runden-dezimal', {
    id: 'lb2-runden-dezimal__neu',
    title: 'Dezimalzahlen runden (Cent & Zahlenstrahl)',
    hint: 'Ist die nächste Ziffer 5 oder größer, wird aufgerundet.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['runden', 'Dezimalzahl', 'Cent', 'Zahlenstrahl', 'Preis'],
    fachwissen: {
      text: 'Dezimalzahlen rundet man, indem man auf die erste nicht mehr benötigte Ziffer schaut: Ist sie 5 oder größer, wird aufgerundet, sonst abgerundet. Preise werden häufig auf volle Cent (zwei Nachkommastellen) gerundet, etwa wenn ein genauer Rechenwert mehr Nachkommastellen liefert, als beim Bezahlen praktisch nutzbar ist.',
      quelle: 'Wikipedia: Runden (Mathematik)',
      url: 'https://de.wikipedia.org/wiki/Runden_(Mathematik)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — auf volle Cent runden
      (rng: Rng) => {
        const euros = randInt(rng, 0, 50)
        const fractionPart = randInt(rng, 0, 9999)
        const value0 = roundTo(euros + fractionPart / 10000, 4)
        const rounded = roundTo(value0, 2)
        return valueTask({
          question: `Ein Preis wird mit ${formatDe(value0, 4)} € berechnet. Runde ihn auf volle Cent (2 Nachkommastellen).`,
          answerKind: 'decimal',
          value: rounded,
          eps: 1e-9,
          solution: formatDe(rounded),
          explanation: `Schau auf die dritte Nachkommastelle. Ist sie 5 oder größer, wird aufgerundet. ${formatDe(value0, 4)} € ≈ ${formatDe(rounded)} €.`,
        })
      },
      // Variant 2: MC — richtig gerundeten Wert erkennen
      (rng: Rng) => {
        const value0 = roundTo(randInt(rng, 1000, 9999) / 1000, 3)
        const places = pick(rng, [0, 1, 2])
        const rounded = roundTo(value0, places)
        const step = places === 0 ? 1 : places === 1 ? 0.1 : 0.01
        const choices = [
          rounded,
          roundTo(rounded + step, places),
          roundTo(rounded - step, places),
          roundTo(value0, places === 0 ? 1 : places - 1),
        ]
        const correct = formatDe(rounded)
        const labeled = shuffleChoices(rng, choices.map((c) => formatDe(c)), correct)
        const label = places === 0 ? 'eine ganze Zahl' : `${places} Nachkommastelle${places > 1 ? 'n' : ''}`
        return choicePickTask({
          question: `Wie lautet ${formatDe(value0, 3)} gerundet auf ${label}?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `Richtig gerundet auf ${label} ergibt sich ${correct}.`,
          dedupeKey: `rundendez-mc:${value0}:${places}`,
        })
      },
      // Variant 3: Zahlenstrahl — gerundeten Nachbarn markieren
      (rng: Rng) => {
        const place = pick(rng, [0.1, 1])
        const steps = randInt(rng, 3, 40)
        const lower = roundTo(steps * place, 2)
        const upper = roundTo(lower + place, 2)
        const tenth = randInt(rng, 1, 9)
        const n = roundTo(lower + (tenth / 10) * place, 3)
        const value = tenth >= 5 ? upper : lower
        return numberLineTask({
          question: `Die Zahl ${formatDe(n, 3)} liegt zwischen ${formatDe(lower)} und ${formatDe(upper)}.\nMarkiere, auf welchen Wert sie gerundet wird.`,
          min: roundTo(lower - place / 2, 3),
          max: roundTo(upper + place / 2, 3),
          step: roundTo(place / 10, 3),
          decimals: place === 1 ? 0 : 2,
          value,
          solution: formatDe(value),
          explanation: `${formatDe(n, 3)} liegt näher an ${formatDe(value)}. Ab der Hälfte wird aufgerundet, sonst abgerundet.`,
          eps: place / 20,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 9) Arithmetisches Mittel
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-mittelwert', {
    id: 'lb2-mittelwert__neu',
    title: 'Arithmetisches Mittel (Berechnen & fehlende Zahl)',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Mittelwert', 'Durchschnitt', 'arithmetisches Mittel', 'Ergänzen'],
    fachwissen: {
      text: 'Das arithmetische Mittel berechnet sich als Summe aller Werte geteilt durch ihre Anzahl. Kennt man den Mittelwert und alle bis auf einen Wert, lässt sich der fehlende Wert bestimmen: Man berechnet zuerst die nötige Gesamtsumme (Mittelwert mal Anzahl) und zieht dann die Summe der bekannten Werte ab.',
      quelle: 'Wikipedia: Arithmetisches Mittel',
      url: 'https://de.wikipedia.org/wiki/Arithmetisches_Mittel',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Mittelwert von Dezimalwerten
      (rng: Rng) => {
        const count = randInt(rng, 3, 5)
        const tenths: number[] = []
        for (let i = 0; i < count; i++) tenths.push(randInt(rng, 20, 150))
        let sumTenths = tenths.reduce((s, x) => s + x, 0)
        const remainder = sumTenths % count
        if (remainder !== 0) {
          tenths[count - 1]! += count - remainder
          sumTenths += count - remainder
        }
        const numbers = tenths.map((t) => t / 10)
        const sum = roundTo(numbers.reduce((s, x) => s + x, 0), 2)
        const mean = roundTo(sumTenths / 10 / count, 2)
        const context = pick(rng, ['Temperaturen (in °C)', 'Laufzeiten (in Minuten)', 'Gewichte (in kg)'])
        return valueTask({
          question: `Berechne das arithmetische Mittel dieser ${context}: ${numbers.map((n) => fmt1(n)).join('; ')}.`,
          answerKind: 'decimal',
          value: mean,
          eps: 0.005,
          solution: formatDe(mean),
          explanation: `Summe: ${numbers.map((n) => fmt1(n)).join(' + ')} = ${formatDe(sum)}. Teile durch die Anzahl ${count}: ${formatDe(sum)} : ${count} = ${formatDe(mean)}.`,
        })
      },
      // Variant 2: MC — richtigen Mittelwert erkennen
      (rng: Rng) => {
        let count = 3
        let numbers: number[] = []
        let sum = 0
        let mean = 0
        for (let attempt = 0; attempt < 60; attempt++) {
          count = randInt(rng, 3, 4)
          numbers = []
          for (let i = 0; i < count; i++) numbers.push(randInt(rng, 2, 20))
          sum = numbers.reduce((t, x) => t + x, 0)
          const remainder = sum % count
          if (remainder !== 0) {
            numbers[count - 1]! += count - remainder
            sum += count - remainder
          }
          mean = sum / count
          // Das Mittel soll nicht einfach in der Liste stehen (sonst leicht zu raten).
          if (!numbers.includes(mean)) break
        }
        const wrongPool = [mean + 1, mean - 1, mean + 2, mean - 2, Math.round(sum / (count + 1)), Math.round(sum / (count - 1))]
        const wrongs: number[] = []
        for (const w of wrongPool) if (w >= 1 && w !== mean && !wrongs.includes(w) && wrongs.length < 3) wrongs.push(w)
        for (let extra = 3; wrongs.length < 3; extra++) if (!wrongs.includes(mean + extra)) wrongs.push(mean + extra)
        const correct = formatDe(mean)
        const labeled = shuffleChoices(rng, [mean, ...wrongs].map((c) => formatDe(c)), correct)
        return choicePickTask({
          question: `Wie groß ist das arithmetische Mittel von ${numbers.slice(0, -1).join(', ')} und ${numbers[numbers.length - 1]}?`,
          choices: labeled,
          correct,
          solution: correct,
          explanation: `Summe: ${numbers.join(' + ')} = ${sum}. Teile durch ${count}: ${sum} : ${count} = ${correct}.`,
          dedupeKey: `mittel-mc:${numbers.join('-')}`,
        })
      },
      // Variant 3: Tippen — fehlende Zahl bei gegebenem Mittelwert
      (rng: Rng) => {
        const k1 = randInt(rng, 3, 18)
        const k2 = randInt(rng, 3, 18)
        const k3 = randInt(rng, 3, 18)
        const S = k1 + k2 + k3
        let mean = Math.round((S + randInt(rng, 3, 18)) / 4)
        if (mean < 1) mean = 1
        let missing = mean * 4 - S
        let guard = 0
        while ((missing < 1 || missing > 30) && guard < 10) {
          mean += missing < 1 ? 1 : -1
          missing = mean * 4 - S
          guard++
        }
        if (missing < 1) missing = 1
        const known = [k1, k2, k3]
        return valueTask({
          question: `4 Zahlen haben das arithmetische Mittel ${mean}. Drei davon sind: ${known.join(', ')}. Wie lautet die vierte Zahl?`,
          answerKind: 'integer',
          value: missing,
          solution: formatDe(missing),
          explanation: `Die Summe aller 4 Zahlen muss ${mean} · 4 = ${mean * 4} betragen. Die drei bekannten Zahlen ergeben ${known.join(' + ')} = ${S}. Die vierte Zahl ist ${mean * 4} − ${S} = ${missing}.`,
        })
      },
      // Variant 4: Umfrage (Geschwister) als Säulendiagramm darstellen, Balken ziehen
      (rng: Rng) => surveyBarChartTask(rng, pick(rng, SIBLING_SURVEYS), 'table'),
      // Variant 5: Umfrage (Geschwister) lesen, Mittelwert berechnen
      (rng: Rng) => {
        const categories = ['0', '1', '2', '3']
        // Zielmittelwert 1 oder 2 (immer ganzzahlig) – der Mittelwert variiert also zwischen den Aufgaben.
        const targetMean = pick(rng, [1, 2])
        let counts: number[] = targetMean === 1 ? [8, 10, 4, 2] : [2, 4, 10, 8]
        for (let attempt = 0; attempt < 2000; attempt++) {
          const c =
            targetMean === 1
              ? [randInt(rng, 4, 10), randInt(rng, 6, 12), randInt(rng, 2, 7), randInt(rng, 1, 3)]
              : [randInt(rng, 1, 5), randInt(rng, 2, 8), randInt(rng, 5, 11), randInt(rng, 4, 10)]
          const n = c.reduce((t, x) => t + x, 0)
          const total = c[1]! + 2 * c[2]! + 3 * c[3]!
          if (n >= 20 && n <= 30 && total === targetMean * n) {
            counts = c
            break
          }
        }
        const n = counts.reduce((t, x) => t + x, 0)
        const total = counts[1]! + 2 * counts[2]! + 3 * counts[3]!
        const mean = total / n
        const parts = [counts[1]! + ' · 1', counts[2]! + ' · 2', counts[3]! + ' · 3']
        return valueTask({
          question: `In einer Klasse mit ${n} Kindern wurde gefragt, wie viele Geschwister jedes Kind hat. Die Tabelle zeigt das Ergebnis. Wie viele Geschwister hat ein Kind im Mittel?`,
          answerKind: 'integer',
          value: mean,
          solution: formatDe(mean),
          visualContent: barChartTableSvg('Tabelle: Geschwister', 'Geschwister', 'Anzahl Kinder', categories, counts),
          explanation: `Alle Geschwister zusammen: ${counts[0]} · 0 + ${parts.join(' + ')} = ${total}. Teile durch die Anzahl der Kinder: ${total} : ${n} = ${mean}.`,
          dedupeKey: `mittel-geschwister:${counts.join('-')}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 10) Zahlenstrahl
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-zahlenstrahl', {
    id: 'lb2-zahlenstrahl__neu',
    title: 'Zahlenstrahl: Abstand, Vergleich & Zahlenfolge',
    hint: 'Der Abstand zwischen zwei Zahlen ist ihre Differenz.',
    pointsPerTask: 10,
    difficulty: 3,
    keywords: ['Zahlenstrahl', 'Abstand', 'vergleichen', 'Zahlenfolge', 'Dezimalzahl'],
    fachwissen: {
      text: 'Auf dem Zahlenstrahl entspricht der Abstand zweier Punkte ihrer Differenz. Zahlenfolgen mit gleichbleibendem Abstand (arithmetische Folgen) lassen sich fortsetzen, indem man den erkannten Abstand immer wieder addiert. Beides schärft das Verständnis dafür, wie Dezimalzahlen der Größe nach angeordnet sind.',
      quelle: 'Wikipedia: Zahlenstrahl',
      url: 'https://de.wikipedia.org/wiki/Zahlenstrahl',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Abstand zweier Punkte
      (rng: Rng) => {
        const a = roundTo(randInt(rng, 10, 80) / 10, 1)
        const gap = roundTo(randInt(rng, 5, 40) / 10, 1)
        const b = roundTo(a + gap, 1)
        return valueTask({
          question: `Auf dem Zahlenstrahl sind die Punkte ${formatDe(a)} und ${formatDe(b)} markiert. Wie groß ist der Abstand zwischen ihnen?`,
          answerKind: 'decimal',
          value: gap,
          eps: 0.05,
          solution: formatDe(gap),
          explanation: `Der Abstand ist die Differenz: ${formatDe(b)} − ${formatDe(a)} = ${formatDe(gap)}.`,
        })
      },
      // Variant 2: MC — Zahl außerhalb des Intervalls erkennen
      (rng: Rng) => {
        const a = roundTo(randInt(rng, 10, 60) / 10, 1)
        const b = roundTo(a + randInt(rng, 10, 30) / 10, 1)
        const inside1 = roundTo(a + (b - a) * 0.25, 1)
        const inside2 = roundTo(a + (b - a) * 0.5, 1)
        const inside3 = roundTo(a + (b - a) * 0.75, 1)
        const outside =
          rng() < 0.5 ? roundTo(b + randInt(rng, 2, 9) / 10, 1) : roundTo(Math.max(0, a - randInt(rng, 2, 9) / 10), 1)
        const correct = formatDe(outside)
        const choices = shuffleChoices(
          rng,
          [inside1, inside2, inside3, outside].map((v) => formatDe(v)),
          correct,
        )
        return choicePickTask({
          question: `${formatDe(a)} und ${formatDe(b)} sind auf dem Zahlenstrahl markiert. Welche dieser Zahlen liegt NICHT zwischen ${formatDe(a)} und ${formatDe(b)}?`,
          choices,
          correct,
          solution: correct,
          explanation: `Zwischen ${formatDe(a)} und ${formatDe(b)} liegen alle Zahlen außer ${correct}: Sie liegt ${outside > b ? `rechts von ${formatDe(b)}` : `links von ${formatDe(a)}`} und damit außerhalb.`,
          dedupeKey: `zahlenstrahl-mc:${a}:${b}:${outside}`,
        })
      },
      // Variant 3: Interaktiv — Zahlenfolge fortsetzen
      (rng: Rng) => {
        const start = roundTo(randInt(rng, 5, 30) / 10, 1)
        const step = roundTo(randInt(rng, 2, 8) / 10, 1)
        const second = roundTo(start + step, 1)
        const third = roundTo(start + 2 * step, 1)
        const next = roundTo(start + 3 * step, 1)
        return numberLineTask({
          question: `Die Zahlen ${formatDe(start)}; ${formatDe(second)}; ${formatDe(third)} folgen mit gleichem Abstand aufeinander.\nMarkiere die nächste Zahl der Folge auf dem Zahlenstrahl.`,
          min: Math.floor(start) - 0.5,
          max: Math.ceil(next) + 0.5,
          step: 0.1,
          decimals: 1,
          value: next,
          solution: formatDe(next),
          explanation: `Der Abstand zwischen den Zahlen beträgt ${formatDe(step)}. Die nächste Zahl ist ${formatDe(third)} + ${formatDe(step)} = ${formatDe(next)}.`,
          eps: 0.05,
        })
      },
      // Variant 4: Interaktiv — mehrere Dezimalzahlen auf den Zahlenstrahl ziehen
      (rng: Rng) => {
        const labels = pick(rng, [
          ['0,3', '0,7', '1,2', '1,6'],
          ['0,4', '0,9', '1,3', '1,8'],
          ['0,2', '0,6', '1,1', '1,9'],
          ['0,1', '0,8', '1,4', '1,7'],
        ])
        const items = labels.map((label, i) => ({ id: String.fromCharCode(97 + i), label, value: Number(label.replace(',', '.')) }))
        const hinweis = items
          .map((it) => {
            const k = Math.round(it.value * 10)
            return `${it.label} = ${k} Zehntel, also ${k} ${k === 1 ? 'Strich' : 'Striche'} rechts von der 0`
          })
          .join('; ')
        return numberLineMultiTask({
          question: `Ordne die Dezimalzahlen ${[labels[2], labels[0], labels[3]].join('; ')} und ${labels[1]} auf dem Zahlenstrahl ein. Der Zahlenstrahl geht von 0 bis 2. Zwischen zwei kleinen Strichen liegt jeweils 0,1.`,
          min: 0,
          max: 2,
          step: 0.1,
          labelEvery: 5,
          items,
          solution: `${labels.join(' < ')} (von links nach rechts)`,
          explanation: `Jeder kleine Strich ist ein Zehntel (0,1) lang. ${hinweis}. So findest du zu jeder Zahl den passenden Strich; je größer die Zahl, desto weiter rechts liegt sie.`,
          dedupeKey: `nlmulti-dez:${labels.join(',')}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 11) Größen mit verschiedenen Einheiten ordnen
  // ---------------------------------------------------------------------
  asNeuTopic('lb2-ordnen-einheiten', {
    id: 'lb2-ordnen-einheiten__neu',
    title: 'Größen ordnen und vergleichen (Zeit & Differenzen)',
    hint: 'Rechne alle Angaben in dieselbe Einheit um, dann vergleiche.',
    pointsPerTask: 10,
    difficulty: 3,
    keywords: ['ordnen', 'vergleichen', 'Zeit', 'Einheiten', 'umrechnen', 'Differenz'],
    fachwissen: {
      text: 'Um Größen zu vergleichen oder zu ordnen, müssen sie zunächst in eine gemeinsame Einheit umgerechnet werden. Das gilt für Längen, Massen und Volumina ebenso wie für Zeitangaben (Sekunden, Minuten, Stunden). Erst nach dem Umrechnen lassen sich Größen direkt vergleichen oder ihre Differenz berechnen.',
      quelle: 'Wikipedia: Maßeinheit',
      url: 'https://de.wikipedia.org/wiki/Ma%C3%9Feinheit',
    },
    generate: mixedVariants(
      // Variant 1: Sortieren — Zeitangaben
      (rng: Rng) => {
        const s1 = randInt(rng, 20, 55)
        const min1 = randInt(rng, 2, 8)
        const sCompare = randInt(rng, 150, 450)
        const items = [
          { label: `${s1} s`, value: s1 },
          { label: `${min1} min`, value: min1 * 60 },
          { label: `${sCompare} s`, value: sCompare },
        ]
        const sorted = [...items].sort((a, b) => a.value - b.value)
        const correctOrder = sorted.map((si) => items.findIndex((it) => it.value === si.value))
        return dragDropSortTask({
          question: 'Sortiere die Zeitangaben von klein nach groß (kleinste zuerst):',
          items,
          correctOrder,
          solution: sorted.map((i) => i.label).join(' < '),
          explanation: `Rechne alle Angaben in Sekunden um:\n${items.map((i) => `${i.label} = ${i.value} s`).join('\n')}.\n\nSortiert von klein nach groß: ${sorted.map((i) => i.label).join(' < ')}.`,
        })
      },
      // Variant 2: MC — größte Größe erkennen
      (rng: Rng) => {
        const kind = pick(rng, ['Länge', 'Masse', 'Volumen'] as const)
        let options: { label: string; value: number }[]
        let unitName: string
        if (kind === 'Länge') {
          const cm1 = randInt(rng, 40, 190)
          const m = roundTo(randInt(rng, 10, 35) / 10, 1)
          const mm1 = randInt(rng, 300, 2500)
          unitName = 'cm'
          options = [
            { label: `${cm1} cm`, value: cm1 },
            { label: `${formatDe(m)} m`, value: m * 100 },
            { label: `${mm1} mm`, value: mm1 / 10 },
          ]
        } else if (kind === 'Masse') {
          const g1 = randInt(rng, 300, 1800)
          const kg = roundTo(randInt(rng, 10, 35) / 10, 1)
          const g2 = randInt(rng, 400, 2500)
          unitName = 'g'
          options = [
            { label: `${g1} g`, value: g1 },
            { label: `${formatDe(kg)} kg`, value: kg * 1000 },
            { label: `${g2} g`, value: g2 },
          ]
        } else {
          const ml1 = randInt(rng, 300, 1800)
          const l = roundTo(randInt(rng, 10, 35) / 10, 1)
          const ml2 = randInt(rng, 400, 2500)
          unitName = 'ml'
          options = [
            { label: `${ml1} ml`, value: ml1 },
            { label: `${formatDe(l)} l`, value: l * 1000 },
            { label: `${ml2} ml`, value: ml2 },
          ]
        }
        const maxVal = Math.max(...options.map((o) => o.value))
        const correctOpt = options.find((o) => o.value === maxVal)!
        const correct = correctOpt.label
        const choices = shuffleChoices(rng, options.map((o) => o.label), correct)
        return choicePickTask({
          question: 'Welche dieser Größen ist am größten?',
          choices,
          correct,
          solution: correct,
          explanation: `Umgerechnet in ${unitName}: ${options.map((o) => `${o.label} = ${formatDe(o.value)} ${unitName}`).join(', ')}. Am größten ist ${correct}.`,
          dedupeKey: `ordnen-mc:${options.map((o) => o.label).join('-')}`,
        })
      },
      // Variant 3: Tippen — Differenz nach Umrechnen
      (rng: Rng) => {
        const kg = roundTo(randInt(rng, 15, 40) / 10, 1)
        const g = randInt(rng, 500, 1800)
        const kgInG = Math.round(kg * 1000)
        const diff = Math.abs(kgInG - g)
        const larger = kgInG > g ? `${formatDe(kg)} kg` : `${g} g`
        const smaller = kgInG > g ? `${g} g` : `${formatDe(kg)} kg`
        return valueTask({
          question: `${larger} und ${smaller} sollen verglichen werden. Rechne beides in Gramm um: Um wie viel Gramm ist ${larger} schwerer als ${smaller}?`,
          answerKind: 'integer',
          value: diff,
          solution: formatDe(diff),
          explanation: `${formatDe(kg)} kg = ${kgInG} g. Differenz: ${Math.max(kgInG, g)} g − ${Math.min(kgInG, g)} g = ${diff} g.`,
        })
      },
    ),
  }),
]

/** LB3 — Lagebeziehungen (lokale Helfer, unabhängig von math5.ts) */

/** Flexible akzeptierte Formate für ein Koordinatenpaar — lokale Kopie für LB3-Neu. */
const pairAnswerAcceptedNeu = (a: number, b: number): string[] => {
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

const COORD_RANGE_NEU: [number, number] = [-5, 8]
const POINT_LABELS_NEU = ['A', 'B', 'C'] as const

/** Verschiedene ganzzahlige Gitterpunkte — lokale Kopie für LB3-Neu. */
const distinctGridPointsNeu = (
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

function shuffleArrNeu<T>(rng: Rng, arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

const sampleTriangleNeu = (): Array<[number, number]> => [
  [1, 1],
  [3, 1],
  [2, 3],
]

const sampleQuadNeu = (): Array<[number, number]> => [
  [1, 1],
  [3, 1],
  [3, 2],
  [1, 3],
]

const pickMirrorNeu = (rng: Rng): MirrorLineKind => {
  const kind = pick(rng, ['x-axis', 'y-axis', 'y=x', 'vertical', 'horizontal'] as const)
  // x = 0 und y = 0 sind die Koordinatenachsen selbst und heißen dort „x-Achse“ bzw. „y-Achse“.
  if (kind === 'vertical') return { type: 'vertical', x: pick(rng, [1, 2, 3]) }
  if (kind === 'horizontal') return { type: 'horizontal', y: pick(rng, [1, 2, 3]) }
  return kind
}

const mirrorDescribeNeu = (mirror: MirrorLineKind): string => {
  if (mirror === 'x-axis') return 'der x-Achse'
  if (mirror === 'y-axis') return 'der y-Achse'
  if (mirror === 'y=x') return 'der Geraden y = x'
  if (mirror.type === 'vertical') return `der Geraden x = ${mirror.x}`
  return `der Geraden y = ${mirror.y}`
}

const LINE_KIND_LABEL_NEU: Record<'strecke' | 'halbgerade' | 'gerade', string> = {
  strecke: 'Strecke',
  halbgerade: 'Halbgerade',
  gerade: 'Gerade',
}

export const math5NeuLb3: Topic[] = [
  // ---------------------------------------------------------------------
  // 1) Winkelarten — Uhr, Alltag & virtuelles Messen
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-winkelarten', {
    id: 'lb3-winkelarten__neu',
    title: 'Winkelarten im Alltag & virtuelles Messen',
    hint: 'Vergleiche mit einem rechten Winkel (90°): kleiner = spitz, größer = stumpf, genau 180° = gestreckt.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Winkel', 'Winkelart', 'spitz', 'recht', 'stumpf', 'gestreckt', 'Uhrzeiger', 'messen'],
    fachwissen: {
      text: 'Winkelarten begegnen uns ständig im Alltag: Die Uhrzeiger bilden je nach Uhrzeit unterschiedliche Winkel, eine angelehnte Tür einen spitzen, eine weit geöffnete einen stumpfen Winkel. Um die Größe eines Winkels ohne Winkelmesser grob einzuschätzen, vergleicht man ihn gedanklich mit einem rechten Winkel (90°) als Referenz.',
      quelle: 'Wikipedia: Winkel',
      url: 'https://de.wikipedia.org/wiki/Winkel',
      explore: { boardId: 'winkelarten' },
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Winkel zwischen den Uhrzeigern
      (rng: Rng) => {
        const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        const h = pick(rng, hours)
        const raw = h * 30
        const deg = raw > 180 ? 360 - raw : raw
        const kind = deg === 90 ? 'recht' : deg === 180 ? 'gestreckt' : deg < 90 ? 'spitz' : 'stumpf'
        return choicePickTask({
          question: `Um ${h} Uhr zeigt der Minutenzeiger genau auf die 12. Welche Winkelart bildet der kleinere Winkel zwischen Stunden- und Minutenzeiger?`,
          choices: ['spitz', 'recht', 'stumpf', 'gestreckt'],
          correct: kind,
          solution: kind,
          explanation: `Der Stundenzeiger steht bei der ${h}. Das sind ${raw}° vom 12-Uhr-Strich aus gemessen${raw > 180 ? `; in der kürzeren Richtung sind es 360° − ${raw}° = ${deg}°` : ''}. ${deg}° ist ${
            kind === 'recht'
              ? 'genau 90°, also ein rechter Winkel'
              : kind === 'gestreckt'
                ? 'genau 180°, also ein gestreckter Winkel'
                : deg < 90
                  ? 'kleiner als 90°, also spitz'
                  : 'zwischen 90° und 180°, also stumpf'
          }.`,
          instruction: 'Tippe die passende Winkelart:',
          dedupeKey: `winkelarten-uhr:${h}`,
        })
      },
      // Variant 2: MC — Alltagsbeispiel klassifizieren
      (rng: Rng) => {
        const items = [
          { name: 'die Ecke eines rechteckigen Blattes Papier', deg: 90 },
          { name: 'eine normal geöffnete Zimmertür', deg: 110 },
          { name: 'die Spitze eines steil zulaufenden Kirchturmdachs', deg: 50 },
          { name: 'ein fast ganz aufgeklapptes Laptop-Display', deg: 170 },
          { name: 'die Öffnung zwischen einer angelehnten Leiter und der Wand', deg: 20 },
          { name: 'eine nur leicht angelehnte Tür', deg: 15 },
          { name: 'die Neigung einer Kinderrutsche gegen den Boden', deg: 35 },
        ] as const
        const item = pick(rng, items)
        const kind = item.deg === 90 ? 'recht' : item.deg < 90 ? 'spitz' : 'stumpf'
        return choicePickTask({
          question: `Welche Winkelart hat ${item.name} (ca. ${item.deg}°)?`,
          choices: ['spitz', 'recht', 'stumpf', 'gestreckt'],
          correct: kind,
          solution: kind,
          explanation: `${item.deg}° ist ${
            kind === 'recht' ? 'genau 90°, also ein rechter Winkel' : kind === 'spitz' ? 'kleiner als 90°, also spitz' : 'zwischen 90° und 180°, also stumpf'
          }.`,
          instruction: 'Tippe die passende Winkelart:',
          dedupeKey: `winkelarten-alltag:${item.deg}`,
        })
      },
      // Variant 3: Portfolio — Winkel mit dem Geodreieck messen (Figur ohne Gradzahl)
      (rng: Rng) => {
        const startAngle = pick(rng, [0, 20, 45, 90, 135, 180, 225, 270])
        // Jede Szene nur mit Winkeln, die dort realistisch vorkommen.
        const { szene, winkel } = pick(rng, [
          { szene: 'die beiden Arme einer geöffneten Schere', winkel: [15, 25, 35, 40, 55, 65, 75, 105] },
          { szene: 'die aufgeklappten Schenkel eines Zirkels', winkel: [25, 35, 40, 55, 65, 75] },
          { szene: 'die beiden Zeiger einer Uhr', winkel: [35, 55, 65, 105, 125, 145, 155, 165] },
          { szene: 'einen Türflügel und den Türrahmen', winkel: [40, 55, 65, 75, 105, 115, 125, 135] },
          { szene: 'das aufgeklappte Display eines Laptops', winkel: [105, 115, 125, 135] },
          { szene: 'eine Leiter und die Wand, an der sie lehnt', winkel: [15, 25, 35] },
          { szene: 'einen Fensterflügel und den Fensterrahmen', winkel: [40, 55, 65, 75, 105, 115, 125, 135] },
          { szene: 'die beiden Seiten eines aufgeschlagenen Buches', winkel: [105, 115, 125, 135, 145, 155] },
        ])
        const deg = pick(rng, winkel)
        return angleProtractorTask({
          question: `Die beiden Schenkel stehen für ${szene}. Miss den Winkel zwischen ihnen mit dem Geodreieck.`,
          mode: 'measure',
          angle: deg,
          startAngle,
          solution: `${deg}°`,
          explanation: `Der Nullpunkt des Geodreiecks liegt auf dem Scheitel, ein Schenkel auf der 0-Linie. Am anderen Schenkel liest du ${deg}° ab. ${
            deg < 90
              ? `${deg}° ist kleiner als 90°, der Winkel ist also spitz.`
              : `${deg}° liegt zwischen 90° und 180°, der Winkel ist also stumpf.`
          }`,
          instruction: 'Miss den Winkel mit dem Geodreieck und trage die Gradzahl ein:',
          dedupeKey: `winkelarten-messen:${deg}`,
        })
      },
      // Variant 4: Portfolio — Winkel einer bestimmten Art mit dem Geodreieck zeichnen
      (rng: Rng) => {
        const art = pick(rng, ['spitz', 'stumpf'] as const)
        const deg = art === 'spitz' ? pick(rng, [20, 30, 40, 50, 65, 70, 80]) : pick(rng, [100, 110, 120, 130, 140, 150, 160])
        const startAngle = pick(rng, [0, 30, 60, 90, 120, 150, 180, 210])
        return angleProtractorTask({
          question: `Zeichne mit dem Geodreieck einen ${art}en Winkel mit ${deg}°.`,
          mode: 'draw',
          angle: deg,
          startAngle,
          solution: `${deg}°`,
          explanation: `Ein ${art}er Winkel ${
            art === 'spitz' ? 'ist kleiner als 90°' : 'liegt zwischen 90° und 180°'
          }, ${deg}° passt dazu. Der Scheitel liegt auf dem Nullpunkt des Geodreiecks, ein Schenkel auf der 0-Linie; den zweiten Schenkel stellst du auf ${deg}° ein.`,
          instruction: 'Stelle den zweiten Schenkel am Geodreieck auf den gesuchten Winkel ein:',
          dedupeKey: `winkelarten-zeichnen:${deg}`,
        })
      },
      // Variant 5: Uhr — eine Uhrzeit mit vorgegebenem Winkel zwischen den Zeigern einstellen
      (rng: Rng) => {
        const deg = pick(rng, [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165])
        const full = deg % 30 === 0
        // Volle Stunde x:00 (Winkel 30 · x) oder halbe Stunde x:30 (Winkel |30 · x − 165|).
        const x = full ? deg / 30 : (deg + 165) / 30
        const example = { h: x, m: full ? 0 : 30 }
        const otherX = full ? 12 - x : 11 - x
        const other = otherX % 12 === 0 ? 12 : otherX
        const hand = 30 * x + 15
        const explanation = full
          ? `Der Minutenzeiger zeigt auf die 12. Von einer Zahl zur nächsten sind es 30°, der Stundenzeiger legt ${x} Zahlenschritte zurück: ${x} · 30° = ${deg}°. Also passt ${x}:00 Uhr. Es gibt weitere passende Uhrzeiten, zum Beispiel ${other}:00 Uhr.`
          : `Um ${x}:30 Uhr zeigt der Minutenzeiger auf die 6 (180°). Der Stundenzeiger steht genau zwischen der ${x} und der ${x + 1}, das sind ${x} · 30° + 15° = ${hand}°. Der Unterschied ist ${Math.abs(hand - 180)}°. Es gibt weitere passende Uhrzeiten, zum Beispiel ${other}:30 Uhr.`
        return clockTask({
          question: `Finde eine Uhrzeit, bei der der kleinere Winkel zwischen Stunden- und Minutenzeiger ${deg}° beträgt.`,
          mode: 'angle',
          angle: deg,
          exampleTime: example,
          solution: `z. B. ${ckFormatTime(example)} Uhr`,
          explanation,
          instruction: 'Stelle die Zeiger so ein, dass sie den gesuchten Winkel bilden. Es gibt oft mehrere richtige Uhrzeiten.',
          dedupeKey: `winkelarten-uhr-winkel:${deg}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 2) Winkel ergänzen — Vollwinkel, Nebenwinkel & virtuelles Messen
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-winkel-ergaenzung', {
    id: 'lb3-winkel-ergaenzung__neu',
    title: 'Winkel ergänzen — Vollwinkel & Nebenwinkel',
    hint: 'Vollwinkel: 360° minus die bekannten Winkel. Nebenwinkel an einer Geraden: 180° minus den gegebenen Winkel.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Vollwinkel', 'Nebenwinkel', 'Scheitelwinkel', 'Ergänzungswinkel', '360°'],
    fachwissen: {
      text: 'Liegen mehrere Winkel lückenlos um einen Punkt herum, ergeben sie zusammen einen Vollwinkel von 360°. Schneiden sich zwei Geraden, entstehen vier Winkel: Benachbarte Winkel auf derselben Geraden heißen Nebenwinkel und ergänzen sich zu 180°, gegenüberliegende Winkel heißen Scheitelwinkel und sind gleich groß.',
      quelle: 'Wikipedia: Winkel',
      url: 'https://de.wikipedia.org/wiki/Winkel',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Vollwinkel (drei Winkel um einen Punkt)
      (rng: Rng) => {
        const a = randInt(rng, 40, 150)
        const b = randInt(rng, 40, 150)
        const value = 360 - a - b
        return valueTask({
          question: `Drei Winkel liegen lückenlos nebeneinander um einen Punkt und ergeben zusammen einen Vollwinkel (360°). Zwei davon sind ${a}° und ${b}°. Wie groß ist der dritte?`,
          unit: '°',
          answerKind: 'integer',
          value,
          solution: `${value}°`,
          explanation: `Vollwinkel: 360° − ${a}° − ${b}° = ${value}°.`,
        })
      },
      // Variant 2: MC — Nebenwinkel an der Geradenkreuzung
      (rng: Rng) => {
        // x ≠ 90 und |180 − 2x| ≥ 40, damit Distraktoren (x, Ergebnis ± 20) nie zusammenfallen.
        const x = pick(rng, [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160])
        const correctVal = 180 - x
        const wrong1 = x
        const wrong2 = Math.min(179, correctVal + 20)
        const wrong3 = Math.max(1, correctVal - 20)
        const choices = shuffleChoices(
          rng,
          [correctVal, wrong1, wrong2, wrong3].map((v) => `${v}°`),
          `${correctVal}°`,
        )
        return choicePickTask({
          question: `Zwei Geraden schneiden sich in einem Punkt. Ein Winkel an der Kreuzung beträgt ${x}°. Wie groß ist der Nebenwinkel (der direkt daneben liegende Winkel auf derselben Geraden)?`,
          choices,
          correct: `${correctVal}°`,
          solution: `${correctVal}°`,
          explanation: `Nebenwinkel ergänzen sich zu 180°: 180° − ${x}° = ${correctVal}°. (Der gegenüberliegende Scheitelwinkel wäre dagegen genauso groß wie ${x}°.)`,
          dedupeKey: `winkelerg-neben:${x}`,
        })
      },
      // Variant 3: Portfolio — Ergänzungswinkel zu 180° mit dem Geodreieck zeichnen
      (rng: Rng) => {
        const deg = pick(rng, [20, 35, 45, 55, 70, 85, 100, 115, 125, 140, 150, 160])
        const startAngle = pick(rng, [0, 30, 60, 90, 120, 150, 180, 210])
        const value = 180 - deg
        return angleProtractorTask({
          question: `Ein Winkel ist ${deg}° groß. Zeichne mit dem Geodreieck den Winkel, der ihn zu einem gestreckten Winkel (180°) ergänzt.`,
          mode: 'draw',
          angle: value,
          startAngle,
          solution: `${value}°`,
          explanation: `Ein gestreckter Winkel misst 180°. Der gesuchte Winkel ergänzt ${deg}° dazu: 180° − ${deg}° = ${value}°. Stelle den zweiten Schenkel am Geodreieck auf ${value}° ein.`,
          instruction: 'Stelle den zweiten Schenkel am Geodreieck auf den gesuchten Winkel ein:',
          dedupeKey: `winkelerg-zeichnen:${deg}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 3) Koordinaten ablesen — Achsenabstand & Quadranten
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-koordinaten-ablesen', {
    id: 'lb3-koordinaten-ablesen__neu',
    title: 'Koordinaten ablesen — Achsenabstand & Quadranten',
    hint: 'Abstand zur x-Achse = |y|, Abstand zur y-Achse = |x|.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Koordinaten', 'ablesen', 'Quadrant', 'Achsenabstand', 'Betrag'],
    fachwissen: {
      text: 'Der Abstand eines Punktes P(x|y) zur x-Achse entspricht dem Betrag der y-Koordinate, der Abstand zur y-Achse dem Betrag der x-Koordinate. Das liegt daran, dass man beim Abstandmessen nur senkrecht auf die jeweilige Achse zählt, unabhängig vom Vorzeichen.',
      quelle: 'Wikipedia: Kartesisches Koordinatensystem',
      url: 'https://de.wikipedia.org/wiki/Kartesisches_Koordinatensystem',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Abstand zu einer Achse
      (rng: Rng) => {
        const [p] = distinctGridPointsNeu(rng, 1, { avoidAxes: true })
        const svg = generatePointsOnGridSvg({
          points: [{ ...p, label: 'P' }],
          xRange: COORD_RANGE_NEU,
          yRange: COORD_RANGE_NEU,
        })
        const toXAxis = rng() < 0.5
        const value = toXAxis ? Math.abs(p.y) : Math.abs(p.x)
        return {
          ...valueTask({
            question: `Punkt P ist im Koordinatensystem markiert. Wie groß ist der Abstand von P zur ${
              toXAxis ? 'x-Achse' : 'y-Achse'
            } (in LE)?`,
            unit: 'LE',
            answerKind: 'integer',
            value,
            solution: `${value}`,
            explanation: `P liegt bei (${p.x}|${p.y}). Der Abstand zur ${
              toXAxis ? `x-Achse ist der Betrag der y-Koordinate: |${p.y}|` : `y-Achse ist der Betrag der x-Koordinate: |${p.x}|`
            } = ${value} LE.`,
          }),
          visualContent: svg,
        }
      },
      // Variant 2: MC — welcher Punkt liegt im gesuchten Quadranten
      (rng: Rng) => {
        const quads: Array<'I' | 'II' | 'III' | 'IV'> = ['I', 'II', 'III', 'IV']
        const chosenQuads = shuffleArrNeu(rng, quads).slice(0, 3) as Array<'I' | 'II' | 'III' | 'IV'>
        const pts = chosenQuads.map((q) => {
          let x = randInt(rng, 1, 6)
          let y = randInt(rng, 1, 6)
          if (q === 'II' || q === 'III') x = -x
          if (q === 'III' || q === 'IV') y = -y
          return { x, y }
        })
        const labeled = pts.map((p, i) => ({ ...p, label: POINT_LABELS_NEU[i] }))
        const askIdx = randInt(rng, 0, 2)
        const targetQuad = chosenQuads[askIdx]!
        const targetLabel = POINT_LABELS_NEU[askIdx]
        return choicePickTask({
          question: `Welcher Punkt liegt im Quadranten ${targetQuad}?`,
          choices: labeled.map((p) => p.label),
          correct: targetLabel,
          solution: targetLabel,
          explanation: `${labeled.map((p) => `${p.label}(${p.x}|${p.y})`).join(', ')}. Punkt ${targetLabel} hat x ${
            targetQuad === 'I' || targetQuad === 'IV' ? '> 0' : '< 0'
          } und y ${targetQuad === 'I' || targetQuad === 'II' ? '> 0' : '< 0'}, also Quadrant ${targetQuad}.`,
          visualContent: generatePointsOnGridSvg({ points: labeled, xRange: COORD_RANGE_NEU, yRange: COORD_RANGE_NEU }),
          instruction: 'Tippe den passenden Punkt:',
          dedupeKey: `koord-quadrant-mc:${labeled.map((p) => `${p.x},${p.y}`).join('-')}`,
        })
      },
      // Variant 3: Portfolio — Punkt mit doppeltem Achsenabstand setzen
      (rng: Rng) => {
        const x = pick(rng, [-2, -1, 1, 2, 3, 4])
        const y = randInt(rng, -3, 6)
        const svg = generatePointsOnGridSvg({
          points: [{ x, y, label: 'P' }],
          xRange: COORD_RANGE_NEU,
          yRange: COORD_RANGE_NEU,
        })
        const qx = 2 * x
        return coordinateClickTask({
          question: `Punkt P liegt bei (${x}|${y}). Setze den Punkt Q, der den doppelten Abstand zur y-Achse wie P hat (gleiche y-Koordinate, gleiche Seite).`,
          x: qx,
          y,
          solution: `(${qx}|${y})`,
          explanation: `P hat den Abstand |${x}| = ${Math.abs(x)} zur y-Achse. Der doppelte Abstand ist ${2 * Math.abs(x)}, also liegt Q bei (${qx}|${y}).`,
          xRange: COORD_RANGE_NEU,
          yRange: COORD_RANGE_NEU,
          visualContent: svg,
          instruction: 'Tippe auf die richtige Gitterstelle für Q:',
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 4) Punkte eintragen — Figuren & Quadranten-Bedingungen
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-koordinaten-eintragen', {
    id: 'lb3-koordinaten-eintragen__neu',
    title: 'Punkte eintragen — Figuren & Bedingungen',
    hint: 'Auf einer Achse ist eine der beiden Koordinaten immer 0.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Koordinaten', 'eintragen', 'Quadrant', 'Vorzeichen', 'Achse'],
    fachwissen: {
      text: 'Das Vorzeichen der Koordinaten legt den Quadranten fest: positiv/positiv ist Quadrant I, negativ/positiv Quadrant II, negativ/negativ Quadrant III und positiv/negativ Quadrant IV. Liegt ein Punkt genau auf der x-Achse, ist seine y-Koordinate 0; liegt er auf der y-Achse, ist seine x-Koordinate 0.',
      quelle: 'Wikipedia: Kartesisches Koordinatensystem',
      url: 'https://de.wikipedia.org/wiki/Kartesisches_Koordinatensystem',
    },
    generate: mixedVariants(
      // Variant 1: Portfolio — mehrere Punkte gleichzeitig setzen (Figur)
      (rng: Rng) => {
        const pts = distinctGridPointsNeu(rng, 3)
        const names = pts.map((p, i) => `${POINT_LABELS_NEU[i]}(${p.x}|${p.y})`).join(', ')
        return coordinateClickTask({
          question: `Setze die drei Punkte ${names} im Koordinatensystem.`,
          x: pts[0]!.x,
          y: pts[0]!.y,
          points: pts,
          solution: names,
          explanation: `Setze jeden Punkt einzeln: vom Ursprung aus x Einheiten waagerecht und y Einheiten senkrecht. ${names}.`,
          xRange: COORD_RANGE_NEU,
          yRange: COORD_RANGE_NEU,
          instruction: 'Tippe die drei gesuchten Punkte:',
        })
      },
      // Variant 2: Tippen — Quadrant aus Vorzeichen bestimmen (ohne konkrete Zahlen)
      (rng: Rng) => {
        const signs = pick(rng, [
          ['positive', 'positive', 'I'],
          ['negative', 'positive', 'II'],
          ['negative', 'negative', 'III'],
          ['positive', 'negative', 'IV'],
        ] as const)
        return choicePickTask({
          question: `Ein Punkt hat eine ${signs[0]} x-Koordinate und eine ${signs[1]} y-Koordinate. In welchem Quadranten liegt er?`,
          choices: ['I', 'II', 'III', 'IV'],
          correct: signs[2],
          solution: signs[2],
          explanation: `x ${signs[0]}, y ${signs[1]} → Quadrant ${signs[2]}.`,
          instruction: 'Tippe den passenden Quadranten:',
          dedupeKey: `quadrant-vorzeichen:${signs[2]}`,
        })
      },
      // Variant 3: MC — welcher Punkt liegt genau auf einer Achse
      (rng: Rng) => {
        const onXAxis = rng() < 0.5
        const correctPt = onXAxis ? { x: randInt(rng, -4, 6), y: 0 } : { x: 0, y: randInt(rng, -4, 6) }
        const others: Array<{ x: number; y: number }> = []
        let guard = 0
        while (others.length < 2 && guard < 50) {
          guard++
          const x = randInt(rng, -4, 6)
          const y = randInt(rng, -4, 6)
          if (x === 0 || y === 0) continue
          others.push({ x, y })
        }
        const entries = shuffleArrNeu(rng, [
          { pt: correctPt, isCorrect: true },
          { pt: others[0]!, isCorrect: false },
          { pt: others[1]!, isCorrect: false },
        ])
        const labeled = entries.map((e, i) => ({ ...e.pt, label: POINT_LABELS_NEU[i] }))
        const correctLabel = POINT_LABELS_NEU[entries.findIndex((e) => e.isCorrect)]
        return choicePickTask({
          question: `Welcher Punkt liegt genau auf der ${onXAxis ? 'x-Achse' : 'y-Achse'}?`,
          choices: labeled.map((p) => p.label),
          correct: correctLabel,
          solution: correctLabel,
          explanation: `Auf der ${onXAxis ? 'x-Achse' : 'y-Achse'} ist die ${onXAxis ? 'y' : 'x'}-Koordinate immer 0. Punkt ${correctLabel} erfüllt das: (${labeled.find((p) => p.label === correctLabel)!.x}|${labeled.find((p) => p.label === correctLabel)!.y}).`,
          visualContent: generatePointsOnGridSvg({ points: labeled, xRange: COORD_RANGE_NEU, yRange: COORD_RANGE_NEU }),
          instruction: 'Tippe den passenden Punkt:',
          dedupeKey: `achse-mc:${labeled.map((p) => `${p.x},${p.y}`).join('-')}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 5) Abstand zwischen Punkten — Umfang & Vergleich
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-koordinaten-abstand', {
    id: 'lb3-koordinaten-abstand__neu',
    title: 'Abstand zwischen Punkten — Umfang & Vergleich',
    hint: '3-4-5-Dreieck: Katheten 3 und 4 LE, Hypotenuse immer 5 LE (bzw. Vielfache davon).',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Abstand', 'Umfang', 'Dreieck', 'Koordinaten', 'Pythagoras'],
    fachwissen: {
      text: 'Bei einem rechtwinkligen Dreieck mit den Katheten 3 LE und 4 LE ist die Hypotenuse immer genau 5 LE lang (3-4-5-Dreieck) — das gilt auch für Vielfache wie 6-8-10. Der Umfang eines Dreiecks ist die Summe der Längen aller drei Seiten und lässt sich aus den Koordinaten der Eckpunkte berechnen.',
      quelle: 'Wikipedia: Satz des Pythagoras',
      url: 'https://de.wikipedia.org/wiki/Satz_des_Pythagoras',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Umfang eines 3-4-5-Dreiecks
      (rng: Rng) => {
        const scale = pick(rng, [1, 2] as const)
        const dx = 3 * scale
        const dy = 4 * scale
        const hyp = 5 * scale
        const ax = randInt(rng, -3, 7 - dx)
        const ay = randInt(rng, -3, 7 - dy)
        const bx = ax + dx
        const by = ay
        const cx = bx
        const cy = ay + dy
        const svg = generateSegmentsOnGridSvg({
          segments: [
            { a: [ax, ay], b: [bx, by], labelA: 'A', labelB: 'B' },
            { a: [bx, by], b: [cx, cy], labelA: 'B', labelB: 'C' },
            { a: [ax, ay], b: [cx, cy], labelA: 'A', labelB: 'C' },
          ],
          showSegments: true,
          showLengthLabels: false,
          xRange: [-5, 9],
          yRange: [-5, 9],
        })
        const perimeter = dx + dy + hyp
        return {
          ...valueTask({
            question: 'Berechne den Umfang des Dreiecks ABC. (1 Kästchen = 1 LE)',
            unit: 'LE',
            answerKind: 'integer',
            value: perimeter,
            solution: `${perimeter} LE`,
            explanation: `AB = ${dx} LE, BC = ${dy} LE, AC = ${hyp} LE (3-4-5-Dreieck bzw. Vielfaches). Umfang = ${dx} + ${dy} + ${hyp} = ${perimeter} LE.`,
          }),
          visualContent: svg,
        }
      },
      // Variant 2: MC — welcher Punkt liegt näher an P
      (rng: Rng) => {
        const [p] = distinctGridPointsNeu(rng, 1, { avoidAxes: true })
        const distA = randInt(rng, 1, 3)
        const distB = randInt(rng, 4, 6)
        const qA = { x: p.x + distA, y: p.y }
        const qB = { x: p.x, y: p.y + distB }
        const correct = distA < distB ? 'A' : 'B'
        const svg = generatePointsOnGridSvg({
          points: [
            { ...p, label: 'P' },
            { ...qA, label: 'A' },
            { ...qB, label: 'B' },
          ],
          connectLabels: [
            ['P', 'A'],
            ['P', 'B'],
          ],
          xRange: COORD_RANGE_NEU,
          yRange: COORD_RANGE_NEU,
        })
        return choicePickTask({
          question: 'Welcher Punkt liegt näher an P: A oder B?',
          choices: ['A', 'B'],
          correct,
          solution: correct,
          explanation: `PA = ${distA} LE, PB = ${distB} LE. ${correct} liegt näher an P, da ${Math.min(distA, distB)} LE < ${Math.max(distA, distB)} LE.`,
          visualContent: svg,
          instruction: 'Tippe den näheren Punkt:',
          dedupeKey: `abstand-naeher:${p.x}:${p.y}:${distA}:${distB}`,
        })
      },
      // Variant 3: Portfolio — Punkt mit festem Abstand setzen
      (rng: Rng) => {
        const ax = randInt(rng, -3, 4)
        const ay = randInt(rng, -3, 4)
        const bx = ax + 3
        const by = ay + 4
        const svg = generatePointsOnGridSvg({
          points: [{ x: ax, y: ay, label: 'A' }],
          xRange: COORD_RANGE_NEU,
          yRange: COORD_RANGE_NEU,
        })
        return coordinateClickTask({
          question: `Punkt A liegt bei (${ax}|${ay}). Setze einen Punkt B, der 5 LE von A entfernt ist: 3 Einheiten nach rechts und 4 Einheiten nach oben.`,
          x: bx,
          y: by,
          solution: `(${bx}|${by})`,
          explanation: `B = A + (3|4) = (${ax}+3|${ay}+4) = (${bx}|${by}). Abstand AB = √(3² + 4²) = 5 LE.`,
          xRange: COORD_RANGE_NEU,
          yRange: COORD_RANGE_NEU,
          visualContent: svg,
          instruction: 'Tippe auf die richtige Gitterstelle für B:',
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 6) Verschiebung — Rückwärts & Vektorketten
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-verschiebung', {
    id: 'lb3-verschiebung__neu',
    title: 'Verschiebung — Rückwärts & Vektorketten',
    hint: 'Rückwärts rechnen: A = A\' − Vektor. Gegenvektor: Vorzeichen von dx und dy umdrehen.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Verschiebung', 'Vektor', 'Translation', 'Gegenvektor', 'rückwärts'],
    fachwissen: {
      text: 'Jede Verschiebung lässt sich umkehren: Verschiebt man einen Bildpunkt A\' um den Gegenvektor (−dx|−dy), erhält man wieder den Ausgangspunkt A. Werden zwei Verschiebungen nacheinander ausgeführt, addieren sich ihre Vektoren zu einem Gesamtvektor, der den Punkt direkt vom Start zum Ziel führt.',
      quelle: 'Wikipedia: Verschiebung (Geometrie)',
      url: 'https://de.wikipedia.org/wiki/Verschiebung_(Geometrie)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — rückwärts: A' und Vektor gegeben, A gesucht
      (rng: Rng) => {
        const x = randInt(rng, -2, 5)
        const y = randInt(rng, -2, 5)
        let dx = randInt(rng, 1, 4)
        let dy = randInt(rng, 1, 3)
        if (rng() < 0.4) dx = -dx
        if (rng() < 0.4) dy = -dy
        const apx = x + dx
        const apy = y + dy
        const accepted = pairAnswerAcceptedNeu(x, y)
        return textTask({
          question: `Der Punkt A' = (${apx}|${apy}) ist durch die Verschiebung um den Vektor (${dx}|${dy}) aus dem Punkt A entstanden. Wie lautet A? Gib x; y an.`,
          accepted,
          solution: `${x}; ${y}`,
          explanation: `Rückwärts rechnen: A = A' − Vektor = (${apx} − (${dx})|${apy} − (${dy})) = (${x}|${y}).`,
        })
      },
      // Variant 2: MC — Vektorkette (zwei Verschiebungen nacheinander)
      (rng: Rng) => {
        const x = randInt(rng, -2, 3)
        const y = randInt(rng, -2, 3)
        const dx1 = randInt(rng, 1, 3)
        const dy1 = randInt(rng, 0, 3)
        let dx2 = randInt(rng, 1, 3)
        if (rng() < 0.5) dx2 = -dx2
        let dy2 = randInt(rng, 1, 2)
        if (rng() < 0.5) dy2 = -dy2
        const totalX = x + dx1 + dx2
        const totalY = y + dy1 + dy2
        const afterFirstX = x + dx1
        const afterFirstY = y + dy1
        const correct = `(${totalX}|${totalY})`
        const wrong1 = `(${afterFirstX}|${afterFirstY})`
        const wrong2 = `(${x + dx1 - dx2}|${y + dy1 - dy2})`
        const wrong3 = `(${totalX + 1}|${totalY})`
        const choices = shuffleChoices(rng, [correct, wrong1, wrong2, wrong3], correct)
        return choicePickTask({
          question: `Punkt P liegt bei (${x}|${y}). P wird zuerst um den Vektor (${dx1}|${dy1}) und danach um den Vektor (${dx2}|${dy2}) verschoben. Wo liegt der Bildpunkt am Ende?`,
          choices,
          correct,
          solution: correct,
          explanation: `Erste Verschiebung: (${x}+${dx1}|${y}+${dy1}) = (${afterFirstX}|${afterFirstY}). Zweite Verschiebung: (${afterFirstX}+${dx2}|${afterFirstY}+${dy2}) = ${correct}.`,
          dedupeKey: `verschiebung-kette:${x}:${y}:${dx1}:${dy1}:${dx2}:${dy2}`,
        })
      },
      // Variant 3: Portfolio — Gegenvektor finden (visuell)
      (rng: Rng) => {
        const useTri = rng() < 0.5
        const points = useTri ? sampleTriangleNeu() : sampleQuadNeu()
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
        const backX = -dx
        const backY = -dy
        const accepted = pairAnswerAcceptedNeu(backX, backY)
        return {
          ...textTask({
            question: `Die Figur F wurde um den Vektor (${dx}|${dy}) zu F' verschoben. Welcher Vektor verschiebt F' zurück auf F? Gib dx; dy an.`,
            accepted,
            solution: `${backX}; ${backY}`,
            explanation: `Die Rückverschiebung ist der Gegenvektor: (−${dx}|−${dy}) = (${backX}|${backY}).`,
          }),
          visualContent: svg,
        }
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 7) Achsensymmetrie — Buchstaben & Spiegelachse per Klick
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-achsensymmetrie', {
    id: 'lb3-achsensymmetrie__neu',
    title: 'Achsensymmetrie — Buchstaben & Spiegelachse',
    hint: 'Gleiche x, Vorzeichenwechsel bei y → Spiegelung an der x-Achse (und umgekehrt für die y-Achse).',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Achsensymmetrie', 'Buchstabe', 'Spiegelachse', 'spiegeln'],
    fachwissen: {
      text: 'Viele Großbuchstaben sind in gängigen Schriftarten achsensymmetrisch, z. B. A, H, M, T, U, V, W, X und Y mit einer senkrechten Spiegelachse. Andere Buchstaben wie F, G, J, L, N, P, Q oder R besitzen dagegen keine Spiegelachse. An den Koordinaten eines Punktes und seines Bildpunktes lässt sich erkennen, an welcher Achse gespiegelt wurde: Bleibt x gleich und wechselt nur y das Vorzeichen, wurde an der x-Achse gespiegelt — und umgekehrt für die y-Achse.',
      quelle: 'Wikipedia: Achsensymmetrie',
      url: 'https://de.wikipedia.org/wiki/Achsensymmetrie',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Buchstaben-Symmetrie
      (rng: Rng) => {
        const symmetric = ['A', 'B', 'C', 'D', 'E', 'H', 'I', 'M', 'O', 'T', 'U', 'V', 'W', 'X', 'Y']
        const asymmetric = ['F', 'G', 'J', 'L', 'N', 'P', 'Q', 'R']
        const letter = pick(rng, [...symmetric, ...asymmetric])
        const yes = symmetric.includes(letter)
        return choicePickTask({
          question: `Ist der Großbuchstabe „${letter}“ in der üblichen Druckschrift achsensymmetrisch (besitzt er eine Spiegelachse)?`,
          choices: ['ja', 'nein'],
          correct: yes ? 'ja' : 'nein',
          solution: yes ? 'ja' : 'nein',
          explanation: yes
            ? `„${letter}“ hat in den meisten Schriftarten eine Spiegelachse, an der die beiden Hälften zusammenpassen.`
            : `„${letter}“ hat in den meisten Schriftarten keine Spiegelachse — eine Hälfte passt nicht zur anderen.`,
          instruction: 'Tippe:',
          dedupeKey: `achsensym-buchstabe:${letter}`,
        })
      },
      // Variant 2: Tippen — Spiegelachse aus Punkt und Bildpunkt bestimmen
      (rng: Rng) => {
        const kind = pick(rng, ['x-axis', 'y-axis', 'y=x'] as const)
        const ax = randInt(rng, 1, 5)
        let ay = randInt(rng, 1, 5)
        let A: [number, number]
        let Ap: [number, number]
        if (kind === 'x-axis') {
          A = [ax, ay]
          Ap = [ax, -ay]
        } else if (kind === 'y-axis') {
          A = [ax, ay]
          Ap = [-ax, ay]
        } else {
          if (ay === ax) ay += 1
          A = [ax, ay]
          Ap = [A[1], A[0]]
        }
        const label = kind === 'x-axis' ? 'x-Achse' : kind === 'y-axis' ? 'y-Achse' : 'y = x'
        return choicePickTask({
          question: `Punkt A${coordPair(A[0], A[1])} wird gespiegelt zu A'${coordPair(Ap[0], Ap[1])}. An welcher Achse bzw. Geraden wurde gespiegelt?`,
          choices: ['x-Achse', 'y-Achse', 'y = x'],
          correct: label,
          solution: label,
          explanation:
            kind === 'x-axis'
              ? `Die x-Koordinate bleibt gleich (${A[0]}), die y-Koordinate wechselt das Vorzeichen (${coordNum(A[1])} → ${coordNum(Ap[1])}) → Spiegelung an der x-Achse.`
              : kind === 'y-axis'
                ? `Die y-Koordinate bleibt gleich (${A[1]}), die x-Koordinate wechselt das Vorzeichen (${coordNum(A[0])} → ${coordNum(Ap[0])}) → Spiegelung an der y-Achse.`
                : `Die x- und die y-Koordinate werden vertauscht ${coordPair(A[0], A[1])} → ${coordPair(Ap[0], Ap[1])} → Spiegelung an der Geraden y = x.`,
          instruction: 'Tippe die Spiegelachse:',
          dedupeKey: `achsensym-achse:${kind}:${A[0]}:${A[1]}`,
        })
      },
      // Variant 3: Portfolio — Spiegelpunkt per Klick setzen
      (rng: Rng) => {
        const mirror = pickMirrorNeu(rng)
        const ax = randInt(rng, 1, 4)
        const ay = randInt(rng, 1, 4)
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
        const points: Array<[number, number]> = [A, [A[0] + 2, A[1]], [A[0] + 1, A[1] + 2]]
        const svg = generateReflectionSvg({
          points,
          mirror,
          showImage: false,
          xRange: [-5, 8],
          yRange: [-5, 8],
          labelVertices: true,
        })
        return coordinateClickTask({
          question: `Spiegle den Punkt A(${A[0]}|${A[1]}) an ${mirrorDescribeNeu(mirror)}. Setze A' im Koordinatensystem.`,
          x: tx,
          y: ty,
          solution: coordPair(tx, ty),
          explanation: `A liegt bei (${A[0]}|${A[1]}). Die Spiegelung an ${mirrorDescribeNeu(mirror)} liefert A' = ${coordPair(tx, ty)}.`,
          xRange: [-5, 8],
          yRange: [-5, 8],
          visualContent: svg,
          instruction: "Tippe auf die Gitterstelle für A':",
        })
      },
      // Variant 4/5: Figur an einer Achse ergänzen (Felder färben)
      symmetryVerticalVariant,
      symmetryHorizontalVariant,
    ),
  }),

  // ---------------------------------------------------------------------
  // 8) Punktsymmetrie — Zeichen & Spiegelpunkt per Klick
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-punktsymmetrie', {
    id: 'lb3-punktsymmetrie__neu',
    title: 'Punktsymmetrie — Zeichen & Spiegelpunkt',
    hint: 'A\' = 2S − A. Punktsymmetrische Zeichen sehen nach 180°-Drehung genauso aus.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Punktsymmetrie', 'Zeichen', 'Drehung', 'Spiegelpunkt'],
    fachwissen: {
      text: 'Ein Zeichen ist punktsymmetrisch, wenn es nach einer Drehung um 180° um seinen Mittelpunkt genauso aussieht wie vorher — Beispiele sind S, Z, N, H, I, O, X sowie die Ziffern 0 und 8. Bei der Punktspiegelung eines Punktes A am Zentrum S gilt A\' = 2S − A: Ein häufiger Fehler ist, den Faktor 2 bei S zu vergessen.',
      quelle: 'Wikipedia: Punktsymmetrie',
      url: 'https://de.wikipedia.org/wiki/Punktsymmetrie',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — punktsymmetrische Zeichen erkennen
      (rng: Rng) => {
        const pointSym = ['S', 'Z', 'N', 'H', 'I', 'O', 'X', '0', '8']
        const nonSym = ['A', 'B', 'C', 'D', 'E', 'F', 'L', 'T', '1', '2', '3']
        const ch = pick(rng, [...pointSym, ...nonSym])
        const yes = pointSym.includes(ch)
        return choicePickTask({
          question: `Ist das Zeichen „${ch}“ in der üblichen Druckschrift punktsymmetrisch (bei 180°-Drehung um die Mitte deckungsgleich mit sich selbst)?`,
          choices: ['ja', 'nein'],
          correct: yes ? 'ja' : 'nein',
          solution: yes ? 'ja' : 'nein',
          explanation: yes
            ? `„${ch}“ sieht nach einer 180°-Drehung um die Mitte genauso aus wie vorher — punktsymmetrisch.`
            : `„${ch}“ sieht nach einer 180°-Drehung um die Mitte anders aus — nicht punktsymmetrisch.`,
          instruction: 'Tippe:',
          dedupeKey: `punktsym-zeichen:${ch}`,
        })
      },
      // Variant 2: MC — Bildpunkt bei Punktspiegelung (typische Fehler als Distraktoren)
      (rng: Rng) => {
        let sx = 1
        let sy = 1
        let ax = 3
        let ay = 3
        let options: string[] = []
        // Zentrum nicht im Ursprung; Distraktoren müssen paarweise verschieden sein.
        for (let attempt = 0; attempt < 200; attempt++) {
          sx = randInt(rng, -2, 3)
          sy = randInt(rng, -2, 3)
          ax = randInt(rng, -4, 5)
          ay = randInt(rng, -4, 5)
          if ((sx === 0 && sy === 0) || (ax === sx && ay === sy)) continue
          options = [
            coordPair(2 * sx - ax, 2 * sy - ay),
            coordPair(sx - ax, sy - ay),
            coordPair(ax, ay),
            coordPair(2 * sx + ax, 2 * sy + ay),
          ]
          if (new Set(options).size === 4) break
        }
        const correct = options[0]!
        const choices = shuffleChoices(rng, options, correct)
        return choicePickTask({
          question: `A${coordPair(ax, ay)} wird am Punkt S${coordPair(sx, sy)} punktgespiegelt. Welcher Punkt ist A'?`,
          choices,
          correct,
          solution: correct,
          explanation: `A' = 2S − A = (2 · ${calcNum(sx)} − ${calcNum(ax)}|2 · ${calcNum(sy)} − ${calcNum(ay)}) = ${correct}.`,
          dedupeKey: `punktsym-mc:${ax}:${ay}:${sx}:${sy}`,
        })
      },
      // Variant 3: Portfolio — Spiegelpunkt per Klick setzen
      (rng: Rng) => {
        const sx = randInt(rng, 0, 2)
        const sy = randInt(rng, 0, 2)
        const axBase = randInt(rng, 1, 4)
        const ayBase = randInt(rng, 1, 4)
        const A: [number, number] = axBase === sx && ayBase === sy ? [axBase + 1, ayBase + 1] : [axBase, ayBase]
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
        return coordinateClickTask({
          question: `Spiegle den Punkt A${coordPair(A[0], A[1])} am Punkt S${coordPair(S[0], S[1])}. Setze A' im Koordinatensystem.`,
          x: tx,
          y: ty,
          solution: coordPair(tx, ty),
          explanation: `A' = 2S − A = (2 · ${sx} − ${A[0]}|2 · ${sy} − ${A[1]}) = ${coordPair(tx, ty)}.`,
          xRange: [-5, 8],
          yRange: [-5, 8],
          visualContent: svg,
          instruction: "Tippe auf die Gitterstelle für A':",
        })
      },
      // Variant 4/5: Figur punktsymmetrisch ergänzen (Felder färben)
      symmetryPointVariantA,
      symmetryPointVariantB,
    ),
  }),

  // ---------------------------------------------------------------------
  // 9) Länge von Strecken — Streckenaddition & Umfang
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-strecken-laenge', {
    id: 'lb3-strecken-laenge__neu',
    title: 'Streckenlänge — Addition & Umfang',
    hint: 'Liegt B zwischen A und C auf einer Geraden, gilt AC = AB + BC. Rechteck: Umfang = 2 · (a + b).',
    pointsPerTask: 10,
    difficulty: 1,
    keywords: ['Strecke', 'Länge', 'Umfang', 'Streckenaddition', 'Rechteck'],
    fachwissen: {
      text: 'Liegen drei Punkte A, B und C in dieser Reihenfolge auf einer Geraden, lässt sich die Gesamtstrecke AC als Summe der Teilstrecken berechnen: AC = AB + BC. Bei einem Rechteck sind gegenüberliegende Seiten gleich lang, daher berechnet sich der Umfang als das Doppelte der Summe beider Seitenlängen: U = 2 · (a + b).',
      quelle: 'Wikipedia: Strecke (Geometrie)',
      url: 'https://de.wikipedia.org/wiki/Strecke_(Geometrie)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen (visuell) — Umfang eines Rechtecks aus zwei Seiten
      (rng: Rng) => {
        const a = randInt(rng, 2, 7)
        const b = randInt(rng, 2, 6)
        const ax = randInt(rng, -1, 3)
        const ay = randInt(rng, -1, 3)
        const svg = generateSegmentsOnGridSvg({
          segments: [
            { a: [ax, ay], b: [ax + a, ay], labelA: 'A', labelB: 'B' },
            { a: [ax, ay], b: [ax, ay + b], labelA: 'A', labelB: 'D' },
          ],
          showSegments: true,
          showLengthLabels: false,
          xRange: [-3, 9],
          yRange: [-3, 9],
        })
        const perimeter = 2 * (a + b)
        return {
          ...valueTask({
            question: 'Die Strecken AB und AD sind zwei Seiten eines Rechtecks ABCD. Berechne den Umfang des Rechtecks. (1 Kästchen = 1 cm)',
            unit: 'cm',
            answerKind: 'integer',
            value: perimeter,
            solution: `${perimeter} cm`,
            explanation: `AB = ${a} cm, AD = ${b} cm. Gegenüberliegende Seiten sind gleich lang: Umfang = 2 · (${a} + ${b}) = ${perimeter} cm.`,
          }),
          visualContent: svg,
        }
      },
      // Variant 2: MC — Streckenaddition auf einer Geraden
      (rng: Rng) => {
        const ab = randInt(rng, 2, 8)
        // AB ≠ BC, damit die Antwortmöglichkeiten nie zusammenfallen.
        let bc = randInt(rng, 2, 8)
        if (bc === ab) bc = ab === 8 ? 7 : ab + 1
        const ac = ab + bc
        if (rng() < 0.5) {
          const correct = String(ac)
          const labeled = shuffleChoices(rng, [ac, ab, bc, ac + 1].map(String), correct)
          return choicePickTask({
            question: `Auf einer Geraden liegen die Punkte A, B und C in dieser Reihenfolge. AB = ${ab} cm, BC = ${bc} cm. Wie lang ist die Strecke AC?`,
            choices: labeled,
            correct,
            solution: `${correct} cm`,
            explanation: `B liegt zwischen A und C: AC = AB + BC = ${ab} + ${bc} = ${ac} cm.`,
            dedupeKey: `streckenlaenge-addition:${ab}:${bc}`,
          })
        }
        const correct = String(bc)
        const labeled = shuffleChoices(rng, [bc, ab, ac, ac + ab].map(String), correct)
        return choicePickTask({
          question: `Auf einer Geraden liegen die Punkte A, B und C in dieser Reihenfolge. AC = ${ac} cm, AB = ${ab} cm. Wie lang ist die Strecke BC?`,
          choices: labeled,
          correct,
          solution: `${correct} cm`,
          explanation: `B liegt zwischen A und C, also ist AC = AB + BC. Daraus folgt BC = AC − AB = ${ac} − ${ab} = ${bc} cm.`,
          dedupeKey: `streckenlaenge-differenz:${ab}:${bc}`,
        })
      },
      // Variant 3: Portfolio — Streckenaddition am Raster
      (rng: Rng) => {
        const ab = randInt(rng, 2, 5)
        const bc = randInt(rng, 2, 5)
        const horizontal = rng() < 0.5
        const ax = randInt(rng, 0, 2)
        const ay = randInt(rng, 0, 2)
        const bx = horizontal ? ax + ab : ax
        const by = horizontal ? ay : ay + ab
        const cx = horizontal ? bx + bc : bx
        const cy = horizontal ? by : by + bc
        const svg = generateSegmentsOnGridSvg({
          segments: [
            { a: [ax, ay], b: [bx, by], labelA: 'A', labelB: 'B' },
            { a: [bx, by], b: [cx, cy], labelA: 'B', labelB: 'C' },
          ],
          showSegments: true,
          showLengthLabels: false,
          xRange: [-2, 9],
          yRange: [-2, 9],
        })
        const total = ab + bc
        return {
          ...valueTask({
            question: 'A, B und C liegen auf einer Geraden. Wie lang ist die Strecke AC insgesamt? (1 Kästchen = 1 cm)',
            unit: 'cm',
            answerKind: 'integer',
            value: total,
            solution: `${total} cm`,
            explanation: `AB = ${ab} cm und BC = ${bc} cm liegen aneinander: AC = ${ab} + ${bc} = ${total} cm.`,
          }),
          visualContent: svg,
        }
      },
      // Variant 4: Lineal — Gesamtstrecke aus zwei Teilstrecken zeichnen
      (rng: Rng) => {
        const ab = randInt(rng, 4, 11) / 2
        const bc = randInt(rng, 4, 11) / 2
        const total = roundTo(ab + bc, 1)
        const angle = pick(rng, [-10, -5, 0, 5, 10])
        return rulerMeasureTask({
          question: `Die Punkte A, B und C liegen in dieser Reihenfolge auf einer Geraden. Es gilt AB = ${formatDe(ab)} cm und BC = ${formatDe(bc)} cm. Zeichne die Strecke AC mit dem Lineal.`,
          mode: 'draw',
          lengthCm: total,
          angle,
          solution: `${formatDe(total)} cm`,
          explanation: `B liegt zwischen A und C, also werden die Teilstrecken addiert: AC = AB + BC = ${formatDe(ab)} cm + ${formatDe(bc)} cm = ${formatDe(total)} cm. Ziehe den Endpunkt am Lineal bis zur Marke ${formatDe(total)} cm.`,
          dedupeKey: `streckenlaenge-lineal-addition:${ab}:${bc}`,
        })
      },
      // Variant 5: Lineal — eine Strecke ausmessen (Teilstrecke einer Wegstrecke)
      (rng: Rng) => {
        const lenMm = randInt(rng, 25, 118)
        const len = lenMm / 10
        const angle = pick(rng, [-12, -6, 0, 6, 12])
        const name = pick(rng, ['AB', 'PQ', 'RS', 'MN'])
        return rulerMeasureTask({
          question: `Miss die Länge der Strecke ${name} mit dem Lineal auf Millimeter genau.`,
          mode: 'measure',
          lengthCm: len,
          angle,
          solution: `${formatDe(len)} cm`,
          explanation: `Lege die 0-cm-Marke des Lineals genau an den Anfangspunkt der Strecke ${name}. Am Endpunkt liest du ${formatDe(len)} cm ab. Teillängen in derselben Einheit kannst du anschließend addieren.`,
          dedupeKey: `streckenlaenge-lineal-messen:${lenMm}:${name}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 10) Mittelpunkt einer Strecke — Rückwärts & Erkennen
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-strecken-mittelpunkt', {
    id: 'lb3-strecken-mittelpunkt__neu',
    title: 'Mittelpunkt — Rückwärts & Erkennen',
    hint: 'Rückwärts: B = 2M − A (wenn M der Mittelpunkt von AB ist).',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Mittelpunkt', 'Strecke', 'rückwärts', 'halbieren'],
    fachwissen: {
      text: 'Kennt man den Mittelpunkt M einer Strecke AB und einen der beiden Endpunkte, lässt sich der andere Endpunkt berechnen: Aus M = (A + B) : 2 folgt B = 2M − A. So kann man die Mittelpunktformel auch „rückwärts" verwenden.',
      quelle: 'Wikipedia: Mittelpunkt',
      url: 'https://de.wikipedia.org/wiki/Mittelpunkt',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — rückwärts: M und A gegeben, B gesucht
      (rng: Rng) => {
        const ax = randInt(rng, -3, 4)
        const ay = randInt(rng, -3, 4)
        const mx = randInt(rng, -2, 5)
        const my = randInt(rng, -2, 5)
        const bx = 2 * mx - ax
        const by = 2 * my - ay
        const accepted = pairAnswerAcceptedNeu(bx, by)
        return textTask({
          question: `Der Mittelpunkt der Strecke AB ist M${coordPair(mx, my)}. Punkt A liegt bei ${coordPair(ax, ay)}. Wie lautet Punkt B? Gib x; y an.`,
          accepted,
          solution: `${coordNum(bx)}; ${coordNum(by)}`,
          explanation: `Da M der Mittelpunkt ist, gilt M = (A + B) : 2, also B = 2M − A = (2 · ${calcNum(mx)} − ${calcNum(ax)}|2 · ${calcNum(my)} − ${calcNum(ay)}) = ${coordPair(bx, by)}.`,
        })
      },
      // Variant 2: MC — Mittelpunkt unter Distraktoren erkennen
      (rng: Rng) => {
        const ax = randInt(rng, -2, 3)
        const ay = randInt(rng, -2, 3)
        const bx = ax + 2 * randInt(rng, 1, 3)
        const by = ay + 2 * randInt(rng, -2, 2)
        const mx = (ax + bx) / 2
        const my = (ay + by) / 2
        const correct = coordPair(mx, my)
        const wrong1 = coordPair(mx, my + 1)
        const wrong2 = coordPair(ax, ay)
        const wrong3 = coordPair(bx, by)
        const choices = shuffleChoices(rng, [correct, wrong1, wrong2, wrong3], correct)
        return choicePickTask({
          question: `A${coordPair(ax, ay)} und B${coordPair(bx, by)} sind die Endpunkte einer Strecke. Welcher Punkt ist der Mittelpunkt von AB?`,
          choices,
          correct,
          solution: correct,
          explanation: `M = ((${calcNum(ax)} + ${calcNum(bx)}) : 2|(${calcNum(ay)} + ${calcNum(by)}) : 2) = ${correct}.`,
          dedupeKey: `mittelpunkt-mc:${ax}:${ay}:${bx}:${by}`,
        })
      },
      // Variant 3: Portfolio — Mittelpunkt per Klick setzen
      (rng: Rng) => {
        const halfDx = randInt(rng, 1, 3)
        const halfDy = rng() < 0.25 ? 0 : randInt(rng, 1, 2)
        const ax = randInt(rng, -2, 6 - 2 * halfDx)
        const ay = randInt(rng, -2, 6 - 2 * halfDy)
        const bx = ax + 2 * halfDx
        const by = ay + 2 * halfDy
        const mx = (ax + bx) / 2
        const my = (ay + by) / 2
        const svg = generateSegmentsOnGridSvg({
          segments: [{ a: [ax, ay], b: [bx, by], labelA: 'A', labelB: 'B' }],
          showSegments: true,
          showLengthLabels: false,
          xRange: [-3, 8],
          yRange: [-3, 8],
        })
        return coordinateClickTask({
          question: `Die Strecke AB hat die Endpunkte A${coordPair(ax, ay)} und B${coordPair(bx, by)}. Setze ihren Mittelpunkt M im Koordinatensystem.`,
          x: mx,
          y: my,
          solution: coordPair(mx, my),
          explanation: `M = ((${calcNum(ax)} + ${calcNum(bx)}) : 2|(${calcNum(ay)} + ${calcNum(by)}) : 2) = ${coordPair(mx, my)}.`,
          xRange: [-3, 8],
          yRange: [-3, 8],
          visualContent: svg,
          instruction: 'Tippe auf die Gitterstelle für M:',
        })
      },
      // Variant 4: Lineal — Halbe Strecke bis zum Mittelpunkt zeichnen
      (rng: Rng) => {
        const half = randInt(rng, 6, 55) / 10
        const whole = roundTo(2 * half, 1)
        const part = pick(rng, ['AM', 'MB'] as const)
        const angle = pick(rng, [-12, -6, 0, 6, 12])
        return rulerMeasureTask({
          question: `Die Strecke AB ist ${formatDe(whole)} cm lang. M ist der Mittelpunkt von AB. Zeichne die Strecke ${part} mit dem Lineal.`,
          mode: 'draw',
          lengthCm: half,
          angle,
          solution: `${formatDe(half)} cm`,
          explanation: `Der Mittelpunkt M teilt AB in zwei gleich lange Teile: ${part} = AB : 2 = ${formatDe(whole)} cm : 2 = ${formatDe(half)} cm. Ziehe den Endpunkt am Lineal bis zur Marke ${formatDe(half)} cm.`,
          dedupeKey: `mittelpunkt-lineal-halbe:${whole}:${part}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 11) Strecke, Gerade und Halbgerade — Alltag & Eigenschaften
  // ---------------------------------------------------------------------
  asNeuTopic('lb3-strecken-bezeichnung', {
    id: 'lb3-strecken-bezeichnung__neu',
    title: 'Strecke, Gerade & Halbgerade im Alltag',
    hint: 'Strecke: 2 Endpunkte. Halbgerade: 1 Endpunkt. Gerade: kein Endpunkt.',
    pointsPerTask: 10,
    difficulty: 1,
    keywords: ['Strecke', 'Halbgerade', 'Gerade', 'Alltag', 'Endpunkte'],
    fachwissen: {
      text: 'Im Alltag lassen sich viele Linien den geometrischen Grundfiguren zuordnen: Ein Lichtstrahl, der an einer Quelle beginnt und sich unendlich weit ausbreitet, entspricht einer Halbgeraden. Eine feste Verbindung zwischen zwei Orten entspricht einer Strecke mit zwei Endpunkten, während eine gedanklich unendlich verlängerte gerade Linie ohne Anfang und Ende einer Geraden entspricht.',
      quelle: 'Wikipedia: Gerade',
      url: 'https://de.wikipedia.org/wiki/Gerade',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Alltagsbeispiel klassifizieren
      (rng: Rng) => {
        const items = [
          { desc: 'ein Laserstrahl, der an einem Gerät beginnt und gedanklich unendlich weit geht', kind: 'halbgerade' as const },
          { desc: 'eine gedanklich unendlich verlängerte, gerade Straße ohne Anfang und Ende', kind: 'gerade' as const },
          { desc: 'die Luftlinie zwischen zwei bestimmten Bahnhöfen', kind: 'strecke' as const },
          { desc: 'ein Lichtstrahl, der an einer Taschenlampe beginnt (als dünner Strahl gedacht)', kind: 'halbgerade' as const },
          { desc: 'die Luftlinie zwischen deinem Zuhause und der Schule', kind: 'strecke' as const },
          { desc: 'ein Sonnenstrahl, der an der Sonne beginnt und gedanklich unendlich weit geht', kind: 'halbgerade' as const },
        ]
        const item = pick(rng, items)
        const solution = LINE_KIND_LABEL_NEU[item.kind]
        const desc = `${item.desc.charAt(0).toUpperCase()}${item.desc.slice(1)}`
        return choicePickTask({
          question: `Welche Figur passt zu dieser Beschreibung: ${item.desc}?`,
          choices: ['Strecke', 'Halbgerade', 'Gerade'],
          correct: solution,
          solution,
          explanation: `${desc} hat ${
            item.kind === 'strecke'
              ? 'zwei feste Endpunkte (begrenzt)'
              : item.kind === 'halbgerade'
                ? 'einen festen Anfangspunkt, geht aber unbegrenzt weiter'
                : 'kein Ende in beide Richtungen'
          } — das ist eine ${solution}${item.kind === 'halbgerade' ? ' (auch Strahl genannt)' : ''}.`,
          instruction: 'Tippe die passende Bezeichnung:',
          dedupeKey: `streckenbez-alltag:${item.kind}:${item.desc}`,
        })
      },
      // Variant 2: MC — Anzahl der Endpunkte
      (rng: Rng) => {
        const kind = pick(rng, ['strecke', 'halbgerade', 'gerade'] as const)
        const correctCount = kind === 'strecke' ? 2 : kind === 'halbgerade' ? 1 : 0
        return choicePickTask({
          question: `Wie viele Endpunkte hat eine ${LINE_KIND_LABEL_NEU[kind]}?`,
          choices: ['0', '1', '2'],
          correct: String(correctCount),
          solution: String(correctCount),
          explanation: `Eine ${LINE_KIND_LABEL_NEU[kind]} hat ${correctCount} Endpunkt${correctCount === 1 ? '' : 'e'}${
            correctCount === 0 ? ' (sie läuft nach beiden Seiten unbegrenzt weiter)' : ''
          }.`,
          instruction: 'Tippe die richtige Anzahl:',
          dedupeKey: `streckenbez-endpunkte:${kind}`,
        })
      },
      // Variant 3: Tippen — endliche Länge ja/nein
      (rng: Rng) => {
        const kind = pick(rng, ['strecke', 'halbgerade', 'gerade'] as const)
        const yes = kind === 'strecke'
        return choicePickTask({
          question: `Hat eine ${LINE_KIND_LABEL_NEU[kind]} eine endliche (messbare) Länge?`,
          choices: ['ja', 'nein'],
          correct: yes ? 'ja' : 'nein',
          solution: yes ? 'ja' : 'nein',
          explanation: yes
            ? 'Eine Strecke ist durch zwei Endpunkte begrenzt, also hat sie eine endliche Länge.'
            : `Eine ${LINE_KIND_LABEL_NEU[kind]} geht ${
                kind === 'halbgerade' ? 'von ihrem Anfangspunkt aus' : 'nach beiden Seiten'
              } unbegrenzt weiter, daher hat sie keine endliche Länge.`,
          instruction: 'Tippe:',
          dedupeKey: `streckenbez-laenge:${kind}`,
        })
      },
      // Variant 4: Lineal — Strecke mit vorgegebener Länge zeichnen (nur Strecken haben eine Länge)
      (rng: Rng) => {
        const len = randInt(rng, 20, 100) / 10
        const name = pick(rng, ['ST', 'KL', 'UV', 'XY'])
        const angle = pick(rng, [-12, -6, 0, 6, 12])
        return rulerMeasureTask({
          question: `Zeichne die Strecke ${name} mit der Länge ${formatDe(len)} cm. Beginne am Punkt ${name[0]} und ziehe den Endpunkt ${name[1]} am Lineal auf die richtige Länge.`,
          mode: 'draw',
          lengthCm: len,
          angle,
          solution: `${formatDe(len)} cm`,
          explanation: `Eine Strecke hat zwei Endpunkte und damit eine feste Länge. ${name[0]} liegt auf der 0-cm-Marke, ${name[1]} kommt auf die Marke ${formatDe(len)} cm.`,
          dedupeKey: `streckenbez-lineal-zeichnen:${len}:${name}`,
        })
      },
      // Variant 5: Lineal — Länge einer Strecke messen
      (rng: Rng) => {
        const lenMm = randInt(rng, 30, 112)
        const len = lenMm / 10
        const name = pick(rng, ['EF', 'GH', 'JK', 'CD'])
        const angle = pick(rng, [-12, -6, 0, 6, 12])
        return rulerMeasureTask({
          question: `Die Strecke ${name} ist durch ihre beiden Endpunkte ${name[0]} und ${name[1]} begrenzt. Wie lang ist sie? Miss mit dem Lineal.`,
          mode: 'measure',
          lengthCm: len,
          angle,
          solution: `${formatDe(len)} cm`,
          explanation: `Weil ${name} eine Strecke mit zwei Endpunkten ist, lässt sich ihre Länge messen: Die 0-cm-Marke liegt bei ${name[0]}, bei ${name[1]} liest du ${formatDe(len)} cm ab. Bei einer Geraden oder Halbgeraden gäbe es keine feste Länge.`,
          dedupeKey: `streckenbez-lineal-messen:${lenMm}:${name}`,
        })
      },
    ),
  }),
]

/** L-Form-Maße (Eckaussparung), lokale Kopie für die Neu-Bank. */
const randomLDimsNeu = (rng: Rng) => {
  const outerWidth = randInt(rng, 6, 14)
  const outerHeight = randInt(rng, 5, 12)
  const cutWidth = randInt(rng, 2, outerWidth - 2)
  const cutHeight = randInt(rng, 2, outerHeight - 2)
  const stemWidth = outerWidth - cutWidth
  const footHeight = outerHeight - cutHeight
  const area = outerWidth * outerHeight - cutWidth * cutHeight
  // Umfang = Umfang des großen Rechtecks (Eckaussparung ersetzt Außen- durch Innenkanten)
  const perimeter = 2 * (outerWidth + outerHeight)
  return { outerWidth, outerHeight, cutWidth, cutHeight, stemWidth, footHeight, area, perimeter }
}

/** U-Form-Maße (Kerbe oben mittig), lokale Kopie für die Neu-Bank. */
const randomUDimsNeu = (rng: Rng) => {
  const outerWidth = pick(rng, [8, 10, 12, 14])
  const outerHeight = randInt(rng, 5, 10)
  const notchWidth = pick(rng, [2, 4].filter((n) => n <= outerWidth / 2 - 1))
  const notchHeight = randInt(rng, 2, outerHeight - 2)
  const side = (outerWidth - notchWidth) / 2
  const area = outerWidth * outerHeight - notchWidth * notchHeight
  // Kerbe in der Mitte: zwei zusätzliche Innenkanten (notchHeight) kommen zur Außenkontur hinzu
  const perimeter = 2 * (outerWidth + outerHeight) + 2 * notchHeight
  return { outerWidth, outerHeight, notchWidth, notchHeight, side, area, perimeter }
}

/** Maße eines L-förmigen Quader-Körpers, lokale Kopie für die Neu-Bank. */
const randomCompositeCuboidNeu = (rng: Rng) => {
  const length = randInt(rng, 6, 12)
  const width = randInt(rng, 4, 10)
  const height = randInt(rng, 2, 6)
  const cutLength = randInt(rng, 2, length - 2)
  const cutWidth = randInt(rng, 2, width - 2)
  const stemLength = length - cutLength
  const footWidth = width - cutWidth
  const volume = (length * width - cutLength * cutWidth) * height
  const v1 = stemLength * width * height
  const v2 = cutLength * footWidth * height
  return { length, width, height, cutLength, cutWidth, stemLength, footWidth, volume, v1, v2 }
}

/** LB4 — Rechtecke / Quader */
export const math5NeuLb4: Topic[] = [
  // ---------------------------------------------------------------------
  // 1) Umfang Rechteck/Quadrat — fehlende Seite & Vergleich
  // ---------------------------------------------------------------------
  asNeuTopic('lb4-umfang-rechteck', {
    id: 'lb4-umfang-rechteck__neu',
    title: 'Umfang von Rechteck & Quadrat — Seite gesucht & Vergleich',
    hint: 'Fehlende Seite: Halbiere den Umfang, dann ziehe die bekannte Seite ab: b = U : 2 − a.',
    pointsPerTask: 10,
    difficulty: 1,
    keywords: ['Umfang', 'Rechteck', 'Quadrat', 'Seite berechnen', 'rückwärts rechnen', 'vergleichen'],
    fachwissen: {
      text: 'Sind Umfang und eine Seite eines Rechtecks bekannt, lässt sich die zweite Seite berechnen: Aus U = 2 · (a + b) folgt b = U : 2 − a. Zwei Rechtecke mit unterschiedlichen Seitenlängen können trotzdem denselben Umfang haben — entscheidend ist allein die Summe a + b.',
        quelle: 'Wikipedia: Umfang (Geometrie)',
      url: 'https://de.wikipedia.org/wiki/Umfang_(Geometrie)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — fehlende Seite aus Umfang
      (rng: Rng) => {
        const a = randInt(rng, 3, 16)
        const b = randInt(rng, 3, 16)
        const u = 2 * (a + b)
        return valueTask({
          question: `Ein Rechteck hat den Umfang ${u} cm. Eine Seite ist ${a} cm lang. Wie lang ist die andere Seite?`,
          unit: 'cm',
          answerKind: 'integer',
          value: b,
          solution: `${b} cm`,
          explanation: `b = U : 2 − a = ${u} : 2 − ${a} = ${u / 2} − ${a} = ${b} cm.`,
          dedupeKey: `umfang-rueckwaerts:${a}-${b}`,
        })
      },
      // Variant 2: MC — welches Rechteck hat den größeren Umfang?
      (rng: Rng) => {
        const a1 = randInt(rng, 3, 14)
        const b1 = randInt(rng, 3, 14)
        const a2 = randInt(rng, 3, 14)
        const b2 = randInt(rng, 3, 14)
        const u1 = 2 * (a1 + b1)
        const u2 = 2 * (a2 + b2)
        const correct = u1 > u2 ? 'Rechteck A' : u1 < u2 ? 'Rechteck B' : 'gleich groß'
        const choices = shuffleChoices(rng, ['Rechteck A', 'Rechteck B', 'gleich groß'], correct)
        return choicePickTask({
          question: `Rechteck A ist ${a1} cm × ${b1} cm, Rechteck B ist ${a2} cm × ${b2} cm groß. Welches Rechteck hat den größeren Umfang?`,
          choices,
          correct,
          solution: correct,
          explanation: `U(A) = 2 · (${a1} + ${b1}) = ${u1} cm, U(B) = 2 · (${a2} + ${b2}) = ${u2} cm. ${
            u1 === u2 ? 'Beide Umfänge sind gleich groß.' : u1 > u2 ? 'Rechteck A hat den größeren Umfang.' : 'Rechteck B hat den größeren Umfang.'
          }`,
          instruction: 'Tippe die richtige Antwort:',
          dedupeKey: `umfang-vergleich:${a1}-${b1}-${a2}-${b2}`,
        })
      },
      // Variant 3: Portfolio — fehlende Seite am abgebildeten Rechteck
      (rng: Rng) => {
        const a = randInt(rng, 3, 14)
        const b = randInt(rng, 3, 14)
        const u = 2 * (a + b)
        const svg = generateRectangleSvg({ widthLabel: `${a} m`, heightLabel: '?' })
        return valueTask({
          question: `Das abgebildete Rechteck hat den Umfang ${u} m. Wie lang ist die fehlende Seite?`,
          unit: 'm',
          answerKind: 'integer',
          value: b,
          solution: `${b} m`,
          explanation: `b = U : 2 − a = ${u} : 2 − ${a} = ${b} m.`,
          visualContent: svg,
          dedupeKey: `umfang-fehlende-seite:${a}-${b}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 2) Fläche Rechteck/Quadrat — fehlende Seite & Flächeneinheiten
  // ---------------------------------------------------------------------
  asNeuTopic('lb4-flaeche-rechteck', {
    id: 'lb4-flaeche-rechteck__neu',
    title: 'Flächeninhalt von Rechteck & Quadrat — Seite gesucht & Einheiten',
    hint: 'Fehlende Seite: b = A : a. Überlege zuerst, welche Flächeneinheit zur Größe des Gegenstands passt.',
    pointsPerTask: 10,
    difficulty: 1,
    keywords: ['Fläche', 'Rechteck', 'Quadrat', 'Seite berechnen', 'Flächeneinheiten', 'Größenvorstellung'],
    fachwissen: {
      text: 'Sind der Flächeninhalt eines Rechtecks und eine Seite bekannt, lässt sich die zweite Seite berechnen: Aus A = a · b folgt b = A : a. Flächeneinheiten hängen von den Längeneinheiten ab: 1 m² = 10 000 cm², da beide Seiten umgerechnet werden (100 cm · 100 cm). Für eine passende Größenvorstellung wählt man die Einheit, die zur tatsächlichen Größe der Fläche passt.',
      quelle: 'Wikipedia: Flächeninhalt',
      url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — fehlende Seite aus Flächeninhalt
      (rng: Rng) => {
        const a = randInt(rng, 2, 12)
        const b = randInt(rng, 2, 12)
        const area = a * b
        return valueTask({
          question: `Ein Rechteck hat den Flächeninhalt ${area} cm². Eine Seite ist ${a} cm lang. Wie lang ist die andere Seite?`,
          unit: 'cm',
          answerKind: 'integer',
          value: b,
          solution: `${b} cm`,
          explanation: `b = A : a = ${area} : ${a} = ${b} cm.`,
          dedupeKey: `flaeche-rueckwaerts:${a}-${b}`,
        })
      },
      // Variant 2: MC — passende Flächeneinheit schätzen
      (rng: Rng) => {
        const items = [
          { name: 'eine Briefmarke', unit: 'cm²' },
          { name: 'ein Smartphone-Display', unit: 'cm²' },
          { name: 'einen Fingernagel', unit: 'cm²' },
          { name: 'eine Schulheft-Seite', unit: 'dm²' },
          { name: 'eine Tischplatte (Schreibtisch)', unit: 'dm²' },
          { name: 'einen Klassenzimmerboden', unit: 'm²' },
          { name: 'ein Fußballfeld', unit: 'm²' },
          { name: 'einen Schulhof', unit: 'm²' },
        ] as const
        const item = pick(rng, items)
        const choices = shuffleChoices(rng, ['mm²', 'cm²', 'dm²', 'm²'], item.unit)
        return choicePickTask({
          question: `Welche Flächeneinheit passt am besten zu: ${item.name}?`,
          choices,
          correct: item.unit,
          solution: item.unit,
          explanation: `${item.name} hat in der Realität eine Fläche in der Größenordnung von ${item.unit}.`,
          instruction: 'Tippe die passende Einheit:',
          dedupeKey: `flaeche-einheit:${item.name}`,
        })
      },
      // Variant 3: Portfolio — fehlende Seite am abgebildeten Rechteck
      (rng: Rng) => {
        const a = randInt(rng, 3, 14)
        const b = randInt(rng, 3, 14)
        const area = a * b
        const svg = generateRectangleSvg({ widthLabel: `${a} cm`, heightLabel: '?' })
        return valueTask({
          question: `Das abgebildete Rechteck hat den Flächeninhalt ${area} cm². Wie lang ist die fehlende Seite?`,
          unit: 'cm',
          answerKind: 'integer',
          value: b,
          solution: `${b} cm`,
          explanation: `b = A : a = ${area} : ${a} = ${b} cm.`,
          visualContent: svg,
          dedupeKey: `flaeche-fehlende-seite:${a}-${b}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 3) Volumen Quader/Würfel — fehlende Kante & Volumeneinheiten
  // ---------------------------------------------------------------------
  asNeuTopic('lb4-volumen-quader', {
    id: 'lb4-volumen-quader__neu',
    title: 'Volumen von Quader & Würfel — Kante gesucht & Einheiten',
    hint: 'Fehlende Kante: c = V : (a · b). Merke: 1 dm³ entspricht genau 1 Liter.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Volumen', 'Quader', 'Würfel', 'Kante berechnen', 'Rauminhalt', 'Liter', 'Volumeneinheiten'],
    fachwissen: {
      text: 'Sind das Volumen eines Quaders und zwei Kanten bekannt, lässt sich die dritte Kante berechnen: Aus V = a · b · c folgt c = V : (a · b). In Alltagseinheiten gilt: 1 dm³ entspricht genau 1 Liter, daher wird das Fassungsvermögen von Gefäßen oft in Litern statt in cm³ oder dm³ angegeben.',
      quelle: 'Wikipedia: Volumen',
      url: 'https://de.wikipedia.org/wiki/Volumen',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — fehlende Kante aus Volumen
      (rng: Rng) => {
        const a = randInt(rng, 2, 10)
        const b = randInt(rng, 2, 10)
        const c = randInt(rng, 2, 10)
        const v = a * b * c
        return valueTask({
          question: `Ein Quader hat das Volumen ${v} cm³. Die Grundfläche ist ${a} cm × ${b} cm groß. Wie hoch ist der Quader?`,
          unit: 'cm',
          answerKind: 'integer',
          value: c,
          solution: `${c} cm`,
          explanation: `c = V : (a · b) = ${v} : (${a} · ${b}) = ${v} : ${a * b} = ${c} cm.`,
          dedupeKey: `volumen-rueckwaerts:${a}-${b}-${c}`,
        })
      },
      // Variant 2: MC — passende Volumeneinheit schätzen
      (rng: Rng) => {
        const items = [
          { name: 'eine Trinkflasche', unit: 'dm³' },
          { name: 'einen Schuhkarton', unit: 'dm³' },
          { name: 'einen Spielwürfel', unit: 'cm³' },
          { name: 'einen Zuckerwürfel', unit: 'cm³' },
          { name: 'ein Schwimmbecken', unit: 'm³' },
          { name: 'einen Wassertank im Garten', unit: 'm³' },
        ] as const
        const item = pick(rng, items)
        const choices = shuffleChoices(rng, ['mm³', 'cm³', 'dm³', 'm³'], item.unit)
        return choicePickTask({
          question: `Welche Volumeneinheit passt am besten zu: ${item.name}?`,
          choices,
          correct: item.unit,
          solution: item.unit,
          explanation: `${item.name} hat typischerweise ein Volumen in der Größenordnung von ${item.unit}${
            item.unit === 'dm³' ? ' (1 dm³ = 1 Liter)' : ''
          }.`,
          instruction: 'Tippe die passende Einheit:',
          dedupeKey: `volumen-einheit:${item.name}`,
        })
      },
      // Variant 3: Portfolio — fehlende Kante am abgebildeten Quader
      (rng: Rng) => {
        const a = randInt(rng, 3, 10)
        const b = randInt(rng, 3, 10)
        const c = randInt(rng, 3, 10)
        const v = a * b * c
        const svg = generateCuboidSvg({ lengthLabel: `${a} cm`, widthLabel: `${b} cm`, heightLabel: '?' })
        return valueTask({
          question: `Der abgebildete Quader hat das Volumen ${v} cm³. Wie hoch ist er?`,
          unit: 'cm',
          answerKind: 'integer',
          value: c,
          solution: `${c} cm`,
          explanation: `c = V : (a · b) = ${v} : (${a} · ${b}) = ${c} cm.`,
          visualContent: svg,
          dedupeKey: `volumen-quader-fehlend:${a}-${b}-${c}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 4) Oberfläche Quader — Teilflächen & Materialbedarf
  // ---------------------------------------------------------------------
  asNeuTopic('lb4-oberflaeche-quader', {
    id: 'lb4-oberflaeche-quader__neu',
    title: 'Oberfläche von Quadern — Teilflächen & Materialbedarf',
    hint: 'Die Oberfläche besteht aus drei Flächenpaaren: O = 2 · (a·b + a·c + b·c).',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Oberfläche', 'Quader', 'Teilflächen', 'Materialbedarf', 'Netz'],
    fachwissen: {
      text: 'Die Oberfläche eines Quaders lässt sich über sein Netz verstehen: Schneidet man den Quader entlang der Kanten auf und klappt ihn flach, entstehen 6 Rechtecke — je zwei gleich große Paare (Boden/Deckel, Vorderseite/Rückseite, linke/rechte Seite). Bei einem Quader mit drei unterschiedlich langen Kanten sind das drei verschieden große Flächenpaare; ihre Summe ergibt die Oberfläche.',
      quelle: 'Wikipedia: Quader',
      url: 'https://de.wikipedia.org/wiki/Quader',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Oberfläche aus den drei Teilflächen
      (rng: Rng) => {
        const a = randInt(rng, 2, 10)
        const b = randInt(rng, 2, 10)
        const c = randInt(rng, 2, 10)
        const fab = a * b
        const fac = a * c
        const fbc = b * c
        const value = 2 * (fab + fac + fbc)
        return valueTask({
          question: `Ein Quader hat drei unterschiedlich große Seitenflächen: ${fab} cm², ${fac} cm² und ${fbc} cm². Berechne die Oberfläche.`,
          unit: 'cm²',
          answerKind: 'integer',
          value,
          solution: `${value} cm²`,
          explanation: `Jede der drei Flächen kommt zweimal vor: O = 2 · (${fab} + ${fac} + ${fbc}) = 2 · ${fab + fac + fbc} = ${value} cm².`,
          dedupeKey: `oberflaeche-teilflaechen:${a}-${b}-${c}`,
        })
      },
      // Variant 2: MC — welche Fläche gehört NICHT zur Oberfläche?
      (rng: Rng) => {
        const a = randInt(rng, 2, 10)
        const b = randInt(rng, 2, 10)
        const c = randInt(rng, 2, 10)
        const correctFaces = [a * b, a * c, b * c]
        let decoy = a * a
        while (correctFaces.includes(decoy)) decoy += 1
        const choiceValues = [...correctFaces, decoy]
        const choices = shuffleChoices(
          rng,
          choiceValues.map((v) => `${v} cm²`),
          `${decoy} cm²`,
        )
        return choicePickTask({
          question: `Ein Quader ist ${a} cm × ${b} cm × ${c} cm groß. Welche der folgenden Flächen gehört NICHT zu seiner Oberfläche?`,
          choices,
          correct: `${decoy} cm²`,
          solution: `${decoy} cm²`,
          explanation: `Die drei tatsächlichen Seitenflächen sind ${a}·${b} = ${a * b} cm², ${a}·${c} = ${a * c} cm² und ${b}·${c} = ${b * c} cm² (jede davon zweimal vorhanden). ${decoy} cm² gehört nicht dazu.`,
          instruction: 'Tippe die Fläche, die nicht dazugehört:',
          dedupeKey: `oberflaeche-mc-decoy:${a}-${b}-${c}-${decoy}`,
        })
      },
      // Variant 3: Portfolio — Materialbedarf am abgebildeten Quader
      (rng: Rng) => {
        const a = randInt(rng, 3, 10)
        const b = randInt(rng, 3, 10)
        const c = randInt(rng, 3, 10)
        const value = 2 * (a * b + a * c + b * c)
        const svg = generateCuboidSvg({ lengthLabel: `${a} cm`, widthLabel: `${b} cm`, heightLabel: `${c} cm` })
        return valueTask({
          question: 'Der abgebildete Quader (Verpackungskarton) soll komplett mit Folie beklebt werden. Wie viel cm² Folie wird benötigt?',
          unit: 'cm²',
          answerKind: 'integer',
          value,
          solution: `${value} cm²`,
          explanation: `O = 2 · (a·b + a·c + b·c) = 2 · (${a * b} + ${a * c} + ${b * c}) = ${value} cm².`,
          visualContent: svg,
          dedupeKey: `oberflaeche-folie:${a}-${b}-${c}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 5) Zusammengesetzte Flächen — U-Form & Zerlegungs-Formel
  // ---------------------------------------------------------------------
  asNeuTopic('lb4-flaeche-zusammengesetzt', {
    id: 'lb4-flaeche-zusammengesetzt__neu',
    title: 'Zusammengesetzte Flächen — U-Form & Zerlegung erkennen',
    hint: 'Zerlege in zwei Rechtecke oder ziehe eine Aussparung vom großen Rechteck ab — beide Wege führen zum gleichen Ergebnis.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['zusammengesetzte Fläche', 'L-Form', 'U-Form', 'zerlegen', 'Aussparung'],
    fachwissen: {
      text: 'Zusammengesetzte Flächen berechnet man, indem man die Figur in bekannte Teilflächen zerlegt und deren Flächeninhalte addiert — oder indem man von einem großen Rechteck eine Aussparung abzieht. Bei einer U-Form (Kerbe in der Mitte) gilt dasselbe Prinzip wie bei der L-Form: A = A_groß − A_Aussparung.',
      quelle: 'Wikipedia: Flächeninhalt',
      url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — U-Form als Text
      (rng: Rng) => {
        const d = randomUDimsNeu(rng)
        return valueTask({
          question: `Eine U-förmige Fläche entsteht aus einem Rechteck ${d.outerWidth} m × ${d.outerHeight} m, aus dem oben in der Mitte ein Rechteck ${d.notchWidth} m × ${d.notchHeight} m herausgeschnitten wird. Berechne die verbleibende Fläche.`,
          unit: 'm²',
          answerKind: 'integer',
          value: d.area,
          solution: `${d.area} m²`,
          explanation: `A = ${d.outerWidth}·${d.outerHeight} − ${d.notchWidth}·${d.notchHeight} = ${d.outerWidth * d.outerHeight} − ${d.notchWidth * d.notchHeight} = ${d.area} m².`,
          dedupeKey: `flaeche-u-text:${d.outerWidth}-${d.outerHeight}-${d.notchWidth}-${d.notchHeight}`,
        })
      },
      // Variant 2: MC — richtige Rechnung für die L-Form auswählen
      (rng: Rng) => {
        const d = randomLDimsNeu(rng)
        const correct = `${d.outerWidth}·${d.outerHeight} − ${d.cutWidth}·${d.cutHeight}`
        const wrong1 = `${d.outerWidth}·${d.outerHeight} + ${d.cutWidth}·${d.cutHeight}`
        const wrong2 = `${d.stemWidth}·${d.footHeight} + ${d.cutWidth}·${d.outerHeight}`
        const wrong3 = `${d.outerWidth}·${d.cutHeight} − ${d.cutWidth}·${d.outerHeight}`
        const choices = shuffleChoices(rng, [correct, wrong1, wrong2, wrong3], correct)
        return choicePickTask({
          question: `Eine L-Form entsteht aus einem Rechteck ${d.outerWidth} m × ${d.outerHeight} m, aus dem oben rechts ein Rechteck ${d.cutWidth} m × ${d.cutHeight} m ausgeschnitten wird. Welche Rechnung liefert den Flächeninhalt der L-Form?`,
          choices,
          correct,
          solution: correct,
          explanation: `Großes Rechteck minus Aussparung: A = ${d.outerWidth}·${d.outerHeight} − ${d.cutWidth}·${d.cutHeight} = ${d.area} m².`,
          instruction: 'Tippe die richtige Rechnung:',
          dedupeKey: `flaeche-mc-formel:${d.outerWidth}-${d.outerHeight}-${d.cutWidth}-${d.cutHeight}`,
        })
      },
      // Variant 3: Portfolio — L-Form mit Innenkanten beschriftet (Subtraktionsweg)
      (rng: Rng) => {
        const d = randomLDimsNeu(rng)
        const svg = generateLShapeSvg({
          outerWidth: d.outerWidth,
          outerHeight: d.outerHeight,
          cutWidth: d.cutWidth,
          cutHeight: d.cutHeight,
          bottomLabel: `${d.outerWidth} m`,
          leftLabel: `${d.outerHeight} m`,
          innerHorizontalLabel: `${d.cutWidth} m`,
          innerVerticalLabel: `${d.cutHeight} m`,
        })
        return valueTask({
          question: 'Berechne den Flächeninhalt der abgebildeten Figur.',
          unit: 'm²',
          answerKind: 'integer',
          value: d.area,
          solution: `${d.area} m²`,
          explanation: `A = ${d.outerWidth}·${d.outerHeight} − ${d.cutWidth}·${d.cutHeight} = ${d.outerWidth * d.outerHeight} − ${d.cutWidth * d.cutHeight} = ${d.area} m².`,
          visualContent: svg,
          dedupeKey: `flaeche-l-subtract-visual:${d.outerWidth}-${d.outerHeight}-${d.cutWidth}-${d.cutHeight}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 6) Zusammengesetzte Flächen — Umfang bei U-Form & Eck- vs. Mittenaussparung
  // ---------------------------------------------------------------------
  asNeuTopic('lb4-umfang-zusammengesetzt', {
    id: 'lb4-umfang-zusammengesetzt__neu',
    title: 'Zusammengesetzte Flächen — Umfang bei der U-Form',
    hint: 'Eine Eckaussparung lässt den Umfang gleich; eine Kerbe in der Mitte (U-Form) fügt zwei zusätzliche Innenkanten hinzu.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Umfang', 'zusammengesetzte Figur', 'U-Form', 'L-Form', 'Innenkanten'],
    fachwissen: {
      text: 'Bei einer Eckaussparung (L-Form) ersetzen die beiden entfernten Außenkanten genau zwei gleich lange Innenkanten — der Umfang bleibt gleich dem des großen Rechtecks. Bei einer Kerbe in der Mitte des Randes (U-Form) wird dagegen keine Außenkante ersetzt, sondern es kommen zwei zusätzliche Innenkanten hinzu: Der Umfang wird größer als beim Ausgangsrechteck.',
      quelle: 'Wikipedia: Umfang (Geometrie)',
      url: 'https://de.wikipedia.org/wiki/Umfang_(Geometrie)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Umfang der U-Form als Text
      (rng: Rng) => {
        const d = randomUDimsNeu(rng)
        return valueTask({
          question: `Eine U-förmige Figur entsteht aus einem Rechteck ${d.outerWidth} m × ${d.outerHeight} m, aus dem oben in der Mitte ein Rechteck ${d.notchWidth} m × ${d.notchHeight} m herausgeschnitten wird. Berechne den Umfang der U-Form.`,
          unit: 'm',
          answerKind: 'integer',
          value: d.perimeter,
          solution: `${d.perimeter} m`,
          explanation: `Der obere Rand wird durch die Kerbe ersetzt, nicht verkürzt: Die beiden Randstücke links/rechts der Kerbe und ihr Boden ergeben zusammen wieder ${d.outerWidth} m — aber zwei zusätzliche senkrechte Innenkanten (je ${d.notchHeight} m) kommen hinzu. U = 2 · (${d.outerWidth} + ${d.outerHeight}) + 2 · ${d.notchHeight} = ${2 * (d.outerWidth + d.outerHeight)} + ${2 * d.notchHeight} = ${d.perimeter} m.`,
          dedupeKey: `umfang-u-form:${d.outerWidth}-${d.outerHeight}-${d.notchWidth}-${d.notchHeight}`,
        })
      },
      // Variant 2: MC — Eckaussparung vs. Mittenkerbe vergleichen
      (rng: Rng) => {
        const outerWidth = randInt(rng, 8, 14)
        const outerHeight = randInt(rng, 5, 10)
        const cutSize = randInt(rng, 2, Math.min(outerWidth, outerHeight) - 2)
        const baseU = 2 * (outerWidth + outerHeight)
        const uU = baseU + 2 * cutSize
        const choices = shuffleChoices(
          rng,
          ['L-Form (Ecke ausgeschnitten)', 'U-Form (Kerbe in der Mitte)', 'bei beiden gleich groß'],
          'U-Form (Kerbe in der Mitte)',
        )
        return choicePickTask({
          question: `Aus einem Rechteck ${outerWidth} m × ${outerHeight} m wird einmal an einer Ecke ein Quadrat ${cutSize} m × ${cutSize} m ausgeschnitten (L-Form), einmal in der Mitte des oberen Randes ein Quadrat ${cutSize} m × ${cutSize} m herausgeschnitten (U-Form). Bei welcher Figur ist der Umfang größer als beim ursprünglichen Rechteck?`,
          choices,
          correct: 'U-Form (Kerbe in der Mitte)',
          solution: 'U-Form (Kerbe in der Mitte)',
          explanation: `Bei der Eckaussparung (L-Form) bleibt der Umfang gleich dem großen Rechteck: ${baseU} m. Bei der Kerbe in der Mitte (U-Form) kommen zwei zusätzliche Innenkanten dazu: ${baseU} + 2 · ${cutSize} = ${uU} m.`,
          instruction: 'Tippe die richtige Antwort:',
          dedupeKey: `umfang-vergleich-l-u:${outerWidth}-${outerHeight}-${cutSize}`,
        })
      },
      // Variant 3: Portfolio — Umfang der abgebildeten U-Form
      (rng: Rng) => {
        const d = randomUDimsNeu(rng)
        const svg = generateUShapeSvg({
          outerWidth: d.outerWidth,
          outerHeight: d.outerHeight,
          notchWidth: d.notchWidth,
          notchHeight: d.notchHeight,
          bottomLabel: `${d.outerWidth} m`,
          leftLabel: `${d.outerHeight} m`,
          topLeftLabel: `${d.side} m`,
          topRightLabel: `${d.side} m`,
          notchLeftLabel: `${d.notchHeight} m`,
        })
        return valueTask({
          question: 'Berechne den Umfang der abgebildeten U-Form.',
          unit: 'm',
          answerKind: 'integer',
          value: d.perimeter,
          solution: `${d.perimeter} m`,
          explanation: `U = ${d.outerWidth} (unten) + ${d.outerHeight} (links) + ${d.outerHeight} (rechts) + ${d.side} + ${d.side} (obere Randstücke) + ${d.notchHeight} + ${d.notchHeight} (Innenkanten der Kerbe) + ${d.notchWidth} (Boden der Kerbe) = ${d.perimeter} m.`,
          visualContent: svg,
          dedupeKey: `umfang-u-visual:${d.outerWidth}-${d.outerHeight}-${d.notchWidth}-${d.notchHeight}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 7) Zusammengesetzte Quader — Volumen rückwärts & Zerlegungs-Formel
  // ---------------------------------------------------------------------
  asNeuTopic('lb4-volumen-zusammengesetzt', {
    id: 'lb4-volumen-zusammengesetzt__neu',
    title: 'Zusammengesetzte Quader — Volumen rückwärts rechnen',
    hint: 'Zerlege in zwei Quader oder ziehe die Aussparung vom großen Quader ab. Für eine fehlende Größe löse die Gleichung nach ihr auf.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Volumen', 'zusammengesetzter Körper', 'L-Körper', 'Quader', 'rückwärts rechnen'],
    fachwissen: {
      text: 'Ist bei einem zusammengesetzten Quader-Körper das Gesamtvolumen und alle Maße bis auf eines bekannt, lässt sich das fehlende Maß durch Umstellen berechnen: Zuerst das Volumen der Aussparung bestimmen (V_groß − V_Rest), dann durch die bekannten Seiten teilen. Dieses Rückwärtsrechnen festigt das Verständnis von V = Länge · Breite · Höhe.',
      quelle: 'Wikipedia: Quader',
      url: 'https://de.wikipedia.org/wiki/Quader',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — fehlende Kante des Ausschnitts
      (rng: Rng) => {
        const d = randomCompositeCuboidNeu(rng)
        const vGross = d.length * d.width * d.height
        const vCut = vGross - d.volume
        return valueTask({
          question: `Von einem Quader ${d.length} cm × ${d.width} cm × ${d.height} cm wird ein kleinerer Quader mit der Breite ${d.cutWidth} cm und derselben Höhe ${d.height} cm abgeschnitten. Das verbleibende Volumen beträgt ${d.volume} cm³. Wie lang ist der abgeschnittene Quader?`,
          unit: 'cm',
          answerKind: 'integer',
          value: d.cutLength,
          solution: `${d.cutLength} cm`,
          explanation: `V_groß = ${d.length}·${d.width}·${d.height} = ${vGross} cm³. V_Ausschnitt = V_groß − V_Rest = ${vGross} − ${d.volume} = ${vCut} cm³. Länge = V_Ausschnitt : (Breite · Höhe) = ${vCut} : (${d.cutWidth}·${d.height}) = ${d.cutLength} cm.`,
          dedupeKey: `volumen-zus-rueckwaerts:${d.length}-${d.width}-${d.height}-${d.cutLength}-${d.cutWidth}`,
        })
      },
      // Variant 2: MC — richtige Rechnung für den L-Körper auswählen
      (rng: Rng) => {
        const d = randomCompositeCuboidNeu(rng)
        const correct = `${d.length}·${d.width}·${d.height} − ${d.cutLength}·${d.cutWidth}·${d.height}`
        const wrong1 = `${d.length}·${d.width}·${d.height} + ${d.cutLength}·${d.cutWidth}·${d.height}`
        const wrong2 = `${d.stemLength}·${d.footWidth}·${d.height} + ${d.cutLength}·${d.width}·${d.height}`
        const wrong3 = `${d.length}·${d.cutWidth}·${d.height} − ${d.cutLength}·${d.width}·${d.height}`
        const choices = shuffleChoices(rng, [correct, wrong1, wrong2, wrong3], correct)
        return choicePickTask({
          question: `Ein L-förmiger Körper entsteht aus einem Quader ${d.length} cm × ${d.width} cm × ${d.height} cm, aus dem ein Quader ${d.cutLength} cm × ${d.cutWidth} cm × ${d.height} cm herausgeschnitten wird. Welche Rechnung liefert das Volumen des L-Körpers?`,
          choices,
          correct,
          solution: correct,
          explanation: `Großer Quader minus Aussparung: V = ${d.length}·${d.width}·${d.height} − ${d.cutLength}·${d.cutWidth}·${d.height} = ${d.volume} cm³.`,
          instruction: 'Tippe die richtige Rechnung:',
          dedupeKey: `volumen-zus-mc-formel:${d.length}-${d.width}-${d.height}-${d.cutLength}-${d.cutWidth}`,
        })
      },
      // Variant 3: Portfolio — fehlende Höhe am abgebildeten L-Körper
      (rng: Rng) => {
        const d = randomCompositeCuboidNeu(rng)
        const grundflaeche = d.length * d.width - d.cutLength * d.cutWidth
        const svg = generateCompositeCuboidSvg({
          length: d.length,
          width: d.width,
          height: d.height,
          cutLength: d.cutLength,
          cutWidth: d.cutWidth,
          lengthLabel: `${d.length} cm`,
          cutLengthLabel: `${d.cutLength} cm`,
          cutWidthLabel: `${d.cutWidth} cm`,
          footWidthLabel: `${d.footWidth} cm`,
          heightLabel: '?',
        })
        return valueTask({
          question: `Der abgebildete L-förmige Körper hat das Volumen ${d.volume} cm³. Wie hoch ist er?`,
          unit: 'cm',
          answerKind: 'integer',
          value: d.height,
          solution: `${d.height} cm`,
          explanation: `Grundfläche der L-Form: G = ${d.length}·${d.width} − ${d.cutLength}·${d.cutWidth} = ${grundflaeche} cm². Höhe = V : G = ${d.volume} : ${grundflaeche} = ${d.height} cm.`,
          visualContent: svg,
          dedupeKey: `volumen-zus-visual-hoehe:${d.length}-${d.width}-${d.height}-${d.cutLength}-${d.cutWidth}`,
        })
      },
    ),
  }),
]

/** LB5 — Alltag + Einheiten */
export const math5NeuLb5: Topic[] = [
  // ---------------------------------------------------------------------
  // 1) Gesamtpreis — mehrere Artikel, Vergleich, Rückrechnung
  // ---------------------------------------------------------------------
  asNeuTopic('lb5-gesamtpreis', {
    id: 'lb5-gesamtpreis__neu',
    title: 'Sachaufgabe: Gesamtpreis mit mehreren Artikeln',
    hint: 'Berechne jeden Posten einzeln (Anzahl · Stückpreis) und addiere die Teilbeträge.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Sachaufgabe', 'Gesamtpreis', 'Einkauf', 'addieren', 'multiplizieren', 'Alltag', 'Stückpreis'],
    fachwissen: {
      text: 'Beim Einkauf mehrerer verschiedener Artikel wird jeder Posten getrennt berechnet (Anzahl · Stückpreis) und anschließend addiert. Ist umgekehrt nur der Gesamtpreis und die Anzahl bekannt, lässt sich der Stückpreis durch Division ermitteln: Stückpreis = Gesamtpreis : Anzahl.',
      quelle: 'Wikipedia: Multiplikation',
      url: 'https://de.wikipedia.org/wiki/Multiplikation',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — zwei Artikel, Gesamtsumme
      (rng: Rng) => {
        const pairs = [
          { a: 'Hefte', b: 'Stifte' },
          { a: 'Brötchen', b: 'Kuchenstücke' },
          { a: 'Äpfel', b: 'Bananen' },
          { a: 'Eisportionen', b: 'Waffeln' },
          { a: 'Kinokarten', b: 'Popcorn-Tüten' },
        ] as const
        const pair = pick(rng, pairs)
        const anzahlA = randInt(rng, 2, 8)
        const preisA = randInt(rng, 2, 10)
        const anzahlB = randInt(rng, 2, 6)
        const preisB = randInt(rng, 2, 12)
        const totalA = anzahlA * preisA
        const totalB = anzahlB * preisB
        const total = totalA + totalB
        return valueTask({
          question: `Im Laden kosten ${pair.a} je ${preisA} € und ${pair.b} je ${preisB} €. Paul kauft ${anzahlA} ${pair.a} und ${anzahlB} ${pair.b}. Wie viel bezahlt er insgesamt?`,
          unit: '€',
          answerKind: 'integer',
          value: total,
          solution: `${total} €`,
          explanation: `${pair.a}: ${anzahlA} · ${preisA} € = ${totalA} €. ${pair.b}: ${anzahlB} · ${preisB} € = ${totalB} €. Gesamt: ${totalA} € + ${totalB} € = ${total} €.`,
          dedupeKey: `gesamtpreis-zwei:${pair.a}-${anzahlA}-${preisA}-${anzahlB}-${preisB}`,
        })
      },
      // Variant 2: MC — wer bezahlt mehr?
      (rng: Rng) => {
        const names = ['Lara', 'Jonas', 'Mia', 'Tom', 'Ella', 'Finn']
        const shuffledNames = [...names].sort(() => rng() - 0.5)
        const nameA = shuffledNames[0]!
        const nameB = shuffledNames[1]!
        const artikelA = pick(rng, ['Hefte', 'Äpfel', 'Brötchen', 'Postkarten'])
        const artikelB = pick(rng, ['Stifte', 'Bananen', 'Brezeln', 'Sticker'])
        const anzahlA = randInt(rng, 2, 9)
        const preisA = randInt(rng, 2, 10)
        const anzahlB = randInt(rng, 2, 9)
        const preisB = randInt(rng, 2, 10)
        const totalA = anzahlA * preisA
        const totalB = anzahlB * preisB
        const correct = totalA > totalB ? nameA : totalA < totalB ? nameB : 'gleich viel'
        const choices = shuffleChoices(rng, [nameA, nameB, 'gleich viel'], correct)
        return choicePickTask({
          question: `${nameA} kauft ${anzahlA} ${artikelA} für je ${preisA} €. ${nameB} kauft ${anzahlB} ${artikelB} für je ${preisB} €. Wer bezahlt mehr?`,
          choices,
          correct,
          solution: correct,
          explanation: `${nameA}: ${anzahlA} · ${preisA} € = ${totalA} €. ${nameB}: ${anzahlB} · ${preisB} € = ${totalB} €. ${
            totalA === totalB ? 'Beide bezahlen gleich viel.' : totalA > totalB ? `${nameA} bezahlt mehr.` : `${nameB} bezahlt mehr.`
          }`,
          instruction: 'Tippe die richtige Antwort:',
          dedupeKey: `gesamtpreis-vergleich:${nameA}-${anzahlA}-${preisA}-${nameB}-${anzahlB}-${preisB}`,
        })
      },
      // Variant 3: Tippen — Stückpreis zurückrechnen
      (rng: Rng) => {
        const objects = [
          { plural: 'Kinokarten', unit: 'Karte' },
          { plural: 'Eintrittskarten', unit: 'Karte' },
          { plural: 'Busfahrkarten', unit: 'Fahrkarte' },
          { plural: 'Eisportionen', unit: 'Portion' },
        ] as const
        const obj = pick(rng, objects)
        const anzahl = randInt(rng, 2, 8)
        const preis = randInt(rng, 2, 15)
        const total = anzahl * preis
        return valueTask({
          question: `Für ${anzahl} ${obj.plural} bezahlt eine Familie insgesamt ${total} €. Wie viel kostet eine einzelne ${obj.unit}?`,
          unit: '€',
          answerKind: 'integer',
          value: preis,
          solution: `${preis} €`,
          explanation: `Preis pro Stück = Gesamtpreis : Anzahl = ${total} : ${anzahl} = ${preis} €.`,
          dedupeKey: `gesamtpreis-rueckwaerts:${obj.unit}-${anzahl}-${preis}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 2) Gerecht aufteilen — Rest, Aufrunden, Volle Gruppen
  // ---------------------------------------------------------------------
  asNeuTopic('lb5-teilen', {
    id: 'lb5-teilen__neu',
    title: 'Sachaufgabe: Aufteilen mit Rest',
    hint: 'Teile mit Rest: Zuerst die vollen Gruppen zählen, dann prüfen, was übrig bleibt.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Sachaufgabe', 'Division', 'Rest', 'aufteilen', 'aufrunden', 'Alltag'],
    fachwissen: {
      text: 'Lässt sich eine Menge nicht restlos aufteilen, entsteht bei der Division ein Rest: a : m = q Rest r. Im Alltag entscheidet die Situation, wie mit dem Rest umzugehen ist — manchmal bleibt er einfach übrig, manchmal macht er ein zusätzliches Gefäß oder Fahrzeug nötig (dann wird das Ergebnis aufgerundet).',
      quelle: 'Wikipedia: Division mit Rest',
      url: 'https://de.wikipedia.org/wiki/Division_mit_Rest',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Rest bestimmen
      (rng: Rng) => {
        const dinge = pick(rng, ['Bonbons', 'Murmeln', 'Sticker', 'Nüsse', 'Perlen'])
        const anzahlKinder = randInt(rng, 3, 8)
        const proKind = randInt(rng, 3, 9)
        const rest = randInt(rng, 1, anzahlKinder - 1)
        const gesamt = proKind * anzahlKinder + rest
        return valueTask({
          question: `${gesamt} ${dinge} werden so gerecht wie möglich an ${anzahlKinder} Kinder verteilt. Wie viele ${dinge} bleiben am Ende übrig?`,
          answerKind: 'integer',
          value: rest,
          solution: `${rest}`,
          explanation: `${gesamt} : ${anzahlKinder} = ${proKind} Rest ${rest}. Jedes Kind bekommt ${proKind} ${dinge}, es bleiben ${rest} übrig.`,
          dedupeKey: `teilen-rest:${dinge}-${gesamt}-${anzahlKinder}`,
        })
      },
      // Variant 2: MC — Aufrunden (wie viele Busse werden benötigt?)
      (rng: Rng) => {
        const sitzplaetze = pick(rng, [25, 30, 35, 40])
        const busseExact = randInt(rng, 2, 5)
        const restStudents = randInt(rng, 1, sitzplaetze - 1)
        const schueler = sitzplaetze * (busseExact - 1) + restStudents
        const choices = shuffleChoices(
          rng,
          [`${busseExact - 1} Busse`, `${busseExact} Busse`, `${busseExact + 1} Busse`],
          `${busseExact} Busse`,
        )
        return choicePickTask({
          question: `Für eine Klassenfahrt mit ${schueler} Schülerinnen und Schülern werden Busse mit je ${sitzplaetze} Sitzplätzen gebucht. Wie viele Busse werden mindestens benötigt?`,
          choices,
          correct: `${busseExact} Busse`,
          solution: `${busseExact} Busse`,
          explanation: `${schueler} : ${sitzplaetze} = ${busseExact - 1} Rest ${restStudents}. Weil noch ${restStudents} Personen übrig bleiben, wird ein zusätzlicher Bus benötigt: ${busseExact} Busse.`,
          instruction: 'Tippe die richtige Antwort:',
          dedupeKey: `teilen-busse:${schueler}-${sitzplaetze}`,
        })
      },
      // Variant 3: Tippen — volle Gruppen zählen (Quotient)
      (rng: Rng) => {
        const proTuete = randInt(rng, 4, 12)
        const tutenAnzahl = randInt(rng, 3, 9)
        const rest = randInt(rng, 1, proTuete - 1)
        const gesamt = proTuete * tutenAnzahl + rest
        return valueTask({
          question: `Eine Bäckerei hat ${gesamt} Brötchen gebacken. Sie werden in Tüten mit je ${proTuete} Brötchen verpackt, bis keine volle Tüte mehr möglich ist. Wie viele volle Tüten entstehen?`,
          answerKind: 'integer',
          value: tutenAnzahl,
          solution: `${tutenAnzahl}`,
          explanation: `${gesamt} : ${proTuete} = ${tutenAnzahl} Rest ${rest}. Es entstehen ${tutenAnzahl} volle Tüten, ${rest} Brötchen bleiben übrig.`,
          dedupeKey: `teilen-tueten:${gesamt}-${proTuete}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 3) Mehrstufige Alltagsrechnung — Sparen & gemeinsam bezahlen
  // ---------------------------------------------------------------------
  asNeuTopic('lb5-mehrstufig', {
    id: 'lb5-mehrstufig__neu',
    title: 'Sachaufgabe: Mehrstufige Alltagsrechnung — Sparen & Teilen',
    hint: 'Löse Schritt für Schritt und halte jedes Zwischenergebnis fest, bevor du weiterrechnest.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Sachaufgabe', 'mehrstufig', 'sparen', 'Taschengeld', 'Alltag', 'Restaurant'],
    fachwissen: {
      text: 'Mehrstufige Sachaufgaben verknüpfen mehrere Rechenschritte. Oft wird zuerst eine Menge über mehrere Wochen oder Posten aufsummiert, bevor eine abschließende Frage (Rest nach einem Kauf, Vergleich, Gesamtkosten für mehrere Personen) beantwortet wird. Jedes Zwischenergebnis sollte festgehalten werden, bevor der nächste Schritt folgt.',
      quelle: 'Wikipedia: Dreisatz',
      url: 'https://de.wikipedia.org/wiki/Dreisatz',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Sparen über Wochen, dann Kauf
      (rng: Rng) => {
        const wochen = randInt(rng, 4, 10)
        const proWoche = randInt(rng, 2, 8)
        const summe = wochen * proWoche
        const rest = randInt(rng, 1, Math.min(15, summe - 1))
        const preis = summe - rest
        const gegenstand = pick(rng, ['Kopfhörer', 'ein Spiel', 'ein Buch', 'einen Rucksack', 'einen Fußball'])
        return valueTask({
          question: `Mia spart ${wochen} Wochen lang jede Woche ${proWoche} €. Danach kauft sie sich ${gegenstand} für ${preis} €. Wie viel Geld hat sie danach noch übrig?`,
          unit: '€',
          answerKind: 'integer',
          value: rest,
          solution: `${rest} €`,
          explanation: `Gespartes Geld: ${wochen} · ${proWoche} € = ${summe} €. Nach dem Kauf: ${summe} € − ${preis} € = ${rest} €.`,
          dedupeKey: `mehrstufig-sparen:${wochen}-${proWoche}-${preis}`,
        })
      },
      // Variant 2: MC — zwei Sparpläne vergleichen
      (rng: Rng) => {
        const names = ['Lara', 'Jonas', 'Mia', 'Tom', 'Ella', 'Finn']
        const shuffledNames = [...names].sort(() => rng() - 0.5)
        const nameA = shuffledNames[0]!
        const nameB = shuffledNames[1]!
        const wochenA = randInt(rng, 3, 7)
        const proWocheA = randInt(rng, 2, 8)
        const summeA = wochenA * proWocheA
        const kaufA = randInt(rng, 2, summeA - 2)
        const restA = summeA - kaufA
        const wochenB = randInt(rng, 3, 7)
        const proWocheB = randInt(rng, 2, 8)
        const summeB = wochenB * proWocheB
        const kaufB = randInt(rng, 2, summeB - 2)
        const restB = summeB - kaufB
        const correct = restA > restB ? nameA : restA < restB ? nameB : 'gleich viel'
        const choices = shuffleChoices(rng, [nameA, nameB, 'gleich viel'], correct)
        return choicePickTask({
          question: `${nameA} spart ${wochenA} Wochen lang je ${proWocheA} € und kauft sich danach etwas für ${kaufA} €. ${nameB} spart ${wochenB} Wochen lang je ${proWocheB} € und kauft sich etwas für ${kaufB} €. Wer hat danach mehr Geld übrig?`,
          choices,
          correct,
          solution: correct,
          explanation: `${nameA}: ${wochenA} · ${proWocheA} € − ${kaufA} € = ${summeA} € − ${kaufA} € = ${restA} €. ${nameB}: ${wochenB} · ${proWocheB} € − ${kaufB} € = ${summeB} € − ${kaufB} € = ${restB} €. ${
            restA === restB ? 'Beide haben gleich viel übrig.' : restA > restB ? `${nameA} hat mehr übrig.` : `${nameB} hat mehr übrig.`
          }`,
          instruction: 'Tippe die richtige Antwort:',
          dedupeKey: `mehrstufig-vergleich:${nameA}-${wochenA}-${proWocheA}-${kaufA}-${nameB}-${wochenB}-${proWocheB}-${kaufB}`,
        })
      },
      // Variant 3: Tippen — Rechnung für mehrere Personen
      (rng: Rng) => {
        const anzahlPersonen = randInt(rng, 2, 6)
        const pizzaPreis = randInt(rng, 6, 12)
        const getraenkPreis = randInt(rng, 2, 4)
        const proPerson = pizzaPreis + getraenkPreis
        const gesamt = proPerson * anzahlPersonen
        return valueTask({
          question: `${anzahlPersonen} Freunde gehen essen. Jede Pizza kostet ${pizzaPreis} €, jedes Getränk ${getraenkPreis} €. Jede Person bestellt eine Pizza und ein Getränk. Wie viel bezahlen alle zusammen?`,
          unit: '€',
          answerKind: 'integer',
          value: gesamt,
          solution: `${gesamt} €`,
          explanation: `Pro Person: ${pizzaPreis} € + ${getraenkPreis} € = ${proPerson} €. Für ${anzahlPersonen} Personen: ${anzahlPersonen} · ${proPerson} € = ${gesamt} €.`,
          dedupeKey: `mehrstufig-restaurant:${anzahlPersonen}-${pizzaPreis}-${getraenkPreis}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 4) Fläche & Umfang im Alltag — Materialkosten
  // ---------------------------------------------------------------------
  asNeuTopic('lb5-sachaufgabe-flaeche', {
    id: 'lb5-sachaufgabe-flaeche__neu',
    title: 'Sachaufgabe: Fläche & Umfang — Materialkosten im Alltag',
    hint: 'Berechne zuerst Fläche oder Umfang, multipliziere das Ergebnis dann mit dem Preis pro Einheit.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Sachaufgabe', 'Fläche', 'Umfang', 'Kosten', 'Garten', 'Zimmer', 'Alltag'],
    fachwissen: {
      text: 'Materialkosten im Alltag ergeben sich oft aus einer Fläche oder einem Umfang, multipliziert mit einem Preis pro Einheit: Bodenbelag kostet Fläche · Preis pro m², Zaun kostet Umfang · Preis pro Meter. Entscheidend ist, zuerst die richtige Größe (Fläche oder Umfang) zu berechnen, bevor mit dem Preis weitergerechnet wird.',
      quelle: 'Wikipedia: Flächeninhalt',
      url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Materialkosten für Bodenbelag
      (rng: Rng) => {
        const a = randInt(rng, 3, 10)
        const b = randInt(rng, 3, 10)
        const flaeche = a * b
        const preisProM2 = pick(rng, [8, 10, 12, 15, 20, 25])
        const kosten = flaeche * preisProM2
        return valueTask({
          question: `Ein rechteckiges Zimmer ist ${a} m lang und ${b} m breit. Der Bodenbelag kostet ${preisProM2} € pro Quadratmeter. Wie viel kostet der gesamte Bodenbelag?`,
          unit: '€',
          answerKind: 'integer',
          value: kosten,
          solution: `${formatDe(kosten)} €`,
          explanation: `Fläche: ${a} · ${b} = ${flaeche} m². Kosten: ${flaeche} · ${preisProM2} € = ${formatDe(kosten)} €.`,
          dedupeKey: `flaeche-kosten:${a}-${b}-${preisProM2}`,
        })
      },
      // Variant 2: MC — welcher Garten braucht mehr Zaun?
      (rng: Rng) => {
        const a1 = randInt(rng, 3, 15)
        const b1 = randInt(rng, 3, 15)
        const a2 = randInt(rng, 3, 15)
        const b2 = randInt(rng, 3, 15)
        const u1 = 2 * (a1 + b1)
        const u2 = 2 * (a2 + b2)
        const correct = u1 > u2 ? 'Garten A' : u1 < u2 ? 'Garten B' : 'gleich viel'
        const choices = shuffleChoices(rng, ['Garten A', 'Garten B', 'gleich viel'], correct)
        return choicePickTask({
          question: `Garten A ist ${a1} m × ${b1} m groß, Garten B ist ${a2} m × ${b2} m groß. Beide sollen vollständig eingezäunt werden. Welcher Garten benötigt mehr Zaun?`,
          choices,
          correct,
          solution: correct,
          explanation: `U(A) = 2 · (${a1} + ${b1}) = ${u1} m. U(B) = 2 · (${a2} + ${b2}) = ${u2} m. ${
            u1 === u2 ? 'Beide Gärten benötigen gleich viel Zaun.' : u1 > u2 ? 'Garten A benötigt mehr Zaun.' : 'Garten B benötigt mehr Zaun.'
          }`,
          instruction: 'Tippe die richtige Antwort:',
          dedupeKey: `flaeche-zaun-vergleich:${a1}-${b1}-${a2}-${b2}`,
        })
      },
      // Variant 3: Portfolio — L-förmiger Gartenweg, Materialkosten
      (rng: Rng) => {
        const d = randomLDimsNeu(rng)
        const preisProM2 = pick(rng, [6, 8, 10, 12])
        const kosten = d.area * preisProM2
        const svg = generateLShapeSvg({
          outerWidth: d.outerWidth,
          outerHeight: d.outerHeight,
          cutWidth: d.cutWidth,
          cutHeight: d.cutHeight,
          bottomLabel: `${d.outerWidth} m`,
          leftLabel: `${d.outerHeight} m`,
          innerHorizontalLabel: `${d.cutWidth} m`,
          innerVerticalLabel: `${d.cutHeight} m`,
        })
        return valueTask({
          question: `Der abgebildete L-förmige Gartenweg soll gepflastert werden. Die Pflastersteine kosten ${preisProM2} € pro m². Wie viel kosten die Pflastersteine insgesamt?`,
          unit: '€',
          answerKind: 'integer',
          value: kosten,
          solution: `${formatDe(kosten)} €`,
          explanation: `Fläche: A = ${d.outerWidth}·${d.outerHeight} − ${d.cutWidth}·${d.cutHeight} = ${d.area} m². Kosten: ${d.area} · ${preisProM2} € = ${formatDe(kosten)} €.`,
          visualContent: svg,
          dedupeKey: `flaeche-l-kosten:${d.outerWidth}-${d.outerHeight}-${d.cutWidth}-${d.cutHeight}-${preisProM2}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 5) Längeneinheiten im Alltag
  // ---------------------------------------------------------------------
  asNeuTopic('k5-umrechnen-laenge', {
    id: 'k5-umrechnen-laenge__neu',
    title: 'Längeneinheiten im Alltag — Sachaufgaben & Vergleiche',
    hint: 'Rechne beide Längen in dieselbe Einheit um, bevor du vergleichst oder weiterrechnest.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Längeneinheiten', 'Länge', 'umrechnen', 'Alltag', 'Sachaufgabe', 'mm', 'cm', 'm', 'km', 'vergleichen'],
    fachwissen: {
      text: 'Längeneinheiten bauen im Zehner- bzw. Tausendersystem aufeinander auf: 1 cm = 10 mm, 1 m = 100 cm, 1 km = 1000 m. Der Umrechnungsfaktor ist jeweils eine Potenz von 10 (Zehnerdimension). Kleinere Einheit → größere: dividieren durch den Faktor; größere → kleinere: multiplizieren. Alltagsangaben wie „2 m 35 cm“ sind gemischte Einheiten; zuerst in eine Einheit umwandeln, dann rechnen oder vergleichen.',
      quelle: 'Wikipedia: Länge (Physik)',
      url: 'https://de.wikipedia.org/wiki/L%C3%A4nge_(Physik)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Schulweg hin und zurück in km
      (rng: Rng) => {
        const meters = pick(rng, [150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950])
        const total = 2 * meters
        const value = roundTo(total / 1000, 1)
        return valueTask({
          question: `Max läuft morgens ${meters} m zur Schule und nachmittags denselben Weg zurück. Wie viele km legt er an einem Schultag insgesamt zurück?`,
          unit: 'km',
          answerKind: 'decimal',
          value,
          eps: 0.001,
          solution: `${formatDe(value)} km`,
          explanation: `Hin und zurück: 2 · ${meters} m = ${total} m. Umrechnen in km: ${total} : 1000 = ${formatDe(value)} km.`,
          dedupeKey: `laenge-schulweg:${meters}`,
        })
      },
      // Variant 2: MC — passende Längeneinheit schätzen
      (rng: Rng) => {
        const items = [
          { name: 'die Breite eines Fingernagels', unit: 'mm' },
          { name: 'die Länge eines Bleistifts', unit: 'cm' },
          { name: 'die Höhe einer Zimmertür', unit: 'm' },
          { name: 'die Strecke von Dresden nach Leipzig', unit: 'km' },
          { name: 'die Dicke eines Schulbuches', unit: 'cm' },
          { name: 'die Länge eines Fußballfeldes', unit: 'm' },
        ] as const
        const item = pick(rng, items)
        const choices = shuffleChoices(rng, ['mm', 'cm', 'm', 'km'], item.unit)
        return choicePickTask({
          question: `Welche Längeneinheit passt am besten zu: ${item.name}?`,
          choices,
          correct: item.unit,
          solution: item.unit,
          explanation: `${item.name} hat in der Realität eine Länge in der Größenordnung von ${item.unit}.`,
          instruction: 'Tippe die passende Einheit:',
          dedupeKey: `laenge-einheit:${item.name}`,
        })
      },
      // Variant 3: MC — Vergleich gemischter Einheiten mit <, >, =
      (rng: Rng) => {
        const moebel = pick(rng, ['Regal', 'Schrank', 'Vorhang', 'Teppich'])
        const m = randInt(rng, 1, 4)
        const cmPart = pick(rng, [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90])
        const baseCm = m * 100 + cmPart
        const compareCm = baseCm + pick(rng, [-40, -30, -20, -10, 0, 10, 20, 30, 40])
        const relation = baseCm < compareCm ? '<' : baseCm > compareCm ? '>' : '='
        const choices = shuffleChoices(rng, ['<', '>', '='], relation)
        return choicePickTask({
          question: `Ein ${moebel} ist ${m} m ${cmPart} cm hoch, ein zweites ist ${compareCm} cm hoch. Vergleiche: ${m} m ${cmPart} cm ___ ${compareCm} cm.`,
          choices,
          correct: relation,
          solution: relation,
          explanation: `${m} m ${cmPart} cm = ${baseCm} cm. Vergleich: ${baseCm} cm ${relation} ${compareCm} cm.`,
          instruction: 'Setze das passende Zeichen:',
          dedupeKey: `laenge-vergleich:${m}-${cmPart}-${compareCm}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 6) Flächeneinheiten im Alltag
  // ---------------------------------------------------------------------
  asNeuTopic('k5-umrechnen-flaeche', {
    id: 'k5-umrechnen-flaeche__neu',
    title: 'Flächeneinheiten im Alltag — Sachaufgaben & Vergleiche',
    hint: 'Rechne beide Flächen in dieselbe Einheit um, bevor du vergleichst.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Flächeneinheiten', 'Fläche', 'umrechnen', 'Ar', 'Hektar', 'Alltag', 'vergleichen'],
    fachwissen: {
      text: 'Für größere Grundstücksflächen werden im Alltag oft Ar und Hektar statt Quadratmetern genutzt: 1 a = 100 m², 1 ha = 100 a = 10 000 m². Der Umrechnungsfaktor zwischen benachbarten Flächenstufen folgt der Längendimension (quadratisch). Kleinere Einheit → größere: dividieren; größere → kleinere: multiplizieren. Zum Vergleichen zuerst in dieselbe Einheit umrechnen.',
      quelle: 'Wikipedia: Flächeninhalt',
      url: 'https://de.wikipedia.org/wiki/Fl%C3%A4cheninhalt',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Grundstück in Ar
      (rng: Rng) => {
        const flaecheM2 = pick(rng, [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500])
        const value = flaecheM2 / 100
        return valueTask({
          question: `Ein Grundstück ist ${flaecheM2} m² groß. Wie viele a (Ar) sind das?`,
          unit: 'a',
          answerKind: 'integer',
          value,
          solution: `${value} a`,
          explanation: `1 a = 100 m². ${flaecheM2} m² : 100 = ${value} a.`,
          dedupeKey: `flaeche-ar:${flaecheM2}`,
        })
      },
      // Variant 2: MC — welche Fläche ist größer (a vs. m²)?
      (rng: Rng) => {
        const ar = randInt(rng, 2, 8)
        const m2 = pick(rng, [150, 250, 350, 450, 550, 650, 750, 850])
        const arAlsM2 = ar * 100
        const correct = arAlsM2 > m2 ? `${ar} a` : arAlsM2 < m2 ? `${m2} m²` : 'gleich groß'
        const choices = shuffleChoices(rng, [`${ar} a`, `${m2} m²`, 'gleich groß'], correct)
        return choicePickTask({
          question: `Welche Fläche ist größer: ${ar} a oder ${m2} m²?`,
          choices,
          correct,
          solution: correct,
          explanation: `${ar} a = ${arAlsM2} m². Vergleich mit ${m2} m²: ${
            arAlsM2 === m2 ? 'Beide Flächen sind gleich groß.' : arAlsM2 > m2 ? `${ar} a ist größer.` : `${m2} m² ist größer.`
          }`,
          instruction: 'Tippe die richtige Antwort:',
          dedupeKey: `flaeche-vergleich:${ar}-${m2}`,
        })
      },
      // Variant 3: MC — Vergleich ha vs. m² mit <, >, =
      (rng: Rng) => {
        const ha = randInt(rng, 1, 5)
        const m2compare = pick(rng, [5000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000])
        const haAlsM2 = ha * 10000
        const relation = haAlsM2 < m2compare ? '<' : haAlsM2 > m2compare ? '>' : '='
        const choices = shuffleChoices(rng, ['<', '>', '='], relation)
        return choicePickTask({
          question: `Ein Waldstück ist ${ha} ha groß, eine Wiese ${m2compare} m². Vergleiche: ${ha} ha ___ ${m2compare} m².`,
          choices,
          correct: relation,
          solution: relation,
          explanation: `${ha} ha = ${haAlsM2} m². Vergleich: ${haAlsM2} m² ${relation} ${m2compare} m².`,
          instruction: 'Setze das passende Zeichen:',
          dedupeKey: `flaeche-vergleich-ha:${ha}-${m2compare}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 7) Volumeneinheiten im Alltag
  // ---------------------------------------------------------------------
  asNeuTopic('k5-umrechnen-volumen', {
    id: 'k5-umrechnen-volumen__neu',
    title: 'Volumeneinheiten im Alltag — Sachaufgaben & Vergleiche',
    hint: 'Merke: 1 l = 1000 ml. Rechne beide Mengen in dieselbe Einheit um, bevor du vergleichst.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Volumeneinheiten', 'Volumen', 'Liter', 'ml', 'umrechnen', 'Alltag', 'vergleichen'],
    fachwissen: {
      text: 'Für Flüssigkeiten wird im Alltag meist in Liter und Millilitern statt in cm³ oder dm³ gerechnet: 1 l = 1000 ml. Der Umrechnungsfaktor zwischen l und ml ist 1000 — größere Einheit → kleinere: multiplizieren, kleinere → größere: dividieren. Mehrere gleich große Gefäße: Gesamtmenge multiplizieren; zum Vergleichen beide Mengen in dieselbe Einheit umrechnen.',
      quelle: 'Wikipedia: Volumen',
      url: 'https://de.wikipedia.org/wiki/Volumen',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Kiste mit mehreren Flaschen
      (rng: Rng) => {
        const mlProFlasche = pick(rng, [250, 500, 750, 1000, 1500, 2000])
        const anzahlFlaschen = randInt(rng, 4, 12)
        const gesamtMl = mlProFlasche * anzahlFlaschen
        const value = roundTo(gesamtMl / 1000, 3)
        return valueTask({
          question: `Eine Kiste enthält ${anzahlFlaschen} Flaschen mit je ${mlProFlasche} ml. Wie viele Liter sind das insgesamt?`,
          unit: 'l',
          answerKind: 'decimal',
          value,
          eps: 0.001,
          solution: `${formatDe(value)} l`,
          explanation: `Gesamtmenge: ${anzahlFlaschen} · ${mlProFlasche} ml = ${gesamtMl} ml. Umrechnen in Liter: ${gesamtMl} : 1000 = ${formatDe(value)} l.`,
          dedupeKey: `volumen-kiste:${mlProFlasche}-${anzahlFlaschen}`,
        })
      },
      // Variant 2: MC — welche Menge entspricht X Litern?
      (rng: Rng) => {
        const literWert = pick(rng, [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5])
        const correctMl = literWert * 1000
        const wrong1 = correctMl / 10
        const wrong2 = correctMl * 10
        const choices = shuffleChoices(rng, [`${correctMl} ml`, `${wrong1} ml`, `${wrong2} ml`], `${correctMl} ml`)
        return choicePickTask({
          question: `Welche Menge entspricht ${formatDe(literWert)} l?`,
          choices,
          correct: `${correctMl} ml`,
          solution: `${correctMl} ml`,
          explanation: `1 l = 1000 ml. ${formatDe(literWert)} l · 1000 = ${correctMl} ml.`,
          instruction: 'Tippe die richtige Antwort:',
          dedupeKey: `volumen-aequivalent:${literWert}`,
        })
      },
      // Variant 3: MC — Vergleich l vs. ml mit <, >, =
      (rng: Rng) => {
        const literWert = randInt(rng, 1, 4)
        const mlCompare = pick(rng, [800, 1200, 1500, 1800, 2200, 2500, 3000, 3500, 4000])
        const literAlsMl = literWert * 1000
        const relation = literAlsMl < mlCompare ? '<' : literAlsMl > mlCompare ? '>' : '='
        const choices = shuffleChoices(rng, ['<', '>', '='], relation)
        return choicePickTask({
          question: `Eine Gießkanne fasst ${literWert} l, ein Eimer fasst ${mlCompare} ml. Vergleiche: ${literWert} l ___ ${mlCompare} ml.`,
          choices,
          correct: relation,
          solution: relation,
          explanation: `${literWert} l = ${literAlsMl} ml. Vergleich: ${literAlsMl} ml ${relation} ${mlCompare} ml.`,
          instruction: 'Setze das passende Zeichen:',
          dedupeKey: `volumen-vergleich:${literWert}-${mlCompare}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 8) Masseneinheiten im Alltag
  // ---------------------------------------------------------------------
  asNeuTopic('k5-umrechnen-masse', {
    id: 'k5-umrechnen-masse__neu',
    title: 'Masseneinheiten im Alltag — Sachaufgaben & Vergleiche',
    hint: 'Merke: 1 kg = 1000 g, 1 t = 1000 kg. Rechne beide Massen in dieselbe Einheit um, bevor du vergleichst.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Masseneinheiten', 'Masse', 'Gewicht', 'kg', 'g', 't', 'umrechnen', 'Alltag', 'vergleichen'],
    fachwissen: {
      text: 'Masseneinheiten bauen im Tausendersystem aufeinander auf: 1 g = 1000 mg, 1 kg = 1000 g, 1 t = 1000 kg. Der Umrechnungsfaktor ist jeweils 1000. Kleinere Einheit → größere: dividieren; größere → kleinere: multiplizieren. Viele gleich schwere Gegenstände: Gesamtgewicht multiplizieren; große Ladungen oft in Tonnen angeben.',
      quelle: 'Wikipedia: Masse (Physik)',
      url: 'https://de.wikipedia.org/wiki/Masse_(Physik)',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Ladung eines Lastwagens in Tonnen
      (rng: Rng) => {
        const kgProKiste = randInt(rng, 8, 20)
        const anzahlKisten = pick(rng, [50, 100, 150, 200, 250, 300, 400, 500])
        const gesamtKg = kgProKiste * anzahlKisten
        const value = roundTo(gesamtKg / 1000, 3)
        return valueTask({
          question: `Ein Lastwagen transportiert ${anzahlKisten} Kisten Äpfel mit je ${kgProKiste} kg. Wie viele Tonnen (t) wiegt die gesamte Ladung?`,
          unit: 't',
          answerKind: 'decimal',
          value,
          eps: 0.001,
          solution: `${formatDe(value)} t`,
          explanation: `Gesamtgewicht: ${anzahlKisten} · ${kgProKiste} kg = ${gesamtKg} kg. Umrechnen in Tonnen: ${gesamtKg} : 1000 = ${formatDe(value)} t.`,
          dedupeKey: `masse-lkw:${anzahlKisten}-${kgProKiste}`,
        })
      },
      // Variant 2: MC — passende Masseneinheit schätzen
      (rng: Rng) => {
        const items = [
          { name: 'ein Elefant', unit: 't' },
          { name: 'ein voll beladener Schulrucksack', unit: 'kg' },
          { name: 'eine Büroklammer', unit: 'g' },
          { name: 'ein Reiskorn', unit: 'mg' },
          { name: 'ein mittelgroßer Hund', unit: 'kg' },
          { name: 'ein Kleinwagen', unit: 't' },
          { name: 'eine Tafel Schokolade', unit: 'g' },
        ] as const
        const item = pick(rng, items)
        const choices = shuffleChoices(rng, ['mg', 'g', 'kg', 't'], item.unit)
        return choicePickTask({
          question: `Welche Masseneinheit passt am besten zu: ${item.name}?`,
          choices,
          correct: item.unit,
          solution: item.unit,
          explanation: `${item.name} hat in der Realität eine Masse in der Größenordnung von ${item.unit}.`,
          instruction: 'Tippe die passende Einheit:',
          dedupeKey: `masse-einheit:${item.name}`,
        })
      },
      // Variant 3: MC — Vergleich g vs. kg mit <, >, =
      (rng: Rng) => {
        const gWert = pick(rng, [1500, 2200, 2500, 3000, 3500, 4200, 4800, 5000])
        const kgCompare = randInt(rng, 1, 5)
        const kgAlsG = kgCompare * 1000
        const relation = gWert < kgAlsG ? '<' : gWert > kgAlsG ? '>' : '='
        const choices = shuffleChoices(rng, ['<', '>', '='], relation)
        return choicePickTask({
          question: `Ein Paket wiegt ${gWert} g, ein anderes Paket wiegt ${kgCompare} kg. Vergleiche: ${gWert} g ___ ${kgCompare} kg.`,
          choices,
          correct: relation,
          solution: relation,
          explanation: `${kgCompare} kg = ${kgAlsG} g. Vergleich: ${gWert} g ${relation} ${kgAlsG} g.`,
          instruction: 'Setze das passende Zeichen:',
          dedupeKey: `masse-vergleich:${gWert}-${kgCompare}`,
        })
      },
    ),
  }),

  // ---------------------------------------------------------------------
  // 9) Zeiteinheiten im Alltag
  // ---------------------------------------------------------------------
  asNeuTopic('k5-umrechnen-zeit', {
    id: 'k5-umrechnen-zeit__neu',
    title: 'Zeiteinheiten im Alltag — Sachaufgaben & Vergleiche',
    hint: 'Merke: 1 h = 60 min. Rechne beide Zeitspannen in dieselbe Einheit um, bevor du vergleichst.',
    pointsPerTask: 10,
    difficulty: 2,
    keywords: ['Zeiteinheiten', 'Zeit', 'Minuten', 'Stunden', 'umrechnen', 'Alltag', 'vergleichen'],
    fachwissen: {
      text: 'Zeiteinheiten bauen nicht im Zehnersystem auf: 1 min = 60 s, 1 h = 60 min. Der Umrechnungsfaktor ist 60 (nicht 10). Kleinere Einheit → größere: dividieren durch den Faktor; größere → kleinere: multiplizieren. Beim Zusammenrechnen gleich langer Abschnitte entsteht oft eine Minutenzahl, die du so in Stunden umrechnest.',
      quelle: 'Wikipedia: Zeit',
      url: 'https://de.wikipedia.org/wiki/Zeit',
    },
    generate: mixedVariants(
      // Variant 1: Tippen — Trainingszeit pro Woche in Stunden
      (rng: Rng) => {
        const tageProWoche = randInt(rng, 2, 5)
        const minProTag = pick(rng, [30, 45, 60, 90])
        const gesamtMin = tageProWoche * minProTag
        const value = roundTo(gesamtMin / 60, 2)
        return valueTask({
          question: `Lea trainiert an ${tageProWoche} Tagen pro Woche jeweils ${minProTag} Minuten. Wie viele Stunden trainiert sie insgesamt pro Woche?`,
          unit: 'h',
          answerKind: 'decimal',
          value,
          eps: 0.01,
          solution: `${formatDe(value)} h`,
          explanation: `Gesamtzeit: ${tageProWoche} · ${minProTag} min = ${gesamtMin} min. Umrechnen in Stunden: ${gesamtMin} : 60 = ${formatDe(value)} h.`,
          dedupeKey: `zeit-training:${tageProWoche}-${minProTag}`,
        })
      },
      // Variant 2: MC — welche Zeitspanne ist länger?
      (rng: Rng) => {
        const minWert = pick(rng, [80, 90, 100, 110, 120, 130, 140, 150, 160, 170])
        // Nie 1 Stunde (Singular, trivial): 1,5 und mehr Stunden stehen immer im Plural.
        const hWert = pick(rng, [1.5, 2, 2.5, 3])
        const hAlsMin = hWert * 60
        const correct = minWert > hAlsMin ? `${minWert} Minuten` : minWert < hAlsMin ? `${formatDe(hWert)} Stunden` : 'gleich lang'
        const choices = shuffleChoices(rng, [`${minWert} Minuten`, `${formatDe(hWert)} Stunden`, 'gleich lang'], correct)
        return choicePickTask({
          question: `Welche Zeitspanne ist länger: ${minWert} Minuten oder ${formatDe(hWert)} Stunden?`,
          choices,
          correct,
          solution: correct,
          explanation: `${formatDe(hWert)} h = ${hAlsMin} min. Vergleich mit ${minWert} min: ${
            minWert === hAlsMin
              ? 'Beide Zeitspannen sind gleich lang.'
              : minWert > hAlsMin
                ? `${minWert} Minuten sind länger.`
                : `${formatDe(hWert)} Stunden sind länger.`
          }`,
          instruction: 'Tippe die richtige Antwort:',
          dedupeKey: `zeit-vergleich-dauer:${minWert}-${hWert}`,
        })
      },
      // Variant 3: MC — Vergleich gemischte Einheit vs. Minuten mit <, >, =
      (rng: Rng) => {
        const hPart = randInt(rng, 2, 3)
        const minPart = pick(rng, [15, 30, 45])
        const baseMin = hPart * 60 + minPart
        const compareMin = baseMin + pick(rng, [-20, -10, 0, 10, 20])
        const relation = baseMin < compareMin ? '<' : baseMin > compareMin ? '>' : '='
        const choices = shuffleChoices(rng, ['<', '>', '='], relation)
        return choicePickTask({
          question: `Ein Film dauert ${hPart} h ${minPart} min, ein Fernsehabend dauert ${compareMin} min. Vergleiche: ${hPart} h ${minPart} min ___ ${compareMin} min.`,
          choices,
          correct: relation,
          solution: relation,
          explanation: `${hPart} h ${minPart} min = ${baseMin} min. Vergleich: ${baseMin} min ${relation} ${compareMin} min.`,
          instruction: 'Setze das passende Zeichen:',
          dedupeKey: `zeit-vergleich-gemischt:${hPart}-${minPart}-${compareMin}`,
        })
      },
      // Variant 4: Uhr — Endzeit nach einer Dauer an der Uhr einstellen
      (rng: Rng) => {
        // Jede Szene nur mit Uhrzeiten und Dauern, die dort realistisch sind.
        const szene = pick(rng, [
          { id: 'bus', hours: [6, 7, 8], dauer: [20, 25, 35, 40, 50], satz: (s: string, d: number) => `Der Bus fährt morgens um ${s} Uhr ab. Die Fahrt dauert ${d} Minuten. Zeige an der Uhr, wann der Bus ankommt.` },
          { id: 'film', hours: [3, 4, 5, 6, 7], minuten: [0, 15, 30, 45], dauer: [85, 90, 95, 105, 115], satz: (s: string, d: number, tz: string) => `Der Film beginnt ${tz} um ${s} Uhr und läuft ${d} Minuten. Zeige an der Uhr, wann er zu Ende ist.` },
          { id: 'kuchen', hours: [2, 3, 4], dauer: [35, 40, 45, 50, 55, 60], satz: (s: string, d: number, tz: string) => `Ein Kuchen kommt ${tz} um ${s} Uhr in den Ofen und muss ${d} Minuten backen. Zeige an der Uhr, wann er fertig ist.` },
          { id: 'training', hours: [4, 5, 6], minuten: [0, 15, 30, 45], dauer: [45, 60, 75, 90], satz: (s: string, d: number, tz: string) => `Das Fußballtraining beginnt ${tz} um ${s} Uhr und dauert ${d} Minuten. Zeige an der Uhr, wann es endet.` },
          { id: 'hausaufgaben', hours: [2, 3, 4], dauer: [25, 30, 35, 40, 45], satz: (s: string, d: number, tz: string) => `Mia beginnt ${tz} um ${s} Uhr mit den Hausaufgaben und braucht ${d} Minuten dafür. Zeige an der Uhr, wann sie fertig ist.` },
        ])
        const startH = pick(rng, szene.hours)
        // Uhrzeiten ohne Tageszeit sind auf einer 12-Stunden-Uhr mehrdeutig.
        const tageszeit = startH >= 6 && szene.id !== 'bus' ? 'abends' : szene.id === 'bus' ? 'morgens' : 'nachmittags'
        const minutenPool = szene.minuten ?? [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
        let startM = pick(rng, minutenPool)
        let d = pick(rng, szene.dauer)
        // 12:00 ist die Startstellung der Uhr und darf keine Lösung sein.
        while ((startH * 60 + startM + d) % 720 === 0) {
          startM = pick(rng, minutenPool.filter((m) => m !== 0))
          d = pick(rng, szene.dauer)
        }
        const total = startH * 60 + startM + d
        const end = { h: Math.floor(total / 60) % 12, m: total % 60 }
        const sum = startM + d
        const endHour = end.h === 0 ? 12 : end.h
        const calc =
          sum < 60
            ? `Zu den ${startM} Minuten der Startzeit kommen ${d} Minuten Dauer dazu: ${startM} + ${d} = ${sum} Minuten. Das ist weniger als eine Stunde, die Stunde bleibt ${startH}.`
            : `Zu den ${startM} Minuten der Startzeit kommen ${d} Minuten Dauer dazu: ${startM} + ${d} = ${sum} Minuten = ${Math.floor(sum / 60)} h ${sum % 60} min. Zur Stunde ${startH} kommen ${Math.floor(sum / 60)} h dazu.`
        const nextHour = endHour === 12 ? 1 : endHour + 1
        const hourHandText =
          end.m === 0
            ? `steht genau auf der ${endHour}`
            : end.m < 30
              ? `steht ein Stück hinter der ${endHour}`
              : end.m === 30
                ? `steht genau in der Mitte zwischen der ${endHour} und der ${nextHour}`
                : end.m < 45
                  ? `steht schon hinter der Mitte zwischen der ${endHour} und der ${nextHour}`
                  : `steht kurz vor der ${nextHour}`
        return clockTask({
          question: szene.satz(ckFormatTime({ h: startH, m: startM }), d, tageszeit),
          mode: 'setTime',
          time: end,
          solution: `${ckFormatTime(end)} Uhr`,
          explanation: `${calc} Das Ende ist also um ${ckFormatTime(end)} Uhr. Auf der Uhr zeigt der Minutenzeiger dann auf die ${end.m === 0 ? 12 : end.m / 5}, der Stundenzeiger ${hourHandText}.`,
          instruction: 'Stelle die Uhr auf die gesuchte Uhrzeit ein. Der kurze Zeiger zeigt die Stunde, der lange die Minuten.',
          dedupeKey: `zeit-uhr-dauer:${szene.id}-${startH}-${startM}-${d}`,
        })
      },
      // Variant 5: Uhr — eine Uhrzeit in Worten ("Viertel nach 3") an der Uhr einstellen
      (rng: Rng) => {
        const hour = randInt(rng, 1, 12)
        const prev = hour === 1 ? 12 : hour - 1
        const forms = [
          { key: 'viertel-nach', label: `Viertel nach ${hour}`, h: hour, m: 15, sinn: `15 Minuten nach ${hour} Uhr` },
          { key: 'fuenf-nach', label: `fünf nach ${hour}`, h: hour, m: 5, sinn: `5 Minuten nach ${hour} Uhr` },
          { key: 'zwanzig-nach', label: `zwanzig nach ${hour}`, h: hour, m: 20, sinn: `20 Minuten nach ${hour} Uhr` },
          { key: 'halb', label: `halb ${hour}`, h: prev, m: 30, sinn: `eine halbe Stunde vor ${hour} Uhr` },
          { key: 'viertel-vor', label: `Viertel vor ${hour}`, h: prev, m: 45, sinn: `15 Minuten vor ${hour} Uhr` },
          { key: 'zehn-vor', label: `zehn vor ${hour}`, h: prev, m: 50, sinn: `10 Minuten vor ${hour} Uhr` },
          { key: 'fuenf-vor-halb', label: `fünf vor halb ${hour}`, h: prev, m: 25, sinn: `5 Minuten vor halb ${hour}` },
          { key: 'fuenf-nach-halb', label: `fünf nach halb ${hour}`, h: prev, m: 35, sinn: `5 Minuten nach halb ${hour}` },
        ]
        const f = pick(rng, forms)
        const t = { h: f.h % 12, m: f.m }
        const shown = t.h === 0 ? 12 : t.h
        const next = shown === 12 ? 1 : shown + 1
        return clockTask({
          question: `Es ist ${f.label}. Zeige diese Uhrzeit an der Uhr.`,
          mode: 'setTime',
          time: t,
          solution: `${ckFormatTime(t)} Uhr`,
          explanation: `„${f.label}“ bedeutet ${f.sinn}, also ${ckFormatTime(t)} Uhr. Der Minutenzeiger zeigt auf die ${f.m / 5}, der Stundenzeiger steht zwischen der ${shown} und der ${next}.`,
          instruction: 'Stelle die Uhr auf die gesuchte Uhrzeit ein. Der kurze Zeiger zeigt die Stunde, der lange die Minuten.',
          dedupeKey: `zeit-uhr-worte:${f.key}-${hour}`,
        })
      },
    ),
  }),
]

export const math5NeuTopics: Topic[] = [
  ...math5NeuLb1,
  ...math5NeuLb2,
  ...math5NeuLb3,
  ...math5NeuLb4,
  ...math5NeuLb5,
]
