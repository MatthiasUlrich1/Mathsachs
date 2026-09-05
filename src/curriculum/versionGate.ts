import { isNewerVersion } from '../updates/semver'
import { defaultCurriculumKv, getInstalledPack, type CurriculumKv } from './install'
import { GYM_SACHSEN_PACK_ID, type CurriculumRef } from './pack'
import { packIdForGradeModule } from './registry'

export function curriculumUpdatePrompt(title: string, required: string): string {
  return (
    `Diese Inhalte brauchen den Lehrplan „${title}“ in Version ${required} (oder neuer). ` +
    `Bitte aktualisiere den Lehrplan unter Einstellungen → Lehrpläne und versuche es danach erneut.`
  )
}

export type VersionGateResult =
  | { ok: true }
  | { ok: false; reason: 'update' | 'missing-pack'; message: string; packId: string; requiredVersion?: string }

export function checkCurriculumRefs(
  refs: CurriculumRef[] | undefined,
  kv: CurriculumKv = defaultCurriculumKv(),
): VersionGateResult {
  if (!refs || refs.length === 0) return { ok: true }
  for (const ref of refs) {
    const installed = getInstalledPack(ref.moduleId, kv)
    if (!installed) {
      return {
        ok: false,
        reason: 'missing-pack',
        packId: ref.moduleId,
        message: curriculumUpdatePrompt(ref.moduleId, ref.version),
      }
    }
    if (isNewerVersion(ref.version, installed.version)) {
      return {
        ok: false,
        reason: 'update',
        packId: ref.moduleId,
        requiredVersion: ref.version,
        message: curriculumUpdatePrompt(installed.title, ref.version),
      }
    }
  }
  return { ok: true }
}

export function refsForGradeModules(
  moduleIds: string[],
  kv: CurriculumKv = defaultCurriculumKv(),
): CurriculumRef[] {
  const byPack = new Map<string, CurriculumRef>()
  for (const moduleId of moduleIds) {
    const packId = packIdForGradeModule(moduleId)
    if (byPack.has(packId)) continue
    const installed = getInstalledPack(packId, kv)
    byPack.set(packId, {
      moduleId: packId,
      version: installed?.version ?? '1.0.0',
      ...(installed?.contentHash ? { contentHash: installed.contentHash } : {}),
    })
  }
  return [...byPack.values()]
}

export function defaultGymSachsenRef(version = '1.0.0'): CurriculumRef {
  return { moduleId: GYM_SACHSEN_PACK_ID, version }
}
