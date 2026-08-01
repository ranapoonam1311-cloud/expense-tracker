# Manual Testing Strategy — SpendSmart Expense Tracker

**Source SRS:** AI QA Homework Assignment PDF (SpendSmart Expense Tracker, Shift-Left Approach)  
**Suite file:** [SpendSmart_Manual_Regression_Suite.xlsx](./SpendSmart_Manual_Regression_Suite.xlsx) / [CSV](./SpendSmart_Manual_Regression_Suite.csv)  
**Automation map:** Playwright project `smart-expense-framework` (mock HTML + POM)

---

## 1. Requirements understanding

### Business goal
Help users log, categorize, and visualize daily expenses to reduce overspending.

### In scope (from SRS)
- User registration & login/security
- Expense dashboard (total spent, category chart, recent transactions)
- Expense CRUD (create/view/edit/delete)
- Basic categorization & data isolation per user
- Browser compatibility (Chrome, Firefox, Edge, Safari)
- Export (mentioned in overview scope; limited coverage until UI exists)

### Out of scope
- Bank integrations, multi-currency, native mobile apps, split-bill

### User roles
| Role | Capabilities |
|------|----------------|
| Guest | Landing, features/pricing, register |
| Registered User | Login, expenses, dashboard, profile |
| Administrator | Global categories, read-only user counts |

### Key business rules tested
- Password policy: min 8 chars, 1 upper, 1 number, 1 special
- Account lock: 5 failed logins → 15 minutes
- Session idle timeout: 30 minutes
- Expense amount: `> 0`, ≤ 2 decimals, max `999,999.99`
- Future expense dates prohibited
- Data isolation by logged-in user

### Locator contract (automation / shift-left)
`input-email`, `input-password`, `btn-login`, `msg-error`, `text-total-spent`, `btn-new-transaction`, `input-amount`, `select-category`, `btn-save-expense`, `table-expenses`

---

## 2. Test design approach

Suite includes the assignment-required scenario types:

| Type | Purpose |
|------|---------|
| Positive | Happy paths (register, login, CRUD, dashboard) |
| Negative | Invalid inputs, auth failures, prohibited dates/amounts |
| Boundary | Password length, amount min/max, decimals |
| UI | Labels, masking, testids, responsive, keyboard |
| Integration | Register→Login→Dashboard→CRUD sync |
| Cross-browser | Chrome, Firefox, Edge, Safari/WebKit |
| Error-handling | Lockout, 500/offline/404, Allure failure screenshot |
| Exploratory | Concurrent sessions, burst create, mobile, autofill |

### Technique mix
- **Equivalence partitioning** — valid vs invalid email/password/amount classes  
- **Boundary value analysis** — password length 7/8, amount 0 / 0.01 / 999999.99 / 1000000  
- **Decision tables** — lockout & session timeout rules  
- **Use-case / end-to-end** — smoke & full journey  
- **Risk-based priority** — High on auth, money validation, isolation, CRUD  

---

## 3. Suite format (assignment columns)

Spreadsheet columns:

`Test Case ID | Module | Type | Priority | Preconditions | Test Data | Test Steps | Expected Result | Actual Result | Status | Automation Mapping`

- **Actual Result / Status** left blank for execution cycles (`Not Executed` default).  
- **Automation Mapping** links each case to mock Playwright coverage where applicable.

### Coverage snapshot (83 cases)

Modules include: Registration, Login, Session, Dashboard, Expense Create/View/Edit/Delete, Validation, Security, UI, Integration, Cross Browser, Error Handling, Reporting, Regression Smoke, Exploratory.

---

## 4. Risks & limitations

| Risk | Impact | Mitigation |
|------|--------|------------|
| UI still in development | Cannot execute full UI suite on production URL | Shift-left: mock HTML + contract testids; keep full suite for when app lands |
| Static mock has no JS state | CRUD/dashboard totals won’t update in automation | Mark those cases Manual-only; automate locator/smoke against mock |
| Lockout / session timing | Slow to execute repeatedly | Separate soak/security cycle; use staging time shortcuts if available |
| Pie chart / export / admin | May be incomplete in early builds | Conditional execution; track as blocked if not ready |
| Cross-browser differences | Safari/WebKit quirks | Dedicated XB smoke + Playwright projects |

---

## 5. Entry / exit criteria

**Entry**
- SRS + locator contract available  
- Test environment or mock framework ready  
- Test data users prepared  

**Exit (regression cycle)**
- All **Critical/High** cases executed  
- No open Sev-1/Sev-2 defects without waiver  
- Smoke path green on target browsers  
- Results recorded in Actual Result + Status columns  

---

## 6. Exploratory ideas (assignment: ≥3)

1. **Burst create** — add many expenses quickly; watch totals/charts for races.  
2. **Dual-browser same user** — create in one browser, edit/delete in another.  
3. **Mobile usability** — login + add expense on small viewport / real device.  
4. **Autofill & paste** — password managers; amount pasted as `$12.50`.  

(Also captured as `TC_EXPLORE_001`–`004` in the Excel.)

---

## 7. Link to automation project

| Manual focus | Automated in repo |
|--------------|-------------------|
| Login positive/negative (testid level) | `tests/login.spec.ts` |
| Dashboard total visible | `tests/dashboard.spec.ts` |
| Add/save expense + table | `tests/expense.spec.ts` |
| Failure screenshot proof | `tests/failure.spec.ts` + Allure |
| Cross-browser (Chrome/FF/WebKit) | `playwright.config.ts` projects |

Full registration, lockout, session timeout, edit/delete, pie chart, admin, and real API error paths remain **manual** until a live app exists.

---

## 8. How to execute

1. Open `docs/SpendSmart_Manual_Regression_Suite.xlsx`.  
2. Filter by **Priority = High** for smoke/regression core.  
3. For each case fill **Actual Result** and set **Status** = Pass / Fail / Blocked / Skipped.  
4. Log defects with Test Case ID reference.  
5. Re-run failed High cases after fixes (confirmation testing).
