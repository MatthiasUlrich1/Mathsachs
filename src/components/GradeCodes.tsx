import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CLASS_API_STUB_MESSAGE,
  createClass,
  createGrade,
  deleteGrade,
  getClass,
  getGrade,
  updateGradeClasses,
  type ClassStats,
  type GradeSummary,
} from '../classCode/api'
import {
  formatClassCode,
  isValidClassCode,
  normalizeClassCode,
} from '../classCode/code'
import { assignedLocalClassCodes, GRADE_MANAGE_HINT, GRADE_PRIVACY_COPY } from '../classCode/gradeUi'
import { publicIdFromCode } from '../classCode/publicId'
import { standingErrorText } from '../classCode/createdList'
import {
  forgetCreatedGradeCode,
  getClassCodeSettings,
  getGradeCodeSettings,
  rememberCreatedClassCode,
  rememberCreatedGradeCode,
  rememberJoinedGradeCode,
  subscribeSharedStorage,
  type ClassCodeSettings,
  type CreatedClassCode,
} from '../lib/storage'
import { GradeCompetition } from './GradeCompetition'

const assignableCodes = (settings: ClassCodeSettings): string[] => {
  const codes = new Set(settings.created.map((row) => row.code))
  if (settings.activeCode) codes.add(settings.activeCode)
  return [...codes]
}

const classLabel = (code: string, settings: ClassCodeSettings): string => {
  const created = settings.created.find((row) => row.code === code)
  return created?.name ? `${created.name} (${formatClassCode(code)})` : formatClassCode(code)
}

export function GradeCodes({
  user,
  canCreateGrades = true,
}: {
  user: string
  canCreateGrades?: boolean
}) {
  const [gradeName, setGradeName] = useState('')
  const [enterCode, setEnterCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [entering, setEntering] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [assigning, setAssigning] = useState<string | null>(null)
  const [creatingAssigned, setCreatingAssigned] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [pick, setPick] = useState<Record<string, string>>({})
  const [newClassName, setNewClassName] = useState<Record<string, string>>({})
  const [gradeSettings, setGradeSettings] = useState(() => getGradeCodeSettings(user))
  const [classSettings, setClassSettings] = useState(() => getClassCodeSettings(user))
  const [views, setViews] = useState<Record<string, GradeSummary | { error: string }>>({})
  const [classStandings, setClassStandings] = useState<Record<string, ClassStats>>({})

  useEffect(() => {
    const refresh = () => {
      setGradeSettings(getGradeCodeSettings(user))
      setClassSettings(getClassCodeSettings(user))
    }
    refresh()
    return subscribeSharedStorage(refresh)
  }, [user])

  const createdRows = gradeSettings.created
  const enteredRows = useMemo(() => {
    const owned = new Set(createdRows.map((row) => row.code))
    return (gradeSettings.known ?? []).filter((row) => !owned.has(row.code))
  }, [createdRows, gradeSettings.known])
  const allRows = useMemo(
    () => [...createdRows, ...enteredRows],
    [createdRows, enteredRows],
  )
  const createdKey = allRows.map((row) => row.code).join('\n')
  const localCodes = useMemo(() => assignableCodes(classSettings), [classSettings])

  const refreshViews = useCallback(async (rows: CreatedClassCode[]) => {
    const next: Record<string, GradeSummary | { error: string }> = {}
    for (const row of rows) {
      try {
        next[row.code] = await getGrade(row.code)
      } catch (err) {
        next[row.code] = { error: standingErrorText(err) }
      }
    }
    setViews(next)
  }, [])

  const refreshClassStandings = useCallback(async (codes: string[]) => {
    const next: Record<string, ClassStats> = {}
    for (const code of codes) {
      try {
        next[code] = await getClass(code)
      } catch {
        /* assignment matching skips failed GETs */
      }
    }
    setClassStandings(next)
  }, [])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const latest = getGradeCodeSettings(user)
      const owned = new Set(latest.created.map((row) => row.code))
      const entered = (latest.known ?? []).filter((row) => !owned.has(row.code))
      void refreshViews([...latest.created, ...entered])
      void refreshClassStandings(assignableCodes(getClassCodeSettings(user)))
    }, 80)
    return () => window.clearTimeout(handle)
  }, [createdKey, localCodes.join('\n'), refreshViews, refreshClassStandings, user])

  const onCreate = async () => {
    const name = gradeName.trim()
    if (!name) {
      setFormError('Bitte einen Namen für die Klassenstufe eingeben.')
      return
    }
    setCreating(true)
    setFormError(null)
    try {
      const created = await createGrade(name)
      rememberCreatedGradeCode(created.code, created.name)
      setGradeName('')
      setViews((prev) => ({ ...prev, [created.code]: created }))
    } catch (err) {
      setFormError(standingErrorText(err) || CLASS_API_STUB_MESSAGE)
    } finally {
      setCreating(false)
    }
  }

  const onEnter = async () => {
    const code = normalizeClassCode(enterCode)
    if (!isValidClassCode(code)) {
      setFormError('Bitte einen gültigen Stufencode eingeben (8 Zeichen).')
      return
    }
    setEntering(true)
    setFormError(null)
    try {
      const summary = await getGrade(code)
      rememberJoinedGradeCode(code, summary.name)
      setViews((prev) => ({ ...prev, [code]: summary }))
      setEnterCode('')
    } catch (err) {
      setFormError(standingErrorText(err))
    } finally {
      setEntering(false)
    }
  }

  const onCreateAssignedClass = async (gradeCode: string) => {
    const name = (newClassName[gradeCode] ?? '').trim()
    if (!name) {
      setFormError('Bitte einen Klassennamen eingeben.')
      return
    }
    setCreatingAssigned(gradeCode)
    setFormError(null)
    try {
      const stats = await createClass(name)
      rememberCreatedClassCode(stats.code, stats.name)
      const view = await updateGradeClasses(gradeCode, { add: [stats.code] })
      setViews((prev) => ({ ...prev, [gradeCode]: view }))
      setClassStandings((prev) => ({ ...prev, [stats.code]: stats }))
      setNewClassName((prev) => ({ ...prev, [gradeCode]: '' }))
    } catch (err) {
      setFormError(standingErrorText(err) || CLASS_API_STUB_MESSAGE)
    } finally {
      setCreatingAssigned(null)
    }
  }

  const onAssign = async (gradeCode: string, classCode: string, mode: 'add' | 'remove') => {
    const normalized = normalizeClassCode(classCode)
    if (!normalized) return
    setAssigning(`${gradeCode}:${normalized}:${mode}`)
    setFormError(null)
    try {
      const view = await updateGradeClasses(gradeCode, {
        add: mode === 'add' ? [normalized] : [],
        remove: mode === 'remove' ? [normalized] : [],
      })
      setViews((prev) => ({ ...prev, [gradeCode]: view }))
      const stats = await getClass(normalized)
      setClassStandings((prev) => ({ ...prev, [normalized]: stats }))
    } catch (err) {
      setFormError(standingErrorText(err))
    } finally {
      setAssigning(null)
    }
  }

  const onDelete = async (row: CreatedClassCode, owned: boolean) => {
    const label = row.name ? `„${row.name}“ (${formatClassCode(row.code)})` : formatClassCode(row.code)
    const ok = window.confirm(
      owned
        ? `Klassenstufe ${label} wirklich löschen? Die Zuordnung der Klassen entfällt. Klassencodes und ihre Punkte bleiben.`
        : `Eingetragenen Stufencode ${label} lokal entfernen? Die Stufe bleibt für andere Lehrer erhalten.`,
    )
    if (!ok) return
    setDeleting(row.code)
    setFormError(null)
    forgetCreatedGradeCode(row.code)
    if (owned) {
      try {
        await deleteGrade(row.code)
      } catch (err) {
        setFormError(standingErrorText(err))
      }
    }
    setViews((prev) => {
      const next = { ...prev }
      delete next[row.code]
      return next
    })
    setDeleting(null)
  }

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(formatClassCode(code))
      setCopied(code)
      setTimeout(() => setCopied(null), 1600)
    } catch {
      setCopied(null)
    }
  }

  const renderGradeRow = (row: CreatedClassCode, owned: boolean) => {
    const view = views[row.code]
    const summary = view && !('error' in view) ? view : null
    const rowError = view && 'error' in view ? view.error : null
    const gradeId = summary?.id ?? publicIdFromCode(row.code)
    const assigned = assignedLocalClassCodes(localCodes, gradeId, classStandings)
    const available = localCodes.filter((code) => !assigned.includes(code))
    return (
      <li key={row.code} className="class-codes__row">
        <div className="class-codes__row-top">
          <strong>{row.name || 'Klassenstufe'}</strong>
          <code>{formatClassCode(row.code)}</code>
          {owned ? (
            <span className="badge badge--ok">erstellt</span>
          ) : (
            <span className="badge">eingetragen</span>
          )}
          <button type="button" className="link" onClick={() => void copyCode(row.code)}>
            {copied === row.code ? 'Kopiert' : 'Stufencode kopieren'}
          </button>
          <button
            type="button"
            className="link"
            disabled={deleting === row.code}
            onClick={() => void onDelete(row, owned)}
          >
            {deleting === row.code ? 'Lösche …' : owned ? 'Löschen' : 'Entfernen'}
          </button>
        </div>
        <p className="muted small">
          {owned
            ? 'Stufencode nur für Lehrer. Schüler brauchen ihn nicht — sie sehen den Wettbewerb über ihren Klassencode.'
            : 'Eingetragene Stufe: Wettbewerb aller Klassen und neue Klassencodes dieser Stufe. Keine Mitgliedscodes anderer Klassen.'}
        </p>
        {assigned.length > 0 && (
          <ul className="grade-codes__assigned">
            {assigned.map((code) => (
              <li key={code}>
                {classLabel(code, classSettings)}
                <button
                  type="button"
                  className="link"
                  disabled={assigning === `${row.code}:${code}:remove`}
                  onClick={() => void onAssign(row.code, code, 'remove')}
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        )}
        {available.length > 0 && (
          <div className="inline-form">
            <select
              className="answer-input__field"
              value={pick[row.code] ?? ''}
              onChange={(e) =>
                setPick((prev) => ({ ...prev, [row.code]: e.target.value }))
              }
            >
              <option value="">Klassencode zuordnen …</option>
              {available.map((code) => (
                <option key={code} value={code}>
                  {classLabel(code, classSettings)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="ghost"
              disabled={!pick[row.code] || assigning?.startsWith(`${row.code}:`)}
              onClick={() => void onAssign(row.code, pick[row.code], 'add')}
            >
              Zuordnen
            </button>
          </div>
        )}
        <div className="inline-form">
          <input
            className="answer-input__field"
            type="text"
            maxLength={80}
            placeholder="Neue Klasse auf dieser Stufe"
            value={newClassName[row.code] ?? ''}
            onChange={(e) =>
              setNewClassName((prev) => ({ ...prev, [row.code]: e.target.value }))
            }
            onKeyDown={(e) => e.key === 'Enter' && void onCreateAssignedClass(row.code)}
          />
          <button
            type="button"
            className="ghost"
            disabled={creatingAssigned === row.code}
            onClick={() => void onCreateAssignedClass(row.code)}
          >
            {creatingAssigned === row.code ? '…' : 'Klasse anlegen'}
          </button>
        </div>
        <p className="muted small">
          Der neue Klassencode wird dieser Stufe zugeordnet und nicht automatisch aktiv.
        </p>
        {summary ? (
          <GradeCompetition grade={summary} title="Stufen-Wettbewerb" />
        ) : rowError ? (
          <p className="muted small">{rowError}</p>
        ) : (
          <p className="muted small">Stände werden geladen …</p>
        )}
      </li>
    )
  }

  return (
    <div className="class-codes__block grade-codes">
      <div className="session__head">
        <h3 className="section-title no-margin">Klassenstufe</h3>
      </div>
      <p className="muted small">{GRADE_PRIVACY_COPY}</p>
      <p className="muted small">{GRADE_MANAGE_HINT}</p>

      {canCreateGrades && (
        <>
          <span className="field__label">Klassenstufencode erstellen</span>
          <p className="muted small">
            Name der Stufe, z. B. 6. Klasse. Mathsachs erzeugt den Stufencode.
            Teile ihn nur mit anderen Lehrkräften — nicht mit der Klasse.
          </p>
          <div className="inline-form">
            <input
              className="answer-input__field"
              type="text"
              maxLength={80}
              placeholder="z. B. 6. Klasse"
              value={gradeName}
              onChange={(e) => setGradeName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void onCreate()}
            />
            <button type="button" className="primary" disabled={creating} onClick={() => void onCreate()}>
              {creating ? '…' : 'Stufe erstellen'}
            </button>
          </div>
        </>
      )}

      <span className="field__label">Stufencode eintragen</span>
      <p className="muted small">
        Denselben Stufencode wie die Kollegin oder der Kollege eintragen.
        Danach siehst du den Wettbewerb aller Klassen und kannst Klassencodes
        dieser Stufe zuordnen oder neu anlegen.
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
          disabled={entering}
          onClick={() => void onEnter()}
        >
          {entering ? '…' : 'Stufe eintragen'}
        </button>
      </div>

      {formError && (
        <p className="notice notice--warn" role="alert">
          {formError}
        </p>
      )}

      <div className="class-codes__list-head">
        <h3 className="class-codes__list-title">Eigene Stufen</h3>
      </div>
      {createdRows.length === 0 ? (
        <p className="muted">Noch keine Klassenstufe erstellt.</p>
      ) : (
        <ul className="class-codes__list">
          {createdRows.map((row) => renderGradeRow(row, true))}
        </ul>
      )}

      <div className="class-codes__list-head">
        <h3 className="class-codes__list-title">Eingetragene Stufen</h3>
      </div>
      {enteredRows.length === 0 ? (
        <p className="muted">Noch keinen Stufencode eingetragen.</p>
      ) : (
        <ul className="class-codes__list">
          {enteredRows.map((row) => renderGradeRow(row, false))}
        </ul>
      )}
    </div>
  )
}
