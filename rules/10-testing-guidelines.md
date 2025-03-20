---
description: Testing guidelines for the Akewi application
globs: ["**/*.test.ts", "**/*.test.tsx", "**/jest.config.js"]
---

# Testing Guidelines

## Testing Framework

The Akewi app uses Jest and React Native Testing Library for testing.

## Test Types

Implement the following types of tests:

### 1. Unit Tests

- Test individual functions, hooks, and utilities
- Focus on pure logic and data transformations
- Should be fast and isolated

### 2. Component Tests

- Test UI components in isolation
- Verify rendering, interactions, and state changes
- Mock dependencies and context providers

### 3. Integration Tests

- Test interactions between multiple components
- Verify data flow and component communication
- Include Redux store integration tests

### 4. End-to-End Tests

- Test complete user flows
- Simulate user interactions across multiple screens
- Focus on critical user journeys

## Directory Structure

Structure test files as follows:

```
src/
├── components/
│   ├── Button.tsx
│   └── __tests__/
│       └── Button.test.tsx
├── hooks/
│   ├── useForm.ts
│   └── __tests__/
│       └── useForm.test.ts
├── utils/
│   ├── validation.ts
│   └── __tests__/
│       └── validation.test.ts
```

## Component Testing

Use React Native Testing Library to test components:

```typescript
// Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button label="Press me" onPress={() => {}} />
    );
    
    expect(getByText('Press me')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button label="Press me" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Press me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when isDisabled is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button label="Press me" onPress={onPressMock} isDisabled={true} />
    );
    
    fireEvent.press(getByText('Press me'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
```

## Hook Testing

Test custom hooks with React Hooks Testing Library:

```typescript
// useForm.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../useForm';

describe('useForm', () => {
  it('initializes with default values', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });
  
  it('updates values on handleChange', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));
    
    act(() => {
      result.current.handleChange('name', 'John Doe');
    });
    
    expect(result.current.values.name).toBe('John Doe');
  });
  
  it('validates form values', () => {
    const initialValues = { name: '', email: '' };
    const validationSchema = {
      name: { required: 'Name is required' },
      email: { required: 'Email is required', email: 'Invalid email format' }
    };
    
    const { result } = renderHook(() => useForm(initialValues, validationSchema));
    
    act(() => {
      result.current.validate();
    });
    
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.errors.email).toBe('Email is required');
  });
});
```

## Redux Testing

Test Redux slices, selectors, and thunks:

```typescript
// userSlice.test.ts
import userReducer, { 
  setLanguagePreference, 
  clearUserProfile 
} from '../userSlice';

describe('User Slice', () => {
  const initialState = {
    profile: {
      id: '123',
      name: 'Test User',
      preferredLanguage: 'english',
    },
    stats: {
      contributions: 5,
      streams: 100,
    },
    loading: {
      profile: false,
      stats: false,
      updateProfile: false,
    },
    error: {
      profile: null,
      stats: null,
      updateProfile: null,
    },
  };
  
  it('should handle initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual({
      profile: null,
      stats: null,
      loading: {
        profile: false,
        stats: false,
        updateProfile: false,
      },
      error: {
        profile: null,
        stats: null,
        updateProfile: null,
      },
    });
  });
  
  it('should handle setLanguagePreference', () => {
    const actual = userReducer(
      initialState, 
      setLanguagePreference('yoruba')
    );
    
    expect(actual.profile.preferredLanguage).toEqual('yoruba');
  });
  
  it('should handle clearUserProfile', () => {
    const actual = userReducer(initialState, clearUserProfile());
    
    expect(actual.profile).toBeNull();
    expect(actual.stats).toBeNull();
  });
});
```

Test async thunks:

```typescript
// userThunks.test.ts
import { fetchUserProfile } from '../userThunks';
import { userRepository } from '../../services/api/repositories/UserRepositoryImpl';

// Mock the repository
jest.mock('../../services/api/repositories/UserRepositoryImpl');

describe('User Thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('creates user/fetchProfile/fulfilled when fetching succeeds', async () => {
    const mockUser = { id: '123', name: 'Test User' };
    userRepository.getUserProfile = jest.fn().mockResolvedValue(mockUser);
    
    const dispatch = jest.fn();
    const thunk = fetchUserProfile('123');
    
    await thunk(dispatch, () => ({}), undefined);
    
    const { calls } = dispatch.mock;
    expect(calls[0][0].type).toEqual('user/fetchProfile/pending');
    expect(calls[1][0].type).toEqual('user/fetchProfile/fulfilled');
    expect(calls[1][0].payload).toEqual(mockUser);
  });
  
  it('creates user/fetchProfile/rejected when fetching fails', async () => {
    const errorMessage = 'Failed to fetch user profile';
    userRepository.getUserProfile = jest.fn().mockRejectedValue(new Error(errorMessage));
    
    const dispatch = jest.fn();
    const thunk = fetchUserProfile('123');
    
    await thunk(dispatch, () => ({}), undefined);
    
    const { calls } = dispatch.mock;
    expect(calls[0][0].type).toEqual('user/fetchProfile/pending');
    expect(calls[1][0].type).toEqual('user/fetchProfile/rejected');
    expect(calls[1][0].payload).toEqual(errorMessage);
  });
});
```

## Mocking

### Mock Context Providers

Wrap components in necessary context providers for testing:

```typescript
// TestProviders.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { LanguageProvider } from '../i18n/LanguageContext';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../store/rootReducer';

const createTestStore = (preloadedState) => 
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export const TestProviders = ({ children, preloadedState = {} }) => {
  const store = createTestStore(preloadedState);
  
  return (
    <Provider store={store}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </Provider>
  );
};

// In tests
import { render } from '@testing-library/react-native';
import { TestProviders } from '../utils/TestProviders';

const renderWithProviders = (ui, options = {}) => 
  render(ui, { wrapper: (props) => <TestProviders {...props} {...options} />, ...options });
  
// Use in tests
const { getByText } = renderWithProviders(<MyComponent />);
```

### Mock API Calls

Use Jest to mock API calls:

```typescript
// Mock the entire API client
jest.mock('../../services/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

// In tests
import { apiClient } from '../../services/api/client';

beforeEach(() => {
  jest.clearAllMocks();
});

it('fetches user data', async () => {
  const mockUserData = { id: '123', name: 'Test User' };
  apiClient.get.mockResolvedValueOnce(mockUserData);
  
  // Test component or hook that uses apiClient
});
```

## Test Coverage

Aim for the following coverage targets:

- Unit tests: 90%+ coverage
- Component tests: 80%+ coverage
- Integration tests: Focus on key user flows
- End-to-end tests: Critical user journeys

Run coverage reports regularly:

```bash
npm test -- --coverage
```

## Testing Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it's implemented
2. **Keep Tests DRY**: Extract common setup and utilities
3. **Isolated Tests**: Each test should be independent of others
4. **Readable Tests**: Use descriptive test names and clear assertions
5. **Fast Tests**: Optimize for quick feedback cycles
6. **Test Edge Cases**: Include edge cases and error scenarios
7. **Mock Appropriately**: Only mock what's necessary
8. **Snapshot Testing**: Use sparingly for stable components
9. **Continuous Integration**: Run tests on each PR
10. **Test Accessibility**: Verify accessibility properties 