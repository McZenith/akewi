import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import enTranslations from './translations/english.json';
import yoTranslations from './translations/yoruba.json';
import enLocales from './locales/en.json';
import yoLocales from './locales/yo.json';

// Helper function to deeply merge two objects
const deepMerge = (target: any, source: any) => {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === 'object' && source[key] !== null && target[key]) {
        // If both target and source have an object at this key, merge them
        result[key] = deepMerge(target[key], source[key]);
      } else {
        // Otherwise take the source value
        result[key] = source[key];
      }
    }
  }

  return result;
};

// Helper function to merge translations and locales
const mergeResources = (translations: any, locales: any) => ({
  translation: deepMerge(translations, locales),
});

// Merge translations with locales for each language
const resources = {
  en: mergeResources(enTranslations, enLocales),
  yo: mergeResources(yoTranslations, yoLocales),
};

// Get the device's locale
const deviceLocale = Localization.locale.split('-')[0]; // Get just the language code (e.g., 'en' from 'en-US')
const supportedLocales = ['en', 'yo'];
const defaultLocale = 'en';

// Check if the device locale is supported, otherwise use default
const initialLocale = supportedLocales.includes(deviceLocale) ? deviceLocale : defaultLocale;

i18next.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: defaultLocale,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18next;
