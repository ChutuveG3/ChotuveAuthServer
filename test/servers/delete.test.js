const cryptoRandomString = require('crypto-random-string');
const { getResponse, truncateDatabase } = require('../setup');
const serverFactory = require('../factory/servers');
const { generateToken } = require('../../app/services/jwt');

const getServersBaseUrl = '/servers';
const deleteServerBaseUrl = name => `/servers/${name}`;
const validApiKey = cryptoRandomString({ length: 64, type: 'base64' });
const registeredServerData = { name: 'chotuve app server', apiKey: validApiKey };
const adminToken = generateToken({ data: 'ad@min.com', privilege: true });

describe('DELETE /servers/:name', () => {
  beforeEach(() => truncateDatabase().then(() => serverFactory.create(registeredServerData)));
  it('Should set status code to 409 if server does not exist', () =>
    getResponse({
      method: 'delete',
      endpoint: deleteServerBaseUrl('another server'),
      header: { authorization: adminToken }
    }).then(res => {
      expect(res.status).toBe(409);
      expect(res.body.internal_code).toBe('server_not_exists');
    }));
  it('Should set status code to 200 and be deleted successfully', () =>
    getResponse({
      method: 'delete',
      endpoint: deleteServerBaseUrl(registeredServerData.name),
      header: { authorization: adminToken }
    })
      .then(res => {
        expect(res.status).toBe(200);
      })
      .then(() =>
        getResponse({
          method: 'get',
          endpoint: getServersBaseUrl,
          header: { authorization: adminToken }
        }).then(res =>
          expect(res.body.servers[0]).toEqual(
            expect.not.objectContaining({ name: registeredServerData.name })
          )
        )
      ));
});
