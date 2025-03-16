import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import Text from '../base/Text';
import { useTheme } from '../providers/ThemeProvider';
import { useLanguage } from '../providers/LanguageProvider';
import * as Localization from 'expo-localization';

/**
 * TextExample Component
 * Showcases different variations and features of the Text component
 */
const TextExample: React.FC = () => {
  const { theme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [showAccessibilityLabels, setShowAccessibilityLabels] = useState(false);

  // Get device locale information for demonstration
  const deviceLocale = Localization.locale;
  const isRTL = Localization.isRTL;

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'yo' : 'en');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" translationKey="common.appName" />
        <Text variant="subtitle1">Text Component Showcase</Text>
      </View>

      {/* Language Toggle Section */}
      <View style={[styles.section, styles.languageToggle]}>
        <Text variant="h3" translationKey="settings.language" />

        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              {
                backgroundColor:
                  language === 'en' ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => changeLanguage('en')}
            accessibilityRole="button"
            accessibilityLabel="Switch to English"
          >
            <Text
              variant="body1"
              color={language === 'en' ? 'white' : 'text'}
              translationKey="settings.english"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageButton,
              {
                backgroundColor:
                  language === 'yo' ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
            onPress={() => changeLanguage('yo')}
            accessibilityRole="button"
            accessibilityLabel="Switch to Yoruba"
          >
            <Text
              variant="body1"
              color={language === 'yo' ? 'white' : 'text'}
              translationKey="settings.yoruba"
            />
          </TouchableOpacity>
        </View>

        <Text variant="caption">
          <Text>Device locale: </Text>
          <Text>{deviceLocale}</Text>
          <Text> | Text direction: </Text>
          <Text>{isRTL ? 'RTL' : 'LTR'}</Text>
        </Text>
      </View>

      {/* Text Variants Section */}
      <View style={styles.section}>
        <Text variant="h2" translationKey="common.examples" />
        <Text variant="h1">Heading 1</Text>
        <Text variant="h2">Heading 2</Text>
        <Text variant="h3">Heading 3</Text>
        <Text variant="subtitle1">Subtitle 1</Text>
        <Text variant="subtitle2">Subtitle 2</Text>
        <Text variant="body1">Body 1 - Main text style</Text>
        <Text variant="body2">Body 2 - Secondary text style</Text>
        <Text variant="caption">Caption - Small text for labels</Text>
        <Text variant="button">Button Text</Text>
      </View>

      {/* Alignment Section */}
      <View style={styles.section}>
        <Text variant="h3">Text Alignment</Text>
        <Text align="left">Left aligned text (default)</Text>
        <Text align="center">Center aligned text</Text>
        <Text align="right">Right aligned text</Text>
        <Text align="justify">
          Justified text that spans multiple lines. This is a longer paragraph to demonstrate text
          justification, which aligns text to both the left and right margins.
        </Text>
      </View>

      {/* Colors Section */}
      <View style={styles.section}>
        <Text variant="h3">Text Colors</Text>
        <Text color={theme.colors.primary}>Primary color text</Text>
        <Text color={theme.colors.secondary}>Secondary color text</Text>
        <Text color={theme.colors.error}>Error color text</Text>
        <Text color="#3498db">Custom hex color (#3498db)</Text>
        <Text color="rgba(52, 152, 219, 0.7)">Custom rgba color</Text>
      </View>

      {/* Internationalization Section */}
      <View style={styles.section}>
        <Text variant="h3">Internationalization</Text>
        <Text>
          <Text>Current language: </Text>
          <Text>{language}</Text>
        </Text>

        <View style={styles.translatedItem}>
          <Text variant="body2" color={theme.colors.secondary}>
            App Name:
          </Text>
          <Text translationKey="common.appName" />
        </View>

        <View style={styles.translatedItem}>
          <Text variant="body2" color={theme.colors.secondary}>
            Auth:
          </Text>
          <Text translationKey="auth.login" />
          <Text> / </Text>
          <Text translationKey="auth.signup" />
        </View>

        <View style={styles.translatedItem}>
          <Text variant="body2" color={theme.colors.secondary}>
            Home:
          </Text>
          <Text translationKey="home.featuredOriki" />
        </View>

        <View style={styles.translatedItem}>
          <Text variant="body2" color={theme.colors.secondary}>
            Player:
          </Text>
          <Text translationKey="player.play" />
          <Text> / </Text>
          <Text translationKey="player.pause" />
        </View>

        <View style={styles.translatedItem}>
          <Text variant="body2" color={theme.colors.secondary}>
            Error:
          </Text>
          <Text translationKey="errors.networkError" />
        </View>
      </View>

      {/* Accessibility Section */}
      <View style={styles.section}>
        <Text variant="h3">Accessibility Features</Text>

        <View style={styles.row}>
          <Text>Show accessibility labels:</Text>
          <Switch
            value={showAccessibilityLabels}
            onValueChange={setShowAccessibilityLabels}
            accessibilityLabel="Toggle accessibility labels visibility"
          />
        </View>

        {showAccessibilityLabels && (
          <View style={styles.accessibilityLabels}>
            <Text variant="body2" color={theme.colors.secondary}>
              The following elements have accessibility enhancements:
            </Text>
          </View>
        )}

        <Text
          accessibilityLabel="This is a custom accessibility label for important information"
          style={styles.accessibilityItem}
        >
          Text with custom accessibility label
          {showAccessibilityLabels && (
            <Text variant="caption" color={theme.colors.secondary}>
              <Text>
                {' '}
                (accessibilityLabel: This is a custom accessibility label for important information)
              </Text>
            </Text>
          )}
        </Text>

        <Text
          accessibilityRole="header"
          accessibilityHeadingLevel={4}
          variant="subtitle1"
          style={[styles.accessibilityItem, { fontWeight: 'bold' }]}
        >
          Custom heading level (4)
          {showAccessibilityLabels && (
            <Text variant="caption" color={theme.colors.secondary}>
              <Text> (accessibilityRole: header, level: 4)</Text>
            </Text>
          )}
        </Text>

        {/* Hidden from view but accessible to screen readers */}
        <Text isAccessibilityOnly>This text is only visible to screen readers</Text>

        <Text style={styles.accessibilityItem}>
          There is hidden text above this line for screen readers
          {showAccessibilityLabels && (
            <Text variant="caption" color={theme.colors.secondary}>
              <Text> (Above: text only visible to screen readers)</Text>
            </Text>
          )}
        </Text>

        <Text accessibilityRole="button" style={styles.accessibilityItem}>
          This text has a button role for screen readers
          {showAccessibilityLabels && (
            <Text variant="caption" color={theme.colors.secondary}>
              <Text> (accessibilityRole: button)</Text>
            </Text>
          )}
        </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  languageToggle: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  translatedItem: {
    marginVertical: 4,
  },
  accessibilityLabels: {
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  accessibilityItem: {
    marginVertical: 8,
  },
});

export default TextExample;
