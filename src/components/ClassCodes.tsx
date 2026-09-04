import { useCallback, useEffect, useState } from 'react'
import {
  CLASS_API_NOT_READY_MESSAGE,
  ClassApiError,
  checkClassApiHealth,
  createClass,
  getClass,
  type ClassStats,
} from '../classCode/api'
import { formatClassCode, isValidClassCode, normalizeClassCode } from '../classCode/code'
import {
  getClassCodeSettings,
  rememberCreatedClassCode,
  setActiveClassCode,
  setSendClassPoints,
  subscribeSharedStorage,
  type CreatedClassCode,
} from '../lib/storage'

const PRIVACY_COPY =
  'Online speichert Mathsachs nur den Klassennamen und die Summe der Punkte — keine Vornamen und keine Geräte-IDs. Wer den Code kennt, kann die Stände sehen und Punkte hinzufügen. Behandle den Code wie ein Passwort.'

function errorText(err: unknown): string {
  if (err instanceof ClassApiError) return err.message
  return CLASS_API_NOT_READY_MESSAGE
}

export function ClassCodes() {
  const [className, setClassName] = useState('')
  const [enterCode, setEnterCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [settings, setSettings] = useState(() => getClassCodeSettings())
  const [standings, setStandings] = useState<Record<string, ClassStats | { error: string }>>({})

  useEffect(() => {
    return subscribeSharedStorage(() => setSettings(getClassCodeSettings()))
  }, [])

  const refreshStandings = useCallback(async (rows: CreatedClassCode[]) => {
    if (rows.length === 0) {
      setStandings({})
      return
    }
    setRefreshing(true)
    const entries = await Promise.all(
      rows.map(async (row) => {
        try {
          const stats = await getClass(row.code)
          return [row.code, stats] as const
        } catch (err) {
          return [row.code, { error: errorText(err) }] as const
        }
      }),
    )
    setStandings(Object.fromEntries(entries))
    setRefreshing(false)
  }, [])

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
        if (!cancelled) setServerError(errorText(err))
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    void refreshStandings(settings.created)
  }, [settings.created, refreshStandings])

  const createdCode = settings.activeCode
    ? settings.created.find((row) => row.code === settings.activeCode)
    : null

  const onCreate = async () => {
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
      setClassName('')
      setServerError(null)
      setStandings((prev) => ({ ...prev, [stats.code]: stats }))
    } catch (err) {
      setFormError(errorText(err))
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
      setEnterCode('')
      setServerError(null)
    } catch (err) {
      setFormError(errorText(err))
    } finally {
      setJoining(false)
    }
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
        <div className="class-codes__block">
          <span className="field__label">Klassencode erstellen</span>
          <p className="muted small">
            Schüler oder Lehrkraft: Klassenname eingeben. Der Code trägt den
            Namen mit.
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

      <div className="class-codes__list-head">
        <h3 className="class-codes__list-title">Eigene Codes</h3>
        <button
          type="button"
          className="link"
          disabled={refreshing || settings.created.length === 0}
          onClick={() => void refreshStandings(settings.created)}
        >
          {refreshing ? 'Aktualisiere …' : 'Stände aktualisieren'}
        </button>
      </div>
      <p className="muted small">
        Hier liegen die auf diesem Rechner (und im WLAN) erstellten Codes — nicht
        als Besitz auf dem Server.
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
                      onClick={() => setActiveClassCode(row.code)}
                    >
                      Aktivieren
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
    </section>
  )
}
