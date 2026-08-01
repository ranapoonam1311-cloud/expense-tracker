import { test, expect } from '@playwright/test';
import { mockHTML } from '../mock/mockHTML';
import { DashboardPage } from '../pages/DashboardPage';
import { ExpensePage } from '../pages/ExpensePage';

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage;
  let expensePage: ExpensePage;

  test.beforeEach(async ({ page }) => {
    await page.setContent(mockHTML);
    dashboardPage = new DashboardPage(page);
    expensePage = new ExpensePage(page);
  });

  test('Dashboard Visible', async () => {
    await expect(dashboardPage.totalSpent).toBeVisible();
    await expect(dashboardPage.newTransactionButton).toBeVisible();
    await expect(expensePage.expensesTable).toBeVisible();

    const totalSpent = await dashboardPage.getTotalSpent();
    expect(totalSpent).toMatch(/\$[\d,]+\.\d{2}/);
  });
});
