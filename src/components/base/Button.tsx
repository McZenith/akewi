import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../providers/ThemeProvider';
import Text from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  translationKey?: string;
  fullWidth?: boolean;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  disableHaptics?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  translationKey,
  fullWidth = false,
  textStyle,
  style,
  disableHaptics = false,
  onPress,
  ...rest
}) => {
  const { theme } = useTheme();

  // Determine if button is in disabled state (either explicitly disabled or in loading state)
  const isDisabled = disabled || loading;

  // Define size-based styles
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.borderRadius.sm,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: theme.borderRadius.md,
          minHeight: 56,
        };
      case 'medium':
      default:
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.borderRadius.md,
          minHeight: 48,
        };
    }
  };

  // Define variant-based styles
  const getVariantStyles = (): {
    container: ViewStyle;
    text: TextStyle;
    loadingColor: string;
  } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.secondary,
            borderWidth: 0,
          },
          text: {
            color: theme.colors.secondary,
          },
          loadingColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.colors.primary,
          },
          text: {
            color: theme.colors.primary,
          },
          loadingColor: theme.colors.primary,
        };
      case 'text':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            paddingHorizontal: theme.spacing.sm,
          },
          text: {
            color: theme.colors.primary,
          },
          loadingColor: theme.colors.primary,
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: theme.colors.primary,
            borderWidth: 0,
            ...Platform.select({
              ios: {
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
              },
              android: {
                elevation: 2,
              },
            }),
          },
          text: {
            color: theme.colors.primary,
          },
          loadingColor: theme.colors.primary,
        };
    }
  };

  // Get styles based on variant and size
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Combine all button styles
  const buttonStyles = [
    styles.button,
    sizeStyles,
    variantStyles.container,
    fullWidth && styles.fullWidth,
    isDisabled && {
      opacity: 0.6,
      ...(variant !== 'text' &&
        variant !== 'outline' && { backgroundColor: theme.colors.background }),
    },
    style,
  ];

  // Handle press with haptic feedback if enabled
  const handlePress = (e: any) => {
    if (!isDisabled && onPress) {
      if (!disableHaptics) {
        // Apply haptic feedback
        if (variant === 'primary' || variant === 'secondary') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
      onPress(e);
    }
  };

  // Combine text styles
  const combinedTextStyle = [
    styles.text,
    variantStyles.text,
    size === 'small' && { fontSize: theme.typography.fontSize.sm },
    size === 'large' && { fontSize: theme.typography.fontSize.lg },
    textStyle,
  ];

  return (
    <TouchableOpacity
      activeOpacity={variant === 'text' ? 0.4 : 0.8}
      disabled={isDisabled}
      onPress={handlePress}
      style={buttonStyles}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityHint={translationKey ? undefined : title}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'small' ? 'small' : 'small'}
          color={variantStyles.loadingColor}
          style={styles.loader}
        />
      ) : (
        <React.Fragment>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          {translationKey ? (
            <Text variant="button" style={combinedTextStyle} translationKey={translationKey as any}>
              {title}
            </Text>
          ) : (
            <Text variant="button" style={combinedTextStyle}>
              {title}
            </Text>
          )}

          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </React.Fragment>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  loader: {
    marginHorizontal: 4,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button;
