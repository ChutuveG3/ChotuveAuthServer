const { Op } = require('sequelize');
const { Admin } = require('../models');
const { info, error } = require('../logger');
const { databaseError, adminEmailAlreadyExists, adminUserNameAlreadyExists } = require('../errors');

exports.createAdmin = adminData => {
  info(`Creating admin with data: ${adminData}`);
  return Admin.findOne({ where: { [Op.or]: [{ userName: adminData.userName }, { email: adminData.email }] } })
    .catch(dbError => {
      error(`Admin could not be created. Error: ${dbError}`);
      throw databaseError(`Admin could not be created. Error: ${dbError}`);
    })
    .then(admin => {
      if (admin) {
        if (admin.email === adminData.email) {
          throw adminEmailAlreadyExists('Admin could not be created. Admin with that email already exists');
        } else {
          throw adminUserNameAlreadyExists(
            'Admin could not be created. Admin with that username already exists'
          );
        }
      }
      return Admin.create(adminData).catch(dbError => {
        error(`Admin could not be created. Error: ${dbError}`);
        throw databaseError(`Admin could not be created. Error: ${dbError}`);
      });
    });
};
