import { useState } from 'react'
import { ClassApiError } from '../classCode/api'
import { topicContentId } from '../curriculum/contentId'
import {
  isReportCommentValid,
  MAX_REPORT_COMMENT,
  submitTaskReport,
  trimReportComment,
} from '../lib/taskReports'
import { APP_VERSION } from '../updates/version'

interface Props {
  topicId: string
  topicTitle: string
  areaTitle?: string
  contentId?: number
  question?: string
}

type Status = 'idle' | 'open' | 'sending' | 'sent' | 'error'

export function ReportFaultyTask({
  topicId,
  topicTitle,
  areaTitle,
  contentId,
  question,
}: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const resolvedId =
    typeof contentId === 'number' && Number.isFinite(contentId)
      ? Math.floor(contentId)
      : topicContentId(topicId)

  const send = async () => {
    if (status === 'sending' || status === 'sent') return
    if (!isReportCommentValid(comment)) {
      setError('Bitte einen kurzen Kommentar eingeben.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setError(null)
    try {
      await submitTaskReport({
        contentId: resolvedId,
        comment: trimReportComment(comment),
        topicId,
        topicTitle,
        ...(areaTitle?.trim() ? { areaTitle: areaTitle.trim() } : {}),
        ...(question?.trim() ? { question: question.trim() } : {}),
        appVersion: APP_VERSION,
      })
      setStatus('sent')
      setComment('')
    } catch (err) {
      const message =
        err instanceof ClassApiError
          ? err.message
          : 'Meldung konnte nicht gesendet werden.'
      setError(message)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="task-report task-report--done">
        <p className="muted small">Danke — die Aufgabe wurde gemeldet (ID {resolvedId}).</p>
      </div>
    )
  }

  if (status === 'idle') {
    return (
      <div className="task-report">
        <button
          type="button"
          className="link task-report__open"
          onClick={() => setStatus('open')}
        >
          Aufgabe als fehlerhaft melden!
        </button>
      </div>
    )
  }

  return (
    <div className="task-report task-report--open" aria-label="Aufgabe als fehlerhaft melden">
      <p className="muted small">
        Kurzer Hinweis zum Fehler (ID {resolvedId}):
      </p>
      <textarea
        className="task-report__comment"
        rows={3}
        maxLength={MAX_REPORT_COMMENT}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Was stimmt nicht?"
        disabled={status === 'sending'}
      />
      {error && <p className="task-report__error">{error}</p>}
      <div className="task-report__actions">
        <button
          type="button"
          className="ghost"
          disabled={status === 'sending'}
          onClick={() => {
            setStatus('idle')
            setError(null)
            setComment('')
          }}
        >
          Abbrechen
        </button>
        <button
          type="button"
          className="primary"
          disabled={status === 'sending' || !isReportCommentValid(comment)}
          onClick={() => void send()}
        >
          {status === 'sending' ? 'Wird gesendet …' : 'Senden'}
        </button>
      </div>
    </div>
  )
}
