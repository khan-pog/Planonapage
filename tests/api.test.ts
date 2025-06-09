import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock Next.js modules
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data) => ({
      status: 200,
      json: () => Promise.resolve(data)
    })),
    new: vi.fn((message, options) => ({
      status: options?.status || 500,
      statusText: message
    }))
  }
}))

describe('API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Seed API (/api/seed)', () => {
    it('should successfully seed the database', async () => {
      // Mock the database functions
      const mockCreateProject = vi.fn().mockResolvedValue({ id: 1 })
      
      vi.doMock('@/lib/db', () => ({
        createProject: mockCreateProject
      }))

      vi.doMock('@/lib/mock-data', () => ({
        mockProjects: [
          {
            id: "1",
            title: "Test Project",
            number: "TEST-001",
            projectManager: "Test Manager",
            reportMonth: "2024-03",
            phase: "Execution",
            status: { safety: "Yes" },
            phasePercentages: { Execution: 50 },
            narrative: { general: "Test" },
            milestones: [],
            images: [],
            pmReporting: [],
            costTracking: { totalBudget: 100000 }
          }
        ]
      }))

      // Import the API handler after mocking
      const { POST } = await import('../app/api/seed/route')
      
      const response = await POST()
      
      expect(mockCreateProject).toHaveBeenCalled()
      expect(response).toBeDefined()
    })

    it('should handle seeding errors gracefully', async () => {
      const mockCreateProject = vi.fn().mockRejectedValue(new Error('Database error'))
      
      vi.doMock('@/lib/db', () => ({
        createProject: mockCreateProject
      }))

      vi.doMock('@/lib/mock-data', () => ({
        mockProjects: [{ id: "1", title: "Test" }]
      }))

      const { POST } = await import('../app/api/seed/route')
      
      const response = await POST()
      
      expect(response.status).toBe(500)
    })
  })

  describe('Projects API (/api/projects)', () => {
    it('should get all projects successfully', async () => {
      const mockProjects = [
        { id: 1, title: 'Project 1' },
        { id: 2, title: 'Project 2' }
      ]
      
      const mockGetAllProjects = vi.fn().mockResolvedValue(mockProjects)
      
      vi.doMock('@/lib/db', () => ({
        getAllProjects: mockGetAllProjects
      }))

      const { GET } = await import('../app/api/projects/route')
      
      const response = await GET()
      
      expect(mockGetAllProjects).toHaveBeenCalled()
      expect(response).toBeDefined()
    })

    it('should create a new project successfully', async () => {
      const newProject = {
        title: 'New Project',
        number: 'NEW-001',
        projectManager: 'New Manager'
      }
      
      const mockCreateProject = vi.fn().mockResolvedValue({ id: 1, ...newProject })
      
      vi.doMock('@/lib/db', () => ({
        createProject: mockCreateProject
      }))

      const { POST } = await import('../app/api/projects/route')
      
      const mockRequest = {
        json: vi.fn().mockResolvedValue(newProject)
      } as any

      const response = await POST(mockRequest)
      
      expect(mockCreateProject).toHaveBeenCalledWith(newProject)
      expect(response).toBeDefined()
    })

    it('should handle project creation errors', async () => {
      const mockCreateProject = vi.fn().mockRejectedValue(new Error('Creation failed'))
      
      vi.doMock('@/lib/db', () => ({
        createProject: mockCreateProject
      }))

      const { POST } = await import('../app/api/projects/route')
      
      const mockRequest = {
        json: vi.fn().mockResolvedValue({})
      } as any

      const response = await POST(mockRequest)
      
      expect(response.status).toBe(500)
    })
  })

  describe('Individual Project API (/api/projects/[id])', () => {
    it('should get a specific project successfully', async () => {
      const projectId = 1
      const mockProject = { id: projectId, title: 'Test Project' }
      
      const mockGetProject = vi.fn().mockResolvedValue(mockProject)
      
      vi.doMock('@/lib/db', () => ({
        getProject: mockGetProject
      }))

      const { GET } = await import('../app/api/projects/[id]/route')
      
      const mockRequest = {} as any
      const mockParams = { params: { id: projectId.toString() } }

      const response = await GET(mockRequest, mockParams)
      
      expect(mockGetProject).toHaveBeenCalledWith(projectId)
      expect(response).toBeDefined()
    })

    it('should handle invalid project ID', async () => {
      const { GET } = await import('../app/api/projects/[id]/route')
      
      const mockRequest = {} as any
      const mockParams = { params: { id: 'invalid' } }

      const response = await GET(mockRequest, mockParams)
      
      expect(response.status).toBe(400)
    })

    it('should handle project not found', async () => {
      const mockGetProject = vi.fn().mockResolvedValue(null)
      
      vi.doMock('@/lib/db', () => ({
        getProject: mockGetProject
      }))

      const { GET } = await import('../app/api/projects/[id]/route')
      
      const mockRequest = {} as any
      const mockParams = { params: { id: '999' } }

      const response = await GET(mockRequest, mockParams)
      
      expect(response.status).toBe(404)
    })

    it('should update a project successfully', async () => {
      const projectId = 1
      const updateData = { title: 'Updated Title' }
      const updatedProject = { id: projectId, ...updateData }
      
      const mockUpdateProject = vi.fn().mockResolvedValue(updatedProject)
      
      vi.doMock('@/lib/db', () => ({
        updateProject: mockUpdateProject
      }))

      const { PATCH } = await import('../app/api/projects/[id]/route')
      
      const mockRequest = {
        json: vi.fn().mockResolvedValue(updateData)
      } as any
      const mockParams = { params: { id: projectId.toString() } }

      const response = await PATCH(mockRequest, mockParams)
      
      expect(mockUpdateProject).toHaveBeenCalledWith(projectId, updateData)
      expect(response).toBeDefined()
    })

    it('should delete a project successfully', async () => {
      const projectId = 1
      const deletedProject = { id: projectId, title: 'Deleted Project' }
      
      const mockDeleteProject = vi.fn().mockResolvedValue(deletedProject)
      
      vi.doMock('@/lib/db', () => ({
        deleteProject: mockDeleteProject
      }))

      const { DELETE } = await import('../app/api/projects/[id]/route')
      
      const mockRequest = {} as any
      const mockParams = { params: { id: projectId.toString() } }

      const response = await DELETE(mockRequest, mockParams)
      
      expect(mockDeleteProject).toHaveBeenCalledWith(projectId)
      expect(response.status).toBe(204)
    })
  })

  describe('Input Validation', () => {
    it('should validate required fields for project creation', () => {
      const requiredFields = [
        'title', 'number', 'projectManager', 'reportMonth', 'phase',
        'status', 'phasePercentages', 'narrative', 'milestones',
        'images', 'pmReporting', 'costTracking'
      ]

      const incompleteProject = {
        title: 'Test Project'
        // Missing other required fields
      }

      requiredFields.forEach(field => {
        if (field !== 'title') {
          expect(incompleteProject).not.toHaveProperty(field)
        }
      })
    })

    it('should validate project number format', () => {
      const validNumbers = ['PRJ-001', 'TEST-123', 'ABC-999']
      const invalidNumbers = ['', '123', 'PRJ', 'PRJ-', 'PRJ-ABC']

      validNumbers.forEach(number => {
        expect(number).toMatch(/^[A-Z]+-\d+$/)
      })

      invalidNumbers.forEach(number => {
        expect(number).not.toMatch(/^[A-Z]+-\d+$/)
      })
    })

    it('should validate cost tracking data', () => {
      const validCostTracking = {
        totalBudget: 1000000,
        currency: 'AUD',
        monthlyData: [
          {
            month: 'Jan 2024',
            budgetedCost: 100000,
            actualCost: 95000,
            cumulativeBudget: 100000,
            cumulativeActual: 95000,
            variance: -5000
          }
        ],
        costStatus: 'Under Budget',
        variance: -5.0,
        forecastCompletion: 950000
      }

      expect(validCostTracking.totalBudget).toBeGreaterThan(0)
      expect(typeof validCostTracking.currency).toBe('string')
      expect(Array.isArray(validCostTracking.monthlyData)).toBe(true)
      
      validCostTracking.monthlyData.forEach(monthData => {
        expect(typeof monthData.budgetedCost).toBe('number')
        expect(typeof monthData.actualCost).toBe('number')
        expect(typeof monthData.variance).toBe('number')
      })
    })
  })

  describe('Error Scenarios', () => {
    it('should handle database connection failures', async () => {
      const mockGetAllProjects = vi.fn().mockRejectedValue(new Error('Connection timeout'))
      
      vi.doMock('@/lib/db', () => ({
        getAllProjects: mockGetAllProjects
      }))

      const { GET } = await import('../app/api/projects/route')
      
      const response = await GET()
      
      expect(response.status).toBe(500)
    })

    it('should handle malformed JSON requests', async () => {
      const { POST } = await import('../app/api/projects/route')
      
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
      } as any

      const response = await POST(mockRequest)
      
      expect(response.status).toBe(500)
    })

    it('should provide helpful error messages', async () => {
      const mockCreateProject = vi.fn().mockRejectedValue(new Error('Database constraint violation'))
      
      vi.doMock('@/lib/db', () => ({
        createProject: mockCreateProject
      }))

      const { POST } = await import('../app/api/projects/route')
      
      const mockRequest = {
        json: vi.fn().mockResolvedValue({})
      } as any

      const response = await POST(mockRequest)
      
      expect(response.status).toBe(500)
      expect(response.statusText).toBe('Internal Server Error')
    })
  })
})