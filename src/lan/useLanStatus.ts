import { useEffect, useState } from 'react'
import type { LanServerStatus } from '../updates/types'

export function useLanStatus(): LanServerStatus | null {
  const [status, setStatus] = useState<LanServerStatus | null>(null)

  useEffect(() => {
    const desktop = window.mathsachs
    if (!desktop?.getLanStatus) return
    let cancelled = false
    void desktop.getLanStatus().then((next) => {
      if (!cancelled) setStatus(next)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return status
}

/** Preferred origin of the desktop LAN server (WLAN URL only). */
export function primaryLanOrigin(status: LanServerStatus | null): string | undefined {
  if (!status?.running) return undefined
  return status.lanUrls[0]
}
