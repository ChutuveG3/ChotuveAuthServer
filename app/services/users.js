const { Op } = require('sequelize');
const { User } = require('../models');
const { info, error } = require('../logger');
const { databaseError, userEmailAlreadyExists, userNameAlreadyExists, jwtError } = require('../errors');
const { generateTokenFromUsername } = require('../services/jwt');
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
  const token = generateTokenFromUsername({ username: userData.username });
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

exports.getUserFromUsername = username => {
  info(`Getting user with with username: ${username}`);
  return User.findOne({ where: { userName: username } })
    .catch(dbError => {
      error(`Could not get user. Error: ${dbError}`);
      throw databaseError(`Could not get user. Error: ${dbError}`);
    })
    .then(user => {
      if (!user) throw userNotExists(`Could not found user with username: ${username}`);
      return user;
    });
};

exports.updateProfile = (currentUser, userData) =>
  User.findOne({ where: { email: userData.email } })
    .catch(dbError => {
      error(`Could not get user. Error: ${dbError}`);
      throw databaseError(`Could not get user. Error: ${dbError}`);
    })
    .then(user => {
      if (user && user.userName !== currentUser.userName) {
        throw userEmailAlreadyExists('User could not be updated. User with that email already exists');
      }
      info('Updating user profile');
      currentUser.firstName = userData.firstName;
      currentUser.lastName = userData.lastName;
      currentUser.email = userData.email;
      currentUser.birthdate = userData.birthdate;
      return currentUser.save().catch(dbError => {
        error(`Could not update user. Error: ${dbError}`);
        throw databaseError(`Could not update user. Error: ${dbError}`);
      });
    });
