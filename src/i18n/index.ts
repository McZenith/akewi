import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// English translations
const English = {
  translation: {
    common: {
      continue: 'Continue',
      or: 'or',
      voice: {
        activate: 'Activate voice input',
      },
    },
    auth: {
      description: 'Browse, listen, and share Oriki that celebrate heritage, lineage, and culture',
      input: {
        placeholder: {
          default: 'Enter your email or phone number',
          email: 'Enter your email address',
          phone: 'Enter your phone number (e.g., +234 XXX XXX XXXX)',
        },
      },
      social: {
        google: 'Continue with Google',
        apple: 'Continue with Apple',
      },
    },
    language: {
      select: 'Select language',
      english: 'English',
      yoruba: 'Yorùbá',
      change: 'Change language. Current language is {{current}}',
    },
  },
};

// Yoruba translations
const Yoruba = {
  translation: {
    common: {
      continue: 'Tẹsiwaju',
      or: 'tabi',
      voice: {
        activate: 'Mu ohùn síṣẹ́',
      },
    },
    auth: {
      description: 'Ṣawari, fetisi, ki o si pin Oriki ti o ṣe ayẹyẹ itan, ẹbi, ati aṣa',
      input: {
        placeholder: {
          default: 'Tẹ imeli rẹ tabi nọmba foonu sii',
          email: 'Tẹ adirẹsi imeli rẹ sii',
          phone: 'Tẹ nọmba foonu rẹ sii (fun apẹẹrẹ, +234 XXX XXX XXXX)',
        },
      },
      social: {
        google: 'Tẹsiwaju pẹlu Google',
        apple: 'Tẹsiwaju pẹlu Apple',
      },
    },
    language: {
      select: 'Yan ede',
      english: 'English',
      yoruba: 'Yorùbá',
      change: 'Yi ede pada. Ede lọwọlọwọ jẹ {{current}}',
    },
  },
};

const resources = {
  English: English,
  Yoruba: Yoruba,
};
// Get the device's locale
const deviceLocale = Localization.locale;
const supportedLocales = ['English', 'Yoruba'];
const defaultLocale = 'English';

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
