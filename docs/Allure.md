# Allure Reporting Guide — SpendSmart Expense Tracker

This document explains **what** Allure is in this project, **where** each piece lives, and **why** it is configured this way.

**Project:** Playwright + TypeScript  
**Packages:** `allure-playwright`, `allure-commandline`  
**Repository:** https://github.com/ranapoonam1311-cloud/expense-tracker

---

## 1. What is Allure and why use it?

| What | Why |
|------|-----|
| Allure is a test reporting framework | Shows pass/fail, suites, attachments, and environment info in a browsable HTML report |
| Works with Playwright via `allure-playwright` | Writes result files during the test run automatically |
| Assignment Phase 3 requirement | Prove reporting + failure screenshots |

Without Allure you still have Playwright’s HTML report. Allure adds clearer history-friendly results, environment metadata, and easy attachment viewing (screenshots/videos).

---

## 2. Where Allure pieces live

| Location | What | Why |
|----------|------|-----|
| `playwright.config.ts` → `reporter: [['allure-playwright', ...]]` | Enables Allure during test runs | Produces raw results |
| `playwright.config.ts` → `use.screenshot: 'only-on-failure'` | Captures PNG when a test fails | Evidence for failed cases |
| `playwright.config.ts` → `use.video: 'retain-on-failure'` | Keeps video on failure | Extra debug context |
| `global-teardown.ts` | Runs `allure generate` after the suite | Auto-builds HTML report |
| `package.json` scripts | `allure:generate`, `allure:open`, `report` | Simple commands for humans/CI |
| `allure-results/` | Raw JSON + attachment files | Input to the report generator (gitignored) |
| `allure-report/` | Generated static HTML site | What you open in the browser (gitignored) |
| `tests/failure.spec.ts` | Intentional failure | Proves screenshot attachment works |

---

## 3. Results vs report — what and why

| Folder | What | Why |
|--------|------|-----|
| `allure-results/` | Machine-readable output from the reporter (`.json`, `.png`, `.webm`, …) | Needed as input for generation |
| `allure-report/` | Human-readable HTML report | Stakeholders open this to review runs |

**Flow:**  
`npx playwright test` → writes `allure-results/` → teardown/`allure generate` → writes `allure-report/` → `allure open` opens it.

---

## 4. Configuration details (what / why / where)

### In `playwright.config.ts`

| Setting | What | Why |
|---------|------|-----|
| `reporter: ['allure-playwright', { resultsDir: 'allure-results' }]` | Allure adapter + output folder | Store results in a known path |
| `detail: true` | Include detailed Playwright steps | Richer report timeline |
| `suiteTitle: true` | Use `test.describe` titles as suites | Clearer grouping (Login, Expense, …) |
| `environmentInfo` | OS + Node version metadata | Know where the run happened |
| `screenshot: 'only-on-failure'` | Auto screenshot on fail | Assignment proof + debugging |
| `video: 'retain-on-failure'` | Keep failure videos | Reproduce UI state |
| `globalTeardown: './global-teardown.ts'` | Hook after all tests | Generate HTML without a manual step |

### In `global-teardown.ts`

| Behavior | What | Why |
|----------|------|-----|
| Check `allure-results` exists and is non-empty | Guard clause | Avoid failing when no results |
| `npx allure generate ... --clean -o allure-report` | Build HTML | Fresh report each run |
| Catch errors and warn | Soft failure | Missing Java should not hide test outcomes |

### Prerequisite

| What | Why |
|------|-----|
| Java installed on the machine | `allure-commandline` runs on the JVM |

---

## 5. How to generate and view reports

### Option A — automatic (recommended)

```bash
npm test
# or
npm run test:chromium
```

| What happens | Why |
|--------------|-----|
| Tests run with Allure reporter | Results land in `allure-results/` |
| `global-teardown.ts` runs | HTML report created in `allure-report/` |

Then open:

```bash
npm run allure:open
# same as: npx allure open ./allure-report
```

### Option B — manual commands

```bash
# 1) Run tests (writes allure-results)
npx playwright test --project=chromium

# 2) Generate HTML
npx allure generate ./allure-results --clean -o ./allure-report
# or: npm run allure:generate

# 3) Open report
npx allure open ./allure-report
# or: npm run allure:open

# One-shot generate + open
npm run report

# Serve directly from results (no separate generate folder needed)
npm run allure:serve
```

| Command | What | Why |
|---------|------|-----|
| `npx allure ...` | Uses local `node_modules` binary | `allure` alone may be “command not found” |
| `--clean` | Deletes old report content | Avoid stale screenshots/cases |
| `-o ./allure-report` | Output directory | Predictable location |

---

## 6. Failure screenshot proof (assignment)

| What | Where | Why |
|------|-------|-----|
| Spec asserts `getByTestId('non-existent')` | `tests/failure.spec.ts` | Guaranteed failure |
| Mock page still loaded | `beforeEach` → `setContent(mockHTML)` | Screenshot shows Expense Tracker UI, not a blank page |
| Playwright captures screenshot | `screenshot: 'only-on-failure'` | Attachment created |
| Allure attaches it | `allure-playwright` | Visible on the failed test in the report |

**How to verify**

```bash
npx playwright test tests/failure.spec.ts --project=chromium
npm run allure:open
```

Open the failed test → Attachments → screenshot (and optionally video).

---

## 7. What you should see in the Allure UI

| Section | What | Why it matters |
|---------|------|----------------|
| Suites / Behaviors | Login, Dashboard, Expense, Failure | Maps to `test.describe` blocks |
| Status counts | Passed / Failed / Broken | Quick health of the run |
| Failed test details | Error message + stack | Root cause |
| Attachments | Screenshot / video / trace (if present) | Visual proof |
| Environment | OS, Node version | Reproducibility |

---

## 8. CI integration — where and why

| What | Where | Why |
|------|-------|-----|
| Java setup | `.github/workflows/playwright.yml` | Allure CLI needs Java on the runner |
| Upload `allure-results` and `allure-report` | GitHub Actions artifacts | Download reports after CI runs |
| Keep folders gitignored | `.gitignore` | Do not commit generated noise |

---

## 9. Troubleshooting

| Problem | What to check | Why |
|---------|---------------|-----|
| `allure: command not found` | Use `npx allure` or npm scripts | Binary is local, not global |
| Report empty / not generated | Java installed? `allure-results` non-empty? | Generator needs both |
| No screenshot on failure | `screenshot: 'only-on-failure'` in config | Without it, Allure has nothing to attach |
| Old failures still showing | Use `--clean` on generate | Clears previous report output |

---

## 10. Quick “what / why / where” cheatsheet

| Piece | What | Why | Where |
|-------|------|-----|-------|
| Allure reporter | Writes results | Reporting during run | `playwright.config.ts` |
| Screenshots | PNG on fail | Evidence | `use.screenshot` |
| Teardown | Auto `allure generate` | No manual step forgotten | `global-teardown.ts` |
| Results dir | Raw files | Generator input | `allure-results/` |
| Report dir | HTML site | Human review | `allure-report/` |
| Failure spec | Forced fail | Prove attachments | `tests/failure.spec.ts` |
| npm scripts | Shortcuts | Easy daily use | `package.json` |

---

## 11. Related documents

- [Framework.md](./Framework.md) — overall framework design  
- [Cursor-AI.md](./Cursor-AI.md) — how Allure prompts were used  
- [README.md](../README.md) — setup and scripts
