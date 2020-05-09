const { info } = require('../logger');
const { createAdminMapper } = require('../mappers/admins');
const { createAdmin } = require('../services/admins');
const { encryptPassword } = require('../services/bcrypt');

exports.signUpAdmin = ({ body }, res, next) => {
  info(`Creating admin with email: ${body.email}`);
  const adminData = createAdminMapper(body);
  return encryptPassword(adminData.password)
    .then(password => createAdmin({ ...adminData, password }))
    .then(() => {
      res.status(201).end();
    })
    .catch(err => next(err));
};
