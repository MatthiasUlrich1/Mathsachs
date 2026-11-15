import { useId, useState } from 'react'
import {
  clampExploreState,
  exploreStartState,
  fmtDe,
  getExploreBoard,
  sliderMax,
  type ExploreRef,
  type ExploreState,
} from '../lib/exploreBoards'
import './ExploreBoard.css'

/** Erkundungs-Tafelbild im Fachwissen-Panel (nicht bewertet). Unbekannte ID: zeigt nichts. */
export function ExploreBoard({ boardId, params }: ExploreRef) {
  const def = getExploreBoard(boardId)
  if (!def) return null
  return <ExploreBoardView key={`${boardId}|${JSON.stringify(params ?? {})}`} def={def} params={params} />
}

function ExploreBoardView({
  def,
  params,
}: {
  def: NonNullable<ReturnType<typeof getExploreBoard>>
  params?: Record<string, number>
}) {
  const uid = useId()
  const [state, setState] = useState<ExploreState>(() => exploreStartState(def, params))
  const set = (id: string, value: number) =>
    setState((prev) => clampExploreState(def.controls, { ...prev, [id]: value }))
  const caption = def.describe(state)

  return (
    <section className="explore-board" aria-label={`Erkunden: ${def.title}`}>
      <div
        className="explore-board__figure"
        role="img"
        aria-label={`Erkundungstafel: ${def.title}`}
        dangerouslySetInnerHTML={{ __html: def.render(state) }}
      />
      <p className="explore-board__caption" aria-live="polite">
        {caption}
      </p>
      <div className="explore-board__controls">
        {def.controls.map((c) => {
          const id = `${uid}-${c.id}`
          if (c.type === 'toggle') {
            return (
              <label key={c.id} className="explore-board__toggle" htmlFor={id}>
                <input
                  id={id}
                  type="checkbox"
                  checked={state[c.id] === 1}
                  onChange={(e) => set(c.id, e.target.checked ? 1 : 0)}
                />
                <span>{c.label}</span>
              </label>
            )
          }
          const max = sliderMax(c, state)
          return (
            <div key={c.id} className="explore-board__slider">
              <label htmlFor={id}>
                {c.label}: <strong>{fmtDe(state[c.id])}{c.unit ?? ''}</strong>
              </label>
              <input
                id={id}
                type="range"
                min={c.min}
                max={max}
                step={c.step}
                value={state[c.id]}
                onChange={(e) => set(c.id, Number(e.target.value))}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ExploreBoard
