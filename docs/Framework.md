# Automation Framework Setup — SpendSmart Expense Tracker

This document explains **what** each part of the framework is and **why** it exists.

**Project:** Playwright + TypeScript UI automation (Shift-Left approach)  
**Application under test (practice):** SpendSmart / SmartSpend Expense Tracker (mock HTML)  
**Repository:** https://github.com/ranapoonam1311-cloud/expense-tracker

---

## 1. Framework goal

| What | Why |
|------|-----|
| End-to-end style UI tests | Repeatedly verify login, dashboard, and expense flows |
| Shift-left testing with mock HTML | Practice locators, POM, and reporting before the real UI is ready |
| Reusable structure | Keep specs readable; keep selectors in one place (POM) |
| Reporting and CI | Make failures visible (Allure screenshots) and run checks on every push |

---

## 2. High-level architecture

```text
┌─────────────────────────────────────────────────────────┐
│  tests/*.spec.ts     →  WHAT to test (scenarios)         │
├─────────────────────────────────────────────────────────┤
│  pages/*.ts (POM)    →  HOW to interact (locators/actions)│
├─────────────────────────────────────────────────────────┤
│  mock/mockHTML.ts    →  Fake UI with data-testid attributes│
│  utils/testData.ts   →  Dynamic test data (Faker)         │
├─────────────────────────────────────────────────────────┤
│  playwright.config   →  Browsers, reporters, screenshots  │
│  global-teardown     →  Generate Allure HTML report       │
│  .github/workflows   →  CI on push / pull request         │
└─────────────────────────────────────────────────────────┘
```

**Execution flow:**  
`beforeEach` → `page.setContent(mockHTML)` → POM actions → `expect` assertions → Allure results → teardown generates HTML report.

---

## 3. Folder structure — what and why

```text
smart-expense-framework/
├── pages/                 # Page Object Model
├── tests/                 # Playwright test specs
├── mock/                  # Mock Expense Tracker HTML
├── utils/                 # Shared helpers (Faker)
├── docs/                  # Assignment documentation
├── .github/workflows/     # CI pipeline
├── playwright.config.ts   # Main Playwright settings
├── global-teardown.ts     # Post-run Allure generation
├── package.json           # Dependencies and npm scripts
├── tsconfig.json          # TypeScript settings
├── .gitignore             # Ignore reports and node_modules
└── README.md              # Setup and usage guide
```

### `pages/` — Page Object Model

| File | What | Why |
|------|------|-----|
| `LoginPage.ts` | Locators and methods for email, password, login, error | Avoid repeating login steps in every spec |
| `DashboardPage.ts` | Total spent and New Transaction actions | Keep dashboard interactions in one class |
| `ExpensePage.ts` | Amount, category, save, and table verification | Reuse expense form and table logic |

**Why POM?**
- If a selector changes, update only the page file
- Specs read like business steps (`loginPage.login(...)`)
- Assignment rule: use **only** `page.getByTestId(...)`

### `tests/` — Specs

| File | What | Why |
|------|------|-----|
| `login.spec.ts` | Successful and invalid login | Cover positive and negative auth paths |
| `dashboard.spec.ts` | Dashboard visibility and total format | Verify post-login summary |
| `expense.spec.ts` | Add and save expense | Cover expense form and table |
| `failure.spec.ts` | Intentional failure (`non-existent`) | Prove Allure captures a failure screenshot |

**Why separate files?** Clear module suites in reports, easier ownership, better parallel execution.

### `mock/`

| File | What | Why |
|------|------|-----|
| `mockHTML.ts` | Full HTML string with required `data-testid` attributes | No live URL; inject UI with `setContent` |

**Why a mock?** Shift-left: build and validate the automation framework before the real frontend is finished. Practice the locator contract early.

### `utils/`

| File | What | Why |
|------|------|-----|
| `testData.ts` | Helpers such as `generateRandomEmail`, `generateRandomAmount` | Avoid hard-coded data; generate fresh values each run |

**Why Faker?** Reduces brittle coupling to fixed strings, produces realistic inputs, and satisfies the assignment requirement.

### Root configuration files

| File | What | Why |
|------|------|-----|
| `playwright.config.ts` | Test directory, browsers, screenshots, video, traces, reporters | Central control of how tests run |
| `global-teardown.ts` | Runs `allure generate` after the suite | Automatically produce an HTML report |
| `package.json` | Dependencies and scripts (`test`, `allure:*`) | Standard install and run commands |
| `tsconfig.json` | TypeScript and Node type settings | Typed `Page` / `Locator` APIs and IDE support |
| `.gitignore` | Ignores `node_modules`, Allure outputs, Playwright reports | Keep generated and local files out of Git |

### `docs/`

| File | What | Why |
|------|------|-----|
| `Framework.md` | This document | Explain framework design |
| `Manual-Testing.md` | Manual test strategy | Context for Phase 1 manual suite |
| `Interview-QA.md` | Interview questions and answers | Interview preparation |
| `SpendSmart_Manual_Regression_Suite.xlsx` | Manual regression cases | Assignment deliverable |
| `AI-Prompt.md` / `Cursor-AI.md` / `Allure.md` | Process documentation | Assignment Phase 4 docs |

### `.github/workflows/playwright.yml`

| What | Why |
|------|-----|
| CI job: install dependencies → install browsers → run tests → upload artifacts | Automatic feedback on every push and pull request |

---

## 4. Tech stack — what and why

| Tool | What | Why |
|------|------|-----|
| **Playwright** | Browser automation and test runner | Multi-browser support, auto-waiting, modern E2E tooling |
| **TypeScript** | Typed JavaScript | Safer refactors and better IDE autocomplete |
| **@faker-js/faker** | Random test data generation | Dynamic emails and amounts |
| **allure-playwright** | Writes Allure result files | Rich reports and attachments |
| **allure-commandline** | Generates HTML reports | `allure generate` / `allure open` |
| **GitHub Actions** | Continuous integration | Continuous verification of the suite |

---

## 5. Locator contract — what and why

Frontend contract `data-testid` values from the assignment:

| Test ID | Screen | Why it matters |
|---------|--------|----------------|
| `input-email` | Login | Stable email field |
| `input-password` | Login | Stable password field |
| `btn-login` | Login | Submit action |
| `msg-error` | Login | Negative authentication assertion |
| `text-total-spent` | Dashboard | Spending summary |
| `btn-new-transaction` | Dashboard | Opens add-expense flow |
| `input-amount` | Expense | Amount entry |
| `select-category` | Expense | Category selection |
| `btn-save-expense` | Expense | Save action |
| `table-expenses` | List | Expense history verification |

**Why `getByTestId` only?** CSS and XPath tied to text or classes break often. Test IDs are an agreed stable contract for automation (shift-left).

---

## 6. Test lifecycle — step by step

1. **Install:** `npm install` and `npx playwright install`
2. **Run:** `npm test` or `npm run test:chromium`
3. **Before each test:** `page.setContent(mockHTML)` and create page objects
4. **Actions:** POM methods such as `login`, `enterAmount`
5. **Assert:** `expect(...).toBeVisible()` / `toHaveValue()`
6. **On failure:** save screenshot (and video)
7. **After the suite:** `global-teardown` generates Allure HTML under `allure-report/`

---

## 7. Important `playwright.config.ts` settings

| Setting | What | Why |
|---------|------|-----|
| `testDir: './tests'` | Location of specs | Tells the runner where tests live |
| `fullyParallel: true` | Parallel test execution | Faster runs |
| `retries` on CI | Re-run failed tests | Reduce flake impact on CI |
| `workers: 1` on CI | Single worker on CI | More stable CI runs |
| `screenshot: 'only-on-failure'` | Capture PNG on fail | Evidence for Allure |
| `video: 'retain-on-failure'` | Keep video on fail | Easier debugging |
| `trace: 'on-first-retry'` | Trace on first retry | Deep failure analysis |
| `reporter: list + html + allure` | Multiple report outputs | Console, HTML, and Allure |
| `projects: chromium/firefox/webkit` | Three browser engines | Cross-browser coverage |

---

## 8. Page Object design rules

| Rule | Why |
|------|-----|
| Define locators in the constructor | Bind once; keep methods short |
| Use `readonly` fields | Prevent accidental reassignment |
| Small methods (`enterEmail`) plus flows (`login`) | Reuse plus readable specs |
| No `page.goto` in this project | UI is injected with `setContent` |
| Most assertions in specs; `verifyTable` as a reusable check | Balance reuse with clear test intent |

---

## 9. Setup instructions

```bash
# Clone
git clone https://github.com/ranapoonam1311-cloud/expense-tracker.git
cd expense-tracker

# Dependencies
npm install

# Browsers
npx playwright install

# Run all browsers
npm test

# Chromium only
npm run test:chromium

# Allure (Java required)
npm run allure:generate
npm run allure:open
# or
npm run report
```

---

## 10. Limitations (important to understand)

| Limitation | Why it matters |
|------------|----------------|
| Mock HTML has no JavaScript | Clicks do not change real application state or CRUD data |
| Registration, lockout, and session timeout are not real | Those scenarios stay in the manual suite |
| Pie chart / edit / delete coverage in the mock is limited | Extend when the full app is available |

**Next step for a real environment:** keep the same POM and point tests at staging with `baseURL` / `page.goto`; remove the mock.

---

## 11. Quick “what + why” cheatsheet

| Piece | What | Why |
|-------|------|-----|
| Mock HTML | Fake UI | Shift-left without a live app |
| POM pages | Locators and actions | Maintainability |
| Specs | Scenarios | Define what we verify |
| Faker utilities | Random data | Less brittle test data |
| Playwright config | Run policy | Consistent execution |
| Allure + teardown | Reports | Evidence and screenshots |
| `failure.spec` | Forced failure | Prove screenshot capture |
| GitHub Actions | CI | Automatic quality gate |
| Manual Excel suite | Full SRS coverage | Assignment Phase 1 |
| TypeScript | Static types | Safer, clearer code |

---

## 12. Related documents

- [Manual-Testing.md](./Manual-Testing.md) — manual strategy and risks  
- [Interview-QA.md](./Interview-QA.md) — interview Q&A  
- [README.md](../README.md) — quick start  
- [SpendSmart_Manual_Regression_Suite.xlsx](./SpendSmart_Manual_Regression_Suite.xlsx) — manual test cases
