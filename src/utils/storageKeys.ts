export const STORAGE_KEYS = {
  USERS: '@app/users',
  SESSION: '@app/session',
  FAVORITES: (userId: string) => `@app/favorites:${userId}`,
} as const;
