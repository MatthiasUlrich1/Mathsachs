import { useCallback, useEffect, useState } from 'react'
import { msUntilNextBerlinDay, shouldCheckForUpdate } from '../updates/schedule'
import {
  fetchCurriculumManifest,
  fetchCurriculumPack,
  readLastCurriculumCheckAt,
  writeLastCurriculumCheckAt,
  SESSION_DISMISS_CURRICULUM_KEY,
} from './catalog'
import { installBundledGymSachsen, installPack, listInstalledMeta } from './install'
import { packNeedsUpdate, type ManifestPack } from './pack'

export interface CurriculumOffer {
  remote: ManifestPack
  localVersion: string
}

export function useCurriculumCatalog(onInstalled: () => void) {
  const [offer, setOffer] = useState<CurriculumOffer | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const applyOffer = useCallback((packs: ManifestPack[]) => {
    const dismissed =
      typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem(SESSION_DISMISS_CURRICULUM_KEY)
        : null
    const installed = listInstalledMeta()
    const next = packs.find((remote) => {
      const local = installed.find((row) => row.id === remote.id)
      if (!local || dismissed === `${remote.id}:${remote.version}`) return false
      return packNeedsUpdate(local.version, remote.version)
    })
    if (!next) {
      setOffer(null)
      return
    }
    const local = installed.find((row) => row.id === next.id)
    setOffer({ remote: next, localVersion: local?.version ?? '—' })
  }, [])

  const refresh = useCallback(
    async (force: boolean) => {
      const last = readLastCurriculumCheckAt()
      if (!shouldCheckForUpdate(last, Date.now(), { force })) return
      const manifest = await fetchCurriculumManifest()
      writeLastCurriculumCheckAt(Date.now())
      if (manifest) applyOffer(manifest.packs)
    },
    [applyOffer],
  )

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    const tick = async () => {
      if (cancelled) return
      await refresh(false)
      if (cancelled) return
      timer = setTimeout(() => void tick(), msUntilNextBerlinDay())
    }
    void tick()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [refresh])

  const updateOffer = useCallback(async () => {
    if (!offer) return
    setBusy(true)
    setError(null)
    try {
      const downloaded = await fetchCurriculumPack(offer.remote.url)
      if (downloaded) installPack(downloaded)
      else await installBundledGymSachsen()
      setOffer(null)
      onInstalled()
    } catch {
      setError('Der Lehrplan konnte nicht aktualisiert werden. Bitte erneut versuchen.')
    } finally {
      setBusy(false)
    }
  }, [offer, onInstalled])

  const dismiss = useCallback(() => {
    if (!offer) return
    try {
      sessionStorage.setItem(
        SESSION_DISMISS_CURRICULUM_KEY,
        `${offer.remote.id}:${offer.remote.version}`,
      )
    } catch {
      /* ignore */
    }
    setOffer(null)
  }, [offer])

  return { offer, busy, error, refresh, updateOffer, dismiss }
}
