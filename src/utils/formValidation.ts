/**
 * Form Validation Utilities
 * A collection of validation functions for form fields
 */

export type ValidationResult = string | null | undefined;

/**
 * Required field validation
 * @param message - Custom error message (optional)
 * @returns Validation function
 */
export const required =
  (message = 'This field is required') =>
  (value: any): ValidationResult => {
    if (value === null || value === undefined || value === '') {
      return message;
    }

    if (typeof value === 'string' && value.trim() === '') {
      return message;
    }

    return null;
  };

/**
 * Minimum length validation
 * @param minLength - Minimum length required
 * @param message - Custom error message (optional)
 * @returns Validation function
 */
export const minLength =
  (minLength: number, message?: string) =>
  (value: string): ValidationResult => {
    if (!value || value.length < minLength) {
      return message || `Must be at least ${minLength} characters`;
    }
    return null;
  };

/**
 * Maximum length validation
 * @param maxLength - Maximum length allowed
 * @param message - Custom error message (optional)
 * @returns Validation function
 */
export const maxLength =
  (maxLength: number, message?: string) =>
  (value: string): ValidationResult => {
    if (value && value.length > maxLength) {
      return message || `Must be no more than ${maxLength} characters`;
    }
    return null;
  };

/**
 * Email format validation
 * @param message - Custom error message (optional)
 * @returns Error message if validation fails, null otherwise
 */
export const email =
  (message = 'Please enter a valid email address') =>
  (value: string): ValidationResult => {
    if (!value) return null;

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }

    return null;
  };

/**
 * Phone number validation
 * @param message - Custom error message (optional)
 * @returns Error message if validation fails, null otherwise
 */
export const phoneNumber =
  (message = 'Please enter a valid phone number') =>
  (value: string): ValidationResult => {
    if (!value) return null;

    // Basic phone number validation - allows various formats
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return message;
    }

    return null;
  };

/**
 * URL validation
 * @param message - Custom error message (optional)
 * @returns Error message if validation fails, null otherwise
 */
export const url =
  (message = 'Please enter a valid URL') =>
  (value: string): ValidationResult => {
    if (!value) return null;

    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  };

/**
 * Number validation
 * @param message - Custom error message (optional)
 * @returns Error message if validation fails, null otherwise
 */
export const number =
  (message = 'Please enter a valid number') =>
  (value: string): ValidationResult => {
    if (!value) return null;

    if (isNaN(Number(value))) {
      return message;
    }

    return null;
  };

/**
 * Minimum value validation for numbers
 * @param min - Minimum value allowed
 * @param message - Custom error message (optional)
 * @returns Validation function
 */
export const min =
  (min: number, message?: string) =>
  (value: string | number): ValidationResult => {
    if (!value) return null;

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numberValue)) return null;

    if (numberValue < min) {
      return message || `Must be at least ${min}`;
    }

    return null;
  };

/**
 * Maximum value validation for numbers
 * @param max - Maximum value allowed
 * @param message - Custom error message (optional)
 * @returns Validation function
 */
export const max =
  (max: number, message?: string) =>
  (value: string | number): ValidationResult => {
    if (!value) return null;

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numberValue)) return null;

    if (numberValue > max) {
      return message || `Must be no more than ${max}`;
    }

    return null;
  };

/**
 * Match validation - checks if value matches another value
 * @param compareValue - Value to compare against
 * @param message - Custom error message (optional)
 * @returns Validation function
 */
export const matches =
  (compareValue: any, message = 'Values do not match') =>
  (value: any): ValidationResult => {
    if (value !== compareValue) {
      return message;
    }

    return null;
  };

/**
 * Pattern validation with regular expression
 * @param pattern - Regular expression pattern
 * @param message - Custom error message
 * @returns Validation function
 */
export const pattern =
  (pattern: RegExp, message: string) =>
  (value: string): ValidationResult => {
    if (!value) return null;

    if (!pattern.test(value)) {
      return message;
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
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};

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
