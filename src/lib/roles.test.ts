import { describe, expect, it } from 'vitest'
import {
  USER_ROLES,
  canCreateClassCodes,
  canCreateExam,
  canManageGradeCodes,
  normalizeRole,
  pickMergedRole,
  roleForUser,
  roleLabel,
} from './roles'

describe('user roles', () => {
  it('lists German labels for Schüler, Eltern and Lehrer', () => {
    expect(USER_ROLES.map((entry) => [entry.id, entry.label])).toEqual([
      ['schueler', 'Schüler'],
      ['eltern', 'Eltern'],
      ['lehrer', 'Lehrer'],
    ])
  })

  it('defaults missing or unknown roles to Schüler', () => {
    expect(normalizeRole(undefined)).toBe('schueler')
    expect(normalizeRole(null)).toBe('schueler')
    expect(normalizeRole('admin')).toBe('schueler')
    expect(normalizeRole('lehrer')).toBe('lehrer')
    expect(roleLabel(undefined)).toBe('Schüler')
  })

  it('denies exam and class-code creation for Schüler', () => {
    expect(canCreateExam('schueler')).toBe(false)
    expect(canCreateClassCodes('schueler')).toBe(false)
    expect(canCreateExam('eltern')).toBe(true)
    expect(canCreateClassCodes('eltern')).toBe(true)
    expect(canCreateExam('lehrer')).toBe(true)
    expect(canCreateClassCodes('lehrer')).toBe(true)
    expect(canCreateExam(undefined)).toBe(false)
  })

  it('allows Klassenstufencode management only for Lehrer', () => {
    expect(canManageGradeCodes('lehrer')).toBe(true)
    expect(canManageGradeCodes('eltern')).toBe(false)
    expect(canManageGradeCodes('schueler')).toBe(false)
    expect(canManageGradeCodes(undefined)).toBe(false)
  })

  it('treats legacy users with created codes as Eltern', () => {
    expect(roleForUser({ name: 'Ada', created: 1, stats: {}, sessions: [] })).toBe(
      'schueler',
    )
    expect(
      roleForUser({
        name: 'Ada',
        created: 1,
        stats: {},
        sessions: [],
        classCodes: {
          created: [{ code: 'AAAA1111', name: '6a', createdAt: 1 }],
          activeCode: 'AAAA1111',
          sendPoints: false,
        },
      }),
    ).toBe('eltern')
    expect(
      roleForUser({
        name: 'Ada',
        created: 1,
        stats: {},
        sessions: [],
        role: 'schueler',
        classCodes: {
          created: [{ code: 'AAAA1111', name: '6a', createdAt: 1 }],
          activeCode: 'AAAA1111',
          sendPoints: false,
        },
      }),
    ).toBe('schueler')
  })

  it('lets an incoming role win when merging', () => {
    expect(pickMergedRole('lehrer', 'eltern')).toBe('eltern')
    expect(pickMergedRole('lehrer', undefined)).toBe('lehrer')
    expect(pickMergedRole(undefined, undefined)).toBeUndefined()
  })
})
