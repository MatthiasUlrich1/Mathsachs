import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import {
  CLASS_API_NOT_READY_MESSAGE,
  CLASS_API_RATE_MESSAGE,
  checkClassApiHealth,
  createClass,
  getClass,
  getGrade,
  isGradeNotClassError,
  type ClassStats,
  type GradeSummary,
} from '../classCode/api'
import { GRADE_NOT_CLASS_MESSAGE } from '../classCode/gradeUi'
import { GradeCompetition } from './GradeCompetition'
import { GradeCodes } from './GradeCodes'
import {
  activateCreatedClassCode,
  acknowledgeCreatedListKey,
  completeCreatedListRefresh,
  createdCodesKey,
  deleteCreatedClassCode,
  excludeDeletedCreatedCodes,
  getCreatedListRefreshGate,
  isConfirmedMissingClass,
  loadCreatedClassStandings,
  missingClassCodeNotice,
  standingErrorText,
  takeCreatedListRefresh,
} from '../classCode/createdList'
import { formatClassCode, isValidClassCode, normalizeClassCode } from '../classCode/code'
import {
  canUseWebShare,
  classCodeMailtoUrl,
  classCodeShareSubject,
  classCodeShareText,
  classCodeWhatsAppUrl,
  openClassCodeShareUrl,
} from '../classCode/share'
import {
  forgetCreatedClassCode,
  getClassCodeSettings,
  rememberCreatedClassCode,
  setActiveClassCode,
  setSendClassPoints,
  subscribeSharedStorage,
  type CreatedClassCode,
} from '../lib/storage'

const PRIVACY_COPY =
  'Online speichert Mathsachs nur den Klassennamen und die Summe der Punkte — keine Vornamen und keine Geräte-IDs. Wer den Code kennt, kann die Stände sehen und Punkte hinzufügen. Behandle den Code wie ein Passwort.'

export function ClassCodes({
  user,
  canCreateCodes = true,
  canManageGrades = false,
}: {
  user: string
  canCreateCodes?: boolean
  canManageGrades?: boolean
}) {
  const [className, setClassName] = useState('')
  const [enterCode, setEnterCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [activating, setActivating] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedCreated, setCopiedCreated] = useState<string | null>(null)
  const [webShare, setWebShare] = useState(false)
  const [settings, setSettings] = useState(() => getClassCodeSettings(user))
  const [standings, setStandings] = useState<Record<string, ClassStats | { error: string }>>({})
  const [linkedGrade, setLinkedGrade] = useState<GradeSummary | null>(null)

  useEffect(() => {
    const refresh = () => setSettings(getClassCodeSettings(user))
    refresh()
    return subscribeSharedStorage(refresh)
  }, [user])

  useEffect(() => {
    setWebShare(canUseWebShare())
  }, [])

  const refreshStandings = useCallback(
    async (rows: CreatedClassCode[], opts: { force?: boolean } = {}) => {
      const live = excludeDeletedCreatedCodes(rows, getClassCodeSettings(user).deletedCodes)
      const key = createdCodesKey(live)
      if (live.length === 0) {
        setStandings({})
        takeCreatedListRefresh(key)
        return
      }
      if (!takeCreatedListRefresh(key, Date.now(), opts)) {
        if (opts.force && getCreatedListRefreshGate().cooldownUntil > Date.now()) {
          setFormError(CLASS_API_RATE_MESSAGE)
        }
        return
      }
      setRefreshing(true)
      try {
        const { standings: next, notices, rateLimited } = await loadCreatedClassStandings(live)
        setStandings((prev) => {
          const merged: Record<string, ClassStats | { error: string }> = { ...prev }
          for (const [code, value] of Object.entries(next)) merged[code] = value
          for (const code of Object.keys(merged)) {
            if (!live.some((row) => row.code === code)) delete merged[code]
          }
          return merged
        })
        if (rateLimited) setFormError(CLASS_API_RATE_MESSAGE)
        else if (notices.length > 0) setFormError(notices.join(' '))
        completeCreatedListRefresh(rateLimited)
      } catch (err) {
        completeCreatedListRefresh(false)
        setFormError(standingErrorText(err))
      } finally {
        setRefreshing(false)
      }
    },
    [user],
  )

  useEffect(() => {
    let cancelled = false
    void checkClassApiHealth()
      .then((health) => {
        if (cancelled) return
        if (!health.hasClasses) {
          setServerError(CLASS_API_NOT_READY_MESSAGE)
          return
        }
        setServerError(null)
      })
      .catch((err: unknown) => {
        if (!cancelled) setServerError(standingErrorText(err))
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const code = settings.activeCode
    if (!code) {
      setLinkedGrade(null)
      return
    }
    void getClass(code)
      .then((stats) => {
        if (!cancelled) setLinkedGrade(stats.grade ?? null)
      })
      .catch(() => {
        if (!cancelled) setLinkedGrade(null)
      })
    return () => {
      cancelled = true
    }
  }, [settings.activeCode])

  const createdKey = createdCodesKey(
    excludeDeletedCreatedCodes(settings.created, settings.deletedCodes),
  )

  useEffect(() => {
    if (!canCreateCodes) return
    const handle = window.setTimeout(() => {
      const latest = getClassCodeSettings(user)
      void refreshStandings(
        excludeDeletedCreatedCodes(latest.created, latest.deletedCodes),
      )
    }, 80)
    return () => window.clearTimeout(handle)
  }, [canCreateCodes, createdKey, refreshStandings, user])

  const createdCode = settings.activeCode
    ? settings.created.find((row) => row.code === settings.activeCode)
    : null

  const onCreate = async () => {
    if (!canCreateCodes) return
    const name = className.trim()
    if (!name) {
      setFormError('Bitte einen Klassennamen eingeben.')
      return
    }
    setCreating(true)
    setFormError(null)
    try {
      const stats = await createClass(name)
      rememberCreatedClassCode(stats.code, stats.name)
      acknowledgeCreatedListKey(createdCodesKey(getClassCodeSettings().created))
      setClassName('')
      setServerError(null)
      setStandings((prev) => ({ ...prev, [stats.code]: stats }))
    } catch (err) {
      setFormError(standingErrorText(err))
    } finally {
      setCreating(false)
    }
  }

  const onEnter = async () => {
    const code = normalizeClassCode(enterCode)
    if (!isValidClassCode(code)) {
      setFormError('Bitte einen gültigen Klassencode eingeben (8 Zeichen).')
      return
    }
    setJoining(true)
    setFormError(null)
    try {
      const stats = await getClass(code)
      setActiveClassCode(stats.code)
      setLinkedGrade(stats.grade ?? null)
      setEnterCode('')
      setServerError(null)
    } catch (err) {
      if (isGradeNotClassError(err)) {
        setFormError(GRADE_NOT_CLASS_MESSAGE)
        return
      }
      if (isConfirmedMissingClass(err) && settings.created.some((row) => row.code === code)) {
        forgetCreatedClassCode(code)
        setFormError(missingClassCodeNotice(code))
        return
      }
      try {
        await getGrade(code)
        setFormError(GRADE_NOT_CLASS_MESSAGE)
        return
      } catch {
        /* not a readable Stufencode */
      }
      setFormError(standingErrorText(err))
    } finally {
      setJoining(false)
    }
  }

  const onActivateCreated = async (code: string) => {
    setActivating(code)
    setFormError(null)
    const result = await activateCreatedClassCode(code)
    if (result.ok) {
      setServerError(null)
      setStandings((prev) => ({ ...prev, [result.stats.code]: result.stats }))
    } else if (result.pruned) {
      setFormError(result.notice)
      setStandings((prev) => {
        const next = { ...prev }
        delete next[code]
        return next
      })
    } else {
      setFormError(result.error)
    }
    setActivating(null)
  }

  const onDelete = async (row: CreatedClassCode) => {
    if (!canCreateCodes) return
    const label = row.name ? `„${row.name}“ (${formatClassCode(row.code)})` : formatClassCode(row.code)
    const ok = window.confirm(
      `Klassencode ${label} wirklich löschen? Die Klassensummen online werden damit gelöscht. Das kann nicht rückgängig gemacht werden.`,
    )
    if (!ok) return
    setDeleting(row.code)
    setFormError(null)
    setStandings((prev) => {
      const next = { ...prev }
      delete next[row.code]
      return next
    })
    const result = await deleteCreatedClassCode(row.code)
    acknowledgeCreatedListKey(createdCodesKey(getClassCodeSettings().created))
    if (result.ok) setServerError(null)
    else setFormError(result.notice)
    setDeleting(null)
  }

  const copyActive = async () => {
    if (!settings.activeCode) return
    try {
      await navigator.clipboard.writeText(formatClassCode(settings.activeCode))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const copyCreated = async (code: string) => {
    try {
      await navigator.clipboard.writeText(formatClassCode(code))
      setCopiedCreated(code)
      setTimeout(() => setCopiedCreated(null), 1600)
    } catch {
      setCopiedCreated(null)
    }
  }

  const shareCreated = async (row: CreatedClassCode) => {
    if (typeof navigator.share !== 'function') return
    try {
      await navigator.share({
        title: classCodeShareSubject(row.name),
        text: classCodeShareText(row.name, row.code),
      })
    } catch {
      /* user cancelled or share failed */
    }
  }

  const onShareLink = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href')
    if (!href) return
    if (
      window.mathsachs?.openExternal &&
      (/^https?:\/\//i.test(href) || /^mailto:/i.test(href))
    ) {
      event.preventDefault()
      openClassCodeShareUrl(href)
    }
  }

  return (
    <section className="card class-codes">
      <div className="session__head">
        <h2 className="section-title no-margin">Klassencode</h2>
      </div>
      <p className="muted small">{PRIVACY_COPY}</p>

      {serverError && (
        <p className="notice notice--error" role="alert">
          {serverError}
        </p>
      )}

      <div className="class-codes__grid">
        {canCreateCodes && (
          <div className="class-codes__block">
            <span className="field__label">Klassencode erstellen</span>
            <p className="muted small">
              In der App einen Namen eingeben — Mathsachs erzeugt den Code
              automatisch. Niemand braucht dafür Cloudflare.
            </p>
            <div className="inline-form">
              <input
                className="answer-input__field"
                type="text"
                maxLength={80}
                placeholder="z. B. Klasse 6a"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void onCreate()}
              />
              <button
                type="button"
                className="primary"
                disabled={creating}
                onClick={() => void onCreate()}
              >
                {creating ? '…' : 'Erstellen'}
              </button>
            </div>
          </div>
        )}

        <div className="class-codes__block">
          <span className="field__label">Code eintragen</span>
          <p className="muted small">
            Einen bestehenden Code aktivieren. Nur ein Code sammelt gleichzeitig
            Punkte.
          </p>
          <div className="inline-form">
            <input
              className="answer-input__field"
              type="text"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="z. B. ABCD-2345"
              value={enterCode}
              onChange={(e) => setEnterCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void onEnter()}
            />
            <button
              type="button"
              className="ghost"
              disabled={joining}
              onClick={() => void onEnter()}
            >
              {joining ? '…' : 'Aktivieren'}
            </button>
          </div>
        </div>
      </div>

      {formError && (
        <p className="notice notice--warn" role="alert">
          {formError}
        </p>
      )}

      {settings.activeCode ? (
        <div className="class-codes__active">
          <div>
            <span className="field__label">Aktiver Code</span>
            <p className="class-codes__code">{formatClassCode(settings.activeCode)}</p>
            <p className="muted small">
              {createdCode?.name || 'Eingetragener Klassencode'}
            </p>
          </div>
          <div className="class-codes__active-actions">
            <button type="button" className="ghost" onClick={() => void copyActive()}>
              {copied ? 'Kopiert' : 'Code kopieren'}
            </button>
            <button
              type="button"
              className="link"
              onClick={() => setActiveClassCode(null)}
            >
              Deaktivieren
            </button>
          </div>
        </div>
      ) : (
        <p className="muted small">Kein Code aktiv — Punkte bleiben nur lokal.</p>
      )}

      <label className="class-codes__optin">
        <input
          type="checkbox"
          checked={settings.sendPoints}
          disabled={!settings.activeCode}
          onChange={(e) => setSendClassPoints(e.target.checked)}
        />
        <span>
          Punkte an Klasse senden
          <span className="muted small">
            {' '}
            — nur mit aktivem Code, freiwillig (Opt-in).
          </span>
        </span>
      </label>

      {linkedGrade && <GradeCompetition grade={linkedGrade} />}

      {canManageGrades && <GradeCodes user={user} />}

      {canCreateCodes && (
        <>
          <div className="class-codes__list-head">
            <h3 className="class-codes__list-title">Eigene Codes</h3>
            <button
              type="button"
              className="link"
              disabled={refreshing || settings.created.length === 0}
              onClick={() => void refreshStandings(settings.created, { force: true })}
            >
              {refreshing ? 'Aktualisiere …' : 'Stände aktualisieren'}
            </button>
          </div>
          <p className="muted small">
            Hier liegen deine erstellten Codes — nicht als Besitz auf dem Server.
            Andere Benutzer auf diesem Gerät sehen sie nicht.
          </p>

          {settings.created.length === 0 ? (
            <p className="muted">Noch keinen Code erstellt.</p>
          ) : (
            <ul className="class-codes__list">
              {settings.created.map((row) => {
                const standing = standings[row.code]
                const stats = standing && !('error' in standing) ? standing : null
                const rowError = standing && 'error' in standing ? standing.error : null
                return (
                  <li key={row.code} className="class-codes__row">
                    <div className="class-codes__row-top">
                      <strong>{row.name || 'Klasse'}</strong>
                      <code>{formatClassCode(row.code)}</code>
                      {settings.activeCode === row.code ? (
                        <span className="badge badge--ok">aktiv</span>
                      ) : (
                        <button
                          type="button"
                          className="link"
                          disabled={activating === row.code}
                          onClick={() => void onActivateCreated(row.code)}
                        >
                          {activating === row.code ? 'Prüfe …' : 'Aktivieren'}
                        </button>
                      )}
                      <button
                        type="button"
                        className="link"
                        disabled={deleting === row.code}
                        onClick={() => void onDelete(row)}
                      >
                        {deleting === row.code ? 'Lösche …' : 'Löschen'}
                      </button>
                    </div>
                    <div className="class-codes__share">
                      <button
                        type="button"
                        className="link"
                        onClick={() => void copyCreated(row.code)}
                      >
                        {copiedCreated === row.code ? 'Kopiert' : 'Code kopieren'}
                      </button>
                      <a
                        className="link"
                        href={classCodeWhatsAppUrl(row.name, row.code)}
                        target="_blank"
                        rel="noopener"
                        onClick={onShareLink}
                      >
                        WhatsApp
                      </a>
                      <a
                        className="link"
                        href={classCodeMailtoUrl(row.name, row.code)}
                        target="_blank"
                        rel="noopener"
                        onClick={onShareLink}
                      >
                        Mail
                      </a>
                      {webShare && (
                        <button
                          type="button"
                          className="link"
                          onClick={() => void shareCreated(row)}
                        >
                          Teilen
                        </button>
                      )}
                    </div>
                    {stats ? (
                      <dl className="class-codes__stats">
                        <div>
                          <dt>Tag</dt>
                          <dd>{stats.points.today}</dd>
                        </div>
                        <div>
                          <dt>Woche</dt>
                          <dd>{stats.points.week}</dd>
                        </div>
                        <div>
                          <dt>Monat</dt>
                          <dd>{stats.points.month}</dd>
                        </div>
                        <div>
                          <dt>Schuljahr</dt>
                          <dd>{stats.points.year}</dd>
                        </div>
                        <div>
                          <dt>Gesamt</dt>
                          <dd>{stats.points.total}</dd>
                        </div>
                      </dl>
                    ) : rowError ? (
                      <p className="muted small">{rowError}</p>
                    ) : (
                      <p className="muted small">Stände werden geladen …</p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
