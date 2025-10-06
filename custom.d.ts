/**
 * Custom Type Declarations
 * This file adds type declarations for modules that may not have proper TypeScript typings
 */

// Express module declarations
declare module 'express' {
  import * as e from '@types/express';
  export = e;
}

// Jest globals declaration
declare global {
  // Explicitly declare Jest testing globals
  const describe: jest.Describe;
  const it: jest.It;
  const test: jest.It;
  const expect: jest.Expect;
  const beforeAll: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const beforeEach: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
  
  // Custom matchers
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWithMatch(...args: any[]): R;
    }
  }
}

// Explicitly import Jest types for test files
declare namespace jest {
  interface Describe { (name: string, fn: () => void): void; }
  interface It { (name: string, fn: () => void): void; }
  interface Expect { (actual: any): any; }
  interface Lifecycle { (fn: () => void): void; }
}

// For modules that don't have types
declare module '*.json' {
  const value: any;
  export default value;
}

// Allow importing any module without type errors
declare module '*';

// Ensure .js files can be imported without errors
declare module '*.js';