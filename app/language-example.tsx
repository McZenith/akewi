import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import LanguageSelectorExample from '../src/components/examples/LanguageSelectorExample';

export default function LanguageExampleScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: t('settings.language' as any),
          headerShown: true,
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LanguageSelectorExample />
      </ScrollView>
    </SafeAreaView>
  );
}
