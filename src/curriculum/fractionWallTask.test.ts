import { describe, expect, it } from 'vitest'
import { fractionWallTask, type FractionWallTaskInput } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { formatExamAnswer } from '../components/ExamProtocolSheet'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { createEmptyDraft, draftToTask, exportGeneratorSnippet, validateDraft, type DraftAuthoringTask } from '../lib/taskAuthoring'
import type { UserInput } from './types'

const base = { question: 'q', solution: 's', explanation: 'e' }
const equiv = (over: Partial<FractionWallTaskInput> = {}) =>
  fractionWallTask({ ...base, mode: 'equivalent', rows: [1, 2, 3, 4, 6, 8, 12], target: { num: 1, den: 2 }, ...over } as FractionWallTaskInput)
const compare = (over: Partial<FractionWallTaskInput> = {}) =>
  fractionWallTask({
    ...base,
    mode: 'compare',
    rows: [1, 2, 3, 4, 6, 8, 12],
    a: { num: 2, den: 3 },
    b: { num: 3, den: 4 },
    ...over,
  } as FractionWallTaskInput)
const wall = (selected: Array<{ row: number; count: number }>): UserInput => ({ kind: 'fractionWall', selected })

describe('fractionWallTask equivalent', () => {
  it('sampleAnswer passes check, untouched and wrong fail', () => {
    const t = equiv()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(wall([{ row: 4, count: 2 }]))).toBe(false)
    expect(t.check({ kind: 'text', value: '1/2' } as unknown as UserInput)).toBe(false)
  })
  it('exposes mode, rows and the target as reference in the config', () => {
    expect(equiv().interactive).toMatchObject({
      type: 'fractionWall',
      props: { mode: 'equivalent', rows: [1, 2, 3, 4, 6, 8, 12], target: { num: 1, den: 2 } },
    })
  })
  it('throws for unusable input', () => {
    expect(() => equiv({ rows: [1, 2, 3], target: { num: 1, den: 4 } } as never)).toThrow(/rows must contain/)
    expect(() => equiv({ rows: [1, 2, 3, 3] } as never)).toThrow(/ascending/)
    expect(() => equiv({ rows: [3, 2, 1] } as never)).toThrow(/ascending/)
    expect(() => equiv({ rows: [1, 2, 14] } as never)).toThrow(/ascending/)
    expect(() => equiv({ target: { num: 2, den: 2 } } as never)).toThrow(/smaller than 1/)
    expect(() => equiv({ target: { num: 0, den: 2 } } as never)).toThrow(/num <= den/)
    expect(() => equiv({ rows: [1, 2, 3], target: { num: 1, den: 2 } } as never)).toThrow(/no other row/)
  })
})

describe('fractionWallTask compare', () => {
  it('sampleAnswer is the larger fraction and passes; the smaller one, nothing and several fail', () => {
    const t = compare()
    expect(t.sampleAnswer).toEqual(wall([{ row: 4, count: 3 }]))
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(wall([{ row: 3, count: 2 }]))).toBe(false)
    expect(t.check(wall([{ row: 4, count: 3 }, { row: 3, count: 2 }]))).toBe(false)
  })
  it('works whichever fraction is a', () => {
    const t = compare({ a: { num: 3, den: 4 }, b: { num: 2, den: 3 } } as never)
    expect(t.check(wall([{ row: 4, count: 3 }]))).toBe(true)
  })
  it('throws for equal fractions and rows without the denominators', () => {
    expect(() => compare({ a: { num: 1, den: 2 }, b: { num: 2, den: 4 } } as never)).toThrow(/must differ/)
    expect(() => compare({ rows: [1, 2, 3, 4] } as never)).not.toThrow()
    expect(() => compare({ rows: [1, 2, 3] } as never)).toThrow(/rows must contain/)
  })
})

describe('fractionWall wiring', () => {
  it('initTaskInput starts empty', () => {
    expect(initTaskInput(equiv())).toEqual(wall([]))
  })
  it('exam: only a selection counts as attempted; the protocol shows the runs', () => {
    const t = equiv()
    expect(examAnswerAttempted(t, wall([]))).toBe(false)
    expect(examAnswerAttempted(t, wall([{ row: 4, count: 2 }]))).toBe(true)
    expect(formatExamAnswer(wall([]))).toBe('—')
    expect(formatExamAnswer(wall([{ row: 4, count: 2 }, { row: 6, count: 3 }]))).toBe('2/4, 3/6')
  })
  it('worksheet: prints the empty wall (reference row shaded) AND a visualContent', () => {
    const t = equiv()
    const extras = worksheetPrintExtras(t)
    expect(extras.visualHtml).toContain('<svg')
    expect(extras.visualHtml!.match(/<rect/g)).toHaveLength(1 + 2 + 3 + 4 + 6 + 8 + 12)
    expect(extras.visualHtml!.match(/#94a3b8/g)).toHaveLength(1)
    expect(extras.paperHint).toContain('Färbe')
    expect(extras.paperHint).not.toContain('Tippe')
    expect(extras.answerBlank).toBe('')
    const withVisual = worksheetPrintExtras({ ...t, visualContent: '<svg id="ref"></svg>' })
    expect(withVisual.visualHtml).toContain('<svg id="ref">')
    expect(withVisual.visualHtml!.match(/<rect/g)).toHaveLength(1 + 2 + 3 + 4 + 6 + 8 + 12)
    const cmp = worksheetPrintExtras(compare())
    expect(cmp.visualHtml!.match(/#94a3b8/g)).toBeNull()
    expect(cmp.paperHint).toContain('größeren')
  })
})

describe('fractionWall authoring', () => {
  const draftOf = (props: Record<string, unknown>): DraftAuthoringTask => {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      target: { packId: 'p', gradeId: 'g', areaId: 'a', topicId: 't', topicTitle: 'T' },
      task: { question: 'Bruchwand.', unit: '', solution: 's', explanation: 'Erklärung.', hint: '' },
      element: { type: 'fractionWall', props },
    } as DraftAuthoringTask
  }
  it('builds both modes, exports a snippet and validates', () => {
    const eq = draftOf({ mode: 'equivalent', rows: '1, 2, 3, 4, 6, 8, 12', num: 1, den: 2 })
    expect(validateDraft(eq)).toEqual([])
    const t = draftToTask(eq)
    expect(t.interactive?.type).toBe('fractionWall')
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(exportGeneratorSnippet(eq)).toContain('fractionWallTask({')
    expect(exportGeneratorSnippet(eq)).toContain('target: { num: 1, den: 2 }')
    const cmp = draftOf({ mode: 'compare', rows: '1,2,3,4,6', aNum: 2, aDen: 3, bNum: 3, bDen: 4 })
    expect(validateDraft(cmp)).toEqual([])
    expect(draftToTask(cmp).check({ kind: 'fractionWall', selected: [{ row: 4, count: 3 }] })).toBe(true)
    expect(exportGeneratorSnippet(cmp)).toContain('a: { num: 2, den: 3 }')
  })
  it('reports invalid drafts', () => {
    const bad = (p: Record<string, unknown>) => validateDraft(draftOf(p)).join(' ')
    expect(bad({ mode: 'x' })).toContain('Bruchwand')
    expect(bad({ mode: 'equivalent', rows: '1,2,3', num: 1, den: 4 })).toContain('Bruchwand')
    expect(bad({ mode: 'equivalent', rows: '1,2,abc', num: 1, den: 2 })).toContain('Bruchwand')
    expect(bad({ mode: 'compare', rows: '1,2,4', aNum: 1, aDen: 2, bNum: 2, bDen: 4 })).toContain('Bruchwand')
  })
})
