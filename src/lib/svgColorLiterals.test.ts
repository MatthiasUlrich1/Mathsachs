import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { barChartPrintSvg, barChartTallySvg, barChartTableSvg } from './barChartLogic'
import { clockPrintSvg } from './clockLogic'
import { dividePrintSvg } from './divideToolLogic'
import { fractionWallPrintSvg } from './fractionWallLogic'
import { numberLineMultiPrintSvg } from './numberLineMultiLogic'
import { pieChartPrintSvg, pieChartTableSvg } from './pieChartLogic'
import { ratioBarPrintSvg } from './ratioBarLogic'
import { symmetryPrintSvg } from './symmetryDrawLogic'
import { treePrintSvg } from './treeDiagramLogic'
import { emptyCoordinateScene, generateCoordinateSceneSvg } from './coordinateScene'
import { SVG_COLOR, SVG_SERIES, dataColor } from './svgTokens'
import { colourLiterals, namedColoursInSource } from './colourScan'

/*
 * On-screen SVG follows the theme (var(--...) tokens). Fixed hex colours are only
 * allowed in print / task-illustration generators; this test pins that list.
 */
const ROOT = process.cwd()
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [p] : []
  })
const rel = (p: string) => p.slice(ROOT.length + 1).replace(/\\/g, '/')


/** Excluded from the scan entirely: released curriculum data (task content, unchanged by the redesign). */
const SKIP_PREFIX = ['src/curriculum/']

/** Files allowed to contain colour literals, with the reason. Keep this list minimal. */
const ALLOW: Record<string, string> = {
  // Print paths: standalone documents / paper output, black-and-white, theme independent.
  'src/lib/worksheetPrint.ts': 'print: worksheet extras',
  'src/classCode/printSheet.ts': 'print: class-code sheet (own HTML document)',
  'src/exam/examProtocolExport.ts': 'print: exam protocol export (own HTML document)',
  // *PrintSvg generators and their task-visual siblings: fixed print-safe colours, shown in .heft-scope on screen.
  'src/lib/barChartLogic.ts': 'barChartPrintSvg / tally + table source sheets',
  'src/lib/pieChartLogic.ts': 'pieChartPrintSvg / source table, PC_COLORS for print',
  'src/lib/ratioBarLogic.ts': 'ratioBarPrintSvg, RATIO_FILL_A/B for print',
  'src/lib/divideToolLogic.ts': 'dividePrintSvg, DIVIDE_PERSON_FILLS for print',
  'src/lib/treeDiagramLogic.ts': 'treePrintSvg',
  'src/lib/symmetryDrawLogic.ts': 'symmetryPrintSvg, SYM_* for print',
  'src/lib/clockLogic.ts': 'clockPrintSvg',
  'src/lib/numberLineMultiLogic.ts': 'numberLineMultiPrintSvg',
  'src/lib/fractionWallLogic.ts': 'fractionWallPrintSvg',
  // Generated task illustrations (geometry / physics / graphs): fixed colours, shown on a Heft sheet (.heft-scope).
  'src/lib/geometrySvg.ts': 'task illustrations, also printed',
  'src/lib/physikSvg.ts': 'task illustrations, also printed',
  'src/lib/functionGraph.ts': 'function graph task illustrations, also printed',
  'src/lib/coordinateScene.ts': 'coordinate scene task SVG / print grid',
  // Theme mapping of legacy data colours (released curriculum passes e.g. "#f59e0b").
  'src/lib/svgTokens.ts': 'legacy data colour -> token lookup table',
}

const files = walk(join(ROOT, 'src'))
  .map(rel)
  .filter((f) => !SKIP_PREFIX.some((p) => f.startsWith(p)))

describe('no colour literals in on-screen TS/TSX', () => {
  it('scans the components and lib files', () => {
    expect(files.some((f) => f.startsWith('src/components/') && f.endsWith('.tsx'))).toBe(true)
    expect(files).toContain('src/lib/barChartLogic.ts')
  })

  it('no component file (src/components/**) contains a colour literal', () => {
    const offenders = files
      .filter((f) => f.startsWith('src/components/'))
      .filter((f) => colourLiterals(readFileSync(join(ROOT, f), 'utf8')).length > 0)
    expect(offenders).toEqual([])
  })

  it('outside the allow-list no src file contains a colour literal', () => {
    const offenders = files
      .filter((f) => !(f in ALLOW))
      .filter((f) => colourLiterals(readFileSync(join(ROOT, f), 'utf8')).length > 0)
    expect(offenders).toEqual([])
  })

  it('allow-list has no stale entries (each file exists and still has a literal)', () => {
    for (const f of Object.keys(ALLOW)) {
      expect(files, f).toContain(f)
      expect(colourLiterals(readFileSync(join(ROOT, f), 'utf8')).length, f).toBeGreaterThan(0)
    }
  })

  it('negative control: the detector finds hex, rgb and hsl but not tokens or url(#id)', () => {
    expect(colourLiterals('fill="#0f172a" stroke="#fff"')).toEqual(['#0f172a', '#fff'])
    expect(colourLiterals('a: rgba(1,2,3,.5); b: hsl(1 2% 3%)')).toHaveLength(2)
    expect(colourLiterals('fill="var(--ink)" marker-end="url(#cge-arrow)" #root')).toEqual([])
  })

  it('no component file uses a named colour (white, black, red, ...) in SVG attributes or style props', () => {
    const offenders = files
      .filter((f) => f.startsWith('src/components/'))
      .filter((f) => namedColoursInSource(readFileSync(join(ROOT, f), 'utf8')).length > 0)
    expect(offenders).toEqual([])
  })

  it('negative control: the named-colour predicate finds names, ignores allowed keywords and tokens', () => {
    expect(namedColoursInSource('<rect fill="white" stroke=\'Black\'/>')).toEqual(['white', 'black'])
    expect(namedColoursInSource('style={{ color: "red", backgroundColor: `blue` }}')).toEqual(['red', 'blue'])
    expect(namedColoursInSource('<g fill="none" stroke="currentColor" color="inherit"/>')).toEqual([])
    expect(namedColoursInSource('fill={SVG_COLOR.surface} stroke="var(--ink)" fill="transparent"')).toEqual([])
  })
})

describe('on-screen SVG colour helpers only produce tokens', () => {
  it('SVG_COLOR and SVG_SERIES are var(--...) / color-mix of tokens', () => {
    for (const v of [...Object.values(SVG_COLOR), ...SVG_SERIES]) {
      expect(v).toMatch(/^(var\(--[a-z-]+\)|color-mix\(in srgb, var\(--[a-z-]+\) \d+%, var\(--[a-z-]+\)\))$/)
    }
    expect(SVG_SERIES.length).toBeGreaterThanOrEqual(6)
    expect(new Set(SVG_SERIES).size).toBe(SVG_SERIES.length)
  })

  it('every referenced token exists in index.css', () => {
    const css = readFileSync(join(ROOT, 'src/index.css'), 'utf8')
    const used = new Set([...Object.values(SVG_COLOR), ...SVG_SERIES].flatMap((v) => [...v.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1])))
    for (const t of used) expect(css, t).toContain(`${t}:`)
  })

  it('legacy data colours map to tokens, unknown values pass through', () => {
    expect(dataColor('#C62828', SVG_COLOR.ink)).toBe(SVG_COLOR.correction)
    expect(dataColor('#f59e0b', SVG_COLOR.ink)).toBe(SVG_COLOR.highlight)
    expect(dataColor(undefined, SVG_COLOR.ink)).toBe(SVG_COLOR.ink)
    expect(dataColor('var(--tick)', SVG_COLOR.ink)).toBe('var(--tick)')
  })
})

describe('print SVG strings keep fixed colours and never contain var(--', () => {
  const two = [{ outcomes: ['A', 'B'] }, { outcomes: ['C', 'D'] }]
  const prints: Record<string, string> = {
    bar: barChartPrintSvg(['Hund', 'Katze'], 6, 1, 'Anzahl'),
    barTally: barChartTallySvg('Haustiere', ['Hund', 'Katze'], [3, 6]),
    barTable: barChartTableSvg('Haustiere', 'Tier', 'Anzahl', ['Hund', 'Katze'], [3, 6]),
    clock: clockPrintSvg(),
    divide: dividePrintSvg('circle', 3, 4),
    wall: fractionWallPrintSvg([1, 2, 4], { num: 1, den: 2 }),
    numberLine: numberLineMultiPrintSvg(0, 2, 0.25, 4),
    pie: pieChartPrintSvg(['Sparen', 'Kino']),
    pieTable: pieChartTableSvg('Taschengeld', 'Posten', 'Anteil', ['Sparen', 'Kino'], ['50 %', '50 %']),
    ratioColour: ratioBarPrintSvg('colour', 10, ['Saft', 'Wasser']),
    ratioSplit: ratioBarPrintSvg('split', 5, ['Saft', 'Wasser'], [2, 3], { value: 500, unit: 'ml' }),
    symmetry: symmetryPrintSvg({ cols: 8, rows: 6, given: ['3,1', '2,2'], axis: { kind: 'vertical', at: 4 } }),
    tree: treePrintSvg(two, { '0': '1/2', '1': '1/2' }, { branches: [], leaves: [] }),
    coordinateScene: generateCoordinateSceneSvg(
      emptyCoordinateScene({ xRange: [-3, 3], yRange: [-3, 3], objects: [{ id: 'l', kind: 'line', x1: 0, y1: 0, x2: 1, y2: 1 }] }),
    ),
  }
  for (const [name, svg] of Object.entries(prints)) {
    it(`${name}: contains a fixed hex colour and no CSS variable`, () => {
      expect(svg).toContain('<svg')
      expect(svg).not.toContain('var(--')
      expect(svg).toMatch(/#[0-9a-fA-F]{3,6}\b/)
    })
  }

  it('negative control: a token-coloured string would be caught', () => {
    expect('<svg><rect fill="var(--ink)"/></svg>').toContain('var(--')
  })
})
