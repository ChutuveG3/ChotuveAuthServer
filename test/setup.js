const request = require('supertest');

const models = require('../app/models');

const tables = Object.values(models.sequelize.models);

const truncateTable = model =>
  model.destroy({ truncate: true, cascade: true, force: true, restartIdentity: true });

exports.truncateDatabase = () => Promise.all(tables.map(truncateTable));

global.beforeEach(async () => {
  await exports.truncateDatabase();
});

exports.getResponse = ({ endpoint, header = {}, params = {}, body = {}, method = 'put' }) => {
  const app = require('../app'); // eslint-disable-line
  return request(app)
    [method](`${endpoint}`) // eslint-disable-line
    .set(header)
    .query(params)
    .send(body)
    .then(res => res);
};
