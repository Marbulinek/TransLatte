import * as fs from 'fs';
import * as path from 'path';
import { LingvaService } from './lingva-service';
import {
  TranslatteConfig,
  TranslationResult,
  TranslationSource,
  TranslationSummary,
} from './types';

export class Translator {
  private lingvaService: LingvaService;
  private config: TranslatteConfig;

  constructor(config: TranslatteConfig) {
    this.config = config;
    this.lingvaService = new LingvaService(
      config.lingvaInstance,
      config.preserveInterpolation !== false, // Default to true
      config.interpolationPattern,
      config.enableCache !== false, // Default to true
    );
  }

  /**
   * Get all translation sources (supports both single and multiple sources)
   */
  private getSources(): TranslationSource[] {
    // If sources array is provided, use it
    if (this.config.sources && this.config.sources.length > 0) {
      return this.config.sources;
    }

    // Fall back to single inputFile/outputDir (backward compatibility)
    if (this.config.inputFile && this.config.outputDir) {
      return [
        {
          inputFile: this.config.inputFile,
          outputDir: this.config.outputDir,
          name: 'Default',
        },
      ];
    }

    throw new Error(
      'No translation sources configured. Please provide either "sources" array or "inputFile"/"outputDir".',
    );
  }

  /**
   * Load a source translation file
   */
  private loadSourceFile(inputFile: string): Record<string, any> {
    const inputPath = path.resolve(inputFile);

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Source file not found: ${inputPath}`);
    }

    const content = fs.readFileSync(inputPath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Save translated content to file
   */
  private saveTranslation(
    outputDir: string,
    language: string,
    content: Record<string, any>,
  ): void {
    const outputDirPath = path.resolve(outputDir);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    const outputPath = path.join(outputDirPath, `${language}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(content, null, 2), 'utf-8');
  }

  /**
   * Translate a single source to a single target language
   */
  async translateSourceToLanguage(
    source: TranslationSource,
    targetLang: string,
  ): Promise<TranslationResult> {
    try {
      const sourceContent = this.loadSourceFile(source.inputFile);

      const translations = await this.lingvaService.translateObject(
        sourceContent,
        this.config.sourceLanguage,
        targetLang,
      );

      this.saveTranslation(source.outputDir, targetLang, translations);

      return {
        language: targetLang,
        translations,
        success: true,
        sourceName: source.name,
      };
    } catch (error: any) {
      return {
        language: targetLang,
        translations: {},
        success: false,
        error: error.message,
        sourceName: source.name,
      };
    }
  }

  /**
   * Translate a single source to all target languages (in parallel with staggered start)
   */
  async translateSource(
    source: TranslationSource,
  ): Promise<TranslationResult[]> {
    // Stagger the start of parallel translations to avoid rate limiting
    // Fixed 500ms stagger interval for optimal API usage
    const STAGGER_DELAY_MS = 500;
    const translationPromises = this.config.targetLanguages.map(
      (targetLang, index) =>
        this.delayedTranslation(source, targetLang, index * STAGGER_DELAY_MS),
    );

    return Promise.all(translationPromises);
  }

  /**
   * Start translation after a delay (for staggering parallel requests)
   */
  private async delayedTranslation(
    source: TranslationSource,
    targetLang: string,
    delayMs: number,
  ): Promise<TranslationResult> {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return this.translateSourceToLanguage(source, targetLang);
  }

  /**
   * Translate all sources to all target languages (in parallel)
   */
  async translateAll(): Promise<TranslationSummary> {
    const sources = this.getSources();

    // Translate all sources in parallel
    const sourcePromises = sources.map((source) =>
      this.translateSource(source),
    );
    const resultsArrays = await Promise.all(sourcePromises);

    // Flatten results from all sources
    const allResults: TranslationResult[] = resultsArrays.flat();

    const successCount = allResults.filter((r) => r.success).length;
    const failCount = allResults.filter((r) => !r.success).length;

    // Flush cache to disk after translation
    this.lingvaService.flushCache();

    // Get cache statistics
    const cacheStats = this.lingvaService.getCacheStats();

    return {
      totalSources: sources.length,
      totalLanguages: this.config.targetLanguages.length,
      successCount,
      failCount,
      results: allResults,
      cacheSize: cacheStats.size,
    };
  }

  /**
   * Legacy method for backward compatibility
   */
  async translateToLanguage(
    sourceContent: Record<string, any>,
    targetLang: string,
  ): Promise<TranslationResult> {
    const sources = this.getSources();
    const source = sources[0]; // Use first source for backward compatibility

    try {
      const translations = await this.lingvaService.translateObject(
        sourceContent,
        this.config.sourceLanguage,
        targetLang,
      );

      this.saveTranslation(source.outputDir, targetLang, translations);

      return {
        language: targetLang,
        translations,
        success: true,
      };
    } catch (error: any) {
      return {
        language: targetLang,
        translations: {},
        success: false,
        error: error.message,
      };
    }
  }
}
