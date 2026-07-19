export type Gender = 'Male' | 'Female' | 'Other';

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  gender: Gender;
  mobileNumber: string;
  address: string;
  city: string;
  avatarUri?: string;
}

export interface Session {
  userId: string;
  loggedInAt: number;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  mobileNumber: string;
  address: string;
  city: string;
}
