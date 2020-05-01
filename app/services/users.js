const { User } = require('../models');
const { info, error } = require('../logger');
const { databaseError } = require('../errors');

exports.createUser = userData => {
  info(`Creating user with data: ${userData}`);
  return User.create(userData).catch(dbError => {
    error(`User could not be created. Error: ${dbError}`);
    throw databaseError(`User could not be created. Error: ${dbError}`);
  });
};
