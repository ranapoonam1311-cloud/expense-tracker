import { test, expect } from '@playwright/test';
import { mockHTML } from '../mock/mockHTML';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { generateRandomEmail } from '../utils/testData';
import { faker } from '@faker-js/faker';

test.describe('Login', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.setContent(mockHTML);
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('Successful Login', async () => {
    const email = generateRandomEmail();
    const password = faker.internet.password({ length: 12 });

    await loginPage.login(email, password);

    await expect(loginPage.emailInput).toHaveValue(email);
    await expect(loginPage.passwordInput).toHaveValue(password);
    await expect(dashboardPage.totalSpent).toBeVisible();
  });

  test('Invalid Login', async () => {
    const email = generateRandomEmail();
    const password = faker.internet.password({ length: 8 });

    await loginPage.login(email, password);

    const error = await loginPage.getError();
    expect(error).toContain('Invalid email or password');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
