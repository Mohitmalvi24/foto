import { API_BASE_URL, PAGE_SIZE } from '../constants/config';
import type { PicsumImage } from '../types/image';

/**
 * Fetches a paginated list of images from the Picsum Photos API.
 * @param page Page number (1-indexed)
 * @param limit Number of images per page
 * @returns Array of PicsumImage objects
 * @throws Error with descriptive message on network or API failure
 */
export const fetchImages = async (
  page: number = 1,
  limit: number = PAGE_SIZE,
): Promise<PicsumImage[]> => {
  const url = `${API_BASE_URL}/list?page=${page}&limit=${limit}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data: PicsumImage[] = await response.json();
  return data;
};

/**
 * Returns the URL for a specific image at a given resolution.
 */
export const getImageUrl = (id: string, width: number, height: number): string => {
  return `https://picsum.photos/id/${id}/${width}/${height}`;
};

/**
 * Returns a thumbnail URL for gallery cards.
 */
export const getThumbnailUrl = (id: string): string => {
  return getImageUrl(id, 300, 200);
};

/**
 * Returns a higher-resolution URL for the detail view.
 */
export const getDetailUrl = (id: string): string => {
  return getImageUrl(id, 800, 600);
};
