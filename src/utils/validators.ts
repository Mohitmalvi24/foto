const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\d{10}$/;

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());

export const isValidMobile = (number: string): boolean => MOBILE_REGEX.test(number.trim());

export const isValidPassword = (pw: string): boolean => pw.length >= 6;

export const passwordsMatch = (pw: string, confirmPw: string): boolean => pw === confirmPw;

export const isValidFullName = (name: string): boolean => name.trim().length >= 2;

export const isValidAddress = (address: string): boolean => address.trim().length >= 5;

/**
 * Simple hash function for passwords.
 * In a real app we'd use bcrypt or similar, but for local-only storage
 * this provides basic non-plaintext persistence.
 */
export const simpleHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  // Convert to base36 string and prefix to make it clearly a hash
  return `h$${Math.abs(hash).toString(36)}`;
};

export const verifyHash = (input: string, hash: string): boolean => {
  return simpleHash(input) === hash;
};
