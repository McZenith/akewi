import { Theme } from '../components/providers/ThemeProvider';
import { Platform } from 'react-native';

// Helper function to get shadow styles based on elevation
export const getShadow = (theme: Theme, elevation: 'sm' | 'md' | 'lg') => theme.shadows[elevation];

// Helper to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number) => {
  // Check if the color is a valid hex color
  const isHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);

  if (!isHex) {
    return color; // Return original if not a hex color
  }

  // Convert hex to rgba
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace('#', '');

    // Handle shorthand notation
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(c => c + c)
        .join('');
    }

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  };

  const { r, g, b } = hexToRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Helper to determine if running on web
export const isWeb = Platform.OS === 'web';

// Helper to create responsive spacing
export const responsive = (theme: Theme, size: keyof typeof theme.spacing) => theme.spacing[size];
