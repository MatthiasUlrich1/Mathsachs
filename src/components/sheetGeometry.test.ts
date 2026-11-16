import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8')
const app = read('src/App.css')
const mark = read('src/components/CorrectionMark.css')

describe('sheet margin geometry is shared via custom properties', () => {
  it('App.css defines and uses the properties, with a mobile override', () => {
    expect(app).toMatch(/--sheet-margin-w:\s*40px/)
    expect(app).toMatch(/--sheet-body-pad-left:\s*20px/)
    expect(app).toMatch(/--sheet-margin-w:\s*28px/)
    expect(app).toMatch(/--sheet-body-pad-left:\s*12px/)
    expect(app).toMatch(/grid-template-columns:\s*var\(--sheet-margin-w\)/)
    expect(app).toMatch(/padding-left|var\(--sheet-body-pad-left\)/)
  })
  it('CorrectionMark.css uses them and has no offset literals', () => {
    expect(mark).toContain('var(--sheet-margin-w)')
    expect(mark).toContain('var(--sheet-body-pad-left)')
    expect(mark).not.toMatch(/(?<![\w.-])(40|20|28|12)px/)
  })
  it('hides the mark in print', () => {
    expect(app).toMatch(/@media print[\s\S]*\.correction-mark/)
  })
})
