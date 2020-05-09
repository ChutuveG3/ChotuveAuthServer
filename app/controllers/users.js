const { info } = require('../logger');
const { createUser } = require('../services/users');
const { createUserMapper } = require('../mappers/users');
const { encryptPassword } = require('../services/bcrypt');

exports.signup = ({ body }, res, next) => {
  info(`Creating user with info: ${body}`);
  const userData = createUserMapper(body);
  return encryptPassword(userData.password)
    .then(password => createUser({ ...userData, password }))
    .then(() => {
      res.status(201).end();
    })
    .catch(err => next(err));
};
