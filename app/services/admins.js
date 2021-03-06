const { Admin, User } = require('../models');
const { info, error } = require('../logger');
const { databaseError, adminEmailAlreadyExists, jwtError, adminNotExists } = require('../errors');
const { generateToken } = require('../services/jwt');

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
  return Admin.findOne({ where: { email } })
    .catch(dbError => {
      error(`Could not get admin. Error: ${dbError}`);
      throw databaseError(`Could not get admin. Error: ${dbError}`);
    })
    .then(admin => {
      if (!admin) throw adminNotExists('Admin with that email does not exist');
      return admin;
    });
};

exports.loginAdmin = adminData => {
  info(`Getting session token for admin with email: ${adminData.email}`);
  const token = generateToken({ data: adminData.email, privilege: true });
  if (!token) throw jwtError('Token could not be created');
  return Promise.resolve(token);
};

exports.getUsers = () =>
  User.findAll().catch(dbError => {
    error(`Could not get users. Error: ${dbError}`);
    throw databaseError(`Could not get users. Error: ${dbError}`);
  });
