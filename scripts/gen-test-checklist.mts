import { writeFileSync, mkdirSync } from 'node:fs'
import { createRng } from '../src/lib/rng.ts'
import { klasse5 } from '../src/curriculum/math5.ts'
import { klasse6 } from '../src/curriculum/math6.ts'
import { klasse7 } from '../src/curriculum/math7.ts'
import { klasse8 } from '../src/curriculum/math8.ts'
import { klasse9 } from '../src/curriculum/math9.ts'
import { klasse10 } from '../src/curriculum/math10.ts'
import { klasse11_12 } from '../src/curriculum/math11_12.ts'
import { buildOberschuleHsPack, buildOberschuleRsPack } from '../src/curriculum/oberschulePacks.ts'
import {
  gymGeneratorCatalog,
  resolveOsGenerate,
} from '../src/curriculum/oberschuleGenerators.ts'
import type { Topic } from '../src/curriculum/types.ts'

const gymGrades: Array<[string, { areas: Array<{ title: string; topics: Topic[] }> }]> = [
  ['Gymnasium Klasse 5', klasse5],
  ['Gymnasium Klasse 6', klasse6],
  ['Gymnasium Klasse 7', klasse7],
  ['Gymnasium Klasse 8', klasse8],
  ['Gymnasium Klasse 9', klasse9],
  ['Gymnasium Klasse 10', klasse10],
  ['Gymnasium Klasse 11/12', klasse11_12],
]

function flagsFor(gen: Topic['generate']) {
  const kinds = new Set<string>()
  let hasVisual = false
  for (let seed = 1; seed <= 40; seed++) {
    const t = gen(createRng(seed))
    if (t.visualContent) hasVisual = true
    if (t.interactive?.type) kinds.add(t.interactive.type)
  }
  return { hasVisual, kinds: [...kinds].sort() }
}

function labelFlags({ hasVisual, kinds }: { hasVisual: boolean; kinds: string[] }) {
  const parts: string[] = []
  if (hasVisual) parts.push('SVG/Grafik')
  const map: Record<string, string> = {
    numberLine: 'Zahlenstrahl',
    dragDropSort: 'Drag&Drop',
    digitGrid: 'DigitGrid',
    choicePick: 'Auswahl tippen',
    multiSelect: 'Mehrfachauswahl',
    coordinateClick: 'Punkt setzen',
    paramSlider: 'Schieberegler',
  }
  for (const k of kinds) parts.push(map[k] || k)
  return parts.join(' · ') || 'Text'
}

function topicBlock(title: string, areaTitle: string, id: string, flags: ReturnType<typeof flagsFor>) {
  return [
    `- [ ] **${title}**  `,
    `  _${areaTitle}_ · \`${id}\` · ${labelFlags(flags)}  `,
    '  Kommentar: _______________________________________________',
    '',
  ].join('\n')
}

const lines: string[] = []
lines.push('# Testcheckliste: Grafische & interaktive Aufgaben')
lines.push('')
lines.push('Stand: v0.24.0 — Klasse für Klasse abhaken. Kommentarzeile für Notizen.')
lines.push('')
lines.push(
  'Legende: **SVG/Grafik** = Diagramm; Widgets: Zahlenstrahl, Drag&Drop, DigitGrid, Auswahl tippen, Mehrfachauswahl, Punkt setzen, Schieberegler.',
)
lines.push('')

for (const [title, grade] of gymGrades) {
  lines.push('---')
  lines.push('')
  lines.push(`## ${title}`)
  lines.push('')
  for (const area of grade.areas) {
    const blocks: string[] = []
    for (const topic of area.topics) {
      const f = flagsFor(topic.generate)
      if (!f.hasVisual && f.kinds.length === 0) continue
      blocks.push(topicBlock(topic.title, area.title, topic.id, f))
    }
    if (blocks.length === 0) continue
    lines.push(`### Lernbereich: ${area.title}`)
    lines.push('')
    lines.push(...blocks)
  }
}

const catalog = await gymGeneratorCatalog()

function osSection(
  name: string,
  pack: ReturnType<typeof buildOberschuleHsPack>,
) {
  lines.push('---')
  lines.push('')
  lines.push(`## ${name}`)
  lines.push('')
  for (const g of pack.official) {
    lines.push(`### ${g.title}`)
    lines.push('')
    for (const area of g.areas) {
      const blocks: string[] = []
      for (const t of area.topics) {
        const gen = resolveOsGenerate(t.id, catalog)
        if (!gen) continue
        const f = flagsFor(gen)
        if (!f.hasVisual && f.kinds.length === 0) continue
        blocks.push(topicBlock(t.title, area.title, t.id, f))
      }
      if (blocks.length === 0) continue
      lines.push(`#### ${area.title}`)
      lines.push('')
      lines.push(...blocks)
    }
  }
}

osSection('Oberschule Hauptschulbildungsgang (HS)', buildOberschuleHsPack())
osSection('Oberschule Realschulbildungsgang (RS)', buildOberschuleRsPack())

mkdirSync('docs', { recursive: true })
writeFileSync('docs/TESTCHECKLISTE-grafik-interaktiv.md', lines.join('\n'), 'utf8')
console.log(`Wrote ${lines.length} lines → docs/TESTCHECKLISTE-grafik-interaktiv.md`)
