// Type-safe localStorage wrapper with error handling

type StorageValue = string | number | boolean | object | null;

function isServer(): boolean {
  return typeof window === 'undefined';
}

export const storage = {
  get<T = StorageValue>(key: string): T | null {
    if (isServer()) return null;

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return null;

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set(key: string, value: StorageValue): void {
    if (isServer()) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove(key: string): void {
    if (isServer()) return;

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear(): void {
    if (isServer()) return;

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
