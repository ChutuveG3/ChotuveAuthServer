const { getResponse, truncateDatabase } = require('../setup');
const { generateToken } = require('../../app/services/jwt');
const userFactory = require('../factory/users');

describe('GET /users/:username', () => {
  const baseUrl = '/users';
  const username = 'un';
  const validToken = generateToken({ data: username, privilege: false });

  describe('Missing parameters', () => {
    it('Should be status 400 if auth token header is missing', () =>
      getResponse({ endpoint: `${baseUrl}/${username}`, method: 'get' }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));
  });
  describe('Invalid token', () => {
    it('Check status code and internal code', () =>
      getResponse({
        endpoint: `${baseUrl}/${username}`,
        method: 'get',
        header: { authorization: 'pepe' }
      }).then(res => {
        expect(res.status).toBe(401);
        expect(res.body.internal_code).toBe('invalid_token_error');
      }));
  });
  describe('User does not exist', () => {
    beforeEach(() => truncateDatabase);
    it('Check status code and internal code', () =>
      getResponse({
        endpoint: `${baseUrl}/${username}`,
        method: 'get',
        header: { authorization: validToken }
      }).then(res => {
        expect(res.status).toBe(409);
        expect(res.body.internal_code).toBe('user_not_exists');
      }));
  });
  describe('Get user correctly', () => {
    const userData1 = {
      firstName: 'fn1',
      lastName: 'ln1',
      birthdate: '2020-03-09',
      userName: 'un1',
      email: 'test1@test.test',
      profileImgUrl: 'www.some-image1.test'
    };
    const userData2 = {
      firstName: 'fn2',
      lastName: 'ln2',
      birthdate: '1999-06-22',
      userName: 'un2',
      email: 'test2@test.test',
      profileImgUrl: 'www.some-image2.test'
    };
    beforeEach(() =>
      truncateDatabase()
        .then(() => userFactory.create({ ...userData1, password: '123456' }))
        .then(() => userFactory.create({ ...userData2, password: '123456' }))
    );

    it('Check status code and own user data', () =>
      getResponse({
        endpoint: `${baseUrl}/${userData1.userName}`,
        method: 'get',
        header: { authorization: validToken }
      }).then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({
          first_name: userData1.firstName,
          last_name: userData1.lastName,
          profile_img_url: userData1.profileImgUrl,
          birthdate: userData1.birthdate,
          user_name: userData1.userName,
          email: userData1.email
        });
      }));
    it('Check status code and another user`s data', () =>
      getResponse({
        endpoint: `${baseUrl}/${userData2.userName}`,
        method: 'get',
        header: { authorization: validToken }
      }).then(res => {
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({
          first_name: userData2.firstName,
          last_name: userData2.lastName,
          profile_img_url: userData2.profileImgUrl,
          birthdate: userData2.birthdate,
          user_name: userData2.userName,
          email: userData2.email
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
    const validToken = generateToken({ data: 'admin1', privilege: true });
    const userData1 = {
      firstName: 'fn1',
      lastName: 'ln1',
      birthdate: '2020-03-09',
      userName: 'un1',
      email: 'test1@test.test',
      profileImgUrl: 'www.some-image1.test'
    };
    const userData2 = {
      firstName: 'fn2',
      lastName: 'ln2',
      birthdate: '1999-05-22',
      userName: 'un2',
      email: 'test2@test.test',
      profileImgUrl: 'www.some-image2.test'
    };
    beforeEach(() =>
      truncateDatabase()
        .then(() => userFactory.create({ ...userData1, password: '123456' }))
        .then(() => userFactory.create({ ...userData2, password: '123456' }))
    );
    it('Should be status 200 and have user data in response', () =>
      getResponse({ endpoint: baseUrl, method: 'get', header: { authorization: validToken } }).then(res => {
        expect(res.status).toBe(200);
        expect(res.body[0]).toStrictEqual({
          first_name: userData1.firstName,
          last_name: userData1.lastName,
          profile_img_url: userData1.profileImgUrl,
          birthdate: userData1.birthdate,
          email: userData1.email,
          user_name: userData1.userName
        });
        expect(res.body[1]).toStrictEqual({
          first_name: userData2.firstName,
          last_name: userData2.lastName,
          profile_img_url: userData2.profileImgUrl,
          birthdate: userData2.birthdate,
          email: userData2.email,
          user_name: userData2.userName
        });
      }));
  });
});
