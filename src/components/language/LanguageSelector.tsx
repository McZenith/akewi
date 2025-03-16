import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { scale } from '../../utils/scaling';
import Text from '../base/Text';
import { Ionicons } from '@expo/vector-icons';

interface LanguageSelectorProps {
  currentLanguage: string;
  onPress: () => void;
  style?: any;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onPress, style }) => (
  <TouchableOpacity
    style={[styles.container, style]}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={`Change language. Current language is ${currentLanguage}`}
  >
    <Ionicons name="globe-outline" size={scale(20)} color={colors.text.primary} />
    <Text style={styles.text}>{currentLanguage}</Text>
  </TouchableOpacity>
);

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
