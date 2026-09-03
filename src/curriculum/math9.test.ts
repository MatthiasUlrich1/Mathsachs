import { describe } from 'vitest'
import { klasse9 } from './math9'
import { runGradeSelfTest } from './gradeSelfTest'

describe('Klasse 9 curriculum', () => {
  runGradeSelfTest(klasse9, { idPrefix: 'k9-', areaCount: 5, minTopics: 14 })
})
