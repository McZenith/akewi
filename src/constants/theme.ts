// Base colors shared across themes
const baseColors = {
  primary: '#C73D10',
  primaryDark: '#A32E0B',
  primaryLight: '#E85C33',
  secondary: '#2A9D8F',
  secondaryDark: '#227F74',
  secondaryLight: '#4DB8AB',
  accent1: '#E9C46A',
  accent2: '#264653',
  success: '#48BB78',
  warning: '#F6AD55',
  error: '#F56565',
  info: '#4299E1',
};

// Light theme colors
const lightColors = {
  ...baseColors,
  background: '#FFFFFF',
  card: '#F7F7F7',
  text: '#212121',
  textSecondary: '#757575',
  textMuted: '#9E9E9E',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Dark theme colors
const darkColors = {
  ...baseColors,
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#999999',
  border: '#333333',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 42,
  },
};

// Shadows
export const shadows = {
  light: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  dark: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

// Light theme
export const lightTheme = {
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
  shadows: shadows.light,
  isDark: false,
};

// Dark theme
export const darkTheme = {
  colors: darkColors,
  spacing,
  borderRadius,
  typography,
  shadows: shadows.dark,
  isDark: true,
};

// Default export with light and dark themes
export default {
  light: lightTheme,
  dark: darkTheme,
};
