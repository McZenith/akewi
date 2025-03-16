import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import Text from './Text';
import { useTranslation } from 'react-i18next';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  labelTranslationKey?: string;
  error?: string;
  errorTranslationKey?: string;
  helperText?: string;
  helperTextTranslationKey?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  clearable?: boolean;
  fullWidth?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  focusColor?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  labelTranslationKey,
  error,
  errorTranslationKey,
  helperText,
  helperTextTranslationKey,
  startAdornment,
  endAdornment,
  clearable = false,
  fullWidth = false,
  containerStyle,
  labelStyle,
  inputStyle,
  inputContainerStyle,
  errorStyle,
  helperTextStyle,
  focusColor,
  onFocus,
  onBlur,
  onChangeText,
  value,
  placeholder,
  placeholderTextColor,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Animation config
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || inputValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, inputValue, animatedValue]);

  // Handle focus events
  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  // Handle input change
  const handleChangeText = (text: string) => {
    setInputValue(text);
    onChangeText && onChangeText(text);
  };

  // Clear input
  const handleClear = () => {
    setInputValue('');
    onChangeText && onChangeText('');
    inputRef.current?.focus();
  };

  // Handle input container press
  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  // Border color animation
  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? theme.colors.error : theme.colors.border,
      error ? theme.colors.error : focusColor ? focusColor : theme.colors.primary,
    ],
  });

  // Label animations
  const labelTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });

  const labelScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  const labelColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? theme.colors.error : theme.colors.textSecondary,
      error
        ? theme.colors.error
        : isFocused
          ? focusColor || theme.colors.primary
          : theme.colors.textSecondary,
    ],
  });

  // Get placeholder text
  const placeholderText = isFocused ? placeholder : '';
  const actualPlaceholderColor = placeholderTextColor || theme.colors.textSecondary;

  // Get display text for label, error, and helper text
  const displayLabel = labelTranslationKey ? t(labelTranslationKey) : label;
  const displayError = errorTranslationKey ? t(errorTranslationKey) : error;
  const displayHelperText = helperTextTranslationKey ? t(helperTextTranslationKey) : helperText;

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth, containerStyle]}>
      {/* Label */}
      {displayLabel && (
        <Animated.Text
          style={[
            styles.label,
            {
              color: theme.colors.textSecondary,
              transform: [{ translateY: labelTranslateY }, { scale: labelScale }],
              color: labelColor,
            },
            labelStyle,
          ]}
        >
          {displayLabel}
        </Animated.Text>
      )}

      {/* Input Container */}
      <TouchableWithoutFeedback onPress={handleContainerPress}>
        <Animated.View
          style={[
            styles.inputContainer,
            {
              borderColor: borderColor,
              backgroundColor: theme.colors.surfaceVariant,
            },
            isFocused && styles.focused,
            error && { borderColor: theme.colors.error },
            inputContainerStyle,
          ]}
        >
          {/* Start Adornment */}
          {startAdornment && <View style={styles.adornment}>{startAdornment}</View>}

          {/* TextInput */}
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.md,
              },
              inputStyle,
            ]}
            placeholderTextColor={actualPlaceholderColor}
            placeholder={placeholderText}
            value={inputValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            selectionColor={focusColor || theme.colors.primary}
            {...rest}
          />

          {/* Clear Button */}
          {clearable && inputValue.length > 0 && (
            <Pressable
              onPress={handleClear}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Clear text"
              accessibilityHint="Clears the text from the input field"
            >
              <View style={[styles.clearIcon, { borderColor: theme.colors.textSecondary }]} />
            </Pressable>
          )}

          {/* End Adornment */}
          {endAdornment && <View style={styles.adornment}>{endAdornment}</View>}
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Error Message or Helper Text */}
      <View style={styles.bottomTextContainer}>
        {displayError ? (
          <Text variant="caption" color={theme.colors.error} style={[styles.errorText, errorStyle]}>
            {displayError}
          </Text>
        ) : displayHelperText ? (
          <Text
            variant="caption"
            color={theme.colors.textSecondary}
            style={[styles.helperText, helperTextStyle]}
          >
            {displayHelperText}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    position: 'relative',
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    position: 'absolute',
    left: 0,
    top: 16,
    zIndex: 1,
    paddingHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
    position: 'relative',
  },
  focused: {
    borderWidth: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  adornment: {
    marginHorizontal: 4,
  },
  clearButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    position: 'relative',
  },
  bottomTextContainer: {
    minHeight: 20,
    paddingTop: 4,
  },
  errorText: {
    marginTop: 2,
  },
  helperText: {
    marginTop: 2,
  },
});

export default Input;
