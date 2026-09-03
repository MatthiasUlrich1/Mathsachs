import { describe } from 'vitest'
import { klasse7 } from './math7'
import { runGradeSelfTest } from './gradeSelfTest'

describe('Klasse 7 curriculum', () => {
  runGradeSelfTest(klasse7, { idPrefix: 'k7-', areaCount: 4, minTopics: 16 })
})
