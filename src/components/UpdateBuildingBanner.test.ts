import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { UPDATE_BUILDING_HINT } from '../updates/github'
import { UpdateBuildingBanner } from './UpdateBuildingBanner'

describe('UpdateBuildingBanner', () => {
  it('shows the pending German copy without a Download button', () => {
    const html = renderToStaticMarkup(
      createElement(UpdateBuildingBanner, { onDismiss: vi.fn() }),
    )
    expect(html).toContain('Da kommt was neues!')
    expect(html).toContain('Ein Update wird gerade erzeugt.')
    expect(html).toContain('Bitte in 5 Minuten erneut prüfen.')
    expect(html).not.toContain('Download')
    expect(html).not.toContain('Neue Version')
    expect(html).not.toContain('404')
    expect(UPDATE_BUILDING_HINT.split('\n')).toHaveLength(3)
  })
})
