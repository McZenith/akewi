# Animations & Transitions Documentation

This document outlines the animation and transition strategies for the Akewi app to enhance the user experience.

## Animation Philosophy

Our animation strategy follows these core principles:

1. **Purpose-driven**: Each animation serves a purpose (feedback, guidance, delight)
2. **Performance-focused**: Optimized for 60fps on target devices
3. **Consistent timing**: Standardized durations for similar interactions
4. **Subtlety**: Enhances without distracting from core functionality
5. **Accessibility**: Respects user preferences for reduced motion

## Animation Duration Standards

| Type       | Duration | Use Case                                                   |
| ---------- | -------- | ---------------------------------------------------------- |
| Extra Fast | 100ms    | Button presses, micro-interactions                         |
| Fast       | 200ms    | Simple transitions, focus states                           |
| Medium     | 300ms    | Standard page transitions, elements appearing/disappearing |
| Slow       | 500ms    | Complex transitions, emphasis moments                      |
| Extra Slow | 800ms+   | Special moments, onboarding, celebrations                  |

## Animation Easing Standards

| Type       | Curve                                 | Use Case                        |
| ---------- | ------------------------------------- | ------------------------------- |
| Standard   | cubic-bezier(0.25, 0.1, 0.25, 1)      | General transitions             |
| Accelerate | cubic-bezier(0.4, 0.0, 1, 1)          | Elements exiting the screen     |
| Decelerate | cubic-bezier(0.0, 0.0, 0.2, 1)        | Elements entering the screen    |
| Sharp      | cubic-bezier(0.4, 0.0, 0.6, 1)        | Quick transitions               |
| Bounce     | cubic-bezier(0.68, -0.55, 0.27, 1.55) | Playful moments, success states |

## Key Animation Areas

### 1. Screen Transitions

#### A. Standard Page Navigation

- **Effect**: Slide horizontally with fade overlay
- **Duration**: 300ms (Medium)
- **Easing**: Standard
- **Implementation**:
  ```jsx
  // Using Expo Router with custom transition preset
  export const MyScreenTransition = {
    animation: 'timing',
    config: {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    },
  };
  ```

#### B. Modal Presentations

- **Effect**: Slide up with backdrop fade
- **Duration**: 300ms (Medium)
- **Easing**: Decelerate
- **Implementation**:

  ```jsx
  // Modal animation using Reanimated
  const translateY = useSharedValue(height);

  const animateIn = () => {
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
    });
  };
  ```

#### C. Tab Switching

- **Effect**: Cross-fade with subtle scale
- **Duration**: 200ms (Fast)
- **Easing**: Standard
- **Implementation**: Use custom tab navigator with animated transitions

### 2. UI Element Animations

#### A. Button Press

- **Effect**: Scale down slightly with opacity change
- **Duration**: 100ms (Extra Fast)
- **Easing**: Sharp
- **Implementation**:
  ```jsx
  const ButtonWithAnimation = ({ onPress, children }) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
      scale.value = withTiming(0.95, {
        duration: 100,
        easing: Easing.bezier(0.4, 0.0, 0.6, 1),
      });
    };

    const handlePressOut = () => {
      scale.value = withTiming(1, {
        duration: 100,
        easing: Easing.bezier(0.4, 0.0, 0.6, 1),
      });
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </Pressable>
    );
  };
  ```

#### B. Form Field Focus

- **Effect**: Border highlight with subtle scaling
- **Duration**: 200ms (Fast)
- **Easing**: Standard
- **Implementation**: Animate border color and width on focus/blur

#### C. Error Messages

- **Effect**: Slide down with fade in
- **Duration**: 300ms (Medium)
- **Easing**: Bounce
- **Implementation**: Use height animation combined with opacity

#### D. Success Indicators

- **Effect**: Scale up with fade in, checkmark draw animation
- **Duration**: 500ms (Slow)
- **Easing**: Decelerate followed by bounce
- **Implementation**: SVG path animation for checkmark, scale animation for container

### 3. Audio Player Animations

#### A. Circular Progress

- **Effect**: Smooth rotation with gradient along track
- **Duration**: Based on audio duration (continuous)
- **Easing**: Linear
- **Implementation**: Use SVG arc with animated stroke-dashoffset

#### B. Waveform Visualization

- **Effect**: Dynamic bar height changes with audio amplitude
- **Duration**: Real-time (continuous)
- **Easing**: N/A (direct mapping)
- **Implementation**: Canvas-based drawing or SVG with real-time updates

#### C. Play/Pause Button Morph

- **Effect**: Smooth transition between play and pause icons
- **Duration**: 200ms (Fast)
- **Easing**: Standard
- **Implementation**: SVG path morphing or crossfade between two icons

#### D. Minimized Player Expansion/Collapse

- **Effect**: Expansion from bottom with content fade
- **Duration**: 300ms (Medium)
- **Easing**: Decelerate for expansion, Accelerate for collapse
- **Implementation**:

  ```jsx
  const playerHeight = useSharedValue(MINIMIZED_HEIGHT);

  const expand = () => {
    playerHeight.value = withTiming(EXPANDED_HEIGHT, {
      duration: 300,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
    });
  };

  const collapse = () => {
    playerHeight.value = withTiming(MINIMIZED_HEIGHT, {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 1, 1),
    });
  };
  ```

### 4. Lyrics Synchronization Animations

#### A. Active Lyrics Highlighting

- **Effect**: Smooth text color change with subtle background highlight
- **Duration**: 200ms (Fast)
- **Easing**: Standard
- **Implementation**: Animate text color and background opacity

#### B. Lyrics Scrolling

- **Effect**: Smooth auto-scroll to keep active lyrics centered
- **Duration**: 500ms (Slow)
- **Easing**: Decelerate
- **Implementation**: Animated scroll position based on active lyric index

#### C. Draggable Markers

- **Effect**: Snap-to-position with elastic bounds
- **Duration**: Varies based on gesture velocity
- **Easing**: Spring configuration
- **Implementation**:

  ```jsx
  const markerPosition = useSharedValue(initialPosition);

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      markerPosition.value = clamp(initialPosition + e.translationX, minBound, maxBound);
    })
    .onEnd(e => {
      if (shouldSnapToClosestSegment) {
        markerPosition.value = withSpring(closestSegmentPosition, {
          damping: 15,
          stiffness: 100,
        });
      }
    });
  ```

### 5. Language Toggle Animations

#### A. Language Switch

- **Effect**: Slide with fade transition between languages
- **Duration**: 300ms (Medium)
- **Easing**: Standard
- **Implementation**:

  ```jsx
  const slideDirection = useSharedValue(0);
  const opacity = useSharedValue(1);

  const switchLanguage = direction => {
    // Fade out
    opacity.value = withTiming(0, { duration: 150 }, () => {
      // Change content while invisible
      runOnJS(setLanguage)(newLanguage);

      // Set new slide direction
      slideDirection.value = direction;

      // Fade in with slide
      opacity.value = withTiming(1, { duration: 150 });
      slideDirection.value = withTiming(0, { duration: 300 });
    });
  };
  ```

#### B. Selection Radio Button

- **Effect**: Scale with inner circle fill
- **Duration**: 200ms (Fast)
- **Easing**: Standard
- **Implementation**: Scale inner circle from 0 to 1 with color change

### 6. List Animations

#### A. List Item Entry

- **Effect**: Staggered fade in with slight upward movement
- **Duration**: 300ms (Medium) with 50ms stagger per item
- **Easing**: Decelerate
- **Implementation**:
  ```jsx
  const createAnimationStyle = index => {
    const animation = useSharedValue(0);

    useEffect(() => {
      const delay = index * 50;
      setTimeout(() => {
        animation.value = withTiming(1, {
          duration: 300,
          easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        });
      }, delay);
    }, []);

    return useAnimatedStyle(() => ({
      opacity: animation.value,
      transform: [{ translateY: interpolate(animation.value, [0, 1], [20, 0]) }],
    }));
  };
  ```

#### B. Pull-to-Refresh

- **Effect**: Custom spinner with brand colors
- **Duration**: Continuous until refresh completes
- **Easing**: N/A (gesture controlled)
- **Implementation**: Custom refresh control with animated spinner

### 7. Loading Animations

#### A. Skeleton Screens

- **Effect**: Shimmer effect moving across placeholder elements
- **Duration**: 1000ms (loop)
- **Easing**: Linear
- **Implementation**:
  ```jsx
  const Skeleton = ({ width, height }) => {
    const shimmer = useSharedValue(0);

    useEffect(() => {
      shimmer.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.linear }),
        -1, // infinite
        false
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
        position: 'relative',
        width,
        height,
      };
    });

    const shimmerStyle = useAnimatedStyle(() => {
      return {
        width: '200%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'transparent',
        backgroundImage:
          'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0) 100%)',
        transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-width, width]) }],
      };
    });

    return (
      <Animated.View style={animatedStyle}>
        <Animated.View style={shimmerStyle} />
      </Animated.View>
    );
  };
  ```

#### B. Upload Progress

- **Effect**: Circular progress with percentage counter
- **Duration**: Based on actual upload progress
- **Easing**: Linear
- **Implementation**: SVG circle stroke-dasharray animation

### 8. Success State Animations

#### A. Contribution Submission

- **Effect**: Confetti burst with success message slide up
- **Duration**: 800ms (Extra Slow)
- **Easing**: Bounce followed by Decelerate
- **Implementation**: Particle system for confetti, slide animation for message

#### B. Profile Update

- **Effect**: Success checkmark animation with fade out
- **Duration**: 500ms (Slow) for checkmark, 300ms (Medium) for fade
- **Easing**: Bounce for checkmark, Standard for fade
- **Implementation**: SVG path animation for checkmark drawing

## Animation Utilities

```jsx
// src/utils/animations.ts

import { Easing } from 'react-native-reanimated';

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

export const withDefaultTiming = (toValue, options = {}) => {
  return withTiming(toValue, {
    duration: ANIMATION_CONFIG.DURATION.MEDIUM,
    easing: ANIMATION_CONFIG.EASING.STANDARD,
    ...options,
  });
};

export const withFastTiming = (toValue, options = {}) => {
  return withTiming(toValue, {
    duration: ANIMATION_CONFIG.DURATION.FAST,
    easing: ANIMATION_CONFIG.EASING.STANDARD,
    ...options,
  });
};

export const withSlowTiming = (toValue, options = {}) => {
  return withTiming(toValue, {
    duration: ANIMATION_CONFIG.DURATION.SLOW,
    easing: ANIMATION_CONFIG.EASING.STANDARD,
    ...options,
  });
};

export const withBounceTiming = (toValue, options = {}) => {
  return withTiming(toValue, {
    duration: ANIMATION_CONFIG.DURATION.MEDIUM,
    easing: ANIMATION_CONFIG.EASING.BOUNCE,
    ...options,
  });
};
```

## Accessibility Considerations

1. **Respect Reduced Motion Settings**

   ```jsx
   import { AccessibilityInfo } from 'react-native';

   const [reducedMotion, setReducedMotion] = useState(false);

   useEffect(() => {
     const handleReducedMotionChange = isReduced => {
       setReducedMotion(isReduced);
     };

     AccessibilityInfo.addEventListener('reduceMotionChanged', handleReducedMotionChange);

     AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);

     return () => {
       AccessibilityInfo.removeEventListener('reduceMotionChanged', handleReducedMotionChange);
     };
   }, []);

   // Then in animation code:
   const duration = reducedMotion ? 0 : ANIMATION_CONFIG.DURATION.MEDIUM;
   ```

2. **Provide Alternative to Animated Feedback**

   - Use haptic feedback in addition to animations
   - Ensure all state changes are announced to screen readers

3. **Avoid Animation That Could Trigger Vestibular Disorders**
   - Limit full-screen animations with parallax effects
   - Avoid rapid flashing elements (>3 flashes per second)

## Performance Optimization

1. **Use Reanimated 2+ for JS Thread Decoupling**

   - Animations run on the UI thread, not the JS thread
   - Ensures smooth animations even during heavy JS work

2. **Minimize Animating Layout Properties**

   - Prefer transform over layout properties
   - Use `transform: [{ translateX }, { scale }]` instead of width/height

3. **Use Hardware Acceleration Where Possible**

   - Set `useNativeDriver: true` when applicable
   - Limit to transform and opacity animations

4. **Avoid Unnecessary Re-Renders During Animation**

   - Use `React.memo` for components with animations
   - Separate animated components from business logic

5. **Measure and Optimize**
   - Use Flipper with Performance Monitor to identify issues
   - Target consistent 60fps on mid-range devices
