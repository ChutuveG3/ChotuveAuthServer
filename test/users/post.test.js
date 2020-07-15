/* eslint-disable max-lines */
const { getResponse, truncateDatabase } = require('../setup');
const userFactory = require('../factory/users');
const serverFactory = require('../factory/servers');
const { encryptPassword } = require('../../app/services/bcrypt');

const baseUrl = '/users';
const sessionsUrl = '/users/sessions';
const validApiKey = 'API-KEY';
const registeredServerData = { name: 'chotuve app server', apiKey: validApiKey };

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
    it('Should be status 400 if first_name is missing', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: userDataMissingParam,
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('first_name');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if birthdate is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...userData, birthdate: 'invalid birthdate' },
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if email is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...userData, email: 'invalid email' },
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if username is invalid', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: { ...userData, user_name: 5 },
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('user_name');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    describe('Invalid password: Length less than 6 charcaters', () => {
      it('Check status code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, password: 'aaaa' },
          header: { x_api_key: validApiKey }
        }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.message.errors).toHaveLength(1);
          expect(res.body.message.errors[0].param).toBe('password');
          expect(res.body.internal_code).toBe('invalid_params');
        }));
    });
  });

  describe('User created', () => {
    beforeEach(() => truncateDatabase().then(() => serverFactory.create(registeredServerData)));
    it('Correct creation, check status code', () =>
      getResponse({
        method: 'post',
        endpoint: baseUrl,
        body: userData,
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(201);
      }));
  });

  describe('User already exists', () => {
    let user = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => serverFactory.create(registeredServerData))
        .then(() => userFactory.create({ email: 'test@test.test' }))
        .then(createdUser => (user = createdUser))
    );

    describe('Create user with repeated email', () => {
      it('Check status code and internal code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, email: user.email },
          header: { x_api_key: validApiKey }
        }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.internal_code).toBe('user_email_already_exists');
        }));
    });

    describe('Create user with repeated username', () => {
      it('Check status code and internal code', () =>
        getResponse({
          method: 'post',
          endpoint: baseUrl,
          body: { ...userData, user_name: user.userName },
          header: { x_api_key: validApiKey }
        }).then(res => {
          expect(res.status).toBe(400);
          expect(res.body.internal_code).toBe('user_name_already_exists');
        }));
    });
  });
});

describe('POST /users/sessions', () => {
  const userData = {
    username: 'MyUN',
    password: 'MyPassword'
  };

  describe('Missing parameters', () => {
    it('Should be status 400 if username is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.username;
      return getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: currentUserData,
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('username');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if password is missing', () => {
      const currentUserData = { ...userData };
      delete currentUserData.password;
      return getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: currentUserData,
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(2);
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });

    it('Should be status 400 if both username and password are missing', () =>
      getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: {},
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(3);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Invalid parameters', () => {
    it('Should be status 400 if password is shorter than 6 characters', () =>
      getResponse({
        method: 'post',
        endpoint: sessionsUrl,
        body: { ...userData, password: '1234' },
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('password');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('User does not exist', () => {
    beforeEach(() => truncateDatabase().then(() => serverFactory.create(registeredServerData)));
    it('Check status code and internal code', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: userData,
        header: { x_api_key: validApiKey }
      }).then(response => {
        expect(response.status).toBe(409);
        expect(response.body.internal_code).toBe('user_not_exists');
      }));
  });
  describe('User exists, password mismatch', () => {
    let user = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => serverFactory.create(registeredServerData))
        .then(() => userFactory.create({ userName: 'testUN', password: '123456' }))
        .then(createdUser => (user = createdUser))
    );

    it('Check status code and internal code', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { username: user.userName, password: `${user.password}a` },
        header: { x_api_key: validApiKey }
      }).then(response => {
        expect(response.status).toBe(409);
        expect(response.body.internal_code).toBe('password_mismatch');
      }));
  });
  describe('User exists, password match', () => {
    let user = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => serverFactory.create(registeredServerData))
        .then(() => encryptPassword('123456'))
        .then(encriptedPassword => userFactory.create({ userName: 'testUN', password: encriptedPassword }))
        .then(createdUser => (user = createdUser))
    );

    it('Check status code and that there is a token', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { username: user.userName, password: '123456' },
        header: { x_api_key: validApiKey }
      }).then(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
      }));
  });
});
