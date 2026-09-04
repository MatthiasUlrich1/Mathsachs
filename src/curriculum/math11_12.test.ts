import { describe } from 'vitest'
import { klasse11_12 } from './math11_12'
import { runGradeSelfTest } from './gradeSelfTest'

describe('Jahrgangsstufe 11/12 curriculum', () => {
  runGradeSelfTest(klasse11_12, { idPrefix: 'k1112-', areaCount: 3, minTopics: 7 })
})
