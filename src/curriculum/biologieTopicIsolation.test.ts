import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { BIOLOGIE_GENERATORS } from './biologieGenerators'

/** Sample many tasks; collect question + prompt text for topic-bleed checks. */
function sampleTexts(topicId: string, n = 80): string[] {
  const gen = BIOLOGIE_GENERATORS[topicId]!
  const out: string[] = []
  for (let seed = 0; seed < n; seed++) {
    const task = gen(createRng(seed * 101 + 7))
    out.push(task.question)
    const prompt = task.interactive?.props?.prompt
    if (typeof prompt === 'string') out.push(prompt)
    const front = task.interactive?.props?.front
    if (typeof front === 'string') out.push(front)
  }
  return out
}

describe('Biologie topic isolation (no cross-pollination)', () => {
  it('Wirbellose Überblick never asks vertebrate-group iconBelong (Vögel/Fische/…)', () => {
    const texts = sampleTexts('bi-k6-lb2-wirbellose', 120).join('\n')
    expect(texts).not.toMatch(/gehört zu den Vögeln/i)
    expect(texts).not.toMatch(/Gruppe:\s*Vögel/i)
    expect(texts).not.toMatch(/gehört zu den Fischen/i)
    expect(texts).not.toMatch(/Gruppe:\s*Fische/i)
    expect(texts).not.toMatch(/gehört zu den Säugetieren/i)
    // May mention vertebrates only as contrast (wirbellos vs Wirbeltier) — OK
    expect(texts.toLowerCase()).toMatch(/wirbellos/)
  })

  it('Insekten topic stays on insects — not spider-net or bird assign', () => {
    const texts = sampleTexts('bi-k6-lb2-insekten', 100).join('\n')
    expect(texts).not.toMatch(/Spinnennetz/i)
    expect(texts).not.toMatch(/gehört zu den Vögeln/i)
    expect(texts).toMatch(/Insekt|Metamorphose|Beine|Chitin|Imago|Puppe/i)
  })

  it('Spinnen topic stays on spiders — not full insect metamorphose sort as sole bank', () => {
    const texts = sampleTexts('bi-k6-lb2-spinnen', 100).join('\n')
    expect(texts).not.toMatch(/gehört zu den Vögeln/i)
    expect(texts).toMatch(/Spinne|Beine|Netz|Spinnenseide|acht/i)
  })

  it('Fische Überblick never asks „Welches Tier gehört zu den Vögeln?“', () => {
    const texts = sampleTexts('bi-k5-lb2-fische', 100).join('\n')
    expect(texts).not.toMatch(/gehört zu den Vögeln/i)
    expect(texts).not.toMatch(/Gruppe:\s*Vögel/i)
    expect(texts).not.toMatch(/gehört zu den Säugetieren/i)
  })

  it('Vögel Überblick never asks fish/lurch assign icons', () => {
    const texts = sampleTexts('bi-k5-lb5-voegel', 100).join('\n')
    expect(texts).not.toMatch(/gehört zu den Fischen/i)
    expect(texts).not.toMatch(/Gruppe:\s*Fische/i)
    expect(texts).not.toMatch(/gehört zu den Lurchen/i)
  })
})
