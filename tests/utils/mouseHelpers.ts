import { Page, Locator } from '@playwright/test'

/**
 * Smoothly move the cursor to the center of the given locator.
 * @param page Playwright Page
 * @param locator Target locator
 * @param steps Number of animation steps (larger = slower)
 */
export async function glideTo(page: Page, locator: Locator, steps = 20) {
  const box = await locator.boundingBox()
  if (!box) return
  const targetX = box.x + box.width / 2
  const targetY = box.y + box.height / 2
  await page.mouse.move(targetX, targetY, { steps })
} 