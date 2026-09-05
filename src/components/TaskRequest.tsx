import { useEffect, useMemo, useState } from 'react'
import {
  TASK_REQUEST_ATTACHMENT_NOTE,
  TASK_REQUEST_GRADES,
  buildTaskRequestMailto,
  isTaskRequestComplete,
  keepValidArea,
  loadTaskRequestAreas,
} from '../legal/taskRequest'

export function TaskRequest() {
  const [grade, setGrade] = useState('')
  const [area, setArea] = useState('')
  const [title, setTitle] = useState('')
  const [example, setExample] = useState('')
  const [areas, setAreas] = useState<string[]>([])
  const [areasLoading, setAreasLoading] = useState(false)

  useEffect(() => {
    if (!grade) {
      setAreas([])
      setAreasLoading(false)
      return
    }
    let cancelled = false
    setAreasLoading(true)
    void loadTaskRequestAreas(grade)
      .then((titles) => {
        if (cancelled) return
        setAreas(titles)
        setArea((current) => keepValidArea(current, titles))
        setAreasLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setAreas([])
        setArea('')
        setAreasLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [grade])

  const fields = useMemo(
    () => ({ grade, area, title, example }),
    [grade, area, title, example],
  )
  const complete = isTaskRequestComplete(fields)
  const mailto = complete ? buildTaskRequestMailto(fields) : ''
  const areaDisabled = !grade || areasLoading || areas.length === 0

  return (
    <section className="card" aria-label="Aufgaben ergänzen">
      <div className="session__head">
        <div>
          <h2 className="section-title no-margin">Aufgaben ergänzen</h2>
          <p className="muted small">
            Lehrer können Vorgaben für neue Übungsaufgaben senden. Die Mail
            geht an uns — auf dem Klassen-Server werden keine Personendaten
            gespeichert.
          </p>
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="task-request-grade">
          Klassenstufe
        </label>
        <select
          id="task-request-grade"
          className="answer-input__field"
          value={grade}
          onChange={(event) => {
            setGrade(event.target.value)
            setArea('')
          }}
        >
          <option value="">Klassenstufe wählen</option>
          {TASK_REQUEST_GRADES.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="task-request-area">
          Themengebiet
        </label>
        <select
          id="task-request-area"
          className="answer-input__field"
          value={area}
          disabled={areaDisabled}
          onChange={(event) => setArea(event.target.value)}
        >
          <option value="">
            {!grade
              ? 'Zuerst Klassenstufe wählen'
              : areasLoading
                ? 'Themengebiete werden geladen …'
                : 'Themengebiet wählen'}
          </option>
          {areas.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="task-request-title">
          Titel des Themas
        </label>
        <input
          id="task-request-title"
          className="answer-input__field"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="z. B. Brüche addieren mit ungleichem Nenner"
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="task-request-example">
          Aufgabenbeispiel
        </label>
        <textarea
          id="task-request-example"
          className="answer-input__field task-request__example"
          rows={5}
          value={example}
          onChange={(event) => setExample(event.target.value)}
          placeholder="z. B. Berechne 1/2 + 1/3."
        />
        <p className="muted small task-request__hint">
          Du kannst Beispiele auch als Anhang an die E-Mail hängen. Schreibe
          dann hier <strong>{TASK_REQUEST_ATTACHMENT_NOTE}</strong>.
        </p>
        <button
          type="button"
          className="chip-btn task-request__attach"
          onClick={() => setExample(TASK_REQUEST_ATTACHMENT_NOTE)}
        >
          {TASK_REQUEST_ATTACHMENT_NOTE} eintragen
        </button>
      </div>

      <div className="field">
        {complete ? (
          <a className="primary task-request__send" href={mailto}>
            Vorgaben senden
          </a>
        ) : (
          <button type="button" className="primary" disabled>
            Vorgaben senden
          </button>
        )}
      </div>
    </section>
  )
}
