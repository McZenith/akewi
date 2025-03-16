import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '../base/Button';
import Text from '../base/Text';
import { useTheme } from '../providers/ThemeProvider';

/**
 * ButtonExample Component
 * Showcases different variations and features of the Button component
 */
const ButtonExample: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [disableHaptics, setDisableHaptics] = useState(false);

  const handlePress = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Button action completed!');
    }, 1500);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" translationKey="common.appName" />
        <Text variant="subtitle1">Button Component Showcase</Text>
      </View>

      {/* Variants Section */}
      <View style={styles.section}>
        <Text variant="h3">Button Variants</Text>
        
        <Button
          title="Primary Button"
          variant="primary"
          onPress={() => Alert.alert('Primary Button', 'You pressed the primary button!')}
          style={styles.buttonExample}
        />
        
        <Button
          title="Secondary Button"
          variant="secondary"
          onPress={() => Alert.alert('Secondary Button', 'You pressed the secondary button!')}
          style={styles.buttonExample}
        />
        
        <Button
          title="Outline Button"
          variant="outline"
          onPress={() => Alert.alert('Outline Button', 'You pressed the outline button!')}
          style={styles.buttonExample}
        />
        
        <Button
          title="Text Button"
          variant="text"
          onPress={() => Alert.alert('Text Button', 'You pressed the text button!')}
          style={styles.buttonExample}
        />
      </View>

      {/* Sizes Section */}
      <View style={styles.section}>
        <Text variant="h3">Button Sizes</Text>
        
        <Button
          title="Small Button"
          size="small"
          onPress={() => {}}
          style={styles.buttonExample}
        />
        
        <Button
          title="Medium Button (Default)"
          size="medium"
          onPress={() => {}}
          style={styles.buttonExample}
        />
        
        <Button
          title="Large Button"
          size="large"
          onPress={() => {}}
          style={styles.buttonExample}
        />
      </View>

      {/* States Section */}
      <View style={styles.section}>
        <Text variant="h3">Button States</Text>
        
        <Button
          title="Disabled Button"
          disabled
          onPress={() => {}}
          style={styles.buttonExample}
        />
        
        <Button
          title="Loading Button"
          loading
          onPress={() => {}}
          style={styles.buttonExample}
        />
        
        <Button
          title={loading ? 'Loading...' : 'Click to Load'}
          loading={loading}
          onPress={handlePress}
          style={styles.buttonExample}
        />
      </View>

      {/* Icons Section */}
      <View style={styles.section}>
        <Text variant="h3">Buttons with Icons</Text>
        
        <Button
          title="Left Icon"
          leftIcon={<Feather name="arrow-left" size={18} color={theme.colors.onPrimary} />}
          onPress={() => {}}
          style={styles.buttonExample}
        />
        
        <Button
          title="Right Icon"
          rightIcon={<Feather name="arrow-right" size={18} color={theme.colors.onPrimary} />}
          onPress={() => {}}
          style={styles.buttonExample}
        />
        
        <Button
          title="Both Icons"
          leftIcon={<Feather name="check" size={18} color={theme.colors.onPrimary} />}
          rightIcon={<Feather name="arrow-right" size={18} color={theme.colors.onPrimary} />}
          onPress={() => {}}
          style={styles.buttonExample}
        />
      </View>

      {/* Full Width Section */}
      <View style={styles.section}>
        <Text variant="h3">Full Width Button</Text>
        
        <Button
          title="Full Width Button"
          fullWidth
          onPress={() => {}}
          style={styles.buttonExample}
        />
      </View>

      {/* Localization Section */}
      <View style={styles.section}>
        <Text variant="h3">Localized Buttons</Text>
        
        <Button
          translationKey="common.save"
          variant="primary"
          onPress={() => {}}
          style={styles.buttonExample}
        />
        
        <Button
          translationKey="common.cancel"
          variant="outline"
          onPress={() => {}}
          style={styles.buttonExample}
        />
      </View>

      {/* Haptic Feedback Section */}
      <View style={styles.section}>
        <Text variant="h3">Haptic Feedback</Text>
        
        <View style={styles.switchRow}>
          <Text>Disable Haptic Feedback:</Text>
          <Switch
            value={disableHaptics}
            onValueChange={setDisableHaptics}
          />
        </View>
        
        <Button
          title="Primary with Haptics"
          variant="primary"
          disableHaptics={disableHaptics}
          onPress={() => Alert.alert('Haptics', disableHaptics ? 'Haptics disabled' : 'Felt that?')}
          style={styles.buttonExample}
        />
        
        <Button
          title="Text with Haptics"
          variant="text"
          disableHaptics={disableHaptics}
          onPress={() => Alert.alert('Haptics', disableHaptics ? 'Haptics disabled' : 'Lighter haptic')}
          style={styles.buttonExample}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 16,
  },
  buttonExample: {
    marginVertical: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
});

export default ButtonExample; 