import { useTranslation as useI18nTranslation } from 'react-i18next';
import en from '../i18n/translations/english.json';

// Type for the nested keys in translations
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = (
  T extends object
    ? { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<
        keyof T,
        symbol
      >]
    : ''
) extends infer D
  ? Extract<D, string>
  : never;

// Get all possible translation keys from the English translation file
export type TranslationKey = DotNestedKeys<typeof en> | string;

/**
 * Custom hook that wraps the react-i18next useTranslation hook.
 * Provides type safety for translation keys and handles errors gracefully.
 */
const useAppTranslation = () => {
  const { t: translate, i18n } = useI18nTranslation();

  /**
   * Typed translation function
   * @param key - The translation key (with TypeScript validation)
   * @param defaultValue - Default value if translation is missing
   * @param options - Optional parameters for the translation
   * @returns The translated string
   */
  const t = (
    key: TranslationKey,
    defaultValue?: string | Record<string, any>,
    options?: Record<string, any>
  ): string => {
    try {
      // Handle the case where defaultValue is actually options
      if (defaultValue && typeof defaultValue !== 'string' && !options) {
        return translate(key, defaultValue) || (typeof key === 'string' ? key : String(key));
      }

      // Normal case with defaultValue as string
      if (typeof defaultValue === 'string') {
        return translate(key, { defaultValue, ...options }) || defaultValue;
      }

      // No defaultValue, just key and maybe options
      return translate(key, options) || (typeof key === 'string' ? key : String(key));
    } catch (error) {
      console.error(`Translation error for key '${key}':`, error);
      // Return default value or key as fallback
      return typeof defaultValue === 'string'
        ? defaultValue
        : typeof key === 'string'
          ? key.split('.').pop() || key
          : String(key);
    }
  };

  /**
   * Change the application language
   * @param language - Language code ('en' or 'yo')
   */
  const changeLanguage = async (language: 'en' | 'yo') => {
    try {
      await i18n.changeLanguage(language);
    } catch (error) {
      console.error(`Failed to change language to ${language}:`, error);
    }
  };

  /**
   * Get the current language
   * @returns Current language code
   */
  const getCurrentLanguage = (): string => i18n.language || 'en';

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
  };
};

export default useAppTranslation;
