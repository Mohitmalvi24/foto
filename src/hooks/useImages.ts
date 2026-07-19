import { useEffect } from 'react';
import { useImageStore } from '../store/imageStore';

/**
 * Convenience hook to interact with the image store.
 * Triggers initial fetch on mount.
 */
export function useImages() {
  const store = useImageStore();

  useEffect(() => {
    if (store.images.length === 0 && !store.isLoading) {
      store.fetchInitial();
    }
  }, []);

  return store;
}
