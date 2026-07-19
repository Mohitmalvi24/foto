import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Removed uuid import to avoid react-native crypto polyfill issues
// import { v4 as uuidv4 } from 'uuid';
import type { User, Session, RegisterInput } from '../types/user';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { simpleHash, verifyHash } from '../utils/validators';

interface AuthState {
  currentUser: User | null;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  hydrateSession: () => Promise<void>;
}

const getStoredUsers = async (): Promise<User[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
};

const saveUsers = async (users: User[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const saveSession = async (session: Session | null): Promise<void> => {
  if (session) {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};

const getStoredSession = async (): Promise<Session | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
  return raw ? JSON.parse(raw) : null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isHydrating: true,

  hydrateSession: async () => {
    set({ isHydrating: true });
    try {
      const session = await getStoredSession();
      if (session) {
        const users = await getStoredUsers();
        const user = users.find((u) => u.id === session.userId) || null;
        set({ currentUser: user, isHydrating: false });
      } else {
        set({ currentUser: null, isHydrating: false });
      }
    } catch {
      set({ currentUser: null, isHydrating: false });
    }
  },

  register: async (data: RegisterInput) => {
    try {
      const users = await getStoredUsers();
      const emailLower = data.email.trim().toLowerCase();

      // Check for duplicate email
      if (users.some((u) => u.email === emailLower)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newUser: User = {
        id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Simple ID generation
        fullName: data.fullName.trim(),
        email: emailLower,
        passwordHash: simpleHash(data.password),
        gender: data.gender,
        mobileNumber: data.mobileNumber.trim(),
        address: data.address.trim(),
        city: data.city,
      };

      users.push(newUser);
      await saveUsers(users);

      // Auto-login after registration
      const session: Session = { userId: newUser.id, loggedInAt: Date.now() };
      await saveSession(session);
      set({ currentUser: newUser });

      return { success: true };
    } catch (e) {
      console.error('Registration error:', e);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const users = await getStoredUsers();
      const emailLower = email.trim().toLowerCase();
      const user = users.find((u) => u.email === emailLower);

      if (!user || !verifyHash(password, user.passwordHash)) {
        return { success: false, error: 'Invalid email or password.' };
      }

      const session: Session = { userId: user.id, loggedInAt: Date.now() };
      await saveSession(session);
      set({ currentUser: user });

      return { success: true };
    } catch {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },

  logout: async () => {
    await saveSession(null);
    set({ currentUser: null });
  },

  updateProfile: async (data: Partial<User>) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedUser: User = { ...currentUser, ...data };
    const users = await getStoredUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);

    if (idx !== -1) {
      users[idx] = updatedUser;
      await saveUsers(users);
      set({ currentUser: updatedUser });
    }
  },
}));
