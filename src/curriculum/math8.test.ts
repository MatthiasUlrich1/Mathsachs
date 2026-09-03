import { describe } from 'vitest'
import { klasse8 } from './math8'
import { runGradeSelfTest } from './gradeSelfTest'

describe('Klasse 8 curriculum', () => {
  runGradeSelfTest(klasse8, { idPrefix: 'k8-', areaCount: 5, minTopics: 16 })
})
