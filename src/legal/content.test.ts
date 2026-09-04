import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  CONTACT_EMAIL,
  IDEENMELDER_SUBJECT,
  IMPRESSUM_LINES,
  MIT_LICENSE_TEXT,
  buildIdeenmelderMailto,
} from './content'

describe('Impressum', () => {
  it('lists the publisher address and contact mail', () => {
    expect(IMPRESSUM_LINES).toEqual([
      'Linus und Matthias Ulrich',
      'Große Wallstraße 42',
      '04509 Delitzsch',
      'info@my-smart-home-support.de',
    ])
  })
})

describe('MIT license text', () => {
  it('matches the root LICENSE file', () => {
    const fromFile = readFileSync(resolve('LICENSE'), 'utf8').trimEnd()
    expect(MIT_LICENSE_TEXT).toBe(fromFile)
  })

  it('is the MIT license for Linus und Matthias Ulrich, 2026', () => {
    expect(MIT_LICENSE_TEXT.startsWith('MIT License')).toBe(true)
    expect(MIT_LICENSE_TEXT).toContain(
      'Copyright (c) 2026 Linus und Matthias Ulrich',
    )
    expect(MIT_LICENSE_TEXT).toContain('THE SOFTWARE IS PROVIDED "AS IS"')
  })
})

describe('buildIdeenmelderMailto', () => {
  it('uses the exact subject string, encoded with encodeURIComponent', () => {
    expect(IDEENMELDER_SUBJECT).toBe(
      'Idee / Feedback zum Mathsachs Übeungsprogramm.',
    )
    const href = buildIdeenmelderMailto()
    expect(href).toBe(
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(IDEENMELDER_SUBJECT)}`,
    )
    expect(href).toBe(
      `mailto:info@my-smart-home-support.de?subject=${encodeURIComponent('Idee / Feedback zum Mathsachs Übeungsprogramm.')}`,
    )
  })

  it('percent-encodes spaces, slash and Ü in the query', () => {
    const href = buildIdeenmelderMailto()
    expect(href.startsWith('mailto:info@my-smart-home-support.de?subject=')).toBe(
      true,
    )
    const encoded = href.slice(href.indexOf('subject=') + 'subject='.length)
    expect(encoded).toBe(encodeURIComponent(IDEENMELDER_SUBJECT))
    expect(encoded).toContain('%20')
    expect(encoded).toContain('%2F')
    expect(encoded).toContain('%C3%9C')
    expect(encoded).not.toContain(' ')
    expect(encoded).not.toContain('/')
    expect(encoded).not.toContain('Ü')
  })
})
