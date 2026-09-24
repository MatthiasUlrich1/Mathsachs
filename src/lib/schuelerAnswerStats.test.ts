import { afterEach, describe, expect, it, vi } from 'vitest'
import { CLASS_POINTS_API } from '../classCode/api'
import {
  fetchSchuelerAnswerCount,
  reportSchuelerAnswersChecked,
} from './schuelerAnswerStats'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('schuelerAnswerStats', () => {
  it('reads the anonymous Schüler answer count', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({ count: 42 }),
    ) as unknown as typeof fetch
    await expect(fetchSchuelerAnswerCount(fetchImpl)).resolves.toBe(42)
    expect(fetchImpl).toHaveBeenCalledWith(`${CLASS_POINTS_API}/stats/schueler-answers`, {
      cache: 'no-store',
    })
  })

  it('posts delta without throwing when offline', () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('offline')
    }) as unknown as typeof fetch
    expect(() => reportSchuelerAnswersChecked(3, { fetchImpl })).not.toThrow()
    expect(fetchImpl).toHaveBeenCalledWith(
      `${CLASS_POINTS_API}/stats/schueler-answers`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ delta: 3 }),
      }),
    )
  })

  it('clamps delta to 1–30', () => {
    const fetchImpl = vi.fn(async () => Response.json({ count: 1 })) as unknown as typeof fetch
    reportSchuelerAnswersChecked(999, { fetchImpl })
    expect(fetchImpl).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ body: JSON.stringify({ delta: 30 }) }),
    )
  })
})
