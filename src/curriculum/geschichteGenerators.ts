import { textTask } from './taskHelpers'
import { allGeschichteTopicIds } from './geschichteGymTopics'
import { GESCHICHTE_K5_GENERATORS } from './geschichte5'
import { GESCHICHTE_K6_GENERATORS } from './geschichte6'
import { GESCHICHTE_K6_REST_GENERATORS } from './geschichte6Rest'
import { GESCHICHTE_K7_GENERATORS } from './geschichte7'
import { GESCHICHTE_K8_GENERATORS } from './geschichte8'
import { GESCHICHTE_K9_GENERATORS } from './geschichte9'
import { GESCHICHTE_K10_GENERATORS } from './geschichte10'
import { GESCHICHTE_OBERSTUFE_GENERATORS } from './geschichteOberstufe'
import { GESCHICHTE_DENSE_GENERATORS } from './geschichteDense'
import { GESCHICHTE_DENSE_K6_LB23_GENERATORS } from './geschichteDenseK6Lb23'
import { GESCHICHTE_DENSE_UPPER_GENERATORS } from './geschichteDenseUpper'
import { GESCHICHTE_LAENGSSCHNITT_GENERATORS } from './geschichteLaengsschnittDense'
import { GESCHICHTE_OVERVIEW_DENSE_GENERATORS } from './geschichteOverviewDense'
import { GESCHICHTE_THIN_FILL } from './geschichteThinFill'
import { GESCHICHTE_LEHRPLAN_TEILASPEKTE_GENERATORS } from './geschichteLehrplanTeilaspekte'
import { GESCHICHTE_DICHTE_FILL_PASS1_GENERATORS } from './geschichteDichteFillPass1'
import { GESCHICHTE_SCHULSTOFF_DENSE_GENERATORS } from './geschichteSchulstoffDense'
import type { Topic } from './types'

/**
 * Layer-Reihenfolge: generische Densify zuerst, themenreine Qualitäts-/Schulstoffbanken zuletzt
 * (letzter Eintrag gewinnt bei gleichen Topic-IDs).
 */
const GESCHICHTE_ALL_GENERATORS: Record<string, Topic['generate']> = {
  ...GESCHICHTE_DICHTE_FILL_PASS1_GENERATORS,
  ...GESCHICHTE_OVERVIEW_DENSE_GENERATORS,
  ...GESCHICHTE_LEHRPLAN_TEILASPEKTE_GENERATORS,
  ...GESCHICHTE_LAENGSSCHNITT_GENERATORS,
  ...GESCHICHTE_DENSE_GENERATORS,
  ...GESCHICHTE_DENSE_K6_LB23_GENERATORS,
  ...GESCHICHTE_DENSE_UPPER_GENERATORS,
  ...GESCHICHTE_K5_GENERATORS,
  ...GESCHICHTE_K6_GENERATORS,
  ...GESCHICHTE_K6_REST_GENERATORS,
  ...GESCHICHTE_K7_GENERATORS,
  ...GESCHICHTE_K8_GENERATORS,
  ...GESCHICHTE_K9_GENERATORS,
  ...GESCHICHTE_K10_GENERATORS,
  ...GESCHICHTE_OBERSTUFE_GENERATORS,
  ...GESCHICHTE_SCHULSTOFF_DENSE_GENERATORS,
}

/** Platzhalter-Generator bis echte Geschichtsaufgaben vorliegen. */
function stubGenerate(title: string): Topic['generate'] {
  return () =>
    textTask({
      question: `Thema „${title}“ (Geschichte · Gymnasium Sachsen) — Übungsaufgaben folgen. Tippe „ok“.`,
      accepted: ['ok', '—', '-'],
      solution: 'ok',
      explanation:
        'Der Lehrplan ist vorbereitet, die Aufgabengeneratoren sind noch in Arbeit. ' +
        'Nur in der Entwickleransicht sichtbar (Freigabe ausstehend).',
    })
}

const STUBS: Record<string, Topic['generate']> = Object.fromEntries(
  allGeschichteTopicIds()
    .filter((id) => !GESCHICHTE_ALL_GENERATORS[id])
    .map((id) => [id, stubGenerate(id)]),
)

export function geschichteStubForTitle(title: string): Topic['generate'] {
  return stubGenerate(title)
}

function scrubGeMeta(s: string): string {
  return s
    .replace(/\bWarum vergleicht der Lehrplan\b/gi, 'Warum vergleicht man historisch')
    .replace(/\bWarum gehören .+ zum Lehrplan\??/gi, 'Welche historische Aussage passt zu Bauwerken und Parks?')
    .replace(/\bim Lehrplanfokus\??/gi, 'im historischen Vergleich?')
    .replace(/\bzum Lehrplan\??/gi, 'zur Epoche?')
    .replace(/\bLehrplan\b/gi, 'Epoche')
    .replace(/\s*\((?:ge|bi|ph|k\d+|lk\d+)[-_][^)]+\)\s*/gi, ' ')
    // Topic-ID-Leaks aus Thin-Fill-Prompts
    .replace(/\[ge-[^\]]+\]\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Physikfremde Reste aus Thin-Fill nie an Schüler ausgeben. */
function isPhysicsLeakTask(question: string, solution: string, wissen: string): boolean {
  const blob = `${question}\n${solution}\n${wissen}`
  return /Beschleunigung|Ohmsches Gesetz|Stromstärke|Geschwindigkeit \(Weg|Weg pro Zeit|v\s*=\s*s\s*\/\s*t|Halbschatten|Kernschatten|Federkraft|Gewichtskraft/i.test(
    blob,
  )
}

/**
 * Universelle Methoden-/Epochen-Vokabeln aus dem alten Thin-Fill-Template —
 * ohne Themenbezug (z. B. „Was beschreibt Konflikt?“ unter Metallzeit).
 */
export function isGenericHistoryVocabLeak(question: string): boolean {
  // Universelle Füller (nicht Methodenstoff Quelle/Chronologie/Epoche).
  return (
    /Was (beschreibt|bedeutet|ist) [„""']?(Herrschaft|Gesellschaft|Wirtschaft|Religion|Kultur|Konflikt|Revolution|Kontinuität|Migration|Erinnerung)\b/i.test(
      question,
    ) || /\[ge-k\d+-lb[^\]]+\]\s*Was beschreibt/i.test(question)
  )
}

function withGeAuditSafe(gen: Topic['generate']): Topic['generate'] {
  return (rng) => {
    let task = gen(rng)
    // Physik-Leaks und generische Thin-Fill-Vokabeln nie ausspielen — neu ziehen.
    for (let i = 0; i < 16; i++) {
      const q0 = task.question ?? ''
      const sol0 = String(task.solution ?? '')
      const fw0 = task.fachwissen?.text ?? ''
      const stmt = String((task.interactive?.props as { statement?: string } | undefined)?.statement ?? '')
      if (
        !isPhysicsLeakTask(q0, sol0, `${fw0}\n${stmt}`) &&
        !isGenericHistoryVocabLeak(q0) &&
        !isGenericHistoryVocabLeak(stmt)
      ) {
        break
      }
      task = gen(rng)
    }
    const q = scrubGeMeta(task.question ?? '')
    const props = { ...(task.interactive?.props as Record<string, unknown> | undefined) }
    for (const key of ['front', 'instruction', 'statement', 'claim', 'sourceText', 'backHint'] as const) {
      if (typeof props[key] === 'string') props[key] = scrubGeMeta(String(props[key]))
    }
    let text = (task.fachwissen?.text ?? '').trim()
    text = `${text} Bezug zur Aufgabe: ${q} Lösung: ${task.solution ?? ''}`.replace(/\s+/g, ' ').trim()
    if (text.length < 40) text = `Geschichte: ${q} — ${task.solution ?? ''}.`
    return {
      ...task,
      question: q,
      interactive: task.interactive ? { ...task.interactive, props } : undefined,
      fachwissen: {
        text,
        quelle: task.fachwissen?.quelle ?? 'Lehrplan Geschichte Sachsen',
        url: task.fachwissen?.url,
      },
    }
  }
}

export function resolveGeschichteGenerate(
  topicId: string,
  title?: string,
): Topic['generate'] | undefined {
  if (!topicId.startsWith('ge-')) return undefined
  const real = GESCHICHTE_ALL_GENERATORS[topicId]
  const fill = GESCHICHTE_THIN_FILL[topicId]
  let base: Topic['generate'] | undefined
  // Qualitätsbanken allein — kein Thin-Fill-Mix mehr (Rules: Themenbindung).
  // Generische „Was ist ein Konflikt?“-Füller unter Metallzeit & Co. sind verboten.
  // Thin-Fill nur als Notfall, wenn keine Qualitätsbank existiert.
  if (real) base = real
  else if (fill) {
    const safeFill: Topic['generate'] = (rng) => {
      for (let i = 0; i < 12; i++) {
        const t = fill(rng)
        if (
          !isPhysicsLeakTask(
            t.question ?? '',
            String(t.solution ?? ''),
            t.fachwissen?.text ?? '',
          ) &&
          !isGenericHistoryVocabLeak(t.question ?? '')
        ) {
          return t
        }
      }
      return fill(rng)
    }
    base = safeFill
  } else if (STUBS[topicId]) base = STUBS[topicId]
  else if (title) base = stubGenerate(title)
  return base ? withGeAuditSafe(base) : undefined
}

export function isGeschichteTopic(topicId: string): boolean {
  return topicId.startsWith('ge-')
}

export function isPlayableGeschichteTopic(topicId: string): boolean {
  return Boolean(GESCHICHTE_ALL_GENERATORS[topicId])
}
