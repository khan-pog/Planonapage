import { test, expect } from '@playwright/test'
import { glideTo } from './utils/mouseHelpers'

const BASE = 'https://www.poap.space'

test('PM edits an existing project', async ({ page }) => {
  // Precondition: create project quickly
  await page.goto(`${BASE}/`)
  await page.waitForSelector('button:has-text("Add New Project")')
  await page.getByRole('button', { name: /add new project/i }).click()
  await page.locator('#project-title').fill('Demo Project Edit Flow')
  await page.locator('#project-number').fill('DP-002')
  await page.locator('#project-manager').fill('Eve Editor')
  await page.locator('#pm-email').fill('eve.editor@example.com')
  await page.getByRole('button', { name: /create project/i }).click()
  await expect(page).toHaveURL(/\/projects\/\d+$/)

  // Click Edit
  const editBtn = page.getByRole('button', { name: /^edit project$/i })
  await glideTo(page, editBtn)
  await editBtn.click()

  // Status tab – Bump FEL0 to 50 %
  const statusTab = page.getByRole('tab', { name: /status & blockers/i })
  await glideTo(page, statusTab)
  await statusTab.click()
  const fel0Slider = page.locator('#phase-fel0')
  await fel0Slider.focus()
  await page.keyboard.press('ArrowRight') // 0 -> 50

  // Cost tab – add new month
  const costTab = page.getByRole('tab', { name: /cost/i })
  await glideTo(page, costTab)
  await costTab.click()
  await page.getByRole('button', { name: /add month/i }).click()
  await page.getByPlaceholder('Budgeted Cost').last().fill('100000')
  await page.getByPlaceholder('Actual Cost').last().fill('90000')

  // Save changes
  const saveBtn = page.getByRole('button', { name: /^save changes$/i })
  await glideTo(page, saveBtn)
  await saveBtn.click()
  await expect(page).toHaveURL(/\/projects\/\d+$/)
}) 