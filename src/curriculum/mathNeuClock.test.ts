/**
 * Neu-Themen: ehemalige __neu-Themen (seit E1 in ihre Parents gemergt; geprüft wird der Neu-Generator) nutzen die Uhr mit verschiebbaren Zeigern (clockTask).
 * Klasse 5: Winkelarten (Winkel zwischen den Zeigern), Zeiteinheiten (Uhrzeit nach einer Dauer, Uhrzeit in Worten).
 */
import { describe, expect, it } from 'vitest'
import { createRng } from '../lib/rng'
import { ckAngleBetween, ckFormatTime } from '../lib/clockLogic'
import { worksheetPrintExtras } from '../lib/worksheetPrint'
import { math5NeuTopics } from './math5NeuTopics'
import type { Task, Topic } from './types'

const topicOf = (id: string): Topic => {
  const t = math5NeuTopics.find((x) => x.id === id)
  if (!t) throw new Error(`Thema ${id} nicht gefunden`)
  return t
}

const SEEDS = Array.from({ length: 80 }, (_, i) => i * 3 + 1)
const clockTasks = (topic: Topic): Task[] => {
  const out: Task[] = []
  for (const seed of SEEDS) {
    const rng = createRng(seed)
    for (let i = 0; i < 14; i++) {
      const t = topic.generate(rng)
      if (t.interactive?.type === 'clock') out.push(t)
    }
  }
  return out
}

const answerOf = (t: Task): { h: number; m: number } => t.sampleAnswer as { h: number; m: number }
const modeOf = (t: Task): string => String(t.interactive!.props.mode)
/** A written time like 7:25 or 12:05. */
const TIME = /\b\d{1,2}:\d{2}\b/g

/** Spoilers: the solution time in the question or props, or a screen-only hint in the question. Returns the findings. */
const spoilers = (t: Task): string[] => {
  const hits: string[] = []
  const { h, m } = answerOf(t)
  const solved = ckFormatTime({ h, m })
  if (modeOf(t) === 'angle') {
    if ((t.question.match(TIME) ?? []).length > 0) hits.push('Frage nennt eine Uhrzeit')
  } else if (((t.question.match(TIME) ?? []) as string[]).includes(solved)) {
    hits.push('Frage nennt die gesuchte Uhrzeit')
  }
  if (/zieh|tippe|klick|pfeiltaste|punkt|knopf/i.test(t.question)) hits.push('Bildschirm-Hinweis in der Frage')
  if (/"(time|angle|h|m|value|solution|exampleTime)":/.test(JSON.stringify(t.interactive!.props))) hits.push('Lösung in den Props')
  return hits
}

describe('Spoiler-Test kann fehlschlagen (Gegenprobe)', () => {
  it('erkennt eine verratene Uhrzeit, einen Bildschirm-Hinweis und eine Lösung in den Props', () => {
    const base = clockTasks(topicOf('k5-umrechnen-zeit__neu')).find((t) => modeOf(t) === 'setTime')!
    const solved = ckFormatTime(answerOf(base))
    expect(spoilers({ ...base, question: `Es ist ${solved} Uhr.` } as Task)).toContain('Frage nennt die gesuchte Uhrzeit')
    expect(spoilers({ ...base, question: 'Ziehe den Zeiger.' } as Task)).toContain('Bildschirm-Hinweis in der Frage')
    expect(spoilers({ ...base, interactive: { type: 'clock', props: { time: { h: 1, m: 5 } } } } as Task)).toContain('Lösung in den Props')
    const angleTask = clockTasks(topicOf('lb3-winkelarten__neu'))[0]!
    expect(spoilers({ ...angleTask, question: 'Stelle 3:00 ein.' } as Task)).toContain('Frage nennt eine Uhrzeit')
  })
})

const CASES: Array<{ id: string; modes: string[] }> = [
  { id: 'lb3-winkelarten__neu', modes: ['angle'] },
  { id: 'k5-umrechnen-zeit__neu', modes: ['setTime'] },
]

describe.each(CASES)('Neu-Thema Uhr $id', (c) => {
  const topic = topicOf(c.id)
  const tasks = clockTasks(topic)

  it('Neu-Quelle ist als Neu markiert (Thema selbst lebt im Parent, siehe mergeNeu.test)', () => {
    expect(topic.released).toBe(false)
    expect(topic.neu).toBe(true)
  })

  it('hat Uhr-Varianten im erwarteten Modus mit dedupeKey, Erklärung, lösbarer sampleAnswer, Start besteht nicht, ohne Spoiler', () => {
    expect(tasks.length).toBeGreaterThan(0)
    for (const t of tasks) {
      expect(c.modes, t.question).toContain(modeOf(t))
      expect(t.check(t.sampleAnswer), t.question).toBe(true)
      expect(t.check({ kind: 'clock', h: 0, m: 0, touched: false }), t.question).toBe(false)
      expect(t.check({ kind: 'clock', h: 0, m: 0, touched: true }), t.question).toBe(false)
      expect(t.dedupeKey?.trim(), t.question).toBeTruthy()
      expect(t.explanation.length, t.question).toBeGreaterThan(40)
      expect(t.solution.trim(), t.question).toBeTruthy()
      expect(spoilers(t), t.question).toEqual([])
      expect(t.visualContent, t.question).toBeUndefined()
    }
  })

  it('die Papierform hat ein Zifferblatt (Uhrzeit einstellen) oder ein Uhr-Feld (Winkel)', () => {
    for (const t of tasks) {
      const extras = worksheetPrintExtras(t)
      if (modeOf(t) === 'setTime') expect(extras.visualHtml, t.question).toContain('<svg')
      else expect(extras.answerBlank, t.question).toMatch(/Uhr/)
    }
  })
})

describe('Uhr im Thema Winkelarten', () => {
  const tasks = clockTasks(topicOf('lb3-winkelarten__neu'))

  it('die Musterlösung bildet den Winkel, und es gibt noch eine zweite Uhrzeit mit demselben Winkel', () => {
    const angles = new Set<number>()
    for (const t of tasks) {
      const deg = Number(/(\d+)°/.exec(t.question)![1])
      angles.add(deg)
      expect(ckAngleBetween(answerOf(t)), t.question).toBe(deg)
      expect(t.dedupeKey).toBe(`winkelarten-uhr-winkel:${deg}`)
      expect(deg).toBeLessThan(180)
      expect(t.solution).toContain(ckFormatTime(answerOf(t)))
    }
    expect(angles.size).toBeGreaterThan(6)
  })

  it('weitere Uhrzeiten, die die Erklärung nennt, bilden den Winkel wirklich', () => {
    let checked = 0
    for (const t of tasks) {
      const deg = Number(/(\d+)°/.exec(t.question)![1])
      const m = /zum Beispiel (\d+):(\d\d) Uhr/.exec(t.explanation)
      if (!m) continue
      checked += 1
      expect(ckAngleBetween({ h: Number(m[1]) % 12, m: Number(m[2]) }), t.explanation).toBe(deg)
    }
    expect(checked).toBeGreaterThan(0)
  })
})

describe('Winkel-Uhr: genannte Uhrzeiten stimmen mit der Prüfung überein', () => {
  const tasks = clockTasks(topicOf('lb3-winkelarten__neu'))
  const accepted = (deg: number): string[] => {
    const out: string[] = []
    for (let h = 0; h < 12; h++) for (let m = 0; m < 60; m += 5) if (Math.abs(ckAngleBetween({ h, m }) - deg) <= 2.5 + 1e-9) out.push(ckFormatTime({ h, m }))
    return out
  }

  it('jede genannte Uhrzeit wird akzeptiert; bei mehreren akzeptierten Zeiten steht "weitere Uhrzeiten" da', () => {
    const degs = new Set<number>()
    for (const t of tasks) {
      const deg = Number(/(\d+)°/.exec(t.question)![1])
      degs.add(deg)
      const ok = accepted(deg)
      const named = `${t.solution} ${t.explanation}`.match(/\b\d{1,2}:\d{2}\b/g) ?? []
      expect(named.length, t.question).toBeGreaterThan(0)
      for (const time of named) expect(ok, `${t.question} nennt ${time}`).toContain(time)
      if (ok.length > 1) expect(t.explanation, t.question).toMatch(/weitere (passende )?Uhrzeiten/)
    }
    expect(degs.has(180)).toBe(false)
    expect(degs.size).toBeGreaterThan(6)
  })

  it('Gegenprobe: 180 Grad hätte mehrere akzeptierte Zeiten', () => {
    expect(accepted(180).length).toBeGreaterThan(1)
  })
})

describe('Uhr im Thema Zeiteinheiten', () => {
  const tasks = clockTasks(topicOf('k5-umrechnen-zeit__neu'))
  const duration = tasks.filter((t) => t.dedupeKey!.startsWith('zeit-uhr-dauer'))
  const words = tasks.filter((t) => t.dedupeKey!.startsWith('zeit-uhr-worte'))

  it('beide Varianten kommen vor', () => {
    expect(duration.length).toBeGreaterThan(0)
    expect(words.length).toBeGreaterThan(0)
    expect(duration.length + words.length).toBe(tasks.length)
  })

  it('Dauer: Anfangszeit plus Dauer ergibt die Endzeit (neu gerechnet aus der Frage)', () => {
    for (const t of duration) {
      const start = /(\d{1,2}):(\d{2}) Uhr/.exec(t.question)!
      const d = Number(/(\d+) Minuten/.exec(t.question)![1])
      const total = Number(start[1]) * 60 + Number(start[2]) + d
      expect(answerOf(t), t.question).toMatchObject({ h: Math.floor(total / 60) % 12, m: total % 60 })
      expect(t.solution).toBe(`${ckFormatTime(answerOf(t))} Uhr`)
      expect(t.question).toMatch(/Zeige an der Uhr/)
    }
  })

  it('Dauer: die Beschreibung des Stundenzeigers passt zur Minutenzahl', () => {
    const seen = new Set<string>()
    for (const t of duration) {
      const { h, m } = answerOf(t)
      const shown = h === 0 ? 12 : h
      const next = shown === 12 ? 1 : shown + 1
      const want = m === 0 ? `genau auf der ${shown}` : m < 30 ? `ein Stück hinter der ${shown}` : m === 30 ? `genau in der Mitte zwischen der ${shown} und der ${next}` : m < 45 ? `schon hinter der Mitte zwischen der ${shown} und der ${next}` : `kurz vor der ${next}`
      expect(t.explanation, t.question).toContain(`Stundenzeiger steht ${want}.`)
      expect(t.explanation).not.toContain('kurz hinter')
      seen.add(m === 0 ? 'voll' : m < 30 ? 'vor30' : m === 30 ? 'halb' : 'nach30')
    }
    expect(seen.size).toBeGreaterThanOrEqual(3)
  })

  it('Dauer: der dedupeKey nennt die Szene', () => {
    const scenes = new Set(duration.map((t) => t.dedupeKey!.split(':')[1]!.split('-')[0]))
    expect(scenes.size).toBeGreaterThanOrEqual(4)
  })

  it('Worte: die Uhrzeit passt zur Formulierung', () => {
    const wanted = (label: string, hour: number): { h: number; m: number } => {
      const prev = hour === 1 ? 12 : hour - 1
      const table: Array<[RegExp, { h: number; m: number }]> = [
        [/^Viertel nach /, { h: hour, m: 15 }],
        [/^fünf nach halb /, { h: prev, m: 35 }],
        [/^fünf vor halb /, { h: prev, m: 25 }],
        [/^fünf nach /, { h: hour, m: 5 }],
        [/^zwanzig nach /, { h: hour, m: 20 }],
        [/^halb /, { h: prev, m: 30 }],
        [/^Viertel vor /, { h: prev, m: 45 }],
        [/^zehn vor /, { h: prev, m: 50 }],
      ]
      const hit = table.find(([re]) => re.test(label))
      if (!hit) throw new Error(label)
      return hit[1]
    }
    const seen = new Set<string>()
    for (const t of words) {
      const label = /Es ist (.+)\. Zeige/.exec(t.question)![1]!
      const hour = Number(/(\d+)$/.exec(label)![1])
      const want = wanted(label, hour)
      expect(answerOf(t), t.question).toMatchObject({ h: want.h % 12, m: want.m })
      seen.add(label.replace(/\d+$/, ''))
    }
    expect(seen.size).toBeGreaterThanOrEqual(6)
  })
})

describe('dedupeKeys der Uhr-Varianten sind je Thema getrennt', () => {
  it('die beiden Themen teilen keinen dedupeKey', () => {
    const keys = (id: string) => new Set(clockTasks(topicOf(id)).map((t) => t.dedupeKey!))
    const a = keys('lb3-winkelarten__neu')
    const b = keys('k5-umrechnen-zeit__neu')
    expect([...a].filter((k) => b.has(k))).toEqual([])
    expect(a.size).toBeGreaterThan(0)
    expect(b.size).toBeGreaterThan(0)
  })
})
