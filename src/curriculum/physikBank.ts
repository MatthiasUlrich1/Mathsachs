/**
 * Physik-Banken: nur MC / Wert — kein TF, keine Zuordnung, keine Lücken.
 * Definitions-Prompts („Was bedeutet …?“) werden in konkrete Anwendungsfragen umformuliert.
 * siehe `.cursor/rules/curriculum-aufgaben-qualitaet.mdc`
 */
import { redactSolutionSpoilers, stripBioMetaWissen, type BioBank } from './biologieBank'
import {
  classifyGlossaryStyle,
  concreteGlossaryStem,
  expandGlossaryAnswer,
  expandGlossaryDistractor,
  isConcreteGlossaryStem,
  isWeakGlossaryOption,
  rewriteVagueGlossaryPrompt,
  stripBankSlugPrefix,
} from './glossaryMcRewrite'
import { mathBankGenerate } from './mathBank'
import type { Topic } from './types'

export function rewritePhysikPrompt(prompt: string, meaning?: string): string {
  const raw = stripBankSlugPrefix(prompt).replace(/\s+/g, ' ').trim()
  if (isConcreteGlossaryStem(raw)) return raw

  const rewritten = rewriteVagueGlossaryPrompt(prompt, { meaning })
  if (rewritten) return rewritten

  // Legacy Physik-spezifische Reste (Alltag / Modell), ohne „fachlich richtig“.
  const m2 = raw.match(/Was bedeutet\s*[„"]([^„"”]+)[“"]\s*\?/i)
  if (m2) {
    const term = m2[1]!
    if (/^Alltag\b/i.test(term)) {
      return `Welche Alltagsbedeutung hat „${term}“ in diesem Zusammenhang?`
    }
    if (/^Modell\b/i.test(term)) {
      return `Welche Modellaussage zu „${term}“ gilt im Gültigkeitsbereich?`
    }
    return concreteGlossaryStem(term, undefined, meaning)
  }

  return raw
}

function cleanWissen(text: string | undefined): string | undefined {
  if (!text) return text
  return stripBioMetaWissen(
    text
      .replace(/\s*Im Unterrichtsthema[^.!?]*[.!?]/gi, ' ')
      .replace(/\s*Merke:[^.!?]*[.!?]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  )
}

/** Topic title embedded in deepen-template wissen — keep it in MC stems. */
function topicHintFromWissen(text: string | undefined): string | undefined {
  const m = text?.match(/Im Unterrichtsthema\s*[„"]([^„"”]+)[“"]/)
  return m?.[1]?.trim() || undefined
}

/** Topic hint from Fachbegriff (Topic): … pattern or Bezug: Topic. */
function topicFromFact(f: { prompt?: string; wissen?: string; explanation?: string }): string | undefined {
  const fromPrompt = f.prompt?.match(/Fachbegriff\s*\(([^)]+)\)/i)?.[1]?.trim()
  if (fromPrompt) return fromPrompt
  const bezug = (f.wissen || f.explanation || '').match(/Bezug:\s*([^.]+)/i)?.[1]?.trim()
  if (bezug && bezug.length < 60) return bezug
  return topicHintFromWissen(f.wissen) || topicHintFromWissen(f.explanation)
}

function sanitizePhysikBank(bank: BioBank): BioBank {
  const hint =
    bank.pairs?.map((p) => topicHintFromWissen(p.wissen)).find(Boolean) ||
    bank.facts?.map((f) => topicHintFromWissen(f.wissen) || topicHintFromWissen(f.explanation)).find(
      Boolean,
    )

  /** Never surface machine ids like `ph-k6-lb1-…` in Schüler stems. */
  const isMachineTopic = (t: string | undefined): boolean =>
    !!t && (/^(ph|bio|ge|ma)[\s:_-]/i.test(t) || /\bk\d+\b/i.test(t) || /\blb\d+/i.test(t))

  const humanTopic = (...candidates: Array<string | undefined>): string | undefined => {
    for (const c of candidates) {
      const t = c?.replace(/\s+/g, ' ').trim()
      if (t && !isMachineTopic(t) && t.length < 80) return t
    }
    return undefined
  }

  // Pairs → Facts mit konkreter Schülerfrage (kein „fachlich richtig“).
  const safeHint = (term: string, meaning: string) => {
    if (!hint) return undefined
    const h = hint.replace(/\s+/g, ' ').trim()
    if (!h || h === term) return undefined
    if (h.includes(meaning) || meaning.includes(h)) return undefined
    if (/[ρλΔ=·]/.test(h) && /[ρλΔ=·]/.test(meaning)) return undefined
    return h
  }
  const factTerms = new Set(
    (bank.facts ?? [])
      .map(
        (f) =>
          f.flashFront?.trim().toLowerCase() ||
          f.prompt.match(/[„""']([^„""']+)[“""']/)?.[1]?.trim().toLowerCase() ||
          '',
      )
      .filter(Boolean),
  )

  const fromPairs =
    bank.pairs
      ?.filter((p) => !factTerms.has(p.term.trim().toLowerCase()))
      .map((p) => {
        const wissen = cleanWissen(p.wissen) ?? `${p.term}: ${p.meaning}.`
        const topic = humanTopic(
          safeHint(p.term, p.meaning),
          p.wissen?.match(/Bezug:\s*([^.]+)/i)?.[1],
        )
        const style = classifyGlossaryStyle(p.term, p.meaning, topic)
        const answer = expandGlossaryAnswer(p.meaning, { term: p.term, topic, style })
        return {
          concept: p.concept,
          prompt: concreteGlossaryStem(p.term, topic, p.meaning),
          answer,
          wrong: undefined as string[] | undefined,
          explanation: wissen,
          wissen,
        }
      }) ?? []

  const facts = [
    ...(bank.facts?.map((f) => {
      const topic = humanTopic(topicFromFact(f))
      const ansRaw = String(f.answer ?? '').trim()
      // Prefer concrete stem from term in flashFront / quoted prompt
      const term =
        f.flashFront?.trim() ||
        f.prompt.match(/[„""']([^„""']+)[“""']/)?.[1]?.trim() ||
        ''
      let prompt = rewritePhysikPrompt(f.prompt, ansRaw)
      // Keep hand-authored concrete stems (e.g. Timer/Sensor gold example).
      if (term && !isConcreteGlossaryStem(prompt)) {
        prompt = concreteGlossaryStem(term, topic, ansRaw)
      }
      const style = classifyGlossaryStyle(term || '', ansRaw, topic)
      const expandNeeded =
        isWeakGlossaryOption(ansRaw) ||
        (ansRaw.split(/\s+/).length <= 7 && !/^(Sie|Er|Es|Man)\s/i.test(ansRaw))
      const answer = expandNeeded
        ? expandGlossaryAnswer(ansRaw, { term: term || undefined, topic, style })
        : ansRaw
      const wrong = f.wrong?.map((w) => {
        const wr = String(w).trim()
        if (!isWeakGlossaryOption(wr) && (wr.split(/\s+/).length > 7 || /^(Sie|Er|Es|Man)\s/i.test(wr))) {
          return wr
        }
        return expandGlossaryDistractor(wr, topic, { term: term || undefined, style })
      })
      prompt = redactSolutionSpoilers(prompt, answer)
      return {
        ...f,
        prompt,
        answer,
        wrong,
        wissen: cleanWissen(f.wissen) ?? f.wissen,
        explanation: cleanWissen(f.explanation) ?? f.explanation,
        gap: undefined,
        gapAccepted: undefined,
        flashFront: undefined,
      }
    }) ?? []),
    ...fromPairs,
  ]
  // Gleicher Fakt nicht doppelt (pair+fact) — sonst round-dup „gleicher Fakt“.
  const seenAns = new Set<string>()
  const seenTerm = new Set<string>()
  const dedupedFacts = facts.filter((f) => {
    const termKey =
      f.prompt.match(/[„""']([^„""']+)[“""']/)?.[1]?.trim().toLowerCase() ||
      ( /timer oder sensor/i.test(f.prompt) ? 'timer/sensor' : '')
    if (termKey) {
      if (seenTerm.has(termKey)) return false
      seenTerm.add(termKey)
    }
    const k = String(f.answer ?? '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[·⋅]/g, '/')
      .replace(/∕/g, '/')
      .trim()
    if (!k || seenAns.has(k)) return false
    seenAns.add(k)
    return true
  })

  return {
    ...bank,
    facts: dedupedFacts.length ? dedupedFacts : undefined,
    pairs: undefined,
    trueFalse: undefined,
  }
}

export function physikBankGenerate(bank: BioBank): Topic['generate'] {
  return mathBankGenerate(sanitizePhysikBank(bank))
}
