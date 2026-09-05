import { useCallback, useEffect, useState } from 'react'
import { isUpdateHidden, dismissUpdateForSession, ignoreUpdateVersion } from './ignore'
import {
  msUntilNextBerlinDay,
  readLastUpdateCheckAt,
} from './schedule'
import type { AppUpdateInfo, DesktopDownloadResult } from './types'
import {
  MANUAL_CHECK_FAILED,
  runUpdateCheck,
  type ManualCheckStatus,
  type ResolvedUpdateProbe,
} from './runCheck'
import { APP_VERSION } from './version'

export type UpdateUiStatus = 'idle' | 'downloading' | 'downloaded' | 'error'
export type { ManualCheckStatus }

export function useUpdateCheck() {
  const [update, setUpdate] = useState<AppUpdateInfo | null>(null)
  const [status, setStatus] = useState<UpdateUiStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentVersion, setCurrentVersion] = useState(APP_VERSION)
  const [manualStatus, setManualStatus] = useState<ManualCheckStatus>('idle')
  const [manualError, setManualError] = useState<string | null>(null)

  const applyProbe = useCallback(
    (probe: ResolvedUpdateProbe, hideIfIgnored: boolean) => {
      setCurrentVersion(probe.currentVersion)
      if (probe.status === 'update') {
        if (!hideIfIgnored || !isUpdateHidden(probe.info.version)) {
          setUpdate(probe.info)
        }
        return
      }
      if (probe.status === 'current') setUpdate(null)
    },
    [],
  )

  useEffect(() => {
    const desktop = window.mathsachs
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    const scheduleNextDay = () => {
      if (cancelled) return
      timer = setTimeout(() => {
        void tick()
      }, msUntilNextBerlinDay())
    }

    const tick = async () => {
      if (cancelled) return
      const result = await runUpdateCheck({
        mode: 'scheduled',
        lastCheckAt: readLastUpdateCheckAt(),
        now: Date.now(),
        currentVersion: APP_VERSION,
        desktop: desktop?.checkForUpdates ? desktop : null,
      })
      if (cancelled) return
      if (result.action === 'checked' && result.probe.status !== 'error') {
        applyProbe(result.probe, true)
      }
      scheduleNextDay()
    }

    void tick()

    const unsubscribe = desktop?.onUpdateEvent?.((event) => {
      if (event.type === 'progress') {
        setStatus('downloading')
        setProgress(Math.max(0, Math.min(100, event.percent)))
      } else if (event.type === 'downloaded') {
        setStatus('downloaded')
        setProgress(100)
      } else if (event.type === 'error') {
        setStatus('error')
        setError(event.message)
      }
    })

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      unsubscribe?.()
    }
  }, [applyProbe])

  const checkNow = useCallback(async () => {
    setManualStatus('checking')
    setManualError(null)
    try {
      const desktop = window.mathsachs
      const result = await runUpdateCheck({
        mode: 'forced',
        lastCheckAt: readLastUpdateCheckAt(),
        now: Date.now(),
        currentVersion: APP_VERSION,
        desktop: desktop?.checkForUpdates ? desktop : null,
      })
      if (result.action === 'skipped') {
        setManualStatus('idle')
        return
      }
      if (result.probe.status === 'update') {
        applyProbe(result.probe, false)
        setManualStatus('idle')
        return
      }
      if (result.probe.status === 'current') {
        applyProbe(result.probe, false)
        setManualStatus('current')
        return
      }
      setManualStatus('error')
      setManualError(result.probe.message)
    } catch {
      setManualStatus('error')
      setManualError(MANUAL_CHECK_FAILED)
    }
  }, [applyProbe])

  const dismiss = useCallback(() => {
    if (!update) return
    dismissUpdateForSession(update.version)
    setUpdate(null)
  }, [update])

  const ignore = useCallback(() => {
    if (!update) return
    ignoreUpdateVersion(update.version)
    setUpdate(null)
  }, [update])

  const download = useCallback(async () => {
    if (!update) return
    const desktop = window.mathsachs
    setError(null)
    if (desktop && update.canAutoInstall) {
      setStatus('downloading')
      const result: DesktopDownloadResult = await desktop.downloadUpdate()
      if (result.ok && result.mode === 'auto') return
      setStatus('idle')
    }
    const url = update.downloadUrl || update.htmlUrl
    if (desktop?.openExternal) {
      await desktop.openExternal(url)
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }, [update])

  const install = useCallback(async () => {
    const desktop = window.mathsachs
    if (!desktop?.installUpdate) return
    await desktop.installUpdate()
  }, [])

  return {
    update,
    status,
    progress,
    error,
    currentVersion,
    manualStatus,
    manualError,
    checkNow,
    dismiss,
    ignore,
    download,
    install,
  }
}
