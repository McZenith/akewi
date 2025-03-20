---
description: Coding standards for the Akewi project
globs: ["**/*.{ts,tsx}"]
---

# Coding Standards

## Typescript Usage

- Always use TypeScript for all new code
- Define explicit types for all function parameters, return values, and component props
- Avoid using `any` type; prefer using more specific types or `unknown` when necessary
- Use TypeScript's utility types (`Partial<T>`, `Pick<T>`, `Omit<T>`, etc.)

## Functions

- Always use arrow functions where possible
- Use named exports instead of default exports
- Functions should follow the single responsibility principle
- Add JSDoc comments for all public functions

```typescript
// ❌ Don't use function declarations 
function fetchUser(id: string) {
  // implementation
}

// ✅ Use arrow functions
const fetchUser = (id: string): Promise<User> => {
  // implementation
};
```

## Components

- Use functional components with hooks
- Always define Props interface for components
- Use arrow functions for components
- Destructure props at the function parameter level

```typescript
// ❌ Don't use regular function components
function Button({ label, onPress }: ButtonProps) {
  return (
    // implementation
  );
}

// ✅ Use arrow function components
const Button = ({ label, onPress }: ButtonProps) => (
  // implementation
);
```

## Imports & Exports

- Group imports in the following order:
  1. External libraries
  2. Internal absolute imports
  3. Relative imports
- Add an empty line between each group
- Use named exports rather than default exports

## State Management

- Use Redux Toolkit for global state management
- Keep Redux actions and state normalized
- Use React Query for server state when appropriate
- Use local state for UI-only state
- Follow MVVM pattern as described in architecture docs

## Async Code

- Use async/await instead of Promise chaining
- Handle errors appropriately with try/catch
- Use loading and error states for all async operations

## Error Handling

- Create custom error classes for different types of errors
- Add error boundaries around key components
- Log errors to a monitoring service in production 