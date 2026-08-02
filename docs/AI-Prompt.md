# AI Prompt Engineering — SpendSmart Expense Tracker

This document records **what** prompts were used, **why** they were written that way, and **where** each prompt’s output landed in the project.

**Assignment Phase 1 & 2:** Use AI as a co-pilot for the manual suite and shift-left Playwright framework.  
**Tools used:** Cursor AI (primary), with the same prompt patterns usable in ChatGPT/Claude/Gemini.  
**Repository:** https://github.com/ranapoonam1311-cloud/expense-tracker

---

## 1. Goal of prompt engineering in this project

| What | Why |
|------|-----|
| Feed SRS + locator contract into prompts | AI output matches SpendSmart requirements, not a generic demo app |
| Ask for Positive, Negative, Boundary, UI, Integration, Cross-browser, Error-handling cases | Assignment constraint for the manual regression suite |
| Ask for POM + `getByTestId` only + mock HTML + Faker + Allure | Assignment constraint for automation |
| Review and refine every AI draft | Rubric expects contextual prompts and refined code |

---

## 2. Prompting principles — what / why / where applied

| Principle | What to include in the prompt | Why | Where it helped |
|-----------|-------------------------------|-----|-----------------|
| Contract first | Exact `data-testid` list | Prevents wrong selectors | Mock HTML, POM |
| Constraints | “No JS”, “TypeScript”, “POM only” | Keeps scope under control | All code prompts |
| Output format | Excel columns / file names / method names | Assignment formatting | Manual suite, pages |
| Context | SRS rules (password policy, amount limits) | Realistic expected results | Manual cases |
| Layering | One layer per prompt (mock → POM → tests) | Cleaner architecture | Whole framework |
| Verification ask | “List assumptions / what won’t work on static mock” | Catch false confidence | Specs vs mock limits |

---

## 3. Final master prompt — Manual Regression Suite (Phase 1)

### What was asked (final prompt)

```text
You are a senior QA engineer. Using the SpendSmart Expense Tracker SRS below,
generate a comprehensive MANUAL REGRESSION suite.

Include scenario types: Positive, Negative, Boundary Value, UI, Integration,
Cross-browser, and Error-handling.

Also add at least 3 exploratory test ideas.

Output as a spreadsheet-ready table with columns:
Test Case ID, Module, Priority, Preconditions, Test Data, Test Steps,
Expected Result, Actual Result, Status.

Add a Type column (Positive/Negative/Boundary/UI/Integration/Cross-browser/
Error-handling/Exploratory) and keep Expected Results specific (not generic
“system behaves as expected”).

Cover modules from SRS:
- REQ-01 Registration (fields, password policy, duplicate email)
- REQ-02 Login & security (invalid login, lockout after 5 failures / 15 min,
  forgot password)
- REQ-03 Dashboard (total spent, pie chart, recent 5, user isolation,
  performance < 2s)
- REQ-04 Expense CRUD (positive amount rules, no future dates, pagination,
  edit, delete)
- Session timeout 30 minutes
- NFR: browsers Chrome/Firefox/Edge/Safari; security XSS/SQLi basics

Locator contract (for traceability notes): input-email, input-password,
btn-login, msg-error, text-total-spent, btn-new-transaction, input-amount,
select-category, btn-save-expense, table-expenses.

Paste SRS summary: [registration, login, dashboard, CRUD, password policy,
amount max 999999.99, 2 decimals, etc.]
```

| What | Why |
|------|-----|
| Explicit scenario types | Meets Phase 1 constraint |
| Strict column list | Meets required spreadsheet format |
| Specific expected results | Avoids useless placeholder wording |
| SRS modules listed | Full requirement coverage |

### Where the output went

| Artifact | Path |
|----------|------|
| Excel suite | `docs/SpendSmart_Manual_Regression_Suite.xlsx` |
| CSV suite | `docs/SpendSmart_Manual_Regression_Suite.csv` |
| Strategy write-up | `docs/Manual-Testing.md` |

### Refinements after first AI draft

| Issue in first draft | What we changed | Why |
|----------------------|-----------------|-----|
| Vague expected results (“behaves as expected”) | Wrote concrete outcomes | Executable and reviewable cases |
| Missing exploratory ideas | Added EX-1…EX-4 | Assignment asks for ≥3 |
| No link to automation | Added Automation Mapping column | Shows shift-left coverage vs manual-only |

---

## 4. Final prompts — Automation (Phase 2 / Cursor)

### 4.1 Mock HTML

**Prompt**

```text
Create a complete mock HTML page for an Expense Tracker application.

The page must contain these data-testid attributes exactly:
input-email, input-password, btn-login, msg-error, text-total-spent,
btn-new-transaction, input-amount, select-category, btn-save-expense,
table-expenses.

Use modern basic CSS. No JavaScript. Only HTML and CSS.
Return only the HTML.
```

| What | Why | Where |
|------|-----|-------|
| Exact test IDs | Locator contract | `mock/mockHTML.ts` |
| No JavaScript | Static, predictable fixture | same |
| CSS styling | Readable screenshots in Allure | same |

**Refinement:** export as `export const mockHTML = \`...\`` for `page.setContent(mockHTML)`.

---

### 4.2 Page Objects

**Prompt**

```text
Create Playwright Page Object Model classes in TypeScript:
LoginPage.ts, DashboardPage.ts, ExpensePage.ts.

Use only page.getByTestId().

LoginPage methods: login, enterEmail, enterPassword, clickLogin, getError
DashboardPage methods: getTotalSpent, clickNewTransaction
ExpensePage methods: enterAmount, selectCategory, saveExpense, verifyTable

Follow best coding practices (readonly locators, typed Page).
```

| What | Why | Where |
|------|-----|-------|
| One class per area | Maintainability | `pages/*.ts` |
| `getByTestId` only | Assignment rule | same |
| Named methods | Readable specs | same |

---

### 4.3 Faker utilities

**Prompt**

```text
Create a utility file using @faker-js/faker.
Generate: random name, random email, random amount, random expense description.
Return reusable functions.
```

| What | Why | Where |
|------|-----|-------|
| Shared helpers | DRY test data | `utils/testData.ts` |
| Amount as string | Works with `fill()` | same |

---

### 4.4 Playwright tests

**Prompt**

```text
Create Playwright tests with beforeEach().
Inject mock HTML using page.setContent().
Use POM and Faker.
Tests: Successful Login, Invalid Login, Add Expense, Save Expense,
Dashboard Visible.
Also create one intentional failure:
expect(page.getByTestId("non-existent")).toBeVisible()
for Allure screenshot verification.
```

| What | Why | Where |
|------|-----|-------|
| `setContent` in `beforeEach` | Shift-left without URL | `tests/*.spec.ts` |
| Intentional failure | Screenshot proof | `tests/failure.spec.ts` |

**Refinement:** assertions match static mock (no real navigation/state change).

---

### 4.5 Allure

**Prompt**

```text
Configure Allure Reporting for Playwright.
Automatically generate reports.
Capture screenshots on failure.
Provide all required configuration files.
```

| What | Why | Where |
|------|-----|-------|
| Reporter + screenshot on failure | Phase 3 evidence | `playwright.config.ts` |
| Auto generate | Less manual work | `global-teardown.ts` |
| Scripts | Easy commands | `package.json` |

---

## 5. Prompt evolution (initial → refined)

| Stage | What the prompt looked like | Why it was weak / better |
|-------|----------------------------|---------------------------|
| Initial | “Write Playwright tests for expense tracker” | Too vague → wrong selectors, no mock |
| Refined | Listed exact test IDs + no JS + file names | Matched contract |
| Final | Added mock limits, Allure failure case, Excel columns | Submission-ready |

| What we learned | Why it matters |
|-----------------|----------------|
| Constraints beat creativity | Assignment grading is contract-based |
| Ask for file paths | Output drops in the right folders |
| Ask AI to state assumptions | Reveals mock vs real-app gaps early |

---

## 6. Mapping: prompt → project output

| Prompt theme | Output location | Why that location |
|--------------|-----------------|-------------------|
| Manual suite | `docs/SpendSmart_Manual_Regression_Suite.xlsx` | Deliverable format |
| Manual strategy | `docs/Manual-Testing.md` | Phase 4 doc |
| Mock HTML | `mock/mockHTML.ts` | Imported by specs |
| POM | `pages/` | Separates locators from tests |
| Faker | `utils/testData.ts` | Shared utilities |
| Specs | `tests/` | Playwright `testDir` |
| Allure | `playwright.config.ts`, `global-teardown.ts` | Run + report lifecycle |
| Cursor notes | `docs/Cursor-AI.md` | How AI was used |
| This file | `docs/AI-Prompt.md` | Prompt history + rationale |

---

## 7. Quality checklist used after every AI response

| Check | What | Why |
|-------|------|-----|
| Contract | All 10 `data-testid`s present | Specs depend on them |
| POM purity | No CSS/XPath in pages | Rubric rule |
| Spec realism | Asserts valid for static HTML | Avoid false failures |
| Format | Excel columns complete | Phase 1 requirement |
| Evidence | Failure screenshot path works | Phase 3 requirement |
| Language | Docs in clear English | Submission readability |

---

## 8. Quick “what / why / where” cheatsheet

| Item | What | Why | Where |
|------|------|-----|-------|
| Phase 1 prompt | Manual suite generation | Coverage + format | Excel + `Manual-Testing.md` |
| Mock prompt | HTML fixture | Shift-left UI | `mock/mockHTML.ts` |
| POM prompt | Page classes | Maintainable automation | `pages/` |
| Test prompt | Specs + failure case | Prove framework | `tests/` |
| Allure prompt | Reporter setup | Reporting evidence | config + teardown |
| Refinement loop | Human review | Rubric score | Every artifact |

---

## 9. Related documents

- [Cursor-AI.md](./Cursor-AI.md) — Cursor features and usage workflow  
- [Framework.md](./Framework.md) — framework structure  
- [Allure.md](./Allure.md) — report generation guide  
- [Manual-Testing.md](./Manual-Testing.md) — manual strategy  
- [README.md](../README.md) — how to run the project
