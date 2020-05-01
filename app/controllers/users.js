const { info } = require('../logger');
const { createUser } = require('../services/users');
const { createUserMapper } = require('../mappers/users');

exports.signup = ({ body }, res) => {
  info(`Creating user with info: ${body}`);
  return createUser(createUserMapper(body)).then(() => {
    res.status(201).end();
  });
};
