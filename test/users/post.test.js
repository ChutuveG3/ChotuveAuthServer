/* eslint-disable max-lines */
const { getResponse, truncateDatabase } = require('../setup');
const userFactory = require('../factory/users');
const { encryptPassword } = require('../../app/services/bcrypt');

const baseUrl = '/users';
const sessionsUrl = '/users/sessions';

describe('POST /users', () => {
  const userData = {
    first_name: 'fn',
    last_name: 'ln',
    email: 'prueba@prueba.prueba',
    password: 'pass123',
    user_name: 'un',
    birthdate: '2020-05-03'
  };

  const userDataMissingParam = {
    last_name: 'ln',
    email: 'prueba@prueba.prueba',
    password: 'pass123',
    user_name: 'un',
    birthdate: '2020-05-03'
  };

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

    describe('Invalid password: Length less than 6 charcaters', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, password: 'aaaa' }
        }).then(res => {
          expect(res.status).toBe(400);
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

describe('POST /users/sessions', () => {
  const userData = {
    email: 'test@test.com',
    password: 'MyPassword'
  };

  describe('Missing parameters', () => {
    it('Should be status 400 if email is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.email;
      return getResponse({ method: 'post', endpoint: sessionsUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if password is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.password;
      return getResponse({ method: 'post', endpoint: sessionsUrl, body: currentUserData }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if both email and password are missing', () =>
      getResponse({ method: 'post', endpoint: sessionsUrl, body: {} }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Invalid parameters', () => {
    it('Should be status 400 if email is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: { ...userData, email: 'invalid email' }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if password is shorter than 6 characters', () =>
      getResponse({ method: 'post', endpoint: sessionsUrl, body: { ...userData, password: '1234' } }).then(
        res => {
          expect(res.status).toBe(400);
          expect(res.body.internal_code).toBe('invalid_params');
        }
      ));
  });
  describe('User does not exists', () => {
    test('Check status code and internal code', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { email: 'noexiste@noexiste.noexiste', password: 'noexiste' }
      }).then(response => {
        expect(response.status).toBe(409);
        expect(response.body.internal_code).toBe('user_not_exists');
      }));
  });
  describe('User exists, password missmatch', () => {
    let user = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => userFactory.create({ email: 'test@test.test', password: '123456' }))
        .then(createdUser => (user = createdUser))
    );

    test('Check status code and internal code', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { email: user.email, password: `${user.password}a` }
      }).then(response => {
        expect(response.status).toBe(409);
        expect(response.body.internal_code).toBe('password_missmatch');
      }));
  });
  describe('User exists, password match', () => {
    let user = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => encryptPassword('123456'))
        .then(encriptedPassword =>
          userFactory.create({ email: 'test@test.test', password: encriptedPassword })
        )
        .then(createdUser => (user = createdUser))
    );

    test('Check status code', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { email: user.email, password: '123456' }
      }).then(response => {
        expect(response.status).toBe(200);
      }));

    test('Check that there is a token', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { email: user.email, password: '123456' }
      }).then(response => {
        expect(response.body).toHaveProperty('token');
      }));
  });
});
