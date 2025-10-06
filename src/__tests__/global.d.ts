// This file ensures Jest testing globals are recognized by TypeScript
import '@types/jest';

declare global {
  // Explicitly declare Jest globals to ensure TypeScript recognizes them
  const describe: jest.Describe;
  const it: jest.It;
  const test: jest.It;
  const expect: jest.Expect;
  const beforeAll: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const beforeEach: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
}