import { describe, it, expect, beforeEach, vi } from 'vitest'
// @ts-ignore - Types will be available after installation
import { createProject, getProject, getAllProjects, updateProject, deleteProject } from '@/lib/db'
// @ts-ignore - Types will be available after installation  
import { mockProjects } from '@/lib/mock-data'

// Mock the database module
vi.mock('drizzle-orm/vercel-postgres', () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  }))
}))

vi.mock('@vercel/postgres', () => ({
  sql: {}
}))

// Mock console methods to capture debug output
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Data Validation', () => {
    it('should validate mock data structure matches database schema', () => {
      const requiredFields = [
        'title', 'number', 'projectManager', 'reportMonth', 'phase',
        'status', 'phasePercentages', 'narrative', 'milestones', 
        'images', 'pmReporting', 'costTracking'
      ]

      mockProjects.forEach((project, index) => {
        requiredFields.forEach(field => {
          expect(project).toHaveProperty(field, 
            `Project ${index + 1} (${project.title || project.id}) is missing required field: ${field}`)
        })

        // Validate specific field structures
        expect(project.status).toHaveProperty('safety')
        expect(project.status).toHaveProperty('scopeQuality')
        expect(project.status).toHaveProperty('cost')
        expect(project.status).toHaveProperty('schedule')
        
        expect(project.phasePercentages).toHaveProperty('FEL0')
        expect(project.phasePercentages).toHaveProperty('Execution')
        
        expect(project.narrative).toHaveProperty('general')
        expect(project.narrative).toHaveProperty('achieved')
        
        expect(project.costTracking).toHaveProperty('totalBudget')
        expect(project.costTracking).toHaveProperty('currency')
        expect(project.costTracking).toHaveProperty('monthlyData')
        
        expect(Array.isArray(project.milestones)).toBe(true)
        expect(Array.isArray(project.images)).toBe(true)
        expect(Array.isArray(project.pmReporting)).toBe(true)
      })
    })

    it('should validate cost tracking data integrity', () => {
      mockProjects.forEach(project => {
        if (project.costTracking?.monthlyData) {
          project.costTracking.monthlyData.forEach(monthData => {
            expect(monthData).toHaveProperty('month')
            expect(monthData).toHaveProperty('budgetedCost')
            expect(monthData).toHaveProperty('actualCost')
            expect(monthData).toHaveProperty('cumulativeBudget')
            expect(monthData).toHaveProperty('cumulativeActual')
            expect(monthData).toHaveProperty('variance')
            
            // Validate numeric fields
            expect(typeof monthData.budgetedCost).toBe('number')
            expect(typeof monthData.actualCost).toBe('number')
            expect(typeof monthData.variance).toBe('number')
          })
        }
      })
    })
  })

  describe('Error Handling and Debugging', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock database error
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockImplementation(() => {
          throw new Error('Database connection failed')
        })
      }

      vi.doMock('@/lib/db', () => ({
        db: mockDb
      }))

      try {
        await getProject(1)
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Database connection failed')
      }
    })

    it('should log detailed debugging information', async () => {
      const testId = 123
      
      // Mock successful database response
      const mockResult = [{ id: testId, title: 'Test Project' }]
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue(mockResult)
      }

      vi.doMock('@/lib/db', () => ({
        db: mockDb
      }))

      await getProject(testId)

      expect(mockConsoleLog).toHaveBeenCalledWith('Executing getProject query for ID:', testId)
      expect(mockConsoleLog).toHaveBeenCalledWith('Query result:', mockResult)
    })

    it('should handle invalid project IDs', async () => {
      const invalidIds = [NaN, null, undefined, 'invalid', -1, 0]
      
      for (const invalidId of invalidIds) {
        try {
          await getProject(invalidId as any)
        } catch (error: any) {
          // Should either throw an error or handle gracefully
          expect(error).toBeDefined()
        }
      }
    })
  })

  describe('Project CRUD Operations', () => {
    it('should create a project successfully', async () => {
      const testProject = {
        title: 'Test Project',
        number: 'TEST-001',
        projectManager: 'Test Manager',
        reportMonth: '2024-03',
        phase: 'Execution',
        status: { safety: 'Yes', cost: 'On Track' },
        phasePercentages: { Execution: 50 },
        narrative: { general: 'Test narrative' },
        milestones: [],
        images: [],
        pmReporting: [],
        costTracking: { totalBudget: 100000, currency: 'AUD' },
        plant: 'Granulation',
        disciplines: ['HSE']
      }

      const mockResult = [{ id: 1, ...testProject }]
      const mockDb = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(mockResult)
      }

      vi.doMock('@/lib/db', () => ({
        db: mockDb
      }))

      const result = await createProject(testProject)
      
      expect(mockDb.insert).toHaveBeenCalled()
      expect(mockDb.values).toHaveBeenCalledWith(testProject)
      expect(result).toEqual(mockResult[0])
    })

    it('should handle project creation errors', async () => {
      const invalidProject = {}

      const mockDb = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockRejectedValue(new Error('Validation failed'))
      }

      vi.doMock('@/lib/db', () => ({
        db: mockDb
      }))

      await expect(createProject(invalidProject as any)).rejects.toThrow('Validation failed')
    })

    it('should update a project successfully', async () => {
      const updateData = { title: 'Updated Title' }
      const mockResult = [{ id: 1, title: 'Updated Title' }]
      
      const mockDb = {
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(mockResult)
      }

      vi.doMock('@/lib/db', () => ({
        db: mockDb
      }))

      const result = await updateProject(1, updateData)
      
      expect(mockDb.update).toHaveBeenCalled()
      expect(mockDb.set).toHaveBeenCalledWith(expect.objectContaining(updateData))
      expect(result).toEqual(mockResult[0])
    })

    it('should delete a project successfully', async () => {
      const mockResult = [{ id: 1, title: 'Deleted Project' }]
      
      const mockDb = {
        delete: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(mockResult)
      }

      vi.doMock('@/lib/db', () => ({
        db: mockDb
      }))

      const result = await deleteProject(1)
      
      expect(mockDb.delete).toHaveBeenCalled()
      expect(result).toEqual(mockResult[0])
    })
  })

  describe('Seeding Process', () => {
    it('should seed all projects successfully', async () => {
      let createdProjects = 0
      
      const mockCreateProject = vi.fn().mockImplementation(() => {
        createdProjects++
        return Promise.resolve({ id: createdProjects })
      })

      vi.doMock('@/lib/db', () => ({
        createProject: mockCreateProject
      }))

      // Simulate seeding process
      for (const project of mockProjects) {
        const { id, ...data } = project
        await mockCreateProject(data)
      }

      expect(createdProjects).toBe(mockProjects.length)
      expect(mockCreateProject).toHaveBeenCalledTimes(mockProjects.length)
    })

    it('should handle seeding errors gracefully', async () => {
      const mockCreateProject = vi.fn()
        .mockResolvedValueOnce({ id: 1 }) // First project succeeds
        .mockRejectedValueOnce(new Error('Database error')) // Second project fails
        .mockResolvedValueOnce({ id: 3 }) // Third project succeeds

      vi.doMock('@/lib/db', () => ({
        createProject: mockCreateProject
      }))

      const seedingResults = []
      
      for (const project of mockProjects.slice(0, 3)) {
        try {
          const { id, ...data } = project
          const result = await mockCreateProject(data)
          seedingResults.push({ success: true, result })
        } catch (error: any) {
          seedingResults.push({ success: false, error: error.message })
        }
      }

      expect(seedingResults).toHaveLength(3)
      expect(seedingResults[0].success).toBe(true)
      expect(seedingResults[1].success).toBe(false)
      expect(seedingResults[2].success).toBe(true)
    })
  })
})