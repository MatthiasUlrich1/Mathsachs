/**
 * Physik-Banken: nur MC / Wert — kein TF, keine Zuordnung, keine Lücken.
 * Definitions-Prompts („Was bedeutet …?“) werden in Anwendungskontext umformuliert.
 * siehe `.cursor/rules/curriculum-aufgaben-qualitaet.mdc`
 */
import { stripBioMetaWissen, type BioBank } from './biologieBank'
import { mathBankGenerate } from './mathBank'
import type { Topic } from './types'

export function rewritePhysikPrompt(prompt: string): string {
  const m = prompt.match(
    /Fachbegriff\s*\(([^)]+)\):\s*Was bedeutet\s*[„"]([^„"”]+)[“"]\s*\?/i,
  )
  if (m) {
    return `Welche Aussage zu „${m[2]}“ (${m[1]}) ist fachlich richtig?`
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
  const fromPairs =
    bank.pairs?.map((p) => {
      const wissen = cleanWissen(p.wissen) ?? `${p.term}: ${p.meaning}.`
      return {
        concept: p.concept,
        prompt: hint
          ? `Welche Aussage zu „${p.term}“ (${hint}) ist fachlich richtig?`
          : `Welche Aussage zu „${p.term}“ ist fachlich richtig?`,
        answer: p.meaning,
        wrong: undefined as string[] | undefined,
        explanation: wissen,
        wissen,
      }
    }) ?? []

  const facts = [
    ...(bank.facts?.map((f) => ({
      ...f,
      prompt: rewritePhysikPrompt(f.prompt),
      wissen: cleanWissen(f.wissen) ?? f.wissen,
      explanation: cleanWissen(f.explanation) ?? f.explanation,
      gap: undefined,
      gapAccepted: undefined,
      flashFront: undefined,
    })) ?? []),
    ...fromPairs,
  ]

  return {
    ...bank,
    facts: facts.length ? facts : undefined,
    pairs: undefined,
    trueFalse: undefined,
  }
}

export function physikBankGenerate(bank: BioBank): Topic['generate'] {
  return mathBankGenerate(sanitizePhysikBank(bank))
}
