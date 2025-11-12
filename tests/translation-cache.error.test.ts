import * as fs from 'fs';
import * as path from 'path';

describe('TranslationCache (error and edge cases)', () => {
  const testCacheDir = path.join(__dirname, '.test-cache-error');

  afterEach(() => {
    if (fs.existsSync(testCacheDir)) {
      fs.rmSync(testCacheDir, { recursive: true, force: true });
    }
  });

  it('should handle corrupted cache file gracefully', () => {
    const { TranslationCache } = require('../src/translation-cache');
    if (!fs.existsSync(testCacheDir)) {
      fs.mkdirSync(testCacheDir, { recursive: true });
    }
    const cacheFile = path.join(testCacheDir, 'translations.json');
    fs.writeFileSync(cacheFile, '{not valid json');
    // Should not throw
    const cache = new TranslationCache(testCacheDir, true);
    expect(cache.getStats().size).toBe(0);
  });

  it('should clear cache if version mismatch', () => {
    const { TranslationCache } = require('../src/translation-cache');
    if (!fs.existsSync(testCacheDir)) {
      fs.mkdirSync(testCacheDir, { recursive: true });
    }
    const cacheFile = path.join(testCacheDir, 'translations.json');
    fs.writeFileSync(
      cacheFile,
      JSON.stringify({
        version: '0.0',
        entries: {
          foo: {
            sourceText: 'a',
            translatedText: 'b',
            sourceLang: 'en',
            targetLang: 'es',
            timestamp: Date.now(),
          },
        },
      }),
    );
    const cache = new TranslationCache(testCacheDir, true);
    expect(cache.getStats().size).toBe(0);
  });

  it('should not throw if clearCache tries to delete missing file', () => {
    const { TranslationCache } = require('../src/translation-cache');
    const cache = new TranslationCache(testCacheDir, true);
    // Should not throw even if file does not exist
    expect(() => cache.clearCache()).not.toThrow();
  });
});

describe('TranslationCache (saveCache error handling)', () => {
  const testCacheDir = path.join(__dirname, '.test-cache-error-mock');
  afterEach(() => {
    jest.resetModules();
    jest.dontMock('fs');
    if (fs.existsSync(testCacheDir)) {
      fs.rmSync(testCacheDir, { recursive: true, force: true });
    }
  });
  it('should not throw if saveCache fails', () => {
    jest.doMock('fs', () => ({
      ...jest.requireActual('fs'),
      writeFileSync: jest.fn(() => {
        throw new Error('fail');
      }),
    }));
    const {
      TranslationCache: MockedCache,
    } = require('../src/translation-cache');
    const cache = new MockedCache(testCacheDir, true);
    expect(() => cache.flush()).not.toThrow();
  });
});
