import { describe, expect, it } from 'vitest'
import { BROWSE_EMPTY_COPY, browseEmptyState } from './browseEmptyState'

describe('browseEmptyState', () => {
  it('is loading until ready', () => {
    expect(browseEmptyState({ ready: false, loadedCount: 0, anyInstalled: false })).toBe('loading')
  })
  it('nothing installed -> no-curriculum', () => {
    expect(browseEmptyState({ ready: true, loadedCount: 0, anyInstalled: false })).toBe('no-curriculum')
  })
  it('installed but no grade selected -> no-grade-selected (not "Kein Lehrplan")', () => {
    expect(browseEmptyState({ ready: true, loadedCount: 0, anyInstalled: true })).toBe('no-grade-selected')
  })
  it('grades loaded -> content', () => {
    expect(browseEmptyState({ ready: true, loadedCount: 2, anyInstalled: true })).toBe('content')
  })
  it('the copy differs and the no-grade copy does not claim the curriculum is missing', () => {
    expect(BROWSE_EMPTY_COPY['no-grade-selected'].title).toBe('Noch keine Klassenstufe ausgewählt')
    expect(BROWSE_EMPTY_COPY['no-grade-selected'].title).not.toContain('Kein Lehrplan')
    expect(BROWSE_EMPTY_COPY['no-curriculum'].title).toBe('Kein Lehrplan installiert')
  })
})
