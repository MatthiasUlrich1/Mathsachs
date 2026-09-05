/** Class-only or whole grade (Stufe). */
export type ChallengeScope = 'class' | 'grade'

/** Gewinnchance — text is shown; no online student names. */
export interface ChallengePrize {
  enabled: boolean
  classPrize?: boolean
  studentPrize?: boolean
  /** Only for Klassenchallenge + Klassen-Gewinn. */
  classThreshold?: number
  text?: string
}

export interface ChallengeTopicRef {
  id: string
  title?: string
}

/** Local copy on Lehrer/Klassenlehrer (LAN merge). Never posted to the Worker. */
export interface StoredChallenge {
  id: string
  scope: ChallengeScope
  hostCode: string
  name: string
  topicIds: string[]
  topics: ChallengeTopicRef[]
  start: string
  end: string
  prize: ChallengePrize
  createdAt: number
}

export const NO_ACTIVE_CHALLENGE_MESSAGE = 'Aktuell keine Challenge aktiv.'

export const CHALLENGE_PHASE_LABEL = {
  upcoming: 'Angelegt',
  active: 'Laufend',
  ended: 'Beendet',
} as const

export const CLASS_GOAL_PREFIX = 'Klassenziel:'

export const MAX_CHALLENGE_NAME_LENGTH = 80
export const MAX_PRIZE_TEXT_LENGTH = 200
export const MAX_CHALLENGE_TOPICS = 40
