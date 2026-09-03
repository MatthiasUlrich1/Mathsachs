import type { CurriculumModule } from '../curriculum/registry'
import type { TopicHit } from '../curriculum/search'
import type { Topic } from '../curriculum/types'

interface Props {
  query: string
  results: TopicHit[]
  hints: CurriculumModule[]
  onPractice: (topic: Topic, areaTitle: string, gradeTitle: string) => void
  onWorksheet: (topic: Topic, areaTitle: string, gradeTitle: string) => void
  onGoToSetup: () => void
}

export function SearchResults({
  query,
  results,
  hints,
  onPractice,
  onWorksheet,
  onGoToSetup,
}: Props) {
  const nothing = results.length === 0 && hints.length === 0

  return (
    <div className="search-results">
      <p className="muted small">
        {results.length === 0
          ? 'Keine Treffer in den geladenen Klassen.'
          : `${results.length} Treffer für „${query.trim()}“ in den geladenen Klassen.`}
      </p>

      {results.length > 0 && (
        <ul className="topics search-hits">
          {results.map((hit) => (
            <li key={`${hit.moduleId}:${hit.topic.id}`} className="topic">
              <span className="topic__info">
                <span className="topic__title">{hit.topic.title}</span>
                <span className="topic__meta">
                  {hit.gradeTitle} · {hit.areaTitle}
                </span>
              </span>
              <span className="topic__actions">
                <button
                  type="button"
                  className="chip-btn chip-btn--primary"
                  onClick={() => onPractice(hit.topic, hit.areaTitle, hit.gradeTitle)}
                >
                  Üben
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => onWorksheet(hit.topic, hit.areaTitle, hit.gradeTitle)}
                >
                  Übungsblatt
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {hints.length > 0 && (
        <div className="search-hint-box">
          <p className="muted small no-margin">
            Passende Themen in weiteren, noch nicht geladenen Klassen:
          </p>
          <ul className="search-hint-list">
            {hints.map((mod) => (
              <li key={mod.id} className="search-hint">
                <span>
                  In <strong>{mod.gradeTitle}</strong> verfügbar – im Reiter „Lehrpläne“
                  laden.
                </span>
                <button type="button" className="chip-btn" onClick={onGoToSetup}>
                  Zu den Lehrplänen
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {nothing && (
        <p className="muted small">
          Versuche es mit einem anderen Stichwort, z. B. „Fläche“, „umrechnen“,
          „Pythagoras“ oder „Bruch“.
        </p>
      )}
    </div>
  )
}
