import { describe, expect, it, vi } from 'vitest'
import { CLASS_POINTS_API, ClassApiError } from '../classCode/api'
import {
  countOpenTaskReports,
  deleteTaskReport,
  fetchMyReportUpdates,
  fetchOpenTaskReportCount,
  fetchTaskReports,
  isReportCommentValid,
  listMyStoredReports,
  markMyReportFixedSeen,
  markTaskReportDone,
  markTaskReportFixed,
  MY_TASK_REPORTS_KEY,
  rememberMyReportId,
  REPORTS_READ_TOKEN,
  submitTaskReport,
  trimReportComment,
  trimReportReply,
  unseenFixedUpdates,
} from './taskReports'

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial))
  return {
    get length() {
      return map.size
    },
    clear() {
      map.clear()
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null
    },
    key(index: number) {
      return [...map.keys()][index] ?? null
    },
    removeItem(key: string) {
      map.delete(key)
    },
    setItem(key: string, value: string) {
      map.set(key, value)
    },
  }
}

describe('taskReports helpers', () => {
  it('trims and caps comments and replies', () => {
    expect(trimReportComment('  hallo  ')).toBe('hallo')
    expect(isReportCommentValid('   ')).toBe(false)
    expect(isReportCommentValid('x')).toBe(true)
    expect(trimReportComment('a'.repeat(600)).length).toBe(500)
    expect(trimReportReply('  danke  ')).toBe('danke')
    expect(trimReportReply('b'.repeat(600)).length).toBe(500)
  })

  it('remembers submitted report ids locally without PII', () => {
    const storage = memoryStorage()
    rememberMyReportId('ABCD1234', storage, 100)
    rememberMyReportId('EFGH5678', storage, 200)
    expect(listMyStoredReports(storage)).toEqual([
      { id: 'EFGH5678', rememberedAt: 200 },
      { id: 'ABCD1234', rememberedAt: 100 },
    ])
    rememberMyReportId('ABCD1234', storage, 300)
    expect(listMyStoredReports(storage)[0]).toEqual({
      id: 'ABCD1234',
      rememberedAt: 300,
    })
    markMyReportFixedSeen('ABCD1234', storage)
    expect(listMyStoredReports(storage)[0].seenFixed).toBe(true)
    expect(storage.getItem(MY_TASK_REPORTS_KEY)).toContain('ABCD1234')
    expect(storage.getItem(MY_TASK_REPORTS_KEY)).not.toMatch(/@|email|device/i)
  })

  it('filters unseen fixed updates for the reporter banner', () => {
    const storage = memoryStorage()
    rememberMyReportId('A', storage)
    rememberMyReportId('B', storage)
    markMyReportFixedSeen('A', storage)
    expect(
      unseenFixedUpdates(
        [
          { id: 'A', status: 'fixed', contentId: 1001, replyMessage: 'ok' },
          { id: 'B', status: 'fixed', contentId: 1002 },
          { id: 'C', status: 'done', contentId: 1003 },
        ],
        storage,
      ),
    ).toEqual([{ id: 'B', status: 'fixed', contentId: 1002 }])
  })

  it('posts a report payload and stores the returned id', async () => {
    const storage = memoryStorage()
    const fetchImpl = vi.fn(async () =>
      Response.json({ ok: true, id: 'ABCD1234' }, { status: 201 }),
    ) as unknown as typeof fetch
    await expect(
      submitTaskReport(
        {
          contentId: 6453,
          comment: '  falsch  ',
          topicId: 'ph-k6-lb2-volumen',
        },
        { fetchImpl, storage },
      ),
    ).resolves.toEqual({ id: 'ABCD1234' })
    expect(fetchImpl).toHaveBeenCalledWith(`${CLASS_POINTS_API}/reports/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentId: 6453,
        comment: 'falsch',
        topicId: 'ph-k6-lb2-volumen',
      }),
    })
    expect(listMyStoredReports(storage).map((r) => r.id)).toEqual(['ABCD1234'])
  })

  it('rejects empty comments locally', async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch
    await expect(
      submitTaskReport({ contentId: 6453, comment: '  ' }, { fetchImpl }),
    ).rejects.toBeInstanceOf(ClassApiError)
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('fetches reports with the bearer token and normalizes status', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        reports: [
          {
            id: 'ABCD1234',
            at: 1,
            contentId: 6453,
            comment: 'kaputt',
          },
          {
            id: 'EFGH5678',
            at: 2,
            contentId: 6454,
            comment: 'fertig',
            status: 'erledigt',
          },
          {
            id: 'IJKL9012',
            at: 3,
            contentId: 6455,
            comment: 'fix',
            status: 'korrigiert',
            replyMessage: '  korrigiert  ',
            fixedAt: 99,
          },
        ],
      }),
    ) as unknown as typeof fetch
    await expect(fetchTaskReports({ fetchImpl })).resolves.toEqual([
      { id: 'ABCD1234', at: 1, contentId: 6453, comment: 'kaputt', status: 'open' },
      { id: 'EFGH5678', at: 2, contentId: 6454, comment: 'fertig', status: 'done' },
      {
        id: 'IJKL9012',
        at: 3,
        contentId: 6455,
        comment: 'fix',
        status: 'fixed',
        replyMessage: 'korrigiert',
        fixedAt: 99,
      },
    ])
    expect(fetchImpl).toHaveBeenCalledWith(`${CLASS_POINTS_API}/reports/tasks`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${REPORTS_READ_TOKEN}` },
    })
  })

  it('counts only open reports for badges', async () => {
    expect(
      countOpenTaskReports([
        { id: 'a', at: 1, contentId: 1, comment: 'x', status: 'open' },
        { id: 'b', at: 2, contentId: 2, comment: 'y', status: 'done' },
        { id: 'c', at: 3, contentId: 3, comment: 'z', status: 'fixed' },
        { id: 'd', at: 4, contentId: 4, comment: 'w', status: 'open' },
      ]),
    ).toBe(2)
    expect(countOpenTaskReports([])).toBe(0)

    const fetchImpl = vi.fn(async () =>
      Response.json({
        reports: [
          { id: 'a', at: 1, contentId: 1, comment: 'x', status: 'open' },
          { id: 'b', at: 2, contentId: 2, comment: 'y', status: 'done' },
        ],
      }),
    ) as unknown as typeof fetch
    await expect(fetchOpenTaskReportCount({ fetchImpl })).resolves.toBe(1)
  })

  it('marks a report done via PATCH', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        ok: true,
        report: {
          id: 'ABCD1234',
          at: 1,
          contentId: 6453,
          comment: 'kaputt',
          status: 'done',
        },
      }),
    ) as unknown as typeof fetch
    await expect(markTaskReportDone('ABCD1234', { fetchImpl })).resolves.toMatchObject({
      id: 'ABCD1234',
      status: 'done',
    })
    expect(fetchImpl).toHaveBeenCalledWith(
      `${CLASS_POINTS_API}/reports/tasks/ABCD1234`,
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({
          Authorization: `Bearer ${REPORTS_READ_TOKEN}`,
        }),
        body: JSON.stringify({ status: 'done' }),
      }),
    )
  })

  it('marks a report fixed with optional reply via PATCH', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        ok: true,
        report: {
          id: 'ABCD1234',
          at: 1,
          contentId: 6453,
          comment: 'kaputt',
          status: 'fixed',
          replyMessage: 'Korrigiert',
          fixedAt: 42,
        },
      }),
    ) as unknown as typeof fetch
    await expect(
      markTaskReportFixed('ABCD1234', '  Korrigiert  ', { fetchImpl }),
    ).resolves.toMatchObject({
      id: 'ABCD1234',
      status: 'fixed',
      replyMessage: 'Korrigiert',
    })
    expect(fetchImpl).toHaveBeenCalledWith(
      `${CLASS_POINTS_API}/reports/tasks/ABCD1234`,
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'fixed', replyMessage: 'Korrigiert' }),
      }),
    )
  })

  it('fetches my report updates anonymously by remembered ids', async () => {
    const storage = memoryStorage()
    rememberMyReportId('ABCD1234', storage)
    const fetchImpl = vi.fn(async () =>
      Response.json({
        reports: [
          {
            id: 'ABCD1234',
            status: 'fixed',
            contentId: 6453,
            replyMessage: 'Danke für den Hinweis',
            fixedAt: 10,
          },
        ],
      }),
    ) as unknown as typeof fetch
    await expect(fetchMyReportUpdates({ fetchImpl, storage })).resolves.toEqual([
      {
        id: 'ABCD1234',
        status: 'fixed',
        contentId: 6453,
        replyMessage: 'Danke für den Hinweis',
        fixedAt: 10,
      },
    ])
    expect(fetchImpl).toHaveBeenCalledWith(`${CLASS_POINTS_API}/reports/tasks/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: ['ABCD1234'] }),
    })
  })

  it('deletes a report via DELETE', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({ ok: true, id: 'ABCD1234' }),
    ) as unknown as typeof fetch
    await expect(deleteTaskReport('ABCD1234', { fetchImpl })).resolves.toBeUndefined()
    expect(fetchImpl).toHaveBeenCalledWith(
      `${CLASS_POINTS_API}/reports/tasks/ABCD1234`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          Authorization: `Bearer ${REPORTS_READ_TOKEN}`,
        }),
      }),
    )
  })
})
