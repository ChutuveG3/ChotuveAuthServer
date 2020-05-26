const { getResponse, truncateDatabase } = require('../setup');
const { generateTokenFromEmail } = require('../../app/services/jwt');
const userFactory = require('../factory/users');

describe('GET /users/me', () => {
  const baseurl = '/users/me';
  const validToken = generateTokenFromEmail({ email: 'test@test.test' });

  describe('Missing parameters', () => {
    test('Check status code and internal code', () =>
      getResponse({ endpoint: baseurl, method: 'get' }).then(response => {
        expect(response.status).toBe(400);
        expect(response.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Invalid token', () => {
    test('Check status code and internal code', () =>
      getResponse({ endpoint: baseurl, method: 'get', header: { authorization: 'pepe' } }).then(response => {
        expect(response.status).toBe(401);
        expect(response.body.internal_code).toBe('invalid_token_error');
      }));
  });
  describe('User does not exist', () => {
    beforeEach(() => truncateDatabase);
    test('Check status code and internal code', () =>
      getResponse({ endpoint: baseurl, method: 'get', header: { authorization: validToken } }).then(
        response => {
          expect(response.status).toBe(409);
          expect(response.body.internal_code).toBe('user_not_exists');
        }
      ));
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

    test('Check status code', () =>
      getResponse({ endpoint: baseurl, method: 'get', header: { authorization: validToken } }).then(
        response => {
          expect(response.status).toBe(200);
        }
      ));

    test('Check user data', () =>
      getResponse({ endpoint: baseurl, method: 'get', header: { authorization: validToken } }).then(
        response => {
          expect(response.body).toStrictEqual({
            first_name: userData.firstName,
            last_name: userData.lastName,
            birthdate: userData.birthdate,
            user_name: userData.userName,
            email: userData.email
          });
        }
      ));
  });
});
