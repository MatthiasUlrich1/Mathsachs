import { describe, it, expect } from 'vitest'
import { createRng } from '../lib/rng'
import { klasse7 } from './math7'
import { runGradeSelfTest } from './gradeSelfTest'

describe('Klasse 7 curriculum', () => {
  runGradeSelfTest(klasse7, { idPrefix: 'k7-', areaCount: 4, minTopics: 17 })

  it('emits SVG for Phase-2 geometry topics', () => {
    const ids = [
      'k7-lb1-nebenwinkel',
      'k7-lb1-scheitelwinkel',
      'k7-lb1-basiswinkel',
      'k7-lb3-volumen-prisma',
      'k7-lb3-volumen-pyramide',
      'k7-lb3-oberflaeche-quader',
      'k7-lb3-oberflaeche-pyramide',
    ]
    const topics = klasse7.areas.flatMap((a) => a.topics)
    for (const id of ids) {
      const topic = topics.find((t) => t.id === id)
      expect(topic, id).toBeTruthy()
      let saw = false
      for (let seed = 1; seed <= 80; seed++) {
        if (topic!.generate(createRng(seed)).visualContent?.includes('<svg')) {
          saw = true
          break
        }
      }
      expect(saw, `${id} should produce SVG`).toBe(true)
    }
  })

  it('Nebenwinkel-Pick akzeptiert beide Nebenwinkel A und C', () => {
    const topic = klasse7.areas.flatMap((a) => a.topics).find((t) => t.id === 'k7-lb1-nebenwinkel')
    expect(topic).toBeTruthy()
    let found = false
    for (let seed = 1; seed <= 120; seed++) {
      const task = topic!.generate(createRng(seed))
      if (task.interactive?.type !== 'multiSelect') continue
      found = true
      expect(task.sampleAnswer).toEqual({ kind: 'multiSelect', selected: ['A', 'C'] })
      expect(task.check({ kind: 'multiSelect', selected: ['A', 'C'] })).toBe(true)
      expect(task.check({ kind: 'multiSelect', selected: ['A'] })).toBe(false)
      expect(task.check({ kind: 'multiSelect', selected: ['B'] })).toBe(false)
      break
    }
    expect(found).toBe(true)
  })
})
