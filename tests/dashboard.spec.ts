// Core Playwright test APIs.
import { test, expect } from '@playwright/test';
// Mock HTML fixture for the Expense Tracker UI.
import { mockHTML } from '../mock/mockHTML';
// POM for dashboard total and new-transaction button.
import { DashboardPage } from '../pages/DashboardPage';
// POM for expenses table visibility on the same page.
import { ExpensePage } from '../pages/ExpensePage';

// Suite covering dashboard summary visibility.
test.describe('Dashboard', () => {
  // POM instances recreated per test.
  let dashboardPage: DashboardPage;
  let expensePage: ExpensePage;

  // Load mock page and instantiate page objects before each case.
  test.beforeEach(async ({ page }) => {
    // Inject mock UI into the browser context.
    await page.setContent(mockHTML);
    // Dashboard actions / locators.
    dashboardPage = new DashboardPage(page);
    // Expense table locator used to confirm the lower section is present.
    expensePage = new ExpensePage(page);
  });

  // Verifies core dashboard widgets render with expected total format.
  test('Dashboard Visible', async () => {
    // Total spent text must be visible.
    await expect(dashboardPage.totalSpent).toBeVisible();
    // New transaction button must be visible.
    await expect(dashboardPage.newTransactionButton).toBeVisible();
    // Expenses table must be visible.
    await expect(expensePage.expensesTable).toBeVisible();

    // Read the displayed total via POM.
    const totalSpent = await dashboardPage.getTotalSpent();
    // Expect currency-like pattern: $1,284.50
    expect(totalSpent).toMatch(/\$[\d,]+\.\d{2}/);
  });
});
