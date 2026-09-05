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
  ALL_FILTER,
  defaultRegionFilter,
  filterPacks,
  gradeSectionHeading,
  packMatchesFilters,
  SCHULFORM_OPTIONS,
  uniqueRegions,
} from '../curriculum/packFilters'
import {
  GYM_SACHSEN_PACK_ID,
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
  listVisibleGradeModules,
  type CurriculumModule,
} from '../curriculum/registry'

interface Props {
  loadedIds: string[]
  onLoad: (id: string) => Promise<void>
  onRemove: (id: string) => void
  onPacksChanged: () => void
  initialRegion?: string
  initialSchulform?: string
}

const FALLBACK_CATALOG: ManifestPack[] = [
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

export function CurriculumSetup({
  loadedIds,
  onLoad,
  onRemove,
  onPacksChanged,
  initialRegion,
  initialSchulform,
}: Props) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [remote, setRemote] = useState<ManifestPack[]>([])
  const [rev, setRev] = useState(0)
  const [region, setRegion] = useState<string | undefined>(initialRegion)
  const [schulform, setSchulform] = useState(initialSchulform ?? ALL_FILTER)

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

  const catalog: ManifestPack[] = remote.length > 0 ? remote : FALLBACK_CATALOG
  const activeRegion = region ?? defaultRegionFilter(catalog)
  const visibleCatalog = filterPacks(catalog, activeRegion, schulform)
  const regions = uniqueRegions(catalog)

  const gradesByPack = new Map<string, CurriculumModule[]>()
  for (const mod of visibleGrades) {
    const list = gradesByPack.get(mod.packId) ?? []
    list.push(mod)
    gradesByPack.set(mod.packId, list)
  }

  const gradeSections: { id: string; title: string; grades: CurriculumModule[] }[] = []
  const seenPacks = new Set<string>()
  const packTitle = (id: string): string =>
    catalog.find((entry) => entry.id === id)?.title ??
    installedPacks.find((pack) => pack.id === id)?.title ??
    id

  for (const entry of catalog) {
    const grades = gradesByPack.get(entry.id)
    if (!grades?.length) continue
    if (!packMatchesFilters(entry, activeRegion, schulform)) continue
    seenPacks.add(entry.id)
    gradeSections.push({ id: entry.id, title: entry.title, grades })
  }
  for (const [packId, grades] of gradesByPack) {
    if (seenPacks.has(packId) || grades.length === 0) continue
    const pack = installedPacks.find((item) => item.id === packId)
    const meta = pack ?? catalog.find((entry) => entry.id === packId)
    if (meta && !packMatchesFilters(meta, activeRegion, schulform)) continue
    gradeSections.push({ id: packId, title: packTitle(packId), grades })
  }

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

      <div className="curriculum-filters" role="group" aria-label="Lehrpläne filtern">
        <div className="field">
          <label className="field__label" htmlFor="curriculum-filter-region">
            Bundesland
          </label>
          <select
            id="curriculum-filter-region"
            className="answer-input__field"
            value={activeRegion}
            onChange={(event) => setRegion(event.target.value)}
          >
            <option value={ALL_FILTER}>Alle</option>
            {regions.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="curriculum-filter-schulform">
            Schulform
          </label>
          <select
            id="curriculum-filter-schulform"
            className="answer-input__field"
            value={schulform}
            onChange={(event) => setSchulform(event.target.value)}
          >
            <option value={ALL_FILTER}>Alle</option>
            {SCHULFORM_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visibleCatalog.length === 0 ? (
        <p className="muted small">Kein Lehrplan passt zu Bundesland und Schulform.</p>
      ) : (
        <ul className="curriculum-list">
          {visibleCatalog.map((entry) => {
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
      )}

      {gradeSections.map((section) => (
        <div key={section.id} className="curriculum-grade-group">
          <h3 className="class-codes__list-title">{gradeSectionHeading(section.title)}</h3>
          <ul className="curriculum-list">
            {section.grades.map((mod) => {
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
        </div>
      ))}
    </section>
  )
}
