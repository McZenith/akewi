import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { VoiceButton } from '../../src/components/base/VoiceButton';
import { VoicedText } from '../../src/components/base/VoicedText';
import LanguageSelector from '../../src/components/language/LanguageSelector';
import Input from '../../src/components/base/Input';
import SocialButton from '../../src/components/auth/SocialButton';
import { LOGIN_SCREEN_LAYOUT } from '../../src/constants/screens/auth';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { scale, verticalScale } from '../../src/utils/scaling';
import { validateIdentifier } from '../../src/utils/validation';
import { useAppDispatch } from '../../src/store/hooks';
import { loginStart } from '../../src/store/slices/auth';
import { ANIMATION_CONFIG } from '../../src/utils/animations';
import logoImage from '../../assets/images/logo.png';
import backgroundImage from '../../assets/images/background.png';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../src/components/base/Header';
import LanguageSelectionModal from '../../src/components/language/LanguageSelectionModal';
import { useTranslation } from 'react-i18next';
import i18next from '../../src/i18n';
import { useVoiceGuidance } from '../../src/providers/VoiceGuidanceProvider';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface SocialButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  isLoading?: boolean;
  voiceElementId: string;
}

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'email' | 'phone' | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language || 'English');
  const { startVoiceGuidance, stopVoiceGuidance, readText, isActive, currentElementId } =
    useVoiceGuidance();

  const buttonScale = useSharedValue(1);
  const formOpacity = useSharedValue(0);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    formOpacity.value = withTiming(1, {
      duration: ANIMATION_CONFIG.DURATION.MEDIUM,
      easing: ANIMATION_CONFIG.EASING.DECELERATE,
    });
  }, []);

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

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const handleVoicePress = () => {
    if (isActive) {
      stopVoiceGuidance();
    } else {
      startVoiceGuidance();
      // Set a slight delay to ensure the voice guidance context is ready
      setTimeout(() => {
        readText(t('auth.description'));
      }, 100);
    }
  };

  const handleLanguagePress = () => {
    setIsLanguageModalVisible(true);
  };

  const handleLanguageSelect = async (language: string) => {
    try {
      await i18next.changeLanguage(language);
      setSelectedLanguage(language);
      console.log('Language changed successfully to:', language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
    setIsLanguageModalVisible(false);
  };

  const handleIdentifierChange = (text: string) => {
    setIdentifier(text);
    setError('');

    if (text.includes('@')) {
      setIdentifierType('email');
    } else if (/\d/.test(text)) {
      setIdentifierType('phone');
    } else {
      setIdentifierType(null);
    }

    // If voice guidance is active, read the input type
    if (isActive && currentElementId === 'login-identifier') {
      readText(getPlaceholder());
    }
  };

  const handleContinue = async () => {
    // Trim the identifier to remove any whitespace
    const trimmedIdentifier = identifier.trim();

    // First validate the input
    const validationError = validateIdentifier(trimmedIdentifier, identifierType);
    if (validationError) {
      setError(validationError);
      readText(validationError);
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(
        loginStart({
          identifier: trimmedIdentifier,
          type: identifierType,
        })
      ).unwrap();
      // Navigation will be handled by the auth state listener
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes('not found')) {
          errorMessage = 'No account found with this email or phone number';
        } else if (err.message.includes('invalid')) {
          errorMessage = 'The email or phone number format is invalid';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      readText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add input placeholder based on type
  const getPlaceholder = () => {
    if (identifierType === 'email') {
      return t('auth.input.placeholder.email');
    } else if (identifierType === 'phone') {
      return t('auth.input.placeholder.phone');
    }
    return t('auth.input.placeholder.default');
  };

  const handleGooglePress = async () => {
    try {
      setIsSocialLoading('google');
      await dispatch(loginStart({ provider: 'google' })).unwrap();
      // Navigation will be handled by the auth state listener
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      Alert.alert('Error', errorMessage);
      readText(errorMessage);
    } finally {
      setIsSocialLoading(null);
    }
  };

  const handleApplePress = async () => {
    try {
      setIsSocialLoading('apple');
      await dispatch(loginStart({ provider: 'apple' })).unwrap();
      // Navigation will be handled by the auth state listener
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Apple';
      Alert.alert('Error', errorMessage);
      readText(errorMessage);
    } finally {
      setIsSocialLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
          <Header
            showBack={false}
            rightComponent={
              <>
                <VoiceButton onPress={handleVoicePress} />
                <LanguageSelector
                  currentLanguage={selectedLanguage}
                  onPress={handleLanguagePress}
                />
              </>
            }
          />
        </ImageBackground>

        <LinearGradient
          colors={[colors.gradient.start, colors.gradient.middle, colors.gradient.end]}
          style={[
            styles.formContainer,
            {
              marginTop:
                Platform.OS === 'ios' ? verticalScale(220) - insets.top : verticalScale(220),
            },
          ]}
        >
          <Animated.View entering={FadeInUp.duration(ANIMATION_CONFIG.DURATION.MEDIUM)}>
            <Animated.View style={[styles.formContent, formAnimatedStyle]}>
              <Animated.Image
                source={logoImage}
                style={styles.logo}
                resizeMode="contain"
                entering={FadeIn.delay(300).duration(ANIMATION_CONFIG.DURATION.MEDIUM)}
              />

              <Animated.View
                entering={FadeIn.delay(400).duration(ANIMATION_CONFIG.DURATION.MEDIUM)}
              >
                <VoicedText style={styles.description} voiceElementId="login-description">
                  {t('auth.description')}
                </VoicedText>
              </Animated.View>

              <Input
                value={identifier}
                onChangeText={handleIdentifierChange}
                placeholder={getPlaceholder()}
                error={error}
                voiceElementId="login-identifier"
                onSubmitEditing={handleContinue}
                returnKeyType="go"
                keyboardType={identifierType === 'phone' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
                autoCorrect={false}
              />

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
                  <VoicedText style={styles.continueButtonText} voiceElementId="login-continue">
                    {t('common.continue')}
                  </VoicedText>
                )}
              </AnimatedTouchableOpacity>

              <View style={styles.socialButtons}>
                <SocialButton
                  provider="google"
                  onPress={handleGooglePress}
                  disabled={isSocialLoading !== null}
                  voiceElementId="login-google"
                />
                <SocialButton
                  provider="apple"
                  onPress={handleApplePress}
                  disabled={isSocialLoading !== null}
                  voiceElementId="login-apple"
                />
              </View>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </KeyboardAvoidingView>

      <LanguageSelectionModal
        visible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
        onSelectLanguage={handleLanguageSelect}
        currentLanguage={selectedLanguage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: verticalScale(300),
    position: 'absolute',
    top: 0,
  },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    backgroundColor: colors.background,
    paddingTop: verticalScale(32),
  },
  formContent: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  logo: {
    width: scale(120),
    height: scale(120),
    marginBottom: verticalScale(24),
  },
  description: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: verticalScale(32),
    paddingHorizontal: scale(24),
    borderRadius: scale(4),
  },
  continueButton: {
    backgroundColor: colors.button.primary,
    borderRadius: scale(100),
    paddingVertical: verticalScale(16),
    width: scale(345),
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  continueButtonText: {
    fontSize: typography.sizes.button,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weights.semiBold,
    color: colors.button.primaryText,
    letterSpacing: -0.5,
  },
  socialButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: verticalScale(16),
    marginTop: verticalScale(24),
    width: scale(345),
  },
});

export default LoginScreen;
