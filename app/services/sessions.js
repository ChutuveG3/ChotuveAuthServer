const Chance = require('chance');

const { RecoveryToken } = require('../models');
const { RECOVERY_TOKEN_LENGTH } = require('../utils/constants');
const { error } = require('../logger');
const { databaseError } = require('../errors');

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
