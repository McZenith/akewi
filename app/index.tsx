import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import LanguageSelectorExample from '../src/components/examples/LanguageSelectorExample';
import { useTheme } from '../src/components/providers/ThemeProvider';

/**
 * Home screen that showcases the Language Selector components
 */
const HomeScreen = () => {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LanguageSelectorExample />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
