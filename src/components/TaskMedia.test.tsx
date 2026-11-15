import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { angleProtractorTask, digitGridMultiplyTask, visualTask } from '../curriculum/taskHelpers'
import { TaskVisual, initTaskInput, taskInteractiveKey } from './TaskMedia'

describe('TaskMedia', () => {
  it('renders visualContent as SVG markup', () => {
    const html = renderToStaticMarkup(
      createElement(TaskVisual, { html: '<svg data-testid="fig"><circle r="1"/></svg>' }),
    )
    expect(html).toContain('task-visual')
    expect(html).toContain('<svg data-testid="fig">')
    expect(html).toContain('<circle r="1"')
  })

  it('injects viewBox for fixed-size SVGs so mobile CSS can scale them', () => {
    const html = renderToStaticMarkup(
      createElement(TaskVisual, {
        html: '<svg width="366" height="261" aria-label="L-Form"><polygon points="0,0"/></svg>',
      }),
    )
    expect(html).toContain('viewBox="0 0 366 261"')
    expect(html).toContain('width="366"')
    expect(html).toContain('height="261"')
    expect(html).toContain('aria-label="L-Form"')
  })

  it('renders nothing when visualContent is missing', () => {
    expect(renderToStaticMarkup(createElement(TaskVisual, {}))).toBe('')
    expect(renderToStaticMarkup(createElement(TaskVisual, { html: '' }))).toBe('')
  })

  it('initTaskInput keeps value answers for visual geometry tasks', () => {
    const task = visualTask({
      question: 'Fläche?',
      answerKind: 'integer',
      value: 12,
      solution: '12',
      explanation: 'a·b',
      visualContent: '<svg></svg>',
      unit: 'cm²',
    })
    expect(initTaskInput(task)).toEqual({ kind: 'value', value: '' })
    expect(task.visualContent).toContain('svg')
  })

  it('initTaskInput seeds multi-row digit grids from answerRowLengths', () => {
    const task = digitGridMultiplyTask({
      question: 'Multipliziere',
      a: 23,
      b: 36,
      solution: '828',
      explanation: '23 · 36 = 828',
    })
    const input = initTaskInput(task)
    expect(input.kind).toBe('digitGrid')
    if (input.kind !== 'digitGrid') return
    expect(input.answerRows).toHaveLength(3)
    expect(input.answerRows![0]).toHaveLength(task.interactive!.props.answerLength as number)
  })
})

describe('graphical tasks stay attached after generate', () => {
  it('math5 volumen-quader can produce visualContent for a fixed seed', async () => {
    const { klasse5 } = await import('../curriculum/math5')
    const topic = klasse5.areas
      .flatMap((a) => a.topics)
      .find((t) => t.id === 'lb4-volumen-quader')
    expect(topic).toBeTruthy()
    // Try several seeds until a visual variant appears (mixedVariants).
    let found = false
    for (let seed = 1; seed <= 40; seed++) {
      const task = topic!.generate(createRng(seed))
      if (task.visualContent) {
        found = true
        expect(task.visualContent).toMatch(/<svg[\s>]/i)
        break
      }
    }
    expect(found).toBe(true)
  })

  it('initTaskInput: angleProtractor starts untouched (measure empty, draw away from target)', () => {
    const measure = angleProtractorTask({
      question: 'q',
      mode: 'measure',
      angle: 47,
      solution: 's',
      explanation: 'e',
    })
    expect(initTaskInput(measure)).toEqual({ kind: 'angleProtractor', degrees: null, touched: false })
    const draw = angleProtractorTask({ question: 'q', mode: 'draw', angle: 47, solution: 's', explanation: 'e' })
    const start = initTaskInput(draw)
    expect(start.kind).toBe('angleProtractor')
    if (start.kind === 'angleProtractor') {
      expect(start.touched).toBe(false)
      expect(start.degrees).not.toBeNull()
      expect(start.degrees).not.toBe(47)
      expect(draw.check(start)).toBe(false)
    }
  })

  it('taskInteractiveKey differs between angle tasks and is stable for the same task', () => {
    const make = (angle: number) =>
      angleProtractorTask({ question: 'q', mode: 'measure', angle, solution: 's', explanation: 'e' })
    expect(taskInteractiveKey(make(47))).toBe(taskInteractiveKey(make(47)))
    expect(taskInteractiveKey(make(47))).not.toBe(taskInteractiveKey(make(62)))
    expect(taskInteractiveKey(visualTask({ question: 'q', answerKind: 'integer', value: 1, solution: '1', explanation: 'e', visualContent: '<svg/>' }))).toBe('')
  })
})
