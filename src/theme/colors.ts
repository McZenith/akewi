export const colors = {
  // Base colors
  background: '#F6F6F6',
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',

  // Text colors
  text: {
    primary: '#090909',
    secondary: '#54555C',
    placeholder: '#878787',
    alternative: '#737682',
  },

  // Button colors
  button: {
    primary: '#090909',
    primaryText: '#FFFFFF',
    social: {
      border: '#C4C4C4',
      text: '#000000',
    },
  },

  // Form colors
  form: {
    background: 'rgba(255, 255, 255, 0.95)',
    backgroundFocused: '#FFFFFF',
    backgroundError: 'rgba(255, 59, 48, 0.05)',
    border: '#C4C4C4',
    error: '#FF3B30',
  },

  // Voice button
  voice: {
    background: '#FF6363',
    active: '#FF8080',
    backgroundLight: 'rgba(255, 99, 99, 0.05)',
  },

  // Gradient colors
  gradient: {
    start: 'rgba(255, 255, 255, 0)',
    middle: '#FFFFFF',
    end: '#FFFFFF',
  },
} as const;

export type Colors = typeof colors;
export type ColorKeys = keyof typeof colors;
