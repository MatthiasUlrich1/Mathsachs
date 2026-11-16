import { describe, expect, it } from 'vitest'
import {
  DIVIDE_MAX_COUNT,
  DIVIDE_MAX_PERSONS,
  DIVIDE_VIEWBOX_W,
  assignPart,
  assignedCount,
  clampParts,
  divideLayout,
  divideMatches,
  dividePrintSvg,
  divideSolutionAssignment,
  divideSolvableParts,
  divideTextExtents,
  emptyAssignment,
  normalizeAssignment,
  partsPerPerson,
  type DivideShape,
} from './divideToolLogic'

describe('divideToolLogic assignment', () => {
  it('clampParts keeps 1..12', () => {
    expect([clampParts(0), clampParts(1), clampParts(7.4), clampParts(12), clampParts(40)]).toEqual([1, 1, 7, 12, 12])
  })

  it('emptyAssignment has count*parts null entries', () => {
    expect(emptyAssignment(3, 4)).toEqual(new Array(12).fill(null))
  })

  it('normalizeAssignment fixes length and drops invalid persons', () => {
    expect(normalizeAssignment(1, 3, 2, [0, 5, 1, 1])).toEqual([0, null, 1])
    expect(normalizeAssignment(1, 3, 2, [0])).toEqual([0, null, null])
    expect(normalizeAssignment(1, 2, 2, [-1, 1.5])).toEqual([null, null])
  })

  it('assignPart assigns, re-assigns and takes back on the same person', () => {
    let a = emptyAssignment(1, 3)
    a = assignPart(1, 3, 2, a, 1, 0)
    expect(a).toEqual([null, 0, null])
    a = assignPart(1, 3, 2, a, 1, 1)
    expect(a).toEqual([null, 1, null])
    a = assignPart(1, 3, 2, a, 1, 1)
    expect(a).toEqual([null, null, null])
  })

  it('assignPart ignores unknown parts and persons', () => {
    const a = emptyAssignment(1, 2)
    expect(assignPart(1, 2, 2, a, 2, 0)).toEqual([null, null])
    expect(assignPart(1, 2, 2, a, 0, 2)).toEqual([null, null])
    expect(assignPart(1, 2, 2, a, -1, 0)).toEqual([null, null])
  })

  it('counts per person and assigned parts', () => {
    expect(partsPerPerson(3, [0, 0, 2, null])).toEqual([2, 0, 1])
    expect(assignedCount([0, null, 1])).toBe(2)
  })
})

describe('divideMatches (exact share count/persons)', () => {
  it('3 wholes for 4 persons: 4 parts each (12 parts, 3 per person) and 8 parts each both work', () => {
    const four = divideSolutionAssignment(3, 4, 4)!
    expect(divideMatches(3, 4, 4, four)).toBe(true)
    const eight = divideSolutionAssignment(3, 4, 8)!
    expect(divideMatches(3, 4, 4 * 2, eight)).toBe(true)
    expect(partsPerPerson(4, eight)).toEqual([6, 6, 6, 6])
  })

  it('rejects unassigned parts, unequal shares and wrong length', () => {
    const ok = divideSolutionAssignment(3, 4, 4)!
    expect(divideMatches(3, 4, 4, ok)).toBe(true)
    expect(divideMatches(3, 4, 4, ok.map((v, i) => (i === 0 ? null : v)))).toBe(false)
    // person 0 gets one part more, person 1 one less
    const unequal = [...ok]
    unequal[unequal.indexOf(1)] = 0
    expect(divideMatches(3, 4, 4, unequal)).toBe(false)
    expect(divideMatches(3, 4, 4, ok.slice(1))).toBe(false)
    expect(divideMatches(3, 4, 4, emptyAssignment(3, 4))).toBe(false)
  })

  it('rejects parts per whole where no fair share exists, even with equal-looking counts', () => {
    // 3 wholes, 4 persons, 3 parts: 9 parts cannot be split among 4.
    expect(divideSolutionAssignment(3, 4, 3)).toBeNull()
    expect(divideMatches(3, 4, 3, [0, 1, 2, 3, 0, 1, 2, 3, 0])).toBe(false)
  })

  it('rejects out-of-range parts and persons', () => {
    expect(divideMatches(1, 2, 0, [])).toBe(false)
    expect(divideMatches(1, 2, 13, new Array(13).fill(0))).toBe(false)
    expect(divideMatches(1, 2, 2, [0, 2])).toBe(false)
  })

  it('1 whole for 2 persons needs no tricks with 2 parts; 1 part cannot be shared', () => {
    expect(divideMatches(1, 2, 2, [0, 1])).toBe(true)
    expect(divideMatches(1, 2, 1, [0])).toBe(false)
  })

  it('divideSolvableParts lists every working number of parts', () => {
    expect(divideSolvableParts(3, 4)).toEqual([4, 8, 12])
    expect(divideSolvableParts(1, 5)).toEqual([5, 10])
    expect(divideSolvableParts(2, 6)).toEqual([3, 6, 9, 12])
    expect(divideSolvableParts(1, 7)).toEqual([7])
  })

  it('solution assignments exist exactly for the solvable parts and always match', () => {
    for (let count = 1; count <= DIVIDE_MAX_COUNT; count++) {
      for (let persons = 2; persons <= DIVIDE_MAX_PERSONS; persons++) {
        const ok = divideSolvableParts(count, persons)
        for (let parts = 1; parts <= 12; parts++) {
          const sol = divideSolutionAssignment(count, persons, parts)
          expect(sol !== null, `${count}/${persons}/${parts}`).toBe(ok.includes(parts))
          if (sol) expect(divideMatches(count, persons, parts, sol)).toBe(true)
        }
      }
    }
  })
})

describe('divideLayout geometry', () => {
  const shapes: DivideShape[] = ['bar', 'circle']

  it('everything stays inside the viewBox for all shapes, counts, persons and parts', () => {
    for (const shape of shapes) {
      for (let count = 1; count <= DIVIDE_MAX_COUNT; count++) {
        for (let persons = 2; persons <= DIVIDE_MAX_PERSONS; persons++) {
          for (const parts of [1, 2, 7, 12]) {
            const l = divideLayout(shape, count, persons, parts)
            const tag = `${shape} ${count}/${persons}/${parts}`
            expect(l.objects).toHaveLength(count)
            expect(l.people).toHaveLength(persons)
            for (const o of l.objects) {
              expect(o.parts).toHaveLength(parts)
              expect(o.box.x, tag).toBeGreaterThanOrEqual(0)
              expect(o.box.x + o.box.w, tag).toBeLessThanOrEqual(DIVIDE_VIEWBOX_W)
              expect(o.box.y, tag).toBeGreaterThanOrEqual(0)
              expect(o.box.y + o.box.h, tag).toBeLessThanOrEqual(l.viewBoxH)
            }
            for (const p of l.people) {
              expect(p.x, tag).toBeGreaterThanOrEqual(0)
              expect(p.x + p.w, tag).toBeLessThanOrEqual(DIVIDE_VIEWBOX_W)
              expect(p.y + p.h, tag).toBeLessThanOrEqual(l.viewBoxH)
            }
          }
        }
      }
    }
  })

  it('wholes do not overlap each other nor the people', () => {
    for (const shape of shapes) {
      for (let count = 1; count <= DIVIDE_MAX_COUNT; count++) {
        const l = divideLayout(shape, count, 6, 4)
        const boxes = l.objects.map((o) => o.box)
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i]!
            const b = boxes[j]!
            const apart = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y
            expect(apart, `${shape} ${count}: ${i}/${j}`).toBe(true)
          }
        }
        const bottom = Math.max(...boxes.map((b) => b.y + b.h))
        expect(Math.min(...l.people.map((p) => p.y))).toBeGreaterThan(bottom)
      }
    }
  })

  it('part indices run 0..count*parts-1 in order', () => {
    const l = divideLayout('bar', 3, 4, 5)
    expect(l.objects.flatMap((o) => o.parts.map((p) => p.part))).toEqual(Array.from({ length: 15 }, (_, i) => i))
  })

  it('every drawn text fits horizontally and vertically inside the viewBox and its box', () => {
    for (const shape of shapes) {
      for (const [count, persons, parts] of [
        [1, 2, 12],
        [4, 6, 12],
        [3, 4, 8],
      ] as const) {
        const l = divideLayout(shape, count, persons, parts)
        const texts = divideTextExtents(shape, count, persons, parts)
        expect(texts.length).toBeGreaterThan(0)
        for (const t of texts) {
          const w = t.text.length * t.fontSize * 0.6
          expect(t.x - w / 2, t.text).toBeGreaterThanOrEqual(0)
          expect(t.x + w / 2, t.text).toBeLessThanOrEqual(DIVIDE_VIEWBOX_W)
          expect(t.y, t.text).toBeLessThanOrEqual(l.viewBoxH)
          expect(t.y - t.fontSize, t.text).toBeGreaterThanOrEqual(0)
        }
        // person texts must fit their box
        for (const p of l.people) {
          const own = texts.filter((t) => t.x === p.x + p.w / 2 && t.y >= p.y && t.y <= p.y + p.h)
          expect(own.length).toBe(2)
          for (const t of own) expect(t.text.length * t.fontSize * 0.6).toBeLessThanOrEqual(p.w - 8)
        }
      }
    }
  })

  it('owner labels of the narrowest bar part fit into the part', () => {
    const l = divideLayout('bar', 3, 4, 12)
    const w = l.objects[0]!.box.w / 12
    expect(1 * 11 * 0.6).toBeLessThanOrEqual(w)
  })
})

describe('dividePrintSvg', () => {
  it('draws the undivided wholes and one box per person, nothing else', () => {
    const svg = dividePrintSvg('circle', 3, 4)
    expect(svg).toMatch(/^<svg /)
    expect(svg.match(/<path /g)).toHaveLength(3)
    expect(svg.match(/<rect /g)).toHaveLength(4)
    for (let i = 1; i <= 4; i++) expect(svg).toContain(`Kind ${i}`)
    expect(svg).not.toContain('Teile')
  })
})

describe("divide tool: --on-fill text is only ever drawn over a series fill", () => {
  it("name and count baselines (with their font size) lie inside the filled person rect", () => {
    for (const persons of [1, 2, 3, 4, 5, 6]) {
      for (const p of divideLayout("circle", 3, persons, 2).people) {
        expect(p.nameY - 13).toBeGreaterThanOrEqual(p.y)
        expect(p.nameY).toBeLessThanOrEqual(p.y + p.h)
        expect(p.countY - 11).toBeGreaterThanOrEqual(p.y)
        expect(p.countY).toBeLessThanOrEqual(p.y + p.h)
      }
    }
  })
})
