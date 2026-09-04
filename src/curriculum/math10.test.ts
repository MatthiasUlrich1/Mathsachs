import { describe } from 'vitest'
import { klasse10 } from './math10'
import { runGradeSelfTest } from './gradeSelfTest'

describe('Klasse 10 curriculum', () => {
  runGradeSelfTest(klasse10, { idPrefix: 'k10-', areaCount: 5, minTopics: 14 })
})
