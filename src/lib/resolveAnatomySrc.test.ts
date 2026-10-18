import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  anatomyPublicSrc,
  anatomySrcCandidates,
  resolveAnatomySrc,
} from './resolveAnatomySrc'

const PUBLIC_ANATOMY = path.resolve(__dirname, '../../public/anatomy')

const SCHEMA_FILES = [
  'vogel-schnabel-typen.jpg',
  'saeuger-atemweg-schema.jpg',
  'oncorhynchus-mykiss-raver.jpg',
  'fish-internal-teleost-gille.svg',
  'pond-organisms-daphnia-cyclops.png',
  'bird-anatomy-unlabeled.png',
  'feather-parts-numbered.jpg',
  'oral-cavity-teeth-blank.svg',
  'carnivore-skull-schematic.svg',
  'horse-skull-schematic.svg',
  'pig-skull-schematic.png',
  'human-skeleton-upper-anterior.jpg',
  'axial-skeleton-anterior.png',
  'female-reproductive-frontal.png',
  'male-reproductive-frontal.png',
  'bug-parts.svg',
  'polis-athen-karte.png',
]

describe('resolveAnatomySrc', () => {
  it('maps logical /anatomy paths to relative ./anatomy (Electron-safe)', () => {
    expect(resolveAnatomySrc('/anatomy/vogel-schnabel-typen.svg')).toBe(
      './anatomy/vogel-schnabel-typen.svg',
    )
    expect(anatomyPublicSrc('/anatomy/oncorhynchus-mykiss-raver.jpg')).toBe(
      './anatomy/oncorhynchus-mykiss-raver.jpg',
    )
  })

  it('never prefers data: URLs for schema images', () => {
    for (const file of SCHEMA_FILES) {
      const primary = resolveAnatomySrc(`/anatomy/${file}`)
      expect(primary, file).not.toMatch(/^data:/i)
      expect(primary, file).toBe(`./anatomy/${file}`)
    }
  })

  it('exposes fallback candidates after public path', () => {
    const c = anatomySrcCandidates('/anatomy/bug-parts.svg')
    expect(c[0]).toBe('./anatomy/bug-parts.svg')
    expect(c.length).toBeGreaterThanOrEqual(1)
  })

  it('every schema file exists under public/anatomy', () => {
    for (const file of SCHEMA_FILES) {
      expect(
        fs.existsSync(path.join(PUBLIC_ANATOMY, file)),
        `missing public/anatomy/${file}`,
      ).toBe(true)
    }
  })

  it('passes through absolute http(s) urls', () => {
    expect(resolveAnatomySrc('https://example.com/a.png')).toBe(
      'https://example.com/a.png',
    )
  })
})
