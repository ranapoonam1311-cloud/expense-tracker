// Playwright test runner and soft/hard assertion helpers.
import { test, expect } from '@playwright/test';
// Mock HTML so the failure still happens on a real rendered page (screenshot useful).
import { mockHTML } from '../mock/mockHTML';

/**
 * Intentional failure suite.
 * Purpose: verify Allure / Playwright capture a screenshot when a test fails
 * (config: screenshot: 'only-on-failure').
 */
test.describe('Failure', () => {
  // Load the mock app before the failing assertion.
  test.beforeEach(async ({ page }) => {
    // Inject UI so the failure screenshot shows the Expense Tracker page, not a blank tab.
    await page.setContent(mockHTML);
  });

  // This test is supposed to FAIL — do not treat as a product bug.
  test('intentional failure for Allure screenshot', async ({ page }) => {
    // Assert a test id that does not exist in mockHTML → timeout → failure + screenshot.
    await expect(page.getByTestId('non-existent')).toBeVisible();
  });
});
