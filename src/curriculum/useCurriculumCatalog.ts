import { useCallback, useEffect, useState } from 'react'
import { APP_VERSION } from '../updates/version'
import { msUntilNextBerlinDay, shouldCheckForUpdate } from '../updates/schedule'
import {
  fetchCurriculumManifest,
  fetchCurriculumPack,
  readLastCurriculumCheckAt,
  writeLastCurriculumCheckAt,
  SESSION_DISMISS_CURRICULUM_KEY,
} from './catalog'
import {
  bundledPackById,
  installPack,
  listInstalledMeta,
  type CurriculumKv,
  defaultCurriculumKv,
} from './install'
import { packNeedsUpdate, type ManifestPack } from './pack'

export const LAST_SEEN_APP_VERSION_KEY = 'mathsachs.lastSeenAppVersion.v1'

export interface CurriculumOffer {
  remote: ManifestPack
  localVersion: string
}

/** True when the running app version differs from the last launch (first run → false). */
export function detectAppVersionChange(
  currentVersion: string = APP_VERSION,
  kv: CurriculumKv = defaultCurriculumKv(),
): boolean {
  const prev = kv.getItem(LAST_SEEN_APP_VERSION_KEY)
  kv.setItem(LAST_SEEN_APP_VERSION_KEY, currentVersion)
  return prev !== null && prev !== currentVersion
}

async function autoUpdateInstalledPacks(
  remotes: ManifestPack[],
): Promise<{ updated: boolean; remaining: ManifestPack[] }> {
  const installed = listInstalledMeta()
  const remaining: ManifestPack[] = []
  let updated = false
  for (const remote of remotes) {
    const local = installed.find((row) => row.id === remote.id)
    if (!local || !packNeedsUpdate(local.version, remote.version)) continue
    const downloaded = await fetchCurriculumPack(remote.url)
    if (downloaded) {
      installPack(downloaded)
      updated = true
      continue
    }
    const bundled = await bundledPackById(remote.id)
    if (bundled && packNeedsUpdate(local.version, bundled.version)) {
      installPack(bundled)
      updated = true
      continue
    }
    remaining.push(remote)
  }
  return { updated, remaining }
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
      if (!manifest) return
      const { updated, remaining } = await autoUpdateInstalledPacks(manifest.packs)
      if (updated) onInstalled()
      applyOffer(remaining)
    },
    [applyOffer, onInstalled],
  )

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    let forceOnce = detectAppVersionChange()
    const tick = async () => {
      if (cancelled) return
      await refresh(forceOnce)
      forceOnce = false
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
      else {
        const bundled = await bundledPackById(offer.remote.id)
        if (bundled) installPack(bundled)
        else throw new Error('pack unavailable')
      }
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
