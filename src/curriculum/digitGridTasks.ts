import { parseInteger } from '../lib/num'
import type { Task, UserInput } from './types'

/** Right-align digit strings into a fixed-width cell array. */
export const padDigits = (n: number, width: number): string[] => {
  const s = String(Math.abs(n))
  const cells = Array.from({ length: width }, () => '')
  const offset = width - s.length
  for (let i = 0; i < s.length; i++) cells[offset + i] = s[i]
  return cells
}

/** Parse digit-grid cells into an integer (leading empty cells ignored). */
export const parseDigitGrid = (digits: string[]): number | null => {
  const joined = digits.join('').replace(/\D/g, '')
  if (!joined) return null
  return parseInteger(joined)
}

const emptyCells = (width: number): string[] => Array.from({ length: width }, () => '')

type CellTone = 'green' | 'blue' | 'red' | 'default'

/**
 * German schriftliche Multiplikation (Stellenwertverfahren von links):
 * Faktoren in einer Zeile, dann eine editierbare Zeile je Ziffer des zweiten
 * Faktors (Teilprodukte) + Summe.
 * Beispiel 23·36 → 690 (=23·30), 138 (=23·6), Summe 828.
 */
export const digitGridMultiplyTask = (input: {
  question: string
  a: number
  b: number
  solution: string
  explanation: string
}): Task => {
  const a = Math.abs(input.a)
  const b = Math.abs(input.b)
  const product = a * b
  const bDigits = String(b).split('').map((d) => Number(d))
  const partials: Array<{ value: number; label: string }> = []
  for (let i = 0; i < bDigits.length; i++) {
    const digit = bDigits[i]
    const place = 10 ** (bDigits.length - 1 - i)
    partials.push({
      value: a * digit * place,
      label: `= ${a} · ${digit * place}`,
    })
  }
  const width = Math.max(
    String(a).length + 1 + String(b).length,
    ...partials.map((p) => String(p.value).length),
    String(product).length,
  )
  const aStr = String(a)
  const bStr = String(b)
  const headDigits = emptyCells(width)
  const cellTones: CellTone[] = emptyCells(width).map(() => 'default')
  let cursor = width - (aStr.length + 1 + bStr.length)
  for (let i = 0; i < aStr.length; i++) {
    headDigits[cursor] = aStr[i]
    cellTones[cursor] = 'green'
    cursor++
  }
  headDigits[cursor++] = '·'
  for (let i = 0; i < bStr.length; i++) {
    headDigits[cursor] = bStr[i]
    cellTones[cursor] = 'blue'
    cursor++
  }

  const ruleWidth = Math.max(3, String(product).length)
  const builtRows = [
    { digits: headDigits, cellTones },
    { rule: true, digits: emptyCells(ruleWidth) },
    ...partials.map((p) => ({
      editable: true as const,
      digits: emptyCells(width),
      label: p.label,
    })),
    { rule: true, digits: emptyCells(ruleWidth) },
    { editable: true as const, digits: emptyCells(width), tone: 'red' as const },
  ]

  const expectedRows = [
    ...partials.map((p) => padDigits(p.value, width)),
    padDigits(product, width),
  ]

  return {
    question: input.question,
    answerKind: 'integer',
    solution: input.solution,
    explanation: input.explanation,
    sampleAnswer: {
      kind: 'digitGrid',
      digits: padDigits(product, width),
      answerRows: expectedRows.map((r) => [...r]),
    },
    interactive: {
      type: 'digitGrid',
      props: {
        rows: builtRows,
        answerLength: width,
        answerRowLengths: expectedRows.map((r) => r.length),
        layout: 'multiply',
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind === 'digitGrid') {
        if (answer.answerRows && answer.answerRows.length === expectedRows.length) {
          return answer.answerRows.every(
            (row, i) => parseDigitGrid(row) === parseDigitGrid(expectedRows[i]),
          )
        }
        const parsed = parseDigitGrid(answer.digits)
        return parsed !== null && parsed === product
      }
      if (answer.kind === 'value') {
        const parsed = parseInteger(answer.value)
        return parsed !== null && parsed === product
      }
      return false
    },
  }
}

/** Long-division metadata (German layout, single-digit divisor). */
export type DivisionStep = {
  take: number
  qDigit: number
  remainder: number
  endCol: number
}

/** Compute German long-division steps for a single-digit divisor. */
export const longDivisionSteps = (
  dividend: number,
  divisor: number,
): { quotient: number; rest: number; steps: DivisionStep[] } => {
  const digits = String(Math.abs(dividend)).split('').map(Number)
  const steps: DivisionStep[] = []
  let current = 0
  let quotient = 0
  let started = false
  for (let i = 0; i < digits.length; i++) {
    current = current * 10 + digits[i]
    const qDigit = Math.floor(current / divisor)
    if (!started && qDigit === 0 && i < digits.length - 1) {
      continue
    }
    started = true
    const product = qDigit * divisor
    const remainder = current - product
    steps.push({ take: current, qDigit, remainder, endCol: i })
    quotient = quotient * 10 + qDigit
    current = remainder
  }
  return { quotient, rest: current, steps }
}

/**
 * Schriftliche Division (einstelliger Divisor).
 * Layout wie Vorlage: Dividend : Divisor = [Quotient-Kästchen],
 * darunter ggf. Rest-Zeile. Quotient-Ziffern einzeln eintragen.
 */
export const digitGridDivideTask = (input: {
  question: string
  dividend: number
  divisor: number
  quotient: number
  rest: number
  solution: string
  explanation: string
}): Task => {
  const { dividend, divisor, quotient, rest } = input
  const qStr = String(quotient)
  const dStr = String(dividend)
  const rStr = String(rest)

  const headerDigits = [
    ...dStr.split(''),
    ':',
    ...String(divisor).split(''),
    '=',
  ]

  const built = [
    {
      digits: headerDigits,
      label: rest > 0 ? 'Quotient und Rest ↓' : 'Quotient ↓',
    },
    {
      editable: true as const,
      digits: emptyCells(qStr.length),
      tone: 'red' as const,
      label: 'Quotient',
    },
    ...(rest > 0
      ? [
          {
            editable: true as const,
            digits: emptyCells(rStr.length),
            label: 'Rest',
          },
        ]
      : []),
  ]

  const expectedRows =
    rest > 0
      ? [padDigits(quotient, qStr.length), padDigits(rest, rStr.length)]
      : [padDigits(quotient, qStr.length)]

  return {
    question: input.question,
    answerKind: 'text',
    solution: input.solution,
    explanation: input.explanation,
    sampleAnswer: {
      kind: 'digitGrid',
      digits: padDigits(quotient, qStr.length),
      answerRows: expectedRows.map((r) => [...r]),
    },
    interactive: {
      type: 'digitGrid',
      props: {
        rows: built,
        answerLength: qStr.length,
        answerRowLengths: expectedRows.map((r) => r.length),
        layout: 'divide',
      },
    },
    check: (answer: UserInput) => {
      if (answer.kind === 'digitGrid') {
        if (answer.answerRows && answer.answerRows.length >= 1) {
          const qOk = parseDigitGrid(answer.answerRows[0]) === quotient
          if (rest > 0) {
            return (
              qOk &&
              answer.answerRows[1] != null &&
              parseDigitGrid(answer.answerRows[1]) === rest
            )
          }
          return qOk
        }
        return parseDigitGrid(answer.digits) === quotient && rest === 0
      }
      if (answer.kind === 'value') {
        const raw = answer.value.trim().toLowerCase()
        if (rest === 0) {
          const parsed = parseInteger(raw)
          return parsed === quotient
        }
        const accepted = [
          `${quotient} r ${rest}`,
          `${quotient}r${rest}`,
          `${quotient} rest ${rest}`,
        ]
        return accepted.includes(raw)
      }
      return false
    },
  }
}
