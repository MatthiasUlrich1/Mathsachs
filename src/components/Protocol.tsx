import { useEffect, useMemo, useState } from 'react'
import { formatClassCode } from '../classCode/code'
import {
  buildProtocol,
  subscribeSharedStorage,
  type ProtocolRow,
} from '../lib/storage'
import type { ClassPointSummary } from '../lib/protocolStats'

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

function PeriodStats({ summary }: { summary: ClassPointSummary }) {
  return (
    <dl className="protocol-stats">
      <div>
        <dt>Tag</dt>
        <dd>{summary.today}</dd>
      </div>
      <div>
        <dt>Woche</dt>
        <dd>{summary.week}</dd>
      </div>
      <div>
        <dt>Monat</dt>
        <dd>{summary.month}</dd>
      </div>
      <div>
        <dt>Schuljahr</dt>
        <dd>{summary.year}</dd>
      </div>
      <div>
        <dt>Gesamt</dt>
        <dd>{summary.total}</dd>
      </div>
    </dl>
  )
}

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

  const schoolYear = protocol.period.period.schoolYear
  const transferGroups = protocol.transfers.byClass
  const transferTotal = protocol.transfers.summary.total

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

        <section className="protocol-periods">
          <h3>Punkte nach Zeitraum</h3>
          <p className="muted small">
            Aus deinen Übungen auf diesem Gerät. Schuljahr {schoolYear} (1.
            Aug.–31. Jul., Europe/Berlin).
          </p>
          <PeriodStats summary={protocol.period} />
        </section>

        <section className="protocol-transfers">
          <h3>An die Klasse übertragen</h3>
          {transferTotal === 0 ? (
            <p className="muted small">
              Noch keine Punkte an eine Klasse gesendet. Zählt, sobald beim
              Üben Punkte an den aktiven Klassencode gehen sollen.
            </p>
          ) : (
            <>
              <p className="muted small">
                {transferTotal} Punkt{transferTotal === 1 ? '' : 'e'} an
                {transferGroups.length === 1 ? (
                  <>
                    {' '}
                    <strong>{transferGroups[0].label}</strong>
                    {transferGroups[0].className
                      ? ` (${formatClassCode(transferGroups[0].code)})`
                      : ''}
                  </>
                ) : (
                  <> {transferGroups.length} Klassen</>
                )}{' '}
                — gezählt beim Senden, auch wenn das Netz später fehlt.
              </p>
              <PeriodStats summary={protocol.transfers.summary} />
              {transferGroups.length > 1 &&
                transferGroups.map((group) => (
                  <div key={group.code} className="protocol-transfer">
                    <p className="protocol-transfer__title">
                      {group.label}
                      {group.className ? ` · ${formatClassCode(group.code)}` : ''}
                    </p>
                    <PeriodStats summary={group.summary} />
                  </div>
                ))}
            </>
          )}
        </section>

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
