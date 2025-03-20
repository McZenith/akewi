import { parsePhoneNumberFromString } from 'libphonenumber-js';
import i18next from '../i18n';

export const isValidEmail = (email: string): boolean => {
  // RFC 5322 compliant email regex
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone, 'NG');
    return phoneNumber ? phoneNumber.isValid() : false;
  } catch {
    return false;
  }
};

export const validateIdentifier = (
  identifier: string,
  type: 'email' | 'phone' | null
): string | null => {
  const { t } = i18next;
  
  if (!identifier) {
    return t('auth.errors.emptyInput', 'Please enter your email address or phone number');
  }

  // If type is explicitly set, validate accordingly
  if (type === 'email') {
    if (!isValidEmail(identifier)) {
      return t('auth.errors.invalidEmail', 'Please enter a valid email address');
    }
    return null;
  }

  if (type === 'phone') {
    if (!isValidPhone(identifier)) {
      return t('auth.errors.invalidPhone', 'Please enter a valid phone number (e.g., +234 XXX XXX XXXX)');
    }
    return null;
  }

  // If type is not set, try to determine and validate
  if (identifier.includes('@')) {
    if (!isValidEmail(identifier)) {
      return t('auth.errors.invalidEmail', 'Please enter a valid email address');
    }
  } else {
    // Try to validate as phone if it contains numbers
    if (/\d/.test(identifier)) {
      if (!isValidPhone(identifier)) {
        return t('auth.errors.invalidPhone', 'Please enter a valid phone number (e.g., +234 XXX XXX XXXX)');
      }
    } else {
      return t('auth.errors.invalidInput', 'Please enter a valid email address or phone number');
    }
  }

  return null;
};
