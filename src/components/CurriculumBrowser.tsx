import { useState } from 'react'
import type { Grade, Topic } from '../curriculum/types'
import { TeacherExtraBadge } from './TeacherExtraBadge'

interface Props {
  grade: Grade
  onPractice: (topic: Topic, areaTitle: string) => void
  onWorksheet: (topic: Topic, areaTitle: string) => void
}

const DIFFICULTY_LABEL: Record<number, string> = {
  1: 'Basis',
  2: 'Standard',
  3: 'Erweiterung',
}

function DifficultyBadge({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className={`difficulty-badge difficulty-badge--${level}`} title={DIFFICULTY_LABEL[level]}>
      {'★'.repeat(level)}
    </span>
  )
}

function TopicRow({
  topic,
  areaTitle,
  onPractice,
  onWorksheet,
}: {
  topic: Topic
  areaTitle: string
  onPractice: (topic: Topic, areaTitle: string) => void
  onWorksheet: (topic: Topic, areaTitle: string) => void
}) {
  const [fwOpen, setFwOpen] = useState(false)

  return (
    <li className="topic">
      <div className="topic__header">
        <span className="topic__title">
          {topic.title}
          <TeacherExtraBadge source={topic.source} />
          {topic.difficulty != null && <DifficultyBadge level={topic.difficulty} />}
        </span>
        <span className="topic__actions">
          {topic.outlineOnly ? (
            <span className="topic__outline">noch keine Aufgaben</span>
          ) : (
            <>
              <button
                type="button"
                className="chip-btn chip-btn--primary"
                onClick={() => onPractice(topic, areaTitle)}
              >
                Üben
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => onWorksheet(topic, areaTitle)}
              >
                Übungsblatt
              </button>
            </>
          )}
          {topic.fachwissen && (
            <button
              type="button"
              className="chip-btn chip-btn--info"
              aria-expanded={fwOpen}
              onClick={() => setFwOpen((v) => !v)}
            >
              {fwOpen ? 'Wissen ▲' : 'Wissen ▼'}
            </button>
          )}
        </span>
      </div>

      {fwOpen && topic.fachwissen && (
        <div className="fachwissen-card">
          <p className="fachwissen-card__text">{topic.fachwissen.text}</p>
          {topic.fachwissen.quelle && (
            <p className="fachwissen-card__source">
              Quelle:{' '}
              {topic.fachwissen.url ? (
                <a
                  href={topic.fachwissen.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {topic.fachwissen.quelle}
                </a>
              ) : (
                topic.fachwissen.quelle
              )}
              {topic.fachwissen.url && (
                <span className="fachwissen-card__license"> (CC BY-SA 4.0)</span>
              )}
            </p>
          )}
        </div>
      )}
    </li>
  )
}

export function CurriculumBrowser({ grade, onPractice, onWorksheet }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    [grade.areas[0]?.id ?? '']: true,
  })

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="browser">
      {grade.areas.map((area) => {
        const isOpen = !!open[area.id]
        return (
          <section key={area.id} className="area">
            <button
              type="button"
              className="area__header"
              onClick={() => toggle(area.id)}
              aria-expanded={isOpen}
            >
              <span className={`area__chevron ${isOpen ? 'is-open' : ''}`}>
                ▸
              </span>
              <span className="area__title">{area.title}</span>
              <span className="area__count">{area.topics.length} Themen</span>
            </button>

            {isOpen && (
              <ul className="topics">
                {area.topics.map((topic) => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    areaTitle={area.title}
                    onPractice={onPractice}
                    onWorksheet={onWorksheet}
                  />
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}
