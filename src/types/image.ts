export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface GalleryImage extends PicsumImage {
  isFavorite: boolean;
}

export type AuthorFilter = 'All' | 'A-M' | 'N-Z';
