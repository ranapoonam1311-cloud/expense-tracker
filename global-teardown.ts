// execSync runs shell commands synchronously (used to invoke Allure CLI).
import { execSync } from 'child_process';
// fs checks whether result folders exist and are non-empty.
import * as fs from 'fs';
// path builds absolute paths in a cross-platform way.
import * as path from 'path';

/**
 * Playwright global teardown — runs once after the entire test suite finishes.
 * Purpose: convert allure-results/ into a browsable allure-report/ HTML site.
 * Prerequisite: Java must be installed (allure-commandline depends on it).
 */
async function globalTeardown(): Promise<void> {
  // Absolute path to raw Allure result files produced by allure-playwright.
  const resultsDir = path.resolve('allure-results');
  // Absolute path where the generated HTML report should be written.
  const reportDir = path.resolve('allure-report');

  // Skip generation if there is nothing to report (missing or empty folder).
  if (!fs.existsSync(resultsDir) || fs.readdirSync(resultsDir).length === 0) {
    // Warn so developers know why no report appeared.
    console.warn('[allure] No results found in allure-results; skipping report generation.');
    // Exit teardown successfully without throwing.
    return;
  }

  try {
    // Run Allure CLI: generate report from results, wipe old report, write to reportDir.
    execSync(
      `npx allure generate "${resultsDir}" --clean -o "${reportDir}"`,
      // inherit streams so Allure CLI output appears in the same terminal.
      { stdio: 'inherit' },
    );
    // Confirm success with the output folder path.
    console.log(`[allure] Report generated at ${reportDir}`);
  } catch (error) {
    // Do not fail the whole Playwright process solely because report gen failed.
    console.warn(
      '[allure] Failed to generate report. Ensure Java is installed for allure-commandline.',
      error,
    );
  }
}

// Playwright loads this default export as the global teardown hook.
export default globalTeardown;
