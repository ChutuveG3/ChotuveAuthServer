const cryptoRandomString = require('crypto-random-string');
const { getResponse, truncateDatabase } = require('../setup');
const serverFactory = require('../factory/servers');

const baseUrl = '/connect/api_key_validation';

describe('GET /connect/api_key_validation', () => {
  const validApiKey = cryptoRandomString({ length: 64, type: 'base64' });
  const registeredServerData = { name: 'chotuve app server', apiKey: validApiKey };
  beforeEach(() => truncateDatabase().then(() => serverFactory.create(registeredServerData)));
  describe('Missing and invalid parameters', () => {
    it('Should set status code to 400 and internal code to invalid_params if missing api key', () =>
      getResponse({ method: 'get', endpoint: baseUrl }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('x_api_key');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Valid or invalid operations', () => {
    it('Should set status code to 200 if api key is registered', () =>
      getResponse({ method: 'get', endpoint: baseUrl, header: { x_api_key: validApiKey } }).then(res => {
        expect(res.status).toBe(200);
      }));
    it('Should set status code to 401 if api key is not registered', () =>
      getResponse({ method: 'get', endpoint: baseUrl, header: { x_api_key: 'not registered' } }).then(res => {
        expect(res.status).toBe(401);
      }));
  });
});
