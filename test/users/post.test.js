const { getResponse, truncateDatabase } = require('../setup');
const userFactory = require('../factory/users');

const baseUrl = '/users';

const userData = {
  first_name: 'fn',
  last_name: 'ln',
  email: 'prueba@prueba.prueba',
  password: 'pass',
  user_name: 'un',
  birthdate: '2020-05-03'
};

const userDataMissingParam = {
  last_name: 'ln',
  email: 'prueba@prueba.prueba',
  password: 'pass',
  user_name: 'un',
  birthdate: '2020-05-03'
};

describe('POST /users', () => {
  describe('Missing and invalid parameters', () => {
    describe('Missing one parameter', () => {
      it('Check status code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: userDataMissingParam }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: userDataMissingParam }).then(res => {
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Missing multiple parameters', () => {
      it('Check status code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { last_name: 'ln' } }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { last_name: 'ln' } }).then(res => {
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Invalid date', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, birthdate: 'invalid birthdate' }
        }).then(res => {
          expect(res.status).toBe(400);
        }));
      it('Check internal code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, birthdate: 'invalid birthdate' }
        }).then(res => {
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Invalid email', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, email: 'invalid email' }
        }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, email: 'invalid email' }
        }).then(res => {
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });

    describe('Invalid user_name', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, user_name: 5 }
        }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, user_name: 5 }
        }).then(res => {
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });
  });

  describe('User created', () => {
    it('Correct creation, check status code', () =>
      getResponse({ method: 'post', endpoint: baseUrl, body: userData }).then(res => {
        expect(res.status).toBe(201);
      }));
  });

  describe('User already exists', () => {
    let user = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => userFactory.create({ email: 'test@test.test' }))
        .then(createdUser => (user = createdUser))
    );

    describe('Create user with repeated email', () => {
      it('Check status code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { ...userData, email: user.email } }).then(
          res => {
            expect(res.status).toBe(400);
          }
        ));

      it('Check internal code', () =>
        getResponse({ method: 'post', endpoint: baseUrl, body: { ...userData, email: user.email } }).then(
          res => {
            expect(res.body.internal_code).toBe('user_email_already_exists');
          }
        ));
    });

    describe('Create user with repeated username', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, user_name: user.userName }
        }).then(res => {
          expect(res.status).toBe(400);
        }));

      it('Check internal code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, user_name: user.userName }
        }).then(res => {
          expect(res.body.internal_code).toBe('user_name_already_exists');
        }));
    });
  });
});
