import { test, expect } from '@playwright/test'
import { glideTo } from './utils/mouseHelpers'

const BASE = 'https://www.poap.space'

test('Admin manages email recipients', async ({ page }) => {
  // Go to recipients admin page (general group)
  await page.goto(`${BASE}/admin/recipients`)

  // Click "Add Recipient"
  await page.waitForSelector('button:has-text("Add Recipient")')
  const addBtn = page.getByRole('button', { name: /^add recipient$/i })
  await glideTo(page, addBtn)
  await addBtn.click()

  // Fill email and select first two plants & disciplines
  await page.locator('#email-input').fill('viewer@example.com')
  await glideTo(page, page.getByText('Granulation'))
  await page.getByText('Granulation').click()
  await glideTo(page, page.getByText('Mineral Acid'))
  await page.getByText('Mineral Acid').click()
  await glideTo(page, page.getByText('HSE'))
  await page.getByText('HSE').click()
  await glideTo(page, page.getByText('Rotating'))
  await page.getByText('Rotating').click()

  // Save recipient
  const save1 = page.getByRole('button', { name: /^save$/i })
  await glideTo(page, save1)
  await save1.click()

  // Expect new row appears
  await expect(page.getByText('viewer@example.com')).toBeVisible()

  // Switch to PM Reminders tab
  const pmTab = page.getByRole('tab', { name: /pm reminders/i })
  await glideTo(page, pmTab)
  await pmTab.click()

  // Add PM recipient for specific project
  const addBtn2 = page.getByRole('button', { name: /add recipient/i })
  await glideTo(page, addBtn2)
  await addBtn2.click()
  await page.locator('#email-input').fill('pm.alerts@example.com')

  // Check first project in list (assumes at least one project exists)
  const firstProjectCheckbox = page.locator('.scroll-area input[type="checkbox"]').first()
  await glideTo(page, firstProjectCheckbox)
  await firstProjectCheckbox.check()

  // Save
  const save2 = page.getByRole('button', { name: /^save$/i })
  await glideTo(page, save2)
  await save2.click()
  await expect(page.getByText('pm.alerts@example.com')).toBeVisible()
}) 