# Interview Q&A — SmartSpend Expense Tracker Framework

Project stack: **Playwright + TypeScript + POM + Faker + Allure + mock HTML** (`page.setContent`).

---

# PART A — FRESHERS

## 1. Project overview

**Q1. Is project mein kya banaya?**  
**A:** SmartSpend Expense Tracker ke liye Playwright automation framework. Live app nahi — `mock/mockHTML.ts` se UI load hoti hai. POM pages, Faker data, Allure reports, GitHub Actions CI.

**Q2. Kyun mock HTML use kiya, real website nahi?**  
**A:** Practice assignment ke liye server/backend ki zarurat nahi. Stable `data-testid`s, fast runs, selectors practice ke liye perfect.

**Q3. `page.setContent(mockHTML)` kya karta hai?**  
**A:** Browser page mein HTML string inject karta hai — `goto(url)` ki jagah. Har test `beforeEach` mein ye call hota hai.

**Q4. Framework ke main folders kaun se hain?**  
**A:**

- `pages/` → POM
- `tests/` → specs
- `mock/` → HTML
- `utils/` → Faker helpers
- `playwright.config.ts` → config
- `.github/workflows/` → CI

---

## 2. Playwright basics

**Q5. Playwright kya hai?**  
**A:** Microsoft ka end-to-end testing tool — browsers (Chromium/Firefox/WebKit) automate karta hai.

**Q6. `test` aur `expect` kya hain?**  
**A:** `test` = test case define karna; `expect` = assertion (visible, value, text, etc.).

**Q7. `beforeEach` kyun use kiya?**  
**A:** Har test se pehle same setup — mock load + page objects create — isolation aur less duplication.

**Q8. Locator kya hota hai?**  
**A:** Element ka lazy reference. Click/fill tab hota hai jab action call karte ho.

**Q9. `getByTestId` kyun prefer kiya?**  
**A:** CSS/XPath se zyada stable. UI text/class change hone pe kam break hota hai. Project mein sirf `data-testid` use hua.

---

## 3. Module: `mock/mockHTML.ts`

**Q10. Important `data-testid`s yaad rakho?**  
**A:**  
`input-email`, `input-password`, `btn-login`, `msg-error`,  
`text-total-spent`, `btn-new-transaction`,  
`input-amount`, `select-category`, `btn-save-expense`, `table-expenses`

**Q11. Mock mein JavaScript nahi — iska matlab?**  
**A:** Click se page state change nahi hoti. Tests visibility, filled values, aur seed table text assert karte hain.

**Q12. Error message hamesha kyun dikhta hai?**  
**A:** Static mock hai; invalid-login test ke liye `msg-error` pehle se HTML mein hai.

---

## 4. Module: Page Object Model (`pages/`)

**Q13. POM kya hai?**  
**A:** Locators + actions class mein encapsulate. Specs clean rehti hain; selectors ek jagah.

**Q14. `LoginPage` ke methods?**  
**A:** `enterEmail`, `enterPassword`, `clickLogin`, `login`, `getError`

**Q15. `login()` method kyun banayi?**  
**A:** Teen steps ko ek flow mein — specs short, reuse easy.

**Q16. `DashboardPage` kya karta hai?**  
**A:** `getTotalSpent()` text read; `clickNewTransaction()` button click.

**Q17. `ExpensePage.verifyTable()` kya check karta hai?**  
**A:** Table visible, kam se kam 1 row, optional expected text (jaise `"Grocery run"`).

**Q18. Constructor mein `page.getByTestId` kyun?**  
**A:** Object banate time saare locators bind — methods seedha unhe use karti hain.

---

## 5. Module: Tests (`tests/`)

**Q19. Kaun se test files hain?**  
**A:** `login.spec.ts`, `dashboard.spec.ts`, `expense.spec.ts`, `failure.spec.ts`

**Q20. Successful vs Invalid login mein farq?**  
**A:** Successful → email/password value + dashboard visible. Invalid → error text contain `"Invalid email or password"`.

**Q21. `failure.spec.ts` kyun fail karwate ho?**  
**A:** Allure screenshot verify karne ke liye — `getByTestId('non-existent')` intentionally fail.

**Q22. `describe` block ka faida?**  
**A:** Related tests group; Allure/report mein suite title milti hai.

---

## 6. Module: Faker (`utils/testData.ts`)

**Q23. Faker kyun use kiya?**  
**A:** Hard-coded data avoid — har run pe naya email/amount → better coverage, less flaky coupling.

**Q24. Helpers kaun se hain?**  
**A:** `generateRandomName`, `generateRandomEmail`, `generateRandomAmount`, `generateRandomExpenseDescription`

**Q25. Amount string kyun return karte ho?**  
**A:** `fill()` string leta hai; `"42.75"` form inputs ke liye ready.

---

## 7. Module: Allure + Config

**Q26. Allure kya hai?**  
**A:** Test reporting tool — pass/fail, steps, screenshots, environment info.

**Q27. Screenshot kab aata hai?**  
**A:** `screenshot: 'only-on-failure'` in `playwright.config.ts`

**Q28. `global-teardown.ts` kya karta hai?**  
**A:** Suite ke baad `allure generate` → `allure-report/` HTML banata hai.

**Q29. `npx allure` kyun, seedha `allure` nahi?**  
**A:** Package local `node_modules` mein hai; PATH pe global command nahi hoti.

**Q30. CI mein kya hota hai?**  
**A:** GitHub Actions: install deps + browsers, tests run, Allure/report artifacts upload.

---

# PART B — 2 YEARS EXPERIENCE

## 1. Architecture & design

**Q1. Is framework ka architecture explain karo.**  
**A:** Layered: Mock UI → POM (`pages`) → Specs (`tests`) → Data (`utils`) → Reporting (Allure) → CI. Specs business flow likhti hain; selectors POM mein; config central.

**Q2. POM ke trade-offs?**  
**A:** **Pros:** reuse, maintainability, readable tests. **Cons:** over-abstraction, sync cost jab UI badle. Is project mein thin POM (actions + locators) — good balance.

**Q3. Kyun sirf `getByTestId`, role/text nahi?**  
**A:** Assignment constraint + stability. Production mein mix better: role/label accessibility + testid critical paths. Yahan mock pe testids guaranteed.

**Q4. `page.setContent` vs `goto` — kab kya?**  
**A:** `setContent` = offline/fixture HTML, component-level. `goto` = real deployed app, auth, routing, APIs. Integration/E2E ke liye usually `goto` + staging.

**Q5. Static mock se kaunse risks cover nahi hote?**  
**A:** Real auth, API failures, race conditions, navigation, JS validation, network flakiness. Framework design practice hai, full E2E risk coverage nahi.

---

## 2. Playwright deep dive

**Q6. Auto-waiting kya hai?**  
**A:** Playwright actions se pehle element actionable hone ka wait (visible, enabled, stable). Manual `waitForTimeout` avoid karna best practice.

**Q7. `fill` vs `type`?**  
**A:** `fill` clear+set value (fast, reliable forms). `type` key-by-key (keydown handlers test karne pe). Forms pe `fill` prefer.

**Q8. Test isolation kaise ensure ki?**  
**A:** `beforeEach` mein naya `setContent` + naye POM instances; Faker se unique data; parallel-safe kyunki shared server/DB nahi.

**Q9. Flaky tests ke common causes + aap ka approach?**  
**A:** Hard waits, shared state, strict selectors on dynamic text. Approach: testids, auto-wait assertions, isolation, retries only on CI (`retries: 2`), traces on retry.

**Q10. Multi-browser projects ka faida?**  
**A:** Chromium/Firefox/WebKit pe same specs — cross-browser regressions. Cost: runtime. CI pe selective browsers bhi strategy ho sakti hai.

**Q11. Trace / video kab enable karte ho?**  
**A:** Config: `trace: 'on-first-retry'`, `video: 'retain-on-failure'` — storage save + failure debugging.

---

## 3. POM module (deeper)

**Q12. Assertions POM mein (`verifyTable`) vs spec mein — opinion?**  
**A:** Reusable domain checks POM/helper mein OK; business “what to assert” often specs mein clearer. Yahan `verifyTable` reusable table health check hai — acceptable. Overloading POM with every expect avoid karo.

**Q13. Page objects mein `readonly Locator` kyun?**  
**A:** Immutability after construct; accidental reassignment avoid; TypeScript clarity.

**Q14. Agar login ke baad alag URL/page aaye to design kaise badloge?**  
**A:** `login()` return `DashboardPage` (fluent). Separate pages per route. Waits on navigation (`waitForURL`). Abhi single mock page hai isliye sab ek saath.

**Q15. BasePage abstract class kab add karoge?**  
**A:** Jab common waits, screenshot helpers, shared nav menu teeno pages mein ho. Abhi 3 thin pages — BasePage premature hota.

---

## 4. Test strategy

**Q16. Positive vs negative cases is project mein?**  
**A:** Positive: successful login fields, add/save expense, dashboard visible. Negative: invalid login error; intentional failure for reporting.

**Q17. Test pyramid mein ye kahan fit?**  
**A:** UI/E2E-style layer (fixture-driven). Unit/API layers missing. Real product mein API tests + fewer UI flows better ROI.

**Q18. `failure.spec` ko CI mein kaise handle karoge?**  
**A:** Tag `@reporting` / separate project / `test.fail()` / nightly only — warna main pipeline hamesha red. Demo ke liye theek, production CI mein isolate.

**Q19. Seed table text `"Grocery run"` pe assert — risk?**  
**A:** Coupled to mock content. Better: testid per row cell, or fixture builder. Practice OK; maintainability weak if mock changes often.

---

## 5. Faker / test data

**Q20. Random data ke pitfalls?**  
**A:** Non-reproducible failures; edge cases miss. Mitigate: seed Faker for debug, constrained ranges (`generateRandomAmount(10,500)`), log generated values on fail.

**Q21. Test data strategies compare karo.**  
**A:** Hard-coded (simple, brittle), Faker (variety), fixtures/JSON (controlled), factories (complex objects), API setup (real E2E). Is project mein Faker + static mock seed.

---

## 6. Allure & reporting

**Q22. Allure results vs report difference?**  
**A:** `allure-results` = raw JSON/attachments. `allure-report` = generated HTML (`allure generate`). Teardown auto-generate karta hai.

**Q23. Screenshot Allure mein kaise attach hota hai?**  
**A:** Playwright `screenshot: 'only-on-failure'` → `allure-playwright` reporter auto-attach karta hai. Extra: `allure.attachment()` / `testInfo.attach()`.

**Q24. Reporting best practices for 2 YOE?**  
**A:** Steps (`allure.step`), epics/features, environmentInfo, flaky categorization, CI artifacts `if: always()`, don’t open HTML on CI, keep results gitignored.

**Q25. Java dependency for Allure — alternatives?**  
**A:** Allure CLI needs Java. Alternatives: Playwright HTML report, ReportPortal, custom dashboards. Team Java avoid kare to HTML reporter primary + Allure optional job.

---

## 7. Config, CI, TypeScript

**Q26. `fullyParallel` + `workers` decisions?**  
**A:** Parallel = speed. CI pe `workers: 1` stability (shared resources). Local more workers OK with isolated tests.

**Q27. `forbidOnly: !!process.env.CI` kyun?**  
**A:** Accidental `test.only` CI pe poora suite skip na kare — build fail.

**Q28. CI failing intentionally (`failure.spec`) — pipeline design?**  
**A:** Exit code non-zero. Options: move failure demo out of default `npm test`, use `continue-on-error` only for report job (careful), or `test.fix()` marking. Prefer exclude from smoke job.

**Q29. TypeScript ka value is framework mein?**  
**A:** Typed `Page`/`Locator`, IDE autocomplete, safer refactors, compile-time catch on POM APIs.

**Q30. Agar kal real API app aaye to migration plan?**  
**A:** Keep POM; replace `setContent` with `baseURL` + `goto`; add auth fixture/storageState; API setup/teardown; keep testids contract with devs; shrink UI tests to critical journeys; Allure/CI same.

---

## Quick “explain your project” (2 YOE — 60 sec)

> I built a Playwright–TypeScript UI automation framework for SmartSpend Expense Tracker. Tests run against a mock HTML fixture via `setContent` so we don’t need a live server. I used Page Object Model with `getByTestId` locators for Login, Dashboard, and Expense flows, Faker for dynamic test data, and Allure with screenshots-on-failure plus a global teardown to generate reports. Config covers Chromium/Firefox/WebKit and GitHub Actions publishes artifacts. It’s designed as a learning framework for structure and reporting; for production I’d point the same POM at a staging URL and add API-backed setup.

---

## Freshers — top 5 must-know

1. POM kya hai + `LoginPage.login()`
2. `getByTestId` + important test ids
3. `beforeEach` + `setContent`
4. Faker helpers kyun
5. Allure screenshot on failure

## 2 YOE — top 5 must-know

1. Architecture layers + mock limitations
2. Isolation, flakiness, waits
3. POM boundaries (assertions placement)
4. Allure results vs report + CI artifacts
5. How you’d evolve this to real staging E2E
