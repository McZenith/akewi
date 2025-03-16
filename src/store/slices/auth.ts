import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email?: string;
    phone?: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

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
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
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
        state.user = action.payload;
      })
      .addCase(loginStart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
