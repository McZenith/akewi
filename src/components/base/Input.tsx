import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { scale, verticalScale } from '../../utils/scaling';

interface InputProps extends Omit<TextInputProps, 'style'> {
  error?: string;
  inputStyle?: any;
  containerStyle?: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  error,
  inputStyle,
  containerStyle,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  label,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.containerFocused,
        error && styles.containerError,
        containerStyle,
      ]}
      accessible={true}
      accessibilityLabel={label || placeholder}
      accessibilityState={{
        disabled: props.editable === false,
      }}
      accessibilityRole="none"
    >
      {leftIcon && (
        <View style={styles.leftIcon} accessibilityElementsHidden={true}>
          {leftIcon}
        </View>
      )}

      <TextInput
        style={[
          styles.input,
          leftIcon && styles.inputWithLeftIcon,
          rightIcon && styles.inputWithRightIcon,
          inputStyle,
        ]}
        placeholderTextColor="#ADADAD"
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        selectionColor={colors.text.primary}
        accessibilityRole="text"
        accessibilityLabel={label || placeholder}
        accessibilityHint={placeholder}
        {...props}
      />

      {rightIcon && (
        <View style={styles.rightIcon} accessibilityElementsHidden={true}>
          {rightIcon}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(342),
    height: verticalScale(52),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: scale(8),
    borderWidth: Platform.select({ ios: StyleSheet.hairlineWidth, android: 1 }),
    borderColor: '#E8E8E8',
    paddingHorizontal: scale(16),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  containerFocused: {
    borderColor: colors.text.primary,
    borderWidth: Platform.select({ ios: 1, android: 1.5 }),
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  containerError: {
    borderColor: colors.form.error,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.sizes.input,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    padding: 0,
    ...Platform.select({
      android: {
        paddingVertical: 0,
      },
    }),
  },
  inputWithLeftIcon: {
    paddingLeft: scale(8),
  },
  inputWithRightIcon: {
    paddingRight: scale(8),
  },
  leftIcon: {
    marginRight: scale(8),
  },
  rightIcon: {
    marginLeft: scale(8),
  },
});

export default Input;
