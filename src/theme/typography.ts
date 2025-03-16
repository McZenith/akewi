import { moderateScale } from '../utils/scaling';

export const typography = {
  // Font family
  fontFamily: {
    primary: 'Inter',
  },

  // Font weights
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
  },

  // Font sizes
  sizes: {
    xs: moderateScale(12),
    sm: moderateScale(14),
    md: moderateScale(16),
    lg: moderateScale(18),
    xl: moderateScale(20),
    xxl: moderateScale(24),

    // Specific component sizes
    description: moderateScale(16),
    input: moderateScale(14),
    button: moderateScale(18),
    alternative: moderateScale(16),
  },

  // Line heights
  lineHeights: {
    xs: moderateScale(16),
    sm: moderateScale(20),
    md: moderateScale(24),
    lg: moderateScale(28),
    xl: moderateScale(32),

    // Specific component line heights
    description: '130%',
    input: '140%',
    button: moderateScale(24),
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.5px',
    normal: '0%',
  },
} as const;

export type Typography = typeof typography;
export type TypographyKeys = keyof typeof typography;
