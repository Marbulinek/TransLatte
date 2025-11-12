import { LingvaService } from '../src/lingva-service';

describe('LingvaService (error and edge cases)', () => {
  let service: LingvaService;
  beforeEach(() => {
    service = new LingvaService(undefined, true, undefined, false); // disable cache for test
  });

  it('should throw on invalid response from Lingva API', async () => {
    const axios = require('axios');
    jest.spyOn(axios, 'get').mockResolvedValue({ data: {} });
    await expect(service.translate('Hello', 'en', 'es')).rejects.toThrow(
      'Invalid response from Lingva API',
    );
  });

  it('should throw on axios error.response', async () => {
    const axios = require('axios');
    jest.spyOn(axios, 'get').mockRejectedValue({
      response: { status: 500, statusText: 'Server Error' },
    });
    await expect(service.translate('Hello', 'en', 'es')).rejects.toThrow(
      'Translation failed: 500 - Server Error',
    );
  });

  it('should throw on axios error.request', async () => {
    const axios = require('axios');
    jest.spyOn(axios, 'get').mockRejectedValue({ request: {} });
    await expect(service.translate('Hello', 'en', 'es')).rejects.toThrow(
      'Translation failed: No response from server',
    );
  });

  it('should throw on generic axios error', async () => {
    const axios = require('axios');
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('network down'));
    await expect(service.translate('Hello', 'en', 'es')).rejects.toThrow(
      'Translation failed: network down',
    );
  });

  it('should not extract placeholders if preserveInterpolation is false', async () => {
    const noInterpService = new LingvaService(
      undefined,
      false,
      undefined,
      false,
    );
    const axios = require('axios');
    jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { translation: 'Hola' } });
    const result = await noInterpService.translate(
      'Hello {{name}}',
      'en',
      'es',
    );
    expect(result).toBe('Hola');
  });
});
