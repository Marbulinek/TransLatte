import {
  TranslatteConfig,
  TranslationSource,
  TranslationResult,
} from '../src/types';

describe('Type Definitions', () => {
  describe('TranslatteConfig', () => {
    it('should accept valid single-source config', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr'],
        inputFile: './src/i18n/en.json',
        outputDir: './src/i18n',
      };

      expect(config.sourceLanguage).toBe('en');
      expect(config.targetLanguages).toHaveLength(2);
    });

    it('should accept valid multi-source config', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        sources: [
          {
            name: 'Core',
            inputFile: './core/en.json',
            outputDir: './core',
          },
        ],
      };

      expect(config.sources).toBeDefined();
      expect(config.sources).toHaveLength(1);
    });

    it('should accept optional lingvaInstance', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        inputFile: './en.json',
        outputDir: './',
        lingvaInstance: 'https://custom-lingva.com/api/v1',
      };

      expect(config.lingvaInstance).toBe('https://custom-lingva.com/api/v1');
    });

    it('should accept optional preserveInterpolation', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        inputFile: './en.json',
        outputDir: './',
        preserveInterpolation: false,
      };

      expect(config.preserveInterpolation).toBe(false);
    });

    it('should accept optional interpolationPattern', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        inputFile: './en.json',
        outputDir: './',
        interpolationPattern: '\\[\\[[^\\]]+\\]\\]',
      };

      expect(config.interpolationPattern).toBe('\\[\\[[^\\]]+\\]\\]');
    });
  });

  describe('TranslationSource', () => {
    it('should define translation source with name', () => {
      const source: TranslationSource = {
        name: 'Core Module',
        inputFile: './core/en.json',
        outputDir: './core',
      };

      expect(source.name).toBe('Core Module');
      expect(source.inputFile).toBe('./core/en.json');
    });

    it('should define translation source without name', () => {
      const source: TranslationSource = {
        inputFile: './en.json',
        outputDir: './',
      };

      expect(source.name).toBeUndefined();
    });
  });

  describe('TranslationResult', () => {
    it('should define successful translation result', () => {
      const result: TranslationResult = {
        language: 'es',
        translations: { HELLO: 'Hola' },
        success: true,
      };

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should define failed translation result', () => {
      const result: TranslationResult = {
        language: 'es',
        translations: {},
        success: false,
        error: 'Translation failed',
      };

      expect(result.success).toBe(false);
      expect(result.error).toBe('Translation failed');
    });

    it('should include source name when provided', () => {
      const result: TranslationResult = {
        language: 'es',
        translations: { HELLO: 'Hola' },
        success: true,
        sourceName: 'Core Module',
      };

      expect(result.sourceName).toBe('Core Module');
    });
  });
});
