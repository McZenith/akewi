/**
 * Form Validation Utilities
 * A collection of validation functions for form fields
 */

export type ValidationResult = { message?: string; key?: string } | null | undefined;

/**
 * Required field validation
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Validation function
 */
export const required =
  (messageOrKey = 'This field is required', isTranslationKey = false) =>
  (value: any): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
    }

    if (typeof value === 'string' && value.trim() === '') {
      return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
    }

    return null;
  };

/**
 * Minimum length validation
 * @param minLength - Minimum length required
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Validation function
 */
export const minLength =
  (minLength: number, messageOrKey?: string, isTranslationKey = false) =>
  (value: string): ValidationResult => {
    if (!value || value.length < minLength) {
      const defaultMessage = `Must be at least ${minLength} characters`;
      if (messageOrKey) {
        return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
      }
      return { message: defaultMessage };
    }
    return null;
  };

/**
 * Maximum length validation
 * @param maxLength - Maximum length allowed
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Validation function
 */
export const maxLength =
  (maxLength: number, messageOrKey?: string, isTranslationKey = false) =>
  (value: string): ValidationResult => {
    if (value && value.length > maxLength) {
      const defaultMessage = `Must be no more than ${maxLength} characters`;
      if (messageOrKey) {
        return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
      }
      return { message: defaultMessage };
    }
    return null;
  };

/**
 * Email format validation
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Error message if validation fails, null otherwise
 */
export const email =
  (messageOrKey = 'Please enter a valid email address', isTranslationKey = false) =>
  (value: string): ValidationResult => {
    if (!value) return null;

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
    }

    return null;
  };

/**
 * Phone number validation
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Error message if validation fails, null otherwise
 */
export const phoneNumber =
  (messageOrKey = 'Please enter a valid phone number', isTranslationKey = false) =>
  (value: string): ValidationResult => {
    if (!value) return null;

    // Basic phone number validation - allows various formats
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
    }

    return null;
  };

/**
 * URL validation
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Error message if validation fails, null otherwise
 */
export const url =
  (messageOrKey = 'Please enter a valid URL', isTranslationKey = false) =>
  (value: string): ValidationResult => {
    if (!value) return null;

    try {
      new URL(value);
      return null;
    } catch {
      return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
    }
  };

/**
 * Number validation
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Error message if validation fails, null otherwise
 */
export const number =
  (messageOrKey = 'Please enter a valid number', isTranslationKey = false) =>
  (value: string): ValidationResult => {
    if (!value) return null;

    if (isNaN(Number(value))) {
      return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
    }

    return null;
  };

/**
 * Minimum value validation for numbers
 * @param min - Minimum value allowed
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Validation function
 */
export const min =
  (min: number, messageOrKey?: string, isTranslationKey = false) =>
  (value: string | number): ValidationResult => {
    if (!value) return null;

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numberValue)) return null;

    if (numberValue < min) {
      const defaultMessage = `Must be at least ${min}`;
      if (messageOrKey) {
        return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
      }
      return { message: defaultMessage };
    }

    return null;
  };

/**
 * Maximum value validation for numbers
 * @param max - Maximum value allowed
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Validation function
 */
export const max =
  (max: number, messageOrKey?: string, isTranslationKey = false) =>
  (value: string | number): ValidationResult => {
    if (!value) return null;

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numberValue)) return null;

    if (numberValue > max) {
      const defaultMessage = `Must be no more than ${max}`;
      if (messageOrKey) {
        return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
      }
      return { message: defaultMessage };
    }

    return null;
  };

/**
 * Match validation - checks if value matches another value
 * @param compareValue - Value to compare against
 * @param messageOrKey - Custom error message or translation key (optional)
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Validation function
 */
export const matches =
  (compareValue: any, messageOrKey = 'Values do not match', isTranslationKey = false) =>
  (value: any): ValidationResult => {
    if (value !== compareValue) {
      return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
    }

    return null;
  };

/**
 * Pattern validation with regular expression
 * @param pattern - Regular expression pattern
 * @param messageOrKey - Custom error message or translation key
 * @param isTranslationKey - Whether the message is a translation key
 * @returns Validation function
 */
export const pattern =
  (pattern: RegExp, messageOrKey: string, isTranslationKey = false) =>
  (value: string): ValidationResult => {
    if (!value) return null;

    if (!pattern.test(value)) {
      return isTranslationKey ? { key: messageOrKey } : { message: messageOrKey };
    }

    return null;
  };

/**
 * Composition utility to combine multiple validators
 * @param validators - Array of validation functions
 * @returns Combined validation function that returns the first error found
 */
export const compose =
  (...validators: ((value: any) => ValidationResult)[]) =>
  (value: any): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (result) {
        return result;
      }
    }

    return null;
  };

/**
 * Custom validator function
 * @param validationFn - Custom validation function that returns error message or null
 * @returns Validation function
 */
export const custom =
  (validationFn: (value: any) => ValidationResult) =>
  (value: any): ValidationResult =>
    validationFn(value);

// Form-level validation utilities

/**
 * Validates an entire form object
 * @param values - Form values object
 * @param validationSchema - Validation schema object with field names and validation functions
 * @returns Object with validation errors
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  validationSchema: Record<keyof T, (value: any) => ValidationResult>
): Partial<Record<keyof T, { message?: string; key?: string }>> => {
  const errors: Partial<Record<keyof T, { message?: string; key?: string }>> = {};

  Object.keys(validationSchema).forEach(key => {
    const error = validationSchema[key as keyof T](values[key as keyof T]);
    if (error) {
      errors[key as keyof T] = error;
    }
  });

  return errors;
};

/**
 * Checks if a form has any errors
 * @param errors - Errors object
 * @returns Boolean indicating if the form has errors
 */
export const hasErrors = (errors: Record<string, any>): boolean => Object.keys(errors).length > 0;
