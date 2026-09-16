import { afterEach, describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'
import {
  applySharedPacksToKv,
  hasCurriculumMigrationFlag,
  installPack,
  isPackInstalled,
  listDeletedCurricula,
  listInstalledPacks,
  markCurriculumMigrated,
  removePack,
  resetCurriculumMemory,
  shouldAutoInstallSeed,
  snapshotPacksForSharedState,
  upgradeInstalledPacksFromBundled,
  type CurriculumKv,
} from './install'
import {
  GYM_SACHSEN_PACK_ID,
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
  type CurriculumPack,
} from './pack'
import { mergeSharedState } from '../lib/sharedState'

const require = createRequire(import.meta.url)
const store = require('../../electron/sharedStore.cjs') as {
  mergeSharedState: (base: unknown, incoming: unknown) => {
    curriculumPacks: Record<string, unknown>
    installedCurricula: Array<{ id: string }>
    deletedCurricula: Array<{ id: string; deletedAt: number }>
  }
}

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

const samplePack = (id: string, title: string): CurriculumPack => ({
  id,
  title,
  region: 'Sachsen',
  school: id === GYM_SACHSEN_PACK_ID ? 'Gymnasium' : 'Oberschule',
  subject: 'Mathematik',
  version: '1.0.0',
  changelog: 'Test',
  contentHash: 'abc12345',
  official: [
    {
      id: `${id}-klasse-5`,
      title: 'Klasse 5',
      subjectTitle: 'Mathematik',
      gradeTitle: 'Klasse 5',
      description: 'Test',
      areas: [
        {
          id: 'lb1',
          title: 'Zahlen',
          topics: [{ id: `${id}-add`, title: 'Addition', pointsPerTask: 10 }],
        },
      ],
    },
  ],
  extras: [],
})

const gym = () => samplePack(GYM_SACHSEN_PACK_ID, 'Gymnasium Sachsen · Mathematik')
const osHs = () =>
  samplePack(OS_HS_PACK_ID, 'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang')
const osRs = () =>
  samplePack(OS_RS_PACK_ID, 'Oberschule Sachsen · Mathematik · Realschulbildungsgang')

afterEach(() => {
  resetCurriculumMemory()
})

describe('removePack and shared merge', () => {
  it('keeps a removed pack uninstalled after merging a copy that still has it', () => {
    const kv = memoryKv()
    const now = Date.now()
    installPack(osHs(), kv, now)
    expect(isPackInstalled(OS_HS_PACK_ID, kv)).toBe(true)

    const stillInstalled = snapshotPacksForSharedState(kv)
    removePack(OS_HS_PACK_ID, kv, now + 50)
    expect(isPackInstalled(OS_HS_PACK_ID, kv)).toBe(false)
    expect(listDeletedCurricula(kv).map((row) => row.id)).toEqual([OS_HS_PACK_ID])

    const afterRemove = snapshotPacksForSharedState(kv)
    const merged = mergeSharedState(
      { schemaVersion: 1, users: [], records: {}, ...stillInstalled },
      { schemaVersion: 1, users: [], records: {}, ...afterRemove },
    )
    expect(merged.curriculumPacks?.[OS_HS_PACK_ID]).toBeUndefined()
    expect(merged.installedCurricula?.some((row) => row.id === OS_HS_PACK_ID)).toBe(false)
    expect(merged.deletedCurricula?.some((row) => row.id === OS_HS_PACK_ID)).toBe(true)

    applySharedPacksToKv(merged, kv)
    expect(isPackInstalled(OS_HS_PACK_ID, kv)).toBe(false)
    expect(listInstalledPacks(kv)).toEqual([])
  })

  it('does the same for Gymnasium and Oberschule RS', () => {
    for (const pack of [gym(), osRs()]) {
      const kv = memoryKv()
      const now = Date.now()
      installPack(pack, kv, now)
      const peer = snapshotPacksForSharedState(kv)
      removePack(pack.id, kv, now + 20)
      applySharedPacksToKv(
        mergeSharedState(
          { schemaVersion: 1, users: [], records: {}, ...peer },
          { schemaVersion: 1, users: [], records: {}, ...snapshotPacksForSharedState(kv) },
        ),
        kv,
      )
      expect(isPackInstalled(pack.id, kv)).toBe(false)
    }
  })

  it('applies tombstones in the Electron merge the same way', () => {
    const kv = memoryKv()
    const now = Date.now()
    installPack(osHs(), kv, now)
    const peer = snapshotPacksForSharedState(kv)
    removePack(OS_HS_PACK_ID, kv, now + 20)
    const merged = store.mergeSharedState(
      { schemaVersion: 1, users: [], records: {}, ...peer },
      { schemaVersion: 1, users: [], records: {}, ...snapshotPacksForSharedState(kv) },
    )
    expect(merged.curriculumPacks[OS_HS_PACK_ID]).toBeUndefined()
    expect(merged.deletedCurricula.some((row) => row.id === OS_HS_PACK_ID)).toBe(true)
  })

  it('lets a later reinstall clear the tombstone', () => {
    const kv = memoryKv()
    const now = Date.now()
    installPack(osHs(), kv, now)
    removePack(OS_HS_PACK_ID, kv, now + 20)
    installPack(osHs(), kv, now + 30)
    expect(isPackInstalled(OS_HS_PACK_ID, kv)).toBe(true)
    expect(listDeletedCurricula(kv)).toEqual([])
  })

  it('does not auto-reinstall Gymnasium after remove when the migration flag stays', async () => {
    const kv = memoryKv()
    const now = Date.now()
    markCurriculumMigrated(kv)
    installPack(gym(), kv, now)
    removePack(GYM_SACHSEN_PACK_ID, kv, now + 20)
    expect(hasCurriculumMigrationFlag(kv)).toBe(true)
    expect(shouldAutoInstallSeed(kv, true)).toBe(false)
    expect(isPackInstalled(GYM_SACHSEN_PACK_ID, kv)).toBe(false)
  })

  it('removes a pack even if a Challenge still references its topics', () => {
    const kv = memoryKv()
    const now = Date.now()
    installPack(osHs(), kv, now)
    removePack(OS_HS_PACK_ID, kv, now + 20)
    expect(isPackInstalled(OS_HS_PACK_ID, kv)).toBe(false)
  })
})

describe('upgradeInstalledPacksFromBundled', () => {
  it('upgrades installed packs when the bundled version is newer', async () => {
    const kv = memoryKv()
    installPack(osHs(), kv, 1)
    const newer = { ...osHs(), version: '1.1.0', changelog: 'Mehr Themen' }
    const upgraded = await upgradeInstalledPacksFromBundled(kv, 2, async (id) =>
      id === OS_HS_PACK_ID ? newer : null,
    )
    expect(upgraded).toHaveLength(1)
    expect(listInstalledPacks(kv)[0]?.version).toBe('1.1.0')
  })

  it('keeps Lehrer-extras when upgrading official content', async () => {
    const kv = memoryKv()
    const withExtra = {
      ...osHs(),
      extras: [
        {
          id: 'lehrer-extra-1',
          gradeId: `${OS_HS_PACK_ID}-klasse-5`,
          areaId: 'lb1',
          source: 'lehrer' as const,
          topic: { id: 'extra-topic', title: 'Extra', pointsPerTask: 10 },
        },
      ],
    }
    installPack(withExtra, kv, 1)
    const newer = {
      ...osHs(),
      version: '2.0.0',
      official: [
        {
          ...osHs().official[0]!,
          areas: [
            {
              id: 'lb1',
              title: 'Zahlen',
              topics: [
                { id: `${OS_HS_PACK_ID}-add`, title: 'Addition', pointsPerTask: 10 },
                { id: `${OS_HS_PACK_ID}-sub`, title: 'Subtraktion', pointsPerTask: 10 },
              ],
            },
          ],
        },
      ],
    }
    await upgradeInstalledPacksFromBundled(kv, 2, async () => newer)
    const pack = listInstalledPacks(kv)[0]!
    expect(pack.version).toBe('2.0.0')
    expect(pack.official[0]!.areas[0]!.topics).toHaveLength(2)
    expect(pack.extras.map((e) => e.id)).toEqual(['lehrer-extra-1'])
  })

  it('does nothing when bundled is not newer', async () => {
    const kv = memoryKv()
    installPack(osHs(), kv, 1)
    const upgraded = await upgradeInstalledPacksFromBundled(kv, 2, async () => osHs())
    expect(upgraded).toEqual([])
    expect(listInstalledPacks(kv)[0]?.version).toBe('1.0.0')
  })
})
