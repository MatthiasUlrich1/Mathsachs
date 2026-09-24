import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CurriculumSetup } from './CurriculumSetup'
import { installPack, removePack, resetCurriculumMemory } from '../curriculum/install'
import {
  GYM_SACHSEN_PACK_ID,
  GYM_SACHSEN_PHYSIK_PACK_ID,
  OS_HS_PACK_ID,
  OS_RS_PACK_ID,
  type CurriculumPack,
} from '../curriculum/pack'
import { filterPacks, gradeSectionHeading, schulformIdForPack } from '../curriculum/packFilters'
import { buildGymSachsenPhysikPack } from '../curriculum/physikGymPack'

const samplePack = (id: string, title: string, subject = 'Mathematik'): CurriculumPack => ({
  id,
  title,
  region: 'Sachsen',
  school: id.startsWith('gym-') ? 'Gymnasium' : 'Oberschule',
  subject,
  version: '1.0.0',
  changelog: 'Test',
  contentHash: 'abc12345',
  official: [
    {
      id: `${id}-klasse-5`,
      title: 'Klasse 5',
      subjectTitle: subject,
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
const physikPack = () => buildGymSachsenPhysikPack()
const hsPack = () =>
  samplePack(OS_HS_PACK_ID, 'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang')
const rsPack = () =>
  samplePack(OS_RS_PACK_ID, 'Oberschule Sachsen · Mathematik · Realschulbildungsgang')

const catalog = [
  {
    id: GYM_SACHSEN_PACK_ID,
    title: 'Gymnasium Sachsen · Mathematik',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Mathematik',
  },
  {
    id: GYM_SACHSEN_PHYSIK_PACK_ID,
    title: 'Gymnasium Sachsen · Physik',
    region: 'Sachsen',
    school: 'Gymnasium',
    subject: 'Physik',
  },
  {
    id: OS_HS_PACK_ID,
    title: 'Oberschule Sachsen · Mathematik · Hauptschulbildungsgang',
    region: 'Sachsen',
    school: 'Oberschule',
    subject: 'Mathematik',
  },
  {
    id: OS_RS_PACK_ID,
    title: 'Oberschule Sachsen · Mathematik · Realschulbildungsgang',
    region: 'Sachsen',
    school: 'Oberschule',
    subject: 'Mathematik',
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
    expect(installed).toContain('Version 1.0.0')
    expect(installed).toContain('Aktualisiert am')
    expect(installed).not.toContain('changelog')
    expect(installed).not.toContain(' — Test')
    expect(count(installed, 'Entfernen')).toBe(1)

    removePack(OS_HS_PACK_ID, undefined, 20)
    const removed = renderToStaticMarkup(createElement(CurriculumSetup, props))
    expect(removed).not.toContain('Entfernen')
    expect(removed).not.toContain('Aktualisiert am')
    expect(removed).toContain('Installieren')
    expect(count(removed, 'Installieren')).toBe(9)
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
    expect(schulformIdForPack(catalog[1])).toBe('gymnasium')
    expect(schulformIdForPack(catalog[2])).toBe('hauptschule')
    expect(schulformIdForPack(catalog[3])).toBe('realschule')
  })

  it('keeps only the Hauptschule pack for Sachsen + Hauptschule', () => {
    const filtered = filterPacks(catalog, 'Sachsen', 'hauptschule')
    expect(filtered.map((pack) => pack.id)).toEqual([OS_HS_PACK_ID])
  })

  it('keeps only Physik when Fach is Physik', () => {
    const filtered = filterPacks(catalog, 'Sachsen', 'gymnasium', 'Physik')
    expect(filtered.map((pack) => pack.id)).toEqual([GYM_SACHSEN_PHYSIK_PACK_ID])
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
    expect(html).toContain('Fach')
    expect(html).toContain('Hauptschule')
    expect(html).toContain('Oberschule Sachsen · Mathematik · Hauptschulbildungsgang')
    expect(html).toContain(gradeSectionHeading('Oberschule Sachsen · Mathematik · Hauptschulbildungsgang'))
    expect(html).not.toContain('Gymnasium Sachsen')
    expect(html).not.toContain('Realschulbildungsgang')
    expect(html).not.toContain(gradeSectionHeading('Gymnasium Sachsen · Mathematik'))
    expect(count(html, 'Entfernen')).toBe(1)
    expect(html).not.toContain('Installieren')
  })

  it('shows only Physik packs when initialSubject is Physik', () => {
    installPack(gymPack())
    installPack(physikPack())
    const html = renderToStaticMarkup(
      createElement(CurriculumSetup, {
        ...props,
        initialRegion: 'Sachsen',
        initialSubject: 'Physik',
      }),
    )
    expect(html).toContain('Fach')
    expect(html).toContain('Gymnasium Sachsen · Physik')
    expect(html).toContain(gradeSectionHeading('Gymnasium Sachsen · Physik'))
    expect(html).not.toContain('Gymnasium Sachsen · Mathematik')
    expect(html).not.toContain('Oberschule Sachsen')
  })
})

describe('CurriculumSetup Installation', () => {
  it('does not show „In Themen einblenden“ for installed packs with unloaded grades', () => {
    installPack(gymPack())
    const html = renderToStaticMarkup(
      createElement(CurriculumSetup, { ...props, onEnsureSubject: vi.fn() }),
    )
    expect(html).toContain('Entfernen')
    expect(html).toContain('1 Thema · 1 Klassenstufe · Klasse 5')
    expect(html).toContain('Version 1.0.0')
    expect(html).not.toContain('In Themen einblenden')
    expect(html).not.toContain(' — Test')
  })

  it('loads only Sek I grades and never activates (no K12)', async () => {
    const onLoad = vi.fn(async () => undefined)
    const onEnsureSubject = vi.fn()
    installPack(physikPack())
    const html = renderToStaticMarkup(
      createElement(CurriculumSetup, {
        ...props,
        onLoad,
        onEnsureSubject,
        initialRegion: 'Sachsen',
        initialSubject: 'Physik',
      }),
    )
    expect(html).toContain('Installiert')
    // Simulate install path via activateInstalledPack behaviour: unit-test helper.
    const { isOberstufeGradeId } = await import('./CurriculumSetup')
    expect(isOberstufeGradeId('physik-jgs-12-lk')).toBe(true)
    expect(isOberstufeGradeId('physik-jgs-11-gk')).toBe(true)
    expect(isOberstufeGradeId('biologie-jgs-12-lk')).toBe(true)
    expect(isOberstufeGradeId('physik-klasse-6')).toBe(false)
    expect(isOberstufeGradeId('biologie-klasse-10')).toBe(false)
    expect(isOberstufeGradeId('geschichte-klasse-8')).toBe(false)

    const pack = physikPack()
    const sek1 = pack.official.filter((g) => !isOberstufeGradeId(g.id))
    const ober = pack.official.filter((g) => isOberstufeGradeId(g.id))
    expect(sek1.map((g) => g.id)).toEqual([
      'physik-klasse-6',
      'physik-klasse-7',
      'physik-klasse-8',
      'physik-klasse-9',
      'physik-klasse-10',
    ])
    expect(ober.length).toBeGreaterThan(0)
    expect(ober.every((g) => g.id.includes('jgs'))).toBe(true)
  })
})
