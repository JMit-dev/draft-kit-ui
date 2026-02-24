import { storage } from './storage';

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      expect(storage.get('nonexistent')).toBeNull();
    });

    it('should retrieve stored value', () => {
      localStorage.setItem('test', JSON.stringify('value'));
      expect(storage.get('test')).toBe('value');
    });

    it('should retrieve object value', () => {
      const obj = { foo: 'bar' };
      localStorage.setItem('test', JSON.stringify(obj));
      expect(storage.get('test')).toEqual(obj);
    });
  });

  describe('set', () => {
    it('should store string value', () => {
      storage.set('test', 'value');
      expect(localStorage.getItem('test')).toBe(JSON.stringify('value'));
    });

    it('should store object value', () => {
      const obj = { foo: 'bar' };
      storage.set('test', obj);
      expect(localStorage.getItem('test')).toBe(JSON.stringify(obj));
    });

    it('should store number value', () => {
      storage.set('test', 42);
      expect(storage.get('test')).toBe(42);
    });
  });

  describe('remove', () => {
    it('should remove stored value', () => {
      storage.set('test', 'value');
      storage.remove('test');
      expect(storage.get('test')).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all stored values', () => {
      storage.set('test1', 'value1');
      storage.set('test2', 'value2');
      storage.clear();
      expect(storage.get('test1')).toBeNull();
      expect(storage.get('test2')).toBeNull();
    });
  });
});
