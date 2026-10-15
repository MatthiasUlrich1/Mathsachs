import { getBundledModule } from './bundled'
import { ensureGradeFachwissen } from './fachwissen'
import { hydratePackGrades } from './hydrate'
import { defaultCurriculumKv, listInstalledPacks, type CurriculumKv } from './install'
import { withMathGymThinFill } from './mathGymThinFill'
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
    let grade = await bundled.load()
    if (bundled.subjectTitle === 'Mathematik') {
      grade = {
        ...grade,
        areas: grade.areas.map((area) => ({
          ...area,
          topics: area.topics.map((topic) => ({
            ...topic,
            generate: withMathGymThinFill(topic.id, topic.generate) ?? topic.generate,
          })),
        })),
      }
    }
    return ensureGradeFachwissen(grade, {
      subject: bundled.subjectTitle,
    })
  })()
  cache.set(key, pending)
  return pending
}
