import { useFavoritesStore } from '../store/favoritesStore';

/**
 * Convenience hook for favorites operations.
 */
export function useFavorites() {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  return { favoriteIds, toggleFavorite, isFavorite };
}
