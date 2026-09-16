import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import {
  ClassApiError,
  createClassExam,
  deleteClassExam,
  getClass,
} from '../classCode/api'
import { formatClassCode } from '../classCode/code'
import { openClassCodeShareUrl } from '../classCode/share'
import { resolveAddClassValue } from '../exam/classExamAddValue'
import { groupClassExamsByCode } from '../exam/classExamParse'
import { deleteClassExamConfirm, type StoredClassExam } from '../exam/classExamTypes'
import { decodeExam } from '../exam/examCode'
import { examCodeMailtoUrl, examCodeWhatsAppUrl } from '../exam/share'
import {
  forgetCreatedClassExam,
  getClassCodeSettings,
  getCreatedClassExams,
  rememberCreatedClassExam,
  subscribeSharedStorage,
} from '../lib/storage'

interface Props {
  /** Refresh token from parent after a new assign. */
  refreshKey?: number
  /** Load this exam into ExamBuilder for editing (any assignment of the group). */
  onEdit?: (exam: StoredClassExam) => void
}

export function ClassExamManager({ refreshKey = 0, onEdit }: Props) {
  const [exams, setExams] = useState<StoredClassExam[]>(() => getCreatedClassExams())
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  /** Preferred class code per MSX1 group — only kept while still available. */
  const [addClassFor, setAddClassFor] = useState<Record<string, string>>({})
  const createdClasses = getClassCodeSettings().created
  const groups = useMemo(() => groupClassExamsByCode(exams), [exams])

  useEffect(() => {
    const refresh = () => setExams(getCreatedClassExams())
    refresh()
    return subscribeSharedStorage(refresh)
  }, [refreshKey])

  // Drop stale dropdown picks when assignments change (assign / remove / sync).
  useEffect(() => {
    setAddClassFor((prev) => {
      let changed = false
      const next = { ...prev }
      for (const group of groups) {
        const assigned = new Set(group.assignments.map((a) => a.hostCode))
        const available = createdClasses
          .filter((c) => !assigned.has(c.code))
          .map((c) => c.code)
        const stored = next[group.examCode]
        const resolved = resolveAddClassValue(stored, available)
        if (stored !== resolved) {
          if (resolved) next[group.examCode] = resolved
          else delete next[group.examCode]
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [groups, createdClasses])

  // Pull solveCount (and metadata) from the Worker for each host class.
  useEffect(() => {
    let cancelled = false
    const hosts = [...new Set(getCreatedClassExams().map((e) => e.hostCode))]
    if (hosts.length === 0) return
    void (async () => {
      for (const host of hosts) {
        try {
          const stats = await getClass(host)
          if (cancelled) return
          for (const remote of stats.exams ?? []) {
            const local = getCreatedClassExams().find((e) => e.id === remote.id)
            if (!local) continue
            rememberCreatedClassExam({
              ...local,
              name: remote.name,
              examCode: remote.examCode,
              taskCount: remote.taskCount ?? local.taskCount,
              totalPoints: remote.totalPoints ?? local.totalPoints,
              solveCount: remote.solveCount ?? local.solveCount ?? 0,
              className: remote.className ?? local.className,
            })
          }
          if (!cancelled) setExams(getCreatedClassExams())
        } catch {
          // Offline / stub — keep local list.
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const onAddClass = async (seed: StoredClassExam, classCode: string) => {
    if (!classCode) return
    const key = seed.examCode
    setBusyKey(key)
    setError(null)
    try {
      const created = await createClassExam({
        classCode,
        name: seed.name,
        examCode: seed.examCode,
        taskCount: seed.taskCount,
        totalPoints: seed.totalPoints,
      })
      rememberCreatedClassExam({
        id: created.id,
        hostCode: classCode,
        className:
          created.className ?? createdClasses.find((c) => c.code === classCode)?.name,
        name: created.name,
        examCode: created.examCode,
        createdAt: created.createdAt,
        owned: true,
        taskCount: created.taskCount ?? seed.taskCount,
        totalPoints: created.totalPoints ?? seed.totalPoints,
        solveCount: created.solveCount ?? 0,
      })
      setExams(getCreatedClassExams())
      // Clear pick so the next available class becomes the select value
      // (empty string would break <select> — no matching option).
      setAddClassFor((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    } catch (e) {
      setError(
        e instanceof ClassApiError
          ? e.message
          : 'Klasse konnte nicht zugeordnet werden.',
      )
    } finally {
      setBusyKey(null)
    }
  }

  const onRemoveAssignment = async (exam: StoredClassExam, alone: boolean) => {
    const label = exam.className || formatClassCode(exam.hostCode)
    const msg = alone
      ? deleteClassExamConfirm(exam.name)
      : `Zuordnung zur Klasse „${label}“ entfernen? Die Klausur bleibt in den anderen Klassen.`
    if (!window.confirm(msg)) return
    setBusyKey(exam.examCode)
    setError(null)
    try {
      await deleteClassExam(exam.id)
      forgetCreatedClassExam(exam.id)
      setExams(getCreatedClassExams())
      setAddClassFor((prev) => {
        const next = { ...prev }
        delete next[exam.examCode]
        return next
      })
    } catch (e) {
      setError(
        e instanceof ClassApiError ? e.message : 'Zuordnung konnte nicht entfernt werden.',
      )
    } finally {
      setBusyKey(null)
    }
  }

  const onDeleteAll = async (assignments: StoredClassExam[]) => {
    if (!window.confirm(deleteClassExamConfirm(assignments[0]?.name ?? 'diese Klausur'))) {
      return
    }
    const key = assignments[0]?.examCode ?? null
    setBusyKey(key)
    setError(null)
    try {
      for (const exam of assignments) {
        await deleteClassExam(exam.id)
        forgetCreatedClassExam(exam.id)
      }
      setExams(getCreatedClassExams())
      if (key) {
        setAddClassFor((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      }
    } catch (e) {
      setError(
        e instanceof ClassApiError ? e.message : 'Klausur konnte nicht gelöscht werden.',
      )
      setExams(getCreatedClassExams())
    } finally {
      setBusyKey(null)
    }
  }

  const onCopy = async (examCode: string) => {
    try {
      await navigator.clipboard.writeText(examCode)
      setCopiedKey(examCode)
      setTimeout(() => setCopiedKey((k) => (k === examCode ? null : k)), 1600)
    } catch {
      setError('Code konnte nicht kopiert werden.')
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

  const onEditClick = (exam: StoredClassExam) => {
    setError(null)
    try {
      decodeExam(exam.examCode)
      onEdit?.(exam)
    } catch {
      setError('Klausurcode ist ungültig und kann nicht bearbeitet werden.')
    }
  }

  if (groups.length === 0 && !error) {
    return (
      <div className="class-exam-manager">
        <h3 className="exam-pool__title">Meine Klassenklausuren</h3>
        <p className="muted small">
          Noch keine Klausur einer Klasse zugeordnet. Erstelle unten eine Klausur und
          wähle unter „Code“ eine Klasse.
        </p>
      </div>
    )
  }

  return (
    <div className="class-exam-manager">
      <h3 className="exam-pool__title">Meine Klassenklausuren</h3>
      <p className="muted small">
        Pro Klausur ein Eintrag: zugeordnete Klassen sehen, weitere Klassen hinzufügen
        oder Zuordnungen entfernen. Code erneut kopieren oder Inhalte bearbeiten.
      </p>
      {error && <p className="notice notice--error">{error}</p>}
      <ul className="class-exam-manager__list">
        {groups.map((group) => {
          const expanded = expandedKey === group.examCode
          const busy = busyKey === group.examCode
          const seed = group.assignments[0]
          const assignedCodes = new Set(group.assignments.map((a) => a.hostCode))
          const availableClasses = createdClasses.filter((c) => !assignedCodes.has(c.code))
          const availableCodes = availableClasses.map((c) => c.code)
          const addValue = resolveAddClassValue(
            addClassFor[group.examCode],
            availableCodes,
          )
          return (
            <li key={group.examCode} className="class-exam-manager__item">
              <div className="class-exam-manager__meta">
                <strong>{group.name}</strong>
                <p className="muted small">
                  {group.taskCount != null ? `${group.taskCount} Aufgaben` : 'Klausur'}
                  {group.totalPoints != null ? ` · ${group.totalPoints} P.` : ''}
                  {` · ${group.solveCount}× gelöst`}
                </p>
                <ul className="class-exam-manager__classes">
                  {group.assignments.map((row) => (
                    <li key={row.id} className="class-exam-manager__class-chip">
                      <span>{row.className || formatClassCode(row.hostCode)}</span>
                      {(row.solveCount ?? 0) > 0 && (
                        <span className="muted small"> · {row.solveCount}×</span>
                      )}
                      <button
                        type="button"
                        className="ghost class-exam-manager__chip-remove"
                        disabled={busy}
                        title="Zuordnung entfernen"
                        onClick={() =>
                          void onRemoveAssignment(row, group.assignments.length === 1)
                        }
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                {expanded && (
                  <textarea
                    className="exam-code__field class-exam-manager__code"
                    readOnly
                    rows={2}
                    value={group.examCode}
                  />
                )}
              </div>
              <div className="class-exam-manager__actions">
                {availableClasses.length > 0 && (
                  <label className="muted small class-exam-manager__add">
                    Weitere Klasse{' '}
                    <select
                      key={`${group.examCode}:${availableCodes.join(',')}`}
                      value={addValue}
                      disabled={busy}
                      onChange={(e) =>
                        setAddClassFor((prev) => ({
                          ...prev,
                          [group.examCode]: e.target.value,
                        }))
                      }
                    >
                      {availableClasses.map((row) => (
                        <option key={row.code} value={row.code}>
                          {row.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="ghost"
                      disabled={busy || !addValue}
                      onClick={() => void onAddClass(seed, addValue)}
                    >
                      Zuordnen
                    </button>
                  </label>
                )}
                <button
                  type="button"
                  className="ghost"
                  disabled={busy}
                  onClick={() =>
                    setExpandedKey(expanded ? null : group.examCode)
                  }
                >
                  {expanded ? 'Code ausblenden' : 'Code zeigen'}
                </button>
                <button
                  type="button"
                  className="ghost"
                  disabled={busy}
                  onClick={() => void onCopy(group.examCode)}
                >
                  {copiedKey === group.examCode ? 'Kopiert ✓' : 'Code kopieren'}
                </button>
                <a
                  className="link"
                  href={examCodeWhatsAppUrl(group.examCode, group.name)}
                  target="_blank"
                  rel="noopener"
                  onClick={onShareLink}
                >
                  WhatsApp
                </a>
                <a
                  className="link"
                  href={examCodeMailtoUrl(group.examCode, group.name)}
                  target="_blank"
                  rel="noopener"
                  onClick={onShareLink}
                >
                  Mail
                </a>
                {onEdit && (
                  <button
                    type="button"
                    className="ghost"
                    disabled={busy}
                    onClick={() => onEditClick(seed)}
                  >
                    Bearbeiten
                  </button>
                )}
                <button
                  type="button"
                  className="ghost"
                  disabled={busy}
                  onClick={() => void onDeleteAll(group.assignments)}
                >
                  Löschen
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
