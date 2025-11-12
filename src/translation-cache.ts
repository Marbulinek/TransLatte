import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface CacheEntry {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

export interface CacheData {
  version: string;
  entries: { [key: string]: CacheEntry };
}

export class TranslationCache {
  private cacheFile: string;
  private cache: Map<string, CacheEntry>;
  private readonly CACHE_VERSION = '1.0';
  private readonly CACHE_DIR = '.translatte-cache';
  private enabled: boolean;

  constructor(cacheDir?: string, enabled: boolean = true) {
    this.enabled = enabled;
    const dir = cacheDir || path.join(process.cwd(), this.CACHE_DIR);

    if (this.enabled) {
      // Create cache directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    this.cacheFile = path.join(dir, 'translations.json');
    this.cache = new Map();

    if (this.enabled) {
      this.loadCache();
    }
  }

  /**
   * Generate a unique cache key for a translation
   */
  private generateKey(
    text: string,
    sourceLang: string,
    targetLang: string,
  ): string {
    const data = `${text}|${sourceLang}|${targetLang}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * Load cache from disk
   */
  private loadCache(): void {
    if (!this.enabled) return;

    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = fs.readFileSync(this.cacheFile, 'utf-8');
        const cacheData: CacheData = JSON.parse(data);

        // Verify cache version
        if (cacheData.version === this.CACHE_VERSION) {
          Object.entries(cacheData.entries).forEach(([key, entry]) => {
            this.cache.set(key, entry);
          });
        } else {
          // Cache version mismatch, clear cache
          this.clearCache();
        }
      }
    } catch {
      // If cache is corrupted, start fresh
      this.cache.clear();
    }
  }

  /**
   * Save cache to disk
   */
  private saveCache(): void {
    if (!this.enabled) return;

    try {
      const cacheData: CacheData = {
        version: this.CACHE_VERSION,
        entries: Object.fromEntries(this.cache),
      };

      fs.writeFileSync(
        this.cacheFile,
        JSON.stringify(cacheData, null, 2),
        'utf-8',
      );
    } catch {
      // Silently fail if we can't save cache
      console.warn('Warning: Failed to save translation cache');
    }
  }

  /**
   * Get a cached translation
   */
  get(text: string, sourceLang: string, targetLang: string): string | null {
    if (!this.enabled) return null;

    const key = this.generateKey(text, sourceLang, targetLang);
    const entry = this.cache.get(key);

    if (entry) {
      return entry.translatedText;
    }

    return null;
  }

  /**
   * Store a translation in cache
   */
  set(
    text: string,
    translatedText: string,
    sourceLang: string,
    targetLang: string,
  ): void {
    if (!this.enabled) return;

    const key = this.generateKey(text, sourceLang, targetLang);
    const entry: CacheEntry = {
      sourceText: text,
      translatedText,
      sourceLang,
      targetLang,
      timestamp: Date.now(),
    };

    this.cache.set(key, entry);
  }

  /**
   * Check if a translation exists in cache
   */
  has(text: string, sourceLang: string, targetLang: string): boolean {
    if (!this.enabled) return false;

    const key = this.generateKey(text, sourceLang, targetLang);
    return this.cache.has(key);
  }

  /**
   * Save cache to disk (public method)
   */
  flush(): void {
    this.saveCache();
  }

  /**
   * Clear all cache entries
   */
  clearCache(): void {
    this.cache.clear();

    if (this.enabled && fs.existsSync(this.cacheFile)) {
      fs.unlinkSync(this.cacheFile);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; enabled: boolean } {
    return {
      size: this.cache.size,
      enabled: this.enabled,
    };
  }

  /**
   * Remove old cache entries (older than specified days)
   */
  pruneOldEntries(maxAgeDays: number = 30): number {
    if (!this.enabled) return 0;

    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000; // Convert to milliseconds
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      this.saveCache();
    }

    return removed;
  }
}
