import { LingvaService } from '../src/lingva-service';

describe('LingvaService', () => {
  let service: LingvaService;

  beforeEach(() => {
    service = new LingvaService();
  });

  describe('Placeholder Preservation', () => {
    it('should extract and restore Angular-style placeholders {{var}}', () => {
      const text = 'Hello {{name}}!';
      const extracted = (service as any).extractPlaceholders(text);
      expect(typeof extracted.text).toBe('string');
      expect(extracted.placeholders.size).toBe(1);
      // Ensure token is present
      expect(extracted.text).toMatch(/__PLCH0__/);
      const restored = (service as any).restorePlaceholders(
        extracted.text,
        extracted.placeholders,
      );
      expect(restored).toBe(text);
    });

    it('should extract and restore ICU MessageFormat placeholders {var}', () => {
      const text = 'You have {count} messages';
      const extracted = (service as any).extractPlaceholders(text);
      expect(extracted.placeholders.size).toBe(1);
      const restored = (service as any).restorePlaceholders(
        extracted.text,
        extracted.placeholders,
      );
      expect(restored).toBe(text);
    });

    it('should extract and restore multiple placeholder formats', () => {
      const text =
        'Hello {{name}}, you have {count} items worth $amount$ and %code%';
      const extracted = (service as any).extractPlaceholders(text);
      expect(extracted.placeholders.size).toBeGreaterThanOrEqual(3);
      const restored = (service as any).restorePlaceholders(
        extracted.text,
        extracted.placeholders,
      );
      expect(restored).toBe(text);
    });
  });

  describe('Translation Object Handling', () => {
    it('should translate nested translation objects and preserve non-strings', async () => {
      // Mock the instance translate method to avoid network and delays
      const translateSpy = jest
        .spyOn(service as any, 'translate')
        .mockImplementation(async (...args: any[]) => {
          const text = args[0] as string;
          return `ES:${text}`;
        });
      // Stub sleep to avoid waiting DELAY_MS
      (service as any).sleep = jest.fn().mockResolvedValue(undefined);

      const obj = {
        WELCOME: {
          TITLE: 'Welcome',
          SUBTITLE: 'Hello World',
        },
        COUNT: 5,
        ITEMS: ['Item 1', 'Item 2'],
      };

      const translated = await service.translateObject(obj, 'en', 'es');
      expect(translated.WELCOME.TITLE).toBe('ES:Welcome');
      expect(translated.WELCOME.SUBTITLE).toBe('ES:Hello World');
      // Non-string and arrays should remain unchanged
      expect(translated.COUNT).toBe(5);
      expect(translated.ITEMS).toEqual(['Item 1', 'Item 2']);

      translateSpy.mockRestore();
    });
  });

  describe('Custom Interpolation Patterns', () => {
    it('should support custom interpolation patterns', () => {
      const customService = new LingvaService(
        'https://lingva.ml/api/v1',
        true,
        '\\[\\[[^\\]]+\\]\\]', // Match [[var]]
      );
      // Test extraction/restoration using the custom pattern
      const text = 'Hello [[name]]!';
      const extracted = (customService as any).extractPlaceholders(text);
      expect(extracted.placeholders.size).toBe(1);
      const restored = (customService as any).restorePlaceholders(
        extracted.text,
        extracted.placeholders,
      );
      expect(restored).toBe(text);
    });
  });

  describe('API Instance Configuration', () => {
    it('should use default Lingva instance', () => {
      // Verify axios is called with default base URL when translating
      const axios = require('axios');
      const getSpy = jest
        .spyOn(axios, 'get')
        .mockResolvedValue({ data: { translation: 'Hola' } });
      const defaultService = new LingvaService(
        undefined,
        true,
        undefined,
        false,
      ); // disable cache for test
      return defaultService.translate('Hello', 'en', 'es').then((result) => {
        expect(result).toBe('Hola');
        expect(getSpy).toHaveBeenCalled();
        const calledUrl = getSpy.mock.calls[0][0] as string;
        expect(
          calledUrl.startsWith('https://lingva.ml/api/v1/en/es/'),
        ).toBeTruthy();
        getSpy.mockRestore();
      });
    });

    it('should accept custom Lingva instance URL', () => {
      const axios = require('axios');
      const getSpy = jest
        .spyOn(axios, 'get')
        .mockResolvedValue({ data: { translation: 'Bonjour' } });
      const customService = new LingvaService(
        'https://custom-lingva.com/api/v1',
        true,
        undefined,
        false,
      );
      return customService.translate('Hello', 'en', 'fr').then((result) => {
        expect(result).toBe('Bonjour');
        const calledUrl = getSpy.mock.calls[0][0] as string;
        expect(
          calledUrl.startsWith('https://custom-lingva.com/api/v1/en/fr/'),
        ).toBeTruthy();
        getSpy.mockRestore();
      });
    });
  });
});
