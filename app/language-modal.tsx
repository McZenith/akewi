import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
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
import ukFlag from '../assets/icons/uk-flag.png';
import nigeriaFlag from '../assets/icons/nigeria-flag.png';
import { colors } from '../src/theme/colors';
import { useAppDispatch, useAppSelector } from '../src/store';
import { setLanguage } from '../src/store/slices/settingsSlice';
import useAppTranslation from '../src/hooks/useAppTranslation';
import { useLanguage } from '../src/providers/LanguageProvider';

interface Language {
  code: string;
  displayName: string;
  flag?: any;
}

const getLanguages = (t: Function): Language[] => [
  {
    code: 'en',
    displayName: t('language.english', 'English'),
    flag: ukFlag,
  },
  {
    code: 'yo',
    displayName: t('language.yoruba', 'Yorùbá'),
    flag: nigeriaFlag,
  },
];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAG_THRESHOLD = 100; // pixels to drag before closing

export default function LanguageModal() {
  const { t } = useAppTranslation();
  const { i18n } = useTranslation();
  const { changeLanguage } = useLanguage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.settings.language);
  const params = useLocalSearchParams();
  const initialLang = (params.currentLang as string) || currentLanguage || i18n.language || 'en';

  const [selectedLang, setSelectedLang] = useState(initialLang);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  // Get languages with translated names
  const languages = getLanguages(t);

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
        // Trigger haptic feedback when the modal is fully visible
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
    // Animate backdrop
    opacity.value = withTiming(0, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });

    // Animate modal sliding down
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      {
        duration: 350,
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

  const handleLanguageSelect = async (code: string) => {
    try {
      // Update local state immediately for UI feedback
      setSelectedLang(code);

      // Use multiple systems to ensure language change works
      // 1. Update Redux store
      dispatch(setLanguage(code as 'en' | 'yo'));
      
      // 2. Use the LanguageContext provider
      await changeLanguage(code);
      
      // 3. Force change i18n directly as a fallback
      await i18n.changeLanguage(code);

      // Close modal with animation after all changes applied
      setTimeout(() => closeModal(), 100);
    } catch (error) {
      console.error('Error changing language:', error);
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
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
      </Animated.View>

      {/* Modal content */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.contentContainer, modalStyle]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t('settings.selectLanguage', 'Select language')}</Text>

          {languages.map((language, index) => (
            <React.Fragment key={language.code}>
              <TouchableOpacity
                style={styles.languageOption}
                onPress={() => handleLanguageSelect(language.code)}
                activeOpacity={0.7}
                accessibilityLabel={language.displayName}
                accessibilityRole="button"
              >
                <View style={styles.languageContent}>
                  <Image source={language.flag} style={styles.flagIcon} resizeMode="contain" />
                  <Text style={styles.languageName}>{language.displayName}</Text>
                </View>

                {/* Use custom selection indicator instead of Ionicons */}
                <SelectionIndicator isSelected={selectedLang === language.code} />
              </TouchableOpacity>
              {index < languages.length - 1 && <View style={styles.divider} />}
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
    backgroundColor: colors.background,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: Platform.OS === 'ios' ? scale(34) : scale(24),
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
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
    paddingHorizontal: scale(8),
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  flagIcon: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
  },
  languageName: {
    fontSize: scale(16),
    fontWeight: '500',
    color: colors.text.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E8E8',
    width: '100%',
  },
  // Custom selection indicator styles
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
