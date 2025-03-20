import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale } from '../../utils/scaling';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Text from '../base/Text';
import { useAppSelector, useAppDispatch } from '../../store';
import { setLanguage } from '../../store/slices/settingsSlice';
import useAppTranslation from '../../hooks/useAppTranslation';

interface LanguageSelectorProps {
  currentLanguage?: string;
  style?: any;
  onPress?: () => void;
  onSelect?: (language: string) => void;
}

// Helper function to get the display name for a language code
const getLanguageDisplayName = (code: string, t: Function): string => {
  switch (code) {
    case 'en':
      return t('language.english', 'English');
    case 'yo':
      return t('language.yoruba', 'Yorùbá');
    default:
      return code;
  }
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  style,
  onPress,
  onSelect,
}) => {
  const { t } = useAppTranslation();
  const { i18n } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get language from Redux store
  const reduxLanguage = useAppSelector(state => state.settings?.language);

  // Effect to sync local state with Redux state
  useEffect(() => {
    // Update Redux if there's a mismatch with i18n
    if (reduxLanguage !== i18n.language && i18n.language) {
      dispatch(setLanguage(i18n.language as 'en' | 'yo'));
    }
  }, [i18n.language, reduxLanguage, dispatch]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/language-modal');
    }
  };

  const handleSelect = (language: string) => {
    if (onSelect) {
      onSelect(language);
    }
    dispatch(setLanguage(language as 'en' | 'yo'));
  };

  // Use Redux language state for consistency, fallback to props or i18n
  const languageCode = currentLanguage || reduxLanguage || i18n.language || 'en';
  const displayName = getLanguageDisplayName(languageCode, t);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={t('language.change', 'Change language. Current language is {{current}}', {
        current: displayName,
      })}
    >
      <Ionicons name="globe-outline" size={scale(16)} color={colors.text.primary} />
      <Text style={styles.text}>{displayName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: scale(100),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    marginLeft: scale(8),
  },
  text: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginLeft: scale(4),
  },
});

export default LanguageSelector;
