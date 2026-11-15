import { describe, expect, it } from 'vitest'
import { clockTask, type ClockTaskInput } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { formatExamAnswer } from '../components/ExamProtocolSheet'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { createEmptyDraft, draftToTask, exportGeneratorSnippet, validateDraft, type DraftAuthoringTask } from '../lib/taskAuthoring'
import { emptyInput, type UserInput } from './types'

const timeBase: ClockTaskInput = {
  question: 'Es ist Viertel nach 3. Zeige diese Uhrzeit an der Uhr.',
  mode: 'setTime',
  time: { h: 3, m: 15 },
  solution: '3:15 Uhr',
  explanation: 'Erklärung.',
}
const angleBase: ClockTaskInput = {
  question: 'Finde eine Uhrzeit, bei der der kleinere Winkel zwischen den Zeigern 90° beträgt.',
  mode: 'angle',
  angle: 90,
  solution: 'z. B. 3:00 Uhr',
  explanation: 'Erklärung.',
}
const time = (over: Partial<ClockTaskInput> = {}) => clockTask({ ...timeBase, ...over })
const angle = (over: Partial<ClockTaskInput> = {}) => clockTask({ ...angleBase, ...over })
const ck = (h: number, m: number, touched = true): UserInput => ({ kind: 'clock', h, m, touched })

describe('clockTask check, mode setTime', () => {
  it('sampleAnswer passes; untouched, wrong times and the wrong kind fail', () => {
    const t = time()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(ck(3, 15, false))).toBe(false) // stored values without touching are no answer
    expect(t.check(ck(3, 20))).toBe(false)
    expect(t.check(ck(4, 15))).toBe(false)
    expect(t.check(ck(9, 15))).toBe(false)
    expect(t.check({ kind: 'text', value: '3:15' } as unknown as UserInput)).toBe(false)
  })

  it('compares modulo 12 hours (analog clock): 15:15 is 3:15', () => {
    const t = time({ time: { h: 15, m: 15 } })
    expect(t.check(ck(3, 15))).toBe(true)
    expect((t.sampleAnswer as { h: number }).h).toBe(3)
  })

  it('accepts the hour 12 as 0 (12:30)', () => {
    const t = time({ time: { h: 12, m: 30 } })
    expect(t.check(ck(0, 30))).toBe(true)
    expect(t.check(ck(6, 30))).toBe(false)
  })

  it('works with a one-minute snap', () => {
    const t = time({ time: { h: 7, m: 23 }, minuteSnap: 1 })
    expect(t.check(ck(7, 23))).toBe(true)
    expect(t.check(ck(7, 25))).toBe(false)
    expect(t.interactive!.props.minuteSnap).toBe(1)
  })
})

describe('clockTask check, mode angle', () => {
  it('any time with the right angle passes (within 2.5 degrees), the others fail', () => {
    const t = angle()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(ck(3, 0))).toBe(true)
    expect(t.check(ck(9, 0))).toBe(true)
    expect(t.check(ck(3, 5))).toBe(false) // 62.5 degrees
    expect(t.check(ck(4, 0))).toBe(false)
    expect(t.check(ck(0, 0, false))).toBe(false)
    expect(t.check(initTaskInput(t))).toBe(false)
  })

  it('half-hour times and a wider tolerance', () => {
    const t = angle({ angle: 45 })
    expect(t.check(ck(7, 30))).toBe(true)
    expect(t.check(ck(4, 30))).toBe(true)
    expect(t.check(ck(7, 35))).toBe(false) // 17.5 degrees
    const loose = angle({ angle: 45, minuteSnap: 1, angleTolerance: 6 })
    expect(loose.check(ck(7, 31))).toBe(true) // 39.5 degrees
    expect(loose.check(ck(7, 32))).toBe(false) // 34 degrees
  })

  it('exampleTime must form the angle; the sample answer is the example', () => {
    const t = angle({ exampleTime: { h: 9, m: 0 } })
    expect(t.sampleAnswer).toEqual({ kind: 'clock', h: 9, m: 0, touched: true })
    expect(() => angle({ exampleTime: { h: 4, m: 0 } })).toThrow(/exampleTime/)
    expect(() => angle({ exampleTime: { h: 3, m: 3 } })).toThrow(/exampleTime/)
  })
})

describe('clockTask object', () => {
  it('the start state is identical for every target and the targets are not in the props', () => {
    const a = time()
    const b = time({ time: { h: 9, m: 50 } })
    const c = angle()
    expect(initTaskInput(a)).toEqual(initTaskInput(b))
    expect(initTaskInput(a)).toEqual({ kind: 'clock', h: 0, m: 0, touched: false })
    expect(initTaskInput(c)).toEqual(initTaskInput(a))
    expect(a.interactive!.props).toEqual(b.interactive!.props)
    expect(JSON.stringify(a.interactive!.props)).not.toMatch(/"time"|"angle"|"h"|"m"|"value"|exampleTime/)
    expect(a.interactive!.type).toBe('clock')
    expect(a.question).not.toMatch(/zieh|tippe|klick|pfeiltaste|punkt/i)
  })

  it('the angle task keeps its mode in the props (for the worksheet) and omits a default snap', () => {
    expect(angle().interactive!.props.mode).toBe('angle')
    expect(time().interactive!.props.mode).toBe('setTime')
    expect('minuteSnap' in time().interactive!.props).toBe(false)
  })

  it('keeps visualContent and dedupeKey', () => {
    const t = time({ visualContent: '<svg id="x"></svg>', dedupeKey: ' k1 ' })
    expect(t.visualContent).toBe('<svg id="x"></svg>')
    expect(t.dedupeKey).toBe('k1')
    expect(time().visualContent).toBeUndefined()
  })

  it('throws for the start state and other invalid input', () => {
    expect(() => time({ time: { h: 12, m: 0 } })).toThrow(/start state/)
    expect(() => time({ time: { h: 0, m: 0 } })).toThrow(/start state/)
    expect(() => time({ time: { h: 3, m: 12 } })).toThrow(/multiple/)
    expect(() => time({ time: { h: 25, m: 0 } })).toThrow(/time\.h/)
    expect(() => time({ time: undefined })).toThrow(/needs time/)
    expect(() => time({ minuteSnap: 3 })).toThrow(/minuteSnap/)
    expect(() => angle({ angle: 0 })).toThrow(/greater than 0/)
    expect(() => angle({ angle: 2 })).toThrow(/start state/)
    expect(() => angle({ angle: 200 })).toThrow(/at most 180/)
    expect(() => angle({ angle: 17, angleTolerance: 0 })).toThrow(/no time/)
    expect(() => angle({ angle: 17, minuteSnap: 1, angleTolerance: 0.5 })).not.toThrow()
    expect(() => angle({ angle: undefined })).toThrow(/angle/)
    expect(() => time({ mode: 'other' as 'setTime' })).toThrow(/unknown mode/)
  })
})

describe('clock wiring', () => {
  it('initTaskInput and emptyInput are untouched at 12:00', () => {
    expect(initTaskInput(time())).toEqual({ kind: 'clock', h: 0, m: 0, touched: false })
    expect(emptyInput('clock')).toEqual({ kind: 'clock', h: 0, m: 0, touched: false })
  })

  it('exam: attempted as soon as a hand was moved; the 12:00 start is not', () => {
    const t = time()
    expect(examAnswerAttempted(t, ck(0, 0, false))).toBe(false)
    expect(examAnswerAttempted(t, ck(0, 5))).toBe(true)
    expect(examAnswerAttempted(t, t.sampleAnswer)).toBe(true)
  })

  it('exam protocol text shows the time or marks an untouched clock', () => {
    expect(formatExamAnswer(ck(0, 0, false))).toBe('—')
    expect(formatExamAnswer(ck(7, 25))).toBe('7:25 Uhr')
    expect(formatExamAnswer(ck(0, 5))).toBe('12:05 Uhr')
  })

  it('worksheet setTime: given data first, then the empty clock face without hands', () => {
    const extras = worksheetPrintExtras(time({ visualContent: '<svg id="given"></svg>' }))
    expect(extras.visualHtml!.startsWith('<svg id="given"></svg>')).toBe(true)
    expect(extras.visualHtml!.match(/<svg/g)).toHaveLength(2)
    expect(extras.visualHtml!.match(/<line/g)).toHaveLength(60) // ticks only, no hands
    expect(extras.paperHint).toMatch(/Zeichne/)
    expect(extras.paperHint).not.toMatch(/zieh/i)
    expect(worksheetPrintExtras(time()).visualHtml!.match(/<svg/g)).toHaveLength(1)
  })

  it('worksheet angle: a Uhr field and the given data, no clock face', () => {
    const extras = worksheetPrintExtras(angle({ visualContent: '<svg id="given"></svg>' }))
    expect(extras.answerBlank).toMatch(/_+ Uhr/)
    expect(extras.visualHtml).toBe('<svg id="given"></svg>')
    expect(worksheetPrintExtras(angle()).visualHtml).toBeUndefined()
    expect(extras.paperHint).not.toMatch(/zieh/i)
  })
})

describe('clock authoring', () => {
  const draftOf = (props: Record<string, unknown>): DraftAuthoringTask => {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      target: { packId: 'p', gradeId: 'g', areaId: 'a', topicId: 't', topicTitle: 'T' },
      task: { question: 'Zeige die Uhrzeit an der Uhr.', unit: '', solution: 's', explanation: 'Erklärung.', hint: '' },
      element: { type: 'clock', props },
    } as DraftAuthoringTask
  }

  it('builds a setTime task, exports a snippet and validates', () => {
    const d = draftOf({ mode: 'setTime', time: '7:25', minuteSnap: 5 })
    expect(validateDraft(d)).toEqual([])
    const t = draftToTask(d)
    expect(t.interactive?.type).toBe('clock')
    expect(t.check({ kind: 'clock', h: 7, m: 25, touched: true })).toBe(true)
    const snippet = exportGeneratorSnippet(d)
    expect(snippet).toContain('clockTask({')
    expect(snippet).toContain('mode: "setTime"')
    expect(snippet).toContain('{"h":7,"m":25}')
    expect(snippet).not.toContain('minuteSnap')
  })

  it('builds an angle task and exports every non-default prop', () => {
    const d = draftOf({ mode: 'angle', angle: '45', exampleTime: '7:30', tolerance: '6', minuteSnap: '1' })
    expect(validateDraft(d)).toEqual([])
    const t = draftToTask(d)
    expect(t.sampleAnswer).toEqual({ kind: 'clock', h: 7, m: 30, touched: true })
    expect(t.check({ kind: 'clock', h: 7, m: 31, touched: true })).toBe(true)
    expect(t.check({ kind: 'clock', h: 7, m: 32, touched: true })).toBe(false)
    const snippet = exportGeneratorSnippet(d)
    for (const part of ['angle: 45', 'exampleTime', 'angleTolerance: 6', 'minuteSnap: 1']) expect(snippet).toContain(part)
  })

  it('reports invalid drafts', () => {
    expect(validateDraft(draftOf({ mode: 'setTime', time: '12:00' })).join(' ')).toMatch(/Uhr/)
    expect(validateDraft(draftOf({ mode: 'setTime', time: 'abc' })).join(' ')).toMatch(/Uhr/)
    expect(validateDraft(draftOf({ mode: 'setTime', time: '7:23' })).join(' ')).toMatch(/Uhr/)
    expect(validateDraft(draftOf({ mode: 'angle', angle: '0' })).join(' ')).toMatch(/Uhr/)
    expect(validateDraft(draftOf({ mode: 'angle', angle: '17', tolerance: '0' })).join(' ')).toMatch(/Uhr/)
  })
})
