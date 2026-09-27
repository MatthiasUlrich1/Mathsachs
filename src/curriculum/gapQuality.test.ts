import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  gapQualityIssues,
  isFragmentGapAnswer,
  isMetaGapTemplate,
} from './gapQuality'

describe('gapQuality', () => {
  it('flags meta gap templates', () => {
    expect(isMetaGapTemplate('Korrekt ist kurz gesagt: ___.')).toBe(true)
    expect(isMetaGapTemplate('Die zutreffende Einordnung betrifft ___.')).toBe(true)
    expect(isMetaGapTemplate('Zur Christianisierung trugen Missionare, ___ und Bistümer bei.')).toBe(
      false,
    )
  })

  it('flags fragment answers ending with prepositions or hyphen cuts', () => {
    expect(isFragmentGapAnswer('Mission war zentral für')).toBe(true)
    expect(isFragmentGapAnswer('Es war ein Rechts-')).toBe(true)
    expect(isFragmentGapAnswer('Klöster')).toBe(false)
    expect(isFragmentGapAnswer('Kirchenjahr')).toBe(false)
    expect(isFragmentGapAnswer('Schäden')).toBe(false)
  })

  it('aggregates issues', () => {
    expect(
      gapQualityIssues('Korrekt ist kurz gesagt: ___.', ['Mission war zentral für'], 'Welche Korrektur?'),
    ).toContain('meta-gap')
    expect(
      gapQualityIssues('Das ___ gliederte das Jahr.', ['Kirchenjahr']),
    ).toEqual([])
  })
})

describe('curriculum sources: no meta gap templates (all subjects)', () => {
  it('Geschichte + Biologie bank files contain no meta gap strings', () => {
    const dir = join(process.cwd(), 'src/curriculum')
    const files = readdirSync(dir).filter(
      (f) =>
        (f.startsWith('geschichte') || f.startsWith('biologie')) &&
        f.endsWith('.ts') &&
        !f.endsWith('.test.ts'),
    )
    expect(files.length).toBeGreaterThan(5)
    for (const file of files) {
      const text = readFileSync(join(dir, file), 'utf8')
      expect(text, file).not.toMatch(/Korrekt ist kurz gesagt/i)
      expect(text, file).not.toMatch(/zutreffende Einordnung betrifft/i)
      expect(text, file).not.toMatch(/Welche Korrektur ist historisch/i)
    }
  })
})
