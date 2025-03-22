import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import FormInput from '../form/FormInput';
import Button from '../base/Button';
import Text from '../base/Text';
import LanguageToggle from '../language/LanguageToggle';
import { useTheme } from '../../providers/ThemeProvider';
import { required, email, minLength } from '../../utils/formValidation';
import { useLanguage } from '../../providers/LanguageProvider';
import { Ionicons } from '@expo/vector-icons';

/**
 * FormExample Component
 * Demonstrates form validation with proper error message translations
 */
const FormExample: React.FC = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  // This function validates a single field and returns any errors
  const validateField = (field: string, value: string) => {
    let fieldError = null;

    switch (field) {
      case 'name':
        fieldError = required('errors.required', true)(value);
        break;
      case 'email':
        fieldError = email('errors.invalidEmail', true)(value);
        break;
      case 'password':
        fieldError = minLength(6, 'errors.passwordShort', true)(value);
        break;
    }

    return fieldError;
  };

  // Revalidate all fields when language changes
  useEffect(() => {
    // Don't do anything if no errors exist yet
    if (Object.keys(errors).length === 0) return;

    // Re-validate all fields to generate new error objects with correct translation keys
    const newErrors: Record<string, any> = {};

    if (touched.name) {
      const nameError = validateField('name', values.name);
      if (nameError) newErrors.name = nameError;
    }

    if (touched.email) {
      const emailError = validateField('email', values.email);
      if (emailError) newErrors.email = emailError;
    }

    if (touched.password) {
      const passwordError = validateField('password', values.password);
      if (passwordError) newErrors.password = passwordError;
    }

    // Update errors state with new error objects
    setErrors(newErrors);
  }, [currentLanguage, i18n.language]); // Re-run when language changes

  const handleChange = (field: string, value: string) => {
    setValues({ ...values, [field]: value });

    // Validate the field
    const fieldError = validateField(field, value);

    // Update errors
    if (fieldError) {
      setErrors({ ...errors, [field]: fieldError });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    setTouched(allTouched);
    setSubmitted(true);

    // Validate all fields
    const formErrors: Record<string, any> = {};
    if (!values.name) formErrors.name = required('errors.required', true)(values.name);
    if (!values.email || !email('', false)(values.email)) {
      formErrors.email = email('errors.invalidEmail', true)(values.email);
    }
    if (!values.password || values.password.length < 6) {
      formErrors.password = minLength(6, 'errors.passwordShort', true)(values.password);
    }

    setErrors(formErrors);

    // Check if form is valid
    if (Object.keys(formErrors).length === 0) {
      // Handle successful form submission
      console.log('Form submitted:', values);
    }
  };

  // Helper to quickly test language switching with errors
  const showAllErrors = () => {
    const formErrors: Record<string, any> = {
      name: required('errors.required', true)(''),
      email: email('errors.invalidEmail', true)('invalid-email'),
      password: minLength(6, 'errors.passwordShort', true)('123'),
    };

    setTouched({
      name: true,
      email: true,
      password: true,
    });

    setErrors(formErrors);
  };

  // Toggle language for testing
  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'English' ? 'Yoruba' : 'English');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Form Example</Text>
        <LanguageToggle
          primaryLanguage="English"
          secondaryLanguage="Yoruba"
          onPress={toggleLanguage}
        />
      </View>

      <Text style={styles.description}>
        This form demonstrates validation with translated error messages. Try switching languages to
        see error messages update in real-time.
      </Text>

      {/* Test controls */}
      <View style={styles.testControls}>
        <TouchableOpacity style={styles.testButton} onPress={showAllErrors}>
          <Ionicons name="warning" size={16} color="#ffffff" />
          <Text style={styles.testButtonText}>Show All Errors</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <FormInput
          name="name"
          label={t('profile.name')}
          placeholder={t('Enter your name')}
          value={values.name}
          onChangeText={text => handleChange('name', text)}
          onBlur={() => handleBlur('name')}
          error={errors.name}
          touched={touched.name}
          required
        />

        <FormInput
          name="email"
          label={t('profile.email')}
          placeholder={t('Enter your email')}
          value={values.email}
          onChangeText={text => handleChange('email', text)}
          onBlur={() => handleBlur('email')}
          error={errors.email}
          touched={touched.email}
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />

        <FormInput
          name="password"
          label={t('auth.password')}
          placeholder={t('Enter your password')}
          value={values.password}
          onChangeText={text => handleChange('password', text)}
          onBlur={() => handleBlur('password')}
          error={errors.password}
          touched={touched.password}
          secureTextEntry
          required
        />

        <Button title={t('common.submit')} onPress={handleSubmit} style={styles.button} />

        {submitted && Object.keys(errors).length === 0 && (
          <Text style={styles.success}>Form submitted successfully!</Text>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  testControls: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  testButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButtonText: {
    color: '#ffffff',
    marginLeft: 8,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 16,
  },
  success: {
    color: 'green',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default FormExample;
