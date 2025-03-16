import { Dimensions } from 'react-native';

// Design screen dimensions from Figma (in pixels)
export const DESIGN_WIDTH = 393; // 24.5625rem * 16
export const DESIGN_HEIGHT = 852; // 53.25rem * 16

// Get current screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Scale factor based on screen width
const widthScale = SCREEN_WIDTH / DESIGN_WIDTH;
const heightScale = SCREEN_HEIGHT / DESIGN_HEIGHT;

// Use this for scaling sizes based on screen width
export const scale = (size: number): number => Math.round(size * widthScale);

// Use this for scaling heights or vertical spacing
export const verticalScale = (size: number): number => Math.round(size * heightScale);

// Use this for scaling font sizes
export const moderateScale = (size: number, factor = 0.5): number =>
  Math.round(size + (scale(size) - size) * factor);

// Convert pixels to rem (assuming base 16)
export const pxToRem = (px: number): string => `${px / 16}rem`;

// Spacing constants
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(40),
};

// Device specific helpers
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isLargeDevice = SCREEN_WIDTH > 414;
