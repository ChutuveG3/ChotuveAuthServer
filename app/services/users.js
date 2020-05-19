const { Op } = require('sequelize');
const { User } = require('../models');
const { info, error } = require('../logger');
const { databaseError, userEmailAlreadyExists, userNameAlreadyExists, jwtError } = require('../errors');
const { generateTokenFromEmail } = require('../services/jwt');
const { userNotExists } = require('../errors');

exports.createUser = userData => {
  info(`Creating user in db with email: ${userData.email}`);
  return User.findOne({ where: { [Op.or]: [{ userName: userData.userName }, { email: userData.email }] } })
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

exports.login = userData => {
  info(`Getting session token for user with email: ${userData.email}`);
  const token = generateTokenFromEmail({ email: userData.email });
  if (!token) throw jwtError('Token could not be created');
  return Promise.resolve(token);
};

exports.getUserFromEmail = email => {
  info(`Getting user with with email: ${email} `);
  return User.findOne({ where: { email } })
    .catch(dbError => {
      error(`Could not get user. Error: ${dbError}`);
      throw databaseError(`Could not get user. Error: ${dbError}`);
    })
    .then(user => {
      if (!user) throw userNotExists(`Could not found user with email: ${email}`);
      return user;
    });
};
