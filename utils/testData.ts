// Faker library generates realistic random test data for each run.
import { faker } from '@faker-js/faker';

/**
 * Builds a random full person name (first + last).
 * @returns Example: "Ada Lovelace"
 */
export function generateRandomName(): string {
  // person.fullName() returns a locale-aware human name.
  return faker.person.fullName();
}

/**
 * Builds a random email address for login / user fields.
 * @returns Example: "ada.lovelace@example.com"
 */
export function generateRandomEmail(): string {
  // internet.email() creates a valid-looking email string.
  return faker.internet.email();
}

/**
 * Builds a random money amount as a string with 2 decimal places.
 * String form is ideal for Playwright fill() on number inputs.
 * @param min - Minimum amount (default 1)
 * @param max - Maximum amount (default 9999)
 * @returns Example: "42.75"
 */
export function generateRandomAmount(min = 1, max = 9999): string {
  // float with fractionDigits: 2 → number like 42.7; toFixed(2) → "42.70".
  return faker.number.float({ min, max, fractionDigits: 2 }).toFixed(2);
}

/**
 * Builds a random product-style description usable as an expense note.
 * @returns Example: "Ergonomic wooden keyboard"
 */
export function generateRandomExpenseDescription(): string {
  // commerce.productDescription() yields a short descriptive sentence/phrase.
  return faker.commerce.productDescription();
}
