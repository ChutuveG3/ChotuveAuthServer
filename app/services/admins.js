const { Admin } = require('../models');
const { info, error } = require('../logger');
const { databaseError, adminEmailAlreadyExists, jwtError } = require('../errors');
const { generateTokenFromEmail } = require('../services/jwt');

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

exports.getAdminFromEmail = email => {
  info(`Getting admin with email: ${email}`);
  return Admin.findOne({ where: { email } }).catch(dbError => {
    error(`Could not get admin. Error: ${dbError}`);
    throw databaseError(`Could not get admin. Error: ${dbError}`);
  });
};

exports.loginAdmin = adminData => {
  info(`Getting session token for admin with email: ${adminData.email}`);
  const token = generateTokenFromEmail({ email: adminData.email });
  if (!token) throw jwtError('Token could not be created');
  return Promise.resolve(token);
};
