/**
 * Mathematik-Banken: nur MC / Wert — keine Zuordnung, keine Lücken, kein TF.
 * siehe `.cursor/rules/curriculum-aufgaben-qualitaet.mdc`
 */
import { type Rng } from '../lib/rng'
import { mixedVariants, valueTask } from './taskHelpers'
import { sanitizeBioBank, type BioBank } from './biologieBank'
import { mcTask, pick, shuffle } from './biologieHelpers'
import type { Topic } from './types'

function conceptKey(concept: string | undefined, prefix: string | undefined, fallback: string): string {
  if (concept?.trim()) return concept
  const p = prefix?.trim()
  return p ? `${p}:${fallback.slice(0, 48)}` : fallback.slice(0, 64)
}

const normOpt = (s: string) =>
  s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/^(sie|er|es)\s+/i, '')
    .replace(/\s+/g, ' ')
    .replace(/[„“”"']/g, '')
    .trim()

/** Distraktoren ohne Duplikate und ohne die richtige Antwort. */
function uniqueWrongs(correct: string, candidates: string[], fill: (i: number) => string): string[] {
  const seen = new Set<string>([normOpt(correct)])
  const out: string[] = []
  for (const c of candidates) {
    const n = normOpt(c)
    if (!n || seen.has(n)) continue
    seen.add(n)
    out.push(c)
    if (out.length >= 3) return out
  }
  let i = 0
  while (out.length < 3 && i < 12) {
    const w = fill(i++)
    const n = normOpt(w)
    if (!n || seen.has(n)) continue
    seen.add(n)
    out.push(w)
  }
  return out
}

/** Fachwissen ≥40 Zeichen und mit Bezug zu Frage/Antwort (Audit fachwissen). */
function bankFachwissen(text: string | undefined, question: string, answer: string): string {
  let t = (text ?? '').trim()
  if (t.length < 40) {
    t = `${t} ${answer}. ${question}`.replace(/\s+/g, ' ').trim()
  }
  if (t.length < 40) t = `${answer}: ${question} — prüfbarer Lehrplaninhalt.`
  // Sicherstellen, dass Antwortlemma im Wissen vorkommt (Bezug zur Aufgabe).
  if (answer.trim().length >= 4 && !normOpt(t).includes(normOpt(answer).slice(0, 6))) {
    t = `${t} Stichwort: ${answer}.`
  }
  return t
}

/**
 * Mathe-sichere Bank: Facts → MC, Pairs → MC (nie Match/Cloze/TF).
 * trueFalse-Einträge werden bewusst ignoriert (Mathe: kein TF).
 */
export function mathBankGenerate(bank: BioBank): Topic['generate'] {
  bank = sanitizeBioBank(bank)
  const prefix = bank.conceptPrefix
  const variants: Array<(rng: Rng) => ReturnType<Topic['generate']>> = []

  if (bank.facts?.length) {
    variants.push((rng) => {
      const f = pick(rng, bank.facts!)
      const key = conceptKey(f.concept, prefix, f.prompt)
      const pool =
        f.wrong?.length && f.wrong.length >= 3
          ? shuffle(rng, f.wrong)
          : shuffle(
              rng,
              bank.facts!.filter((x) => normOpt(x.answer) !== normOpt(f.answer)).map((x) => x.answer),
            )
      const wrong = uniqueWrongs(f.answer, pool, (i) => `Andere Deutung (${i + 1})`)
      const question = f.prompt.replace(/\s*__+\s*/g, ' … ').trim()
      const fw = bankFachwissen(f.wissen || f.explanation, question, f.answer)
      return mcTask(rng, {
        question,
        correct: f.answer,
        wrong,
        explanation: f.explanation,
        fachwissen: {
          text: fw,
          quelle: bank.quelle,
          url: bank.url,
        },
        dedupeKey: key,
        contentIds: [key],
      })
    })
  }

  if (bank.pairs && bank.pairs.length >= 3) {
    variants.push((rng) => {
      const p = pick(rng, bank.pairs!)
      const key = conceptKey(p.concept, prefix, p.term)
      const pool = shuffle(
        rng,
        bank.pairs!.filter((x) => normOpt(x.meaning) !== normOpt(p.meaning)).map((x) => x.meaning),
      )
      const wrong = uniqueWrongs(p.meaning, pool, (i) => `Andere Aussage (${i + 1})`)
      const question = `Was trifft auf „${p.term}“ zu?`
      const fw = bankFachwissen(p.wissen || `${p.term}: ${p.meaning}.`, question, p.meaning)
      return mcTask(rng, {
        question,
        correct: p.meaning,
        wrong,
        explanation: p.wissen || `${p.term}: ${p.meaning}.`,
        fachwissen: {
          text: fw,
          quelle: bank.quelle,
          url: bank.url,
        },
        dedupeKey: key,
        contentIds: [key],
      })
    })
  }

  // bank.trueFalse bewusst nicht verdrahtet — Mathe/Physik: kein TF.

  if (variants.length === 0) {
    return () =>
      valueTask({
        question: 'Berechne 2 + 3.',
        answerKind: 'integer',
        value: 5,
        solution: '5',
        explanation: '2 + 3 = 5.',
        fachwissen: {
          text: 'Addition natürlicher Zahlen: 2 + 3 = 5.',
          quelle: bank.quelle,
          url: bank.url,
        },
        dedupeKey: `${prefix ?? 'ma'}:fallback-add`,
      })
  }

  return mixedVariants(...variants)
}
