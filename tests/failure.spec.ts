import { test, expect } from '@playwright/test';
import { mockHTML } from '../mock/mockHTML';

test.describe('Failure', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(mockHTML);
  });

  test('intentional failure for Allure screenshot', async ({ page }) => {
    await expect(page.getByTestId('non-existent')).toBeVisible();
  });
});
