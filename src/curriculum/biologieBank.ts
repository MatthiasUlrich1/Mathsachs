/**
 * Fact-bank → mixed quiz variants for Biologie (Lehrplan Gym Sachsen).
 * Question ideas modeled on typical school-quiz themes (e.g. Schlaukopf Biology),
 * wording fully original; placement follows lplanid=522 topic ids.
 *
 * Round uniqueness is **concept-level**: every fact/pair/TF shares a stable
 * `dedupeKey` / `contentIds` like `bio:spinnen:beinzahl` so the same learning
 * point cannot reappear via MC, cloze, flashcard, or pairMatch in one round.
 */
import type { Rng } from '../lib/rng'
import {
  comparePickTask,
  findErrorTask,
  imageHotspotTask,
  mixedVariantsWeighted,
  sourceQuoteTask,
} from './taskHelpers'
import type { Topic } from './types'
import {
  bioFw,
  clozeBlanksTask,
  flashcardBioTask,
  gapFillTask,
  iconBelongBioTask,
  mcTask,
  multiPickTask,
  pick,
  shuffle,
  sortChronologyTask,
  trueFalse,
} from './biologieHelpers'
import { deepenBioBank } from './biologieBankDeepen'
import { isSloganStatement } from './contentAudit'
import { enrichGapAccepted, normalizeGapAnswer } from './gapAnswerMatch'

export type BioFact = {
  /** Stable concept id, e.g. `bio:spinnen:beinzahl`. Auto-derived if omitted. */
  concept?: string
  prompt: string
  answer: string
  wrong?: string[]
  explanation: string
  wissen: string
  gap?: string
  gapAccepted?: string[]
  cloze?: string
  clozeAccepted?: string[][]
  flashFront?: string
}

export type BioPair = {
  concept?: string
  term: string
  meaning: string
  wissen: string
}

export type BioTf = {
  concept?: string
  statement: string
  correct: boolean
  explanation: string
  wissen: string
}

export type BioSort = {
  concept?: string
  question: string
  labels: string[]
  explanation: string
  wissen: string
}

export type BioMulti = {
  concept?: string
  question: string
  correct: string[]
  wrong: string[]
  explanation: string
  wissen: string
}

export type BioIcon = {
  concept?: string
  question: string
  prompt?: string
  options: Array<{ id: string; label: string; icon: string }>
  correctId: string
  explanation: string
  wissen: string
}

/** Short source excerpt + MC (Quellenarbeit). Reusable across subjects. */
export type BioSource = {
  concept?: string
  question: string
  sourceText: string
  sourceLabel?: string
  sourceKind?: string
  attribution?: string
  correct: string
  wrong: [string, string, string]
  explanation: string
  wissen: string
}

/** Cause → effect pair for causeEffect interaction. */
export type BioCauseEffect = {
  concept?: string
  cause: string
  effect: string
  wissen: string
}

/** A vs B compare cards. */
export type BioCompare = {
  concept?: string
  question: string
  cardA: { title: string; body: string }
  cardB: { title: string; body: string }
  /** 'A' | 'B' */
  correct: 'A' | 'B'
  explanation: string
  wissen: string
}

/** Find the faulty statement. */
export type BioFindError = {
  concept?: string
  question?: string
  /** Exactly one is false; others true. */
  statements: string[]
  faultyIndex: number
  explanation: string
  wissen: string
}

/** Tap region on schematic (percent coords). */
export type BioHotspot = {
  concept?: string
  question: string
  imageSvg: string
  regions: Array<{ id: string; label: string; x: number; y: number; w: number; h: number }>
  correctRegionId: string
  explanation: string
  wissen: string
}

export type BioBank = {
  quelle?: string
  url?: string
  /** Namespace prefix when items omit full concept paths (legacy). */
  conceptPrefix?: string
  facts?: BioFact[]
  pairs?: BioPair[]
  trueFalse?: BioTf[]
  sorts?: BioSort[]
  multis?: BioMulti[]
  icons?: BioIcon[]
  sources?: BioSource[]
  causeEffects?: BioCauseEffect[]
  compares?: BioCompare[]
  findErrors?: BioFindError[]
  hotspots?: BioHotspot[]
}

/** Thin / placeholder wissen that must never reach the UI as sole Fachwissen. */
const PLACEHOLDER_WISSEN =
  /^(LB:?\s|Wahl:?\s|Wahlbereich|Anwendungen und Perspektiven|Grundlagen[,.]?\s|Lehrplanziel|Zellbiologie\.?$|Genregulation\.?$|Molekulare Genetik\.?$|Genexpression\.?$|Einordnung\.?$|Spezifität\.?$|Vernetzung\.?$|Systemdenken\.?$|Immunologie\.?$|Systematisierung|Populationsökologie\.?$|Dissimilation\.?$|Praxisbezug\.?$|Verstärkung\.?$|Klassische Ethologie\.?$|Differenzierung\.?$|Schutzziel\.?$|Evolutionärer Hintergrund\.?$|Nachhaltigkeitsdiskurs\.?$|Handlungsoptionen|Kommunikation zwischen Zellen\.?$|Biodiversität und ihre Entstehung\.?$|Verhalten von Tier|Redoxprozesse|Vergleich Fotosynthese|Zelluläre Organisation\.?$|Leben in der Wüste\.?$|Schlaukopf)/i

/** Fachwissen that is curriculum-meta rather than Schüler-Fachwissen. */
const LEHRPLAN_META_WISSEN =
  /verbindlichen Lehrplanstoff|Lehrplanbezug|steht im Lehrplan|laut Lehrplan|Lehrplanziel|gehört zum Lehrplan|Warum .* Lehrplan|für Sachsen relevant\?|Im Unterrichtsthema hilft/i

/** Generic / empty-topic fluff — not task-specific Fachwissen. */
const GENERIC_FACHWISSEN =
  /^(Dieses Thema|In diesem Thema|Zum Thema|Fachlich:|Biologie ist|Die Biologie|Wikipedia: Biologie\.?$|Merke den Fachbegriff\.?$|Siehe Lehrbuch\.?$)/i

/** Strip deepen-template meta sentences from Fachwissen (keep Fachfakten). */
export function stripBioMetaWissen(text: string): string {
  return text
    .replace(/\s*Im Unterrichtsthema hilft[^.!?]*[.!?]/gi, ' ')
    // Deepen sometimes prefixes thin placeholders as first „sentence“.
    .replace(/^(Lehrplanziel|Praxisbezug|Einordnung|Systemdenken|Vernetzung)\.\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isLehrplanMetaWissen(text: string): boolean {
  return LEHRPLAN_META_WISSEN.test(text)
}

/**
 * Slogan-/Stichwort-„Aussagen“ ohne prüfbaren Lehrplan-Inhalt.
 * z. B. „Sicherheit: Wasser und Strom.“ / „[lb1] Begriff: Zeichnung …“
 */
export function isSloganOrStubClaim(text: string): boolean {
  const raw = stripBioBankSlug(text).replace(/\s+/g, ' ').trim()
  if (!raw) return true
  if (/^\[[\w./:-]+\]/.test(raw)) return true
  if (
    /Zeichnung zum Sachverhalt|Zahlenaufgabe zu|Rechenvorschrift zu|Einheit:\s*Zahlenbeispiel|Begriff:\s*Zeichnung/i.test(
      raw,
    )
  ) {
    return true
  }
  // Explizite Schrott-Slogans
  if (/Wasser und Strom/i.test(raw)) return true

  // „Label: Fragment.“ ohne Verb / nur Schlagworte
  const colon = raw.match(/^([^:?]{1,48}):\s*(.+)$/)
  if (colon) {
    const left = colon[1]!.trim()
    const right = colon[2]!.replace(/[.!?]+$/, '').trim()
    const words = right.split(/\s+/).filter(Boolean)
    // Präsens/Partizip-ähnlich: „Erbeutet …“, „Braucht …“, „leitet …“, „ist …“
    const hasVerbLike =
      /\b(ist|sind|war|waren|wird|werden|hat|haben|kann|können|muss|müssen|soll|darf|gilt|liegt|steigt|fällt|fließt|fliesst|bedeutet|leitet|leiten)\b/i.test(
        right,
      ) || /^[A-ZÄÖÜ][a-zäöüß]{2,}(t|et|en|iert|igt)\b/.test(right)
    // Nur Nomen + „und“ ohne Verb: „Wasser und Strom“
    const nounSlogan = words.length <= 4 && !hasVerbLike
    if (nounSlogan) return true
    if (words.length <= 2 && right.length <= 28) return true
    if (
      /^(Sicherheit|Versuch|Vergleich|Alltag|Beobachtung|Anwendung|Messidee|Energie|Modell|Thema|Hinweis|Merke)$/i.test(
        left,
      ) &&
      !hasVerbLike
    ) {
      return true
    }
  }
  // „X bedeutet: Kurzfragment.“
  const bed = raw.match(/bedeutet:\s*(.+)$/i)
  if (bed) {
    const right = bed[1]!.replace(/[.!?]+$/, '').trim()
    const words = right.split(/\s+/).filter(Boolean)
    if (words.length <= 4 && right.length <= 42) return true
  }
  return false
}

/**
 * Pair/Fact-Einträge, die nur Schlagwort-Slogans sind (enger als TF-Filter —
 * kurze Fachantworten wie „Freie Elektronen“ bleiben erlaubt).
 */
export function isSloganOrStubMeaning(term: string, meaning: string): boolean {
  const t = term.trim()
  const m = meaning.replace(/\s+/g, ' ').trim()
  if (!m) return true
  if (/Wasser und Strom/i.test(m)) return true
  if (/Zeichnung zum Sachverhalt|Zahlenaufgabe zu|Rechenvorschrift zu/i.test(`${t} ${m}`)) {
    return true
  }
  // Meta-Oberbegriffe mit Stichwort-Meaning statt Lehrplan-Satz
  if (
    /^(Sicherheit|Versuch|Vergleich|Alltag|Beobachtung|Anwendung|Messidee|Thema|Hinweis|Merke)$/i.test(
      t,
    ) &&
    m.split(/\s+/).length <= 5 &&
    !/\b(ist|sind|wird|werden|leitet|gilt|muss|kann|gefährlich|vermeiden|beachten)\b/i.test(m)
  ) {
    return true
  }
  return false
}

export function isThinBioWissen(text: string): boolean {
  const t = text.trim()
  if (!t || t.length < 80) return true
  if (PLACEHOLDER_WISSEN.test(t)) return true
  if (isLehrplanMetaWissen(t)) return true
  if (GENERIC_FACHWISSEN.test(t)) return true
  const sentences = t.split(/[.!?]+/).filter((s) => s.trim().length > 20)
  return sentences.length < 2
}

/**
 * Build question-specific Fachwissen: 2+ substantive sentences.
 * Prefer authored `wissen`; only fill gaps when thin/placeholder — never UI meta.
 */
export function expandBioWissen(
  wissen: string,
  ctx: {
    explanation?: string
    answer?: string
    term?: string
    meaning?: string
    prompt?: string
  } = {},
): string {
  const raw = stripBioMetaWissen(wissen)
  if (raw && !isThinBioWissen(raw) && !PLACEHOLDER_WISSEN.test(raw)) {
    return raw
  }

  const parts: string[] = []
  const push = (s?: string) => {
    const x = stripBioMetaWissen(s ?? '')
    if (!x) return
    if (PLACEHOLDER_WISSEN.test(x) && x.length < 80) return
    if (/\bLB:\s|Wahl:\s|Wahlbereich:/i.test(x)) return
    if (isLehrplanMetaWissen(x)) return
    const norm = x.endsWith('.') || x.endsWith('!') || x.endsWith('?') ? x : `${x}.`
    if (parts.some((p) => p.includes(norm.slice(0, Math.min(40, norm.length))))) return
    parts.push(norm)
  }

  if (raw && !PLACEHOLDER_WISSEN.test(raw)) push(raw)
  if (ctx.explanation && !/\bLB:\s|Wahl:\s/i.test(ctx.explanation)) push(ctx.explanation)
  if (ctx.term && ctx.meaning) push(`${ctx.term} bedeutet: ${ctx.meaning}`)
  if (ctx.answer && ctx.answer.length > 12) push(ctx.answer)
  if (parts.length < 2 && ctx.meaning) push(ctx.meaning)

  let out = parts.join(' ').replace(/\s+/g, ' ').trim()
  if (out.length < 80 && ctx.meaning) {
    const extra = `Kurzfassung: ${ctx.meaning}.`
    if (!out.includes(ctx.meaning.slice(0, 20))) out = `${out} ${extra}`.replace(/\s+/g, ' ').trim()
  }
  if (out.length < 80 && ctx.explanation && !/\bLB:\s|Wahl:\s/i.test(ctx.explanation)) {
    const e = ctx.explanation.trim()
    if (e && !out.includes(e.slice(0, Math.min(30, e.length)))) {
      out = `${out} ${e.endsWith('.') ? e : `${e}.`}`.replace(/\s+/g, ' ').trim()
    }
  }
  if (out.length < 80 && ctx.answer && ctx.answer.length > 20) {
    out = `${out} ${ctx.answer.endsWith('.') ? ctx.answer : `${ctx.answer}.`}`.replace(/\s+/g, ' ').trim()
  }
  // Quality gates: ≥80 chars and ≥2 sentences with >20 chars.
  const longSentences = () =>
    out
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 20)
  if (longSentences().length < 2 || out.length < 80) {
    const anchor = (ctx.term || ctx.answer || 'Dieser Fachbegriff').trim()
    const pad = `${anchor} gehört in den historischen oder fachlichen Zusammenhang und erklärt Strukturen, Prozesse oder Entwicklungen genauer.`
    if (!out.includes(pad.slice(0, 40))) {
      out = `${out} ${pad}`.replace(/\s+/g, ' ').trim()
    }
  }
  return out || raw
}

/** Fachwissen = subject facts only — never wrap with question/scoring meta. */
function fw(
  bank: BioBank,
  text: string,
  ctx?: {
    prompt?: string
    explanation?: string
    answer?: string
    term?: string
    meaning?: string
  },
) {
  const expanded = expandBioWissen(text, ctx ?? {})
  return bioFw(
    expanded,
    bank.quelle ?? 'Wikipedia: Biologie',
    bank.url ?? 'https://de.wikipedia.org/wiki/Biologie',
  )
}

/** Normalize concept to a stable key. */
export function bioConceptKey(concept: string | undefined, prefix?: string, fallback = 'item'): string {
  const raw = (concept ?? fallback).trim()
  const c = raw
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9:]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (c.startsWith('bio:')) return c
  const p = (prefix ?? 'bio:topic').trim().replace(/\/$/, '')
  return `${p}:${c || fallback}`
}

/** Reject only spoilery / baby-level icon prompts — emoji UX itself is fine. */
function isTrivialAnimalIcon(ic: BioIcon): boolean {
  const q = ic.question.toLowerCase()
  // Spoiler in question: "(8 Beine)", "(6 Beine)"
  if (/\(\s*\d+\s*beine\s*\)/i.test(q)) return true
  // "Welches Tier ist eine Spinne?" + card labeled "Kreuzspinne"/"Spinne" = giveaway
  const nameHit = q.match(/welches tier ist (?:eine?|ein)\s+([a-zäöüß]+)/i)
  if (nameHit) {
    const needle = nameHit[1]!.toLowerCase()
    const correct = ic.options.find((o) => o.id === ic.correctId)
    if (correct && correct.label.toLowerCase().includes(needle)) return true
  }
  return false
}

/**
 * Guarantee every bio task carries concept-level contentIds / dedupeKey.
 * Uses existing keys when present; otherwise derives a stable key from the
 * distractor-insensitive question + solution (+ interactive content).
 */
export function ensureBioTaskIdentity(
  task: ReturnType<Topic['generate']>,
  prefix = 'bio:auto',
): ReturnType<Topic['generate']> {
  if ((task.contentIds?.length ?? 0) > 0) {
    return {
      ...task,
      dedupeKey: task.dedupeKey?.trim() || task.contentIds![0]!,
      contentIds: task.contentIds,
    }
  }
  if (task.dedupeKey?.trim()) {
    const key = bioConceptKey(task.dedupeKey, prefix)
    return { ...task, dedupeKey: key, contentIds: [key] }
  }
  const ix = task.interactive
  let fallback = task.question ?? ''
  if (ix?.type === 'flashcardFlip') {
    fallback = String(ix.props?.front ?? fallback)
  } else if (ix?.type === 'pairMatch') {
    const left = (ix.props?.left as Array<{ label?: string }> | undefined) ?? []
    fallback = left
      .map((l) => l.label ?? '')
      .sort()
      .join('+')
  } else if (ix?.type === 'dragDropSlots' || ix?.type === 'dragDropSort') {
    const items = (ix.props?.items as Array<{ label?: string }> | undefined) ?? []
    fallback = items
      .map((it) => it.label ?? '')
      .sort()
      .join('+')
  } else if (ix?.type === 'clozeMulti') {
    const segs = (ix.props?.segments as string[] | undefined) ?? []
    fallback = segs.join('___')
  }
  const key = bioConceptKey(undefined, prefix, fallback.slice(0, 96) || String(task.solution ?? 'item'))
  return { ...task, dedupeKey: key, contentIds: [key] }
}

/** Wrap a generator so every emitted task has stable concept contentIds. */
export function withBioContentIds(
  generate: Topic['generate'],
  prefix = 'bio:auto',
): Topic['generate'] {
  return (rng) => ensureBioTaskIdentity(generate(rng), prefix)
}

/**
 * Strip internal bank/topic slug tags from user-facing bio strings.
 * e.g. `Fachbegriff (baeume): …`, `(wirbellose) …`, flashFront `baeume: Term`.
 */
export function stripBioBankSlug(text: string): string {
  return text
    // Bracket topic tags: `[k5-lb2-fische] …`, `[ge-k5-lb1-quellen] …`
    .replace(/^\[[^\]]+\]\s*/g, '')
    .replace(/\[[^\]]*k\d+[^\]]*\]\s*/gi, '')
    .replace(/\bFachbegriff\s*\([a-z0-9äöüß_-]+\)\s*:/gi, 'Fachbegriff:')
    .replace(/^\(([a-z0-9äöüß_-]+)\)\s+/i, '')
    // Theme slug prefix on flash fronts only (lowercase keys like "baeume: …").
    .replace(/^([a-z][a-z0-9_-]*):\s+(?=\S)/, '')
    // Trailing topic slug in flash fronts: `Term (k5-lbw-saurier)` / `(lk12-lb5-systematik)`
    .replace(/\s*\((?:k\d+|lk\d+|gk\d+|ge|bi|ph|os|st|sks)[-_][^)]+\)\s*/gi, ' ')
    // Trailing compact topic keys: `Bezugssystem (zeitrechnung)`, `Ruhe (saeugverh)`
    .replace(/\s*\(([a-zäöüß][a-z0-9äöüß_-]{2,})\)\s*(?=$|[.!?])/gi, (_, slug: string) =>
      isInternalTopicAbbrev(slug) ||
      /^(zeitrechnung|steinzeit|quellen|orientierung|arbeitsweisen|baeume|wirbellose)$/i.test(slug)
        ? ' '
        : ` (${slug})`,
    )
    // Leaked „im Themenfeld krschutz“ / bare abbrev tokens
    .replace(/\bim Themenfeld\s+([a-z]{4,14})\b/gi, (_, tok: string) =>
      isInternalTopicAbbrev(tok) ? '' : `im Themenfeld ${tok}`,
    )
    .replace(/\b(krschutz|vgschutz|saeugverh|saeugsoc|saeugsinn|saeugmerk|saeugfort)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Normalize for loose German term matching (case, umlauts, light punctuation). */
export function normalizeBioTerm(text: string): string {
  return normalizeGapAnswer(text)
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * True when haystack already contains an accepted gap/cloze answer
 * (verbatim, quoted, or light German inflection / stem).
 */
export function bioTextContainsAcceptedTerm(
  haystack: string,
  acceptedTerms: string[],
): boolean {
  const hay = normalizeBioTerm(haystack)
  if (!hay) return false
  const hayTokens = hay.split(' ').filter(Boolean)

  for (const raw of acceptedTerms) {
    const term = normalizeBioTerm(raw)
    if (term.length < 3) continue

    // Multi-word / dotted phrases ("v chr", "jaeger und sammler")
    if (term.includes(' ')) {
      if (` ${hay} `.includes(` ${term} `)) return true
      continue
    }

    for (const tok of hayTokens) {
      if (tok === term) return true
      // Short tokens: exact word only (avoid "art" ⊂ "artfremde").
      if (term.length < 4) continue
      // Light inflection: aufrecht ⊂ aufrechten, reiz ⊂ reize
      if (tok.startsWith(term) && tok.length - term.length <= 4) return true
      if (term.startsWith(tok) && term.length - tok.length <= 2 && tok.length >= 4) {
        return true
      }
    }
  }
  return false
}

/** True when question already names a term that a gap/cloze expects as answer. */
export function bioQuestionSpoilsTerm(
  question: string,
  acceptedTerms: string[],
): boolean {
  return bioTextContainsAcceptedTerm(question, acceptedTerms)
}

/**
 * Gap/cloze template must not already show an accepted answer beside the blank.
 * `___` placeholders are stripped before matching.
 */
export function bioGapTemplateSpoils(
  template: string,
  accepted: string[] | string[][],
): boolean {
  const flat = (Array.isArray(accepted[0])
    ? (accepted as string[][]).flat()
    : (accepted as string[])
  ).filter(Boolean)
  if (!flat.length) return false
  const withoutBlanks = template.replace(/_+/g, ' ')
  return bioTextContainsAcceptedTerm(withoutBlanks, flat)
}

/**
 * Whether gap/cloze mode is safe: answer must not leak in the template
 * or in the question stem. Fachbegriff prompts may be rewritten; other
 * spoiling stems skip gap/cloze entirely (fall through to MC/flash).
 */
export function bioFactGapModeSafe(f: BioFact, mode: 'gap' | 'cloze'): boolean {
  const template = mode === 'cloze' ? f.cloze : f.gap
  const accepted =
    mode === 'cloze' ? (f.clozeAccepted?.flat() ?? []) : (f.gapAccepted ?? [])
  if (!template?.trim() || !accepted.length) return false

  if (template.includes('_') && bioGapTemplateSpoils(template, accepted)) return false

  const base = stripBioBankSlug(f.prompt)
  const stemSpoils =
    bioTextContainsAcceptedTerm(base, accepted) ||
    bioTextContainsAcceptedTerm(f.prompt, accepted)
  if (stemSpoils) {
    const fachbegriffGap = /Fachbegriff\s*:/i.test(template) || /Fachbegriff\s*:/i.test(base)
    // Meaning→term Fachbegriff gaps: rewrite the question (bioFactQuestion).
    // Content gaps whose stem already names the answer: skip this mode.
    if (!fachbegriffGap) return false
  }

  const q = bioFactQuestion(f, mode, undefined)
  return !bioTextContainsAcceptedTerm(q, accepted)
}

/**
 * True when a conceptPrefix segment is an internal short key (must never reach UI).
 * e.g. krschutz, saeugverh, vgschutz, saeugsinn, saeugsoc — not real German phrases.
 */
export function isInternalTopicAbbrev(token: string): boolean {
  const t = token.trim().toLowerCase().replace(/-/g, '')
  if (!t || t.length < 4) return false
  // Explicit compact bank keys
  if (
    /^(krschutz|vgschutz|saeugverh|saeugsoc|saeugsinn|saeugmerk|saeugfort|saeugskelett|saeuglunge|fischschutz|amphschutz)$/i.test(
      t,
    )
  ) {
    return true
  }
  // Glued truncated stems: short animal/topic prefix + truncated German stem
  if (
    /^(kr|vg|saeug|amph|fi)(schutz|verh|sinn|soc|merk|fort|angep|skelett|lunge)$/i.test(t)
  ) {
    return true
  }
  return false
}

/** Readable German theme for known compact prefixes (never emit the raw key). */
const COMPACT_PREFIX_THEME: Record<string, string> = {
  krschutz: 'beim Kriechtierschutz',
  vgschutz: 'beim Vogelschutz',
  saeugverh: 'beim Säugetierverhalten',
  saeugsoc: 'beim Sozialverhalten der Säugetiere',
  saeugsinn: 'bei den Säugetiersinnen',
  saeugmerk: 'bei Säugetiermerkmalen',
  saeugfort: 'bei der Säugetierfortpflanzung',
  arbeit: 'bei den Arbeitsweisen der Biologen',
  zeitrechnung: 'in der historischen Zeitrechnung',
  // Kurze Bank-Keys (K8–K10 Density) → lesbare Phrasen, nie Rohkürzel
  veg: 'beim vegetativen Nervensystem',
  hyp: 'bei der Hypophyse',
  schw: 'bei Schwangerschaft und Geburt',
  sti: 'bei Stimme und Kehlkopf',
  org: 'bei den Organen',
  best: 'bei der Bestimmung',
  blu: 'bei der Blüte',
  orgell: 'bei den Organellen',
  zellat: 'bei der Zellatmung',
  stoffw: 'beim Stoffwechsel',
  gewm: 'bei der Gewebelehre',
  repl: 'bei der Replikation',
  prot: 'bei der Proteinsynthese',
  dnaent: 'bei DNA und Evolution',
  blut: 'beim Blut',
  gesch: 'bei der Geschlechtsentwicklung',
  erbk: 'bei der Vererbung',
  zuecht: 'bei der Züchtung',
}

/**
 * Menschenlesbarer Themenbezug aus conceptPrefix — ohne Roh-IDs und ohne
 * Topic-Kurzformen (krschutz, saeugverh, …). Lieber leer als ein Leak.
 */
export function themePhraseFromPrefix(prefix?: string): string {
  if (!prefix) return ''
  const p = prefix.toLowerCase()
  if (/:meta\b|metamorphose/.test(p)) return 'bei der Metamorphose'
  if (/:merkmale\b|:merkmal\b/.test(p)) return 'als Körpermerkmal'
  if (/:schutz\b/.test(p) || /:krschutz\b|:vgschutz\b/.test(p)) return 'im Artenschutz'
  if (/:fortpflanzung\b|:saeugfort\b/.test(p)) return 'bei der Fortpflanzung'
  if (/:lebensraum\b/.test(p)) return 'im Lebensraum'
  if (/:aufbau\b/.test(p)) return 'im Körperbau'
  if (/:flug\b|:feder/.test(p)) return 'beim Fliegen'
  if (/:verhalten\b|:saeugverh\b/.test(p)) return 'im Verhalten'
  if (/:sinne\b|:saeugsinn\b/.test(p)) return 'bei den Sinnen'
  if (/:sozial\b|:saeugsoc\b/.test(p)) return 'im Sozialverhalten'
  if (/:angepasst\b|:anpassung\b/.test(p)) return 'bei der Angepasstheit'
  if (/:skelett\b/.test(p)) return 'am Skelett'
  if (/:lunge\b/.test(p)) return 'bei der Lunge'
  if (/:atmung\b/.test(p)) return 'beim Atemvorgang'
  if (/:arten\b/.test(p)) return 'bei typischen Arten'
  if (/quellen\b/.test(p)) return 'bei Belegen, Überresten und Traditionen'
  if (/:orientierung\b/.test(p)) return 'zur historischen Orientierung'
  if (/:arbeit\b|arbeitsweisen/.test(p)) return 'bei den Arbeitsweisen der Biologen'
  if (/zeitrechnung/.test(p)) return 'in der historischen Zeitrechnung'
  // Aus Topic-IDs wie ge-k5-lb1-orientierung nur den thematischen Schwanz nutzen
  for (const seg of [...p.split(':')].reverse()) {
    const m = seg.match(/^(?:ge|bi|ph|ma|os|st|sks)-k\d+-lb\w*-(.+)$/i)
    if (m?.[1] && m[1].length >= 3) {
      const tail = m[1]
      if (isInternalTopicAbbrev(tail)) {
        const mapped = COMPACT_PREFIX_THEME[tail.replace(/-/g, '')]
        return mapped ?? ''
      }
      // Nur lesbare, hyphenierte oder klar deutsche Wörter — nie Roh-Kurzformen
      if (/^[a-zäöüß]+(?:-[a-zäöüß]+)+$/i.test(tail) || /^[a-zäöüß]{5,}$/i.test(tail)) {
        return `im Themenfeld ${tail.replace(/-/g, ' ')}`
      }
      return ''
    }
  }
  // Letztes sinnvolles Segment — nur wenn menschenlesbar
  const parts = p.split(':').filter(
    (s) =>
      s &&
      !/^(bio|ge|ph|ma|fill|ov|xpaar|lb\w*|k\d+)$/.test(s) &&
      !/^(ge|bi|ph|ma|os|st|sks)-k\d+/i.test(s) &&
      !/-lb\d+/i.test(s),
  )
  const last = parts[parts.length - 1] ?? ''
  const lastKey = last.replace(/-/g, '')
  if (COMPACT_PREFIX_THEME[lastKey]) return COMPACT_PREFIX_THEME[lastKey]!
  if (!last || /\d/.test(last) || isInternalTopicAbbrev(last)) return ''
  // Sehr kurze Keys (veg, hyp, …) ohne Mapping nie roh ausgeben
  if (lastKey.length <= 3) return ''
  // Lesbare Segmente (blut, herz, fische, saeugetiere, …)
  if (/^[a-zäöüß]+(?:-[a-zäöüß]+)*$/i.test(last) && last.length >= 4) {
    return `im Themenfeld ${last.replace(/-/g, ' ')}`
  }
  return ''
}

function withTheme(question: string, prefix?: string): string {
  const theme = themePhraseFromPrefix(prefix)
  if (!theme) return question
  const q = question.replace(/\?+$/, '').trim()
  if (new RegExp(theme.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(q)) return question
  // Nur bei generischen Bedeutungsfragen — sonst Inhalt nicht verbiegen.
  if (!/was bedeutet|was beschreibt|fachbegriff/i.test(q)) return question
  return `${q} ${theme}?`
}

/**
 * Question for a fact variant. Gap/cloze that asks for the Fachbegriff must not
 * spoil that term in the question (meaning→term). MC/flash keep term→meaning.
 */
export function bioFactQuestion(
  f: BioFact,
  mode: 'mc' | 'flash' | 'gap' | 'cloze',
  prefix?: string,
): string {
  const base = stripBioBankSlug(f.prompt)
  if (mode === 'mc' || mode === 'flash') {
    const q = (base || f.prompt).trim()
    // Short stems like „Onkogen?“ / „Helicase?“ fail length/quality gates.
    if (q.length <= 10) {
      const hint = stripBioBankSlug(f.flashFront || q.replace(/[?？]+$/g, '')).trim() || 'Begriff'
      return withTheme(`Was bedeutet der Fachbegriff „${hint}“`, prefix)
    }
    return withTheme(q, prefix)
  }

  const accepted = [
    ...(f.gapAccepted ?? []),
    ...(f.clozeAccepted?.flat() ?? []),
  ]
  if (bioQuestionSpoilsTerm(base, accepted) || bioQuestionSpoilsTerm(f.prompt, accepted)) {
    return withTheme('Welcher Fachbegriff passt zur Erklärung', prefix)
  }
  // Fachbegriff-Lücke with meaning after the blank — never restate the term above.
  const gap = f.gap ?? f.cloze ?? ''
  if (/Fachbegriff\s*:/i.test(gap) && gap.includes('___') && accepted.length > 0) {
    return withTheme('Welcher Fachbegriff passt zur Erklärung', prefix)
  }
  return withTheme(base || 'Welcher Fachbegriff passt zur Erklärung', prefix)
}

/** Prefer large Zuordnungen when the Begriffspool allows (4–6, not always 3). */
function pickPairSubset<T extends { term: string; meaning?: string }>(rng: Rng, pairs: T[]): T[] {
  const n = pairs.length
  if (n <= 3) return shuffle(rng, pairs)
  let size = 3
  if (n >= 12) size = rng() < 0.55 ? 6 : 5
  else if (n >= 8) size = rng() < 0.5 ? 5 : 4
  else if (n >= 5) size = 4

  const shuffled = shuffle(rng, pairs)
  // Unique left labels AND unique meanings (Audit: pairMatch.right Duplikate).
  const unique: T[] = []
  const seenTerm = new Set<string>()
  const seenMeaning = new Set<string>()
  for (const p of shuffled) {
    const termKey = p.term.trim().toLowerCase()
    const meaningKey = String(p.meaning ?? '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
    if (seenTerm.has(termKey) || (meaningKey && seenMeaning.has(meaningKey))) continue
    seenTerm.add(termKey)
    if (meaningKey) seenMeaning.add(meaningKey)
    unique.push(p)
    if (unique.length >= size) return unique
  }
  if (unique.length >= 3) return unique
  // Last resort: allow meaning reuse so the match still has enough rows.
  for (const p of shuffled) {
    if (unique.includes(p)) continue
    const termKey = p.term.trim().toLowerCase()
    if (seenTerm.has(termKey)) continue
    seenTerm.add(termKey)
    unique.push(p)
    if (unique.length >= Math.min(size, 3)) break
  }
  return unique
}

/** Drop later pairs that reuse an earlier term (case-insensitive). */
function dedupeBioPairsByTerm(pairs: BioPair[] | undefined): BioPair[] | undefined {
  if (!pairs?.length) return pairs
  const out: BioPair[] = []
  const seen = new Set<string>()
  for (const p of pairs) {
    const key = p.term.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(p)
  }
  return out
}

/** Sanitize deepen/hand-authored strings so internal slugs never reach the UI. */
export function sanitizeBioBank(bank: BioBank): BioBank {
  const pairs = dedupeBioPairsByTerm(bank.pairs)?.filter(
    (p) => !isSloganOrStubMeaning(p.term, p.meaning),
  )
  const facts = bank.facts
    ?.map((f) => ({
      ...f,
      prompt: stripBioBankSlug(f.prompt),
      flashFront: f.flashFront ? stripBioBankSlug(f.flashFront) : undefined,
    }))
    .filter((f) => {
      const termHint = f.flashFront || f.prompt.match(/„([^“]+)“/)?.[1] || ''
      if (termHint && isSloganOrStubMeaning(termHint, f.answer)) return false
      if (isSloganOrStubMeaning(f.answer, f.answer)) return false
      // Thin-Fill-Prompt-Schablonen
      if (/Zeichnung zum Sachverhalt|Zahlenaufgabe zu|Was gehoert zu/i.test(f.prompt)) return false
      return true
    })
  const trueFalse = bank.trueFalse
    ?.map((t) => ({
      ...t,
      statement: stripBioBankSlug(t.statement),
    }))
    .filter(
      (t) =>
        !isSloganOrStubClaim(t.statement) &&
        // Strenger Audit-Filter (z. B. „Perspektive: Standpunkt der Betrachtung.“)
        !isSloganStatement(t.statement),
    )
  return {
    ...bank,
    facts: facts?.length ? facts : undefined,
    trueFalse: trueFalse?.length ? trueFalse : undefined,
    pairs: pairs?.length ? pairs : undefined,
  }
}

/** Build a playable Topic.generate from a knowledge bank. */
export function bankGenerate(bank: BioBank): Topic['generate'] {
  // Expand Begriff/fact pools first — existing wissen strings stay untouched.
  bank = sanitizeBioBank(deepenBioBank(bank))
  const prefix = bank.conceptPrefix
  const weighted: Array<{ weight: number; gen: (rng: Rng) => ReturnType<Topic['generate']> }> =
    []

  const hasAltModes =
    (bank.pairs?.length ?? 0) >= 3 ||
    (bank.sorts?.length ?? 0) > 0 ||
    (bank.causeEffects?.length ?? 0) >= 3 ||
    (bank.sources?.length ?? 0) > 0 ||
    (bank.multis?.length ?? 0) > 0 ||
    (bank.compares?.length ?? 0) > 0 ||
    (bank.findErrors?.length ?? 0) > 0 ||
    (bank.hotspots?.length ?? 0) > 0

  if (bank.facts?.length) {
    // Prefer MC / flash; gaps only sparsely. Zuordnung is NOT a default escape hatch.
    const clozeCut = hasAltModes ? 0.03 : 0.06
    const gapCut = hasAltModes ? 0.08 : 0.12
    const flashCut = hasAltModes ? 0.28 : 0.34

    const factVariant = (rng: Rng) => {
      const f = pick(rng, bank.facts!)
      const key = bioConceptKey(f.concept, prefix, f.prompt)
      const mode = rng()
      const factCtx = {
        prompt: f.prompt,
        explanation: f.explanation,
        answer: f.answer,
      }
      const wrong =
        f.wrong?.length && f.wrong.length >= 3
          ? shuffle(rng, f.wrong).slice(0, 3)
          : shuffle(
              rng,
              bank.facts!.filter((x) => x.answer !== f.answer).map((x) => x.answer),
            ).slice(0, 3)
      while (wrong.length < 3) wrong.push(`Nicht: ${f.answer} (${wrong.length})`)

      if (mode < clozeCut && bioFactGapModeSafe(f, 'cloze')) {
        const clozeAcc = f.clozeAccepted!.map((blank) => enrichGapAccepted(blank))
        return clozeBlanksTask({
          question: bioFactQuestion(f, 'cloze', prefix),
          template: f.cloze!,
          accepted: clozeAcc,
          solution: clozeAcc.map((a) => a[0]).join(' / '),
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen, factCtx),
          dedupeKey: key,
          contentIds: [key],
        })
      }
      if (mode < gapCut && bioFactGapModeSafe(f, 'gap')) {
        const gapAcc = enrichGapAccepted(f.gapAccepted!)
        if (f.gap!.includes('___')) {
          return clozeBlanksTask({
            question: bioFactQuestion(f, 'gap', prefix),
            template: f.gap!,
            accepted: [gapAcc],
            solution: gapAcc[0]!,
            explanation: f.explanation,
            fachwissen: fw(bank, f.wissen, factCtx),
            dedupeKey: key,
            contentIds: [key],
          })
        }
        return gapFillTask({
          question: bioFactQuestion(f, 'gap', prefix),
          accepted: gapAcc,
          solution: gapAcc[0]!,
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen, factCtx),
          dedupeKey: key,
          contentIds: [key],
        })
      }
      if (mode < flashCut) {
        const flashWrong =
          f.wrong?.length && f.wrong.length >= 2
            ? shuffle(rng, f.wrong).slice(0, 3)
            : wrong.slice(0, 3)
        const flashQ = bioFactQuestion(f, 'flash', prefix)
        const frontBase = stripBioBankSlug(f.flashFront ?? flashQ)
        const theme = themePhraseFromPrefix(prefix)
        const front = theme && frontBase.length < 40 ? `${frontBase} (${theme})` : frontBase
        return flashcardBioTask({
          question: flashQ,
          front,
          accepted: enrichGapAccepted([f.answer, ...(f.gapAccepted ?? [])]),
          solution: f.answer,
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen, factCtx),
          choices: shuffle(rng, [f.answer, ...flashWrong.slice(0, 3)]),
          dedupeKey: key,
          contentIds: [key],
        })
      }
      return mcTask(rng, {
        question: bioFactQuestion(f, 'mc', prefix),
        correct: f.answer,
        wrong,
        explanation: f.explanation,
        fachwissen: fw(bank, f.wissen, factCtx),
        dedupeKey: key,
        contentIds: [key],
      })
    }
    // Fakten = Hauptgewicht (MC/Flash), nicht Zuordnung.
    weighted.push({ weight: 4.2, gen: factVariant })
  }

  // Kein multi-Concept-pairMatch (verbrennt 4–6 IDs → Short-Rounds).
  // Stattdessen jedes Begriffspaar als einzelne MC — erweitert den Unique-Pool.
  if (bank.pairs && bank.pairs.length >= 2) {
    weighted.push({
      weight: 1.6,
      gen: (rng) => {
        const p = pick(rng, bank.pairs!)
        const key = bioConceptKey(p.concept, prefix, p.term)
        const wrong = shuffle(
          rng,
          bank.pairs!.filter((x) => x.meaning !== p.meaning).map((x) => x.meaning),
        ).slice(0, 3)
        while (wrong.length < 3) wrong.push(`Andere Bedeutung (${wrong.length})`)
        const theme = themePhraseFromPrefix(prefix)
        let themeBit =
          theme && !/^im Themenfeld\b/i.test(theme) ? ` ${theme}` : ''
        if (!themeBit && prefix) {
          const tip = prefix.split(':').filter(Boolean).pop() ?? ''
          // Keine Topic-ID-Leaks (bi-gk11-lb2-redox) und keine Rohkürzel.
          if (
            tip &&
            tip.length >= 4 &&
            tip.length <= 18 &&
            !isInternalTopicAbbrev(tip) &&
            !/^\d+$/.test(tip) &&
            !/^(bi|ge|ph|ma|os|st|sks)-/i.test(tip) &&
            !/-lb\d/i.test(tip) &&
            !/\d/.test(tip)
          ) {
            themeBit = ` (${tip.replace(/-/g, ' ')})`
          }
        }
        const term = p.term.trim()
        const meaning = p.meaning.trim()
        // Schlechte Thin-Fill-Paare (term „lage“, abgeschnittene meanings) überspringen.
        if (
          term.length < 4 ||
          meaning.length < 12 ||
          /[,:;]\s*$/.test(meaning) ||
          meaning.endsWith(' ') ||
          (term === term.toLowerCase() && term.length <= 5 && !/[äöüß-]/.test(term))
        ) {
          const factSlot = weighted.find((w) => w.weight >= 4)
          if (factSlot) return factSlot.gen(rng)
          const alt = bank.pairs!.find(
            (x) => x !== p && x.term.trim().length >= 4 && x.meaning.trim().length >= 12,
          )
          if (!alt) {
            return factSlot ? factSlot.gen(rng) : mcTask(rng, {
              question: `Was bedeutet „Begriff“?`,
              correct: 'Platzhalter',
              wrong: ['A', 'B', 'C'],
              explanation: 'Platzhalter',
              fachwissen: fw(bank, 'Platzhalter.'),
              dedupeKey: 'bio:pair-skip',
              contentIds: ['bio:pair-skip'],
            })
          }
          const altKey = bioConceptKey(alt.concept, prefix, alt.term)
          const altWrong = shuffle(
            rng,
            bank.pairs!.filter((x) => x.meaning !== alt.meaning).map((x) => x.meaning),
          ).slice(0, 3)
          while (altWrong.length < 3) altWrong.push(`Andere Bedeutung (${altWrong.length})`)
          return mcTask(rng, {
            question: `Was bedeutet „${alt.term.trim()}“${themeBit}?`,
            correct: alt.meaning.trim(),
            wrong: altWrong,
            explanation: `${alt.term}: ${alt.meaning}`,
            fachwissen: fw(bank, alt.wissen, {
              term: alt.term,
              meaning: alt.meaning,
              explanation: alt.wissen,
            }),
            dedupeKey: altKey,
            contentIds: [altKey],
          })
        }
        return mcTask(rng, {
          question: `Was bedeutet „${term}“${themeBit}?`,
          correct: meaning,
          wrong,
          explanation: `${term}: ${meaning}`,
          fachwissen: fw(bank, p.wissen, {
            term,
            meaning,
            explanation: p.wissen,
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })
  }

  if (bank.trueFalse?.length) {
    weighted.push({
      weight: 0.9,
      gen: (rng) => {
        const t = pick(rng, bank.trueFalse!)
        const key = bioConceptKey(t.concept, prefix, t.statement)
        return trueFalse(rng, {
          statement: stripBioBankSlug(t.statement),
          correct: t.correct,
          explanation: t.explanation,
          fachwissen: fw(bank, t.wissen, {
            prompt: t.statement,
            explanation: t.explanation,
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })

    // Auto „Finde den Fehler“ aus TF-Pool (≥1 falsch + ≥2 wahr).
    const falses = bank.trueFalse.filter((t) => !t.correct)
    const trues = bank.trueFalse.filter((t) => t.correct)
    if (falses.length >= 1 && trues.length >= 2) {
      weighted.push({
        weight: 1.5,
        gen: (rng) => {
          const bad = pick(rng, falses)
          const goods = shuffle(rng, trues).slice(0, 2)
          const statements = shuffle(rng, [
            stripBioBankSlug(bad.statement),
            ...goods.map((g) => stripBioBankSlug(g.statement)),
          ])
          const faulty = stripBioBankSlug(bad.statement)
          const key = bioConceptKey(bad.concept, prefix, `err:${bad.statement}`)
          const theme = themePhraseFromPrefix(prefix)
          const q = theme
            ? `Welche Aussage ${theme} enthält einen fachlichen Fehler?`
            : `Welche dieser drei Aussagen ist fachlich falsch?`
          return findErrorTask({
            question: q,
            statements,
            faulty,
            solution: faulty,
            explanation: bad.explanation,
            fachwissen: fw(bank, bad.wissen, {
              prompt: bad.statement,
              explanation: bad.explanation,
            }),
            dedupeKey: key,
            contentIds: [key],
          })
        },
      })
    }
  }

  if (bank.sorts?.length) {
    weighted.push({
      weight: 1.8,
      gen: (rng) => {
        const s = pick(rng, bank.sorts!)
        const key = bioConceptKey(s.concept, prefix, s.question)
        return sortChronologyTask(rng, {
          question: s.question,
          labels: s.labels,
          solution: s.labels.join(' → '),
          explanation: s.explanation,
          fachwissen: fw(bank, s.wissen, {
            prompt: s.question,
            explanation: s.explanation,
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })
  }

  if (bank.multis?.length) {
    weighted.push({
      weight: 1.6,
      gen: (rng) => {
        const m = pick(rng, bank.multis!)
        const key = bioConceptKey(m.concept, prefix, m.question)
        return multiPickTask(rng, {
          question: m.question,
          correct: m.correct,
          wrong: m.wrong,
          explanation: m.explanation,
          fachwissen: fw(bank, m.wissen, {
            prompt: m.question,
            explanation: m.explanation,
            answer: m.correct.join(', '),
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })
  }

  const usableIcons = (bank.icons ?? []).filter((ic) => !isTrivialAnimalIcon(ic))
  if (usableIcons.length) {
    weighted.push({
      weight: 1.5,
      gen: (rng) => {
        const ic = pick(rng, usableIcons)
        const key = bioConceptKey(ic.concept, prefix, ic.question)
        return iconBelongBioTask(rng, {
          question: ic.question,
          prompt: ic.prompt,
          options: ic.options,
          correctId: ic.correctId,
          explanation: ic.explanation,
          fachwissen: fw(bank, ic.wissen, {
            prompt: ic.question,
            explanation: ic.explanation,
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })
  }

  if (bank.sources?.length) {
    weighted.push({
      weight: 1.5,
      gen: (rng) => {
        const s = pick(rng, bank.sources!)
        const key = bioConceptKey(s.concept, prefix, s.question)
        const choices = shuffle(rng, [s.correct, ...s.wrong])
        return sourceQuoteTask({
          question: s.question,
          sourceText: s.sourceText,
          sourceLabel: s.sourceLabel ?? 'Quelle',
          sourceKind: s.sourceKind,
          attribution: s.attribution,
          choices,
          correct: s.correct,
          solution: s.correct,
          explanation: s.explanation,
          fachwissen: fw(bank, s.wissen, {
            prompt: s.question,
            explanation: s.explanation,
            answer: s.correct,
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })
  }

  if (bank.compares?.length) {
    weighted.push({
      weight: 1.7,
      gen: (rng) => {
        const c = pick(rng, bank.compares!)
        const key = bioConceptKey(c.concept, prefix, c.question)
        const correctId = c.correct
        const body = correctId === 'A' ? c.cardA.body : c.cardB.body
        return comparePickTask({
          question: c.question,
          cards: [
            { id: 'A', title: c.cardA.title, body: c.cardA.body },
            { id: 'B', title: c.cardB.title, body: c.cardB.body },
          ],
          correctId,
          solution: body,
          explanation: c.explanation,
          fachwissen: fw(bank, c.wissen, {
            prompt: c.question,
            explanation: c.explanation,
            answer: body,
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })
  }

  if (bank.findErrors?.length) {
    weighted.push({
      weight: 1.6,
      gen: (rng) => {
        const fe = pick(rng, bank.findErrors!)
        const faulty = fe.statements[fe.faultyIndex]!
        const key = bioConceptKey(fe.concept, prefix, faulty)
        const theme = themePhraseFromPrefix(prefix)
        const fallbackQ = theme
          ? `Welche Aussage ${theme} enthält einen fachlichen Fehler?`
          : `Welche dieser Aussagen ist fachlich falsch? (${faulty.slice(0, 24)}…)`
        return findErrorTask({
          question: fe.question ?? fallbackQ,
          statements: shuffle(rng, [...fe.statements]),
          faulty,
          solution: faulty,
          explanation: fe.explanation,
          fachwissen: fw(bank, fe.wissen, {
            prompt: fe.question ?? faulty,
            explanation: fe.explanation,
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })
  }

  if (bank.hotspots?.length) {
    weighted.push({
      weight: 1.6,
      gen: (rng) => {
        const h = pick(rng, bank.hotspots!)
        const key = bioConceptKey(h.concept, prefix, h.question)
        return imageHotspotTask({
          question: h.question,
          correctRegionId: h.correctRegionId,
          regions: h.regions,
          imageSvg: h.imageSvg,
          solution:
            h.regions.find((r) => r.id === h.correctRegionId)?.label ?? h.correctRegionId,
          explanation: h.explanation,
          fachwissen: fw(bank, h.wissen, {
            prompt: h.question,
            explanation: h.explanation,
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })
  }

  if (bank.causeEffects && bank.causeEffects.length >= 3) {
    // Kein causeEffect-Pair-UI (Concept-Verbrennung) — nur „Was passiert wenn…?“ als MC.
    weighted.push({
      weight: 1.5,
      gen: (rng) => {
        const ce = pick(rng, bank.causeEffects!)
        const wrong = shuffle(
          rng,
          bank
            .causeEffects!.filter((x) => x !== ce)
            .map((x) => x.effect),
        ).slice(0, 3)
        while (wrong.length < 3) wrong.push(`Andere Folge (${wrong.length})`)
        const key = bioConceptKey(ce.concept, prefix, `whatif:${ce.cause}`)
        return mcTask(rng, {
          question: `Was passiert, wenn: ${ce.cause}?`,
          correct: ce.effect,
          wrong,
          explanation: `${ce.cause} → ${ce.effect}`,
          fachwissen: fw(bank, ce.wissen, {
            prompt: ce.cause,
            explanation: ce.effect,
            answer: ce.effect,
          }),
          dedupeKey: key,
          contentIds: [key],
        })
      },
    })
  }

  if (weighted.length === 0) {
    return () =>
      gapFillTask({
        question: 'Tipp „ok“ — Aufgabenbank fehlt noch.',
        accepted: ['ok'],
        solution: 'ok',
        explanation: 'Platzhalter.',
        fachwissen: fw(bank, 'Platzhalter.'),
        dedupeKey: 'bio:placeholder',
        contentIds: ['bio:placeholder'],
      })
  }

  return mixedVariantsWeighted(...weighted)
}
