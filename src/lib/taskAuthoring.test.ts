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
      target: {
        packId: 'pack-test',
        gradeId: 'grade-test',
        areaId: 'area-test',
        topicId: 'topic-test',
        topicTitle: 'Testthema',
        ...overrides.target,
      },
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

  it('builds paramSlider with function preview', () => {
    const draft = baseDraft({
      element: {
        type: 'paramSlider',
        props: {
          preview: 'quadratic',
          sliders: [
            { id: 'a', label: 'a', min: -3, max: 3, step: 1, correct: 1 },
            { id: 'b', label: 'b', min: -5, max: 5, step: 1, correct: 0 },
            { id: 'c', label: 'c', min: -5, max: 5, step: 1, correct: -2 },
          ],
        },
      },
      task: {
        question: 'Stelle die Parabel ein.',
        unit: '',
        solution: 'a=1, b=0, c=-2',
        explanation: 'Scheitel auf der y-Achse.',
        hint: '',
      },
    })
    const task = draftToTask(draft)
    expect(task.interactive?.type).toBe('paramSlider')
    expect(task.interactive?.props.preview).toBe('quadratic')
    expect(task.check(task.sampleAnswer)).toBe(true)
  })

  it('builds coordinateDraw task from solution scene', () => {
    const draft = baseDraft({
      element: {
        type: 'coordinateDraw',
        props: {
          solutionScene: {
            xRange: [-5, 5],
            yRange: [-5, 5],
            snap: 'half',
            objects: [{ id: 'l', kind: 'line', x1: 0, y1: 0, x2: 2, y2: 1 }],
          },
        },
      },
      task: {
        question: 'Zeichne die Gerade.',
        unit: '',
        solution: 'Gerade durch Ursprung',
        explanation: 'Steigung 1/2.',
        hint: '',
      },
    })
    const task = draftToTask(draft)
    expect(task.interactive?.type).toBe('coordinateDraw')
    expect(task.check(task.sampleAnswer)).toBe(true)
  })

  it('builds multi-point coordinateClick', () => {
    const draft = baseDraft({
      element: {
        type: 'coordinateClick',
        props: {
          pointCount: 3,
          points: [
            { x: 1, y: 2 },
            { x: -1, y: 0 },
            { x: 3, y: -2 },
          ],
        },
      },
      task: {
        question: 'Tippe die drei Punkte.',
        unit: '',
        solution: '(1|2), (−1|0), (3|−2)',
        explanation: 'Drei Gitterpunkte.',
        hint: '',
      },
    })
    const task = draftToTask(draft)
    expect(task.interactive?.props.maxPoints).toBe(3)
    expect(task.check(task.sampleAnswer)).toBe(true)
    expect(
      task.check({
        kind: 'coordinateClick',
        x: 3,
        y: -2,
        points: [
          { x: 3, y: -2 },
          { x: 1, y: 2 },
          { x: -1, y: 0 },
        ],
      }),
    ).toBe(true)
    expect(
      task.check({
        kind: 'coordinateClick',
        x: 1,
        y: 2,
        points: [
          { x: 1, y: 2 },
          { x: -1, y: 0 },
        ],
      }),
    ).toBe(false)
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

  it('requires Lehrplan cascade fields', () => {
    const draft = createEmptyDraft('entwickler')
    draft.task.question = 'Q?'
    draft.task.solution = '1'
    draft.task.explanation = 'E'
    draft.element = { type: 'value', props: { value: 1, answerKind: 'integer' } }
    expect(validateDraft(draft)).toEqual(
      expect.arrayContaining([
        'Lehrplan wählen.',
        'Klassenstufe wählen.',
        'Lernbereich wählen.',
        'Thema wählen oder neuen Titel eingeben.',
      ]),
    )
  })
})
