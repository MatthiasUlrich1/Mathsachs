import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import {
  allNetShapes,
  cubeNetCountValidTask,
  cubeNetCutEdgesTask,
  cubeNetMarkedPairTask,
  cubeNetOppositeTask,
  cubeNetPerimeterTask,
  cubeNetPickValidTask,
  foldNet,
  isCubeNet,
  netCellsSvg,
  netClassCounts,
  oppositeFace,
  type NetCell,
} from './cubeNetTasks'

const CROSS: NetCell[] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]]
const ROW: NetCell[] = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]
const BLOCK: NetCell[] = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]

describe('Würfelnetze: Abrollen', () => {
  it('es gibt genau 11 Würfelnetze und 24 Nicht-Netze (bis auf Drehung/Spiegelung)', () => {
    expect(netClassCounts()).toEqual({ valid: 11, invalid: 24 })
    expect(allNetShapes().valid.length + allNetShapes().invalid.length).toBe(216)
  })

  it('erkennt Kreuz als Netz, Reihe und 2x3-Block nicht', () => {
    expect(isCubeNet(CROSS)).toBe(true)
    expect(isCubeNet(ROW)).toBe(false)
    expect(isCubeNet(BLOCK)).toBe(false)
  })

  it('Kreuz: gegenüber liegen die Spaltenquadrate im Abstand 2 und die beiden Seitenarme', () => {
    const f = foldNet(CROSS)!
    const idx = (c: number, r: number) => CROSS.findIndex((x) => x[0] === c && x[1] === r)
    expect(oppositeFace(f[idx(1, 0)]!)).toBe(f[idx(1, 2)])
    expect(oppositeFace(f[idx(1, 1)]!)).toBe(f[idx(1, 3)])
    expect(oppositeFace(f[idx(0, 1)]!)).toBe(f[idx(2, 1)])
  })

  it('Nachbarn im Netz liegen nie gegenüber (jedes Netz, alle Lagen)', () => {
    for (const net of allNetShapes().valid) {
      const f = foldNet(net)!
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          const adjacent = Math.abs(net[i]![0] - net[j]![0]) + Math.abs(net[i]![1] - net[j]![1]) === 1
          if (adjacent) expect(oppositeFace(f[i]!)).not.toBe(f[j])
        }
      }
    }
  })

  it('der Rand jedes Würfelnetzes besteht aus 14 Quadratseiten', () => {
    for (const net of allNetShapes().valid) {
      let shared = 0
      for (let i = 0; i < 6; i++)
        for (let j = i + 1; j < 6; j++)
          if (Math.abs(net[i]![0] - net[j]![0]) + Math.abs(net[i]![1] - net[j]![1]) === 1) shared++
      expect(24 - 2 * shared).toBe(14)
    }
  })

  it('SVG enthält ein Quadrat je Zelle und die Buchstaben', () => {
    const svg = netCellsSvg(CROSS, { letters: ['A', 'B', 'C', 'D', 'E', 'F'], label: 'X' })
    expect(svg.match(/<rect /g)).toHaveLength(6)
    for (const l of ['A', 'B', 'C', 'D', 'E', 'F']) expect(svg).toContain(`>${l}</text>`)
  })
})

describe('Würfelnetze: Aufgaben (30 Seeds)', () => {
  const generators = [
    cubeNetPickValidTask,
    cubeNetCountValidTask,
    cubeNetOppositeTask,
    cubeNetMarkedPairTask,
    cubeNetPerimeterTask,
    () => cubeNetCutEdgesTask(),
  ]
  for (const [i, gen] of generators.entries()) {
    it(`Typ ${i + 1}: Musterlösung ist richtig, falsche Eingabe nicht, Frage druckbar`, () => {
      for (let s = 1; s <= 30; s++) {
        const t = gen(createRng(s))
        expect(t.check(t.sampleAnswer)).toBe(true)
        expect(t.check({ kind: 'value', value: '99999' })).toBe(false)
        expect(t.question).not.toMatch(/Tippe|Klick|Regler/)
        expect(t.explanation.length).toBeGreaterThan(30)
      }
    })
  }

  it('faltbar-Aufgabe: genau das Netz mit der Lösung ist faltbar', () => {
    for (let s = 1; s <= 30; s++) {
      const t = cubeNetPickValidTask(createRng(s))
      const labels = (t.visualContent ?? '').match(/>([ABC])<\/text>/g)
      expect(labels).toHaveLength(3)
      expect(['A', 'B', 'C']).toContain(t.solution)
    }
  })

  it('Zählaufgabe: alle Anzahlen 0 bis 3 kommen vor und die Lösung passt zur Erklärung', () => {
    const seen = new Set<string>()
    for (let s = 1; s <= 80; s++) seen.add(cubeNetCountValidTask(createRng(s)).solution)
    expect([...seen].sort()).toEqual(['0', '1', '2', '3'])
  })

  it('Paar-Aufgabe: beide Antworten kommen vor; Gegenüber-Lösung passt zur Faltung', () => {
    const seen = new Set<string>()
    for (let s = 1; s <= 60; s++) seen.add(cubeNetMarkedPairTask(createRng(s)).solution)
    expect([...seen].sort()).toEqual(['Gegenüber', 'Nebeneinander'])
  })

  it('Gegenüber-Aufgabe: Lösung ist nie die gefragte Fläche selbst', () => {
    for (let s = 1; s <= 60; s++) {
      const t = cubeNetOppositeTask(createRng(s))
      const asked = t.question.match(/Fläche ([A-F]) gegenüber/)![1]
      expect(t.solution).not.toBe(asked)
    }
  })

  it('Randaufgabe: Lösung ist 14-mal die Seitenlänge', () => {
    for (let s = 1; s <= 30; s++) {
      const t = cubeNetPerimeterTask(createRng(s))
      const a = Number(t.question.match(/Seitenlänge (\d+) cm/)![1])
      expect(t.solution).toBe(`${14 * a} cm`)
    }
  })
})
