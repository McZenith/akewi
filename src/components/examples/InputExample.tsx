import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Input from '../base/Input';
import Text from '../base/Text';
import Button from '../base/Button';
import { useTheme } from '../providers/ThemeProvider';

/**
 * InputExample Component
 * Showcases different variations and features of the Input component
 */
const InputExample: React.FC = () => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = email === '' || emailRegex.test(email);

  // Simple password validation
  const isPasswordValid = password === '' || password.length >= 6;

  // Handle form submission
  const handleSubmit = () => {
    setSubmitted(true);

    if (name && email && emailRegex.test(email) && password && password.length >= 6) {
      // Here you would typically handle the form submission
      alert(
        `Form submitted!\n\nName: ${name}\nEmail: ${email}\nPassword: ${password.replace(/./g, '*')}`
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="h1">Input Component</Text>
          <Text variant="subtitle1">Form Input Showcase</Text>
        </View>

        {/* Basic Usage */}
        <View style={styles.section}>
          <Text variant="h3">Basic Usage</Text>

          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            fullWidth
            clearable
            error={submitted && !name ? 'Name is required' : undefined}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            fullWidth
            clearable
            error={
              submitted && !email
                ? 'Email is required'
                : !isEmailValid
                  ? 'Please enter a valid email'
                  : undefined
            }
          />
        </View>

        {/* With Adornments */}
        <View style={styles.section}>
          <Text variant="h3">With Adornments</Text>

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            fullWidth
            error={
              submitted && !password
                ? 'Password is required'
                : !isPasswordValid
                  ? 'Password must be at least 6 characters'
                  : undefined
            }
            endAdornment={
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={theme.colors.textSecondary}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Input
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            fullWidth
            startAdornment={<Feather name="phone" size={20} color={theme.colors.textSecondary} />}
          />
        </View>

        {/* Helper Text */}
        <View style={styles.section}>
          <Text variant="h3">With Helper Text</Text>

          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            fullWidth
            helperText="Optional: Share something interesting about yourself"
            textAlignVertical="top"
            style={{ height: 100 }}
          />
        </View>

        {/* Custom Colors */}
        <View style={styles.section}>
          <Text variant="h3">Custom Colors</Text>

          <Input
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            fullWidth
            focusColor={theme.colors.secondary}
            inputContainerStyle={{
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Localization */}
        <View style={styles.section}>
          <Text variant="h3">Localization Support</Text>

          <Input
            labelTranslationKey="profile.name"
            value={name}
            onChangeText={setName}
            fullWidth
            errorTranslationKey={submitted && !name ? 'errors.requiredField' : undefined}
          />
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text variant="h3">Accessibility Features</Text>

          <Input
            label="Accessible Input"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            fullWidth
            accessibilityLabel="Email address input field"
            accessibilityHint="Enter your email address to create an account"
          />
        </View>

        {/* Form Submission */}
        <View style={styles.submitSection}>
          <Button
            title="Submit Form"
            onPress={handleSubmit}
            fullWidth
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
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
  submitSection: {
    marginVertical: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default InputExample;
