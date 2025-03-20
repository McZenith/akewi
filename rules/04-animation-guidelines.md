---
description: Animation and transition guidelines for the Akewi application
globs: ["**/*.tsx", "**/utils/animations.ts"]
---

# Animation Guidelines

## Animation Philosophy

All animations in the Akewi app should follow these core principles:

1. **Purpose-driven**: Each animation must serve a purpose (feedback, guidance, or delight)
2. **Performance-focused**: Animations should be optimized for 60fps on target devices
3. **Consistent timing**: Use standardized durations for similar interactions
4. **Subtlety**: Enhance without distracting from core functionality
5. **Accessibility**: Respect user preferences for reduced motion

## Animation Standards

### Duration Standards

| Type       | Duration | Use Case                                                   |
| ---------- | -------- | ---------------------------------------------------------- |
| Extra Fast | 100ms    | Button presses, micro-interactions                         |
| Fast       | 200ms    | Simple transitions, focus states                           |
| Medium     | 300ms    | Standard page transitions, elements appearing/disappearing |
| Slow       | 500ms    | Complex transitions, emphasis moments                      |
| Extra Slow | 800ms+   | Special moments, onboarding, celebrations                  |

### Easing Standards

| Type       | Curve                                 | Use Case                        |
| ---------- | ------------------------------------- | ------------------------------- |
| Standard   | cubic-bezier(0.25, 0.1, 0.25, 1)      | General transitions             |
| Accelerate | cubic-bezier(0.4, 0.0, 1, 1)          | Elements exiting the screen     |
| Decelerate | cubic-bezier(0.0, 0.0, 0.2, 1)        | Elements entering the screen    |
| Sharp      | cubic-bezier(0.4, 0.0, 0.6, 1)        | Quick transitions               |
| Bounce     | cubic-bezier(0.68, -0.55, 0.27, 1.55) | Playful moments, success states |

## Implementation Guidelines

Always use React Native Reanimated for animations to ensure they run on the UI thread.

### Utility Functions

Use the animation utilities from `utils/animations.ts` for consistent implementation:

```typescript
// Recommended pattern for animations
import { ANIMATION_CONFIG, withDefaultTiming } from '../../utils/animations';

// Component with animation
export const FadeInView = ({ children }) => {
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDefaultTiming(1);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
```

## Key Animation Areas

### Screen Transitions

- Use Expo Router with custom transition presets
- Implement consistent transition patterns between screens
- Use shared element transitions for Oriki item → detail view

### UI Elements

- Button press: Scale down slightly with opacity change (Extra Fast, 100ms)
- Form field focus: Border highlight with subtle scaling (Fast, 200ms)
- Error messages: Slide down with fade in (Medium, 300ms)
- Success indicators: Scale up with fade in, checkmark draw animation (Slow, 500ms)

### Audio Player

- Circular progress: Smooth rotation for playback progress (Linear easing)
- Waveform visualization: Dynamic bar height changes with audio amplitude (Real-time)
- Play/pause button morph: Smooth transition between icons (Fast, 200ms)
- Player expansion/collapse: Smooth expansion with content fade (Medium, 300ms)

### List Animations

- Staggered animations for list items
- Pull-to-refresh custom animations
- Swipe interactions with elastic feedback

## Loading States

- Implement skeleton screens with shimmer effect for content loading
- Use custom progress indicators for uploads/downloads
- Create branded loading animations that match the app's identity

## Accessibility

Always respect reduced motion preferences:

```typescript
import { AccessibilityInfo } from 'react-native';

const [reducedMotion, setReducedMotion] = useState(false);

useEffect(() => {
  const handleReducedMotionChange = (isReduced) => {
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

## Performance Optimization

1. Use Reanimated's worklet functions to run animations on the UI thread
2. Prefer `transform` and `opacity` animations which can be hardware-accelerated
3. Avoid animating layout properties when possible
4. Use `useAnimatedReaction` for complex animations that depend on other values
5. Monitor performance with Flipper during development
6. Test animations on lower-end devices to ensure smooth performance 