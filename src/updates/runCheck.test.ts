import { afterEach, describe, expect, it, vi } from 'vitest'
import { LAST_UPDATE_CHECK_KEY } from './constants'
import {
  MANUAL_CHECK_BUILDING,
  MANUAL_CHECK_CHECKING,
  MANUAL_CHECK_CURRENT,
  MANUAL_CHECK_FAILED,
  MANUAL_CHECK_LABEL,
  manualCheckHint,
  probeForUpdate,
  runUpdateCheck,
} from './runCheck'
import { UPDATE_BUILDING_HINT } from './github'
import { readLastUpdateCheckAt } from './schedule'
import type { AppUpdateInfo } from './types'

function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => [...map.keys()][index] ?? null,
    removeItem: (key: string) => {
      map.delete(key)
    },
    setItem: (key: string, value: string) => {
      map.set(key, value)
    },
  }
}

/** 5 Sep 2026 06:00 UTC = 08:00 in Berlin (CEST). */
const SAT_MORNING = Date.UTC(2026, 8, 5, 6, 0, 0)
/** 5 Sep 2026 20:00 UTC = 22:00 in Berlin, same calendar day. */
const SAT_EVENING = Date.UTC(2026, 8, 5, 20, 0, 0)
/** 4 Sep 2026 21:59 UTC = 23:59 in Berlin. */
const FRI_BEFORE_MIDNIGHT = Date.UTC(2026, 8, 4, 21, 59, 0)
/** 4 Sep 2026 22:00 UTC = 00:00 Saturday in Berlin. */
const SAT_MIDNIGHT = Date.UTC(2026, 8, 4, 22, 0, 0)

const sampleUpdate: AppUpdateInfo = {
  available: true,
  version: '0.1.26',
  title: 'Version 0.1.26',
  notes: 'Neu',
  htmlUrl: 'https://github.com/MatthiasUlrich1/Mathsachs/releases/tag/v0.1.26',
  downloadUrl: 'https://example.com/app.AppImage',
  downloadLabel: 'Mathsachs-0.1.26.AppImage',
  canAutoInstall: false,
}

describe('manualCheckHint', () => {
  it('uses the German idle / checking / current / building / error texts', () => {
    expect(manualCheckHint('idle')).toBeNull()
    expect(manualCheckHint('checking')).toBe(MANUAL_CHECK_CHECKING)
    expect(manualCheckHint('current')).toBe(MANUAL_CHECK_CURRENT)
    expect(manualCheckHint('building')).toBe(MANUAL_CHECK_BUILDING)
    expect(manualCheckHint('building')).toBe(UPDATE_BUILDING_HINT)
    expect(manualCheckHint('error')).toBe(MANUAL_CHECK_FAILED)
    expect(manualCheckHint('error', 'Netzwerk nicht erreichbar.')).toBe(
      'Netzwerk nicht erreichbar.',
    )
    expect(MANUAL_CHECK_LABEL).toBe('Auf Updates prüfen')
    expect(MANUAL_CHECK_CHECKING).toBe('Prüfung …')
    expect(MANUAL_CHECK_CURRENT).toBe('Du hast die aktuelle Version.')
    expect(MANUAL_CHECK_BUILDING).toBe(
      'Da kommt was neues!\nEin Update wird gerade erzeugt.\nBitte in 5 Minuten erneut prüfen.',
    )
  })
})

describe('runUpdateCheck', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('runs a scheduled check on first start (no previous timestamp)', async () => {
    const probe = vi.fn().mockResolvedValue({
      status: 'current',
      currentVersion: '0.1.26',
    })
    const storage = memoryStorage()
    const result = await runUpdateCheck({
      mode: 'scheduled',
      lastCheckAt: null,
      now: SAT_MORNING,
      currentVersion: '0.1.26',
      probe,
      storage,
    })
    expect(probe).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      action: 'checked',
      recorded: true,
      checkedAt: SAT_MORNING,
      probe: { status: 'current', currentVersion: '0.1.26' },
    })
    expect(readLastUpdateCheckAt(storage)).toBe(SAT_MORNING)
  })

  it('runs a scheduled check after Berlin midnight (daily)', async () => {
    const probe = vi.fn().mockResolvedValue({
      status: 'current',
      currentVersion: '0.1.26',
    })
    const storage = memoryStorage()
    storage.setItem(LAST_UPDATE_CHECK_KEY, String(FRI_BEFORE_MIDNIGHT))
    const result = await runUpdateCheck({
      mode: 'scheduled',
      lastCheckAt: FRI_BEFORE_MIDNIGHT,
      now: SAT_MIDNIGHT,
      currentVersion: '0.1.26',
      probe,
      storage,
    })
    expect(probe).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      action: 'checked',
      recorded: true,
      checkedAt: SAT_MIDNIGHT,
    })
    expect(readLastUpdateCheckAt(storage)).toBe(SAT_MIDNIGHT)
  })

  it('skips a scheduled check on the same Berlin day', async () => {
    const probe = vi.fn()
    const storage = memoryStorage()
    const result = await runUpdateCheck({
      mode: 'scheduled',
      lastCheckAt: SAT_MORNING,
      now: SAT_EVENING,
      currentVersion: '0.1.25',
      probe,
      storage,
    })
    expect(result).toEqual({ action: 'skipped' })
    expect(probe).not.toHaveBeenCalled()
    expect(readLastUpdateCheckAt(storage)).toBeNull()
  })

  it('runs a forced check even when already checked the same day', async () => {
    const probe = vi.fn().mockResolvedValue({
      status: 'current',
      currentVersion: '0.1.25',
    })
    const storage = memoryStorage()
    storage.setItem(LAST_UPDATE_CHECK_KEY, String(SAT_MORNING))
    const result = await runUpdateCheck({
      mode: 'forced',
      lastCheckAt: SAT_MORNING,
      now: SAT_EVENING,
      currentVersion: '0.1.25',
      probe,
      storage,
    })
    expect(probe).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      action: 'checked',
      recorded: true,
      checkedAt: SAT_EVENING,
      probe: { status: 'current', currentVersion: '0.1.25' },
    })
    expect(readLastUpdateCheckAt(storage)).toBe(SAT_EVENING)
  })

  it('records the timestamp after a successful update-available check', async () => {
    const probe = vi.fn().mockResolvedValue({
      status: 'update',
      info: sampleUpdate,
      currentVersion: '0.1.25',
    })
    const storage = memoryStorage()
    const result = await runUpdateCheck({
      mode: 'forced',
      lastCheckAt: SAT_MORNING,
      now: SAT_EVENING,
      currentVersion: '0.1.25',
      probe,
      storage,
    })
    expect(result.action).toBe('checked')
    if (result.action === 'checked') {
      expect(result.recorded).toBe(true)
      expect(result.probe.status).toBe('update')
    }
    expect(readLastUpdateCheckAt(storage)).toBe(SAT_EVENING)
  })

  it('does not record the timestamp while an update is still being built', async () => {
    const probe = vi.fn().mockResolvedValue({
      status: 'building',
      message: MANUAL_CHECK_BUILDING,
      currentVersion: '0.1.25',
    })
    const storage = memoryStorage()
    storage.setItem(LAST_UPDATE_CHECK_KEY, String(SAT_MORNING))
    const result = await runUpdateCheck({
      mode: 'forced',
      lastCheckAt: SAT_MORNING,
      now: SAT_EVENING,
      currentVersion: '0.1.25',
      probe,
      storage,
    })
    expect(result).toMatchObject({
      action: 'checked',
      recorded: false,
      probe: { status: 'building' },
    })
    expect(readLastUpdateCheckAt(storage)).toBe(SAT_MORNING)
  })

  it('does not record the timestamp when the forced check fails', async () => {
    const probe = vi.fn().mockResolvedValue({
      status: 'error',
      message: MANUAL_CHECK_FAILED,
      currentVersion: '0.1.25',
    })
    const storage = memoryStorage()
    storage.setItem(LAST_UPDATE_CHECK_KEY, String(SAT_MORNING))
    const result = await runUpdateCheck({
      mode: 'forced',
      lastCheckAt: SAT_MORNING,
      now: SAT_EVENING,
      currentVersion: '0.1.25',
      probe,
      storage,
    })
    expect(result).toMatchObject({
      action: 'checked',
      recorded: false,
      probe: { status: 'error' },
    })
    expect(readLastUpdateCheckAt(storage)).toBe(SAT_MORNING)
  })
})

describe('probeForUpdate', () => {
  it('maps a desktop “no update” result to current', async () => {
    const probe = await probeForUpdate({
      currentVersion: '0.1.25',
      desktop: {
        checkForUpdates: async () => ({ available: false, current: '0.1.25' }),
      },
    })
    expect(probe).toEqual({ status: 'current', currentVersion: '0.1.25' })
  })

  it('maps a desktop update result to the existing banner payload', async () => {
    const probe = await probeForUpdate({
      currentVersion: '0.1.25',
      desktop: {
        checkForUpdates: async () => sampleUpdate,
      },
    })
    expect(probe).toEqual({
      status: 'update',
      info: sampleUpdate,
      currentVersion: '0.1.25',
    })
  })

  it('maps a desktop building result to the pending hint', async () => {
    const probe = await probeForUpdate({
      currentVersion: '0.1.25',
      desktop: {
        checkForUpdates: async () => ({
          available: false,
          building: true,
          current: '0.1.25',
          message: MANUAL_CHECK_BUILDING,
        }),
      },
    })
    expect(probe).toEqual({
      status: 'building',
      message: MANUAL_CHECK_BUILDING,
      currentVersion: '0.1.25',
    })
  })

  it('reports an error when the desktop check throws', async () => {
    const probe = await probeForUpdate({
      currentVersion: '0.1.25',
      desktop: {
        checkForUpdates: async () => {
          throw new Error('offline')
        },
      },
    })
    expect(probe).toEqual({
      status: 'error',
      message: MANUAL_CHECK_FAILED,
      currentVersion: '0.1.25',
    })
  })
})
