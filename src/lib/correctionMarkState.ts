/**
 * Which correction mark the red margin shows for a checked answer.
 * Pure helper so the decision is testable without a DOM.
 */
export type CheckPhase = 'answering' | 'correct' | 'partial' | 'wrong'

export type CorrectionMarkState = {
  /** half = a tick in hand-drawn parentheses "(✓)": partly right. */
  kind: 'tick' | 'cross' | 'half'
  /** Text alternative for screen readers. */
  label: string
}

export function markStateForPhase(phase: CheckPhase): CorrectionMarkState | null {
  switch (phase) {
    case 'correct':
      return { kind: 'tick', label: 'Richtig' }
    case 'partial':
      return { kind: 'half', label: 'Teilweise richtig' }
    case 'wrong':
      return { kind: 'cross', label: 'Leider falsch' }
    default:
      return null
  }
}

/** Text for the persistent live region; empty while answering. */
export function announcementForPhase(
  phase: CheckPhase,
  awarded: number,
  showPoints: boolean,
): string {
  const pts = showPoints && awarded > 0 ? ` Plus ${awarded} Punkte.` : ''
  switch (phase) {
    case 'correct':
      return `Richtig!${pts}`
    case 'partial':
      return `Teilweise richtig.${pts}`
    case 'wrong':
      return 'Leider falsch.'
    default:
      return ''
  }
}
