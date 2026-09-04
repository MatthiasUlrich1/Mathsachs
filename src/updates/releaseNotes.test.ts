import { describe, expect, it } from 'vitest'
import { formatReleaseNotes } from './releaseNotes'

describe('formatReleaseNotes', () => {
  it('returns an empty string for blank notes', () => {
    expect(formatReleaseNotes('')).toBe('')
    expect(formatReleaseNotes('   \n')).toBe('')
  })

  it('escapes HTML and renders a small Markdown subset', () => {
    const html = formatReleaseNotes(
      '## Neu\n- **Klausur** per Code\n- Siehe [Releases](https://example.com/rel)\n<script>x</script>',
    )
    expect(html).toContain('<p class="update-banner__heading">Neu</p>')
    expect(html).toContain('<strong>Klausur</strong>')
    expect(html).toContain(
      '<a href="https://example.com/rel" target="_blank" rel="noopener noreferrer">Releases</a>',
    )
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
