import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Platform,
  Keyboard,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { scale, verticalScale } from '../../utils/scaling';
import { useVoiceGuidance } from '../../providers/VoiceGuidanceProvider';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from './Text';
import { useLanguage } from '../../providers/LanguageProvider';

interface InputProps extends Omit<TextInputProps, 'style'> {
  error?: string;
  errorTranslationKey?: string;
  inputStyle?: any;
  containerStyle?: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  voiceElementId?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  error,
  errorTranslationKey,
  inputStyle,
  containerStyle,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  label,
  placeholder,
  voiceElementId,
  onSubmitEditing,
  fullWidth = false,
  ...props
}) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { isActive, currentElementId, isWaitingForInput, moveToNextElement, readText } =
    useVoiceGuidance();

  const isCurrentElement = voiceElementId && voiceElementId === currentElementId;

  useEffect(() => {
    if (isCurrentElement && inputRef.current) {
      inputRef.current.focus();
      if (placeholder) {
        readText(placeholder);
      }
    }
  }, [isCurrentElement, placeholder, readText]);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleSubmitEditing = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    if (isCurrentElement) {
      moveToNextElement();
    }
    onSubmitEditing?.(e);
  };

  const handleKeyPress = (e: any) => {
    if (isCurrentElement && e.nativeEvent.key === 'Enter') {
      moveToNextElement();
    }
  };

  // Use memoized error message that updates when language changes
  const errorMessage = useMemo(() => {
    return errorTranslationKey ? t(errorTranslationKey as any) : error;
  }, [error, errorTranslationKey, t, currentLanguage, i18n.language]);

  // Force component to update when language changes
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    forceUpdate(prev => prev + 1);
  }, [currentLanguage, i18n.language]);

  return (
    <View style={fullWidth ? { width: '100%' } : undefined}>
      <View
        style={[
          styles.container,
          fullWidth && styles.fullWidth,
          isFocused && styles.containerFocused,
          errorMessage && styles.containerError,
          isCurrentElement && styles.containerVoiceActive,
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
          ref={inputRef}
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
          onSubmitEditing={handleSubmitEditing}
          onKeyPress={handleKeyPress}
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

        {isCurrentElement && (
          <View style={styles.voiceIcon}>
            <Ionicons name="mic" size={20} color={colors.voice.background} />
          </View>
        )}
      </View>
      {errorMessage && (
        <Text
          style={styles.errorText}
          key={`error-${currentLanguage}`} // Force re-render when language changes
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: scale(342),
    height: verticalScale(52),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.form.background,
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: colors.form.border,
    paddingHorizontal: scale(16),
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  fullWidth: {
    maxWidth: '100%',
  },
  containerFocused: {
    borderColor: colors.text.primary,
    borderWidth: 1.5,
    backgroundColor: colors.form.backgroundFocused,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  containerError: {
    borderColor: colors.form.error,
    borderWidth: 2,
    backgroundColor: Platform.select({
      ios: colors.form.backgroundError,
      android: 'rgba(255, 59, 48, 0.08)',
    }),
    ...Platform.select({
      ios: {
        shadowColor: colors.form.error,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  containerVoiceActive: {
    borderColor: colors.voice.background,
    borderWidth: 2,
    backgroundColor: colors.voice.backgroundLight,
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
        textAlignVertical: 'center',
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
  voiceIcon: {
    marginLeft: scale(8),
    width: scale(20),
    height: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.form.error,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    marginTop: verticalScale(4),
    marginLeft: scale(4),
    ...Platform.select({
      ios: {
        fontSize: typography.sizes.xs,
        lineHeight: typography.sizes.xs * 1.2,
        marginTop: verticalScale(2),
        maxWidth: '95%', // Prevent long text from wrapping too much
      },
    }),
  },
});

export default Input;
