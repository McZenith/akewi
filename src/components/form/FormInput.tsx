import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Input, { InputProps } from '../base/Input';
import Text from '../base/Text';
import { useTheme } from '../../providers/ThemeProvider';
import { TranslationKey } from '../../hooks/useAppTranslation';

export interface FormInputProps extends Omit<InputProps, 'label' | 'error' | 'errorTranslationKey'> {
  name: string;
  label?: string;
  labelTranslationKey?: string;
  required?: boolean;
  error?: string | { message?: string; key?: string } | null;
  touched?: boolean;
  showRequiredLabel?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  showErrorOnlyWhenTouched?: boolean;
}

/**
 * FormInput Component
 * A specialized Input component for use in forms with form-specific functionality
 */
const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  labelTranslationKey,
  required = false,
  error,
  touched = true,
  showRequiredLabel = true,
  containerStyle,
  labelStyle,
  showErrorOnlyWhenTouched = true,
  ...rest
}) => {
  const { theme } = useTheme();

  // Only show error if the field has been touched
  const showError = error && (!showErrorOnlyWhenTouched || touched);

  // Extract error message and translation key if error is an object
  let errorMessage: string | undefined;
  let errorTranslationKey: string | undefined;

  if (showError) {
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = error.message;
      errorTranslationKey = error.key;
    }
  }

  // Support both direct label text and translation key
  const displayLabel = label || labelTranslationKey;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label with required indicator */}
      {displayLabel && (
        <View style={styles.labelContainer}>
          {label ? (
            <Text
              variant="body2"
              color={theme.colors.textSecondary}
              style={[styles.label, labelStyle]}
            >
              {label}
              {required && showRequiredLabel && <Text color={theme.colors.error}> *</Text>}
            </Text>
          ) : (
            <Text
              variant="body2"
              color={theme.colors.textSecondary}
              style={[styles.label, labelStyle]}
              translationKey={labelTranslationKey as TranslationKey}
            >
              {required && showRequiredLabel && <Text color={theme.colors.error}> *</Text>}
            </Text>
          )}
        </View>
      )}

      {/* Input component with props forwarded */}
      <Input
        fullWidth
        error={errorMessage}
        errorTranslationKey={errorTranslationKey}
        accessibilityLabel={label}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontWeight: '500',
  },
});

export default FormInput;
