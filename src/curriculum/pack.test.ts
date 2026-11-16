import { describe, expect, it } from 'vitest'
import {
  GYM_SACHSEN_PACK_ID,
  mergePackUpdate,
  packNeedsUpdate,
  parseCurriculumPack,
  parseManifest,
  type CurriculumPack,
} from './pack'
import { checkCurriculumRefs } from './versionGate'
import {
  installPack,
  listInstalledPacks,
  resetCurriculumMemory,
  type CurriculumKv,
} from './install'
import { extraIdsInGrade, hydratePackGrades } from './hydrate'
import { GYM_SACHSEN_SEED_EXTRAS } from './seed'

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

const samplePack = (version: string, extras = GYM_SACHSEN_SEED_EXTRAS): CurriculumPack => ({
  id: GYM_SACHSEN_PACK_ID,
  title: 'Gymnasium Sachsen · Mathematik',
  region: 'Sachsen',
  school: 'Gymnasium',
  subject: 'Mathematik',
  version,
  changelog: 'Test',
  contentHash: 'abc',
  official: [
    {
      id: 'mathematik-klasse-5',
      title: 'Klasse 5',
      subjectTitle: 'Mathematik',
      gradeTitle: 'Klasse 5',
      description: 'Test',
      areas: [
        {
          id: 'lb1',
          title: 'Arbeiten mit natürlichen Zahlen',
          topics: [{ id: 'lb1-addition', title: 'Addition', pointsPerTask: 10 }],
        },
      ],
    },
  ],
  extras,
})

describe('curriculum manifest and versions', () => {
  it('parses a catalog manifest', () => {
    const parsed = parseManifest({
      updatedAt: '2026-09-05T00:00:00Z',
      packs: [
        {
          id: 'gym-sachsen',
          title: 'Gymnasium Sachsen · Mathematik',
          region: 'Sachsen',
          school: 'Gymnasium',
          subject: 'Mathematik',
          version: '1.2.3',
          url: 'https://example.test/gym-sachsen.json',
          size: 12,
          changelog: 'Neu',
        },
      ],
    })
    expect(parsed?.packs[0].version).toBe('1.2.3')
    expect(parsed?.packs[0].id).toBe(GYM_SACHSEN_PACK_ID)
  })

  it('compares pack versions like app updates', () => {
    expect(packNeedsUpdate('1.0.0', '1.0.1')).toBe(true)
    expect(packNeedsUpdate('1.2.0', '1.1.9')).toBe(false)
    expect(packNeedsUpdate('1.0.0', '1.0.0')).toBe(false)
  })

  it('keeps extras separate from official topics in the data file', () => {
    const pack = parseCurriculumPack(samplePack('1.0.0'))
    expect(pack).not.toBeNull()
    const officialIds = pack!.official.flatMap((grade) =>
      grade.areas.flatMap((area) => area.topics.map((topic) => topic.id)),
    )
    expect(officialIds).not.toContain('extra-k5-kopfrechnen-zehner')
    expect(pack!.extras[0].source).toBe('lehrer')
    expect(pack!.extras[0].areaId).toBe('lb1')
  })

  it('merges extras by id on update and replaces official content', () => {
    const previous = samplePack('1.0.0')
    const incoming = samplePack('1.1.0', [
      {
        id: 'extra-k5-kopfrechnen-zehner',
        gradeId: 'mathematik-klasse-5',
        areaId: 'lb1',
        source: 'lehrer',
        topic: {
          id: 'extra-k5-kopfrechnen-zehner',
          title: 'Kopfrechnen (neu)',
          pointsPerTask: 12,
        },
      },
      {
        id: 'extra-k5-neu',
        gradeId: 'mathematik-klasse-5',
        areaId: 'lb1',
        source: 'lehrer',
        topic: { id: 'extra-k5-neu', title: 'Neue Ergänzung', pointsPerTask: 10 },
      },
    ])
    incoming.official[0].areas[0].topics = [
      { id: 'lb1-addition', title: 'Addition (Lehrplan 2026)', pointsPerTask: 10 },
    ]
    const merged = mergePackUpdate(previous, incoming)
    expect(merged.version).toBe('1.1.0')
    expect(merged.official[0].areas[0].topics[0].title).toBe('Addition (Lehrplan 2026)')
    expect(merged.extras.map((item) => item.id).sort()).toEqual([
      'extra-k5-kopfrechnen-zehner',
      'extra-k5-neu',
    ])
    expect(merged.extras.find((item) => item.id === 'extra-k5-kopfrechnen-zehner')?.topic.title).toBe(
      'Kopfrechnen (neu)',
    )
  })
})

describe('install and version gate', () => {
  it('installs a pack locally so Themen hydration sees official + extras', async () => {
    resetCurriculumMemory()
    const kv = memoryKv()
    const installed = installPack(samplePack('1.0.0'), kv)
    expect(listInstalledPacks(kv)[0].id).toBe(GYM_SACHSEN_PACK_ID)
    const grades = await hydratePackGrades(installed)
    const klasse5 = grades.find(
      (grade) => grade.id === 'klasse-5' || grade.id === 'mathematik-klasse-5',
    )
    expect(klasse5).toBeDefined()
    expect(extraIdsInGrade(klasse5!)).toContain('extra-k5-kopfrechnen-zehner')
    const extra = klasse5!.areas[0].topics.find((topic) => topic.id === 'extra-k5-kopfrechnen-zehner')
    expect(extra?.source).toBe('lehrer')
    expect(klasse5!.areas[0].topics.find((topic) => topic.id === 'lb1-addition')?.source).toBe(
      'official',
    )
  })

  it('blocks exams/challenges that need a newer pack and allows same or older', () => {
    const kv = memoryKv()
    installPack(samplePack('1.2.0'), kv)
    const newer = checkCurriculumRefs([{ moduleId: GYM_SACHSEN_PACK_ID, version: '1.3.0' }], kv)
    expect(newer.ok).toBe(false)
    if (!newer.ok) expect(newer.reason).toBe('update')

    const same = checkCurriculumRefs([{ moduleId: GYM_SACHSEN_PACK_ID, version: '1.2.0' }], kv)
    expect(same.ok).toBe(true)

    const older = checkCurriculumRefs([{ moduleId: GYM_SACHSEN_PACK_ID, version: '1.0.0' }], kv)
    expect(older.ok).toBe(true)
  })

  it('offers a banner when the remote pack version is newer', () => {
    const kv = memoryKv()
    installPack(samplePack('1.0.0'), kv)
    const local = listInstalledPacks(kv)[0]
    expect(packNeedsUpdate(local.version, '1.1.0')).toBe(true)
    expect(packNeedsUpdate(local.version, '1.0.0')).toBe(false)
  })
})

describe('explore (Erkundungs-Tafelbild) im Pack', () => {
  const withExplore = (explore: unknown): unknown => ({
    ...samplePack('1.0.0'),
    official: [
      {
        ...samplePack('1.0.0').official[0],
        areas: [
          {
            id: 'lb1',
            title: 'Test',
            topics: [{ id: 't1__neu', title: 'T', pointsPerTask: 10, explore }],
          },
        ],
      },
    ],
  })
  const exploreOf = (raw: unknown) =>
    parseCurriculumPack(JSON.parse(JSON.stringify(raw)))?.official[0].areas[0].topics[0].explore

  it('bleibt als reine Daten erhalten (JSON-Round-Trip)', () => {
    expect(exploreOf(withExplore({ boardId: 'winkelarten' }))).toEqual({ boardId: 'winkelarten' })
    expect(exploreOf(withExplore({ boardId: 'winkelarten', params: { winkel: 90 } }))).toEqual({
      boardId: 'winkelarten',
      params: { winkel: 90 },
    })
  })

  it('verwirft kaputte Angaben', () => {
    expect(exploreOf(withExplore({ boardId: '  ' }))).toBeUndefined()
    expect(exploreOf(withExplore('x'))).toBeUndefined()
    expect(exploreOf(withExplore({ boardId: 'a', params: { x: 'y', z: 2 } }))).toEqual({
      boardId: 'a',
      params: { z: 2 },
    })
  })

  it('Seed-Pack: die Hauptthemen tragen das explore der ehemaligen Neu-Themen, Round-Trip identisch', async () => {
    const { buildGymSachsenSeed } = await import('./seed')
    const pack = await buildGymSachsenSeed()
    const found: Record<string, unknown> = {}
    for (const g of pack.official)
      for (const a of g.areas)
        for (const t of a.topics) if (t.explore) found[t.id] = t.explore
    expect(found).toEqual({
      'lb2-erweitern': { boardId: 'bruchErweitern' },
      'lb3-winkelarten': { boardId: 'winkelarten' },
      'lb1-erweitern': { boardId: 'bruchErweitern' },
      'k7-lb1-mittelsenkrechte-schritte': { boardId: 'mittelsenkrechte' },
    })
    const again = parseCurriculumPack(JSON.parse(JSON.stringify(pack)))
    expect(again?.official).toEqual(pack.official)
  })
})
