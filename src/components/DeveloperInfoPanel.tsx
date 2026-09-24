import { useCallback, useEffect, useState } from 'react'
import { fetchSchuelerAnswerCount } from '../lib/schuelerAnswerStats'
import { countSchuelerAnswerAttempts } from '../lib/storage'

/** Entwickler-only: anonymous practice telemetry (local + global). */
export function DeveloperInfoPanel() {
  const [localCount, setLocalCount] = useState(() => countSchuelerAnswerAttempts())
  const [globalCount, setGlobalCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLocalCount(countSchuelerAnswerAttempts())
    setLoading(true)
    const remote = await fetchSchuelerAnswerCount()
    setGlobalCount(remote)
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <section className="card">
      <h2 className="section-title">Info</h2>
      <p className="muted small">
        Nur Entwickleransicht. Aggregierte Zähler — keine Namen, keine Aufgabeninhalte.
      </p>
      <dl className="info-stats">
        <div className="info-stats__row">
          <dt>Schüler-Antworten (dieses Gerät)</dt>
          <dd>{localCount.toLocaleString('de-DE')}</dd>
        </div>
        <div className="info-stats__row">
          <dt>Schüler-Antworten (global, anonym)</dt>
          <dd>
            {loading && globalCount == null
              ? '…'
              : globalCount != null
                ? globalCount.toLocaleString('de-DE')
                : '— (offline oder Worker noch nicht deployed)'}
          </dd>
        </div>
      </dl>
      <p className="muted small">
        Lokal: Summe der geprüften Übungs- und Klausurantworten aller Profile mit Rolle
        Schüler auf diesem Rechner. Global: anonymer Cloudflare-Zähler (+1 pro geprüfte
        Schülerantwort, ohne Geräte-ID).
      </p>
      <button type="button" className="ghost" onClick={() => void refresh()}>
        Aktualisieren
      </button>
    </section>
  )
}
