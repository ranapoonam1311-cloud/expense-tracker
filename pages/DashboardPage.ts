import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly totalSpent: Locator;
  readonly newTransactionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalSpent = page.getByTestId('text-total-spent');
    this.newTransactionButton = page.getByTestId('btn-new-transaction');
  }

  async getTotalSpent(): Promise<string> {
    return (await this.totalSpent.textContent())?.trim() ?? '';
  }

  async clickNewTransaction(): Promise<void> {
    await this.newTransactionButton.click();
  }
}
