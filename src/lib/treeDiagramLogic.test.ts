import { describe, expect, it } from 'vitest'
import {
  TREE_CHIP_FONT_PX,
  TREE_INPUT_H_PX,
  TREE_MIN_WIDTH_PX,
  TREE_PRINT_FONT,
  TREE_PRINT_W,
  buildTreeModel,
  formatProbability,
  parseProbability,
  treeAllEdgeIds,
  treeBoxes,
  TREE_MAX_ENTRY_CHARS,
  TREE_MAX_ROOT_LABEL_CHARS,
  treeChipTextFits,
  treeEntryFits,
  treeLayout,
  treeLeafIds,
  treeMatches,
  treePathLabel,
  treePrintSvg,
  type TreeLevel,
} from './treeDiagramLogic'

const two: TreeLevel[] = [{ outcomes: ['Rot', 'Blau'] }, { outcomes: ['Rot', 'Blau'] }]
const three: TreeLevel[] = [{ outcomes: ['A', 'B', 'C'] }, { outcomes: ['X', 'Y', 'Z'] }]
const urn = { '0': '3/5', '1': '2/5', '0.0': '2/4', '0.1': '2/4', '1.0': '3/4', '1.1': '1/4' }

describe('parseProbability', () => {
  it('accepts fractions, comma and point decimals and percent as the same exact value', () => {
    for (const raw of ['3/10', '0,3', '0.3', '30 %', '30%', ' 6/20 ', '.3', ',3', '3 / 10']) {
      expect(parseProbability(raw), raw).toEqual({ n: 3, d: 10 })
    }
    expect(parseProbability('1')).toEqual({ n: 1, d: 1 })
    expect(parseProbability('0')).toEqual({ n: 0, d: 1 })
    expect(parseProbability('12,5 %')).toEqual({ n: 1, d: 8 })
  })

  it('is exact where floats are not (0,1 + 0,2 = 0,3)', () => {
    const a = parseProbability('0,1')!
    const b = parseProbability('0,2')!
    expect((a.n * b.d + b.n * a.d) * 10).toBe(3 * a.d * b.d)
  })

  it('rejects text, negatives, empty, a/0, double separators and huge numbers', () => {
    for (const raw of ['', ' ', 'abc', '-0,3', '1/0', '0,3,4', '3//10', '1/2/3', '0,3 %%', ',', '%', '1234567890', '0,12345678901']) {
      expect(parseProbability(raw), raw).toBeNull()
    }
  })
})

describe('structure', () => {
  it('edge ids are index paths; leaves are full paths', () => {
    expect(treeAllEdgeIds(two)).toEqual(['0', '1', '0.0', '0.1', '1.0', '1.1'])
    expect(treeLeafIds(two)).toEqual(['0.0', '0.1', '1.0', '1.1'])
    expect(treeLeafIds([{ outcomes: ['a', 'b', 'c'] }])).toEqual(['0', '1', '2'])
    expect(treePathLabel(two, '1.0')).toBe('Blau, Rot')
  })
})

describe('buildTreeModel', () => {
  it('multiplies along the path (also with different level-2 values per parent)', () => {
    const m = buildTreeModel(two, urn)
    expect(formatProbability(m.leaves['0.0']!)).toBe('3/10')
    expect(formatProbability(m.leaves['0.1']!)).toBe('3/10')
    expect(formatProbability(m.leaves['1.0']!)).toBe('3/10')
    expect(formatProbability(m.leaves['1.1']!)).toBe('1/10')
  })

  it('throws when siblings do not add up to 1, an edge is missing or foreign, or a value is larger than 1', () => {
    expect(() => buildTreeModel(two, { ...urn, '0': '1/5' })).toThrow(/add up to 1/)
    expect(() => buildTreeModel(two, { ...urn, '1.1': '1/2' })).toThrow(/add up to 1/)
    const missing = Object.fromEntries(Object.entries(urn).filter(([k]) => k !== '1.1'))
    expect(() => buildTreeModel(two, missing)).toThrow(/1\.1/)
    expect(() => buildTreeModel(two, { ...urn, '2': '0' })).toThrow(/not an edge/)
    expect(() => buildTreeModel(two, { ...urn, '0': '3/2', '1': '-1/2' })).toThrow()
  })

  it('throws for bad level shapes and labels', () => {
    expect(() => buildTreeModel([], {})).toThrow()
    expect(() => buildTreeModel([{ outcomes: ['a'] }], { '0': '1' })).toThrow(/outcomes/)
    expect(() => buildTreeModel([{ outcomes: ['a', 'b', 'c', 'd'] }], {})).toThrow(/outcomes/)
    expect(() => buildTreeModel([{ outcomes: ['a', 'a'] }], { '0': '1/2', '1': '1/2' })).toThrow(/differ/)
    expect(() => buildTreeModel([{ outcomes: ['viel zu lang', 'b'] }], { '0': '1/2', '1': '1/2' })).toThrow(/characters/)
    expect(() => buildTreeModel([{ outcomes: ['a', 'b'] }, { outcomes: ['a', 'b'] }, { outcomes: ['a', 'b'] }], {})).toThrow(/levels/)
  })

  it('a one-level tree: leaf = edge', () => {
    const m = buildTreeModel([{ outcomes: ['A', 'B', 'C'] }], { '0': '0,5', '1': '0,3', '2': '0,2' })
    expect(formatProbability(m.leaves['1']!)).toBe('3/10')
  })
})

describe('treeMatches', () => {
  const m = buildTreeModel(two, urn)
  const blanks = { branches: ['0.0'], leaves: ['1.1'] }
  it('accepts every notation of the expected value; leaves are the product', () => {
    expect(treeMatches(m, blanks, { '0.0': '1/2' }, { '1.1': '0,1' })).toBe(true)
    expect(treeMatches(m, blanks, { '0.0': '0,5' }, { '1.1': '10 %' })).toBe(true)
    expect(treeMatches(m, blanks, { '0.0': '2/4' }, { '1.1': '1/10' })).toBe(true)
  })
  it('rejects empty, wrong, unparsable and missing fields; ignores fields that are not blanks', () => {
    expect(treeMatches(m, blanks, {}, {})).toBe(false)
    expect(treeMatches(m, blanks, { '0.0': '1/2' }, { '1.1': '1/4' })).toBe(false)
    expect(treeMatches(m, blanks, { '0.0': 'x' }, { '1.1': '1/10' })).toBe(false)
    expect(treeMatches(m, blanks, { '0.0': '1/2' }, undefined)).toBe(false)
    expect(treeMatches(m, blanks, { '0.0': '1/2', '1': 'quatsch' }, { '1.1': '0,1', '0.0': 'x' })).toBe(true)
  })
})

describe('layout fits at 343 px (375 px phone minus gutter)', () => {
  const cases: Array<[string, TreeLevel[]]> = [
    ['2x2', two],
    ['3x3', three],
    ['3 only', [three[0]!]],
    ['2 only', [two[0]!]],
  ]
  for (const [name, levels] of cases) {
    it(`${name}: fields and chips do not overlap and stay inside the box`, () => {
      const boxes = treeBoxes(levels, TREE_MIN_WIDTH_PX, 'x'.repeat(TREE_MAX_ROOT_LABEL_CHARS))
      const lay = treeLayout(levels)
      for (const b of boxes) {
        expect(b.left, `${b.kind} ${b.id}`).toBeGreaterThanOrEqual(0)
        expect(b.right, `${b.kind} ${b.id}`).toBeLessThanOrEqual(TREE_MIN_WIDTH_PX)
        expect(b.top, `${b.kind} ${b.id}`).toBeGreaterThanOrEqual(0)
        expect(b.bottom, `${b.kind} ${b.id}`).toBeLessThanOrEqual(lay.height)
      }
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i]!
          const b = boxes[j]!
          const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
          expect(overlap, `${a.kind} ${a.id} / ${b.kind} ${b.id}`).toBe(false)
        }
      }
    })
  }

  it('the root label is part of the fit test: a label that is too wide leaves the box', () => {
    const boxes = treeBoxes([two[0]!], TREE_MIN_WIDTH_PX, 'x'.repeat(60))
    const label = boxes.find((b) => b.id === 'root-label')!
    expect(label.right).toBeGreaterThan(TREE_MIN_WIDTH_PX)
  })

  it('a 6-character entry (12,5 % / 15/100) fits a field; 8 characters would not', () => {
    expect(treeEntryFits(TREE_MAX_ENTRY_CHARS)).toBe(true)
    expect(treeEntryFits(8)).toBe(false)
  })

  it('fields are at least 44 px tall', () => {
    expect(TREE_INPUT_H_PX).toBeGreaterThanOrEqual(44)
  })

  it('every outcome label fits its chip; the estimator rejects a long one', () => {
    expect(treeChipTextFits('Gewinn')).toBe(true)
    expect(treeChipTextFits('Gewinnen')).toBe(false)
    expect(TREE_CHIP_FONT_PX).toBeGreaterThan(0)
  })

  it('the 3x3 tree has 12 edges, 9 leaf fields and 12 chips', () => {
    const lay = treeLayout(three)
    expect(lay.edges).toHaveLength(12)
    expect(lay.leafFields).toHaveLength(9)
    expect(lay.nodes).toHaveLength(12)
  })
})

describe('treePrintSvg', () => {
  const svg = treePrintSvg(two, { '0': '3/5', '1': '2/5', '1.0': '3/4', '1.1': '1/4' }, { branches: ['0.0', '0.1'], leaves: ['0.0'] })
  it('prints given values and ___ at each blank, not the blank values', () => {
    expect(svg).toContain('3/5')
    expect(svg).toContain('3/4')
    expect((svg.match(/___/g) ?? []).length).toBe(3)
    expect(svg).not.toContain('2/4')
    expect(svg).not.toContain('3/10')
  })
  it('prints the root label when given', () => {
    expect(treePrintSvg(two, urn, { branches: [], leaves: [] }, 'Samstag')).toContain('>Samstag</text>')
    expect(treePrintSvg(two, urn, { branches: [], leaves: [] })).not.toContain('Samstag')
  })
  it('escapes author text', () => {
    const s = treePrintSvg([{ outcomes: ['<a>', 'b&'] }], { '0': '1/2', '1': '1/2' }, { branches: [], leaves: [] })
    expect(s).toContain('&lt;a&gt;')
    expect(s).toContain('b&amp;')
  })
  it('every text lies inside the viewBox', () => {
    const lay = treeLayout(three, 60)
    const s = treePrintSvg(three, Object.fromEntries(treeAllEdgeIds(three).map((id) => [id, '1/3'])), { branches: [], leaves: treeLeafIds(three) })
    const re = /<text x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]*)<\/text>/g
    let m: RegExpExecArray | null
    let count = 0
    while ((m = re.exec(s))) {
      count++
      const half = (m[3]!.length * TREE_PRINT_FONT * 0.6) / 2
      expect(Number(m[1]) - half).toBeGreaterThanOrEqual(0)
      expect(Number(m[1]) + half).toBeLessThanOrEqual(TREE_PRINT_W)
      expect(Number(m[2])).toBeLessThanOrEqual(lay.height)
    }
    expect(count).toBeGreaterThan(20)
  })
})
