import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// Types
export type LoginIdentifierType = 'email' | 'phone' | null;
export type VerificationMethod = 'email' | 'phone' | 'social' | null;

export interface User {
  id: string;
  name: string;
  state: string;
  town: string;
  family?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface UserDetails {
  name: string;
  state: string;
  town: string;
  family?: string;
}

// For updating single field
export interface UserFieldUpdate {
  field: keyof UserDetails;
  value: string;
}

interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  // Login state
  loginIdentifier: string;
  loginIdentifierType: LoginIdentifierType;

  // Verification state
  verificationId: string | null;
  verificationMethod: VerificationMethod;

  // User details state
  userDetails: UserDetails | null;
}

const initialState: AuthState = {
  // Authentication state
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,

  // Login state
  loginIdentifier: '',
  loginIdentifierType: null,

  // Verification state
  verificationId: null,
  verificationMethod: null,

  // User details state
  userDetails: null,
};

// Async actions
export const loginStart = createAsyncThunk(
  'auth/loginStart',
  async (
    {
      identifier,
      type,
      provider,
    }: {
      identifier?: string;
      type?: 'email' | 'phone' | null;
      provider?: 'google' | 'apple';
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Implement actual API call
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (provider) {
        return {
          id: '123',
          email: 'user@example.com',
        };
      }

      return {
        id: '123',
        [type === 'email' ? 'email' : 'phone']: identifier,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    setLoginIdentifier: (
      state,
      action: PayloadAction<{ identifier: string; type: LoginIdentifierType }>
    ) => {
      state.loginIdentifier = action.payload.identifier;
      state.loginIdentifierType = action.payload.type;
      state.error = null;
    },

    // Verification actions
    startVerification: (
      state,
      action: PayloadAction<{ method: VerificationMethod; verificationId: string }>
    ) => {
      state.verificationMethod = action.payload.method;
      state.verificationId = action.payload.verificationId;
      state.loading = false;
      state.error = null;
    },

    // Authentication status actions
    setAuthenticated: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },

    // User details actions
    setUserDetails: (state, action: PayloadAction<UserDetails>) => {
      state.userDetails = action.payload;
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Update single user field
    updateUserField: (state, action: PayloadAction<UserFieldUpdate>) => {
      const { field, value } = action.payload;
      if (state.userDetails) {
        state.userDetails = { ...state.userDetails, [field]: value };
      } else {
        // Initialize userDetails object if it doesn't exist yet
        state.userDetails = {
          name: field === 'name' ? value : '',
          state: field === 'state' ? value : '',
          town: field === 'town' ? value : '',
          family: field === 'family' ? value : '',
        };
      }

      // Also update the user object if it exists
      if (state.user) {
        state.user = { ...state.user, [field]: value };
      }
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      state.error = null;
    },

    // Error handling
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Logout
    logout: state => ({ ...initialState }),

    // Clear specific states
    clearError: state => {
      state.error = null;
    },

    clearVerification: state => {
      state.verificationId = null;
      state.verificationMethod = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginStart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStart.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload as User;
      })
      .addCase(loginStart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setLoginIdentifier,
  startVerification,
  setAuthenticated,
  setUserDetails,
  updateUserField,
  setLoading,
  setError,
  logout,
  clearError,
  clearVerification,
} = authSlice.actions;

// Export reducer
export const authReducer = authSlice.reducer;

// Also export the slice as default
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectLoginIdentifier = (state: { auth: AuthState }) => ({
  identifier: state.auth.loginIdentifier,
  type: state.auth.loginIdentifierType,
});
export const selectVerification = (state: { auth: AuthState }) => ({
  id: state.auth.verificationId,
  method: state.auth.verificationMethod,
});
export const selectUserDetails = (state: { auth: AuthState }) => state.auth.userDetails;
