import { test, expect } from '@playwright/test'
import { glideTo } from './utils/mouseHelpers'

const BASE = 'https://www.poap.space'

test('PM creates a new project', async ({ page }) => {
  await page.goto(`${BASE}/`)
  await page.waitForSelector('button:has-text("Add New Project")')
  const newBtn = page.getByRole('button', { name: /add new project/i })
  await glideTo(page, newBtn)
  await newBtn.click()
  await page.waitForTimeout(300)

  // Basic Info
  await page.locator('#project-title').click()
  await page.keyboard.type('Demo Project Create Flow', { delay: 50 })
  await page.locator('#project-number').click()
  await page.keyboard.type('DP-001', { delay: 50 })
  await page.locator('#project-manager').click()
  await page.keyboard.type('Alice Creator', { delay: 50 })
  await page.locator('#pm-email').click()
  await page.keyboard.type('alice.creator@example.com', { delay: 50 })
  await page.waitForTimeout(300)
  const phaseSelect = page.getByText('Current Phase')
  await glideTo(page, phaseSelect)
  await phaseSelect.click()
  const fel0Option = page.getByRole('option', { name: 'FEL0' })
  await glideTo(page, fel0Option)
  await fel0Option.click()

  // Narratives tab – description (quick)
  const narrativesTab = page.getByRole('tab', { name: /narratives/i })
  await glideTo(page, narrativesTab)
  await narrativesTab.click()
  await page.waitForTimeout(300)
  await page.getByPlaceholder('Add project description...').click()
  await page.keyboard.type('Initial setup for demo.', { delay: 40 })

  // Create
  const createBtn = page.getByRole('button', { name: /^create project$/i })
  await glideTo(page, createBtn)
  await createBtn.click()
  await expect(page).toHaveURL(/\/projects\/\d+$/)
}) 