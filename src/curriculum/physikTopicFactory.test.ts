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
})
