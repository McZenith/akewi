import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as LanguageService from '../../services/LanguageService';

export interface LanguageContextType {
  currentLanguage: string;
  languages: Language[];
  isLoading: boolean;
  isRTL: boolean;
  changeLanguage: (languageCode: string) => Promise<boolean>;
  getLanguageDetails: (languageCode: string) => Language;
}

type Language = {
  code: string;
  name: string;
  nativeName: string;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * LanguageProvider Component
 * Provides language state and change functions to the component tree
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language || 'en');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRTL, setIsRTL] = useState<boolean>(false);

  // Get all supported languages
  const languages = LanguageService.getSupportedLanguages();

  // Initialize language on app start
  useEffect(() => {
    const initLanguage = async () => {
      setIsLoading(true);

      try {
        // Initialize language from storage or device
        const language = await LanguageService.initializeLanguage(i18n);
        setCurrentLanguage(language);

        // Check if language is RTL
        const langDetails = LanguageService.getLanguageDetails(language);
        setIsRTL(langDetails.rtl || false);
      } catch (error) {
        console.error('Failed to initialize language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initLanguage();
  }, [i18n]);

  // Update language state when i18n language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLanguage = i18n.language || 'en';
      setCurrentLanguage(newLanguage);

      // Update RTL state
      const langDetails = LanguageService.getLanguageDetails(newLanguage);
      setIsRTL(langDetails.rtl || false);
    };

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);

    // Clean up listener on unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Function to change language
  const changeLanguage = async (languageCode: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Change language and persist the change
      const success = await LanguageService.changeLanguage(i18n, languageCode);

      if (success) {
        setCurrentLanguage(languageCode);

        // Update RTL state
        const langDetails = LanguageService.getLanguageDetails(languageCode);
        setIsRTL(langDetails.rtl || false);
      }

      return success;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get language details
  const getLanguageDetails = (languageCode: string): Language => ({
    ...LanguageService.getLanguageDetails(languageCode),
    nativeName: LanguageService.getLanguageDetails(languageCode).localName,
  });

  // Create the context value
  const contextValue: LanguageContextType = {
    currentLanguage,
    languages: languages.map(lang => ({
      ...lang,
      nativeName: lang.localName,
    })),
    isLoading,
    isRTL,
    changeLanguage,
    getLanguageDetails,
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

/**
 * useLanguage Hook
 * Provides access to language context
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

export default LanguageProvider;
