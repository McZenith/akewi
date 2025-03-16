import React from 'react';
import { TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { scale, verticalScale } from '../../utils/scaling';
import Text from '../base/Text';
import googleIcon from '../../../assets/icons/google.png';
import appleIcon from '../../../assets/icons/apple.png';

interface SocialButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  style?: any;
  disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, onPress, style, disabled }) => {
  const isGoogle = provider === 'google';

  return (
    <TouchableOpacity
      style={[styles.container, isGoogle ? styles.googleButton : styles.appleButton, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${isGoogle ? 'Google' : 'Apple'}`}
      disabled={disabled}
    >
      {disabled ? (
        <ActivityIndicator color={colors.button.social.text} />
      ) : (
        <>
          <Image source={isGoogle ? googleIcon : appleIcon} style={styles.icon} />
          <Text style={styles.text}>Continue with {isGoogle ? 'Google' : 'Apple'}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(342),
    height: verticalScale(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(8),
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    gap: scale(8),
  },
  googleButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.button.social.border,
  },
  appleButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.button.social.border,
  },
  icon: {
    width: scale(24),
    height: scale(24),
  },
  text: {
    color: colors.button.social.text,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.sizes.button,
    fontWeight: typography.weights.semiBold,
    lineHeight: scale(24),
    letterSpacing: -0.5,
  },
});

export default SocialButton;
