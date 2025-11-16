import axios from 'axios';
import { TranslationCache } from './translation-cache';

export class LingvaService {
  private baseUrl: string;
  private preserveInterpolation: boolean;
  private interpolationPattern: RegExp;
  private readonly DELAY_MS = 2000; // Increased delay to 2000ms to respect API rate limits
  private cache: TranslationCache;

  constructor(
    baseUrl: string = 'https://lingva.ml/api/v1',
    preserveInterpolation: boolean = true,
    interpolationPattern?: string,
    enableCache: boolean = true,
  ) {
    this.baseUrl = baseUrl;
    this.preserveInterpolation = preserveInterpolation;
    this.cache = new TranslationCache(undefined, enableCache);

    // Default pattern matches: {{var}}, {var}, %var%, $var$, ${var}
    const defaultPattern =
      '\\{\\{[^}]+\\}\\}|\\{[^}]+\\}|%[^%]+%|\\$[^$]+\\$|\\$\\{[^}]+\\}';
    this.interpolationPattern = new RegExp(
      interpolationPattern || defaultPattern,
      'g',
    );
  }

  /**
   * Extract placeholders from text and replace with unique tokens
   */
  private extractPlaceholders(text: string): {
    text: string;
    placeholders: Map<string, string>;
  } {
    const placeholders = new Map<string, string>();
    let index = 0;

    const processedText = text.replace(
      this.interpolationPattern,
      (match, offset) => {
        // Preserve surrounding spaces
        const beforeSpace = offset > 0 && text[offset - 1] === ' ' ? '' : '';
        const afterSpace =
          offset + match.length < text.length &&
          text[offset + match.length] === ' '
            ? ''
            : '';

        const token = `__PLCH${index}__`;
        placeholders.set(token, match);
        index++;
        return beforeSpace + token + afterSpace;
      },
    );

    return { text: processedText, placeholders };
  }

  /**
   * Restore placeholders in translated text
   */
  private restorePlaceholders(
    text: string,
    placeholders: Map<string, string>,
  ): string {
    let result = text;
    placeholders.forEach((original, token) => {
      // Replace the token with the original placeholder
      // Handle case where translation might have added/removed spaces
      const tokenPattern = new RegExp(token.replace(/(\d+)/g, '$1'), 'g');
      result = result.replace(tokenPattern, original);
    });
    return result;
  }

  /**
   * Translate a single text from source to target language
   */
  async translate(
    text: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<string> {
    try {
      // Check cache first
      const cachedTranslation = this.cache.get(text, sourceLang, targetLang);
      if (cachedTranslation) {
        return cachedTranslation;
      }

      let textToTranslate = text;
      let placeholders = new Map<string, string>();

      // Extract placeholders if preservation is enabled
      if (this.preserveInterpolation) {
        const extracted = this.extractPlaceholders(text);
        textToTranslate = extracted.text;
        placeholders = extracted.placeholders;
      }

      // Encode the text for URL
      const encodedText = encodeURIComponent(textToTranslate);
      const url = `${this.baseUrl}/${sourceLang}/${targetLang}/${encodedText}`;

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'TransLatte/1.1.0',
        },
      });

      if (response.data && response.data.translation) {
        let translatedText = response.data.translation;

        // Restore placeholders if they were extracted
        if (this.preserveInterpolation && placeholders.size > 0) {
          translatedText = this.restorePlaceholders(
            translatedText,
            placeholders,
          );
        }

        // Store in cache
        this.cache.set(text, translatedText, sourceLang, targetLang);

        return translatedText;
      }

      throw new Error('Invalid response from Lingva API');
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `Translation failed: ${error.response.status} - ${error.response.statusText}`,
        );
      } else if (error.request) {
        throw new Error('Translation failed: No response from server');
      } else {
        throw new Error(`Translation failed: ${error.message}`);
      }
    }
  }

  /**
   * Translate an object recursively
   */
  async translateObject(
    obj: Record<string, any>,
    sourceLang: string,
    targetLang: string,
  ): Promise<Record<string, any>> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Translate string values
        result[key] = await this.translate(value, sourceLang, targetLang);
        // Add delay to avoid rate limiting
        await this.sleep(this.DELAY_MS);
      } else if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Recursively translate nested objects
        result[key] = await this.translateObject(value, sourceLang, targetLang);
      } else {
        // Keep other types as is (arrays, numbers, etc.)
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Flush cache to disk
   */
  flushCache(): void {
    this.cache.flush();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; enabled: boolean } {
    return this.cache.getStats();
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache.clearCache();
  }
}
