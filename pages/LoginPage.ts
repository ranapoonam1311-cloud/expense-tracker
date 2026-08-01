// Import Playwright types only (no runtime import of the test runner itself).
// `Page` = browser tab/page under test; `Locator` = lazy reference to a DOM element.
import { type Locator, type Page } from '@playwright/test';

/**
 * LoginPage — Page Object Model (POM) for the login section of the mock UI.
 * Encapsulates locators + actions so specs stay readable and selectors live in one place.
 */
export class LoginPage {
  // Active Playwright page instance passed from the test.
  readonly page: Page;
  // Email text box — located by data-testid="input-email".
  readonly emailInput: Locator;
  // Password text box — located by data-testid="input-password".
  readonly passwordInput: Locator;
  // Login / submit button — located by data-testid="btn-login".
  readonly loginButton: Locator;
  // Validation / auth error banner — located by data-testid="msg-error".
  readonly errorMessage: Locator;

  /**
   * Stores the page and wires all login-related locators via getByTestId only.
   * @param page - Playwright Page from the test fixture
   */
  constructor(page: Page) {
    // Keep a reference for any future page-level actions.
    this.page = page;
    // Resolve email field using stable test id (preferred over CSS/XPath).
    this.emailInput = page.getByTestId('input-email');
    // Resolve password field the same way for consistency.
    this.passwordInput = page.getByTestId('input-password');
    // Resolve the primary login CTA button.
    this.loginButton = page.getByTestId('btn-login');
    // Resolve the error message element shown on failed login.
    this.errorMessage = page.getByTestId('msg-error');
  }

  /**
   * Types the given email into the email input (clears existing value first via fill).
   * @param email - Email address to enter
   */
  async enterEmail(email: string): Promise<void> {
    // fill() replaces current content and triggers input events.
    await this.emailInput.fill(email);
  }

  /**
   * Types the given password into the password input.
   * @param password - Password string to enter
   */
  async enterPassword(password: string): Promise<void> {
    // fill() is preferred over type() for speed and reliability in forms.
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the login button to submit credentials.
   */
  async clickLogin(): Promise<void> {
    // click() waits for the element to be actionable before clicking.
    await this.loginButton.click();
  }

  /**
   * High-level flow: enter email + password, then click login.
   * Specs call this instead of repeating the three steps.
   * @param email - Email address
   * @param password - Password
   */
  async login(email: string, password: string): Promise<void> {
    // Step 1 — populate email.
    await this.enterEmail(email);
    // Step 2 — populate password.
    await this.enterPassword(password);
    // Step 3 — submit the form.
    await this.clickLogin();
  }

  /**
   * Reads and returns the visible error message text.
   * @returns Trimmed error text, or empty string if missing/null
   */
  async getError(): Promise<string> {
    // textContent() may return null; optional chaining + nullish coalescing handle that.
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
