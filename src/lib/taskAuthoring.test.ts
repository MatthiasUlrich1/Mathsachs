import { describe, expect, it, beforeEach } from 'vitest'
import {
  canAuthorTasks,
  canReviewAuthoredTasks,
  canSeeTaskAuthoringReviewUI,
  canSeeTaskAuthoringUI,
} from './roles'
import {
  createEmptyDraft,
  draftToTask,
  exportGeneratorSnippet,
  loadDrafts,
  saveDrafts,
  upsertDraft,
  validateDraft,
  type DraftAuthoringTask,
} from './taskAuthoring'
import { getSvgTemplate } from './svgTemplateRegistry'

describe('task authoring roles', () => {
  it('gives capability to Lehrer and Entwickler; review only Entwickler', () => {
    expect(canAuthorTasks('lehrer')).toBe(true)
    expect(canAuthorTasks('entwickler')).toBe(true)
    expect(canAuthorTasks('schueler')).toBe(false)
    expect(canAuthorTasks('klassenlehrer')).toBe(false)
    expect(canReviewAuthoredTasks('entwickler')).toBe(true)
    expect(canReviewAuthoredTasks('lehrer')).toBe(false)
  })

  it('hides Lehrer UI while SHOW_FOR_LEHRER is false; Entwickler sees both', () => {
    expect(canSeeTaskAuthoringUI('entwickler')).toBe(true)
    expect(canSeeTaskAuthoringReviewUI('entwickler')).toBe(true)
    expect(canSeeTaskAuthoringUI('lehrer')).toBe(false)
    expect(canSeeTaskAuthoringReviewUI('lehrer')).toBe(false)
  })
})

describe('taskAuthoring draftToTask / export / storage', () => {
  beforeEach(() => {
    saveDrafts([])
  })

  function baseDraft(
    overrides: Partial<DraftAuthoringTask> & {
      element: DraftAuthoringTask['element']
    },
  ): DraftAuthoringTask {
    const d = createEmptyDraft('entwickler')
    return {
      ...d,
      ...overrides,
      task: {
        question: 'Testfrage?',
        unit: 'cm',
        solution: '42',
        explanation: 'Weil.',
        hint: 'Tipp',
        ...overrides.task,
      },
      display: {
        showUnit: false,
        showVisual: false,
        showSolutionVisual: false,
        showExplanation: true,
        showHint: false,
        ...overrides.display,
      },
      element: overrides.element,
    }
  }

  it('builds choicePick and checks sampleAnswer', () => {
    const draft = baseDraft({
      element: {
        type: 'choicePick',
        props: { choices: 'A\nB\nC', correct: 'B' },
      },
      task: {
        question: 'Welche?',
        unit: '',
        solution: 'B',
        explanation: 'B ist richtig.',
        hint: '',
      },
    })
    expect(validateDraft(draft)).toEqual([])
    const task = draftToTask(draft)
    expect(task.interactive?.type).toBe('choicePick')
    expect(task.check(task.sampleAnswer)).toBe(true)
  })

  it('builds value task', () => {
    const draft = baseDraft({
      element: { type: 'value', props: { value: 12, answerKind: 'integer' } },
      task: {
        question: 'Wie viel?',
        unit: '',
        solution: '12',
        explanation: '12.',
        hint: '',
      },
    })
    const task = draftToTask(draft)
    expect(task.check(task.sampleAnswer)).toBe(true)
  })

  it('builds numberLine and dragDropSort', () => {
    const line = baseDraft({
      element: {
        type: 'numberLine',
        props: { min: 0, max: 10, step: 1, value: 4 },
      },
    })
    const sort = baseDraft({
      element: {
        type: 'dragDropSort',
        props: {
          items: 'a\nb\nc',
          correctOrder: '2,0,1',
        },
      },
    })
    expect(draftToTask(line).check(draftToTask(line).sampleAnswer)).toBe(true)
    expect(draftToTask(sort).interactive?.type).toBe('dragDropSort')
    expect(draftToTask(sort).check(draftToTask(sort).sampleAnswer)).toBe(true)
  })

  it('attaches SVG from template', () => {
    const tpl = getSvgTemplate('rectangle')
    expect(tpl).toBeTruthy()
    const draft = baseDraft({
      element: { type: 'value', props: { value: 1, answerKind: 'integer' } },
      display: {
        showUnit: false,
        showVisual: true,
        showSolutionVisual: false,
        showExplanation: true,
        showHint: false,
      },
      visual: {
        mode: 'template',
        templateId: 'rectangle',
        params: { widthLabel: '5 cm', heightLabel: '3 cm' },
      },
    })
    expect(validateDraft(draft)).toEqual([])
    const task = draftToTask(draft)
    expect(task.visualContent).toContain('<svg')
    expect(task.visualContent).toContain('5 cm')
  })

  it('exportSnippet contains helper call', () => {
    const draft = baseDraft({
      element: {
        type: 'choicePick',
        props: { choices: 'Ja\nNein', correct: 'Ja' },
      },
      status: 'approved',
    })
    const snip = exportGeneratorSnippet(draft)
    expect(snip).toContain('choicePickTask')
    expect(snip).toContain('Ja')
  })

  it('storage roundtrip', () => {
    const draft = baseDraft({
      element: { type: 'value', props: { value: 7, answerKind: 'integer' } },
    })
    upsertDraft(draft)
    const loaded = loadDrafts()
    expect(loaded).toHaveLength(1)
    expect(loaded[0]?.id).toBe(draft.id)
    expect(loaded[0]?.element.type).toBe('value')
  })
})
