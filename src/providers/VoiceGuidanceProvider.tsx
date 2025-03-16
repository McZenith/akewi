import React, { createContext, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';

interface VoiceGuidanceContextType {
  isActive: boolean;
  currentElementId: string | null;
  isWaitingForInput: boolean;
  startVoiceGuidance: () => void;
  stopVoiceGuidance: () => void;
  moveToNextElement: () => void;
  readText: (text: string) => Promise<void>;
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

        await Speech.speak(text, {
          language: languageCode,
          rate: 0.85, // Slightly slower for better clarity
          pitch: 1.1, // Slightly higher pitch for feminine voice
          voice: voice?.identifier,
          onStart: () => {
            console.log('Started speaking:', text);
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

  const startVoiceGuidance = useCallback(() => {
    setIsActive(true);
    setCurrentIndex(0);
    // Reset elements array with current screen elements
    // This would be populated by the screen component
    setElements([]);
  }, []);

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
  };

  return <VoiceGuidanceContext.Provider value={value}>{children}</VoiceGuidanceContext.Provider>;
};
