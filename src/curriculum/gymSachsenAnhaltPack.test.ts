import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { hydratePackGrades } from './hydrate'
import {
  bundledPackById,
  installPack,
  listInstalledPacks,
  resetCurriculumMemory,
  type CurriculumKv,
} from './install'
import { gymGeneratorCatalog, isPlayableOfficialTopic } from './oberschuleGenerators'
import {
  allOfficialStTopics,
  buildGymSachsenAnhaltPack,
  ST_GENERATOR_MAP,
} from './gymSachsenAnhaltPack'
import { GYM_SACHSEN_ANHALT_PACK_ID, parseCurriculumPack, parseManifest } from './pack'
import { getLoadedIds, listVisibleGradeModules } from './registry'

const memoryKv = (): CurriculumKv => {
  const map = new Map<string, string>()
  return {
    getItem: (key) => (map.has(key) ? map.get(key)! : null),
    setItem: (key, value) => {
      map.set(key, value)
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}

const curriculaDir = join(dirname(fileURLToPath(import.meta.url)), '../../curricula')

describe('Gymnasium Sachsen-Anhalt Mathematik pack', () => {
  const pack = buildGymSachsenAnhaltPack()

  it('parses with region Sachsen-Anhalt and empty extras', () => {
    const parsed = parseCurriculumPack(pack)
    expect(parsed?.id).toBe(GYM_SACHSEN_ANHALT_PACK_ID)
    expect(parsed?.region).toBe('Sachsen-Anhalt')
    expect(parsed?.school).toBe('Gymnasium')
    expect(parsed?.subject).toBe('Mathematik')
    expect(parsed?.version).toBe('1.0.1')
    expect(parsed?.extras).toEqual([])
  })

  it('uses ST Kompetenzschwerpunkt titles', () => {
    const names = pack.official.flatMap((g) => g.areas.map((a) => a.title))
    expect(names).toContain('Natürliche Zahlen')
    expect(names).toContain('Satzgruppe des Pythagoras')
    expect(names).toContain('Lineare Funktionen')
    expect(names).toContain('Funktionsklassen')
    expect(names).not.toContain('Arbeiten mit natürlichen Zahlen')
  })

  it('maps aliases to existing Gym generators and leaves gaps unmapped', async () => {
    const catalog = await gymGeneratorCatalog()
    for (const [stId, gymId] of Object.entries(ST_GENERATOR_MAP)) {
      expect(catalog.has(gymId), `${stId} → ${gymId}`).toBe(true)
      expect(isPlayableOfficialTopic(stId)).toBe(true)
    }
    const outline = allOfficialStTopics().filter((t) => !ST_GENERATOR_MAP[t.id])
    expect(outline.length).toBeGreaterThan(0)
    expect(outline.some((t) => /Logarithm|Boxplot|Normalverteilung|bedingte/i.test(t.title))).toBe(
      true,
    )
  })

  it('hydrates playable topics whose sample answers pass check', async () => {
    const grades = await hydratePackGrades(pack)
    expect(grades.length).toBe(7)
    const playable = grades.flatMap((g) =>
      g.areas.flatMap((a) => a.topics.filter((t) => !t.outlineOnly)),
    )
    expect(playable.length).toBeGreaterThan(80)
    for (const topic of playable.slice(0, 25)) {
      for (const seed of [1, 7]) {
        const task = topic.generate(createRng(seed))
        expect(task.check(task.sampleAnswer), `${topic.id} seed ${seed}`).toBe(true)
      }
    }
  })

  it('is installable and appears under Themen', async () => {
    resetCurriculumMemory()
    const kv = memoryKv()
    const bundled = await bundledPackById(GYM_SACHSEN_ANHALT_PACK_ID)
    expect(bundled?.id).toBe(GYM_SACHSEN_ANHALT_PACK_ID)
    installPack(bundled!, kv)
    expect(listInstalledPacks(kv).some((p) => p.id === GYM_SACHSEN_ANHALT_PACK_ID)).toBe(true)
    const modules = listVisibleGradeModules(kv)
    expect(modules.some((m) => m.id === 'st-gym-klasse-5')).toBe(true)
    expect(getLoadedIds(kv)).toEqual([])
  })

  it('exported JSON and manifest stay in sync', () => {
    const file = parseCurriculumPack(
      JSON.parse(readFileSync(join(curriculaDir, 'gym-sachsen-anhalt.json'), 'utf8')),
    )
    const manifest = parseManifest(
      JSON.parse(readFileSync(join(curriculaDir, 'manifest.json'), 'utf8')),
    )
    expect(file?.version).toBe('1.0.1')
    expect(file?.contentHash).toBe(pack.contentHash)
    expect(manifest?.packs.map((p) => p.id)).toContain(GYM_SACHSEN_ANHALT_PACK_ID)
    expect(manifest?.packs.find((p) => p.id === GYM_SACHSEN_ANHALT_PACK_ID)?.region).toBe(
      'Sachsen-Anhalt',
    )
  })
})
