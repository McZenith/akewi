import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Button, { ButtonProps } from '../base/Button';
import { useTheme } from '../providers/ThemeProvider';

export interface SaveButtonProps extends Omit<ButtonProps, 'title' | 'variant'> {
  title?: string;
  titleTranslationKey?: string;
  variant?: ButtonProps['variant'];
  saving?: boolean;
  containerStyle?: ViewStyle;
  disableWhileSaving?: boolean;
  saveIcon?: boolean;
}

/**
 * SaveButton Component
 * A specialized button for saving forms with loading state
 */
const SaveButton: React.FC<SaveButtonProps> = ({
  title = 'Save',
  titleTranslationKey = 'common.save',
  variant = 'primary',
  saving = false,
  style,
  containerStyle,
  disableWhileSaving = true,
  saveIcon = true,
  disabled,
  leftIcon,
  ...rest
}) => {
  const { theme } = useTheme();

  // Use default save icon if enabled and no custom left icon is provided
  const buttonLeftIcon =
    saveIcon && !leftIcon ? (
      <React.Fragment>
        {/* This would typically be an icon component, but we're using null as a placeholder */}
        {null}
      </React.Fragment>
    ) : (
      leftIcon
    );

  return (
    <Button
      title={title}
      translationKey={titleTranslationKey}
      variant={variant}
      loading={saving}
      disabled={disabled || (disableWhileSaving && saving)}
      style={[styles.button, style]}
      leftIcon={buttonLeftIcon}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
  },
});

export default SaveButton;
