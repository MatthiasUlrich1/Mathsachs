import { useEffect, useState } from 'react'
import { fetchCurriculumManifest, fetchCurriculumPack } from '../curriculum/catalog'
import {
  bundledPackById,
  installPack,
  listInstalledMeta,
  listInstalledPacks,
  removePack,
} from '../curriculum/install'
import { packNeedsUpdate, type ManifestPack } from '../curriculum/pack'
import {
  GYM_SACHSEN_PACK_ID,
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
  listVisibleGradeModules,
} from '../curriculum/registry'

interface Props {
  loadedIds: string[]
  onLoad: (id: string) => Promise<void>
  onRemove: (id: string) => void
  onPacksChanged: () => void
}

export function CurriculumSetup({ loadedIds, onLoad, onRemove, onPacksChanged }: Props) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [remote, setRemote] = useState<ManifestPack[]>([])
  const [rev, setRev] = useState(0)

  useEffect(() => {
    let cancelled = false
    void fetchCurriculumManifest().then((manifest) => {
      if (!cancelled && manifest) setRemote(manifest.packs)
    })
    return () => {
      cancelled = true
    }
  }, [rev])

  const installed = listInstalledMeta()
  const installedPacks = listInstalledPacks()
  const visibleGrades = listVisibleGradeModules()

  const run = async (id: string, action: () => Promise<void>) => {
    setBusyId(id)
    setError(null)
    try {
      await action()
      setRev((n) => n + 1)
      onPacksChanged()
    } catch {
      setError('Der Lehrplan konnte nicht geladen werden. Bitte erneut versuchen.')
    } finally {
      setBusyId(null)
    }
  }

  const catalog: ManifestPack[] =
    remote.length > 0
      ? remote
      : [
          {
            id: GYM_SACHSEN_PACK_ID,
            title: 'Gymnasium Sachsen · Mathematik',
            region: 'Sachsen',
            school: 'Gymnasium',
            subject: 'Mathematik',
            version: '1.0.0',
            url: '',
            changelog: 'Mitgeliefert: Klassen 5–12 GK. Ohne Netz wird die lokale Fassung installiert.',
          },
          {
            id: OS_HS_PACK_ID,
            title: 'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang',
            region: 'Sachsen',
            school: 'Oberschule',
            subject: 'Mathematik',
            version: '1.0.0',
            url: '',
            changelog: 'Mitgeliefert: Klassen 5–9. Ohne Netz wird die lokale Fassung installiert.',
          },
          {
            id: OS_RS_PACK_ID,
            title: 'Oberschule Sachsen · Mathematik · Realschulbildungsgang',
            region: 'Sachsen',
            school: 'Oberschule',
            subject: 'Mathematik',
            version: '1.0.0',
            url: '',
            changelog: 'Mitgeliefert: Klassen 5–10. Ohne Netz wird die lokale Fassung installiert.',
          },
        ]

  return (
    <section className="card">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">Lehrpläne</h2>
          <p className="muted small">
            Lehrpläne sind eigene, versionierte Pakete. Installierte Dateien liegen auf
            diesem Rechner — nicht im App-Installer — und gelten im WLAN für Tablets mit.
          </p>
        </div>
      </div>

      {installed.length === 0 && (
        <p className="notice notice--warn">
          Es ist noch kein Lehrplan installiert. Installiere zuerst
          „Gymnasium Sachsen · Mathematik“ oder einen Oberschule-Lehrplan
          (Hauptschul- oder Realschulbildungsgang), um Themen, Klausur und
          Challenge nutzen zu können.
        </p>
      )}
      {error && <p className="notice notice--error">{error}</p>}

      <ul className="curriculum-list">
        {catalog.map((entry) => {
          const local = installed.find((row) => row.id === entry.id)
          const pack = installedPacks.find((item) => item.id === entry.id)
          const busy = busyId === entry.id
          const canUpdate = Boolean(local && packNeedsUpdate(local.version, entry.version))
          return (
            <li key={entry.id} className="curriculum-card">
              <div className="curriculum-card__head">
                <div>
                  <h3 className="curriculum-card__title">{entry.title}</h3>
                  <p className="muted small">
                    {entry.region} · {entry.school} · {entry.subject}
                    {entry.changelog ? ` — ${entry.changelog}` : ''}
                  </p>
                  <p className="muted small">
                    {local ? `Installiert: Version ${local.version}` : 'Nicht installiert'}
                    {canUpdate ? ` · Online: Version ${entry.version}` : ''}
                  </p>
                </div>
                {local ? (
                  <span className="badge badge--ok">{canUpdate ? 'Update verfügbar' : 'Installiert ✓'}</span>
                ) : (
                  <span className="badge">Nicht installiert</span>
                )}
              </div>
              <div className="curriculum-card__actions">
                {local ? (
                  <>
                    {canUpdate && (
                      <button
                        type="button"
                        className="primary"
                        disabled={busy}
                        onClick={() =>
                          void run(entry.id, async () => {
                            const downloaded = entry.url ? await fetchCurriculumPack(entry.url) : null
                            const fallback = downloaded ?? (await bundledPackById(entry.id))
                            if (!fallback) throw new Error('Lehrplan nicht verfügbar.')
                            installPack(fallback)
                          })
                        }
                      >
                        {busy ? 'Wird aktualisiert …' : 'Aktualisieren'}
                      </button>
                    )}
                    <button type="button" className="ghost" onClick={() => void run(entry.id, async () => removePack(entry.id))}>
                      Entfernen
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="primary"
                    disabled={busy}
                    onClick={() =>
                      void run(entry.id, async () => {
                        const downloaded = entry.url ? await fetchCurriculumPack(entry.url) : null
                        const fallback = downloaded ?? (await bundledPackById(entry.id))
                        if (!fallback) throw new Error('Lehrplan nicht verfügbar.')
                        installPack(fallback)
                      })
                    }
                  >
                    {busy ? 'Wird installiert …' : 'Installieren'}
                  </button>
                )}
              </div>
              {pack && (
                <p className="muted small curriculum-card__meta">
                  {pack.official.length} Klassenstufen · {pack.extras.length} Lehrer-Ergänzungen
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {visibleGrades.length > 0 && (
        <>
          <h3 className="class-codes__list-title">Klassenstufen im installierten Lehrplan</h3>
          <ul className="curriculum-list">
            {visibleGrades.map((mod) => {
              const isLoaded = loadedIds.includes(mod.id)
              const busy = busyId === mod.id
              return (
                <li key={mod.id} className="curriculum-card">
                  <div className="curriculum-card__head">
                    <div>
                      <h3 className="curriculum-card__title">
                        {mod.subjectTitle} · {mod.gradeTitle}
                      </h3>
                      <p className="muted small">{mod.description}</p>
                    </div>
                    {isLoaded ? <span className="badge badge--ok">Geladen ✓</span> : <span className="badge">Nicht geladen</span>}
                  </div>
                  <div className="curriculum-card__actions">
                    {isLoaded ? (
                      <button type="button" className="ghost" onClick={() => onRemove(mod.id)}>
                        Ausblenden
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="primary"
                        disabled={busy}
                        onClick={() => void run(mod.id, () => onLoad(mod.id))}
                      >
                        {busy ? 'Wird geladen …' : 'Einblenden'}
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}
