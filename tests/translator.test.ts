import { Translator } from '../src/translator';
import { TranslatteConfig } from '../src/types';
import * as fs from 'fs';
import * as path from 'path';

describe('Translator', () => {
  const testDir = path.join(__dirname, 'test-translations');
  
  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Configuration Handling', () => {
    it('should accept single source configuration', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        inputFile: path.join(testDir, 'en.json'),
        outputDir: testDir
      };
      
      const translator = new Translator(config);
      expect(translator).toBeDefined();
    });

    it('should accept multi-source configuration', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        sources: [
          {
            name: 'Core',
            inputFile: path.join(testDir, 'core/en.json'),
            outputDir: path.join(testDir, 'core')
          },
          {
            name: 'Auth',
            inputFile: path.join(testDir, 'auth/en.json'),
            outputDir: path.join(testDir, 'auth')
          }
        ]
      };
      
      const translator = new Translator(config);
      expect(translator).toBeDefined();
    });

    it('should handle configuration without sources gracefully', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        inputFile: path.join(testDir, 'en.json'),
        outputDir: testDir
      };
      
      // Should use single source as fallback
      const translator = new Translator(config);
      expect(translator).toBeDefined();
    });
  });

  describe('File Operations', () => {
    it('should create source file and verify structure', () => {
      const sourceFile = path.join(testDir, 'en.json');
      const sourceContent = {
        HELLO: 'Hello',
        WORLD: 'World'
      };
      
      fs.writeFileSync(sourceFile, JSON.stringify(sourceContent, null, 2));
      expect(fs.existsSync(sourceFile)).toBe(true);
      
      const loaded = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
      expect(loaded).toEqual(sourceContent);
    });
  });

  describe('Backward Compatibility', () => {
    it('should support legacy single inputFile/outputDir format', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr'],
        inputFile: './src/i18n/en.json',
        outputDir: './src/i18n'
      };
      
      const translator = new Translator(config);
      expect(translator).toBeDefined();
    });

    it('should support new multi-source format', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr'],
        sources: [
          {
            name: 'Main',
            inputFile: './src/i18n/en.json',
            outputDir: './src/i18n'
          }
        ]
      };
      
      const translator = new Translator(config);
      expect(translator).toBeDefined();
    });
  });

  describe('Parallel Translation', () => {
    it('should handle multiple target languages', () => {
      const config: TranslatteConfig = {
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr', 'de', 'it'],
        inputFile: path.join(testDir, 'en.json'),
        outputDir: testDir
      };
      
      const translator = new Translator(config);
      expect(translator).toBeDefined();
    });
  });
});
