import { useEffect, useState } from 'react'
import {
  ClassApiError,
  deleteClassExam,
  updateClassExam,
  type ClassExamSummary,
} from '../classCode/api'
import { deleteClassExamConfirm } from '../exam/classExamTypes'
import type { StoredClassExam } from '../exam/classExamTypes'
import {
  forgetCreatedClassExam,
  getClassCodeSettings,
  getCreatedClassExams,
  rememberCreatedClassExam,
  subscribeSharedStorage,
} from '../lib/storage'
import { formatClassCode } from '../classCode/code'

interface Props {
  /** Refresh token from parent after a new assign. */
  refreshKey?: number
}

export function ClassExamManager({ refreshKey = 0 }: Props) {
  const [exams, setExams] = useState<StoredClassExam[]>(() => getCreatedClassExams())
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const createdClasses = getClassCodeSettings().created

  useEffect(() => {
    const refresh = () => setExams(getCreatedClassExams())
    refresh()
    return subscribeSharedStorage(refresh)
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
      </p>
      {error && <p className="notice notice--error">{error}</p>}
      <ul className="class-exam-manager__list">
        {exams.map((exam) => (
          <li key={exam.id} className="class-exam-manager__item">
            <div>
              <strong>{exam.name}</strong>
              <p className="muted small">
                {exam.className || formatClassCode(exam.hostCode)}
                {exam.taskCount != null ? ` · ${exam.taskCount} Aufgaben` : ''}
                {exam.totalPoints != null ? ` · ${exam.totalPoints} P.` : ''}
              </p>
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
                onClick={() => void onDelete(exam)}
              >
                Löschen
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
