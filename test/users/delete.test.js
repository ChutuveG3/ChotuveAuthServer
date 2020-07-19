const { getResponse, truncateDatabase } = require('../setup');
const { generateToken } = require('../../app/services/jwt');
const userFactory = require('../factory/users');

const deleteUserBaseUrl = username => `/users/${username}`;
const getUsersBaseUrl = '/users';

describe('DELETE /users/:username', () => {
  const userData = {
    firstName: 'fn1',
    lastName: 'ln1',
    birthdate: '2020-03-09',
    userName: 'un1',
    email: 'test1@test.test',
    profileImgUrl: 'www.some-image1.test'
  };
  const adminToken = generateToken({ email: 'ad@min.com', privilege: true });
  beforeEach(() => truncateDatabase().then(() => userFactory.create({ ...userData, password: '123456' })));

  it('Should be status 409 if user does not exist', () =>
    getResponse({
      method: 'delete',
      endpoint: deleteUserBaseUrl('NotRegistered'),
      header: { authorization: adminToken }
    }).then(res => {
      expect(res.status).toBe(409);
      expect(res.body.internal_code).toBe('user_not_exists');
    }));
  it('Check status code and own user data', () =>
    getResponse({
      method: 'delete',
      endpoint: deleteUserBaseUrl(userData.userName),
      header: { authorization: adminToken }
    })
      .then(res => {
        expect(res.status).toBe(200);
      })
      .then(() =>
        getResponse({
          method: 'get',
          endpoint: getUsersBaseUrl,
          header: { authorization: adminToken }
        })
      )
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ users: [] });
      }));
});
