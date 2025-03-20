import React from 'react';
import { TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { scale, verticalScale } from '../../utils/scaling';
import Text from '../base/Text';
import useAppTranslation from '../../hooks/useAppTranslation';
import { useVoiceGuidance } from '../../providers/VoiceGuidanceProvider';
import googleIcon from '../../../assets/icons/google.png';
import appleIcon from '../../../assets/icons/apple.png';

interface SocialButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  style?: any;
  disabled?: boolean;
  voiceElementId?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  style,
  disabled,
  voiceElementId,
}) => {
  const { t } = useAppTranslation();
  const { isActive, currentElementId, readText } = useVoiceGuidance();
  const isGoogle = provider === 'google';
  const isCurrentElement = voiceElementId && voiceElementId === currentElementId;

  const handlePress = () => {
    if (isCurrentElement) {
      readText(t(`auth.social.${provider}`));
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isGoogle ? styles.googleButton : styles.appleButton,
        isCurrentElement && styles.voiceActiveButton,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={t(`auth.social.${provider}`)}
      disabled={disabled}
    >
      {disabled ? (
        <ActivityIndicator color={colors.button.social.text} />
      ) : (
        <>
          <Image source={isGoogle ? googleIcon : appleIcon} style={styles.icon} />
          <Text style={styles.text}>{t(`auth.social.${provider}`)}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: scale(342),
    height: verticalScale(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(8),
    paddingVertical: scale(14),
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
  voiceActiveButton: {
    borderColor: colors.voice.background,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 99, 99, 0.05)',
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
