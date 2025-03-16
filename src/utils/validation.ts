import { parsePhoneNumberFromString } from 'libphonenumber-js';

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
  if (!identifier) {
    return 'Please enter your email address or phone number';
  }

  // If type is explicitly set, validate accordingly
  if (type === 'email') {
    if (!isValidEmail(identifier)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  if (type === 'phone') {
    if (!isValidPhone(identifier)) {
      return 'Please enter a valid phone number (e.g., +234 XXX XXX XXXX)';
    }
    return null;
  }

  // If type is not set, try to determine and validate
  if (identifier.includes('@')) {
    if (!isValidEmail(identifier)) {
      return 'Please enter a valid email address';
    }
  } else {
    // Try to validate as phone if it contains numbers
    if (/\d/.test(identifier)) {
      if (!isValidPhone(identifier)) {
        return 'Please enter a valid phone number (e.g., +234 XXX XXX XXXX)';
      }
    } else {
      return 'Please enter a valid email address or phone number';
    }
  }

  return null;
};
