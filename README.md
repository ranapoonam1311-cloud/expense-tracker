# SmartSpend Expense Tracker — Playwright Test Framework

Practice automation framework for the **SmartSpend Expense Tracker** application, built with **Playwright**, **TypeScript**, **Page Object Model (POM)**, **Faker**, and **Allure** reporting.

Tests run against a local **mock HTML** page (no live app server required), so you can practice framework design, selectors, reporting, and CI end-to-end.

---

## Features

- Playwright Test with Chromium, Firefox, and WebKit
- Page Object Model (`LoginPage`, `DashboardPage`, `ExpensePage`)
- Locators via `data-testid` only (`page.getByTestId()`)
- Mock Expense Tracker UI injected with `page.setContent()`
- Dynamic test data with `@faker-js/faker`
- Allure reports with screenshots on failure
- GitHub Actions CI workflow

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation & test runner |
| TypeScript | Typed test & page code |
| @faker-js/faker | Random test data |
| allure-playwright | Allure results from Playwright |
| allure-commandline | Generate / open HTML reports |
| GitHub Actions | CI test + report artifacts |

---

## Project Structure

```text
smart-expense-framework/
├── .github/workflows/
│   └── playwright.yml          # CI: install, test, upload Allure artifacts
├── docs/                       # Notes + Interview-QA + Manual Regression Suite
│   ├── SpendSmart_Manual_Regression_Suite.xlsx
│   └── SpendSmart_Manual_Regression_Suite.csv
├── mock/
│   └── mockHTML.ts             # Mock Expense Tracker HTML (export const mockHTML)
├── pages/
│   ├── LoginPage.ts            # login(), enterEmail(), getError(), …
│   ├── DashboardPage.ts        # getTotalSpent(), clickNewTransaction()
│   └── ExpensePage.ts          # enterAmount(), selectCategory(), verifyTable()
├── tests/
│   ├── login.spec.ts           # Successful / Invalid login
│   ├── dashboard.spec.ts       # Dashboard visible
│   ├── expense.spec.ts         # Add / Save expense
│   └── failure.spec.ts         # Intentional fail (Allure screenshot demo)
├── utils/
│   └── testData.ts             # Faker helpers (email, amount, description, …)
├── global-teardown.ts          # Auto-generates Allure HTML after each run
├── playwright.config.ts        # Reporters, screenshot on failure, browsers
├── tsconfig.json
├── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** (LTS recommended)
- **Java** (required by Allure Commandline to generate reports)
- Playwright browsers (installed via CLI below)

---

## Setup

```bash
# 1. Clone
git clone https://github.com/ranapoonam1311-cloud/expense-tracker.git
cd expense-tracker

# 2. Install npm dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## Mock Application (`data-testid`s)

The mock page in `mock/mockHTML.ts` includes these test IDs:

| Test ID | Element |
|---------|---------|
| `input-email` | Email field |
| `input-password` | Password field |
| `btn-login` | Login button |
| `msg-error` | Error message |
| `text-total-spent` | Total spent |
| `btn-new-transaction` | New transaction |
| `input-amount` | Amount field |
| `select-category` | Category dropdown |
| `btn-save-expense` | Save expense |
| `table-expenses` | Expenses table |

Each spec uses:

```ts
test.beforeEach(async ({ page }) => {
  await page.setContent(mockHTML);
});
```

---

## Running Tests

```bash
# All browsers (chromium, firefox, webkit)
npm test

# Chromium only
npm run test:chromium

# Single file
npx playwright test tests/login.spec.ts --project=chromium

# Headed mode
npx playwright test --project=chromium --headed

# UI mode
npx playwright test --ui
```

After every run, `global-teardown.ts` generates an Allure report into `allure-report/` (when results exist and Java is available).

---

## Test Scenarios

| Spec | Cases |
|------|--------|
| `login.spec.ts` | Successful Login, Invalid Login |
| `expense.spec.ts` | Add Expense, Save Expense |
| `dashboard.spec.ts` | Dashboard Visible |
| `failure.spec.ts` | Intentional failure via `getByTestId('non-existent')` for Allure screenshot verification |

---

## Page Object Model

### LoginPage
- `enterEmail()`, `enterPassword()`, `clickLogin()`, `login()`, `getError()`

### DashboardPage
- `getTotalSpent()`, `clickNewTransaction()`

### ExpensePage
- `enterAmount()`, `selectCategory()`, `saveExpense()`, `verifyTable()`

Example:

```ts
const loginPage = new LoginPage(page);
await loginPage.login(generateRandomEmail(), faker.internet.password());
```

---

## Test Data (Faker)

Helpers in `utils/testData.ts`:

| Function | Returns |
|----------|---------|
| `generateRandomName()` | Full name |
| `generateRandomEmail()` | Email |
| `generateRandomAmount(min?, max?)` | Amount string (e.g. `"42.75"`) |
| `generateRandomExpenseDescription()` | Product / expense description |

---

## Allure Reporting

### Configured behaviour

- Reporter: `allure-playwright` → writes `allure-results/`
- Screenshots: `screenshot: 'only-on-failure'`
- Video: `retain-on-failure`
- Auto HTML report: `global-teardown.ts` → `allure-report/`

### Commands

Use **`npx`** (or npm scripts). `allure` alone is not on PATH unless installed globally.

```bash
# Generate report
npx allure generate allure-results --clean -o allure-report
# or
npm run allure:generate

# Open report
npx allure open allure-report
# or
npm run allure:open

# Generate + open
npm run report

# Serve results directly
npm run allure:serve
```

### Failure screenshot demo

```bash
npx playwright test tests/failure.spec.ts --project=chromium
npm run allure:open
```

Open the failed test in Allure — the screenshot attachment should be present.

---

## Playwright Config Highlights

- Reporters: `list`, `html`, `allure-playwright`
- `screenshot: 'only-on-failure'`
- `video: 'retain-on-failure'`
- `trace: 'on-first-retry'`
- Projects: Chromium, Firefox, WebKit
- `globalTeardown` for Allure HTML generation

---

## CI (GitHub Actions)

Workflow: `.github/workflows/playwright.yml`

On push / PR to `main` or `master`:

1. Setup Node + Java  
2. `npm ci`  
3. Install Playwright browsers  
4. Run tests  
5. Upload artifacts: `allure-results`, `allure-report`, `playwright-report`

---

## Useful Scripts (`package.json`)

| Script | Description |
|--------|-------------|
| `npm test` | Run all Playwright tests |
| `npm run test:chromium` | Chromium only |
| `npm run allure:generate` | Build Allure HTML report |
| `npm run allure:open` | Open Allure report |
| `npm run allure:serve` | Serve Allure from results |
| `npm run report` | Generate + open Allure report |

---

## Notes

- This is a **practice assignment** framework; the UI is mock HTML, not a production backend.
- Login/expense actions do not change page state (no JavaScript in the mock); assertions validate visibility, filled values, error text, and table content present in the mock.
- Generated folders (`allure-results/`, `allure-report/`, `test-results/`, `playwright-report/`) are gitignored.

---

## Author

Practice project — SmartSpend Expense Tracker automation framework.
