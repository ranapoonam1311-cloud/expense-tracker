// Playwright test runner APIs: test (suite/cases) and expect (assertions).
import { test, expect } from '@playwright/test';
// Mock Expense Tracker HTML string injected into the browser (no live server).
import { mockHTML } from '../mock/mockHTML';
// POM for login form actions and error reading.
import { LoginPage } from '../pages/LoginPage';
// POM for dashboard total-spent visibility checks after login.
import { DashboardPage } from '../pages/DashboardPage';
// Reusable Faker helper that returns a random email each call.
import { generateRandomEmail } from '../utils/testData';
// Faker used here for random passwords.
import { faker } from '@faker-js/faker';

// Group related login scenarios under one describe block (Allure suite title).
test.describe('Login', () => {
  // Page object instances created fresh in beforeEach for isolation.
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  // Runs before every test in this describe: load mock UI + construct POMs.
  test.beforeEach(async ({ page }) => {
    // Inject full mock HTML into a blank page (replaces page.goto for this framework).
    await page.setContent(mockHTML);
    // Bind login locators/actions to the current page.
    loginPage = new LoginPage(page);
    // Bind dashboard locators for post-login visibility checks.
    dashboardPage = new DashboardPage(page);
  });

  // Happy-path: valid-looking credentials are entered and key UI remains usable.
  test('Successful Login', async () => {
    // Unique email per run to avoid hard-coded test data.
    const email = generateRandomEmail();
    // Random 12-character password from Faker.
    const password = faker.internet.password({ length: 12 });

    // Execute the composed login flow from the POM.
    await loginPage.login(email, password);

    // Assert email field retained the typed value.
    await expect(loginPage.emailInput).toHaveValue(email);
    // Assert password field retained the typed value.
    await expect(loginPage.passwordInput).toHaveValue(password);
    // Assert dashboard summary is visible on the same mock page.
    await expect(dashboardPage.totalSpent).toBeVisible();
  });

  // Negative-path: after login attempt, error banner text must be present.
  test('Invalid Login', async () => {
    // Random email used as "invalid" credentials against the static mock.
    const email = generateRandomEmail();
    // Random short password for the invalid attempt.
    const password = faker.internet.password({ length: 8 });

    // Attempt login with the generated credentials.
    await loginPage.login(email, password);

    // Read error text via POM helper.
    const error = await loginPage.getError();
    // Static mock always includes this invalid-credentials message.
    expect(error).toContain('Invalid email or password');
    // Error element itself must be visible for Allure / UI verification.
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
