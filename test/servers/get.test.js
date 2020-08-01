const cryptoRandomString = require('crypto-random-string');
const { getResponse, truncateDatabase } = require('../setup');
const serverFactory = require('../factory/servers');
const { generateToken } = require('../../app/services/jwt');

const apiKeyValidationBaseUrl = '/connect/api_key_validation';
const getServersBaseUrl = '/servers';
const validApiKey = cryptoRandomString({ length: 64, type: 'base64' });
const registeredServerData = { name: 'chotuve app server', apiKey: validApiKey };

describe('GET /connect/api_key_validation', () => {
  beforeEach(() => truncateDatabase().then(() => serverFactory.create(registeredServerData)));
  describe('Missing and invalid parameters', () => {
    it('Should set status code to 400 and internal code to invalid_params if missing api key', () =>
      getResponse({ method: 'get', endpoint: apiKeyValidationBaseUrl }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('x_api_key');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Valid or invalid operations', () => {
    it('Should set status code to 200 if api key is registered', () =>
      getResponse({
        method: 'get',
        endpoint: apiKeyValidationBaseUrl,
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(200);
      }));
    it('Should set status code to 401 if api key is not registered', () =>
      getResponse({
        method: 'get',
        endpoint: apiKeyValidationBaseUrl,
        header: { x_api_key: 'not registered' }
      }).then(res => {
        expect(res.status).toBe(401);
      }));
  });
});
describe('GET /servers', () => {
  describe('Missing and invalid parameters', () => {
    it('Should set status code to 400 and internal code to invalid_params if missing token', () =>
      getResponse({ method: 'get', endpoint: getServersBaseUrl }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    describe('Valid or invalid operations', () => {
      const userToken = generateToken({ data: 'un', privilege: false });
      const adminToken = generateToken({ data: 'ad@min.com', privilege: true });
      beforeEach(() => truncateDatabase().then(() => serverFactory.create(registeredServerData)));
      it('Should set status code to 403 if token has no privileges', () =>
        getResponse({
          method: 'get',
          endpoint: getServersBaseUrl,
          header: { authorization: userToken }
        }).then(res => {
          expect(res.status).toBe(403);
        }));
      it('Should set status code to 200 and return all servers', () =>
        getResponse({
          method: 'get',
          endpoint: getServersBaseUrl,
          header: { authorization: adminToken }
        }).then(res => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('servers');
          expect(res.body.servers[0]).toHaveProperty('name', 'chotuve app server');
          expect(res.body.servers[0]).toHaveProperty('created_at');
          expect(res.body.servers[0]).toHaveProperty('api_key', validApiKey);
        }));
    });
  });
});
