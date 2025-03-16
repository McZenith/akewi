import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import useAppTranslation, { TranslationKey } from '../../hooks/useAppTranslation';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button';

export interface TextProps extends RNTextProps, Pick<AccessibilityProps, 'accessibilityLabel'> {
  variant?: TextVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  // Optional translation key - will be used instead of children if provided
  translationKey?: TranslationKey;
  // Optional translation params for dynamic content
  translationParams?: Record<string, any>;
  // Whether text should be accessible to screen readers but not visible
  isAccessibilityOnly?: boolean;
  // Accessibility role for screen readers
  accessibilityRole?: AccessibilityProps['accessibilityRole'];
  // Whether this text is a heading and what level (1-6)
  accessibilityHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Text = ({
  variant = 'body1',
  color,
  align,
  style,
  children,
  translationKey,
  translationParams,
  accessibilityLabel,
  isAccessibilityOnly = false,
  accessibilityRole,
  accessibilityHeadingLevel,
  ...rest
}: TextProps) => {
  const { theme } = useTheme();
  const { t } = useAppTranslation();

  // Build styles based on variant and theme
  const getVariantStyle = (variant: TextVariant): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSize.xxxl,
          fontWeight: 'bold',
          lineHeight: theme.typography.lineHeight.xxxl,
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSize.xxl,
          fontWeight: 'bold',
          lineHeight: theme.typography.lineHeight.xxl,
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSize.xl,
          fontWeight: 'bold',
          lineHeight: theme.typography.lineHeight.xl,
        };
      case 'subtitle1':
        return {
          fontSize: theme.typography.fontSize.lg,
          fontWeight: '600',
          lineHeight: theme.typography.lineHeight.lg,
        };
      case 'subtitle2':
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: '600',
          lineHeight: theme.typography.lineHeight.md,
        };
      case 'body1':
        return {
          fontSize: theme.typography.fontSize.md,
          lineHeight: theme.typography.lineHeight.md,
        };
      case 'body2':
        return {
          fontSize: theme.typography.fontSize.sm,
          lineHeight: theme.typography.lineHeight.sm,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSize.xs,
          lineHeight: theme.typography.lineHeight.xs,
        };
      case 'button':
        return {
          fontSize: theme.typography.fontSize.md,
          fontWeight: '600',
          letterSpacing: 0.5,
        };
      default:
        return {};
    }
  };

  // Map variant to appropriate accessibility role if not explicitly set
  const getAccessibilityRole = (): AccessibilityProps['accessibilityRole'] => {
    if (accessibilityRole) return accessibilityRole;
    
    // Default mapping based on variant
    if (variant.startsWith('h')) return 'header';
    if (variant === 'button') return 'text';
    return 'text';
  };

  // Determine heading level based on variant or explicit setting
  const getHeadingLevel = (): AccessibilityProps['accessibilityHint'] => {
    if (accessibilityHeadingLevel) {
      return `Heading level ${accessibilityHeadingLevel}`;
    }
    
    if (variant === 'h1') return 'Heading level 1';
    if (variant === 'h2') return 'Heading level 2';
    if (variant === 'h3') return 'Heading level 3';
    return undefined;
  };

  // Get translated content if translationKey is provided
  const content = translationKey ? t(translationKey, translationParams) : children;

  const textStyles = [
    { color: theme.colors.text },
    getVariantStyle(variant),
    align && { textAlign: align },
    color && { color: color === 'text' ? theme.colors.text : color },
    isAccessibilityOnly && styles.accessibilityOnly,
    style,
  ];

  return (
    <RNText 
      style={textStyles} 
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={getAccessibilityRole()}
      accessibilityHint={getHeadingLevel()}
      accessible={true}
      {...rest}
    >
      {content}
    </RNText>
  );
};

const styles = StyleSheet.create({
  accessibilityOnly: {
    position: 'absolute',
    height: 1,
    width: 1,
    overflow: 'hidden',
  },
});

export default Text;
