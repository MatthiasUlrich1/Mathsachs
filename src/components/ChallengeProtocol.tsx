import { useEffect, useMemo, useState } from 'react'
import {
  buildChallengeProtocol,
  subscribeSharedStorage,
  type ProtocolRow,
} from '../lib/storage'
import type { StoredChallenge } from '../challenge/types'
import type { ChallengeSummary } from '../classCode/api'
import type { ClassPointSummary } from '../lib/protocolStats'

interface Props {
  user: string
  challenge: ChallengeSummary | StoredChallenge
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

function asFilter(challenge: ChallengeSummary | StoredChallenge) {
  const topicIds =
    'topicIds' in challenge && challenge.topicIds.length
      ? challenge.topicIds
      : challenge.topics.map((topic) => topic.id)
  return {
    name: challenge.name,
    topicIds,
    start: challenge.start,
    end: challenge.end,
  }
}

export function ChallengeProtocol({ user, challenge, onExit }: Props) {
  const filter = asFilter(challenge)
  const [protocol, setProtocol] = useState(() => buildChallengeProtocol(user, filter))
  useEffect(() => {
    const refresh = () => setProtocol(buildChallengeProtocol(user, filter))
    refresh()
    return subscribeSharedStorage(refresh)
  }, [user, challenge.name, challenge.start, challenge.end])

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
          <h2 className="section-title no-margin">Challenge-Protokoll</h2>
          <button type="button" className="link" onClick={onExit}>
            Zurück
          </button>
        </div>
        <p className="muted small">
          Lokaler Nachweis für <strong>{user}</strong> in der Challenge{' '}
          <strong>{challenge.name}</strong>. Wird nicht an den Klassen-Server
          gesendet.
        </p>
        <button type="button" className="primary" onClick={() => window.print()}>
          Drucken / als PDF speichern
        </button>
      </div>

      <article className="sheet">
        <header className="sheet__head">
          <h1>Mathsachs — Challenge-Protokoll</h1>
          <p>
            Schüler/in: <strong>{user}</strong> · Challenge:{' '}
            <strong>{challenge.name}</strong> · erstellt am{' '}
            {formatDate(protocol.generatedAt)}
          </p>
        </header>

        <div className="protocol-summary">
          <div className="protocol-summary__item">
            <span className="big">{protocol.totalPoints}</span>
            <span className="muted small">Challenge-Punkte</span>
          </div>
          <div className="protocol-summary__item">
            <span className="big">{protocol.overallPercent}%</span>
            <span className="muted small">Trefferquote</span>
          </div>
          <div className="protocol-summary__item">
            <span className="big">
              {protocol.totalCorrect}/{protocol.totalAttempts}
            </span>
            <span className="muted small">richtige Aufgaben</span>
          </div>
        </div>

        <section className="protocol-periods">
          <h3>Punkte im Challenge-Zeitraum</h3>
          <PeriodStats summary={protocol.period} />
        </section>

        {protocol.rows.length === 0 ? (
          <p className="muted">
            Noch keine Übungen in den Challenge-Themen in diesem Zeitraum.
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
