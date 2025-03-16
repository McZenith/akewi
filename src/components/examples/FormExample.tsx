import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FormInput from '../form/FormInput';
import SelectInput from '../form/SelectInput';
import SaveButton from '../form/SaveButton';
import Text from '../base/Text';
import { useTheme } from '../providers/ThemeProvider';
import * as validators from '../../utils/formValidation';

/**
 * FormExample Component
 * Showcases the form components and validation
 */
const FormExample: React.FC = () => {
  const { theme } = useTheme();

  // Form state
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    bio: '',
  });

  // Touched state to track which fields have been interacted with
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    country: false,
    bio: false,
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Loading state for save button
  const [saving, setSaving] = useState(false);

  // Country options for select input
  const countries = [
    { label: 'Nigeria', value: 'nigeria', translationKey: 'countries.nigeria' },
    { label: 'Ghana', value: 'ghana', translationKey: 'countries.ghana' },
    { label: 'Kenya', value: 'kenya', translationKey: 'countries.kenya' },
    { label: 'South Africa', value: 'southAfrica', translationKey: 'countries.southAfrica' },
    { label: 'Egypt', value: 'egypt', translationKey: 'countries.egypt' },
    { label: 'Ethiopia', value: 'ethiopia', translationKey: 'countries.ethiopia' },
    { label: 'Tanzania', value: 'tanzania', translationKey: 'countries.tanzania' },
    { label: 'Uganda', value: 'uganda', translationKey: 'countries.uganda' },
    { label: 'Algeria', value: 'algeria', translationKey: 'countries.algeria' },
    { label: 'Morocco', value: 'morocco', translationKey: 'countries.morocco' },
  ];

  // Handle field change
  const handleChange = (field: string) => (value: any) => {
    // Update form state
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));

    // Validate field
    validateField(field, value);
  };

  // Mark field as touched on blur
  const handleBlur = (field: string) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));

    // Validate field
    validateField(field, formState[field as keyof typeof formState]);
  };

  // Validate a specific field
  const validateField = (field: string, value: any) => {
    let error = null;

    switch (field) {
      case 'firstName':
        error = validators.compose(
          validators.required('First name is required'),
          validators.minLength(2, 'First name must be at least 2 characters')
        )(value);
        break;

      case 'lastName':
        error = validators.compose(
          validators.required('Last name is required'),
          validators.minLength(2, 'Last name must be at least 2 characters')
        )(value);
        break;

      case 'email':
        error = validators.compose(
          validators.required('Email is required'),
          validators.email()
        )(value);
        break;

      case 'phone':
        error = validators.phoneNumber()(value);
        break;

      case 'country':
        error = validators.required('Country is required')(value);
        break;

      case 'bio':
        error = validators.maxLength(200, 'Bio cannot exceed 200 characters')(value);
        break;

      default:
        break;
    }

    // Update errors state
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));

    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    // Validate each field
    Object.keys(formState).forEach(field => {
      const error = validateField(field, formState[field as keyof typeof formState]);
      newErrors[field] = error;

      if (error) {
        isValid = false;
      }
    });

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      country: true,
      bio: true,
    });

    // Update errors state
    setErrors(newErrors);

    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate all fields
    const isValid = validateForm();

    if (isValid) {
      // Show saving indicator
      setSaving(true);

      // Simulate API call
      setTimeout(() => {
        setSaving(false);
        Alert.alert('Form Submitted', 'Your form was successfully submitted!', [{ text: 'OK' }]);
      }, 1500);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="h1">Form Components</Text>
          <Text variant="subtitle1">Form Components Showcase</Text>
        </View>

        <View style={styles.form}>
          {/* Basic Form Inputs */}
          <Text variant="h3" style={styles.sectionTitle}>
            User Information
          </Text>

          <FormInput
            name="firstName"
            label="First Name"
            value={formState.firstName}
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            error={errors.firstName}
            touched={touched.firstName}
            required
            placeholder="Enter your first name"
          />

          <FormInput
            name="lastName"
            label="Last Name"
            value={formState.lastName}
            onChangeText={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            error={errors.lastName}
            touched={touched.lastName}
            required
            placeholder="Enter your last name"
          />

          <FormInput
            name="email"
            label="Email"
            value={formState.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            error={errors.email}
            touched={touched.email}
            required
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormInput
            name="phone"
            label="Phone Number"
            value={formState.phone}
            onChangeText={handleChange('phone')}
            onBlur={handleBlur('phone')}
            error={errors.phone}
            touched={touched.phone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            startAdornment={<Feather name="phone" size={20} color={theme.colors.textSecondary} />}
          />

          {/* Select Input */}
          <SelectInput
            label="Country"
            value={formState.country}
            options={countries}
            onChange={handleChange('country')}
            error={touched.country ? errors.country : null}
            required
            searchable
            searchPlaceholder="Search countries..."
          />

          <FormInput
            name="bio"
            label="Bio"
            value={formState.bio}
            onChangeText={handleChange('bio')}
            onBlur={handleBlur('bio')}
            error={errors.bio}
            touched={touched.bio}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ height: 100 }}
            helperText={`${formState.bio.length}/200 characters`}
          />

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <SaveButton title="Submit Form" saving={saving} onPress={handleSubmit} fullWidth />
          </View>
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
  form: {
    marginBottom: 40,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
});

export default FormExample;
