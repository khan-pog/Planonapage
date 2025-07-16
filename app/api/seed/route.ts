import { NextResponse } from "next/server"
import { createProject } from "@/lib/db"
import { mockProjects } from "@/lib/mock-data"
import { validateProjectSchema, logger } from "@/lib/debug-utils"
import { normalizeProjectData } from "@/lib/utils"

export async function POST() {
  logger.info("Starting database seeding process...")
  
  const seedingResults = {
    totalProjects: mockProjects.length,
    seeded: 0,
    failed: 0,
    errors: [] as string[],
    details: [] as any[]
  }

  try {
    // Validate all projects first
    logger.info("Validating mock projects before seeding...")
    
    for (let i = 0; i < mockProjects.length; i++) {
      const project = normalizeProjectData(mockProjects[i] as any)
      const { id, ...projectData } = project
      
      logger.debug(`Validating project ${i + 1}: ${project.title || project.id}`)
      
      const validation = validateProjectSchema(projectData)
      
      if (!validation.isValid) {
        const errorMessage = `Project ${i + 1} (${project.title || project.id}) validation failed: ${validation.errors.join(', ')}`
        logger.error(errorMessage)
        seedingResults.failed++
        seedingResults.errors.push(errorMessage)
        seedingResults.details.push({
          projectIndex: i + 1,
          project: {
            id: project.id,
            title: project.title,
            number: project.number
          },
          status: 'validation_failed',
          errors: validation.errors,
          warnings: validation.warnings
        })
        continue
      }

      // Attempt to seed the project
      try {
        logger.debug(`Seeding project ${i + 1}: ${project.title}`)
        const result = await createProject(projectData)
        
        logger.success(`Successfully seeded project: ${project.title} (New ID: ${result.id})`)
        seedingResults.seeded++
        seedingResults.details.push({
          projectIndex: i + 1,
          project: {
            originalId: project.id,
            title: project.title,
            number: project.number,
            newId: result.id
          },
          status: 'seeded',
          validation: validation
        })
        
      } catch (seedError: any) {
        const errorMessage = `Failed to seed project ${i + 1} (${project.title}): ${seedError.message}`
        logger.error(errorMessage)
        seedingResults.failed++
        seedingResults.errors.push(errorMessage)
        seedingResults.details.push({
          projectIndex: i + 1,
          project: {
            id: project.id,
            title: project.title,
            number: project.number
          },
          status: 'seed_failed',
          error: seedError.message,
          stack: seedError.stack
        })
      }
    }

    // Generate summary
    const successRate = ((seedingResults.seeded / seedingResults.totalProjects) * 100).toFixed(1)
    
    if (seedingResults.failed === 0) {
      logger.success(`🎉 Database seeding completed successfully! All ${seedingResults.seeded} projects were seeded.`)
      
      return NextResponse.json({
        success: true,
        message: `Database seeded successfully! ${seedingResults.seeded} projects added.`,
        results: seedingResults
      })
    } else {
      logger.warning(`⚠️ Database seeding completed with issues. ${seedingResults.seeded} succeeded, ${seedingResults.failed} failed.`)
      
      return NextResponse.json({
        success: false,
        message: `Partial seeding completed. ${seedingResults.seeded} projects seeded, ${seedingResults.failed} failed.`,
        results: seedingResults
      }, { status: 207 }) // 207 Multi-Status
    }
    
  } catch (error: any) {
    logger.error(`Critical error during seeding process: ${error.message}`)
    console.error("Critical seeding error:", error)
    
    return NextResponse.json({
      success: false,
      message: "Critical error during seeding process",
      error: error.message,
      results: seedingResults
    }, { status: 500 })
  }
}

// GET endpoint for debugging - returns validation results without seeding
export async function GET() {
  try {
    logger.info("Running seeding validation check...")
    
    const validationResults = {
      totalProjects: mockProjects.length,
      validProjects: 0,
      invalidProjects: 0,
      projects: [] as any[]
    }

    for (let i = 0; i < mockProjects.length; i++) {
      const project = mockProjects[i]
      const { id, ...projectData } = project
      
      const validation = validateProjectSchema(projectData)
      
      const projectResult = {
        index: i + 1,
        project: {
          id: project.id,
          title: project.title,
          number: project.number,
          projectManager: project.projectManager
        },
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings
      }

      validationResults.projects.push(projectResult)
      
      if (validation.isValid) {
        validationResults.validProjects++
      } else {
        validationResults.invalidProjects++
      }
    }

    return NextResponse.json({
      message: "Seeding validation check completed",
      readyToSeed: validationResults.invalidProjects === 0,
      results: validationResults
    })
    
  } catch (error: any) {
    logger.error(`Error during validation check: ${error.message}`)
    
    return NextResponse.json({
      success: false,
      message: "Error during validation check",
      error: error.message
    }, { status: 500 })
  }
} 