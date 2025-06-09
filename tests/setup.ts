import { beforeAll, afterAll, beforeEach } from 'vitest'

// Mock environment variables for testing
beforeAll(() => {
  process.env.POSTGRES_URL = 'postgresql://test:test@localhost:5432/test_db'
  process.env.NODE_ENV = 'test'
})

// Global test setup
beforeEach(() => {
  // Reset any global state if needed
})

afterAll(() => {
  // Cleanup
})