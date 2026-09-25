import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { hydratePackGrades } from './hydrate'
import { bundledPackById, installPack, resetCurriculumMemory } from './install'
import {
  GYM_SACHSEN_BIOLOGIE_PACK_ID,
  parseCurriculumPack,
  parseManifest,
} from './pack'
import { listVisibleGradeModules } from './registry'
import { buildGymSachsenBiologiePack } from './biologieGymPack'
import {
  allBiologieTopicIds,
  BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS,
  BIOLOGIE_K6_WIRBELLOSE_RELEASED_IDS,
  BIOLOGIE_RELEASED_IDS,
} from './biologieGymTopics'
import { isPlayableBiologieTopic, resolveBiologieGenerate } from './biologieGenerators'

describe('Gymnasium Sachsen Biologie pack', () => {
  it('builds Klassen 5–10 and Oberstufe with K5 Freigabeliste + K6 LB2 Wirbellose released', () => {
    const pack = buildGymSachsenBiologiePack()
    expect(pack.id).toBe(GYM_SACHSEN_BIOLOGIE_PACK_ID)
    expect(pack.subject).toBe('Biologie')
    expect(pack.version).toBe('1.7.0')
    expect(pack.official.map((g) => g.id)).toEqual([
      'biologie-klasse-5',
      'biologie-klasse-6',
      'biologie-klasse-7',
      'biologie-klasse-8',
      'biologie-klasse-9',
      'biologie-klasse-10',
      'biologie-jgs-11-gk',
      'biologie-jgs-12-gk',
      'biologie-jgs-11-lk',
      'biologie-jgs-12-lk',
    ])
    const topics = pack.official.flatMap((g) => g.areas.flatMap((a) => a.topics))
    expect(topics.length).toBeGreaterThan(70)
    const k6Lb2 = pack.official
      .find((g) => g.id === 'biologie-klasse-6')!
      .areas.find((a) => a.id === 'lb2')!
      .topics
    expect(k6Lb2.map((t) => t.id)).toEqual([...BIOLOGIE_K6_WIRBELLOSE_RELEASED_IDS])
    expect(k6Lb2.every((t) => t.released === true)).toBe(true)
    const released = topics.filter((t) => t.released === true).map((t) => t.id).sort()
    expect(released).toEqual([...BIOLOGIE_RELEASED_IDS].sort())
    const lockedElsewhere = topics.filter(
      (t) => !(BIOLOGIE_RELEASED_IDS as readonly string[]).includes(t.id),
    )
    expect(lockedElsewhere.every((t) => t.released === false)).toBe(true)
    const k5Ids = pack.official
      .find((g) => g.id === 'biologie-klasse-5')!
      .areas.flatMap((a) => a.topics.map((t) => t.id))
    for (const id of BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS) {
      expect(k5Ids).toContain(id)
      expect(isPlayableBiologieTopic(id)).toBe(true)
    }
    for (const id of BIOLOGIE_K6_WIRBELLOSE_RELEASED_IDS) {
      expect(isPlayableBiologieTopic(id)).toBe(true)
    }
    expect(pack.extras).toEqual([])
  })

  it('registers stub generators so Entwickler can open topics (not outlineOnly)', () => {
    for (const id of allBiologieTopicIds()) {
      expect(resolveBiologieGenerate(id, 'Test'), id).toBeTypeOf('function')
    }
  })

  it('hydrates all outline topics with playable (non-stub) generators', async () => {
    const grades = await hydratePackGrades(buildGymSachsenBiologiePack())
    const topics = grades.flatMap((g) => g.areas.flatMap((a) => a.topics))
    const released = topics.filter((t) => t.released !== false)
    expect(released.map((t) => t.id).sort()).toEqual([...BIOLOGIE_RELEASED_IDS].sort())
    expect(topics.every((t) => !t.outlineOnly)).toBe(true)
    expect(topics.every((t) => isPlayableBiologieTopic(t.id))).toBe(true)
    for (const topic of topics) {
      const task = topic.generate(() => 0.42)
      expect(task.question.trim().length, topic.id).toBeGreaterThan(10)
      expect(task.solution.trim().length, topic.id).toBeGreaterThan(0)
      expect(task.check(task.sampleAnswer!), topic.id).toBe(true)
    }
  })

  it('hydrates K5 Wirbeltiere with playable tasks; Freigabeliste unlocked', async () => {
    const grades = await hydratePackGrades(buildGymSachsenBiologiePack())
    const k5 = grades.find((g) => g.id === 'biologie-klasse-5')!
    const topics = k5.areas.flatMap((a) => a.topics)
    expect(topics.every((t) => !t.outlineOnly)).toBe(true)
    const playable = topics.filter((t) =>
      (BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS as readonly string[]).includes(t.id),
    )
    expect(playable.length).toBe(BIOLOGIE_K5_WIRBELTIERE_TOPIC_IDS.length)
    for (const topic of playable) {
      const task = topic.generate(() => 0.42)
      expect(task.question.trim().length, topic.id).toBeGreaterThan(10)
      expect(task.solution.trim().length, topic.id).toBeGreaterThan(0)
      expect(task.fachwissen?.text.trim().length ?? 0, topic.id).toBeGreaterThan(20)
      if ((BIOLOGIE_RELEASED_IDS as readonly string[]).includes(topic.id)) {
        expect(topic.released).toBe(true)
      } else {
        expect(topic.released).toBe(false)
      }
    }
  })

  it('is bundled and appears after install', async () => {
    resetCurriculumMemory()
    const pack = await bundledPackById(GYM_SACHSEN_BIOLOGIE_PACK_ID)
    expect(pack?.id).toBe(GYM_SACHSEN_BIOLOGIE_PACK_ID)
    installPack(pack!)
    const visible = listVisibleGradeModules()
    expect(visible.map((m) => m.id)).toContain('biologie-klasse-5')
  })

  it('matches exported curricula JSON and manifest', () => {
    const curriculaDir = join(process.cwd(), 'curricula')
    const file = parseCurriculumPack(
      JSON.parse(readFileSync(join(curriculaDir, 'gym-sachsen-biologie.json'), 'utf8')),
    )
    const pack = buildGymSachsenBiologiePack()
    expect(file?.version).toBe(pack.version)
    expect(file?.contentHash).toBe(pack.contentHash)
    const manifest = parseManifest(
      JSON.parse(readFileSync(join(curriculaDir, 'manifest.json'), 'utf8')),
    )
    expect(manifest?.packs.map((p) => p.id)).toContain(GYM_SACHSEN_BIOLOGIE_PACK_ID)
    expect(manifest?.packs.find((p) => p.id === GYM_SACHSEN_BIOLOGIE_PACK_ID)?.subject).toBe(
      'Biologie',
    )
  })
})
