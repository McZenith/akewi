import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

interface VoiceGuidanceContextType {
  isActive: boolean;
  currentElementId: string | null;
  isWaitingForInput: boolean;
  startVoiceGuidance: () => void;
  stopVoiceGuidance: () => void;
  moveToNextElement: () => void;
  readText: (text: string) => Promise<void>;
  registerElement: (id: string, text: string, type?: 'text' | 'input') => void;
}

const VoiceGuidanceContext = createContext<VoiceGuidanceContextType | undefined>(undefined);

export const useVoiceGuidance = () => {
  const context = useContext(VoiceGuidanceContext);
  if (!context) {
    throw new Error('useVoiceGuidance must be used within a VoiceGuidanceProvider');
  }
  return context;
};

interface VoiceGuidanceProviderProps {
  children: React.ReactNode;
}

export const VoiceGuidanceProvider: React.FC<VoiceGuidanceProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [currentElementId, setCurrentElementId] = useState<string | null>(null);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [elements, setElements] = useState<
    Array<{ id: string; text: string; type: 'text' | 'input' }>
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeechInitialized, setIsSpeechInitialized] = useState(false);

  // Initialize speech engine on component mount
  useEffect(() => {
    const initSpeech = async () => {
      try {
        // Pre-warm the speech engine
        await Speech.getAvailableVoicesAsync();
        setIsSpeechInitialized(true);
      } catch (error) {
        console.error('Error initializing speech:', error);
      }
    };

    initSpeech();

    return () => {
      // Clean up speech when component unmounts
      Speech.stop();
    };
  }, []);

  const readText = useCallback(
    async (text: string) => {
      try {
        // Check if already speaking
        const isSpeaking = await Speech.isSpeakingAsync();
        if (isSpeaking) {
          await Speech.stop();
        }

        // Get available voices for the language
        const voices = await Speech.getAvailableVoicesAsync();
        const languageCode = i18n.language === 'Yoruba' ? 'yo-NG' : 'en-GB';

        // Find a suitable feminine voice for the language
        let voice = voices.find(
          v => v.language.startsWith(languageCode) && v.name.toLowerCase().includes('female')
        );

        // Fallback to any voice for the language if no feminine voice found
        if (!voice) {
          voice = voices.find(v => v.language.startsWith(languageCode));
        }

        // Platform-specific optimizations
        const rate = Platform.OS === 'android' ? 0.9 : 0.85; // Slightly faster on Android
        const pitch = Platform.OS === 'android' ? 1.0 : 1.1; // Normal pitch on Android

        // Pre-process text for better speech synthesis
        const processedText = text.replace(/\s+/g, ' ').trim();

        await Speech.speak(processedText, {
          language: languageCode,
          rate,
          pitch,
          voice: voice?.identifier,
          // Android-specific options
          ...Platform.select({
            android: {
              // Lower quality but faster startup on Android
              quality: 0.5, // Use a numeric value instead of enum
            },
            default: {},
          }),
          onStart: () => {
            console.log('Started speaking:', processedText);
          },
          onDone: () => {
            console.log('Done speaking');
            if (isActive && currentElementId) {
              moveToNextElement();
            }
          },
          onStopped: () => {
            console.log('Stopped speaking');
          },
          onError: error => {
            console.error('Speech error:', error);
            // If speech fails, still try to move to next element
            if (isActive && currentElementId) {
              moveToNextElement();
            }
          },
        });
      } catch (error) {
        console.error('Error in readText:', error);
        // If speech fails, still try to move to next element
        if (isActive && currentElementId) {
          moveToNextElement();
        }
      }
    },
    [i18n.language, isActive, currentElementId]
  );

  const registerElement = useCallback(
    (id: string, text: string, type: 'text' | 'input' = 'text') => {
      setElements(prev => {
        // Check if element already exists
        const exists = prev.some(el => el.id === id);
        if (exists) return prev;

        // Add new element
        return [...prev, { id, text, type }];
      });
    },
    []
  );

  const startVoiceGuidance = useCallback(() => {
    setIsActive(true);
    setCurrentIndex(0);

    // If there are elements, set the first one as current
    if (elements.length > 0) {
      setCurrentElementId(elements[0].id);
      setIsWaitingForInput(elements[0].type === 'input');
    }
  }, [elements]);

  // When elements change and voice guidance is active, update current element if needed
  useEffect(() => {
    if (isActive && elements.length > 0 && !currentElementId) {
      setCurrentElementId(elements[0].id);
      setIsWaitingForInput(elements[0].type === 'input');
    }
  }, [isActive, elements, currentElementId]);

  const stopVoiceGuidance = useCallback(async () => {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
    setIsActive(false);
    setCurrentElementId(null);
    setIsWaitingForInput(false);
    setCurrentIndex(0);
  }, []);

  const moveToNextElement = useCallback(() => {
    if (currentIndex < elements.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentElementId(elements[currentIndex + 1].id);
      setIsWaitingForInput(elements[currentIndex + 1].type === 'input');
    } else {
      stopVoiceGuidance();
    }
  }, [currentIndex, elements, stopVoiceGuidance]);

  const value = {
    isActive,
    currentElementId,
    isWaitingForInput,
    startVoiceGuidance,
    stopVoiceGuidance,
    moveToNextElement,
    readText,
    registerElement,
  };

  return <VoiceGuidanceContext.Provider value={value}>{children}</VoiceGuidanceContext.Provider>;
};
