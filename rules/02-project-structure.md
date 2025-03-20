---
description: Project structure rules for the Akewi application
globs: ["**/*"]
---

# Project Structure

## Directory Organization

Follow the Clean Architecture with MVVM pattern described in the architecture documentation:

```
src/
├── app/                      # Expo Router file-based routing
├── components/               # Reusable components
│   ├── base/                 # Base UI components
│   ├── forms/                # Form-related components
│   ├── media/                # Media-related components
│   ├── user/                 # User-related components 
│   ├── oriki/                # Oriki-specific components
│   ├── layout/               # Layout components
│   └── modals/               # Modal components
├── hooks/                    # Custom React hooks
├── store/                    # Redux state management
│   ├── slices/               # Redux slices
│   └── selectors/            # Reselect selectors
├── services/                 # API and external services
│   ├── api/                  # API clients
│   ├── audio/                # Audio services
│   └── storage/              # Local storage services
├── utils/                    # Utility functions
├── constants/                # App constants
├── assets/                   # Static assets
└── i18n/                     # Internationalization
```

## Naming Conventions

- **Directories**: Use lowercase, hyphen-separated names for directories
- **Files**:
  - React components: PascalCase with `.tsx` extension (e.g., `Button.tsx`)
  - Hooks: camelCase prefixed with `use` and `.ts` extension (e.g., `useForm.ts`)
  - Utilities: camelCase with `.ts` extension (e.g., `validation.ts`)
  - Redux: camelCase with descriptive suffixes (e.g., `userSlice.ts`, `authActions.ts`)
  - Types: PascalCase with `.ts` extension (e.g., `User.ts`)

## File Organization

- **Components**:
  - Each component should have its own file, named after the component
  - Complex components can have their own directory with index.tsx exposing the component
  - Put component-specific types, styles, and helper functions in the same directory

- **Routes**:
  - Follow Expo Router conventions for file-based routing
  - Group related routes in directories (e.g., `(auth)`, `(main)`)
  - Use `_layout.tsx` for route layouts
  - Use `index.tsx` for main route screens
  - Use `[param].tsx` pattern for dynamic routes

## Clean Architecture Implementation

Follow these guidelines for implementing Clean Architecture:

1. **Presentation Layer (UI/View)**:
   - React components and screens
   - Navigation and screen layouts
   - UI state using hooks

2. **Presentation Logic (ViewModel)**:
   - Redux slices and actions
   - React Query cache
   - Local component state management

3. **Domain Layer**:
   - Business logic in use cases
   - Entity interfaces
   - Repository interfaces

4. **Data Layer**:
   - Repository implementations
   - API clients
   - Local storage services

Example implementations:

```typescript
// Domain Entity (src/types/User.ts)
export interface User {
  id: string;
  name: string;
  state: string;
  town: string;
  family: string | null;
}

// Domain Repository Interface (src/services/api/repositories/UserRepository.ts)
export interface UserRepository {
  getUserProfile(userId: string): Promise<User>;
  updateUserProfile(userId: string, data: Partial<User>): Promise<User>;
}

// Data Repository Implementation (src/services/api/repositories/UserRepositoryImpl.ts)
export const userRepository: UserRepository = {
  getUserProfile: async (userId: string): Promise<User> => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  },
  
  updateUserProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.patch(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  }
};

// ViewModel (src/store/slices/userSlice.ts)
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reducers...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.profile = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      });
  }
});
``` 