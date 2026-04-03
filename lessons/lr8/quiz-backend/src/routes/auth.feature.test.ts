import { describe, it, expect, beforeAll } from 'vitest'
import app from '../index.js'

describe('Auth API', () => {
  let authToken: string

  beforeAll(async () => {
    const authResponse = await app.request('/api/auth/github/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'test_code' })
    })
    const data = await authResponse.json()
    authToken = data.token
  })

  describe('POST /api/auth/github/callback', () => {

    it('should return 400 for missing code', async () => {
      const response = await app.request('/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      expect(response.status).toBe(400)
    })

    it('should return 400 for empty code', async () => {
      const response = await app.request('/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: '' })
      })
      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return 401 without token', async () => {
      const response = await app.request('/api/auth/me')
      expect(response.status).toBe(401)
    })

    it('should return 401 with invalid token', async () => {
      const response = await app.request('/api/auth/me', {
        headers: { 'Authorization': 'Bearer invalid-token' }
      })
      expect(response.status).toBe(401)
    })

  })
})