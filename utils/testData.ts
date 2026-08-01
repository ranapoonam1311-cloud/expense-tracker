import { faker } from '@faker-js/faker';

export function generateRandomName(): string {
  return faker.person.fullName();
}

export function generateRandomEmail(): string {
  return faker.internet.email();
}

/** Returns a decimal amount as a string suitable for form inputs (e.g. "42.75"). */
export function generateRandomAmount(min = 1, max = 9999): string {
  return faker.number.float({ min, max, fractionDigits: 2 }).toFixed(2);
}

export function generateRandomExpenseDescription(): string {
  return faker.commerce.productDescription();
}
