import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Dimensions,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import Text from '../base/Text';
import Input from '../base/Input';

export interface SelectOption {
  label: string;
  value: string | number;
  translationKey?: string;
  disabled?: boolean;
}

export interface SelectInputProps {
  label?: string;
  labelTranslationKey?: string;
  placeholder?: string;
  placeholderTranslationKey?: string;
  value?: string | number | null;
  options: SelectOption[];
  error?: string | null;
  errorTranslationKey?: string;
  disabled?: boolean;
  searchable?: boolean;
  required?: boolean;
  showRequiredLabel?: boolean;
  searchPlaceholder?: string;
  searchPlaceholderTranslationKey?: string;
  containerStyle?: ViewStyle;
  modalTitle?: string;
  modalTitleTranslationKey?: string;
  onChange: (value: string | number) => void;
  optionLabelStyle?: TextStyle;
}

/**
 * SelectInput Component
 * A dropdown selection component that supports searching and localization
 */
const SelectInput: React.FC<SelectInputProps> = ({
  label,
  labelTranslationKey,
  placeholder = 'Select an option',
  placeholderTranslationKey,
  value,
  options,
  error,
  errorTranslationKey,
  disabled = false,
  searchable = false,
  required = false,
  showRequiredLabel = true,
  searchPlaceholder = 'Search...',
  searchPlaceholderTranslationKey,
  containerStyle,
  modalTitle,
  modalTitleTranslationKey,
  onChange,
  optionLabelStyle,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;

  // Find selected option
  const selectedOption =
    value !== null && value !== undefined ? options.find(option => option.value === value) : null;

  // Filter options based on search query
  const filteredOptions =
    searchable && searchQuery
      ? options.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options;

  // Animation for modal
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  // Open modal with animation
  const openModal = () => {
    if (disabled) return;

    setModalVisible(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close modal with animation
  const closeModal = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSearchQuery('');
    });
  };

  // Handle option selection
  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    onChange(option.value);
    closeModal();
  };

  // Render option
  const renderOption = ({ item }: { item: SelectOption }) => {
    const isSelected = value === item.value;
    const isDisabled = item.disabled === true;

    return (
      <TouchableOpacity
        style={[
          styles.option,
          isSelected && { backgroundColor: theme.colors.card },
          isDisabled && styles.disabledOption,
        ]}
        onPress={() => handleSelect(item)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        {item.translationKey ? (
          <Text
            translationKey={item.translationKey as any} // Type assertion to fix type error
            variant="body1"
            style={[optionLabelStyle, isDisabled && { color: theme.colors.textSecondary }]}
          >
            {item.label}
          </Text>
        ) : (
          <Text
            variant="body1"
            style={[optionLabelStyle, isDisabled && { color: theme.colors.textSecondary }]}
          >
            {item.label}
          </Text>
        )}

        {isSelected && <Feather name="check" size={20} color={theme.colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label with required indicator */}
      {(label || labelTranslationKey) && (
        <View style={styles.labelContainer}>
          {label ? (
            <Text variant="body2" color={theme.colors.textSecondary} style={styles.label}>
              {label}
              {required && showRequiredLabel && <Text color={theme.colors.error}> *</Text>}
            </Text>
          ) : (
            <Text
              variant="body2"
              color={theme.colors.textSecondary}
              style={styles.label}
              translationKey={labelTranslationKey as any} // Type assertion to fix type error
            >
              {required && showRequiredLabel && <Text color={theme.colors.error}> *</Text>}
            </Text>
          )}
        </View>
      )}

      {/* Select Input */}
      <TouchableOpacity
        style={[
          styles.selectContainer,
          {
            borderColor: error ? theme.colors.error : theme.colors.border,
            backgroundColor: theme.colors.background,
          },
          disabled && styles.disabled,
        ]}
        onPress={openModal}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {selectedOption ? (
          <View style={styles.selectedTextContainer}>
            {selectedOption.translationKey ? (
              <Text
                translationKey={selectedOption.translationKey as any} // Type assertion to fix type error
                variant="body1"
                // eslint-disable-next-line react/no-children-prop
                style={styles.selectedText}
              >
                {selectedOption.label}
              </Text>
            ) : (
              <Text variant="body1" style={styles.selectedText}>
                {selectedOption.label}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            {placeholderTranslationKey ? (
              <Text
                translationKey={placeholderTranslationKey as any} // Type assertion to fix type error
                variant="body1"
                color={theme.colors.textSecondary}
                // eslint-disable-next-line react/no-children-prop
                style={styles.placeholder}
              >
                {placeholder}
              </Text>
            ) : (
              <Text variant="body1" color={theme.colors.textSecondary} style={styles.placeholder}>
                {placeholder}
              </Text>
            )}
          </View>
        )}

        {/* Dropdown Icon */}
        <Feather
          name="chevron-down"
          size={20}
          color={disabled ? theme.colors.textSecondary : theme.colors.text}
        />
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          {errorTranslationKey ? (
            <Text
              translationKey={errorTranslationKey as any} // Type assertion to fix type error
              variant="caption"
              color={theme.colors.error}
              // eslint-disable-next-line react/no-children-prop
              style={styles.errorText}
            >
              {error}
            </Text>
          ) : (
            <Text variant="caption" color={theme.colors.error} style={styles.errorText}>
              {error}
            </Text>
          )}
        </View>
      )}

      {/* Options Modal */}
      <Modal visible={modalVisible} transparent animationType="none" onRequestClose={closeModal}>
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.colors.background,
                transform: [{ translateY }],
              },
            ]}
          >
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              {modalTitleTranslationKey ? (
                <Text
                  translationKey={modalTitleTranslationKey as any} // Type assertion to fix type error
                  variant="h3"
                  // eslint-disable-next-line react/no-children-prop
                  style={styles.modalTitle}
                >
                  {modalTitle || label || placeholder}
                </Text>
              ) : (
                <Text variant="h3" style={styles.modalTitle}>
                  {modalTitle || label || placeholder}
                </Text>
              )}

              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Feather name="x" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Search Input (if searchable) */}
            {searchable && (
              <View style={styles.searchContainer}>
                <Input
                  placeholder={searchPlaceholder}
                  labelTranslationKey={searchPlaceholderTranslationKey}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  startAdornment={
                    <Feather
                      name="search"
                      size={20}
                      color={theme.colors.textSecondary}
                      style={styles.searchIcon}
                    />
                  }
                  fullWidth
                  clearable
                  autoFocus
                />
              </View>
            )}

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={item => item.value.toString()}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text variant="body1" color={theme.colors.textSecondary} style={styles.emptyText}>
                    No options found
                  </Text>
                </View>
              }
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontWeight: '500',
  },
  selectContainer: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabled: {
    opacity: 0.5,
  },
  selectedTextContainer: {
    flex: 1,
  },
  selectedText: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
  },
  errorContainer: {
    marginTop: 4,
  },
  errorText: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  optionsList: {
    padding: 8,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledOption: {
    opacity: 0.5,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default SelectInput;
