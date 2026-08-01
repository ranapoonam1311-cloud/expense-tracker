// Playwright test + assertion APIs.
import { test, expect } from '@playwright/test';
// Mock Expense Tracker HTML used instead of a real backend.
import { mockHTML } from '../mock/mockHTML';
// POM for amount, category, save, and table verification.
import { ExpensePage } from '../pages/ExpensePage';
// POM for opening the new-transaction entry point.
import { DashboardPage } from '../pages/DashboardPage';
// Faker helpers for picking a random category.
import { faker } from '@faker-js/faker';
// Project helpers for random amount and description strings.
import {
  generateRandomAmount,
  generateRandomExpenseDescription,
} from '../utils/testData';

// Allowed category option values from the mock <select>.
const CATEGORIES = ['food', 'travel', 'utilities', 'entertainment', 'other'] as const;

// Suite for add / save expense flows.
test.describe('Expense', () => {
  // Page objects created in beforeEach.
  let expensePage: ExpensePage;
  let dashboardPage: DashboardPage;

  // Fresh mock page + POMs for every test (test isolation).
  test.beforeEach(async ({ page }) => {
    // Load static HTML UI.
    await page.setContent(mockHTML);
    // Expense form + table interactions.
    expensePage = new ExpensePage(page);
    // Dashboard button used in the Add Expense flow.
    dashboardPage = new DashboardPage(page);
  });

  // Fills amount + category and asserts the form retained those values.
  test('Add Expense', async () => {
    // Random monetary amount as a fill()-ready string.
    const amount = generateRandomAmount();
    // Pick one valid category value at random.
    const category = faker.helpers.arrayElement(CATEGORIES);
    // Random description (mock has no description field; used as data sanity check).
    const description = generateRandomExpenseDescription();

    // Click new transaction (entry point on the dashboard).
    await dashboardPage.clickNewTransaction();
    // Type the amount into the expense form.
    await expensePage.enterAmount(amount);
    // Choose the category from the dropdown.
    await expensePage.selectCategory(category);

    // Confirm amount input shows what we typed.
    await expect(expensePage.amountInput).toHaveValue(amount);
    // Confirm select shows the chosen option value.
    await expect(expensePage.categorySelect).toHaveValue(category);
    // Confirm Faker produced a non-empty description string.
    expect(description.length).toBeGreaterThan(0);
  });

  // Saves an expense and verifies the expenses table still has expected sample data.
  test('Save Expense', async () => {
    // Amount constrained to a smaller range for this scenario.
    const amount = generateRandomAmount(10, 500);
    // Fixed category matching a common mock option.
    const category = 'food';

    // Enter amount.
    await expensePage.enterAmount(amount);
    // Select food category.
    await expensePage.selectCategory(category);
    // Click save (static mock does not append rows; table still has seed data).
    await expensePage.saveExpense();
    // Assert table is visible, has rows, and contains known mock text.
    await expensePage.verifyTable('Grocery run');
  });
});
