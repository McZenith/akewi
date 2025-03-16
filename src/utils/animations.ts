import { Easing, withTiming } from 'react-native-reanimated';

export const ANIMATION_CONFIG = {
  DURATION: {
    EXTRA_FAST: 100,
    FAST: 200,
    MEDIUM: 300,
    SLOW: 500,
    EXTRA_SLOW: 800,
  },
  EASING: {
    STANDARD: Easing.bezier(0.25, 0.1, 0.25, 1),
    ACCELERATE: Easing.bezier(0.4, 0.0, 1, 1),
    DECELERATE: Easing.bezier(0.0, 0.0, 0.2, 1),
    SHARP: Easing.bezier(0.4, 0.0, 0.6, 1),
    BOUNCE: Easing.bezier(0.68, -0.55, 0.27, 1.55),
    LINEAR: Easing.linear,
  },
};

export const withDefaultTiming = (toValue: number, options = {}) => {
  return withTiming(toValue, {
    duration: ANIMATION_CONFIG.DURATION.MEDIUM,
    easing: ANIMATION_CONFIG.EASING.STANDARD,
    ...options,
  });
};

export const withFastTiming = (toValue: number, options = {}) => {
  return withTiming(toValue, {
    duration: ANIMATION_CONFIG.DURATION.FAST,
    easing: ANIMATION_CONFIG.EASING.STANDARD,
    ...options,
  });
};

export const withSlowTiming = (toValue: number, options = {}) => {
  return withTiming(toValue, {
    duration: ANIMATION_CONFIG.DURATION.SLOW,
    easing: ANIMATION_CONFIG.EASING.STANDARD,
    ...options,
  });
};

export const withBounceTiming = (toValue: number, options = {}) => {
  return withTiming(toValue, {
    duration: ANIMATION_CONFIG.DURATION.MEDIUM,
    easing: ANIMATION_CONFIG.EASING.BOUNCE,
    ...options,
  });
};
