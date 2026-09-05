import { describe, expect, it } from 'vitest'
import {
  USER_ROLES,
  canCreateChallengeLater,
  canCreateClassCodes,
  canCreateExam,
  canEnterGradeCodes,
  canManageGradeCodes,
  canRequestTasks,
  canSendClassPoints,
  canWriteExam,
  isTeacherRole,
  normalizeRole,
  pickMergedRole,
  roleForUser,
  roleLabel,
} from './roles'

describe('user roles', () => {
  it('lists German labels for Schüler, Eltern, Klassenlehrer and Lehrer', () => {
    expect(USER_ROLES.map((entry) => [entry.id, entry.label])).toEqual([
      ['schueler', 'Schüler'],
      ['eltern', 'Eltern'],
      ['klassenlehrer', 'Klassenlehrer'],
      ['lehrer', 'Lehrer'],
    ])
  })

  it('treats Lehrer and Klassenlehrer as teacher roles', () => {
    expect(isTeacherRole('lehrer')).toBe(true)
    expect(isTeacherRole('klassenlehrer')).toBe(true)
    expect(isTeacherRole('schueler')).toBe(false)
    expect(isTeacherRole('eltern')).toBe(false)
    expect(isTeacherRole(undefined)).toBe(false)
  })

  it('defaults missing or unknown roles to Schüler', () => {
    expect(normalizeRole(undefined)).toBe('schueler')
    expect(normalizeRole(null)).toBe('schueler')
    expect(normalizeRole('admin')).toBe('schueler')
    expect(normalizeRole('lehrer')).toBe('lehrer')
    expect(normalizeRole('klassenlehrer')).toBe('klassenlehrer')
    expect(roleLabel(undefined)).toBe('Schüler')
    expect(roleLabel('klassenlehrer')).toBe('Klassenlehrer')
  })

  it('denies exam and class-code creation for Schüler', () => {
    expect(canCreateExam('schueler')).toBe(false)
    expect(canWriteExam('schueler')).toBe(true)
    expect(canCreateClassCodes('schueler')).toBe(false)
    expect(canCreateExam('eltern')).toBe(true)
    expect(canCreateClassCodes('eltern')).toBe(true)
    expect(canCreateExam('lehrer')).toBe(true)
    expect(canCreateClassCodes('lehrer')).toBe(true)
    expect(canCreateExam(undefined)).toBe(false)
  })

  it('gives Klassenlehrer Lehrer-like class membership without exams or create', () => {
    expect(canCreateExam('klassenlehrer')).toBe(false)
    expect(canWriteExam('klassenlehrer')).toBe(false)
    expect(canCreateClassCodes('klassenlehrer')).toBe(false)
    expect(canManageGradeCodes('klassenlehrer')).toBe(false)
    expect(canEnterGradeCodes('klassenlehrer')).toBe(false)
    expect(canSendClassPoints('klassenlehrer')).toBe(false)
    expect(canCreateChallengeLater('klassenlehrer')).toBe(true)
  })

  it('allows Klassenstufencode create and enter only for Lehrer', () => {
    expect(canManageGradeCodes('lehrer')).toBe(true)
    expect(canEnterGradeCodes('lehrer')).toBe(true)
    expect(canManageGradeCodes('eltern')).toBe(false)
    expect(canEnterGradeCodes('eltern')).toBe(false)
    expect(canManageGradeCodes('schueler')).toBe(false)
    expect(canEnterGradeCodes('schueler')).toBe(false)
    expect(canManageGradeCodes(undefined)).toBe(false)
    expect(canSendClassPoints('lehrer')).toBe(true)
    expect(canSendClassPoints('eltern')).toBe(true)
    expect(canSendClassPoints('schueler')).toBe(true)
    expect(canCreateChallengeLater('lehrer')).toBe(true)
    expect(canCreateChallengeLater('eltern')).toBe(false)
    expect(canRequestTasks('lehrer')).toBe(true)
    expect(canRequestTasks('klassenlehrer')).toBe(false)
    expect(canRequestTasks('eltern')).toBe(false)
    expect(canRequestTasks('schueler')).toBe(false)
    expect(canRequestTasks(undefined)).toBe(false)
  })

  it('treats legacy users with created codes as Eltern, never Lehrer', () => {
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
        gradeCodes: {
          created: [{ code: 'GGGG1111', name: '6. Klasse', createdAt: 1 }],
        },
      }),
    ).toBe('eltern')
  })

  it('lets an incoming role win when merging', () => {
    expect(pickMergedRole('lehrer', 'eltern')).toBe('eltern')
    expect(pickMergedRole('lehrer', undefined)).toBe('lehrer')
    expect(pickMergedRole('klassenlehrer', 'lehrer')).toBe('lehrer')
    expect(pickMergedRole(undefined, 'klassenlehrer')).toBe('klassenlehrer')
    expect(pickMergedRole(undefined, undefined)).toBeUndefined()
  })
})
