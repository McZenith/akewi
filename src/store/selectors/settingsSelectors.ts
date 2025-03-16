import { RootState } from '../index';

// Select the entire settings state
export const selectSettings = (state: RootState) => state.settings;

// Select individual settings
export const selectLanguage = (state: RootState) => state.settings.language;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectTextSize = (state: RootState) => state.settings.textSize;
export const selectNotifications = (state: RootState) => state.settings.notifications;
export const selectAutoplay = (state: RootState) => state.settings.autoplay;

// Helper function to check if Yoruba is selected
export const selectIsYorubaActive = (state: RootState) => state.settings.language === 'yo';

// Helper function to determine if dark mode is active
export const selectIsDarkMode = (state: RootState) => {
  const theme = state.settings.theme;

  if (theme === 'dark') return true;
  if (theme === 'light') return false;

  // For system theme, we'd normally detect the device theme here,
  // but for simplicity in this example we'll just return false
  return false;
};
