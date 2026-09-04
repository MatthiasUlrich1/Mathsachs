import { useCallback, useEffect, useState } from 'react'
import { checkForAppUpdate } from './github'
import {
  dismissUpdateForSession,
  ignoreUpdateVersion,
  isUpdateHidden,
} from './ignore'
import type { AppUpdateInfo, DesktopDownloadResult } from './types'
import { APP_VERSION } from './version'

export type UpdateUiStatus = 'idle' | 'downloading' | 'downloaded' | 'error'

export function useUpdateCheck() {
  const [update, setUpdate] = useState<AppUpdateInfo | null>(null)
  const [status, setStatus] = useState<UpdateUiStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [currentVersion, setCurrentVersion] = useState(APP_VERSION)

  useEffect(() => {
    const desktop = window.mathsachs
    let cancelled = false

    const apply = (info: AppUpdateInfo | null, version = APP_VERSION) => {
      if (cancelled) return
      setCurrentVersion(version)
      if (info && !isUpdateHidden(info.version)) setUpdate(info)
    }

    const run = async () => {
      try {
        if (desktop?.checkForUpdates) {
          const result = await desktop.checkForUpdates()
          const version = result.available
            ? undefined
            : result.current
          const fromDesktop = result.available ? result : null
          apply(fromDesktop, version ?? (await desktop.getVersion?.()) ?? APP_VERSION)
          return
        }
        apply(await checkForAppUpdate({ currentVersion: APP_VERSION }))
      } catch {
        // Offline / rate-limited GitHub: stay quiet.
      }
    }

    void run()

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
      unsubscribe?.()
    }
  }, [])

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
    dismiss,
    ignore,
    download,
    install,
  }
}
