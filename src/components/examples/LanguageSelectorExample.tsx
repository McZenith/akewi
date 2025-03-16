import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Text from '../base/Text';
import Button from '../base/Button';
import LanguageToggle from '../language/LanguageToggle';
import { useLanguage } from '../../providers/LanguageProvider';
import { useTheme } from '../../providers/ThemeProvider';

/**
 * LanguageSelectorExample Component
 * Showcases the language selection components and features
 */
const LanguageSelectorExample: React.FC = () => {
  const { theme } = useTheme();
  const { currentLanguage, languages, isRTL } = useLanguage();
  const router = useRouter();

  // Get current language details
  const currentLangDetails = languages.find(lang => lang.code === currentLanguage);

  const handleOpenLanguageModal = () => {
    router.push('/language-modal');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" translationKey="common.appName" />
        <Text variant="subtitle1">Language Selector Components</Text>
      </View>

      {/* Current Language Info */}
      <View style={styles.section}>
        <Text variant="h3" translationKey="settings.language" />

        <View style={styles.infoCard}>
          <Text variant="body2" color={theme.colors.textSecondary}>
            Current Language:
          </Text>
          <View style={styles.langInfoRow}>
            {currentLangDetails?.flag && <Text style={styles.flag}>{currentLangDetails.flag}</Text>}
            <Text variant="body1" style={styles.languageName}>
              {currentLangDetails?.name || currentLanguage}
            </Text>
            {currentLangDetails?.localName &&
              currentLangDetails.localName !== currentLangDetails.name && (
                <Text variant="body2" color={theme.colors.textSecondary} style={styles.localName}>
                  ({currentLangDetails.localName})
                </Text>
              )}
          </View>

          <Text variant="body2" color={theme.colors.textSecondary} style={styles.directionInfo}>
            Text Direction: {isRTL ? 'Right to Left (RTL)' : 'Left to Right (LTR)'}
          </Text>
        </View>
      </View>

      {/* Language Toggle */}
      <View style={styles.section}>
        <Text variant="h3">Compact Language Toggle</Text>
        <Text variant="body2" color={theme.colors.textSecondary} style={styles.description}>
          A compact toggle for quickly switching between primary languages
        </Text>

        <View style={styles.toggleRow}>
          <LanguageToggle compact style={styles.toggle} />

          <LanguageToggle style={styles.toggle} />

          <LanguageToggle label="Language" style={styles.toggle} />
        </View>
      </View>

      {/* Language Selection Modal */}
      <View style={styles.section}>
        <Text variant="h3">Language Selection Modal</Text>
        <Text variant="body2" color={theme.colors.textSecondary} style={styles.description}>
          A modal for selecting from all available languages
        </Text>

        <Button
          title="Open Language Selection"
          translationKey="settings.selectLanguage"
          onPress={handleOpenLanguageModal}
          leftIcon={<Feather name="globe" size={20} color={theme.colors.onPrimary} />}
          style={styles.button}
        />
      </View>

      {/* Localized Content Example */}
      <View style={styles.section}>
        <Text variant="h3" translationKey="examples.localizedContent" />
        <Text
          variant="body2"
          color={theme.colors.textSecondary}
          style={styles.description}
          translationKey="examples.switchLanguage"
        />

        <View style={styles.translationCard}>
          <Text variant="body1" translationKey="examples.greeting" />
          <Text variant="body1" translationKey="examples.welcome" />
          <Text variant="body1" translationKey="examples.thankYou" />
        </View>
      </View>

      {/* Translation Keys Examples */}
      <View style={styles.section}>
        <Text variant="h3">Translation Key Examples</Text>

        <View style={styles.keyExamples}>
          <View style={styles.keyRow}>
            <Text variant="body2" color={theme.colors.textSecondary} style={styles.keyLabel}>
              common.save:
            </Text>
            <Text variant="body1" translationKey="common.save" />
          </View>

          <View style={styles.keyRow}>
            <Text variant="body2" color={theme.colors.textSecondary} style={styles.keyLabel}>
              common.cancel:
            </Text>
            <Text variant="body1" translationKey="common.cancel" />
          </View>

          <View style={styles.keyRow}>
            <Text variant="body2" color={theme.colors.textSecondary} style={styles.keyLabel}>
              common.edit:
            </Text>
            <Text variant="body1" translationKey="common.edit" />
          </View>

          <View style={styles.keyRow}>
            <Text variant="body2" color={theme.colors.textSecondary} style={styles.keyLabel}>
              errors.required:
            </Text>
            <Text variant="body1" translationKey="errors.required" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
  },
  infoCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  langInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontWeight: '600',
    fontSize: 18,
  },
  localName: {
    marginLeft: 8,
  },
  directionInfo: {
    marginTop: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 16,
  },
  toggle: {
    marginRight: 16,
    marginBottom: 16,
  },
  button: {
    maxWidth: 300,
  },
  translationCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  keyExamples: {
    marginTop: 16,
  },
  keyRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  keyLabel: {
    width: 140,
    marginRight: 8,
  },
});

export default LanguageSelectorExample;
