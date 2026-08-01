import { expect, type Locator, type Page } from '@playwright/test';

export class ExpensePage {
  readonly page: Page;
  readonly amountInput: Locator;
  readonly categorySelect: Locator;
  readonly saveButton: Locator;
  readonly expensesTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.amountInput = page.getByTestId('input-amount');
    this.categorySelect = page.getByTestId('select-category');
    this.saveButton = page.getByTestId('btn-save-expense');
    this.expensesTable = page.getByTestId('table-expenses');
  }

  async enterAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption(category);
  }

  async saveExpense(): Promise<void> {
    await this.saveButton.click();
  }

  async verifyTable(expectedText?: string): Promise<void> {
    await expect(this.expensesTable).toBeVisible();
    await expect(this.expensesTable.locator('tbody tr')).not.toHaveCount(0);

    if (expectedText) {
      await expect(this.expensesTable).toContainText(expectedText);
    }
  }
}
