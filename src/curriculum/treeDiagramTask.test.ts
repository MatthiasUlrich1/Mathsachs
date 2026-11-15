import { describe, expect, it } from 'vitest'
import { treeDiagramTask } from './taskHelpers'
import type { TreeDiagramTaskInput } from './interactionTaskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { formatExamAnswer } from '../components/ExamProtocolSheet'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { createEmptyDraft, draftToTask, exportGeneratorSnippet, validateDraft, type DraftAuthoringTask } from '../lib/taskAuthoring'
import { emptyInput, type UserInput } from './types'

const urn = { '0': '4/6', '1': '2/6', '0.0': '3/5', '0.1': '2/5', '1.0': '4/5', '1.1': '1/5' }
const base: TreeDiagramTaskInput = {
  question: 'In einer Urne liegen 4 rote und 2 blaue Kugeln. Du ziehst zweimal ohne Zurücklegen.',
  levels: [{ outcomes: ['Rot', 'Blau'] }, { outcomes: ['Rot', 'Blau'] }],
  probabilities: urn,
  blanks: { branches: ['0.0', '1.1'], leaves: ['0.1'] },
  solution: '3/5; 1/5; 4/15',
  explanation: 'Pfadregel: Produkt entlang des Pfades.',
}
const make = (over: Partial<TreeDiagramTaskInput> = {}) => treeDiagramTask({ ...base, ...over })
const ans = (branches: Record<string, string>, leaves: Record<string, string> = {}): UserInput => ({ kind: 'treeDiagram', branches, leaves })

describe('treeDiagramTask check', () => {
  it('sampleAnswer passes; untouched, partial, wrong, wrong kind fail', () => {
    const t = make()
    expect(t.check(t.sampleAnswer)).toBe(true)
    expect(t.check(initTaskInput(t))).toBe(false)
    expect(t.check(ans({ '0.0': '3/5', '1.1': '1/5' }))).toBe(false)
    expect(t.check(ans({ '0.0': '3/5', '1.1': '1/5' }, { '0.1': '1/2' }))).toBe(false)
    expect(t.check(ans({ '0.0': '1/3', '1.1': '1/5' }, { '0.1': '4/15' }))).toBe(false)
    expect(t.check({ kind: 'text', value: '1/2' } as unknown as UserInput)).toBe(false)
  })

  it('accepts fractions, comma and point decimals, percent and unreduced forms', () => {
    const t = make()
    expect(t.check(ans({ '0.0': '0,6', '1.1': '0.2' }, { '0.1': '8/30' }))).toBe(true)
    expect(t.check(ans({ '0.0': '6/10', '1.1': '20%' }, { '0.1': '4/15' }))).toBe(true)
    expect(t.check(ans({ '0.0': '60 %', '1.1': '1/5' }, { '0.1': '8/30' }))).toBe(true)
  })

  it('leaf blank = product along the path, with different level-2 values per parent', () => {
    const t = make({ blanks: { branches: [], leaves: ['0.0', '1.1'] } })
    expect(t.check(ans({}, { '0.0': '2/5', '1.1': '1/15' }))).toBe(true)
    expect(t.check(ans({}, { '0.0': '2/5', '1.1': '1/5' }))).toBe(false)
    expect(t.check(ans({}, { '0.0': '4/6', '1.1': '1/15' }))).toBe(false)
  })

  it('a one-level tree with three branches', () => {
    const t = make({
      levels: [{ outcomes: ['Rot', 'Gelb', 'Grün'] }],
      probabilities: { '0': '1/2', '1': '3/10', '2': '1/5' },
      blanks: { branches: ['2'], leaves: [] },
    })
    expect(t.check(ans({ '2': '0,2' }))).toBe(true)
    expect(t.check(ans({ '2': '0,3' }))).toBe(false)
  })
})

describe('treeDiagramTask config', () => {
  it('props carry the shown values only, never the blank ones', () => {
    const t = make()
    const p = t.interactive!.props
    expect(t.interactive!.type).toBe('treeDiagram')
    expect(p.given).toEqual({ '0': '4/6', '1': '2/6', '0.1': '2/5', '1.0': '4/5' })
    expect(p.blankBranches).toEqual(['0.0', '1.1'])
    expect(p.blankLeaves).toEqual(['0.1'])
    const json = JSON.stringify(p)
    for (const hidden of ['3/5', '1/5', '4/15']) expect(json).not.toContain(hidden)
  })

  it('the spoiler test can fail: a deliberately spoiled props object is detected', () => {
    const leaks = (t: ReturnType<typeof make>, values: string[]) => values.filter((v) => JSON.stringify(t.interactive!.props).includes(v))
    expect(leaks(make(), ['3/5', '1/5', '4/15'])).toEqual([])
    const spoiled = make()
    spoiled.interactive!.props = { ...spoiled.interactive!.props, given: { ...(spoiled.interactive!.props.given as object), '1.1': '1/5' } }
    expect(leaks(spoiled, ['1/5'])).toEqual(['1/5'])
  })

  it('has an instruction (screen-only) and an optional root label', () => {
    expect(String(make().interactive!.props.instruction)).toMatch(/Felder/)
    expect(make({ rootLabel: 'Start' }).interactive!.props.rootLabel).toBe('Start')
    expect(make().interactive!.props.rootLabel).toBeUndefined()
    expect(make({ instruction: 'Eigener Text' }).interactive!.props.instruction).toBe('Eigener Text')
  })

  it('rootLabel is limited to 12 characters', () => {
    expect(() => make({ rootLabel: 'x'.repeat(13) })).toThrow(/rootLabel/)
    expect(() => make({ rootLabel: 'Samstag' })).not.toThrow()
  })

  it('dedupeKey is kept', () => {
    expect(make({ dedupeKey: ' k ' }).dedupeKey).toBe('k')
    expect(make().dedupeKey).toBeUndefined()
  })

  it('throws on invalid input', () => {
    expect(() => make({ probabilities: { ...urn, '0': '1/5' } })).toThrow(/add up to 1/)
    expect(() => make({ blanks: { branches: [], leaves: [] } })).toThrow(/at least one/)
    expect(() => make({ blanks: { branches: ['5'], leaves: [] } })).toThrow(/does not exist/)
    expect(() => make({ blanks: { branches: ['0.0', '0.0'], leaves: [] } })).toThrow(/repeat/)
    expect(() => make({ blanks: { branches: [], leaves: ['0'] } })).toThrow(/does not exist/)
    expect(() => make({ levels: [{ outcomes: ['Rot', 'Blau'] }], probabilities: { '0': '1/2', '1': '1/2' }, blanks: { branches: [], leaves: ['0'] } })).toThrow(/one-level/)
    expect(() => make({ probabilities: { ...urn, '0.0': 'viel' } })).toThrow(/probability/)
  })
})

describe('treeDiagram wiring', () => {
  it('initTaskInput and emptyInput leave every field empty', () => {
    expect(initTaskInput(make())).toEqual({ kind: 'treeDiagram', branches: {}, leaves: {} })
    expect(emptyInput('treeDiagram')).toEqual({ kind: 'treeDiagram', branches: {}, leaves: {} })
  })

  it('exam: attempted as soon as one field has text; empty or blank-only text is not', () => {
    const t = make()
    expect(examAnswerAttempted(t, ans({}))).toBe(false)
    expect(examAnswerAttempted(t, ans({ '0.0': '  ' }, { '0.1': '' }))).toBe(false)
    expect(examAnswerAttempted(t, ans({ '0.0': '1' }))).toBe(true)
    expect(examAnswerAttempted(t, ans({}, { '0.1': '3/10' }))).toBe(true)
  })

  it('exam protocol text names the path when the task is known', () => {
    const t = make()
    expect(formatExamAnswer(ans({}))).toBe('—')
    expect(formatExamAnswer(ans({ '0.0': '1/2' }, { '0.1': '0,3' }))).toBe('Zweig 0.0: 1/2; Pfad 0.1: 0,3')
    expect(formatExamAnswer(ans({ '0.0': '1/2' }, { '0.1': '0,3' }), t)).toBe('Zweig Rot, Rot: 1/2; Pfad Rot, Blau: 0,3')
  })

  it('worksheet: tree with given values and ___ at blanks; visualContent first; no expected values', () => {
    const t = make()
    const extras = worksheetPrintExtras(t)
    expect(extras.visualHtml).toContain('<svg')
    expect((extras.visualHtml!.match(/___/g) ?? []).length).toBe(3)
    expect(extras.visualHtml).toContain('4/6')
    expect(extras.visualHtml).toContain('4/5')
    for (const hidden of ['3/5', '1/5', '4/15']) expect(extras.visualHtml).not.toContain(hidden)
    expect(extras.paperHint).not.toMatch(/tipp|klick|eingabe/i)
    const withVisual = worksheetPrintExtras({ ...t, visualContent: '<svg id="ref"></svg>' })
    expect(withVisual.visualHtml!.startsWith('<svg id="ref">')).toBe(true)
    expect(withVisual.visualHtml).toContain('___')
    expect(worksheetPrintExtras(make({ rootLabel: 'Samstag' })).visualHtml).toContain('>Samstag</text>')
  })
})

describe('treeDiagram authoring', () => {
  const draftOf = (props: Record<string, unknown>): DraftAuthoringTask => {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      target: { packId: 'p', gradeId: 'g', areaId: 'a', topicId: 't', topicTitle: 'T' },
      task: { question: 'Trage ein.', unit: '', solution: 's', explanation: 'Erklärung.', hint: '' },
      element: { type: 'treeDiagram', props },
    } as DraftAuthoringTask
  }
  const props = {
    level1: 'Rot, Blau',
    level2: 'Rot, Blau',
    probabilities: '0 = 4/6\n1 = 2/6\n0.0 = 3/5\n0.1 = 2/5\n1.0 = 4/5\n1.1 = 1/5',
    blankBranches: '0.0, 0.1',
    blankLeaves: '1.1',
    rootLabel: 'Start',
  }

  it('builds a task, exports a snippet that runs, and validates', () => {
    const d = draftOf(props)
    expect(validateDraft(d)).toEqual([])
    const t = draftToTask(d)
    expect(t.interactive?.type).toBe('treeDiagram')
    expect(t.check(t.sampleAnswer)).toBe(true)
    const code = exportGeneratorSnippet(d)
    expect(code).toContain('treeDiagramTask({')
    expect(code).toContain('rootLabel: "Start"')
    expect(code).toContain('"0.1":"2/5"')
    expect(code).toContain('blanks: {"branches":["0.0","0.1"],"leaves":["1.1"]}')
  })

  it('omits rootLabel from the snippet when empty', () => {
    expect(exportGeneratorSnippet(draftOf({ ...props, rootLabel: '' }))).not.toContain('rootLabel')
  })

  it('reports an error for sums that are not 1 or no blanks', () => {
    expect(validateDraft(draftOf({ ...props, probabilities: props.probabilities.replace('0 = 4/6', '0 = 1/6') })).join(' ')).toMatch(/Baumdiagramm/)
    expect(validateDraft(draftOf({ ...props, blankBranches: '', blankLeaves: '' })).join(' ')).toMatch(/Baumdiagramm/)
  })
})
