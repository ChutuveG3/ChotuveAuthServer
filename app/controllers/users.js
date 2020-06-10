const { info } = require('../logger');
const { createUser, login, getUserFromUsername, updateProfile } = require('../services/users');
const { createUserMapper } = require('../mappers/users');
const { encryptPassword } = require('../services/bcrypt');
const { getCurrentUserSerializer } = require('../serializers/users');

exports.signUp = ({ body }, res, next) => {
  info(`Creating user with email: ${body.email}`);
  const userData = createUserMapper(body);
  return encryptPassword(userData.password)
    .then(password => createUser({ ...userData, password }))
    .then(() => res.status(201).end())
    .catch(next);
};

exports.login = ({ body }, res, next) => {
  info(`Login user with email: ${body.email}`);
  return login(body)
    .then(token => res.status(200).send({ token }))
    .catch(next);
};

exports.viewProfile = ({ params: { username } }, res, next) => {
  info(`Viewing profile for user with username: ${username}`);
  return exports.getUser({ username }, res, next);
};

exports.getUser = ({ username }, res, next) => {
  info(`Getting user data for user with username: ${username}`);
  return getUserFromUsername(username)
    .then(user => res.status(200).send(getCurrentUserSerializer(user)))
    .catch(next);
};

exports.updateProfile = (req, res, next) => {
  const userData = createUserMapper(req.body);
  info(`Updating profile for user: ${req.username}`);
  return getUserFromUsername(req.username)
    .then(currentUser => updateProfile(currentUser, userData))
    .then(() => res.status(200).end())
    .catch(next);
};
