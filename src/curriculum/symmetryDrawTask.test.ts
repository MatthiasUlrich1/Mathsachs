import { describe, expect, it } from 'vitest'
import { symmetryDrawTask, type SymmetryDrawTaskInput } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { formatExamAnswer } from '../components/ExamProtocolSheet'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { createEmptyDraft, draftToTask, exportGeneratorSnippet, validateDraft, type DraftAuthoringTask } from '../lib/taskAuthoring'
import { emptyInput, type UserInput } from './types'

const base: SymmetryDrawTaskInput = {
  question: 'Ergänze die Figur achsensymmetrisch.',
  cols: 8,
  rows: 6,
  given: ['3,1', '2,2', '3,2'],
  axis: { kind: 'vertical', at: 4 },
  solution: 's',
  explanation: 'Erklärung.',
}
const make = (over: Partial<SymmetryDrawTaskInput> = {}) => symmetryDrawTask({ ...base, ...over })
const sd = (cells: string[]): UserInput => ({ kind: 'symmetryDraw', cells })

describe('symmetryDrawTask check', () => {
  it('sampleAnswer passes; untouched, missing, extra, wrong and wrong kind fail', () => {
    const t = make()
    expect(t.sampleAnswer).toEqual(sd(['4,1', '4,2', '5,2']))
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(sd(['5,2', '4,2', '4,1']))).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(sd([]))).toBe(false)
    expect(t.check(sd(['4,1', '4,2']))).toBe(false) // one missing
    expect(t.check(sd(['4,1', '4,2', '5,2', '6,5']))).toBe(false) // one extra
    expect(t.check(sd(['4,1', '4,2', '5,3']))).toBe(false) // one wrong
    expect(t.check(sd(['4,1', '4,1', '4,2']))).toBe(false)
    expect(t.check(sd(['3,1', '2,2', '3,2']))).toBe(false) // the figure itself
    expect(t.check({ kind: 'text', value: '4,1' } as unknown as UserInput)).toBe(false)
  })

  it('works for a horizontal axis, a diagonal axis and a point', () => {
    const h = make({ cols: 6, rows: 8, given: ['1,2', '1,3'], axis: { kind: 'horizontal', at: 4 } })
    expect(h.sampleAnswer).toEqual(sd(['1,4', '1,5']))
    expect(h.check(sd(['1,4', '1,5']))).toBe(true)
    const d = make({ cols: 6, rows: 6, given: ['0,2', '0,3'], axis: { kind: 'diagonal' } })
    expect(d.check(sd(['2,0', '3,0']))).toBe(true)
    expect(d.check(sd(['0,2', '0,3']))).toBe(false)
    const p = make({ cols: 8, rows: 8, given: ['1,1', '2,1'], axis: undefined, point: { x: 4, y: 4 } })
    expect(p.check(sd(['5,6', '6,6']))).toBe(true)
    expect(p.check(sd(['6,1', '5,1']))).toBe(false) // an axis mirror is not a point mirror
  })

  it('throws for an unusable configuration', () => {
    expect(() => make({ given: ['1,1', '6,2'] })).toThrow(/one side/)
    expect(() => make({ given: ['0,1'], axis: { kind: 'vertical', at: 5 } })).toThrow(/outside/)
    expect(() => make({ cols: 13 })).toThrow()
    expect(() => make({ axis: undefined })).toThrow(/exactly one/)
  })
})

describe('symmetryDrawTask object', () => {
  it('start state is empty and the same for every target; the target is not in the props', () => {
    const a = make()
    const b = make({ given: ['0,0', '1,0'] })
    expect(initTaskInput(a)).toEqual({ kind: 'symmetryDraw', cells: [] })
    expect(initTaskInput(b)).toEqual(initTaskInput(a))
    expect(emptyInput('symmetryDraw')).toEqual({ kind: 'symmetryDraw', cells: [] })
    const props = a.interactive!.props
    expect(a.interactive!.type).toBe('symmetryDraw')
    expect(props.given).toEqual(['3,1', '2,2', '3,2'])
    for (const mirror of (a.sampleAnswer as { cells: string[] }).cells) expect(JSON.stringify(props)).not.toContain(`"${mirror}"`)
    expect(a.question).not.toMatch(/tippe|klick|zieh|pfeiltaste/i)
    expect(a.dedupeKey).toBeUndefined()
    expect(make({ dedupeKey: ' k ' }).dedupeKey).toBe('k')
  })

  it('exam: attempted only with at least one cell; the protocol counts the cells', () => {
    const t = make()
    expect(examAnswerAttempted(t, sd([]))).toBe(false)
    expect(examAnswerAttempted(t, sd(['4,1']))).toBe(true)
    expect(formatExamAnswer(sd([]), t)).toBe('—')
    expect(formatExamAnswer(sd(['4,1']), t)).toBe('1 Feld gefärbt')
    expect(formatExamAnswer(sd(['4,1', '4,2']), t)).toBe('2 Felder gefärbt')
  })

  it('worksheet: the grid with the given cells shaded and the axis, no solution cells shaded', () => {
    const extras = worksheetPrintExtras(make())
    expect(extras.visualHtml).toContain('<svg')
    expect(extras.visualHtml!.match(/fill="#64748b"/g)).toHaveLength(3)
    expect(extras.visualHtml).toContain('stroke-dasharray')
    expect(extras.paperHint).not.toMatch(/tippe|klick/i)
    const p = worksheetPrintExtras(make({ cols: 8, rows: 8, given: ['1,1'], axis: undefined, point: { x: 4, y: 4 } }))
    expect(p.visualHtml).toContain('<circle')
  })

  it('worksheet: the data of the task (visualContent) comes first, then the grid', () => {
    const extras = worksheetPrintExtras(make({ visualContent: '<svg id="vorlage"></svg>' }))
    expect(extras.visualHtml!.startsWith('<svg id="vorlage"></svg>')).toBe(true)
    expect(extras.visualHtml!.match(/<svg/g)).toHaveLength(2)
  })

  it('worksheet: broken props draw no grid instead of throwing', () => {
    const t = make()
    const broken = { ...t, interactive: { ...t.interactive!, props: { ...t.interactive!.props, cols: 99 } } }
    expect(worksheetPrintExtras(broken).visualHtml ?? '').not.toContain('<svg')
  })
})

describe('symmetryDraw authoring', () => {
  const draftOf = (props: Record<string, unknown>): DraftAuthoringTask => {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      target: { packId: 'p', gradeId: 'g', areaId: 'a', topicId: 't', topicTitle: 'T' },
      task: { question: 'Ergänze.', unit: '', solution: 's', explanation: 'Erklärung.', hint: '' },
      element: { type: 'symmetryDraw', props },
    } as DraftAuthoringTask
  }
  const props = { cols: '8', rows: '6', axisKind: 'vertical', at: '4', given: '3,1; 2,2\n3,2' }

  it('builds a task, exports a snippet and validates', () => {
    const d = draftOf(props)
    expect(validateDraft(d)).toEqual([])
    const t = draftToTask(d)
    expect(t.interactive?.type).toBe('symmetryDraw')
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(sd([]))).toBe(false)
    const code = exportGeneratorSnippet(d)
    expect(code).toContain('symmetryDrawTask({')
    expect(code).toContain('cols: 8,')
    expect(code).toContain('given: ["3,1","2,2","3,2"],')
    expect(code).toContain('axis: {"kind":"vertical","at":4},')
    expect(code).not.toContain('point:')
  })

  it('supports horizontal, diagonal and point drafts', () => {
    const h = draftOf({ cols: '6', rows: '8', axisKind: 'horizontal', at: '4', given: '1,2' })
    expect(validateDraft(h)).toEqual([])
    expect(draftToTask(h).sampleAnswer).toEqual(sd(['1,5']))
    const d = draftOf({ cols: '6', rows: '6', axisKind: 'diagonal', given: '0,3' })
    expect(validateDraft(d)).toEqual([])
    expect(exportGeneratorSnippet(d)).toContain('axis: {"kind":"diagonal"},')
    const p = draftOf({ cols: '8', rows: '8', axisKind: 'point', pointX: '4', pointY: '4', given: '1,1;2,1' })
    expect(validateDraft(p)).toEqual([])
    expect(exportGeneratorSnippet(p)).toContain('point: {"x":4,"y":4},')
  })

  it('rejects invalid drafts', () => {
    expect(validateDraft(draftOf({ ...props, given: '1,1; 6,2' })).join(' ')).toMatch(/Symmetrie/)
    expect(validateDraft(draftOf({ ...props, given: '' })).length).toBeGreaterThan(0)
    expect(validateDraft(draftOf({ ...props, cols: '20' })).length).toBeGreaterThan(0)
    expect(validateDraft(draftOf({ ...props, at: '0' })).length).toBeGreaterThan(0)
    expect(validateDraft(draftOf({ ...props, axisKind: 'diagonal' })).length).toBeGreaterThan(0) // not square
    expect(validateDraft(draftOf({ ...props, given: 'abc' })).length).toBeGreaterThan(0)
  })
})
