const { info } = require('../logger');
const { createAdminMapper } = require('../mappers/admins');
const { createAdmin, loginAdmin, getUsers } = require('../services/admins');
const { encryptPassword } = require('../services/bcrypt');
const { getCurrentUserSerializer } = require('../serializers/users');

exports.signUpAdmin = ({ body }, res, next) => {
  info(`Creating admin with email: ${body.email}`);
  const adminData = createAdminMapper(body);
  return encryptPassword(adminData.password)
    .then(password => createAdmin({ ...adminData, password }))
    .then(() => res.status(201).end())
    .catch(err => next(err));
};

exports.loginAdmin = ({ body }, res, next) => {
  info(`Login admin with email: ${body.email}`);
  return loginAdmin(body)
    .then(token => res.status(200).send({ token }))
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  info('Getting users');
  return getUsers()
    .then(users => res.status(200).send(users.map(user => getCurrentUserSerializer(user))))
    .catch(next);
};
