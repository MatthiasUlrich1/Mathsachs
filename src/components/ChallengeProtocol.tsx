import { useEffect, useMemo, useState } from 'react'
import {
  ClassApiError,
  getChallenge,
  type ChallengeSummary,
} from '../classCode/api'
import {
  challengePeriodHeading,
  challengeStandHeading,
  challengeThreshold,
  challengeTopicIds,
  challengeTransferHeading,
  classGoalLine,
  prizeAudienceLine,
} from '../challenge/logic'
import type { StoredChallenge } from '../challenge/types'
import {
  buildChallengeProtocol,
  subscribeSharedStorage,
  type ProtocolRow,
} from '../lib/storage'
import type { ClassPointSummary } from '../lib/protocolStats'
import { GradeCompetition } from './GradeCompetition'

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
  return {
    id: challenge.id,
    name: challenge.name,
    topicIds: challengeTopicIds(challenge),
    start: challenge.start,
    end: challenge.end,
    prize: challenge.prize,
    classThreshold: challengeThreshold(challenge),
  }
}

export function ChallengeProtocol({ user, challenge, onExit }: Props) {
  const filter = asFilter(challenge)
  const [protocol, setProtocol] = useState(() => buildChallengeProtocol(user, filter))
  const [live, setLive] = useState<ChallengeSummary | null>(
    'points' in challenge || 'classes' in challenge ? (challenge as ChallengeSummary) : null,
  )
  useEffect(() => {
    const refresh = () => setProtocol(buildChallengeProtocol(user, asFilter(challenge)))
    refresh()
    return subscribeSharedStorage(refresh)
  }, [user, challenge])

  useEffect(() => {
    let cancelled = false
    const id = challenge.id
    if (!id) return
    void getChallenge(id)
      .then((summary) => {
        if (!cancelled) setLive(summary)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        if (err instanceof ClassApiError) return
      })
    return () => {
      cancelled = true
    }
  }, [challenge.id])

  const grouped = useMemo(() => {
    const map = new Map<string, ProtocolRow[]>()
    for (const row of protocol.rows) {
      const list = map.get(row.areaTitle) ?? []
      list.push(row)
      map.set(row.areaTitle, list)
    }
    return [...map.entries()]
  }, [protocol.rows])

  const transferGroups = protocol.transfers.byClass
  const transferTotal = protocol.transferredPoints
  const prize = live?.prize ?? challenge.prize
  const audience = prizeAudienceLine(prize, challenge.scope)
  const threshold = challengeThreshold(live ?? challenge)
  const goal = classGoalLine(threshold)
  const classPoints = live?.points?.total
  const remaining =
    typeof threshold === 'number' && typeof classPoints === 'number'
      ? Math.max(0, threshold - classPoints)
      : null
  const className =
    live && 'className' in live && live.className?.trim() ? live.className.trim() : undefined
  const classes = live && 'classes' in live ? live.classes : undefined
  const reached = live && 'reachedThreshold' in live ? live.reachedThreshold : undefined

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
            <span className="muted small">Meine Challenge-Punkte</span>
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
          <h3>{challengePeriodHeading(challenge.name)}</h3>
          <PeriodStats summary={protocol.period} />
        </section>

        <section className="protocol-transfers">
          <h3>{challengeTransferHeading(challenge.name)}</h3>
          {transferTotal === 0 ? (
            <p className="muted small">
              In diesem Challenge-Fenster noch keine Punkte an eine Klasse
              gesendet.
            </p>
          ) : (
            <>
              <p className="muted small">
                {transferTotal} Punkt{transferTotal === 1 ? '' : 'e'} aus dieser
                Challenge an
                {transferGroups.length === 1 ? (
                  <>
                    {' '}
                    <strong>{transferGroups[0].label}</strong>
                  </>
                ) : (
                  <> {transferGroups.length} Klassen</>
                )}{' '}
                übertragen — gezählt beim Senden, auch wenn das Netz später fehlt.
              </p>
              <PeriodStats summary={protocol.transfers.summary} />
              {transferGroups.length > 1 &&
                transferGroups.map((group) => (
                  <div key={group.code} className="protocol-transfer">
                    <p className="protocol-transfer__title">{group.label}</p>
                    <PeriodStats summary={group.summary} />
                  </div>
                ))}
            </>
          )}
        </section>

        <section className="protocol-grade">
          <h3>{challengeStandHeading(challenge.name)}</h3>
          <p className="muted small">
            Online nur anonyme Summen (Klasse/Stufe). Deine Punkte bleiben lokal.
          </p>
          <p>
            Meine Challenge-Punkte: <strong>{protocol.totalPoints}</strong>
          </p>
          {challenge.scope === 'class' && typeof classPoints === 'number' && (
            <p>
              Klasse{className ? ` ${className}` : ''}:{' '}
              <strong>{classPoints}</strong> Challenge-Punkte
              {reached ? ' (Klassenziel erreicht)' : ''}
            </p>
          )}
          {goal ? (
            <p className="challenge-class-goal">
              <strong>{goal}</strong>
              {remaining != null && remaining > 0
                ? ` — noch ${remaining} Punkt${remaining === 1 ? '' : 'e'}`
                : null}
            </p>
          ) : null}
          {prize.enabled && prize.text ? (
            <p>
              Gewinn: <strong>{prize.text}</strong>
            </p>
          ) : null}
          {audience ? (
            <p>
              Wer gewinnen kann: <strong>{audience.replace(/^Wer gewinnen kann: /, '')}</strong>
            </p>
          ) : null}
          {classes && classes.length > 0 && (
            <GradeCompetition
              title="Stand der Stufe"
              grade={{
                name: challenge.name,
                classes: classes.map((row) => ({
                  id: row.id,
                  name: row.name,
                  points: row.points,
                })),
                points: live?.points ?? {
                  today: 0,
                  week: 0,
                  month: 0,
                  year: 0,
                  total: classes.reduce((sum, row) => sum + row.points.total, 0),
                },
              }}
            />
          )}
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
