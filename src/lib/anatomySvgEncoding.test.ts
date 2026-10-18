import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const ANATOMY_DIR = path.resolve(__dirname, '../assets/anatomy')

describe('anatomy SVG encoding', () => {
  it('all bundled anatomy SVGs are valid UTF-8 XML', () => {
    const files = fs
      .readdirSync(ANATOMY_DIR)
      .filter((f) => f.toLowerCase().endsWith('.svg'))
    expect(files.length).toBeGreaterThan(0)
    for (const file of files) {
      const buf = fs.readFileSync(path.join(ANATOMY_DIR, file))
      expect(() => new TextDecoder('utf-8', { fatal: true }).decode(buf), file).not.toThrow()
      const text = buf.toString('utf8')
      expect(text, file).toMatch(/<svg[\s>]/i)
      // Broken Windows-1252 / mojibake leftovers must not ship
      expect(text, file).not.toMatch(/Â·|Ã.|�/)
    }
  })
})
