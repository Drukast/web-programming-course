import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SessionService } from './sessionService.js'

// Мокаем scoringService
vi.mock('./scoringService', () => ({
  scoringService: {
    scoreQuestion: vi.fn().mockReturnValue(2)
  }
}))

describe('SessionService unit tests', () => {
  let service: SessionService
  let mockTx: any

  beforeEach(() => {
    vi.resetModules()
    service = new SessionService()
    
    mockTx = {
      session: {
        findUnique: vi.fn(),
        update: vi.fn()
      },
      question: {
        findUnique: vi.fn()
      },
      answer: {
        findUnique: vi.fn(),
        create: vi.fn()
      }
    }
  })

  describe('submitAnswer', () => {
    it('должен выбросить ошибку если сессия не найдена', async () => {
      mockTx.session.findUnique.mockResolvedValue(null)
      
      // Подменяем prisma.$transaction
      const originalPrisma = (service as any).prisma
      if (originalPrisma) {
        originalPrisma.$transaction = vi.fn().mockImplementation(async (callback) => {
          return callback(mockTx)
        })
      }
      
      await expect(service.submitAnswer({
        sessionId: '123',
        questionId: '456',
        userAnswer: ['a']
      })).rejects.toThrow('Сессия не найдена')
    })
  })
})