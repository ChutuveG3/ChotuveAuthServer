const { getResponse } = require('../setup');

const baseUrl = '/users';

const userData = {
  first_name: 'fn',
  last_name: 'ln',
  email: 'prueba@prueba.prueba',
  password: 'pass',
  user_name: 'un',
  birthdate: '20200301T000000Z'
};

const userDataMissingParam = {
  last_name: 'ln',
  email: 'prueba@prueba.prueba',
  password: 'pass',
  user_name: 'un',
  birthdate: '20200301T000000Z'
};

describe('POST /users', () => {
  describe('Missing parameters', () => {
    it('Missing one parameter, check status code', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: userDataMissingParam }).then(res => {
        expect(res.status).toBe(400);
      }));

    it('Missing multiple parameters, check status code', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: { last_name: 'ln' } }).then(res => {
        expect(res.status).toBe(400);
      }));

    it('Invalid date, check status code', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: { ...userData, birthdate: '2020/03/01' } }).then(
        res => {
          expect(res.status).toBe(400);
        }
      ));

    it('Invalid email, check status code', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: { ...userData, email: 'invalid email' } }).then(
        res => {
          expect(res.status).toBe(400);
        }
      ));
  });
});
