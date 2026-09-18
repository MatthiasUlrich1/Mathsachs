import { describe, expect, it, vi } from 'vitest'
import { CLASS_POINTS_API, ClassApiError } from '../classCode/api'
import {
  fetchTaskReports,
  isReportCommentValid,
  REPORTS_READ_TOKEN,
  submitTaskReport,
  trimReportComment,
} from './taskReports'

describe('taskReports helpers', () => {
  it('trims and caps comments', () => {
    expect(trimReportComment('  hallo  ')).toBe('hallo')
    expect(isReportCommentValid('   ')).toBe(false)
    expect(isReportCommentValid('x')).toBe(true)
    expect(trimReportComment('a'.repeat(600)).length).toBe(500)
  })

  it('posts a report payload', async () => {
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
        { fetchImpl },
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
  })

  it('rejects empty comments locally', async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch
    await expect(
      submitTaskReport({ contentId: 6453, comment: '  ' }, { fetchImpl }),
    ).rejects.toBeInstanceOf(ClassApiError)
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('fetches reports with the bearer token', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({
        reports: [
          {
            id: 'ABCD1234',
            at: 1,
            contentId: 6453,
            comment: 'kaputt',
          },
        ],
      }),
    ) as unknown as typeof fetch
    await expect(fetchTaskReports({ fetchImpl })).resolves.toEqual([
      { id: 'ABCD1234', at: 1, contentId: 6453, comment: 'kaputt' },
    ])
    expect(fetchImpl).toHaveBeenCalledWith(`${CLASS_POINTS_API}/reports/tasks`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${REPORTS_READ_TOKEN}` },
    })
  })
})
