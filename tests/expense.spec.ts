import { test, expect } from '@playwright/test';
import { mockHTML } from '../mock/mockHTML';
import { ExpensePage } from '../pages/ExpensePage';
import { DashboardPage } from '../pages/DashboardPage';
import { faker } from '@faker-js/faker';
import {
  generateRandomAmount,
  generateRandomExpenseDescription,
} from '../utils/testData';

const CATEGORIES = ['food', 'travel', 'utilities', 'entertainment', 'other'] as const;

test.describe('Expense', () => {
  let expensePage: ExpensePage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.setContent(mockHTML);
    expensePage = new ExpensePage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('Add Expense', async () => {
    const amount = generateRandomAmount();
    const category = faker.helpers.arrayElement(CATEGORIES);
    const description = generateRandomExpenseDescription();

    await dashboardPage.clickNewTransaction();
    await expensePage.enterAmount(amount);
    await expensePage.selectCategory(category);

    await expect(expensePage.amountInput).toHaveValue(amount);
    await expect(expensePage.categorySelect).toHaveValue(category);
    expect(description.length).toBeGreaterThan(0);
  });

  test('Save Expense', async () => {
    const amount = generateRandomAmount(10, 500);
    const category = 'food';

    await expensePage.enterAmount(amount);
    await expensePage.selectCategory(category);
    await expensePage.saveExpense();
    await expensePage.verifyTable('Grocery run');
  });
});
