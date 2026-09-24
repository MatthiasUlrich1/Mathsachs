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
import { mixedVariants } from './taskHelpers'
import type { Topic } from './types'
import {
  bioFw,
  clozeBlanksTask,
  flashcardBioTask,
  gapFillTask,
  iconBelongBioTask,
  matchTermsTask,
  mcTask,
  multiPickTask,
  pick,
  shuffle,
  sortChronologyTask,
  trueFalse,
} from './biologieHelpers'
import { deepenBioBank } from './biologieBankDeepen'

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
}

/** Thin / placeholder wissen that must never reach the UI as sole Fachwissen. */
const PLACEHOLDER_WISSEN =
  /^(LB:?\s|Wahl:?\s|Wahlbereich|Anwendungen und Perspektiven|Grundlagen[,.]?\s|Lehrplanziel|Zellbiologie\.?$|Genregulation\.?$|Molekulare Genetik\.?$|Genexpression\.?$|Einordnung\.?$|Spezifität\.?$|Vernetzung\.?$|Systemdenken\.?$|Immunologie\.?$|Systematisierung|Populationsökologie\.?$|Dissimilation\.?$|Praxisbezug\.?$|Verstärkung\.?$|Klassische Ethologie\.?$|Differenzierung\.?$|Schutzziel\.?$|Evolutionärer Hintergrund\.?$|Nachhaltigkeitsdiskurs\.?$|Handlungsoptionen|Kommunikation zwischen Zellen\.?$|Biodiversität und ihre Entstehung\.?$|Verhalten von Tier|Redoxprozesse|Vergleich Fotosynthese|Zelluläre Organisation\.?$|Leben in der Wüste\.?$|Schlaukopf)/i

export function isThinBioWissen(text: string): boolean {
  const t = text.trim()
  if (!t || t.length < 80) return true
  if (PLACEHOLDER_WISSEN.test(t)) return true
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
  const raw = wissen.trim()
  if (raw && !isThinBioWissen(raw) && !PLACEHOLDER_WISSEN.test(raw)) {
    return raw
  }

  const parts: string[] = []
  const push = (s?: string) => {
    const x = (s ?? '').trim()
    if (!x) return
    if (PLACEHOLDER_WISSEN.test(x) && x.length < 80) return
    if (/\bLB:\s|Wahl:\s|Wahlbereich:/i.test(x)) return
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
    .replace(/\bFachbegriff\s*\([a-z0-9äöüß_-]+\)\s*:/gi, 'Fachbegriff:')
    .replace(/^\(([a-z0-9äöüß_-]+)\)\s+/i, '')
    // Theme slug prefix on flash fronts only (lowercase keys like "baeume: …").
    .replace(/^([a-z][a-z0-9_-]*):\s+(?=\S)/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True when question already names a term that a gap/cloze expects as answer. */
export function bioQuestionSpoilsTerm(
  question: string,
  acceptedTerms: string[],
): boolean {
  const q = question
  for (const raw of acceptedTerms) {
    const t = raw.trim()
    if (t.length < 2) continue
    if (q.includes(`„${t}“`) || q.includes(`"${t}"`) || q.includes(`'${t}'`)) {
      return true
    }
  }
  return false
}

/**
 * Question for a fact variant. Gap/cloze that asks for the Fachbegriff must not
 * spoil that term in the question (meaning→term). MC/flash keep term→meaning.
 */
export function bioFactQuestion(
  f: BioFact,
  mode: 'mc' | 'flash' | 'gap' | 'cloze',
): string {
  const base = stripBioBankSlug(f.prompt)
  if (mode === 'mc' || mode === 'flash') return base || f.prompt

  const accepted = [
    ...(f.gapAccepted ?? []),
    ...(f.clozeAccepted?.flat() ?? []),
  ]
  if (bioQuestionSpoilsTerm(base, accepted) || bioQuestionSpoilsTerm(f.prompt, accepted)) {
    return 'Welcher Fachbegriff passt zur Erklärung?'
  }
  // Fachbegriff-Lücke with meaning after the blank — never restate the term above.
  const gap = f.gap ?? f.cloze ?? ''
  if (/Fachbegriff\s*:/i.test(gap) && gap.includes('___') && accepted.length > 0) {
    return 'Welcher Fachbegriff passt zur Erklärung?'
  }
  return base || 'Welcher Fachbegriff passt zur Erklärung?'
}

/** Prefer large Zuordnungen when the Begriffspool allows (4–6, not always 3). */
function pickPairSubset<T extends { term: string }>(rng: Rng, pairs: T[]): T[] {
  const n = pairs.length
  if (n <= 3) return shuffle(rng, pairs)
  let size = 3
  if (n >= 12) size = rng() < 0.55 ? 6 : 5
  else if (n >= 8) size = rng() < 0.5 ? 5 : 4
  else if (n >= 5) size = 4

  const shuffled = shuffle(rng, pairs)
  // Prefer unique left labels so interchangeable duplicates are rare.
  const unique: T[] = []
  const seen = new Set<string>()
  for (const p of shuffled) {
    const key = p.term.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(p)
    if (unique.length >= size) return unique
  }
  if (unique.length >= 3) return unique
  // Last resort: allow duplicates so the match still has enough rows.
  for (const p of shuffled) {
    if (unique.includes(p)) continue
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
  return {
    ...bank,
    facts: bank.facts?.map((f) => ({
      ...f,
      prompt: stripBioBankSlug(f.prompt),
      flashFront: f.flashFront ? stripBioBankSlug(f.flashFront) : undefined,
    })),
    trueFalse: bank.trueFalse?.map((t) => ({
      ...t,
      statement: stripBioBankSlug(t.statement),
    })),
    pairs: dedupeBioPairsByTerm(bank.pairs),
  }
}

/** Build a playable Topic.generate from a knowledge bank. */
export function bankGenerate(bank: BioBank): Topic['generate'] {
  // Expand Begriff/fact pools first — existing wissen strings stay untouched.
  bank = sanitizeBioBank(deepenBioBank(bank))
  const prefix = bank.conceptPrefix
  const variants: Array<(rng: Rng) => ReturnType<Topic['generate']>> = []

  if (bank.facts?.length) {
    // One variant family for facts: randomly MC / cloze / flash — same concept key.
    variants.push((rng) => {
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

      if (mode < 0.34 && f.cloze && f.clozeAccepted?.length) {
        return clozeBlanksTask({
          question: bioFactQuestion(f, 'cloze'),
          template: f.cloze,
          accepted: f.clozeAccepted,
          solution: f.clozeAccepted.map((a) => a[0]).join(' / '),
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen, factCtx),
          dedupeKey: key,
          contentIds: [key],
        })
      }
      if (mode < 0.55 && f.gap && f.gapAccepted?.length) {
        if (f.gap.includes('___')) {
          return clozeBlanksTask({
            question: bioFactQuestion(f, 'gap'),
            template: f.gap,
            accepted: [f.gapAccepted],
            solution: f.gapAccepted[0]!,
            explanation: f.explanation,
            fachwissen: fw(bank, f.wissen, factCtx),
            dedupeKey: key,
            contentIds: [key],
          })
        }
        return gapFillTask({
          question: bioFactQuestion(f, 'gap'),
          accepted: f.gapAccepted,
          solution: f.gapAccepted[0]!,
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen, factCtx),
          dedupeKey: key,
          contentIds: [key],
        })
      }
      if (mode < 0.72) {
        const flashWrong =
          f.wrong?.length && f.wrong.length >= 2
            ? shuffle(rng, f.wrong).slice(0, 3)
            : wrong.slice(0, 3)
        const flashQ = bioFactQuestion(f, 'flash')
        return flashcardBioTask({
          question: flashQ,
          front: stripBioBankSlug(f.flashFront ?? flashQ),
          accepted: [f.answer, ...(f.gapAccepted ?? [])],
          solution: f.answer,
          explanation: f.explanation,
          fachwissen: fw(bank, f.wissen, factCtx),
          choices: shuffle(rng, [f.answer, ...flashWrong.slice(0, 3)]),
          dedupeKey: key,
          contentIds: [key],
        })
      }
      return mcTask(rng, {
        question: bioFactQuestion(f, 'mc'),
        correct: f.answer,
        wrong,
        explanation: f.explanation,
        fachwissen: fw(bank, f.wissen, factCtx),
        dedupeKey: key,
        contentIds: [key],
      })
    })
  }

  if (bank.pairs && bank.pairs.length >= 3) {
    const pairMatchVariant = (rng: Rng) => {
      const subset = pickPairSubset(rng, bank.pairs!)
      const distractorPool = bank.pairs!.filter((p) => !subset.includes(p))
      const distractor =
        distractorPool.length > 0
          ? pick(rng, distractorPool).meaning
          : 'Photosynthese in Mitochondrien'
      const keys = subset.map((p) => bioConceptKey(p.concept, prefix, p.term))
      const fwText = subset
        .map((p) =>
          expandBioWissen(p.wissen, {
            term: p.term,
            meaning: p.meaning,
            explanation: p.wissen,
          }),
        )
        .join(' ')
      const n = subset.length
      return matchTermsTask(rng, {
        question:
          n >= 5
            ? `Ordne zu: ${n} Fachbegriffe und Erklärungen (Klick-Paare).`
            : 'Ordne Begriff und Erklärung einander zu (Klick-Paare).',
        terms: subset.map((p) => p.term),
        meanings: subset.map((p) => p.meaning),
        distractor,
        solution: subset.map((p) => `${p.term} → ${p.meaning}`).join('; '),
        explanation: subset.map((p) => `${p.term}: ${p.wissen}`).join(' '),
        fachwissen: fw(bank, fwText),
        // Each Begriff concept blocks MC/TF/Match reuse in the same round (Bug A).
        dedupeKey: `pair:${[...keys].sort().join('+')}`,
        contentIds: keys,
      })
    }
    // Weight Zuordnung heavily when the pool is rich — variety, not short rounds.
    variants.push(pairMatchVariant)
    if (bank.pairs.length >= 6) variants.push(pairMatchVariant)
    if (bank.pairs.length >= 10) variants.push(pairMatchVariant)
  }

  if (bank.trueFalse?.length) {
    variants.push((rng) => {
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
    })
  }

  if (bank.sorts?.length) {
    variants.push((rng) => {
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
    })
  }

  if (bank.multis?.length) {
    variants.push((rng) => {
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
    })
  }

  const usableIcons = (bank.icons ?? []).filter((ic) => !isTrivialAnimalIcon(ic))
  if (usableIcons.length) {
    variants.push((rng) => {
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
    })
  }

  if (variants.length === 0) {
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

  return mixedVariants(...variants)
}
