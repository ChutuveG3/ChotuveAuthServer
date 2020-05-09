const { Admin } = require('../models');
const { info, error } = require('../logger');
const { databaseError, adminEmailAlreadyExists } = require('../errors');

exports.createAdmin = adminData => {
  info(`Creating admin in db with email: ${adminData.email}`);
  return Admin.findOne({ where: { email: adminData.email } })
    .catch(dbError => {
      error(`Admin could not be created. Error: ${dbError}`);
      throw databaseError(`Admin could not be created. Error: ${dbError}`);
    })
    .then(admin => {
      if (admin) {
        throw adminEmailAlreadyExists('Admin could not be created. Admin with that email already exists');
      }
      return Admin.create(adminData).catch(dbError => {
        error(`Admin could not be created. Error: ${dbError}`);
        throw databaseError(`Admin could not be created. Error: ${dbError}`);
      });
    });
};
