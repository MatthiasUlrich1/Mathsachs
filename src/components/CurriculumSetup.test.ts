import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CurriculumSetup } from './CurriculumSetup'
import { installPack, removePack, resetCurriculumMemory } from '../curriculum/install'
import { OS_HS_PACK_ID, OS_RS_PACK_ID, type CurriculumPack } from '../curriculum/pack'

const samplePack = (id: string, title: string): CurriculumPack => ({
  id,
  title,
  region: 'Sachsen',
  school: 'Oberschule',
  subject: 'Mathematik',
  version: '1.0.0',
  changelog: 'Test',
  contentHash: 'abc12345',
  official: [
    {
      id: `${id}-klasse-5`,
      title: 'Klasse 5',
      subjectTitle: 'Mathematik',
      gradeTitle: 'Klasse 5',
      description: 'Test',
      areas: [
        {
          id: 'lb1',
          title: 'Zahlen',
          topics: [{ id: `${id}-add`, title: 'Addition', pointsPerTask: 10 }],
        },
      ],
    },
  ],
  extras: [],
})

const props = {
  loadedIds: [] as string[],
  onLoad: vi.fn(async () => undefined),
  onRemove: vi.fn(),
  onPacksChanged: vi.fn(),
}

const count = (html: string, needle: string): number => html.split(needle).length - 1

afterEach(() => {
  resetCurriculumMemory()
})

describe('CurriculumSetup Entfernen', () => {
  it('shows Entfernen for an installed pack and Installieren after remove', () => {
    installPack(
      samplePack(OS_HS_PACK_ID, 'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang'),
      undefined,
      10,
    )
    const installed = renderToStaticMarkup(createElement(CurriculumSetup, props))
    expect(installed).toContain('Entfernen')
    expect(installed).toContain('Installiert: Version 1.0.0')
    expect(count(installed, 'Entfernen')).toBe(1)

    removePack(OS_HS_PACK_ID, undefined, 20)
    const removed = renderToStaticMarkup(createElement(CurriculumSetup, props))
    expect(removed).not.toContain('Entfernen')
    expect(removed).not.toContain('Installiert: Version')
    expect(removed).toContain('Installieren')
    expect(count(removed, 'Installieren')).toBe(3)
  })

  it('shows Entfernen for every installed pack, including Oberschule RS', () => {
    installPack(
      samplePack(OS_HS_PACK_ID, 'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang'),
    )
    installPack(
      samplePack(OS_RS_PACK_ID, 'Oberschule Sachsen · Mathematik · Realschulbildungsgang'),
    )
    const html = renderToStaticMarkup(createElement(CurriculumSetup, props))
    expect(count(html, 'Entfernen')).toBe(2)
    expect(html).toContain('Installieren')
  })
})
