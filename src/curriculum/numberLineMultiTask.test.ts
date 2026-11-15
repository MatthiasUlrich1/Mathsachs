import { describe, expect, it } from 'vitest'
import { numberLineMultiTask, type NumberLineMultiTaskInput } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { formatExamAnswer } from '../components/ExamProtocolSheet'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { createEmptyDraft, draftToTask, exportGeneratorSnippet, validateDraft, type DraftAuthoringTask } from '../lib/taskAuthoring'
import { emptyInput, type UserInput } from './types'

const base: NumberLineMultiTaskInput = {
  question: 'Ordne die Brüche am Zahlenstrahl ein.',
  min: 0,
  max: 2,
  step: 0.25,
  labelEvery: 4,
  items: [
    { id: 'a', label: '1/4', value: 0.25 },
    { id: 'b', label: '3/4', value: 0.75 },
    { id: 'c', label: '3/2', value: 1.5 },
  ],
  solution: '1/4 < 3/4 < 3/2',
  explanation: 'Erklärung.',
}
const make = (over: Partial<NumberLineMultiTaskInput> = {}) => numberLineMultiTask({ ...base, ...over })
const pos = (positions: Record<string, number>): UserInput => ({ kind: 'numberLineMulti', positions })

describe('numberLineMultiTask check', () => {
  it('sampleAnswer passes; untouched, partial, wrong, off-grid and wrong kind fail', () => {
    const t = make()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(pos({ a: 0.25, b: 0.75 }))).toBe(false)
    expect(t.check(pos({ a: 0.75, b: 0.25, c: 1.5 }))).toBe(false)
    expect(t.check(pos({ a: 0.25, b: 0.75, c: 1.25 }))).toBe(false)
    expect(t.check({ kind: 'text', value: '1/4' } as unknown as UserInput)).toBe(false)
  })

  it('default tolerance is half the snap (snap defaults to step / 2): one grid step off still fails', () => {
    const t = make() // snap 0.125, tolerance 0.0625
    expect(t.check(pos({ a: 0.25, b: 0.75, c: 1.5 }))).toBe(true)
    expect(t.check(pos({ a: 0.375, b: 0.75, c: 1.5 }))).toBe(false)
    expect(t.check(pos({ a: 0.25 + 0.0625, b: 0.75, c: 1.5 }))).toBe(true)
  })

  it('a custom tolerance widens the check', () => {
    const t = make({ tolerance: 0.125 })
    expect(t.check(pos({ a: 0.375, b: 0.75, c: 1.5 }))).toBe(true)
    expect(t.check(pos({ a: 0.5, b: 0.75, c: 1.5 }))).toBe(false)
  })
})

describe('numberLineMultiTask config', () => {
  it('has the line, snap, labelEvery, labels in a tray order that is not the solution, and no values', () => {
    const t = make()
    const p = t.interactive!.props
    expect(t.interactive!.type).toBe('numberLineMulti')
    expect([p.min, p.max, p.step, p.snap, p.labelEvery]).toEqual([0, 2, 0.25, 0.125, 4])
    expect(p.items).toEqual([
      { id: 'a', label: '1/4' },
      { id: 'b', label: '3/4' },
      { id: 'c', label: '3/2' },
    ])
    expect([...(p.order as string[])].sort()).toEqual(['a', 'b', 'c'])
    expect((p.order as string[]).join('')).not.toBe('abc')
    expect((p.order as string[]).join('')).not.toBe('cba')
    // nothing of the solution in the props
    expect(JSON.stringify([p.items, p.order])).not.toMatch(/value|0\.75|1\.5/)
    // negative control: the same check does catch a leaked value
    expect(JSON.stringify([{ id: 'a', label: '1/4', value: 0.25 }])).toMatch(/value/)
  })

  it('the tray order is deterministic per task', () => {
    expect(make().interactive!.props.order).toEqual(make().interactive!.props.order)
  })

  it('defaults labelEvery to every tick up to 10 ticks, otherwise every 2nd', () => {
    expect(make({ labelEvery: undefined, step: 0.5, items: [{ id: 'a', label: '0,25', value: 0.25 }, { id: 'b', label: '0,75', value: 0.75 }] }).interactive!.props.labelEvery).toBe(1)
    const t = make({ min: 0, max: 2, step: 0.1, snap: 0.05, labelEvery: undefined })
    expect(t.interactive!.props.labelEvery).toBe(2)
  })

  it('takes an own instruction and trims the dedupeKey', () => {
    expect(make({ instruction: 'Zieh!' }).interactive!.props.instruction).toBe('Zieh!')
    expect(make().interactive!.props.instruction).toMatch(/Ziehe/)
    expect(make({ dedupeKey: '  k  ' }).dedupeKey).toBe('k')
    expect(make().dedupeKey).toBeUndefined()
  })

  it('throws for unusable input', () => {
    const two = base.items.slice(0, 2)
    expect(() => make({ min: 2, max: 0 })).toThrow(/min < max/)
    expect(() => make({ step: 0 })).toThrow(/step/)
    expect(() => make({ max: 2.1 })).toThrow(/multiple of step/)
    expect(() => make({ snap: 0.2 })).toThrow(/snap/)
    expect(() => make({ snap: 0.5 })).toThrow(/snap/)
    expect(() => make({ tolerance: -1 })).toThrow(/tolerance/)
    expect(() => make({ labelEvery: 0 })).toThrow(/labelEvery/)
    expect(() => make({ labelEvery: 1.5 })).toThrow(/labelEvery/)
    expect(() => make({ items: two.slice(0, 1) })).toThrow(/items/)
    expect(() => make({ items: [...base.items, { id: 'd', label: '7/4', value: 1.75 }, { id: 'e', label: '1/2', value: 0.5 }, { id: 'f', label: '5/4', value: 1.25 }] })).toThrow(/items/)
    expect(() => make({ items: [two[0]!, { ...two[1]!, id: 'a' }] })).toThrow(/unique/)
    expect(() => make({ items: [two[0]!, { ...two[1]!, id: '' }] })).toThrow(/unique/)
    expect(() => make({ items: [two[0]!, { ...two[1]!, label: '' }] })).toThrow(/label/)
    expect(() => make({ items: [two[0]!, { ...two[1]!, label: '12345678' }] })).toThrow(/label/)
    expect(() => make({ items: [two[0]!, { ...two[1]!, value: 2.5 }] })).toThrow(/outside/)
    expect(() => make({ items: [two[0]!, { ...two[1]!, value: 0.8 }] })).toThrow(/snap grid/)
    expect(() => make({ items: [two[0]!, { ...two[1]!, value: 0.25 }] })).toThrow(/differ/)
    expect(() => make({ max: 1000, step: 0.1, snap: 0.05 })).toThrow(/ticks/)
  })

  it('refuses a value that is already written on the line (the line must not give the answer away)', () => {
    // labelEvery 1 writes 0,25 / 0,5 / ... on the line
    expect(() => make({ labelEvery: 1 })).toThrow(/already written/)
    // min and max are always written
    expect(() => make({ items: [{ id: 'a', label: '0', value: 0 }, { id: 'b', label: '3/4', value: 0.75 }] })).toThrow(/already written/)
    expect(() => make({ items: [{ id: 'a', label: '2', value: 2 }, { id: 'b', label: '3/4', value: 0.75 }] })).toThrow(/already written/)
  })
})

describe('numberLineMulti wiring', () => {
  it('initTaskInput and emptyInput place nothing', () => {
    expect(initTaskInput(make())).toEqual({ kind: 'numberLineMulti', positions: {} })
    expect(emptyInput('numberLineMulti')).toEqual({ kind: 'numberLineMulti', positions: {} })
  })

  it('exam: attempted as soon as one label is placed; untouched is not', () => {
    const t = make()
    expect(examAnswerAttempted(t, pos({}))).toBe(false)
    expect(examAnswerAttempted(t, pos({ b: 0.75 }))).toBe(true)
    expect(examAnswerAttempted(t, t.sampleAnswer)).toBe(true)
  })

  it('exam protocol text', () => {
    expect(formatExamAnswer(pos({}))).toBe('—')
    expect(formatExamAnswer(pos({ a: 0.25, c: 1.5 }))).toBe('a: 0,25; c: 1,5')
  })

  it('worksheet: ticks and the labels listed, not the target positions; visualContent comes first', () => {
    const t = make()
    const extras = worksheetPrintExtras(t)
    expect(extras.visualHtml).toContain('<svg')
    expect(extras.visualHtml!.match(/<line /g)).toHaveLength(1 + 9)
    expect(extras.visualHtml!.match(/<text /g)).toHaveLength(3)
    expect(extras.paperHint!.startsWith('Trage ein: ')).toBe(true)
    for (const l of ['1/4', '3/4', '3/2']) expect(extras.paperHint).toContain(l)
    expect(extras.paperHint).not.toMatch(/zieh/i)
    expect(extras.answerBlank).toBeTruthy()
    const withVisual = worksheetPrintExtras({ ...t, visualContent: '<svg id="ref"></svg>' })
    expect(withVisual.visualHtml!.startsWith('<svg id="ref">')).toBe(true)
    expect(withVisual.visualHtml!.match(/<line /g)).toHaveLength(1 + 9)
  })

  it('worksheet lists the labels in the same shuffled order as the tray', () => {
    const t = make()
    const order = (t.interactive!.props.order as string[]).map((id) => base.items.find((i) => i.id === id)!.label)
    expect(worksheetPrintExtras(t).paperHint).toBe(`Trage ein: ${order.join(', ')}`)
  })
})

describe('numberLineMulti exam output', () => {
  it('shows the labels, not the ids, when the task is known', () => {
    const t = make()
    expect(formatExamAnswer(pos({ a: 0.25, c: 1.5 }), t)).toBe('1/4: 0,25; 3/2: 1,5')
    expect(formatExamAnswer(pos({ a: 0.25 }))).toBe('a: 0,25')
    expect(formatExamAnswer(pos({}), t)).toBe('—')
  })
})

describe('numberLineMulti authoring', () => {
  const draftOf = (props: Record<string, unknown>): DraftAuthoringTask => {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      target: { packId: 'p', gradeId: 'g', areaId: 'a', topicId: 't', topicTitle: 'T' },
      task: { question: 'Ordne ein.', unit: '', solution: 's', explanation: 'Erklärung.', hint: '' },
      element: { type: 'numberLineMulti', props },
    } as DraftAuthoringTask
  }
  const props = { min: '0', max: '2', step: '0,25', labelEvery: '4', items: '3/4 = 0,75\n1,5 = 1,5\n1/4 = 0,25' }

  it('builds a task, exports a snippet and validates', () => {
    const d = draftOf(props)
    expect(validateDraft(d)).toEqual([])
    const t = draftToTask(d)
    expect(t.interactive?.type).toBe('numberLineMulti')
    expect(t.check(t.sampleAnswer)).toBe(true)
    const code = exportGeneratorSnippet(d)
    expect(code).toContain('numberLineMultiTask({')
    expect(code).toContain('step: 0.25,')
    expect(code).toContain('"label":"3/4"')
  })

  it('the exported snippet keeps snap and labelEvery, so the panel default round-trips', () => {
    const panelDefault = { min: 0, max: 2, step: 0.25, labelEvery: 4, items: '3/4 = 0,75\n1,5 = 1,5\n1/4 = 0,25' }
    const code = exportGeneratorSnippet(draftOf(panelDefault))
    expect(code).toContain('labelEvery: 4,')
    expect(exportGeneratorSnippet(draftOf({ ...panelDefault, snap: '0,25' }))).toContain('snap: 0.25,')
    // run the exported call against the real helper
    const run = (snippet: string) =>
      new Function('numberLineMultiTask', `return ${snippet.slice(snippet.indexOf('numberLineMultiTask('))}`)(numberLineMultiTask)
    expect(() => run(code)).not.toThrow()
    // negative control: without labelEvery the line writes 0,25 / 0,75 and the helper refuses
    expect(() => run(code.replace('labelEvery: 4,', ''))).toThrow(/already written/)
  })

  it('reports invalid drafts', () => {
    const bad = (p: Record<string, unknown>) => validateDraft(draftOf(p)).join(' ')
    expect(bad({ ...props, items: '3/4 = 0,75' })).toContain('Zahlengerade')
    expect(bad({ ...props, items: '3/4 = 0,8\n1,5 = 1,5' })).toContain('Zahlengerade')
    expect(bad({ ...props, items: '3/4\n1,5 = 1,5' })).toContain('Zahlengerade')
    expect(bad({ ...props, max: '-1' })).toContain('Zahlengerade')
    expect(bad({ ...props, labelEvery: '1' })).toContain('Zahlengerade')
  })
})
