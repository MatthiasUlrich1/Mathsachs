import {
  CLASS_API_NOT_READY_MESSAGE,
  ClassApiError,
  getClass,
  type ClassStats,
} from './api'
import { formatClassCode } from './code'
import {
  forgetCreatedClassCode,
  setActiveClassCode,
  type CreatedClassCode,
} from '../lib/storage'

export type ClassStanding = ClassStats | { error: string }

export type CreatedListApi = {
  getClass: typeof getClass
}

export type CreatedListStorage = {
  forgetCreatedClassCode: typeof forgetCreatedClassCode
  setActiveClassCode: typeof setActiveClassCode
}

const defaultApi: CreatedListApi = { getClass }
const defaultStorage: CreatedListStorage = {
  forgetCreatedClassCode,
  setActiveClassCode,
}

/** Only a confirmed Worker 404 / `not_found` — never network, rate, or not_ready. */
export function isConfirmedMissingClass(err: unknown): boolean {
  return err instanceof ClassApiError && err.kind === 'not_found'
}

export function missingClassCodeNotice(code: string): string {
  return `Der Code ${formatClassCode(code)} existiert nicht mehr und wurde aus der Liste entfernt.`
}

export function standingErrorText(err: unknown): string {
  if (err instanceof ClassApiError) return err.message
  return CLASS_API_NOT_READY_MESSAGE
}

export type LoadCreatedStandingsResult = {
  standings: Record<string, ClassStanding>
  notices: string[]
}

/** GET each created code. Confirmed missing codes are forgotten locally. */
export async function loadCreatedClassStandings(
  rows: CreatedClassCode[],
  api: CreatedListApi = defaultApi,
  storage: CreatedListStorage = defaultStorage,
): Promise<LoadCreatedStandingsResult> {
  if (rows.length === 0) return { standings: {}, notices: [] }

  const notices: string[] = []
  const standings: Record<string, ClassStanding> = {}
  await Promise.all(
    rows.map(async (row) => {
      try {
        standings[row.code] = await api.getClass(row.code)
      } catch (err) {
        if (isConfirmedMissingClass(err)) {
          storage.forgetCreatedClassCode(row.code)
          notices.push(missingClassCodeNotice(row.code))
          return
        }
        standings[row.code] = { error: standingErrorText(err) }
      }
    }),
  )
  return { standings, notices }
}

export type ActivateCreatedResult =
  | { ok: true; stats: ClassStats }
  | { ok: false; pruned: true; notice: string }
  | { ok: false; pruned: false; error: string }

/**
 * Activate a created-list row only after GET succeeds.
 * A confirmed missing code is removed; Aktivieren must not leave it behind.
 */
export async function activateCreatedClassCode(
  code: string,
  api: CreatedListApi = defaultApi,
  storage: CreatedListStorage = defaultStorage,
): Promise<ActivateCreatedResult> {
  try {
    const stats = await api.getClass(code)
    storage.setActiveClassCode(stats.code)
    return { ok: true, stats }
  } catch (err) {
    if (isConfirmedMissingClass(err)) {
      storage.forgetCreatedClassCode(code)
      return { ok: false, pruned: true, notice: missingClassCodeNotice(code) }
    }
    return { ok: false, pruned: false, error: standingErrorText(err) }
  }
}
