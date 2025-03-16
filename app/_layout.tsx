import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import StoreProvider from '../src/components/providers/StoreProvider';
import ThemeProvider from '../src/components/providers/ThemeProvider';
import { LanguageProvider } from '../src/components/providers/LanguageProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <ThemeProvider>
          <LanguageProvider>
            <StatusBar style="auto" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
