import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LegalFooter } from './LegalFooter'

describe('LegalFooter supporters', () => {
  it('renders both supporter logos in the footer', () => {
    const html = renderToStaticMarkup(createElement(LegalFooter, { version: '0.1.42' }))
    expect(html).toContain('aria-label="Unterstützer"')
    expect(html).toContain('logo-bi-menschenskinder.png')
    expect(html).toContain('https://www.bi-menschenskinder-delitzsch.de/')
    expect(html).toContain('logo-mein-delitzsch.png')
    expect(html).toContain('Logo Mein Delitzsch')
    expect(html).toContain('foot__supporter--on-dark')
    expect(html).toContain('Mathsachs 0.1.42')
  })
})
