# Localization Implementation Plan

This document outlines our approach to implementing multilingual support in the Akewi app based on the observed UI in English and Yoruba.

## Technology Stack

- **Core Library**: i18next with react-i18next for React Native
- **Storage**: AsyncStorage for persisting language preference
- **Format Handling**: Intl API or i18next-icu for complex formatting

## Language Support

Initial languages to support:

- English (UK) - `en-GB`
- Yoruba - `yo`

## Directory Structure

```
/src
  /localization
    /translations
      en-GB.json
      yo.json
    index.ts          # Main export
    i18n.ts           # i18n configuration
    LanguageContext.tsx  # Context provider for language state
    hooks.ts          # Custom hooks (useTranslation, etc.)
    utils.ts          # Helper functions
```

## Translation Examples

Based on observed UI, here are key translations:

| Screen       | UI Element            | English (en-GB)                                               | Yoruba (yo)                                                              |
| ------------ | --------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Login        | Description text      | "Create easy and secure financial transactions through voice" | "Ṣàwárí, fẹ́tí sí, kí o sì pín Oríkì tí ń ṣe àyẹyẹ ìbílẹ̀, ìdílé, àti aṣa" |
| Login        | Input placeholder     | "Enter your email or phone number"                            | "Tẹ ìméèlì rẹ tàbí nọ́mbà tẹlifóònù rẹ"                                   |
| Login        | Continue button       | "Continue"                                                    | "Tẹ̀síwájú"                                                               |
| Login        | Divider text          | "or"                                                          | "tàbí"                                                                   |
| Login        | Social login - Google | "Continue with Google"                                        | "Tẹ̀síwájú pẹ̀lú Google"                                                   |
| Login        | Social login - Apple  | "Continue with Apple"                                         | "Tẹ̀síwájú pẹ̀lú Apple"                                                    |
| User Details | Title                 | "Enter your details"                                          | "Tẹ àwọn alaye rẹ sií"                                                   |
| User Details | Description           | "Add the following to personalize your experience"            | "Ṣàfikún àwọn atẹle látí ṣe àkànṣe ìrírí rẹ"                             |
| User Details | Name field            | "Name"                                                        | "Kí ní Orúko rẹ"                                                         |
| User Details | State field           | "State"                                                       | "Ìpínlẹ́ tí Òtí"                                                          |
| User Details | Town field            | "Town"                                                        | "Ilu àbínibí"                                                            |
| User Details | Family field          | "Family (Optional)"                                           | "Idile (Aṣayan)"                                                         |

## Translation JSON Example

```json
// en-GB.json
{
  "common": {
    "continue": "Continue",
    "or": "or",
    "back": "Back",
    "next": "Next",
    "skip": "Skip",
    "optional": "Optional"
  },
  "languages": {
    "en-GB": "English UK",
    "yo": "Yoruba"
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
    },
    "social": {
      "google": "Continue with Google",
      "apple": "Continue with Apple"
    }
  },
  "userDetails": {
    "title": "Enter your details",
    "description": "Add the following to personalize your experience",
    "name": {
      "placeholder": "Name",
      "error": "Please enter your name"
    },
    "state": {
      "placeholder": "State",
      "error": "Please select your state"
    },
    "town": {
      "placeholder": "Town",
      "error": "Please enter your town"
    },
    "family": {
      "placeholder": "Family (Optional)"
    }
  },
  "languageSelection": {
    "title": "Select language"
  }
}
```

```json
// yo.json
{
  "common": {
    "continue": "Tẹ̀síwájú",
    "or": "tàbí",
    "back": "Padà",
    "next": "Tókàn",
    "skip": "Fò",
    "optional": "Aṣayan"
  },
  "languages": {
    "en-GB": "English UK",
    "yo": "Yoruba"
  },
  "login": {
    "description": "Ṣàwárí, fẹ́tí sí, kí o sì pín Oríkì tí ń ṣe àyẹyẹ ìbílẹ̀, ìdílé, àti aṣa",
    "input": {
      "placeholder": "Tẹ ìméèlì rẹ tàbí nọ́mbà tẹlifóònù rẹ",
      "error": {
        "required": "Jọwọ́ tẹ ìméèlì tàbí nọ́mbà fóònù rẹ",
        "invalidEmail": "Jọwọ́ tẹ àdírẹ́ẹ̀sì ìméèlì tó tọ́",
        "invalidPhone": "Jọwọ́ tẹ nọ́mbà fóònù tó tọ́"
      }
    },
    "social": {
      "google": "Tẹ̀síwájú pẹ̀lú Google",
      "apple": "Tẹ̀síwájú pẹ̀lú Apple"
    }
  },
  "userDetails": {
    "title": "Tẹ àwọn alaye rẹ sií",
    "description": "Ṣàfikún àwọn atẹle látí ṣe àkànṣe ìrírí rẹ",
    "name": {
      "placeholder": "Kí ní Orúko rẹ",
      "error": "Jọwọ́ tẹ orúkọ rẹ"
    },
    "state": {
      "placeholder": "Ìpínlẹ́ tí Òtí",
      "error": "Jọwọ́ yan ìpínlẹ̀ rẹ"
    },
    "town": {
      "placeholder": "Ilu àbínibí",
      "error": "Jọwọ́ tẹ ìlú rẹ"
    },
    "family": {
      "placeholder": "Idile (Aṣayan)"
    }
  },
  "languageSelection": {
    "title": "Yan èdè"
  }
}
```

## Implementation Steps

1. **Install Required Packages**:

   ```bash
   npm install i18next react-i18next @react-native-async-storage/async-storage
   ```

2. **Create Translation Files**:

   - Create JSON files for each supported language
   - Structure with namespaces for organization

3. **Configure i18n**:

   ```typescript
   // i18n.ts
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import AsyncStorage from '@react-native-async-storage/async-storage';
   import * as RNLocalize from 'react-native-localize';

   import enGB from './translations/en-GB.json';
   import yo from './translations/yo.json';

   const LANGUAGE_DETECTOR = {
     type: 'languageDetector',
     async: true,
     detect: async callback => {
       try {
         // Try to get stored language
         const savedLanguage = await AsyncStorage.getItem('user-language');
         if (savedLanguage) {
           return callback(savedLanguage);
         }

         // If no stored language, try to get device language
         const deviceLanguage = RNLocalize.findBestAvailableLanguage(['en-GB', 'yo']);
         return callback(deviceLanguage?.languageTag || 'en-GB');
       } catch (error) {
         console.error('Error detecting language:', error);
         callback('en-GB');
       }
     },
     init: () => {},
     cacheUserLanguage: async language => {
       try {
         await AsyncStorage.setItem('user-language', language);
       } catch (error) {
         console.error('Error caching language:', error);
       }
     },
   };

   i18n
     .use(LANGUAGE_DETECTOR)
     .use(initReactI18next)
     .init({
       resources: {
         'en-GB': enGB,
         yo: yo,
       },
       fallbackLng: 'en-GB',
       debug: __DEV__,
       interpolation: {
         escapeValue: false,
       },
     });

   export default i18n;
   ```

4. **Create Context Provider**:

   ```typescript
   // LanguageContext.tsx
   import React, { createContext, useState, useEffect } from 'react';
   import { useTranslation } from 'react-i18next';
   import AsyncStorage from '@react-native-async-storage/async-storage';

   type LanguageContextType = {
     currentLanguage: string;
     setLanguage: (language: string) => void;
     languageOptions: { code: string; name: string; flag?: React.ReactNode }[];
   };

   export const LanguageContext = createContext<LanguageContextType>({
     currentLanguage: 'en-GB',
     setLanguage: () => {},
     languageOptions: []
   });

   export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
     const { i18n, t } = useTranslation();
     const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en-GB');

     const languageOptions = [
       {
         code: 'en-GB',
         name: t('languages.en-GB'),
         flag: () => <UKFlagIcon />
       },
       {
         code: 'yo',
         name: t('languages.yo'),
         flag: () => <YorubaFlagIcon />
       }
     ];

     const setLanguage = async (language: string) => {
       try {
         await i18n.changeLanguage(language);
         setCurrentLanguage(language);
         await AsyncStorage.setItem('user-language', language);
       } catch (error) {
         console.error('Failed to set language:', error);
       }
     };

     return (
       <LanguageContext.Provider value={{ currentLanguage, setLanguage, languageOptions }}>
         {children}
       </LanguageContext.Provider>
     );
   };
   ```

5. **Create Custom Hooks**:

   ```typescript
   // hooks.ts
   import { useContext } from 'react';
   import { useTranslation as useReactI18nextTranslation } from 'react-i18next';
   import { LanguageContext } from './LanguageContext';

   export const useLanguage = () => {
     return useContext(LanguageContext);
   };

   export const useTranslation = () => {
     return useReactI18nextTranslation();
   };
   ```

6. **Integrate into App**:

   ```tsx
   // App.tsx
   import React from 'react';
   import { LanguageProvider } from './src/localization/LanguageContext';
   import './src/localization/i18n';

   const App = () => {
     return <LanguageProvider>{/* Rest of your app */}</LanguageProvider>;
   };

   export default App;
   ```

7. **Usage in Components**:

   ```tsx
   // LoginScreen.tsx
   import React from 'react';
   import { View, Text } from 'react-native';
   import { useTranslation } from '../localization/hooks';

   const LoginScreen = () => {
     const { t } = useTranslation();

     return (
       <View>
         <Text>{t('login.description')}</Text>
         <Input placeholder={t('login.input.placeholder')} />
         <Button label={t('common.continue')} />
         <Divider text={t('common.or')} />
         <SocialButton provider="google" label={t('login.social.google')} />
         <SocialButton provider="apple" label={t('login.social.apple')} />
       </View>
     );
   };
   ```

8. **Example Implementation for User Details Form**:

   ```tsx
   // UserDetailsScreen.tsx
   import React from 'react';
   import { View, ScrollView } from 'react-native';
   import { useTranslation } from '../localization/hooks';

   const UserDetailsScreen = () => {
     const { t } = useTranslation();

     return (
       <View>
         <Header showBackButton rightComponent={<LanguageSelector />} />
         <ScrollView>
           <Text variant="h1">{t('userDetails.title')}</Text>
           <Text variant="body">{t('userDetails.description')}</Text>

           <Form>
             <Input
               placeholder={t('userDetails.name.placeholder')}
               // other props
             />
             <Select
               placeholder={t('userDetails.state.placeholder')}
               // other props
             />
             <Input
               placeholder={t('userDetails.town.placeholder')}
               // other props
             />
             <Input
               placeholder={t('userDetails.family.placeholder')}
               optional
               // other props
             />
           </Form>

           <Button
             label={t('common.continue')}
             // other props
           />
         </ScrollView>
       </View>
     );
   };
   ```

## Best Practices

1. **Use Namespaces**: Organize translations by feature (login, profile, etc.)
2. **Keep Keys Consistent**: Maintain a predictable structure in translation files
3. **Handle Missing Translations**: Provide fallbacks for missing translations
4. **Test with Long Text**: Ensure UI accommodates longer text in different languages
5. **Format Numbers and Dates**: Use appropriate formatters for numbers and dates based on locale
6. **Dynamic Content**: Use variables in translations for dynamic content
   ```tsx
   // Example: "Hello, {name}"
   t('greeting', { name: user.name });
   ```
7. **Pluralization**: Support plural forms
   ```tsx
   // Example: "You have {count} message(s)"
   t('messages', { count: messageCount });
   ```
8. **Right-to-left Support**: Consider RTL layout for future language additions

## Testing

1. Test UI with different languages to ensure layout adapts correctly
2. Verify all text elements are properly translated
3. Check formatting of dates, numbers, and currency in each language
4. Test language switching functionality
5. Verify persistence of language preference
