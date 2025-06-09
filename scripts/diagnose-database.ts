#!/usr/bin/env tsx

/**
 * Database Diagnostic Script
 * 
 * This script runs comprehensive tests on the database setup, mock data,
 * and seeding process to identify any issues that need to be resolved.
 * 
 * Usage:
 *   npx tsx scripts/diagnose-database.ts
 *   npm run diagnose (if added to package.json scripts)
 */

import { generateDiagnosticReport, logger } from '../lib/debug-utils'
import fs from 'fs'
import path from 'path'

async function main() {
  console.log('🔍 Starting comprehensive database diagnostic...\n')
  
  try {
    // Generate the diagnostic report
    const report = await generateDiagnosticReport()
    
    // Save report to file
    const reportPath = path.join(process.cwd(), 'DATABASE_DIAGNOSTIC_REPORT.md')
    fs.writeFileSync(reportPath, report)
    
    logger.success(`Diagnostic report saved to: ${reportPath}`)
    
    // Also output to console
    console.log('\n' + '='.repeat(80))
    console.log('DIAGNOSTIC REPORT')
    console.log('='.repeat(80))
    console.log(report)
    
  } catch (error: any) {
    logger.error(`Failed to generate diagnostic report: ${error.message}`)
    console.error(error.stack)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}