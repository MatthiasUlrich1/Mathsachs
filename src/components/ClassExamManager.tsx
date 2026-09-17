import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import {
  ClassApiError,
  createClassExam,
  deleteClassExam,
  getClass,
  getGrade,
} from '../classCode/api'
import { formatClassCode } from '../classCode/code'
import { publicIdFromCode } from '../classCode/publicId'
import { openClassCodeShareUrl } from '../classCode/share'
import { gradeCodesForChallengeList } from '../challenge/logic'
import { resolveAddClassValue } from '../exam/classExamAddValue'
import { groupClassExamsByCode } from '../exam/classExamParse'
import { deleteClassExamConfirm, type StoredClassExam } from '../exam/classExamTypes'
import {
  mergeExamAssignableClasses,
  parseExamAssignableValue,
} from '../exam/examAssignableClasses'
import { decodeExam } from '../exam/examCode'
import { examCodeMailtoUrl, examCodeWhatsAppUrl } from '../exam/share'
import {
  forgetCreatedClassExam,
  getClassCodeSettings,
  getCreatedClassExams,
  getGradeCodeSettings,
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
  /** Preferred assignable value per MSX1 group — only kept while still available. */
  const [addClassFor, setAddClassFor] = useState<Record<string, string>>({})
  const [classSettings, setClassSettings] = useState(() => getClassCodeSettings())
  const [gradeSettings, setGradeSettings] = useState(() => getGradeCodeSettings())
  const [gradeClasses, setGradeClasses] = useState<
    Record<string, Array<{ id: string; name: string }>>
  >({})
  const groups = useMemo(() => groupClassExamsByCode(exams), [exams])
  const assignable = useMemo(
    () =>
      mergeExamAssignableClasses({
        classSettings,
        gradeSettings,
        gradeClasses,
      }),
    [classSettings, gradeSettings, gradeClasses],
  )

  useEffect(() => {
    const refresh = () => {
      setExams(getCreatedClassExams())
      setClassSettings(getClassCodeSettings())
      setGradeSettings(getGradeCodeSettings())
    }
    refresh()
    return subscribeSharedStorage(refresh)
  }, [refreshKey])

  useEffect(() => {
    let cancelled = false
    const codes = gradeCodesForChallengeList(gradeSettings)
    if (codes.length === 0) {
      setGradeClasses({})
      return
    }
    void (async () => {
      const next: Record<string, Array<{ id: string; name: string }>> = {}
      for (const gradeCode of codes) {
        try {
          const view = await getGrade(gradeCode)
          next[gradeCode] = (view.classes ?? []).map((c) => ({
            id: c.id,
            name: c.name,
          }))
        } catch {
          /* offline */
        }
      }
      if (!cancelled) setGradeClasses(next)
    })()
    return () => {
      cancelled = true
    }
  }, [gradeSettings, refreshKey])

  // Drop stale dropdown picks when assignments change (assign / remove / sync).
  useEffect(() => {
    setAddClassFor((prev) => {
      let changed = false
      const next = { ...prev }
      for (const group of groups) {
        const assigned = new Set(group.assignments.map((a) => a.hostCode))
        const available = assignable
          .filter((row) => {
            if (row.code && assigned.has(row.code)) return false
            if (row.classId) {
              for (const host of assigned) {
                if (publicIdFromCode(host) === row.classId) return false
              }
            }
            return true
          })
          .map((c) => c.value)
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
  }, [groups, assignable])

  // Pull exams (and solveCount) from the Worker for every Klassencode this
  // Lehrer owns — recovers the list if local storage was wiped (e.g. older
  // desktop builds that dropped classExams on save).
  useEffect(() => {
    let cancelled = false
    const created = getClassCodeSettings().created
    const hosts = [
      ...new Set([
        ...getCreatedClassExams().map((e) => e.hostCode),
        ...created.map((c) => c.code),
      ]),
    ]
    if (hosts.length === 0) return
    void (async () => {
      for (const host of hosts) {
        try {
          const stats = await getClass(host)
          if (cancelled) return
          const className =
            stats.name || created.find((c) => c.code === host)?.name
          for (const remote of stats.exams ?? []) {
            const local = getCreatedClassExams().find((e) => e.id === remote.id)
            rememberCreatedClassExam({
              id: remote.id,
              hostCode: host,
              className: remote.className ?? local?.className ?? className,
              name: remote.name,
              examCode: remote.examCode,
              createdAt: remote.createdAt ?? local?.createdAt ?? Date.now(),
              owned: true,
              taskCount: remote.taskCount ?? local?.taskCount,
              totalPoints: remote.totalPoints ?? local?.totalPoints,
              solveCount: remote.solveCount ?? local?.solveCount ?? 0,
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

  const onAddClass = async (seed: StoredClassExam, value: string) => {
    if (!value) return
    const key = seed.examCode
    setBusyKey(key)
    setError(null)
    try {
      const parsed = parseExamAssignableValue(value)
      const label = assignable.find((r) => r.value === value)?.name
      const created = await createClassExam({
        ...parsed,
        name: seed.name,
        examCode: seed.examCode,
        taskCount: seed.taskCount,
        totalPoints: seed.totalPoints,
      })
      const hostCode = created.hostCode || parsed.classCode || ''
      if (!hostCode) {
        throw new ClassApiError(
          'not_ready',
          'Zuordnung ok, aber der Klassencode fehlt in der Antwort. Bitte Worker aktualisieren.',
          200,
        )
      }
      rememberCreatedClassExam({
        id: created.id,
        hostCode,
        className: created.className ?? label,
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
          const availableClasses = assignable.filter((row) => {
            if (row.code && assignedCodes.has(row.code)) return false
            if (row.classId) {
              for (const host of assignedCodes) {
                if (publicIdFromCode(host) === row.classId) return false
              }
            }
            return true
          })
          const availableValues = availableClasses.map((c) => c.value)
          const addValue = resolveAddClassValue(
            addClassFor[group.examCode],
            availableValues,
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
                      key={`${group.examCode}:${availableValues.join(',')}`}
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
                        <option key={row.value} value={row.value}>
                          {row.name}
                          {!row.code && row.gradeCode ? ' (Stufe)' : ''}
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
