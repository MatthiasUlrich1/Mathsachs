import { useState } from 'react'
import type { Grade } from '../curriculum/types'

interface Props {
  grade: Grade
  onPractice: (topicId: string) => void
  onWorksheet: (topicId: string) => void
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
                  <li key={topic.id} className="topic">
                    <span className="topic__title">{topic.title}</span>
                    <span className="topic__actions">
                      <button
                        type="button"
                        className="chip-btn chip-btn--primary"
                        onClick={() => onPractice(topic.id)}
                      >
                        Üben
                      </button>
                      <button
                        type="button"
                        className="chip-btn"
                        onClick={() => onWorksheet(topic.id)}
                      >
                        Übungsblatt
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}
