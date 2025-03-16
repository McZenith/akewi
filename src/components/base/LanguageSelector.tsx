import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../../providers/LanguageProvider';
import useAppTranslation from '../../hooks/useAppTranslation';
import Text from './Text';
import { useTheme } from '../../providers/ThemeProvider';

/**
 * LanguageSelector Component
 * Allows the user to switch between English and Yoruba languages
 */
const LanguageSelector: React.FC = () => {
  const { currentLanguage: language, changeLanguage } = useLanguage();
  const { t } = useAppTranslation();
  const { theme } = useTheme();

  const handleLanguageChange = (lang: 'en' | 'yo') => {
    changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text variant="h2">{t('settings.language')}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            {
              backgroundColor: language === 'en' ? theme.colors.primary : theme.colors.background,
            },
          ]}
          onPress={() => handleLanguageChange('en')}
        >
          <Text variant="body1" color={language === 'en' ? 'white' : 'text'}>
            {t('settings.english')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            {
              backgroundColor: language === 'yo' ? theme.colors.primary : theme.colors.background,
            },
          ]}
          onPress={() => handleLanguageChange('yo')}
        >
          <Text variant="body1" color={language === 'yo' ? 'white' : 'text'}>
            {t('settings.yoruba')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.exampleContainer}>
        <Text variant="h3" style={styles.exampleTitle}>
          {t('common.examples')}
        </Text>

        <Text variant="body1" style={styles.exampleText}>
          {t('common.appName')}
        </Text>

        <Text variant="body1" style={styles.exampleText}>
          {t('auth.login')} / {t('auth.signup')}
        </Text>

        <Text variant="body1" style={styles.exampleText}>
          {t('home.featuredOriki')}
        </Text>
        <Text variant="body1" style={styles.exampleText}>
          {t('common.play')} / {t('common.pause')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  exampleContainer: {
    marginTop: 16,
  },
  exampleTitle: {
    marginBottom: 12,
  },
  exampleText: {
    marginBottom: 8,
  },
});

export default LanguageSelector;
