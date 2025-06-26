import { test, expect } from '@playwright/test'
import { glideTo } from './utils/mouseHelpers'

const BASE = 'https://www.poap.space'

test('Report viewer opens project and browses tabs', async ({ browser }) => {
  // Setup: PM creates a project quickly so viewer has something to look at.
  const pmCtx = await browser.newContext()
  const pm = await pmCtx.newPage()
  await pm.goto(BASE)
  const newBtn = pm.getByRole('button', { name: /add new project/i })
  await glideTo(pm, newBtn)
  await newBtn.click()
  await pm.locator('#project-title').fill('Viewer Demo Project')
  await pm.locator('#project-number').fill('VD-001')
  await pm.getByRole('button', { name: /create project/i }).click()
  const projectUrl = pm.url()

  // Viewer flow
  const viewerCtx = await browser.newContext()
  const viewer = await viewerCtx.newPage()

  await viewer.goto(projectUrl)
  await expect(viewer.getByText('Project Description')).toBeVisible()
  await viewer.getByRole('tab', { name: /narratives & milestones/i }).click()
  await viewer.getByRole('tab', { name: /cost/i }).click()
}) 