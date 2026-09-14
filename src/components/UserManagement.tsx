import { useRef, useState } from 'react'
import { loadUser, importUserData } from '../lib/storage'
import { downloadUserExport, parseUserExport } from '../lib/userExport'

interface Props {
  /** Currently active user name. */
  user: string
  /** Called when the user confirms a rename. Provides the new name. */
  onRename: (newName: string) => void
  /** Called when the user confirms deletion. */
  onDelete: () => void
}

/**
 * Profile card section for managing the current user:
 * rename, export data, import data from another device, and delete.
 */
export function UserManagement({ user, onRename, onDelete }: Props) {
  const [renameDraft, setRenameDraft] = useState('')
  const [renameError, setRenameError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const submitRename = () => {
    const name = renameDraft.trim()
    if (!name) {
      setRenameError('Name darf nicht leer sein.')
      return
    }
    if (name === user) {
      setRenameError('Das ist bereits dein Name.')
      return
    }
    setRenameError(null)
    onRename(name)
    setRenameDraft('')
  }

  const handleExport = () => {
    const data = loadUser(user)
    downloadUserExport(data)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      const result = parseUserExport(text)
      if (!result.ok) {
        setImportError(result.error)
        setImportSuccess(null)
      } else {
        importUserData(result.user)
        setImportError(null)
        setImportSuccess(
          `Daten von „${result.user.name}" wurden importiert und zusammengeführt.${
            result.user.name.trim() !== user ? ` Benutzer „${result.user.name.trim()}" ist jetzt verfügbar.` : ''
          }`,
        )
      }
    }
    reader.onerror = () => {
      setImportError('Datei konnte nicht gelesen werden.')
      setImportSuccess(null)
    }
    reader.readAsText(file, 'utf-8')
    // Reset file input so the same file can be picked again
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <section className="card user-mgmt" aria-label="Benutzerverwaltung">
      <h2 className="section-title no-margin">Benutzerverwaltung</h2>
      <p className="muted small">
        Umbenennen, Übungsdaten sichern oder auf ein anderes Gerät übertragen.
      </p>

      {/* ── Umbenennen ─────────────────────────────────────────────────── */}
      <div className="field">
        <span className="field__label">Umbenennen</span>
        <div className="user-mgmt__row">
          <input
            className="answer-input__field"
            type="text"
            placeholder={user}
            value={renameDraft}
            onChange={(e) => {
              setRenameDraft(e.target.value)
              setRenameError(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && submitRename()}
            aria-label="Neuer Benutzername"
            maxLength={60}
          />
          <button
            type="button"
            className="ghost"
            onClick={submitRename}
            disabled={!renameDraft.trim() || renameDraft.trim() === user}
          >
            Übernehmen
          </button>
        </div>
        {renameError && (
          <p className="notice notice--error" role="alert">
            {renameError}
          </p>
        )}
      </div>

      {/* ── Export ─────────────────────────────────────────────────────── */}
      <div className="field">
        <span className="field__label">Übungsdaten exportieren</span>
        <button type="button" className="ghost" onClick={handleExport}>
          Als JSON-Datei speichern
        </button>
        <p className="muted small">
          Lädt alle Übungsergebnisse, Punkte und Einstellungen als Datei herunter.
          Die Datei kann auf einem anderen Gerät importiert werden.
        </p>
      </div>

      {/* ── Import ─────────────────────────────────────────────────────── */}
      <div className="field">
        <span className="field__label">Daten importieren</span>
        <button type="button" className="ghost" onClick={() => fileRef.current?.click()}>
          Datei auswählen …
        </button>
        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <p className="muted small">
          Wähle eine zuvor exportierte JSON-Datei. Vorhandene Daten werden zusammengeführt. Ist
          der importierte Benutzername neu, wird ein neuer Benutzer angelegt.
        </p>
        {importError && (
          <p className="notice notice--error" role="alert">
            {importError}
          </p>
        )}
        {importSuccess && (
          <p className="notice notice--ok" role="status">
            {importSuccess}
          </p>
        )}
      </div>

      {/* ── Löschen ────────────────────────────────────────────────────── */}
      <div className="field">
        <span className="field__label">Benutzer löschen</span>
        {confirmDelete ? (
          <div className="user-mgmt__delete-confirm">
            <p className="notice notice--warn" role="alert">
              Alle Übungsdaten von „{user}" werden <strong>unwiderruflich gelöscht</strong>.
              Erstelle vorher einen Export, um die Daten zu sichern.
            </p>
            <div className="user-mgmt__row">
              <button
                type="button"
                className="ghost user-mgmt__danger"
                onClick={onDelete}
              >
                Ja, löschen
              </button>
              <button
                type="button"
                className="ghost"
                onClick={() => setConfirmDelete(false)}
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="ghost user-mgmt__danger"
            onClick={() => setConfirmDelete(true)}
          >
            Löschen
          </button>
        )}
      </div>
    </section>
  )
}
