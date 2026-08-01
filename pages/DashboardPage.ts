// Import Playwright types for the page object.
import { type Locator, type Page } from '@playwright/test';

/**
 * DashboardPage — POM for the dashboard summary section.
 * Handles total spent display and the "New transaction" action.
 */
export class DashboardPage {
  // Playwright page shared with other page objects in the same test.
  readonly page: Page;
  // Element showing total amount spent — data-testid="text-total-spent".
  readonly totalSpent: Locator;
  // Button that starts adding a new expense — data-testid="btn-new-transaction".
  readonly newTransactionButton: Locator;

  /**
   * Initializes dashboard locators using getByTestId only.
   * @param page - Playwright Page from the test fixture
   */
  constructor(page: Page) {
    // Store page reference for consistency with other POMs.
    this.page = page;
    // Bind locator to the total-spent text node.
    this.totalSpent = page.getByTestId('text-total-spent');
    // Bind locator to the new-transaction button.
    this.newTransactionButton = page.getByTestId('btn-new-transaction');
  }

  /**
   * Reads the total spent text currently shown on the dashboard.
   * @returns Trimmed total string (e.g. "$1,284.50"), or '' if absent
   */
  async getTotalSpent(): Promise<string> {
    // Fetch raw text, trim whitespace, fall back to empty string.
    return (await this.totalSpent.textContent())?.trim() ?? '';
  }

  /**
   * Clicks "New transaction" to open / focus the add-expense flow.
   */
  async clickNewTransaction(): Promise<void> {
    // Wait until clickable, then click.
    await this.newTransactionButton.click();
  }
}
