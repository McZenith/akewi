import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
import VoiceButton from '../../src/components/base/VoiceButton';
import LanguageSelector from '../../src/components/language/LanguageSelector';
import Input from '../../src/components/base/Input';
import SocialButton from '../../src/components/auth/SocialButton';
import { LOGIN_SCREEN_LAYOUT } from '../../src/constants/screens/auth';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { scale, verticalScale } from '../../src/utils/scaling';
import Text from '../../src/components/base/Text';
import { validateIdentifier } from '../../src/utils/validation';
import { useAppDispatch } from '../../src/store/hooks';
import { loginStart } from '../../src/store/slices/auth';
import { ANIMATION_CONFIG } from '../../src/utils/animations';
import logoImage from '../../assets/images/logo.png';
import backgroundImage from '../../assets/images/background.png';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../src/components/base/Header';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'email' | 'phone' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<'google' | 'apple' | null>(null);

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
    // TODO: Implement voice functionality when voice recognition is ready
    Alert.alert('Coming Soon', 'Voice recognition will be available in the next update');
  };

  const handleLanguagePress = () => {
    // TODO: Implement language selection when i18n is ready
    Alert.alert('Coming Soon', 'Language selection will be available in the next update');
  };

  const handleIdentifierChange = (text: string) => {
    setIdentifier(text);
    setError(null);

    // Detect if input is email or phone
    if (text.includes('@')) {
      setIdentifierType('email');
    } else if (/^[0-9+\s()-]+$/.test(text)) {
      setIdentifierType('phone');
    } else {
      setIdentifierType(null);
    }
  };

  const handleContinue = async () => {
    const validationError = validateIdentifier(identifier, identifierType);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(loginStart({ identifier, type: identifierType })).unwrap();
      // Navigation will be handled by the auth state listener
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGooglePress = async () => {
    try {
      setIsSocialLoading('google');
      await dispatch(loginStart({ provider: 'google' })).unwrap();
      // Navigation will be handled by the auth state listener
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to sign in with Google');
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
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to sign in with Apple');
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
                <LanguageSelector currentLanguage="English" onPress={handleLanguagePress} />
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
                <Text style={styles.description}>
                  Browse, listen, and share Oriki that celebrate heritage, lineage, and culture
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(500).duration(ANIMATION_CONFIG.DURATION.MEDIUM)}
              >
                <Input
                  placeholder="Your email address or Phone number"
                  value={identifier}
                  onChangeText={handleIdentifierChange}
                  keyboardType={identifierType === 'phone' ? 'phone-pad' : 'email-address'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={error ?? undefined}
                  editable={!isLoading}
                />
              </Animated.View>

              <AnimatedTouchableOpacity
                style={[
                  styles.continueButton,
                  isLoading && styles.continueButtonDisabled,
                  buttonAnimatedStyle,
                ]}
                onPress={handleContinue}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.button.primaryText} />
                ) : (
                  <Text style={styles.continueButtonText}>Continue</Text>
                )}
              </AnimatedTouchableOpacity>

              <Animated.Text
                style={styles.alternativeText}
                entering={FadeIn.delay(600).duration(ANIMATION_CONFIG.DURATION.MEDIUM)}
              >
                or
              </Animated.Text>

              <Animated.View
                style={styles.socialButtonsContainer}
                entering={FadeInUp.delay(700).duration(ANIMATION_CONFIG.DURATION.MEDIUM)}
              >
                <SocialButton
                  provider="google"
                  onPress={handleGooglePress}
                  style={isSocialLoading === 'google' && styles.socialButtonDisabled}
                  disabled={isSocialLoading !== null}
                />
                <SocialButton
                  provider="apple"
                  onPress={handleApplePress}
                  style={isSocialLoading === 'apple' && styles.socialButtonDisabled}
                  disabled={isSocialLoading !== null}
                />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </KeyboardAvoidingView>
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
    ...LOGIN_SCREEN_LAYOUT.background,
    width: '100%',
    height: verticalScale(300),
  },
  formContainer: {
    ...LOGIN_SCREEN_LAYOUT.form.container,
    flex: 1,
  },
  logo: {
    ...LOGIN_SCREEN_LAYOUT.form.logo,
  },
  description: {
    ...LOGIN_SCREEN_LAYOUT.form.description,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.sizes.description,
    fontWeight: typography.weights.medium,
    lineHeight: scale(21),
    textAlign: 'center',
    marginBottom: scale(32),
  },
  continueButton: {
    ...LOGIN_SCREEN_LAYOUT.form.continueButton,
    backgroundColor: '#090909',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(345),
    borderRadius: 100,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: colors.button.primaryText,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.sizes.button,
    fontWeight: typography.weights.semiBold,
    lineHeight: scale(24),
    letterSpacing: -0.5,
  },
  alternativeText: {
    ...LOGIN_SCREEN_LAYOUT.alternative,
    color: colors.text.alternative,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    lineHeight: scale(22),
    textAlign: 'center',
    marginVertical: scale(16),
  },
  socialButtonsContainer: {
    ...LOGIN_SCREEN_LAYOUT.social.container,
    width: scale(345),
  },
  socialButtonDisabled: {
    opacity: 0.7,
  },
  formContent: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
});

export default LoginScreen;
