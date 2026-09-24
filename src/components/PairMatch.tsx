import React from 'react'
import './PairMatch.css'

export type PairMatchItem = { id: string; label: string }

export interface PairMatchProps {
  left: PairMatchItem[]
  right: PairMatchItem[]
  /** leftId → rightId (empty string = unpaired) */
  links: Record<string, string>
  onChange: (links: Record<string, string>) => void
  instruction?: string
  disabled?: boolean
  /** After check: per-left-item correct/incorrect (same order as `left`) */
  partResults?: boolean[]
}

/**
 * Two-column click-to-pair matching (no drag slots — no slot-label spoiler).
 * Select a left item, then a right item to link; click a linked left again to clear.
 */
export const PairMatch: React.FC<PairMatchProps> = ({
  left,
  right,
  links,
  onChange,
  instruction,
  disabled = false,
  partResults,
}) => {
  const [pendingLeft, setPendingLeft] = React.useState<string | null>(null)
  const usedRight = new Set(Object.values(links).filter(Boolean))

  const clearPairForRight = (rightId: string, base: Record<string, string>) => {
    const next = { ...base }
    for (const [l, r] of Object.entries(next)) {
      if (r === rightId) next[l] = ''
    }
    return next
  }

  const onLeft = (id: string) => {
    if (disabled) return
    if (links[id]) {
      onChange({ ...links, [id]: '' })
      setPendingLeft(null)
      return
    }
    setPendingLeft(id === pendingLeft ? null : id)
  }

  const onRight = (id: string) => {
    if (disabled || !pendingLeft) return
    let next = clearPairForRight(id, links)
    next = { ...next, [pendingLeft]: id }
    onChange(next)
    setPendingLeft(null)
  }

  const partnerLabel = (leftId: string) => {
    const rid = links[leftId]
    if (!rid) return null
    return right.find((r) => r.id === rid)?.label ?? rid
  }

  return (
    <div className="pair-match">
      {instruction && <p className="pair-match__instruction">{instruction}</p>}
      <div className="pair-match__cols" role="group" aria-label="Begriffspaare zuordnen">
        <div className="pair-match__col">
          <p className="pair-match__col-title">Begriffe</p>
          {left.map((item, idx) => {
            const linked = Boolean(links[item.id])
            const active = pendingLeft === item.id
            const partOk = partResults?.[idx]
            return (
              <button
                key={item.id}
                type="button"
                className={[
                  'pair-match__item',
                  active ? 'pair-match__item--active' : '',
                  linked ? 'pair-match__item--linked' : '',
                  partOk === true ? 'pair-match__item--ok' : '',
                  partOk === false ? 'pair-match__item--bad' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onLeft(item.id)}
                disabled={disabled}
                aria-pressed={active || linked}
              >
                <span>{item.label}</span>
                {linked && (
                  <span className="pair-match__hint">→ {partnerLabel(item.id)}</span>
                )}
              </button>
            )
          })}
        </div>
        <div className="pair-match__col">
          <p className="pair-match__col-title">Erklärungen</p>
          {right.map((item) => {
            const taken = usedRight.has(item.id)
            return (
              <button
                key={item.id}
                type="button"
                className={`pair-match__item pair-match__item--right${taken ? ' pair-match__item--taken' : ''}${pendingLeft ? ' pair-match__item--targetable' : ''}`}
                onClick={() => onRight(item.id)}
                disabled={disabled || !pendingLeft}
                aria-pressed={taken}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
      {pendingLeft && !disabled && (
        <p className="pair-match__status">Tippe rechts die passende Erklärung.</p>
      )}
    </div>
  )
}
