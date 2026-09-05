import { useMemo, useState } from 'react'
import {
  TASK_REQUEST_GRADES,
  buildTaskRequestMailto,
  isTaskRequestComplete,
} from '../legal/taskRequest'

export function TaskRequest() {
  const [grade, setGrade] = useState('')
  const [area, setArea] = useState('')
  const [title, setTitle] = useState('')
  const [example, setExample] = useState('')

  const fields = useMemo(
    () => ({ grade, area, title, example }),
    [grade, area, title, example],
  )
  const complete = isTaskRequestComplete(fields)
  const mailto = complete ? buildTaskRequestMailto(fields) : ''

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
          onChange={(event) => setGrade(event.target.value)}
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
        <input
          id="task-request-area"
          className="answer-input__field"
          type="text"
          value={area}
          onChange={(event) => setArea(event.target.value)}
          placeholder="z. B. Brüche"
        />
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
