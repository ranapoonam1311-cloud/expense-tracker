import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generates the Allure HTML report after every Playwright run.
 * Requires Java (used by allure-commandline).
 */
async function globalTeardown(): Promise<void> {
  const resultsDir = path.resolve('allure-results');
  const reportDir = path.resolve('allure-report');

  if (!fs.existsSync(resultsDir) || fs.readdirSync(resultsDir).length === 0) {
    console.warn('[allure] No results found in allure-results; skipping report generation.');
    return;
  }

  try {
    execSync(
      `npx allure generate "${resultsDir}" --clean -o "${reportDir}"`,
      { stdio: 'inherit' },
    );
    console.log(`[allure] Report generated at ${reportDir}`);
  } catch (error) {
    console.warn(
      '[allure] Failed to generate report. Ensure Java is installed for allure-commandline.',
      error,
    );
  }
}

export default globalTeardown;
