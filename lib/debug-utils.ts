/**
 * Database Debugging and Validation Utilities
 * 
 * This module provides comprehensive debugging tools to help identify
 * and resolve database-related issues in the project management system.
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface DatabaseTestResult {
  testName: string
  passed: boolean
  error?: string
  details?: any
}

/**
 * Validates a project object against the expected database schema
 */
export function validateProjectSchema(project: any): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  // Required fields validation
  const requiredFields = [
    'title', 'number', 'projectManager', 'reportMonth', 'phase',
    'status', 'phasePercentages', 'narrative', 'milestones',
    'images', 'pmReporting', 'costTracking'
  ]

  requiredFields.forEach(field => {
    if (!project.hasOwnProperty(field)) {
      result.errors.push(`Missing required field: ${field}`)
      result.isValid = false
    } else if (project[field] === null || project[field] === undefined) {
      result.errors.push(`Field ${field} cannot be null or undefined`)
      result.isValid = false
    }
  })

  // Type validation for specific fields
  if (project.status && typeof project.status !== 'object') {
    result.errors.push('Field "status" must be an object')
    result.isValid = false
  }

  if (project.phasePercentages && typeof project.phasePercentages !== 'object') {
    result.errors.push('Field "phasePercentages" must be an object')
    result.isValid = false
  }

  if (project.narrative && typeof project.narrative !== 'object') {
    result.errors.push('Field "narrative" must be an object')
    result.isValid = false
  }

  // Array field validation
  const arrayFields = ['milestones', 'images', 'pmReporting']
  arrayFields.forEach(field => {
    if (project[field] && !Array.isArray(project[field])) {
      result.errors.push(`Field "${field}" must be an array`)
      result.isValid = false
    }
  })

  // Cost tracking validation
  if (project.costTracking) {
    const ct = project.costTracking
    
    if (typeof ct.totalBudget !== 'number' || ct.totalBudget <= 0) {
      result.errors.push('costTracking.totalBudget must be a positive number')
      result.isValid = false
    }

    if (!ct.currency || typeof ct.currency !== 'string') {
      result.errors.push('costTracking.currency must be a non-empty string')
      result.isValid = false
    }

    if (ct.monthlyData && !Array.isArray(ct.monthlyData)) {
      result.errors.push('costTracking.monthlyData must be an array')
      result.isValid = false
    } else if (ct.monthlyData) {
      ct.monthlyData.forEach((monthData: any, index: number) => {
        const requiredMonthFields = ['month', 'budgetedCost', 'actualCost', 'cumulativeBudget', 'cumulativeActual', 'variance']
        requiredMonthFields.forEach(monthField => {
          if (!monthData.hasOwnProperty(monthField)) {
            result.errors.push(`costTracking.monthlyData[${index}] missing field: ${monthField}`)
            result.isValid = false
          }
        })
      })
    }
  }

  // Status object validation
  if (project.status) {
    const requiredStatusFields = ['safety', 'scopeQuality', 'cost', 'schedule']
    requiredStatusFields.forEach(statusField => {
      if (!project.status.hasOwnProperty(statusField)) {
        result.warnings.push(`Status object missing recommended field: ${statusField}`)
      }
    })
  }

  // Phase percentages validation
  if (project.phasePercentages) {
    const expectedPhases = ['FEL0', 'FEL2', 'FEL3', 'Pre-Execution', 'Execution', 'Close-Out']
    expectedPhases.forEach(phase => {
      if (!project.phasePercentages.hasOwnProperty(phase)) {
        result.warnings.push(`Phase percentages missing phase: ${phase}`)
      } else if (typeof project.phasePercentages[phase] !== 'number') {
        result.errors.push(`Phase percentage for ${phase} must be a number`)
        result.isValid = false
      } else if (project.phasePercentages[phase] < 0 || project.phasePercentages[phase] > 100) {
        result.errors.push(`Phase percentage for ${phase} must be between 0 and 100`)
        result.isValid = false
      }
    })
  }

  return result
}

/**
 * Validates all mock projects for seeding
 */
export function validateMockProjects(mockProjects: any[]): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  if (!Array.isArray(mockProjects)) {
    result.errors.push('Mock projects must be an array')
    result.isValid = false
    return result
  }

  mockProjects.forEach((project, index) => {
    const projectValidation = validateProjectSchema(project)
    
    if (!projectValidation.isValid) {
      result.isValid = false
      projectValidation.errors.forEach(error => {
        result.errors.push(`Project ${index + 1} (${project.title || project.id || 'Unknown'}): ${error}`)
      })
    }

    projectValidation.warnings.forEach(warning => {
      result.warnings.push(`Project ${index + 1} (${project.title || project.id || 'Unknown'}): ${warning}`)
    })
  })

  return result
}

/**
 * Tests database connection and basic operations
 */
export async function testDatabaseConnection(): Promise<DatabaseTestResult[]> {
  const results: DatabaseTestResult[] = []

  // Test environment variables
  results.push({
    testName: 'Environment Variables',
    passed: !!process.env.POSTGRES_URL,
    error: process.env.POSTGRES_URL ? undefined : 'POSTGRES_URL environment variable is not set',
    details: {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      nodeEnv: process.env.NODE_ENV
    }
  })

  // Test database module import
  try {
    const dbModule = await import('./db')
    results.push({
      testName: 'Database Module Import',
      passed: true,
      details: {
        availableFunctions: Object.keys(dbModule)
      }
    })
  } catch (error: any) {
    results.push({
      testName: 'Database Module Import',
      passed: false,
      error: error.message,
      details: { error: error.stack }
    })
  }

  // Test mock data import and validation
  try {
    const { mockProjects } = await import('./mock-data')
    const validation = validateMockProjects(mockProjects)
    
    results.push({
      testName: 'Mock Data Validation',
      passed: validation.isValid,
      error: validation.errors.length > 0 ? validation.errors.join('; ') : undefined,
      details: {
        projectCount: mockProjects.length,
        errors: validation.errors,
        warnings: validation.warnings,
        projects: mockProjects.map((p, i) => ({
          index: i,
          title: p.title,
          number: p.number,
          hasAllRequiredFields: validateProjectSchema(p).isValid
        }))
      }
    })
  } catch (error: any) {
    results.push({
      testName: 'Mock Data Import',
      passed: false,
      error: error.message,
      details: { error: error.stack }
    })
  }

  return results
}

/**
 * Tests seeding process without actually seeding
 */
export async function testSeedingProcess(dryRun: boolean = true): Promise<DatabaseTestResult[]> {
  const results: DatabaseTestResult[] = []

  try {
    const { mockProjects } = await import('./mock-data')
    const { createProject } = await import('./db')

    // Validate each project before seeding
    for (let i = 0; i < mockProjects.length; i++) {
      const project = mockProjects[i]
      const { id, ...projectData } = project
      
      const validation = validateProjectSchema(projectData)
      
      if (dryRun) {
        results.push({
          testName: `Seed Validation - Project ${i + 1}`,
          passed: validation.isValid,
          error: validation.errors.length > 0 ? validation.errors.join('; ') : undefined,
          details: {
            project: {
              title: project.title,
              number: project.number,
              id: project.id
            },
            validation,
            wouldSeed: validation.isValid
          }
        })
      } else {
        // Actually attempt to seed
        try {
          if (validation.isValid) {
            const result = await createProject(projectData)
            results.push({
              testName: `Seed Project ${i + 1}`,
              passed: true,
              details: {
                project: {
                  title: project.title,
                  number: project.number,
                  originalId: project.id,
                  newId: result.id
                }
              }
            })
          } else {
            results.push({
              testName: `Seed Project ${i + 1}`,
              passed: false,
              error: `Validation failed: ${validation.errors.join('; ')}`,
              details: { project, validation }
            })
          }
        } catch (error: any) {
          results.push({
            testName: `Seed Project ${i + 1}`,
            passed: false,
            error: error.message,
            details: { project, error: error.stack }
          })
        }
      }
    }
  } catch (error: any) {
    results.push({
      testName: 'Seeding Process Setup',
      passed: false,
      error: error.message,
      details: { error: error.stack }
    })
  }

  return results
}

/**
 * Generates a comprehensive diagnostic report
 */
export async function generateDiagnosticReport(): Promise<string> {
  const timestamp = new Date().toISOString()
  let report = `# Database Diagnostic Report\n`
  report += `Generated: ${timestamp}\n\n`

  // Test database connection
  report += `## Database Connection Tests\n\n`
  const connectionTests = await testDatabaseConnection()
  connectionTests.forEach(test => {
    const status = test.passed ? '✅ PASS' : '❌ FAIL'
    report += `### ${test.testName} - ${status}\n`
    if (test.error) {
      report += `**Error:** ${test.error}\n\n`
    }
    if (test.details) {
      report += `**Details:**\n\`\`\`json\n${JSON.stringify(test.details, null, 2)}\n\`\`\`\n\n`
    }
  })

  // Test seeding process (dry run)
  report += `## Seeding Process Tests (Dry Run)\n\n`
  const seedingTests = await testSeedingProcess(true)
  seedingTests.forEach(test => {
    const status = test.passed ? '✅ PASS' : '❌ FAIL'
    report += `### ${test.testName} - ${status}\n`
    if (test.error) {
      report += `**Error:** ${test.error}\n\n`
    }
    if (test.details) {
      report += `**Details:**\n\`\`\`json\n${JSON.stringify(test.details, null, 2)}\n\`\`\`\n\n`
    }
  })

  // Summary
  const allTests = [...connectionTests, ...seedingTests]
  const passedTests = allTests.filter(t => t.passed).length
  const totalTests = allTests.length
  
  report += `## Summary\n\n`
  report += `- **Total Tests:** ${totalTests}\n`
  report += `- **Passed:** ${passedTests}\n`
  report += `- **Failed:** ${totalTests - passedTests}\n`
  report += `- **Success Rate:** ${((passedTests / totalTests) * 100).toFixed(1)}%\n\n`

  if (passedTests < totalTests) {
    report += `## Recommendations\n\n`
    
    const failedTests = allTests.filter(t => !t.passed)
    failedTests.forEach(test => {
      report += `### Fix: ${test.testName}\n`
      report += `**Issue:** ${test.error}\n`
      
      // Provide specific recommendations based on test name
      if (test.testName.includes('Environment Variables')) {
        report += `**Solution:** Set the POSTGRES_URL environment variable in your .env.local file.\n\n`
      } else if (test.testName.includes('Mock Data')) {
        report += `**Solution:** Fix the mock data structure to match the database schema. Check the validation errors above.\n\n`
      } else if (test.testName.includes('Seed')) {
        report += `**Solution:** Fix the project data structure before attempting to seed. Refer to the validation errors.\n\n`
      } else {
        report += `**Solution:** Check the error details and stack trace for more information.\n\n`
      }
    })
  }

  return report
}

/**
 * Console logger with color coding
 */
export const logger = {
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string) => console.log(`❌ ${message}`),
  warning: (message: string) => console.log(`⚠️  ${message}`),
  info: (message: string) => console.log(`ℹ️  ${message}`),
  debug: (message: string) => console.log(`🐛 ${message}`)
}