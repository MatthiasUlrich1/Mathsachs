import {
  GYM_SACHSEN_PACK_ID,
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
  mergePackUpdate,
  parseCurriculumPack,
  parseCurriculumPacksMap,
  parseInstalledCurricula,
  type CurriculumPack,
  type InstalledCurriculum,
} from './pack'
import { buildOberschuleHsPack, buildOberschuleRsPack } from './oberschulePacks'
import { buildGymSachsenSeed } from './seed'

export const INSTALLED_KEY = 'mathsachs.installedCurricula.v1'
export const packStorageKey = (id: string) => `mathsachs.curriculumPack.${id}.v1`
export const MIGRATED_KEY = 'mathsachs.curriculumMigrated.v1'
export const LOADED_KEY = 'mathsachs.loadedGrades.v1'

export interface CurriculumKv {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const memory = new Map<string, string>()

const memoryKv = (): CurriculumKv => ({
  getItem: (key) => (memory.has(key) ? memory.get(key)! : null),
  setItem: (key, value) => {
    memory.set(key, value)
  },
  removeItem: (key) => {
    memory.delete(key)
  },
})

export function resetCurriculumMemory(): void {
  memory.clear()
}

export function defaultCurriculumKv(): CurriculumKv {
  try {
    if (typeof localStorage !== 'undefined') return localStorage
  } catch {
    /* private mode */
  }
  return memoryKv()
}

const readJson = (kv: CurriculumKv, key: string): unknown => {
  const raw = kv.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

export function listInstalledMeta(kv: CurriculumKv = defaultCurriculumKv()): InstalledCurriculum[] {
  return parseInstalledCurricula(readJson(kv, INSTALLED_KEY))
}

export function getInstalledPack(
  id: string,
  kv: CurriculumKv = defaultCurriculumKv(),
): CurriculumPack | null {
  return parseCurriculumPack(readJson(kv, packStorageKey(id)))
}

export function listInstalledPacks(kv: CurriculumKv = defaultCurriculumKv()): CurriculumPack[] {
  return listInstalledMeta(kv)
    .map((row) => getInstalledPack(row.id, kv))
    .filter((pack): pack is CurriculumPack => pack !== null)
}

export function isPackInstalled(id: string, kv: CurriculumKv = defaultCurriculumKv()): boolean {
  return listInstalledMeta(kv).some((row) => row.id === id)
}

export function writeInstalledState(
  packs: CurriculumPack[],
  kv: CurriculumKv = defaultCurriculumKv(),
  now: number = Date.now(),
): InstalledCurriculum[] {
  const prev = new Map(listInstalledMeta(kv).map((row) => [row.id, row]))
  const meta: InstalledCurriculum[] = packs.map((pack) => ({
    id: pack.id,
    version: pack.version,
    installedAt: prev.get(pack.id)?.installedAt ?? now,
    contentHash: pack.contentHash,
  }))
  kv.setItem(INSTALLED_KEY, JSON.stringify(meta))
  for (const row of prev.keys()) {
    if (!packs.some((pack) => pack.id === row)) kv.removeItem(packStorageKey(row))
  }
  for (const pack of packs) kv.setItem(packStorageKey(pack.id), JSON.stringify(pack))
  return meta
}

export function installPack(
  pack: CurriculumPack,
  kv: CurriculumKv = defaultCurriculumKv(),
  now: number = Date.now(),
): CurriculumPack {
  const parsed = parseCurriculumPack(pack)
  if (!parsed) throw new Error('Ungültiges Lehrplan-Paket.')
  const existing = getInstalledPack(parsed.id, kv)
  const next = existing ? mergePackUpdate(existing, parsed) : parsed
  writeInstalledState(
    [...listInstalledPacks(kv).filter((item) => item.id !== next.id), next],
    kv,
    now,
  )
  return next
}

export function removePack(id: string, kv: CurriculumKv = defaultCurriculumKv()): void {
  writeInstalledState(
    listInstalledPacks(kv).filter((item) => item.id !== id),
    kv,
  )
}

export async function bundledPackById(id: string): Promise<CurriculumPack | null> {
  if (id === GYM_SACHSEN_PACK_ID) return buildGymSachsenSeed()
  if (id === OS_HS_PACK_ID) return buildOberschuleHsPack()
  if (id === OS_RS_PACK_ID) return buildOberschuleRsPack()
  return null
}

export async function installBundledGymSachsen(
  kv: CurriculumKv = defaultCurriculumKv(),
  now: number = Date.now(),
): Promise<CurriculumPack> {
  return installPack(await buildGymSachsenSeed(), kv, now)
}

export async function installBundledPack(
  id: string,
  kv: CurriculumKv = defaultCurriculumKv(),
  now: number = Date.now(),
): Promise<CurriculumPack> {
  const pack = await bundledPackById(id)
  if (!pack) throw new Error(`Unbekanntes Lehrplan-Paket „${id}“.`)
  return installPack(pack, kv, now)
}

export function readRawLoadedIds(kv: CurriculumKv = defaultCurriculumKv()): string[] | null {
  const raw = readJson(kv, LOADED_KEY)
  return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string') : null
}

export function hasCurriculumMigrationFlag(kv: CurriculumKv = defaultCurriculumKv()): boolean {
  return kv.getItem(MIGRATED_KEY) === '1'
}

export function markCurriculumMigrated(kv: CurriculumKv = defaultCurriculumKv()): void {
  kv.setItem(MIGRATED_KEY, '1')
}

export function shouldAutoInstallSeed(
  kv: CurriculumKv = defaultCurriculumKv(),
  hasPracticeHistory = false,
): boolean {
  if (isPackInstalled(GYM_SACHSEN_PACK_ID, kv) || hasCurriculumMigrationFlag(kv)) return false
  if (readRawLoadedIds(kv) !== null) return true
  return hasPracticeHistory
}

export async function migrateBundledCurriculumIfNeeded(
  kv: CurriculumKv = defaultCurriculumKv(),
  options?: { hasPracticeHistory?: boolean; now?: number },
): Promise<CurriculumPack | null> {
  if (isPackInstalled(GYM_SACHSEN_PACK_ID, kv)) {
    markCurriculumMigrated(kv)
    return getInstalledPack(GYM_SACHSEN_PACK_ID, kv)
  }
  if (!shouldAutoInstallSeed(kv, options?.hasPracticeHistory ?? false)) {
    markCurriculumMigrated(kv)
    return null
  }
  const pack = await installBundledGymSachsen(kv, options?.now)
  markCurriculumMigrated(kv)
  return pack
}

export function applySharedPacksToKv(
  state: { installedCurricula?: unknown; curriculumPacks?: unknown },
  kv: CurriculumKv = defaultCurriculumKv(),
): void {
  const packs = Object.values(parseCurriculumPacksMap(state.curriculumPacks))
  if (packs.length > 0) writeInstalledState(packs, kv)
}

export function snapshotPacksForSharedState(kv: CurriculumKv = defaultCurriculumKv()): {
  installedCurricula: InstalledCurriculum[]
  curriculumPacks: Record<string, CurriculumPack>
} {
  const packs = listInstalledPacks(kv)
  return {
    installedCurricula: listInstalledMeta(kv),
    curriculumPacks: Object.fromEntries(packs.map((pack) => [pack.id, pack])),
  }
}
