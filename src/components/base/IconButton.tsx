import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  View,
  Animated,
  Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../providers/ThemeProvider';
import Text from './Text';

export type IconButtonSize = 'tiny' | 'small' | 'medium' | 'large';
export type IconButtonVariant = 'default' | 'filled' | 'outlined' | 'tonal';

export interface IconButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  icon: React.ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  color?: string;
  tooltip?: string;
  tooltipTranslationKey?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  disableHaptics?: boolean;
  badge?: number | string;
  badgeColor?: string;
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'medium',
  variant = 'default',
  color,
  tooltip,
  tooltipTranslationKey,
  disabled = false,
  style,
  disableHaptics = false,
  badge,
  badgeColor,
  onPress,
  ...rest
}) => {
  const { theme } = useTheme();

  // Animation for press feedback
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  // Get size-based styles
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'tiny':
        return {
          width: 24,
          height: 24,
          borderRadius: 12,
        };
      case 'small':
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
        };
      case 'large':
        return {
          width: 56,
          height: 56,
          borderRadius: 28,
        };
      case 'medium':
      default:
        return {
          width: 44,
          height: 44,
          borderRadius: 22,
        };
    }
  };

  // Get variant-based styles
  const getVariantStyles = (): ViewStyle => {
    const iconColor = color || theme.colors.primary;

    switch (variant) {
      case 'filled':
        return {
          backgroundColor: iconColor,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: iconColor,
        };
      case 'tonal':
        return {
          backgroundColor: theme.colors.background,
        };
      case 'default':
      default:
        return {
          backgroundColor: 'transparent',
        };
    }
  };

  // Calculate padding based on size
  const getPadding = (): number => {
    switch (size) {
      case 'tiny':
        return 2;
      case 'small':
        return 4;
      case 'large':
        return 12;
      case 'medium':
      default:
        return 8;
    }
  };

  // Handle press with haptic feedback
  const handlePress = () => {
    if (disabled || !onPress) return;

    if (!disableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animate button press
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.9,
        duration: 50,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  // Styles for button
  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();
  const padding = getPadding();

  // Combine styles
  const buttonStyles = [
    styles.container,
    sizeStyles,
    variantStyles,
    { padding },
    disabled && styles.disabled,
    style,
  ];

  // Determine if we need custom color for the icon
  const iconColor = variant === 'filled' ? theme.colors.primary : color || theme.colors.primary;

  // Clone icon element with proper color
  const iconElement = React.isValidElement(icon)
    ? React.cloneElement(icon, {
        color: iconColor,
        size: getIconSize(size),
        // Ensure we don't overwrite original props if icon already has color or size
        ...(icon.props || {}),
      })
    : icon;

  return (
    <Animated.View
      style={{
        transform: [{ scale: animatedValue }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={handlePress}
        style={buttonStyles}
        accessibilityRole="button"
        accessibilityLabel={tooltip || tooltipTranslationKey}
        accessibilityState={{ disabled }}
        {...rest}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>{iconElement}</View>

        {/* Badge */}
        {badge !== undefined && (
          <View
            style={[
              styles.badge,
              { backgroundColor: badgeColor || theme.colors.error },
              typeof badge === 'number' && badge > 99 ? styles.largeBadge : null,
            ]}
          >
            <Text style={styles.badgeText} color={theme.colors.error}>
              {typeof badge === 'number' && badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Tooltip - Rendered only if tooltip is provided */}
      {(tooltip || tooltipTranslationKey) && (
        <View style={styles.tooltipContainer} pointerEvents="none">
          {tooltipTranslationKey ? (
            <Text
              translationKey={tooltipTranslationKey as any}
              variant="caption"
              style={styles.tooltip}
            >
              {tooltip}
            </Text>
          ) : (
            <Text variant="caption" style={styles.tooltip}>
              {tooltip}
            </Text>
          )}
        </View>
      )}
    </Animated.View>
  );
};

// Helper function to get icon size based on button size
const getIconSize = (size: IconButtonSize): number => {
  switch (size) {
    case 'tiny':
      return 16;
    case 'small':
      return 20;
    case 'large':
      return 32;
    case 'medium':
    default:
      return 24;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  largeBadge: {
    minWidth: 24,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: -24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0, // Hidden by default, would need additional code to show on hover/press
  },
  tooltip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    color: '#FFFFFF',
  },
});

export default IconButton;
