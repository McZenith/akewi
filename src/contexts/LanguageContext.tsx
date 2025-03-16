import React, { createContext, useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import i18n from '../i18n';
import { getStoredLanguage, storeLanguage } from '../services/LanguageService';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
};

type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (languageCode: string) => void;
  toggleLanguage: () => void;
  supportedLanguages: Language[];
  isRTL: boolean;
};

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
];

export const LanguageContext = createContext<LanguageContextType | null>(null);

type LanguageProviderProps = {
  children: React.ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isRTL, setIsRTL] = useState<boolean>(false);

  // Initialize language from storage
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const storedLanguage = await getStoredLanguage();
        if (storedLanguage) {
          await handleLanguageChange(storedLanguage);
        }
      } catch (error) {
        console.error('Failed to initialize language:', error);
      }
    };

    initializeLanguage();
  }, []);

  const handleLanguageChange = async (languageCode: string) => {
    try {
      // Find the language config
      const language = supportedLanguages.find(lang => lang.code === languageCode);

      if (!language) {
        console.warn(`Language ${languageCode} is not supported`);
        return;
      }

      // Set RTL if needed
      const isRtl = !!language.rtl;
      if (I18nManager.isRTL !== isRtl) {
        I18nManager.forceRTL(isRtl);
        setIsRTL(isRtl);
      }

      // Change i18n language
      await i18n.changeLanguage(languageCode);

      // Update state
      setCurrentLanguage(languageCode);

      // Store preference
      await storeLanguage(languageCode);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const toggleLanguage = () => {
    const currentIndex = supportedLanguages.findIndex(lang => lang.code === currentLanguage);
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    handleLanguageChange(supportedLanguages[nextIndex].code);
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    changeLanguage: handleLanguageChange,
    toggleLanguage,
    supportedLanguages,
    isRTL,
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};
