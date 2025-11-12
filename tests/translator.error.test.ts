import { Translator } from '../src/translator';
import { TranslatteConfig } from '../src/types';
import * as fs from 'fs';
import * as path from 'path';

describe('Translator (error and edge cases)', () => {
  const testDir = path.join(__dirname, 'test-translations-error');

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should throw if no sources or inputFile/outputDir are provided', () => {
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es'],
    };
    const translator = new Translator(config);
    expect(() => (translator as any).getSources()).toThrow();
  });

  it('should throw if source file does not exist', () => {
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es'],
      inputFile: path.join(testDir, 'nonexistent.json'),
      outputDir: testDir,
    };
    const translator = new Translator(config);
    expect(() =>
      (translator as any).loadSourceFile(config.inputFile!),
    ).toThrow();
  });

  it('should throw if source file is invalid JSON', () => {
    const badFile = path.join(testDir, 'bad.json');
    fs.writeFileSync(badFile, '{not valid json');
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es'],
      inputFile: badFile,
      outputDir: testDir,
    };
    const translator = new Translator(config);
    expect(() => (translator as any).loadSourceFile(badFile)).toThrow();
  });

  it('should create output directory if it does not exist', () => {
    const config: TranslatteConfig = {
      sourceLanguage: 'en',
      targetLanguages: ['es'],
      inputFile: path.join(testDir, 'en.json'),
      outputDir: path.join(testDir, 'new-output'),
    };
    fs.writeFileSync(config.inputFile!, JSON.stringify({ HELLO: 'Hello' }));
    const translator = new Translator(config);
    (translator as any).saveTranslation(config.outputDir!, 'es', {
      HELLO: 'Hola',
    });
    expect(fs.existsSync(config.outputDir!)).toBe(true);
    expect(fs.existsSync(path.join(config.outputDir!, 'es.json'))).toBe(true);
  });
});
