import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CurriculumSetup } from './CurriculumSetup'
import { installPack, removePack, resetCurriculumMemory } from '../curriculum/install'
import { GYM_SACHSEN_PACK_ID, OS_HS_PACK_ID, OS_RS_PACK_ID, type CurriculumPack } from '../curriculum/pack'
import { filterPacks, gradeSectionHeading, schulformIdForPack } from '../curriculum/packFilters'

const samplePack = (id: string, title: string): CurriculumPack => ({
  id,
  title,
  region: 'Sachsen',
  school: id === GYM_SACHSEN_PACK_ID ? 'Gymnasium' : 'Oberschule',
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

const gymPack = () => samplePack(GYM_SACHSEN_PACK_ID, 'Gymnasium Sachsen · Mathematik')
const hsPack = () =>
  samplePack(OS_HS_PACK_ID, 'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang')
const rsPack = () =>
  samplePack(OS_RS_PACK_ID, 'Oberschule Sachsen · Mathematik · Realschulbildungsgang')

const catalog = [
  { id: GYM_SACHSEN_PACK_ID, title: 'Gymnasium Sachsen · Mathematik', region: 'Sachsen', school: 'Gymnasium' },
  {
    id: OS_HS_PACK_ID,
    title: 'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang',
    region: 'Sachsen',
    school: 'Oberschule',
  },
  {
    id: OS_RS_PACK_ID,
    title: 'Oberschule Sachsen · Mathematik · Realschulbildungsgang',
    region: 'Sachsen',
    school: 'Oberschule',
  },
]

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
    installPack(hsPack(), undefined, 10)
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
    installPack(hsPack())
    installPack(rsPack())
    const html = renderToStaticMarkup(createElement(CurriculumSetup, props))
    expect(count(html, 'Entfernen')).toBe(2)
    expect(html).toContain('Installieren')
  })
})

describe('CurriculumSetup Klassenstufen-Überschrift', () => {
  it('names the grade list with Gymnasium when that pack is installed', () => {
    installPack(gymPack())
    const html = renderToStaticMarkup(createElement(CurriculumSetup, props))
    expect(html).toContain(gradeSectionHeading('Gymnasium Sachsen · Mathematik'))
    expect(html).toContain('Gymnasium')
    expect(html).not.toContain('Klassenstufen im installierten Lehrplan')
  })

  it('groups grades per installed pack instead of one anonymous heading', () => {
    installPack(gymPack())
    installPack(hsPack())
    const html = renderToStaticMarkup(createElement(CurriculumSetup, props))
    expect(html).toContain(gradeSectionHeading('Gymnasium Sachsen · Mathematik'))
    expect(html).toContain(gradeSectionHeading('Oberschule Sachsen · Mathematik · Hauptschulbildungsgang'))
    expect(html).not.toContain('Klassenstufen im installierten Lehrplan')
  })
})

describe('CurriculumSetup Katalog-Filter', () => {
  it('maps pack metadata to recognized Schulform labels', () => {
    expect(schulformIdForPack(catalog[0])).toBe('gymnasium')
    expect(schulformIdForPack(catalog[1])).toBe('hauptschule')
    expect(schulformIdForPack(catalog[2])).toBe('realschule')
  })

  it('keeps only the Hauptschule pack for Sachsen + Hauptschule', () => {
    const filtered = filterPacks(catalog, 'Sachsen', 'hauptschule')
    expect(filtered.map((pack) => pack.id)).toEqual([OS_HS_PACK_ID])
  })

  it('hides Gymnasium and Realschule packs when Sachsen + Hauptschule is selected', () => {
    installPack(gymPack())
    installPack(hsPack())
    installPack(rsPack())
    const html = renderToStaticMarkup(
      createElement(CurriculumSetup, {
        ...props,
        initialRegion: 'Sachsen',
        initialSchulform: 'hauptschule',
      }),
    )
    expect(html).toContain('Bundesland')
    expect(html).toContain('Schulform')
    expect(html).toContain('Hauptschule')
    expect(html).toContain('Oberschule Sachsen · Mathematik · Hauptschulbildungsgang')
    expect(html).toContain(gradeSectionHeading('Oberschule Sachsen · Mathematik · Hauptschulbildungsgang'))
    expect(html).not.toContain('Gymnasium Sachsen')
    expect(html).not.toContain('Realschulbildungsgang')
    expect(html).not.toContain(gradeSectionHeading('Gymnasium Sachsen · Mathematik'))
    expect(count(html, 'Entfernen')).toBe(1)
    expect(html).not.toContain('Installieren')
  })
})
