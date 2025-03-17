import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { scale } from '../../utils/scaling';
import Text from '../base/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  currentLanguage: string;
  style?: any;
}

const getLanguageDisplayName = (code: string): string => {
  switch (code) {
    case 'en':
      return 'English';
    case 'yo':
      return 'Yoruba';
    default:
      return code;
  }
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, style }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const handlePress = () => {
    router.push('/language-modal');
  };

  // Use the current i18n language if the prop is not provided
  const languageCode = currentLanguage || i18n.language || 'en';
  const displayName = getLanguageDisplayName(languageCode);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Change language from ${displayName}`}
    >
      <Ionicons name="globe-outline" size={scale(20)} color={colors.text.primary} />
      <Text style={styles.text}>{displayName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(128),
    gap: scale(4),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
});

export default LanguageSelector;
