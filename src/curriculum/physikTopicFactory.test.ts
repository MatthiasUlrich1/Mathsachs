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
    }
  })

  it('volume topic asks formula, units, calculation, or formula drag-drop', () => {
    const generate =
      resolvePhysikGenerate('ph-k6-lb2-volumen') ??
      makePhysikTopicGenerate('ph-k6-lb2-volumen', 'Volumen bestimmen')
    const kinds = new Set<string>()
    for (let seed = 1; seed <= 60; seed++) {
      const task = generate(createRng(seed))
      if (task.interactive?.type === 'dragDropSort') {
        kinds.add('sort')
        const labels = (task.interactive.props as { items: Array<{ label: string }> }).items.map(
          (i) => i.label,
        )
        expect(labels.join(' ')).toMatch(/V/)
        expect(labels.some((l) => /l/.test(l))).toBe(true)
      } else if (task.unit === 'cm³' || /Berechne V/.test(task.question)) {
        kinds.add('calc')
      } else {
        kinds.add('choice')
        expect(task.question).toMatch(/Volumen|Formel|Einheit|Größen|Liter|Quader/)
      }
    }
    expect(kinds.has('calc')).toBe(true)
    expect(kinds.has('choice')).toBe(true)
    expect(kinds.has('sort')).toBe(true)
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
})
