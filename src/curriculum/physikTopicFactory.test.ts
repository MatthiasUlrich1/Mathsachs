import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { buildGymSachsenPhysikPack } from './physikGymPack'
import { makePhysikTopicGenerate } from './physikTopicFactory'
import { resolvePhysikGenerate } from './physikGenerators'

describe('Physik topic factory — schulische Aufgaben', () => {
  it('never asks meta Idee→Anwendung→Kontrolle questions', () => {
    const pack = buildGymSachsenPhysikPack()
    for (const grade of pack.official) {
      for (const area of grade.areas) {
        for (const topic of area.topics) {
          const generate = resolvePhysikGenerate(topic.id) ?? makePhysikTopicGenerate(topic.id, topic.title)
          for (let seed = 1; seed <= 25; seed++) {
            const task = generate(createRng(seed))
            expect(task.question, `${topic.id} seed ${seed}`).not.toMatch(/Idee\s*→\s*Anwendung/)
            expect(task.question, `${topic.id} seed ${seed}`).not.toMatch(/Grundidee/)
            expect(task.question, `${topic.id} seed ${seed}`).not.toMatch(/Wozu übt man/)
            expect(task.question, `${topic.id} seed ${seed}`).not.toMatch(/zentralen Inhalt/)
            expect(task.question, `${topic.id} seed ${seed}`).not.toMatch(/gehört im Lehrplan/)
          }
        }
      }
    }
  })

  it('avoids philosophical nonsense distractors and off-topic motion on volume', () => {
    const generate =
      resolvePhysikGenerate('ph-k6-lb2-volumen') ??
      makePhysikTopicGenerate('ph-k6-lb2-volumen', 'Volumen bestimmen')
    for (let seed = 1; seed <= 80; seed++) {
      const task = generate(createRng(seed))
      const blob = `${task.question}\n${task.solution}\n${(task as { choices?: string[] }).choices?.join('\n') ?? ''}`
      expect(blob, `seed ${seed}`).not.toMatch(/Kunststil/)
      expect(blob, `seed ${seed}`).not.toMatch(/Lateinische Deklination/)
      expect(blob, `seed ${seed}`).not.toMatch(/Musiktempo/)
      expect(task.question, `seed ${seed}`).not.toMatch(/Schritte beim Lösen/)
      expect(task.question, `seed ${seed}`).not.toMatch(/Gleichförmige Bewegung/)
      expect(task.question, `seed ${seed}`).not.toMatch(/s = v·t/)
      expect(task.question, `seed ${seed}`).not.toMatch(/Den falschen Block ans Ende/)
    }
  })

  it('volume topic asks formula, units, calculation, or formula drag-drop', () => {
    const generate =
      resolvePhysikGenerate('ph-k6-lb2-volumen') ??
      makePhysikTopicGenerate('ph-k6-lb2-volumen', 'Volumen bestimmen')
    const kinds = new Set<string>()
    for (let seed = 1; seed <= 60; seed++) {
      const task = generate(createRng(seed))
      if (task.interactive?.type === 'dragDropSlots') {
        kinds.add('slots')
        const labels = (task.interactive.props as { items: Array<{ label: string }>; slotCount: number })
          .items.map((i) => i.label)
        expect(task.interactive.props.slotCount).toBe(4)
        expect(labels).toContain('V =')
        expect(labels).toContain('× m')
        expect(task.sampleAnswer.kind).toBe('dragDropSlots')
        expect(task.check(task.sampleAnswer)).toBe(true)
        if (task.sampleAnswer.kind === 'dragDropSlots') {
          const slots = [...task.sampleAnswer.slots] as number[]
          // Permute factors after "V =" — still correct (product order free).
          const permuted = [slots[0]!, slots[2]!, slots[1]!, slots[3]!]
          expect(task.check({ kind: 'dragDropSlots', slots: permuted })).toBe(true)
          const distractorIdx = labels.findIndex((l) => l === '× m')
          expect(
            task.check({
              kind: 'dragDropSlots',
              slots: [slots[0]!, slots[1]!, slots[2]!, distractorIdx],
            }),
          ).toBe(false)
        }
      } else if (task.unit === 'cm³' || /Berechne das Volumen/.test(task.question)) {
        kinds.add('calc')
        expect(task.question).not.toMatch(/V\s*=\s*l/)
      } else {
        kinds.add('choice')
        expect(task.question).toMatch(/Volumen|Formel|Einheit|Größen|Liter|Quader/)
      }
    }
    expect(kinds.has('calc')).toBe(true)
    expect(kinds.has('choice')).toBe(true)
    expect(kinds.has('slots')).toBe(true)
  })

  it('never uses Kunststil-style distractors anywhere in the factory pack', () => {
    const pack = buildGymSachsenPhysikPack()
    for (const grade of pack.official) {
      for (const area of grade.areas) {
        for (const topic of area.topics) {
          const generate = resolvePhysikGenerate(topic.id) ?? makePhysikTopicGenerate(topic.id, topic.title)
          for (let seed = 1; seed <= 15; seed++) {
            const task = generate(createRng(seed))
            const blob = JSON.stringify(task)
            expect(blob, `${topic.id} seed ${seed}`).not.toMatch(/Kunststil/)
            expect(blob, `${topic.id} seed ${seed}`).not.toMatch(/Lateinische Deklination/)
            expect(blob, `${topic.id} seed ${seed}`).not.toMatch(/Musiktempo/)
            expect(task.question, `${topic.id} seed ${seed}`).not.toMatch(
              /Ordne die Schritte beim Lösen einer Rechenaufgabe/,
            )
          }
        }
      }
    }
  })

  it('density comparison only compares (no calc, no nonsense distractors)', () => {
    const generate =
      resolvePhysikGenerate('ph-k6-lb2-dichtestoffe') ??
      makePhysikTopicGenerate('ph-k6-lb2-dichtestoffe', 'Dichte von Stoffen vergleichen')
    for (let seed = 1; seed <= 60; seed++) {
      const task = generate(createRng(seed))
      const blob = JSON.stringify(task)
      expect(blob, `seed ${seed}`).not.toMatch(/verdampft/)
      expect(blob, `seed ${seed}`).not.toMatch(/wird zu Gas/)
      expect(blob, `seed ${seed}`).not.toMatch(/Kunststil/)
      expect(task.question, `seed ${seed}`).not.toMatch(/Berechne/)
      expect(task.unit, `seed ${seed}`).not.toBe('g/cm³')
      if (/gelegt\. Was passiert/.test(task.question)) {
        expect(blob).toMatch(/schwimmt|sinkt zu Boden/)
      }
    }
  })

  it('density calculation questions do not reveal the formula', () => {
    const generate =
      resolvePhysikGenerate('ph-k6-lb2-dichte') ??
      makePhysikTopicGenerate('ph-k6-lb2-dichte', 'Dichte berechnen')
    for (let seed = 1; seed <= 40; seed++) {
      const task = generate(createRng(seed))
      expect(task.question, `seed ${seed}`).not.toMatch(/ρ\s*=\s*m/)
      expect(task.question, `seed ${seed}`).not.toMatch(/m\s*\/\s*V/)
    }
  })
})
