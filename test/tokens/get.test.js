const { getResponse, truncateDatabase } = require('../setup');
const userFactory = require('../factory/users');
const serverFactory = require('../factory/servers');
const { encryptPassword } = require('../../app/services/bcrypt');

const sessionsUrl = '/users/sessions';
const validateTokenUrl = '/connect/access_token_validation';
const validApiKey = 'API-KEY';
const registeredServerData = { name: 'chotuve app server', apiKey: validApiKey };

describe('GET /connect/access_token_validation', () => {
  describe('Token validation', () => {
    let user = {};
    beforeEach(() =>
      truncateDatabase()
        .then(() => encryptPassword('123456'))
        .then(encriptedPassword => userFactory.create({ userName: 'testUN', password: encriptedPassword }))
        .then(createdUser => (user = createdUser))
        .then(() => serverFactory.create(registeredServerData))
    );
    it('Should be status 200 if token was just created', () =>
      getResponse({
        endpoint: sessionsUrl,
        method: 'post',
        body: { username: user.userName, password: '123456' },
        header: { x_api_key: validApiKey }
      }).then(response => {
        getResponse({
          endpoint: validateTokenUrl,
          method: 'get',
          header: { authorization: response.body.token }
        }).then(res => {
          expect(res.status).toBe(200);
        });
      }));

    it('Should be status 400 if no token is present in the header', () =>
      getResponse({
        endpoint: validateTokenUrl,
        method: 'get'
      }).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.message.errors).toHaveLength(1);
        expect(res.body.message.errors[0].param).toBe('authorization');
        expect(res.body.internal_code).toBe('invalid_params');
      }));

    it('Should be status 401 if token is present but is not valid', () =>
      getResponse({
        endpoint: validateTokenUrl,
        method: 'get',
        header: { authorization: 'ATokenSimilarToAnActualTokenButFake' }
      }).then(res => {
        expect(res.status).toBe(401);
        expect(res.body.internal_code).toBe('invalid_token_error');
      }));
  });
});
