import { useEffect, useMemo, useState } from 'react'
import { buildProtocol, subscribeSharedStorage, type ProtocolRow } from '../lib/storage'

interface Props {
  user: string
  onExit: () => void
}

const formatDate = (ms: number) =>
  new Date(ms).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export function Protocol({ user, onExit }: Props) {
  const [protocol, setProtocol] = useState(() => buildProtocol(user))
  useEffect(() => {
    const refresh = () => setProtocol(buildProtocol(user))
    refresh()
    return subscribeSharedStorage(refresh)
  }, [user])

  const grouped = useMemo(() => {
    const map = new Map<string, ProtocolRow[]>()
    for (const row of protocol.rows) {
      const list = map.get(row.areaTitle) ?? []
      list.push(row)
      map.set(row.areaTitle, list)
    }
    return [...map.entries()]
  }, [protocol.rows])

  return (
    <div className="protocol-view">
      <div className="card no-print">
        <div className="session__head">
          <h2 className="section-title no-margin">Punkteprotokoll</h2>
          <button type="button" className="link" onClick={onExit}>
            Zurück
          </button>
        </div>
        <p className="muted small">
          Übersicht für <strong>{user}</strong> — Leistung je Thema in Prozent
          und Punkte.
        </p>
        <button type="button" className="primary" onClick={() => window.print()}>
          Drucken / als PDF speichern
        </button>
      </div>

      <article className="sheet">
        <header className="sheet__head">
          <h1>Mathsachs — Punkteprotokoll</h1>
          <p>
            Schüler/in: <strong>{user}</strong> · erstellt am{' '}
            {formatDate(protocol.generatedAt)}
          </p>
        </header>

        <div className="protocol-summary">
          <div className="protocol-summary__item">
            <span className="big">{protocol.totalPoints}</span>
            <span className="muted small">Punkte gesamt</span>
          </div>
          <div className="protocol-summary__item">
            <span className="big">{protocol.overallPercent}%</span>
            <span className="muted small">Trefferquote gesamt</span>
          </div>
          <div className="protocol-summary__item">
            <span className="big">
              {protocol.totalCorrect}/{protocol.totalAttempts}
            </span>
            <span className="muted small">richtige Aufgaben</span>
          </div>
        </div>

        {protocol.rows.length === 0 ? (
          <p className="muted">
            Noch keine Übungen absolviert. Übe ein Thema, dann erscheint es hier.
          </p>
        ) : (
          grouped.map(([area, rows]) => (
            <section key={area} className="protocol-area">
              <h3>{area}</h3>
              <table className="protocol-table">
                <thead>
                  <tr>
                    <th>Thema</th>
                    <th>Aufgaben</th>
                    <th>Richtig</th>
                    <th>Anteil</th>
                    <th>Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.topicTitle}>
                      <td>{row.topicTitle}</td>
                      <td>{row.attempts}</td>
                      <td>{row.correct}</td>
                      <td>
                        <div className="bar">
                          <div
                            className="bar__fill"
                            style={{ width: `${row.percent}%` }}
                          />
                          <span className="bar__label">{row.percent}%</span>
                        </div>
                      </td>
                      <td>{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))
        )}
      </article>
    </div>
  )
}
