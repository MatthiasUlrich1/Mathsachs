/**
 * Tests for reusable imageLabelSlots interaction + K5 anatomy generators.
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { FISH_TROUT_ASSET } from './anatomyAssets'
import { BIOLOGIE_ANATOMY_GENERATORS } from './biologieAnatomy'
import { imageLabelSlotsTask } from './taskHelpers'
import { initTaskInput } from '../components/TaskMedia'
import { examAnswerAttempted } from '../exam/examAnswerAttempted'
import { taskContentIds } from './uniqueRound'
import { worksheetPrintExtras } from '../lib/worksheetPrint'

describe('imageLabelSlotsTask', () => {
  it('grades full and partial credit by slot', () => {
    const slots = FISH_TROUT_ASSET.slots.slice(0, 4).map((s) => ({
      id: s.id,
      x: s.x,
      y: s.y,
      targetX: s.targetX,
      targetY: s.targetY,
    }))
    const items = [
      ...FISH_TROUT_ASSET.slots.slice(0, 4).map((s) => ({ label: s.label })),
      { label: 'Hornschicht' },
    ]
    const task = imageLabelSlotsTask({
      question: 'Beschrifte den Fisch.',
      imageSrc: FISH_TROUT_ASSET.imageSrc,
      attribution: FISH_TROUT_ASSET.attribution,
      drawLeaders: true,
      items,
      slots,
      correctSlots: [0, 1, 2, 3],
      solution: 'ok',
      explanation: 'Test.',
      fachwissen: {
        text: 'Äußerer Bau der Fische: Flossen, Kiemendeckel und Seitenlinie. Angepasstheit an das Wasserleben. Beschriftung trainiert Ortskenntnis.',
      },
      rng: createRng(42),
    })
    expect(task.interactive?.type).toBe('imageLabelSlots')
    expect(task.check(task.sampleAnswer)).toBe(true)
    expect(task.sampleAnswer.kind).toBe('imageLabelSlots')
    if (task.sampleAnswer.kind !== 'imageLabelSlots') return
    const correct = task.sampleAnswer.slots
    const blank = initTaskInput(task)
    expect(blank.kind).toBe('imageLabelSlots')
    expect(examAnswerAttempted(task, blank)).toBe(false)
    expect(examAnswerAttempted(task, task.sampleAnswer)).toBe(true)

    const half = {
      kind: 'imageLabelSlots' as const,
      slots: correct.map((v, i) => (i < 2 ? v : null)),
    }
    const g = task.grade!(half)
    expect(g.fraction).toBe(0.5)
    expect(g.parts?.filter(Boolean).length).toBe(2)
    expect(task.check(half)).toBe(false)
  })

  it('exposes pool labels for round uniqueness and worksheet print', () => {
    const task = imageLabelSlotsTask({
      question: 'Beschrifte.',
      imageSrc: '/anatomy/x.jpg',
      attribution: 'Testquelle CC0',
      items: [{ label: 'Auge' }, { label: 'Flosse' }, { label: 'Ablenkung' }],
      slots: [
        { id: 'a', x: 10, y: 10, targetX: 20, targetY: 20 },
        { id: 'b', x: 80, y: 80, targetX: 70, targetY: 70 },
      ],
      correctSlots: [0, 1],
      solution: '1:Auge; 2:Flosse',
      explanation: 'Passt.',
      fachwissen: {
        text: 'Beschriftungsaufgaben verknüpfen Ort und Begriff. Das trainiert Fachsprache. Ablenkungen prüfen Unterscheidung.',
      },
      rng: createRng(7),
    })
    const ids = taskContentIds(task)
    expect(ids.some((id) => id.includes('auge') || id.includes('term:'))).toBe(true)
    const printed = worksheetPrintExtras(task)
    expect(printed.paperHint?.toLowerCase()).toMatch(/beschrift|abbildung|quelle/)
    expect(printed.options?.length).toBeGreaterThan(0)
  })
})

describe('Biologie anatomy topics', () => {
  for (const id of [
    'bi-k5-lb2-fische-aufbau',
    'bi-k5-lb5-voegel-aufbau',
  ] as const) {
    it(`${id} emits valid tasks including imageLabelSlots`, () => {
      const gen = BIOLOGIE_ANATOMY_GENERATORS[id]
      expect(gen).toBeTypeOf('function')
      let sawImage = false
      for (let seed = 0; seed < 40; seed++) {
        const task = gen!(createRng(seed * 31 + 5))
        expect(task.question.trim().length).toBeGreaterThan(8)
        expect(task.check(task.sampleAnswer)).toBe(true)
        expect((task.fachwissen?.text ?? '').trim().length).toBeGreaterThan(20)
        if (task.interactive?.type === 'imageLabelSlots') {
          sawImage = true
          expect(String(task.interactive.props.imageSrc)).toMatch(/^\/anatomy\//)
          expect(String(task.interactive.props.attribution).length).toBeGreaterThan(20)
          expect(Array.isArray(task.interactive.props.slots)).toBe(true)
          expect((task.interactive.props.slots as unknown[]).length).toBeGreaterThan(3)
        }
      }
      expect(sawImage).toBe(true)
    })
  }
})
