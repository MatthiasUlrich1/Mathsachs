import { useEffect, useId, useState, type ReactNode } from 'react'
import {
  CONTACT_EMAIL,
  IMPRESSUM_LINES,
  MIT_LICENSE_TEXT,
  buildIdeenmelderMailto,
} from '../legal/content'

type LegalDialog = 'impressum' | 'lizenz' | null

export function LegalFooter({ version }: { version: string }) {
  const [dialog, setDialog] = useState<LegalDialog>(null)
  const mailto = buildIdeenmelderMailto()

  return (
    <>
      <footer className="foot">
        <p>
          Mathsachs {version} · Übungsprogramm nach sächsischem Lehrplan ·
          erweiterbar für weitere Klassen und Fächer
        </p>
        <nav className="foot__legal" aria-label="Rechtliches und Feedback">
          <button
            type="button"
            className="link"
            onClick={() => setDialog('impressum')}
          >
            Impressum
          </button>
          <span className="foot__sep" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className="link"
            onClick={() => setDialog('lizenz')}
          >
            Lizenz
          </button>
          <span className="foot__sep" aria-hidden="true">
            ·
          </span>
          <a className="link" href={mailto}>
            Idee / Feedback
          </a>
        </nav>
      </footer>

      {dialog === 'impressum' && (
        <LegalDialog title="Impressum" onClose={() => setDialog(null)}>
          <address className="impressum">
            {IMPRESSUM_LINES.map((line) =>
              line === CONTACT_EMAIL ? (
                <a key={line} href={`mailto:${CONTACT_EMAIL}`}>
                  {line}
                </a>
              ) : (
                <span key={line}>{line}</span>
              ),
            )}
          </address>
        </LegalDialog>
      )}

      {dialog === 'lizenz' && (
        <LegalDialog title="Lizenz" onClose={() => setDialog(null)}>
          <p className="muted small">
            Mathsachs steht unter der MIT-Lizenz. Der vollständige Text:
          </p>
          <pre className="license-text">{MIT_LICENSE_TEXT}</pre>
        </LegalDialog>
      )}
    </>
  )
}

function LegalDialog({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const titleId = useId()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="dialog card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialog__head">
          <h2 id={titleId} className="section-title no-margin">
            {title}
          </h2>
          <button
            type="button"
            className="update-banner__close"
            aria-label="Schließen"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="dialog__body">{children}</div>
      </div>
    </div>
  )
}
