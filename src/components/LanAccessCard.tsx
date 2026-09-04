import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import type { LanServerStatus } from '../updates/types'

export function LanAccessCard({ status }: { status: LanServerStatus }) {
  const primary = status.lanUrls[0] ?? status.urls[0] ?? null
  const extras = status.urls.filter((url) => url !== primary)
  const [copied, setCopied] = useState(false)
  const [qr, setQr] = useState<string | null>(null)

  useEffect(() => {
    if (!primary) {
      setQr(null)
      return
    }
    let cancelled = false
    QRCode.toDataURL(primary, { margin: 1, width: 180 })
      .then((url) => {
        if (!cancelled) setQr(url)
      })
      .catch(() => {
        if (!cancelled) setQr(null)
      })
    return () => {
      cancelled = true
    }
  }, [primary])

  const copy = async () => {
    if (!primary) return
    try {
      await navigator.clipboard.writeText(primary)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const openInBrowser = () => {
    if (!primary) return
    void window.mathsachs?.openExternal(primary)
  }

  if (!status.running) {
    return (
      <section className="card lan-card no-print" aria-label="WLAN-Zugang">
        <h2 className="section-title no-margin">WLAN-Zugang</h2>
        <p className="muted small">
          Der lokale Webserver konnte nicht starten
          {status.error ? `: ${status.error}` : '.'} Tablets im Netz können die
          App deshalb gerade nicht im Browser öffnen.
        </p>
      </section>
    )
  }

  return (
    <section className="card lan-card no-print" aria-label="WLAN-Zugang">
      <h2 className="section-title no-margin">WLAN-Zugang</h2>
      <p className="muted small">
        Solange Mathsachs auf diesem Rechner geöffnet ist, können Geräte im
        selben WLAN die Übungs-App im Browser öffnen — ohne Installation. Die
        App muss laufen bleiben. Benutzer und Punkte liegen auf diesem Rechner
        und werden mit Tablets geteilt.
      </p>

      {status.lanUrls.length === 0 && (
        <p className="notice notice--warn">
          Es wurde keine WLAN-Adresse gefunden. Andere Geräte erreichen den
          Rechner gerade nicht. Zum Testen auf diesem Rechner:
          <code className="lan-card__url">{status.urls[0]}</code>
        </p>
      )}

      {primary && (
        <div className="lan-card__row">
          <div className="lan-card__urls">
            <span className="field__label">Adresse für Tablet / Handy</span>
            <code className="lan-card__url">{primary}</code>
            {extras.length > 0 && (
              <p className="muted small">
                Weitere Adressen dieses Rechners:{' '}
                {extras.map((url) => url).join(' · ')}
              </p>
            )}
            <div className="lan-card__actions">
              <button type="button" className="primary" onClick={() => void copy()}>
                {copied ? 'Kopiert ✓' : 'Adresse kopieren'}
              </button>
              <button type="button" className="ghost" onClick={openInBrowser}>
                Im Browser öffnen
              </button>
            </div>
          </div>
          {qr && (
            <div className="lan-card__qr">
              <img src={qr} alt="QR-Code zur WLAN-Adresse" width={180} height={180} />
              <p className="muted small">QR-Code scannen</p>
            </div>
          )}
        </div>
      )}

      <p className="muted small">
        Windows/macOS kann beim ersten Start nach der Freigabe in der Firewall
        fragen — bitte für private Netze erlauben. In Schulnetzen mit
        Client-Isolation sehen Tablets den Rechner oft nicht. Es gibt kein
        Passwort: wer die Adresse kennt und im selben Netz ist, kann üben.
        Benutzerliste und Punkte sind dieselben wie in der Desktop-App und
        aktualisieren sich gegenseitig, solange Mathsachs läuft.
      </p>
    </section>
  )
}
