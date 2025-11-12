import { TranslationCache } from '../src/translation-cache';
import * as fs from 'fs';
import * as path from 'path';

describe('TranslationCache', () => {
  const testCacheDir = path.join(__dirname, '.test-cache');
  let cache: TranslationCache;

  beforeEach(() => {
    // Clean up test cache directory
    if (fs.existsSync(testCacheDir)) {
      fs.rmSync(testCacheDir, { recursive: true, force: true });
    }
    cache = new TranslationCache(testCacheDir, true);
  });

  afterEach(() => {
    // Clean up
    if (fs.existsSync(testCacheDir)) {
      fs.rmSync(testCacheDir, { recursive: true, force: true });
    }
  });

  describe('Basic Operations', () => {
    it('should store and retrieve translations', () => {
      cache.set('Hello', 'Hola', 'en', 'es');
      const result = cache.get('Hello', 'en', 'es');

      expect(result).toBe('Hola');
    });

    it('should return null for non-existent translations', () => {
      const result = cache.get('NonExistent', 'en', 'es');
      expect(result).toBeNull();
    });

    it('should check if translation exists', () => {
      cache.set('Hello', 'Hola', 'en', 'es');

      expect(cache.has('Hello', 'en', 'es')).toBe(true);
      expect(cache.has('Goodbye', 'en', 'es')).toBe(false);
    });

    it('should handle different language pairs separately', () => {
      cache.set('Hello', 'Hola', 'en', 'es');
      cache.set('Hello', 'Bonjour', 'en', 'fr');
      cache.set('Hello', 'Hallo', 'en', 'de');

      expect(cache.get('Hello', 'en', 'es')).toBe('Hola');
      expect(cache.get('Hello', 'en', 'fr')).toBe('Bonjour');
      expect(cache.get('Hello', 'en', 'de')).toBe('Hallo');
    });
  });

  describe('Persistence', () => {
    it('should persist cache to disk', () => {
      cache.set('Hello', 'Hola', 'en', 'es');
      cache.flush();

      const cacheFile = path.join(testCacheDir, 'translations.json');
      expect(fs.existsSync(cacheFile)).toBe(true);
    });

    it('should load cache from disk', () => {
      cache.set('Hello', 'Hola', 'en', 'es');
      cache.set('World', 'Mundo', 'en', 'es');
      cache.flush();

      // Create new cache instance (should load from disk)
      const newCache = new TranslationCache(testCacheDir, true);

      expect(newCache.get('Hello', 'en', 'es')).toBe('Hola');
      expect(newCache.get('World', 'en', 'es')).toBe('Mundo');
    });
  });

  describe('Cache Management', () => {
    it('should clear all cache entries', () => {
      cache.set('Hello', 'Hola', 'en', 'es');
      cache.set('World', 'Mundo', 'en', 'es');

      expect(cache.getStats().size).toBe(2);

      cache.clearCache();

      expect(cache.getStats().size).toBe(0);
      expect(cache.get('Hello', 'en', 'es')).toBeNull();
    });

    it('should return cache statistics', () => {
      cache.set('Hello', 'Hola', 'en', 'es');
      cache.set('World', 'Mundo', 'en', 'es');
      cache.set('Goodbye', 'Adiós', 'en', 'es');

      const stats = cache.getStats();

      expect(stats.size).toBe(3);
      expect(stats.enabled).toBe(true);
    });
  });

  describe('Disabled Cache', () => {
    it('should not store translations when disabled', () => {
      const disabledCache = new TranslationCache(testCacheDir, false);

      disabledCache.set('Hello', 'Hola', 'en', 'es');
      const result = disabledCache.get('Hello', 'en', 'es');

      expect(result).toBeNull();
    });

    it('should return false for has() when disabled', () => {
      const disabledCache = new TranslationCache(testCacheDir, false);

      disabledCache.set('Hello', 'Hola', 'en', 'es');

      expect(disabledCache.has('Hello', 'en', 'es')).toBe(false);
    });

    it('should report correct stats when disabled', () => {
      const disabledCache = new TranslationCache(testCacheDir, false);

      const stats = disabledCache.getStats();

      expect(stats.size).toBe(0);
      expect(stats.enabled).toBe(false);
    });
  });

  describe('Cache Pruning', () => {
    it('should handle pruning without errors', () => {
      // Add entries
      cache.set('Entry1', 'Entrada1', 'en', 'es');
      cache.set('Entry2', 'Entrada2', 'en', 'es');
      cache.set('Entry3', 'Entrada3', 'en', 'es');

      // Prune with very large max age (nothing should be removed)
      const removed = cache.pruneOldEntries(365);

      expect(removed).toBe(0);
      expect(cache.getStats().size).toBe(3);
    });
  });

  describe('Placeholder Preservation in Cache', () => {
    it('should cache translations with placeholders correctly', () => {
      const textWithPlaceholders = 'Hello {{name}}, you have {count} messages';
      const translatedWithPlaceholders =
        'Hola {{name}}, tienes {count} mensajes';

      cache.set(textWithPlaceholders, translatedWithPlaceholders, 'en', 'es');
      const result = cache.get(textWithPlaceholders, 'en', 'es');

      expect(result).toBe(translatedWithPlaceholders);
      expect(result).toContain('{{name}}');
      expect(result).toContain('{count}');
    });
  });
});
