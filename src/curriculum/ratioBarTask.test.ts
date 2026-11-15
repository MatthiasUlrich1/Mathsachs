import { describe, expect, it } from 'vitest'
import { ratioBarTask, type RatioBarTaskInput } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { formatExamAnswer } from '../components/ExamProtocolSheet'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { createEmptyDraft, draftToTask, exportGeneratorSnippet, validateDraft, type DraftAuthoringTask } from '../lib/taskAuthoring'
import { emptyInput, type UserInput } from './types'

const base = { question: 'q', solution: 's', explanation: 'e' }
const colour = (over: Partial<RatioBarTaskInput> = {}) =>
  ratioBarTask({ ...base, mode: 'colour', segments: 10, ratio: [2, 3], labels: ['Saft', 'Wasser'], ...over })
const split = (over: Partial<RatioBarTaskInput> = {}) =>
  ratioBarTask({ ...base, mode: 'split', ratio: [1, 3], total: 600, unit: 'ml', labels: ['Saft', 'Wasser'], ...over })
const bar = (s: string): UserInput => ({ kind: 'ratioBar', parts: [...s].map((c) => (c === '.' ? null : (c as 'A' | 'B'))) })
const amounts = (a: string, b: string): UserInput => ({ kind: 'ratioBar', parts: [], amounts: [a, b] })

describe('ratioBarTask colour', () => {
  it('sampleAnswer passes; untouched, partial, wrong ratio and wrong kind fail', () => {
    const t = colour()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(bar('AAAABBBBB.'))).toBe(false)
    expect(t.check(bar('AAAAABBBBB'))).toBe(false)
    expect(t.check(bar('BBBBAAAAAA'))).toBe(false)
    expect(t.check(bar('ABABBBABAB'))).toBe(true)
    expect(t.check({ kind: 'text', value: '2:3' } as unknown as UserInput)).toBe(false)
  })

  it('defaults to colour mode; config has mode, segments, ratio, labels, no solution data', () => {
    const t = ratioBarTask({ ...base, segments: 6, ratio: [1, 2] })
    expect(t.interactive).toMatchObject({
      type: 'ratioBar',
      props: { mode: 'colour', segments: 6, ratio: [1, 2], labels: ['erster Teil', 'zweiter Teil'] },
    })
    expect(JSON.stringify(t.interactive!.props)).not.toMatch(/parts|amounts/)
  })

  it('throws for unusable input', () => {
    expect(() => colour({ segments: 3 })).toThrow(/segments/)
    expect(() => colour({ segments: 13 })).toThrow(/segments/)
    expect(() => colour({ segments: undefined })).toThrow(/segments/)
    expect(() => colour({ segments: 9 })).toThrow(/multiple/)
    expect(() => colour({ ratio: [0, 3] })).toThrow(/ratio/)
    expect(() => colour({ ratio: [1.5, 2] as [number, number] })).toThrow(/ratio/)
    expect(() => colour({ ratio: [8, 5], segments: 12 })).toThrow(/at most/)
    expect(() => colour({ labels: ['', 'Wasser'] })).toThrow(/label/)
    expect(() => colour({ labels: ['Zitronensaftsirup', 'Wasser'] })).toThrow(/label/)
    expect(() => colour({ mode: 'x' as never })).toThrow(/mode/)
  })

  it('trims the dedupeKey', () => {
    expect(colour({ dedupeKey: ' k ' }).dedupeKey).toBe('k')
    expect(colour().dedupeKey).toBeUndefined()
  })
})

describe('ratioBarTask split', () => {
  it('sampleAnswer passes; comma decimals, swapped, empty and wrong sums fail', () => {
    const t = split()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(amounts('150', '450'))).toBe(true)
    expect(t.check(amounts('450', '150'))).toBe(false)
    expect(t.check(amounts('', ''))).toBe(false)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(amounts('150', '400'))).toBe(false)
    expect(t.check(bar('ABBB'))).toBe(false)
    const dec = split({ total: 50 })
    expect(dec.check(dec.sampleAnswer)).toBe(true)
    expect(dec.check(amounts('12,5', '37,5'))).toBe(true)
    expect(dec.check(amounts('12.5', '37.5'))).toBe(true)
    expect((dec.sampleAnswer as { amounts: string[] }).amounts).toEqual(['12,5', '37,5'])
  })

  it('config exposes ratio, total and unit but not the shares', () => {
    const t = split()
    expect(t.interactive).toMatchObject({ props: { mode: 'split', segments: 4, ratio: [1, 3], total: 600, unit: 'ml' } })
    expect(JSON.stringify(t.interactive!.props)).not.toMatch(/150|450/)
  })

  it('throws for unusable input', () => {
    expect(() => split({ total: undefined })).toThrow(/total/)
    expect(() => split({ total: 0 })).toThrow(/total/)
    expect(() => split({ total: -5 })).toThrow(/total/)
    expect(() => split({ total: 100, ratio: [1, 2] })).toThrow(/exact/)
    expect(() => split({ total: 10.005, ratio: [1, 1] })).toThrow(/exact/)
  })
})

describe('ratioBar wiring', () => {
  it('initTaskInput and emptyInput are empty', () => {
    expect(initTaskInput(colour())).toEqual({ kind: 'ratioBar', parts: [] })
    expect(initTaskInput(split())).toEqual({ kind: 'ratioBar', parts: [] })
    expect(emptyInput('ratioBar')).toEqual({ kind: 'ratioBar', parts: [] })
  })

  it('exam: coloured field or typed amount counts as attempted; untouched and blanks do not', () => {
    const t = colour()
    expect(examAnswerAttempted(t, { kind: 'ratioBar', parts: [] })).toBe(false)
    expect(examAnswerAttempted(t, bar('..........'))).toBe(false)
    expect(examAnswerAttempted(t, bar('...A......'))).toBe(true)
    const s = split()
    expect(examAnswerAttempted(s, amounts('', ' '))).toBe(false)
    expect(examAnswerAttempted(s, amounts('', '3'))).toBe(true)
  })

  it('exam protocol text', () => {
    expect(formatExamAnswer({ kind: 'ratioBar', parts: [] })).toBe('—')
    expect(formatExamAnswer(bar('AAB.'))).toBe('Felder A: 2, Felder B: 1')
    expect(formatExamAnswer(amounts('150', ''))).toBe('A: 150, B: —')
  })

  it('worksheet colour: empty bar with legend, instruction without tapping, typed counts, visualContent first', () => {
    const t = colour()
    const extras = worksheetPrintExtras(t)
    expect(extras.visualHtml).toContain('<svg')
    expect(extras.visualHtml!.match(/<rect /g)).toHaveLength(12)
    expect(extras.visualHtml).toContain('A = Saft')
    expect(extras.visualHtml).not.toContain('#fbbf24')
    expect(extras.paperHint).toContain('Färbe')
    expect(extras.paperHint).not.toMatch(/tippe/i)
    expect(extras.answerBlank).toContain('Felder A')
    const withVisual = worksheetPrintExtras({ ...t, visualContent: '<svg id="ref"></svg>' })
    expect(withVisual.visualHtml!.startsWith('<svg id="ref">')).toBe(true)
    expect(withVisual.visualHtml!.match(/<rect /g)).toHaveLength(12)
  })

  it('worksheet split: divided bar with total and two typed fields with units, visualContent first', () => {
    const t = split()
    const extras = worksheetPrintExtras(t)
    expect(extras.visualHtml).toContain('Gesamt: 600 ml')
    expect(extras.visualHtml!.match(/<rect /g)).toHaveLength(6)
    expect(extras.answerBlank).toBe('A (Saft): __________ ml     B (Wasser): __________ ml')
    expect(extras.answerBlank).not.toMatch(/150|450/)
    const withVisual = worksheetPrintExtras({ ...t, visualContent: '<svg id="ref"></svg>' })
    expect(withVisual.visualHtml!.startsWith('<svg id="ref">')).toBe(true)
    expect(withVisual.visualHtml).toContain('Gesamt: 600 ml')
  })
})

describe('ratioBar authoring', () => {
  const draftOf = (props: Record<string, unknown>): DraftAuthoringTask => {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      target: { packId: 'p', gradeId: 'g', areaId: 'a', topicId: 't', topicTitle: 'T' },
      task: { question: 'Färbe.', unit: '', solution: 's', explanation: 'Erklärung.', hint: '' },
      element: { type: 'ratioBar', props },
    } as DraftAuthoringTask
  }
  const colourProps = { mode: 'colour', segments: 10, ratioA: 2, ratioB: 3, labelA: 'Saft', labelB: 'Wasser' }
  const splitProps = { mode: 'split', ratioA: 1, ratioB: 3, labelA: 'Saft', labelB: 'Wasser', total: '50', unit: 'ml' }

  it('builds tasks, exports snippets and validates both modes', () => {
    for (const props of [colourProps, splitProps]) {
      const d = draftOf(props)
      expect(validateDraft(d)).toEqual([])
      const t = draftToTask(d)
      expect(t.interactive?.type).toBe('ratioBar')
      expect(t.check(t.sampleAnswer)).toBe(true)
    }
    const c = exportGeneratorSnippet(draftOf(colourProps))
    expect(c).toContain('ratioBarTask({')
    expect(c).toContain('segments: 10,')
    expect(c).toContain('ratio: [2, 3],')
    expect(c).toContain('labels: ["Saft", "Wasser"]')
    const s = exportGeneratorSnippet(draftOf(splitProps))
    expect(s).toContain('total: 50,')
    expect(s).toContain('unit: "ml"')
    expect(s).not.toContain('segments')
  })

  it('reports invalid drafts', () => {
    const bad = (p: Record<string, unknown>) => validateDraft(draftOf(p)).join(' ')
    expect(bad({ ...colourProps, segments: 9 })).toContain('Verhältnisleiste')
    expect(bad({ ...colourProps, ratioA: 'x' })).toContain('Verhältnisleiste')
    expect(bad({ ...colourProps, labelA: '' })).toContain('Verhältnisleiste')
    expect(bad({ ...splitProps, total: '100', ratioB: 2 })).toContain('Verhältnisleiste')
  })
})
