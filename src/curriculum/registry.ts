import { bundledCurricula, getBundledModule, type CurriculumModule } from './bundled'
import {
  defaultCurriculumKv,
  isPackInstalled,
  listInstalledMeta,
  listInstalledPacks,
  LOADED_KEY,
  type CurriculumKv,
} from './install'
import { GYM_SACHSEN_PACK_ID } from './pack'

export const CURRICULUM_VERSION = 1
export type { CurriculumModule }
export { bundledCurricula, GYM_SACHSEN_PACK_ID }

export const availableCurricula: CurriculumModule[] = bundledCurricula

export const getCurriculumModule = (id: string): CurriculumModule | undefined =>
  getBundledModule(id)

export const DEFAULT_LOADED_IDS = ['mathematik-klasse-6']

export function listVisibleGradeModules(
  kv: CurriculumKv = defaultCurriculumKv(),
): CurriculumModule[] {
  const installed = new Set(listInstalledMeta(kv).map((row) => row.id))
  if (installed.size === 0) return []
  return bundledCurricula.filter((mod) => installed.has(mod.packId))
}

export function packIdForGradeModule(gradeId: string): string {
  return getBundledModule(gradeId)?.packId ?? GYM_SACHSEN_PACK_ID
}

export const getLoadedIds = (kv: CurriculumKv = defaultCurriculumKv()): string[] => {
  let stored: string[] | null = null
  try {
    const raw = kv.getItem(LOADED_KEY)
    if (raw) stored = JSON.parse(raw) as string[]
  } catch {
    stored = null
  }
  const visible = listVisibleGradeModules(kv)
  if (stored === null) {
    if (visible.length === 0) return []
    return visible.some((m) => m.id === DEFAULT_LOADED_IDS[0])
      ? [...DEFAULT_LOADED_IDS]
      : visible.slice(0, 1).map((m) => m.id)
  }
  const allowed = new Set(visible.map((m) => m.id))
  return bundledCurricula.map((m) => m.id).filter((id) => stored!.includes(id) && allowed.has(id))
}

export const setLoadedIds = (
  ids: string[],
  kv: CurriculumKv = defaultCurriculumKv(),
): void => {
  kv.setItem(LOADED_KEY, JSON.stringify(ids))
}

export function installedPackVersion(
  packId: string,
  kv: CurriculumKv = defaultCurriculumKv(),
): string | null {
  return listInstalledMeta(kv).find((row) => row.id === packId)?.version ?? null
}

export function hasAnyInstalledPack(kv: CurriculumKv = defaultCurriculumKv()): boolean {
  return listInstalledPacks(kv).length > 0 || isPackInstalled(GYM_SACHSEN_PACK_ID, kv)
}
