const { getResponse, truncateDatabase } = require('../setup');
const { generateToken } = require('../../app/services/jwt');
const userFactory = require('../factory/users');
const serverFactory = require('../factory/servers');

const updateProfileBaseUrl = username => `/users/${username}`;
const viewProfileBaseUrl = '/users';
const validApiKey = 'API-KEY';
const registeredServerData = { name: 'chotuve app server', apiKey: validApiKey };

const authHeader = {
  authorization: 'aToken'
};

describe('PUT /users/me to update profile', () => {
  const updatedUserData = {
    first_name: 'MyNewFirstName',
    last_name: 'MyNewLastName',
    email: 'newEmail@test.com',
    birthdate: '1995-07-22',
    profile_img_url: 'www.some-image.test'
  };
  describe('Missing or invalid params', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl('someUsername'),
        body: updatedUserData,
        header: { x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if first name is missing', () => {
      const currentUpdateUserData = { ...updatedUserData };
      delete currentUpdateUserData.first_name;
      return getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl('someUsername'),
        body: currentUpdateUserData,
        header: { ...authHeader, x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('first_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if last name is missing', () => {
      const currentUpdateUserData = { ...updatedUserData };
      delete currentUpdateUserData.last_name;
      return getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl('someUsername'),
        body: currentUpdateUserData,
        header: { ...authHeader, x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('last_name');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if email is missing', () => {
      const currentUpdateUserData = { ...updatedUserData };
      delete currentUpdateUserData.email;
      return getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl('someUsername'),
        body: currentUpdateUserData,
        header: { ...authHeader, x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if birthdate is missing', () => {
      const currentUpdateUserData = { ...updatedUserData };
      delete currentUpdateUserData.birthdate;
      return getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl('someUsername'),
        body: currentUpdateUserData,
        header: { ...authHeader, x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      });
    });
    it('Should be status 400 if all the body is missing', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl('someUsername'),
        header: { ...authHeader, x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(4);
        expect(res.body.internal_code).toBe('invalid_params');
      }));
    it('Should be status 400 if email is invalid', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl('someUsername'),
        body: { ...updatedUserData, email: 'notanemail.com' },
        header: { ...authHeader, x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('email');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 400 if birthdate is invalid', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl('someUsername'),
        body: { ...updatedUserData, birthdate: '4/6/95' },
        header: { ...authHeader, x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('birthdate');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Valid or invalid operations', () => {
    const userData = {
      firstName: 'fn',
      lastName: 'ln',
      birthdate: '2020-03-09',
      userName: 'un',
      email: 'test@test.test'
    };
    const userData2 = {
      firstName: 'fn2',
      lastName: 'ln2',
      birthdate: '1999-05-22',
      userName: 'un2',
      email: 'test2@test.test'
    };
    const validToken = generateToken({ data: userData.userName, privilege: false });
    beforeEach(() =>
      truncateDatabase()
        .then(() => userFactory.create({ ...userData, password: '123456' }))
        .then(() => userFactory.create({ ...userData2, password: '123456' }))
        .then(() => serverFactory.create(registeredServerData))
    );
    it('Should be status 200 if update was successful', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl(userData.userName),
        body: updatedUserData,
        header: { authorization: validToken, x_api_key: validApiKey }
      })
        .then(res => {
          expect(res.status).toBe(200);
        })
        .then(() =>
          getResponse({
            endpoint: `${viewProfileBaseUrl}/${userData.userName}`,
            method: 'get',
            header: { authorization: validToken, x_api_key: validApiKey }
          }).then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toStrictEqual({
              first_name: updatedUserData.first_name,
              last_name: updatedUserData.last_name,
              profile_img_url: updatedUserData.profile_img_url,
              birthdate: updatedUserData.birthdate,
              email: updatedUserData.email,
              user_name: userData.userName
            });
          })
        ));
    it('Should be status 400 if token email is already in use by another user', () =>
      getResponse({
        method: 'put',
        endpoint: updateProfileBaseUrl(userData.userName),
        body: { ...updatedUserData, email: 'test2@test.test' },
        header: { authorization: validToken, x_api_key: validApiKey }
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.internal_code).toBe('user_email_already_exists');
      }));
  });
});
