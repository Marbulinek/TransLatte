import { Translator } from '../src/translator';
import { TranslatteConfig } from '../src/types';
import * as fs from 'fs';
import * as path from 'path';

describe('Translator (async and legacy methods)', () => {
  const testDir = path.join(__dirname, 'test-translations-async');
  const inputFile = path.join(testDir, 'en.json');
  const outputDir = path.join(testDir, 'out');

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(inputFile, JSON.stringify({ HELLO: 'Hello' }));
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('translateSourceToLanguage returns success result', async () => {
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es'],
      inputFile,
      outputDir,
    };
    const translator = new Translator(config);
    // Mock lingvaService.translateObject to avoid real API call
    (translator as any).lingvaService.translateObject = jest.fn().mockResolvedValue({ HELLO: 'Hola' });
    (translator as any).saveTranslation = jest.fn();
    const result = await translator.translateSourceToLanguage({ inputFile, outputDir, name: 'Test' }, 'es');
    expect(result.success).toBe(true);
    expect(result.language).toBe('es');
    expect(result.translations).toEqual({ HELLO: 'Hola' });
    expect(result.sourceName).toBe('Test');
  });

  it('translateSourceToLanguage returns error result on failure', async () => {
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es'],
      inputFile,
      outputDir,
    };
    const translator = new Translator(config);
    (translator as any).loadSourceFile = jest.fn(() => { throw new Error('fail'); });
    const result = await translator.translateSourceToLanguage({ inputFile, outputDir, name: 'Test' }, 'es');
    expect(result.success).toBe(false);
    expect(result.error).toBe('fail');
  });

  it('translateAll flushes cache and returns summary', async () => {
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es', 'fr'],
      inputFile,
      outputDir,
    };
    const translator = new Translator(config);
    (translator as any).getSources = jest.fn(() => [{ inputFile, outputDir, name: 'Test' }]);
    (translator as any).translateSource = jest.fn(() => Promise.resolve([
      { language: 'es', translations: {}, success: true },
      { language: 'fr', translations: {}, success: false, error: 'fail' },
    ]));
    (translator as any).lingvaService.flushCache = jest.fn();
    (translator as any).lingvaService.getCacheStats = jest.fn(() => ({ size: 1, enabled: true }));
    const summary = await translator.translateAll();
    expect(summary.successCount).toBe(1);
    expect(summary.failCount).toBe(1);
    expect(summary.cacheSize).toBe(1);
    expect(summary.results.length).toBe(2);
  });

  it('translateToLanguage returns success and error results', async () => {
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es'],
      inputFile,
      outputDir,
    };
    const translator = new Translator(config);
    (translator as any).getSources = jest.fn(() => [{ inputFile, outputDir, name: 'Test' }]);
    (translator as any).lingvaService.translateObject = jest.fn().mockResolvedValue({ HELLO: 'Hola' });
    (translator as any).saveTranslation = jest.fn();
    const result = await translator.translateToLanguage({ HELLO: 'Hello' }, 'es');
    expect(result.success).toBe(true);
    (translator as any).lingvaService.translateObject = jest.fn(() => { throw new Error('fail'); });
    const failResult = await translator.translateToLanguage({ HELLO: 'Hello' }, 'es');
    expect(failResult.success).toBe(false);
    expect(failResult.error).toBe('fail');
  });
});
