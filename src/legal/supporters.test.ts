import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  SUPPORTERS,
  footerSupporters,
  listedSupporters,
  type Supporter,
} from './supporters'

describe('supporters catalog', () => {
  it('lists the Bürgerinitiative with its website for Einstellungen', () => {
    const listed = listedSupporters()
    expect(listed.map((row) => row.id)).toEqual(['bi-menschenskinder'])
    expect(listed[0]).toMatchObject({
      name: 'Bürgerinitiative Menschenskinder Delitzsch! e.V.',
      url: 'https://www.bi-menschenskinder-delitzsch.de/',
    })
  })

  it('puts both logos in the footer so further supporters can be appended', () => {
    const footer = footerSupporters()
    expect(footer.map((row) => row.id)).toEqual([
      'bi-menschenskinder',
      'mein-delitzsch',
    ])
    expect(footer.every((row) => row.logoSrc?.startsWith('./supporters/'))).toBe(true)
  })

  it('keeps unique ids and ships the logo files next to the catalog', () => {
    const ids = SUPPORTERS.map((row) => row.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const row of footerSupporters()) {
      const file = row.logoSrc?.replace(/^\.\//, '') ?? ''
      expect(existsSync(resolve('public', file))).toBe(true)
    }
  })

  it('treats an extra catalog row as listed and in the footer by default', () => {
    const extra: Supporter = {
      id: 'neu',
      name: 'Neue Initiative',
      url: 'https://example.test/',
      logoSrc: './supporters/logo-neu.png',
    }
    const all = [...SUPPORTERS, extra]
    expect(all.filter((row) => row.listed !== false).map((row) => row.id)).toContain(
      'neu',
    )
    expect(
      all
        .filter((row) => Boolean(row.logoSrc) && row.footer !== false)
        .map((row) => row.id),
    ).toContain('neu')
  })
})
