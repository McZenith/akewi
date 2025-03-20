---
description: Localization standards for the Akewi application
globs: ["**/i18n/**", "**/*.tsx"]
---

# Localization Standards

## Supported Languages

The Akewi app supports the following languages:

- English (UK) - `en-GB` (default)
- Yoruba - `yo`

## Directory Structure

```
/src
  /i18n
    /translations
      en-GB.json
      yo.json
    index.ts          # Main export
    i18n.ts           # i18n configuration
    LanguageContext.tsx  # Context provider
    hooks.ts          # Custom hooks
    utils.ts          # Helper functions
```

## Translation Files

### Naming and Structure

- Use consistent namespacing in translation files
- Organize translations hierarchically by feature
- Use dot notation for nested keys (e.g., "login.title")
- Keep formatting tokens consistent across translations

Example translation file structure:

```json
{
  "common": {
    "continue": "Continue",
    "or": "or",
    "back": "Back",
    "next": "Next",
    "skip": "Skip",
    "optional": "Optional"
  },
  "login": {
    "description": "Create easy and secure financial transactions through voice",
    "input": {
      "placeholder": "Enter your email or phone number",
      "error": {
        "required": "Please enter your email or phone number",
        "invalidEmail": "Please enter a valid email address",
        "invalidPhone": "Please enter a valid phone number"
      }
    }
  },
  "userDetails": {
    "title": "Enter your details",
    "description": "Add the following to personalize your experience"
  }
}
```

## Using Translations in Components

Use the `useTranslation` hook to access translations in components:

```tsx
import { useTranslation } from '../../hooks/useTranslation';

export const LoginScreen = () => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('login.description')}</Text>
      <Input placeholder={t('login.input.placeholder')} />
      <Button label={t('common.continue')} />
    </View>
  );
};
```

## Dynamic Values and Formatting

Use parameters for dynamic content:

```tsx
// Translation key: "greeting": "Hello, {{name}}"
t('greeting', { name: user.name });

// Pluralization
// Translation keys: 
// "messages_zero": "No messages"
// "messages_one": "{{count}} message"
// "messages_other": "{{count}} messages"
t('messages', { count: messageCount });
```

## Language Selection

Implement a language selector that:

1. Allows users to switch between available languages
2. Persists language preference
3. Shows language names in their native script

```tsx
import { useLanguage } from '../../hooks/useLanguage';

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage, languageOptions } = useLanguage();
  
  return (
    <View>
      {languageOptions.map(option => (
        <TouchableOpacity
          key={option.code}
          onPress={() => setLanguage(option.code)}
          style={[styles.option, currentLanguage === option.code && styles.selected]}
        >
          {option.flag}
          <Text>{option.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

## Text Considerations

- Allow for text expansion (some translations may be longer)
- Use flexible layouts that can accommodate varying text lengths
- Test UI with both languages to ensure proper display
- Consider font size adjustments for languages with more complex characters

## Persisting Language Preference

Use AsyncStorage to persist the user's language preference:

```typescript
// In the LanguageContext
const setLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    setCurrentLanguage(language);
    await AsyncStorage.setItem('user-language', language);
  } catch (error) {
    console.error('Failed to set language:', error);
  }
};
```

## Fallback Strategy

- Default to English (en-GB) when a translation is missing
- Log missing translations during development
- Handle loading errors gracefully

## Adding New Languages

When adding a new language:

1. Create a new translation file in `/src/i18n/translations/`
2. Add the language option to the language selector
3. Update the language detector to recognize the new language
4. Test all screens with the new language

## Best Practices

1. **Use keys, not hardcoded strings**: Never hardcode text in components
2. **Keep keys consistent**: Maintain a predictable structure across translation files
3. **Context for translators**: Add comments for translators when meaning might be ambiguous
4. **Format numbers and dates**: Use locale-aware formatters
5. **Test with real content**: Verify translations with native speakers
6. **Watch for concatenation**: Never concatenate translated strings, use parameters instead
7. **Handle pluralization**: Use plural forms appropriate for each language 