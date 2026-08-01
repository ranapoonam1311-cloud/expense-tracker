// defineConfig types the Playwright config object; devices provides browser presets.
import { defineConfig, devices } from '@playwright/test';
// OS helpers used to stamp Allure environment info.
import { platform, release } from 'node:os';
// Node runtime version for Allure environment metadata.
import { version as nodeVersion } from 'node:process';

/**
 * Root Playwright configuration for the SmartSpend expense framework.
 * Controls where tests live, how they run, reporters, and browser projects.
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Folder containing *.spec.ts test files.
  testDir: './tests',
  // Run independent tests in files in parallel for speed.
  fullyParallel: true,
  // On CI, fail the build if someone left test.only in the code.
  forbidOnly: !!process.env.CI,
  // Retry failed tests twice on CI only; locally fail fast (0 retries).
  retries: process.env.CI ? 2 : 0,
  // On CI use 1 worker for stability; locally use Playwright's default.
  workers: process.env.CI ? 1 : undefined,
  // After the whole run, generate the Allure HTML report.
  globalTeardown: './global-teardown.ts',
  // Reporters: console list + Playwright HTML + Allure raw results.
  reporter: [
    // Human-readable line-by-line results in the terminal.
    ['list'],
    // Built-in HTML report; do not auto-open a browser after the run.
    ['html', { open: 'never' }],
    // Allure Playwright adapter writes JSON/attachments into resultsDir.
    [
      'allure-playwright',
      {
        // Directory for Allure raw result files.
        resultsDir: 'allure-results',
        // Include Playwright step details in the Allure report.
        detail: true,
        // Use describe titles as suite names in Allure.
        suiteTitle: true,
        // Extra environment metadata shown on the Allure overview.
        environmentInfo: {
          // e.g. "darwin"
          os_platform: platform(),
          // OS release string
          os_release: release(),
          // e.g. "v22.x.x"
          node_version: nodeVersion,
        },
      },
    ],
  ],
  // Shared browser context options for every test.
  use: {
    // Capture a PNG screenshot automatically when a test fails (Allure attaches it).
    screenshot: 'only-on-failure',
    // Keep a trace zip on the first retry to help debug flakes.
    trace: 'on-first-retry',
    // Record video and keep it only when the test fails.
    video: 'retain-on-failure',
  },
  // Browser projects — same specs run on each configured engine.
  projects: [
    {
      // Google Chrome / Chromium desktop profile.
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Firefox desktop profile.
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      // WebKit / Safari desktop profile.
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
