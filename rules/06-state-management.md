---
description: State management rules for the Akewi application
globs: ["**/store/**", "**/hooks/**", "**/*.tsx"]
---

# State Management Guidelines

## Architecture

The Akewi app follows the MVVM pattern (Model-View-ViewModel) with Redux as the primary state management solution:

- **Model**: Data entities and business logic
- **View**: React Native components
- **ViewModel**: Redux slices and selectors

## Redux Implementation

### Store Structure

```
/src
  /store
    index.ts              # Store configuration
    middleware.ts         # Redux middleware 
    /slices               # Redux slices
      authSlice.ts        # Authentication state
      userSlice.ts        # User profile state
      contentSlice.ts     # Oriki content state
      audioSlice.ts       # Audio playback state
      settingsSlice.ts    # App settings
    /selectors            # Reselect selectors
      userSelectors.ts    # User-related selectors
```

### State Organization

Follow this general structure for Redux state:

```typescript
// Example shape of the root state
interface RootState {
  // Authentication state
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    authMethod: 'email' | 'phone' | 'social' | null;
    verificationId: string | null;
  };

  // User profile state
  user: {
    profile: {
      id: string;
      name: string;
      state: string;
      town: string;
      family: string | null;
      profileImage: string | null;
      preferredLanguage: 'english' | 'yoruba';
      isProfileComplete: boolean;
    } | null;
    stats: {
      contributions: number;
      streams: number;
      lastContribution: string | null;
    } | null;
    loading: {
      profile: boolean;
      stats: boolean;
      updateProfile: boolean;
    };
    error: {
      profile: string | null;
      stats: string | null;
      updateProfile: string | null;
    };
  };

  // Content state, audio state, settings state, etc.
}
```

## Redux Toolkit Usage

Use Redux Toolkit for all Redux code:

1. Use `createSlice` for reducer logic
2. Use `createAsyncThunk` for async operations
3. Use Immer for immutable updates
4. Use selectors to access state

Example slice implementation:

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userRepository } from '../../services/api/repositories/UserRepositoryImpl';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userRepository.getUserProfile(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLanguagePreference: (state, action: PayloadAction<'english' | 'yoruba'>) => {
      if (state.profile) {
        state.profile.preferredLanguage = action.payload;
      }
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.payload as string;
      });
  },
});

export const { setLanguagePreference, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
```

## Selectors

Use Reselect for memoized selectors:

```typescript
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selectors
const selectUserState = (state: RootState) => state.user;

// Derived selectors
export const selectUserProfile = createSelector(
  [selectUserState],
  (userState) => ({
    profile: userState.profile,
    loading: userState.loading.profile,
    error: userState.error.profile
  })
);

export const selectIsProfileComplete = createSelector(
  [selectUserState],
  (userState) => userState.profile?.isProfileComplete || false
);
```

## Local State Management

Use local state for UI-specific state that doesn't need to be shared:

```tsx
// Component-specific state
const [isExpanded, setIsExpanded] = useState(false);
const [selectedTab, setSelectedTab] = useState('details');
```

## Custom Hooks

Extract complex state logic into custom hooks:

```typescript
// src/hooks/useUserProfile.ts
export const useUserProfile = (userId: string) => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector(selectUserProfile);
  
  useEffect(() => {
    if (userId && !profile && !loading && !error) {
      dispatch(fetchUserProfile(userId));
    }
  }, [userId, profile, loading, error, dispatch]);
  
  const updateProfile = useCallback(
    (data: Partial<User>) => {
      if (userId) {
        dispatch(updateUserProfileThunk({ userId, data }));
      }
    },
    [userId, dispatch]
  );
  
  return {
    profile,
    loading,
    error,
    updateProfile,
  };
};
```

## State Update Patterns

1. **Loading, Error, Data Pattern**: Always include loading and error states for async data

```typescript
{
  data: T | null,
  loading: boolean,
  error: string | null
}
```

2. **Normalized State**: Use normalized state for collections of entities

```typescript
{
  entities: {
    [id: string]: Entity
  },
  ids: string[]
}
```

3. **Granular Loading States**: Use object for multiple loading states

```typescript
loading: {
  profile: boolean,
  stats: boolean,
  update: boolean
}
```

## Context API Usage

Use React Context for:

1. Theme/appearance settings
2. Localization settings
3. Authentication state (can be combined with Redux)
4. App-wide feature flags

Do NOT use Context for:
1. Frequently changing data
2. Complex business logic
3. Large state objects

## Best Practices

1. Keep Redux state normalized
2. Use selectors to access state
3. Separate data fetching from rendering
4. Handle loading and error states consistently
5. Use thunks or middleware for side effects
6. Select only the data you need from the store
7. Use immer for immutable updates
8. Never mutate Redux state directly 