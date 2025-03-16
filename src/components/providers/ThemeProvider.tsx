import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../../store';
import { selectTheme } from '../../store/selectors/settingsSelectors';
import { lightTheme, darkTheme } from '../../constants/theme';

// Define the theme type
export type Theme = typeof lightTheme;

// Create the theme context
export const ThemeContext = createContext<{
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

// ThemeProvider component that handles theme switching
const ThemeProvider = ({ children }: PropsWithChildren) => {
  // Get the device color scheme
  const deviceColorScheme = useColorScheme();

  // Get the user's theme preference from Redux
  const themePreference = useAppSelector(selectTheme);

  // Initialize theme state
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);
  const [isDark, setIsDark] = useState(false);

  // Determine the active theme based on the user's preference and device settings
  useEffect(() => {
    let newTheme: Theme;
    let newIsDark: boolean;

    if (themePreference === 'system') {
      // Use the device color scheme
      newTheme = deviceColorScheme === 'dark' ? darkTheme : lightTheme;
      newIsDark = deviceColorScheme === 'dark';
    } else {
      // Use the user's explicit preference
      newTheme = themePreference === 'dark' ? darkTheme : lightTheme;
      newIsDark = themePreference === 'dark';
    }

    setCurrentTheme(newTheme);
    setIsDark(newIsDark);
  }, [themePreference, deviceColorScheme]);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    // This is just for development/testing
    // In production, this should update the Redux store
    setCurrentTheme(isDark ? lightTheme : darkTheme);
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
