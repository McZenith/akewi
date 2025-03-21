import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import settingsReducer, { languageMiddleware } from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(languageMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
