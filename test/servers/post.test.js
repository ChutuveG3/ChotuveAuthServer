const { getResponse, truncateDatabase } = require('../setup');
const serverFactory = require('../factory/servers');
const { generateToken } = require('../../app/services/jwt');

const baseUrl = '/servers';

describe('POST /servers', () => {
  const serverData1 = { server: 'chotuve app server' };
  const serverData2 = { server: 'chomail app server' };
  const userToken = generateToken({ data: 'un', privilege: false });
  const adminToken = generateToken({ data: 'aun', privilege: true });
  describe('Missing and invalid parameters', () => {
    it('Should set status code to 400 and internal code to invalid_params if missing authorization token', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: serverData1 }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    it('Should set status code to 400 and internal code to invalid_params if missing server', () =>
      getResponse({ method: 'post', endpoint: baseUrl, header: { authorization: adminToken } }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('server');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    it('Should set status code to 403 and internal code to unauthorized if no privileges', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: serverData1,
        header: { authorization: userToken }
      }).then(res => {
        expect(res.status).toBe(403);
        expect(res.body.internal_code).toBe('unauthorized');
      }));
  });
  describe('Valid or invalid operations', () => {
    beforeEach(() =>
      truncateDatabase().then(() => serverFactory.create({ ...serverData2, apiKey: '123456' }))
    );
    it('Should be status code 201 if server entry is successfully created', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: serverData1,
        header: { authorization: adminToken }
      }).then(res => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('api_key');
      }));
    it('Should be status code 409 if server entry is already in the database', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: serverData2,
        header: { authorization: adminToken }
      }).then(res => {
        expect(res.status).toBe(409);
      }));
  });
});
