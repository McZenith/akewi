import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  language: 'en',
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

// Export the actions
export const { setLanguage, setTheme, setTextSize, setNotifications, setAutoplay, resetSettings } =
  settingsSlice.actions;

// Export the reducer
export default settingsSlice.reducer;
