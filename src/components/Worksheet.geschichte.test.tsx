import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { romWeltreich, romChronologie } from '../curriculum/geschichte6'
import { romanExpansionMapHtml } from '../curriculum/geschichteRomMap'
import { dragDropSortTask, dragDropSlotsTask } from '../curriculum/taskHelpers'
import { createRng } from '../lib/rng'
import { worksheetPrintExtras, printLabel, printLabels } from '../lib/worksheetPrint'
import { TaskVisual } from './TaskMedia'
import { Worksheet } from './Worksheet'

describe('printLabel helpers', () => {
  it('extracts labels from drag-drop item objects', () => {
    expect(printLabel({ label: 'Romulus', value: 0 })).toBe('Romulus')
    expect(printLabels([{ label: 'A', value: 1 }, { label: 'B', value: 2 }])).toEqual([
      'A',
      'B',
    ])
    expect(printLabel('plain')).toBe('plain')
  })
})

describe('worksheetPrintExtras drag-drop', () => {
  it('stringifies {label,value} items for dragDropSort (no React crash)', () => {
    const task = dragDropSortTask({
      question: 'Ordne chronologisch:',
      items: [
        { label: 'Gründung Roms', value: 0 },
        { label: 'Republik', value: 1 },
        { label: 'Punische Kriege', value: 2 },
      ],
      correctOrder: [0, 1, 2],
      solution: 'Gründung → Republik → Punisch',
      explanation: 'früh → spät',
    })
    const extras = worksheetPrintExtras(task)
    expect(extras.options?.every((o) => typeof o === 'string')).toBe(true)
    expect(extras.options).toEqual(
      expect.arrayContaining(['Gründung Roms', 'Republik', 'Punische Kriege']),
    )
    expect(extras.answerBlank).toMatch(/1\. ______/)
  })

  it('stringifies dragDropSlots items and includes slot labels', () => {
    const task = dragDropSlotsTask({
      question: 'Ordne zu:',
      items: [
        { label: 'nur die Stadt Rom', value: 0 },
        { label: 'beherrschtes Mittelmeer', value: 1 },
        { label: 'Distraktor', value: 2 },
      ],
      correctSlots: [0, 1],
      slotLabels: ['Stadtstaat', 'Mare Nostrum'],
      solution: 'Stadtstaat → Mare Nostrum',
      explanation: 'Zuordnung',
    })
    const extras = worksheetPrintExtras(task)
    expect(extras.options?.every((o) => typeof o === 'string')).toBe(true)
    expect(extras.paperHint).toMatch(/Stadtstaat/)
    expect(extras.answerBlank).toContain('Stadtstaat:')
  })
})

describe('Worksheet Geschichte K6', () => {
  it('renders map figure visualContent without crashing', () => {
    const mapHtml = romanExpansionMapHtml('extent')
    const html = renderToStaticMarkup(createElement(TaskVisual, { html: mapHtml }))
    expect(html).toContain('task-visual')
    expect(html).toContain('/maps/')
    expect(html).toContain('figcaption')
  })

  it('renders weltreich worksheet (maps + matchTerms) without blanking', () => {
    const topic = {
      id: 'ge-k6-lb1-weltreich',
      title: 'Vom Stadtstaat zum Weltreich',
      pointsPerTask: 1,
      generate: romWeltreich,
    }
    const html = renderToStaticMarkup(
      createElement(Worksheet, {
        topic,
        areaTitle: 'LB1 Rom',
        gradeTitle: 'Klasse 6',
        onExit: () => undefined,
      }),
    )
    expect(html).toContain('Übungsblatt')
    expect(html).toContain('sheet__tasks')
    expect(html.length).toBeGreaterThan(800)
    // Must not crash on {label,value} — options appear as text
    expect(html).not.toContain('[object Object]')
  })

  it('renders chronologie dragDropSort worksheet without crashing', () => {
    const topic = {
      id: 'ge-k6-lb1-chronologie',
      title: 'Chronologie',
      pointsPerTask: 1,
      generate: romChronologie,
    }
    const html = renderToStaticMarkup(
      createElement(Worksheet, {
        topic,
        areaTitle: 'LB1 Rom',
        gradeTitle: 'Klasse 6',
        onExit: () => undefined,
      }),
    )
    expect(html).toContain('Übungsblatt')
    expect(html).toContain('sheet__option-box')
    expect(html).not.toContain('[object Object]')
  })

  it('keeps map visualHtml in print extras when present', () => {
    let task = romWeltreich(createRng(42))
    for (let i = 0; i < 80; i++) {
      task = romWeltreich(createRng(2000 + i))
      if (task.visualContent?.includes('<figure')) break
    }
    expect(task.visualContent).toContain('<figure')
    const extras = worksheetPrintExtras(task)
    expect(extras.visualHtml).toContain('<img')
    expect(extras.visualHtml).toContain('/maps/')
    expect(extras.options?.every((o) => typeof o === 'string')).toBe(true)
  })
})
