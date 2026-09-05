import { getBundledModule } from './bundled'
import { hydratePackGrades } from './hydrate'
import { defaultCurriculumKv, listInstalledPacks, type CurriculumKv } from './install'
import type { Grade } from './types'

const cache = new Map<string, Promise<Grade>>()

export function clearGradeCache(): void {
  cache.clear()
}

export async function loadInstalledGrade(
  moduleId: string,
  kv: CurriculumKv = defaultCurriculumKv(),
): Promise<Grade> {
  const key = `${moduleId}@${listInstalledPacks(kv)
    .map((pack) => `${pack.id}:${pack.version}`)
    .join(',')}`
  const hit = cache.get(key)
  if (hit) return hit
  const pending = (async () => {
    for (const pack of listInstalledPacks(kv)) {
      if (!pack.official.some((grade) => grade.id === moduleId)) continue
      const found = (await hydratePackGrades(pack)).find((grade) => grade.id === moduleId)
      if (found) return found
    }
    const bundled = getBundledModule(moduleId)
    if (!bundled) throw new Error(`Unbekanntes Modul „${moduleId}“.`)
    return bundled.load()
  })()
  cache.set(key, pending)
  return pending
}
