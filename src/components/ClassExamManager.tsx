import { useEffect, useState, type MouseEvent } from 'react'
import {
  ClassApiError,
  deleteClassExam,
  getClass,
  updateClassExam,
  type ClassExamSummary,
} from '../classCode/api'
import { formatClassCode } from '../classCode/code'
import { openClassCodeShareUrl } from '../classCode/share'
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
  /** Load this exam into ExamBuilder for editing. */
  onEdit?: (exam: StoredClassExam) => void
}

export function ClassExamManager({ refreshKey = 0, onEdit }: Props) {
  const [exams, setExams] = useState<StoredClassExam[]>(() => getCreatedClassExams())
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const createdClasses = getClassCodeSettings().created

  useEffect(() => {
    const refresh = () => setExams(getCreatedClassExams())
    refresh()
    return subscribeSharedStorage(refresh)
  }, [refreshKey])

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

  const onReassign = async (exam: StoredClassExam, classCode: string) => {
    setBusyId(exam.id)
    setError(null)
    try {
      const updated: ClassExamSummary = await updateClassExam(exam.id, {
        name: exam.name,
        examCode: exam.examCode,
        classCode,
        taskCount: exam.taskCount,
        totalPoints: exam.totalPoints,
      })
      rememberCreatedClassExam({
        ...exam,
        id: updated.id,
        hostCode: classCode,
        className: updated.className ?? createdClasses.find((c) => c.code === classCode)?.name,
        name: updated.name,
        examCode: updated.examCode,
        owned: true,
        taskCount: updated.taskCount ?? exam.taskCount,
        totalPoints: updated.totalPoints ?? exam.totalPoints,
        solveCount: updated.solveCount ?? exam.solveCount,
      })
      setExams(getCreatedClassExams())
    } catch (e) {
      setError(
        e instanceof ClassApiError
          ? e.message
          : 'Zuordnung konnte nicht geändert werden.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const onDelete = async (exam: StoredClassExam) => {
    if (!window.confirm(deleteClassExamConfirm(exam.name))) return
    setBusyId(exam.id)
    setError(null)
    try {
      await deleteClassExam(exam.id)
      forgetCreatedClassExam(exam.id)
      setExams(getCreatedClassExams())
    } catch (e) {
      setError(
        e instanceof ClassApiError ? e.message : 'Klausur konnte nicht gelöscht werden.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const onCopy = async (exam: StoredClassExam) => {
    try {
      await navigator.clipboard.writeText(exam.examCode)
      setCopiedId(exam.id)
      setTimeout(() => setCopiedId((id) => (id === exam.id ? null : id)), 1600)
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
      decodeExam(exam.examCode) // validate before handing to builder
      onEdit?.(exam)
    } catch {
      setError('Klausurcode ist ungültig und kann nicht bearbeitet werden.')
    }
  }

  if (exams.length === 0 && !error) {
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
        Zugewiesene Klausuren erscheinen bei Schüler:innen unter „Klausur schreiben“.
        Code erneut kopieren, bearbeiten oder einer anderen Klasse zuordnen.
      </p>
      {error && <p className="notice notice--error">{error}</p>}
      <ul className="class-exam-manager__list">
        {exams.map((exam) => {
          const expanded = expandedId === exam.id
          const solves = exam.solveCount ?? 0
          return (
            <li key={exam.id} className="class-exam-manager__item">
              <div className="class-exam-manager__meta">
                <strong>{exam.name}</strong>
                <p className="muted small">
                  {exam.className || formatClassCode(exam.hostCode)}
                  {exam.taskCount != null ? ` · ${exam.taskCount} Aufgaben` : ''}
                  {exam.totalPoints != null ? ` · ${exam.totalPoints} P.` : ''}
                  {` · ${solves}× gelöst`}
                </p>
                {expanded && (
                  <textarea
                    className="exam-code__field class-exam-manager__code"
                    readOnly
                    rows={2}
                    value={exam.examCode}
                  />
                )}
              </div>
              <div className="class-exam-manager__actions">
                <label className="muted small">
                  Klasse{' '}
                  <select
                    value={exam.hostCode}
                    disabled={busyId === exam.id || createdClasses.length === 0}
                    onChange={(e) => void onReassign(exam, e.target.value)}
                  >
                    {createdClasses.map((row) => (
                      <option key={row.code} value={row.code}>
                        {row.name}
                      </option>
                    ))}
                    {!createdClasses.some((row) => row.code === exam.hostCode) && (
                      <option value={exam.hostCode}>{formatClassCode(exam.hostCode)}</option>
                    )}
                  </select>
                </label>
                <button
                  type="button"
                  className="ghost"
                  disabled={busyId === exam.id}
                  onClick={() => setExpandedId(expanded ? null : exam.id)}
                >
                  {expanded ? 'Code ausblenden' : 'Code zeigen'}
                </button>
                <button
                  type="button"
                  className="ghost"
                  disabled={busyId === exam.id}
                  onClick={() => void onCopy(exam)}
                >
                  {copiedId === exam.id ? 'Kopiert ✓' : 'Code kopieren'}
                </button>
                <a
                  className="link"
                  href={examCodeWhatsAppUrl(exam.examCode, exam.name)}
                  target="_blank"
                  rel="noopener"
                  onClick={onShareLink}
                >
                  WhatsApp
                </a>
                <a
                  className="link"
                  href={examCodeMailtoUrl(exam.examCode, exam.name)}
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
                    disabled={busyId === exam.id}
                    onClick={() => onEditClick(exam)}
                  >
                    Bearbeiten
                  </button>
                )}
                <button
                  type="button"
                  className="ghost"
                  disabled={busyId === exam.id}
                  onClick={() => void onDelete(exam)}
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
