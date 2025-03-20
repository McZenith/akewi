import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Pressable, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useAppTranslation from '../src/hooks/useAppTranslation';
import Animated, {
  Easing,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { scale, verticalScale } from '../src/utils/scaling';
import Text from '../src/components/base/Text';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { useAppDispatch, useAppSelector, RootState } from '../src/store';
import { updateUserField } from '../src/store/slices/authSlice';

interface State {
  code: string;
  displayName: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAG_THRESHOLD = 100; // pixels to drag before closing

export default function StateModal() {
  const router = useRouter();
  const { t } = useAppTranslation();
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state: RootState) => state.auth.userDetails);
  const params = useLocalSearchParams();

  // Get initial state from Redux or params
  const initialState = userDetails?.state || (params.currentState as string) || '';

  const [selectedState, setSelectedState] = useState(initialState);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  // Create state list with translation keys
  const states: State[] = [
    { code: 'osun', displayName: t('states.osun', 'Osun') },
    { code: 'ondo', displayName: t('states.ondo', 'Ondo') },
    { code: 'kwara', displayName: t('states.kwara', 'Kwara') },
    { code: 'kogi', displayName: t('states.kogi', 'Kogi') },
    { code: 'oyo', displayName: t('states.oyo', 'Oyo') },
    { code: 'lagos', displayName: t('states.lagos', 'Lagos') },
    { code: 'ogun', displayName: t('states.ogun', 'Ogun') },
    { code: 'edo', displayName: t('states.edo', 'Edo') },
    { code: 'diaspora', displayName: t('states.diaspora', 'Diaspora') },
  ];

  // Animate modal in when component mounts
  useEffect(() => {
    // Animate backdrop
    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    // Animate modal sliding up
    translateY.value = withTiming(
      0,
      {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      },
      () => {
        // Trigger haptic feedback AFTER the modal is fully visible
        if (Platform.OS === 'ios') {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        } else {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    );

    return () => {
      // Clean up animations if needed
    };
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const closeModal = () => {
    // Animate backdrop out
    opacity.value = withTiming(0, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });

    // Animate modal sliding down
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      },
      () => {
        // Go back after animation completes
        runOnJS(router.back)();
      }
    );
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Only allow dragging down, not up
      if (event.translationY > 0) {
        translateY.value = ctx.startY + event.translationY;
      }
    },
    onEnd: event => {
      // If dragged down past threshold, close the modal
      if (event.translationY > DRAG_THRESHOLD) {
        runOnJS(closeModal)();
      } else {
        // Otherwise, snap back to original position
        translateY.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      }
    },
  });

  const handleStateSelect = (code: string, displayName: string) => {
    try {
      // Update local state immediately for UI feedback
      setSelectedState(code);

      // Dispatch to Redux to update the state field
      dispatch(
        updateUserField({
          field: 'state',
          value: displayName,
        })
      );

      // Close modal with animation
      closeModal();
    } catch (error) {
      console.error('Error selecting state:', error);
    }
  };

  // Custom selector component that works on all Android devices
  const SelectionIndicator = ({ isSelected }: { isSelected: boolean }) => (
    <View
      style={[styles.selectionIndicator, isSelected ? styles.selectionIndicatorSelected : null]}
    >
      {isSelected && <View style={styles.selectionIndicatorInner} />}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Backdrop with press to dismiss */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => closeModal()} />
      </Animated.View>

      {/* Modal content */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.contentContainer, modalStyle]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t('userDetails.selectState', 'Select your state')}</Text>

          {states.map((state, index) => (
            <React.Fragment key={state.code}>
              <TouchableOpacity
                style={styles.stateOption}
                onPress={() => handleStateSelect(state.code, state.displayName)}
                activeOpacity={0.7}
                accessibilityLabel={state.displayName}
                accessibilityRole="button"
              >
                <View style={styles.stateContent}>
                  <Text style={styles.stateName}>{state.displayName}</Text>
                </View>

                {/* Use custom selection indicator */}
                <SelectionIndicator isSelected={selectedState === state.code} />
              </TouchableOpacity>
              {index < states.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: Platform.OS === 'ios' ? scale(34) : scale(24),
    // Add max height to ensure it doesn't take up too much space
    maxHeight: SCREEN_HEIGHT * 0.8,
    ...Platform.select({
      android: {
        elevation: 24,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
    }),
  },
  handle: {
    alignSelf: 'center',
    width: scale(32),
    height: scale(4),
    backgroundColor: '#E8E8E8',
    borderRadius: scale(2),
    marginBottom: scale(16),
  },
  title: {
    fontSize: scale(18),
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: scale(16),
    textAlign: 'center',
  },
  stateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
    paddingHorizontal: scale(8),
  },
  stateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stateName: {
    fontSize: scale(16),
    fontWeight: '500',
    color: colors.text.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
  selectionIndicator: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    borderWidth: 2,
    borderColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorSelected: {
    borderColor: '#00BA88',
  },
  selectionIndicatorInner: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#00BA88',
  },
});
