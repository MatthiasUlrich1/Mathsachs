import { useState } from 'react'
import type { UserInput } from '../curriculum/types'
import {
  DIVIDE_MAX_PARTS,
  DIVIDE_MIN_PARTS,
  DIVIDE_PERSON_FILLS,
  DIVIDE_LABEL_FONT,
  assignPart,
  clampParts,
  divideCountLabel,
  divideLayout,
  dividePersonName,
  emptyAssignment,
  normalizeAssignment,
  partsPerPerson,
  type DivideShape,
} from '../lib/divideToolLogic'
import './DivideTool.css'

type DivideToolValue = Extract<UserInput, { kind: 'divideTool' }>

export interface DivideToolProps {
  shape: DivideShape
  count: number
  persons: number
  /** Singular noun of the wholes for screen readers, e.g. "Pizza". */
  objectName?: string
  value: DivideToolValue
  onChange: (value: UserInput) => void
  instruction?: string
  disabled?: boolean
}

export interface DivideToolBoardProps extends DivideToolProps {
  /** Part picked up and waiting for a person, or null. Owned by the caller so the board stays hook-free (and testable). */
  selected: number | null
  onSelect: (part: number | null) => void
}

const keyActivate = (run: () => void) => (e: { key: string; preventDefault: () => void }) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    run()
  }
}

/** The dividing tool itself (no own state): stepper, wholes with their parts, and the people. */
export function DivideToolBoard({
  shape,
  count,
  persons,
  objectName,
  value,
  onChange,
  instruction,
  disabled,
  selected,
  onSelect,
}: DivideToolBoardProps) {
  const parts = clampParts(value.partsPerWhole)
  const assignment = normalizeAssignment(count, parts, persons, value.assignment)
  const layout = divideLayout(shape, count, persons, parts)
  const held = partsPerPerson(persons, assignment)
  const name = objectName || (shape === 'bar' ? 'Schokoriegel' : 'Pizza')
  const pending = selected !== null && selected >= 0 && selected < assignment.length ? selected : null

  const emit = (nextParts: number, nextAssignment: Array<number | null>) =>
    onChange({ kind: 'divideTool', partsPerWhole: nextParts, assignment: nextAssignment })

  // A new division makes the old hand-out meaningless: start over.
  const setParts = (next: number) => {
    if (disabled) return
    const p = clampParts(next)
    if (p === parts) return
    onSelect(null)
    emit(p, emptyAssignment(count, p))
  }

  const tapPart = (part: number) => {
    if (disabled) return
    onSelect(pending === part ? null : part)
  }

  const tapPerson = (person: number) => {
    if (disabled || pending === null) return
    emit(parts, assignPart(count, parts, persons, assignment, pending, person))
    onSelect(null)
  }

  return (
    <div className="divide-tool">
      {instruction && <p className="divide-tool__instruction">{instruction}</p>}
      <div className="divide-tool__stepper" role="group" aria-label="Teile pro Ganzes">
        <button
          type="button"
          className="divide-tool__step"
          aria-label="Ein Teil pro Ganzes weniger"
          disabled={disabled || parts <= DIVIDE_MIN_PARTS}
          onClick={() => setParts(parts - 1)}
        >
          −
        </button>
        <span className="divide-tool__parts" data-testid="divide-parts" aria-live="polite">
          {parts === 1 ? 'Ungeteilt' : `${parts} Teile pro Ganzes`}
        </span>
        <button
          type="button"
          className="divide-tool__step"
          aria-label="Ein Teil pro Ganzes mehr"
          disabled={disabled || parts >= DIVIDE_MAX_PARTS}
          onClick={() => setParts(parts + 1)}
        >
          +
        </button>
      </div>
      <svg
        className="divide-tool__svg"
        viewBox={`0 0 ${layout.viewBoxW} ${layout.viewBoxH}`}
        role="group"
        aria-disabled={disabled ? true : undefined}
        aria-label={`Teilwerkzeug: ${count} ${name}, ${persons} Kinder, ${assignment.filter((v) => v !== null).length} von ${assignment.length} Teilen verteilt`}
      >
        {layout.objects.map((o) => (
          <g key={o.index} data-testid="divide-object">
            {o.parts.map((p, s) => {
              const owner = assignment[p.part] ?? null
              const isSel = pending === p.part
              return (
                <g key={p.part}>
                  <path
                    d={p.d}
                    data-testid="divide-part"
                    data-part={p.part}
                    data-owner={owner === null ? '' : String(owner)}
                    data-selected={isSel ? 'true' : 'false'}
                    className={`divide-tool__part${isSel ? ' divide-tool__part--selected' : ''}`}
                    fill={owner === null ? '#ffffff' : DIVIDE_PERSON_FILLS[owner % DIVIDE_PERSON_FILLS.length]}
                    role="button"
                    aria-pressed={isSel}
                    aria-disabled={disabled ? true : undefined}
                    aria-label={`${name} ${o.index + 1}, Teil ${s + 1} von ${parts}, ${owner === null ? 'noch nicht verteilt' : dividePersonName(owner)}`}
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => tapPart(p.part)}
                    onKeyDown={keyActivate(() => tapPart(p.part))}
                  />
                  {owner !== null && (
                    <text
                      className="divide-tool__owner"
                      x={p.labelX}
                      y={p.labelY}
                      textAnchor="middle"
                      fontSize={DIVIDE_LABEL_FONT}
                    >
                      {owner + 1}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        ))}
        {layout.people.map((p) => (
          <g key={p.index}>
            <rect
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              rx={8}
              data-testid="divide-person"
              data-person={p.index}
              className={`divide-tool__person${pending !== null ? ' divide-tool__person--ready' : ''}`}
              fill={DIVIDE_PERSON_FILLS[p.index % DIVIDE_PERSON_FILLS.length]}
              role="button"
              aria-disabled={disabled || pending === null ? true : undefined}
              aria-label={`${dividePersonName(p.index)}, ${divideCountLabel(held[p.index] ?? 0)}`}
              tabIndex={disabled ? -1 : 0}
              onClick={() => tapPerson(p.index)}
              onKeyDown={keyActivate(() => tapPerson(p.index))}
            />
            <text className="divide-tool__name" x={p.x + p.w / 2} y={p.nameY} textAnchor="middle" fontSize={13}>
              {dividePersonName(p.index)}
            </text>
            <text className="divide-tool__count" x={p.x + p.w / 2} y={p.countY} textAnchor="middle" fontSize={11}>
              {divideCountLabel(held[p.index] ?? 0)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/** Interactive dividing tool: cut the wholes into equal parts, tap a part, tap the child who gets it. */
export function DivideTool(props: DivideToolProps) {
  const [selected, setSelected] = useState<number | null>(null)
  return <DivideToolBoard {...props} selected={selected} onSelect={setSelected} />
}
