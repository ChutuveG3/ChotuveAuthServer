const Chance = require('chance');
const moment = require('moment');
const { RecoveryToken } = require('../models');
const { RECOVERY_TOKEN_LENGTH } = require('../utils/constants');
const { error } = require('../logger');
const { databaseError, invalidRecoveryToken } = require('../errors');

const chance = new Chance();

exports.createRecoveryTokenByUsername = username => {
  const token = chance.string({ length: RECOVERY_TOKEN_LENGTH, alpha: true, numeric: true });
  return RecoveryToken.create({ username, recoveryToken: token })
    .then(recoveryToken => recoveryToken.recoveryToken)
    .catch(dbError => {
      error(`Recovery token could not be created. Error: ${dbError}`);
      throw databaseError(`Recovery token could not be created. Error: ${dbError}`);
    });
};

exports.getUsernameFromRecoveryToken = token =>
  RecoveryToken.findOne({ where: { recoveryToken: token } })
    .then(recoveryToken => {
      if (!recoveryToken) {
        error('Recovery token is invalid');
        throw invalidRecoveryToken('Recovery token is invalid');
      }
      if (!moment(recoveryToken.createdAt).isAfter(moment().subtract(1, 'hours'))) {
        error('Recovery token has expired.');
        throw invalidRecoveryToken('Recovery token has expired.');
      }
      return recoveryToken.username;
    })
    .catch(dbError => {
      error(`Could not get username from recovery token. Error: ${dbError}`);
      throw databaseError(`Could not get username from recovery token. Error: ${dbError}`);
    });
