import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';

/**
 * Wraps authStore for convenient access in components.
 * Also handles loading favorites when user changes.
 */
export function useAuth() {
  const store = useAuthStore();
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);

  useEffect(() => {
    if (store.currentUser) {
      loadFavorites(store.currentUser.id);
    } else {
      clearFavorites();
    }
  }, [store.currentUser?.id]);

  return store;
}
