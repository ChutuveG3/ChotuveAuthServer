const { getResponse, truncateDatabase } = require('../setup');
const { generateTokenFromUsername } = require('../../app/services/jwt');
const userFactory = require('../factory/users');

describe('GET /users/me', () => {
  const baseUrl = '/users/me';
  const validToken = generateTokenFromUsername({ username: 'un' });

  describe('Missing parameters', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({ endpoint: baseUrl, method: 'get' }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Invalid token', () => {
    it('Check status code and internal code', () =>
      getResponse({ endpoint: baseUrl, method: 'get', header: { authorization: 'pepe' } }).then(res => {
        expect(res.status).toBe(401);
        expect(res.body.internal_code).toBe('invalid_token_error');
      }));
  });
  describe('User does not exist', () => {
    beforeEach(() => truncateDatabase);
    it('Check status code and internal code', () =>
      getResponse({ endpoint: baseUrl, method: 'get', header: { authorization: validToken } }).then(res => {
        expect(res.status).toBe(409);
        expect(res.body.internal_code).toBe('user_not_exists');
      }));
  });
  describe('Get user correctly', () => {
    const userData = {
      firstName: 'fn',
      lastName: 'ln',
      birthdate: '2020-03-09',
      userName: 'un',
      email: 'test@test.test'
    };
    beforeEach(() => truncateDatabase().then(() => userFactory.create({ ...userData, password: '123456' })));

    it('Check status code and user data', () =>
      getResponse({ endpoint: baseUrl, method: 'get', header: { authorization: validToken } }).then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({
          first_name: userData.firstName,
          last_name: userData.lastName,
          birthdate: userData.birthdate,
          user_name: userData.userName,
          email: userData.email
        });
      }));
  });
});
describe('GET /users for admins', () => {
  const baseUrl = '/users';
  describe('Missing or invalid params', () => {
    it('Should be status 400 if token is missing in headers', () =>
      getResponse({ endpoint: baseUrl, method: 'get' }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    it('Should be status 401 if token is invalid', () =>
      getResponse({ endpoint: baseUrl, method: 'get', header: { authorization: 'notAToken' } }).then(res => {
        expect(res.status).toBe(401);
        expect(res.body.internal_code).toBe('invalid_token_error');
      }));
  });
  describe('Success cases', () => {
    const validToken = generateTokenFromUsername({ username: 'admin1' });
    it('Should be status 200 if token is present and valid', () =>
      getResponse({ endpoint: baseUrl, method: 'get', header: { authorization: validToken } }).then(res => {
        expect(res.status).toBe(200);
      }));
  });
});
