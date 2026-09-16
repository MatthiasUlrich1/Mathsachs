import { describe, expect, it } from 'vitest'
import { topicContentId } from './contentId'
import { hydratePackGrades } from './hydrate'
import { buildGymSachsenSeed } from './seed'

describe('hydratePackGrades freigabe overlay', () => {
  it('unlocks bundled Math topics when the pack omits released (ID 2101)', async () => {
    const pack = await buildGymSachsenSeed()
    const grades = await hydratePackGrades(pack)
    const k6 = grades.find((g) => g.id === 'klasse-6' || g.id === 'mathematik-klasse-6')
    expect(k6).toBeTruthy()
    const topic = k6!.areas
      .flatMap((a) => a.topics)
      .find((t) => t.id === 'lb4-flaeche-kante-quader')
    expect(topic).toBeTruthy()
    expect(topicContentId(topic!.id)).toBe(2101)
    expect(topic!.released).not.toBe(false)
  })

  it('keeps a bundled Math topic locked when the pack sets released:false', async () => {
    const pack = await buildGymSachsenSeed()
    for (const grade of pack.official) {
      for (const area of grade.areas) {
        for (const topic of area.topics) {
          if (topic.id === 'lb4-flaeche-kante-quader') topic.released = false
        }
      }
    }
    const grades = await hydratePackGrades(pack)
    const topic = grades
      .flatMap((g) => g.areas)
      .flatMap((a) => a.topics)
      .find((t) => t.id === 'lb4-flaeche-kante-quader')
    expect(topic?.released).toBe(false)
  })
})
