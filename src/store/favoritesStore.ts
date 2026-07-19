import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/storageKeys';

interface FavoritesState {
  favoriteIds: string[];
  isLoaded: boolean;
  toggleFavorite: (imageId: string) => Promise<void>;
  loadFavorites: (userId: string) => Promise<void>;
  isFavorite: (imageId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],
  isLoaded: false,

  loadFavorites: async (userId: string) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES(userId));
      const ids: string[] = raw ? JSON.parse(raw) : [];
      set({ favoriteIds: ids, isLoaded: true });
    } catch {
      set({ favoriteIds: [], isLoaded: true });
    }
  },

  toggleFavorite: async (imageId: string) => {
    const { favoriteIds } = get();
    let updated: string[];

    if (favoriteIds.includes(imageId)) {
      updated = favoriteIds.filter((id) => id !== imageId);
    } else {
      updated = [...favoriteIds, imageId];
    }

    set({ favoriteIds: updated });

    // Persist — we need the userId, so we read it from session
    try {
      const sessionRaw = await AsyncStorage.getItem('@app/session');
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        await AsyncStorage.setItem(
          STORAGE_KEYS.FAVORITES(session.userId),
          JSON.stringify(updated),
        );
      }
    } catch {
      // Optimistic UI: state already updated
    }
  },

  isFavorite: (imageId: string) => {
    return get().favoriteIds.includes(imageId);
  },

  clearFavorites: () => {
    set({ favoriteIds: [], isLoaded: false });
  },
}));
