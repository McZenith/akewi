import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './app/auth/login';
import { I18nextProvider } from 'react-i18next';
import i18next from './src/i18n';

export default function App() {
  return (
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <LoginScreen />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </I18nextProvider>
  );
}
