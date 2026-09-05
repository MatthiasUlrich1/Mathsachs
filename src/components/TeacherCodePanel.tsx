import { useState } from 'react'
import {
  TEACHER_CODE_REQUEST_LABEL,
  buildTeacherCodeRequestMailto,
  formatTeacherCode,
} from '../lib/teacherCode'
import { USER_ROLES, type UserRole } from '../lib/roles'

export function TeacherCodeRequestButton({
  className = 'ghost',
}: {
  className?: string
}) {
  return (
    <a className={className} href={buildTeacherCodeRequestMailto()}>
      {TEACHER_CODE_REQUEST_LABEL}
    </a>
  )
}

export function TeacherCodeReveal() {
  const [copied, setCopied] = useState(false)
  const formatted = formatTeacherCode()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(formatted)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="teacher-code" aria-label="Lehrercode">
      <p className="field__label">Lehrercode</p>
      <p className="class-codes__code">{formatted}</p>
      <p className="muted small">
        Derselbe Code gilt für alle Lehrer. Gib ihn an andere Lehrer der Schule
        weiter — nicht an Schüler. Auf dem Klassen-Server wird nichts dazu
        gespeichert.
      </p>
      <button type="button" className="link" onClick={() => void copy()}>
        {copied ? 'Kopiert' : 'Lehrercode kopieren'}
      </button>
    </div>
  )
}

export function TeacherCodeGate({
  value,
  onChange,
  error,
  id = 'teacher-code',
  confirmLabel,
  onConfirm,
}: {
  value: string
  onChange: (value: string) => void
  error?: string | null
  id?: string
  confirmLabel?: string
  onConfirm?: () => void
}) {
  return (
    <div className="teacher-code-gate">
      <p className="muted small">
        Lehrer und Klassenlehrer nur mit Lehrercode — damit Schüler keine
        Stufen oder Klassen anlegen. Den Code kannst du per Mail anfordern.
        Die Mail geht an uns; auf dem Klassen-Server werden keine Personendaten
        gespeichert.
      </p>
      <div className="field">
        <label className="field__label" htmlFor={id}>
          Lehrercode
        </label>
        <input
          id={id}
          className="answer-input__field"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="z. B. ABCD-EFGH"
        />
      </div>
      {error ? (
        <p className="notice notice--error" role="alert">
          {error}
        </p>
      ) : null}
      {onConfirm && confirmLabel ? (
        <button type="button" className="primary" onClick={onConfirm}>
          {confirmLabel}
        </button>
      ) : null}
      <TeacherCodeRequestButton />
    </div>
  )
}

export function RoleOptions({
  name,
  value,
  onSelect,
}: {
  name: string
  value: UserRole | null
  onSelect: (role: UserRole) => void
}) {
  return (
    <fieldset className="role-fieldset">
      <legend className="field__label">Rolle</legend>
      <div className="role-options">
        {USER_ROLES.map((entry) => (
          <label
            key={entry.id}
            className={`role-option ${
              value === entry.id ? 'role-option--active' : ''
            }`}
          >
            <input
              type="radio"
              name={name}
              value={entry.id}
              checked={value === entry.id}
              onChange={() => onSelect(entry.id)}
            />
            {entry.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
