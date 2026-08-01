// expect is used inside verifyTable for assertions owned by this page object.
import { expect, type Locator, type Page } from '@playwright/test';

/**
 * ExpensePage — POM for adding expenses and verifying the expenses table.
 */
export class ExpensePage {
  // Playwright page instance for this UI area.
  readonly page: Page;
  // Amount number input — data-testid="input-amount".
  readonly amountInput: Locator;
  // Category dropdown — data-testid="select-category".
  readonly categorySelect: Locator;
  // Save / submit expense button — data-testid="btn-save-expense".
  readonly saveButton: Locator;
  // Expenses history table — data-testid="table-expenses".
  readonly expensesTable: Locator;

  /**
   * Wires all expense-related locators via getByTestId.
   * @param page - Playwright Page from the test fixture
   */
  constructor(page: Page) {
    // Keep page for any future navigation or waits.
    this.page = page;
    // Amount field used when creating an expense.
    this.amountInput = page.getByTestId('input-amount');
    // Category <select> with option values like food, travel, etc.
    this.categorySelect = page.getByTestId('select-category');
    // Primary save action for the expense form.
    this.saveButton = page.getByTestId('btn-save-expense');
    // Table listing existing / sample expenses.
    this.expensesTable = page.getByTestId('table-expenses');
  }

  /**
   * Enters the expense amount into the amount field.
   * @param amount - Amount as string (e.g. "42.75") for fill()
   */
  async enterAmount(amount: string): Promise<void> {
    // fill() clears then types the amount value.
    await this.amountInput.fill(amount);
  }

  /**
   * Selects a category option by its value attribute.
   * @param category - Option value (food | travel | utilities | entertainment | other)
   */
  async selectCategory(category: string): Promise<void> {
    // selectOption() works on <select> elements by value or label.
    await this.categorySelect.selectOption(category);
  }

  /**
   * Clicks the save expense button.
   */
  async saveExpense(): Promise<void> {
    // Submit the add-expense form.
    await this.saveButton.click();
  }

  /**
   * Asserts the expenses table is visible, has rows, and optionally contains text.
   * @param expectedText - Optional substring that must appear in the table
   */
  async verifyTable(expectedText?: string): Promise<void> {
    // Table itself must be on screen.
    await expect(this.expensesTable).toBeVisible();
    // At least one data row should exist under tbody.
    await expect(this.expensesTable.locator('tbody tr')).not.toHaveCount(0);

    // If the caller passed expected text, assert it is present in the table.
    if (expectedText) {
      await expect(this.expensesTable).toContainText(expectedText);
    }
  }
}
