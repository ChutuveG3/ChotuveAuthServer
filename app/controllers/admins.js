const { info } = require('../logger');
const { createAdminMapper } = require('../mappers/admins');
const { createAdmin } = require('../models/admin');

exports.signUpAdmin = ({ body }, res, next) => {
  info(`Creating admin with info: ${body}`);
  return createAdmin(createAdminMapper(body))
    .then(() => {
      res.status(201).end();
    })
    .catch(err => next(err));
};
