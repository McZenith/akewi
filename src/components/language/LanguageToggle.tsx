import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  Animated,
  Easing,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../providers/ThemeProvider';
import Text from '../base/Text';
import { useLanguage } from '../../providers/LanguageProvider';

export interface LanguageToggleProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  primaryLanguage?: string;
  secondaryLanguage?: string;
  iconSize?: number;
  compact?: boolean;
  label?: string;
  labelTranslationKey?: string;
  onPress?: () => void;
}

/**
 * LanguageToggle Component
 * A compact button for quickly switching between two languages
 */
const LanguageToggle: React.FC<LanguageToggleProps> = ({
  style,
  textStyle,
  primaryLanguage = 'en',
  secondaryLanguage = 'yo',
  iconSize = 24,
  compact = true,
  label,
  labelTranslationKey,
  onPress,
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isAnimating, setIsAnimating] = React.useState(false);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  // Determine current language
  const isCurrentPrimary = currentLanguage === primaryLanguage;

  // Get display text for the languages
  const getLanguageDisplay = (code: string) => {
    switch (code) {
      case 'en':
        return 'EN';
      case 'yo':
        return 'YO';
      default:
        return code.toUpperCase();
    }
  };

  // Handle language switch
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      changeLanguage(isCurrentPrimary ? secondaryLanguage : primaryLanguage);
    }
  };

  // Calculate rotation for animation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      padding: compact ? theme.spacing.xs : theme.spacing.sm,
    },
    text: {
      color: theme.colors.text,
      fontWeight: '600',
      fontSize: compact ? 12 : 14,
    },
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessibilityLabel={`Switch to ${isCurrentPrimary ? secondaryLanguage : primaryLanguage} language`}
      accessibilityRole="button"
    >
      <View style={styles.container}>
        <Text style={styles.text}>{getLanguageDisplay(currentLanguage)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  labelContainer: {
    marginBottom: 4,
  },
  label: {
    fontWeight: '500',
  },
  compactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  toggleButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    position: 'relative',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  languageText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  activeLang: {
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 20,
  },
  activeIndicator: {
    position: 'absolute',
    width: 36,
    height: 32,
    borderRadius: 16,
    top: 3,
    zIndex: -1,
  },
});

export default LanguageToggle;
