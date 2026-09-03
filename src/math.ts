export type Operation = '+' | '-' | '×' | '÷'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Problem {
  a: number
  b: number
  operation: Operation
  answer: number
  prompt: string
}

/** Largest operand used for +/- at a given difficulty. */
export const rangeFor = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy':
      return 10
    case 'medium':
      return 25
    case 'hard':
      return 99
  }
}

/** Largest factor used for ×/÷ at a given difficulty. */
const factorRangeFor = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'easy':
      return 5
    case 'medium':
      return 9
    case 'hard':
      return 12
  }
}

const randInt = (
  min: number,
  max: number,
  rng: () => number = Math.random,
): number => Math.floor(rng() * (max - min + 1)) + min

/**
 * Generate a single arithmetic problem. Subtraction never goes negative and
 * division always resolves to a whole number, so every problem has a clean
 * integer answer. An injectable `rng` keeps generation deterministic in tests.
 */
export const generateProblem = (
  difficulty: Difficulty,
  operations: Operation[],
  rng: () => number = Math.random,
): Problem => {
  if (operations.length === 0) {
    throw new Error('At least one operation must be enabled')
  }

  const operation = operations[randInt(0, operations.length - 1, rng)]
  const max = rangeFor(difficulty)
  const factorMax = factorRangeFor(difficulty)

  let a: number
  let b: number
  let answer: number

  switch (operation) {
    case '+':
      a = randInt(1, max, rng)
      b = randInt(1, max, rng)
      answer = a + b
      break
    case '-':
      a = randInt(1, max, rng)
      b = randInt(0, a, rng)
      answer = a - b
      break
    case '×':
      a = randInt(2, factorMax, rng)
      b = randInt(2, factorMax, rng)
      answer = a * b
      break
    case '÷':
      b = randInt(2, factorMax, rng)
      answer = randInt(2, factorMax, rng)
      a = b * answer
      break
  }

  return { a, b, operation, answer, prompt: `${a} ${operation} ${b}` }
}

export const checkAnswer = (problem: Problem, response: number): boolean =>
  problem.answer === response
