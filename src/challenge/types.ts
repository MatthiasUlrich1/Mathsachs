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
  /** True when this user created the challenge. Practice copies stay false. */
  owned?: boolean
}

/** Tombstone so LAN merge cannot resurrect a deleted challenge. */
export interface DeletedChallenge {
  id: string
  deletedAt: number
}

export const NO_ACTIVE_CHALLENGE_MESSAGE = 'Aktuell keine Challenge aktiv.'

export const DELETED_CHALLENGE_TTL_MS = 30 * 24 * 60 * 60 * 1000
export const MAX_DELETED_CHALLENGES = 200

export function deleteChallengeConfirm(name: string): string {
  const trimmed = name.trim() || 'diese Challenge'
  return `Challenge „${trimmed}“ wirklich löschen? Die Challenge wird entfernt. Die Klassensummen bleiben. Das kann nicht rückgängig gemacht werden.`
}

export const CHALLENGE_PHASE_LABEL = {
  upcoming: 'Angelegt',
  active: 'Laufend',
  ended: 'Beendet',
} as const

export const CLASS_GOAL_PREFIX = 'Klassenziel:'

export const MAX_CHALLENGE_NAME_LENGTH = 80
export const MAX_PRIZE_TEXT_LENGTH = 200
export const MAX_CHALLENGE_TOPICS = 40
