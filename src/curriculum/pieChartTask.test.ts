import { describe, expect, it } from 'vitest'
import { pieChartTask, type PieChartTaskInput } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { formatExamAnswer } from '../components/ExamProtocolSheet'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { createEmptyDraft, draftToTask, exportGeneratorSnippet, validateDraft, type DraftAuthoringTask } from '../lib/taskAuthoring'
import { emptyInput, type UserInput } from './types'

const base: PieChartTaskInput = {
  question: 'Stelle die Umfrage in einem Kreisdiagramm dar.',
  categories: ['Obst', 'Brötchen', 'Riegel', 'Nichts'],
  percents: [45, 30, 15, 10],
  solution: 'Obst 45 %, Brötchen 30 %, Riegel 15 %, Nichts 10 %',
  explanation: 'Erklärung.',
}
const make = (over: Partial<PieChartTaskInput> = {}) => pieChartTask({ ...base, ...over })
const pc = (percents: number[] | null): UserInput => ({ kind: 'pieChart', percents })

describe('pieChartTask check', () => {
  it('sampleAnswer passes; untouched, wrong shares, wrong length and the wrong kind fail', () => {
    const t = make()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(pc(null))).toBe(false)
    expect(t.check(pc([45, 30, 10, 15]))).toBe(false)
    expect(t.check(pc([25, 25, 25, 25]))).toBe(false) // the start state
    expect(t.check(pc([45, 30, 25]))).toBe(false)
    expect(t.check({ kind: 'text', value: '45' } as unknown as UserInput)).toBe(false)
  })

  it('every share within the tolerance counts (default half a snap step), the sum must be 100', () => {
    const t = make()
    expect(t.check(pc([47, 30, 15, 8]))).toBe(true) // 2 off each: within 2.5
    expect(t.check(pc([48, 30, 15, 7]))).toBe(false) // 3 off
    expect(t.check(pc([45, 30, 15, 15]))).toBe(false) // sum 105
    const loose = make({ tolerance: 4 })
    expect(loose.check(pc([48, 30, 15, 7]))).toBe(true)
    expect(loose.check(pc([50, 30, 15, 5]))).toBe(false)
  })

  it('works with another snap step', () => {
    const t = make({ categories: ['A', 'B', 'C'], percents: [50, 30, 20], snapPercent: 10 })
    expect(t.check(pc([50, 30, 20]))).toBe(true)
    expect(t.check(pc([40, 40, 20]))).toBe(false)
    expect(t.interactive!.props.snapPercent).toBe(10)
  })
})

describe('pieChartTask object', () => {
  it('the start state is identical for every target of the same size, and the targets are not in the props', () => {
    const a = make()
    const b = make({ percents: [10, 10, 30, 50] })
    expect(initTaskInput(a)).toEqual(initTaskInput(b))
    expect(initTaskInput(a)).toEqual({ kind: 'pieChart', percents: null })
    expect(a.interactive!.props).toEqual(b.interactive!.props)
    expect(JSON.stringify(a.interactive!.props)).not.toMatch(/percents|"data"|"values"|"value"|"starts"|"tolerance"/)
    expect(a.interactive!.type).toBe('pieChart')
    expect(a.question).not.toMatch(/zieh|tippe|klick|pfeiltaste|punkt/i)
  })

  it('keeps visualContent and dedupeKey and omits a default snap', () => {
    const t = make({ visualContent: '<svg id="tab"></svg>', dedupeKey: ' k1 ' })
    expect(t.visualContent).toBe('<svg id="tab"></svg>')
    expect(t.dedupeKey).toBe('k1')
    expect('snapPercent' in t.interactive!.props).toBe(false)
    expect(make().visualContent).toBeUndefined()
  })

  it('throws for invalid input, including a target that equals the start state', () => {
    expect(() => make({ categories: ['A'], percents: [100] })).toThrow(/categories/)
    expect(() => make({ percents: [45, 30, 15] })).toThrow(/one value per category/)
    expect(() => make({ percents: [45, 30, 15, 11] })).toThrow(/multiple/)
    expect(() => make({ percents: [45, 30, 15, 5] })).toThrow(/100/)
    expect(() => make({ percents: [50, 30, 20, 0] })).toThrow(/greater than 0/)
    expect(() => make({ percents: [25, 25, 25, 25] })).toThrow(/start state/)
    expect(() => make({ snapPercent: 3 })).toThrow(/snapPercent/)
    expect(() => make({ tolerance: 5 })).toThrow(/tolerance/)
    expect(() => make({ categories: ['Obst', 'Obst', 'Riegel', 'Nichts'] })).toThrow(/differ/)
    expect(() => make({ categories: ['Obst', 'Brötchen', 'Riegel', 'Eine viel zu lange Kategorie'] })).toThrow(/category/)
  })
})

describe('pieChart wiring', () => {
  it('initTaskInput is untouched (null); emptyInput is untouched', () => {
    expect(initTaskInput(make())).toEqual({ kind: 'pieChart', percents: null })
    expect(emptyInput('pieChart')).toEqual({ kind: 'pieChart', percents: null })
  })

  it('exam: attempted as soon as the chart was moved; untouched is not', () => {
    const t = make()
    expect(examAnswerAttempted(t, pc(null))).toBe(false)
    expect(examAnswerAttempted(t, pc([30, 20, 25, 25]))).toBe(true)
    expect(examAnswerAttempted(t, t.sampleAnswer)).toBe(true)
  })

  it('exam protocol text names the categories and marks an untouched chart', () => {
    const t = make()
    expect(formatExamAnswer(pc(null), t)).toBe('—')
    expect(formatExamAnswer(pc([30, 20, 25, 25]), t)).toBe('Obst: 30 %; Brötchen: 20 %; Riegel: 25 %; Nichts: 25 %')
    expect(formatExamAnswer(pc([60, 40]))).toBe('Sektor 1: 60 %; Sektor 2: 40 %')
  })

  it('worksheet: the frame only needs valid categories, not data (no silent drop)', () => {
    const t = make()
    expect(worksheetPrintExtras(t).visualHtml).toContain('<svg')
    const broken = { ...t, interactive: { ...t.interactive!, props: { ...t.interactive!.props, snapPercent: 3 } } }
    expect(worksheetPrintExtras(broken).visualHtml ?? '').not.toContain('<svg')
  })

  it('worksheet: the table (visualContent) comes first, then the empty circle with scale and legend, no sectors', () => {
    const t = make({ visualContent: '<svg id="tab"></svg>' })
    const extras = worksheetPrintExtras(t)
    expect(extras.visualHtml!.startsWith('<svg id="tab"></svg>')).toBe(true)
    expect(extras.visualHtml!.match(/<svg/g)).toHaveLength(2)
    for (const c of base.categories) expect(extras.visualHtml).toContain(c)
    expect(extras.visualHtml).not.toContain('<path')
    expect(extras.paperHint).toMatch(/Zeichne/)
    expect(extras.paperHint).not.toMatch(/zieh/i)
    expect(worksheetPrintExtras(make()).visualHtml!.match(/<svg/g)).toHaveLength(1)
  })
})

describe('pieChart authoring', () => {
  const draftOf = (props: Record<string, unknown>): DraftAuthoringTask => {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      target: { packId: 'p', gradeId: 'g', areaId: 'a', topicId: 't', topicTitle: 'T' },
      task: { question: 'Zeichne.', unit: '', solution: 's', explanation: 'Erklärung.', hint: '' },
      element: { type: 'pieChart', props },
    } as DraftAuthoringTask
  }
  const props = { items: 'Fußball = 40\nSchwimmen = 35\nTanzen = 25' }

  it('builds a task, exports a snippet and validates', () => {
    const d = draftOf(props)
    expect(validateDraft(d)).toEqual([])
    const t = draftToTask(d)
    expect(t.interactive?.type).toBe('pieChart')
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(pc(null))).toBe(false)
    const code = exportGeneratorSnippet(d)
    expect(code).toContain('pieChartTask({')
    expect(code).toContain('categories: ["Fußball","Schwimmen","Tanzen"],')
    expect(code).toContain('percents: [40,35,25],')
    expect(code).not.toContain('snapPercent')
    expect(code).not.toContain('tolerance')
  })

  it('the snippet emits every non-default prop', () => {
    const code = exportGeneratorSnippet(draftOf({ items: 'A = 50\nB = 30\nC = 20', snapPercent: '10', tolerance: '4' }))
    expect(code).toContain('snapPercent: 10,')
    expect(code).toContain('tolerance: 4,')
  })

  it('accepts a percent sign and decimal commas for the tolerance, rejects invalid drafts', () => {
    expect(validateDraft(draftOf({ items: 'A = 60 %\nB = 40 %' }))).toEqual([])
    expect(validateDraft(draftOf({ ...props, tolerance: '2,5' }))).toEqual([])
    expect(validateDraft(draftOf({ items: 'A = 60' })).length).toBeGreaterThan(0)
    expect(validateDraft(draftOf({ items: 'A = 60\nB = 30' })).join(' ')).toMatch(/Kreisdiagramm/)
    expect(validateDraft(draftOf({ items: 'A = 50\nB = 50' })).length).toBeGreaterThan(0) // start state
    expect(validateDraft(draftOf({ items: 'A = 60\nB = x' })).length).toBeGreaterThan(0)
  })
})
