import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../providers/LanguageProvider';
import { useTheme } from '../../providers/ThemeProvider';
import Text from '../base/Text';
import { supportedLanguages } from '../../contexts/LanguageContext';

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

type LanguageSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
};
const LanguageSelectionModal = ({ visible, onClose }: LanguageSelectionModalProps) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, shadows } = theme;

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    onClose();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      maxHeight: '70%',
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      ...shadows.md,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    closeButton: {
      padding: spacing.xs,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedLanguage: {
      backgroundColor: colors.primaryLight,
    },
    languageInfo: {
      flex: 1,
    },
    checkIcon: {
      marginLeft: spacing.sm,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
    },
  });

  const renderLanguageItem = ({ item }: { item: Language }) => {
    const isSelected = currentLanguage === item.code;

    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.selectedLanguage]}
        onPress={() => handleLanguageSelect(item.code)}
        accessibilityRole="radio"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={item.name}
      >
        <View style={styles.languageInfo}>
          <Text variant="subtitle1" style={{ marginBottom: spacing.xs }}>
            {item.name}
          </Text>
          <Text variant="body2" color={colors.textSecondary}>
            {item.nativeName}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark" size={24} color={colors.primary} style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text variant="subtitle1">{t('settings.selectLanguage')}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  accessibilityLabel={t('common.close')}
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={supportedLanguages}
                renderItem={renderLanguageItem}
                keyExtractor={item => item.code}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LanguageSelectionModal;
