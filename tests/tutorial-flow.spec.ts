import { test, expect } from '@playwright/test'

// Happy-path demo: PM creates & edits a project, then a viewer browses it.
// Playwright records video (configured in playwright.config.ts).

test('PM flow and Viewer flow', async ({ browser }) => {
  /* ---------- PM CREATES PROJECT ---------- */
  const pm = await browser.newContext()
  const pmPage = await pm.newPage()

  await pmPage.goto('/')
  await pmPage.getByRole('button', { name: /new project/i }).click()

  // Basic Info
  await pmPage.locator('#project-title').fill('Ammonia Plant Upgrade')
  await pmPage.locator('#project-number').fill('AP-001')
  await pmPage.locator('#project-manager').fill('Jane Smith')
  await pmPage.locator('#pm-email').fill('jane.smith@example.com')
  await pmPage.getByText('Current Phase').click()
  await pmPage.getByRole('option', { name: 'FEL2' }).click()

  // Status tab
  await pmPage.getByRole('tab', { name: /status & blockers/i }).click()
  const slider = pmPage.locator('#phase-fel2')
  await slider.focus()
  await pmPage.keyboard.press('ArrowRight') // sets to 50%

  // Cost tab – budget & first month data
  await pmPage.getByRole('tab', { name: /cost/i }).click()
  await pmPage.locator('#total-budget').fill('2700000')
  await pmPage.getByRole('button', { name: /add first month/i }).click()
  await pmPage.getByPlaceholder('Budgeted Cost').fill('200000')
  await pmPage.getByPlaceholder('Actual Cost').fill('220000')

  // Narratives tab – description
  await pmPage.getByRole('tab', { name: /narratives/i }).click()
  await pmPage.getByPlaceholder('Add project description...').fill('Upgrade ammonia synthesis loop for +10% capacity.')

  // Milestones tab – one milestone + image upload
  await pmPage.getByRole('tab', { name: /milestones/i }).click()
  await pmPage.getByRole('button', { name: /add milestone/i }).click()
  await pmPage.getByPlaceholder('Milestone').fill('Mechanical Completion')
  await pmPage.getByPlaceholder('Date').fill('2025-06-30')
  // Skip image upload if no file; comment below line if not needed
  // await pmPage.setInputFiles('input[type=file]', 'tests/assets/progress.jpg')

  // Create project
  await pmPage.getByRole('button', { name: /create project/i }).click()
  await expect(pmPage).toHaveURL(/\/projects\/\d+$/)

  /* ---------- VIEWER BROWSES PROJECT ---------- */
  const viewer = await browser.newContext()
  const vPage = await viewer.newPage()

  await vPage.goto('/')
  await vPage.getByText('Ammonia Plant Upgrade').click()

  // Verify Overview content is visible
  await expect(vPage.getByText('Project Description')).toBeVisible()
  await expect(vPage.getByText('Status')).toBeVisible()

  // Details tab
  await vPage.getByRole('tab', { name: /narratives & milestones/i }).click()
  await expect(vPage.getByText('Achieved This Month')).toBeVisible()

  // Cost tab
  await vPage.getByRole('tab', { name: /cost/i }).click()
  await expect(vPage.getByText('Forecast at Completion')).toBeVisible()
}) 