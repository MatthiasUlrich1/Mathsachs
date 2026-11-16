/**
 * Würfelnetze (Klasse 6, LB 4): händisch formulierte Aufgabentypen auf Basis aller 35 Sechser-Figuren
 * (Hexominos). Ob eine Figur ein Würfelnetz ist, wird durch echtes Abrollen eines Würfels geprüft
 * (jede Quadratfläche des Netzes muss eine andere Würfelseite werden) — nicht durch eine feste Liste.
 * Gegenüberliegende Flächen ergeben sich aus demselben Abrollen.
 */
import { pick, randInt, type Rng } from '../lib/rng'
import { choicePickTask, valueTask } from './taskHelpers'
import type { Task } from './types'

/** Quadrat im Netz: [Spalte, Zeile]; Zeilen wachsen nach unten. */
export type NetCell = readonly [number, number]

const key = (c: NetCell): string => `${c[0]},${c[1]}`

function normalize(cells: readonly NetCell[]): NetCell[] {
  const minC = Math.min(...cells.map((c) => c[0]))
  const minR = Math.min(...cells.map((c) => c[1]))
  return cells
    .map((c): NetCell => [c[0] - minC, c[1] - minR])
    .sort((a, b) => a[1] - b[1] || a[0] - b[0])
}

const signature = (cells: readonly NetCell[]): string => normalize(cells).map(key).join(';')

const TRANSFORMS: Array<(c: NetCell) => NetCell> = [
  (c) => [c[0], c[1]],
  (c) => [-c[1], c[0]],
  (c) => [-c[0], -c[1]],
  (c) => [c[1], -c[0]],
  (c) => [-c[0], c[1]],
  (c) => [c[1], c[0]],
  (c) => [c[0], -c[1]],
  (c) => [-c[1], -c[0]],
]

/** Kennung der Figur bis auf Drehung/Spiegelung (gleiche Form = gleiche Kennung). */
export function netClassId(cells: readonly NetCell[]): string {
  return TRANSFORMS.map((t) => signature(cells.map(t))).sort()[0]!
}

/**
 * Würfel abrollen: Seiten 0..5 mit Gegenstücken (0,1), (2,3), (4,5).
 * Liefert je Quadrat die Würfelseite, die dort auf dem Tisch liegt — oder null, wenn eine Seite
 * doppelt vorkommt (kein Würfelnetz) bzw. die Figur nicht zusammenhängt.
 */
export function foldNet(cells: readonly NetCell[]): number[] | null {
  if (cells.length !== 6) return null
  const index = new Map(cells.map((c, i) => [key(c), i]))
  const faceAt: Array<number | undefined> = new Array(6).fill(undefined)
  type Die = { top: number; bottom: number; north: number; south: number; east: number; west: number }
  const start: Die = { top: 0, bottom: 1, north: 2, south: 3, east: 4, west: 5 }
  const visit = (i: number, die: Die): void => {
    faceAt[i] = die.bottom
    const [c, r] = cells[i]!
    const moves: Array<[number, number, (d: Die) => Die]> = [
      [1, 0, (d) => ({ top: d.west, east: d.top, bottom: d.east, west: d.bottom, north: d.north, south: d.south })],
      [-1, 0, (d) => ({ top: d.east, west: d.top, bottom: d.west, east: d.bottom, north: d.north, south: d.south })],
      [0, -1, (d) => ({ top: d.south, north: d.top, bottom: d.north, south: d.bottom, east: d.east, west: d.west })],
      [0, 1, (d) => ({ top: d.north, south: d.top, bottom: d.south, north: d.bottom, east: d.east, west: d.west })],
    ]
    for (const [dc, dr, roll] of moves) {
      const j = index.get(key([c + dc, r + dr]))
      if (j === undefined || faceAt[j] !== undefined) continue
      visit(j, roll(die))
    }
  }
  visit(0, start)
  if (faceAt.some((f) => f === undefined)) return null
  const faces = faceAt as number[]
  return new Set(faces).size === 6 ? faces : null
}

export const isCubeNet = (cells: readonly NetCell[]): boolean => foldNet(cells) !== null

/** Gegenüberliegende Seite einer Würfelseite. */
export const oppositeFace = (face: number): number => face ^ 1

/** Alle 216 Sechser-Figuren (bis auf Verschiebung), durch Anwachsen aus einem Quadrat. */
function enumerateHexominoes(): NetCell[][] {
  let level = new Map<string, NetCell[]>([['0,0', [[0, 0]]]])
  for (let size = 2; size <= 6; size++) {
    const next = new Map<string, NetCell[]>()
    for (const cells of level.values()) {
      const have = new Set(cells.map(key))
      for (const [c, r] of cells) {
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const cand: NetCell = [c + dc, r + dr]
          if (have.has(key(cand))) continue
          const grown = normalize([...cells, cand])
          next.set(signature(grown), grown)
        }
      }
    }
    level = next
  }
  return [...level.values()]
}

let hexCache: { valid: NetCell[][]; invalid: NetCell[][] } | null = null

function hexominoes(): { valid: NetCell[][]; invalid: NetCell[][] } {
  if (!hexCache) {
    const all = enumerateHexominoes()
    hexCache = { valid: all.filter(isCubeNet), invalid: all.filter((h) => !isCubeNet(h)) }
  }
  return hexCache
}

/** Alle Lagen (Drehungen/Spiegelungen) der 11 Würfelnetze und der 24 Nicht-Netze. */
export function allNetShapes(): { valid: NetCell[][]; invalid: NetCell[][] } {
  return hexominoes()
}

const classCount = (shapes: NetCell[][]): number => new Set(shapes.map(netClassId)).size
export const netClassCounts = (): { valid: number; invalid: number } => ({
  valid: classCount(hexominoes().valid),
  invalid: classCount(hexominoes().invalid),
})

/** Eine zufällige Lage einer zufälligen Form (gleichverteilt über die Formen, nicht über die Lagen). */
function randomShape(rng: Rng, valid: boolean): NetCell[] {
  const pool = valid ? hexominoes().valid : hexominoes().invalid
  const byClass = new Map<string, NetCell[][]>()
  for (const s of pool) {
    const id = netClassId(s)
    byClass.set(id, [...(byClass.get(id) ?? []), s])
  }
  const classes = [...byClass.keys()].sort()
  const chosen = byClass.get(pick(rng, classes))!
  return chosen[randInt(rng, 0, chosen.length - 1)]!
}

/** Fisher-Yates über den übergebenen rng. */
function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i)
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

/* --------------------------------- SVG ---------------------------------- */

const FILL = '#bbdefb'
const STROKE = '#1565c0'
const MARK = '#ffe0b2'
const TEXT = '#0f172a'

interface NetSvgOptions {
  cell?: number
  /** Buchstabe je Quadrat (gleiche Reihenfolge wie `cells`). */
  letters?: readonly string[]
  /** Quadrate (Index), die farbig hervorgehoben werden. */
  marked?: readonly number[]
  /** Beschriftung unter der Figur (z. B. „A“). */
  label?: string
  /** Hinweis neben dem Netz (z. B. Kantenlänge). */
  note?: string
}

/** Zeichnet ein Netz als Gitter aus Einheitsquadraten. */
export function netCellsSvg(cells: readonly NetCell[], opts: NetSvgOptions = {}): string {
  const cell = opts.cell ?? 30
  const pad = 10
  const maxC = Math.max(...cells.map((c) => c[0]))
  const maxR = Math.max(...cells.map((c) => c[1]))
  const labelH = opts.label ? 24 : 0
  const w = pad * 2 + (maxC + 1) * cell
  const h = pad * 2 + (maxR + 1) * cell + labelH
  const rects = cells
    .map(([c, r], i) => {
      const x = pad + c * cell
      const y = pad + r * cell
      const fill = opts.marked?.includes(i) ? MARK : FILL
      const letter = opts.letters?.[i]
      const text = letter
        ? `<text x="${x + cell / 2}" y="${y + cell / 2 + 6}" text-anchor="middle" font-size="17" font-weight="bold" fill="${TEXT}">${letter}</text>`
        : ''
      return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${fill}" stroke="${STROKE}" stroke-width="2"/>${text}`
    })
    .join('\n  ')
  const lab = opts.label
    ? `<text x="${w / 2}" y="${h - 6}" text-anchor="middle" font-size="15" font-weight="bold" fill="#f8fafc" stroke="#0f172a" stroke-width="3.5" paint-order="stroke" stroke-linejoin="round">${opts.label}</text>`
    : ''
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">\n  ${rects}\n  ${lab}\n</svg>`
}

const optionsRow = (svgs: string[]): string =>
  `<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:flex-end">${svgs.join('')}</div>`

/* ------------------------------- Aufgaben ------------------------------- */

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

/** Drei Figuren (je zufällige Form); `validCount` davon sind Würfelnetze, Reihenfolge gemischt. */
function threeOptions(rng: Rng, validCount: number): Array<{ cells: NetCell[]; valid: boolean; label: string }> {
  for (let attempt = 0; attempt < 50; attempt++) {
    const picks = shuffle(rng, [...Array(3)].map((_, i) => i < validCount))
    const opts = picks.map((valid, i) => ({ cells: randomShape(rng, valid), valid, label: LETTERS[i]! }))
    if (new Set(opts.map((o) => netClassId(o.cells))).size === 3) return opts
  }
  throw new Error('cubeNetTasks: keine drei verschiedenen Figuren gefunden')
}

const optionsKey = (opts: Array<{ cells: NetCell[] }>): string =>
  opts.map((o) => netClassId(o.cells)).sort().join('|')

/** „Welches der drei Netze lässt sich zu einem Würfel falten?“ mit beliebigen Figuren. */
export function cubeNetPickValidTask(rng: Rng): Task {
  const opts = threeOptions(rng, 1)
  const correct = opts.find((o) => o.valid)!.label
  return choicePickTask({
    question: 'Welches der drei Netze lässt sich zu einem Würfel falten?',
    choices: ['A', 'B', 'C'],
    correct,
    solution: correct,
    explanation: `Nur Netz ${correct} lässt sich falten: Rolle einen Würfel über die Quadrate. Bei den anderen Figuren käme eine Würfelseite doppelt vor, während eine andere fehlt.`,
    visualContent: optionsRow(opts.map((o) => netCellsSvg(o.cells, { label: o.label }))),
    instruction: 'Tippe den Buchstaben des faltbaren Netzes:',
    dedupeKey: `netfalt:${optionsKey(opts)}`,
  })
}

/** „Wie viele der drei Figuren sind Würfelnetze?“ (0 bis 3). */
export function cubeNetCountValidTask(rng: Rng): Task {
  const validCount = randInt(rng, 0, 3)
  const opts = threeOptions(rng, validCount)
  const answer = String(validCount)
  return choicePickTask({
    question: 'Wie viele der drei abgebildeten Figuren lassen sich zu einem Würfel falten?',
    choices: ['0', '1', '2', '3'],
    correct: answer,
    solution: answer,
    explanation:
      validCount === 0
        ? 'Keine der Figuren ist ein Würfelnetz: Bei jeder würden sich beim Falten zwei Quadrate überdecken.'
        : `Faltbar ${validCount === 1 ? 'ist nur Netz' : 'sind die Netze'} ${opts.filter((o) => o.valid).map((o) => o.label).join(' und ')}. Prüfe jede Figur, indem du dir die Quadrate um einen Würfel gewickelt vorstellst.`,
    visualContent: optionsRow(opts.map((o) => netCellsSvg(o.cells, { label: o.label }))),
    instruction: 'Tippe die Anzahl:',
    dedupeKey: `netcount:${optionsKey(opts)}`,
  })
}

/** Netz mit Buchstaben A–F; „Welche Fläche liegt gegenüber von X?“ */
export function cubeNetOppositeTask(rng: Rng): Task {
  const cells = randomShape(rng, true)
  const faces = foldNet(cells)!
  const order = shuffle(rng, [0, 1, 2, 3, 4, 5])
  const letters = order.map((i) => LETTERS[i]!)
  const target = randInt(rng, 0, 5)
  const targetFace = faces[target]!
  const answerIndex = faces.indexOf(oppositeFace(targetFace))
  const answer = letters[answerIndex]!
  const choices = LETTERS.filter((l) => l !== letters[target])
  return choicePickTask({
    question: `Das abgebildete Netz wird zu einem Würfel gefaltet. Welche Fläche liegt der Fläche ${letters[target]} gegenüber?`,
    choices: [...choices],
    correct: answer,
    solution: answer,
    explanation: `Wickelt man das Netz um den Würfel, liegen ${letters[target]} und ${answer} einander gegenüber. Gegenüberliegende Flächen sind im Netz nie direkte Nachbarn, denn Nachbarn im Netz werden zu Flächen, die an einer Kante zusammenstoßen.`,
    visualContent: netCellsSvg(cells, { letters }),
    instruction: 'Tippe den Buchstaben der gegenüberliegenden Fläche:',
    dedupeKey: `netopp:${netClassId(cells)}:${letters.join('')}:${letters[target]}`,
  })
}

/** Zwei markierte Flächen: gegenüber oder Nachbarn? Antworten gleich häufig. */
export function cubeNetMarkedPairTask(rng: Rng): Task {
  const wantOpposite = rng() < 0.5
  for (let attempt = 0; attempt < 100; attempt++) {
    const cells = randomShape(rng, true)
    const faces = foldNet(cells)!
    const a = randInt(rng, 0, 5)
    const b = randInt(rng, 0, 5)
    if (a === b) continue
    const opposite = oppositeFace(faces[a]!) === faces[b]
    if (opposite !== wantOpposite) continue
    const answer = opposite ? 'Gegenüber' : 'Nebeneinander'
    const [p, q] = [a, b].sort((x, y) => x - y)
    const letters = cells.map((_, i) => (i === p ? 'P' : i === q ? 'Q' : ''))
    return choicePickTask({
      question: 'Das Netz wird zu einem Würfel gefaltet. Wie liegen die Flächen P und Q danach zueinander?',
      choices: ['Gegenüber', 'Nebeneinander'],
      correct: answer,
      solution: answer,
      explanation: opposite
        ? 'P und Q liegen im gefalteten Würfel einander gegenüber: Rollt man einen Würfel über das Netz, landen P und Q auf gegenüberliegenden Seiten. Sie haben dann keine gemeinsame Kante.'
        : 'P und Q stoßen im gefalteten Würfel an einer gemeinsamen Kante zusammen, sie liegen also nebeneinander und nicht gegenüber.',
      visualContent: netCellsSvg(cells, { letters, marked: [p!, q!] }),
      instruction: 'Wähle die richtige Antwort:',
      dedupeKey: `netpq:${netClassId(cells)}:${p}:${q}`,
    })
  }
  throw new Error('cubeNetTasks: kein passendes Flächenpaar gefunden')
}

/** Rand eines Würfelnetzes: immer 14 Quadratseiten (5 Verbindungskanten sparen je 2 Seiten ein). */
export function cubeNetPerimeterTask(rng: Rng): Task {
  const cells = randomShape(rng, true)
  const a = randInt(rng, 2, 9)
  const value = 14 * a
  return valueTask({
    question: `Alle Quadrate des abgebildeten Würfelnetzes haben die Seitenlänge ${a} cm. Wie lang ist der gesamte Rand des Netzes?`,
    unit: 'cm',
    answerKind: 'integer',
    value,
    solution: `${value} cm`,
    explanation: `Sechs Quadrate haben zusammen 6 · 4 = 24 Seiten. Im Netz hängen sie an 5 Kanten zusammen; jede davon verdeckt 2 Seiten. Der Rand besteht also aus 24 − 10 = 14 Seiten: 14 · ${a} cm = ${value} cm.`,
    visualContent: netCellsSvg(cells, { cell: 26 }),
    dedupeKey: `netrand:${a}`,
  })
}

/** Wie viele Kanten muss man aufschneiden, damit der Würfel flach liegt? */
export function cubeNetCutEdgesTask(): Task {
  return valueTask({
    question:
      'Ein Würfel aus Pappe wird entlang von Kanten aufgeschnitten und so flach ausgebreitet, dass ein zusammenhängendes Netz entsteht. Entlang wie vieler Kanten muss man dazu mindestens schneiden?',
    answerKind: 'integer',
    value: 7,
    solution: '7',
    explanation:
      'Ein Würfel hat 12 Kanten. Damit sechs Quadrate ein zusammenhängendes Netz bilden, müssen sie durch genau 5 Kanten verbunden bleiben. Es werden also 12 − 5 = 7 Kanten durchgeschnitten.',
    dedupeKey: 'netcut',
  })
}
