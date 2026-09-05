import { bundledCurricula, getBundledModule, type CurriculumModule } from './bundled'
import {
  defaultCurriculumKv,
  isPackInstalled,
  listInstalledMeta,
  listInstalledPacks,
  LOADED_KEY,
  type CurriculumKv,
} from './install'
import { loadInstalledGrade } from './loadGrade'
import { GYM_SACHSEN_PACK_ID, OS_HS_PACK_ID, OS_RS_PACK_ID } from './pack'

export const CURRICULUM_VERSION = 1
export type { CurriculumModule }
export { bundledCurricula, GYM_SACHSEN_PACK_ID, OS_HS_PACK_ID, OS_RS_PACK_ID }

export const availableCurricula: CurriculumModule[] = bundledCurricula

export const getCurriculumModule = (
  id: string,
  kv: CurriculumKv = defaultCurriculumKv(),
): CurriculumModule | undefined =>
  getBundledModule(id) ?? listVisibleGradeModules(kv).find((mod) => mod.id === id)

export const DEFAULT_LOADED_IDS = ['mathematik-klasse-6']

const packGradeModule = (
  packId: string,
  grade: {
    id: string
    subjectTitle: string
    gradeTitle: string
    description: string
    searchHints?: string[]
  },
  kv: CurriculumKv,
): CurriculumModule => ({
  id: grade.id,
  packId,
  subjectTitle: grade.subjectTitle,
  gradeTitle: grade.gradeTitle,
  description: grade.description,
  searchHints: grade.searchHints,
  load: () => loadInstalledGrade(grade.id, kv),
})

export function listVisibleGradeModules(
  kv: CurriculumKv = defaultCurriculumKv(),
): CurriculumModule[] {
  const installed = new Set(listInstalledMeta(kv).map((row) => row.id))
  if (installed.size === 0) return []
  const out: CurriculumModule[] = []
  const seen = new Set<string>()
  if (installed.has(GYM_SACHSEN_PACK_ID)) {
    for (const mod of bundledCurricula) {
      if (seen.has(mod.id)) continue
      seen.add(mod.id)
      out.push(mod)
    }
  }
  for (const pack of listInstalledPacks(kv)) {
    if (pack.id === GYM_SACHSEN_PACK_ID) continue
    for (const grade of pack.official) {
      if (seen.has(grade.id)) continue
      seen.add(grade.id)
      out.push(packGradeModule(pack.id, grade, kv))
    }
  }
  return out
}

export function packIdForGradeModule(
  gradeId: string,
  kv: CurriculumKv = defaultCurriculumKv(),
): string {
  const bundled = getBundledModule(gradeId)
  if (bundled) return bundled.packId
  for (const pack of listInstalledPacks(kv)) {
    if (pack.official.some((grade) => grade.id === gradeId)) return pack.id
  }
  return GYM_SACHSEN_PACK_ID
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
  return visible.map((m) => m.id).filter((id) => stored!.includes(id) && allowed.has(id))
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
  return (
    listInstalledPacks(kv).length > 0 ||
    isPackInstalled(GYM_SACHSEN_PACK_ID, kv) ||
    isPackInstalled(OS_HS_PACK_ID, kv) ||
    isPackInstalled(OS_RS_PACK_ID, kv)
  )
}
