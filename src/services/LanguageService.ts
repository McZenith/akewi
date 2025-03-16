import { i18n } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// Constants
const LANGUAGE_STORAGE_KEY = '@akewi:language';
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'yo'];

/**
 * Get device language
 * @returns The device language code or default language if not supported
 */
export const getDeviceLanguage = (): string => {
  // Get device locale using expo-localization
  const deviceLocale = Localization.locale.split('-')[0];

  // Return device language if supported, otherwise default
  return SUPPORTED_LANGUAGES.includes(deviceLocale) ? deviceLocale : DEFAULT_LANGUAGE;
};

/**
 * Initialize language based on stored preference or device language
 * @param i18nInstance i18next instance
 */
export const initializeLanguage = async (i18nInstance: i18n): Promise<string> => {
  try {
    // Try to get stored language preference
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

    // If valid language stored, use it
    if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
      await i18nInstance.changeLanguage(storedLanguage);
      return storedLanguage;
    }

    // Otherwise use device language
    const deviceLanguage = getDeviceLanguage();
    await i18nInstance.changeLanguage(deviceLanguage);

    // Store the selected language
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, deviceLanguage);
    return deviceLanguage;
  } catch (error) {
    console.error('Failed to initialize language:', error);

    // Fallback to default language
    await i18nInstance.changeLanguage(DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Change language and persist the choice
 * @param i18nInstance i18next instance
 * @param languageCode Language code to switch to
 */
export const changeLanguage = async (
  i18nInstance: i18n,
  languageCode: string
): Promise<boolean> => {
  try {
    // Validate language code
    if (!SUPPORTED_LANGUAGES.includes(languageCode)) {
      console.error(`Language ${languageCode} is not supported`);
      return false;
    }

    // Change language
    await i18nInstance.changeLanguage(languageCode);

    // Persist language preference
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);

    return true;
  } catch (error) {
    console.error('Failed to change language:', error);
    return false;
  }
};

/**
 * Get the list of supported languages with details
 */
export const getSupportedLanguages = () => [
  {
    code: 'en',
    name: 'English',
    localName: 'English',
    flag: '🇬🇧',
    rtl: false,
  },
  {
    code: 'yo',
    name: 'Yoruba',
    localName: 'Yorùbá',
    flag: '🇳🇬',
    rtl: false,
  },
];

/**
 * Get details of a specific language
 * @param languageCode Language code
 */
export const getLanguageDetails = (languageCode: string) => {
  const languages = getSupportedLanguages();
  return languages.find(lang => lang.code === languageCode) || languages[0];
};

/**
 * Get the stored language preference
 * @returns Promise with the stored language code or null if not set
 */
export const getStoredLanguage = async (): Promise<string | null> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return storedLanguage;
  } catch (error) {
    console.error('Failed to get stored language:', error);
    return null;
  }
};

/**
 * Store the language preference
 * @param languageCode The language code to store
 * @returns Promise that resolves when storage is complete
 */
export const storeLanguage = async (languageCode: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.error('Failed to store language preference:', error);
  }
};

/**
 * Detect the best language for the user
 * Checks in order:
 * 1. Previously stored preference
 * 2. Device locale
 * 3. Defaults to 'en'
 * @param supportedLanguages Array of supported language codes
 * @returns Promise with the best language code
 */
export const detectBestLanguage = async (
  supportedLanguages: string[] = ['en', 'yo']
): Promise<string> => {
  try {
    // 1. Check stored preference
    const storedLanguage = await getStoredLanguage();
    if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
      return storedLanguage;
    }

    // 2. Check device locale
    const deviceLocale = Localization.locale.split('-')[0];
    if (supportedLanguages.includes(deviceLocale)) {
      return deviceLocale;
    }

    // 3. Default to first supported language (usually English)
    return supportedLanguages[0] || 'en';
  } catch (error) {
    console.error('Failed to detect best language:', error);
    return 'en';
  }
};

export function LanguageService(languageCode: string): {
  code: string;
  name: string;
  nativeName: string;
} {
  throw new Error('Function not implemented.');
}
