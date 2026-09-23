import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { hydratePackGrades } from './hydrate'
import { bundledPackById, installPack, resetCurriculumMemory } from './install'
import {
  GYM_SACHSEN_GESCHICHTE_PACK_ID,
  parseCurriculumPack,
  parseManifest,
} from './pack'
import { listVisibleGradeModules } from './registry'
import { buildGymSachsenGeschichtePack } from './geschichteGymPack'
import { allGeschichteTopicIds } from './geschichteGymTopics'
import { resolveGeschichteGenerate } from './geschichteGenerators'

describe('Gymnasium Sachsen Geschichte pack', () => {
  it('builds Klassen 5–10 and Oberstufe Gk/Lk with K6 LB1 mostly released', () => {
    const pack = buildGymSachsenGeschichtePack()
    expect(pack.id).toBe(GYM_SACHSEN_GESCHICHTE_PACK_ID)
    expect(pack.subject).toBe('Geschichte')
    expect(pack.version).toBe('1.4.2')
    expect(pack.official.map((g) => g.id)).toEqual([
      'geschichte-klasse-5',
      'geschichte-klasse-6',
      'geschichte-klasse-7',
      'geschichte-klasse-8',
      'geschichte-klasse-9',
      'geschichte-klasse-10',
      'geschichte-jgs-11-12-gk',
      'geschichte-jgs-11-lk',
      'geschichte-jgs-12-lk',
    ])
    const topics = pack.official.flatMap((g) => g.areas.flatMap((a) => a.topics))
    expect(topics.length).toBeGreaterThan(30)
    const k6Lb1 = pack.official
      .find((g) => g.id === 'geschichte-klasse-6')!
      .areas.find((a) => a.id === 'lb1')!
      .topics
    expect(k6Lb1.find((t) => t.id === 'ge-k6-lb1-weltreich')?.released).toBe(false)
    expect(
      k6Lb1.filter((t) => t.id !== 'ge-k6-lb1-weltreich').every((t) => t.released === true),
    ).toBe(true)
    const lockedElsewhere = topics.filter((t) => !t.id.startsWith('ge-k6-lb1-'))
    expect(lockedElsewhere.every((t) => t.released === false)).toBe(true)
    expect(pack.extras).toEqual([])
  })

  it('registers stub generators so Entwickler can open topics (not outlineOnly)', () => {
    for (const id of allGeschichteTopicIds()) {
      expect(resolveGeschichteGenerate(id, 'Test'), id).toBeTypeOf('function')
    }
  })

  it('hydrates with released:false and playable stub tasks', async () => {
    const grades = await hydratePackGrades(buildGymSachsenGeschichtePack())
    const k5 = grades.find((g) => g.id === 'geschichte-klasse-5')!
    const topics = k5.areas.flatMap((a) => a.topics)
    expect(topics.every((t) => t.released === false)).toBe(true)
    expect(topics.every((t) => !t.outlineOnly)).toBe(true)
    const task = topics[0]!.generate(() => 0.5)
    expect(task.question).toMatch(/Geschichte/)
  })

  it('is bundled and appears after install', async () => {
    resetCurriculumMemory()
    const pack = await bundledPackById(GYM_SACHSEN_GESCHICHTE_PACK_ID)
    expect(pack?.id).toBe(GYM_SACHSEN_GESCHICHTE_PACK_ID)
    installPack(pack!)
    const visible = listVisibleGradeModules()
    expect(visible.map((m) => m.id)).toContain('geschichte-klasse-5')
  })

  it('matches exported curricula JSON and manifest', () => {
    const curriculaDir = join(process.cwd(), 'curricula')
    const file = parseCurriculumPack(
      JSON.parse(readFileSync(join(curriculaDir, 'gym-sachsen-geschichte.json'), 'utf8')),
    )
    const pack = buildGymSachsenGeschichtePack()
    expect(file?.version).toBe(pack.version)
    expect(file?.contentHash).toBe(pack.contentHash)
    const manifest = parseManifest(
      JSON.parse(readFileSync(join(curriculaDir, 'manifest.json'), 'utf8')),
    )
    expect(manifest?.packs.map((p) => p.id)).toContain(GYM_SACHSEN_GESCHICHTE_PACK_ID)
    expect(manifest?.packs.find((p) => p.id === GYM_SACHSEN_GESCHICHTE_PACK_ID)?.subject).toBe(
      'Geschichte',
    )
  })
})
