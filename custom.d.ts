// Type declarations for modules without typings

declare module 'express' {
  export = express;
}

// Explicitly import Jest types for test files
declare namespace jest {
  interface Describe { (name: string, fn: () => void): void; }
  interface It { (name: string, fn: () => void): void; }
  interface Expect { (actual: any): any; }
  interface Lifecycle { (fn: () => void): void; }
}