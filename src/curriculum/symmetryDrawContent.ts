/**
 * Hand-designed figures for the symmetry drawing task (symmetryDrawTask) in the locked __neu topics
 * lb3-achsensymmetrie__neu (vertical and horizontal axis) and lb3-punktsymmetrie__neu (two separate figure pools).
 * Every figure is a picture in `art` ('#' = given cell, row by row); the mirror image is computed by the helper.
 * The pools are disjoint on purpose (rule 0b): no figure and no dedupeKey occurs in two variants.
 */
import { pick, type Rng } from '../lib/rng'
import { symCellsFromArt, type SymAxis, type SymPoint } from '../lib/symmetryDrawLogic'
import { symmetryDrawTask } from './interactionTaskHelpers'
import type { Task } from './types'

export interface SymFigure {
  /** Stable id used in the dedupeKey (never shown to the learner). */
  id: string
  cols: number
  rows: number
  art: string[]
  /** Vertical/horizontal axis: grid line index. */
  at?: number
  /** Point symmetry: the centre. */
  point?: SymPoint
  /** Hand-written hint for the explanation: what happens to the distinctive part of this figure. */
  tip: string
}

export const SYM_VERTICAL_FIGURES: SymFigure[] = [
  {
    id: 'haus',
    cols: 8,
    rows: 7,
    at: 4,
    art: ['...#....', '..##....', '.###....', '####....', '.###....', '.##.....', '.##.....'],
    tip: 'Die Dachspitze liegt direkt an der Achse, ihr Bild also direkt auf der anderen Seite. Die Dachkante ganz links hat 4 Felder Abstand zur Achse, ihr Bild ganz rechts ebenfalls.',
  },
  {
    id: 'pfeil-hoch',
    cols: 8,
    rows: 7,
    at: 4,
    art: ['...#....', '..##....', '.###....', '####....', '...#....', '...#....', '...#....'],
    tip: 'Der Pfeilschaft grenzt an die Achse. Die Spitze des Pfeils bleibt in der obersten Zeile, nur die Spalten werden getauscht.',
  },
  {
    id: 'buchstabe-t',
    cols: 8,
    rows: 5,
    at: 4,
    art: ['.###....', '...#....', '...#....', '...#....', '...#....'],
    tip: 'Der Balken oben ist links 3 Felder lang, rechts kommen 3 Felder dazu. Der Strich in der Mitte besteht aus zwei Feldern nebeneinander.',
  },
  {
    id: 'krone',
    cols: 8,
    rows: 5,
    at: 4,
    art: ['#..#....', '##.#....', '####....', '####....'],
    tip: 'Jede Zacke hat ihr Bild im gleichen Abstand auf der anderen Seite: die Zacke ganz links gehört zur Zacke ganz rechts.',
  },
  {
    id: 'treppenturm',
    cols: 8,
    rows: 7,
    at: 4,
    art: ['...#....', '...#....', '..##....', '..##....', '.###....', '.###....', '####....'],
    tip: 'Jede Stufe wird zur Stufe auf der anderen Seite. Die unterste Zeile ist am längsten, weil sie am weitesten von der Achse wegreicht.',
  },
  {
    id: 'fahne',
    cols: 9,
    rows: 6,
    at: 3,
    art: ['###......', '###......', '#........', '#........', '#........', '#........'],
    tip: 'Die Achse liegt nicht in der Mitte des Gitters. Der Mast ganz links hat 3 Felder Abstand zur Achse, sein Bild steht daher 3 Felder rechts von ihr, und rechts davon bleibt Platz frei.',
  },
]

export const SYM_HORIZONTAL_FIGURES: SymFigure[] = [
  {
    id: 'segelboot',
    cols: 7,
    rows: 8,
    at: 4,
    art: ['..#....', '..##...', '..###..', '#######'],
    tip: 'Der Rumpf des Boots steht direkt an der Achse, das Spiegelbild hängt darunter. Das Segel zeigt im Bild nach unten.',
  },
  {
    id: 'tanne',
    cols: 7,
    rows: 8,
    at: 4,
    art: ['...#...', '..###..', '.#####.', '...#...'],
    tip: 'Der Stamm grenzt an die Achse, die Spitze ist am weitesten entfernt. Im Bild liegt die Spitze ganz unten.',
  },
  {
    id: 'treppe',
    cols: 7,
    rows: 8,
    at: 4,
    art: ['......#', '.....##', '....###', '...####'],
    tip: 'Die längste Reihe grenzt an die Achse. Die kürzeste Reihe ist am weitesten weg, ihr Bild ist die unterste Reihe.',
  },
  {
    id: 'burgmauer',
    cols: 7,
    rows: 6,
    at: 3,
    art: ['#.#.#.#', '#######', '#######'],
    tip: 'Die Zinnen oben sind am weitesten von der Achse entfernt, ihr Bild liegt ganz unten. Die zwei vollen Reihen grenzen an die Achse.',
  },
  {
    id: 'pfeil-rechts',
    cols: 8,
    rows: 8,
    at: 4,
    art: ['....#...', '....##..', '....###.', '########'],
    tip: 'Die Achse läuft durch die Mitte des Pfeils. Die obere Hälfte des Pfeilkopfs wird zur unteren Hälfte, die Spitze bleibt in der letzten Spalte.',
  },
]

export const SYM_POINT_FIGURES_A: SymFigure[] = [
  {
    id: 'buchstabe-z',
    cols: 8,
    rows: 8,
    point: { x: 4, y: 4 },
    art: ['........', '.######.', '....##..', '...##...'],
    tip: 'Der obere Querbalken wird zum unteren Querbalken, aber seitenverkehrt herum: Sein linkes Ende liegt im Bild rechts unten.',
  },
  {
    id: 'buchstabe-n',
    cols: 8,
    rows: 8,
    point: { x: 4, y: 4 },
    art: ['........', '.#....#.', '.##...#.', '.#.#..#.'],
    tip: 'Der linke Strich wird zum rechten Strich, der rechte zum linken. Die schräge Verbindung läuft im Bild weiter bis nach rechts unten.',
  },
  {
    id: 'haken',
    cols: 10,
    rows: 6,
    point: { x: 6, y: 3 },
    art: ['..#.......', '..#.......', '..###.....'],
    tip: 'Der Punkt liegt nicht in der Mitte des Gitters. Zähle für jedes Feld, wie viele Felder es vom Punkt entfernt ist (nach links und nach oben), und gehe genauso weit in die Gegenrichtung (nach rechts und nach unten).',
  },
]

export const SYM_POINT_FIGURES_B: SymFigure[] = [
  {
    id: 'zickzack',
    cols: 8,
    rows: 8,
    point: { x: 4, y: 4 },
    art: ['........', '.##.....', '..##....', '...##...'],
    tip: 'Die Zickzacklinie läuft von links oben bis zur Mitte. Ihr Bild läuft von der Mitte weiter nach rechts unten.',
  },
  {
    id: 'rotor',
    cols: 8,
    rows: 8,
    point: { x: 4, y: 4 },
    art: ['........', '..##....', '...#....', '...#....'],
    tip: 'Das Feld links oben am Rotorblatt liegt im Bild rechts unten. Der markierte Punkt in der Mitte ist das Drehzentrum und bleibt, wo er ist.',
  },
  {
    id: 'winkelhaken',
    cols: 8,
    rows: 8,
    point: { x: 4, y: 4 },
    art: ['........', '...#....', '...#....', '.###....'],
    tip: 'Die Ecke des Winkels liegt unten rechts. Im Bild liegt sie oben links, und die beiden Schenkel zeigen nach unten und nach rechts, denn bei der Punktspiegelung wird alles um 180 Grad gedreht.',
  },
]

/** Cell list of a figure, optionally mirrored left-right (x) or top-bottom (y) so the figure sits on the other side of the axis. */
const figureCells = (f: SymFigure, flip: 'x' | 'y' | null): string[] =>
  symCellsFromArt(f.art).map((c) => {
    const [x, y] = c.split(',').map(Number) as [number, number]
    return flip === 'x' ? `${f.cols - 1 - x},${y}` : flip === 'y' ? `${x},${f.rows - 1 - y}` : c
  })

/** "(Spalte|Zeile)" list, counted from 1 like the aria labels of the widget. */
const mirrorList = (target: readonly string[]): string =>
  target
    .map((c) => {
      const [x, y] = c.split(',').map(Number) as [number, number]
      return `(${x + 1}|${y + 1})`
    })
    .join(', ')

const taskFor = (f: SymFigure, flip: 'x' | 'y' | null, axis: SymAxis | undefined, question: string, key: string, how: string): Task => {
  const task = symmetryDrawTask({
    question,
    cols: f.cols,
    rows: f.rows,
    given: figureCells(f, flip),
    ...(axis ? { axis } : { point: f.point }),
    solution: '-',
    explanation: '-',
    dedupeKey: key,
  })
  const target = (task.sampleAnswer as { cells: string[] }).cells
  return {
    ...task,
    solution: `${target.length} Felder (Spalte|Zeile): ${mirrorList(target)}`,
    explanation: `${how} ${f.tip}`,
  }
}

const axisHow =
  'Bei der Spiegelung an einer Achse liegt jedes Feld genauso weit von der Achse entfernt wie sein Bildfeld, nur auf der anderen Seite. Entlang der Achse bleibt es an derselben Stelle.'

/** Variant: complete a figure at a vertical axis (the figure may be on the left or the right). */
export const symmetryVerticalVariant = (rng: Rng): Task => {
  const f = pick(rng, SYM_VERTICAL_FIGURES)
  const flipped = f.cols === 2 * (f.at as number) && rng() < 0.5
  return taskFor(
    f,
    flipped ? 'x' : null,
    { kind: 'vertical', at: f.at },
    'Die graue Figur ist nur zur Hälfte da. Färbe die Felder so, dass die ganze Figur achsensymmetrisch zur gestrichelten senkrechten Achse wird.',
    `achsensym-zeichnen-senkrecht:${f.id}:${flipped ? 'rechts' : 'links'}`,
    axisHow,
  )
}

/** Variant: complete a figure at a horizontal axis (the figure may be above or below). */
export const symmetryHorizontalVariant = (rng: Rng): Task => {
  const f = pick(rng, SYM_HORIZONTAL_FIGURES)
  const flipped = f.rows === 2 * (f.at as number) && rng() < 0.5
  return taskFor(
    f,
    flipped ? 'y' : null,
    { kind: 'horizontal', at: f.at },
    'Die graue Figur ist nur zur Hälfte da. Färbe die Felder so, dass die ganze Figur achsensymmetrisch zur gestrichelten waagerechten Achse wird.',
    `achsensym-zeichnen-waagerecht:${f.id}:${flipped ? 'unten' : 'oben'}`,
    axisHow,
  )
}

const pointHow =
  'Bei der Punktspiegelung liegt jedes Feld auf der Gegenseite des markierten Punktes, gleich weit entfernt: Zähle die Felder von deinem Feld zum Punkt und gehe genauso weit darüber hinaus.'

/** Variant: point symmetry, letters and hooks. */
export const symmetryPointVariantA = (rng: Rng): Task => {
  const f = pick(rng, SYM_POINT_FIGURES_A)
  return taskFor(
    f,
    null,
    undefined,
    'Die graue Figur ist nur zur Hälfte da. Färbe die Felder so, dass die ganze Figur punktsymmetrisch zum markierten Punkt wird.',
    `punktsym-zeichnen-linien:${f.id}`,
    pointHow,
  )
}

/** Variant: point symmetry, zigzag and rotor patterns (other pool than variant A). */
export const symmetryPointVariantB = (rng: Rng): Task => {
  const f = pick(rng, SYM_POINT_FIGURES_B)
  return taskFor(
    f,
    null,
    undefined,
    'Das markierte Gitterkreuz ist das Symmetriezentrum. Färbe die Felder, die zum Bild der grauen Figur gehören, und mache die Figur so punktsymmetrisch.',
    `punktsym-zeichnen-muster:${f.id}`,
    pointHow,
  )
}
