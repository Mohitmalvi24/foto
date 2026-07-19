import { create } from 'zustand';
import { fetchImages } from '../api/picsumApi';
import type { PicsumImage } from '../types/image';
import { PAGE_SIZE } from '../constants/config';

interface ImageState {
  images: PicsumImage[];
  page: number;
  isLoading: boolean;
  isFetchingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasMore: boolean;
  fetchInitial: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  page: 1,
  isLoading: false,
  isFetchingMore: false,
  isRefreshing: false,
  error: null,
  hasMore: true,

  fetchInitial: async () => {
    const { isLoading } = get();
    if (isLoading) return; // guard against duplicate calls

    set({ isLoading: true, error: null });
    try {
      const data = await fetchImages(1, PAGE_SIZE);
      set({
        images: data,
        page: 1,
        isLoading: false,
        hasMore: data.length === PAGE_SIZE,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e instanceof Error ? e.message : 'Failed to load images.',
      });
    }
  },

  fetchNextPage: async () => {
    const { isFetchingMore, hasMore, page, images } = get();
    if (isFetchingMore || !hasMore) return; // guard

    set({ isFetchingMore: true, error: null });
    try {
      const nextPage = page + 1;
      const data = await fetchImages(nextPage, PAGE_SIZE);

      // Deduplicate by id
      const existingIds = new Set(images.map((img) => img.id));
      const newImages = data.filter((img) => !existingIds.has(img.id));

      set({
        images: [...images, ...newImages],
        page: nextPage,
        isFetchingMore: false,
        hasMore: data.length === PAGE_SIZE,
      });
    } catch (e) {
      set({
        isFetchingMore: false,
        error: e instanceof Error ? e.message : 'Failed to load more images.',
      });
    }
  },

  refresh: async () => {
    const { isRefreshing } = get();
    if (isRefreshing) return; // guard against duplicate refresh

    set({ isRefreshing: true, error: null });
    try {
      const data = await fetchImages(1, PAGE_SIZE);
      set({
        images: data,
        page: 1,
        isRefreshing: false,
        hasMore: data.length === PAGE_SIZE,
      });
    } catch (e) {
      set({
        isRefreshing: false,
        error: e instanceof Error ? e.message : 'Failed to refresh images.',
      });
    }
  },
}));
