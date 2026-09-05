import {
  CLASS_API_NOT_READY_MESSAGE,
  ClassApiError,
  deleteClass,
  getClass,
  type ClassStats,
} from './api'
import { formatClassCode } from './code'
import {
  forgetCreatedClassCode,
  getClassCodeSettings,
  setActiveClassCode,
  type CreatedClassCode,
} from '../lib/storage'

export type ClassStanding = ClassStats | { error: string }

export type CreatedListApi = {
  getClass: typeof getClass
}

export type CreatedListDeleteApi = {
  deleteClass: typeof deleteClass
}

export type CreatedListStorage = {
  forgetCreatedClassCode: typeof forgetCreatedClassCode
  setActiveClassCode: typeof setActiveClassCode
  getDeletedClassCodes?: () => readonly { code: string }[]
}

const defaultApi: CreatedListApi = { getClass }
const defaultDeleteApi: CreatedListDeleteApi = { deleteClass }
const defaultStorage: CreatedListStorage = {
  forgetCreatedClassCode,
  setActiveClassCode,
  getDeletedClassCodes: () => getClassCodeSettings().deletedCodes ?? [],
}

/** Drop tombstoned codes so a stale created list cannot GET them again. */
export function excludeDeletedCreatedCodes(
  rows: readonly CreatedClassCode[],
  deletedCodes: readonly { code: string }[] | undefined,
): CreatedClassCode[] {
  if (!deletedCodes?.length) return [...rows]
  const dead = new Set(deletedCodes.map((row) => row.code))
  return rows.filter((row) => !dead.has(row.code))
}

/** Pause further created-list GETs after a 429. */
export const RATE_COOLDOWN_MS = 8_000

export const DELETE_STILL_ON_SERVER_NOTICE =
  'Der Code ist aus der Liste. Auf dem Server kann er noch stehen — bitte später erneut versuchen.'

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

export function isRateLimitError(err: unknown): boolean {
  return err instanceof ClassApiError && err.kind === 'rate'
}

/** Stable key for the created-code set — ignores object identity. */
export function createdCodesKey(rows: readonly CreatedClassCode[]): string {
  return rows.map((row) => row.code).join('\n')
}

export type CreatedRefreshReason = 'ok' | 'same-codes' | 'cooldown' | 'empty' | 'in-flight'

export type CreatedRefreshDecision =
  | { fetch: true }
  | { fetch: false; reason: Exclude<CreatedRefreshReason, 'ok'> }

export type CreatedRefreshGate = {
  lastKey: string | null
  cooldownUntil: number
  inFlight: boolean
}

export function emptyCreatedRefreshGate(): CreatedRefreshGate {
  return { lastKey: null, cooldownUntil: 0, inFlight: false }
}

let refreshGate: CreatedRefreshGate = emptyCreatedRefreshGate()

export function resetCreatedListRefreshGateForTests(): void {
  refreshGate = emptyCreatedRefreshGate()
}

export function getCreatedListRefreshGate(): CreatedRefreshGate {
  return refreshGate
}

const codesFromKey = (key: string | null): string[] => (key ? key.split('\n') : [])

export function decideCreatedListRefresh(
  key: string,
  now: number,
  gate: CreatedRefreshGate,
  opts: { force?: boolean } = {},
): CreatedRefreshDecision {
  if (now < gate.cooldownUntil) return { fetch: false, reason: 'cooldown' }
  if (key === '') return { fetch: false, reason: 'empty' }
  if (gate.inFlight && !opts.force) return { fetch: false, reason: 'in-flight' }
  if (opts.force) return { fetch: true }
  if (gate.lastKey === key) return { fetch: false, reason: 'same-codes' }
  if (gate.lastKey !== null) {
    const prev = new Set(codesFromKey(gate.lastKey))
    const added = codesFromKey(key).some((code) => !prev.has(code))
    if (!added) return { fetch: false, reason: 'same-codes' }
  }
  return { fetch: true }
}

/**
 * Claim a refresh slot. False = skip GETs (same list, cooldown, or empty).
 * On cooldown we keep the previous lastKey so a later added code still fetches.
 */
export function takeCreatedListRefresh(
  key: string,
  now: number = Date.now(),
  opts: { force?: boolean } = {},
): boolean {
  const decision = decideCreatedListRefresh(key, now, refreshGate, opts)
  if (!decision.fetch) {
    if (decision.reason !== 'cooldown') {
      refreshGate = { ...refreshGate, lastKey: key }
    }
    return false
  }
  refreshGate = { ...refreshGate, lastKey: key, inFlight: true }
  return true
}

export function completeCreatedListRefresh(
  rateLimited: boolean,
  now: number = Date.now(),
): void {
  refreshGate = {
    ...refreshGate,
    inFlight: false,
    cooldownUntil: rateLimited ? now + RATE_COOLDOWN_MS : refreshGate.cooldownUntil,
  }
}

/** Record the current list without fetching (create/delete already updated local stats). */
export function acknowledgeCreatedListKey(key: string): void {
  refreshGate = { ...refreshGate, lastKey: key }
}

export type LoadCreatedStandingsResult = {
  standings: Record<string, ClassStanding>
  notices: string[]
  rateLimited: boolean
}

/** GET each created code. Confirmed missing codes are forgotten locally. */
export async function loadCreatedClassStandings(
  rows: CreatedClassCode[],
  api: CreatedListApi = defaultApi,
  storage: CreatedListStorage = defaultStorage,
): Promise<LoadCreatedStandingsResult> {
  const live = excludeDeletedCreatedCodes(rows, storage.getDeletedClassCodes?.())
  if (live.length === 0) return { standings: {}, notices: [], rateLimited: false }

  const notices: string[] = []
  const standings: Record<string, ClassStanding> = {}
  // Sequential: one 429 must not fan out into N parallel GETs.
  for (const row of live) {
    try {
      standings[row.code] = await api.getClass(row.code)
    } catch (err) {
      if (isConfirmedMissingClass(err)) {
        storage.forgetCreatedClassCode(row.code)
        notices.push(missingClassCodeNotice(row.code))
        continue
      }
      if (isRateLimitError(err)) {
        return { standings, notices, rateLimited: true }
      }
      standings[row.code] = { error: standingErrorText(err) }
    }
  }
  return { standings, notices, rateLimited: false }
}

export type DeleteCreatedResult =
  | { ok: true; alreadyGone?: true }
  | { ok: false; keptLocal: false; notice: string }

/**
 * Drop the code locally first, then DELETE the Worker.
 * 404 is success. 429/network must not restore the row.
 */
export async function deleteCreatedClassCode(
  code: string,
  api: CreatedListDeleteApi = defaultDeleteApi,
  storage: CreatedListStorage = defaultStorage,
): Promise<DeleteCreatedResult> {
  storage.forgetCreatedClassCode(code)
  try {
    await api.deleteClass(code)
    return { ok: true }
  } catch (err) {
    if (isConfirmedMissingClass(err)) {
      return { ok: true, alreadyGone: true }
    }
    return { ok: false, keptLocal: false, notice: DELETE_STILL_ON_SERVER_NOTICE }
  }
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
