/**
 * Neu-Themen: gesperrte __neu-Themen nutzen die Symmetrie-Zeichnung (symmetryDrawTask).
 * Klasse 5: Achsensymmetrie (senkrechte und waagerechte Achse), Punktsymmetrie (zwei getrennte Figurengruppen).
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { symLayout, symMaxColsForPhone, symTarget } from '../lib/symmetryDrawLogic'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { math5NeuTopics } from './math5NeuTopics'
import {
  SYM_HORIZONTAL_FIGURES,
  SYM_POINT_FIGURES_A,
  SYM_POINT_FIGURES_B,
  SYM_VERTICAL_FIGURES,
  symmetryHorizontalVariant,
  symmetryPointVariantA,
  symmetryPointVariantB,
  symmetryVerticalVariant,
  type SymFigure,
} from './symmetryDrawContent'
import type { Task, Topic } from './types'

const topicOf = (id: string): Topic => {
  const t = math5NeuTopics.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

const SEEDS = Array.from({ length: 80 }, (_, i) => i * 3 + 1)
const symTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < 14; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'symmetryDraw') out.push(t)
    }
  }
  return out
}
const cellsOf = (t: Task): string[] => (t.sampleAnswer as { cells: string[] }).cells

/** Spoilers: the number of cells or a cell list in the question, a screen-only hint, or mirror cells in the props. Returns findings. */
const spoilers = (t: Task): string[] => {
  const hits: string[] = []
  const n = cellsOf(t).length
  if (new RegExp(String.raw`\b${n}\b`).test(t.question)) hits.push('Frage nennt die Anzahl der Felder')
  if (/\(\d+\|\d+\)/.test(t.question)) hits.push('Frage nennt Felder')
  if (/tippe|klick|zieh|pfeiltaste|knopf/i.test(t.question)) hits.push('Bildschirm-Hinweis in der Frage')
  const props = JSON.stringify(t.interactive!.props)
  for (const c of cellsOf(t)) if (props.includes(`"${c}"`)) hits.push(`Lösungsfeld ${c} in den Props`)
  if (/"(cells|solution|target|mirror)"/.test(props)) hits.push('Lösung in den Props')
  return hits
}

describe('Spoiler-Test kann fehlschlagen (Gegenprobe)', () => {
  const t = symTasks(topicOf('lb3-achsensymmetrie__neu'))[0]!
  it('erkennt Anzahl, Feldliste, Bildschirm-Hinweis und Lösungsfeld in den Props', () => {
    const n = cellsOf(t).length
    expect(spoilers({ ...t, question: `Färbe genau ${n} Felder.` } as Task)).toContain('Frage nennt die Anzahl der Felder')
    expect(spoilers({ ...t, question: 'Färbe (5|2).' } as Task)).toContain('Frage nennt Felder')
    expect(spoilers({ ...t, question: 'Tippe auf Felder.' } as Task)).toContain('Bildschirm-Hinweis in der Frage')
    const leak = { type: 'symmetryDraw', props: { ...t.interactive!.props, given: [...(t.interactive!.props.given as string[]), cellsOf(t)[0]!] } }
    expect(spoilers({ ...t, interactive: leak } as Task).join(' ')).toContain('Lösungsfeld')
    expect(spoilers({ ...t, interactive: { type: 'symmetryDraw', props: { cells: [] } } } as Task)).toContain('Lösung in den Props')
  })
})

const CASES: Array<{ id: string; variants: Array<(rng: ReturnType<typeof createRng>) => Task>; kinds: string[] }> = [
  { id: 'lb3-achsensymmetrie__neu', variants: [symmetryVerticalVariant, symmetryHorizontalVariant], kinds: ['vertical', 'horizontal'] },
  { id: 'lb3-punktsymmetrie__neu', variants: [symmetryPointVariantA, symmetryPointVariantB], kinds: ['point'] },
]

describe.each(CASES)('Neu-Thema Symmetrie $id', (c) => {
  const topic = topicOf(c.id)
  const tasks = symTasks(topic)

  it('bleibt gesperrt und neu', () => {
    expect(topic.released).toBe(false)
    expect(topic.neu).toBe(true)
  })

  it('kommt mit allen Varianten vor, mit dedupeKey, Erklärung, lösbarer sampleAnswer, leerer Start besteht nicht, ohne Spoiler', () => {
    expect(tasks.length).toBeGreaterThan(0)
    const seenKinds = new Set<string>()
    for (const t of tasks) {
      const props = t.interactive!.props
      seenKinds.add(props.point ? 'point' : String((props.axis as { kind: string }).kind))
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.check({ kind: 'symmetryDraw', cells: [] }), t.question).toBe(false)
      const extra = ['0,0', '1,0', '2,0', '3,0'].find((k) => !cellsOf(t).includes(k))!
      expect(t.check({ kind: 'symmetryDraw', cells: [...cellsOf(t), extra] }), t.question).toBe(false)
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      expect(t.explanation.length, t.question).toBeGreaterThan(80)
      expect(t.explanation, t.question).not.toMatch(/\bundefined\b|-$/)
      expect(t.solution, t.question).toMatch(/^\d+ Felder? \(Spalte\|Zeile\): /)
      expect(spoilers(t), t.question).toEqual([])
      expect(t.visualContent, t.question).toBeUndefined()
    }
    expect([...seenKinds].sort()).toEqual([...c.kinds].sort())
  })

  it('die Papierform zeigt das Gitter mit Achse bzw. Punkt', () => {
    for (const t of tasks.slice(0, 40)) {
      const extras = worksheetPrintExtras(t)
      expect(extras.visualHtml, t.question).toContain('<svg')
      expect(extras.visualHtml, t.question).toContain(t.interactive!.props.point ? '<circle' : 'stroke-dasharray')
    }
  })
})

describe('Figuren', () => {
  const pools: Array<[string, SymFigure[], 'vertical' | 'horizontal' | 'point']> = [
    ['senkrecht', SYM_VERTICAL_FIGURES, 'vertical'],
    ['waagerecht', SYM_HORIZONTAL_FIGURES, 'horizontal'],
    ['punkt A', SYM_POINT_FIGURES_A, 'point'],
    ['punkt B', SYM_POINT_FIGURES_B, 'point'],
  ]

  it('jede Gruppe hat mindestens 3 handgezeichnete Figuren, jede Figur lässt sich bauen (auch gedreht) und passt aufs Handy', () => {
    for (const [name, figs, kind] of pools) {
      expect(figs.length, name).toBeGreaterThanOrEqual(3)
      for (const f of figs) {
        expect(f.art.length, f.id).toBeLessThanOrEqual(f.rows)
        expect(f.art.every((l) => l.length === f.cols), f.id).toBe(true)
        expect(f.cols, f.id).toBeLessThanOrEqual(symMaxColsForPhone())
        expect(f.tip.length, f.id).toBeGreaterThan(40)
        const cells = f.art.flatMap((l, y) => [...l].flatMap((ch, x) => (ch === '#' ? [`${x},${y}`] : [])))
        expect(cells.length, f.id).toBeGreaterThanOrEqual(4)
        const sym = kind === 'point' ? { point: f.point } : { axis: { kind, at: f.at } }
        expect(() => symTarget({ cols: f.cols, rows: f.rows, given: cells, ...sym }), f.id).not.toThrow()
        expect(symLayout({ cols: f.cols, rows: f.rows, ...sym }).viewBoxW).toBeGreaterThan(0)
      }
    }
  })

  it('Figuren-IDs sind in allen Gruppen verschieden (Regel 0b: keine Doppelverwendung)', () => {
    const ids = pools.flatMap(([, figs]) => figs.map((f) => f.id))
    expect(new Set(ids).size).toBe(ids.length)
    const arts = pools.flatMap(([, figs]) => figs.map((f) => f.art.join('/')))
    expect(new Set(arts).size).toBe(arts.length)
  })

  it('dedupeKeys sind je Variante eigen und über beide Themen und alle Varianten disjunkt; beide Seiten kommen vor', () => {
    const keysOf = (variant: (rng: ReturnType<typeof createRng>) => Task): Set<string> => {
      const keys = new Set<string>()
      for (const seed of SEEDS) keys.add(variant(createRng(seed)).dedupeKey!)
      return keys
    }
    const all = [symmetryVerticalVariant, symmetryHorizontalVariant, symmetryPointVariantA, symmetryPointVariantB].map(keysOf)
    const seen = new Set<string>()
    for (const keys of all) {
      for (const k of keys) {
        expect(seen.has(k), k).toBe(false)
        seen.add(k)
      }
    }
    expect([...all[0]!].some((k) => k.endsWith(':rechts'))).toBe(true)
    expect([...all[0]!].some((k) => k.endsWith(':links'))).toBe(true)
    expect([...all[1]!].some((k) => k.endsWith(':unten'))).toBe(true)
    expect([...all[1]!].some((k) => k.endsWith(':oben'))).toBe(true)
    // every figure shows up
    expect(all[0]!.size).toBeGreaterThanOrEqual(SYM_VERTICAL_FIGURES.length)
    expect(all[2]!.size).toBe(SYM_POINT_FIGURES_A.length)
    expect(all[3]!.size).toBe(SYM_POINT_FIGURES_B.length)
  })

  it('Hinweistexte passen zu beiden Lagen der Figur (nicht umkehrbare Himmelsrichtungen sind verboten)', () => {
    // A figure may be drawn on either side of its axis, so its tip must not name sides that flip with it.
    const forbiddenVertical = /links|rechts/i
    const forbiddenHorizontal = /oben|unten|obere|untere|oberste|unterste|darunter|darüber/i
    const orientationWords = (f: SymFigure, kind: 'vertical' | 'horizontal'): boolean =>
      (kind === 'vertical' ? forbiddenVertical : forbiddenHorizontal).test(f.tip)
    for (const f of SYM_VERTICAL_FIGURES) {
      if (f.cols === 2 * (f.at as number)) expect(orientationWords(f, 'vertical'), f.id).toBe(false)
    }
    for (const f of SYM_HORIZONTAL_FIGURES) {
      if (f.rows === 2 * (f.at as number)) expect(orientationWords(f, 'horizontal'), f.id).toBe(false)
    }
    // the generated explanation of both orientations carries the tip, so it is orientation-free as well
    const seenSides = new Set<string>()
    for (const seed of SEEDS) {
      for (const [variant, kind] of [[symmetryVerticalVariant, 'vertical'], [symmetryHorizontalVariant, 'horizontal']] as const) {
        const t = variant(createRng(seed))
        const flippable = (t.interactive!.props.axis as { at: number }).at * 2 === (kind === 'vertical' ? t.interactive!.props.cols : t.interactive!.props.rows)
        seenSides.add(t.dedupeKey!.split(':').pop()!)
        if (flippable) expect((kind === 'vertical' ? forbiddenVertical : forbiddenHorizontal).test(t.explanation.replace(/^[^.]*\.[^.]*\.\s*/, '')), t.dedupeKey!).toBe(false)
      }
    }
    expect([...seenSides].sort()).toEqual(['links', 'oben', 'rechts', 'unten'])
    // negative control: a tip that names a side IS detected
    expect(orientationWords({ ...SYM_VERTICAL_FIGURES[0]!, tip: 'Die Kante ganz links.' }, 'vertical')).toBe(true)
    expect(orientationWords({ ...SYM_HORIZONTAL_FIGURES[0]!, tip: 'Das Bild hängt darunter.' }, 'horizontal')).toBe(true)
  })

  it('Pfeil-rechts ist ein Pfeil: Spitze an der Achse, Kopf breiter als der Schaft', () => {
    const f = SYM_HORIZONTAL_FIGURES.find((x) => x.id === 'pfeil-rechts')!
    const colHeights = [...f.art[0]!].map((_, x) => f.art.filter((row) => row[x] === '#').length)
    expect(f.art[f.at! - 1]).toBe('#'.repeat(f.cols)) // shaft and tip touch the axis over the full width
    expect(Math.max(...colHeights)).toBeGreaterThan(colHeights[0]!)
    expect(colHeights[f.cols - 1]).toBe(1) // the point
  })

  it('Punkt-Gruppe B wiederholt nicht das Diagonalmotiv von Z und N und hat treffende Namen', () => {
    expect(SYM_POINT_FIGURES_B.map((f) => f.id).sort()).toEqual(['austauschpfeile', 'buchstabe-s', 'parallelogramm'])
    expect(SYM_POINT_FIGURES_A.map((f) => f.id)).not.toContain('haken')
  })

  it('Lösungstext nennt genau die Felder der sampleAnswer', () => {
    const rng = createRng(7)
    for (const variant of [symmetryVerticalVariant, symmetryHorizontalVariant, symmetryPointVariantA, symmetryPointVariantB]) {
      const t = variant(rng)
      const listed = [...t.solution.matchAll(/\((\d+)\|(\d+)\)/g)].map((m) => `${Number(m[1]) - 1},${Number(m[2]) - 1}`)
      expect(listed.sort()).toEqual([...cellsOf(t)].sort())
      expect(t.solution.startsWith(`${cellsOf(t).length} Feld`)).toBe(true)
    }
  })
})
