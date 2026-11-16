/**
 * Mapping eines Pack-Themas (Oberschule / Sachsen-Anhalt) auf Master-Themen
 * (Gymnasium-Sachsen-Bibliothek). Das Mapping lebt nur im Code; die Pack-JSON
 * (`pack.ts`) trägt keine Generator-Zuordnung.
 *
 * Quellen:
 * - `'lb1-addition'`                           Master-Thema-ID (nur wenn eindeutig)
 * - `'mathematik-klasse-6:lb4-volumen-quader'` klassenqualifiziert (`<moduleId>:<topicId>`);
 *   Pflicht für IDs, die in mehreren Klassen existieren (K5 + K6).
 *
 * Mehrere Quellen werden mit `blendGenerators` gemischt (gleiche Gewichte je Quelle,
 * deterministisch je Seed). `maxDifficulty` schließt Quellen mit höherem
 * Themen-`difficulty` aus; bleibt keine Quelle (und kein Custom-Generator), bleibt das
 * Pack-Thema Outline.
 */
export type SourceRef = string

export interface PackTopicMapping {
  sources: SourceRef[]
  /** Quellen mit Master-`difficulty` über diesem Wert werden ausgeschlossen. */
  maxDifficulty?: 1 | 2 | 3
  /** Master-Thema darf im selben Pack erneut vorkommen (nur mit `note`). */
  allowRepeat?: boolean
  note?: string
}

/** Altes 1:1-Format (String) oder neues Format. */
export type PackMappingEntry = string | PackTopicMapping

export function normalizeMapping(entry: PackMappingEntry): PackTopicMapping {
  return typeof entry === 'string' ? { sources: [entry] } : entry
}

export function qualifyRef(moduleId: string, topicId: string): string {
  return `${moduleId}:${topicId}`
}

export function isQualifiedRef(ref: SourceRef): boolean {
  return ref.includes(':')
}
