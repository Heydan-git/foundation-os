import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const STORIES = [
  { id: 'primitives-button--default', name: 'Button' },
  { id: 'primitives-text--default', name: 'Text' },
  { id: 'primitives-icon--default', name: 'Icon' },
  { id: 'primitives-input--default', name: 'Input' },
  { id: 'primitives-card--default', name: 'Card' },
]

for (const story of STORIES) {
  test.describe(story.name, () => {
    test(`visual snapshot`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(`${story.name}.png`, {
        maxDiffPixelRatio: 0.01,
      })
    })

    test(`axe accessibility`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)
      await page.waitForLoadState('networkidle')
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      expect(results.violations).toEqual([])
    })
  })
}
