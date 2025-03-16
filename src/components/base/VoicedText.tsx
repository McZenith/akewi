import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, TextStyle, View, Platform } from 'react-native';
import { useVoiceGuidance } from '../../providers/VoiceGuidanceProvider';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import { Text } from 'react-native';

interface VoicedTextProps {
  children: React.ReactNode;
  voiceElementId: string;
  style?: TextStyle;
}

export const VoicedText: React.FC<VoicedTextProps> = ({ children, voiceElementId, style }) => {
  const { currentElementId, isActive, registerElement, readText } = useVoiceGuidance();
  const isBeingVoiced = currentElementId === voiceElementId && isActive;
  const textContent = typeof children === 'string' ? children : 'Text element';
  const [wasVoiced, setWasVoiced] = useState(false);
  const animationStarted = useRef(false);

  // Register this element with the voice guidance system
  useEffect(() => {
    registerElement(voiceElementId, textContent);
  }, [voiceElementId, textContent, registerElement]);

  // When this element is voiced, read the text
  useEffect(() => {
    if (isBeingVoiced) {
      // Only read text if not already being voiced (prevents duplicate readings on Android)
      if (!animationStarted.current) {
        readText(textContent);
        setWasVoiced(true);
        animationStarted.current = true;
      }
    } else {
      animationStarted.current = false;
    }
  }, [isBeingVoiced, textContent, readText]);

  // Reset wasVoiced when voice guidance is deactivated
  useEffect(() => {
    if (!isActive) {
      setWasVoiced(false);
      animationStarted.current = false;
    }
  }, [isActive]);

  // Animation values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  // Define gradient colors for the voice announcement - matching the design
  const gradientColors = ['#983E1C', '#000000', '#FF5211'];
  const gradientLocations = [0.26, 0.39, 0.65];

  // Set up animation when text is being voiced - optimized for Android
  useEffect(() => {
    if (isBeingVoiced) {
      // Simpler animation for Android to reduce jank
      if (Platform.OS === 'android') {
        // Use simpler animations on Android
        scale.value = withRepeat(
          withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        );
      } else {
        // More complex animations for iOS
        translateX.value = withRepeat(
          withSequence(
            withTiming(-1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
          ),
          -1, // Infinite repeat
          true // Reverse
        );

        scale.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
            withTiming(1.05, { duration: 600, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      }
    } else if (!wasVoiced) {
      // Only reset animations if the text was never voiced or voice guidance is inactive
      cancelAnimation(translateX);
      cancelAnimation(scale);
      translateX.value = withTiming(0);
      scale.value = withTiming(1, { duration: 300 });
    } else if (!isActive) {
      // If voice guidance is deactivated, reset animations
      cancelAnimation(translateX);
      cancelAnimation(scale);
      translateX.value = withTiming(0);
      scale.value = withTiming(1, { duration: 300 });
    }

    return () => {
      cancelAnimation(translateX);
      cancelAnimation(scale);
    };
  }, [isBeingVoiced, wasVoiced, isActive]);

  // Animated styles - simplified for Android
  const animatedTextStyle = useAnimatedStyle(() => ({
    transform:
      Platform.OS === 'android'
        ? [{ scale: scale.value }]
        : [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  // Debug output to console
  useEffect(() => {
    if (isBeingVoiced) {
      console.log(`VoicedText: ${voiceElementId} is being voiced`);
    }
  }, [isBeingVoiced, voiceElementId]);

  // If not being voiced and was never voiced, render normal text
  if (!isBeingVoiced && !wasVoiced) {
    return <Text style={[styles.text, style]}>{children}</Text>;
  }

  // If being voiced or was voiced, render text with gradient
  return (
    <Animated.View style={[styles.container, animatedTextStyle]}>
      <MaskedView
        maskElement={<Text style={[styles.text, styles.maskedText, style]}>{children}</Text>}
      >
        <LinearGradient
          colors={gradientColors}
          locations={gradientLocations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={[styles.text, styles.transparentText, style]}>{children}</Text>
        </LinearGradient>
      </MaskedView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  maskedText: {
    backgroundColor: 'transparent',
    fontWeight: '700',
  },
  transparentText: {
    opacity: 0,
  },
  gradient: {
    flex: 1,
    height: '100%',
  },
});
