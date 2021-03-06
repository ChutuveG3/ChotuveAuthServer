const { info } = require('../logger');
const {
  checkMethod,
  createUser,
  login,
  getUserFromUsername,
  updateProfile,
  deleteUser
} = require('../services/users');
const { createUserMapper, updateUserMapper } = require('../mappers/users');
const { getCurrentUserSerializer } = require('../serializers/users');

exports.signUp = ({ body }, res, next) => {
  info(`Creating user with username: ${body.user_name}`);
  const userData = createUserMapper(body);
  return checkMethod(body)
    .then(password => createUser({ ...userData, password }))
    .then(() => res.status(201).end())
    .catch(next);
};

exports.login = ({ body }, res, next) => {
  info(`Login user with username: ${body.username}`);
  return login(body.username)
    .then(userInfo => res.status(200).send(userInfo))
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
  const userData = updateUserMapper(req.body);
  info(`Updating profile for user: ${req.username}`);
  return getUserFromUsername(req.username)
    .then(currentUser => updateProfile(currentUser, userData))
    .then(() => res.status(200).end())
    .catch(next);
};

exports.deleteUser = ({ params: { username } }, res, next) => {
  info(`Deleting user with username: ${username}`);
  return deleteUser(username)
    .then(() => res.status(200).end())
    .catch(next);
};
