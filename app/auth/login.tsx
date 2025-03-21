import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { VoiceButton } from '../../src/components/base/VoiceButton';
import { VoicedText } from '../../src/components/base/VoicedText';
import LanguageSelector from '../../src/components/language/LanguageSelector';
import Input from '../../src/components/base/Input';
import SocialButton from '../../src/components/auth/SocialButton';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { scale, verticalScale } from '../../src/utils/scaling';
import { validateIdentifier } from '../../src/utils/validation';
import { useAppDispatch, useAppSelector, RootState } from '../../src/store';
import { loginStart } from '../../src/store/slices/authSlice';
import { ANIMATION_CONFIG } from '../../src/utils/animations';
import logoImage from '../../assets/images/logo.png';
import backgroundImage from '../../assets/images/background.png';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../src/components/base/Header';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18next from '../../src/i18n';
import { useVoiceGuidance } from '../../src/providers/VoiceGuidanceProvider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setLanguage } from '../../src/store/slices/settingsSlice';
import useAppTranslation from '../../src/hooks/useAppTranslation';
import Divider from '../../src/components/base/Divider';
import { useLanguage } from '../../src/providers/LanguageProvider';
import { Ionicons } from '@expo/vector-icons';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface SocialButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  isLoading?: boolean;
  voiceElementId: string;
}

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useAppTranslation();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'email' | 'phone' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<'google' | 'apple' | null>(null);
  const selectedLanguage = useAppSelector((state: RootState) => state.settings.language);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { startVoiceGuidance, stopVoiceGuidance, readText, isActive, currentElementId } =
    useVoiceGuidance();
  const { currentLanguage } = useLanguage();

  const scrollViewRef = useRef(null);
  const buttonScale = useSharedValue(1);
  const screenHeight = Dimensions.get('window').height;

  const insets = useSafeAreaInsets();

  // Define form container style with insets inside the component
  const formContainerStyle = {
    ...styles.formContainer,
    marginTop: Platform.select({
      ios:
        Dimensions.get('window').height > 700
          ? verticalScale(170) - insets.top
          : verticalScale(150) - insets.top,
      android: verticalScale(220) - insets.top,
    }),
  };

  useEffect(() => {
    if (i18next.language && i18next.language !== selectedLanguage) {
      dispatch(setLanguage(i18next.language as 'en' | 'yo'));
    }
  }, [i18next.language, selectedLanguage, dispatch]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (errorKey) {
      setError(t(errorKey as any));
    }
  }, [currentLanguage, i18next.language, t, errorKey]);

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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleVoicePress = () => {
    if (isActive) {
      stopVoiceGuidance();
    } else {
      startVoiceGuidance();
      setTimeout(() => {
        readText(
          t(
            'auth.description',
            'Browse, listen, and share Oriki that celebrate heritage, lineage, and culture'
          )
        );
      }, 100);
    }
  };

  const handleLanguagePress = () => {
    router.push('/language-modal');
  };

  const handleLanguageSelect = async (language: string) => {
    dispatch(setLanguage(language as 'en' | 'yo'));
  };

  const handleIdentifierChange = (text: string) => {
    setIdentifier(text);
    setError('');
    setErrorKey(null);

    if (isActive && currentElementId === 'login-identifier') {
      readText(getPlaceholder());
    }
  };

  const handleContinue = async () => {
    const trimmedIdentifier = identifier.trim();

    let submissionType = identifierType;
    if (!submissionType) {
      if (trimmedIdentifier.includes('@')) {
        submissionType = 'email';
      } else if (/\d/.test(trimmedIdentifier)) {
        submissionType = 'phone';
      }
    }

    const validationError = validateIdentifier(trimmedIdentifier, submissionType);
    if (validationError) {
      const errorKey = getErrorKeyForValidationError(validationError);
      setErrorKey(errorKey);
      setError(t(errorKey as any));
      readText(t(errorKey as any));
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(
        loginStart({
          identifier: trimmedIdentifier,
          type: submissionType,
        })
      ).unwrap();

      router.push('/auth/user-details');
    } catch (err) {
      let errorKey = 'auth.errors.unexpected';

      if (err instanceof Error) {
        if (err.message.includes('not found')) {
          errorKey = 'auth.errors.notFound';
        } else if (err.message.includes('invalid')) {
          errorKey = 'auth.errors.invalid';
        }
      }

      setErrorKey(errorKey);
      setError(t(errorKey as any));
      readText(t(errorKey as any));
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    return t('auth.input.placeholder.default', 'Enter your email or phone number');
  };

  const handleGooglePress = async () => {
    try {
      setIsSocialLoading('google');
      await dispatch(loginStart({ provider: 'google' })).unwrap();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t('auth.errors.googleFailed', 'Failed to sign in with Google');
      Alert.alert(t('common.error', 'Error'), errorMessage);
      readText(errorMessage);
    } finally {
      setIsSocialLoading(null);
    }
  };

  const handleApplePress = async () => {
    try {
      setIsSocialLoading('apple');
      await dispatch(loginStart({ provider: 'apple' })).unwrap();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t('auth.errors.appleFailed', 'Failed to sign in with Apple');
      Alert.alert(t('common.error', 'Error'), errorMessage);
      readText(errorMessage);
    } finally {
      setIsSocialLoading(null);
    }
  };

  const renderSocialButtons = () => (
    <>
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
    </>
  );

  const getErrorKeyForValidationError = (errorMessage: string): string => {
    if (errorMessage.includes('valid email')) {
      return 'auth.errors.invalidEmail';
    } else if (errorMessage.includes('valid phone')) {
      return 'auth.errors.invalidPhone';
    } else if (errorMessage.includes('required')) {
      return 'auth.errors.required';
    }
    return 'auth.errors.invalid';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.keyboardView}>
          <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
            <Header
              showBack={false}
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
          </ImageBackground>

          <AnimatedLinearGradient
            colors={[
              Platform.OS === 'ios' ? colors.gradient.start : 'rgba(255, 255, 255, 0.0)',
              Platform.OS === 'ios' ? colors.gradient.middle : 'rgba(255, 255, 255, 0.8)',
              Platform.OS === 'ios' ? colors.gradient.end : 'rgba(255, 255, 255, 1.0)',
            ]}
            style={formContainerStyle}
            pointerEvents="box-none"
          >
            <View
              style={Platform.OS === 'android' ? styles.androidFormBackground : undefined}
              pointerEvents="auto"
            >
              <KeyboardAwareScrollView
                ref={scrollViewRef}
                contentContainerStyle={[
                  styles.scrollContent,
                  { minHeight: screenHeight - verticalScale(220) },
                ]}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                bounces={false}
                scrollEnabled={false}
                enableOnAndroid={true}
                enableAutomaticScroll={false}
                scrollToOverflowEnabled={false}
                enableResetScrollToCoords={false}
                keyboardOpeningTime={0}
              >
                <View
                  style={styles.formContent}
                  onStartShouldSetResponder={() => false}
                  onMoveShouldSetResponder={() => false}
                >
                  <View style={styles.logoContainer}>
                    <Animated.Image
                      source={logoImage}
                      style={[styles.logo]}
                      resizeMode="contain"
                      entering={FadeIn.delay(300).duration(ANIMATION_CONFIG.DURATION.MEDIUM)}
                    />
                  </View>

                  <View style={styles.descriptionContainer}>
                    <VoicedText style={styles.description} voiceElementId="login-description">
                      {t(
                        'auth.description',
                        'Browse, listen, and share Oriki that celebrate heritage, lineage, and culture'
                      )}
                    </VoicedText>
                  </View>

                  <View style={styles.inputContainer}>
                    <Input
                      placeholder={getPlaceholder()}
                      value={identifier}
                      onChangeText={handleIdentifierChange}
                      leftIcon={<Ionicons name="person-outline" size={20} color="#666" />}
                      voiceElementId="login-identifier"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType={
                        identifierType === 'email'
                          ? 'email-address'
                          : identifierType === 'phone'
                            ? 'phone-pad'
                            : 'email-address'
                      }
                      error={errorKey ? undefined : error}
                      errorTranslationKey={errorKey}
                      inputStyle={
                        selectedLanguage === 'yo' ? { fontSize: typography.sizes.md } : undefined
                      }
                    />
                  </View>

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
                      <VoicedText
                        style={
                          selectedLanguage === 'yo'
                            ? { ...styles.continueButtonText, letterSpacing: -0.3 }
                            : styles.continueButtonText
                        }
                        voiceElementId="login-continue"
                      >
                        {t('common.continue', 'Continue')}
                      </VoicedText>
                    )}
                  </AnimatedTouchableOpacity>

                  <Divider
                    translationKey="common.or"
                    text="or"
                    voiceElementId="login-or"
                    style={styles.divider}
                  />

                  <View style={styles.socialButtons}>{renderSocialButtons()}</View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </AnimatedLinearGradient>

          <View style={styles.bottomBackground} />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: verticalScale(300),
    position: 'absolute',
    top: 0,
    ...Platform.select({
      android: {
        zIndex: 0,
      },
    }),
  },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    backgroundColor: Platform.OS === 'ios' ? colors.white : 'transparent',
    paddingTop: verticalScale(32),
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: Platform.OS === 'android' ? 0 : 5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(24),
    alignItems: 'center',
  },
  formContent: {
    width: '100%',
    maxWidth: scale(375),
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  logo: {
    width: scale(120),
    height: scale(120),
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: verticalScale(32),
  },
  description: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.primary,
    textAlign: 'center',
    paddingHorizontal: scale(24),
    lineHeight: typography.sizes.lg * 1.4,
  },
  inputContainer: {
    width: '100%',
    minHeight: Platform.OS === 'ios' ? verticalScale(70) : undefined,
    marginBottom: Platform.OS === 'ios' ? verticalScale(8) : 0,
  },
  continueButton: {
    backgroundColor: colors.button.primary,
    borderRadius: scale(100),
    paddingVertical: verticalScale(16),
    width: '100%',
    maxWidth: scale(342),
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  continueButtonText: {
    fontSize: typography.sizes.button,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weights.semiBold,
    color: colors.button.primaryText,
    letterSpacing: -0.5,
  },
  orContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: verticalScale(21),
    marginBottom: verticalScale(21),
  },
  orText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  divider: {
    marginTop: verticalScale(21),
    marginBottom: verticalScale(21),
    width: '100%',
  },
  socialButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: verticalScale(16),
    width: '100%',
    maxWidth: scale(342),
  },
  bottomBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(100),
    backgroundColor: colors.white,
    zIndex: 0,
  },
  androidFormBackground: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    overflow: 'hidden',
    paddingTop: 0,
  },
});

export default LoginScreen;
