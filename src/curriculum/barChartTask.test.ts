import { describe, expect, it } from 'vitest'
import { barChartTask, type BarChartTaskInput } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { formatExamAnswer } from '../components/ExamProtocolSheet'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { createEmptyDraft, draftToTask, exportGeneratorSnippet, validateDraft, type DraftAuthoringTask } from '../lib/taskAuthoring'
import { emptyInput, type UserInput } from './types'

const base: BarChartTaskInput = {
  question: 'Stelle die Umfrage in einem Säulendiagramm dar.',
  categories: ['Hund', 'Katze', 'Fisch', 'Pferd'],
  data: [8, 6, 3, 0],
  yMax: 10,
  step: 1,
  yLabel: 'Anzahl Kinder',
  solution: 'Hund 8, Katze 6, Fisch 3, Pferd 0',
  explanation: 'Erklärung.',
}
const make = (over: Partial<BarChartTaskInput> = {}) => barChartTask({ ...base, ...over })
const vals = (values: Array<number | null>): UserInput => ({ kind: 'barChart', values })

describe('barChartTask check', () => {
  it('sampleAnswer passes; untouched, partial, wrong, an untouched zero bar and the wrong kind fail', () => {
    const t = make()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(vals([8, 6, 3, null]))).toBe(false) // the 0 bar must be set too
    expect(t.check(vals([8, 6, 2, 0]))).toBe(false)
    expect(t.check(vals([8, 6, 3]))).toBe(false)
    expect(t.check({ kind: 'text', value: '8' } as unknown as UserInput)).toBe(false)
  })

  it('values are snapped before the comparison', () => {
    const t = make()
    expect(t.check(vals([8.2, 5.8, 3, 0.3]))).toBe(true)
    expect(t.check(vals([8.6, 6, 3, 0]))).toBe(false)
  })

  it('works with a decimal step', () => {
    const t = make({ data: [0.5, 1, 1.5, 0], yMax: 2, step: 0.5 })
    expect(t.check(vals([0.5, 1, 1.5, 0]))).toBe(true)
    expect(t.check(vals([0.5, 1, 1, 0]))).toBe(false)
  })
})

describe('barChartTask content of the task object', () => {
  it('the start state is not the answer for any bar, and the targets are not in the props', () => {
    const t = make()
    const props = t.interactive!.props
    expect(props.starts).toEqual([0, 0, 0, 1]) // the zero bar starts one step up
    const data = base.data
    ;(props.starts as number[]).forEach((s, i) => expect(s).not.toBe(data[i]))
    expect(JSON.stringify(props)).not.toMatch(/"data"|"values"|"value"/)
    expect(t.interactive!.type).toBe('barChart')
    expect(typeof props.instruction).toBe('string')
    // screen-only hints stay out of the question
    expect(t.question).not.toMatch(/zieh|tippe|klick|pfeiltaste/i)
  })

  it('keeps visualContent, dedupeKey and omits an empty axis title', () => {
    const t = make({ visualContent: '<svg id="tab"></svg>', dedupeKey: ' k1 ', yLabel: undefined })
    expect(t.visualContent).toBe('<svg id="tab"></svg>')
    expect(t.dedupeKey).toBe('k1')
    expect('yLabel' in t.interactive!.props).toBe(false)
    expect(make().visualContent).toBeUndefined()
  })

  it('rejects invalid input', () => {
    expect(() => make({ categories: ['A'], data: [1] })).toThrow(/categories/)
    expect(() => make({ data: [1, 2] })).toThrow(/data/)
    expect(() => make({ yMax: 7, step: 2 })).toThrow(/multiple/)
    expect(() => make({ data: [8, 6, 3, 11] })).toThrow(/outside/)
    expect(() => make({ data: [8, 6, 3, 1.5] })).toThrow(/multiple of step/)
    expect(() => make({ yMax: 100, step: 1 })).toThrow(/yMax \/ step/)
    expect(() => make({ yLabel: 'x'.repeat(30) })).toThrow(/axis label/)
    expect(() => make({ categories: ['Hund', 'Hund', 'Fisch', 'Pferd'] })).toThrow(/differ/)
    expect(() => make({ categories: ['Hund', 'Katze', 'Fisch', 'Eine zu lange Beschriftung'] })).toThrow(/category/)
  })
})

describe('barChart wiring', () => {
  it('initTaskInput gives one untouched bar per category; emptyInput is empty', () => {
    expect(initTaskInput(make())).toEqual({ kind: 'barChart', values: [null, null, null, null] })
    expect(emptyInput('barChart')).toEqual({ kind: 'barChart', values: [] })
  })

  it('exam: attempted as soon as one bar was moved; untouched is not', () => {
    const t = make()
    expect(examAnswerAttempted(t, vals([null, null, null, null]))).toBe(false)
    expect(examAnswerAttempted(t, vals([]))).toBe(false)
    expect(examAnswerAttempted(t, vals([null, null, null, 0]))).toBe(true)
    expect(examAnswerAttempted(t, t.sampleAnswer)).toBe(true)
  })

  it('exam protocol text names the categories and marks untouched bars', () => {
    const t = make()
    expect(formatExamAnswer(vals([null, null, null, null]), t)).toBe('—')
    expect(formatExamAnswer(vals([8, null, 3, 0]), t)).toBe('Hund: 8; Katze: –; Fisch: 3; Pferd: 0')
    expect(formatExamAnswer(vals([2.5, null]))).toBe('Balken 1: 2,5; Balken 2: –')
  })

  it('worksheet: the table (visualContent) comes first, then the empty axes with categories and ticks, no bars', () => {
    const t = make({ visualContent: '<svg id="tab"></svg>' })
    const extras = worksheetPrintExtras(t)
    expect(extras.visualHtml!.startsWith('<svg id="tab"></svg>')).toBe(true)
    expect(extras.visualHtml!.match(/<svg/g)).toHaveLength(2)
    for (const c of base.categories) expect(extras.visualHtml).toContain(c)
    expect(extras.visualHtml).not.toContain('<rect')
    expect(extras.paperHint).toMatch(/Zeichne/)
    expect(extras.paperHint).not.toMatch(/zieh/i)
    // without visualContent the empty axes are still there
    const plain = worksheetPrintExtras(make())
    expect(plain.visualHtml!.match(/<svg/g)).toHaveLength(1)
    expect(plain.visualHtml).toContain('Anzahl Kinder')
  })
})

describe('barChart authoring', () => {
  const draftOf = (props: Record<string, unknown>): DraftAuthoringTask => {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      target: { packId: 'p', gradeId: 'g', areaId: 'a', topicId: 't', topicTitle: 'T' },
      task: { question: 'Zeichne.', unit: '', solution: 's', explanation: 'Erklärung.', hint: '' },
      element: { type: 'barChart', props },
    } as DraftAuthoringTask
  }
  const props = { yMax: '12', step: '1', yLabel: 'Anzahl Kinder', items: 'Fußball = 8\nSchwimmen = 5\nTanzen = 0' }

  it('builds a task, exports a snippet and validates', () => {
    const d = draftOf(props)
    expect(validateDraft(d)).toEqual([])
    const t = draftToTask(d)
    expect(t.interactive?.type).toBe('barChart')
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(vals([8, 5, null]))).toBe(false)
    const code = exportGeneratorSnippet(d)
    expect(code).toContain('barChartTask({')
    expect(code).toContain('categories: ["Fußball","Schwimmen","Tanzen"],')
    expect(code).toContain('data: [8,5,0],')
    expect(code).toContain('yMax: 12,')
    expect(code).toContain('yLabel: "Anzahl Kinder",')
  })

  it('the snippet emits every non-default prop and leaves the axis title out when empty', () => {
    expect(exportGeneratorSnippet(draftOf({ ...props, yLabel: '' }))).not.toContain('yLabel')
  })

  it('accepts decimal commas and rejects invalid drafts', () => {
    expect(validateDraft(draftOf({ yMax: '2', step: '0,5', items: 'A = 0,5\nB = 1,5' }))).toEqual([])
    expect(validateDraft(draftOf({ ...props, items: 'A = 8' })).length).toBeGreaterThan(0)
    expect(validateDraft(draftOf({ ...props, yMax: '5' })).join(' ')).toMatch(/Säulendiagramm/)
    expect(validateDraft(draftOf({ ...props, items: 'A = 8\nB = x' })).length).toBeGreaterThan(0)
  })
})
