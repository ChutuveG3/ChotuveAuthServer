const { Op } = require('sequelize');
const { User } = require('../models');
const { info, error } = require('../logger');
const { databaseError, userEmailAlreadyExists, userNameAlreadyExists } = require('../errors');

exports.createUser = userData => {
  info(`Creating user with data: ${userData}`);
  return User.findOne({ [Op.or]: [{ userName: userData.userName }, { email: userData.email }] })
    .catch(dbError => {
      error(`User could not be created. Error: ${dbError}`);
      throw databaseError(`User could not be created. Error: ${dbError}`);
    })
    .then(user => {
      if (user) {
        if (user.email === userData.email) {
          throw userEmailAlreadyExists('User could not be created. User with that email already exists');
        } else {
          throw userNameAlreadyExists('User could not be created. User with that username already exists');
        }
      }
      return User.create(userData).catch(dbError => {
        error(`User could not be created. Error: ${dbError}`);
        throw databaseError(`User could not be created. Error: ${dbError}`);
      });
    });
};
