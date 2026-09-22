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
  SKS_SACHSEN_ANHALT_HS_PACK_ID,
  SKS_SACHSEN_ANHALT_RS_PACK_ID,
  parseCurriculumPack,
  parseManifest,
} from './pack'
import { schulformIdForPack } from './packFilters'
import { listVisibleGradeModules } from './registry'
import {
  allOfficialSksTopics,
  buildSekundarschuleSachsenAnhaltHsPack,
  buildSekundarschuleSachsenAnhaltRsPack,
  SKS_GENERATOR_MAP,
} from './sekundarschuleSachsenAnhaltPack'

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

describe('Sekundarschule Sachsen-Anhalt Mathematik packs', () => {
  const hs = buildSekundarschuleSachsenAnhaltHsPack()
  const rs = buildSekundarschuleSachsenAnhaltRsPack()

  it('parses HS/RS with region Sachsen-Anhalt and filterable schulform', () => {
    expect(parseCurriculumPack(hs)?.id).toBe(SKS_SACHSEN_ANHALT_HS_PACK_ID)
    expect(parseCurriculumPack(rs)?.id).toBe(SKS_SACHSEN_ANHALT_RS_PACK_ID)
    expect(hs.region).toBe('Sachsen-Anhalt')
    expect(rs.school).toBe('Sekundarschule')
    expect(schulformIdForPack(hs)).toBe('hauptschule')
    expect(schulformIdForPack(rs)).toBe('realschule')
    expect(hs.official.map((g) => g.id)).toContain('sks-hs-klasse-9')
    expect(rs.official.map((g) => g.id)).toContain('sks-rs-klasse-10')
    expect(hs.official.some((g) => g.id.includes('klasse-10'))).toBe(false)
  })

  it('uses ST Kompetenzschwerpunkt titles', () => {
    const names = [...hs.official, ...rs.official].flatMap((g) => g.areas.map((a) => a.title))
    expect(names).toContain('Natürliche Zahlen')
    expect(names).toContain('Rechtwinklige Dreiecke')
    expect(names).toContain('Direkte und indirekte Proportionalität')
    expect(names).not.toContain('Arbeiten mit natürlichen Zahlen')
  })

  it('maps aliases to existing Gym generators and leaves gaps unmapped', async () => {
    const catalog = await gymGeneratorCatalog()
    for (const [sksId, gymId] of Object.entries(SKS_GENERATOR_MAP)) {
      expect(catalog.has(gymId), `${sksId} → ${gymId}`).toBe(true)
      expect(isPlayableOfficialTopic(sksId)).toBe(true)
    }
    const outline = allOfficialSksTopics().filter((t) => !SKS_GENERATOR_MAP[t.id])
    expect(outline.length).toBeGreaterThan(0)
    expect(outline.some((t) => /Thales|Kegel|Sinus|Pfad|Umkreis/i.test(t.title))).toBe(true)
  })

  it('hydrates playable topics', async () => {
    const grades = await hydratePackGrades(rs)
    const playable = grades.flatMap((g) =>
      g.areas.flatMap((a) => a.topics.filter((t) => !t.outlineOnly)),
    )
    expect(playable.length).toBeGreaterThan(60)
    for (const topic of playable.slice(0, 15)) {
      const task = topic.generate(createRng(3))
      expect(task.check(task.sampleAnswer), topic.id).toBe(true)
    }
  })

  it('is installable and appears under Themen', async () => {
    resetCurriculumMemory()
    const kv = memoryKv()
    installPack((await bundledPackById(SKS_SACHSEN_ANHALT_HS_PACK_ID))!, kv)
    expect(listInstalledPacks(kv).some((p) => p.id === SKS_SACHSEN_ANHALT_HS_PACK_ID)).toBe(true)
    expect(listVisibleGradeModules(kv).some((m) => m.id === 'sks-hs-klasse-5')).toBe(true)
  })

  it('exported JSON and manifest stay in sync', () => {
    const hsFile = parseCurriculumPack(
      JSON.parse(readFileSync(join(curriculaDir, 'sekundarschule-sachsen-anhalt-hs.json'), 'utf8')),
    )
    const rsFile = parseCurriculumPack(
      JSON.parse(readFileSync(join(curriculaDir, 'sekundarschule-sachsen-anhalt-rs.json'), 'utf8')),
    )
    const manifest = parseManifest(
      JSON.parse(readFileSync(join(curriculaDir, 'manifest.json'), 'utf8')),
    )
    expect(hsFile?.contentHash).toBe(hs.contentHash)
    expect(rsFile?.contentHash).toBe(rs.contentHash)
    expect(manifest?.packs.map((p) => p.id)).toContain(SKS_SACHSEN_ANHALT_HS_PACK_ID)
    expect(manifest?.packs.map((p) => p.id)).toContain(SKS_SACHSEN_ANHALT_RS_PACK_ID)
  })
})
