import {
  probeAppUpdate,
  UPDATE_BUILDING_HINT,
  UPDATE_CHECK_FAILED,
  type AppUpdateProbe,
} from './github'
import {
  shouldCheckForUpdate,
  writeLastUpdateCheckAt,
} from './schedule'
import { isUpdateBuildingResult, type UpdateCheckResult } from './types'

export type ManualCheckStatus =
  | 'idle'
  | 'checking'
  | 'current'
  | 'building'
  | 'error'
export type UpdateCheckMode = 'scheduled' | 'forced'

export const MANUAL_CHECK_CHECKING = 'Prüfung …'
export const MANUAL_CHECK_CURRENT = 'Du hast die aktuelle Version.'
export const MANUAL_CHECK_FAILED = UPDATE_CHECK_FAILED
export const MANUAL_CHECK_BUILDING = UPDATE_BUILDING_HINT
export const MANUAL_CHECK_LABEL = 'Auf Updates prüfen'

export type ResolvedUpdateProbe = AppUpdateProbe & { currentVersion: string }

export type DesktopUpdateBridge = {
  checkForUpdates: () => Promise<UpdateCheckResult>
  getVersion?: () => Promise<string>
}

export function manualCheckHint(
  status: ManualCheckStatus,
  error?: string | null,
): string | null {
  if (status === 'checking') return MANUAL_CHECK_CHECKING
  if (status === 'current') return MANUAL_CHECK_CURRENT
  if (status === 'building') return MANUAL_CHECK_BUILDING
  if (status === 'error') return error?.trim() || MANUAL_CHECK_FAILED
  return null
}

export async function probeForUpdate(options: {
  currentVersion: string
  desktop?: DesktopUpdateBridge | null
  fetchImpl?: typeof fetch
}): Promise<ResolvedUpdateProbe> {
  const currentVersion = options.currentVersion
  if (options.desktop?.checkForUpdates) {
    try {
      const result = await options.desktop.checkForUpdates()
      if (result.available) {
        return { status: 'update', info: result, currentVersion }
      }
      if (isUpdateBuildingResult(result)) {
        return {
          status: 'building',
          message: result.message || MANUAL_CHECK_BUILDING,
          currentVersion: result.current || currentVersion,
        }
      }
      return {
        status: 'current',
        currentVersion: result.current || currentVersion,
      }
    } catch {
      return {
        status: 'error',
        message: MANUAL_CHECK_FAILED,
        currentVersion,
      }
    }
  }
  const probe = await probeAppUpdate({
    currentVersion,
    fetchImpl: options.fetchImpl,
  })
  return { ...probe, currentVersion }
}

export type RunUpdateCheckResult =
  | { action: 'skipped' }
  | {
      action: 'checked'
      probe: ResolvedUpdateProbe
      checkedAt: number
      recorded: boolean
    }

export async function runUpdateCheck(options: {
  mode: UpdateCheckMode
  lastCheckAt: number | null
  now: number
  currentVersion: string
  desktop?: DesktopUpdateBridge | null
  fetchImpl?: typeof fetch
  probe?: () => Promise<ResolvedUpdateProbe>
  storage?: Storage | null
}): Promise<RunUpdateCheckResult> {
  const force = options.mode === 'forced'
  if (!shouldCheckForUpdate(options.lastCheckAt, options.now, { force })) {
    return { action: 'skipped' }
  }
  const probe = options.probe
    ? await options.probe()
    : await probeForUpdate({
        currentVersion: options.currentVersion,
        desktop: options.desktop,
        fetchImpl: options.fetchImpl,
      })
  const recorded = probe.status === 'update' || probe.status === 'current'
  if (recorded) writeLastUpdateCheckAt(options.now, options.storage)
  return {
    action: 'checked',
    probe,
    checkedAt: options.now,
    recorded,
  }
}
