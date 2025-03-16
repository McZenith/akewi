import { scale, verticalScale } from '../utils/scaling';

export const LAYOUT = {
  button: {
    height: verticalScale(48),
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
  },
  input: {
    height: verticalScale(48),
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
  },
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
  },
} as const;
