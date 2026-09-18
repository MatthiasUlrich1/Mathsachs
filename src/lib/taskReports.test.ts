import { describe, expect, it, vi } from 'vitest'
import { CLASS_POINTS_API, ClassApiError } from '../classCode/api'
import {
  deleteTaskReport,
  fetchTaskReports,
  isReportCommentValid,
  markTaskReportDone,
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
        ],
      }),
    ) as unknown as typeof fetch
    await expect(fetchTaskReports({ fetchImpl })).resolves.toEqual([
      { id: 'ABCD1234', at: 1, contentId: 6453, comment: 'kaputt', status: 'open' },
      { id: 'EFGH5678', at: 2, contentId: 6454, comment: 'fertig', status: 'done' },
    ])
    expect(fetchImpl).toHaveBeenCalledWith(`${CLASS_POINTS_API}/reports/tasks`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${REPORTS_READ_TOKEN}` },
    })
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
