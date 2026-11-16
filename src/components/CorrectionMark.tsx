import './CorrectionMark.css'
import type { CorrectionMarkState } from '../lib/correctionMarkState'

// Slightly uneven, hand-drawn looking strokes (viewBox 32x32).
// pathLength=1 lets the CSS draw them with a fixed dasharray of 1.
const TICK_PATH =
  'M4.5 16.8 C7 19.2 9.6 22.4 12.2 25.4 C16.4 17.4 22 10.2 28.6 5.2'
const CROSS_PATH =
  'M6.2 6.6 C11 11.2 19.6 20.8 25.8 26.2 M26.4 5.6 C20.2 12.4 12.4 20.2 5.6 26.6'

// Half: smaller tick between two uneven parentheses.
const HALF_TICK_PATH = 'M10.4 16.6 C12 18.4 13.8 20.6 15.6 23 C18.6 17.6 21.6 13 22.8 11.4'
const HALF_PARENS_PATH =
  'M8.4 4.2 C2.8 10.6 2.6 21.2 8.2 27.8 M23.8 4.4 C29.4 10.8 29.4 21.4 23.6 27.6'

type Props = CorrectionMarkState & {
  /**
   * false when the same text is already shown next to the answer: the mark
   * is then purely decorative so screen readers announce it only once.
   */
  announce?: boolean
}

export function CorrectionMark({ kind, label, announce = true }: Props) {
  const a11y = announce
    ? ({ role: 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': true } as const)
  return (
    <span className={`correction-mark correction-mark--${kind}`} {...a11y}>
      <svg viewBox="0 0 32 32" focusable="false" aria-hidden="true">
        {kind === 'half' ? (
          <>
            <path
              className="correction-mark__path correction-mark__parens"
              pathLength={1}
              d={HALF_PARENS_PATH}
            />
            <path
              className="correction-mark__path correction-mark__tick"
              pathLength={1}
              d={HALF_TICK_PATH}
            />
          </>
        ) : (
          <path
            className="correction-mark__path"
            pathLength={1}
            d={kind === 'tick' ? TICK_PATH : CROSS_PATH}
          />
        )}
      </svg>
    </span>
  )
}

/**
 * Live region that exists before the answer is checked (a region inserted
 * together with its text is often not announced) and receives the result.
 */
export function CheckAnnouncement({ text }: { text: string }) {
  return (
    <div className="visually-hidden" role="status" aria-live="polite">
      {text}
    </div>
  )
}
