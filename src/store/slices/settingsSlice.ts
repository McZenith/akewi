import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18next from '../../i18n';

// Define the type for the settings state
export interface SettingsState {
  language: 'en' | 'yo';
  theme: 'light' | 'dark' | 'system';
  textSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  autoplay: boolean;
}

// Define the initial state
const initialState: SettingsState = {
  language: (i18next.language as 'en' | 'yo') || 'en',
  theme: 'system',
  textSize: 'medium',
  notifications: true,
  autoplay: true,
};

// Create the settings slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'yo'>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setTextSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.textSize = action.payload;
    },
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
    setAutoplay: (state, action: PayloadAction<boolean>) => {
      state.autoplay = action.payload;
    },
    resetSettings: _state => initialState,
  },
});

// Middleware to sync language changes with i18next
export const languageMiddleware = store => next => action => {
  const result = next(action);

  if (action.type === 'settings/setLanguage') {
    // Update i18next language when Redux state changes
    const languageCode = action.payload;
    i18next.changeLanguage(languageCode).catch(error => {
      console.error('Failed to change language in i18next:', error);
    });
  }

  return result;
};

// Export the actions
export const { setLanguage, setTheme, setTextSize, setNotifications, setAutoplay, resetSettings } =
  settingsSlice.actions;

// Export the reducer
export default settingsSlice.reducer;
