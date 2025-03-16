import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { getDeviceLanguage } from '../services/LanguageService';

// Import translations
import en from './translations/en.json';
import yo from './translations/yo.json';

// Configure i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init<any>({
    resources: {
      en: {
        translation: en,
      },
      yo: {
        translation: yo,
      },
    },
    lng: getDeviceLanguage(), // Initial language - will be updated by LanguageService
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    compatibilityJSON: 'v4', // To be compatible with Android
  });

export default i18n;
// Compare this snippet from src/services/LanguageService.ts: