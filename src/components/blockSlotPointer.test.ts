import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  hitTestBlockDrop,
  movedPastThreshold,
  sameDrag,
} from './blockSlotPointer'

describe('blockSlotPointer', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sameDrag compares pool/slot origins', () => {
    expect(
      sameDrag({ from: 'pool', itemIdx: 1 }, { from: 'pool', itemIdx: 1 }),
    ).toBe(true)
    expect(
      sameDrag({ from: 'pool', itemIdx: 1 }, { from: 'pool', itemIdx: 2 }),
    ).toBe(false)
    expect(
      sameDrag({ from: 'slot', slotIdx: 0 }, { from: 'pool', itemIdx: 0 }),
    ).toBe(false)
  })

  it('movedPastThreshold respects distance', () => {
    expect(movedPastThreshold({ x: 0, y: 0 }, 3, 3)).toBe(false)
    expect(movedPastThreshold({ x: 0, y: 0 }, 20, 0)).toBe(true)
  })

  it('hitTestBlockDrop finds slots via geometry padding', () => {
    const slot = {
      getAttribute: (name: string) => (name === 'data-slot-idx' ? '2' : null),
      getBoundingClientRect: () => ({
        left: 100,
        top: 100,
        right: 200,
        bottom: 140,
        width: 100,
        height: 40,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      }),
    }
    vi.stubGlobal('document', {
      elementsFromPoint: () => [],
      elementFromPoint: () => null,
      querySelectorAll: () => [slot],
      querySelector: () => null,
    })

    // Slightly outside the box but within padding.
    const hit = hitTestBlockDrop(205, 120, {
      slotAttr: 'data-slot-idx',
      poolAttr: 'data-drop-pool',
    })
    expect(hit).toEqual({ kind: 'slot', idx: 2 })
  })
})
