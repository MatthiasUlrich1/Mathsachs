import { describe, expect, it } from 'vitest'
import { divideToolTask, type DivideToolTaskInput } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { formatExamAnswer } from '../components/ExamProtocolSheet'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { createEmptyDraft, draftToTask, exportGeneratorSnippet, validateDraft, type DraftAuthoringTask } from '../lib/taskAuthoring'
import { divideSolutionAssignment, emptyAssignment } from '../lib/divideToolLogic'
import { emptyInput, type UserInput } from './types'

const base = { question: 'q', solution: 's', explanation: 'e' }
const make = (over: Partial<DivideToolTaskInput> = {}) =>
  divideToolTask({ ...base, shape: 'circle', count: 3, persons: 4, ...over } as DivideToolTaskInput)
const divide = (partsPerWhole: number, assignment: Array<number | null>): UserInput => ({
  kind: 'divideTool',
  partsPerWhole,
  assignment,
})

describe('divideToolTask', () => {
  it('sampleAnswer passes check; untouched, wrong kind and unequal shares fail', () => {
    const t = make()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check({ kind: 'text', value: '3/4' } as unknown as UserInput)).toBe(false)
    expect(t.check(divide(4, emptyAssignment(3, 4)))).toBe(false)
    const eq = divideSolutionAssignment(3, 4, 4)!
    expect(t.check(divide(4, eq.map((v, i) => (i === 0 ? null : v))))).toBe(false)
  })

  it('accepts every fair division: 4, 8 and 12 parts per pizza for 3 pizzas and 4 children', () => {
    const t = make()
    expect(t.check(divide(4, divideSolutionAssignment(3, 4, 4)!))).toBe(true)
    expect(t.check(divide(8, divideSolutionAssignment(3, 4, 8)!))).toBe(true)
    expect(t.check(divide(12, divideSolutionAssignment(3, 4, 12)!))).toBe(true)
    // 6 parts per pizza: 18 parts cannot be shared by 4 children
    expect(t.check(divide(6, Array.from({ length: 18 }, (_, i) => i % 4)))).toBe(false)
  })

  it('judges the share exactly (2 wholes, 6 persons: 3 parts work, 4 do not)', () => {
    const t = make({ count: 2, persons: 6 })
    expect(t.check(divide(3, [0, 1, 2, 3, 4, 5]))).toBe(true)
    expect(t.check(divide(4, [0, 1, 2, 3, 4, 5, 0, 1]))).toBe(false)
    expect(t.check(divide(6, [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]))).toBe(true)
  })

  it('config exposes shape, count, persons and objectName, but no solution data', () => {
    const t = make({ objectName: 'Torte' })
    expect(t.interactive).toMatchObject({
      type: 'divideTool',
      props: { shape: 'circle', count: 3, persons: 4, objectName: 'Torte' },
    })
    expect(JSON.stringify(t.interactive!.props)).not.toMatch(/partsPerWhole|assignment/)
    expect(make({ shape: 'bar' }).interactive!.props.objectName).toBe('Schokoriegel')
    expect(make().interactive!.props.objectName).toBe('Pizza')
  })

  it('throws for unusable input', () => {
    expect(() => make({ shape: 'square' } as never)).toThrow(/shape/)
    expect(() => make({ count: 0 })).toThrow(/count/)
    expect(() => make({ count: 5 })).toThrow(/count/)
    expect(() => make({ persons: 1 })).toThrow(/persons/)
    expect(() => make({ persons: 7 })).toThrow(/persons/)
    expect(() => make({ count: 4, persons: 2 })).toThrow(/without dividing/)
    expect(() => make({ count: 3, persons: 3 })).toThrow(/without dividing/)
    expect(() => make({ count: 2.5 as number })).toThrow(/count/)
  })

  it('trims the dedupeKey', () => {
    expect(make({ dedupeKey: ' k ' }).dedupeKey).toBe('k')
    expect(make().dedupeKey).toBeUndefined()
  })
})

describe('divideTool wiring', () => {
  it('initTaskInput starts undivided with count null entries; emptyInput is empty', () => {
    expect(initTaskInput(make({ count: 2, persons: 3 }))).toEqual(divide(1, [null, null]))
    expect(emptyInput('divideTool')).toEqual(divide(1, []))
  })

  it('exam: only a handed-out part counts as attempted; the stepper alone does not', () => {
    const t = make()
    expect(examAnswerAttempted(t, divide(1, [null, null, null]))).toBe(false)
    expect(examAnswerAttempted(t, divide(4, emptyAssignment(3, 4)))).toBe(false)
    expect(examAnswerAttempted(t, divide(4, [null, 2, ...new Array(10).fill(null)]))).toBe(true)
    expect(examAnswerAttempted(t, divide(1, [0, null, null]))).toBe(true)
  })

  it('exam protocol text', () => {
    expect(formatExamAnswer(divide(4, emptyAssignment(3, 4)))).toBe('—')
    expect(formatExamAnswer(divide(4, [0, 1, ...new Array(10).fill(null)]))).toBe(
      '4 Teile pro Ganzes, 2 von 12 Teilen verteilt',
    )
  })

  it('worksheet: wholes and people, typed field, and a visualContent comes first', () => {
    const t = make()
    const extras = worksheetPrintExtras(t)
    expect(extras.visualHtml).toContain('<svg')
    expect(extras.visualHtml!.match(/<path /g)).toHaveLength(3)
    for (let i = 1; i <= 4; i++) expect(extras.visualHtml).toContain(`Kind ${i}`)
    expect(extras.answerBlank).toBe('Jedes Kind bekommt __________ Pizza')
    expect(extras.paperHint).toContain('Teile')
    expect(extras.paperHint).not.toContain('Tippe')
    const withVisual = worksheetPrintExtras({ ...t, visualContent: '<svg id="ref"></svg>' })
    expect(withVisual.visualHtml!.startsWith('<svg id="ref">')).toBe(true)
    expect(withVisual.visualHtml!.match(/<path /g)).toHaveLength(3)
    expect(worksheetPrintExtras(make({ shape: 'bar', objectName: 'Schokoladentafel' })).answerBlank).toBe(
      'Jedes Kind bekommt __________ Schokoladentafel',
    )
  })
})

describe('divideTool authoring', () => {
  const draftOf = (props: Record<string, unknown>): DraftAuthoringTask => {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      target: { packId: 'p', gradeId: 'g', areaId: 'a', topicId: 't', topicTitle: 'T' },
      task: { question: 'Teile gerecht.', unit: '', solution: 's', explanation: 'Erklärung.', hint: '' },
      element: { type: 'divideTool', props },
    } as DraftAuthoringTask
  }
  it('builds a task, exports a snippet and validates', () => {
    const d = draftOf({ shape: 'circle', count: 3, persons: 4, objectName: 'Pizza' })
    expect(validateDraft(d)).toEqual([])
    const t = draftToTask(d)
    expect(t.interactive?.type).toBe('divideTool')
    expect(t.check(t.sampleAnswer)).toBe(true)
    const snippet = exportGeneratorSnippet(d)
    expect(snippet).toContain('divideToolTask({')
    expect(snippet).toContain('count: 3,')
    expect(snippet).toContain('persons: 4,')
    expect(snippet).toContain('objectName: "Pizza"')
  })
  it('reports invalid drafts', () => {
    const bad = (p: Record<string, unknown>) => validateDraft(draftOf(p)).join(' ')
    expect(bad({ shape: 'circle', count: 4, persons: 2 })).toContain('Teilwerkzeug')
    expect(bad({ shape: 'circle', count: 9, persons: 4 })).toContain('Teilwerkzeug')
    expect(bad({ shape: 'circle', count: 3, persons: 'x' })).toContain('Teilwerkzeug')
  })
})
