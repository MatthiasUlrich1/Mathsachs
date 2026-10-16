/**
 * Physik-Banken: nur MC / Wert — kein TF, keine Zuordnung, keine Lücken.
 * Definitions-Prompts („Was bedeutet …?“) werden in Anwendungskontext umformuliert.
 * siehe `.cursor/rules/curriculum-aufgaben-qualitaet.mdc`
 */
import {
  isShallowGlossaryEntry,
  redactSolutionSpoilers,
  stripBioMetaWissen,
  type BioBank,
} from './biologieBank'
import { mathBankGenerate } from './mathBank'
import type { Topic } from './types'

export function rewritePhysikPrompt(prompt: string): string {
  const m = prompt.match(
    /Fachbegriff\s*\(([^)]+)\):\s*Was bedeutet\s*[„"]([^„"”]+)[“"]\s*\?/i,
  )
  if (m) {
    const term = m[2]!
    // Klammerhinweis ohne Antwortformel/Spoilers (z. B. „R = ρ·l/A“)
    let hint = m[1]!.replace(/\s+/g, ' ').trim()
    if (hint === term || /[ρλΔ=]|·l\/A|h\s*\/\s*p/i.test(hint)) hint = ''
    return hint
      ? `Welche Aussage zu „${term}“ (${hint}) ist fachlich richtig?`
      : `Welche Aussage zu „${term}“ ist fachlich richtig?`
  }
  const m2 = prompt.match(/Was bedeutet\s*[„"]([^„"”]+)[“"]\s*\?/i)
  if (m2) {
    const term = m2[1]!
    if (/^Alltag\b/i.test(term)) {
      return `Welche Alltagsbedeutung trifft auf „${term}“ zu?`
    }
    if (/^Modell\b/i.test(term)) {
      return `Welche Modellaussage zu „${term}“ ist im Gültigkeitsbereich richtig?`
    }
    return `Welche Aussage zu „${term}“ ist fachlich richtig?`
  }
  // ohne Anführungszeichen: „Was bedeutet Schwerelosigkeit …?“
  const m3 = prompt.match(/^Was bedeutet\s+(.+?)\s*\??\s*$/i)
  if (m3) {
    const topic = m3[1]!.replace(/\s+qualitativ$/i, '').trim()
    return `Welche Aussage zu ${topic} ist fachlich richtig?`
  }
  // Begriffsdrill „Was ist der/die/das …?“ → Anwendung
  const m4 = prompt.match(/^Was ist (ein|eine|der|die|das)\s+(.+?)\s*\??\s*$/i)
  if (m4) {
    const term = m4[2]!.replace(/\s+/g, ' ').trim()
    return `Welche Aussage zu „${term}“ ist fachlich richtig?`
  }
  const m5 = prompt.match(/^Was versteht man unter\s+(einem|einer|einem|dem|der|das)?\s*(.+?)\s*\??\s*$/i)
  if (m5) {
    const term = m5[2]!.replace(/\s+/g, ' ').trim()
    return `Welche Aussage zu „${term}“ ist fachlich richtig?`
  }
  return prompt
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

function sanitizePhysikBank(bank: BioBank): BioBank {
  const hint =
    bank.pairs?.map((p) => topicHintFromWissen(p.wissen)).find(Boolean) ||
    bank.facts?.map((f) => topicHintFromWissen(f.wissen) || topicHintFromWissen(f.explanation)).find(
      Boolean,
    )

  // Pairs → Facts mit Themenhinweis (mathBank würde sonst „Welche Aussage zu X?“ ohne Kontext).
  // Hinweis darf die Antwortformel nicht spoilern (z. B. „Widerstandsgesetz R = ρ·l/A“).
  const safeHint = (term: string, meaning: string) => {
    if (!hint) return undefined
    const h = hint.replace(/\s+/g, ' ').trim()
    if (!h || h === term) return undefined
    if (h.includes(meaning) || meaning.includes(h)) return term
    if (/[ρλΔ=·]/.test(h) && /[ρλΔ=·]/.test(meaning)) return term
    return h
  }
  const fromPairs =
    bank.pairs?.map((p) => {
      const wissen = cleanWissen(p.wissen) ?? `${p.term}: ${p.meaning}.`
      const h = safeHint(p.term, p.meaning)
      return {
        concept: p.concept,
        prompt: h
          ? `Welche Aussage zu „${p.term}“ (${h}) ist fachlich richtig?`
          : `Welche Aussage zu „${p.term}“ ist fachlich richtig?`,
        answer: p.meaning,
        wrong: undefined as string[] | undefined,
        explanation: wissen,
        wissen,
      }
    }) ?? []

  const facts = [
    ...(bank.facts?.map((f) => {
      let prompt = rewritePhysikPrompt(f.prompt)
      const ans = String(f.answer ?? '').trim()
      // Spoiler: Antwortwort steht im Stem — nur an Wortgrenzen
      prompt = redactSolutionSpoilers(prompt, ans)
      return {
        ...f,
        prompt,
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
  const dedupedFacts = facts.filter((f) => {
    const ans = String(f.answer ?? '').trim()
    const term =
      f.prompt.match(/[„""']([^„""']+)[“""']/)?.[1] ||
      String(f.flashFront ?? '').trim() ||
      ''
    // Flache Glossar-Synonyme (Term → Mini-Definition) nicht als MC ausspielen
    if (ans && isShallowGlossaryEntry(term || ans.slice(0, 24), ans)) return false
    const k = ans
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
