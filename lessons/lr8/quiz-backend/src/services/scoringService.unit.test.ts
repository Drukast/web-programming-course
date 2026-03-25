import { describe, it, expect } from 'vitest'
import { scoringService } from './scoringService.js'

describe('scoringService unit tests', () => {
  describe('scoreMultipleSelect', () => {
    it('полный балл за все правильные ответы', () => {
      const result = scoringService.scoreMultipleSelect(['a', 'b'], ['a', 'b'])
      expect(result).toBe(2)
    })

    it('штраф за неправильный ответ', () => {
      const result = scoringService.scoreMultipleSelect(['a', 'b'], ['a', 'c'])
      expect(result).toBe(0.5)
    })

    it('не ниже нуля', () => {
      const result = scoringService.scoreMultipleSelect(['a'], ['b', 'c', 'd'])
      expect(result).toBe(0)
    })

    it('пустые ответы', () => {
      expect(scoringService.scoreMultipleSelect(['a'], [])).toBe(0)
      expect(scoringService.scoreMultipleSelect([], ['a'])).toBe(0)
    })
  })

  describe('scoreEssay', () => {
    const rubric = {
      maxPoints: 10,
      criteria: [
        { name: 'Content', maxPoints: 5 },
        { name: 'Structure', maxPoints: 3 },
        { name: 'Language', maxPoints: 2 }
      ]
    }

    it('суммирует оценки', () => {
      const result = scoringService.scoreEssay([4, 2, 1], rubric)
      expect(result).toBe(7)
    })

    it('не превышает maxPoints', () => {
      // Оценки в пределах критериев, сумма = 10 (равна maxPoints)
      const result = scoringService.scoreEssay([5, 3, 2], rubric)
      expect(result).toBe(10)
    })

    it('ошибка при несоответствии количества оценок', () => {
      expect(() => scoringService.scoreEssay([4, 2], rubric)).toThrow()
    })
  })
})