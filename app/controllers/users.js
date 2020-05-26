const { info } = require('../logger');
const { createUser, login, getUserFromEmail } = require('../services/users');
const { createUserMapper } = require('../mappers/users');
const { encryptPassword } = require('../services/bcrypt');
const { getCurrentUserSerializer } = require('../serializers/users');

exports.signup = ({ body }, res, next) => {
  info(`Creating user with email: ${body.email}`);
  const userData = createUserMapper(body);
  return encryptPassword(userData.password)
    .then(password => createUser({ ...userData, password }))
    .then(() => {
      res.status(201).end();
    })
    .catch(err => next(err));
};

exports.login = ({ body }, res, next) => {
  info(`Login user with email: ${body.email}`);
  return login(body)
    .then(token => {
      res.status(200).send({ token });
    })
    .catch(next);
};

exports.getCurrentUser = ({ email }, res, next) => {
  info(`Getting user with email: ${email}`);
  return getUserFromEmail(email)
    .then(user => res.status(200).send(getCurrentUserSerializer(user)))
    .catch(next);
};
