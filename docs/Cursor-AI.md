# Cursor AI Usage — SpendSmart Expense Tracker

This document explains **what** Cursor AI was used for in this project and **why**, including the main prompts and how the generated output was reviewed.

**Project:** Playwright + TypeScript shift-left framework  
**Tool:** Cursor IDE (AI Chat + Agent / inline assistance)  
**Repository:** https://github.com/ranapoonam1311-cloud/expense-tracker

---

## 1. What is Cursor AI in this assignment?

| What | Why |
|------|-----|
| Cursor is an AI-assisted IDE | Speeds up scaffolding, refactoring, and documentation while you stay the test designer |
| You prompt; AI drafts code | Assignment goal: use AI as a co-pilot, not copy code blindly |
| You review and refine | Rubric requires contextual prompts and reviewed/refined AI output (including mock HTML) |

**Role split**

| Role | What | Why |
|------|------|-----|
| Human (you) | Requirements, locator contract, acceptance criteria, final review | Own quality and design decisions |
| Cursor AI | Draft HTML, POM, specs, config, docs | Faster implementation and fewer boilerplate mistakes |

---

## 2. How Cursor was used in this project

| Area | What Cursor helped create | Why use AI here |
|------|---------------------------|-----------------|
| Mock UI | `mock/mockHTML.ts` with required `data-testid`s | Real app URL not available; need injectable HTML for `setContent` |
| Page Objects | `LoginPage`, `DashboardPage`, `ExpensePage` | Consistent POM using only `getByTestId` |
| Test data | `utils/testData.ts` with Faker helpers | Reusable random data utilities |
| Specs | `login`, `dashboard`, `expense`, `failure` specs | Wire POM + mock + assertions quickly |
| Reporting | Allure config + `global-teardown.ts` | Correct reporter wiring and auto report generation |
| Docs | README, Framework, Manual suite, Interview Q&A | Structured documentation for submission |
| Git / PR | Commit messages, PR creation guidance | Faster delivery workflow |

---

## 3. Cursor features used — what and why

| Feature | What | Why |
|---------|------|-----|
| AI Chat (`Cmd/Ctrl + L`) | Multi-file, contextual prompts | Best for framework design and multi-step tasks |
| `@file` references | Point AI at `mockHTML.ts`, POM, config | Keeps answers grounded in your real code |
| Agent mode | Apply edits across files | Faster than paste-only when many files change |
| Ask mode | Read-only explanations | Safe for reviews and “what/why” questions |
| Terminal (via agent or local) | `npm test`, `allure generate`, `git push` | Validate that AI output actually runs |

---

## 4. Prompt log (main prompts used)

Below are representative prompts used during the build. Each includes **what was asked** and **why**.

### 4.1 Mock HTML

**Prompt (summary):**
> Create a complete mock HTML page for an Expense Tracker with these exact `data-testid` attributes: `input-email`, `input-password`, `btn-login`, `msg-error`, `text-total-spent`, `btn-new-transaction`, `input-amount`, `select-category`, `btn-save-expense`, `table-expenses`. Use HTML and CSS only (no JavaScript). Make it look modern.

| What | Why |
|------|-----|
| Exact test IDs listed | Enforce the assignment locator contract |
| HTML + CSS only | Keep the fixture static and predictable |
| Modern styling | Screenshots/reports look like a real app |

**Review / refinement:**
- Wrapped raw HTML as `export const mockHTML = \`...\`` so Playwright can import it
- Confirmed every required `data-testid` exists
- Kept sample table rows for `verifyTable` assertions

---

### 4.2 Page Object Model

**Prompt (summary):**
> Create Playwright POM classes in TypeScript: `LoginPage.ts`, `DashboardPage.ts`, `ExpensePage.ts`. Use only `page.getByTestId()`. Include methods such as `login()`, `getError()`, `getTotalSpent()`, `enterAmount()`, `selectCategory()`, `saveExpense()`, `verifyTable()`.

| What | Why |
|------|-----|
| One class per screen area | Clear separation of concerns |
| `getByTestId` only | Assignment constraint |
| Named methods | Specs stay readable and reusable |

**Review / refinement:**
- Kept locators `readonly`
- Composed `login()` from smaller steps
- Limited assertions inside POM (`verifyTable` only where reuse helps)

---

### 4.3 Faker utilities

**Prompt (summary):**
> Create a utility file using `@faker-js/faker` with reusable functions for random name, email, amount, and expense description.

| What | Why |
|------|-----|
| Shared helpers in `utils/` | Avoid duplicating Faker calls in every spec |
| Amount as string | Works cleanly with Playwright `fill()` |

---

### 4.4 Tests with mock injection

**Prompt (summary):**
> Create Playwright tests using `beforeEach`, inject mock HTML with `page.setContent()`, use POM and Faker. Cover Successful Login, Invalid Login, Add Expense, Save Expense, Dashboard Visible. Add one intentional failure for Allure screenshots using `getByTestId('non-existent')`.

| What | Why |
|------|-----|
| `beforeEach` + `setContent` | Shift-left without a live URL |
| POM + Faker | Match framework design and assignment |
| Intentional failure | Prove screenshot-on-failure works with Allure |

**Review / refinement:**
- Assertions match static mock behavior (no real navigation/state change)
- Failure test isolated in `failure.spec.ts`

---

### 4.5 Allure configuration

**Prompt (summary):**
> Configure Allure Reporting for Playwright. Auto-generate reports. Capture screenshots on failure. Provide required configuration files.

| What | Why |
|------|-----|
| `allure-playwright` reporter | Produce Allure results |
| `screenshot: 'only-on-failure'` | Attach evidence automatically |
| `global-teardown.ts` | Generate HTML report after every run |

**Review / refinement:**
- Added npm scripts (`allure:generate`, `allure:open`, `report`)
- Documented `npx allure` (local package, not global PATH)
- Verified failure screenshot appears under `allure-results`

---

### 4.6 Documentation and GitHub

**Prompt (summary):**
> Create detailed README, Framework doc (what/why), manual regression suite from SRS, interview Q&A, and push/PR to GitHub.

| What | Why |
|------|-----|
| Markdown + Excel deliverables | Assignment Phase 1 and Phase 4 |
| English what/why docs | Clear submission and interview prep |

---

## 5. Prompting guidelines that worked

| Practice | What to do | Why |
|----------|------------|-----|
| Be specific | List exact test IDs, method names, file names | Reduces wrong abstractions |
| Give constraints | “No JavaScript”, “getByTestId only”, “TypeScript” | Matches rubric rules |
| Provide context | Attach SRS / `@file` references | AI answers fit *this* project |
| Ask for structure | POM + utils + tests separately | Cleaner architecture |
| Demand review points | “Call out assumptions” | Catch mock vs real-app gaps |
| Iterate | Refine after first draft | Rubric expects reviewed AI code |

---

## 6. What was reviewed after AI generation

| Artifact | Checked for | Why |
|----------|-------------|-----|
| Mock HTML | All 10 contract test IDs present | Automation will fail without them |
| POM | No CSS/XPath; methods match specs | Contract compliance |
| Specs | `setContent` in `beforeEach`; realistic asserts for static HTML | Avoid false expectations |
| Config | Screenshot on failure; Allure reporter path | Reporting proof |
| Docs | English clarity; what/why completeness | Submission quality |
| Git history | Personal email author; no secrets committed | Clean GitHub presence |

---

## 7. Benefits and risks of Cursor AI

| What | Why it matters |
|------|----------------|
| **Benefit:** Faster scaffolding | More time for test design and review |
| **Benefit:** Consistent boilerplate | POM/config patterns stay uniform |
| **Risk:** Hallucinated APIs | Always run `npx playwright test` |
| **Risk:** Over-complex code | Prefer simple POM matching the assignment |
| **Risk:** Wrong assumptions (real app behavior on mock) | Align asserts with static HTML limits |

---

## 8. Recommended workflow (repeatable)

1. Paste SRS / locator contract into the prompt.  
2. Ask Cursor to generate one layer at a time (mock → POM → utils → tests → config).  
3. Open the generated files and verify against the contract.  
4. Run tests locally.  
5. Fix failures with a focused follow-up prompt (paste error + `@file`).  
6. Document the final prompt and refinements here / in `AI-Prompt.md`.

---

## 9. Quick “what + why” cheatsheet

| Piece | What | Why |
|-------|------|-----|
| Cursor Chat | Contextual AI assistance | Design and multi-file tasks |
| Mock HTML prompt | Injectable UI | Shift-left without a live site |
| POM prompts | Page classes | Maintainable automation |
| Spec prompts | Scenarios + `setContent` | Prove locators and flows |
| Allure prompts | Reporter + teardown | Evidence and screenshots |
| Review step | Human validation | Assignment quality bar |
| Iterate | Refine prompts/code | Better accuracy over one-shot generation |

---

## 10. Related documents

- [Framework.md](./Framework.md) — framework structure (what/why)  
- [AI-Prompt.md](./AI-Prompt.md) — prompt engineering notes (to be filled with final prompt versions)  
- [Allure.md](./Allure.md) — reporting guide  
- [Manual-Testing.md](./Manual-Testing.md) — manual strategy  
- [README.md](../README.md) — setup and run commands
