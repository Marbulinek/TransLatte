import { Translator } from '../src/translator';
import { TranslatteConfig } from '../src/types';
import * as fs from 'fs';
import * as path from 'path';

describe('Translator (parallel and delay logic)', () => {
  const testDir = path.join(__dirname, 'test-translations-parallel');
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

  it('translateSource runs all target languages in parallel (no real delay)', async () => {
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es', 'fr', 'de'],
      inputFile,
      outputDir,
    };
    const translator = new Translator(config);
    // Mock delayedTranslation to instantly resolve
    (translator as any).delayedTranslation = jest.fn((source, lang) => Promise.resolve({ language: lang, translations: {}, success: true }));
    const results = await translator.translateSource({ inputFile, outputDir, name: 'Test' });
    expect(results.length).toBe(3);
    expect(results.every(r => r.success)).toBe(true);
  });

  it('delayedTranslation waits for delay', async () => {
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es'],
      inputFile,
      outputDir,
    };
    const translator = new Translator(config);
    const start = Date.now();
    // Use real implementation
    const result = await (translator as any).delayedTranslation({ inputFile, outputDir, name: 'Test' }, 'es', 100);
    const elapsed = Date.now() - start;
    expect(result).toBeDefined();
    expect(elapsed).toBeGreaterThanOrEqual(90); // allow some timing slack
  });
});
