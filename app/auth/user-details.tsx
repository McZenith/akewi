import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { VoiceButton } from '../../src/components/base/VoiceButton';
import { VoicedText } from '../../src/components/base/VoicedText';
import LanguageSelector from '../../src/components/language/LanguageSelector';
import Input from '../../src/components/base/Input';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { scale, verticalScale } from '../../src/utils/scaling';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { setUserDetails, updateUserField, UserDetails } from '../../src/store/slices/authSlice';
import { setLanguage } from '../../src/store/slices/settingsSlice';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ANIMATION_CONFIG } from '../../src/utils/animations';
import Header from '../../src/components/base/Header';
import { useVoiceGuidance } from '../../src/providers/VoiceGuidanceProvider';
import i18next from '../../src/i18n';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../../src/store';
import useAppTranslation from '../../src/hooks/useAppTranslation';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface UserDetailsFormData {
  name: string;
  state: string;
  town: string;
  family?: string;
}

const UserDetailsScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useAppTranslation();
  const { startVoiceGuidance, stopVoiceGuidance, readText, isActive } = useVoiceGuidance();

  // Get user details from Redux
  const storedUserDetails = useAppSelector((state: RootState) => state.auth.userDetails);

  // Initialize form with data from Redux if available
  const [formData, setFormData] = useState<UserDetailsFormData>({
    name: storedUserDetails?.name || '',
    state: storedUserDetails?.state || '',
    town: storedUserDetails?.town || '',
    family: storedUserDetails?.family || '',
  });

  const [errors, setErrors] = useState<Partial<UserDetailsFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const selectedLanguage = useAppSelector((state: RootState) => state.settings.language);

  // Sync i18n language with Redux state
  useEffect(() => {
    if (i18next.language !== selectedLanguage) {
      i18next.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  // Update form data when Redux state changes
  useEffect(() => {
    if (storedUserDetails) {
      setFormData({
        name: storedUserDetails.name || '',
        state: storedUserDetails.state || '',
        town: storedUserDetails.town || '',
        family: storedUserDetails.family || '',
      });
    }
  }, [storedUserDetails]);

  const buttonScale = useSharedValue(1);

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, {
      duration: ANIMATION_CONFIG.DURATION.EXTRA_FAST,
      easing: ANIMATION_CONFIG.EASING.SHARP,
    });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleVoicePress = () => {
    if (isActive) {
      stopVoiceGuidance();
    } else {
      startVoiceGuidance();
      // Set a slight delay to ensure the voice guidance context is ready
      setTimeout(() => {
        readText(t('userDetails.description', 'Please provide your details'));
      }, 100);
    }
  };

  const handleLanguagePress = () => {
    router.push('/language-modal');
  };

  const handleLanguageSelect = (language: string) => {
    dispatch(setLanguage(language as 'en' | 'yo'));
  };

  const handleChange = (field: keyof UserDetailsFormData, value: string) => {
    // Update local state for immediate UI feedback
    setFormData(prev => ({ ...prev, [field]: value }));

    // Also update Redux state
    dispatch(
      updateUserField({
        field,
        value,
      })
    );

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetailsFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.required', 'Name is required', {
        field: t('userDetails.name', 'Name'),
      });
    }

    if (!formData.state.trim()) {
      newErrors.state = t('validation.required', 'State is required', {
        field: t('userDetails.state', 'State'),
      });
    }

    if (!formData.town.trim()) {
      newErrors.town = t('validation.required', 'Town is required', {
        field: t('userDetails.town', 'Town'),
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      // Read the first error for voice guidance
      const firstErrorKey = Object.keys(errors)[0] as keyof UserDetailsFormData;
      if (firstErrorKey && errors[firstErrorKey]) {
        readText(errors[firstErrorKey] as string);
      }
      return;
    }

    try {
      setIsLoading(true);

      // All fields should already be in Redux from individual updates
      // Just navigate to the next screen
      router.replace('/player');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('userDetails.errors.saveFailed', 'Failed to save user details');
      readText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleStatePress = () => {
    router.push({
      pathname: '/state-modal',
      params: { currentState: formData.state },
    });
  };

  // Modify the useEffect to clear params after handling state selection
  useEffect(() => {
    if (params.selectedState) {
      // Use the stateDisplayName param if available, otherwise use the raw state code
      const displayName = (params.stateDisplayName as string) || (params.selectedState as string);
      handleChange('state', displayName);

      // Clear the params by replacing the current route with the same route but no params
      router.replace('/auth/user-details');
    }
  }, [params.selectedState, params.stateDisplayName]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Header
          showBack={true}
          onBackPress={handleBack}
          rightComponent={
            <>
              <VoiceButton onPress={handleVoicePress} />
              <LanguageSelector
                currentLanguage={selectedLanguage}
                onPress={handleLanguagePress}
                onSelect={handleLanguageSelect}
              />
            </>
          }
        />

        <View style={styles.titleContainer}>
          <VoicedText style={styles.title} voiceElementId="userDetails-title">
            {t('userDetails.title', 'Enter your details')}
          </VoicedText>
          <VoicedText style={styles.subtitle} voiceElementId="userDetails-subtitle">
            {t('userDetails.subtitle', 'Add the following to personalize your experience')}
          </VoicedText>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Input
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
              placeholder={t('userDetails.name', 'Name')}
              error={errors.name}
              voiceElementId="userDetails-name"
              returnKeyType="next"
            />

            <TouchableWithoutFeedback onPress={handleStatePress}>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Input
                  value={formData.state}
                  placeholder={t('userDetails.state', 'State')}
                  error={errors.state}
                  voiceElementId="userDetails-state"
                  editable={false}
                  pointerEvents="none"
                  rightIcon={
                    <Ionicons name="chevron-down" size={24} color={colors.text.secondary} />
                  }
                />
              </View>
            </TouchableWithoutFeedback>

            <Input
              value={formData.town}
              onChangeText={text => handleChange('town', text)}
              placeholder={t('userDetails.town', 'Town')}
              error={errors.town}
              voiceElementId="userDetails-town"
              returnKeyType="next"
            />

            <Input
              value={formData.family}
              onChangeText={text => handleChange('family', text)}
              placeholder={t('userDetails.family', 'Family (Optional)')}
              error={errors.family}
              voiceElementId="userDetails-family"
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <AnimatedTouchableOpacity
            style={[styles.continueButton, buttonAnimatedStyle]}
            onPress={handleContinue}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <VoicedText style={styles.continueButtonText} voiceElementId="userDetails-continue">
                {t('common.continue', 'Continue')}
              </VoicedText>
            )}
          </AnimatedTouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? verticalScale(16) : 0,
  },
  titleContainer: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
    marginBottom: verticalScale(32),
    alignItems: 'center',
  },
  title: {
    fontSize: scale(28),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  subtitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(24),
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    gap: verticalScale(16),
    alignItems: 'center',
    maxWidth: scale(375),
  },
  buttonContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(16),
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: colors.button.primary,
    borderRadius: scale(100),
    paddingVertical: verticalScale(16),
    width: '100%',
    maxWidth: scale(375),
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: typography.sizes.button,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weights.semiBold,
    color: colors.button.primaryText,
    letterSpacing: -0.5,
  },
});

export default UserDetailsScreen;
